/**
 * 副本配置 — 茅山问道之旅支线系统
 * 
 * 四大副本：炼丹炉/画符室/藏经阁/功德林
 * 每个副本有独立入口、进度和奖励
 * 需要完成主线特定关卡后才能解锁
 */

// 副本定义
const DUNGEONS = [
  {
    id: 'alchemy',         // 炼丹炉
    name: '炼丹炉',
    icon: '🔥',
    desc: '集齐五行药材，炼一炉仙丹。每次测试获得一味药材，五种齐全可炼丹。',
    unlockLevel: 3,        // 主线第3关解锁
    unlockTest: 'yuanfu',  // 元符万宁宫
    master: '葛洪真人',
    masterSays: '炼丹不是炼药，是炼心。火候到了，丹自然就成。',
    tags: ['养成', '收集'],
    rewards: ['随机测试次数+2', '限定卡片一张', '稀有药材']
  },
  {
    id: 'talisman',        // 画符室
    name: '画符室',
    icon: '✍️',
    desc: '用手指在屏幕上画符，画对了获得符箓卡。每日可画3次。',
    unlockLevel: 5,
    unlockTest: 'xianren', // 仙人洞
    master: '钟馗天师',
    masterSays: '符者，天地之信也。心诚则灵，心不正则符不成。',
    tags: ['互动', '每日'],
    rewards: ['符箓收藏卡', '驱邪护身卡', '测试次数+1']
  },
  {
    id: 'sutra',           // 藏经阁
    name: '藏经阁',
    icon: '📖',
    desc: '道德经问答挑战。答对3题获得「经卷」收藏品，答对全部81题集齐道德经全本。',
    unlockLevel: 2,
    unlockTest: 'chongxi', // 崇禧万寿宫
    master: '王远知',
    masterSays: '经者，径也。读经是为了找到自己的路。',
    tags: ['知识', '挑战'],
    rewards: ['道德经章节卡', '全本收集UR卡', '学识称号']
  },
  {
    id: 'merit',           // 功德林
    name: '功德林',
    icon: '🌳',
    desc: '每日签到打卡、完成测试、分享好友积攒功德。功德值可兑换稀有奖励。',
    unlockLevel: 1,
    unlockTest: 'mountain_gate', // 山门
    master: '守门道长',
    masterSays: '积善成德，而神明自得。每日一善，功不唐捐。',
    tags: ['养成', '每日'],
    rewards: ['功德值', '限定称号', '稀有卡片']
  }
];

// 镇山四宝（可收集宝物）
const TREASURES = [
  { id: 'jade_seal',   name: '玉印',    icon: '📜', desc: '宋哲宗御赐"九老仙都君印"，沾朱砂可日盖千张黄表',       origin: '元符万宁宫', rarity: 'SSR' },
  { id: 'jade_gui',    name: '玉圭',    icon: '🪨', desc: '晶莹剔透，四季变色，春秋"出汗"，大臣上朝觐见之信物',      origin: '九霄万福宫', rarity: 'SSR' },
  { id: 'ha_inkstone', name: '哈砚',    icon: '🪶', desc: '玉质砚台，呵气成墨，书写符箓无需研磨',                  origin: '华阳洞',       rarity: 'SSR' },
  { id: 'jade_talisman', name: '玉符',  icon: '🔮', desc: '刻有"合明天帝敕文"，镇邪驱魔之法器',                    origin: '崇禧万寿宫', rarity: 'SSR' }
];

// 丹药配方（五行相生）
const PILL_RECIPES = [
  { id: 'pill_jin',  name: '金丹',  ingredients: ['金', '土'],  effect: '提高决断力，测试结果更偏"果断"型', daojing: '大器晚成' },
  { id: 'pill_mu',   name: '木丹',  ingredients: ['木', '水'],  effect: '提高包容力，测试结果更偏"温和"型', daojing: '上善若水' },
  { id: 'pill_shui', name: '水丹',  ingredients: ['水', '金'],  effect: '提高洞察力，测试结果更偏"智慧"型', daojing: '知人者智' },
  { id: 'pill_huo',  name: '火丹',  ingredients: ['火', '木'],  effect: '提高行动力，测试结果更偏"活力"型', daojing: '道法自然' },
  { id: 'pill_tu',   name: '土丹',  ingredients: ['土', '火'],  effect: '提高稳定力，测试结果更偏"可靠"型', daojing: '厚德载物' }
];

function getDungeons() { return DUNGEONS; }
function getTreasures() { return TREASURES; }
function getPillRecipes() { return PILL_RECIPES; }

function getDungeonById(id) { return DUNGEONS.find(d => d.id === id) || null; }
function getTreasureById(id) { return TREASURES.find(t => t.id === id) || null; }

module.exports = { getDungeons, getTreasures, getPillRecipes, getDungeonById, getTreasureById };
