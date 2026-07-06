/**
 * theme-helper.js — 主题辅助工具
 * 负责动态修改微信原生组件（tabBar、导航栏）的颜色
 * 这些组件无法通过 CSS 变量控制，需要调用微信 API
 */

/** 根据当前主题设置原生 UI 颜色 */
function applyNativeTheme(theme) {
  if (theme === 'light') {
    // 浅色模式：tabBar + 导航栏改为浅色
    try {
      wx.setTabBarStyle({
        color: '#8C7F72',
        selectedColor: '#D4A574',
        backgroundColor: '#EDE7E0',
        borderStyle: 'white'
      });
    } catch (e) { console.warn('[Theme] setTabBarStyle:', e); }
    try {
      wx.setNavigationBarColor({
        frontColor: '#2C2418',
        backgroundColor: '#EDE7E0',
        animation: { duration: 300, timingFunc: 'easeInOut' }
      });
    } catch (e) { console.warn('[Theme] setNavigationBarColor:', e); }
  } else {
    // 深色模式：tabBar + 导航栏改为深色
    try {
      wx.setTabBarStyle({
        color: '#7A7090',
        selectedColor: '#E8C080',
        backgroundColor: '#0A1522',
        borderStyle: 'black'
      });
    } catch (e) { console.warn('[Theme] setTabBarStyle:', e); }
    try {
      wx.setNavigationBarColor({
        frontColor: '#F5F0EB',
        backgroundColor: '#0A1522',
        animation: { duration: 300, timingFunc: 'easeInOut' }
      });
    } catch (e) { console.warn('[Theme] setNavigationBarColor:', e); }
  }
}

module.exports = { applyNativeTheme };
