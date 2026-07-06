const themeHelper = require('./utils/theme-helper');
const adConfig = require('./config/ad-config');
const achievementMgr = require('./utils/achievement-manager');
const collectionMgr = require('./utils/collection-manager');
const { diagnoseImages, deepDiagnose, scanMbtiVariants, scanChineseNames, initPreload } = require('./utils/cloud-image');
const analytics = require('./utils/analytics');



// 云开发环境配置
const CLOUD_ENV = 'cloudbase-d1gyu646q859d40e1';

// 所有题库配置（用于分享时构建好看的数据）
const TEST_CONFIGS = {
  'wu_xing':            require('./config/tests/wu-xing'),
  'mbti_simple':        require('./config/tests/mbti-simple'),
  'stress_test':         require('./config/tests/stress-test'),
  'animal_personality':  require('./config/tests/animal-personality'),
  'immortal':            require('./config/tests/immortal'),
  'xiuxian':             require('./config/tests/xiuxian'),
  'past_life':           require('./config/tests/past-life'),
  'guardian_beast':      require('./config/tests/guardian-beast'),
  'ancient_id':          require('./config/tests/ancient-id'),
  'immortal_cluster':    require('./config/tests/immortal-cluster'),
  'spiritual_root':      require('./config/tests/spiritual-root'),
  'hidden_talent':       require('./config/tests/hidden-talent'),
  'love_portrait':       require('./config/tests/love-portrait')
};

// 题库到中文名的映射
const TEST_NAMES = {
  'immortal': '神仙转世',
  'xiuxian': '修仙资质',
  'wu_xing': '五行人格',
  'mbti_simple': '思维偏好',
  'stress_test': '压力状态',
  'animal_personality': '动物人格',
  'past_life': '前世今生',
  'guardian_beast': '守护神兽',
  'ancient_id': '古代身份',
  'immortal_cluster': '群仙谱',
  'spiritual_root': '灵根测试',
  'hidden_talent': '隐藏天赋',
  'love_portrait': '桃花缘'
};

App({
  // 诊断云存储图片：在控制台输入 getApp().diag()
  diag() { diagnoseImages(); },
  // 深度诊断（多路径搜索缺失文件）：getApp().deepDiag()
  deepDiag() { deepDiagnose(); },
  // MBTI 强力扫描：getApp().mbtiScan()
  mbtiScan() { scanMbtiVariants(); },
  // 扫描中文文件名：getApp().scanCN()
  scanCN() { scanChineseNames(); },

  globalData: {
    userSettings: { theme: 'light', themeBrightness: 'medium', largeFont: false },
    rewardedVideoAd: null,
    cloudEnv: CLOUD_ENV,
    userId: 'wx_' + Date.now(), // 临时用户标识
    statusBarHeight: 44, // px，onLaunch 时会更新
    testConfigs: TEST_CONFIGS,   // 共享题库配置，各页面无需重复require
    testNames: TEST_NAMES        // 题库中文名映射
  },

  onLaunch() {
    // 初始化埋点
    analytics.init();
    analytics.track('app_open');

    // 获取系统信息（状态栏高度等）
    try {
      const winInfo = wx.getWindowInfo();
      this.globalData.statusBarHeight = winInfo.statusBarHeight || 44;
    } catch (e) {}

    // 初始化云开发
    if (wx.cloud) {
      wx.cloud.init({ env: CLOUD_ENV, traceUser: true });
    }

    // 预加载云存储图片链接（通过云函数获取，解决权限问题）
    initPreload();

    try { wx.showShareMenu({ menus: ['shareAppMessage', 'shareTimeline'] }); } catch (e) {}

    // 加载用户设置
    const settings = wx.getStorageSync('userSettings');
    if (settings) {
      const defaults = this.globalData.userSettings;
      Object.keys(defaults).forEach(k => {
        if (settings[k] === undefined) settings[k] = defaults[k];
      });
      this.globalData.userSettings = settings;
    }
    themeHelper.applyNativeTheme(this.globalData.userSettings.theme || 'dark');

    // 首次启动：标记需要展示隐私协议（由首页弹出）
    const privacyAccepted = wx.getStorageSync('privacyAccepted');
    if (!privacyAccepted) {
      this.globalData.showPrivacyModal = true;
    }

    // 预创建激励广告实例
    try {
      const ad = wx.createRewardedVideoAd({ adUnitId: adConfig.getAdUnitId('rewardedVideoAd') });
      ad.onError(() => {});
      this.globalData.rewardedVideoAd = ad;
    } catch (e) {}

    // 从历史记录导入已有收藏（首次使用图鉴时）
    const imported = collectionMgr.importHistory();
    if (imported > 0) {
      console.log('[App] 图鉴导入完成:', imported, '项');
    }
  },

  // 接受隐私协议
  acceptPrivacy() {
    wx.setStorageSync('privacyAccepted', true);
    this.globalData.showPrivacyModal = false;
  },

  /**
   * 保存测试结果到历史记录（最多保存最近20条）
   * 用于邀请好友时选择分享内容
   */
  saveTestHistory(testId, typeCode) {
    const cfg = TEST_CONFIGS[testId];
    const result = cfg?.results[typeCode] || cfg?.results['default'] || {};
    const record = {
      testId,
      type: typeCode,
      typeTitle: result.title || typeCode,
      rank: result.rank || '',
      rarity: result.rarity || '',
      tagline: result.tagline || '',
      conversation: result.conversation || '',
      icon: cfg?.icon || '道',
      time: Date.now()
    };
    // 成就系统：记录测试完成
    achievementMgr.onTestCompleted(testId);
    let history = wx.getStorageSync('testHistory') || [];
    // 去重：相同 testId+type 不重复添加
    history = history.filter(h => !(h.testId === testId && h.type === typeCode));
    history.unshift(record);
    // 只保留最近20条
    if (history.length > 20) history = history.slice(0, 20);
    wx.setStorageSync('testHistory', history);
  },

  /**
   * 获取历史测试记录列表
   */
  getTestHistory() {
    return wx.getStorageSync('testHistory') || [];
  },

  /**
   * 获取用于分享的内容
   * 优先取最近的历史结果，没有则用默认文案
   */
  getShareContent() {
    const history = this.getTestHistory();
    if (history.length > 0) {
      const h = history[0]; // 最近一次测试结果
      const title = h.conversation || `我在茅山趣测出了「${h.typeTitle}」！你也来试试 👉`;
      const path = `/pages/index/index?inviter=${this.globalData.userId || 'friend'}`;
      // 如果有海报图片缓存优先用
      const imageUrl = wx.getStorageSync('sharePoster_' + h.testId + '_' + h.type) || '';
      console.log('[Share] using history:', h.typeTitle, imageUrl ? 'with poster' : 'no poster');
      return { title, path, imageUrl };
    }
    // 默认分享内容
    return {
      title: '遇事不决茅山一测！快来测测你是哪位神仙 👉',
      path: `/pages/index/index?inviter=${this.globalData.userId || 'friend'}`,
      imageUrl: ''
    };
  },

  // 埋点快捷方法
  track(event, extra) { analytics.track(event, extra); },
  getLocalStats() { return analytics.getLocalStats(); },
  flushAnalytics() { analytics.flush(); }
});