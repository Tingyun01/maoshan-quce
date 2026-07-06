/**
 * card-images.js — 卡片图片映射表
 * 存储路径：cloud://.../cards/resized-XX_XXX.jpg
 * 图片由豆包/千问生成，压缩至200KB左右
 * 总计30张，覆盖五行、神仙、前世、灵兽、路线关卡
 */

const CLOUD_BASE = 'cloud://cloudbase-d1gyu646q859d40e1.636c-cloudbase-d1gyu646q859d40e1-1447170647/cards/';

const CARD_IMAGES = {
  // ===== 五行人格（01-05）R卡 =====
  wu_xing: {
    jin:  CLOUD_BASE + 'resized-01 金型人格.jpg',
    mu:   CLOUD_BASE + 'resized-02 木型人格.jpg',
    shui: CLOUD_BASE + 'resized-03 水型人格.jpg',
    huo:  CLOUD_BASE + 'resized-04 火型人格.jpg',
    tu:   CLOUD_BASE + 'resized-05 土型人格.jpg'
  },

  // ===== 神仙转世（06-11）SSR/SR卡 =====
  immortal: {
    caishen:  CLOUD_BASE + 'resized-06 财神.jpg',
    taibai:   CLOUD_BASE + 'resized-07 太白金星.jpg',
    tudi:     CLOUD_BASE + 'resized-08 土地公公.jpg',
    zhongkui: CLOUD_BASE + 'resized-09 钟馗.jpg',
    nezha:    CLOUD_BASE + 'resized-10 哪吒.jpg',
    yueLao:   CLOUD_BASE + 'resized-11 月老.jpg'
  },

  // ===== 前世今生（31-34）替换为道教人物 SR/SSR卡 =====
  past_life: {
    maoying:   CLOUD_BASE + 'resized-31 茅盈大茅君.jpg',
    gehong:    CLOUD_BASE + 'resized-32 葛洪抱朴子.jpg',
    hongjing:  CLOUD_BASE + 'resized-33 陶弘景山中宰相.jpg',
    wangyuan:  CLOUD_BASE + 'resized-34 王远知守道真人.jpg'
  },

  // ===== 道教人物补充（35-40）SSR卡 =====
  taoist_figures: {
    sanmao:    CLOUD_BASE + 'resized-35 三茅真君.jpg',
    weihuacun: CLOUD_BASE + 'resized-36 魏华存紫虚元君.jpg',
    zhongkui:  CLOUD_BASE + 'resized-37 钟馗天师.jpg',
    laozi:     CLOUD_BASE + 'resized-38 老子道德天尊.jpg',
    taibai:    CLOUD_BASE + 'resized-39 太白金星.jpg',
    shanshen:  CLOUD_BASE + 'resized-40 山神福德正神.jpg'
  },

  // ===== 守护神兽（16-19）SSR卡 =====
  guardian_beast: {
    dragon:  CLOUD_BASE + 'resized-16 神龙.jpg',
    phoenix: CLOUD_BASE + 'resized-17 凤凰.jpg',
    qilin:   CLOUD_BASE + 'resized-18 麒麟.jpg',
    tiger:   CLOUD_BASE + 'resized-19 白虎.jpg'
  },

  // ===== 动物灵兽（20-25）R卡 =====
  animal_personality: {
    lion:    CLOUD_BASE + 'resized-20 雄狮.jpg',
    wolf:    CLOUD_BASE + 'resized-21 孤狼.jpg',
    dolphin: CLOUD_BASE + 'resized-22 海豚.jpg',
    cat:     CLOUD_BASE + 'resized-23 黑猫.jpg',
    bear:    CLOUD_BASE + 'resized-24 棕熊.jpg',
    deer:    CLOUD_BASE + 'resized-25 灵鹿.jpg'
  },

  // ===== 路线关卡（26-30）SSR卡 =====
  route: {
    gate:     CLOUD_BASE + 'resized-26 山门.jpg',
    chongxi:  CLOUD_BASE + 'resized-27 崇禧万寿宫.jpg',
    laozi:    CLOUD_BASE + 'resized-28 老子神像.jpg',
    huayang:  CLOUD_BASE + 'resized-29 华阳洞.jpg',
    peak:     CLOUD_BASE + 'resized-30 顶峰封神台.jpg',
    zhaoming: CLOUD_BASE + 'resized-41 昭明太子萧统.jpg'
  }
};

/**
 * 根据测试ID和类型获取卡片图片路径
 */
function getCardImage(testId, typeCode) {
  const group = CARD_IMAGES[testId];
  if (group && group[typeCode]) return group[typeCode];
  // 兜底：返回路线关卡第一张
  return CARD_IMAGES.route.gate;
}

/**
 * 获取路线关卡卡片
 */
function getRouteCard(routeKey) {
  return CARD_IMAGES.route[routeKey] || CARD_IMAGES.route.gate;
}

module.exports = { CARD_IMAGES, getCardImage, getRouteCard };
