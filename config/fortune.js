/**
 * fortune.js — 今日道签库
 * 每日运势卡的内容来源
 * 每天随机选一条展示
 */

const FORTUNE_POOL = [
  // 财运类
  { icon: '💰', title: '财运亨通', desc: '今日财运能量充沛，适合谈钱、谈合作、谈加薪。但不适合借钱给人。', energy: '财运', value: 8 },
  { icon: '💰', title: '守财之日', desc: '今天财运一般，不宜大额支出。适合记账、理财规划。', energy: '财运', value: 5 },
  { icon: '💰', title: '意外之财', desc: '今天可能有意外收入！红包、退款、或者请客。保持手机畅通。', energy: '财运', value: 9 },

  // 桃花类
  { icon: '🌸', title: '桃花朵朵', desc: '今日魅力值爆表！适合社交、约会、认识新朋友。单身的有戏~', energy: '桃花', value: 9 },
  { icon: '🌸', title: '桃花休眠', desc: '今天桃花能量低，不适合表白或相亲。适合独处充电。', energy: '桃花', value: 4 },

  // 事业类
  { icon: '⚡', title: '效率爆棚', desc: '今天脑子特别清楚，适合做重要决策、写方案、推进拖延已久的事。', energy: '事业', value: 9 },
  { icon: '⚡', title: '宜摸鱼', desc: '今天不适合硬刚工作。适合摸鱼、划水、假装很忙。', energy: '事业', value: 3 },

  // 健康类
  { icon: '🌿', title: '元气满满', desc: '今天身体状态不错！适合运动、户外活动、早睡早起。', energy: '健康', value: 8 },
  { icon: '🌿', title: '注意休息', desc: '今天容易疲惫，别硬撑。早点睡，明天又是元气满满的一天。', energy: '健康', value: 4 },

  // 综合类
  { icon: '☯️', title: '五行平衡', desc: '今日五行能量均衡，做什么都顺！适合开启新计划、做重要决定。', energy: '综合', value: 7 },
  { icon: '☯️', title: '宜静不宜动', desc: '今天适合宅家、看书、追剧。不宜冲动消费或做重大决定。', energy: '综合', value: 5 },

  // 社交类
  { icon: '🤝', title: '贵人相助', desc: '今天贵人运旺！遇到困难别硬扛，找朋友聊聊，有人能帮你。', energy: '社交', value: 8 },
  { icon: '🤝', title: '独善其身', desc: '今天适合独处，不宜深交。社交能量低，容易说错话。', energy: '社交', value: 3 },

  // 学习类
  { icon: '📚', title: '灵感爆发', desc: '今天脑子好使！适合学习新技能、读书、写作、创意工作。', energy: '学习', value: 9 },
  { icon: '📚', title: '学不进去', desc: '今天不适合学习，看了也记不住。适合放松、娱乐、放空。', energy: '学习', value: 3 },

  // 趣味类
  { icon: '🎲', title: '运气爆棚', desc: '今天运气值拉满！适合抽奖、抽卡、买彩票（但别冲动）。', energy: '运气', value: 10 },
  { icon: '🎲', title: '水逆退散', desc: '今天可能有点水逆，小事不顺。保持淡定，水逆会过去的。', energy: '运气', value: 4 },

  // 更多...
  { icon: '🍀', title: '宜表白', desc: '今天表白成功率+50%！喜欢就去说，别等明天。', energy: '桃花', value: 8 },
  { icon: '🍀', title: '宜吵架', desc: '今天容易情绪激动，不适合争论。深呼吸，数到十再说话。', energy: '情绪', value: 3 },
  { icon: '🔮', title: '直觉准', desc: '今天直觉特别准！相信自己的第一感觉，别想太多。', energy: '直觉', value: 8 },
  { icon: '🔮', title: '想多错多', desc: '今天想太多反而容易出错。简单直接处理问题，效果更好。', energy: '思维', value: 4 },
];

/**
 * 获取今日道签（基于日期种子随机，保证当天不变化）
 */
function getTodayFortune() {
  const today = new Date();
  const seed = today.getFullYear() * 10000 + (today.getMonth() + 1) * 100 + today.getDate();
  const idx = seed % FORTUNE_POOL.length;
  return FORTUNE_POOL[idx];
}

module.exports = {
  FORTUNE_POOL,
  getTodayFortune
};
