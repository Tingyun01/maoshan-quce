const TestEngine = require('../../utils/test-engine');
const QuotaManager = require('../../utils/quota-manager');
const audio = require('../../utils/audio-engine');
const variantEngine = require('../../config/result-variants');
const app = getApp();

// 从 app.globalData 获取题库配置，避免重复require
const TEST_CONFIGS = app.globalData.testConfigs;

// 道家箴言池（加载/提交时随机展示）
const TAO_QUOTES = [
  '道生一，一生二，二生三，三生万物',
  '人法地，地法天，天法道，道法自然',
  '上善若水，水善利万物而不争',
  '知人者智，自知者明',
  '千里之行，始于足下',
  '道可道，非常道；名可名，非常名',
  '大音希声，大象无形',
  '致虚极，守静笃',
  '为学日益，为道日损',
  '天得一以清，地得一以宁'
];

Page({
  data: {
    themeClass: '', testId: '', testName: '',
    questions: [],
    currentIndex: 0,
    currentQuestion: null,
    currentTypeHint: '',
    currentAnswered: false,
    selectedMap: {},
    selectedCount: 0,
    cardAnim: 'fade-in',
    statusBarHeight: 0,
    showExitModal: false,
    showQuotaModal: false,
    quotaNextRecover: '',
    quotaShareRemaining: 0,
    quotaAdRemaining: 0,
    heartMsg: '',
    showLoading: true,
    taoQuote: ''
  },

  _engine: null,
  _recoverTimer: null,

  onLoad(options) {
    console.log('[Quiz] onLoad:', options);
    // 兼容两种参数名：?id= 和 ?testId=（导览图使用 testId）
    const id = options.id || options.testId || 'immortal';
    const us = app.globalData.userSettings || {};
    const theme = us.theme || 'light', b = us.themeBrightness || 'medium';
    let tc = '';
    if (theme === 'light') tc += 'light-theme ';
    if (b && b !== 'medium') tc += 'bright-' + b + ' ';

    const winInfo = wx.getWindowInfo();
    const statusBarHeight = winInfo.statusBarHeight || 44;

    // 随机选取道家箴言
    this.setData({
      themeClass: tc.trim(), testId: id, statusBarHeight,
      showLoading: true, taoQuote: this._pickTaoQuote()
    });

    app.track('test_start', { testId: id });

    if (id === 'random') {
      const questions = wx.getStorageSync('randomTestQuestions') || [];
      if (questions.length === 0) {
        wx.showToast({ title: '题目加载失败', icon: 'none' });
        wx.navigateBack(); return;
      }
      const randomConfig = {
        id: 'random', name: '随机组合测试', questions: questions,
        scoring: { dimensions: [] },
        results: { default: { title: '混合人格', summary: '多面体的你', brief: '你是一个复杂又有趣的人，每次测试都能发现新的自己。' } }
      };
      this._engine = new TestEngine(randomConfig);
      this.setData({ questions, testName: '随机组合测试' }, () => {
        this._showQuestion(0);
        setTimeout(() => this.setData({ showLoading: false }), 300);
      });
    } else if (id && id.startsWith('hidden_')) {
      // 广告解锁的隐藏测试
      const premiumData = wx.getStorageSync('premiumTestData');
      if (!premiumData || premiumData.id !== id) {
        wx.showToast({ title: '请先解锁此测试', icon: 'none' });
        wx.navigateBack(); return;
      }
      const cfg = {
        id: premiumData.id,
        name: premiumData.name,
        questions: premiumData.questions,
        scoring: premiumData.scoring,
        results: premiumData.results,
        icon: premiumData.icon || '🔐'
      };
      const questions = this._pickQuestions(cfg.questions, 5);
      this._engine = new TestEngine(cfg);
      this.setData({ questions, testName: cfg.name }, () => {
        this._showQuestion(0);
        setTimeout(() => this.setData({ showLoading: false }), 300);
      });
    } else {
      const cfg = TEST_CONFIGS[id];
      if (!cfg) {
        wx.showToast({ title: '题库未找到', icon: 'none' });
        wx.navigateBack(); return;
      }
      // 快速测试取题库数量（通常5题），旧版测试也按配置数量来
      const pickCount = cfg.qCount || (id === 'stress_test' ? 12 : 5);
      const questions = this._pickQuestions(cfg.questions, pickCount);
      this._engine = new TestEngine(cfg);
      this.setData({ questions, testName: cfg.name }, () => {
        this._showQuestion(0);
        setTimeout(() => this.setData({ showLoading: false }), 300);
      });
    }
  },

  onUnload() {
    if (this._recoverTimer) { clearInterval(this._recoverTimer); this._recoverTimer = null; }
  },

  /** 显示指定索引的题目 */
  _showQuestion(index) {
    const q = this.data.questions[index];
    if (!q) return;
    // 生成题目类型提示（MBTI/五行等特殊处理）
    let typeHint = '';
    if (this.data.testId === 'mbti_simple') {
      const k = Object.keys(q.options[0]?.score || {})[0] || '';
      const dimMap = { E: '外向·内向', I: '外向·内向', S: '实感·直觉', N: '实感·直觉', T: '思考·情感', F: '思考·情感', J: '判断·感知', P: '判断·感知' };
      typeHint = dimMap[k] || '';
    }
    // 心念语：答题途中观主送一句暖心话（第2题和第4题出现）
    let heartMsg = '';
    if (index === 1 || index === 3) {
      const journeyLevelId = wx.getStorageSync('journeyLevel');
      if (journeyLevelId) {
        const journeyMgr = require('../../utils/journey-manager');
        const lv = journeyMgr.getLevelById(journeyLevelId);
        if (lv && lv.masterBless) {
          heartMsg = lv.master + '：' + lv.masterBless;
        }
      }
    }
    // 计算当前题是否已选
    const currentAnswered = this.data.selectedMap[q.id] !== undefined;
    this.setData({
      currentIndex: index,
      currentQuestion: q,
      currentTypeHint: typeHint,
      currentAnswered: currentAnswered,
      heartMsg: heartMsg,
      cardAnim: 'card-enter'
    });
  },

  selectOption(e) {
    audio.playSelect();
    const qid = parseInt(e.currentTarget.dataset.qid);
    const idx = parseInt(e.currentTarget.dataset.idx);
    const wasAnswered = this.data.selectedMap[qid] !== undefined;
    if (this.data.selectedMap[qid] === idx) return;
    const map = { ...this.data.selectedMap };
    map[qid] = idx;
    this._engine.addAnswer(qid, idx);
    const count = Object.keys(map).length;
    const cur = this.data.currentQuestion;
    const currentAnswered = cur ? map[cur.id] !== undefined : false;
    this.setData({ selectedMap: map, selectedCount: count, currentAnswered: currentAnswered });
    wx.vibrateShort({ type: 'light' }).catch(() => {});

    // 首次回答当前题 → 自动跳到下一题
    const isLastQ = this.data.currentIndex >= this.data.questions.length - 1;
    if (!wasAnswered && !isLastQ) {
      setTimeout(() => {
        const nextIdx = this.data.currentIndex + 1;
        this.setData({ cardAnim: 'card-leave' });
        setTimeout(() => this._showQuestion(nextIdx), 180);
      }, 350);
    }
  },

  /** 下一题/提交 */
  nextOrSubmit() {
    const cur = this.data.currentQuestion;
    if (!cur || this.data.selectedMap[cur.id] === undefined) {
      wx.showToast({ title: '请选择一个选项', icon: 'none' });
      return;
    }
    if (this.data.currentIndex < this.data.questions.length - 1) {
      // 切到下一题
      const nextIdx = this.data.currentIndex + 1;
      this.setData({ cardAnim: 'card-leave' });
      setTimeout(() => this._showQuestion(nextIdx), 200);
    } else {
      // 最后一题，提交
      this._submitTest();
    }
  },

  /** 上一题 */
  prevQuestion() {
    if (this.data.currentIndex <= 0) return;
    this.setData({ cardAnim: 'card-leave' });
    setTimeout(() => this._showQuestion(this.data.currentIndex - 1), 200);
  },

  _submitTest() {
    if (this.data.selectedCount < this.data.questions.length) {
      wx.showToast({ title: '请答完所有题目', icon: 'none' });
      return;
    }
    const hasQuota = QuotaManager.getAvailableCount() > 0;
    if (!hasQuota) { this._showQuotaModal(); return; }
    QuotaManager.consumeOne();
    audio.playReveal();
    this._doSubmit();
  },

  _doSubmit() {
    // 提交时显示道家箴言过渡
    this.setData({ showLoading: true, taoQuote: this._pickTaoQuote() });
    // 兼容新旧评分方式：新测试用 pickResult，旧测试用 calculate
    app.track('test_complete', { testId: this.data.testId });

    const cfg = this.data.testId !== 'random' ? TEST_CONFIGS[this.data.testId] : null;
    let typeCode;
    if (cfg && cfg.scoring && typeof cfg.scoring.pickResult === 'function') {
      // 新5题制测试：先计算分数，再用 pickResult 选最高维度
      this._engine.calculate(); // 先计算所有分数
      const scores = this._engine.getScores();
      typeCode = cfg.scoring.pickResult(scores);
    } else {
      typeCode = this._engine.calculate();
    }
    const rawResult = this._engine.getTemplateResult(typeCode);
    // 🎲 变体引擎：同样的类型，每次说法都不一样
    const result = variantEngine.applyVariants(rawResult, this.data.testId, typeCode);
    const qaArr = this.data.questions.map(q => ({
      q: q.text, a: q.options[this.data.selectedMap[q.id]]?.text || ''
    }));

    let ratings = result.ratings || null;
    if (!ratings) {
      const scores = this._engine.getScores();
      const cfg = this.data.testId !== 'random' ? TEST_CONFIGS[this.data.testId] : null;
      const dims = cfg?.scoring?.dimensions || [];
      const dimDisplayMap = cfg?.scoring?.dimDisplayMap || {};

      if (this.data.testId === 'mbti_simple' && dims.length > 0) {
        const e = scores.E || 0, i = scores.I || 0;
        const s = scores.S || 0, n = scores.N || 0;
        const t = scores.T || 0, f = scores.F || 0;
        const j = scores.J || 0, p = scores.P || 0;
        ratings = {};
        ratings[e >= i ? 'E 外向' : 'I 内向'] = Math.max(e, i);
        ratings[n >= s ? 'N 直觉' : 'S 实感'] = Math.max(n, s);
        ratings[f >= t ? 'F 情感' : 'T 思考'] = Math.max(f, t);
        ratings[p >= j ? 'P 感知' : 'J 判断'] = Math.max(p, j);
      } else if (dims.length > 0) {
        ratings = {};
        dims.forEach(d => { ratings[dimDisplayMap[d] || d] = (scores[d] || 0); });
      }
    }

    let finalResult = result;
    if (this.data.testId === 'random') {
      const scores = this._engine.getScores();
      finalResult = {
        title: '混合人格 🎲', sum: '多面体的你',
        brief: '你是一个复杂又有趣的人，每次测试都能发现新的自己。今天的你：' + this._getRandomSummary(scores),
        rank: '隐藏·多变体', tagline: '我就是那种：在不同测试里是不同的人的神奇物种 🎭',
        rarity: '极稀有 · 全国仅5%', percent: '5%',
        strengths: '适应力强、多才多艺、不无聊', weaknesses: '不够专注、容易变来变去',
        career: '自由职业、创意工作、多元发展', conversation: '测出我是混合人格！多面体的我，你呢？',
        ratings: ratings || { 多变: 8, 复杂: 7, 有趣: 9 }
      };
    }

    wx.setStorageSync('testResult', {
      testId: this.data.testId,
      type: this.data.testId === 'random' ? 'random' : typeCode,
      title: finalResult.title, summary: finalResult.sum || finalResult.summary,
      brief: finalResult.brief, rank: finalResult.rank || '', tagline: finalResult.tagline || '',
      rarity: finalResult.rarity || '', percent: finalResult.percent || '',
      strengths: finalResult.strengths || '', weaknesses: finalResult.weaknesses || '',
      career: finalResult.career || '', conversation: finalResult.conversation || '',
      ratings: finalResult.ratings || ratings, _qaArr: qaArr
    });
    app.saveTestHistory(this.data.testId, this.data.testId === 'random' ? 'random' : typeCode);
    // 延迟跳转，让道家箴言过渡可见
    setTimeout(() => {
      wx.redirectTo({ url: '/pages/result/result' });
    }, 700);
  },

  _pickQuestions(pool, count) {
    if (!pool || pool.length <= count) return pool || [];
    const shuffled = [...pool];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled.slice(0, count);
  },

  _getRandomSummary(scores) {
    const keys = Object.keys(scores);
    if (keys.length === 0) return '状态不错';
    const top = keys.sort((a, b) => (scores[b] || 0) - (scores[a] || 0))[0];
    const map = { 'jin': '偏向果断坚定', 'mu': '偏向温和耐心', 'shui': '偏向聪明灵动', 'huo': '偏向热情活力', 'tu': '偏向稳重可靠', 'E': '外向能量强', 'I': '内向能量强', 'caishen': '财运不错', 'nezha': '精力充沛' };
    return map[top] || '状态不错';
  },

  /** 随机选取道家箴言 */
  _pickTaoQuote() {
    return TAO_QUOTES[Math.floor(Math.random() * TAO_QUOTES.length)];
  },

  _showQuotaModal() {
    const status = QuotaManager.getStatus();
    this.setData({
      showQuotaModal: true, quotaShareRemaining: status.shareRemaining, quotaAdRemaining: status.adRemaining
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

  closeQuotaModal() { this.setData({ showQuotaModal: false }); if (this._recoverTimer) { clearInterval(this._recoverTimer); this._recoverTimer = null; }},
  onWaitLater() { wx.showToast({ title: '休息一下，30分钟后就恢复啦~', icon: 'none' }); this.closeQuotaModal(); },

  onWatchAd() {
    const ad = app.globalData.rewardedVideoAd;
    if (ad) {
      ad.show().catch(() => { ad.load().then(() => ad.show()).catch(() => this._rewardByAdFallback()); });
      ad.onClose((res) => { if (res && res.isEnded) this._rewardByAdFallback(); else wx.showToast({ title: '看完广告才能恢复哦~', icon: 'none' }); });
    } else { this._rewardByAdFallback(); }
  },

  _rewardByAdFallback() {
    const result = QuotaManager.rewardByAd();
    if (result.success) { wx.showToast({ title: `+${result.added}次！尽情测试吧~`, icon: 'success' }); this.closeQuotaModal(); this._doSubmit(); }
    else { wx.showToast({ title: result.msg, icon: 'none' }); }
  },

  onShareFriend() {
    const result = QuotaManager.rewardByShare();
    if (result.success) {
      wx.showToast({ title: `+${result.added}次！`, icon: 'success' });
    }
  },
  onShareAppMessage() {
    return { title: '遇事不决茅山一测！你在茅山趣测是什么神仙？来试试 👉', path: `/pages/index/index?invite=${Date.now()}`, imageUrl: '' };
  },

  onShareTimeline() {
    return { title: '茅山趣测——沉浸式道教文化趣味测试，测测你的隐藏天赋 ☯️' };
  },

  goBack() {
    if (this.data.selectedCount > 0) this.setData({ showExitModal: true });
    else wx.navigateBack();
  },
  confirmExit() { this.setData({ showExitModal: false }); wx.navigateBack(); },
  cancelExit() { this.setData({ showExitModal: false }); }
});
