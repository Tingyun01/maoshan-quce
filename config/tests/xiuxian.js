/**
 * xiuxian.js — 修仙资质测试
 * 主打：修仙文化 + 自嘲式结果
 * 4题，4种灵根资质
 */
module.exports = {
  id: 'xiuxian',
  name: '测测你的修仙资质',
  description: '4题看你是天灵根还是...没有灵根',
  icon: '气',
  questions: [
    {
      id: 1, text: '你熬夜到凌晨3点的原因是？', options: [
        { text: '学习/加班，卷到飞起', score: { tian: 2, di: 1 } },
        { text: '打游戏/刷短视频，停不下来', score: { fan: 2, za: 1 } },
        { text: '失眠，想人生', score: { di: 2, fan: 1 } },
        { text: '从不熬夜，养生达人', score: { za: 2, tian: 1 } }
      ]
    },
    {
      id: 2, text: '同事/同学偷偷说你坏话被你听到了，你？', options: [
        { text: '当场走过去，面带微笑："继续啊，我也想听听"', score: { tian: 2 } },
        { text: '默默走开，但心里记小本本', score: { di: 2 } },
        { text: '发朋友圈阴阳怪气', score: { fan: 2 } },
        { text: '算了，他们爱说说吧', score: { za: 2 } }
      ]
    },
    {
      id: 3, text: '你觉得自己最大的天赋是？', options: [
        { text: '学什么都快，一点就通', score: { tian: 2 } },
        { text: '能吃苦，耐得住寂寞', score: { di: 1, za: 1 } },
        { text: '情商高，会来事', score: { fan: 2 } },
        { text: '心态好，啥都不往心里去', score: { za: 2 } }
      ]
    },
    {
      id: 4, text: '穿越到修仙世界，你第一步做什么？', options: [
        { text: '找最牛的宗门拜师', score: { tian: 1, di: 1 } },
        { text: '先苟着，观察一下局势', score: { za: 2 } },
        { text: '找宝藏，先发财再说', score: { fan: 2 } },
        { text: '躺着等主角来救我', score: { fan: 1, za: 1 } }
      ]
    }
  ],
  scoring: {
    dimensions: ['灵根资质'],
    getType(scores) {
      const total = Object.values(scores).reduce((a, b) => a + (b || 0), 0);
      const t = scores.tian || 0;
      const d = scores.di || 0;
      const f = scores.fan || 0;
      const z = scores.za || 0;
      if (t >= d && t >= f && t >= z && t >= 3) return 'tian';
      if (d >= t && d >= f && d >= z && d >= 3) return 'di';
      if (f >= t && f >= d && f >= z && f >= 3) return 'fan';
      return 'za';
    }
  },
  results: {
    'tian': {
      title: '天灵根 🌟',
      summary: '万中无一的修仙奇才',
      brief: '你就是传说中的天灵根！修炼速度是常人的十倍，各大宗门抢着要你。你聪明、悟性高、做什么都比别人快。但天灵根也有烦恼——别人觉得你开挂，你确实也在开挂。建议：别太依赖天赋，稳扎稳打才能走得更远。',
      ratings: { 根骨: 10, 悟性: 9, 机缘: 7, 颜值: 6 }
    },
    'di': {
      title: '地灵根 🌍',
      summary: '稳扎稳打，后劲十足',
      brief: '你虽然不是天灵根，但地灵根的好处是——扎实！你一步一个脚印，基础打得比任何人都牢。前期可能不太出彩，但越到后面越强。你是那种"全班第一不是最聪明的，但一定是最努力的"类型。天道酬勤，你值得。',
      ratings: { 根骨: 7, 悟性: 6, 机缘: 6, 颜值: 7 }
    },
    'fan': {
      title: '凡灵根 🌾',
      summary: '平平无奇，全靠骚操作',
      brief: '你的灵根资质确实一般，但你有一个其他灵根没有的优势——你路子野！硬的不行来软的，正的不行来歪的，反正你总能找到方法。你的脑筋转得快，社交能力强，走到哪都饿不死。修仙界需要天才，也需要你这样的"民间高手"。',
      ratings: { 根骨: 4, 悟性: 5, 机缘: 8, 颜值: 8 }
    },
    'za': {
      title: '杂灵根 🍃',
      summary: '五行俱全，样样都会',
      brief: '杂灵根？听起来不好听，但你知道这意味着什么吗？你干啥啥都行！虽然不能专精一门，但你是个多面手。出去摆摊能算命、能炼器、能画符、能治病，一个人就是一个团队。别跟天才比修炼速度，跟天才比生活丰富多彩，你赢麻了。',
      ratings: { 根骨: 5, 悟性: 6, 机缘: 7, 颜值: 7 }
    },
    'default': {
      title: '暂无灵根',
      summary: '你可能不适合修仙',
      brief: '测了半天，发现你没有灵根...没关系，回凡间好好过日子吧，996也挺好（不是）。开玩笑的，你没有灵根但你有钱啊！用钱砸资源，一样能修。',
      ratings: { 根骨: 3, 悟性: 5, 机缘: 6, 颜值: 9 }
    }
  },
  aiPrompt: ''
};
