/**
 * ai-cost-manager.js — AI调用成本管理系统 v1.0
 * 
 * 核心策略：
 *   每日预算内 → 调用真AI（腾讯混元等）
 *   预算用尽 → 自动降级为本地模板AI（伪AI）
 *   支持成长计划免费token + 广告收入覆盖成本
 * 
 * 成本预估：
 *   每次AI调用约 500-800 token（输入+输出）
 *   成长计划送1亿token → 可支撑 12-20万次真AI调用
 *   日均活跃用户 < 3000 时完全免费，超量后广告收入覆盖
 */

const STORAGE_KEY = 'ai_cost_v1';

// ===== 成本配置（上线后可从云端热更新） =====
const CONFIG = {
  dailyBudget: 50000,           // 每日token预算（保守值，实际可调高）
  monthlyBudget: 1500000,       // 月度token预算
  costPerRequest: 600,           // 单次AI调用预估token消耗
  enableRealAI: true,            // 全局开关
  fallbackThreshold: 0.88,       // 用量达88%开始概率降级
  degradeProbStart: 0.15,        // 初始降级概率（88%时）
  degradeProbEnd: 0.70,          // 最终降级概率（99%时）
};

// ===== 工具函数 =====
function getToday() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}
function getMonth() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
}

// ===== 数据读写 =====
function getData() {
  try {
    const raw = wx.getStorageSync(STORAGE_KEY);
    if (raw && typeof raw === 'object') return raw;
  } catch (e) { /* ignore */ }
  return null;
}

function initData() {
  const data = {
    dailyUsed: 0,
    monthlyUsed: 0,
    todayDate: getToday(),
    currentMonth: getMonth(),
    totalUsed: 0,
    requestCount: 0,         // 真AI调用次数
    fallbackCount: 0,        // 降级次数
    lastRequest: 0,
    dailyBudget: CONFIG.dailyBudget,
    enableRealAI: CONFIG.enableRealAI,
    apiConfigured: false,    // 云端API是否已配置
  };
  try {
    wx.setStorageSync(STORAGE_KEY, data);
  } catch (e) {
    console.warn('[AI-Cost] 初始化存储失败', e);
  }
  return data;
}

function saveData(data) {
  try {
    wx.setStorageSync(STORAGE_KEY, data);
  } catch (e) {
    console.warn('AI成本数据保存失败');
  }
}

// ===== 跨天/跨月重置 =====
function checkReset(data) {
  const today = getToday();
  const month = getMonth();
  let changed = false;

  if (data.todayDate !== today) {
    // 跨天：同步昨日数据到云端（异步）
    syncDailyToCloud(data);
    data.dailyUsed = 0;
    data.todayDate = today;
    changed = true;
  }

  if (data.currentMonth !== month) {
    data.monthlyUsed = 0;
    data.currentMonth = month;
    changed = true;
  }

  return changed;
}

// ===== 云端同步（异步，不阻塞） =====
function syncDailyToCloud(data) {
  try {
    const db = wx.cloud.database();
    db.collection('ai_usage').add({
      data: {
        date: data.todayDate,
        dailyUsed: data.dailyUsed,
        requestCount: data.requestCount,
        fallbackCount: data.fallbackCount,
        updateTime: Date.now(),
        _openid: '{openid}' // 云函数自动替换
      }
    }).catch(() => {});
  } catch (e) { /* 静默失败 */ }
}

