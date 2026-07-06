// ============================================================
// 稀有度百分比配置 — 每个结果对应的"全服占比"与"击败比例"
// 注：这是模拟数据，用于激发分享欲。上线后可根据真实数据调整。
// 原则：神品 <5% 仙品 5-30% 凡品 >30%
// ============================================================
module.exports = {
  // ===== 守护神兽 =====
  'guardian_beast.dragon':   { percent: 2.1,  beat: 92 },
  'guardian_beast.phoenix':  { percent: 4.8,  beat: 85 },
  'guardian_beast.qilin':    { percent: 5.3,  beat: 82 },
  'guardian_beast.tiger':    { percent: 12.6, beat: 68 },
  // ===== 前世今生 =====
  'past_life.maoying':  { percent: 1.8,  beat: 95 },
  'past_life.gehong':   { percent: 8.2,  beat: 75 },
  'past_life.hongjing': { percent: 6.5,  beat: 80 },
  'past_life.wangyuan': { percent: 14.3, beat: 65 },
  // ===== 古代身份 =====
  'ancient_id.general':  { percent: 11.2, beat: 70 },
  'ancient_id.merchant': { percent: 22.5, beat: 55 },
  'ancient_id.scholar':  { percent: 18.7, beat: 60 },
  'ancient_id.hero':     { percent: 5.1,  beat: 83 },
  // ===== 群仙谱 =====
  'immortal_cluster.sword_immortal':  { percent: 9.3, beat: 72 },
  'immortal_cluster.talisman_master': { percent: 7.1, beat: 78 },
  'immortal_cluster.free_immortal':   { percent: 4.2, beat: 88 },
  'immortal_cluster.spirit_tamer':    { percent: 11.8, beat: 69 },
  // ===== 灵根测试 =====
  'spiritual_root.tianling':   { percent: 1.5, beat: 96 },
  'spiritual_root.dipin':      { percent: 9.8, beat: 74 },
  'spiritual_root.bianyiling': { percent: 6.7, beat: 79 },
  'spiritual_root.wuling':     { percent: 31.2, beat: 42 },
  // ===== 隐藏天赋 =====
  'hidden_talent.fly':     { percent: 2.8, beat: 91 },
  'hidden_talent.foresee': { percent: 7.4, beat: 77 },
  'hidden_talent.heal':    { percent: 15.6, beat: 63 },
  'hidden_talent.strength':{ percent: 13.2, beat: 67 },
  // ===== 桃花缘 =====
  'love_portrait.guardian':    { percent: 2.3, beat: 93 },
  'love_portrait.romantic':    { percent: 8.9, beat: 76 },
  'love_portrait.rationalist': { percent: 16.4, beat: 62 },
  'love_portrait.gentle':      { percent: 21.7, beat: 54 },
  // ===== 五行人格 =====
  'wu_xing.jin':  { percent: 18.3, beat: 61 },
  'wu_xing.mu':   { percent: 22.1, beat: 56 },
  'wu_xing.shui': { percent: 19.7, beat: 59 },
  'wu_xing.huo':  { percent: 15.2, beat: 64 },
  'wu_xing.tu':   { percent: 24.7, beat: 50 },
  // ===== 动物人格 =====
  'animal_personality.lion':    { percent: 10.4, beat: 71 },
  'animal_personality.wolf':    { percent: 12.8, beat: 67 },
  'animal_personality.dolphin': { percent: 18.5, beat: 60 },
  'animal_personality.cat':     { percent: 14.1, beat: 65 },
  'animal_personality.bear':    { percent: 20.3, beat: 55 },
  'animal_personality.deer':    { percent: 5.9, beat: 81 },
  // ===== 神仙转世 =====
  'immortal.nezha':    { percent: 1.2, beat: 97 },
  'immortal.yueLao':   { percent: 5.7, beat: 84 },
  'immortal.taibai':   { percent: 7.3, beat: 78 },
  'immortal.zhongkui': { percent: 6.1, beat: 81 },
  'immortal.caishen':  { percent: 10.8, beat: 70 },
  'immortal.tudi':     { percent: 22.4, beat: 55 },
  // ===== 修仙资质 =====
  'xiuxian.tian': { percent: 2.6, beat: 90 },
  'xiuxian.di':   { percent: 8.4, beat: 75 },
  'xiuxian.fan':  { percent: 28.6, beat: 45 },
  'xiuxian.za':   { percent: 15.3, beat: 64 },
  // ===== MBTI =====
  'mbti_simple.INTJ': { percent: 3.5, beat: 89 },
  'mbti_simple.INTP': { percent: 4.2, beat: 87 },
  'mbti_simple.ENTJ': { percent: 2.8, beat: 91 },
  'mbti_simple.ENTP': { percent: 3.9, beat: 88 },
  'mbti_simple.INFJ': { percent: 1.8, beat: 95 },
  'mbti_simple.INFP': { percent: 5.3, beat: 83 },
  'mbti_simple.ENFJ': { percent: 3.1, beat: 90 },
  'mbti_simple.ENFP': { percent: 6.7, beat: 79 },
  'mbti_simple.ISTJ': { percent: 11.4, beat: 69 },
  'mbti_simple.ISFJ': { percent: 13.2, beat: 66 },
  'mbti_simple.ESTJ': { percent: 8.9, beat: 74 },
  'mbti_simple.ESFJ': { percent: 14.6, beat: 65 },
  'mbti_simple.ISTP': { percent: 7.5, beat: 77 },
  'mbti_simple.ISFP': { percent: 9.8, beat: 73 },
  'mbti_simple.ESTP': { percent: 6.3, beat: 80 },
  'mbti_simple.ESFP': { percent: 8.1, beat: 76 },
  // ===== 压力测试 =====
  'stress_test.good':     { percent: 18.7, beat: 60 },
  'stress_test.mild':     { percent: 24.3, beat: 52 },
  'stress_test.moderate': { percent: 31.5, beat: 42 },
  'stress_test.high':     { percent: 25.5, beat: 50 },
};
