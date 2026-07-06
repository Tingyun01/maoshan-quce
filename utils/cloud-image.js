// ============================================================
// 云存储图片工具 — 将 cloud:// 路径转为临时 HTTPS 链接
// 通过云函数 getFileUrls 获取（管理员权限，解决 STORAGE_EXCEED_AUTHORITY）
// Canvas drawImage 需要真实的 http/https 链接，不能直接用 cloud://
// ============================================================

const CLOUD_PREFIX = 'cloud://';

/**
 * 调用云函数获取文件临时链接（每次最多50个）
 * @param {string[]} fileList - cloud:// 文件路径数组
 * @returns {Promise<{ok:boolean, files:Array}>}
 */
function callGetFileUrls(fileList) {
  return wx.cloud.callFunction({
    name: 'getFileUrls',
    data: { fileList }
  }).then(res => {
    if (res.result && res.result.ok) {
      return res.result;
    }
    console.error('[cloud-image] 云函数返回异常:', res.result);
    return { ok: false, files: [] };
  }).catch(err => {
    console.error('[cloud-image] 调用云函数失败:', err);
    // 降级：尝试客户端直接获取（部分用户可能有权限）
    return fallbackClientGetTemp(fileList);
  });
}

/** 客户端降级方案：当云函数不可用时直接调用 */
function fallbackClientGetTemp(fileList) {
  console.log('[cloud-image] 降级：客户端直接获取临时链接...');
  return wx.cloud.getTempFileURL({ fileList }).then(res => {
    console.log('[cloud-image] 客户端降级结果:', res.fileList ? res.fileList.length : 0, '个文件');
    return {
      ok: true,
      files: (res.fileList || []).map(f => ({
        fileID: f.fileID,
        tempFileURL: f.tempFileURL || '',
        status: f.status || 0,
        errMsg: f.errMsg || ''
      }))
    };
  }).catch(err2 => {
    console.error('[cloud-image] 客户端降级也失败:', err2);
    return { ok: false, files: [] };
  });
}

/**
 * 🩻 深度诊断：多路径搜索缺失文件
 * 在控制台调用：getApp().deepDiag()
 * 会用多种可能的路径变体去查，找出文件真正的存放位置
 */
function deepDiagnose() {
  var POSTER_IMAGES = require('../config/poster-images');
  var allPaths = [];
  var pathMap = {};
  
  Object.keys(POSTER_IMAGES).forEach(function(testId) {
    Object.keys(POSTER_IMAGES[testId]).forEach(function(type) {
      var p = POSTER_IMAGES[testId][type];
      if (p && p.indexOf(CLOUD_PREFIX) === 0) {
        if (!pathMap[p]) pathMap[p] = [];
        pathMap[p].push(testId + '.' + type);
        if (allPaths.indexOf(p) === -1) allPaths.push(p);
      }
    });
  });

  console.log('🩻 深度诊断：共', allPaths.length, '个文件，分', Math.ceil(allPaths.length / 50), '批检测...');

  var foundAll = [];
  var missingAll = [];
  var chunks = [];
  for (var i = 0; i < allPaths.length; i += 50) chunks.push(allPaths.slice(i, i + 50));
  
  var checkIdx = 0;
  function checkNextChunk() {
    if (checkIdx >= chunks.length) {
      // 全部检查完毕
      console.log('✅ 可达: ' + foundAll.length + ' 个');
      console.log('❌ 缺失: ' + missingAll.length + ' 个');
      missingAll.forEach(function(p) {
        console.log('   ' + p + ' → ' + (pathMap[p] || []).join(', '));
      });

      if (missingAll.length === 0) {
        console.log('🏁 全部文件就位，无需深度搜索');
        return;
      }

      // 对缺失文件生成备选路径
      console.log('\n🔍 用备选路径搜索 ' + missingAll.length + ' 个缺失文件...');
      var altChecks = [];
      missingAll.forEach(function(origPath) {
        var fileName = origPath.split('/').pop();
        var idx = origPath.lastIndexOf('/images/');
        if (idx === -1) return;
        var rootBase = origPath.substring(0, idx + 1); // .../cloudbase-xxx/
        var alts = [
          rootBase + fileName,
          rootBase + 'MBTI/' + fileName,
          rootBase + 'mbti/' + fileName,
          rootBase + 'images/mbti/' + fileName
        ];
        alts.forEach(function(alt) {
          if (alt !== origPath) altChecks.push({ orig: origPath, alt: alt });
        });
      });

      if (altChecks.length === 0) {
        console.log('🏁 无备选路径可测');
        return;
      }

      var uniqueAlts = [];
      altChecks.forEach(function(c) {
        if (uniqueAlts.indexOf(c.alt) === -1) uniqueAlts.push(c.alt);
      });

      var altChunks = [];
      for (var j = 0; j < uniqueAlts.length; j += 50) altChunks.push(uniqueAlts.slice(j, j + 50));

      var altIdx = 0;
      function checkAltChunk() {
        if (altIdx >= altChunks.length) {
          console.log('🏁 深度诊断完成');
          return;
        }
        callGetFileUrls(altChunks[altIdx]).then(function(res) {
          var foundAny = false;
          (res.files || []).forEach(function(f) {
            if (f.tempFileURL) {
              foundAny = true;
              console.log('🎯 找到: ' + f.fileID);
            }
          });
          if (!foundAny) console.log('   未命中');
          altIdx++;
          checkAltChunk();
        });
      }
      checkAltChunk();
      return;
    }

    callGetFileUrls(chunks[checkIdx]).then(function(res) {
      (res.files || []).forEach(function(f) {
        if (f.tempFileURL) foundAll.push(f.fileID);
        else missingAll.push(f.fileID);
      });
      checkIdx++;
      checkNextChunk();
    });
  }
  checkNextChunk();
}

