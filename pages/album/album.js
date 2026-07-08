/**
 * album.js — 图鉴收藏页面
 * 完整仪式：焚香三炷 → 搓手三次 → 老虎机选箴言 → 仙师解读
 */
const app = getApp();
const collectionMgr = require('../../utils/collection-manager');
const { resolveCloudUrl } = require('../../utils/cloud-image');
const audio = require('../../utils/audio-engine');
const analytics = require('../../utils/analytics');
const LOT_ITEMS = require('../../config/maoshan-lot');

// 锁定卡片诱饵数据（内联，避免外部文件被覆盖）
const LOCK_TEASERS = {
  'immortal.caishen': { icon: '🧧', name: '财', dynasty: '唐', hint: '招财进宝' },
  'immortal.taibai': { icon: '⭐', name: '白', dynasty: '唐', hint: '文曲星下凡' },
  'immortal.tudi': { icon: '🏠', name: '地', dynasty: '上古', hint: '土地公' },
  'immortal.zhongkui': { icon: '⚔️', name: '馗', dynasty: '唐', hint: '斩妖除魔' },
  'immortal.nezha': { icon: '🔥', name: '吒', dynasty: '商', hint: '莲花化身' },
  'immortal.yueLao': { icon: '❤️', name: '月', dynasty: '唐', hint: '千里姻缘' },
  'past_life.maoying': { icon: '⛰️', name: '茅', dynasty: '汉', hint: '三茅君之首' },
  'past_life.gehong': { icon: '📿', name: '葛', dynasty: '晋', hint: '抱朴子' },
  'past_life.hongjing': { icon: '🏔️', name: '陶', dynasty: '南北朝', hint: '山中宰相' },
  'past_life.wangyuan': { icon: '☯️', name: '王', dynasty: '隋', hint: '守道真人' },
  'guardian_beast.dragon': { icon: '🐉', name: '龙', dynasty: '上古', hint: '神龙降世' },
  'guardian_beast.phoenix': { icon: '🔥', name: '凤', dynasty: '上古', hint: '涅槃重生' },
  'guardian_beast.qilin': { icon: '🦌', name: '麟', dynasty: '上古', hint: '祥瑞之兽' },
  'guardian_beast.tiger': { icon: '🐅', name: '虎', dynasty: '上古', hint: '白虎战神' },
  'ancient_id.general': { icon: '⚔️', name: '将', dynasty: '汉', hint: '金戈铁马' },
  'ancient_id.merchant': { icon: '💰', name: '商', dynasty: '宋', hint: '富甲一方' },
  'ancient_id.scholar': { icon: '📖', name: '儒', dynasty: '唐', hint: '学富五车' },
  'ancient_id.hero': { icon: '🗡️', name: '侠', dynasty: '明', hint: '仗剑天涯' },
  'immortal_cluster.sword_immortal': { icon: '🗡️', name: '剑', dynasty: '上古', hint: '御剑飞行' },
  'immortal_cluster.talisman_master': { icon: '✨', name: '符', dynasty: '南北朝', hint: '符箓大师' },
  'immortal_cluster.free_immortal': { icon: '☁️', name: '仙', dynasty: '上古', hint: '逍遥真仙' },
  'immortal_cluster.spirit_tamer': { icon: '🦊', name: '灵', dynasty: '上古', hint: '御灵仙师' },
  'spiritual_root.tianling': { icon: '💎', name: '天', dynasty: '上古', hint: '天灵根' },
  'spiritual_root.dipin': { icon: '🌿', name: '地', dynasty: '上古', hint: '地灵根' },
  'spiritual_root.bianyiling': { icon: '⚡', name: '变', dynasty: '上古', hint: '变异灵根' },
  'spiritual_root.wuling': { icon: '🌫️', name: '无', dynasty: '上古', hint: '另辟蹊径' },
  'hidden_talent.fly': { icon: '🦅', name: '飞', dynasty: '上古', hint: '翱翔九天' },
  'hidden_talent.foresee': { icon: '🔮', name: '预', dynasty: '上古', hint: '洞察天机' },
  'hidden_talent.heal': { icon: '💫', name: '愈', dynasty: '上古', hint: '妙手回春' },
  'hidden_talent.strength': { icon: '💪', name: '力', dynasty: '上古', hint: '神力天生' },
  'love_portrait.rationalist': { icon: '🧠', name: '理', dynasty: '现代', hint: '理性恋爱' },
  'love_portrait.romantic': { icon: '🌹', name: '浪', dynasty: '现代', hint: '浪漫至上' },
  'love_portrait.guardian': { icon: '🛡️', name: '守', dynasty: '现代', hint: '默默守护' },
  'love_portrait.gentle': { icon: '☁️', name: '温', dynasty: '现代', hint: '温柔如水' },
  'wu_xing.jin': { icon: '⚜️', name: '金', dynasty: '上古', hint: '锐不可当' },
  'wu_xing.mu': { icon: '🌲', name: '木', dynasty: '上古', hint: '生机盎然' },
  'wu_xing.shui': { icon: '💧', name: '水', dynasty: '上古', hint: '以柔克刚' },
  'wu_xing.huo': { icon: '🔥', name: '火', dynasty: '上古', hint: '热情如火' },
  'wu_xing.tu': { icon: '⛰️', name: '土', dynasty: '上古', hint: '稳如泰山' },
  'animal_personality.lion': { icon: '🦁', name: '狮', dynasty: '上古', hint: '霸气侧漏' },
  'animal_personality.wolf': { icon: '🐺', name: '狼', dynasty: '上古', hint: '孤狼之魂' },
  'animal_personality.dolphin': { icon: '🐬', name: '豚', dynasty: '上古', hint: '聪明伶俐' },
  'animal_personality.cat': { icon: '🐱', name: '猫', dynasty: '上古', hint: '神秘莫测' },
  'animal_personality.bear': { icon: '🐻', name: '熊', dynasty: '上古', hint: '可靠踏实' },
  'animal_personality.deer': { icon: '🦌', name: '鹿', dynasty: '上古', hint: '优雅灵动' },
  'stress_test.good': { icon: '☀️', name: '晴', dynasty: '现代', hint: '云淡风轻' },
  'stress_test.mild': { icon: '⛅', name: '微', dynasty: '现代', hint: '午后微云' },
  'stress_test.moderate': { icon: '☁️', name: '阴', dynasty: '现代', hint: '乌云渐浓' },
  'stress_test.high': { icon: '⛈️', name: '雨', dynasty: '现代', hint: '暴雨将至' },
  'xiuxian.tian': { icon: '👑', name: '天', dynasty: '上古', hint: '天资卓绝' },
  'xiuxian.di': { icon: '💎', name: '地', dynasty: '上古', hint: '根基稳固' },
  'xiuxian.fan': { icon: '🌿', name: '凡', dynasty: '上古', hint: '勤能补拙' },
  'xiuxian.za': { icon: '🌫️', name: '杂', dynasty: '上古', hint: '大器晚成' },
  'mbti_simple.INTJ': { icon: '🧠', name: '建', dynasty: '现代', hint: '战略大师' },
  'mbti_simple.INTP': { icon: '💡', name: '逻', dynasty: '现代', hint: '思维缜密' },
  'mbti_simple.ENTJ': { icon: '👑', name: '指', dynasty: '现代', hint: '天生领袖' },
  'mbti_simple.ENFP': { icon: '🌟', name: '竞', dynasty: '现代', hint: '热情似火' },
  'mbti_simple.ISTJ': { icon: '📋', name: '物', dynasty: '现代', hint: '严谨可靠' },
  'mbti_simple.ISFJ': { icon: '🛡️', name: '守', dynasty: '现代', hint: '默默付出' },
  'mbti_simple.ESTJ': { icon: '💼', name: '总', dynasty: '现代', hint: '雷厉风行' },
  'mbti_simple.ESFJ': { icon: '💝', name: '执', dynasty: '现代', hint: '热心助人' },
  'mbti_simple.ISTP': { icon: '🔧', name: '鉴', dynasty: '现代', hint: '务实冷静' },
  'mbti_simple.ISFP': { icon: '🎨', name: '探', dynasty: '现代', hint: '艺术气质' },
  'mbti_simple.ESTP': { icon: '⚡', name: '企', dynasty: '现代', hint: '行动派' },
  'mbti_simple.ESFP': { icon: '🎭', name: '表', dynasty: '现代', hint: '天生焦点' },
  'mbti_simple.INFJ': { icon: '🔮', name: '提', dynasty: '现代', hint: '理想主义' },
  'mbti_simple.INFP': { icon: '🌙', name: '调', dynasty: '现代', hint: '温柔内心' },
  'mbti_simple.ENFJ': { icon: '☀️', name: '主', dynasty: '现代', hint: ' charisma' },
  'mbti_simple.ENTP': { icon: '💬', name: '辩', dynasty: '现代', hint: '机智幽默' },
};

