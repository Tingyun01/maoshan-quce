const POSTER_IMAGES = require('../../config/poster-images');
const { resolveCloudUrl } = require('../../utils/cloud-image');

Component({
  properties: {
    testId: { type: String, value: '' },
    type: { type: String, value: '' },
    typeTitle: { type: String, value: '' },
    typeSummary: { type: String, value: '' },
    rank: { type: String, value: '' },
    rarity: { type: String, value: '' },
    tagline: { type: String, value: '' }
  },

  methods: {
    /** 生成分享图片（返回临时文件路径） */
    generate() {
      const that = this;
      return new Promise((resolve) => {
        const query = this.createSelectorQuery();
        query.select('#shareCardCanvas').fields({ node: true, size: true }).exec((res) => {
          if (!res || !res[0]) { resolve(''); return; }
          const canvas = res[0].node;
          const ctx = canvas.getContext('2d');
          const dpr = wx.getWindowInfo().pixelRatio || 2;
          const w = 540, h = 720;
          canvas.width = w * dpr;
          canvas.height = h * dpr;
          ctx.scale(dpr, dpr);

          const drawPoster = (hasBgImage) => {
            if (!hasBgImage) {
              const bgGrad = ctx.createLinearGradient(0, 0, 0, h);
              bgGrad.addColorStop(0, '#3A2A3A');
              bgGrad.addColorStop(0.5, '#2A1A2A');
              bgGrad.addColorStop(1, '#3A2A3A');
              ctx.fillStyle = bgGrad;
              ctx.fillRect(0, 0, w, h);
            }

            // 底部渐变遮罩
            const overlayGrad = ctx.createLinearGradient(0, h * 0.35, 0, h);
            overlayGrad.addColorStop(0, 'rgba(0,0,0,0)');
            overlayGrad.addColorStop(0.35, 'rgba(0,0,0,0.35)');
            overlayGrad.addColorStop(0.7, 'rgba(0,0,0,0.65)');
            overlayGrad.addColorStop(1, 'rgba(0,0,0,0.82)');
            ctx.fillStyle = overlayGrad;
            ctx.fillRect(0, h * 0.35, w, h * 0.65);

            const topGrad = ctx.createLinearGradient(0, 0, 0, 80);
            topGrad.addColorStop(0, 'rgba(0,0,0,0.55)');
            topGrad.addColorStop(1, 'rgba(0,0,0,0)');
            ctx.fillStyle = topGrad;
            ctx.fillRect(0, 0, w, 80);

            ctx.strokeStyle = 'rgba(232,168,124,0.25)';
            ctx.lineWidth = 2;
            ctx.strokeRect(8, 8, w - 16, h - 16);

            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';

            // 品牌标题
            ctx.shadowColor = 'rgba(0,0,0,0.6)';
            ctx.shadowBlur = 8;
            ctx.fillStyle = '#E8A87C';
            ctx.font = 'bold 32px sans-serif';
            ctx.fillText('茅山趣测', w / 2, 46);
            ctx.shadowColor = 'transparent';
            ctx.shadowBlur = 0;

            ctx.fillStyle = 'rgba(232,168,124,0.4)';
            ctx.fillRect(w / 2 - 28, 70, 56, 1.5);

            // 标题（去掉emoji以便canvas渲染）
            const displayTitle = that.properties.typeTitle.replace(/[\u{1F000}-\u{1FFFF}]|[\u{2600}-\u{27BF}]|[\u{1F300}-\u{1F5FF}]|[\u{1F600}-\u{1F64F}]|[\u{1F680}-\u{1F6FF}]|[\u{1F900}-\u{1F9FF}]/gu, '').trim();
            ctx.shadowColor = 'rgba(0,0,0,0.7)';
            ctx.shadowBlur = 12;
            ctx.fillStyle = '#FFD700';
            ctx.font = 'bold 36px sans-serif';
            ctx.fillText(displayTitle, w / 2, 128);
            ctx.shadowColor = 'transparent';
            ctx.shadowBlur = 0;

            let nextY = 170;

            if (that.properties.rank) {
              ctx.fillStyle = '#E8A87C';
              ctx.font = 'bold 20px sans-serif';
              ctx.fillText(that.properties.rank, w / 2, nextY);
              nextY += 36;
            }

            if (that.properties.rarity) {
              // 金色圆角标签背景 — 和海报保持一致
              const rText = that.properties.rarity;
              ctx.font = '18px sans-serif';
              const rW = ctx.measureText(rText).width + 36;
              const rx = w / 2 - rW / 2, ry = nextY - 14, rw = rW, rh = 30, rr = 15;
              ctx.fillStyle = 'rgba(0,0,0,0.4)';
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
              ctx.fillStyle = 'rgba(255,215,0,0.85)';
              ctx.fillText(rText, w / 2, nextY + 2);
              nextY += 48;
            }

            if (that.properties.tagline) {
              ctx.fillStyle = '#FAF6F2';
              ctx.font = '22px sans-serif';
              ctx.shadowColor = 'rgba(0,0,0,0.5)';
              ctx.shadowBlur = 6;
              const maxW = 440;
              let line = '';
              for (let c of that.properties.tagline) {
                const test = line + c;
                if (ctx.measureText(test).width > maxW) {
                  ctx.fillText(line.trim(), w / 2, nextY);
                  line = c;
                  nextY += 34;
                } else {
                  line = test;
                }
              }
              if (line) { ctx.fillText(line.trim(), w / 2, nextY); nextY += 34; }
              ctx.shadowColor = 'transparent';
              ctx.shadowBlur = 0;
            }

            if (that.properties.typeSummary) {
              ctx.fillStyle = 'rgba(255,255,255,0.75)';
              ctx.font = '18px sans-serif';
              const sumMaxW = 440;
              let sumLine = '';
              for (let c of that.properties.typeSummary) {
                const test = sumLine + c;
                if (ctx.measureText(test).width > sumMaxW) {
                  ctx.fillText(sumLine.trim(), w / 2, nextY);
                  sumLine = c;
                  nextY += 30;
                } else {
                  sumLine = test;
                }
              }
              if (sumLine) { ctx.fillText(sumLine.trim(), w / 2, nextY); }
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

            // 底部CTA
            const ctaY = h - 85;
            const crx = w / 2 - 160, cry = ctaY - 18, crw = 320, crh = 44, crr = 22;
            ctx.fillStyle = 'rgba(0,0,0,0.3)';
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

            ctx.fillStyle = '#FFD700';
            ctx.font = 'bold 22px sans-serif';
            ctx.fillText('长按扫码 · 测测你是什么料', w / 2, ctaY + 4);

            // slogan
            ctx.fillStyle = 'rgba(255,215,0,0.45)';
            ctx.font = '18px sans-serif';
            ctx.fillText('遇事不决 茅山一测', w / 2, h - 52);

            // 底部小字 — 免责（小字风）
            ctx.fillStyle = 'rgba(255,255,255,0.2)';
            ctx.font = '12px sans-serif';
            ctx.fillText('*本服务为趣味娱乐工具 · 测试结果仅供娱乐', w / 2, h - 28);

            wx.canvasToTempFilePath({
              canvas,
              fileType: 'jpg',
              quality: 0.92,
              success: (res) => resolve(res.tempFilePath),
              fail: () => resolve('')
            });
          };

          // 尝试背景图（cloud://需先转tempUrl）
          const bgPath = that._getBgPath();
          resolveCloudUrl(bgPath).then(resolvedUrl => {
            if (resolvedUrl) {
              const img = canvas.createImage();
              img.onload = () => {
                ctx.drawImage(img, 0, 0, w, h);
                drawPoster(true);
              };
              img.onerror = () => drawPoster(false);
              img.src = resolvedUrl;
            } else {
              drawPoster(false);
            }
          }).catch(() => drawPoster(false));
        });
      });
    },

    _getBgPath() {
      const map = POSTER_IMAGES[this.properties.testId];
      if (!map) return null;
      return map[this.properties.type] || null;
    }
  }
});