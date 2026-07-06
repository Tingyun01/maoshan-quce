// ============================================================
// 云存储图片映射表
// 69张AI生成图统一命名: resized-xxx.jpg
// 路径: cloud://.../images/resized-xxx.jpg
// 使用方式: 修改映射表后，在卡片和景点中自动生效
// ============================================================

const BASE = 'cloud://cloudbase-d1gyu646q859d40e1.636c-cloudbase-d1gyu646q859d40e1-1447170647/images/resized-';

// 全部已上传图片清单（截图确认 + 合理推测）
// 若实际文件名不同，请修改此处键名
const ALL_IMAGES = {
  // --- 截图确认（约25张）---
  '元始天尊讲法': true,
  '月下老人牵红线': true,
  '张道陵天师做法': true,
  '真君修道': true,
  '真武大帝': true,
  '钟馗捉鬼': true,
  '诸葛亮借东风': true,
  '庄子梦蝶': true,
  '紫云洞': true,
  '白日飞升': true,
  '北斗七星阵': true,
  '财神赵公明': true,
  '彭祖养生': true,
  '秦琼尉迟恭': true,
  '仁祐观': true,
  '神农尝百草': true,
  '太极图生成': true,
  '停云台': true,
  '土地公公土地婆': true,
  '魏伯阳炼丹九转': true,
  '望仙亭': true,
  '门神秦琼尉迟恭': true,
  '姜子牙封神': true,
  '华佗诊脉': true,
  '茅山导览图': true,
  
  // --- 测试主题图（推测已生成）---
  '修仙资质': true,
  '神仙转世': true,
  '动物人格': true,
  '思维偏好': true,
  '五行人格': true,
  '隐藏天赋': true,
  '古代身份': true,
  '群仙谱': true,
  '灵根测试': true,
  '桃花缘': true,
  '守护神兽': true,
  '前世今生': true,
  '压力速测': true,
  '秘境奇谈': true,
  
  // --- 茅山景点图（推测已生成）---
  '九霄万福宫': true,
  '德祐观': true,
  '元符万宁宫': true,
  '喜客泉': true,
  '华阳洞洞口': true,
  '仙人洞': true,
  '非常道': true,
  '翠云廊': true,
  '灵猴谷': true,
  '洗心池': true,
  '崇禧万寿宫': true,
  '老子神像': true,
  '山门': true,
  '测字馆': true,
  '国学研习社': true,
  
  // --- 通用道教图（推测已生成）---
  '老子骑青牛出函谷关': true,
  '共工怒触不周山': true,
  '夸父逐日': true,
  '盘古开天辟地': true,
  '鬼谷子隐居清溪': true,
  '八仙过海': true,
  '嫦娥奔月': true,
  '后羿射日': true,
  '女娲补天': true,
  '吕洞宾飞剑斩黄龙': true,
  '文昌帝君': true,
  '太上老君炼丹': true,
  '灵宝天尊': true,
  '妈祖护航': true,
  
  // --- 茅山人文图（推测已生成）---
  '茅氏三兄弟飞升': true,
  '陶弘景隐居华阳洞': true,
  '昭明太子茅山求学': true,
  '三茅真君修道': true,
  '华阳洞炼丹': true,
  '老子神像落成': true,
  '茅山云雾': true,
  '夕照茅山': true,
  '茅山星轨': true,
  '茅山四季': true,
  '茅山道教科仪': true,
  '茅山符箓': true,
  '道士画符': true,
  '老子讲道': true,
  '葛洪在茅山': true,
  '吴筠修道茅山': true,
  '碑林石刻': true,
  '古道石阶': true,
  '茅山斋醮': true,
  '茅山茶田': true,
  '茅山药农': true,
  '茅山道教音乐': true,
};

