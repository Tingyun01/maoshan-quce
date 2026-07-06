/**
 * journey-manager.js — 问道之旅进度管理
 */
const STORAGE_KEY = 'quce_journey';

// 主线关卡定义（从山门到顶峰共8关）
const MAIN_LEVELS = [
  { id: 'mountain_gate',    name: '山门·测字问心',     zone: '山麓',  testId: 'stress_test',     testDisplay: '心境测试',
     master: '守门道长',      masterIntro: '一位白发苍苍的老道长坐在山门旁的石凳上，面前摆着一张木桌，桌上放着笔墨纸砚。他抬眼看了看你，微微一笑。',
     masterSays: '施主远道而来，先别急着上山。坐下来，老道给你测个字，看看你今日的心境如何。',
     masterBless: '你的心境老道已了然于心。带着这颗清朗的心上山吧——山上的风景，不会辜负你。',
     daojing: '致虚极，守静笃。万物并作，吾以观复。',
     cardRarity: 'SSR', routeImage: 'gate' },

  { id: 'chongxi',          name: '崇禧万寿宫·问道',    zone: '山麓',  testId: 'mbti_simple',     testDisplay: '思维偏好',
     master: '王远知',        masterIntro: '崇禧万寿宫内，一位身穿青灰色道袍的中年道长正在案前抄写道经。他放下笔，示意你坐下。',
     masterSays: '施主，你眼中有困惑。不妨让我看看你的思维方式——看清自己如何想，比想什么更重要。',
     masterBless: '思维之道，没有对错之分。看懂了自己的思��方式，便能看懂这世间一半的烦恼。',
     daojing: '知人者智，自知者明。胜人者有力，自胜者强。',
     cardRarity: 'SR',  routeImage: 'chongxi' },

  { id: 'yuanfu',           name: '元符万宁宫·摇卦',    zone: '山腰',  testId: 'wu_xing',         testDisplay: '五行人格',
     master: '葛洪',          masterIntro: '元符万宁宫内丹炉烟气袅袅，葛洪真人正在炉前观察火候。他头也不回地说了一句："来了？坐。"',
     masterSays: '金木水火土，我炼了一辈子丹，深知五行生克之理。来，让老夫看看你骨子里是哪一行。',
     masterBless: '五行无高下，生克自有道。知道自己是哪一行，就能找到与自己相生之人、相克之事。',
     daojing: '五色令人目盲，五音令人耳聋，五味令人口爽。',
     cardRarity: 'R',   routeImage: 'yuanfu' },

  { id: 'huayang',          name: '华阳洞·探秘',        zone: '山腰',  testId: 'spiritual_root',  testDisplay: '灵根测试',
     master: '陶弘景',        masterIntro: '华阳洞深处，烛火微明。陶弘景坐在石案前，周围堆满了典籍卷轴。他抬起头，目光如炬。',
     masterSays: '世人皆道我在此炼丹，可知我炼的不是丹，是心。洞中幽深，正适合探一探你的灵根深浅。',
     masterBless: '灵根是天生的，但修道之心是修来的。根骨清浊不重要，重要的是你是否愿意走下去。',
     daojing: '大方无隅，大器晚成，大音希声，大象无形。',
     cardRarity: 'SSR', routeImage: 'huayang' },

  { id: 'xianren',          name: '仙人洞·前世',        zone: '山腰',  testId: 'past_life',       testDisplay: '前世今生',
     master: '钟馗',          masterIntro: '仙人洞口煞气弥漫，钟馗天师手持宝剑立于洞口，红袍黑面，威风凛凛。看到你，他收起宝剑，咧嘴一笑。',
     masterSays: '这洞中藏着你的前世之影。我镇守此洞千年，看尽了来来往往的人——每个人走进去，走出来的都不一样。',
     masterBless: '前世不是宿命，是镜子。看清了前世，不是为了认命，是为了看懂今生的自己。',
     daojing: '祸兮福之所倚，福兮祸之所伏。孰知其极？',
     cardRarity: 'SSR', routeImage: 'xianren' },

  { id: 'jiuxiao',          name: '九霄万福宫·求签',    zone: '山顶',  testId: 'immortal',        testDisplay: '神仙转世',
     master: '三茅真君',      masterIntro: '九霄万福宫云雾缭绕，三位仙风道骨的老者端坐于殿中——茅盈、茅固、茅衷三兄弟并列。居中那位开口了。',
     masterSays: '凡人登顶不易。你既到了九霄之上，不妨让吾兄帮你看看——你前世是哪路神仙、你骨子里带着谁的魂。',
     masterBless: '神仙转世之说，信则有不信则无。但你身上的某些特质——那不是后天学的，是前世带来的。',
     daojing: '道可道，非常道；名可名，非常名。',
     cardRarity: 'SSR', routeImage: 'jiuxiao' },

  { id: 'zhaoming',         name: '昭明太子读书台·文脉', zone: '山顶',  testId: 'hidden_talent',   testDisplay: '隐藏天赋',
     master: '萧统·昭明太子',  masterIntro: '昭明太子读书台隐于山林之间，石桌石凳犹在。一位身着素袍的年轻文士正临风而立，手中拿着一卷竹简——正是他编纂的《昭明文选》。他抬头看向你，目光温润如水。',
     masterSays: '我在此山读书编文十载，著《文选》三十卷，收天下文章精华。你身上也有一份被隐藏的才华——让我帮你找出来。',
     masterBless: '天下才气，十斗之中我独占八斗？不，每个人心中都有一部属于自己的"文选"，只是你还没翻开而已。',
     daojing: '大方无隅，大器晚成，大音希声，大象无形。道隐无名。',
     cardRarity: 'SSR', routeImage: 'zhaoming' },

  { id: 'linghou',          name: '灵猴谷·遇灵兽',     zone: '山顶',  testId: 'animal_personality', testDisplay: '动物灵兽',
     master: '太白金星',      masterIntro: '灵猴谷中，一群猴子正在嬉戏。一位白须老者坐在溪边石头上，手里拿着一个桃子，悠然自得。他转头看到了你。',
     masterSays: '猴儿们说今天有贵客到，我还不信。来，让老夫看看你像哪种灵兽——每个人心里都住着一只神兽。',
     masterBless: '灵兽不是外在的守护者，它是你内心深处的那个自己。找到了它，你就找到了最真实的你。',
     daojing: '天地不仁，以万物为刍狗；圣人不仁，以百姓为刍狗。',
     cardRarity: 'R',   routeImage: 'linghou' },

  { id: 'peak',             name: '顶峰·封神台',        zone: '顶峰',  testId: 'immortal_cluster', testDisplay: '群仙谱',
     master: '三茅真君齐聚',  masterIntro: '茅山之巅，云雾尽散。三茅真君并肩立于封神台上，身后是万里晴空。整个茅山都在脚下。',
     masterSays: '恭喜你，八关已过。今日九百里茅山与你一同见证——你正式位列仙班。来，看看你在群仙谱上的位置。',
     masterBless: '从山门到顶峰，你走过的每一步都是修行。今日你或许明白了：道不在山中，在你心里。',
     daojing: '道生一，一生二，二生三，三生万物。',
     cardRarity: 'UR',  routeImage: 'peak' }
];

