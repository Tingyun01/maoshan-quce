/**
 * daily-test.js — 每日测试机制
 * 每天推荐一个测试，所有用户看到同一个
 * 配合每日道签形成"每日打卡"闭环
 */

const DAILY_TESTS = [
  { testId: 'past_life',      name: '前世今生',     tagline: '你前世是哪位神仙？' },
  { testId: 'guardian_beast', name: '守护神兽',     tagline: '今天测测谁在守护你' },
  { testId: 'love_portrait',  name: '桃花缘',       tagline: '今日桃花运如何？' },
  { testId: 'wu_xing',        name: '五行人格',     tagline: '今日五行能量状态' },
  { testId: 'stress_test',    name: '压力速测',     tagline: '今天你的压力值？' },
  { testId: 'animal_personality', name: '动物人格', tagline: '今天你像哪种动物？' },
  { testId: 'immortal',       name: '神仙转世',      tagline: '今天你是哪位神仙？' },
  { testId: 'spiritual_root', name: '灵根测试',      tagline: '今日修仙资质检测' },
  { testId: 'hidden_talent',  name: '隐藏天赋',      tagline: '发掘今日天赋' },
  { testId: 'ancient_id',     name: '古代身份',      tagline: '穿越回古代你会是？' },
  { testId: 'immortal_cluster', name: '群仙谱',     tagline: '今日仙班排位' },
  { testId: 'mbti_simple',    name: '思维偏好',      tagline: '今日思维模式诊断' }
];

/** 获取今日推荐测试 */
function getDailyTest() {
  const today = new Date();
  const dateStr = `${today.getFullYear()}-${today.getMonth()}-${today.getDate()}`;
  // 用日期做hash，确保每天同个测试
  let hash = 0;
  for (let i = 0; i < dateStr.length; i++) {
    hash = ((hash << 5) - hash) + dateStr.charCodeAt(i);
    hash |= 0;
  }
  const idx = Math.abs(hash) % DAILY_TESTS.length;
  return { ...DAILY_TESTS[idx], date: dateStr };
}

module.exports = { getDailyTest };
