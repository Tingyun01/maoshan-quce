/**
 * achievement-manager.js — 成就系统
 *
 * 成就列表：
 *   🥉 茅山弟子    → 完成任意测试3次
 *   🥈 五行大师    → 完成五行测试5次
 *   🥇 全人格大师  → 完成所有6种类型测试
 *   💎 均衡体      → 五行测试中各项分数相差<10分（由result页检测）
 *   ⭐ 社交达人    → 分享结果3次
 *   🏆 每日打卡    → 连续7天签到领取运势
 */

const STORAGE_KEY = 'quce_achievements';

const ACHIEVEMENT_DEFS = [
  { id: 'disciple',    name: '🥉 茅山弟子',    desc: '完成任意测试3次',       icon: '🥉', condition: (d) => d.tests_completed >= 3 },
  { id: 'wuxing',      name: '🥈 五行大师',    desc: '完成五行测试5次',       icon: '🥈', condition: (d) => d.wuxing_count >= 5 },
  { id: 'all_types',   name: '🥇 全人格大师',  desc: '完成至少8种不同类型的测试', icon: '🥇', condition: (d) => d.types_completed.size >= 8 },
  { id: 'balanced',    name: '💎 均衡体',      desc: '五行测试各项分数平衡',   icon: '💎', condition: (d) => d.balance_count >= 1 },
  { id: 'social',      name: '⭐ 社交达人',    desc: '分享结果3次',           icon: '⭐', condition: (d) => d.share_count >= 3 },
  { id: 'checkin',     name: '🏆 每日打卡',    desc: '连续7天签到领取运势',    icon: '🏆', condition: (d) => d.checkin_streak >= 7 }
];

/** 读取成就数据 */
function getData() {
  try {
    const raw = wx.getStorageSync(STORAGE_KEY);
    if (raw) return raw;
  } catch (e) {}
  return initData();
}

function initData() {
  const data = {
    tests_completed: 0,
    wuxing_count: 0,
    share_count: 0,
    checkin_streak: 0,
    last_checkin_date: '',
    types_completed: new Set(),
    unlocked: new Set(),
    balance_count: 0
  };
  saveData(data);
  return data;
}

function saveData(data) {
  // 转换 Set 为数组存储
  const store = {
    ...data,
    types_completed: Array.from(data.types_completed),
    unlocked: Array.from(data.unlocked)
  };
  wx.setStorageSync(STORAGE_KEY, store);
}

function loadData() {
  const raw = wx.getStorageSync(STORAGE_KEY);
  if (!raw) return initData();
  return {
    ...raw,
    types_completed: new Set(raw.types_completed || []),
    unlocked: new Set(raw.unlocked || [])
  };
}

/** 测试完成后调用 */
function onTestCompleted(testId) {
  const data = loadData();
  data.tests_completed = (data.tests_completed || 0) + 1;
  if (testId === 'wu_xing') {
    data.wuxing_count = (data.wuxing_count || 0) + 1;
  }
  if (testId !== 'random') {
    data.types_completed.add(testId);
  }
  checkAndUnlock(data);
  saveData(data);
}

/** 分享后调用 */
function onShared() {
  const data = loadData();
  data.share_count = (data.share_count || 0) + 1;
  checkAndUnlock(data);
  saveData(data);
}

/** 每日签到后调用 */
function onCheckin(dateStr) {
  const data = loadData();
  const yesterday = getYesterday(dateStr);
  if (data.last_checkin_date === yesterday) {
    data.checkin_streak = (data.checkin_streak || 0) + 1;
  } else if (data.last_checkin_date !== dateStr) {
    data.checkin_streak = 1;
  }
  data.last_checkin_date = dateStr;
  checkAndUnlock(data);
  saveData(data);
}

function getYesterday(today) {
  const d = new Date(today);
  d.setDate(d.getDate() - 1);
  return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
}

/** 检测并解锁新成就 */
function checkAndUnlock(data) {
  const newlyUnlocked = [];
  ACHIEVEMENT_DEFS.forEach(def => {
    if (!data.unlocked.has(def.id) && def.condition(data)) {
      data.unlocked.add(def.id);
      newlyUnlocked.push(def);
    }
  });
  // 如果有新成就解锁，弹提示
  if (newlyUnlocked.length > 0) {
    // 延迟一点再弹，避免覆盖主流程提示
    setTimeout(() => {
      wx.showToast({
        title: `🏆 解锁成就：${newlyUnlocked.map(a => a.name).join('、')}`,
        icon: 'none',
        duration: 2500
      });
    }, 800);
  }
}

/** 获取成就列表及解锁状态 */
function getAchievements() {
  const data = loadData();
  return ACHIEVEMENT_DEFS.map(def => ({
    ...def,
    unlocked: data.unlocked.has(def.id)
  }));
}

/** 获取成就墙摘要信息 */
function getSummary() {
  const data = loadData();
  const all = ACHIEVEMENT_DEFS.length;
  const unlocked = data.unlocked.size;
  return {
    total: all,
    unlocked: unlocked,
    percent: all > 0 ? Math.round(unlocked / all * 100) : 0,
    list: getAchievements()
  };
}

/** 五行均衡结果后调用（由 result 页检测到各项分数相差 <10 时触发） */
function onBalancedResult() {
  const data = loadData();
  data.balance_count = (data.balance_count || 0) + 1;
  checkAndUnlock(data);
  saveData(data);
}

module.exports = {
  onTestCompleted,
  onShared,
  onCheckin,
  onBalancedResult,
  getAchievements,
  getSummary,
  ACHIEVEMENT_DEFS
};
