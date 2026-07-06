/**
 * viral-engine.js — 病毒式传播引擎 v1.0
 * 
 * 六大传播钩子：
 * 1. 分享挑战赛 — "你能比我更快吗？" 
 * 2. 稀有度排行 — "你测出了<1%的罕见结果！"
 * 3. 好友PK — 对比结果差异化
 * 4. 连续签到 — "连测3天解锁隐藏测试"
 * 5. 限量稀缺 — 限时节日测试
 * 6. 社交货币 — 自动生成发圈文案
 * 
 * 核心指标：K因子 > 1 即病毒式增长
 *   K = 每次分享带来的新用户数 × 分享率
 *   目标：每1个用户带来 ≥ 1.2 个新用户
 */

const STORAGE_KEY = 'viral_data_v1';
const analytics = require('./analytics');

// ===== 数据管理 =====
function getData() {
  try {
    const raw = wx.getStorageSync(STORAGE_KEY);
    if (raw && typeof raw === 'object') return raw;
  } catch (e) { /* ignore */ }
  return null;
}

function initData() {
  const data = {
    shareCount: 0,              // 总分享次数
    shareClicks: 0,             // 分享链接被点击次数
    invitedBy: '',              // 被谁邀请（邀请人openid或分享标识）
    inviteCode: '',             // 自己的邀请码
    streakDays: 0,              // 连续使用天数
    lastUseDate: '',            // 上次使用日期
    dailyTests: 0,              // 今日测试次数
    totalTests: 0,              // 总测试次数
    rareResultCount: 0,         // 稀有结果次数
    shareUnlocks: {},           // 分享解锁的记录 {testId: true}
    referralRewardsClaimed: 0,  // 已领取邀请奖励次数
    joinedFromShare: false,     // 是否从分享链接进入
  };
  wx.setStorageSync(STORAGE_KEY, data);
  return data;
}

function saveData(data) {
  try { wx.setStorageSync(STORAGE_KEY, data); } catch (e) {}
}

// ===== 日期工具 =====
function getToday() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
}

// ===== 每日签到/连续天数 =====
function checkIn() {
  let data = getData();
  if (!data) data = initData();

  const today = getToday();
  if (data.lastUseDate === today) {
    saveData(data);
    return data; // 今天已经签到过了
  }

  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayStr = `${yesterday.getFullYear()}-${String(yesterday.getMonth()+1).padStart(2,'0')}-${String(yesterday.getDate()).padStart(2,'0')}`;

  if (data.lastUseDate === yesterdayStr) {
    data.streakDays += 1; // 连续
  } else {
    data.streakDays = 1;  // 断签，重置
  }

  data.lastUseDate = today;
  data.dailyTests = 0;
  saveData(data);
  return data;
}

// ===== 记录一次分享 =====
function recordShare(shareType, shareData) {
  let data = getData();
  if (!data) data = initData();

  data.shareCount++;
  saveData(data);

  // 埋点
  analytics.track('share', {
    type: shareType,
    ...shareData
  });

  return {
    totalShares: data.shareCount,
    streakDays: data.streakDays,
  };
}

// ===== 处理"从分享链接进入" =====
function handleShareEntry(query) {
  let data = getData();
  if (!data) data = initData();

  if (query.inviteFrom) {
    data.invitedBy = query.inviteFrom;
    data.joinedFromShare = true;
    saveData(data);

    // 埋点：新用户来源
    analytics.track('share_entry', {
      inviter: query.inviteFrom,
      shareType: query.shareType || 'result',
      testId: query.testId || ''
    });
  }

  return data;
}

// ===== 记录分享链接被点击（在分享目标页onLoad调用） =====
function recordShareClick() {
  let data = getData();
  if (!data) data = initData();
  data.shareClicks++;
  saveData(data);
}

// ===== 记录一次测试完成 =====
function recordTestComplete(testId, resultType, rarity) {
  let data = getData();
  if (!data) data = initData();

  data.dailyTests++;
  data.totalTests++;

  if (rarity && rarity.includes('稀有')) {
    data.rareResultCount++;
  }

  saveData(data);

  // 埋点
  analytics.track('test_done', {
    testId, resultType,
    dailyTests: data.dailyTests,
    streakDays: data.streakDays,
    totalTests: data.totalTests
  });
}

// ===== 分享解锁检查 =====
function isShareUnlocked(testId) {
  let data = getData();
  if (!data) return false;
  return !!data.shareUnlocks[testId];
}

