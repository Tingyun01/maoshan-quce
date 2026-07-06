/**
 * lock-teasers.js — 茅山图鉴"诱饵系统" v2.0
 *
 * 全面茅山化：每个解锁项都是茅山相关的历史人物、传奇故事、景点秘闻。
 * 用途：茅山景区地推——游客扫码玩测试，图鉴解锁=深度了解茅山文化。
 *
 * 包含 icon（表情）、hint（一句话诱惑）、effect（视觉特效）、
 *       scene（画面描述）、dynasty（朝代）、story（人物/景点故事）
 */

const LOCK_TEASERS = {

  // ===== 五行人格 — 茅山五行灵地 =====
  'wu_xing.jin':  { icon: '⚔️', hint: '金顶锋芒',   effect: 'golden',  scene: '九霄万福宫金顶，日出时金光万丈',       dynasty: '元', story: '九霄万福宫金顶之魄' },
  'wu_xing.mu':   { icon: '🌳', hint: '古木参天',   effect: 'green',   scene: '翠云廊千年古竹，遮天蔽日如绿色穹顶',     dynasty: '上古', story: '翠云廊千年竹海' },
  'wu_xing.shui': { icon: '💧', hint: '灵泉涌动',   effect: 'blue',    scene: '喜客泉畔击掌，泉水咕嘟回应你的到来',     dynasty: '上古', story: '喜客泉灵泉之约' },
  'wu_xing.huo':  { icon: '🔥', hint: '丹炉真火',   effect: 'red',     scene: '华阳洞炼丹室炉火重燃，九转丹成',         dynasty: '晋', story: '葛洪炼丹九转炉火' },
  'wu_xing.tu':   { icon: '⛰️', hint: '洞天厚土',   effect: 'brown',   scene: '第八洞天深处，大地脉动与心跳共振',       dynasty: '上古', story: '华阳洞第八洞天' },

  // ===== 神仙转世 — 茅山历代祖师 =====
  'immortal.nezha':    { icon: '🏔️', hint: '大茅真君显圣',   effect: 'glow-golden', scene: '茅盈踏云而来，手持玉如意，仙风道骨',       dynasty: '汉', story: '茅山开派祖师·大茅君茅盈' },
  'immortal.yueLao':   { icon: '⛰️', hint: '二茅真君护法',   effect: 'shimmer',    scene: '茅固端坐德祐观，周身祥光，护佑一方平安',     dynasty: '汉', story: '德祐观供奉·二茅君茅固' },
  'immortal.taibai':   { icon: '⛰️', hint: '三茅真君显灵',   effect: 'shimmer',    scene: '茅衷于仁祐观前眺望群山，心怀天下苍生',       dynasty: '汉', story: '仁祐观供奉·三茅君茅衷' },
  'immortal.zhongkui': { icon: '👹', hint: '茅山捉鬼天师',   effect: 'purple',     scene: '月黑风高，符箓翻飞，妖魔闻风丧胆',           dynasty: '南北朝', story: '茅山上清派捉鬼秘术' },
  'immortal.caishen':  { icon: '👑', hint: '山中宰相驾临',   effect: 'golden',     scene: '陶弘景隐居华阳馆，梁武帝遣使问策山中',     dynasty: '南北朝', story: '山中宰相·陶弘景隐居茅山' },
  'immortal.tudi':     { icon: '📖', hint: '抱朴仙翁炼药',   effect: 'brown',      scene: '葛洪手捧《抱朴子》，丹炉青烟直上九霄',     dynasty: '晋', story: '炼丹宗师·抱朴子葛洪' },

  // ===== 群仙谱 — 历代名人访茅山 =====
  'immortal_cluster.sword_immortal':  { icon: '🍶', hint: '诗仙醉游茅山', effect: 'shimmer', scene: '李白对月独酌，挥毫写下茅山诗篇',               dynasty: '唐', story: '诗仙李白茅山寻仙记' },
  'immortal_cluster.talisman_master': { icon: '📜', hint: '变法名相问道', effect: 'purple',  scene: '王安石登茅山访道，与高僧论法三日',             dynasty: '宋', story: '王安石茅山问道' },
  'immortal_cluster.free_immortal':   { icon: '🌿', hint: '五柳先生归隐', effect: 'shimmer', scene: '陶渊明采菊东篱下，遥望茅山云雾',               dynasty: '晋', story: '陶渊明·停云思茅山' },
  'immortal_cluster.spirit_tamer':    { icon: '🦅', hint: '御赐玉印传奇', effect: 'green',   scene: '宋哲宗亲赐玉印，元符万宁宫名扬天下',           dynasty: '宋', story: '宋哲宗御赐茅山玉印' },

  // ===== 前世今生 — 茅山千年传承 =====
  'past_life.maoying':  { icon: '🏔️', hint: '茅山开派祖师',  effect: 'glow-golden', scene: '茅盈于大茅峰结庐修道，开创千年道统',       dynasty: '汉', story: '大茅君茅盈结庐大茅峰' },
  'past_life.gehong':   { icon: '⚗️', hint: '炼丹宗师葛洪',  effect: 'shimmer',    scene: '葛洪在华阳洞炼丹，著《抱朴子》传世',         dynasty: '晋', story: '葛洪华阳洞炼丹著书' },
  'past_life.hongjing': { icon: '👑', hint: '山中宰相弘景',  effect: 'shimmer',    scene: '梁武帝每有大事，必遣使入茅山问策于弘景',   dynasty: '南北朝', story: '陶弘景山中宰相美誉' },
  'past_life.wangyuan': { icon: '🛡️', hint: '守道真人远知',  effect: 'green',      scene: '王远知守护茅山道统，历经隋唐两朝而不坠',   dynasty: '唐', story: '王远知守护茅山道统' },

  // ===== 守护神兽 — 茅山四灵镇山 =====
  'guardian_beast.dragon':  { icon: '🐉', hint: '青龙盘大茅峰',  effect: 'glow-golden', scene: '青龙盘旋于大茅峰顶，吞吐云雾护九霄宫',   dynasty: '上古', story: '大茅峰青龙镇守' },
  'guardian_beast.phoenix': { icon: '🦅', hint: '朱雀栖万宁宫',  effect: 'shimmer',    scene: '朱雀展翅于元符万宁宫上，羽翼金光灿灿',     dynasty: '上古', story: '元符万宁宫朱雀护法' },
  'guardian_beast.qilin':   { icon: '🦄', hint: '麒麟踏华阳洞',  effect: 'shimmer',    scene: '麒麟静卧华阳洞口，瑞气千条守护洞天',       dynasty: '上古', story: '华阳洞麒麟瑞兽' },
  'guardian_beast.tiger':   { icon: '🐯', hint: '白虎守茅山门',  effect: 'silver',     scene: '白虎威风凛凛立于山门之侧，双目如炬',       dynasty: '上古', story: '茅山山门白虎镇守' },

  // ===== 古代身份 — 茅山历代修道者 =====
  'ancient_id.general':  { icon: '⚔️', hint: '茅山护法将军', effect: 'golden',  scene: '金甲将军执剑立于宫门，守护千年道场',         dynasty: '唐', story: '护法将军镇守茅山宫观' },
  'ancient_id.merchant': { icon: '🏮', hint: '功德施主善人', effect: 'golden',  scene: '富商捐资修宫建观，功德碑上刻其姓名',         dynasty: '宋', story: '虔诚信众捐修茅山宫观' },
  'ancient_id.scholar':  { icon: '📜', hint: '道教学者著书', effect: 'blue',    scene: '青灯古卷之间，学者笔耕不辍整理道藏',         dynasty: '明', story: '道教学者整理茅山道藏' },
  'ancient_id.hero':     { icon: '🗡️', hint: '云游道人仗剑', effect: 'shimmer', scene: '道人踏遍茅山三十六峰，行侠仗义济世度人',     dynasty: '宋', story: '云游道人走遍茅山诸峰' },

  // ===== 灵根测试 — 茅山洞天灵脉 =====
  'spiritual_root.tianling':   { icon: '🌟', hint: '华阳洞天灵根',   effect: 'glow-golden', scene: '华阳洞中灵光冲天，天生修仙奇才',           dynasty: '上古', story: '华阳洞天千年灵气汇聚' },
  'spiritual_root.dipin':      { icon: '⛰️', hint: '元符福地灵根',   effect: 'shimmer',    scene: '元符万宁宫地脉涌动，根基深厚',             dynasty: '宋', story: '元符万宁宫地脉传承' },
  'spiritual_root.bianyiling': { icon: '🌀', hint: '紫云洞变异根',   effect: 'shimmer',    scene: '紫云洞紫雾翻腾，异变之力暗藏',             dynasty: '上古', story: '紫云洞神秘异变灵气' },
  'spiritual_root.wuling':     { icon: '💨', hint: '山门初悟回归',   effect: 'faint',      scene: '站在山门前，以凡人之心感受天地大道',       dynasty: '春秋', story: '老子西出函谷·道法自然' },

  // ===== 隐藏天赋 — 茅山道术秘传 =====
  'hidden_talent.fly':      { icon: '🕊️', hint: '御风而行之术',   effect: 'glow-golden', scene: '身轻如燕，足踏树梢穿越翠云廊',             dynasty: '上古', story: '茅山御风飞行秘术' },
  'hidden_talent.foresee':  { icon: '🔮', hint: '望气预知天机',   effect: 'shimmer',    scene: '站在望仙亭上，望云气而知天下事',           dynasty: '汉', story: '茅山上清望气之术' },
  'hidden_talent.heal':     { icon: '💚', hint: '仙丹妙手回春',   effect: 'green',      scene: '采集茅山百草，炼成治病救人的仙丹',         dynasty: '晋', story: '葛洪茅山采药炼丹' },
  'hidden_talent.strength': { icon: '💪', hint: '搬山移石之力',   effect: 'red',        scene: '独力推开华阳洞千年石门，洞天现世',         dynasty: '上古', story: '华阳洞开山之力' },

  // ===== 桃花缘 — 茅山情缘故事 =====
  'love_portrait.guardian':    { icon: '🛡️', hint: '山盟海誓守护',   effect: 'glow-golden', scene: '在老子神像前立下誓言，此生不负',           dynasty: '唐', story: '茅山道侣山盟海誓' },
  'love_portrait.romantic':    { icon: '🌹', hint: '月下道侣相逢',   effect: 'shimmer',    scene: '月圆之夜华阳洞前，两道身影并肩望月',       dynasty: '宋', story: '华阳洞前月下相逢' },
  'love_portrait.rationalist': { icon: '🧠', hint: '清修知己论道',   effect: 'blue',       scene: '翠云廊中两人论道三天三夜，相视一笑',       dynasty: '南北朝', story: '陶弘景与道友清谈论道' },
  'love_portrait.gentle':      { icon: '🌸', hint: '千年之约等待',   effect: 'pink',       scene: '停云台上，云雾中隐约传来千年琴音',         dynasty: '晋', story: '停云台上千年等一回' },

  // ===== 动物灵兽 — 茅山自然生灵 =====
  'animal_personality.lion':    { icon: '🦁', hint: '守山石狮显灵',   effect: 'golden',  scene: '山门前千年石狮忽然眨眼，神态威猛',           dynasty: '明', story: '茅山山门石狮传说' },
  'animal_personality.wolf':    { icon: '🐺', hint: '茅山灵狼夜行',   effect: 'silver',  scene: '月夜山林中，一双幽绿的眼睛守护山道',         dynasty: '上古', story: '茅山灵狼夜巡山道' },
  'animal_personality.dolphin': { icon: '🐬', hint: '潭中灵鱼戏水',   effect: 'blue',    scene: '洗心池中一尾金色鲤鱼跃出水面，鳞光闪闪',     dynasty: '上古', story: '洗心池金色灵鱼' },
  'animal_personality.cat':     { icon: '🐱', hint: '道观灵猫护殿',   effect: 'purple',  scene: '一只黑猫慵懒卧于宫观门槛，双眼洞察人心',     dynasty: '宋', story: '茅山宫观灵猫护法' },
  'animal_personality.bear':    { icon: '🐻', hint: '山中黑熊问道',   effect: 'brown',   scene: '一头黑熊盘坐仙人洞前，仿佛听道入定',         dynasty: '上古', story: '茅山黑熊听经传说' },
  'animal_personality.deer':    { icon: '🦌', hint: '仙鹿引路入山',   effect: 'shimmer', scene: '一只白鹿立于非常道入口，回首望向来人',       dynasty: '上古', story: '白鹿引路入茅山' },

  // ===== 心境测试 — 茅山四时风光 =====
  'stress_test.good':     { icon: '☀️', hint: '九霄日出心境',   effect: 'golden',  scene: '登顶九霄万福宫，看红日跃出云海，心境澄明',     dynasty: '唐', story: '茅山日出·心旷神怡' },
  'stress_test.mild':     { icon: '⛅', hint: '停云观雾气定',   effect: 'faint',   scene: '在停云台上赏云雾缭绕，一切烦恼随风散去',       dynasty: '晋', story: '停云台上·心平气和' },
  'stress_test.moderate': { icon: '🌧️', hint: '洞中探秘波澜',   effect: 'blue',    scene: '深入华阳洞秘境，黑暗中忽见一线天光',           dynasty: '南北朝', story: '华阳洞探秘·心有波澜' },
  'stress_test.high':     { icon: '⛈️', hint: '登峰路上磨砺',   effect: 'red',     scene: '攀登非常道的陡峭石阶，汗如雨下但风景渐好',   dynasty: '唐', story: '登茅山·历尽艰辛见真章' },

  // ===== 修仙资质 — 茅山修道之路 =====
  'xiuxian.tian': { icon: '👼', hint: '天选之人',     effect: 'glow-golden', scene: '三茅真君显圣，亲收你为入室弟子',             dynasty: '汉', story: '三茅真君亲传弟子' },
  'xiuxian.di':   { icon: '🧘', hint: '洞天修行者',   effect: 'shimmer',    scene: '在华阳洞中静坐修行，感受天地灵气入体',       dynasty: '南北朝', story: '华阳洞中修行悟道' },
  'xiuxian.fan':  { icon: '🙂', hint: '以凡入道者',   effect: 'faint',      scene: '走在非常道上，一步一悟，道在心中不在天边',   dynasty: '春秋', story: '老子·道法自然' },
  'xiuxian.za':   { icon: '🤔', hint: '万法归宗者',   effect: 'faint',      scene: '儒释道三教圆融，集百家之长成一家之言',       dynasty: '宋', story: '茅山三教合一精神' },

  // ===== MBTI 思维偏好 — 茅山十六种修行者 =====
  'mbti_simple.INTJ': { icon: '🏗️', hint: '山中宰相再世',  effect: 'purple',      scene: '陶弘景端坐华阳馆，运筹帷幄天下事',           dynasty: '南北朝', story: '陶弘景·山中宰相之智' },
  'mbti_simple.INTP': { icon: '💡', hint: '炼丹宗师思维',  effect: 'blue',         scene: '葛洪伏案著《抱朴子》，穷尽天地之理',         dynasty: '晋', story: '葛洪·穷理尽性' },
  'mbti_simple.ENTJ': { icon: '👑', hint: '开派祖师气魄',  effect: 'golden',       scene: '茅盈立于大茅峰顶，开创千年道教基业',         dynasty: '汉', story: '茅盈·开宗立派' },
  'mbti_simple.ENTP': { icon: '🎭', hint: '诗仙挥毫纵横',  effect: 'red',          scene: '李白醉卧茅山石，挥笔写就千古诗篇',           dynasty: '唐', story: '李白·茅山醉吟' },
  'mbti_simple.INFJ': { icon: '🔮', hint: '守道真人洞见',  effect: 'glow-golden',  scene: '王远知闭目观心，洞察天下大势',               dynasty: '唐', story: '王远知·洞悉天机' },
  'mbti_simple.INFP': { icon: '🦋', hint: '五柳先生归隐',  effect: 'pink',         scene: '陶渊明采菊东篱，悠然遥望茅山烟霞',           dynasty: '晋', story: '陶渊明·归隐茅山畔' },
  'mbti_simple.ENFJ': { icon: '🌟', hint: '明君护道之人',  effect: 'golden',       scene: '宋哲宗端坐朝堂，心念茅山赐下御印',           dynasty: '宋', story: '宋哲宗·护教明君' },
  'mbti_simple.ENFP': { icon: '🎪', hint: '庙会仙童下凡',  effect: 'pink',         scene: '茅山庙会上，仙童下凡与众同乐',               dynasty: '明清', story: '茅山庙会·仙人下凡' },
  'mbti_simple.ISTJ': { icon: '⚙️', hint: '监院道长持戒',  effect: 'silver',       scene: '监院道长手执法尺，一丝不苟守护宫规',         dynasty: '明', story: '监院道长·恪守规仪' },
  'mbti_simple.ISFJ': { icon: '🛡️', hint: '护法居士守山',  effect: 'green',        scene: '白发居士默默打扫山道，数十年如一日',         dynasty: '清', story: '护法居士·默默坚守' },
  'mbti_simple.ESTJ': { icon: '📊', hint: '方丈执掌宫观',  effect: 'blue',         scene: '方丈端坐议事堂，号令宫观上下井井有条',       dynasty: '宋', story: '茅山方丈·执掌大局' },
  'mbti_simple.ESFJ': { icon: '🤝', hint: '知客道人迎客',  effect: 'pink',         scene: '知客道人笑容满面，为远道香客指引方向',       dynasty: '明清', story: '知客道人·迎来送往' },
  'mbti_simple.ISTP': { icon: '🔧', hint: '炼丹方士精研',  effect: 'silver',       scene: '炼丹炉前火候精准到毫厘，仙丹将成',           dynasty: '晋', story: '炼丹方士·精研奇术' },
  'mbti_simple.ISFP': { icon: '🎨', hint: '山林隐士独居',  effect: 'green',        scene: '茅山深处一间茅屋，隐士独对青山绿水',         dynasty: '唐', story: '山林隐士·独享清幽' },
  'mbti_simple.ESTP': { icon: '🏃', hint: '云游侠客仗剑',  effect: 'red',          scene: '侠客身背长剑踏遍茅山，路见不平拔刀相助',     dynasty: '宋', story: '云游侠客·行侠茅山' },
  'mbti_simple.ESFP': { icon: '🎤', hint: '茅山香会主角',  effect: 'golden',       scene: '茅山香会上，你成了全场焦点载歌载舞',         dynasty: '明清', story: '茅山香会·八方来朝' },
};

