const MUTE_KEY = 'bgm_muted';
const VOLUME_KEY = 'bgm_volume';
const URL_CACHE_KEY = 'bgm_url_cache';

const CLOUD_BASE = 'cloud://cloudbase-d1gyu646q859d40e1.636c-cloudbase-d1gyu646q859d40e1-1447170647';

let _ctx = null;
let _currentTrack = '';
let _currentSrc = '';
let _muted = false;
let _volume = 0.25;
let _initialized = false;
let _pendingKey = null;
let _shouldAutoPlay = true;
let _playError = false;
let TRACKS = {};
let _discoveryDone = false;
let _urlCache = {};

function _getHttpsUrls(fileList) {
  return wx.cloud.callFunction({ name: 'getFileUrls', data: { fileList } })
    .then(res => res.result?.files || [])
    .catch(() => []);
}

function discoverTracks() {
  if (_discoveryDone) return Promise.resolve(TRACKS);
  const newTracks = {};
  for (let i = 1; i <= 23; i++) {
    const key = 'quiz' + i;
    const fileID = CLOUD_BASE + '/sounds/bgm_quiz_' + String(i).padStart(2, '0') + '.mp3';
    newTracks[key] = fileID;
    if (i <= 5) newTracks[['main','calm','result','album','guide'][i-1]] = fileID;
  }
  TRACKS = newTracks;
  _discoveryDone = true;
  return Promise.resolve(TRACKS);
}

function _init() {
  if (_initialized) return;
  try {
    _muted = wx.getStorageSync(MUTE_KEY) === true;
    _volume = wx.getStorageSync(VOLUME_KEY) || 0.25;
    const cached = wx.getStorageSync(URL_CACHE_KEY);
    if (cached && cached.expireTime > Date.now()) _urlCache = cached.map || {};
  } catch (e) {}
  _initialized = true;
  discoverTracks();
}

function _saveMuted() { try { wx.setStorageSync(MUTE_KEY, _muted); } catch (e) {} }
function _saveVolume() { try { wx.setStorageSync(VOLUME_KEY, _volume); } catch (e) {} }
function _saveUrlCache() { try { wx.setStorageSync(URL_CACHE_KEY, { map: _urlCache, expireTime: Date.now() + 100 * 60 * 1000 }); } catch (e) {} }

async function _resolveUrl(cloudFileID) {
  if (_urlCache[cloudFileID]) return _urlCache[cloudFileID];
  const files = await _getHttpsUrls([cloudFileID]);
  if (files[0]?.tempFileURL) { _urlCache[cloudFileID] = files[0].tempFileURL; _saveUrlCache(); return files[0].tempFileURL; }
  return null;
}

function _destroyCtx() {
  if (_ctx) { try { _ctx.stop(); } catch (e) {} try { _ctx.destroy(); } catch (e) {} _ctx = null; }
  _currentTrack = ''; _currentSrc = ''; _playError = false; _pendingKey = null;
}

function _createCtx(httpsUrl) {
  _destroyCtx();
  try {
    const ctx = wx.createInnerAudioContext({ useWebAudioImplement: false });
    ctx.autoplay = true; ctx.loop = true; ctx.volume = _muted ? 0 : _volume;
    ctx.src = httpsUrl;
    ctx.onCanplay(() => { if (_shouldAutoPlay) { try { ctx.play(); } catch (e) {} } });
    ctx.onError(() => { _playError = true; });
    ctx.onPlay(() => { _playError = false; });
    _ctx = ctx;
    return ctx;
  } catch (e) { _playError = true; return null; }
}

async function play(trackKey = 'main') {
  _shouldAutoPlay = true;
  _init();
  if (_muted) return false;
  await discoverTracks();
  const cloudFileID = TRACKS[trackKey] || TRACKS['main'] || Object.values(TRACKS)[0];
  if (!cloudFileID) return false;
  if (_ctx && _currentSrc === cloudFileID && !_ctx.paused) return true;
  if (_pendingKey === trackKey) return true;
  _pendingKey = trackKey;
  try {
    const url = await _resolveUrl(cloudFileID);
    if (!url) { _pendingKey = null; return false; }
    _currentTrack = trackKey; _currentSrc = cloudFileID;
    const ctx = _createCtx(url);
    if (!ctx) { _pendingKey = null; return false; }
    ctx.volume = _muted ? 0 : _volume;
    ctx.play(); _pendingKey = null; return true;
  } catch (err) { _pendingKey = null; _playError = true; return false; }
}

function pause() { _shouldAutoPlay = false; if (_ctx) { try { _ctx.pause(); } catch (e) {} } }
function resume() { _init(); if (_muted || !_ctx || !_currentSrc) return; _shouldAutoPlay = true; try { _ctx.volume = _volume; _ctx.play(); } catch (e) {} }
function stop() { _pendingKey = null; _destroyCtx(); }
function switchTrack(key) { stop(); play(key); }

function setMuted(m) { _init(); _muted = !!m; _saveMuted(); if (_ctx) { try { _ctx.volume = _muted ? 0 : _volume; } catch (e) {} } if (_muted) { try { _ctx?.pause(); } catch (e) {} } else if (_currentSrc) { try { _ctx?.play(); } catch (e) {} } }
function isMuted() { _init(); return _muted; }
function toggleMute() { _init(); const newMuted = !_muted; setMuted(newMuted); if (!newMuted) { if (!_ctx || !_currentSrc) play(); else if (_ctx.paused) { try { _ctx.play(); } catch (e) {} } } return newMuted; }
function setVolume(v) { _init(); _volume = Math.max(0, Math.min(1, v)); _saveVolume(); if (_ctx && !_muted) { try { _ctx.volume = _volume; } catch (e) {} } }
function getVolume() { _init(); return _volume; }
function isPlaying() { return !!_ctx && !_ctx.paused && !_muted && !!_currentSrc && !_playError; }

let _lastQuizKey = '';
function playRandomQuiz() {
  _init(); if (_muted) return;
  const keys = Object.keys(TRACKS).filter(k => k.startsWith('quiz'));
  if (keys.length === 0) return;
  const pool = keys.length > 1 ? keys.filter(k => k !== _lastQuizKey) : keys;
  const key = pool[Math.floor(Math.random() * pool.length)];
  play(key); _lastQuizKey = key;
}

module.exports = { play, pause, resume, stop, switchTrack, setMuted, isMuted, toggleMute, setVolume, getVolume, isPlaying, playRandomQuiz, discoverTracks, get Tracks() { return TRACKS; } };
