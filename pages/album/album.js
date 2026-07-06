/**
 * album.js — 图鉴收藏页面
 * 展示所有可收藏的测试结果，按测试分组
 * 已解锁/未解锁状态一目了然
 */
const app = getApp();
const collectionMgr = require('../../utils/collection-manager');
const { resolveCloudUrl } = require('../../utils/cloud-image');
const audio = require('../../utils/audio-engine');

// 道德经金句库（按场景分类）
const DAOJING_QUOTES = {
  fortune: [
    '祸兮福之所倚，福兮祸之所伏',
    '知足不辱，知止不殆',
    '天道无亲，常与善人'
  ],
  wisdom: [
    '知人者智，自知者明',
    '上善若水，水善利万物而不争',
    '大方无隅，大器晚成'
  ],
  peace: [
    '致虚极，守静笃',
    '道法自然',
    '见素抱朴，少私寡欲'
  ],
  strength: [
    '千里之行，始于足下',
    '天下难事，必作于易',
    '胜人者有力，自胜者强'
  ]
};

// 茅山签文（21条）
const LOT_ITEMS = [
  { text: '上上签·紫气东来', meaning: '万事顺遂，贵人相助，宜把握良机' },
  { text: '上签·云开见日', meaning: '迷雾散去，前路渐明，坚持即有转机' },
  { text: '上签·清风徐来', meaning: '心静自然凉，烦恼随风散，宜静不宜动' },
  { text: '上签·月朗星稀', meaning: '心明如镜，前程似锦，宜大胆前行' },
  { text: '中上签·山高水长', meaning: '路虽远行则将至，事虽难做则必成' },
  { text: '中签·柳暗花明', meaning: '看似绝路，实则转机在前，再坚持一下' },
  { text: '中签·顺其自然', meaning: '强求不如静待，该来的自然会来' },
  { text: '中签·厚积薄发', meaning: '积蓄力量，耐心等待，时机未到' },
  { text: '中签·滴水穿石', meaning: '持之以恒，终有回响，不要放弃' },
  { text: '中下签·雾锁山腰', meaning: '暂时迷茫，不妨停一停，看清再走' },
  { text: '中下签·静待天晴', meaning: '风雨终将过去，耐心是现在最好的选择' },
  { text: '下签·逆水行舟', meaning: '不进则退，需要调整策略，不可蛮干' },
  { text: '下签·曲径通幽', meaning: '走弯路未必是坏事，也许能看到不一样的风景' },
  { text: '下下签·塞翁失马', meaning: '一时的失去未必是坏事，焉知非福' },
  { text: '下下签·苦尽甘来', meaning: '黎明前的黑暗最深沉，但天快亮了' }
];

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
    // 抽签
    showLotResult: false,
    lotResult: null,
    daojing: ''
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
      statusBarHeight: winInfo.statusBarHeight || 44,
      stats: collectionMgr.getStats(),
      groups: collectionMgr.getGroupedCatalog()
    });
  },

  onShow() {
    // 每次显示刷新数据（从结果页返回时可能新增收藏）
    this.setData({
      stats: collectionMgr.getStats(),
      groups: collectionMgr.getGroupedCatalog()
    });
  },

  /** 点击收藏卡查看大图详情 */
  onItemTap(e) {
    const key = e.currentTarget.dataset.key;
    const groups = this.data.groups;
    for (const g of groups) {
      const item = g.items.find(i => i.key === key);
      if (item) {
        if (!item.unlocked) {
          wx.showToast({ title: '还没解锁这个结果呢~', icon: 'none' });
          return;
        }
        audio.playClick();
        // 随机选一句道德经
        const allQuotes = Object.values(DAOJING_QUOTES).flat();
        const daojing = allQuotes[Math.floor(Math.random() * allQuotes.length)];
        // 异步加载图片
        // 优先使用新版卡片图，没有则用海报图
        const imgPath = item.cardImage || item.imagePath;
        this.setData({ showDetail: true, detailItem: item, daojing });
        resolveCloudUrl(imgPath).then(url => {
          this.setData({ detailImageUrl: url || '' });
        }).catch(() => {});
        return;
      }
    }
  },

  closeDetail() {
    this.setData({ showDetail: false, detailItem: null, detailImageUrl: '', showLotResult: false, lotResult: null });
  },

  /** 抽一支茅山签 */
  drawLot() {
    audio.playReveal();
    const idx = Math.floor(Math.random() * LOT_ITEMS.length);
    const lot = LOT_ITEMS[idx];
    this.setData({ showLotResult: true, lotResult: lot });
  },

  closeLot() {
    this.setData({ showLotResult: false, lotResult: null });
  },

  goBack() {
    wx.navigateBack();
  }
});
