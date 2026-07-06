/**
 * premium-tests.js — 付费/广告解锁的特殊内容配置
 *
 * 使用方式：
 *   - 首页展示"秘境藏宝"入口
 *   - 用户点击 → 看广告 → 解锁随机一个隐藏测试
 *   - 隐藏测试当天有效，次日轮换
 */

const HIDDEN_TESTS = [
  {
    id: 'hidden_wuxing_deep',
    name: '五行·深层命盘',
    icon: '☯️',
    desc: '全面解析你的五行相生相克，不只是金木水火土这么简单',
    questions: [
      { id: 'h1', text: '遇到棘手问题时，你的第一反应是？', options: [
        { text: '立刻行动解决', score: { jin: 3, huo: 2 } },
        { text: '先分析再动手', score: { shui: 3, jin: 1 } },
        { text: '找人商量讨论', score: { tu: 2, mu: 3 } },
        { text: '放放再说随缘', score: { shui: 1, tu: 3 } }
      ]},
      { id: 'h2', text: '周末你最想做的是？', options: [
        { text: '约朋友聚会热闹一下', score: { huo: 3, jin: 1 } },
        { text: '一个人看书喝茶', score: { shui: 2, mu: 2 } },
        { text: '收拾房间搞搞家务', score: { tu: 3, jin: 2 } },
        { text: '出去走走亲近自然', score: { mu: 3, shui: 1 } }
      ]},
      { id: 'h3', text: '朋友眼中的你更像？', options: [
        { text: '靠谱的定海神针', score: { tu: 3, jin: 2 } },
        { text: '活泼的气氛组', score: { huo: 3, mu: 1 } },
        { text: '聪明的军师', score: { shui: 3, jin: 1 } },
        { text: '温柔的倾听者', score: { mu: 3, tu: 1 } }
      ]},
      { id: 'h4', text: '你最怕什么类型的事？', options: [
        { text: '没有计划的突然变动', score: { jin: 3, shui: 1 } },
        { text: '被迫社交的尴尬场面', score: { shui: 2, mu: 2 } },
        { text: '毫无进展的重复劳动', score: { huo: 3, jin: 1 } },
        { text: '被人误解说不清', score: { tu: 2, mu: 2 } }
      ]},
      { id: 'h5', text: '你觉得什么最珍贵？', options: [
        { text: '说话算话的诚信', score: { jin: 3, tu: 2 } },
        { text: '自由自在的空间', score: { shui: 3, huo: 2 } },
        { text: '彼此理解的默契', score: { mu: 3, shui: 1 } },
        { text: '脚踏实地的积累', score: { tu: 3, jin: 1 } }
      ]}
    ],
    scoring: {
      dimensions: ['jin', 'mu', 'shui', 'huo', 'tu'],
      getType: (scores) => {
        const sorted = Object.entries(scores).sort((a, b) => (b[1] || 0) - (a[1] || 0));
        const top = sorted[0]?.[0] || 'jin';
        // 深层命盘：给出主+辅
        return top + '_deep';
      }
    },
    results: {
      jin_deep: { title: '金·破军命盘', sum: '锋芒内敛，百炼成钢的深层力量', brief: '你的五行以金为主导，但不同于表面的刚硬，你的内在有着柔软与韧性并存的力量。你的破军星在命盘中闪耀，注定要在关键时候一鸣惊人。', rank: '秘·破军', tagline: '所谓金无足赤，人无完人——但我偏要做那个例外'},
      mu_deep: { title: '木·天机命盘', sum: '春风化雨，润物无声的深层智慧', brief: '你的五行以木为主导，比表面的温和更深一层——你是那种不动声色改变世界的人。天机星入命，你总是能提前感知风向，预判变化。', rank: '秘·天机', tagline: '表面的云淡风轻，是为了掩饰内心深处的大局在握'},
      shui_deep: { title: '水·太阴命盘', sum: '上善若水，深不可测的深层智慧', brief: '你的五行以水为主导，但不仅仅是灵活应变。太阴星照耀你的命盘，你有一种与生俱来的洞察力——能在混沌中看到秩序。', rank: '秘·太阴', tagline: '不是深藏不露，是露出来的你还没机会看到'},
      huo_deep: { title: '火·太阳命盘', sum: '光芒万丈，焚天煮海的深层能量', brief: '你的五行以火为主导，但远不止表面热情。太阳星入命，你的内在有一座活火山——平时温和，爆发时震撼天地。', rank: '秘·太阳', tagline: '你以为我只有三分钟热度？那是你没看过我认真起来的样子'},
      tu_deep: { title: '土·紫微命盘', sum: '厚德载物，不动如山的深层根基', brief: '你的五行以土为主导，但绝非普通的稳重。紫微星入命，你是那种能扛起一切的人——天塌下来你都能顶住。', rank: '秘·紫微', tagline: '我的不动如山，不是因为没想法，是因为我扛着整个世界'}
    },
    icon: '☯️'
  }
];

/** 获取今日可用的隐藏测试（基于日期 seed 一天一个） */
function getTodayHiddenTest() {
  const daySeed = new Date().toDateString();
  const idx = Math.abs(daySeed.split('').reduce((a, c) => a + c.charCodeAt(0), 0)) % HIDDEN_TESTS.length;
  return HIDDEN_TESTS[idx] || HIDDEN_TESTS[0];
}

module.exports = { HIDDEN_TESTS, getTodayHiddenTest };
