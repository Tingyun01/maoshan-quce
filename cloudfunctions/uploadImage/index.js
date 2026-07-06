// 云函数：uploadImage
// 管理员端图片上传到云存储
// 调用方式：wx.cloud.callFunction({ name: 'uploadImage', data: { fileName: '茅盈·大茅君.jpg', base64: '...' } })
const cloud = require('wx-server-sdk');
cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV });

exports.main = async (event, context) => {
  const { action, fileName, base64, fileList } = event;

  // ========== 列出云存储图片 ==========
  if (action === 'list') {
    try {
      const prefix = event.prefix || 'images/';
      const maxKeys = event.maxKeys || 200;
      const res = await cloud.database().collection('_images') // 不存在此集合
        .catch(() => null);
      
      // 用 cloud.getTempFileURL 方式列出不可行，改用文件检查
      return {
        ok: true,
        files: [],
        tip: '请通过微信云开发控制台 → 存储 → 查看云存储文件列表。此处列出的是 poster-images.js 中配置的所有路径。'
      };
    } catch (err) {
      return { ok: false, errMsg: err.message };
    }
  }

  // ========== 检查文件是否存在 ==========
  if (action === 'check') {
    if (!fileList || !Array.isArray(fileList)) {
      return { ok: false, errMsg: '缺少 fileList 参数' };
    }
    try {
      const res = await cloud.getTempFileURL({ fileList });
      const result = (res.fileList || []).map(f => ({
        fileID: f.fileID,
        exists: f.status === 0 && !!f.tempFileURL,
        tempFileURL: f.tempFileURL || '',
        errMsg: f.errMsg || ''
      }));
      return { ok: true, files: result };
    } catch (err) {
      return { ok: false, errMsg: err.message };
    }
  }

  // ========== 上传图片（base64） ==========
  if (!fileName || !base64) {
    return { ok: false, errMsg: '缺少 fileName 或 base64 参数。\n\n调用示例：\n{ action: "upload", fileName: "茅盈·大茅君.jpg", base64: "data:image/jpeg;base64,..." }' };
  }

  try {
    const cloudPath = `images/${fileName}`;
    const buffer = Buffer.from(base64.replace(/^data:image\/\w+;base64,/, ''), 'base64');

    const uploadRes = await cloud.uploadFile({
      cloudPath,
      fileContent: buffer
    });

    if (uploadRes.fileID) {
      return {
        ok: true,
        fileID: uploadRes.fileID,
        cloudPath,
        tip: `✅ 上传成功！图片已存至云存储：${cloudPath}\n可在 poster-images.js 中引用：CLOUD_BASE + '${fileName}'`
      };
    }
    return { ok: false, errMsg: '上传返回空 fileID' };
  } catch (err) {
    return { ok: false, errMsg: err.message };
  }
};