// ===== 核心判断：是否使用真AI =====
function shouldUseRealAI() {
  let data = getData();
  if (!data) data = initData();
  const changed = checkReset(data);
  if (changed) saveData(data);

  // 云端API未配置 → 不能真AI
  if (!data.apiConfigured) {
    return {
      useReal: false,
      reason: 'AI引擎准备中（管理员正在配置）',
      dailyUsage: data.dailyUsed,
      budgetPct: 0,
      mode: 'no_api'
    };
  }

  // 全局开关关闭
  if (!data.enableRealAI && data.enableRealAI === false) {
    return {
      useReal: false,
      reason: 'AI服务维护中',
      dailyUsage: data.dailyUsed,
      budgetPct: 0,
      mode: 'disabled'
    };
  }

  // 预算用尽
  if (data.dailyUsed >= data.dailyBudget) {
    return {
      useReal: false,
      reason: '今日AI免费额度已用完，明天00:00刷新',
      dailyUsage: data.dailyUsed,
      budgetPct: 100,
      mode: 'budget_exceeded'
    };
  }

  // 月度预算用尽
  if (data.monthlyUsed >= CONFIG.monthlyBudget) {
    return {
      useReal: false,
      reason: '本月AI额度已用完',
      dailyUsage: data.dailyUsed,
      budgetPct: Math.round(data.dailyUsed / data.dailyBudget * 100),
      mode: 'monthly_exceeded'
    };
  }

  const dailyPct = data.dailyUsed / data.dailyBudget;

  // 接近上限 → 智能降级（逐步提高降级概率）
  if (dailyPct >= CONFIG.fallbackThreshold) {
    const range = 1 - CONFIG.fallbackThreshold;
    const progress = (dailyPct - CONFIG.fallbackThreshold) / range;
    const degradeProb = CONFIG.degradeProbStart + progress * (CONFIG.degradeProbEnd - CONFIG.degradeProbStart);

    if (Math.random() < degradeProb) {
      data.fallbackCount++;
      saveData(data);
      return {
        useReal: false,
        reason: 'AI引擎繁忙，使用离线加强版分析',
        dailyUsage: data.dailyUsed,
        budgetPct: Math.round(dailyPct * 100),
        mode: 'degraded'
      };
    }
  }

  // ✅ 使用真AI
  return {
    useReal: true,
    reason: '',
    dailyUsage: data.dailyUsed,
    budgetPct: Math.round(dailyPct * 100),
    mode: 'real_ai'
  };
}

// ===== 记录AI调用消耗 =====
function recordUsage(actualTokens) {
  let data = getData();
  if (!data) data = initData();
  checkReset(data);

  const cost = actualTokens || CONFIG.costPerRequest;
  data.dailyUsed += cost;
  data.monthlyUsed += cost;
  data.totalUsed += cost;
  data.requestCount++;
  data.lastRequest = Date.now();

  saveData(data);
}

// ===== 记录降级次数 =====
function recordFallback() {
  let data = getData();
  if (!data) data = initData();
  checkReset(data);

  data.fallbackCount++;
  saveData(data);
}

// ===== 获取使用统计（供管理后台展示） =====
function getStats() {
  let data = getData();
  if (!data) data = initData();
  checkReset(data);

  return {
    dailyUsed: data.dailyUsed,
    dailyBudget: data.dailyBudget,
    dailyPct: Math.round(data.dailyUsed / data.dailyBudget * 100),
    monthlyUsed: data.monthlyUsed,
    monthlyBudget: CONFIG.monthlyBudget,
    monthlyPct: Math.round(data.monthlyUsed / CONFIG.monthlyBudget * 100),
    totalRequests: data.requestCount,
    fallbackCount: data.fallbackCount,
    realAIRate: data.requestCount > 0 
      ? Math.round(data.requestCount / (data.requestCount + data.fallbackCount) * 100) 
      : 0,
    apiConfigured: data.apiConfigured,
    enableRealAI: data.enableRealAI,
  };
}

// ===== 更新 API 配置状态（云函数返回后调用） =====
function setApiConfigured(configured) {
  let data = getData();
  if (!data) data = initData();
  data.apiConfigured = !!configured;
  saveData(data);
}

// ===== 更新每日预算（从云端热更新） =====
function updateBudget(newDailyBudget) {
  let data = getData();
  if (!data) data = initData();
  if (newDailyBudget > 0) {
    data.dailyBudget = newDailyBudget;
    saveData(data);
  }
}

module.exports = {
  shouldUseRealAI,
  recordUsage,
  recordFallback,
  getStats,
  setApiConfigured,
  updateBudget,
};
