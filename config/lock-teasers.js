/**
 * lock-teasers.js — 图鉴锁定卡片诱饵数据
 * 每个锁定卡片显示：icon + 诱人名称 + 朝代/场景提示
 * 让未解锁的卡片看起来就想点进去
 */

const TEASERS = {
  // ===== 神仙转世 =====
  'immortal.caishen': { icon: '🧧', name: '财', dynasty: '唐', hint: '招财进宝，财源广进' },
  'immortal.taibai': { icon: '⭐', name: '白', dynasty: '唐', hint: '文曲星下凡，才华横溢' },
  'immortal.tudi': { icon: '🏠', name: '地', dynasty: '上古', hint: '土地公，守护一方' },
  'immortal.zhongkui': { icon: '⚔️', name: '馗', dynasty: '唐', hint: '斩妖除魔，正气凛然' },
  'immortal.nezha': { icon: '🔥', name: '吒', dynasty: '商', hint: '三头六臂，莲花化身' },
  'immortal.yueLao': { icon: '❤️', name: '月', dynasty: '唐', hint: '千里姻缘一线牵' },
  // ===== 前世今生 =====
  'past_life.maoying': { icon: '⛰️', name: '茅', dynasty: '汉', hint: '三茅君之首，茅山开山' },
  'past_life.gehong': { icon: '📿', name: '葛', dynasty: '晋', hint: '抱朴子，丹道宗师' },
  'past_life.hongjing': { icon: '🏔️', name: '陶', dynasty: '南北朝', hint: '山中宰相，隐于茅山' },
  'past_life.wangyuan': { icon: '☯️', name: '王', dynasty: '隋', hint: '守道真人，道法自然' },
  // ===== 守护神兽 =====
  'guardian_beast.dragon': { icon: '🐉', name: '龙', dynasty: '上古', hint: '神龙降世，呼风唤雨' },
  'guardian_beast.phoenix': { icon: '🔥', name: '凤', dynasty: '上古', hint: '凤凰涅槃，浴火重生' },
  'guardian_beast.qilin': { icon: '🦌', name: '麟', dynasty: '上古', hint: '祥瑞之兽，福泽绵长' },
  'guardian_beast.tiger': { icon: '🐅', name: '虎', dynasty: '上古', hint: '白虎战神，威震四方' },
  // ===== 古代身份 =====
  'ancient_id.general': { icon: '⚔️', name: '将', dynasty: '汉', hint: '金戈铁马，气吞万里' },
  'ancient_id.merchant': { icon: '💰', name: '商', dynasty: '宋', hint: '富甲一方，纵横天下' },
  'ancient_id.scholar': { icon: '📖', name: '儒', dynasty: '唐', hint: '学富五车，才高八斗' },
  'ancient_id.hero': { icon: '🗡️', name: '侠', dynasty: '明', hint: '仗剑天涯，快意恩仇' },
  // ===== 群仙谱 =====
  'immortal_cluster.sword_immortal': { icon: '🗡️', name: '剑', dynasty: '上古', hint: '白衣剑仙，御剑飞行' },
  'immortal_cluster.talisman_master': { icon: '✨', name: '符', dynasty: '南北朝', hint: '符箓大师，守护平安' },
  'immortal_cluster.free_immortal': { icon: '☁️', name: '仙', dynasty: '上古', hint: '逍遥真仙，游戏人间' },
  'immortal_cluster.spirit_tamer': { icon: '🦊', name: '灵', dynasty: '上古', hint: '御灵仙师，万兽臣服' },
  // ===== 灵根测试 =====
  'spiritual_root.tianling': { icon: '💎', name: '天', dynasty: '上古', hint: '天灵根，万中无一' },
  'spiritual_root.dipin': { icon: '🌿', name: '地', dynasty: '上古', hint: '地灵根，根基深厚' },
  'spiritual_root.bianyiling': { icon: '⚡', name: '变', dynasty: '上古', hint: '变异灵根，天赋异禀' },
  'spiritual_root.wuling': { icon: '🌫️', name: '无', dynasty: '上古', hint: '无灵根，另辟蹊径' },
  // ===== 隐藏天赋 =====
  'hidden_talent.fly': { icon: '🦅', name: '飞', dynasty: '上古', hint: '御风而行，翱翔九天' },
  'hidden_talent.foresee': { icon: '🔮', name: '预', dynasty: '上古', hint: '未卜先知，洞察天机' },
  'hidden_talent.heal': { icon: '💫', name: '愈', dynasty: '上古', hint: '妙手回春，治愈万物' },
  'hidden_talent.strength': { icon: '💪', name: '力', dynasty: '上古', hint: '神力天生，力拔山兮' },
  // ===== 桃花缘 =====
  'love_portrait.rationalist': { icon: '🧠', name: '理', dynasty: '现代', hint: '理性恋爱，细水长流' },
  'love_portrait.romantic': { icon: '🌹', name: '浪', dynasty: '现代', hint: '浪漫至上，至死不渝' },
  'love_portrait.guardian': { icon: '🛡️', name: '守', dynasty: '现代', hint: '默默守护，坚如磐石' },
  'love_portrait.gentle': { icon: '☁️', name: '温', dynasty: '现代', hint: '温柔如水，润物无声' },
  // ===== 五行人格 =====
  'wu_xing.jin': { icon: '⚜️', name: '金', dynasty: '上古', hint: '金戈铁马，锐不可当' },
  'wu_xing.mu': { icon: '🌲', name: '木', dynasty: '上古', hint: '木秀于林，生机盎然' },
  'wu_xing.shui': { icon: '💧', name: '水', dynasty: '上古', hint: '上善若水，以柔克刚' },
  'wu_xing.huo': { icon: '🔥', name: '火', dynasty: '上古', hint: '火舞燎原，热情如火' },
  'wu_xing.tu': { icon: '⛰️', name: '土', dynasty: '上古', hint: '厚德载物，稳如泰山' },
  // ===== 动物灵兽 =====
  'animal_personality.lion': { icon: '🦁', name: '狮', dynasty: '上古', hint: '雄狮之王，霸气侧漏' },
  'animal_personality.wolf': { icon: '🐺', name: '狼', dynasty: '上古', hint: '孤狼之魂，独来独往' },
  'animal_personality.dolphin': { icon: '🐬', name: '豚', dynasty: '上古', hint: '海豚精灵，聪明伶俐' },
  'animal_personality.cat': { icon: '🐱', name: '猫', dynasty: '上古', hint: '黑猫精灵，神秘莫测' },
  'animal_personality.bear': { icon: '🐻', name: '熊', dynasty: '上古', hint: '棕熊大哥，可靠踏实' },
  'animal_personality.deer': { icon: '🦌', name: '鹿', dynasty: '上古', hint: '灵鹿之姿，优雅灵动' },
  // ===== 心境测试 =====
  'stress_test.good': { icon: '☀️', name: '晴', dynasty: '现代', hint: '云淡风轻，悠然自得' },
  'stress_test.mild': { icon: '⛅', name: '微', dynasty: '现代', hint: '午后微云，偶尔小焦虑' },
  'stress_test.moderate': { icon: '☁️', name: '阴', dynasty: '现代', hint: '乌云渐浓，需要调整' },
  'stress_test.high': { icon: '⛈️', name: '雨', dynasty: '现代', hint: '暴雨将至，急需释放' },
  // ===== 修仙资质 =====
  'xiuxian.tian': { icon: '👑', name: '天', dynasty: '上古', hint: '天品仙资，天资卓绝' },
  'xiuxian.di': { icon: '💎', name: '地', dynasty: '上古', hint: '地品仙资，根基稳固' },
  'xiuxian.fan': { icon: '🌿', name: '凡', dynasty: '上古', hint: '凡品仙资，勤能补拙' },
  'xiuxian.za': { icon: '🌫️', name: '杂', dynasty: '上古', hint: '杂品仙资，大器晚成' },
  // ===== MBTI =====
  'mbti_simple.INTJ': { icon: '🧠', name: '建', dynasty: '现代', hint: '建筑师，战略大师' },
  'mbti_simple.INTP': { icon: '💡', name: '逻', dynasty: '现代', hint: '逻辑学家，思维缜密' },
  'mbti_simple.ENTJ': { icon: '👑', name: '指', dynasty: '现代', hint: '指挥官，天生领袖' },
  'mbti_simple.ENFP': { icon: '🌟', name: '竞', dynasty: '现代', hint: '竞选者，热情似火' },
  'mbti_simple.ISTJ': { icon: '📋', name: '物', dynasty: '现代', hint: '物流师，严谨可靠' },
  'mbti_simple.ISFJ': { icon: '🛡️', name: '守', dynasty: '现代', hint: '守卫者，默默付出' },
  'mbti_simple.ESTJ': { icon: '💼', name: '总', dynasty: '现代', hint: '总经理，雷厉风行' },
  'mbti_simple.ESFJ': { icon: '💝', name: '执', dynasty: '现代', hint: '执政官，热心助人' },
  'mbti_simple.ISTP': { icon: '🔧', name: '鉴', dynasty: '现代', hint: '鉴赏家，务实冷静' },
  'mbti_simple.ISFP': { icon: '🎨', name: '探', dynasty: '现代', hint: '探险家，艺术气质' },
  'mbti_simple.ESTP': { icon: '⚡', name: '企', dynasty: '现代', hint: '企业家，行动派' },
  'mbti_simple.ESFP': { icon: '🎭', name: '表', dynasty: '现代', hint: '表演者，天生焦点' },
  'mbti_simple.INFJ': { icon: '🔮', name: '提', dynasty: '现代', hint: '提倡者，理想主义' },
  'mbti_simple.INFP': { icon: '🌙', name: '调', dynasty: '现代', hint: '调停者，温柔内心' },
  'mbti_simple.ENFJ': { icon: '☀️', name: '主', dynasty: '现代', hint: '主人公， charismatic' },
  'mbti_simple.ENTP': { icon: '💬', name: '辩', dynasty: '现代', hint: '辩论家，机智幽默' },
};

function getTeaser(key) {
  return TEASERS[key] || null;
}

function getDefaultTeaser() {
  return { icon: '❓', name: '秘', dynasty: '上古', hint: '未知之境，等你来探' };
}

module.exports = {
  TEASERS,
  getTeaser,
  getDefaultTeaser
};