function unlockByShare(testId) {
  let data = getData();
  if (!data) data = initData();
  data.shareUnlocks[testId] = true;
  saveData(data);
}

// ===== 生成分享文案（病毒式文案工厂） =====
const VIRAL_TEMPLATES = {
  // 挑战型：激发好胜心
  challenge: [
    '我测出了{result}，花了{time}秒，你能比我快吗？',
    '我的测试结果是{result}，进来PK一下你的？',
    '{result}这个结果据说只有{pct}的人能测出来...'
  ],
  // 好奇型：制造信息差
  curiosity: [
    '测完后整个人都通透了...我的结果是{result}',
    '做了个测试，结果让我沉默了3分钟...',
    '朋友说我测这个特别准，我试了一下，真的...'
  ],
  // 幽默型：社交媒体货币
  humor: [
    '测完了，鉴定为{result}，建议直接放假',
    '好消息：我测出{result}。坏消息：没有坏消息',
    '原来我是{result}体质，难怪总是...'
  ],
  // 炫耀型：稀有结果专属
  flex: [
    '稀有结果！！！我测出了{pct}的{result}！',
    '我的{result}全服排名前{pct}，什么水平？',
    '连续{streak}天测试，终于解锁了{result}隐藏身份！'
  ]
};

function generateShareText(result, options = {}) {
  const { rarity, pct, time, streak, testName } = options;

  // 根据结果选择文案类型
  let poolKey = 'challenge';
  if (rarity && rarity.includes('稀有')) {
    poolKey = 'flex';
  } else if (streak && streak >= 3) {
    poolKey = 'humor';
  } else if (Math.random() < 0.5) {
    poolKey = 'curiosity';
  }

  const pool = VIRAL_TEMPLATES[poolKey];
  const template = pool[Math.floor(Math.random() * pool.length)];

  return template
    .replace('{result}', result || '神秘身份')
    .replace('{time}', time || Math.floor(Math.random() * 15 + 5))
    .replace('{pct}', pct || Math.floor(Math.random() * 5 + 1))
    .replace('{streak}', streak || 1)
    .replace('{testName}', testName || '趣味测试');
}

// ===== 邀请奖励系统 =====
const INVITE_REWARDS = {
  maxPerDay: 5,
  rewardQuota: 1,       // 每次邀请奖励1次测试次数
};

function claimLocalInviteReward() {
  let data = getData();
  if (!data) data = initData();

  if (data.referralRewardsClaimed >= INVITE_REWARDS.maxPerDay) {
    return { success: false, msg: '今日邀请奖励已领完' };
  }

  data.referralRewardsClaimed++;
  saveData(data);

  return { 
    success: true, 
    reward: INVITE_REWARDS.rewardQuota,
    remaining: INVITE_REWARDS.maxPerDay - data.referralRewardsClaimed
  };
}

// ===== K因子估算 =====
function estimateKFactor() {
  let data = getData();
  if (!data) return { k: 0, label: '数据不足' };

  // K = 分享转化率 × 每次分享平均带来新用户数
  const shareConvRate = data.shareCount > 0 ? data.shareClicks / data.shareCount : 0;
  // 假设点击分享链接的用户中30%会开始使用
  const estimatedNewUsers = data.shareClicks * 0.3;
  const k = data.shareCount > 0 ? estimatedNewUsers / data.shareCount : 0;

  let label = '数据不足';
  if (k >= 1.5) label = '🦠 超级病毒';
  else if (k >= 1.2) label = '🔥 病毒式增长';
  else if (k >= 0.8) label = '📈 有机增长';
  else if (k > 0) label = '🌱 初阶增长';
  
  return { k: Math.round(k * 100) / 100, label, shareConvRate, totalShares: data.shareCount };
}

// ===== 获取用户社交状态 =====
function getSocialStatus() {
  let data = getData();
  if (!data) data = initData();
  checkIn(); // 自动签到

  const status = {
    streakDays: data.streakDays,
    streakBonus: data.streakDays >= 3 ? '已解锁连续奖励' : `${3 - data.streakDays}天后解锁奖励`,
    totalTests: data.totalTests,
    dailyTests: data.dailyTests,
    shareCount: data.shareCount,
    rareResultCount: data.rareResultCount,
    invitedBy: data.invitedBy,
    joinedFromShare: data.joinedFromShare,
    isVipStreak: data.streakDays >= 7,
    nextMilestone: getNextMilestone(data.streakDays),
  };

  return status;
}

