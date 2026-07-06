const mapData = require('../../config/maoshan-map');
const audio = require('../../utils/audio-engine');
const { resolveCloudUrl } = require('../../utils/cloud-image');
const app = getApp();

// 主路径顺序（10关）
const MAIN_PATH = [
  'shanmen', 'jinianguan', 'jinianbei', 'xike_quan',
  'chongxi', 'laozi_xiang', 'feichangdao',
  'huayang_dong', 'yuanfu', 'jiuxiao'
];

// 小地图景点坐标（游戏风格，无底图，纯CSS圆点+路径）
const MINI_SPOTS = [
  { id: 'jiuxiao',      x: 50, y: 5,  icon: '🏯', name: '九霄万福宫' },
  { id: 'deyou',        x: 22, y: 14, icon: '🏛️', name: '德祐观' },
  { id: 'renyou',       x: 78, y: 12, icon: '⛩️', name: '仁祐观' },
  { id: 'yuanfu',       x: 48, y: 26, icon: '🕌', name: '元符万宁宫' },
  { id: 'wangxian_ting', x: 88, y: 22, icon: '🏗️', name: '望仙亭' },
  { id: 'huayang_dong', x: 28, y: 38, icon: '🕳️', name: '华阳洞' },
  { id: 'xianren_dong', x: 68, y: 40, icon: '🕳️', name: '仙人洞' },
  { id: 'feichangdao',  x: 50, y: 48, icon: '🛤️', name: '非常道' },
  { id: 'cuiyun_lang',  x: 80, y: 48, icon: '🌿', name: '翠云廊' },
  { id: 'tingyun_tai',  x: 72, y: 56, icon: '☁️', name: '停云台' },
  { id: 'hou_gu',       x: 15, y: 56, icon: '🐒', name: '灵猴谷' },
  { id: 'chongxi',      x: 35, y: 65, icon: '🏠', name: '崇禧万寿宫' },
  { id: 'xike_quan',    x: 22, y: 72, icon: '💧', name: '喜客泉' },
  { id: 'laozi_xiang',  x: 55, y: 74, icon: '🗿', name: '老子神像' },
  { id: 'xixin_chi',    x: 10, y: 80, icon: '💎', name: '洗心池' },
  { id: 'jinianguan',   x: 22, y: 86, icon: '🔮', name: '测字馆' },
  { id: 'jinianbei',    x: 38, y: 84, icon: '📖', name: '国学研习社' },
  { id: 'ziyun_dong',   x: 82, y: 84, icon: '🌌', name: '紫云洞' },
  { id: 'shanmen',      x: 50, y: 94, icon: '⛩️', name: '山门' }
];

// 迷你地图路径线
const MINI_PATHS = [
  ['shanmen','jinianguan'],['jinianguan','jinianbei'],['jinianbei','xike_quan'],
  ['xike_quan','chongxi'],['chongxi','laozi_xiang'],['laozi_xiang','feichangdao'],
  ['feichangdao','huayang_dong'],['huayang_dong','yuanfu'],['yuanfu','jiuxiao'],
  ['jinianguan','xixin_chi'],['xixin_chi','hou_gu'],['xike_quan','hou_gu'],
  ['laozi_xiang','xianren_dong'],['xianren_dong','tingyun_tai'],
  ['xianren_dong','cuiyun_lang'],['cuiyun_lang','renyou'],
  ['jiuxiao','deyou'],['deyou','renyou'],['renyou','yuanfu'],
  ['tingyun_tai','wangxian_ting'],['jinianbei','ziyun_dong']
];

