// ============================================================
// 古代身份 · 快速测试（5题制）
// "如果你在古代，你是什么身份？"
// 仅限娱乐参考
// ============================================================
module.exports = {
  id: 'ancient_id',
  name: '古代身份',
  icon: '⚔️',
  desc: '5道题测出你在古代是什么人',
  qCount: 5,
  duration: '1分钟',
  tag: '',
  category: '趣味',
  disclaimer: '本测试结果仅供娱乐，不具任何科学依据',

  questions: [
    {
      id: 1, text: '乱世之中，你会选择什么？',
      options: [
        { text: '投军报国，建功立业', score: { general: 2 } },
        { text: '经商致富，囤积资源', score: { merchant: 2 } },
        { text: '隐居山林，著书立说', score: { scholar: 2 } },
        { text: '行侠仗义，劫富济贫', score: { hero: 2 } }
      ]
    },
    {
      id: 2, text: '你最擅长的事情是？',
      options: [
        { text: '指挥协调，运筹帷幄', score: { general: 2 } },
        { text: '精打细算，钱生钱', score: { merchant: 2 } },
        { text: '博览群书，聪明绝顶', score: { scholar: 2 } },
        { text: '身手不凡，飞檐走壁', score: { hero: 2 } }
      ]
    },
    {
      id: 3, text: '面对一个难题，你会？',
      options: [
        { text: '组织人手，一起上', score: { general: 2 } },
        { text: '评估成本，选最划算的方案', score: { merchant: 2 } },
        { text: '独处思考，直到想通', score: { scholar: 2 } },
        { text: '直接干了再说', score: { hero: 2 } }
      ]
    },
    {
      id: 4, text: '你最在意的"财富"是什么？',
      options: [
        { text: '名望和功绩', score: { general: 2 } },
        { text: '金银财宝和生意', score: { merchant: 2 } },
        { text: '知识和智慧', score: { scholar: 2 } },
        { text: '自由和江湖义气', score: { hero: 2 } }
      ]
    },
    {
      id: 5, text: '临死前你最想对世界说的一句话？',
      options: [
        { text: '来世还做将军！', score: { general: 2 } },
        { text: '早知道再多赚一点……', score: { merchant: 2 } },
        { text: '我还有一本书没写完……', score: { scholar: 2 } },
        { text: '快意江湖，此生无憾！', score: { hero: 2 } }
      ]
    }
  ],

  resultTypes: ['general', 'merchant', 'scholar', 'hero'],

  results: {
    general: {
      title: '将军/统帅 ⚔️', sum: '沙场点兵，运筹帷幄',
      brief: '你天生就是Leader的料。在团队里你永远是那个拍板的人，大家都服你。',
      rank: '一品·大将', rarity: '稀有 · 全国仅15%',
      tagline: '我不是霸道，我只是比你更清楚该怎么打 ⚔️',
      othersView: '觉得你太强势，不给别人留余地',
      trueSelf: '你的强势是因为责任，你比谁都想带大家赢',
      strengths: '领导力 / 决断 / 担当', weaknesses: '强势 / 控制欲',
      career: '管理 / 创业 / 军队 / 体育', ratings: { 武力: 10, 智慧: 8, 财富: 6, 魅力: 7 },
      conversation: '我在古代居然是个将军！⚔️ 你是什么身份？测测看 👉',
      shareText: '我在茅山趣测测出古代身份是将军！你穿越回古代是什么人？👉',
      percent: '15%'
    },
    merchant: {
      title: '富商/商贾 💰', sum: '天下熙熙，皆为利来',
      brief: '你对钱有天然的嗅觉。别人看到的是商品，你看到的是利润。放古代你就是沈万三。',
      rank: '一品·富甲', rarity: '热门 · 全国25%',
      tagline: '我不是抠，我是在践行经济学原理 💰',
      othersView: '觉得你太精明，什么都算得太清楚',
      trueSelf: '你算得清是为了保护家人，你对他们最慷慨',
      strengths: '商业头脑 / 务实 / 果断', weaknesses: '太务实 / 有时显得功利',
      career: '经商 / 金融 / 投资 / 贸易', ratings: { 武力: 4, 智慧: 8, 财富: 10, 魅力: 6 },
      conversation: '我在古代居然是个富商！💰 你是什么身份？测测看 👉',
      shareText: '我在茅山趣测测出古代身份是富商！你穿越回古代是什么人？👉',
      percent: '25%'
    },
    scholar: {
      title: '文人/谋士 📜', sum: '腹有诗书气自华',
      brief: '你是智慧的化身。不喜欢打打杀杀，但你的脑子就是最厉害的武器。运筹帷幄决胜千里。',
      rank: '一品·军师', rarity: '稀有 · 全国仅12%',
      tagline: '我不说话的时候，都是在心里写诗 📜',
      othersView: '觉得你太闷太安静，不好玩',
      trueSelf: '你的世界比他们想象的有趣一百倍',
      strengths: '聪明 / 深度思考 / 有远见', weaknesses: '孤傲 / 不善于社交',
      career: '学术 / 咨询 / 编程 / 法律', ratings: { 武力: 3, 智慧: 10, 财富: 6, 魅力: 5 },
      conversation: '我在古代居然是个谋士！📜 你是什么身份？测测看 👉',
      shareText: '我在茅山趣测测出古代身份是谋士！你穿越回古代是什么人？👉',
      percent: '12%'
    },
    hero: {
      title: '侠客/豪杰 🗡️', sum: '十步杀一人，千里不留行',
      brief: '你骨子里是自由不羁的侠客。向往江湖，讨厌束缚。路见不平必定拔刀相助。',
      rank: '一品·侠客', rarity: '稀有 · 全国仅10%',
      tagline: '别跟我谈体制，我是江湖人 🗡️',
      othersView: '觉得你不靠谱，太飘了',
      trueSelf: '你不是不靠谱，你只是不想被定义',
      strengths: '洒脱 / 勇敢 / 讲义气', weaknesses: '任性 / 冲动 / 讨厌规则',
      career: '自由职业 / 探险 / 体育 / 艺术', ratings: { 武力: 9, 智慧: 5, 财富: 4, 魅力: 8 },
      conversation: '我在古代居然是个侠客！🗡️ 你是什么身份？测测看 👉',
      shareText: '我在茅山趣测测出古代身份是侠客！你穿越回古代是什么人？👉',
      percent: '10%'
    }
  },

  scoring: {
    pickResult: function(scores) {
      const keys = ['general', 'merchant', 'scholar', 'hero'];
      let maxK = keys[0], maxV = scores[maxK] || 0;
      keys.forEach(k => { if ((scores[k] || 0) > maxV) { maxK = k; maxV = scores[k] || 0; } });
      return maxK;
    }
  }
};
