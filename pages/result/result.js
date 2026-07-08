const app = getApp();
const achievementMgr = require('../../utils/achievement-manager');
const collectionMgr = require('../../utils/collection-manager');
const journeyMgr = require('../../utils/journey-manager');
const POSTER_IMAGES = require('../../config/poster-images');
const POSTER_GRADIENTS = require('../../config/poster-gradients');
const RARITY_STATS = require('../../config/rarity-stats');
const { resolveCloudUrl } = require('../../utils/cloud-image');
const audio = require('../../utils/audio-engine');
const analytics = require('../../utils/analytics');

// 题库配置映射（从 app.globalData 获取，避免重复require）
const TEST_CONFIGS = app.globalData.testConfigs;

const TestEngine = require('../../utils/test-engine');

Page({
    data: {
      themeClass: '', testId: '', type: '',
      typeTitle: '', typeSummary: '', typeBrief: '',
      testIcon: '道',
      // 新字段
      rank: '', tagline: '', rarity: '', percent: '', beatPercent: '',
      strengths: '', weaknesses: '', career: '', conversation: '',
      ratings: null, ratingKeys: [],
      insightUnlocked: false, insightLoading: false, insightText: '',
      showSharePoster: false, sharePosterUrl: '',
      showResult: false, animateRatings: false,
      statusBarHeight: 44,
      // 好友PK对比
      friendResult: null,
      // 问道之旅
      journeyComplete: false,
      journeyLevel: null,
      nextLevel: null
    },

  onLoad() {
    const stored = wx.getStorageSync('testResult');
    if (!stored || !stored.testId) {
      wx.showToast({ title: '结果数据异常', icon: 'none' });
      wx.navigateBack();
      return;
    }
    const us = app.globalData.userSettings || {};
    const theme = us.theme || 'light', b = us.themeBrightness || 'medium';
    const statusBarHeight = app.globalData.statusBarHeight || 44;
    this.setData({ statusBarHeight });
    let tc = '';
    if (theme === 'light') tc += 'light-theme ';
    if (b && b !== 'medium') tc += 'bright-' + b + ' ';
    this.setData({ themeClass: tc.trim(), testId: stored.testId, type: stored.type });

    analytics.track('test_complete', { testId: stored.testId, type: stored.type, title: stored.title });

    // 加载结果数据
    const cfg = TEST_CONFIGS[stored.testId];
    const res = cfg?.results[stored.type] || cfg?.results['default'] || {};

    // 双视角描述：优先用配置中的，没有则用映射生成
    let othersView = res.othersView || '';
    let trueSelf = res.trueSelf || '';
    if (!othersView) {
      const dualView = this._genDualView(stored.testId, stored.type, res);
      othersView = dualView.othersView;
      trueSelf = dualView.trueSelf;
    }

    // 从稀有度统计配置获取 percent 和 beat
    const rarityKey = stored.testId + '.' + stored.type;
    const rarityStat = RARITY_STATS[rarityKey] || {};
    const percentVal = res.percent || (rarityStat.percent ? rarityStat.percent + '%' : '');
    const beatVal = rarityStat.beat ? '击败 ' + rarityStat.beat + '% 的修仙者' : '';

    this.setData({
      testIcon: cfg?.icon || '道',
      typeTitle: res.title || stored.title,
      typeSummary: res.sum || stored.summary,
      typeBrief: res.brief || stored.brief,
      rank: res.rank || '',
      tagline: res.tagline || '',
      rarity: res.rarity || '',
      percent: percentVal,
      beatPercent: beatVal,
      strengths: res.strengths || '',
      weaknesses: res.weaknesses || '',
      career: res.career || '',
      conversation: res.conversation || '',
      ratings: stored.ratings || res.ratings || null,
      ratingKeys: stored.ratings ? Object.keys(stored.ratings) : (res.ratings ? Object.keys(res.ratings) : []),
      othersView: othersView,
      trueSelf: trueSelf
    });

    // 震动反馈+入场动画
    wx.vibrateShort({ type: 'medium' }).catch(() => {});
    audio.playReveal();
    setTimeout(() => this.setData({ showResult: true }), 100);
    setTimeout(() => this.setData({ animateRatings: true }), 500);
    // 稀有度音效
    if (res.rarity && res.rarity.includes('稀有')) {
      setTimeout(() => audio.playRare(), 800);
    }

    // 图鉴系统：解锁当前结果
    if (stored.testId !== 'random') {
      collectionMgr.unlock(stored.testId, stored.type, stored.title || res.title || typeCode);
    }

    // 问道之旅：检测是否从关卡入口进入，是则标记通关
    const journeyLevelId = wx.getStorageSync('journeyLevel');
    if (journeyLevelId) {
      const lv = journeyMgr.getLevelById(journeyLevelId);
      if (lv && lv.testId === stored.testId) {
        const isNew = journeyMgr.completeLevel(journeyLevelId);
        if (isNew) {
          this.setData({ journeyComplete: true, journeyLevel: lv });
          const nextLv = journeyMgr.getNextLevel();
          if (nextLv) this.setData({ nextLevel: nextLv });
        }
      }
      wx.removeStorageSync('journeyLevel');
    }

    // 五行为 wu_xing 时检测均衡体成就
    if (stored.testId === 'wu_xing') {
      this._checkBalanceAchievement(stored.ratings);
    }

    // 加载好友PK对比数据
    const isPkMode = wx.getStorageSync('pkMode');
    const friendInvite = wx.getStorageSync('friendInvite');
    if (isPkMode && friendInvite && friendInvite.t === stored.testId) {
      // 检查好友和自己的结果是否属于同一测试
      const friendCfg = TEST_CONFIGS[friendInvite.t];
      const friendRes = friendCfg?.results[friendInvite.p] || friendCfg?.results['default'] || {};
      this.setData({
        friendResult: {
          title: friendInvite.n,
          rank: friendInvite.r || friendRes.rank || '',
          myType: friendInvite.p,
          friendType: stored.type
        }
      });
      // 用完即删
      wx.removeStorageSync('pkMode');
      wx.removeStorageSync('friendInvite');
    }
  },

  /** 检测五行分数是否均衡，相差 < 10 分则解锁均衡体成就 */
  _checkBalanceAchievement(ratings) {
    if (!ratings) return;
    const vals = Object.values(ratings).filter(v => typeof v === 'number');
    if (vals.length < 3) return;
    const max = Math.max(...vals);
    const min = Math.min(...vals);
    if (max - min <= 10) {
      achievementMgr.onBalancedResult();
    }
  },

  unlockInsight() {
    analytics.track('ad_watch', { source: 'insight_unlock', testId: this.data.testId, type: this.data.type });
    const ad = app.globalData.rewardedVideoAd;
    if (ad) {
      ad.show().catch(() => {
        ad.load().then(() => ad.show()).catch(() => this._generateInsight());
      });
      ad.onClose((res) => {
        if (res && res.isEnded) this._generateInsight();
        else wx.showToast({ title: '看完广告即可解锁', icon: 'none' });
      });
    } else {
      this._generateInsight();
    }
  },

  _generateInsight() {
    wx.showLoading({ title: '正在生成解读...' });
    setTimeout(() => {
      const stored = wx.getStorageSync('testResult');
      const storedQA = stored?._qaArr || [];
      const cfg = TEST_CONFIGS[stored.testId];
      let analysisText = '';
      if (cfg) {
        const engine = new TestEngine(cfg);
        storedQA.forEach(qa => {
          if (qa && qa.qId !== undefined && qa.optionIdx !== undefined) {
            engine.addAnswer(qa.qId, qa.optionIdx);
          }
        });
        analysisText = engine.getInsightAnalysis(stored.type, storedQA);
      }
      if (!analysisText) {
        analysisText = `作为${this.data.typeTitle}，你有着独特的气质和天赋。想了解更多深度分析？后续版本将为你带来更精彩的解读！`;
      }
      this.setData({ insightUnlocked: true, insightText: analysisText, insightLoading: false });
      wx.hideLoading();
    }, 600);
  },

  // 一键复制话题文案，方便发朋友圈
  copyConversation() {
    const typeTitle = this.data.typeTitle || '未知';
    const rarity = this.data.rarity || '';
    const hook = rarity ? `（${rarity}）` : '';
    const text = `🔮 我在「茅山趣测」测出是「${typeTitle}」${hook}！

好玩的趣味心理测试，MBTI、前世今生、性格测试、运势、守护神兽全都有！

微信搜一搜「茅山趣测」就能玩 👉`;
    wx.setClipboardData({
      data: text,
      success: () => wx.showToast({ title: '文案已复制，快去发朋友圈吧！', icon: 'none' })
    });
  },

  generatePoster() {
    audio.playClick();
    analytics.track('poster_generate', { testId: this.data.testId, type: this.data.type });
    wx.showLoading({ title: '生成分享图...' });
    const that = this;
    const query = wx.createSelectorQuery();
    query.select('#sharePosterCanvas').fields({ node: true, size: true }).exec((res) => {
      if (!res || !res[0]) { wx.hideLoading(); return; }
      const canvas = res[0].node;
      const ctx = canvas.getContext('2d');
      const dpr = wx.getWindowInfo().pixelRatio || 2;
      const w = 540, h = 720;
      canvas.width = w * dpr; canvas.height = h * dpr;
      ctx.scale(dpr, dpr);

      // 尝试加载背景图片
      const bgPath = that._getPosterBg();
      // 获取降级配色
      const fallbackCfg = that._getPosterGradient();

      const drawPoster = (hasBgImage) => {
        try {
        if (!hasBgImage) {
          // === 主题色渐变背景（无图降级） ===
          const c = fallbackCfg.colors || ['#1A1A2E', '#2D2D3D', '#4A3A5C', '#1A1A2E'];
          const bgGrad = ctx.createLinearGradient(0, 0, 0, h);
          bgGrad.addColorStop(0, c[0]);
          bgGrad.addColorStop(0.33, c[1]);
          bgGrad.addColorStop(0.66, c[2]);
          bgGrad.addColorStop(1, c[3]);
          ctx.fillStyle = bgGrad;
          ctx.fillRect(0, 0, w, h);

          // 装饰光晕（大圆，微微发光）
          const glowColor = fallbackCfg.glow || 'rgba(255,215,0,0.15)';
          ctx.fillStyle = glowColor.replace(')', ',0.08)').replace('rgb', 'rgba');
          // 简化：直接画几个装饰圆
          ctx.fillStyle = glowColor;
          ctx.globalAlpha = 0.06;
          ctx.beginPath(); ctx.arc(w * 0.25, h * 0.2, 120, 0, Math.PI * 2); ctx.fill();
          ctx.beginPath(); ctx.arc(w * 0.75, h * 0.3, 80, 0, Math.PI * 2); ctx.fill();
          ctx.beginPath(); ctx.arc(w * 0.5, h * 0.55, 160, 0, Math.PI * 2); ctx.fill();
          ctx.globalAlpha = 0.12;
          ctx.beginPath(); ctx.arc(w * 0.6, h * 0.15, 60, 0, Math.PI * 2); ctx.fill();
          ctx.beginPath(); ctx.arc(w * 0.3, h * 0.7, 90, 0, Math.PI * 2); ctx.fill();
          ctx.globalAlpha = 1;

          // 装饰图标（大号半透明 emoji，像水印一样在背景上）
          if (fallbackCfg.icon) {
            ctx.fillStyle = 'rgba(255,255,255,0.06)';
            ctx.font = '160px sans-serif';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(fallbackCfg.icon, w / 2, h * 0.42);
          }

          // 稀疏星光点
          ctx.fillStyle = 'rgba(255,255,255,0.15)';
          const stars = [
            [w * 0.12, h * 0.08], [w * 0.88, h * 0.05], [w * 0.18, h * 0.25],
            [w * 0.82, h * 0.22], [w * 0.08, h * 0.65], [w * 0.92, h * 0.68],
            [w * 0.45, h * 0.72], [w * 0.55, h * 0.78], [w * 0.3, h * 0.85]
          ];
          stars.forEach(([sx, sy]) => {
            ctx.beginPath(); ctx.arc(sx, sy, 1.5, 0, Math.PI * 2); ctx.fill();
          });

          // 细装饰线 — 增加"卡片感"
          ctx.strokeStyle = 'rgba(255,255,255,0.04)';
          ctx.lineWidth = 0.5;
          ctx.beginPath(); ctx.moveTo(20, h * 0.32); ctx.lineTo(w * 0.3, h * 0.32); ctx.stroke();
          ctx.beginPath(); ctx.moveTo(w * 0.7, h * 0.32); ctx.lineTo(w - 20, h * 0.32); ctx.stroke();
          ctx.fillRect(0, 0, w, h);
          // 顶部装饰条
          ctx.fillStyle = 'rgba(232,168,124,0.08)';
          ctx.fillRect(0, 0, w, 200);
        }

        // ===== 水印 — 斜排重复文字，防裁剪盗图 =====
        ctx.save();
        ctx.fillStyle = 'rgba(255,255,255,0.05)';
        ctx.font = '22px sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.translate(w / 2, h / 2);
        ctx.rotate(-22 * Math.PI / 180);
        const wmYStep = 88, wmXStep = wmYStep * 3.5;
        for (let row = -12; row <= 12; row++) {
          for (let col = -8; col <= 8; col++) {
            ctx.fillText('茅山趣测', col * wmXStep, row * wmYStep);
          }
        }
        ctx.restore();
        // ===== 水印结束 =====

        // 底栏半透明遮罩 — 加强层次，让任何背景上都可读
        const overlayGrad = ctx.createLinearGradient(0, h * 0.28, 0, h);
        overlayGrad.addColorStop(0, 'rgba(0,0,0,0)');
        overlayGrad.addColorStop(0.15, 'rgba(0,0,0,0.25)');
        overlayGrad.addColorStop(0.35, 'rgba(0,0,0,0.5)');
        overlayGrad.addColorStop(0.7, 'rgba(0,0,0,0.72)');
        overlayGrad.addColorStop(1, 'rgba(0,0,0,0.85)');
        ctx.fillStyle = overlayGrad;
        ctx.fillRect(0, h * 0.28, w, h * 0.72);

        // 顶部强遮罩 — 覆盖标题区域，确保任何背景上都可读
        const topGrad = ctx.createLinearGradient(0, 0, 0, 220);
        topGrad.addColorStop(0, 'rgba(0,0,0,0.7)');
        topGrad.addColorStop(0.3, 'rgba(0,0,0,0.45)');
        topGrad.addColorStop(0.7, 'rgba(0,0,0,0.12)');
        topGrad.addColorStop(1, 'rgba(0,0,0,0)');
        ctx.fillStyle = topGrad;
        ctx.fillRect(0, 0, w, 220);

        // 桃花金细边框
        ctx.strokeStyle = 'rgba(232,168,124,0.25)';
        ctx.lineWidth = 2;
        ctx.strokeRect(8, 8, w - 16, h - 16);

        ctx.textAlign = 'center'; ctx.textBaseline = 'middle';

        // 品牌标题 — 双层描边 + 阴影，确保清晰
        const drawStrokedText = (text, x, y, fillColor, fontSize, fontWeight) => {
          ctx.font = (fontWeight || 'bold') + ' ' + fontSize.replace('px', '') + 'px sans-serif';
          ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
          // 第一层：深色外描边（模拟 stroke）
          ctx.shadowColor = 'rgba(0,0,0,0.9)';
          ctx.shadowBlur = 6;
          ctx.fillStyle = fillColor;
          ctx.fillText(text, x, y);
          // 第二层：再次绘制使阴影更深
          ctx.fillText(text, x, y);
          ctx.shadowColor = 'transparent';
          ctx.shadowBlur = 0;
        };

        drawStrokedText('茅山趣测', w/2, 46, '#E8A87C', '32px', 'bold');

        // 分隔线 — 加阴影提升可见度
        ctx.shadowColor = 'rgba(0,0,0,0.5)';
        ctx.shadowBlur = 4;
        ctx.fillStyle = 'rgba(232,168,124,0.5)';
        ctx.fillRect(w/2 - 28, 70, 56, 1.5);
        ctx.shadowColor = 'transparent';
        ctx.shadowBlur = 0;

        // 结果大标题 — 加强描边
        const rawTitle = that.data.typeTitle || '';
        const displayTitle = rawTitle.replace(/[\u{1F000}-\u{1FFFF}]|[\u{2600}-\u{27BF}]|[\u{1F300}-\u{1F5FF}]|[\u{1F600}-\u{1F64F}]|[\u{1F680}-\u{1F6FF}]|[\u{1F900}-\u{1F9FF}]/gu, '').trim();
        drawStrokedText(displayTitle, w/2, 128, '#FFD700', '36px', 'bold');

        // 称号
        let nextY = 170;
        if (that.data.rank) {
          drawStrokedText(that.data.rank, w/2, nextY, '#E8A87C', '20px', 'bold');
          nextY += 36;
        }

        // 稀有度标签
        if (that.data.rarity) {
          const rText = that.data.rarity;
          ctx.font = '18px sans-serif';
          const rW = ctx.measureText(rText).width + 36;
          const rx = w/2 - rW/2, ry = nextY - 14, rw = rW, rh = 30, rr = 15;
          ctx.fillStyle = 'rgba(0,0,0,0.55)';
          ctx.shadowColor = 'rgba(0,0,0,0.4)';
          ctx.shadowBlur = 8;
          ctx.beginPath();
          ctx.arc(rx + rr, ry + rr, rr, Math.PI, Math.PI * 1.5);
          ctx.lineTo(rx + rw - rr, ry);
          ctx.arc(rx + rw - rr, ry + rr, rr, Math.PI * 1.5, Math.PI * 2);
          ctx.lineTo(rx + rw, ry + rh - rr);
          ctx.arc(rx + rw - rr, ry + rh - rr, rr, 0, Math.PI * 0.5);
          ctx.lineTo(rx + rr, ry + rh);
          ctx.arc(rx + rr, ry + rh - rr, rr, Math.PI * 0.5, Math.PI);
          ctx.closePath();
          ctx.fill();
          ctx.shadowColor = 'transparent';
          ctx.shadowBlur = 0;
          ctx.fillStyle = 'rgba(255,215,0,0.9)';
          ctx.font = 'bold 18px sans-serif';
          ctx.shadowColor = 'rgba(0,0,0,0.5)';
          ctx.shadowBlur = 4;
          ctx.fillText(rText, w/2, nextY + 2);
          ctx.shadowColor = 'transparent';
          ctx.shadowBlur = 0;
          nextY += 48;
        }

        // tagline 段子（自动换行）+ 强阴影
        if (that.data.tagline) {
          ctx.fillStyle = '#FFFEF8';
          ctx.font = 'bold 22px sans-serif';
          ctx.shadowColor = 'rgba(0,0,0,0.8)';
          ctx.shadowBlur = 10;
          const maxW = 440;
          let line = '';
          for (let c of that.data.tagline) {
            const test = line + c;
            if (ctx.measureText(test).width > maxW) {
              ctx.fillText(line.trim(), w/2, nextY);
              line = c;
              nextY += 34;
            } else {
              line = test;
            }
          }
          if (line) { ctx.fillText(line.trim(), w/2, nextY); nextY += 34; }
          ctx.shadowColor = 'transparent';
          ctx.shadowBlur = 0;
        }

        // 结果简述（自动换行）+ 阴影
        if (that.data.typeSummary) {
          ctx.fillStyle = 'rgba(255,255,255,0.85)';
          ctx.font = '18px sans-serif';
          ctx.shadowColor = 'rgba(0,0,0,0.7)';
          ctx.shadowBlur = 8;
          const sumMaxW = 440;
          let sumLine = '';
          for (let c of that.data.typeSummary) {
            const test = sumLine + c;
            if (ctx.measureText(test).width > sumMaxW) {
              ctx.fillText(sumLine.trim(), w/2, nextY);
              sumLine = c;
              nextY += 30;
            } else {
              sumLine = test;
            }
          }
          if (sumLine) { ctx.fillText(sumLine.trim(), w/2, nextY); nextY += 42; }
          ctx.shadowColor = 'transparent';
          ctx.shadowBlur = 0;
        }

        // 底部CTA — 加阴影突出
        const ctaY = h - 90;
        const crx = w/2 - 160, cry = ctaY - 18, crw = 320, crh = 44, crr = 22;
        ctx.shadowColor = 'rgba(0,0,0,0.5)';
        ctx.shadowBlur = 12;
        ctx.fillStyle = 'rgba(0,0,0,0.45)';
        ctx.beginPath();
        ctx.arc(crx + crr, cry + crr, crr, Math.PI, Math.PI * 1.5);
        ctx.lineTo(crx + crw - crr, cry);
        ctx.arc(crx + crw - crr, cry + crr, crr, Math.PI * 1.5, Math.PI * 2);
        ctx.lineTo(crx + crw, cry + crh - crr);
        ctx.arc(crx + crw - crr, cry + crh - crr, crr, 0, Math.PI * 0.5);
        ctx.lineTo(crx + crr, cry + crh);
        ctx.arc(crx + crr, cry + crh - crr, crr, Math.PI * 0.5, Math.PI);
        ctx.closePath();
        ctx.fill();
        ctx.shadowColor = 'transparent';
        ctx.shadowBlur = 0;

        ctx.fillStyle = '#FFD700';
        ctx.font = 'bold 22px sans-serif';
        ctx.shadowColor = 'rgba(0,0,0,0.8)';
        ctx.shadowBlur = 6;
        ctx.fillText('微信搜一搜 茅山趣测', w/2, ctaY + 4);
        ctx.shadowColor = 'transparent';
        ctx.shadowBlur = 0;

        // slogan
        ctx.fillStyle = 'rgba(255,215,0,0.55)';
        ctx.font = '18px sans-serif';
        ctx.shadowColor = 'rgba(0,0,0,0.6)';
        ctx.shadowBlur = 4;
        ctx.fillText('遇事不决 茅山一测', w/2, h - 52);
        ctx.shadowColor = 'transparent';
        ctx.shadowBlur = 0;

        // 底部小字 — 免责（小字风）
        ctx.fillStyle = 'rgba(255,255,255,0.25)';
        ctx.font = '12px sans-serif';
        ctx.shadowColor = 'rgba(0,0,0,0.6)';
        ctx.shadowBlur = 3;
        ctx.fillText('*本服务为趣味娱乐工具 · 测试结果仅供娱乐', w/2, h - 28);
        ctx.shadowColor = 'transparent';
        ctx.shadowBlur = 0;

        // ===== 右下角二维码（覆盖水印区域）=====
        const qrS = 80;
        const qrXc = w - qrS - 12, qrYc = h - qrS - 12;
        ctx.fillStyle = '#FFFFFF';
        ctx.shadowColor = 'rgba(0,0,0,0.25)';
        ctx.shadowBlur = 6;
        ctx.beginPath();
        ctx.roundRect ? ctx.roundRect(qrXc - 4, qrYc - 4, qrS + 8, qrS + 8, [4]) : ctx.rect(qrXc - 4, qrYc - 4, qrS + 8, qrS + 8);
        ctx.fill();
        ctx.shadowColor = 'transparent';
        ctx.shadowBlur = 0;
        ctx.fillStyle = '#8a7a6a';
        ctx.font = '12px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('扫码', qrXc + qrS/2, qrYc + qrS/2 - 4);
        ctx.fillText('进入', qrXc + qrS/2, qrYc + qrS/2 + 8);

        // 导出
        wx.canvasToTempFilePath({
          canvas, fileType: 'jpg', quality: 0.92,
          success: (r) => {
            try { wx.setStorageSync('sharePoster_' + that.data.testId + '_' + that.data.type, r.tempFilePath); } catch (e) {}
            that.setData({ showSharePoster: true, sharePosterUrl: r.tempFilePath });
            wx.hideLoading();
            console.log('[海报] 导出成功', r.tempFilePath);
            // 自动保存到相册（静默尝试）
            that._autoSavePoster(r.tempFilePath);
          },
          fail: (err) => { console.error('[海报] 导出失败', err); wx.hideLoading(); wx.showToast({ title: '生成失败', icon: 'none' }); }
        });
        } catch (e) {
          console.error('[海报] drawPoster异常', e);
          wx.hideLoading();
          wx.showToast({ title: '海报生成异常，请重试', icon: 'none' });
        }
      };

      // 尝试加载背景图片（cloud://需先转tempUrl）
      console.log('[海报] bgPath原始=', bgPath);
      resolveCloudUrl(bgPath).then(resolvedUrl => {
        console.log('[海报] resolvedUrl=', resolvedUrl);
        if (resolvedUrl) {
          const img = canvas.createImage();
          img.onload = () => {
            console.log('[海报] 图片加载成功，绘制背景');
            ctx.drawImage(img, 0, 0, w, h);
            drawPoster(true);
          };
          img.onerror = (err) => { console.warn('[海报] 图片加载失败', err); drawPoster(false); };
          img.src = resolvedUrl;
        } else {
          console.warn('[海报] resolvedUrl为空');
          drawPoster(false);
        }
      }).catch((e) => { console.warn('[海报] resolveCloudUrl异常', e); drawPoster(false); });
    });
  },

  // 获取海报背景图路径
  _getPosterBg() {
    const map = POSTER_IMAGES[this.data.testId];
    if (!map) { console.warn('[海报] 未找到测试ID的图片映射:', this.data.testId, '可用:', Object.keys(POSTER_IMAGES)); return null; }
    const bg = map[this.data.type] || null;
    console.log('[海报] testId=', this.data.testId, 'type=', this.data.type, 'bgPath=', bg);
    return bg;
  },

  // 获取海报降级渐变配色
  _getPosterGradient() {
    const map = POSTER_GRADIENTS[this.data.testId];
    if (map && map[this.data.type]) return map[this.data.type];
    // 通用默认：暖金色调
    return { colors: ['#2A1A2A', '#3A2A3A', '#4A3A2A', '#2A1A2A'], icon: '✨', glow: '#FFD700' };
  },

  savePoster() {
    if (!this.data.sharePosterUrl) return;
    audio.playClick();
    wx.saveImageToPhotosAlbum({
      filePath: this.data.sharePosterUrl,
      success: () => { wx.showToast({ title: '已保存到相册，快去发朋友圈吧！', icon: 'none', duration: 2000 }); this.setData({ showSharePoster: false }); },
      fail: (e) => { if (e.errMsg.includes('auth deny')) wx.openSetting({}); }
    });
  },

  /** 静默自动保存海报到相册 */
  _autoSavePoster(filePath) {
    if (!filePath) return;
    wx.saveImageToPhotosAlbum({
      filePath,
      success: () => { /* 静默成功 */ },
      fail: () => { /* 首次未授权静默失败，用户可手动保存 */ }
    });
  },

  goBack() { audio.playBack(); wx.navigateBack(); },
  closePoster() { this.setData({ showSharePoster: false }); },
  retest() { wx.redirectTo({ url: `/pages/quiz/quiz?id=${this.data.testId}` }); },
  goRetest() { audio.playClick(); wx.navigateTo({ url: '/pages/index/index' }); },

  /** 问道之旅：进入下一关 */
  goNextLevel() {
    const lv = this.data.nextLevel;
    if (!lv) return;
    wx.setStorageSync('journeyLevel', lv.id);
    wx.redirectTo({ url: `/pages/quiz/quiz?id=${lv.testId}` });
  },

  // 好友对比 — 复制邀请文案
  copyCompareLink() {
    const myTitle = this.data.typeTitle || '神秘身份';
    const text = `🔮 茅山趣测说我是「${myTitle}」！

你敢来测测你是什么吗？👇
13种趣味心理测试：前世今生、MBTI性格、守护神兽、运势道签……

微信搜一搜「茅山趣测」，看看我们谁更准！`;
    wx.setClipboardData({
      data: text,
      success: () => wx.showToast({ title: '文案已复制，快去邀请好友吧！', icon: 'none' })
    });
  },

  // 生成双视角描述（借鉴网易云主导色设计）
  _genDualView(testId, type, res) {
    const views = {
      'caishen': { others: '觉得你人傻钱多速来，但其实你心里比谁都清楚', self: '每一分钱都有它的去处，你不说罢了' },
      'taibai': { others: '觉得你高冷不好接近，其实你只是懒得敷衍', self: '你对值得的人，话比谁都多' },
      'tudi': { others: '觉得你好欺负，其实你只是不爱计较', self: '你有底线，只是不说而已' },
      'zhongkui': { others: '觉得你脾气大不好惹，但其实你最有分寸', self: '你怼人是为了公道，不是为了痛快' },
      'nezha': { others: '觉得你三分钟热度没长性，但其实你关键时刻最靠得住', self: '你只是不想把时间浪费在无聊的事情上' },
      'yueLao': { others: '觉得你太爱管闲事，其实你就是见不得别人难过', self: '你希望所有人都好，唯独忘了自己' },
      'jin': { others: '觉得你太强势不讲情面，其实你只是对事不对人', self: '你的原则不是为了为难别人，而是为了对得起自己' },
      'mu': { others: '觉得你没脾气好说话，其实你心里有一杆秤', self: '你不争不抢，但你有自己的坚持' },
      'shui': { others: '觉得你心眼子多太圆滑，其实你只是比较通透', self: '你看透了，只是懒得拆穿' },
      'huo': { others: '觉得你太热情太吵，但其实你的能量温暖了很多人', self: '你笑是为了让别人也笑' },
      'tu': { others: '觉得你太没存在感，但其实你是最让人安心的存在', self: '你不需要被记住，只要大家好好的' },
      'lion': { others: '觉得你太有压迫感不敢接近，其实你只是习惯保护别人', self: '你的强势，是因为你承担了太多' },
      'wolf': { others: '觉得你太计较太较真，其实你只是看不惯随便', self: '你对认准的人和事，从不含糊' },
      'dolphin': { others: '觉得你没心没肺天天傻乐，其实你也有心事', self: '你只是不想让别人担心' },
      'cat': { others: '觉得你太高冷不好相处，其实你只是需要安全感', self: '你慢热，但你一旦认准就全心投入' },
      'bear': { others: '觉得你太闷太没趣，其实你最懂怎么温暖别人', self: '你不说漂亮话，但你的行动比谁都暖' },
      'deer': { others: '觉得你太玻璃心太敏感，其实你的温柔是最珍贵的', self: '你感受到的，比任何人都多' }
    };
    const v = views[type];
    if (v) return { othersView: v.others, trueSelf: v.self };
    // 默认通用描述
    return {
      othersView: '觉得你有点神秘，捉摸不透',
      trueSelf: '你只是比别人多了一点点复杂和丰富'
    };
  },

  onShareAppMessage() {
    // 成就系统：记录分享
    app.track('share', { source: 'result', testId: this.data.testId, type: this.data.type });
    achievementMgr.onShared();
    const typeTitle = this.data.typeTitle || '未知身份';
    const rarity = this.data.rarity || '';
    const hook = rarity ? `（${rarity}）` : '';
    // 分享标题植入搜索热词
    const titles = [
      `🔮 我测出是「${typeTitle}」${hook}！你也来测测你的性格→`,
      `⚡ 我的前世居然是「${typeTitle}」${hook}？茅山趣测，来玩→`,
      `🎯 只有少数人测出「${typeTitle}」${hook}，趣味心理测试→`
    ];
    const titleIdx = Math.floor(Math.random() * titles.length);
    const imageUrl = this.data.sharePosterUrl || '';

    // 传递好友PK数据：testId + type + 结果标题
    const inviteData = { t: this.data.testId, p: this.data.type, n: typeTitle, r: this.data.rank || '' };
    const inviteStr = encodeURIComponent(JSON.stringify(inviteData));
    return {
      title: titles[titleIdx],
      path: `/pages/index/index?inviter=${app.globalData.userId || 'friend'}&from_result=${inviteStr}`,
      imageUrl
    };
  },

  onShareTimeline() {
    const typeTitle = this.data.typeTitle || '神秘身份';
    return {
      title: `测出「${typeTitle}」！你也来茅山趣测看看是什么结果 ☯️`,
      imageUrl: this.data.sharePosterUrl || ''
    };
  }
});