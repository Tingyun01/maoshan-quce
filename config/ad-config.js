/**
 * ad-config.js — 广告单元ID配置中心
 *
 * 开发阶段使用微信测试ID
 * 正式上线前替换为流量主后台申请的正式ID
 */
module.exports = {
  // 激励视频广告单元ID
  rewardedVideoAd: {
    // 开发测试ID（微信官方测试广告，不会产生收入）
    dev: 'test',
    // 正式上线ID（在流量主后台申请后填入）
    prod: 'test',
    // 当前使用的ID（上线前改为 prod）
    current: 'test'
  },

  // 插屏广告（保留留用，当前未启用）
  interstitialAd: {
    dev: 'test',
    prod: 'test',
    current: 'test'
  },

  // Banner广告（保留留用）
  bannerAd: {
    dev: 'test',
    prod: 'test',
    current: 'test'
  },

  /** 获取当前使用的广告ID */
  getAdUnitId(type) {
    const cfg = this[type];
    return cfg ? cfg.current || cfg.dev : 'test';
  }
};
