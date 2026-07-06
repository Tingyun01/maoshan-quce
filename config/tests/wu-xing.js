module.exports = {
  id: 'wu_xing',
  name: '五行人格',
  description: '30道题探索你的五行性格偏向',
  icon: '☯️',
  questions: [
    { id: 1, text: '在团队中你通常扮演什么角色？', options: [
      { text: '果断决策，带领方向', score: { jin: 1 } },
      { text: '灵活变通，适应变化', score: { shui: 1 } },
      { text: '温暖包容，凝聚团队', score: { tu: 1 } },
      { text: '积极推动，点燃热情', score: { huo: 1 } },
      { text: '耐心倾听，默默支持', score: { mu: 1 } }
    ]},
    { id: 2, text: '你更喜欢哪种工作方式？', options: [
      { text: '按计划有条不紊推进', score: { jin: 1 } },
      { text: '先思考再行动', score: { shui: 1 } },
      { text: '稳扎稳打，步步为营', score: { tu: 1 } },
      { text: '充满激情，快速行动', score: { huo: 1 } },
      { text: '循序渐进，注重细节', score: { mu: 1 } }
    ]},
    { id: 3, text: '朋友通常用哪个词形容你？', options: [
      { text: '靠谱', score: { jin: 1 } },
      { text: '聪明', score: { shui: 1 } },
      { text: '温和', score: { tu: 1 } },
      { text: '有活力', score: { huo: 1 } },
      { text: '有耐心', score: { mu: 1 } }
    ]},
    { id: 4, text: '遇到困难时你的第一反应是？', options: [
      { text: '分析问题寻找规律', score: { jin: 1 } },
      { text: '冷静观察再想办法', score: { shui: 1 } },
      { text: '先稳住情绪再说', score: { tu: 1 } },
      { text: '马上行动解决问题', score: { huo: 1 } },
      { text: '慢慢思考理清思路', score: { mu: 1 } }
    ]},
    { id: 5, text: '你更倾向于哪种休闲方式？', options: [
      { text: '阅读或学习新技能', score: { jin: 1 } },
      { text: '独处冥想或思考', score: { shui: 1 } },
      { text: '在家放松休息', score: { tu: 1 } },
      { text: '外出聚会或运动', score: { huo: 1 } },
      { text: '养花种草或手工', score: { mu: 1 } }
    ]},
    { id: 6, text: '你做决定时更看重什么？', options: [
      { text: '原则和规矩', score: { jin: 1 } },
      { text: '长远的影响', score: { shui: 1 } },
      { text: '大家的感受', score: { tu: 1 } },
      { text: '当下的机会', score: { huo: 1 } },
      { text: '过程的完整性', score: { mu: 1 } }
    ]},
    { id: 7, text: '你最大的优势是什么？', options: [
      { text: '坚韧不拔的意志', score: { jin: 1 } },
      { text: '随机应变的智慧', score: { shui: 1 } },
      { text: '包容稳重的性格', score: { tu: 1 } },
      { text: '积极乐观的态度', score: { huo: 1 } },
      { text: '细腻周全的心思', score: { mu: 1 } }
    ]},
    { id: 8, text: '你如何看待规则和制度？', options: [
      { text: '规则是必须遵守的', score: { jin: 1 } },
      { text: '规则可以灵活变通', score: { shui: 1 } },
      { text: '规则要有但别太死板', score: { tu: 1 } },
      { text: '规则有时需要打破', score: { huo: 1 } },
      { text: '规则是参考，看情况而定', score: { mu: 1 } }
    ]},
    { id: 9, text: '你的情绪状态通常偏向？', options: [
      { text: '稳定沉着', score: { jin: 1 } },
      { text: '平和宁静', score: { shui: 1 } },
      { text: '温和包容', score: { tu: 1 } },
      { text: '热烈外放', score: { huo: 1 } },
      { text: '细腻敏感', score: { mu: 1 } }
    ]},
    { id: 10, text: '你更擅长处理哪种类型的事？', options: [
      { text: '需要逻辑分析的事', score: { jin: 1 } },
      { text: '需要创意策划的事', score: { shui: 1 } },
      { text: '需要耐心细致的事', score: { tu: 1 } },
      { text: '需要沟通协调的事', score: { huo: 1 } },
      { text: '需要仔细规划的事', score: { mu: 1 } }
    ]},
    { id: 11, text: '在人际关系中你偏向？', options: [
      { text: '君子之交淡如水', score: { jin: 1 } },
      { text: '随缘自然', score: { shui: 1 } },
      { text: '真诚长久', score: { tu: 1 } },
      { text: '热情交心', score: { huo: 1 } },
      { text: '润物细无声', score: { mu: 1 } }
    ]},
    { id: 12, text: '你希望自己变得更？', options: [
      { text: '更坚定有力量', score: { jin: 1 } },
      { text: '更有智慧洞察', score: { shui: 1 } },
      { text: '更踏实稳重', score: { tu: 1 } },
      { text: '更有热情感染力', score: { huo: 1 } },
      { text: '更有耐心和包容力', score: { mu: 1 } }
    ]},
    { id: 13, text: '面对变化你通常会？', options: [
      { text: '坚持自己的节奏', score: { jin: 1 } },
      { text: '顺势而为', score: { shui: 1 } },
      { text: '慢慢适应', score: { tu: 1 } },
      { text: '主动拥抱变化', score: { huo: 1 } },
      { text: '仔细评估后再决定', score: { mu: 1 } }
    ]},
    { id: 14, text: '你的做事风格是？', options: [
      { text: '目标明确，直奔主题', score: { jin: 1 } },
      { text: '深思熟虑后再行动', score: { shui: 1 } },
      { text: '按部就班不急不躁', score: { tu: 1 } },
      { text: '说干就干，先做再说', score: { huo: 1 } },
      { text: '计划周全，步步推进', score: { mu: 1 } }
    ]},
    { id: 15, text: '你觉得最能代表你的颜色是？', options: [
      { text: '金色/白色', score: { jin: 1 } },
      { text: '黑色/蓝色', score: { shui: 1 } },
      { text: '棕色/黄色', score: { tu: 1 } },
      { text: '红色/橙色', score: { huo: 1 } },
      { text: '绿色/青色', score: { mu: 1 } }
    ]},
    // ===== 第16-30题（扩建）=====
    { id: 16, text: '你的沟通风格更接近？', options: [
      { text: '直接明了，有一说一', score: { jin: 1 } },
      { text: '含蓄委婉，点到为止', score: { shui: 1 } },
      { text: '温暖亲切，照顾感受', score: { tu: 1 } },
      { text: '热情洋溢，感染力强', score: { huo: 1 } },
      { text: '耐心倾听，慢条斯理', score: { mu: 1 } }
    ]},
    { id: 17, text: '你学习新东西时更偏向？', options: [
      { text: '系统学习，打牢基础', score: { jin: 1 } },
      { text: '理解原理，举一反三', score: { shui: 1 } },
      { text: '循序渐进，反复练习', score: { tu: 1 } },
      { text: '边做边学，实践出真知', score: { huo: 1 } },
      { text: '观察模仿，慢慢领悟', score: { mu: 1 } }
    ]},
    { id: 18, text: '面对压力时你的第一感觉是？', options: [
      { text: '必须顶住，不能倒下', score: { jin: 1 } },
      { text: '冷静观察，找破解之法', score: { shui: 1 } },
      { text: '稳住，一步一步来', score: { tu: 1 } },
      { text: '兴奋，压力就是动力', score: { huo: 1 } },
      { text: '有点焦虑，需要时间消化', score: { mu: 1 } }
    ]},
    { id: 19, text: '你更信任哪种类型的人？', options: [
      { text: '说到做到、原则性强的人', score: { jin: 1 } },
      { text: '聪明灵活、有想法的人', score: { shui: 1 } },
      { text: '踏实稳重、可靠的人', score: { tu: 1 } },
      { text: '热情大方、有感染力的人', score: { huo: 1 } },
      { text: '温和细腻、善解人意的人', score: { mu: 1 } }
    ]},
    { id: 20, text: '你的时间观念是？', options: [
      { text: '非常强，绝不迟到', score: { jin: 1 } },
      { text: '随缘，时间是有弹性的', score: { shui: 1 } },
      { text: '比较强，但偶尔会缓一缓', score: { tu: 1 } },
      { text: '随性， excitement 最重要', score: { huo: 1 } },
      { text: '不太在意，慢慢来就好', score: { mu: 1 } }
    ]},
    { id: 21, text: '你更擅长处理哪种矛盾？', options: [
      { text: '原则性矛盾，必须讲清楚', score: { jin: 1 } },
      { text: '复杂矛盾，需要智慧化解', score: { shui: 1 } },
      { text: '人际矛盾，用温情化解', score: { tu: 1 } },
      { text: '急性矛盾，当场解决', score: { huo: 1 } },
      { text: '长期矛盾，慢慢磨合', score: { mu: 1 } }
    ]},
    { id: 22, text: '你的消费观念是？', options: [
      { text: '该花就花，但要花在刀刃上', score: { jin: 1 } },
      { text: '理性消费，注重性价比', score: { shui: 1 } },
      { text: '量入为出，存点钱更安心', score: { tu: 1 } },
      { text: '开心最重要，钱花了再赚', score: { huo: 1 } },
      { text: '不太在意，够用就好', score: { mu: 1 } }
    ]},
    { id: 23, text: '你更向往哪种生活环境？', options: [
      { text: '秩序井然、有规则的城市', score: { jin: 1 } },
      { text: '自由包容、多元文化的城市', score: { shui: 1 } },
      { text: '安静舒适、有归属感的地方', score: { tu: 1 } },
      { text: '热闹活力、机会多的地方', score: { huo: 1 } },
      { text: '自然清新、节奏慢的地方', score: { mu: 1 } }
    ]},
    { id: 24, text: '你做计划的方式是？', options: [
      { text: '详细计划，每一步都考虑到', score: { jin: 1 } },
      { text: '大方向明确，细节灵活调整', score: { shui: 1 } },
      { text: '有大致安排，按部就班推进', score: { tu: 1 } },
      { text: '计划不如变化，随遇而安', score: { huo: 1 } },
      { text: '慢慢想，不急着定下来', score: { mu: 1 } }
    ]},
    { id: 25, text: '朋友遇到难题找你，你会？', options: [
      { text: '直接给建议，帮他做决定', score: { jin: 1 } },
      { text: '帮他分析利弊，让他自己选', score: { shui: 1 } },
      { text: '先陪伴，让他感觉不孤单', score: { tu: 1 } },
      { text: '带他出去散心，转移注意力', score: { huo: 1 } },
      { text: '耐心听他倾诉，理解他的感受', score: { mu: 1 } }
    ]},
    { id: 26, text: '你对"成功"的理解是？', options: [
      { text: '实现目标，证明自己', score: { jin: 1 } },
      { text: '不断成长，超越过去的自己', score: { shui: 1 } },
      { text: '安稳幸福，家庭和顺', score: { tu: 1 } },
      { text: '活出精彩，不留遗憾', score: { huo: 1 } },
      { text: '内心平静，做喜欢的事', score: { mu: 1 } }
    ]},
    { id: 27, text: '你的情绪表达方式更偏向？', options: [
      { text: '不轻易表达，但内心很坚定', score: { jin: 1 } },
      { text: '藏在心里，用行动表示', score: { shui: 1 } },
      { text: '温和地表达，不让人难堪', score: { tu: 1 } },
      { text: '直接表达，喜怒形于色', score: { huo: 1 } },
      { text: '细腻敏感，容易被触动', score: { mu: 1 } }
    ]},
    { id: 28, text: '你更看重朋友的哪种品质？', options: [
      { text: '诚信和原则', score: { jin: 1 } },
      { text: '智慧和见识', score: { shui: 1 } },
      { text: '可靠和陪伴', score: { tu: 1 } },
      { text: '热情和趣味', score: { huo: 1 } },
      { text: '理解和共鸣', score: { mu: 1 } }
    ]},
    { id: 29, text: '如果可以选一种超能力，你选？', options: [
      { text: '刀枪不入，无坚不摧', score: { jin: 1 } },
      { text: '读心术，看透所有人', score: { shui: 1 } },
      { text: '瞬间移动，去任何想去的地方', score: { tu: 1 } },
      { text: '控制火焰，所向披靡', score: { huo: 1 } },
      { text: '让万物生长，治愈一切', score: { mu: 1 } }
    ]},
    { id: 30, text: '你希望自己的墓志铭是？', options: [
      { text: '一个坚守原则的人', score: { jin: 1 } },
      { text: '一个看透世事的人', score: { shui: 1 } },
      { text: '一个温暖了他人的人', score: { tu: 1 } },
      { text: '一个热烈活过的人', score: { huo: 1 } },
      { text: '一个温柔了岁月的人', score: { mu: 1 } }
    ]}
  ],
  scoring: {
    dimensions: ['jin', 'mu', 'shui', 'huo', 'tu'],
    dimDisplayMap: { jin: '金', mu: '木', shui: '水', huo: '火', tu: '土' },
    getType(scores) {
      const types = ['jin', 'mu', 'shui', 'huo', 'tu'];
      let max = 0, type = 'tu';
      types.forEach(t => {
        if ((scores[t] || 0) > max) { max = scores[t]; type = t; }
      });
      return type;
    }
  },
  results: {
    'jin': {
      title: '金型人格 ⛰️',
      sum: '坚定果断，意志如金',
      brief: '你像金属一样坚韧纯粹——做事果断、原则性强、追求效率。你清楚自己要什么，不被外界轻易动摇。在工作中你是可靠的执行者，在生活中你是值得信赖的朋友。',
      rank: '上品·金刚',
      tagline: '我就是那种：定好的计划绝不改，改了就是你不讲理 💪',
      rarity: '常见 · 全国约22%',
      percent: '22%',
      strengths: '果断、靠谱、执行力强',
      weaknesses: '太固执、不善变通、容易得罪人',
      career: '管理、金融、法律、工程',
      conversation: '测出我是金型人格！坚定如金刚，你是什么型？',
      ratings: { 金: 9, 木: 4, 水: 5, 火: 6, 土: 7 }
    },
    'mu': {
      title: '木型人格 🌲',
      sum: '温和坚韧，生机勃勃',
      brief: '你像树木一样温和而坚韧——有耐心、善协调、注重细节。你有条不紊地推进每一件事，不急不躁却从不放弃。你像一棵大树，为身边的人提供荫蔽和支持。',
      rank: '中品·修竹',
      tagline: '我就是那种：表面波澜不惊，心里已经把方案想了三遍的人 🌱',
      rarity: '常见 · 全国约20%',
      percent: '20%',
      strengths: '有耐心、善协调、注重细节',
      weaknesses: '不善拒绝、容易纠结、行动力慢',
      career: '教育、医疗、科研、设计',
      conversation: '我是木型人格！温和有力量，你呢？来测测 →',
      ratings: { 金: 4, 木: 9, 水: 6, 火: 4, 土: 7 }
    },
    'shui': {
      title: '水型人格 🌊',
      sum: '智慧灵动，顺势而为',
      brief: '你像水一样智慧灵动——善于变通、洞察力强。你能适应各种环境，在人群中不张扬却不可或缺。你既有敏锐的洞察力，又有天然的亲和力。',
      rank: '上品·智者',
      tagline: '朋友都说我"心眼子多"，但我觉得这叫高情商好吗 🧠',
      rarity: '稀有 · 全国仅16%',
      percent: '16%',
      strengths: '聪明、善变通、洞察力强',
      weaknesses: '想太多、不够坚定、容易焦虑',
      career: '策划、咨询、写作、艺术',
      conversation: '测出我是水型人格！上善若水，你是什么型？',
      ratings: { 金: 5, 木: 6, 水: 9, 火: 5, 土: 5 }
    },
    'huo': {
      title: '火型人格 🔥',
      sum: '热情奔放，活力四射',
      brief: '你像火焰一样热烈明亮——充满激情、行动力强、感染力十足。你走到哪里，哪里就热闹起来。你有着极强的感染力和号召力，能让沉闷的氛围瞬间活跃。',
      rank: '上品·炎阳',
      tagline: '我就是那种：三分钟热度，但这三分钟我能燃爆全场 🔥',
      rarity: '常见 · 全国约18%',
      percent: '18%',
      strengths: '热情、行动力强、有感染力',
      weaknesses: '脾气急、三分钟热度、不够细致',
      career: '销售、公关、演艺、创业',
      conversation: '火型人格就是我！热情似火，快来测测你是什么型 →',
      ratings: { 金: 5, 木: 4, 水: 4, 火: 9, 土: 5 }
    },
    'tu': {
      title: '土型人格 🌾',
      sum: '厚德载物，包容稳重',
      brief: '你像大地一样宽厚稳重——包容可靠、耐心坚韧、值得信赖。你是大家心中的"定海神针"，任何时候都能给人安全感。你不急不躁，懂得等待和积累。',
      rank: '中品·厚土',
      tagline: '朋友的情绪垃圾桶，但我的情绪我自己消化 🌍',
      rarity: '常见 · 全国约20%',
      percent: '20%',
      strengths: '包容、可靠、有耐心',
      weaknesses: '太迁就别人、不懂表达需求、容易压抑',
      career: '行政、人事、财务、农业',
      conversation: '测出我是土型人格！厚德载物，你呢？',
      ratings: { 金: 6, 木: 7, 水: 5, 火: 4, 土: 9 }
    },
    'default': {
      title: '平衡型 ⚖️',
      sum: '五行均衡，独一无二',
      brief: '你的五行特质较为均衡，没有明显偏向，这意味着你有着全方位的适应能力。你既能在不同情境下灵活切换，又保持着自己的核心本色。',
      rank: '隐藏·均衡体',
      tagline: '我就是那种：啥都会一点，但啥都不精的万能备胎 😅',
      rarity: '极稀有 · 全国仅4%',
      percent: '4%',
      strengths: '适应力强、全方位、不偏科',
      weaknesses: '没有突出特长、容易被忽略',
      career: '自由职业、综合管理、跨界工作',
      conversation: '测出我是五行平衡型！万中无一的那种，你呢？',
      ratings: { 金: 5, 木: 5, 水: 5, 火: 5, 土: 5 }
    }
  },
  aiPrompt: '用户完成了五行人格测试，结果是{type}型。请写一段200字的个性化分析：1)这种五行人格的核心特质 2)在工作和人际关系中的表现 3)给这种类型的一个成长建议。用朋友般的口吻。'
};
