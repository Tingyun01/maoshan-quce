module.exports = {
  id: 'animal_personality',
  name: '你的隐藏动物人格',
  description: '30道题发现你内心住着什么动物',
  icon: '灵',
  questions: [
    // ===== 第1-10题（原有，保留并优化）=====
    { id: 1, text: '在团队中你通常扮演什么角色？', options: [
      { text: '带领大家向前走', score: { lion: 2, wolf: 1 } },
      { text: '默默执行任务', score: { bear: 2, deer: 1 } },
      { text: '调解气氛让大家开心', score: { dolphin: 2, cat: 1 } }
    ]},
    { id: 2, text: '你更喜欢什么样的社交环境？', options: [
      { text: '热闹的大圈子', score: { dolphin: 2, lion: 1 } },
      { text: '三五好友小聚', score: { wolf: 2, cat: 1 } },
      { text: '独处最舒服', score: { bear: 2, deer: 1 } }
    ]},
    { id: 3, text: '遇到困难时你通常会？', options: [
      { text: '迎难而上正面刚', score: { lion: 2, wolf: 1 } },
      { text: '先观察再行动', score: { cat: 2, bear: 1 } },
      { text: '寻求朋友帮助', score: { dolphin: 2, deer: 1 } }
    ]},
    { id: 4, text: '朋友会用以下哪个词形容你？', options: [
      { text: '可靠', score: { bear: 2, wolf: 1 } },
      { text: '温暖', score: { dolphin: 2, deer: 1 } },
      { text: '有力量', score: { lion: 2, cat: 1 } }
    ]},
    { id: 5, text: '你理想中的周末是？', options: [
      { text: '和朋友一起探险', score: { lion: 2, dolphin: 1 } },
      { text: '窝在家里看书追剧', score: { cat: 2, bear: 1 } },
      { text: '去大自然走走', score: { deer: 2, wolf: 1 } }
    ]},
    { id: 6, text: '你如何处理冲突？', options: [
      { text: '直接面对解决', score: { lion: 2, wolf: 1 } },
      { text: '委婉回避', score: { deer: 2, cat: 1 } },
      { text: '找大家坐下来谈', score: { dolphin: 2, bear: 1 } }
    ]},
    { id: 7, text: '你最大的优势是什么？', options: [
      { text: '勇气和决断力', score: { lion: 2, wolf: 1 } },
      { text: '同理心和包容', score: { dolphin: 2, deer: 1 } },
      { text: '耐心和坚持', score: { bear: 2, cat: 1 } }
    ]},
    { id: 8, text: '你对变化的反应是？', options: [
      { text: '兴奋，拥抱变化', score: { dolphin: 2, lion: 1 } },
      { text: '谨慎，需要适应', score: { bear: 2, cat: 1 } },
      { text: '观察，随机应变', score: { wolf: 2, deer: 1 } }
    ]},
    { id: 9, text: '什么让你感到最有成就感？', options: [
      { text: '带领团队完成目标', score: { lion: 2, wolf: 1 } },
      { text: '帮助别人解决问题', score: { dolphin: 2, deer: 1 } },
      { text: '独自完成一项挑战', score: { cat: 2, bear: 1 } }
    ]},
    { id: 10, text: '你希望别人怎么记住你？', options: [
      { text: '一个值得信赖的人', score: { bear: 2, wolf: 1 } },
      { text: '一个温暖快乐的人', score: { dolphin: 2, deer: 1 } },
      { text: '一个独特有个性的人', score: { cat: 2, lion: 1 } }
    ]},
    // ===== 第11-30题（扩建）=====
    { id: 11, text: '你在聚会上是哪种角色？', options: [
      { text: '组织者和灵魂人物', score: { lion: 2, dolphin: 1 } },
      { text: '默默照顾每个人的人', score: { bear: 2, deer: 1 } },
      { text: '角落观察者，偶尔吐槽', score: { cat: 2, wolf: 1 } }
    ]},
    { id: 12, text: '你的朋友圈状态通常是？', options: [
      { text: '经常发，记录生活点滴', score: { dolphin: 2, lion: 1 } },
      { text: '偶尔发，只发精华内容', score: { cat: 2, wolf: 1 } },
      { text: '几乎不发，只看不说话', score: { bear: 2, deer: 1 } }
    ]},
    { id: 13, text: '面对别人的请求，你通常？', options: [
      { text: '能帮就帮，不太会拒绝', score: { bear: 2, dolphin: 1 } },
      { text: '先评估，合理才答应', score: { lion: 2, wolf: 1 } },
      { text: '看心情，不想帮就婉拒', score: { cat: 2, deer: 1 } }
    ]},
    { id: 14, text: '你更看重友谊中的什么？', options: [
      { text: '忠诚和信任', score: { wolf: 2, bear: 1 } },
      { text: '快乐和共同话题', score: { dolphin: 2, lion: 1 } },
      { text: '理解和共鸣', score: { deer: 2, cat: 1 } }
    ]},
    { id: 15, text: '你的工作/学习节奏是？', options: [
      { text: '早起打卡，效率最高', score: { lion: 2, bear: 1 } },
      { text: '夜猫子，晚上更有灵感', score: { cat: 2, wolf: 1 } },
      { text: '随性，状态好就猛干', score: { dolphin: 2, deer: 1 } }
    ]},
    { id: 16, text: '你旅行时更偏向？', options: [
      { text: '打卡景点，全部玩到', score: { lion: 2, dolphin: 1 } },
      { text: '找个舒服的地方发呆', score: { bear: 2, cat: 1 } },
      { text: '随遇而安，走到哪算哪', score: { deer: 2, wolf: 1 } }
    ]},
    { id: 17, text: '你对规矩和制度的态度是？', options: [
      { text: '必须遵守，没有规矩不成方圆', score: { lion: 2, bear: 1 } },
      { text: '可以灵活一点，看情况', score: { wolf: 2, deer: 1 } },
      { text: '规矩是给别人的，我有自己的方式', score: { cat: 2, dolphin: 1 } }
    ]},
    { id: 18, text: '你在恋爱中更偏向？', options: [
      { text: '主动追求，全力投入', score: { lion: 2, dolphin: 1 } },
      { text: '慢慢来，先确定对方真心', score: { deer: 2, bear: 1 } },
      { text: '保持独立，不给彼此压力', score: { cat: 2, wolf: 1 } }
    ]},
    { id: 19, text: '你更羡慕哪种动物的特质？', options: [
      { text: '雄鹰，自由翱翔', score: { cat: 2, lion: 1 } },
      { text: '狼群，团结协作', score: { wolf: 2, bear: 1 } },
      { text: '小鹿，灵动优雅', score: { deer: 2, dolphin: 1 } }
    ]},
    { id: 20, text: '你的穿搭风格更偏向？', options: [
      { text: '正式得体，给人专业感', score: { lion: 2, bear: 1 } },
      { text: '舒适随性，怎么舒服怎么来', score: { cat: 2, deer: 1 } },
      { text: '有个性，不想和别人一样', score: { dolphin: 2, wolf: 1 } }
    ]},
    { id: 21, text: '面对不公正的事你通常？', options: [
      { text: '直接站出来，不能忍', score: { lion: 2, wolf: 1 } },
      { text: '在心里记下，找合适时机说', score: { cat: 2, deer: 1 } },
      { text: '先安慰受影响的人', score: { dolphin: 2, bear: 1 } }
    ]},
    { id: 22, text: '你的消费习惯更偏向？', options: [
      { text: '该花就花，体验最重要', score: { lion: 2, dolphin: 1 } },
      { text: '比较理性，会做攻略比价', score: { bear: 2, wolf: 1 } },
      { text: '不太在意，能用就行', score: { cat: 2, deer: 1 } }
    ]},
    { id: 23, text: '你在群体决策中更？', options: [
      { text: '主动发表意见，推动决定', score: { lion: 2, dolphin: 1 } },
      { text: '听大家的，最后才说自己的看法', score: { bear: 2, deer: 1 } },
      { text: '只和信任的人分享真实想法', score: { wolf: 2, cat: 1 } }
    ]},
    { id: 24, text: '你更希望自己拥有哪种能力？', options: [
      { text: '超强的领导力和影响力', score: { lion: 2, dolphin: 1 } },
      { text: '超强的洞察力和感知力', score: { deer: 2, cat: 1 } },
      { text: '超强的执行力和耐力', score: { bear: 2, wolf: 1 } }
    ]},
    { id: 25, text: '你的幽默风格更偏向？', options: [
      { text: '大大咧咧，自黑型', score: { dolphin: 2, lion: 1 } },
      { text: '冷幽默，需要慢慢品', score: { cat: 2, wolf: 1 } },
      { text: '暖心幽默，让人如沐春风', score: { bear: 2, deer: 1 } }
    ]},
    { id: 26, text: '你对"家"的理解更偏向？', options: [
      { text: '一个可以充电休息的私人空间', score: { cat: 2, bear: 1 } },
      { text: '和家人朋友聚在一起的地方', score: { dolphin: 2, deer: 1 } },
      { text: '一个可以展示自己实力的基地', score: { lion: 2, wolf: 1 } }
    ]},
    { id: 27, text: '你更容易被哪种人吸引？', options: [
      { text: '有主见、有力量的人', score: { lion: 2, wolf: 1 } },
      { text: '温柔、善解人意的人', score: { deer: 2, bear: 1 } },
      { text: '有趣、不按常理出牌的人', score: { dolphin: 2, cat: 1 } }
    ]},
    { id: 28, text: '你的座右铭更偏向？', options: [
      { text: '知行合一，说到做到', score: { lion: 2, bear: 1 } },
      { text: '随遇而安，顺其自然', score: { deer: 2, cat: 1 } },
      { text: '快乐第一，其他其次', score: { dolphin: 2, wolf: 1 } }
    ]},
    { id: 29, text: '你更希望被怎样对待？', options: [
      { text: '被尊重和认可', score: { lion: 2, wolf: 1 } },
      { text: '被理解和接纳', score: { deer: 2, cat: 1 } },
      { text: '被关心和照顾', score: { dolphin: 2, bear: 1 } }
    ]},
    { id: 30, text: '如果可以选，你希望自己的动物图腾是？', options: [
      { text: '狮子——王者风范', score: { lion: 2 } },
      { text: '狼——智慧忠诚', score: { wolf: 2 } },
      { text: '海豚——快乐智慧', score: { dolphin: 2 } },
      { text: '猫——独立优雅', score: { cat: 2 } },
      { text: '熊——温暖可靠', score: { bear: 2 } },
      { text: '鹿——灵动敏感', score: { deer: 2 } }
    ]}
  ],
  scoring: {
    dimensions: ['lion', 'wolf', 'dolphin', 'cat', 'bear', 'deer'],
    dimDisplayMap: { lion: '狮子', wolf: '狼', dolphin: '海豚', cat: '猫', bear: '熊', deer: '鹿' },
    getType(scores) {
      const types = ['lion', 'wolf', 'dolphin', 'cat', 'bear', 'deer'];
      let max = 0, type = 'lion';
      types.forEach(t => {
        if ((scores[t] || 0) > max) { max = scores[t]; type = t; }
      });
      return type;
    }
  },
  results: {
    'lion': {
      title: '狮子 🦁',
      sum: '天生的领导者',
      brief: '你勇敢、自信、有决断力。像狮子一样，你天生就有领导气质，在困难面前不退缩。你的热情和力量感染着身边的人，让大家愿意跟随你。有时候你可能显得有点强势，但那只是因为你太想保护大家在乎的人了。',
      rank: '王者·领袖',
      tagline: '我就是那种：团队里没人站出来时，我第一个上的那种人 💪',
      rarity: '常见 · 全国约18%',
      percent: '18%',
      strengths: '果断、有领导力、勇敢、可靠',
      weaknesses: '太强势、不善示弱、对人要求高',
      career: '管理、创业、公关、政治',
      conversation: '测出我是狮子型人格！天生领袖，你呢？快来测测',
      ratings: { '领导力': 9, '勇气': 8, '决断力': 9, '社交力': 6, '耐心': 4 }
    },
    'wolf': {
      title: '狼 🐺',
      sum: '忠诚的团队玩家',
      brief: '你忠诚、聪明、有团队精神。像狼一样，你懂得协作的力量，既能在团队中发挥作用，也能独立完成任务。你对朋友极其忠诚，是那种"有我在，你放心"的人。你的智慧不在于张扬，而在于在关键时刻总能给出最实际的建议。',
      rank: '智者·协作家',
      tagline: '我就是那种：朋友有事第一个到场，没事也经常出现的那种人 🐾',
      rarity: '常见 · 全国约16%',
      percent: '16%',
      strengths: '忠诚、聪明、有团队精神、可靠',
      weaknesses: '太在意群体、不善表达个人需求、有点固执',
      career: '项目管理、数据分析、科研、技术',
      conversation: '狼型人格就是我！忠诚又聪明，你是什么动物人格？',
      ratings: { '忠诚度': 9, '团队力': 9, '智慧': 7, '独立力': 6, '社交力': 5 }
    },
    'dolphin': {
      title: '海豚 🐬',
      sum: '快乐的社交家',
      brief: '你友善、聪明、充满活力。像海豚一样，你喜欢与人交往，善于沟通协调。你的乐观和温暖让周围的人感到快乐，是团队里的开心果和黏合剂。你有着惊人的情商，能在不知不觉中化解尴尬和冲突。朋友的心情好坏，你比他们还先知道。',
      rank: '开心果·外交官',
      tagline: '我就是那种：聚会上唯一能让陌生人和陌生人聊起来的人 😄',
      rarity: '常见 · 全国约20%',
      percent: '20%',
      strengths: '友善、聪明、有感染力、善于沟通',
      weaknesses: '太在意别人看法、容易情绪化、不够专注',
      career: '公关、销售、教育、活动策划',
      conversation: '测出我是海豚型人格！快乐使者就是我，你呢？',
      ratings: { '社交力': 9, '乐观度': 8, '沟通力': 9, '独立力': 4, '耐心': 5 }
    },
    'cat': {
      title: '猫 🐱',
      sum: '自由的独立者',
      brief: '你独立、优雅、有自己的节奏。像猫一样，你享受独处，但也不排斥陪伴。你有着独特的审美和品味，总是按自己的方式生活。你不是高冷，只是不需要通过迎合别人来证明自己的价值。你的魅力在于：你越不在乎，别人越被你吸引。',
      rank: '独行侠·艺术家',
      tagline: '我就是那种：你可以约我出来，但我可能不会来的那种人 😼',
      rarity: '常见 · 全国约15%',
      percent: '15%',
      strengths: '独立、有品味、真实、不随波逐流',
      weaknesses: '不善主动、有点自我、难以捉摸',
      career: '设计、写作、艺术、自由职业',
      conversation: '猫型人格就是我！独立有范儿，你是什么动物人格？',
      ratings: { '独立力': 9, '品味': 8, '神秘感': 7, '社交力': 3, '耐心': 5 }
    },
    'bear': {
      title: '熊 🐻',
      sum: '温暖的守护者',
      brief: '你稳重、可靠、给人安全感。像熊一样，你看起来可能有些慢热，但只要接触就会发现你的温暖。你是身边人最信赖的依靠，朋友的情绪垃圾桶，但你也懂得在适当的时候展现自己的力量。你不爱炫耀，但你的好，大家都记在心里。',
      rank: '守护者·暖男/暖女',
      tagline: '我就是那种：朋友说"借你肩膀靠一下"，然后在我肩膀上哭半小时的人 🐻',
      rarity: '常见 · 全国约18%',
      percent: '18%',
      strengths: '可靠、温暖、有耐心、值得信赖',
      weaknesses: '太迁就别人、不懂表达需求、容易压抑自己',
      career: '行政、人事、医疗、教育',
      conversation: '测出我是熊型人格！暖到发烫的那种，你呢？',
      ratings: { '可靠度': 9, '温暖度': 9, '耐心': 8, '社交力': 4, '冒险精神': 3 }
    },
    'deer': {
      title: '鹿 🦌',
      sum: '温柔的感知者',
      brief: '你敏感、温柔、有灵性。像鹿一样，你对周围的环境有着敏锐的感知力。你善良而谦和，总能用温柔的方式化解冲突。你的直觉很强，经常能感知到别人没说出口的话。你可能不太爱出风头，但你的存在，让这个世界温柔了几分。',
      rank: '灵者·感知家',
      tagline: '我就是那种：大家说完话，我说"我懂你的意思"，然后大家都惊讶的那种人 🦌',
      rarity: '稀有 · 全国仅13%',
      percent: '13%',
      strengths: '敏感、温柔、有直觉、善解人意',
      weaknesses: '太敏感、容易受伤、不够坚定',
      career: '心理咨询、写作、艺术、医疗',
      conversation: '测出我是鹿型人格！温柔有灵性，你是什么动物人格？',
      ratings: { '敏感度': 9, '温柔度': 9, '直觉力': 8, '社交力': 5, '坚韧度': 4 }
    },
    'default': {
      title: '神秘生物 🦄',
      sum: '独一无二的你',
      brief: '你是无法被简单定义的，每一种动物的特质在你身上都有体现！你可能在不同场景下展现出不同的动物人格，这才是你最特别的地方。',
      rank: '隐藏·多变体',
      tagline: '我就是我，六种动物于一体的神奇物种 🦄',
      rarity: '极稀有 · 全国仅1%',
      percent: '1%',
      strengths: '多面性、适应力强、不可预测',
      weaknesses: '可能被误解为"善变"',
      career: '各种都有可能，看你心情',
      conversation: '我的动物人格有点特别，你来测测你是什么？',
      ratings: { '多变': 9, '神秘': 8, '有趣': 9 }
    }
  },
  aiPrompt: '用户完成了动物人格测试，结果是{type}型。请写一段200字的个性化分析：1)这个动物人格的核心特质 2)在日常生活和社交中的表现 3)给这种人格的一个小建议。语气要温暖有趣。'
};
