/**
 * quota-manager.js — 次数管理系统（新版）
 *
 * 规则（按产品定义文档）：
 * 1. 用户初始有 5 次免费测试次数
 * 2. 每 30 分钟恢复 1 次（上限不超过 5 次）
 * 3. 次数用完后弹出选择弹窗：
 *    - 可选 A：等待 30 分钟后恢复（倒计时显示）
 *    - 可选 B：看 30 秒激励广告 → 立即恢复 2 次
 *    - 可选 C：分享给 1 位好友 → 立即恢复 1 次
 * 4. 每天通过分享最多恢复 3 次（防滥用）
 * 5. 每天通过广告最多恢复 10 次
 * 6. 每日运势签到 → 领取 1 次（日限1次）
 */

const STORAGE_KEY = 'quota_data';

/** 获取今日日期字符串 YYYY-MM-DD */
function getTodayStr() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

/** 读取配额数据，不存在则初始化 */
function getQuota() {
  try {
    const raw = wx.getStorageSync(STORAGE_KEY);
    if (raw) return raw;
  } catch (e) { /* ignore */ }
  return null;
}

/** 初始化/重置配额数据 */
function initQuota() {
  const now = Date.now();
  const data = {
    total: 5,                       // 当前可用次数
    maxTotal: 5,                    // 自然恢复上限
    lastRecoverTime: now,            // 上次自然恢复时间
    todayShareCount: 0,             // 今日已通过分享恢复次数
    todayAdCount: 0,                // 今日已通过广告恢复次数
    todayFortuneCount: 0,           // 今日已领取运势奖励次数
    todayDate: getTodayStr(),
    shareDailyLimit: 3,             // 每日分享恢复上限
    adDailyLimit: 10,               // 每日广告恢复上限
    fortuneDailyLimit: 1,           // 每日运势奖励上限
    adRewardAmount: 2,              // 每次广告恢复次数
    shareRewardAmount: 1,            // 每次分享恢复次数
    fortuneRewardAmount: 1,          // 每次运势奖励次数
    recoverInterval: 30 * 60 * 1000, // 30分钟恢复间隔(ms)
    recoverAmount: 1,                // 每次自然恢复次数
    todayRandomTestCount: 0,         // 今日随机测试次数
    randomTestDailyLimit: 3          // 每日随机测试上限
  };
  wx.setStorageSync(STORAGE_KEY, data);
  return data;
}

/** 检查并重置每日计数（跨日重置） */
function checkDailyReset(data) {
  const today = getTodayStr();
  if (data.todayDate !== today) {
    data.todayShareCount = 0;
    data.todayAdCount = 0;
    data.todayFortuneCount = 0;
    data.todayRandomTestCount = 0;
    data.todayDate = today;
  }
  return data;
}

/** 处理自然恢复（每30分钟恢复1次，上限5次） */
function processRecovery(data) {
  const now = Date.now();
  const elapsed = now - data.lastRecoverTime;
  const intervals = Math.floor(elapsed / data.recoverInterval);
  if (intervals > 0) {
    const recovered = intervals * data.recoverAmount;
    data.total = Math.min(data.total + recovered, data.maxTotal);
    data.lastRecoverTime += intervals * data.recoverInterval;
  }
  return data;
}

/** 获取当前可用次数（含自然恢复计算） */
function getAvailableCount() {
  let data = getQuota();
  if (!data) {
    data = initQuota();
  }
  data = checkDailyReset(data);
  data = processRecovery(data);
  wx.setStorageSync(STORAGE_KEY, data);
  return data.total;
}

/** 消耗一次次数，返回是否成功 */
function consumeOne() {
  let data = getQuota();
  if (!data) {
    data = initQuota();
  }
  data = checkDailyReset(data);
  data = processRecovery(data);
  if (data.total <= 0) return false;
  data.total -= 1;
  wx.setStorageSync(STORAGE_KEY, data);
  return true;
}

/** 看广告恢复次数，返回 {success, msg, added, total} */
function rewardByAd() {
  let data = getQuota();
  if (!data) {
    data = initQuota();
  }
  data = checkDailyReset(data);
  if (data.todayAdCount >= data.adDailyLimit) {
    return { success: false, msg: '今日广告恢复已达上限' };
  }
  data.total += data.adRewardAmount;
  data.todayAdCount += 1;
  wx.setStorageSync(STORAGE_KEY, data);
  return { success: true, added: data.adRewardAmount, total: data.total };
}

