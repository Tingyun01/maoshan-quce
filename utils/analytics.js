/**
 * analytics.js — 数据埋点系统
 *
 * 用法：
 *   const analytics = require('../../utils/analytics');
 *   analytics.track('test_complete', { testId: 'wu_xing', type: 'jin' });
 *
 * 事件列表：
 *   app_open          — 小程序启动
 *   test_start        — 开始测试
 *   test_complete     — 完成测试
 *   test_retake       — 重新测试
 *   adventure_start   — 进入场景冒险
 *   share             — 分享结果
 *   ad_watch          — 看激励广告
 *   ad_result         — 广告结果（成功/跳过）
 *   quota_exhausted   — 配额用尽
 *   ai_unlock         — 解锁AI分析
 *   fortune_claim     — 领取运势
 *   poster_generate   — 生成海报
 *   guide_open        — 打开导览图
 *   achievement_unlock — 解锁成就
 *   pv                — 页面访问
 */

const DB_NAME = 'analytics_events';

let _queued = [];       // 待发送事件队列
let _flushing = false;  // 正在发送中
let _openid = '';       // 用户openid（异步获取）
let _sessionId = '';    // 会话id

/** 初始化埋点系统 */
function init() {
  _sessionId = 'sess_' + Date.now() + '_' + Math.random().toString(36).slice(2, 8);
  // 异步获取openid
  try {
    wx.cloud.callFunction({ name: 'login' }).then(res => {
      if (res.result && res.result.openid) _openid = res.result.openid;
    }).catch(() => {});
  } catch (e) {}
}

/**
 * 记录事件
 * @param {string} event - 事件名称
 * @param {object} extra - 附加数据
 */
function track(event, extra = {}) {
  const evt = {
    event,
    _openid: _openid,
    _sessionId: _sessionId,
    _page: _getCurrentPage(),
    _ts: Date.now(),
    _date: _getDateStr(),
    ...extra
  };

  // 加入队列
  _queued.push(evt);

  // 同时写入本地log（调试/兜底）
  _writeLocalLog(evt);

  // 队列积攒到5条或每30秒发送一次
  if (_queued.length >= 5) {
    _flush();
  } else if (!_flushing) {
    setTimeout(() => _flush(), 30000);
  }
}

/** 立即发送所有待发送事件 */
function flush() {
  if (_queued.length > 0) _flush();
}

function _flush() {
  if (_flushing || _queued.length === 0) return;
  _flushing = true;
  const batch = _queued.splice(0);
  try {
    wx.cloud.callFunction({
      name: 'logAnalytics',
      data: { events: batch }
    }).then(res => {
      if (!res.result || !res.result.ok) {
        // 云函数发送失败，存到本地下次再发
        _saveToLocal(batch);
      }
    }).catch(() => {
      _saveToLocal(batch);
    }).finally(() => {
      _flushing = false;
      if (_queued.length >= 5) _flush();
    });
  } catch (e) {
    _saveToLocal(batch);
    _flushing = false;
  }
}

/** 获取当前页面路径 */
function _getCurrentPage() {
  try {
    const pages = getCurrentPages();
    if (pages.length > 0) {
      const route = pages[pages.length - 1].route || '';
      return route.replace('pages/', '').replace('/', '.');
    }
  } catch (e) {}
  return 'unknown';
}

function _getDateStr() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
}

/** 写入本地日志 */
function _writeLocalLog(evt) {
  try {
    const logs = wx.getStorageSync('analytics_log') || [];
    logs.push({ event: evt.event, ts: evt._ts, extra: Object.keys(evt).filter(k => !k.startsWith('_')).reduce((o, k) => (o[k]=evt[k], o), {}) });
    if (logs.length > 500) logs.splice(0, logs.length - 500);
    wx.setStorageSync('analytics_log', logs);
  } catch (e) {}
}

/** 云函数发送失败时，存到本地存储兜底 */
function _saveToLocal(batch) {
  try {
    const backlog = wx.getStorageSync('analytics_backlog') || [];
    backlog.push(...batch);
    if (backlog.length > 1000) backlog.splice(0, backlog.length - 1000);
    wx.setStorageSync('analytics_backlog', backlog);
  } catch (e) {}
}

/**
 * 获取本地统计数据（快速查看）
 * @returns {object} { today_events, top_events, ... }
 */
function getLocalStats() {
  try {
    const logs = wx.getStorageSync('analytics_log') || [];
    const today = _getDateStr();
    const todayLogs = logs.filter(l => {
      const d = new Date(l.ts);
      const ds = `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
      return ds === today;
    });
    const eventCount = {};
    todayLogs.forEach(l => { eventCount[l.event] = (eventCount[l.event] || 0) + 1; });
    return {
      total: logs.length,
      today: todayLogs.length,
      events: eventCount
    };
  } catch (e) {
    return { total: 0, today: 0, events: {} };
  }
}

module.exports = { init, track, flush, getLocalStats };
