// ============================================================
// 🏔️ 茅山趣测路线图 — Maoshan Quest Route Map
// 三宫五观 · 九峰十八泉 · 二十六洞 · 二十八池
// 全屏散布 · 分支路径 · 隐藏副本
// ============================================================

const imageMap = require('./image-map');

/**
 * 路径关系定义（主路 + 分支 + 副本）
 * 每个条目格式: [fromId, toId, type]
 *   type: 'main'的主路, 'branch'支线, 'loop'环线
 */
const PATH_LINKS = [
  // ======= 主路（蜿蜒 S 形从山脚到山顶） =======
  ['shanmen',     'jinianguan',    'main'],   // 山门 → 测字馆
  ['jinianguan',  'jinianbei',     'main'],   // 测字馆 → 国学社
  ['jinianbei',   'xike_quan',     'main'],   // 国学社 → 喜客泉
  ['xike_quan',   'chongxi',       'main'],   // 喜客泉 → 崇禧万寿宫
  ['chongxi',     'laozi_xiang',   'main'],   // 崇禧 → 老子神像
  ['laozi_xiang', 'feichangdao',   'main'],   // 老子 → 非常道
  ['feichangdao', 'huayang_dong',  'main'],   // 非常道 → 华阳洞（副本入口）
  ['huayang_dong','yuanfu',        'main'],   // 华阳洞 → 元符万宁宫
  ['yuanfu',      'jiuxiao',       'main'],   // 元符宫 → 九霄万福宫（山顶）
  // ======= 左路支线（山涧秘境） =======
  ['jinianguan',  'xixin_chi',     'branch'], // 测字馆 → 洗心池
  ['xixin_chi',   'hou_gu',        'branch'], // 洗心池 → 灵猴谷
  ['xike_quan',   'hou_gu',        'branch'], // 喜客泉 → 灵猴谷（捷径）
  // ======= 右路支线（登高望远） =======
  ['laozi_xiang', 'xianren_dong',  'branch'], // 老子像 → 仙人洞
  ['xianren_dong','tingyun_tai',   'branch'], // 仙人洞 → 停云台
  ['xianren_dong','cuiyun_lang',   'branch'], // 仙人洞 → 翠云廊
  ['cuiyun_lang', 'renyou',        'branch'], // 翠云廊 → 仁祐观（右峰顶）
  // ======= 山顶环线 =======
  ['jiuxiao',     'deyou',         'loop'],   // 九霄宫 → 德祐观（左峰）
  ['deyou',       'renyou',        'loop'],   // 德祐观 → 仁祐观（右峰）
  ['renyou',      'yuanfu',        'loop'],   // 仁祐观 → 元符宫（下山捷径）
  // ======= 隐藏彩蛋（不显示路径，点到了才知道） =======
  ['tingyun_tai', 'wangxian_ting', 'branch'], // 停云台 → 望仙亭
  ['jinianbei',   'ziyun_dong',    'branch'], // 国学社 → 紫云洞
];

