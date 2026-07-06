/**
 * immortal.js — 茅山神仙转世测试 v3
 * 15题版本，更准确更有趣
 * 结果页包含：称号、稀有度、段子式描述、评分、社交话题
 */
module.exports = {
  id: 'immortal',
  name: '你是哪位神仙转世？',
  description: '15道题测出你上辈子是哪路神仙',
  icon: '道',
  questions: [
    // ===== 第1-5题（原有，保留）=====
    { id: 1, text: '朋友约你周末吃饭，你第一反应是？', options: [
      { text: '谁买单？AA还是你请？', score: { caishen: 2 } },
      { text: '好啊！我来选馆子', score: { taibai: 1, yueLao: 1 } },
      { text: '不太想去，但不好意思拒绝', score: { tudi: 2 } },
      { text: '先问还有谁去', score: { zhongkui: 2 } },
      { text: '去！必须喝两杯', score: { nezha: 1, caishen: 1 } }
    ]},
    { id: 2, text: '你在工作中的状态是？', options: [
      { text: '摸鱼达人，但关键时刻不掉链子', score: { nezha: 2 } },
      { text: '卷王本卷，KPI必须第一', score: { caishen: 1, taibai: 1 } },
      { text: '不争不抢，做好自己的事', score: { tudi: 2 } },
      { text: '经常给别人擦屁股', score: { yueLao: 2 } },
      { text: '老板画饼我画饼，看谁先撑死', score: { taibai: 2 } }
    ]},
    { id: 3, text: '你最受不了哪种人？', options: [
      { text: '画大饼不兑现的', score: { caishen: 2 } },
      { text: '天天负能量抱怨的', score: { nezha: 1, tudi: 1 } },
      { text: '说话拐弯抹角的', score: { zhongkui: 2 } },
      { text: '借钱不还的', score: { caishen: 1, zhongkui: 1 } },
      { text: '吃饭吧唧嘴的', score: { yueLao: 2 } }
    ]},
    { id: 4, text: '你的钱包现在是什么状态？', options: [
      { text: '鼓鼓的，刚发工资！', score: { caishen: 2 } },
      { text: '还行吧，够花', score: { tudi: 2 } },
      { text: '月光族，等下一个发薪日', score: { nezha: 2 } },
      { text: '在投资，钱生钱', score: { taibai: 2 } },
      { text: '钱包？我手机支付', score: { zhongkui: 1, yueLao: 1 } }
    ]},
    { id: 5, text: '如果给你一天超能力，你选？', options: [
      { text: '点石成金，想买啥买啥', score: { caishen: 2 } },
      { text: '时间暂停，睡到自然醒', score: { tudi: 2 } },
      { text: '读心术，看穿所有人', score: { taibai: 2 } },
      { text: '瞬间移动，去哪都行', score: { nezha: 2 } },
      { text: '让所有人都爱上我', score: { yueLao: 2 } }
    ]},
    // ===== 第6-15题（扩建）=====
    { id: 6, text: '朋友说"我没事"，你信吗？', options: [
      { text: '不信，但我也不追问', score: { taibai: 2 } },
      { text: '不信，必须问出来', score: { zhongkui: 2 } },
      { text: '信，每个人都需要空间', score: { tudi: 2 } },
      { text: '不信，我来当情绪垃圾桶', score: { yueLao: 2 } },
      { text: '有事就说，别憋着', score: { nezha: 2, caishen: 1 } }
    ]},
    { id: 7, text: '你看到有人插队，会？', options: [
      { text: '直接上前制止', score: { zhongkui: 2 } },
      { text: '小声跟同伴吐槽', score: { yueLao: 1, tudi: 1 } },
      { text: '假装没看见，但心里骂他', score: { taibai: 2 } },
      { text: '换一个队，不跟这种人计较', score: { nezha: 1, caishen: 1 } }
    ]},
    { id: 8, text: '你的理财观念是？', options: [
      { text: '钱是赚出来的，不是省出来的', score: { caishen: 2, nezha: 1 } },
      { text: '要有备用金，以防万一', score: { tudi: 2 } },
      { text: '投资自己最划算', score: { taibai: 2 } },
      { text: '钱是身外之物，够花就行', score: { yueLao: 2, zhongkui: 1 } }
    ]},
    { id: 9, text: '朋友失恋了找你，你会？', options: [
      { text: '陪他喝酒，骂那个负心汉', score: { nezha: 2 } },
      { text: '理性分析，帮他走出来', score: { taibai: 2, caishen: 1 } },
      { text: '默默陪伴，听他倾诉', score: { tudi: 2, yueLao: 2 } },
      { text: '看不惯，想去找那个人理论', score: { zhongkui: 2 } }
    ]},
    { id: 10, text: '你对"成功"的定义是？', options: [
      { text: '财务自由，想买啥买啥', score: { caishen: 2 } },
      { text: '活得明白，看透世事', score: { taibai: 2 } },
      { text: '家庭和睦，平安喜乐', score: { tudi: 2, yueLao: 1 } },
      { text: '活出自我，不被定义', score: { nezha: 2 } }
    ]},
    { id: 11, text: '你在朋友圈看到有人发广告，会？', options: [
      { text: '直接屏蔽', score: { zhongkui: 2 } },
      { text: '看看是什么，说不定有用', score: { taibai: 1, caishen: 1 } },
      { text: '默默点赞，不想得罪人', score: { tudi: 2 } },
      { text: '支持一下，万一人家是认真的呢', score: { yueLao: 2 } }
    ]},
    { id: 12, text: '你更喜欢哪种神仙？', options: [
      { text: '财神爷——实打实的好处', score: { caishen: 2 } },
      { text: '太白金星——聪明绝顶的谋士', score: { taibai: 2 } },
      { text: '土地公——默默守护的好人', score: { tudi: 2 } },
      { text: '钟馗——嫉恶如仇的硬汉', score: { zhongkui: 2 } },
      { text: '哪吒——叛逆热血的少年', score: { nezha: 2 } },
      { text: '月老——操心别人姻缘的好人', score: { yueLao: 2 } }
    ]},
    { id: 13, text: '你的座右铭更偏向？', options: [
      { text: '富贵险中求', score: { caishen: 2, nezha: 1 } },
      { text: '知己知彼，百战不殆', score: { taibai: 2 } },
      { text: '吃亏是福', score: { tudi: 2 } },
      { text: '路见不平，拔刀相助', score: { zhongkui: 2 } },
      { text: '我命由我不由天', score: { nezha: 2 } },
      { text: '大家好才是真的好', score: { yueLao: 2 } }
    ]},
    { id: 14, text: '你对待规则的态度是？', options: [
      { text: '规则是用来打破的', score: { nezha: 2, taibai: 1 } },
      { text: '规则是保护的，要遵守', score: { tudi: 2, zhongkui: 1 } },
      { text: '规则是给穷人的，我有我的方式', score: { caishen: 2 } },
      { text: '规则可以灵活一点', score: { yueLao: 2 } }
    ]},
    { id: 15, text: '如果可以选一个神仙当同事，你选？', options: [
      { text: '财神爷——跟着他有钱赚', score: { caishen: 2 } },
      { text: '太白金星——跟着他长见识', score: { taibai: 2 } },
      { text: '土地公——跟着他最安心', score: { tudi: 2 } },
      { text: '钟馗——跟着他最有安全感', score: { zhongkui: 2 } },
      { text: '哪吒——跟着他最刺激', score: { nezha: 2 } },
      { text: '月老——跟着他最开心', score: { yueLao: 2 } }
    ]},
    // ===== 第16-30题（扩建第2批）=====
    { id: 16, text: '你打扫房间时会发现什么？', options: [
      { text: '角落里有钱！！（马上捡起）', score: { caishen: 2 } },
      { text: '一本旧书，翻到停不下来', score: { taibai: 2 } },
      { text: '一堆舍不得扔的旧物', score: { tudi: 2 } },
      { text: '发现乱的让人烦躁，直接开整', score: { zhongkui: 2 } },
      { text: '扫了两下——算了，就这样吧', score: { nezha: 2 } },
      { text: '给每件旧物拍照留念再扔', score: { yueLao: 2 } }
    ]},
    { id: 17, text: '你点外卖时最在意什么？', options: [
      { text: '优惠券满减算到极致', score: { caishen: 2 } },
      { text: '看评分和差评决定', score: { taibai: 2 } },
      { text: '固定的那几家，不换', score: { tudi: 2 } },
      { text: '必须准时，迟到一秒就差评', score: { zhongkui: 2 } },
      { text: '换着花样点，不重复', score: { nezha: 2 } },
      { text: '多点点，大家一起吃', score: { yueLao: 2 } }
    ]},
    { id: 18, text: '你去旅行最看重什么？', options: [
      { text: '性价比和隐藏福利', score: { caishen: 2 } },
      { text: '文化历史和深度体验', score: { taibai: 2 } },
      { text: '舒适放松，不赶行程', score: { tudi: 2 } },
      { text: '必须打卡所有景点', score: { zhongkui: 2 } },
      { text: '挑战刺激项目', score: { nezha: 2 } },
      { text: '和谁去最重要', score: { yueLao: 2 } }
    ]},
    { id: 19, text: '你的手机相册里最多的是？', options: [
      { text: '商品截图和折扣信息', score: { caishen: 2 } },
      { text: '书/文章截图和笔记', score: { taibai: 2 } },
      { text: '日常生活随拍', score: { tudi: 2 } },
      { text: '证据/凭证/拍下违规行为', score: { zhongkui: 2 } },
      { text: '自拍和表情包', score: { nezha: 2 } },
      { text: '和朋友家人的合照', score: { yueLao: 2 } }
    ]},
    { id: 20, text: '你遇到问题时首选解决方案是？', options: [
      { text: '能用钱解决就不浪费时间', score: { caishen: 2 } },
      { text: '分析所有可能性选最优解', score: { taibai: 2 } },
      { text: '求助有经验的人', score: { tudi: 2 } },
      { text: '正面硬刚，不解决不罢休', score: { zhongkui: 2 } },
      { text: '先试试再说，不行再换', score: { nezha: 2 } },
      { text: '找大家一起商量', score: { yueLao: 2 } }
    ]},
    { id: 21, text: '你最喜欢的节日是什么？', options: [
      { text: '春节——有红包拿', score: { caishen: 2 } },
      { text: '国庆——适合思考人生', score: { taibai: 1, nezha: 1 } },
      { text: '中秋——阖家团圆', score: { tudi: 2, yueLao: 1 } },
      { text: '清明——除邪惩恶的日子', score: { zhongkui: 2 } },
      { text: '生日——我最大', score: { nezha: 2 } },
      { text: '七夕——浪漫的氛围', score: { yueLao: 2 } }
    ]},
    { id: 22, text: '你被朋友放鸽子了，你的反应是？', options: [
      { text: '那我自己去，省钱了', score: { caishen: 2 } },
      { text: '理解，肯定有原因', score: { taibai: 2 } },
      { text: '没关系，下次再约', score: { tudi: 2 } },
      { text: '必须问清楚为什么', score: { zhongkui: 2 } },
      { text: '生气三分钟然后忘了', score: { nezha: 2 } },
      { text: '有点伤心但不说出来', score: { yueLao: 2 } }
    ]},
    { id: 23, text: '你最想拥有的超能力是？', options: [
      { text: '点石成金', score: { caishen: 2 } },
      { text: '全知全能', score: { taibai: 2 } },
      { text: '长生不老', score: { tudi: 2 } },
      { text: '读心术，看穿谎言', score: { zhongkui: 2 } },
      { text: '分身术，同时做很多事', score: { nezha: 2 } },
      { text: '让所有人幸福快乐', score: { yueLao: 2 } }
    ]},
    { id: 24, text: '朋友深夜找你聊天，你会？', options: [
      { text: '先问有什么事，没事就挂了', score: { caishen: 1, zhongkui: 1 } },
      { text: '分析他遇到的问题', score: { taibai: 2 } },
      { text: '困死了但不好意思拒绝', score: { tudi: 2 } },
      { text: '直接说"我要睡了明天聊"', score: { zhongkui: 1, nezha: 1 } },
      { text: '可以，正好我还没睡', score: { nezha: 2 } },
      { text: '打起精神陪到底', score: { yueLao: 2 } }
    ]},
    { id: 25, text: '你更喜欢哪种类型的电影？', options: [
      { text: '商战/金融题材', score: { caishen: 2 } },
      { text: '科幻/悬疑烧脑片', score: { taibai: 2 } },
      { text: '温情治愈片', score: { tudi: 2, yueLao: 1 } },
      { text: '动作/武侠片', score: { zhongkui: 2, nezha: 1 } },
      { text: '动画/奇幻片', score: { nezha: 2 } },
      { text: '爱情片', score: { yueLao: 2, tudi: 1 } }
    ]},
    { id: 26, text: '你的社交账号签名最可能是？', options: [
      { text: '搞钱才是正经事', score: { caishen: 2 } },
      { text: '智者不入爱河', score: { taibai: 2 } },
      { text: '平平淡淡才是真', score: { tudi: 2 } },
      { text: '正义也许会迟到但不会缺席', score: { zhongkui: 2 } },
      { text: '我的人生我做主', score: { nezha: 2 } },
      { text: '愿所有人都被温柔对待', score: { yueLao: 2 } }
    ]},
    { id: 27, text: '你最讨厌别人对你说什么？', options: [
      { text: '谈钱伤感情', score: { caishen: 2 } },
      { text: '你想太多了', score: { taibai: 2 } },
      { text: '你活该', score: { tudi: 2 } },
      { text: '关你什么事', score: { zhongkui: 2 } },
      { text: '你不行的', score: { nezha: 2 } },
      { text: '你太敏感了', score: { yueLao: 2 } }
    ]},
    { id: 28, text: '如果能穿越回古代，你想做什么？', options: [
      { text: '经商，当天下首富', score: { caishen: 2 } },
      { text: '当军师，运筹帷幄', score: { taibai: 2 } },
      { text: '当个地主，收租过日子', score: { tudi: 2 } },
      { text: '当官，惩奸除恶', score: { zhongkui: 2 } },
      { text: '闯荡江湖，快意恩仇', score: { nezha: 2 } },
      { text: '开个茶馆，听人间故事', score: { yueLao: 2 } }
    ]},
    { id: 29, text: '你收到礼物时第一反应是？', options: [
      { text: '多少钱？贵不贵？', score: { caishen: 2 } },
      { text: '他为什么要送我礼物？', score: { taibai: 2, zhongkui: 1 } },
      { text: '好开心！认真道谢', score: { tudi: 2 } },
      { text: '太客气了不用不用', score: { zhongkui: 1, tudi: 1 } },
      { text: '马上拆开，迫不及待', score: { nezha: 2 } },
      { text: '感动，记住这份心意', score: { yueLao: 2 } }
    ]},
    { id: 30, text: '你觉得自己上辈子是什么命？', options: [
      { text: '富贵命，天生有钱', score: { caishen: 2 } },
      { text: '智慧命，看透红尘', score: { taibai: 2 } },
      { text: '平凡命，安稳一生', score: { tudi: 2 } },
      { text: '斗士命，专治各种不服', score: { zhongkui: 2 } },
      { text: '浪子命，自由不羁', score: { nezha: 2 } },
      { text: '情种命，为爱而生', score: { yueLao: 2 } }
    ]}
  ],
  scoring: {
    dimensions: ['caishen', 'taibai', 'tudi', 'zhongkui', 'nezha', 'yueLao'],
    dimDisplayMap: { caishen: '财神', taibai: '太白', tudi: '土地公', zhongkui: '钟馗', nezha: '哪吒', yueLao: '月老' },
    getType(scores) {
      const types = ['caishen', 'taibai', 'tudi', 'zhongkui', 'nezha', 'yueLao'];
      let max = 0, type = 'caishen';
      types.forEach(t => {
        if ((scores[t] || 0) > max) { max = scores[t]; type = t; }
      });
      return type;
    }
  },
  results: {
    'caishen': {
      title: '财神爷转世 💰',
      rank: '上品·天官',
      sum: '命里带财，横竖都赚钱',
      brief: '你上辈子是财神爷，这辈子注定跟钱有缘。朋友聚会你抢着买单不是因为你有钱，而是因为你知道——钱花出去，会带着更多钱回来。但注意：你对朋友太好，容易被人当冤大头。你的钱也是钱，该抠的时候得抠。',
      tagline: '我就是那个：发工资当天像财神，月底像乞丐的神奇物种 💰',
      rarity: '稀有 · 全国仅15%',
      percent: '15%',
      strengths: '财运好、人缘广、天生有赚钱嗅觉',
      weaknesses: '容易当冤大头、花钱大手大脚、太讲义气',
      career: '金融、销售、创业、投资',
      conversation: '快帮我看看：我是财神爷转世，你是什么神仙？',
      ratings: { 财运: 9, 桃花: 5, 福缘: 7, 事业: 8, 正义感: 4 }
    },
    'taibai': {
      title: '太白金星转世 ✨',
      rank: '上品·天官',
      sum: '聪明绝顶，人间清醒',
      brief: '你上辈子是太白金星，天庭第一谋士。洞察力强，总能看透事情本质，是朋友眼中的"人间清醒"。别人纠结的时候你已经在想第三步了。但你最大的问题是：想得太多做得太少，脑子在天上飞，身体在床上躺。少想多做，你的成就远不止现在这样。',
      tagline: '我就是那种：嘴上说"我能行"，身体说"我再躺5分钟"的人 😴',
      rarity: '稀有 · 全国仅18%',
      percent: '18%',
      strengths: '洞察力强、聪明、善谋划',
      weaknesses: '想多做少、容易拖延、过于理性',
      career: '咨询、策划、策略分析、学术研究',
      conversation: '测出我是太白金星转世，天庭第一谋士！你是什么神仙？',
      ratings: { 财运: 6, 桃花: 6, 福缘: 8, 事业: 7, 正义感: 5 }
    },
    'tudi': {
      title: '土地公转世 🏔️',
      rank: '中品·地官',
      sum: '老实本分，岁月静好',
      brief: '你上辈子是土地公，守护一方百姓。你这辈子也是个好人——老实、靠谱、不惹事。朋友有困难第一个想到你，老板有苦活第一个也想到你。你太善良了，以至于经常被人当工具人。土地公也是神，别老把自己当跑腿的。学会拒绝，你值得被认真对待。',
      tagline: '我就是朋友口中的"靠谱青年"——但靠谱到经常被当工具人 😅',
      rarity: '常见 · 全国约22%',
      percent: '22%',
      strengths: '靠谱、老实、脾气好、乐于助人',
      weaknesses: '不会拒绝、容易被利用、缺乏主见',
      career: '行政、后勤、客服、教育',
      conversation: '测出我是土地公转世！老实人也有春天，你是什么神仙？',
      ratings: { 财运: 5, 桃花: 7, 福缘: 9, 事业: 5, 正义感: 6 }
    },
    'zhongkui': {
      title: '钟馗转世 ⚔️',
      rank: '上品·天官',
      sum: '正义感爆棚，嫉恶如仇',
      brief: '你上辈子是钟馗，专抓妖魔鬼怪的。你这辈子也是个硬骨头——看不惯的事一定要说，不公平的事一定要管。同事摸鱼你举报，朋友插队你拉回来。好人觉得你靠谱，坏人觉得你难缠。但也别太刚了，有些事装作没看见，不是软弱，是智慧。',
      tagline: '我就是那种：看到插队的必须管，朋友圈有人发广告必须怼的硬核人类 👺',
      rarity: '稀有 · 全国仅12%',
      percent: '12%',
      strengths: '正义感强、敢于发声、原则性强',
      weaknesses: '太刚容易得罪人、不够圆滑、容易钻牛角尖',
      career: '法务、纪检、质检、评论员',
      conversation: '测出我是钟馗转世！谁不服来battle，你是什么神仙？',
      ratings: { 财运: 5, 桃花: 4, 福缘: 6, 事业: 9, 正义感: 10 }
    },
    'nezha': {
      title: '哪吒转世 🔥',
      rank: '中品·天官',
      sum: '叛逆热血，不服就干',
      brief: '你上辈子是哪吒，三头六臂的叛逆少年。你这辈子也是个小暴脾气——看不惯就怼，不爽就翻脸。你有用不完的精力和想法，但常常三分钟热度。你最大的敌人不是别人，是你的耐心。学会把事情做完而不是只开个头，你会发现自己有多牛。',
      tagline: '我就是那种：干饭第一名、干活最后一名、但关键时刻从不掉链子的叛逆少年 🔥',
      rarity: '常见 · 全国约20%',
      percent: '20%',
      strengths: '精力旺盛、敢于尝试、有冲劲',
      weaknesses: '三分钟热度、脾气急、不够耐心',
      career: '创意、市场、公关、自由职业',
      conversation: '我是哪吒转世！三头六臂就是我，你是什么神仙？来battle！',
      ratings: { 财运: 6, 桃花: 8, 福缘: 5, 事业: 7, 正义感: 7 }
    },
    'yueLao': {
      title: '月老转世 🌸',
      rank: '上品·天官',
      sum: '天生媒人体质，操心命',
      brief: '你上辈子是月老，专门给人牵红线。你这辈子也是个热心肠——朋友的感情问题你比当事人还上心，别人分手你比人家还难过。你共情能力超强，跟你聊天特别舒服，但你太在意别人的感受了。月老也得谈恋爱啊！别光给别人牵线，给自己也安排上。',
      tagline: '身边朋友的感情史我能倒背如流，但我自己的...算了不说了 🌸',
      rarity: '稀有 · 全国仅10%',
      percent: '10%',
      strengths: '共情力强、善解人意、热心',
      weaknesses: '过度操心、忽略自己、容易内耗',
      career: '人事、心理咨询、婚恋行业、服务行业',
      conversation: '我是月老转世！你的姻缘线我牵的，快来测测你是什么神仙！',
      ratings: { 财运: 4, 桃花: 10, 福缘: 7, 事业: 5, 正义感: 5 }
    },
    'default': {
      title: '迷路的散仙 🌟',
      rank: '散仙·不入流',
      sum: '还没找到组织',
      brief: '你上辈子可能是个散仙，自由自在无拘无束。你这辈子也一样——不喜欢被定义，不喜欢被安排。你还在找自己的路，别急，该来的总会来。',
      tagline: '我就是我，不一样的烟火——虽然我也不知道自己是什么烟火 🎆',
      rarity: '极其稀有 · 全国仅0.1%',
      percent: '0.1%',
      strengths: '自由、随性、不被定义',
      weaknesses: '缺乏方向、容易随波逐流',
      career: '自由职业、艺术创作、探险',
      conversation: '我是迷路的散仙，万中无一的那种！你是什么神仙？',
      ratings: { 财运: 5, 桃花: 5, 福缘: 5, 事业: 5, 正义感: 5 }
    }
  },
  aiPrompt: ''
};