// 根据稀有度决定默认视觉
const DEFAULT_BY_RARITY = {
  shenpin: { icon: '✨', hint: '茅山秘宝现世', effect: 'glow-golden', scene: '极稀有·茅山千年灵气汇聚而成' },
  xianpin: { icon: '💫', hint: '仙家遗珍',     effect: 'shimmer',    scene: '较稀有·可遇不可求的茅山奇珍' },
  putong:  { icon: '📦', hint: '茅山故事等你', effect: 'faint',      scene: '每件物品都有茅山的秘密等你发现' },
};

/**
 * 获取某个 lock key 的诱饵数据
 * @param {string} key - "testId.typeCode"
 * @param {string} rarity - "shenpin" | "xianpin" | "putong"
 * @returns {{ icon, hint, effect, scene, dynasty, story }}
 */
function getTeaser(key, rarity) {
  return LOCK_TEASERS[key] || DEFAULT_BY_RARITY[rarity] || DEFAULT_BY_RARITY['putong'];
}

/**
 * 获取某个 testId 的分组主题（用于未解锁卡片统一风格）
 */
const GROUP_THEMES = {
  'wu_xing':            { icon: '🔮', hint: '五行灵地探索',   effect: 'rainbow', scene: '金木水火土，你属于哪一行？' },
  'immortal':           { icon: '🏔️', hint: '茅山历代祖师',   effect: 'golden',  scene: '茅山千年，哪位祖师与你最有缘？' },
  'immortal_cluster':   { icon: '🌟', hint: '名人访茅山',     effect: 'shimmer', scene: '李白、王安石……谁曾来过此处？' },
  'past_life':          { icon: '📜', hint: '茅山千年传承',   effect: 'shimmer', scene: '前世的你，与茅山有何渊源？' },
  'guardian_beast':     { icon: '🐲', hint: '茅山四灵镇守',   effect: 'golden',  scene: '一头神兽在茅山中守护着你' },
  'ancient_id':         { icon: '🏯', hint: '茅山历代修道者', effect: 'faint',   scene: '穿越回古代茅山，你是谁？' },
  'spiritual_root':     { icon: '🌀', hint: '洞天灵脉觉醒',   effect: 'green',   scene: '茅山洞天福地，你的灵根等觉醒' },
  'hidden_talent':      { icon: '🎭', hint: '茅山道术封印',   effect: 'purple',  scene: '茅山秘传之术，等着你来解开' },
  'love_portrait':      { icon: '💘', hint: '茅山情缘故事',   effect: 'pink',    scene: '茅山千年，多少情缘在此？' },
  'animal_personality': { icon: '🦊', hint: '茅山生灵认主',   effect: 'green',   scene: '茅山的一只灵兽正等着认出你' },
  'stress_test':        { icon: '🌤️', hint: '茅山四时风光',   effect: 'blue',    scene: '此刻心境，如茅山的哪般风景？' },
  'xiuxian':            { icon: '🏔️', hint: '茅山修仙之路',   effect: 'glow-golden', scene: '在茅山修仙，你有几分天资？' },
  'mbti_simple':        { icon: '🧩', hint: '茅山修行者谱',   effect: 'blue',    scene: '十六种茅山修行者，你是哪一种？' },
};

function getGroupTeaser(testId, rarity) {
  return GROUP_THEMES[testId] || DEFAULT_BY_RARITY[rarity] || DEFAULT_BY_RARITY['putong'];
}

module.exports = {
  LOCK_TEASERS,
  GROUP_THEMES,
  DEFAULT_BY_RARITY,
  getTeaser,
  getGroupTeaser,
};
