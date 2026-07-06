const app = getApp();
const QuotaManager = require('../../utils/quota-manager');
const legalCfg = require('../../config/legal-config');
const fortuneHelper = require('../../config/fortune');
const audio = require('../../utils/audio-engine');
const analytics = require('../../utils/analytics');

// ===== 合规欢迎话术（每日一轮换）=====
const WELCOME_MESSAGES = [
  { greeting: '福生无量天尊 ☯️', lines: ['你最近是不是总觉得心里有事放不下？', '好像有什么悬而未决……', '既然来了，不妨测一测，', '看看会有什么有趣的发现。'], disclaimer: '——仅供娱乐，请勿当真。' },
  { greeting: '你了解自己吗？', lines: ['有些性格藏在最深处，', '连自己都没发现。', '与其胡思乱想，', '不如来一次趣味探索。'], disclaimer: '——本服务为趣味娱乐工具。' },
  { greeting: '你最近还好吗？', lines: ['其实问出这句话的时候，', '你心里已经有答案了。', '来做几个有趣的小测试，', '看看能发现什么不一样的自己。'], disclaimer: '——结果仅供娱乐参考。' },
  { greeting: '欢迎来到茅山趣测 ☯️', lines: ['每个人心里都藏着一个', '不为人知的小秘密。', '点开这里，', '开启一场有趣的自我发现之旅。'], disclaimer: '——所有结果仅供娱乐。' },
  { greeting: '施主面带疑云', lines: ['可是心中有惑？', '生活中总有那么些说不清道不明的事，', '与其闷在心里，', '不如做个趣味小测试解解闷。'], disclaimer: '——测试结果仅供参考。' }
];
const WELCOME_KEY = 'quce_welcome_date';

// 道家箴言
const TAO_QUOTES = [
  '道生一，一生二，二生三，三生万物',
  '人法地，地法天，天法道，道法自然',
  '上善若水，水善利万物而不争',
  '知人者智，自知者明',
  '千里之行，始于足下',
  '道可道，非常道；名可名，非常名'
];

