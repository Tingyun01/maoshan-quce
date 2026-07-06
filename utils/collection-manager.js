/**
 * collection-manager.js — 图鉴收藏系统
 *
 * 利用云存储中已有的69张结果图片构建收藏体系
 * 用户首次测出某个结果后自动解锁对应图鉴卡
 *
 * 存储结构：
 *   collection_data = {
 *     unlocked: ['testId.typeCode', ...],  // 已解锁的收藏项
 *     unlockedCount: number,
 *     totalCount: number,
 *     lastUpdate: timestamp
 *   }
 */

const STORAGE_KEY = 'quce_collection';
const app = getApp();

// 图鉴目录：从 poster-images.js + card-images.js 推导出所有可收藏项
// 优先使用新版卡片图（更精美），没有则降级使用旧海报图
function buildCatalog() {
  const catalog = [];
  try {
    const POSTER_IMAGES = require('../config/poster-images');
    const CARD_IMAGES = require('../config/card-images').CARD_IMAGES;
    // 题库配置名称映射
    const testNameMap = {
      'immortal': '神仙转世', 'immortal_cluster': '群仙谱', 'past_life': '前世今生',
      'guardian_beast': '守护神兽', 'ancient_id': '古代身份', 'spiritual_root': '灵根测试',
      'hidden_talent': '隐藏天赋', 'love_portrait': '桃花缘', 'wu_xing': '五行人格',
      'mbti_simple': '思维偏好', 'animal_personality': '动物灵兽', 'stress_test': '心境测试',
      'xiuxian': '修仙资质'
    };
    // 各测试结果类型的显示名映射
    const typeNameHints = {
      'immortal': { caishen: '财神', taibai: '太白金星', tudi: '土地公公', zhongkui: '钟馗天师', nezha: '莲花童子', yueLao: '月老' },
      'past_life': { maoying: '大茅君·茅盈', gehong: '抱朴子·葛洪', hongjing: '山中宰相·陶弘景', wangyuan: '守道真人·王远知' },
      'guardian_beast': { dragon: '神龙', phoenix: '凤凰', qilin: '麒麟', tiger: '白虎' },
      'ancient_id': { general: '将军', merchant: '富商', scholar: '文人', hero: '侠客' },
      'immortal_cluster': { sword_immortal: '白衣剑仙', talisman_master: '神秘符师', free_immortal: '逍遥真仙', spirit_tamer: '御灵仙师' },
      'spiritual_root': { tianling: '天灵根', dipin: '地灵根', bianyiling: '变异灵根', wuling: '无灵根' },
      'hidden_talent': { fly: '飞行之能', foresee: '预知未来', heal: '治愈之手', strength: '神力天生' },
      'love_portrait': { rationalist: '理性恋人', romantic: '浪漫恋人', guardian: '守护恋人', gentle: '温柔恋人' },
      'wu_xing': { jin: '金型人格', mu: '木型人格', shui: '水型人格', huo: '火型人格', tu: '土型人格' },
      'animal_personality': { lion: '雄狮之王', wolf: '孤狼之魂', dolphin: '海豚精灵', cat: '黑猫精灵', bear: '棕熊大哥', deer: '灵鹿之姿' },
      'stress_test': { good: '云淡风轻', mild: '午后微云', moderate: '乌云渐浓', high: '暴雨将至' },
      'xiuxian': { tian: '天品仙资', di: '地品仙资', fan: '凡品仙资', za: '杂品仙资' },
      'mbti_simple': {
        INTJ: '建筑师', INTP: '逻辑学家', ENTJ: '指挥官', ENTP: '辩论家',
        INFJ: '提倡者', INFP: '调停者', ENFJ: '主人公', ENFP: '竞选者',
        ISTJ: '物流师', ISFJ: '守卫者', ESTJ: '总经理', ESFJ: '执政官',
        ISTP: '鉴赏家', ISFP: '探险家', ESTP: '企业家', ESFP: '表演者'
      }
    };

    Object.keys(POSTER_IMAGES).forEach(testId => {
      const testName = testNameMap[testId] || testId;
      const typeNames = typeNameHints[testId] || {};
      Object.keys(POSTER_IMAGES[testId]).forEach(typeCode => {
        const typeName = typeNames[typeCode] || typeCode;
        catalog.push({
          key: testId + '.' + typeCode,
          testId,
          typeCode,
          testName,
          typeName,
          imagePath: CARD_IMAGES[testId]?.[typeCode] || POSTER_IMAGES[testId][typeCode],
          cardImage: CARD_IMAGES[testId]?.[typeCode] || '',
          unlocked: false,
          unlockTime: 0
        });
      });
    });
  } catch (e) {
    console.warn('[collection] 生成目录失败:', e);
  }
  return catalog;
}