// 女性路线（以乾元观魏华存为核心）
const FEMALE_LEVELS = [
  { id: 'yuchen',  name: '玉晨观·清修',  zone: '山麓', testId: 'hidden_talent', testDisplay: '隐藏天赋',
     master: '杨羲',  masterIntro: '玉晨观清幽雅致，庭院中种满了花草。杨羲道长正在院中抚琴，琴声悠远。',
     masterSays: '静室之中，最能看清一个人的根骨。你身上有一种不为人知的天赋，让我帮你找出来。',
     daojing: '见素抱朴，少私寡欲。', cardRarity: 'SR' },
  { id: 'qianyuan', name: '乾元观·问道', zone: '山腰', testId: 'love_portrait', testDisplay: '桃花缘',
     master: '魏华存', masterIntro: '乾元观是茅山唯一的女道士修行之地。魏华存——紫虚元君——中国第一位女道士，正坐在观前石阶上晒太阳。',
     masterSays: '我一生修道，深知女子心事。来，坐在我旁边，让我看看你的缘分——不只是男女之缘，是你与这世界的缘。',
     daojing: '上善若水，水善利万物而不争。', cardRarity: 'SSR' },
  { id: 'laozi',    name: '老子神像·悟道', zone: '山腰', testId: 'xiuxian', testDisplay: '修仙资质',
     master: '老子',  masterIntro: '33米高的老子铜像巍然矗立，铜像下一位老者盘腿而坐，仿佛与铜像融为一体。',
     masterSays: '大道至简，道法自然。你的道根有多深？让我看看你是否曾与道有缘。',
     daojing: '道生一，一生二，二生三，三生万物。', cardRarity: 'SSR' },
  { id: 'rentyou',  name: '仁祐观·观心', zone: '山顶', testId: 'ancient_id', testDisplay: '古代身份',
     master: '茅固',  masterIntro: '仁祐观位于二茅峰巅，供奉二茅真君茅固。他面目温和，正在观前散步。',
     masterSays: '心之所向，便是你的身份。你心里住着一个怎样的人？让吾兄帮你看一看。',
     daojing: '知足不辱，知止不殆，可以长久。', cardRarity: 'SR' },
  { id: 'tingyun',  name: '停云台·归心', zone: '山麓', testId: 'stress_test', testDisplay: '心境测试',
     master: '陶渊明', masterIntro: '停云台上，青山隐隐，陶渊明正凭栏远眺。他回头看到你，举了举手中的酒杯。',
     masterSays: '归去来兮，田园将芜胡不归？心有挂碍的人，放不下山下的世界。你放下多少，就能看到多少风景。',
     daojing: '道法自然。', cardRarity: 'R' }
];

