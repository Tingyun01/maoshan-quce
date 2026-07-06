const app = getApp();
const legalCfg = require('../../config/legal-config');
const audio = require('../../utils/audio-engine');

Page({
  data: { themeClass: '', legal: legalCfg, audioMuted: false },

  toggleMute() {
    const next = !audio.isMuted();
    audio.setMuted(next);
    this.setData({ audioMuted: next });
  },

  onShow() {
    this.setData({ audioMuted: audio.isMuted() });
  },

  // 开发者入口：三击版本号进入图片管理
  _devTapCount: 0,
  _devTapTimer: null,
  onDevTap() {
    this._devTapCount++;
    if (this._devTapCount >= 3) {
      this._devTapCount = 0;
      if (this._devTapTimer) clearTimeout(this._devTapTimer);
      wx.navigateTo({ url: '/pages/admin-images/admin-images' });
    } else {
      if (this._devTapTimer) clearTimeout(this._devTapTimer);
      this._devTapTimer = setTimeout(() => { this._devTapCount = 0; }, 800);
    }
  },

  openIcpUrl() {
    const url = this.data.legal.icp.url;
    if (url) {
      wx.setClipboardData({ data: url, success: () => wx.showToast({ title: '备案网址已复制', icon: 'none' }) });
    }
  },

  goPrivacy() { wx.navigateTo({ url: '/pages/privacy/privacy' }); },
  goTerms() { wx.navigateTo({ url: '/pages/terms/terms' }); },
  goBack() { wx.navigateBack(); },

  onLoad() {
    const us = app.globalData.userSettings || {};
    const theme = us.theme || 'light', b = us.themeBrightness || 'medium';
    const lf = us.largeFont || false;
    let tc = '';
    if (theme === 'light') tc += 'light-theme ';
    if (b && b !== 'medium') tc += 'bright-' + b + ' ';
    if (lf) tc += 'fontsize-large ';
    this.setData({ themeClass: tc.trim() });
  }
});
