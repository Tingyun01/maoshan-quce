// ============================================================
// 测试卡片背景图映射（AI生成图）
// 通过 image-map.js 统一管理，文件名: resized-xxx.jpg
// ============================================================
const imageMap = require('./image-map');

module.exports = {
  // 主测试背景图（从 image-map 自动获取）
  cardBackgrounds: imageMap.getAllTestBgs(),

  // 获取指定测试的背景图URL
  getBackground(testId) {
    return imageMap.getTestBg(testId) || '';
  }
};