function getMainLevels() { return MAIN_LEVELS; }
function getFemaleLevels() { return FEMALE_LEVELS; }

function loadData() {
  try {
    const raw = wx.getStorageSync(STORAGE_KEY);
    if (raw) return raw;
  } catch (e) {}
  return { currentLevel: 0, completedLevels: [], femaleCompleted: [], startedAt: 0, completedAt: 0 };
}

function saveData(data) {
  wx.setStorageSync(STORAGE_KEY, data);
}

/** 获取主线进度 */
function getProgress() {
  const data = loadData();
  const total = MAIN_LEVELS.length;
  const completed = data.completedLevels.length;
  return {
    currentIdx: completed,
    total, completed,
    percent: total > 0 ? Math.round(completed / total * 100) : 0,
    currentLevel: completed < total ? MAIN_LEVELS[completed] : null,
    isAllCompleted: completed >= total
  };
}

/** 完成一个关卡 */
function completeLevel(levelId) {
  const data = loadData();
  if (data.completedLevels.includes(levelId)) return false;
  if (data.completedLevels.length === 0) data.startedAt = Date.now();
  data.completedLevels.push(levelId);
  data.currentLevel = data.completedLevels.length;
  if (data.currentLevel >= MAIN_LEVELS.length) data.completedAt = Date.now();
  saveData(data);
  return true;
}

function resetProgress() {
  saveData({ currentLevel: 0, completedLevels: [], femaleCompleted: [], startedAt: 0, completedAt: 0 });
}

/** 获取关卡信息（主线+女性路线） */
function getLevelById(levelId) {
  let lv = MAIN_LEVELS.find(l => l.id === levelId);
  if (lv) return lv;
  return FEMALE_LEVELS.find(l => l.id === levelId) || null;
}

function getNextLevel() {
  const data = loadData();
  const idx = data.completedLevels.length;
  return idx < MAIN_LEVELS.length ? MAIN_LEVELS[idx] : null;
}

module.exports = {
  getMainLevels, getFemaleLevels,
  getProgress, completeLevel, resetProgress,
  getLevelById, getNextLevel, loadData
};
