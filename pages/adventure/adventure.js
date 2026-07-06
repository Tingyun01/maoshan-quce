const adventureEngine = require('../../config/scenario-adventure');
const variantEngine = require('../../config/result-variants');
const audio = require('../../utils/audio-engine');
const { resolveCloudUrl } = require('../../utils/cloud-image');
const app = getApp();

// 道德经语录
const DAOJING_QUOTES = [
  '道生一，一生二，二生三，三生万物',
  '人法地，地法天，天法道，道法自然',
  '上善若水，水善利万物而不争',
  '知人者智，自知者明',
  '祸兮福之所倚，福兮祸之所伏',
  '大方无隅，大器晚成，大音希声，大象无形',
  '千里之行，始于足下',
  '道可道，非常道；名可名，非常名',
  '无为而无不为',
  '知足不辱，知止不殆'
];

Page({
  data: {
    phase: 'list',          // 'list' | 'story' | 'result'
    // 列表
    scenarioList: [],
    // 故事
    storyText: '',
    mood: 'peaceful',
    choices: [],
    isEnd: false,
    // 结果
    result: null,
    // 分享卡
    showCard: false,
    cardUrl: '',
    // 状态
    statusBarHeight: 0,
    themeClass: ''
  },

  _session: null,

  onLoad() {
    const us = app.globalData.userSettings || {};
    const theme = us.theme || 'light';
    const b = us.themeBrightness || 'medium';
    let tc = '';
    if (theme === 'light') tc += 'light-theme ';
    if (b && b !== 'medium') tc += 'bright-' + b + ' ';

    const winInfo = wx.getWindowInfo();

    this.setData({
      themeClass: tc.trim(),
      statusBarHeight: winInfo.statusBarHeight || 44,
      scenarioList: adventureEngine.getScenarioList()
    });
  },

  // ============ 列表阶段 ============
  startScenario(e) {
    const id = e.currentTarget.dataset.id;
    audio.playClick();
    const session = adventureEngine.createSession(id);
    if (!session) {
      wx.showToast({ title: '场景加载失败', icon: 'none' });
      return;
    }
    this._session = session;
    this._enterStory();
  },

  _enterStory() {
    const node = adventureEngine.getCurrentNode(this._session);
    if (!node) return;

    // 文字动画：逐字显示（简单版：直接显示）
    this.setData({
      phase: 'story',
      storyText: node.story,
      mood: node.mood || 'peaceful',
      choices: node.choices || [],
      isEnd: node.isEnd || false
    });
  },

  // ============ 故事阶段 ============
  makeChoice(e) {
    const idx = parseInt(e.currentTarget.dataset.idx);
    audio.playSelect();
    wx.vibrateShort({ type: 'medium' }).catch(() => {});

    const result = adventureEngine.makeChoice(this._session, idx);
    if (!result.ok) return;

    if (result.isEnd) {
      // 终章 — 先展示最后的故事，再跳结果
      const finalNode = adventureEngine.getCurrentNode(this._session);
      this.setData({
        storyText: finalNode ? finalNode.story : '',
        mood: finalNode ? finalNode.mood : 'bright',
        choices: [],
        isEnd: true
      });

      // 自动跳转到结果（给用户一点看终章文字的时间）
      setTimeout(() => {
        this._showResult();
      }, 2500);
    } else {
      // 正常推进
      const nextNode = adventureEngine.getCurrentNode(this._session);
      this.setData({
        storyText: nextNode ? nextNode.story : '',
        mood: nextNode ? nextNode.mood : 'peaceful',
        choices: nextNode ? nextNode.choices : [],
        isEnd: nextNode ? nextNode.isEnd : false
      });
    }
  },

  _showResult() {
    const rawResult = adventureEngine.getFinalResult(this._session);
    if (!rawResult) {
      this.setData({ phase: 'list' });
      return;
    }

    audio.playReveal();
    // 🎲 同样应用变体引擎
    const finalResult = variantEngine.applyVariants(rawResult, 'scenario', rawResult.typeCode);
    this.setData({ phase: 'result', result: finalResult });
  },

  // ============ 结果阶段 ============
  /** 再来一次 */
  retry() {
    audio.playClick();
    if (!this._session) return;
    const newSession = adventureEngine.createSession(this._session.scenarioId);
    this._session = newSession;
    this._enterStory();
  },

  /** 回到场景列表 */
  backToList() {
    audio.playClick();
    this._session = null;
    this.setData({ phase: 'list', result: null });
  },

  /** 返回首页 */
  goHome() {
    wx.reLaunch({ url: '/pages/index/index' });
  },

  // ============ 分享卡生成 ============
  generateCard() {
    audio.playClick();
    wx.showLoading({ title: '生成分享卡...' });
    const query = wx.createSelectorQuery();
    query.select('#cardCanvas').fields({ node: true, size: true }).exec((res) => {
      if (!res || !res[0]) { wx.hideLoading(); return; }
      const canvas = res[0].node;
      const ctx = canvas.getContext('2d');
      const dpr = wx.getWindowInfo().pixelRatio || 2;
      const w = 540, h = 720;
      canvas.width = w * dpr; canvas.height = h * dpr;
      ctx.scale(dpr, dpr);

      const r = this.data.result;
      if (!r) { wx.hideLoading(); return; }

      // 深色渐变背景
      const bgGrad = ctx.createLinearGradient(0, 0, 0, h);
      bgGrad.addColorStop(0, '#1A0A0A');
      bgGrad.addColorStop(0.35, '#2D1B1B');
      bgGrad.addColorStop(0.65, '#1A1A2E');
      bgGrad.addColorStop(1, '#0A0A1A');
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, w, h);

      // 装饰光晕
      ctx.fillStyle = 'rgba(200,160,120,0.04)';
      ctx.beginPath(); ctx.arc(w * 0.2, h * 0.08, 200, 0, Math.PI * 2); ctx.fill();
      ctx.beginPath(); ctx.arc(w * 0.8, h * 0.7, 150, 0, Math.PI * 2); ctx.fill();

      // 顶部品牌
      ctx.fillStyle = '#E8A87C';
      ctx.font = 'bold 28px sans-serif';
      ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
      ctx.fillText('茅山趣测', w/2, 40);

      // 分隔线
      ctx.fillStyle = 'rgba(232,168,124,0.3)';
      ctx.fillRect(w/2 - 30, 58, 60, 1.5);

      // 结果标题 (去除 emoji)
      const title = r.title.replace(/[\u{1F000}-\u{1FFFF}]|[\u{2600}-\u{27BF}]/gu, '').trim();
      ctx.fillStyle = '#FFD700';
      ctx.font = 'bold 34px sans-serif';
      ctx.fillText(title, w/2, 110);

      // 称号
      let y = 150;
      if (r.rank) {
        ctx.fillStyle = '#E8A87C';
        ctx.font = '22px sans-serif';
        ctx.fillText(r.rank, w/2, y);
        y += 40;
      }

      // 道德经语录
      const daoQuote = DAOJING_QUOTES[Math.floor(Math.random() * DAOJING_QUOTES.length)];
      ctx.fillStyle = 'rgba(255,215,0,0.45)';
      ctx.font = '18px sans-serif';
      ctx.fillText('「' + daoQuote + '」', w/2, y);
      y += 50;

      // 简介（自动换行）
      ctx.textAlign = 'left';
      ctx.fillStyle = 'rgba(255,255,255,0.8)';
      ctx.font = '20px sans-serif';
      const briefW = 440, briefX = (w - briefW) / 2;
      let line = '';
      for (let c of (r.brief || '')) {
        const test = line + c;
        if (ctx.measureText(test).width > briefW) {
          ctx.fillText(line.trim(), briefX, y);
          line = c;
          y += 30;
        } else { line = test; }
      }
      if (line) { ctx.fillText(line.trim(), briefX, y); y += 30; }
      y += 10;

      // 段子
      if (r.tagline) {
        ctx.textAlign = 'center';
        ctx.fillStyle = '#E8C17A';
        ctx.font = '20px sans-serif';
        ctx.fillText(r.tagline, w/2, y);
        y += 50;
      }

      // 场景名
      ctx.textAlign = 'center';
      ctx.fillStyle = 'rgba(200,160,120,0.35)';
      ctx.font = '18px sans-serif';
      ctx.fillText('—— ' + (r.scenarioTitle || '秘境奇谈') + ' · 奇遇结局', w/2, h - 100);

      // 底部CTA
      ctx.fillStyle = 'rgba(255,215,0,0.6)';
      ctx.font = 'bold 20px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('微信搜一搜：「茅山趣测」', w/2, h - 60);

      // 免责
      ctx.fillStyle = 'rgba(255,255,255,0.15)';
      ctx.font = '14px sans-serif';
      ctx.fillText('*本服务为趣味娱乐工具 · 结果仅供娱乐', w/2, h - 30);

      // ===== 右下角二维码（覆盖AI水印区域）=====
      const qrSize = 90, qrX = w - qrSize - 14, qrY = h - qrSize - 14;
      // 白色底框
      ctx.fillStyle = '#FFFFFF';
      ctx.shadowColor = 'rgba(0,0,0,0.3)';
      ctx.shadowBlur = 8;
      ctx.beginPath();
      ctx.roundRect ? ctx.roundRect(qrX - 6, qrY - 6, qrSize + 12, qrSize + 12, 6) : ctx.rect(qrX - 6, qrY - 6, qrSize + 12, qrSize + 12);
      ctx.fill();
      ctx.shadowColor = 'transparent';
      ctx.shadowBlur = 0;

      // 尝试加载二维码图片
      const qrImg = canvas.createImage();
      qrImg.onload = () => {
        ctx.drawImage(qrImg, qrX, qrY, qrSize, qrSize);
        this._exportCard(canvas, w, h);
      };
      qrImg.onerror = () => {
        // 图片不存在时画占位符
        ctx.fillStyle = '#F5F0EB';
        ctx.fillRect(qrX, qrY, qrSize, qrSize);
        ctx.fillStyle = '#8a7a6a';
        ctx.font = '12px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('扫码', qrX + qrSize/2, qrY + qrSize/2 - 6);
        ctx.fillText('进入', qrX + qrSize/2, qrY + qrSize/2 + 10);
        this._exportCard(canvas, w, h);
      };
      qrImg.src = '/images/resized-000趣测小程序码.jpg';
    });
  },

  _exportCard(canvas, w, h) {
    wx.canvasToTempFilePath({
      canvas, fileType: 'jpg', quality: 0.9,
      success: (res) => {
        this.setData({ showCard: true, cardUrl: res.tempFilePath });
        wx.hideLoading();
      },
      fail: () => { wx.hideLoading(); wx.showToast({ title: '生成失败', icon: 'none' }); }
    }, this);
  },

  saveCard() {
    if (!this.data.cardUrl) return;
    wx.saveImageToPhotosAlbum({
      filePath: this.data.cardUrl,
      success: () => { wx.showToast({ title: '已保存！快去发朋友圈吧', icon: 'none' }); this.closeCard(); },
      fail: (e) => { if (e.errMsg.includes('auth deny')) wx.openSetting({}); }
    });
  },

  shareCard() {
    if (!this.data.cardUrl) return;
    wx.shareImageMessage({
      imageUrl: this.data.cardUrl,
      complete: () => this.closeCard()
    });
  },

  closeCard() { this.setData({ showCard: false, cardUrl: '' }); },

  // ============ 通用 ============
  goBack() {
    if (this.data.phase === 'result') {
      this.backToList();
    } else if (this.data.phase === 'story') {
      this.backToList();
    } else {
      wx.navigateBack();
    }
  }
});