/** 分享恢复次数，返回 {success, msg, added, total} */
function rewardByShare() {
  let data = getQuota();
  if (!data) {
    data = initQuota();
  }
  data = checkDailyReset(data);
  if (data.todayShareCount >= data.shareDailyLimit) {
    return { success: false, msg: '今日分享恢复已达上限' };
  }
  data.total += data.shareRewardAmount;
  data.todayShareCount += 1;
  wx.setStorageSync(STORAGE_KEY, data);
  return { success: true, added: data.shareRewardAmount, total: data.total };
}

/** 每日运势领取次数，返回 {success, msg, added, total} */
function rewardByFortune() {
  let data = getQuota();
  if (!data) {
    data = initQuota();
  }
  data = checkDailyReset(data);
  if (data.todayFortuneCount >= data.fortuneDailyLimit) {
    return { success: false, msg: '今日运势奖励已领取' };
  }
  data.total += data.fortuneRewardAmount;
  data.todayFortuneCount += 1;
  wx.setStorageSync(STORAGE_KEY, data);
  return { success: true, added: data.fortuneRewardAmount, total: data.total };
}

/** 获取下次自然恢复的剩余毫秒数 */
function getNextRecoverMs() {
  let data = getQuota();
  if (!data) {
    data = initQuota();
  }
  data = checkDailyReset(data);
  data = processRecovery(data);
  wx.setStorageSync(STORAGE_KEY, data);
  if (data.total >= data.maxTotal) return 0;
  const elapsed = Date.now() - data.lastRecoverTime;
  const remaining = data.recoverInterval - elapsed;
  return Math.max(0, remaining);
}

/** 获取完整的配额状态信息（供弹窗展示） */
function getStatus() {
  let data = getQuota();
  if (!data) {
    data = initQuota();
  }
  data = checkDailyReset(data);
  data = processRecovery(data);
  wx.setStorageSync(STORAGE_KEY, data);
  const nextMs = data.total >= data.maxTotal ? 0 : getNextRecoverMs();
  return {
    total: data.total,
    maxTotal: data.maxTotal,
    nextRecoverMs: nextMs,
    todayShareCount: data.todayShareCount,
    todayAdCount: data.todayAdCount,
    todayFortuneCount: data.todayFortuneCount,
    todayRandomTestCount: data.todayRandomTestCount,
    shareDailyLimit: data.shareDailyLimit,
    adDailyLimit: data.adDailyLimit,
    fortuneDailyLimit: data.fortuneDailyLimit,
    randomTestDailyLimit: data.randomTestDailyLimit,
    shareRemaining: data.shareDailyLimit - data.todayShareCount,
    adRemaining: data.adDailyLimit - data.todayAdCount,
    fortuneRemaining: data.fortuneDailyLimit - data.todayFortuneCount,
    randomTestRemaining: data.randomTestDailyLimit - data.todayRandomTestCount
  };
}

/** 随机测试消耗次数，返回 {success, msg} */
function consumeRandomTest() {
  let data = getQuota();
  if (!data) data = initQuota();
  data = checkDailyReset(data);
  if (data.todayRandomTestCount >= data.randomTestDailyLimit) {
    return { success: false, msg: '今日随机测试次数已用完' };
  }
  data.todayRandomTestCount += 1;
  wx.setStorageSync(STORAGE_KEY, data);
  return { success: true };
}

/** 获取随机测试剩余次数 */
function getRandomTestStatus() {
  let data = getQuota();
  if (!data) data = initQuota();
  data = checkDailyReset(data);
  return {
    remaining: data.randomTestDailyLimit - data.todayRandomTestCount,
    limit: data.randomTestDailyLimit
  };
}

/** 看广告重置随机测试计数（解锁3次）, 暴露给index.js */
function _resetRandomTest() {
  let data = getQuota();
  if (!data) data = initQuota();
  data = checkDailyReset(data);
  data.todayRandomTestCount = 0;
  wx.setStorageSync(STORAGE_KEY, data);
  return data;
}

module.exports = {
  getAvailableCount,
  consumeOne,
  rewardByAd,
  rewardByShare,
  rewardByFortune,
  consumeRandomTest,
  getRandomTestStatus,
  getNextRecoverMs,
  getStatus,
  initQuota,
  _resetRandomTest
};