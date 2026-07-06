/**
 * dungeon.js — 秘境副本页面
 */
const app = getApp();
const { getDungeons, getTreasures, getPillRecipes } = require('../../config/dungeons');
const journeyMgr = require('../../utils/journey-manager');
const audio = require('../../utils/audio-engine');

Page({
  data: {
    themeClass: '', statusBarHeight: 44,
    dungeons: [],
    treasures: [],
    recipes: [],
    showRecipes: false
  },

  onLoad() {
    const us = app.globalData.userSettings || {};
    const theme = us.theme || 'light', b = us.themeBrightness || 'medium';
    let tc = '';
    if (theme === 'light') tc += 'light-theme ';
    if (b && b !== 'medium') tc += 'bright-' + b + ' ';
    const winInfo = wx.getWindowInfo();
    const progress = journeyMgr.getProgress();
    const completedCount = progress.completed;

    // 副本解锁状态
    const dungeons = getDungeons().map(d => ({
      ...d,
      unlocked: completedCount >= d.unlockLevel
    }));

    this.setData({
      themeClass: tc.trim(),
      statusBarHeight: winInfo.statusBarHeight || 44,
      dungeons,
      treasures: getTreasures(),
      recipes: getPillRecipes(),
      showRecipes: completedCount >= 3
    });
  },

  onDungeonTap(e) {
    const id = e.currentTarget.dataset.id;
    const d = this.data.dungeons.find(d => d.id === id);
    if (!d) return;
    if (!d.unlocked) {
      wx.showToast({ title: `通关第${d.unlockLevel}关后解锁`, icon: 'none' });
      return;
    }
    audio.playClick();
    wx.showModal({
      title: d.icon + ' ' + d.name,
      content: d.master + '说：「' + d.masterSays + '」\n\n' + d.desc,
      confirmText: '知道了',
      confirmColor: '#c4956a',
      showCancel: false
    });
  },

  goBack() { wx.navigateBack(); }
});
