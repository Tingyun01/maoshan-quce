// ============================================================
// 前世今生 · 快速测试（5题制）
// "你在茅山的前世是谁？"
// 全道教人物：茅盈/葛洪/陶弘景/王远知
// 仅限娱乐参考
// ============================================================
module.exports = {
  id: 'past_life',
  name: '前世今生',
  icon: '☯️',
  desc: '5道题测出你在茅山的前世是谁',
  qCount: 5,
  duration: '1分钟',
  tag: '🔥热门',
  category: '趣味',
  disclaimer: '本测试结果仅供娱乐，不具任何科学依据',

  questions: [
    {
      id: 1,
      text: '在茅山脚下遇到一个迷路的旅人，你会？',
      options: [
        { text: '带他走一条没人知道的山间小路', score: { maoying: 2 } },
        { text: '拉他去山脚喝碗热汤再说', score: { gehong: 2 } },
        { text: '问清他去哪里，详细指路', score: { hongjing: 2 } },
        { text: '默默陪他走一段，确保他安全', score: { wangyuan: 2 } }
      ]
    },
    {
      id: 2,
      text: '山中修炼，你最怕遇到什么？',
      options: [
        { text: '被人管束，规矩太多', score: { maoying: 2 } },
        { text: '断粮断酒，日子太苦', score: { gehong: 2 } },
        { text: '半途而废，道心不稳', score: { hongjing: 2 } },
        { text: '辜负师门期望', score: { wangyuan: 2 } }
      ]
    },
    {
      id: 3,
      text: '你最向往的修道生活是？',
      options: [
        { text: '云游四海，逍遥自在', score: { maoying: 2 } },
        { text: '炼丹采药，自给自足', score: { gehong: 2 } },
        { text: '著书立说，传承道法', score: { hongjing: 2 } },
        { text: '守护山门，代代相传', score: { wangyuan: 2 } }
      ]
    },
    {
      id: 4,
      text: '朝廷派人来请你出山做官，你如何应对？',
      options: [
        { text: '大笑三声，转身入山', score: { maoying: 2 } },
        { text: '先问问俸禄多少再说', score: { gehong: 2 } },
        { text: '婉言谢绝，推荐贤才替代', score: { hongjing: 2 } },
        { text: '恭敬谢过，坚守本职', score: { wangyuan: 2 } }
      ]
    },
    {
      id: 5,
      text: '千年之后，你希望世人如何记住你？',
      options: [
        { text: '一个自由自在的仙人', score: { maoying: 2 } },
        { text: '一个会炼丹会享受的高人', score: { gehong: 2 } },
        { text: '一个留下智慧的人', score: { hongjing: 2 } },
        { text: '一个靠谱可信的道长', score: { wangyuan: 2 } }
      ]
    }
  ],

  resultTypes: ['maoying', 'gehong', 'hongjing', 'wangyuan'],

  results: {
    maoying: {
      title: '茅盈转世 · 大茅君 ☯️',
      sum: '逍遥天地间的开山祖师',
      brief: '你前世的灵魂属于三茅真君之首——茅盈。西汉年间，你辞官入山，在茅山巅修炼成仙。你骨子里带着一股不羁的劲儿，不守规矩、不受束缚，但偏偏能走出一条属于自己的路。你这一世依然如此——自由是你最深的底色。',
      rank: '上品·大茅君',
      rarity: '稀有 · 全国仅8%',
      tagline: '我不是不合群，我只是不想被任何人牵着走 ☯️',
      othersView: '觉得你太随性不靠谱，其实你最知道自己要什么',
      trueSelf: '你的自由不是逃避，是你选择了更适合自己的路',
      strengths: '洒脱 / 有主见 / 开创力强 / 不内耗',
      weaknesses: '太随性 / 不爱守规矩 / 容易独来独往',
      career: '创业 / 自由职业 / 探险 / 艺术创作',
      ratings: { 道行: 10, 智慧: 7, 逍遥: 10, 缘分: 6, 定力: 4 },
      conversation: '我前世居然是茅山开山祖师茅盈转世！☯️ 来测测你的前世→',
      shareText: '茅山趣测说我前世是茅盈·大茅君！你上辈子是谁？一测便知 👉',
      daojing: '道法自然',
      percent: '8%'
    },
    gehong: {
      title: '葛洪转世 · 抱朴子 🔥',
      sum: '大智若愚的享乐派高人',
      brief: '你的前世是东晋道教理论家葛洪，号抱朴子。你一生研究炼丹术、著《抱朴子》，但从不亏待自己——吃得好睡得香，才是修仙的真谛。你这一世依然懂得：生活不是为了修炼，修炼是为了更好地生活。',
      rank: '上品·抱朴子',
      rarity: '普通 · 全国28%',
      tagline: '我不是贪图享乐，我是在体悟道法自然 🍜',
      othersView: '觉得你太爱享受不求上进，其实你看透了生活的本质',
      trueSelf: '你的快乐来自于对生活最深的接纳和热爱',
      strengths: '心态好 / 懂生活 / 有智慧 / 人缘好',
      weaknesses: '容易满足 / 缺乏紧迫感 / 有时候太懒散',
      career: '厨艺 / 养生 / 教育 / 心理咨询',
      ratings: { 道行: 7, 智慧: 8, 逍遥: 8, 缘分: 6, 定力: 5 },
      conversation: '我前世居然是葛洪·抱朴子转世！🔥 来测测你的前世→',
      shareText: '茅山趣测说我前世是葛洪·抱朴子！你上辈子是谁？一测便知 👉',
      daojing: '见素抱朴，少私寡欲',
      percent: '28%'
    },
    hongjing: {
      title: '陶弘景转世 · 山中宰相 📖',
      sum: '心怀天下的隐士高人',
      brief: '你的前世是茅山宗创始人陶弘景，梁武帝称他为"山中宰相"。你虽隐居华阳洞，却心怀天下——著《真诰》《本草经集注》，以学问济世。你这一世依然有强烈的使命感，认准了的事谁也拦不住。',
      rank: '极品·山中宰相',
      rarity: '稀有 · 全国仅6%',
      tagline: '我不是不合群，我在筹划更重要的事 📖',
      othersView: '觉得你太清高难接近，其实你只是不愿浪费时间',
      trueSelf: '你的坚持不是固执，是你比谁都清楚自己在做什么',
      strengths: '专注 / 有远见 / 学识渊博 / 坚定',
      weaknesses: '固执 / 不擅社交 / 容易钻牛角尖',
      career: '研究 / 教育 / 医疗 / 管理咨询',
      ratings: { 道行: 9, 智慧: 10, 逍遥: 5, 缘分: 5, 定力: 9 },
      conversation: '我前世居然是茅山宗创始人陶弘景！📖 来测测你的前世→',
      shareText: '茅山趣测说我前世是陶弘景·山中宰相！你上辈子是谁？一测便知 👉',
      daojing: '知人者智，自知者明',
      percent: '6%'
    },
    wangyuan: {
      title: '王远知转世 · 守道真人 🏛️',
      sum: '默默传承的可靠基石',
      brief: '你的前世是唐代茅山宗师王远知，受唐太宗赐号"升真先生"。你不争不抢，一生守护道门传承，是茅山最让人安心的存在。你这一世依然是那个：话不多，但事交给你最放心的人。',
      rank: '上品·守道真人',
      rarity: '常见 · 全国58%',
      tagline: '我不是没主见，我只是习惯先做好再说 🏛️',
      othersView: '觉得你太老实没个性，其实你最让人信赖',
      trueSelf: '你的沉默不是软弱，是你觉得行动比言语重要',
      strengths: '靠谱 / 踏实 / 有责任心 / 包容',
      weaknesses: '太低调 / 容易被忽略 / 不擅表达',
      career: '技术 / 财务 / 管理 / 传承类工作',
      ratings: { 道行: 7, 智慧: 7, 逍遥: 4, 缘分: 6, 定力: 8 },
      conversation: '我前世是茅山宗师王远知转世！🏛️ 来测测你的前世→',
      shareText: '茅山趣测说我前世是王远知·守道真人！你上辈子是谁？一测便知 👉',
      daojing: '大音希声，大象无形',
      percent: '58%'
    }
  },

  scoring: {
    pickResult: function(scores) {
      const keys = ['maoying', 'gehong', 'hongjing', 'wangyuan'];
      let maxK = keys[0], maxV = scores[maxK] || 0;
      keys.forEach(k => { if ((scores[k] || 0) > maxV) { maxK = k; maxV = scores[k] || 0; } });
      return maxK;
    }
  }
};