Page({
  data: {
    themeClass: '',
    quotaTotal: 5,
    showPrivacyModal: false,
    legal: legalCfg,
    audioMuted: false,
    fortune: null,
    fortuneClaimed: false,
    // 欢迎遮罩
    showWelcome: false,
    welcomeMsg: null,
    // 新手引导
    showTutorial: false,
    tutorialSeen: false,
    tutStep: 0,
    // 底部展开区
    showQuotaModal: false,
    quotaNextRecover: '',
    quotaShareRemaining: 0,
    quotaAdRemaining: 0
  },

  _selectedTestId: '',
  _recoverTimer: null,

  onLoad(options) {
    if (app.globalData.showPrivacyModal) {
      this.setData({ showPrivacyModal: true });
    }
    // 处理好友邀请/裂变参数
    this._handleInviteParams(options);
  },

  onShow() {
    this._applyTheme();
    this._refreshQuota();
    this._loadFortune();
    this._checkWelcome();
    this._checkTutorial();
    this.setData({ audioMuted: audio.isMuted() });
    analytics.track('pv', { page: 'index' });
  },

  onUnload() {
    if (this._recoverTimer) {
      clearInterval(this._recoverTimer);
      this._recoverTimer = null;
    }
  },

  // ===== 欢迎遮罩 =====
  _checkWelcome() {
    if (this.data.showPrivacyModal) return;
    if (app.globalData.showPrivacyModal) return;
    try {
      const lastDate = wx.getStorageSync(WELCOME_KEY);
      const today = new Date().toDateString();
      if (lastDate === today) return;
      const day = new Date().getDate();
      const idx = day % WELCOME_MESSAGES.length;
      this.setData({ showWelcome: true, welcomeMsg: WELCOME_MESSAGES[idx] });
      wx.setStorageSync(WELCOME_KEY, today);
    } catch (e) {}
  },

  dismissWelcome() {
    audio.playClick();
    this.setData({ showWelcome: false });
  },

  // ===== 新手引导 =====
  _checkTutorial() {
    const seen = wx.getStorageSync('tutorial_seen');
    if (seen) {
      this.setData({ tutorialSeen: true, showTutorial: false });
      return;
    }
    // 协议弹窗优先，等协议接受后再弹出引导
    if (this.data.showPrivacyModal || app.globalData.showPrivacyModal) return;
    this.setData({ showTutorial: true, tutorialSeen: false });
  },

  openTutorial() {
    audio.playClick();
    this.setData({ showTutorial: true, tutStep: 0 });
  },

  closeTutorial() {
    audio.playClick();
    this.setData({ showTutorial: false });
    if (!this.data.tutorialSeen) {
      wx.setStorageSync('tutorial_seen', true);
      this.setData({ tutorialSeen: true });
    }
  },

  switchTutStep(e) {
    const step = parseInt(e.currentTarget.dataset.step);
    this.setData({ tutStep: step });
  },

  nextTutStep() {
    if (this.data.tutStep < 2) this.setData({ tutStep: this.data.tutStep + 1 });
  },

  prevTutStep() {
    if (this.data.tutStep > 0) this.setData({ tutStep: this.data.tutStep - 1 });
  },

  // ===== 好友邀请裂变处理 =====
  _handleInviteParams(options) {
    const inviter = options.inviter;
    const fromResult = options.from_result;
    if (inviter && fromResult) {
      try {
        const inviteData = JSON.parse(decodeURIComponent(fromResult));
        wx.setStorageSync('friendInvite', {
          inviter,
          testId: inviteData.t,
          type: inviteData.p,
          typeTitle: inviteData.n,
          rank: inviteData.r,
          time: Date.now()
        });
        wx.setStorageSync('pkMode', true);
      } catch (e) { /* 解析失败静默 */ }
    }
    if (options.invite && !inviter) {
      wx.setStorageSync('invited_via_quiz', Date.now());
    }
  },

  // ===== 核心入口按钮 =====
  entryTest() {
    audio.playClick();
    analytics.track('entry_click', {});
    const available = QuotaManager.getAvailableCount();
    if (available <= 0) {
      this._showQuotaModal();
      return;
    }
    // 跳转到导览图——用户在那里选景点→选测试
    wx.navigateTo({ url: '/pages/guide/guide' });
  },

  goGuide() {
    audio.playClick();
    wx.navigateTo({ url: '/pages/guide/guide' });
  },

  goAlbum() { wx.navigateTo({ url: '/pages/album/album' }); },
  goAbout() {
    audio.playClick();
    wx.navigateTo({ url: '/pages/about/about' });
  },

  showQuotaInfo() {
    audio.playClick();
    this._showQuotaModal();
  },

  // ===== 每日道签 =====
  _loadFortune() {
    const fortune = fortuneHelper.getTodayFortune();
    const status = QuotaManager.getStatus();
    const claimed = status.fortuneRemaining <= 0;
    // 自动领取今日道签（静默领取，无需手动操作）
    if (!claimed) {
      const result = QuotaManager.rewardByFortune();
      if (result.success) {
        analytics.track('fortune_claim', { auto: true });
        this.setData({ fortune, fortuneClaimed: true, quotaTotal: result.total });
        return;
      }
    }
    this.setData({ fortune, fortuneClaimed: claimed });
  },

  claimFortune() {
    // 已废弃：现在道签自动领取，保留入口兼容
  },

  // ===== 音效 =====
  toggleMute() {
    const next = !audio.isMuted();
    audio.setMuted(next);
    this.setData({ audioMuted: next });
  },

  // ===== 主题 =====
  _applyTheme() {
    const us = app.globalData.userSettings || {};
    const theme = us.theme || 'light', b = us.themeBrightness || 'medium';
    let tc = '';
    if (theme === 'light') tc += 'light-theme ';
    if (b && b !== 'medium') tc += 'bright-' + b + ' ';
    this.setData({ themeClass: tc.trim() });
  },

  // ===== 配额 =====
  _refreshQuota() {
    const total = QuotaManager.getAvailableCount();
    this.setData({ quotaTotal: total });
  },

  _showQuotaModal() {
    const status = QuotaManager.getStatus();
    this.setData({
      showQuotaModal: true,
      quotaShareRemaining: status.shareRemaining,
      quotaAdRemaining: status.adRemaining
    });
    this._startRecoverCountdown();
  },

  _startRecoverCountdown() {
    if (this._recoverTimer) clearInterval(this._recoverTimer);
    const update = () => {
      const ms = QuotaManager.getNextRecoverMs();
      if (ms <= 0) { this.setData({ quotaNextRecover: '即将恢复' }); return; }
      const min = Math.floor(ms / 60000);
      const sec = Math.floor((ms % 60000) / 1000);
      this.setData({ quotaNextRecover: `${min}:${String(sec).padStart(2, '0')}` });
    };
    update();
    this._recoverTimer = setInterval(update, 1000);
  },

  closeQuotaModal() {
    this.setData({ showQuotaModal: false });
    if (this._recoverTimer) { clearInterval(this._recoverTimer); this._recoverTimer = null; }
  },

  onWaitLater() {
    wx.showToast({ title: '休息一下，30分钟后就恢复啦~', icon: 'none' });
    this.closeQuotaModal();
  },

  onWatchAd() {
    analytics.track('ad_watch', { source: 'quota_modal' });
    const ad = app.globalData.rewardedVideoAd;
    if (ad) {
      ad.show().catch(() => {
        ad.load().then(() => ad.show()).catch(() => this._rewardByAdFallback());
      });
      ad.onClose((res) => {
        if (res && res.isEnded) { this._rewardByAdFallback(); }
        else { wx.showToast({ title: '看完广告才能恢复哦~', icon: 'none' }); }
      });
    } else {
      this._rewardByAdFallback();
    }
  },

  _rewardByAdFallback() {
    const result = QuotaManager.rewardByAd();
    if (result.success) {
      wx.showToast({ title: `+${result.added}次！尽情测试吧~`, icon: 'success' });
      this.closeQuotaModal();
      this._refreshQuota();
    } else {
      wx.showToast({ title: result.msg, icon: 'none' });
    }
  },

  onShareFriend() {
    const result = QuotaManager.rewardByShare();
    if (result.success) {
      wx.showToast({ title: `+${result.added}次！`, icon: 'success' });
      this._refreshQuota();
    }
  },

  onShareAppMessage() {
    analytics.track('share', { source: 'index' });
    return { title: '遇事不决茅山一测！趣味心理测试，随缘一测 👉', path: '/pages/index/index' };
  },

  onShareTimeline() {
    return { title: '茅山趣测——遇事不决，茅山一测！13种趣味测试等你来玩 ☯️' };
  },

  // ===== 隐私协议 =====
  acceptPrivacy() {
    app.acceptPrivacy();
    this.setData({ showPrivacyModal: false });
    // 隐私接受后，检查是否需要显示新手引导
    this._checkTutorial();
  },
  goPrivacyPage() { wx.navigateTo({ url: '/pages/privacy/privacy' }); },
  goTermsPage() { wx.navigateTo({ url: '/pages/terms/terms' }); }
});