const SPOTS = [
  // ==================== 山顶区 (y: 5~18) ====================
  {
    id: 'jiuxiao',
    name: '九霄万福宫',
    alias: '顶宫',
    zone: 'peak',
    zoneName: '山顶仙阙',
    x: 50, y: 5,
    icon: '🏯',
    color: '#c9a84c',
    desc: '茅山最高处，云雾缭绕，紫气东来。登顶俯瞰，万山如朝。',
    testId: 'past_life',
    testName: '前世今生',
    testIcon: '🌀',
    testBrief: '立于茅山之巅，回望你的前世是谁',
    keywords: ['大茅峰', '主峰', '九霄', '天宫'],
    story: '九霄万福宫始建于元代，坐落在茅山最高峰大茅峰之巅。传说在此处可以看到前世今生的幻影。',
    isFinal: true
  },
  {
    id: 'deyou',
    name: '德祐观',
    alias: '二茅峰',
    zone: 'peak',
    zoneName: '山顶仙阙',
    x: 18, y: 14,
    icon: '🏛️',
    color: '#8b7355',
    desc: '二茅峰巅，专祀二茅真君茅固。古朴幽静，千年香火。',
    testId: 'mbti_simple',
    testName: 'MBTI人格',
    testIcon: '🧠',
    testBrief: '在这座智慧之峰，看清你的人格密码',
    keywords: ['二茅峰', '茅固', '中茅峰'],
    story: '德祐观建于元代延祐年间，供奉二茅真君茅固。道教认为此处灵气极盛，最适合静思悟道。'
  },
  {
    id: 'renyou',
    name: '仁祐观',
    alias: '三茅峰',
    zone: 'peak',
    zoneName: '山顶仙阙',
    x: 80, y: 12,
    icon: '⛩️',
    color: '#7a6b5c',
    desc: '三茅峰顶，三茅君道场。天高地阔，心怀仁德。',
    testId: 'ancient_id',
    testName: '古代身份',
    testIcon: '👑',
    testBrief: '在三茅君的道场，看看你古代是什么身份',
    keywords: ['三茅峰', '三茅真君'],
    story: '仁祐观供奉三茅真君茅衷，是三茅峰的地标。据说在此处许愿，能看清自己前世的身份地位。'
  },

  // ==================== 山腰上区 (y: 22~34) ====================
  {
    id: 'yuanfu',
    name: '元符万宁宫',
    alias: '印宫',
    zone: 'mid_upper',
    zoneName: '山腰仙府',
    x: 45, y: 22,
    icon: '🕌',
    color: '#b8860b',
    desc: '茅山主宫，藏有宋哲宗所赐玉印。镇山重宝，万法归宗。',
    testId: 'wu_xing',
    testName: '五行人格',
    testIcon: '☯️',
    testBrief: '在万法归宗之地，测你的五行属性',
    keywords: ['积金峰', '玉印', '主宫', '万宁'],
    story: '元符万宁宫因藏有宋哲宗御赐玉印而得名"印宫"，是茅山最重要的宫观。五行之气在此汇聚。',
    isHot: true
  },
  {
    id: 'wangxian_ting',
    name: '望仙亭',
    alias: '观云台',
    zone: 'mid_upper',
    zoneName: '山腰仙府',
    x: 92, y: 28,
    icon: '🏗️',
    color: '#6a8a7a',
    desc: '悬崖边的观景亭，远眺群山如黛。隐约可见仙人乘鹤的幻影。',
    testId: 'immortal_cluster',
    testName: '神仙转世',
    testIcon: '⭐',
    testBrief: '在望仙亭眺望云海，看看你是哪路神仙转世',
    keywords: ['观景台', '云海', '仙人'],
    story: '望仙亭初建于明代，亭中有个传说——每当云海翻涌时，能看到仙人乘鹤而过的身影。你凝神细看，会看到谁呢？',
    isHidden: true
  },

  // ==================== 山腰中区 (y: 36~50) ====================
  {
    id: 'huayang_dong',
    name: '华阳洞',
    alias: '第八洞天 · 副本',
    zone: 'mid_mid',
    zoneName: '洞天秘境',
    x: 30, y: 36,
    icon: '🕳️',
    color: '#4a6b5a',
    desc: '"第一福地，第八洞天"。茅山最著名的古洞，洞中别有天地，内有多个秘境。',
    testId: 'hidden_talent',
    testName: '隐藏天赋',
    testIcon: '🔮',
    testBrief: '入洞探秘，发现你不为人知的隐藏天赋',
    keywords: ['福地', '洞天', '古洞', '副本'],
    story: '华阳洞是茅山"第八洞天"的核心，自古就是修炼圣地。传说洞中别有洞天，深不可测，藏着无数秘境。',
    isDungeon: true,
    dungeonSpots: [
      { id: 'huayang_men',   name: '洞门石阶', alias: '初入洞天',  x: 50, y: 8,  icon: '🚪', color: '#5a7a6a', testId: 'random',        testName: '随缘一测',   testIcon: '🎲', testBrief: '踏入洞门，随缘一测',             desc: '洞门石阶长满青苔，墙上刻着"第八洞天"四个大字。', story: '洞门石阶两旁古木参天，石壁上"第八洞天"四个字据说是陶弘景亲笔所题。' },
      { id: 'huayang_tan',   name: '灵泉潭',   alias: '水月洞天',  x: 18, y: 30, icon: '💧', color: '#4682b4', testId: 'love_portrait',  testName: '桃花缘',     testIcon: '💕', testBrief: '在灵泉潭边，照一照你的姻缘',       desc: '一汪清潭，倒映钟乳石影。水波微澜，如诉如泣。',  story: '潭水清澈见底，传说在月圆之夜向潭水投一枚铜钱，能看到未来心上人的倒影。' },
      { id: 'huayang_shi',   name: '炼丹室',   alias: '九转丹房',  x: 82, y: 28, icon: '⚗️', color: '#8b4513', testId: 'xiuxian',       testName: '修仙资质',   testIcon: '✨', testBrief: '古丹房里，测测你的修仙根骨',       desc: '石室中残留着炼丹炉的遗迹，空气中隐约有药香。', story: '当年葛洪曾在此炼丹，炉火三日不熄。石壁上刻满丹诀，至今仍能感受到那份专注。' },
      { id: 'huayang_zhen',  name: '真君石像', alias: '三茅显圣',  x: 50, y: 52, icon: '🗿', color: '#c9a84c', testId: 'past_life',      testName: '前世今生',   testIcon: '🌀', testBrief: '三茅真君像前，看看你的前世',       desc: '洞中最深处，三尊石像端坐莲台，庄严肃穆。',  story: '三茅真君的汉白玉像静立于此，据说虔诚跪拜，便能在石像眼中看到自己的前世影像。' },
      { id: 'huayang_out',   name: '出洞口',   alias: '重返人间',  x: 88, y: 56, icon: '☀️', color: '#6a8a5a', testId: 'spiritual_root', testName: '灵根测试',   testIcon: '🌿', testBrief: '从洞中出来，晒晒太阳，测测灵根',   desc: '从洞中钻出，豁然开朗。阳光温暖，鸟鸣山幽。',  story: '据说从华阳洞走一遭再出来，人就脱胎换骨了。晒晒太阳，感受一下自己是不是灵根觉醒了。', isDungeonExit: true }
    ]
  },
  {
    id: 'xianren_dong',
    name: '仙人洞',
    alias: '蓬壶洞',
    zone: 'mid_mid',
    zoneName: '洞天秘境',
    x: 62, y: 42,
    icon: '🕳️',
    color: '#5a7a6a',
    desc: '天然溶洞，长920米。钟乳奇观，仙气缭绕。传说有仙人曾在此修炼。',
    testId: 'hidden_talent',
    testName: '洞中探秘',
    testIcon: '🔦',
    testBrief: '深入仙人洞府，探寻隐藏天赋',
    keywords: ['溶洞', '蓬壶', '修炼', '仙人'],
    story: '仙人洞是茅山天然溶洞，钟乳石形成"灵龟护法""万寿台"等奇观。旧时道士常在此闭关修炼。'
  },
  {
    id: 'feichangdao',
    name: '非常道',
    alias: '修仙步道',
    zone: 'mid_mid',
    zoneName: '洞天秘境',
    x: 48, y: 48,
    icon: '🛤️',
    color: '#6b8e5a',
    desc: '取自《道德经》"道可道，非常道"。盘山步道，一步一景，一步一悟。',
    testId: 'stress_test',
    testName: '压力速测',
    testIcon: '🧘',
    testBrief: '走在修仙步道上，让心静下来，测测你的压力值',
    keywords: ['道德经', '步道', '盘山'],
    story: '非常道取意自老子《道德经》开篇。走在这条步道上，感受山水灵气，内心自然安静。'
  },
  {
    id: 'cuiyun_lang',
    name: '翠云廊',
    alias: '绿荫长廊',
    zone: 'mid_mid',
    zoneName: '洞天秘境',
    x: 78, y: 50,
    icon: '🌿',
    color: '#5a8a6a',
    desc: '一条被古树翠竹掩映的长廊，阳光透过绿叶洒下斑驳光影。',
    testId: 'animal_personality',
    testName: '动物人格',
    testIcon: '🦊',
    testBrief: '穿过翠云廊，看看你像哪种小动物',
    keywords: ['长廊', '绿荫', '竹林'],
    story: '翠云廊是山腰一条幽静小道，两旁古竹参天，风过竹梢沙沙作响。走在廊中，仿佛回到了另一个时代。',
    isHidden: true
  },

  // ==================== 山腰下区 (y: 54~66) ====================
  {
    id: 'tingyun_tai',
    name: '停云台',
    alias: '停云霭霭',
    zone: 'mid_lower',
    zoneName: '山腰漫步',
    x: 72, y: 58,
    icon: '☁️',
    color: '#7b9eb3',
    desc: '半山观景平台，取自陶渊明《停云》。"霭霭停云，濛濛时雨"。',
    testId: 'tingyun',
    testName: '停云心语',
    testIcon: '💭',
    testBrief: '在停云台上，对着山间云雾，说说你心里的话',
    keywords: ['停云', '陶渊明', '观景台'],
    story: '山腰此台，终日云雾缭绕。陶渊明千年前写下"停云霭霭"，思念远方亲友。你在此驻足，又想对谁诉说？',
    poetry: {
      title: '停云',
      author: '魏晋 · 陶渊明',
      preface: '停云，思亲友也。罇湛新醪，园列初荣，愿言不从，叹息弥襟。',
      verses: [ '霭霭停云，濛濛时雨。', '八表同昏，平路伊阻。', '静寄东轩，春醪独抚。', '良朋悠邈，搔首延伫。', '', '停云霭霭，时雨濛濛。', '八表同昏，平陆成江。', '有酒有酒，闲饮东窗。', '愿言怀人，舟车靡从。', '', '东园之树，枝条载荣。', '竞用新荣，以怡余情。', '人亦有言：日月于征。', '安得促席，说彼平生。', '', '翩翩飞鸟，息我庭柯。', '敛翮闲止，好声相和。', '岂无他人，念子实多。', '愿言不获，抱恨如何！' ]
    },
    isBrand: true
  },
  {
    id: 'hou_gu',
    name: '灵猴谷',
    alias: '猕猴乐园',
    zone: 'mid_lower',
    zoneName: '山腰漫步',
    x: 10, y: 62,
    icon: '🐒',
    color: '#c4956a',
    desc: '茅山森林深处，野生猕猴的家园。它们调皮机灵，见人就讨吃的。',
    testId: 'monkey',
    testName: '猴王争霸',
    testIcon: '👑',
    testBrief: '猴群中你是哪一只？测测你的猴格属性',
    keywords: ['猕猴', '森林', '野生'],
    story: '茅山森林世界栖息着一群野生猕猴，它们是这片山林的原住民。据说这群猴子有自己的"社会"，等级分明，性格各异。',
    isFun: true
  },

  // ==================== 山麓区 (y: 68~78) ====================
  {
    id: 'chongxi',
    name: '崇禧万寿宫',
    alias: '寿宫',
    zone: 'foot',
    zoneName: '山麓福地',
    x: 38, y: 64,
    icon: '🏠',
    color: '#8b4513',
    desc: '陶弘景祖师的"华阳下馆"，祈福延寿的圣地。',
    testId: 'love_portrait',
    testName: '桃花缘',
    testIcon: '💕',
    testBrief: '在千年福地，看看你的桃花运如何',
    keywords: ['寿宫', '陶弘景', '曲林馆'],
    story: '崇禧万寿宫原为陶弘景的"华阳下馆"，历代皇帝都曾在此祈福。这里灵气温润，最适合测姻缘。'
  },
  {
    id: 'xike_quan',
    name: '喜客泉',
    alias: '拍手泉',
    zone: 'foot',
    zoneName: '山麓福地',
    x: 22, y: 72,
    icon: '💧',
    color: '#4682b4',
    desc: '茅山最神奇的古泉！游客鼓掌，泉水就会冒泡回应。',
    testId: 'animal_personality',
    testName: '动物人格',
    testIcon: '🦊',
    testBrief: '对着灵泉拍一拍手，看看你像哪种动物',
    keywords: ['灵泉', '鼓掌', '冒泡'],
    story: '喜客泉是茅山十九泉中最神奇的一眼。人在泉边鼓掌，泉水便会咕嘟咕嘟冒泡，像是大自然在回应你。'
  },
  {
    id: 'laozi_xiang',
    name: '老子神像',
    alias: '道家之源',
    zone: 'foot',
    zoneName: '山麓福地',
    x: 52, y: 76,
    icon: '🗿',
    color: '#b8860b',
    desc: '世界最高老子像，高33米。面朝群山，手抱太极，气势恢宏。',
    testId: 'adventure',
    testName: '秘境奇谈',
    testIcon: '🏮',
    testBrief: '感受老子智慧，开启你的沉浸式奇遇',
    keywords: ['老子', '太极', '神像'],
    story: '老子神像高33米，是世界最高的老子塑像。在此处驻足，仿佛能感受到千年的道家智慧。',
    isNew: true
  },

  // ==================== 山脚区 (y: 80~95) ====================
  {
    id: 'shanmen',
    name: '山门',
    alias: '入口',
    zone: 'base',
    zoneName: '山门初入',
    x: 50, y: 95,
    icon: '⛩️',
    color: '#c7512e',
    desc: '茅山景区入口，从这里开始你的"趣测"之旅。',
    testId: 'random',
    testName: '随机开测',
    testIcon: '🎲',
    testBrief: '初入山门，随缘一测',
    keywords: ['入口', '山门'],
    story: '踏入这道山门，就进入了一个充满仙气的世界。随缘一测，看看今天哪个仙人想见你。',
    isQuick: true
  },
  {
    id: 'jinianguan',
    name: '测字馆',
    alias: '随缘测字',
    zone: 'base',
    zoneName: '山门初入',
    x: 15, y: 86,
    icon: '🔮',
    color: '#7a5a8a',
    desc: '街角的老字号测字馆，道骨仙风的先生在此摆摊。测一个字，知一段缘。',
    testId: 'xiuxian',
    testName: '修仙资质',
    testIcon: '✨',
    testBrief: '测一个字，看看你的修仙根骨如何',
    keywords: ['测字', '算命', '街市'],
    story: '茅山脚下有一家百年测字馆，白发先生坐堂，来者报一字，他便能断出三分天机。来都来了，不妨测一字？',
    isQuick: true
  },
  {
    id: 'jinianbei',
    name: '国学研习社',
    alias: '经典传承',
    zone: 'base',
    zoneName: '山门初入',
    x: 32, y: 82,
    icon: '📖',
    color: '#5a7a6a',
    desc: '一方清净书斋，三五同道，品读道德经、南华经、周易。',
    testId: 'spiritual_root',
    testName: '灵根测试',
    testIcon: '🌿',
    testBrief: '在书斋里静静心，测测你的国学灵根',
    keywords: ['国学', '书斋', '经典'],
    story: '这是一间藏于街市中的小书斋，案上摊着《道德经》，墙上挂着"知人者智，自知者明"的条幅。',
    isBrand: true
  },
  {
    id: 'xixin_chi',
    name: '洗心池',
    alias: '涤尘泉',
    zone: 'base',
    zoneName: '山门初入',
    x: 5, y: 74,
    icon: '💎',
    color: '#5a8aaa',
    desc: '一汪清澈的山泉，传说在此洗手洗脸能洗去心中的杂念。',
    testId: 'stress_test',
    testName: '压力速测',
    testIcon: '🧘',
    testBrief: '用清泉洗把脸，测测你现在的压力有多大',
    keywords: ['清泉', '洗心', '涤尘'],
    story: '洗心池在茅山古道旁，泉水终年不涸。有老道说，用这水洗过脸后，心里那些乱七八糟的事就少了一半。',
    isHidden: true
  },
  {
    id: 'ziyun_dong',
    name: '紫云洞',
    alias: '烟霞别院',
    zone: 'base',
    zoneName: '山门初入',
    x: 85, y: 88,
    icon: '🌌',
    color: '#7a5a8a',
    desc: '藏在竹林深处的小洞，洞中常年有紫色雾气流转，如梦似幻。',
    testId: 'love_portrait',
    testName: '桃花缘',
    testIcon: '💕',
    testBrief: '在紫云缭绕之中，测测你的桃花运',
    keywords: ['紫云', '烟霞', '竹林'],
    story: '紫云洞很小，但很神秘。每到黄昏时分，洞中会飘出淡淡的紫色雾气，远远看去像一片晚霞落在了山腰上。',
    isHidden: true
  }
];

