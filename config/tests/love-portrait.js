// ============================================================
// 桃花缘 · 快速测试（5题制）
// "你在爱情里是什么样的人？"
// 仅限娱乐参考 · 请勿当真
// ============================================================
module.exports = {
  id: 'love_portrait',
  name: '桃花缘',
  icon: '💕',
  desc: '5道题测出你在爱情里的样子',
  qCount: 5,
  duration: '1分钟',
  tag: '🔥',
  category: '趣味',
  disclaimer: '本测试纯属娱乐，不构成任何情感建议。所有结果均为随机生成，请勿当真。',

  questions: [
    {
      id: 1, text: '你收到一束花，你的第一反应？',
      options: [
        { text: '谁送的？为什么要送？开始推理', score: { rationalist: 2 } },
        { text: '好浪漫啊！开心得跳起来', score: { romantic: 2 } },
        { text: '谢谢，但送花不如请吃饭', score: { guardian: 2 } },
        { text: '不习惯，有点不好意思', score: { gentle: 2 } }
      ]
    },
    {
      id: 2, text: '一个人对你很好，你反而会？',
      options: [
        { text: '越想越觉得不对劲，他图啥呢', score: { rationalist: 2 } },
        { text: '加倍对TA好，礼尚往来', score: { romantic: 2 } },
        { text: '默默接受，但是心里记下了', score: { guardian: 2 } },
        { text: '不习惯，但不说出来', score: { gentle: 2 } }
      ]
    },
    {
      id: 3, text: '你最受不了恋人做什么？',
      options: [
        { text: '说话不算话——说到必须做到', score: { rationalist: 2 } },
        { text: '冷暴力——有事你就说', score: { romantic: 2 } },
        { text: '不够用心——细节才是关键', score: { gentle: 2 } },
        { text: '总靠我一个人——感情是双向的', score: { guardian: 2 } }
      ]
    },
    {
      id: 4, text: '你表达爱的方式最像？',
      options: [
        { text: '帮TA解决问题，理性分析', score: { rationalist: 2 } },
        { text: '给TA惊喜，制造浪漫', score: { romantic: 2 } },
        { text: '默默守护，需要时我就在', score: { guardian: 2 } },
        { text: '记得小事，细水长流', score: { gentle: 2 } }
      ]
    },
    {
      id: 5, text: '你最想对未来的TA说什么？',
      options: [
        { text: '和我在一起，不用想太多', score: { rationalist: 2 } },
        { text: '你是我的小确幸', score: { romantic: 2 } },
        { text: '有我在，你什么都不用怕', score: { guardian: 2 } },
        { text: '慢慢来，我们不赶时间', score: { gentle: 2 } }
      ]
    }
  ],

  resultTypes: ['rationalist', 'romantic', 'guardian', 'gentle'],

  results: {
    rationalist: {
      title: '理性恋人 🧠', sum: '用脑子谈恋爱，什么都算得清',
      brief: '你在感情里是最清醒的那一个。你相信"先有面包才有爱情"，你的另一半不用担心被骗——因为你比骗子还会分析。',
      rank: '上品·理性派', rarity: '常见 · 全国35%',
      tagline: '我爱你，但我还是要先算一下 🧠',
      othersView: '觉得你太冷，谈恋爱像谈合同',
      trueSelf: '你不是不浪漫，你的浪漫是"我把你写进了我的五年规划"',
      strengths: '靠谱 / 不冲动 / 有规划', weaknesses: '太理性 / 缺少浪漫',
      career: '金融 / 法律 / 管理 / 技术', ratings: { 浪漫: 3, 靠谱: 10, 温柔: 5, 主动: 7 },
      conversation: '我在爱情里是理性恋人！🧠 你是什么类型？测测看（仅供娱乐）👉',
      shareText: '我在茅山趣测测出了爱情人格！仅供娱乐，你也来测测你的桃花缘 👉',
      percent: '35%'
    },
    romantic: {
      title: '浪漫恋人 💝', sum: '你是爱情里最亮的那颗星',
      brief: '你就是"偶像剧走进现实"本尊。你相信爱情的美好，也愿意为之付出。你的浪漫不是作，是骨子里的深情。',
      rank: '上品·浪漫派', rarity: '热门 · 全国28%',
      tagline: '今晚月色真美——我说的是你 💝',
      othersView: '觉得你太恋爱脑了，不切实际',
      trueSelf: '你不是恋爱脑，你只是觉得人生已经够苦了，感情可以甜一点',
      strengths: '浪漫 / 有情趣 / 会爱人', weaknesses: '容易受伤 / 过于投入',
      career: '文艺 / 设计 / 媒体 / 咨询', ratings: { 浪漫: 10, 靠谱: 5, 温柔: 8, 主动: 8 },
      conversation: '我在爱情里是浪漫恋人！💝 你是什么类型？测测看（仅供娱乐）👉',
      shareText: '我在茅山趣测测出了爱情人格！仅供娱乐，你也来测测你的桃花缘 👉',
      percent: '28%'
    },
    guardian: {
      title: '守护恋人 🛡️', sum: '你的爱是挡在TA前面的盾',
      brief: '你不说甜言蜜语，但你的行动比任何情话都动人。你是"有事找我，没事我在"的那种人。爱你的人很幸运，因为你真的靠得住。',
      rank: '上品·守护者', rarity: '稀有 · 全国仅18%',
      tagline: '嘴笨不说爱，但行动比谁都暖 🛡️',
      othersView: '觉得你不解风情，像个木头',
      trueSelf: '你的温柔都在细节里，只是不好意思说出来',
      strengths: '可靠 / 踏实 / 行动力', weaknesses: '不表达 / 容易被误解',
      career: '工程 / 医疗 / 军事 / 教育', ratings: { 浪漫: 2, 靠谱: 10, 温柔: 6, 主动: 5 },
      conversation: '我在爱情里是守护恋人！🛡️ 你是什么类型？测测看（仅供娱乐）👉',
      shareText: '我在茅山趣测测出了爱情人格！仅供娱乐，你也来测测你的桃花缘 👉',
      percent: '18%'
    },
    gentle: {
      title: '温柔恋人 🌸', sum: '春风化雨，润物无声',
      brief: '你就像一杯温水——不刺激、不张扬，但谁都需要。你的温柔不是软弱，是见过风浪后选择的善良。',
      rank: '上品·温柔乡', rarity: '热门 · 全国22%',
      tagline: '我不说话的时候，不是生气了，是在想你 🌸',
      othersView: '觉得你太没主见了，什么都行',
      trueSelf: '你只是觉得很多事不值得争，你在意的是那个人开不开心',
      strengths: '温柔 / 包容 / 善解人意', weaknesses: '太隐忍 / 不敢表达',
      career: '教育 / 医疗 / 公益 / 服务', ratings: { 浪漫: 6, 靠谱: 8, 温柔: 10, 主动: 3 },
      conversation: '我在爱情里是温柔恋人！🌸 你是什么类型？测测看（仅供娱乐）👉',
      shareText: '我在茅山趣测测出了爱情人格！仅供娱乐，你也来测测你的桃花缘 👉',
      percent: '22%'
    }
  },

  scoring: {
    pickResult: function(scores) {
      const keys = ['rationalist', 'romantic', 'guardian', 'gentle'];
      let maxK = keys[0], maxV = scores[maxK] || 0;
      keys.forEach(k => { if ((scores[k] || 0) > maxV) { maxK = k; maxV = scores[k] || 0; } });
      return maxK;
    }
  }
};