// ============================================================
// 测试卡片 → 图片名映射
// 修改此处可调整每个测试用的背景图
// ============================================================
const TEST_BG_MAP = {
  past_life:          '白日飞升',         // 前世今生 → 飞升场景
  guardian_beast:     '真武大帝',         // 守护神兽 → 真武大帝
  love_portrait:      '月下老人牵红线',     // 桃花缘 → 月老
  spiritual_root:     '神农尝百草',         // 灵根测试 → 神农
  immortal_cluster:   '元始天尊讲法',       // 群仙谱 → 天尊讲法
  ancient_id:         '诸葛亮借东风',       // 古代身份 → 诸葛亮
  hidden_talent:      '庄子梦蝶',           // 隐藏天赋 → 梦蝶
  wu_xing:            '太极图生成',          // 五行人格 → 太极
  mbti_simple:        '魏伯阳炼丹九转',      // 思维偏好 → 炼丹
  animal_personality: '灵猴谷',             // 动物人格 → 灵猴
  stress_test:        '钟馗捉鬼',           // 压力速测 → 钟馗
  immortal:           '真君修道',            // 神仙转世 → 真君
  xiuxian:            '张道陵天师做法',      // 修仙资质 → 天师
  adventure:          '紫云洞',              // 秘境奇谈 → 紫云洞
  guide:              '茅山导览图',          // 茅山导览图 → 导览图
  // 特殊测试
  random:             '老子骑青牛出函谷关',  // 随机测试 → 老子
  thinking_style:     '鬼谷子隐居清溪',       // 思维偏好 → 鬼谷子
  monkey:             '灵猴谷',              // 猴王争霸 → 灵猴
  tingyun:            '停云台',              // 停云心语 → 停云台
};

// ============================================================
// 景点 → 图片名映射
// 修改此处可调整每个景点故事页用的插图
// ============================================================
const SPOT_STORY_MAP = {
  jiuxiao:       '九霄万福宫',
  deyou:         '德祐观',
  renyou:        '仁祐观',
  yuanfu:        '元符万宁宫',
  wangxian_ting: '望仙亭',
  huayang_dong:  '华阳洞',
  xianren_dong:  '仙人洞',
  feichangdao:   '非常道',
  cuiyun_lang:   '翠云廊',
  tingyun_tai:   '停云台',
  hou_gu:        '灵猴谷',
  chongxi:       '崇禧万寿宫',
  xike_quan:     '喜客泉',
  laozi_xiang:   '老子神像',
  shanmen:       '山门',
  jinianguan:    '测字馆',
  jinianbei:     '国学研习社',
  xixin_chi:     '洗心池',
  ziyun_dong:    '紫云洞',
  // 副本子景点
  huayang_men:   '华阳洞洞口',
  huayang_tan:   '喜客泉',
  huayang_shi:   '华阳洞炼丹',
  huayang_zhen:  '茅氏三兄弟飞升',
  huayang_out:   '陶弘景隐居华阳洞',
};

// ============================================================
// 工具函数
// ============================================================

function buildUrl(name) {
  if (!name) return '';
  return BASE + name + '.jpg';
}

// 获取测试背景图
function getTestBg(testId) {
  const name = TEST_BG_MAP[testId];
  return name ? buildUrl(name) : '';
}

// 获取景点故事图
function getSpotStory(spotId) {
  const name = SPOT_STORY_MAP[spotId];
  return name ? buildUrl(name) : '';
}

// 按名称直接获取
function getByName(name) {
  return buildUrl(name);
}

// 获取所有图片名
function getAllNames() {
  return Object.keys(ALL_IMAGES).filter(k => ALL_IMAGES[k]);
}

// 获取所有测试背景映射
function getAllTestBgs() {
  const map = {};
  Object.keys(TEST_BG_MAP).forEach(id => {
    map[id] = getTestBg(id);
  });
  return map;
}

// 获取所有景点故事映射
function getAllSpotStories() {
  const map = {};
  Object.keys(SPOT_STORY_MAP).forEach(id => {
    map[id] = getSpotStory(id);
  });
  return map;
}

module.exports = {
  BASE,
  ALL_IMAGES,
  TEST_BG_MAP,
  SPOT_STORY_MAP,
  buildUrl,
  getTestBg,
  getSpotStory,
  getByName,
  getAllNames,
  getAllTestBgs,
  getAllSpotStories,
};