// 懒加载缓存：一次调用批量获取，减少云函数调用次数
let batchCache = null;  // { [fileID]: tempFileURL }
let batchLoading = false;
let batchReady = false;
const readyCallbacks = [];

/**
 * 注册预加载完成回调（如已就绪则立即执行）
 */
function onPreloadReady(cb) {
  if (batchReady) { setTimeout(cb, 0); return; }
  readyCallbacks.push(cb);
}

function preloadBatch() {
  if (batchLoading) return;
  batchLoading = true;
  const POSTER_IMAGES = require('../config/poster-images');
  const allPaths = [];
  Object.values(POSTER_IMAGES).forEach(group => {
    Object.values(group).forEach(p => {
      if (p && p.startsWith(CLOUD_PREFIX) && !allPaths.includes(p)) {
        allPaths.push(p);
      }
    });
  });

  // 同时收集卡片背景图
  try {
    const cardBg = require('../config/card-backgrounds');
    if (cardBg && cardBg.cardBackgrounds) {
      Object.values(cardBg.cardBackgrounds).forEach(p => {
        if (p && p.startsWith(CLOUD_PREFIX) && !allPaths.includes(p)) {
          allPaths.push(p);
        }
      });
    }
  } catch (e) {
    console.warn('[cloud-image] 无法加载卡片背景配置:', e);
  }

  const run = (i) => {
    if (i >= allPaths.length) {
      batchLoading = false;
      batchReady = true;
      console.log('[cloud-image] 预加载完成，共', Object.keys(batchCache || {}).length, '个链接');
      // 触发所有就绪回调
      readyCallbacks.forEach(cb => { try { cb(); } catch (e) {} });
      readyCallbacks.length = 0;
      return;
    }
    const chunk = allPaths.slice(i, i + 50);
    callGetFileUrls(chunk).then(result => {
      if (!batchCache) batchCache = {};
      (result.files || []).forEach(f => {
        batchCache[f.fileID] = f.tempFileURL || '';
      });
      run(i + 50);
    });
  };

  batchCache = {};
  console.log('[cloud-image] 开始预加载', allPaths.length, '个云图片...');
  run(0);
}

/**
 * 诊断：批量检测 poster-images.js 中的文件在云存储是否存在
 * 在开发者工具控制台调用：getApp().diag()
 */
