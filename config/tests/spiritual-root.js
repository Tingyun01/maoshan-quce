// ============================================================
// 灵根测试 · 快速测试（5题制）
// "修仙小说里你是什么灵根？"
// 基于网文修仙体系（公众领域概念）
// 仅限娱乐参考
// ============================================================
module.exports = {
  id: 'spiritual_root',
  name: '灵根测试',
  icon: '📿',
  desc: '5道题测出你的修仙灵根',
  qCount: 5,
  duration: '1分钟',
  tag: '',
  category: '趣味',
  disclaimer: '本测试结果仅供娱乐，不具任何科学依据',

  questions: [
    {
      id: 1, text: '你学习新东西的时候一般会？',
      options: [
        { text: '一点就通，学什么都快', score: { tianling: 2 } },
        { text: '需要花时间但能学会', score: { dipin: 2 } },
        { text: '只对感兴趣的东西学得快', score: { bianyiling: 2 } },
        { text: '没有师傅教就完全不行', score: { wuling: 2 } }
      ]
    },
    {
      id: 2, text: '你在人群中通常是？',
      options: [
        { text: '被注意到的那一个', score: { tianling: 1, bianyiling: 1 } },
        { text: '不显山不露水但很稳', score: { dipin: 2 } },
        { text: '喜欢做自己的事不太合群', score: { bianyiling: 1 } },
        { text: '默默跟在后面，不太显眼', score: { wuling: 2 } }
      ]
    },
    {
      id: 3, text: '遇到困难时你最常用的方法是？',
      options: [
        { text: '灵感爆发，一下就想到了', score: { tianling: 2 } },
        { text: '按部就班一步步来', score: { dipin: 2 } },
        { text: '换个角度试试', score: { bianyiling: 2 } },
        { text: '找人帮忙', score: { wuling: 2 } }
      ]
    },
    {
      id: 4, text: '你最喜欢哪种修炼方式？',
      options: [
        { text: '闭关修炼——一飞冲天', score: { tianling: 2 } },
        { text: '勤修苦练——滴水穿石', score: { dipin: 2 } },
        { text: '随心所欲——随缘顿悟', score: { bianyiling: 2 } },
        { text: '有师门带——一起进步', score: { wuling: 2 } }
      ]
    },
    {
      id: 5, text: '如果有一天觉醒了灵力，你最先想？',
      options: [
        { text: '我要当最厉害的修士', score: { tianling: 2 } },
        { text: '脚踏实地先打好基础', score: { dipin: 2 } },
        { text: '先试试能做什么好玩的事', score: { bianyiling: 2 } },
        { text: '哇——我终于不是凡人了', score: { wuling: 2 } }
      ]
    }
  ],

  resultTypes: ['tianling', 'dipin', 'bianyiling', 'wuling'],

  results: {
    tianling: {
      title: '天灵根 🌟', sum: '天赋异禀，修炼天才',
      brief: '恭喜你！天灵根是万中无一的天才。你学什么会什么，天生的主角命。但你要小心——天才往往最容易被嫉妒。',
      rank: '极品·天灵根', rarity: '极稀有 · 全国仅3%',
      tagline: '我不是在装X，我只是天生就比别人快 🌟',
      othersView: '觉得你太凡尔赛了，什么都会还装谦虚',
      trueSelf: '你真的没有凡尔赛，你是真的觉得那些很简单',
      strengths: '天赋极佳 / 学习力强 / 主角光环', weaknesses: '骄傲 / 容易遭人嫉妒',
      career: '科研 / 艺术 / 创业 / 竞技', ratings: { 灵力: 10, 悟性: 10, 毅力: 5, 低调: 2 },
      conversation: '我居然是万中无一的天灵根！🌟 你是什么灵根？测测看 👉',
      shareText: '我的修仙灵根居然是极品天灵根！你是什么灵根？快来测 👉',
      percent: '3%'
    },
    dipin: {
      title: '地品灵根 🏔️', sum: '根基深厚，大器晚成',
      brief: '你不是最亮的星，但你是走得最远的人。地品灵根的修士往往能修炼到最高境界，因为你靠的是扎实。',
      rank: '上品·地灵根', rarity: '常见 · 全国40%',
      tagline: '我不是笨，我只是慢——但我比所有人都走得远 🏔️',
      othersView: '觉得你资质平平，没什么特别的',
      trueSelf: '你的修行不需要别人看见，你知道自己在变强',
      strengths: '根基扎实 / 有毅力 / 后劲足', weaknesses: '进步慢 / 容易自我怀疑',
      career: '工程 / 金融 / 教育 / 管理', ratings: { 灵力: 7, 悟性: 6, 毅力: 10, 低调: 7 },
      conversation: '我测出是地品灵根，大器晚成！🏔️ 你是什么灵根？测测看 👉',
      shareText: '我的修仙灵根是地品灵根！厚积薄发型，你是什么灵根？快来测 👉',
      percent: '40%'
    },
    bianyiling: {
      title: '变异灵根 ⚡', sum: '异于常人，独辟蹊径',
      brief: '你天生和别人不一样。变异灵根不走寻常路，常人修百年你能用三十年赶超。但你容易走火入魔。',
      rank: '极品·变异灵根', rarity: '稀有 · 全国仅12%',
      tagline: '规则是给普通人定的，我走我自己的路 ⚡',
      othersView: '觉得你太怪，不合群，没法用常理判断',
      trueSelf: '你的"怪"正是你最值钱的地方',
      strengths: '独特 / 不拘一格 / 爆发力强', weaknesses: '不稳定 / 容易偏激',
      career: '设计 / 创意 / 科技 / 冒险', ratings: { 灵力: 9, 悟性: 9, 毅力: 6, 低调: 3 },
      conversation: '我居然是变异灵根！⚡ 你是什么灵根？测测看 👉',
      shareText: '我的修仙灵根居然是变异灵根！不按常理出牌，你是什么灵根？👉',
      percent: '12%'
    },
    wuling: {
      title: '无灵根 😅', sum: '凡人之躯，比肩神明',
      brief: '哈哈，你测出了无灵根！但这反而是最厉害的一种——你不靠灵力，靠的是纯纯的努力和运气。凡人也有凡人的仙缘！',
      rank: '顽铁·无灵根', rarity: '隐藏款 · 全国仅5%',
      tagline: '没有灵根？那又怎样，我有的是命和运 😅',
      othersView: '觉得你挺"惨"的，啥天赋都没有',
      trueSelf: '没有天赋恰好给了你独一无二的特质——你靠的是自己',
      strengths: '坚韧 / 接地气 / 最有提升空间', weaknesses: '起点低 / 要多努力',
      career: '什么都可以 / 关键是热爱', ratings: { 灵力: 1, 悟性: 8, 毅力: 10, 低调: 10 },
      conversation: '我测出了隐藏款——无灵根！😅 你是什么灵根？测测看 👉',
      shareText: '我的修仙灵根是隐藏款"无灵根"！凡人之躯比肩神明，你是什么灵根？👉',
      percent: '5%'
    }
  },

  scoring: {
    pickResult: function(scores) {
      const keys = ['tianling', 'dipin', 'bianyiling', 'wuling'];
      let maxK = keys[0], maxV = scores[maxK] || 0;
      keys.forEach(k => { if ((scores[k] || 0) > maxV) { maxK = k; maxV = scores[k] || 0; } });
      return maxK;
    }
  }
};