/** 获取全量图鉴目录 */
let _catalogCache = null;
function getCatalog() {
  if (!_catalogCache) _catalogCache = buildCatalog();
  return _catalogCache;
}

/** 获取图鉴统计 */
function getStats() {
  const data = loadData();
  const catalog = getCatalog();
  return {
    unlocked: data.unlocked.size,
    total: catalog.length,
    percent: catalog.length > 0 ? Math.round(data.unlocked.size / catalog.length * 100) : 0
  };
}

/** 获取带解锁状态的完整图鉴列表（按测试分组） */
function getGroupedCatalog() {
  const data = loadData();
  const catalog = getCatalog();
  const groups = {};
  catalog.forEach(item => {
    const isUnlocked = data.unlocked.has(item.key);
    if (!groups[item.testId]) {
      groups[item.testId] = {
        testId: item.testId,
        testName: item.testName,
        items: [],
        unlockedCount: 0,
        totalCount: 0
      };
    }
    groups[item.testId].items.push({
      ...item,
      unlocked: isUnlocked,
      unlockTime: data.unlockTimes[item.key] || 0
    });
    groups[item.testId].totalCount++;
    if (isUnlocked) groups[item.testId].unlockedCount++;
  });
  return Object.values(groups).sort((a, b) => b.unlockedCount / b.totalCount - a.unlockedCount / a.totalCount);
}

/** 加载收藏数据 */
function loadData() {
  try {
    const raw = wx.getStorageSync(STORAGE_KEY);
    if (raw) {
      return {
        unlocked: new Set(raw.unlocked || []),
        unlockTimes: raw.unlockTimes || {},
        firstTime: raw.firstTime || false
      };
    }
  } catch (e) {}
  return initData();
}

function initData() {
  const data = {
    unlocked: new Set(),
    unlockTimes: {},
    firstTime: true
  };
  saveData(data);
  return data;
}

function saveData(data) {
  try {
    wx.setStorageSync(STORAGE_KEY, {
      unlocked: Array.from(data.unlocked),
      unlockTimes: data.unlockTimes,
      firstTime: data.firstTime
    });
  } catch (e) {}
}

/**
 * 解锁一个新的收藏项
 * @param {string} testId - 测试ID
 * @param {string} typeCode - 结果类型码
 * @param {string} typeName - 结果名称
 * @returns {boolean} 是否是新解锁
 */
function unlock(testId, typeCode, typeName) {
  const data = loadData();
  const key = testId + '.' + typeCode;
  if (data.unlocked.has(key)) return false; // 已解锁过

  data.unlocked.add(key);
  data.unlockTimes[key] = Date.now();
  saveData(data);

  // 弹通知（延迟避免覆盖主流程提示）
  setTimeout(() => {
    wx.showToast({
      title: `🌟 图鉴解锁：${typeName || key}`,
      icon: 'none',
      duration: 2000
    });
  }, 1200);

  return true;
}

/** 检查某个结果是否已解锁 */
function isUnlocked(testId, typeCode) {
  const data = loadData();
  return data.unlocked.has(testId + '.' + typeCode);
}

/** 批量导入已有历史记录的收藏（用于第一次上线时导入） */
function importHistory() {
  const data = loadData();
  if (!data.firstTime) return 0;
  let imported = 0;
  try {
    const history = wx.getStorageSync('testHistory') || [];
    history.forEach(h => {
      if (h.testId && h.type && h.type !== 'random') {
        const key = h.testId + '.' + h.type;
        if (!data.unlocked.has(key)) {
          data.unlocked.add(key);
          data.unlockTimes[key] = h.time || Date.now();
          imported++;
        }
      }
    });
    if (imported > 0) {
      data.firstTime = false;
      saveData(data);
      console.log('[collection] 从历史记录导入', imported, '项收藏');
    } else {
      data.firstTime = false;
      saveData(data);
    }
  } catch (e) {}
  return imported;
}

module.exports = {
  getCatalog,
  getStats,
  getGroupedCatalog,
  unlock,
  isUnlocked,
  importHistory
};
