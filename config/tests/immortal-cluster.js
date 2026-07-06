// ============================================================
// 群仙谱 · 快速测试（5题制）
// "仙界职业大揭秘：你的仙侠身份是什么？"
// 原创仙侠身份，无版权问题
// 仅限娱乐参考
// ============================================================
module.exports = {
  id: 'immortal_cluster',
  name: '群仙谱',
  icon: '🌟',
  desc: '5道题揭晓你的仙侠身份',
  qCount: 5,
  duration: '1分钟',
  tag: '',
  category: '趣味',
  disclaimer: '本测试结果仅供娱乐，不具任何科学依据',

  questions: [
    {
      id: 1, text: '上司给你一个不可能完成的任务，你？',
      options: [
        { text: '一剑破万法，直接杀出一条血路', score: { sword_immortal: 2 } },
        { text: '画符布阵，用智慧找到捷径', score: { talisman_master: 2 } },
        { text: '顺其自然，随缘就好', score: { free_immortal: 2 } },
        { text: '召唤灵兽帮忙分担压力', score: { spirit_tamer: 2 } }
      ]
    },
    {
      id: 2, text: '你最接近下面哪种性格？',
      options: [
        { text: '锋芒毕露，实力就是话语权', score: { sword_immortal: 2 } },
        { text: '冷静睿智，胸中有丘壑', score: { talisman_master: 2 } },
        { text: '随遇而安，荣辱不惊', score: { free_immortal: 2 } },
        { text: '温柔善良，与万物为善', score: { spirit_tamer: 2 } }
      ]
    },
    {
      id: 3, text: '你最看重的"道"是什么？',
      options: [
        { text: '一往无前，以攻为守', score: { sword_immortal: 2 } },
        { text: '运筹帷幄，以理服人', score: { talisman_master: 2 } },
        { text: '心无挂碍，来去如风', score: { free_immortal: 2 } },
        { text: '万物共生，天地和谐', score: { spirit_tamer: 2 } }
      ]
    },
    {
      id: 4, text: '你最喜欢哪种战斗风格？',
      options: [
        { text: '剑气如虹——快！准！狠！', score: { sword_immortal: 2 } },
        { text: '符阵变化——困敌于无形', score: { talisman_master: 2 } },
        { text: '身法飘逸——你打不到我', score: { free_immortal: 2 } },
        { text: '灵兽助阵——并肩作战', score: { spirit_tamer: 2 } }
      ]
    },
    {
      id: 5, text: '如果给你一个愿望？',
      options: [
        { text: '一剑斩尽天下不平事', score: { sword_immortal: 2 } },
        { text: '参透天地间所有奥秘', score: { talisman_master: 2 } },
        { text: '逍遥天地间，不负此生', score: { free_immortal: 2 } },
        { text: '守护世间一切美好生灵', score: { spirit_tamer: 2 } }
      ]
    }
  ],

  resultTypes: ['sword_immortal', 'talisman_master', 'free_immortal', 'spirit_tamer'],

  results: {
    sword_immortal: {
      title: '剑仙 🗡️', sum: '一剑光寒十九洲',
      brief: '你天生凌厉，骨子里有一股不服输的劲儿。遇山开路、遇水搭桥，用实力碾压一切困难。',
      rank: '极品·剑仙', rarity: '稀有 · 全国仅8%',
      tagline: '我有一剑，可斩星辰可破天 🗡️',
      othersView: '觉得你太锋利，相处有压力',
      trueSelf: '你不是咄咄逼人，你只是信奉实力',
      strengths: '果敢 / 独立 / 行动力超强', weaknesses: '冲动 / 太刚 / 不懂妥协',
      career: '竞技 / 创业 / 武术 / 探险', ratings: { 战力: 10, 法术: 8, 智慧: 6, 人缘: 5 },
      conversation: '仙界职业揭秘！我居然是一剑无敌的剑仙！🗡️ 你是什么仙职？👉',
      shareText: '我在茅山趣测测出是剑仙！一剑光寒十九洲 🗡️ 你是什么仙界职业？测测看 👉',
      percent: '8%'
    },
    talisman_master: {
      title: '符师 📜', sum: '一笔画天地，万法皆在符',
      brief: '你冷静睿智，习惯用脑子解决问题。别人还在打打杀杀，你已经用一张符困住了全场。',
      rank: '极品·符师', rarity: '稀有 · 全国仅10%',
      tagline: '你以为我只会画符？这一笔下去，天都要变 📜',
      othersView: '觉得你太深沉，猜不透',
      trueSelf: '你不需要别人懂，结果会替你解释一切',
      strengths: '谋略 / 冷静 / 知识渊博', weaknesses: '太高冷 / 不轻易表达',
      career: '科研 / 策略 / 法律 / 编程', ratings: { 战力: 6, 法术: 10, 智慧: 10, 人缘: 5 },
      conversation: '仙界职业揭秘！我居然是一符定乾坤的符师！📜 你是什么仙职？👉',
      shareText: '我在茅山趣测测出是符师！一笔画天地 📜 你是什么仙界职业？测测看 👉',
      percent: '10%'
    },
    free_immortal: {
      title: '散仙 ☁️', sum: '逍遥天地间，来去都随风',
      brief: '你天生自由奔放，名利荣辱都看得很淡。云游四海、随遇而安，是真正的潇洒之人。',
      rank: '上品·散仙', rarity: '热门 · 全国20%',
      tagline: '天大地大，哪里都是我的道场 ☁️',
      othersView: '觉得你太佛系，不上进',
      trueSelf: '你只是比谁都清楚什么才是真正重要的',
      strengths: '洒脱 / 自在 / 心态好', weaknesses: '太散漫 / 不够努力',
      career: '旅行 / 自由职业 / 艺术 / 哲学', ratings: { 战力: 7, 法术: 7, 智慧: 8, 人缘: 7 },
      conversation: '仙界职业揭秘！我居然是逍遥散仙！☁️ 你是什么仙职？👉',
      shareText: '我在茅山趣测测出是散仙！逍遥天地间 ☁️ 你是什么仙界职业？测测看 👉',
      percent: '20%'
    },
    spirit_tamer: {
      title: '御灵师 🦊', sum: '天地万物，皆为知音',
      brief: '你有一颗温柔的心，能与万物共鸣。鸟兽虫鱼都愿意靠近你，你是自然界最受欢迎的人。',
      rank: '极品·御灵师', rarity: '稀有 · 全国仅6%',
      tagline: '别怕，这只九尾狐是我的好朋友 🦊',
      othersView: '觉得你太好心，容易吃亏',
      trueSelf: '你不是傻，你只是相信善意能改变世界',
      strengths: '温柔 / 共情 / 善解人意', weaknesses: '心太软 / 不会拒绝',
      career: '教育 / 医疗 / 动保 / 环保', ratings: { 战力: 5, 法术: 9, 智慧: 7, 人缘: 10 },
      conversation: '仙界职业揭秘！我居然是与万物共鸣的御灵师！🦊 你是什么仙职？👉',
      shareText: '我在茅山趣测测出是御灵师！天地万物皆我友 🦊 你是什么仙界职业？测测看 👉',
      percent: '6%'
    }
  },

  scoring: {
    pickResult: function(scores) {
      const keys = ['sword_immortal', 'talisman_master', 'free_immortal', 'spirit_tamer'];
      let maxK = keys[0], maxV = scores[maxK] || 0;
      keys.forEach(k => { if ((scores[k] || 0) > maxV) { maxK = k; maxV = scores[k] || 0; } });
      return maxK;
    }
  }
};
