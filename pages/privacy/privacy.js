const app = getApp();
const legalCfg = require('../../config/legal-config');

Page({
  data: { legal: legalCfg },
  onLoad() { },
  goBack() { wx.navigateBack(); }
});
