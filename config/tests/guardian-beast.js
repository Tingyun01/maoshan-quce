// ============================================================
// 守护神兽 · 快速测试（5题制）
// "你的守护神兽是哪位？"
// 基于中国神话中的四方神兽 + 麒麟
// 仅限娱乐参考
// ============================================================
module.exports = {
  id: 'guardian_beast',
  name: '守护神兽',
  icon: '🐉',
  desc: '5道题找出你的守护神兽',
  qCount: 5,
  duration: '1分钟',
  tag: '🔥热门',
  category: '趣味',
  disclaimer: '本测试结果仅供娱乐，不具任何科学依据',

  questions: [
    {
      id: 1, text: '别人对你的第一印象通常是？',
      options: [
        { text: '有气场，不敢随便开玩笑', score: { dragon: 2 } },
        { text: '热情开朗，很好相处', score: { phoenix: 2 } },
        { text: '稳重可靠，有安全感', score: { qilin: 2 } },
        { text: '神秘高冷，猜不透', score: { tiger: 2 } }
      ]
    },
    {
      id: 2, text: '面对危险时，你的本能反应是？',
      options: [
        { text: '正面迎敌，绝不服软', score: { tiger: 2 } },
        { text: '冷静观察，找最佳方案', score: { dragon: 2 } },
        { text: '先保护身边的人', score: { qilin: 2 } },
        { text: '退一步海阔天空，从长计议', score: { phoenix: 2 } }
      ]
    },
    {
      id: 3, text: '你最喜欢的天气是？',
      options: [
        { text: '狂风暴雨——有力量感', score: { dragon: 2 } },
        { text: '晴空万里——温暖明亮', score: { phoenix: 2 } },
        { text: '多云微风——舒服就好', score: { qilin: 2 } },
        { text: '大雪纷飞——静谧庄严', score: { tiger: 2 } }
      ]
    },
    {
      id: 4, text: '你的朋友圈风格最像什么？',
      options: [
        { text: '很少发，一发就是大事', score: { dragon: 1, tiger: 1 } },
        { text: '经常分享生活乐趣', score: { phoenix: 2 } },
        { text: '只发正能量/深度好文', score: { qilin: 2 } },
        { text: '基本不发，只潜水围观', score: { tiger: 1, dragon: 1 } }
      ]
    },
    {
      id: 5, text: '你最想获得的能力是？',
      options: [
        { text: '呼风唤雨，掌控自然', score: { dragon: 2 } },
        { text: '浴火重生，永不放弃', score: { phoenix: 2 } },
        { text: '庇护苍生，消灾解难', score: { qilin: 2 } },
        { text: '震慑宵小，百邪不侵', score: { tiger: 2 } }
      ]
    }
  ],

  resultTypes: ['dragon', 'phoenix', 'qilin', 'tiger'],

  results: {
    dragon: {
      title: '青龙守护 🐉', sum: '呼风唤雨的天之骄子',
      brief: '你天生有领袖气质，气场强大且智慧过人。不怒自威，说的就是你。',
      rank: '神级·青龙', rarity: '稀有 · 全国仅10%',
      tagline: '我不是高冷，我只是在云端思考龙生 🐉',
      othersView: '觉得你不好接近，气场太强',
      trueSelf: '你只是懒得向下兼容，对值得的人你掏心掏肺',
      strengths: '领导力 / 远见 / 格局大', weaknesses: '太强势 / 不易亲近',
      career: '管理 / 创业 / 金融 / 战略', ratings: { 力量: 9, 智慧: 10, 魅力: 8, 亲和: 4 },
      conversation: '我的守护神兽是青龙！🐉 快测测你是被谁守护的 👉',
      shareText: '我在茅山趣测测出是青龙守护！你是什么神兽？测测看 👉',
      percent: '10%'
    },
    phoenix: {
      title: '凤凰守护 🦅', sum: '浴火重生的永恒之光',
      brief: '你热情、有感染力，到哪里都是人群焦点。经历再多挫折也能重新振作。',
      rank: '神级·凤凰', rarity: '稀有 · 全国仅12%',
      tagline: '每次跌倒都是为了更华丽的起飞 🔥',
      othersView: '觉得你光芒四射，有点刺眼',
      trueSelf: '你的光芒是给别人看的，夜深人静也会偷偷难过',
      strengths: '感染力 / 乐观 / 恢复力强', weaknesses: '情绪化 / 偶尔作死',
      career: '创意 / 媒体 / 教育 / 表演', ratings: { 力量: 7, 智慧: 8, 魅力: 10, 亲和: 8 },
      conversation: '我的守护神兽是凤凰！🦅 快测测你是被谁守护的 👉',
      shareText: '我在茅山趣测测出是凤凰守护！你是什么神兽？测测看 👉',
      percent: '12%'
    },
    qilin: {
      title: '麒麟守护 🦌', sum: '祥瑞之兽，和平使者',
      brief: '你温和善良，不喜欢冲突，到哪里都带去和谐。你就像行走的"岁月静好"。',
      rank: '神级·麒麟', rarity: '稀有 · 全国仅8%',
      tagline: '毁灭吧？算了……大家都不容易 🦌',
      othersView: '觉得你太好说话了，没脾气',
      trueSelf: '你不是没脾气，你只是选择做一个好人',
      strengths: '善良 / 包容 / 有耐心', weaknesses: '太隐忍 / 容易被利用',
      career: '咨询 / 医疗 / 公益 / 教育', ratings: { 力量: 5, 智慧: 8, 魅力: 7, 亲和: 10 },
      conversation: '我的守护神兽是麒麟！🦌 快测测你是被谁守护的 👉',
      shareText: '我在茅山趣测测出是麒麟守护！你是什么神兽？测测看 👉',
      percent: '8%'
    },
    tiger: {
      title: '白虎守护 🐯', sum: '威震八方的百兽之王',
      brief: '你正义感爆棚，眼里容不下沙子。敢于站出来说真话，是朋友眼中最可靠的守护者。',
      rank: '神级·白虎', rarity: '稀有 · 全国仅7%',
      tagline: '老子不发威，你当我是Hello Kitty？🐯',
      othersView: '觉得你太凶了不好惹，但有事第一个找你',
      trueSelf: '你的"凶"只是保护色，你怕别人受伤害',
      strengths: '正义感 / 勇敢 / 可靠 / 果断', weaknesses: '太直接 / 不懂圆滑',
      career: '法律 / 警察 / 审计 / 体育', ratings: { 力量: 10, 智慧: 7, 魅力: 6, 亲和: 3 },
      conversation: '我的守护神兽是白虎！🐯 快测测你是被谁守护的 👉',
      shareText: '我在茅山趣测测出是白虎守护！你是什么神兽？测测看 👉',
      percent: '7%'
    }
  },

  scoring: {
    pickResult: function(scores) {
      const keys = ['dragon', 'phoenix', 'qilin', 'tiger'];
      let maxK = keys[0], maxV = scores[maxK] || 0;
      keys.forEach(k => { if ((scores[k] || 0) > maxV) { maxK = k; maxV = scores[k] || 0; } });
      return maxK;
    }
  }
};