// ==================== 区域分组 ====================
const ZONES = [
  { id: 'peak',      name: '山顶仙阙',   icon: '🏔️', desc: '三峰鼎立 · 俯瞰凡尘',        color: '#c9a84c' },
  { id: 'mid_upper', name: '山腰仙府',   icon: '🏛️', desc: '仙宫巍峨 · 玉印镇山',        color: '#b8860b' },
  { id: 'mid_mid',   name: '洞天秘境',   icon: '🕳️', desc: '洞天福地 · 别有洞天',        color: '#4a6b5a' },
  { id: 'mid_lower', name: '山腰漫步',   icon: '🌲', desc: '云雾缭绕 · 灵猴出没',        color: '#6b8e5a' },
  { id: 'foot',      name: '山麓福地',   icon: '🏡', desc: '灵泉古观 · 祥瑞齐聚',        color: '#8b7355' },
  { id: 'base',      name: '山门初入',   icon: '🚪', desc: '踏入仙山 · 从此不凡',        color: '#8b4513' }
];

// ==================== 测试入口映射 ====================
const TEST_ROUTES = {
  past_life: '/pages/quiz/quiz?testId=past_life',
  mbti_simple: '/pages/quiz/quiz?testId=mbti_simple',
  ancient_id: '/pages/quiz/quiz?testId=ancient_id',
  wu_xing: '/pages/quiz/quiz?testId=wu_xing',
  immortal_cluster: '/pages/quiz/quiz?testId=immortal_cluster',
  hidden_talent: '/pages/quiz/quiz?testId=hidden_talent',
  stress_test: '/pages/quiz/quiz?testId=stress_test',
  love_portrait: '/pages/quiz/quiz?testId=love_portrait',
  animal_personality: '/pages/quiz/quiz?testId=animal_personality',
  xiuxian: '/pages/quiz/quiz?testId=xiuxian',
  spiritual_root: '/pages/quiz/quiz?testId=spiritual_root',
  adventure: '/pages/adventure/adventure',
  thinking_style: '/pages/quiz/quiz?testId=mbti_simple',
  tingyun: null,
  monkey: null,
  random: null
};

