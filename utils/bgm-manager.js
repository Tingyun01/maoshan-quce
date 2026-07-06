// ============================================================
// 茅山趣测 · 背景音乐管理器 v6
// 通过云函数 getFileUrls（admin权限）获取 HTTPS 临时链接
// InnerAudioContext 原生支持 HTTPS URL，无需 downloadFile
// 与 cloud-image.js 同样模式 —— 绕过客户端权限问题
// ============================================================

const MUTE_KEY = 'bgm_muted';
const VOLUME_KEY = 'bgm_volume';
const URL_CACHE_KEY = 'bgm_url_cache';

// 云存储
const CLOUD_PREFIX = 'cloud://cloudbase-d1gyu646q859d40e1.636c-cloudbase-d1gyu646q859d40e1-1447170647';

// 场景名
const SCENE_NAMES = ['main', 'calm', 'result', 'album', 'guide'];

// 状态
let _ctx = null;
let _currentTrack = '';
let _currentSrc = '';
let _muted = false;
let _volume = 0.25;
let _initialized = false;
let _pendingKey = null;
let _shouldAutoPlay = true;
let _playError = false;

// 音轨表: key → cloud://fileID
let TRACKS = {};
let _discoveryDone = false;

// HTTPS 临时链接缓存: cloudFileID → { url, expireTime }
let _urlCache = {};

/**
 * 调用 getFileUrls 云函数（服务端 admin 权限）获取 HTTPS 临时链接
 */
function _getHttpsUrls(fileList) {
  return wx.cloud.callFunction({
    name: 'getFileUrls',
    data: { fileList }
  }).then(res => {
    if (res.result && res.result.ok) {
      return res.result.files;
    }
    return [];
  }).catch(() => []);
}

// ===================== 音轨发现 =====================

function discoverTracks() {
  if (_discoveryDone) return Promise.resolve(TRACKS);
  const newTracks = {};
  for (let i = 1; i <= 23; i++) {
    const key = 'quiz' + i;
    const fileID = CLOUD_PREFIX + '/sounds/bgm_quiz_' + String(i).padStart(2, '0') + '.mp3';
    newTracks[key] = fileID;
    if (i <= SCENE_NAMES.length) {
      newTracks[SCENE_NAMES[i - 1]] = fileID;
    }
  }
  TRACKS = newTracks;
  _discoveryDone = true;
  return Promise.resolve(TRACKS);
}

function rediscover() { _discoveryDone = false; return discoverTracks(); }

// ===================== 初始化 =====================

function _init() {
  if (_initialized) return;
  try {
    _muted = wx.getStorageSync(MUTE_KEY) === true;
    _volume = wx.getStorageSync(VOLUME_KEY);
    if (!_volume || _volume <= 0 || _volume > 1) _volume = 0.25;
    const cachedUrls = wx.getStorageSync(URL_CACHE_KEY);
    if (cachedUrls && cachedUrls.expireTime > Date.now()) {
      _urlCache = cachedUrls.map || {};
    }
  } catch (e) {
    _muted = false;
    _volume = 0.25;
  }
  _initialized = true;
  discoverTracks();
}

function _saveMuted() { try { wx.setStorageSync(MUTE_KEY, _muted); } catch (e) {} }
function _saveVolume() { try { wx.setStorageSync(VOLUME_KEY, _volume); } catch (e) {} }
function _saveUrlCache() {
  try { wx.setStorageSync(URL_CACHE_KEY, { map: _urlCache, expireTime: Date.now() + 100 * 60 * 1000 }); } catch (e) {}
}

// ===================== 获取播放用的 HTTPS URL =====================

async function _resolveUrl(cloudFileID) {
  if (_urlCache[cloudFileID]) return _urlCache[cloudFileID];
  const files = await _getHttpsUrls([cloudFileID]);
  if (files.length > 0 && files[0].tempFileURL) {
    _urlCache[cloudFileID] = files[0].tempFileURL;
    _saveUrlCache();
    return files[0].tempFileURL;
  }
  return null;
}

async function _prefetchUrls(trackKeys) {
  const toFetch = [];
  trackKeys.forEach(key => {
    const fileID = TRACKS[key];
    if (fileID && !_urlCache[fileID]) toFetch.push({ key, fileID });
  });
  if (toFetch.length === 0) return;
  const fileList = toFetch.map(t => t.fileID);
  const files = await _getHttpsUrls(fileList);
  files.forEach((f, i) => { if (f.tempFileURL) _urlCache[fileList[i]] = f.tempFileURL; });
  _saveUrlCache();
}

// ===================== InnerAudioContext 管理 =====================

let _errorLogged = false;

