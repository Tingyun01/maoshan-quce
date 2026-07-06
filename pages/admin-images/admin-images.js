// 图片管理诊断页 — 检查云存储图片完整性
const posterImages = require('../../config/poster-images');
const app = getApp();
let allCheckPaths = [];

Page({
  data: {
    checking: true,
    results: [],      // { name, testId, type, exists, url, errMsg }
    totalCount: 0,
    existCount: 0,
    missingCount: 0,
    missingList: [],  // 仅缺失的
    showMissingOnly: false
  },

  onLoad() {
    this.buildCheckList();
    this.runCheck();
  },

  // 从 poster-images.js 提取所有 cloud:// 路径
  buildCheckList() {
    const seen = {};
    allCheckPaths = [];

    Object.keys(posterImages).forEach(testId => {
      const group = posterImages[testId];
      Object.keys(group).forEach(type => {
        const path = group[type];
        if (path && path.startsWith('cloud://')) {
          if (!seen[path]) {
            seen[path] = [];
          }
          seen[path].push({ testId, type });
        }
      });
    });

    // 转换为列表
    Object.keys(seen).forEach(path => {
      const uses = seen[path];
      allCheckPaths.push({
        fileID: path,
        fileName: path.split('/').pop(),
        uses
      });
    });
  },

  // 批量检查文件是否存在
  runCheck() {
    this.setData({ checking: true, results: [] });

    const checkBatch = (i) => {
      if (i >= allCheckPaths.length) {
        this.finishCheck();
        return;
      }

      const chunk = allCheckPaths.slice(i, i + 50);
      wx.cloud.callFunction({
        name: 'getFileUrls',
        data: { fileList: chunk.map(c => c.fileID) }
      }).then(res => {
        if (res.result && res.result.ok) {
          const results = [];
          (res.result.files || []).forEach((f, idx) => {
            const info = chunk[idx];
            const exists = f.status === 0 && !!f.tempFileURL;
            const entry = {
              fileName: info.fileName,
              testId: (info.uses[0] || {}).testId || '?',
              type: (info.uses[0] || {}).type || '?',
              uses: info.uses.map(u => u.testId + '.' + u.type).join(', '),
              exists,
              url: f.tempFileURL || '',
              errMsg: f.errMsg || ''
            };
            results.push(entry);
          });

          this.setData({ results: [...this.data.results, ...results] });
        }
        checkBatch(i + 50);
      }).catch(err => {
        console.error('[诊断] 批次失败', err);
        checkBatch(i + 50);
      });
    };

    checkBatch(0);
  },

  finishCheck() {
    const results = this.data.results;
    const existCount = results.filter(r => r.exists).length;
    const missingCount = results.filter(r => !r.exists).length;
    const missingList = results.filter(r => !r.exists);

    this.setData({
      checking: false,
      totalCount: results.length,
      existCount,
      missingCount,
      missingList
    });

    if (missingCount === 0) {
      wx.showToast({ title: '🎉 所有图片都在！', icon: 'none' });
    } else {
      wx.showToast({ title: `❌ ${missingCount} 张图片缺失`, icon: 'none' });
    }
  },

  toggleFilter() {
    this.setData({ showMissingOnly: !this.data.showMissingOnly });
  },

  // 复制缺失文件列表
  copyMissingList() {
    const names = this.data.missingList.map(r => r.fileName).join('\n');
    wx.setClipboardData({
      data: names,
      success: () => wx.showToast({ title: '已复制缺失文件名', icon: 'none' })
    });
  },

  goUpload() {
    wx.showModal({
      title: '如何上传图片',
      content: '1. 微信开发者工具 → 顶部「云开发」按钮\n2. 进入「存储」标签\n3. 点击「上传文件」\n4. 选择本地图片文件\n5. 上传到 images/ 文件夹\n6. 回来点「重新检测」',
      showCancel: false,
      confirmText: '知道了'
    });
  },

  reCheck() {
    this.setData({ results: [], missingList: [] });
    this.runCheck();
  },

  // 通过云函数上传（需要先在手机上选择图片）
  pickAndUpload() {
    wx.chooseImage({
      count: 1,
      sizeType: ['compressed'],
      sourceType: ['album'],
      success: (chooseRes) => {
        const tempPath = chooseRes.tempFilePaths[0];
        wx.showModal({
          title: '输入文件名',
          editable: true,
          placeholderText: '例如：茅盈·大茅君.jpg',
          content: '请输入云存储中的文件名（含后缀）',
          success: (modalRes) => {
            if (!modalRes.confirm || !modalRes.content) return;

            const fileName = modalRes.content.trim();
            wx.showLoading({ title: '上传中...' });

            // 读取为 base64
            const fs = wx.getFileSystemManager();
            fs.readFile({
              filePath: tempPath,
              encoding: 'base64',
              success: (fileRes) => {
                wx.cloud.callFunction({
                  name: 'uploadImage',
                  data: {
                    action: 'upload',
                    fileName,
                    base64: fileRes.data
                  }
                }).then(res => {
                  wx.hideLoading();
                  if (res.result && res.result.ok) {
                    wx.showToast({ title: '上传成功！', icon: 'success' });
                    // 手动更新缓存
                    this.reCheck();
                  } else {
                    wx.showToast({ title: '上传失败: ' + (res.result.errMsg || ''), icon: 'none', duration: 3000 });
                  }
                }).catch(err => {
                  wx.hideLoading();
                  wx.showToast({ title: '调用失败: ' + err.message, icon: 'none', duration: 3000 });
                });
              },
              fail: (err) => {
                wx.hideLoading();
                wx.showToast({ title: '读取文件失败', icon: 'none' });
              }
            });
          }
        });
      }
    });
  },

  // 从缺失列表选择一个文件名上传
  uploadMissing() {
    if (this.data.missingList.length === 0) {
      wx.showToast({ title: '没有缺失文件', icon: 'none' });
      return;
    }

    const items = this.data.missingList.map(r => r.fileName);
    wx.showActionSheet({
      itemList: items,
      success: (res) => {
        const name = items[res.tapIndex];
        this.pickFileFor(name);
      }
    });
  },

  pickFileFor(fileName) {
    wx.chooseImage({
      count: 1,
      sizeType: ['compressed'],
      sourceType: ['album'],
      success: (chooseRes) => {
        const tempPath = chooseRes.tempFilePaths[0];
        wx.showLoading({ title: `上传 ${fileName}...` });

        const fs = wx.getFileSystemManager();
        fs.readFile({
          filePath: tempPath,
          encoding: 'base64',
          success: (fileRes) => {
            wx.cloud.callFunction({
              name: 'uploadImage',
              data: { action: 'upload', fileName, base64: fileRes.data }
            }).then(res => {
              wx.hideLoading();
              if (res.result && res.result.ok) {
                wx.showToast({ title: `${fileName} 上传成功！`, icon: 'success' });
                this.reCheck();
              } else {
                wx.showToast({ title: '失败: ' + (res.result.errMsg || ''), icon: 'none', duration: 3000 });
              }
            }).catch(err => {
              wx.hideLoading();
              wx.showToast({ title: err.message, icon: 'none', duration: 3000 });
            });
          },
          fail: () => {
            wx.hideLoading();
            wx.showToast({ title: '读取失败', icon: 'none' });
          }
        });
      }
    });
  },

  goBack() { wx.navigateBack(); }
});
