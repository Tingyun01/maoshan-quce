Page({
  data: {
    isMuted: false
  },

  onLoad() {
    const bgm = require('../../utils/bgm-manager');
    this.setData({ isMuted: bgm.isMuted() });
  },

  onShow() {
    const bgm = require('../../utils/bgm-manager');
    this.setData({ isMuted: bgm.isMuted() });
  },

  toggleMusic() {
    const bgm = require('../../utils/bgm-manager');
    const muted = bgm.toggleMute();
    this.setData({ isMuted: muted });
  },

  goPrivacy() {
    wx.navigateTo({ url: '/pages/privacy/privacy' });
  },

  goTerms() {
    wx.navigateTo({ url: '/pages/terms/terms' });
  },

  goChangelog() {
    wx.navigateTo({ url: '/pages/changelog/changelog' });
  }
});
