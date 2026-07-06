// ============================================================
// 茅山趣测 · 音效引擎 v2
// 纯 Web Audio 代码合成，零文件零版权
// 特点：柔和、不突兀、有画面感
// ============================================================

let ctx = null;
let muted = false;

// 从存储读取静音状态
try {
  muted = wx.getStorageSync('audio_muted') === true;
} catch (e) {}

function _getCtx() {
  if (!ctx) {
    try { ctx = wx.createWebAudioContext(); } catch (e) { return null; }
  }
  return ctx;
}

function setMuted(m) {
  muted = m;
  try { wx.setStorageSync('audio_muted', m); } catch (e) {}
}
function isMuted() { return muted; }

// ---------- 基础音效工具 ----------
function _pluck(freq, type, volume = 0.08, when = 0, decay = 0.25) {
  if (muted) return;
  const c = _getCtx(); if (!c) return;
  const t = c.currentTime + when;
  const osc = c.createOscillator();
  const gain = c.createGain();
  osc.type = type;
  osc.frequency.setValueAtTime(freq, t);
  gain.gain.setValueAtTime(0, t);
  gain.gain.linearRampToValueAtTime(volume, t + 0.01);   // 柔和渐入
  gain.gain.exponentialRampToValueAtTime(0.001, t + decay);
  osc.connect(gain); gain.connect(c.destination);
  osc.start(t); osc.stop(t + decay);
}

// ---------- UI 音效 — 轻、短、不吓人 ----------
function playClick()    { _pluck(660, 'sine', 0.05, 0, 0.06); }
function playSelect()   { _pluck(784, 'sine', 0.06, 0, 0.1); setTimeout(() => { _pluck(1047, 'sine', 0.05, 0.06, 0.1); }, 70); }
function playFlip()     { _pluck(523, 'triangle', 0.05, 0, 0.08); }
function playBack()     { _pluck(392, 'sine', 0.04, 0, 0.06); }

// ---------- 事件音效 — 有画面感 ----------
// 入场：不再自动触发，只在首次加载时按需调用
function playEnter() {
  if (muted) return;
  const c = _getCtx(); if (!c) return;
  const t = c.currentTime;
  // 柔和的五声音阶琶音
  const notes = [523, 587, 659, 784, 880];
  notes.forEach((f, i) => {
    const osc = c.createOscillator();
    const gain = c.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(f, t + i * 0.15);
    gain.gain.setValueAtTime(0, t + i * 0.15);
    gain.gain.linearRampToValueAtTime(0.04, t + i * 0.15 + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.001, t + i * 0.15 + 0.4);
    osc.connect(gain); gain.connect(c.destination);
    osc.start(t + i * 0.15); osc.stop(t + i * 0.15 + 0.45);
  });
}

// 结果揭晓 — QQ斗地主风格的"当~"感觉
function playReveal() {
  if (muted) return;
  const c = _getCtx(); if (!c) return;
  const t = c.currentTime;
  // 带有"揭示感"的钟声和弦
  const chord = [
    { f: 261, delay: 0, dur: 2.5 },
    { f: 329, delay: 0.08, dur: 2.2 },
    { f: 392, delay: 0.16, dur: 2.0 },
    { f: 523, delay: 0.24, dur: 1.8 }
  ];
  chord.forEach(n => {
    // 基频 + 3个泛音，模拟钟声
    [1, 2, 3, 4].forEach(h => {
      const osc = c.createOscillator();
      const gain = c.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(n.f * h, t + n.delay);
      gain.gain.setValueAtTime(0, t + n.delay);
      gain.gain.linearRampToValueAtTime(0.03 / h, t + n.delay + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.001, t + n.delay + n.dur);
      osc.connect(gain); gain.connect(c.destination);
      osc.start(t + n.delay); osc.stop(t + n.delay + n.dur);
    });
  });
}

// 海报生成完成 — "揭开惊喜"的欢快感觉
function playComplete() {
  if (muted) return;
  const c = _getCtx(); if (!c) return;
  const t = c.currentTime;
  // 欢快的上行音阶 + 结尾高音
  const melody = [523, 659, 784, 1047];
  melody.forEach((f, i) => {
    const osc = c.createOscillator();
    const gain = c.createGain();
    osc.type = i === melody.length - 1 ? 'triangle' : 'sine';
    osc.frequency.setValueAtTime(f, t + i * 0.12);
    gain.gain.setValueAtTime(0, t + i * 0.12);
    gain.gain.linearRampToValueAtTime(i === melody.length - 1 ? 0.07 : 0.04, t + i * 0.12 + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.001, t + i * 0.12 + (i === melody.length - 1 ? 1.2 : 0.5));
    osc.connect(gain); gain.connect(c.destination);
    osc.start(t + i * 0.12); osc.stop(t + i * 0.12 + 1.5);
  });
}

// 稀有度高亮 — "叮铃铃"风铃
function playRare() {
  if (muted) return;
  const c = _getCtx(); if (!c) return;
  const t = c.currentTime;
  [1047, 1319, 1568, 1760, 2093].forEach((f, i) => {
    const osc = c.createOscillator();
    const gain = c.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(f, t + i * 0.1);
    gain.gain.setValueAtTime(0, t + i * 0.1);
    gain.gain.linearRampToValueAtTime(0.05, t + i * 0.1 + 0.01);
    gain.gain.exponentialRampToValueAtTime(0.001, t + i * 0.1 + 0.6);
    osc.connect(gain); gain.connect(c.destination);
    osc.start(t + i * 0.1); osc.stop(t + i * 0.1 + 0.65);
  });
}

// 错误/提示
function playAlert() { _pluck(392, 'triangle', 0.05, 0, 0.15); }

module.exports = {
  setMuted, isMuted,
  playClick, playSelect, playFlip,
  playEnter, playReveal, playComplete, playRare,
  playAlert, playBack
};
