/**
 * nav-helper.js — 安全导航工具
 * 
 * 所有页面跳转统一经过此模块，确保：
 * 1. 跳转失败时有 toast 提示
 * 2. 页面栈满时自动 redirectTo 降级
 * 3. navigateBack 没有上一页时自动跳首页
 */

/**
 * 安全 navigateTo（失败时 toast 提示）
 */
function navigateTo(url, options = {}) {
  const extra = typeof url === 'string' ? { url } : url;
  wx.navigateTo({
    ...extra,
    fail: (err) => {
      console.warn('[Nav] navigateTo 失败:', url, err.errMsg);
      // 页面栈满时尝试 redirectTo
      if (err.errMsg && err.errMsg.includes('limit')) {
        wx.redirectTo({ ...extra, fail: () => {
          wx.showToast({ title: '页面跳转失败', icon: 'none' });
        }});
        return;
      }
      wx.showToast({ title: '页面跳转失败', icon: 'none' });
    }
  });
}

/**
 * 安全 redirectTo
 */
function redirectTo(url, options = {}) {
  const extra = typeof url === 'string' ? { url } : url;
  wx.redirectTo({
    ...extra,
    fail: () => {
      wx.showToast({ title: '页面跳转失败', icon: 'none' });
    }
  });
}

/**
 * 安全 reLaunch
 */
function reLaunch(url, options = {}) {
  const extra = typeof url === 'string' ? { url } : url;
  wx.reLaunch({
    ...extra,
    fail: () => {
      wx.showToast({ title: '返回首页失败', icon: 'none' });
    }
  });
}

/**
 * 安全 navigateBack（没有上一页时跳首页）
 */
function navigateBack(delta = 1) {
  wx.navigateBack({
    delta,
    fail: () => {
      wx.reLaunch({ url: '/pages/index/index' });
    }
  });
}

/**
 * 安全 switchTab（用于 tab 页切换）
 */
function switchTab(url) {
  wx.switchTab({
    url,
    fail: () => {
      wx.showToast({ title: '页面切换失败', icon: 'none' });
    }
  });
}

module.exports = {
  navigateTo,
  redirectTo,
  reLaunch,
  navigateBack,
  switchTab
};