function getNextMilestone(currentStreak) {
  const milestones = [3, 7, 14, 30, 100];
  for (const m of milestones) {
    if (currentStreak < m) return { days: m, reward: m >= 30 ? '隐藏称号' : `${m - currentStreak}天后解锁隐藏测试` };
  }
  return null;
}

// ===== 限时活动检测 =====
function getActiveEvents() {
  const now = new Date();
  const month = now.getMonth() + 1;
  const day = now.getDate();

  const events = [];

  // 春节 (1月/2月)
  if (month === 1 || (month === 2 && day <= 15)) {
    events.push({ id: 'spring_festival', name: '春节限定·灵兽贺岁', icon: '🧧', tag: '限时' });
  }
  // 七夕 (8月)
  if (month === 8 && day >= 1 && day <= 15) {
    events.push({ id: 'qixi', name: '七夕限定·仙缘配对', icon: '💕', tag: '限时' });
  }
  // 中秋 (9月/10月)
  if (month === 9 || (month === 10 && day <= 6)) {
    events.push({ id: 'mid_autumn', name: '中秋限定·月宫寻仙', icon: '🌕', tag: '限时' });
  }
  // 万圣 (10月底)
  if (month === 10 && day >= 25) {
    events.push({ id: 'halloween', name: '万圣特别·百鬼夜行', icon: '🎃', tag: '限定' });
  }
  // 元旦
  if (month === 12 && day >= 25) {
    events.push({ id: 'newyear', name: '元旦限定·新年运势', icon: '🎆', tag: '限时' });
  }

  return events;
}

// ===== 邀请追踪系统（跨用户） =====
const INVITE_DB_COLLECTION = 'invite_records';

/** 记录一次邀请进入（被邀请方调用） */
async function recordInviteEntry(inviterId) {
  if (!inviterId || !wx.cloud) return false;
  try {
    const db = wx.cloud.database();
    await db.collection(INVITE_DB_COLLECTION).add({
      data: {
        inviterId,
        status: 'entered',
        createdAt: db.serverDate()
      }
    });
    return true;
  } catch (e) {
    console.warn('[Viral] 邀请记录写入失败:', e.errMsg || e.message);
    return false;
  }
}

/** 标记邀请已完成（被邀请方完成首次测试后调用） */
async function completeInvite(inviterId) {
  if (!inviterId || !wx.cloud) return false;
  try {
    const db = wx.cloud.database();
    const res = await db.collection(INVITE_DB_COLLECTION)
      .where({ inviterId, status: 'entered' })
      .orderBy('createdAt', 'desc')
      .limit(1)
      .get();
    if (res.data.length > 0) {
      await db.collection(INVITE_DB_COLLECTION).doc(res.data[0]._id).update({
        data: { status: 'completed', completedAt: db.serverDate() }
      });
      return res.data[0]._id;
    }
    return false;
  } catch (e) {
    console.warn('[Viral] 邀请完成标记失败:', e.errMsg || e.message);
    return false;
  }
}

/** 查询待领取的邀请奖励（邀请人调用） */
async function getPendingInvites(inviterId) {
  if (!inviterId || !wx.cloud) return [];
  try {
    const db = wx.cloud.database();
    const res = await db.collection(INVITE_DB_COLLECTION)
      .where({ inviterId, status: 'completed', claimed: wx.cloud.database().command.neq(true) })
      .get();
    return res.data || [];
  } catch (e) {
    // 集合不存在时静默处理，不再报错
    if (e.errCode === -502005 || (e.errMsg && e.errMsg.includes('collection not exists'))) {
      return [];
    }
    console.warn('[Viral] 查询邀请奖励失败:', e.errMsg || e.message);
    return [];
  }
}

/** 标记邀请奖励已领取 */
async function claimInviteReward(recordId) {
  if (!recordId || !wx.cloud) return false;
  try {
    const db = wx.cloud.database();
    await db.collection(INVITE_DB_COLLECTION).doc(recordId).update({
      data: { claimed: true, claimedAt: db.serverDate() }
    });
    return true;
  } catch (e) {
    return false;
  }
}

module.exports = {
  checkIn,
  recordShare,
  handleShareEntry,
  recordShareClick,
  recordTestComplete,
  generateShareText,
  claimLocalInviteReward,
  estimateKFactor,
  getSocialStatus,
  getActiveEvents,
  isShareUnlocked,
  unlockByShare,
  // 邀请追踪（云端）
  recordInviteEntry,
  completeInvite,
  getPendingInvites,
  claimInviteReward,
};