function diagnoseImages() {
  const POSTER_IMAGES = require('../config/poster-images');
  const allPaths = [];
  const pathMap = {}; // path -> [testId.type]
  Object.keys(POSTER_IMAGES).forEach(testId => {
    Object.keys(POSTER_IMAGES[testId]).forEach(type => {
      const p = POSTER_IMAGES[testId][type];
      if (p && p.startsWith(CLOUD_PREFIX)) {
        if (!pathMap[p]) pathMap[p] = [];
        pathMap[p].push(testId + '.' + type);
        if (allPaths.indexOf(p) === -1) allPaths.push(p);
      }
    });
  });

  console.log('🔍 云环境=', wx.cloud ? '已初始化' : '未初始化');
  console.log('🔍 开始诊断云存储图片，共', allPaths.length, '个唯一路径...');
  console.log('🔍 通过云函数 getFileUrls（管理员权限）检测...');

  // 分批（每次最多50个）
  const chunks = [];
  for (let i = 0; i < allPaths.length; i += 50) {
    chunks.push(allPaths.slice(i, i + 50));
  }

  const runBatch = (i) => {
    if (i >= chunks.length) {
      console.log('🏁 诊断完成');
      return;
    }
    callGetFileUrls(chunks[i]).then(result => {
      const found = [], missing = [];
      (result.files || []).forEach(entry => {
        const name = entry.fileID.replace(CLOUD_PREFIX + 'cloudbase-d1gyu646q859d40e1.636c-cloudbase-d1gyu646q859d40e1-1447170647/images/', '');
        if (entry.tempFileURL) {
          found.push({ name, uses: pathMap[entry.fileID] });
        } else {
          missing.push({ name, status: entry.status, err: entry.errMsg, uses: pathMap[entry.fileID] });
        }
      });
      if (found.length > 0) {
        console.log('✅ 可访问的文件 (' + found.length + '):');
        found.forEach(f => console.log('   ' + f.name + ' → ' + f.uses.join(', ')));
      }
      if (missing.length > 0) {
        console.warn('❌ 不可达的文件 (' + missing.length + '):');
        missing.forEach(f => console.warn('   ' + f.name + ' | err=' + f.err + ' | 用途:' + f.uses.slice(0, 2).join(',')));
      }
      runBatch(i + 1);
    });
  };
  runBatch(0);
}

/**
 * 将 cloud:// 路径或普通路径转为可用于 canvas/image 的 URL
 * @param {string} path - 图片路径（cloud:// 或本地 /images/ 路径）
 * @returns {Promise<string>} 可用的图片 URL
 */
function resolveCloudUrl(path) {
  if (!path || typeof path !== 'string') return Promise.resolve('');
  
  if (!path.startsWith(CLOUD_PREFIX)) {
    return Promise.resolve(path);
  }

  // 优先从预加载缓存取
  if (batchCache && batchCache[path] !== undefined) {
    const url = batchCache[path];
    return Promise.resolve(url || '');
  }

  // 缓存未命中，单独请求
  return callGetFileUrls([path]).then(result => {
    const entry = (result.files || [])[0];
    if (entry && entry.tempFileURL) {
      // 加入缓存
      if (!batchCache) batchCache = {};
      batchCache[path] = entry.tempFileURL;
      return entry.tempFileURL;
    }
    console.warn('[cloud-image] 云文件不可达:', entry ? entry.errMsg : 'unknown');
    return '';
  });
}

/**
 * 触发预加载（在 app.onLaunch 中调用）
 */
function initPreload() {
  // 延迟一点避免阻塞启动
  setTimeout(() => preloadBatch(), 800);
}

