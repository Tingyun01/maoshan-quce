// 云函数：getFileUrls
// 用管理员权限获取云存储文件的临时 HTTPS 链接
// 解决客户端直接调用 getTempFileURL 时 STORAGE_EXCEED_AUTHORITY 的问题
const cloud = require('wx-server-sdk');
cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV });

exports.main = async (event, context) => {
  const { fileList } = event;  // cloud:// 文件路径数组
  if (!fileList || !Array.isArray(fileList) || fileList.length === 0) {
    return { ok: false, errMsg: '缺少 fileList 参数' };
  }

  if (fileList.length > 50) {
    return { ok: false, errMsg: '单次最多 50 个文件' };
  }

  try {
    const res = await cloud.getTempFileURL({ fileList });
    return {
      ok: true,
      files: (res.fileList || []).map(f => ({
        fileID: f.fileID,
        tempFileURL: f.tempFileURL || '',
        status: f.status || 0,
        errMsg: f.errMsg || ''
      }))
    };
  } catch (err) {
    return { ok: false, errMsg: err.message || String(err) };
  }
};
