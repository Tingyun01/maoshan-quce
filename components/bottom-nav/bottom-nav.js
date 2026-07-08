/**
 * 全局底部导航栏组件
 * 在首页、探索、图鉴、我的 四个主页面常驻显示
 */
Component({
  properties: {
    current: { type: String, value: 'index' }
  },

  data: {
    tabs: [
      { key: 'index', icon: '🎯', label: '次数', page: 'pages/index/index' },
      { key: 'guide', icon: '🗺️', label: '探索', page: 'pages/guide/guide' },
      { key: 'album', icon: '📖', label: '图鉴', page: 'pages/album/album' },
      { key: 'about', icon: '☯️', label: '我的', page: 'pages/about/about' }
    ]
  },

  methods: {
    onTap(e) {
      const key = e.currentTarget.dataset.key;
      if (key === this.data.current) {
        // 点当前页：首页触发次数弹窗，其他页无操作
        if (key === 'index') {
          this.triggerEvent('hometap');
        }
        return;
      }
      const tab = this.data.tabs.find(t => t.key === key);
      if (!tab) return;

      wx.redirectTo({
        url: '/' + tab.page
      });
    }
  }
});