Page({
  data: {
    phase: 'map',
    currentSpot: null,
    // 主视图
    currentStep: 0,
    totalSteps: MAIN_PATH.length,
    mainSpot: null,
    nextSpot: null,
    doneSpots: [],         // 已完成景点列表（上半展示）
    // 小地图
    miniSpots: [],
    miniPathLines: [],     // 路径线
    // 引导
    guideHint: '',
    suggestedCount: 0,
    // 副本
    dungeonParent: null,
    dungeonSpots: [],
    dungeonPaths: [],
    monkeyTypes: [
      { id: 'boss', emoji: '🦍', label: '猴王' },
      { id: 'smart', emoji: '🐒', label: '机灵鬼' },
      { id: 'lazy', emoji: '🙈', label: '懒猴' },
      { id: 'naughty', emoji: '🙉', label: '捣蛋王' },
      { id: 'shy', emoji: '🙊', label: '害羞猴' }
    ],
    themeClass: '',
    statusBarHeight: 44
  },

  onLoad() { this._initMap(); },
  onShow() { this._initMap(); },

  _initMap() {
    const us = app.globalData.userSettings || {};
    const theme = us.theme || 'light';
    const winInfo = wx.getWindowInfo();
    const allSpots = mapData.getAllSpots();
    const completedIds = this._getCompletedSpotIds(allSpots);

    // 计算步数
    let currentStep = 0;
    for (let i = 0; i < MAIN_PATH.length; i++) {
      const spot = mapData.getSpotById(MAIN_PATH[i]);
      if (!spot) continue;
      if (!completedIds.includes(spot.id)) { currentStep = i; break; }
      currentStep = i + 1;
    }
    if (currentStep >= MAIN_PATH.length) currentStep = MAIN_PATH.length - 1;

    const curId = MAIN_PATH[currentStep] || MAIN_PATH[0];
    const nextId = MAIN_PATH[currentStep + 1] || null;
    const mainSpot = allSpots.find(s => s.id === curId);
    const nextSpot = nextId ? allSpots.find(s => s.id === nextId) : null;

    // 已完成景点列表
    const doneSpots = completedIds.map(id => {
      const s = allSpots.find(a => a.id === id);
      return s ? { id: s.id, name: s.name, icon: s.icon, color: s.color } : null;
    }).filter(Boolean);

    // 小地图
    const miniSpots = MINI_SPOTS.map(s => {
      const raw = allSpots.find(a => a.id === s.id);
      const done = completedIds.includes(s.id);
      return {
        ...s, color: raw ? raw.color : '#8b7355', done,
        isCurrent: s.id === curId,
        canClick: done || s.id === curId || (currentStep === 0 && s.id === 'shanmen')
      };
    });

    const miniPathLines = this._calcMiniPaths(MINI_PATHS, miniSpots);

    const hint = completedIds.length === 0
      ? '☀️ 点击「山门」，开始你的茅山探索之旅'
      : `📍 第 ${currentStep + 1} 关 · ${mainSpot?.name || ''}`;

    this.setData({
      themeClass: theme === 'light' ? 'light-theme' : 'dark-theme',
      statusBarHeight: winInfo.statusBarHeight || 44,
      currentStep, totalSteps: MAIN_PATH.length,
      mainSpot, nextSpot, doneSpots,
      miniSpots, miniPathLines,
      guideHint: hint,
      suggestedCount: completedIds.length
    });
  },

  _getCompletedSpotIds(allSpots) {
    try {
      const history = wx.getStorageSync('testHistory') || [];
      const doneTestIds = new Set();
      history.forEach(h => { if (h.testId && h.testId !== 'random') doneTestIds.add(h.testId); });
      return allSpots.filter(s => doneTestIds.has(s.testId)).map(s => s.id);
    } catch (e) { return []; }
  },

  // 展示景点详情（自动解析 cloud:// 故事图）
  _showSpot(spot) {
    if (!spot) return;
    this.setData({ phase: 'spot', currentSpot: spot, storyImageResolved: '' });
    if (spot.storyImage && spot.storyImage.startsWith('cloud://')) {
      resolveCloudUrl(spot.storyImage).then(url => {
        this.setData({ storyImageResolved: url || '' });
      }).catch(() => this.setData({ storyImageResolved: '' }));
    } else {
      this.setData({ storyImageResolved: spot.storyImage || '' });
    }
  },

  _calcMiniPaths(links, spots) {
    const spotMap = {};
    spots.forEach(s => { spotMap[s.id] = s; });
    const segs = [];
    const MAP_W = 750, MAP_H = 480;
    links.forEach(link => {
      const [fromId, toId] = link;
      const from = spotMap[fromId], to = spotMap[toId];
      if (!from || !to) return;
      const fx = from.x / 100 * MAP_W, fy = from.y / 100 * MAP_H;
      const tx = to.x / 100 * MAP_W, ty = to.y / 100 * MAP_H;
      const dx = tx - fx, dy = ty - fy;
      const len = Math.sqrt(dx * dx + dy * dy);
      const angle = Math.atan2(dy, dx) * 180 / Math.PI;
      segs.push({
        left: (fx + dx / 2 - len / 2) / MAP_W * 100 + '%',
        top: (fy + dy / 2) / MAP_H * 100 + '%',
        width: len, angle
      });
    });
    return segs;
  },

  onEnterSpot() {
    const spot = this.data.mainSpot;
    if (!spot) return;
    audio.playSelect();
    if (spot.isDungeon && spot.dungeonSpots) { this._enterDungeon(spot); return; }
    this._showSpot(spot);
  },

  // 小地图点击
  onMiniSpotTap(e) {
    const id = e.currentTarget.dataset.id;
    const spot = mapData.getSpotById(id);
    if (!spot) return;
    const allSpots = mapData.getAllSpots();
    const completedIds = this._getCompletedSpotIds(allSpots);
    const isDone = completedIds.includes(id);
    const isCurrent = id === this.data.mainSpot?.id;

    if (!isDone && !isCurrent && id !== 'shanmen') {
      wx.showToast({ title: this.data.currentStep === 0 ? '请从山门开始哦~' : '先完成前面的关卡~', icon: 'none' });
      return;
    }
    audio.playSelect();
    if (spot.isDungeon && spot.dungeonSpots) { this._enterDungeon(spot); return; }
    this._showSpot(spot);
  },

  // 已完成景点快速入口
  onDoneSpotTap(e) {
    const id = e.currentTarget.dataset.id;
    const spot = mapData.getSpotById(id);
    if (!spot) return;
    audio.playSelect();
    if (spot.isDungeon && spot.dungeonSpots) { this._enterDungeon(spot); return; }
    this._showSpot(spot);
  },

  _enterDungeon(spot) {
    const dSpots = spot.dungeonSpots.map((s, i) => ({
      ...s, done: false, suggested: i === 0, isDungeonItem: true,
      spotStatus: i === 0 ? 'current' : 'future'
    }));
    const dPaths = [];
    for (let i = 0; i < dSpots.length - 1; i++) {
      const from = dSpots[i], to = dSpots[i + 1];
      const MAP_W = 750, MAP_H = 1200;
      const fx = from.x / 100 * MAP_W, fy = from.y / 100 * MAP_H;
      const tx = to.x / 100 * MAP_W, ty = to.y / 100 * MAP_H;
      const dx = tx - fx, dy = ty - fy;
      const len = Math.sqrt(dx * dx + dy * dy);
      const angle = Math.atan2(dy, dx) * 180 / Math.PI;
      dPaths.push({ left: (fx + dx / 2 - len / 2) / MAP_W * 100 + '%', top: (fy + dy / 2 - 1) / MAP_H * 100 + '%', width: len, angle, type: 'dungeon' });
    }
    this.setData({ phase: 'dungeon', dungeonParent: spot, dungeonSpots: dSpots, dungeonPaths: dPaths });
  },

  onDungeonSpotTap(e) {
    const id = e.currentTarget.dataset.id;
    const spot = this.data.dungeonSpots.find(s => s.id === id);
    if (!spot || spot.spotStatus === 'future') return;
    audio.playSelect();
    this._showSpot(spot);
  },

  exitDungeon() {
    audio.playClick();
    this.setData({ phase: 'map', dungeonParent: null, dungeonSpots: [], dungeonPaths: [] });
    this._initMap();
  },

  enterTest() {
    const spot = this.data.currentSpot;
    if (!spot) return;
    audio.playReveal();
    if (spot.testId === 'random') { wx.navigateTo({ url: mapData.getRandomTestRoute() }); return; }
    if (spot.testId === 'tingyun') { wx.showModal({ title: '停云霭霭', content: '陶渊明《停云》诗卷在此。此台为"停云商贸"品牌纪念地。', showCancel: false, confirmText: '好的', confirmColor: '#7b9eb3' }); return; }
    if (spot.testId === 'monkey') { wx.showModal({ title: '🐒 猴王争霸', content: '完整版猴王测试即将上线，敬请期待！', showCancel: false, confirmText: '赶紧跑', confirmColor: '#c4956a' }); return; }
    const route = mapData.getTestRoute(spot.testId);
    if (route) wx.navigateTo({ url: route });
    else wx.showToast({ title: '即将开放，敬请期待', icon: 'none' });
  },

  backToMap() {
    audio.playClick();
    if (this.data.phase === 'spot' && this.data.currentSpot?.isDungeonItem) { this.setData({ phase: 'dungeon', currentSpot: null }); return; }
    this.setData({ phase: 'map', currentSpot: null, dungeonParent: null, dungeonSpots: [], dungeonPaths: [] });
    this._initMap();
  },

  goBack() {
    if (this.data.phase === 'dungeon') this.exitDungeon();
    else if (this.data.phase === 'spot') this.backToMap();
    else wx.navigateBack();
  },
  goHome() { wx.navigateTo({ url: '/pages/index/index' }); },
  catchTouch() {}
});