function _destroyCtx() {
  if (_ctx) {
    try { _ctx.stop(); } catch (e) {}
    try { _ctx.destroy(); } catch (e) {}
    _ctx = null;
    _currentTrack = '';
    _currentSrc = '';
  }
  _playError = false;
  _pendingKey = null;
}

function _createCtx(httpsUrl) {
  _destroyCtx();
  _playError = false;
  try {
    const ctx = wx.createInnerAudioContext({ useWebAudioImplement: false });
    ctx.autoplay = true;
    ctx.loop = true;
    ctx.volume = _muted ? 0 : _volume;
    ctx.src = httpsUrl;

    ctx.onCanplay(() => {
      if (_shouldAutoPlay) {
        try { ctx.play(); } catch (e) {}
      }
    });

    ctx.onError(() => {
      _playError = true;
      if (!_errorLogged) {
        _errorLogged = true;
      }
    });

    ctx.onPlay(() => { _playError = false; });
    ctx.onEnded(() => { if (_shouldAutoPlay) { try { ctx.play(); } catch (e) {} } });

    _ctx = ctx;
    return ctx;
  } catch (e) {
    _playError = true;
    return null;
  }
}

// ===================== 播放控制 =====================

async function play(trackKey = 'main') {
  _shouldAutoPlay = true;
  _init();
  if (_muted) return false;
  await discoverTracks();
  const cloudFileID = TRACKS[trackKey];
  if (!cloudFileID) {
    const fallbackKey = TRACKS['main'] ? 'main' : Object.keys(TRACKS)[0];
    if (fallbackKey && TRACKS[fallbackKey]) return play(fallbackKey);
    return false;
  }
  return _playCloudFile(trackKey, cloudFileID);
}

async function _playCloudFile(trackKey, cloudFileID) {
  if (_ctx && _currentSrc === cloudFileID && !_ctx.paused) return true;
  if (_pendingKey === trackKey) return true;
  _pendingKey = trackKey;
  try {
    const httpsUrl = await _resolveUrl(cloudFileID);
    if (!httpsUrl) { _pendingKey = null; return false; }
    _currentTrack = trackKey;
    _currentSrc = cloudFileID;
    const ctx = _createCtx(httpsUrl);
    if (!ctx) { _pendingKey = null; _playError = true; return false; }
    ctx.volume = _muted ? 0 : _volume;
    ctx.play();
    _pendingKey = null;
    return true;
  } catch (err) {
    _pendingKey = null;
    _playError = true;
    return false;
  }
}

function pause() { _shouldAutoPlay = false; if (_ctx) { try { _ctx.pause(); } catch (e) {} } }

function resume() {
  _init();
  if (_muted || !_ctx || !_currentSrc) return;
  _shouldAutoPlay = true;
  try { _ctx.volume = _volume; _ctx.play(); } catch (e) {}
}

function stop() { _pendingKey = null; _destroyCtx(); }
function switchTrack(trackKey) { stop(); play(trackKey); }

// ===================== 音量 / 静音 =====================

function setMuted(m) {
  _init();
  _muted = !!m;
  _saveMuted();
  if (_ctx) { try { _ctx.volume = _muted ? 0 : _volume; } catch (e) {} }
  if (_muted) { try { _ctx?.pause(); } catch (e) {} }
  else if (_currentSrc) { try { _ctx?.play(); } catch (e) {} }
}

function isMuted() { _init(); return _muted; }

function toggleMute() {
  _init();
  const newMuted = !_muted;
  setMuted(newMuted);
  if (!newMuted) {
    if (!_ctx || !_currentSrc) { play(); }
    else if (_ctx.paused) { try { _ctx.play(); } catch (e) {} }
  }
  return newMuted;
}

function setVolume(v) {
  _init();
  _volume = Math.max(0, Math.min(1, v));
  _saveVolume();
  if (_ctx && !_muted) { try { _ctx.volume = _volume; } catch (e) {} }
}

function getVolume() { _init(); return _volume; }
function isPlaying() { return !!_ctx && !_ctx.paused && !_muted && !!_currentSrc && !_playError; }

// ===================== 随机播放 =====================

let _lastQuizKey = '';

function playRandomQuiz() {
  _init();
  if (_muted) return;
  const keys = Object.keys(TRACKS).filter(k => k.startsWith('quiz'));
  if (keys.length === 0) return;
  const pool = keys.length > 1 ? keys.filter(k => k !== _lastQuizKey) : keys;
  const key = pool[Math.floor(Math.random() * pool.length)];
  play(key);
  _lastQuizKey = key;
}

// ===================== 导出 =====================

module.exports = {
  play, pause, resume, stop, switchTrack,
  setMuted, isMuted, toggleMute,
  setVolume, getVolume,
  isPlaying, playRandomQuiz,
  discoverTracks, rediscover,
  _prefetchUrls,
  get Tracks() { return TRACKS; }
};