function getDefaultTeaser() { return { icon: '❓', name: '秘', dynasty: '上古', hint: '未知之境' }; }

// 道德经金句库
const DAOJING_QUOTES = {
  fortune: ['祸兮福之所倚，福兮祸之所伏', '知足不辱，知止不殆', '天道无亲，常与善人'],
  wisdom: ['知人者智，自知者明', '上善若水，水善利万物而不争', '大方无隅，大器晚成'],
  peace: ['致虚极，守静笃', '道法自然', '见素抱朴，少私寡欲'],
  strength: ['千里之行，始于足下', '天下难事，必作于易', '胜人者有力，自胜者强']
};

Page({
  data: {
    themeClass: '',
    statusBarHeight: 44,
    groups: [],
    stats: { unlocked: 0, total: 0, percent: 0 },
    // 详情浮层
    showDetail: false,
    detailItem: null,
    detailImageUrl: '',
    daojing: '',
    // 仪式
    showRitual: false,
    ritualStep: 'incense',
    incenseLit: 0,
    rubCount: 0,
    slotSpinning: false,
    slotDisplay: '❓',
    slotTimer: null,
    zenResult: null,
    zenRandomAspect: '',
    alreadyShared: false,
    // 选中的测试key（用于仪式）
    _ritualKey: ''
  },

  _loadData() {
    const us = app.globalData.userSettings || {};
    const theme = us.theme || 'light', b = us.themeBrightness || 'medium';
    let tc = '';
    if (theme === 'light') tc += 'light-theme ';
    if (b && b !== 'medium') tc += 'bright-' + b + ' ';
    return tc.trim();
  },

  onLoad() {
    const tc = this._loadData();
    const winInfo = wx.getWindowInfo();
    const stats = collectionMgr.getStats();
    let groups = collectionMgr.getGroupedCatalog();
    // 为锁定卡片注入 teaser 数据
    groups = this._injectTeasers(groups);
    this.setData({
      themeClass: tc,
      statusBarHeight: winInfo.statusBarHeight || 44,
      stats,
      groups
    });
  },

  onShow() {
    let groups = collectionMgr.getGroupedCatalog();
    groups = this._injectTeasers(groups);
    this.setData({
      stats: collectionMgr.getStats(),
      groups
    });
  },

  _injectTeasers(groups) {
    groups.forEach(g => {
      g.items.forEach(i => {
        if (!i.unlocked) {
          i.teaser = LOCK_TEASERS[i.key] || getDefaultTeaser();
        } else {
          // 已解锁：异步加载缩略图
          this._loadThumb(i);
        }
      });
    });
    return groups;
  },

  _loadThumb(item) {
    const imgPath = item.cardImage || item.imagePath;
    if (imgPath) {
      resolveCloudUrl(imgPath).then(url => {
        if (url) {
          item.thumbUrl = url;
          // 更新数据 — 找到对应卡片刷新生效
          const groups = this.data.groups;
          for (const g of groups) {
            const found = g.items.find(x => x.key === item.key);
            if (found) { found.thumbUrl = url; break; }
          }
          this.setData({ groups });
        }
      }).catch(() => {});
    }
  },

  onUnload() {
    this._clearSlotTimer();
  },

  _clearSlotTimer() {
    if (this.data.slotTimer) {
      clearInterval(this.data.slotTimer);
      this.setData({ slotTimer: null });
    }
  },

  // ===== 卡片点击 =====
  onItemTap(e) {
    const key = e.currentTarget.dataset.key;
    const groups = this.data.groups;
    for (const g of groups) {
      const item = g.items.find(i => i.key === key);
      if (item) {
        if (!item.unlocked) {
          wx.showToast({ title: '完成对应测试即可解锁 🔓', icon: 'none' });
          return;
        }
        audio.playClick();
        const allQuotes = Object.values(DAOJING_QUOTES).flat();
        const daojing = allQuotes[Math.floor(Math.random() * allQuotes.length)];
        const imgPath = item.cardImage || item.imagePath;
        this.setData({ showDetail: true, detailItem: item, daojing, _ritualKey: key });
        resolveCloudUrl(imgPath).then(url => {
          this.setData({ detailImageUrl: url || '' });
        }).catch(() => {});
        return;
      }
    }
  },

  closeDetail() {
    this.setData({ showDetail: false, detailItem: null, detailImageUrl: '' });
  },

  // ===== 仪式：焚香 =====
  startIncense() {
    audio.playClick();
    this.setData({
      showRitual: true,
      ritualStep: 'incense',
      incenseLit: 0,
      rubCount: 0,
      zenResult: null,
      zenRandomAspect: '',
      slotDisplay: '❓'
    });
  },

  lightOneIncense() {
    const cur = this.data.incenseLit;
    if (cur < 3) {
      audio.playClick();
      const next = cur + 1;
      this.setData({ incenseLit: next });
      if (next >= 3) {
        setTimeout(() => {
          this.setData({ ritualStep: 'rub', rubCount: 0 });
        }, 600);
      }
    }
  },

  // ===== 仪式：搓手 =====
  doRub() {
    const cur = this.data.rubCount;
    if (cur < 3) {
      audio.playClick();
      const next = cur + 1;
      this.setData({ rubCount: next });
      wx.vibrateShort({ type: 'light' }).catch(() => {});
      if (next >= 3) {
        setTimeout(() => {
          this._startSlot();
        }, 500);
      }
    } else {
      this._startSlot();
    }
  },

  // ===== 仪式：老虎机选箴言 =====
  _startSlot() {
    this._clearSlotTimer();
    this.setData({ ritualStep: 'slot', slotSpinning: true, slotDisplay: '🎰' });
    // 随机快速轮换显示36则箴言标题
    const timer = setInterval(() => {
      const idx = Math.floor(Math.random() * LOT_ITEMS.length);
      const item = LOT_ITEMS[idx];
      this.setData({ slotDisplay: item.title + '\n' + item.type });
    }, 80);
    this.setData({ slotTimer: timer });
  },

  stopSlot() {
    if (this.data.slotSpinning) {
      // 停在当前显示的箴言上
      this._clearSlotTimer();
      this.setData({ slotSpinning: false });
      return;
    }
    // 揭晓箴言
    this._revealZen();
  },

  _revealZen() {
    // 从当前display解析或重新随机选
    const idx = Math.floor(Math.random() * LOT_ITEMS.length);
    const zen = LOT_ITEMS[idx];
    // 随机选一个aspect
    const aspects = zen.aspects || {};
    const aspectKeys = Object.keys(aspects);
    const randomAspect = aspectKeys.length > 0
      ? aspects[aspectKeys[Math.floor(Math.random() * aspectKeys.length)]]
      : '';
    this.setData({
      ritualStep: 'zen',
      zenResult: zen,
      zenRandomAspect: randomAspect
    });
    audio.playReveal();
    analytics.track('lot_draw', { type: zen.type, title: zen.title });
  },

  // ===== 关闭仪式 =====
  closeRitual() {
    this._clearSlotTimer();
    this.setData({
      showRitual: false,
      ritualStep: 'incense',
      incenseLit: 0,
      rubCount: 0,
      slotSpinning: false,
      zenResult: null,
      zenRandomAspect: ''
    });
  },

  // ===== 分享 =====
  goBack() {
    wx.navigateBack();
  },

  onShareAppMessage() {
    const zen = this.data.zenResult;
    if (zen) {
      return {
        title: `我抽中了「${zen.type}·${zen.title}」！遇事不决茅山一测 👉`,
        path: '/pages/index/index'
      };
    }
    return {
      title: '遇事不决茅山一测！趣味测试，随缘一测 👉',
      path: '/pages/index/index'
    };
  },

  onShareTimeline() {
    return { title: '茅山趣测——遇事不决，茅山一测！13种趣味测试等你来玩 ☯️' };
  }
});
