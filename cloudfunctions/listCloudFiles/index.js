// 云函数：listCloudFiles
// 列出云存储 /images/ 目录下所有文件，排查路径不匹配问题
const cloud = require('wx-server-sdk');
cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV });

exports.main = async (event, context) => {
  const prefix = event.prefix || 'images/';
  const maxLimit = 200;

  try {
    const db = cloud.database();
    // 注意：云存储没有直接 list API，需要通过云开发的存储 API
    // 这里我们批量获取已知文件列表来验证
    
    // 方法：获取环境下的所有文件（通过 downloadDirectory 无法直接实现）
    // 改用：逐个检查用户提供的候选文件列表
    const candidates = event.candidates || [];
    
    if (candidates.length > 0) {
      const batchSize = 50;
      const results = { found: [], notFound: [] };
      
      for (let i = 0; i < candidates.length; i += batchSize) {
        const batch = candidates.slice(i, i + batchSize);
        const res = await cloud.getTempFileURL({ fileList: batch });
        (res.fileList || []).forEach(f => {
          if (f.tempFileURL) {
            results.found.push(f.fileID);
          } else {
            results.notFound.push({ fileID: f.fileID, status: f.status, errMsg: f.errMsg });
          }
        });
      }
      
      return { ok: true, ...results };
    }
    
    return { ok: true, found: [], notFound: [], hint: '提供 candidates 参数来检查文件' };
  } catch (err) {
    return { ok: false, errMsg: err.message || String(err) };
  }
};