// 注入景点故事图
function enrichSpot(spot) {
  if (!spot || spot._enriched) return spot;
  spot.storyImage = imageMap.getSpotStory(spot.id);
  if (spot.dungeonSpots) {
    spot.dungeonSpots.forEach(d => {
      d.storyImage = imageMap.getSpotStory(d.id);
    });
  }
  spot._enriched = true;
  return spot;
}

function getAllSpots() {
  SPOTS.forEach(enrichSpot);
  return SPOTS;
}

function getSpotsByZone() {
  const map = {};
  SPOTS.forEach(spot => {
    enrichSpot(spot);
    if (!map[spot.zone]) map[spot.zone] = { zone: spot.zone, zoneName: spot.zoneName, spots: [] };
    map[spot.zone].spots.push(spot);
  });
  return ZONES.map(z => ({ ...z, spots: map[z.id] ? map[z.id].spots : [] }));
}

function getSpotById(id) {
  const spot = SPOTS.find(s => s.id === id) || null;
  if (spot) enrichSpot(spot);
  return spot;
}

function getTestRoute(testId) {
  if (testId === 'random') return '/pages/quiz/quiz?testId=random';
  return TEST_ROUTES[testId] || null;
}

// 随机选取一个有效测试，用于"随缘一测"
const RANDOM_TEST_POOL = [
  'immortal', 'xiuxian', 'wu_xing', 'mbti_simple', 'stress_test',
  'animal_personality', 'past_life', 'guardian_beast', 'ancient_id',
  'immortal_cluster', 'spiritual_root', 'hidden_talent', 'love_portrait'
];
function getRandomTestRoute() {
  const idx = Math.floor(Math.random() * RANDOM_TEST_POOL.length);
  const testId = RANDOM_TEST_POOL[idx];
  return '/pages/quiz/quiz?testId=' + testId;
}

function getPathLinks() {
  return PATH_LINKS;
}

/**
 * 获取指定副本的子景点
 */
function getDungeonSpots(spotId) {
  const spot = getSpotById(spotId);
  if (!spot || !spot.isDungeon || !spot.dungeonSpots) return null;
  return spot.dungeonSpots;
}

module.exports = {
  SPOTS, ZONES, TEST_ROUTES, PATH_LINKS,
  getAllSpots, getSpotsByZone, getSpotById, getTestRoute, getRandomTestRoute, getPathLinks, getDungeonSpots
};