/** 强力扫描 MBTI：大小写 + 前缀变体 */
function scanMbtiVariants() {
  var MBTI_TYPES = ['INTJ','INTP','ENTJ','ENTP','INFJ','INFP','ENFJ','ENFP','ISTJ','ISFJ','ESTJ','ESFJ','ISTP','ISFP','ESTP','ESFP'];
  var BASE = CLOUD_PREFIX + 'cloudbase-d1gyu646q859d40e1.636c-cloudbase-d1gyu646q859d40e1-1447170647/';
  
  var allVariants = [];
  MBTI_TYPES.forEach(function(type) {
    var lower = type.toLowerCase();
    // 所有可能的文件名变体
    var names = [
      'images/mbti-' + lower + '.jpg',   // mbti-intj.jpg
      'images/mbti-' + type + '.jpg',    // mbti-INTJ.jpg
      'images/MBTI-' + lower + '.jpg',   // MBTI-intj.jpg
      'images/MBTI-' + type + '.jpg',    // MBTI-INTJ.jpg
      'images/' + lower + '.jpg',        // intj.jpg
      'images/' + type + '.jpg',         // INTJ.jpg
    ];
    names.forEach(function(name) {
      allVariants.push({ type: type, path: BASE + name });
    });
  });

  // 去重
  var uniquePaths = [];
  var seen = {};
  allVariants.forEach(function(v) {
    if (!seen[v.path]) { seen[v.path] = true; uniquePaths.push(v.path); }
  });

  console.log('🔬 MBTI 强力扫描：' + uniquePaths.length + ' 种路径变体...');

  var foundMap = {}; // type -> found path
  var chunks = [];
  for (var i = 0; i < uniquePaths.length; i += 50) chunks.push(uniquePaths.slice(i, i + 50));

  var ci = 0;
  function scanNext() {
    if (ci >= chunks.length) {
      // 汇总
      console.log('\n========== 扫描结果 ==========');
      var found = 0, missing = 0;
      MBTI_TYPES.forEach(function(type) {
        if (foundMap[type]) {
          found++;
          console.log('✅ ' + type + ' → ' + foundMap[type].replace(BASE, ''));
        } else {
          missing++;
          console.log('❌ ' + type + ' — 所有变体均未找到');
        }
      });
      console.log('\n找到: ' + found + '/16  缺失: ' + missing + '/16');
      if (found === 16) {
        console.log('\n🎉 全部找到！以下是修正后的 poster-images.js 配置：');
        var objStr = '{\n';
        MBTI_TYPES.forEach(function(type) {
          var p = foundMap[type].replace(CLOUD_PREFIX + 'cloudbase-d1gyu646q859d40e1.636c-cloudbase-d1gyu646q859d40e1-1447170647/', '');
          objStr += '  ' + type + ': CLOUD_BASE + \'' + p + '\',\n';
        });
        objStr += '}';
        console.log(objStr);
      }
      return;
    }

    callGetFileUrls(chunks[ci]).then(function(res) {
      (res.files || []).forEach(function(f) {
        if (f.tempFileURL) {
          // 找对应的 type
          allVariants.forEach(function(v) {
            if (v.path === f.fileID) foundMap[v.type] = f.fileID;
          });
        }
      });
      ci++;
      scanNext();
    });
  }
  scanNext();
}

/** 扫描中文文件名：白衣谋士、帝王统帅等 */
function scanChineseNames() {
  var names = [
    '白衣谋士', '白衣诗人', '彩虹少年（女）', '帝王统帅',
    '官服执法者', '华服长者在山巅', '精壮匠人', '树下医者',
    '素衣女子', '屠龙少年', '戏服舞女', '巡夜甲士',
    '夜市花灯', '羽扇谋士', '长袍老者', '竹林画师'
  ];
  
  var BASE = CLOUD_PREFIX + 'cloudbase-d1gyu646q859d40e1.636c-cloudbase-d1gyu646q859d40e1-1447170647/images/';
  var paths = names.map(function(n) { return BASE + n + '.jpg'; });
  
  console.log('🔍 扫描中文文件名（' + names.length + ' 个）...');
  
  callGetFileUrls(paths).then(function(res) {
    var found = [], missing = [];
    (res.files || []).forEach(function(f) {
      if (f.tempFileURL) found.push(f.fileID);
      else missing.push(f.fileID);
    });
    console.log('✅ 找到: ' + found.length + '/' + names.length);
    found.forEach(function(p) { console.log('   ' + p); });
    if (missing.length > 0) {
      console.log('❌ 缺失: ' + missing.length);
      missing.forEach(function(p) { console.log('   ' + p); });
    }
  });
}

/**
 * 同步获取已缓存的临时 URL（仅在预加载完成后可用）
 * @param {string} cloudPath - cloud:// 路径
 * @returns {string} 临时 URL 或原路径
 */
function getResolvedUrl(cloudPath) {
  if (!cloudPath || !cloudPath.startsWith(CLOUD_PREFIX)) return cloudPath;
  if (batchCache && batchCache[cloudPath]) return batchCache[cloudPath];
  return cloudPath; // 预加载未完成时返回原路径
}

module.exports = { resolveCloudUrl, getResolvedUrl, diagnoseImages, deepDiagnose, scanMbtiVariants, scanChineseNames, initPreload, onPreloadReady };
