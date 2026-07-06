/**
 * journey.js — 问道之旅页面
 * 展示8关登山路线+女性支线，控制关卡解锁与进入
 */
const app = getApp();
const journeyMgr = require('../../utils/journey-manager');
const collectionMgr = require('../../utils/collection-manager');
const audio = require('../../utils/audio-engine');

Page({
  data: {
    themeClass: '', statusBarHeight: 44,
    levels: [], femaleLevels: [],
    progress: { completed: 0, total: 8, percent: 0 },
    showMasterDialog: false, currentLevel: null,
    showFemaleRoute: false, showFemaleLevels: false
  },

  onLoad() {
    const us = app.globalData.userSettings || {};
    const theme = us.theme || 'light', b = us.themeBrightness || 'medium';
    let tc = '';
    if (theme === 'light') tc += 'light-theme ';
    if (b && b !== 'medium') tc += 'bright-' + b + ' ';
    const winInfo = wx.getWindowInfo();
    this.setData({
      themeClass: tc.trim(),
      statusBarHeight: winInfo.statusBarHeight || 44
    });
    this._refreshLevels();
  },

  onShow() {
    this._refreshLevels();
  },

  _refreshLevels() {
    const progress = journeyMgr.getProgress();
    const allLevels = journeyMgr.getMainLevels();
    const data = journeyMgr.loadData();
    const femaleRoutes = journeyMgr.getFemaleLevels();
    const completedIds = data.completedLevels || [];
    const hasStarted = completedIds.length > 0;

    // 主线关卡状态
    const levels = allLevels.map((lv, idx) => ({
      ...lv,
      testDisplay: this._getTestName(lv.testId),
      completed: completedIds.includes(lv.id),
      active: !completedIds.includes(lv.id) && (idx === completedIds.length)
    }));

    // 女性路线状态（主线通关至少3关后解锁）
    const femaleUnlocked = completedIds.length >= 3;
    const femaleLevels = femaleRoutes.map((lv, idx) => ({
      ...lv,
      testDisplay: this._getTestName(lv.testId),
      completed: completedIds.includes(lv.id),
      active: !completedIds.includes(lv.id) && femaleUnlocked && (idx === femaleRoutes.filter(f => completedIds.includes(f.id)).length)
    }));

    this.setData({
      levels, femaleLevels, progress,
      showFemaleRoute: hasStarted
    });
  },

  _getTestName(testId) {
    const names = {
      'stress_test': '心境测试', 'mbti_simple': '思维偏好', 'wu_xing': '五行人格',
      'spiritual_root': '灵根测试', 'past_life': '前世今生', 'immortal': '神仙转世',
      'animal_personality': '动物灵兽', 'immortal_cluster': '群仙谱',
      'hidden_talent': '隐藏天赋', 'love_portrait': '桃花缘', 'xiuxian': '修仙资质',
      'ancient_id': '古代身份'
    };
    return names[testId] || testId;
  },

  /** 点击关卡 */
  onLevelTap(e) {
    const id = e.currentTarget.dataset.id;
    const isFemale = e.currentTarget.dataset.female;
    const allLevels = isFemale ? journeyMgr.getFemaleLevels() : journeyMgr.getMainLevels();
    const data = journeyMgr.loadData();
    const completedIds = data.completedLevels || [];
    const lv = allLevels.find(l => l.id === id);
    if (!lv) return;

    // 已通关 → 查看卡片
    if (completedIds.includes(id)) {
      // 去图鉴看卡片
      wx.navigateTo({ url: '/pages/album/album' });
      return;
    }

    // 已解锁未通关 → 弹观主对话
    const isActive = isFemale
      ? completedIds.length >= 3
      : (allLevels.indexOf(lv) === completedIds.length);
    if (isActive) {
      audio.playClick();
      this.setData({ showMasterDialog: true, currentLevel: lv });
    } else {
      wx.showToast({ title: '完成上一关才能解锁哦~', icon: 'none' });
    }
  },

  /** 关闭观主对话 */
  closeMasterDialog() {
    this.setData({ showMasterDialog: false, currentLevel: null });
  },

  /** 进入关卡测试 */
  enterLevel() {
    const lv = this.data.currentLevel;
    if (!lv) return;
    audio.playReveal();
    // 标记从关卡入口进入，结果页需要做特殊处理
    wx.setStorageSync('journeyLevel', lv.id);
    this.setData({ showMasterDialog: false, currentLevel: null });
    wx.navigateTo({ url: `/pages/quiz/quiz?id=${lv.testId}` });
  },

  /** 女性路线折叠开关 */
  toggleFemaleRoute() {
    this.setData({ showFemaleLevels: !this.data.showFemaleLevels });
  },

  goBack() { wx.navigateBack(); },

  goDungeon() { wx.navigateTo({ url: '/pages/dungeon/dungeon' }); }
});
