Page({
  data: {
    statusBarHeight: 44,
    logs: [
      { type: 'safe', tag: '合规', desc: '全局删除所有"AI"字样，改为"智能"/"深度"/"系统"，通过微信审核合规要求' },
      { type: 'safe', tag: '合规', desc: '敏感词清理：算命→预言/运势，驱邪→守护，仙师→道长，算命"→"+
        '预言，天机→意蕴，符咒→守' },
      { type: 'fix', tag: '修复', desc: 'album.wxml wx:else" 语法错误（多余双引号导致编译失败）' },
      { type: 'fix', tag: '修复', desc: 'about.wxss 首行乱码字符导致WXSS编译错误' },
      { type: 'fix', tag: '修复', desc: '首页 overflow:hidden 裁剪 fixed 底部导航和音乐浮窗' },
      { type: 'new', tag: '新增', desc: '首页新增连续修仙天数标签、图鉴进度条、3个精选测试入口' },
      { type: 'new', tag: '新增', desc: '首页新增"全部道法"折叠区，展示13种测试入口' },
      { type: 'new', tag: '新增', desc: '版本更新日志页面（本页），"我的"→版本更新可查看' },
      { type: 'imp', tag: '优化', desc: '配色统一为宣纸暖白 #F5F0E8，全页面风格一致' },
      { type: 'imp', tag: '优化', desc: '底部导航4项常驻（次数/探索/图鉴/我的），使用全局 bottom-nav 组件' },
      { type: 'imp', tag: '优化', desc: '每日次数从5次改为7次，30分钟恢复1次' },
      { type: 'imp', tag: '优化', desc: '"我的"页重写：8大板块茅山文化内容，窄滚动窗口+底部固定法律信息' },
      { type: 'imp', tag: '优化', desc: '图鉴仪式改为"点蚊香"风格（蚊搓摇验读），替换宗教敏感元素' },
      { type: 'imp', tag: '优化', desc: '结果页添加稀有度百分比显示（全服仅X%）和转发截图按钮' },
      { type: 'new', tag: '新增', desc: '音乐浮窗组件部署到首页/图鉴/结果/我的/导览/冒险/答题/旅程页面' },
      { type: 'fix', tag: '修复', desc: '隐私弹窗时音乐静音，同意后自动播放，合规处理' },
      { type: 'fix', tag: '修复', desc: '关闭《project.private.config.json》热重载(compileHotReLoad=false)，防止文件被覆盖丢失' },
    ]
  },

  onLoad() {
    const winInfo = wx.getWindowInfo();
    this.setData({ statusBarHeight: winInfo.statusBarHeight || 44 });
  },

  goBack() {
    wx.navigateBack({ delta: 1 });
  }
});