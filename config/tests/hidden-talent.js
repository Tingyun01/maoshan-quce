// ============================================================
// 隐藏天赋 · 快速测试（5题制）
// "你隐藏了什么天赋？"
// 基于公众领域神话概念
// 仅限娱乐参考
// ============================================================
module.exports = {
  id: 'hidden_talent',
  name: '隐藏天赋',
  icon: '🔮',
  desc: '5道题发现你隐藏的天赋能力',
  qCount: 5,
  duration: '1分钟',
  tag: '',
  category: '趣味',
  disclaimer: '本测试结果仅供娱乐，不具任何科学依据',

  questions: [
    {
      id: 1, text: '你最常做的梦是什么样的？',
      options: [
        { text: '飞翔——自由自在', score: { fly: 2 } },
        { text: '预知——梦到的事后来真发生了', score: { foresee: 2 } },
        { text: '治愈——在梦里安抚别人', score: { heal: 2 } },
        { text: '变强——梦里自己力大无穷', score: { strength: 2 } }
      ]
    },
    {
      id: 2, text: '别人最常找你帮什么忙？',
      options: [
        { text: '帮他们想出好点子', score: { foresee: 2 } },
        { text: '安慰他们、听他们倾诉', score: { heal: 2 } },
        { text: '帮忙搬东西/解决问题', score: { strength: 2 } },
        { text: '带他们一起"搞事情"', score: { fly: 2 } }
      ]
    },
    {
      id: 3, text: '你觉得自己"第六感"准吗？',
      options: [
        { text: '超级准，经常提前知道', score: { foresee: 2 } },
        { text: '偶尔准，关键时候起作用', score: { fly: 1, heal: 1 } },
        { text: '不太准，靠实力说话', score: { strength: 2 } },
        { text: '准不准我不知道，但直觉很重要', score: { fly: 1, strength: 1 } }
      ]
    },
    {
      id: 4, text: '朋友心情不好，你会？',
      options: [
        { text: '带他出去玩，转移注意力', score: { fly: 2 } },
        { text: '安静倾听，让他说出来', score: { heal: 2 } },
        { text: '分析问题给建议', score: { foresee: 2 } },
        { text: '直接用行动帮忙解决', score: { strength: 2 } }
      ]
    },
    {
      id: 5, text: '如果你有一天的超能力，你选？',
      options: [
        { text: '飞翔——想去哪就去哪', score: { fly: 2 } },
        { text: '预知未来——知道明天发生什么', score: { foresee: 2 } },
        { text: '治愈——治好自己和别人', score: { heal: 2 } },
        { text: '超级力量——力大无穷', score: { strength: 2 } }
      ]
    }
  ],

  resultTypes: ['fly', 'foresee', 'heal', 'strength'],

  results: {
    fly: {
      title: '飞翔天赋 🕊️', sum: '来去如风，无拘无束',
      brief: '你的隐藏天赋是"飞翔"——不是说物理上能飞，而是你的思路和行动力永远比别人快一步。你是团队里的"先行者"。',
      rank: '天品·翔', rarity: '热门 · 全国30%',
      tagline: '我飞的不是天，是想象力 🕊️',
      othersView: '觉得你太飘了，想法太多落地太少',
      trueSelf: '你比任何人都清楚方向，只是有时懒得解释',
      strengths: '创意 / 行动力 / 自由', weaknesses: '缺乏耐心 / 难坚持',
      career: '创意 / 设计 / 旅行 / 自由职业', ratings: { 速度: 10, 洞察: 5, 治愈: 4, 力量: 6 },
      conversation: '我的隐藏天赋居然是"飞翔"！🕊️ 你的隐藏天赋是什么？测测看 👉',
      shareText: '在茅山趣测发现了我隐藏的天赋！你也有隐藏天赋，一测便知 👉',
      percent: '30%'
    },
    foresee: {
      title: '预知天赋 👁️', sum: '先知先觉，洞察先机',
      brief: '你有超准的第六感。很多事你"莫名其妙"就知道结果了。你有一种天然的洞察力，能看穿事物的本质。',
      rank: '天品·预', rarity: '稀有 · 全国仅15%',
      tagline: '我不是算命的，但你要不要听听我的预感？👁️',
      othersView: '觉得你神神叨叨，有时还挺吓人的',
      trueSelf: '你真的能感觉到很多别人感觉不到的东西',
      strengths: '直觉强 / 洞察力 / 战略思维', weaknesses: '多疑 / 敏感 / 容易焦虑',
      career: '分析 / 战略 / 咨询 / 金融', ratings: { 速度: 4, 洞察: 10, 治愈: 5, 力量: 5 },
      conversation: '我的隐藏天赋居然是"预知"！👁️ 你的隐藏天赋是什么？测测看 👉',
      shareText: '在茅山趣测发现了我隐藏的天赋！你也有隐藏天赋，一测便知 👉',
      percent: '15%'
    },
    heal: {
      title: '治愈天赋 💚', sum: '抚慰伤痛，给人力量',
      brief: '你的隐藏天赋是"治愈"。你在身边，大家就安心。你不是医生，但你的存在就是一种疗愈。',
      rank: '天品·愈', rarity: '稀有 · 全国仅18%',
      tagline: '我的存在本身就是最好的药 💚',
      othersView: '觉得你太好了，好得让人觉得不真实',
      trueSelf: '你治愈了别人，有时却忘了治愈自己',
      strengths: '共情 / 温暖 / 治愈力', weaknesses: '心软 / 容易内耗 / 不为自己想',
      career: '医疗 / 心理 / 教育 / 公益', ratings: { 速度: 3, 洞察: 7, 治愈: 10, 力量: 4 },
      conversation: '我的隐藏天赋居然是"治愈"！💚 你的隐藏天赋是什么？测测看 👉',
      shareText: '在茅山趣测发现了我隐藏的天赋！你也有隐藏天赋，一测便知 👉',
      percent: '18%'
    },
    strength: {
      title: '神力天赋 💪', sum: '力能扛鼎，坚韧不拔',
      brief: '你是天生的"力量型选手"——不只是物理力量，更是内心的坚韧。你扛得住压力，顶得住困难，是团队的主心骨。',
      rank: '地品·力', rarity: '热门 · 全国37%',
      tagline: '我不是壮，我是可靠 💪',
      othersView: '觉得你只会"硬来"，没有技巧',
      trueSelf: '你的"硬来"恰恰是最被低估的品质——持之以恒',
      strengths: '坚韧 / 可靠 / 执行力', weaknesses: '死板 / 不够灵活',
      career: '工程 / 体育 / 制造 / 军事', ratings: { 速度: 5, 洞察: 4, 治愈: 3, 力量: 10 },
      conversation: '我的隐藏天赋居然是"神力"！💪 你的隐藏天赋是什么？测测看 👉',
      shareText: '在茅山趣测发现了我隐藏的天赋！你也有隐藏天赋，一测便知 👉',
      percent: '37%'
    }
  },

  scoring: {
    pickResult: function(scores) {
      const keys = ['fly', 'foresee', 'heal', 'strength'];
      let maxK = keys[0], maxV = scores[maxK] || 0;
      keys.forEach(k => { if ((scores[k] || 0) > maxV) { maxK = k; maxV = scores[k] || 0; } });
      return maxK;
    }
  }
};
