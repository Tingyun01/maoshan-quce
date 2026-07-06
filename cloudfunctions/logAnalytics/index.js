// 云函数：logAnalytics
// 接收前端埋点事件并写入云数据库
const cloud = require('wx-server-sdk');
cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV });
const db = cloud.database();
const COLLECTION = 'analytics_events';

exports.main = async (event, context) => {
  const { events } = event;
  if (!events || !Array.isArray(events) || events.length === 0) {
    return { ok: false, errMsg: '缺少 events 参数' };
  }

  try {
    // 判断集合是否存在，不存在则创建
    const collections = await db.listCollections();
    const exists = collections.data && collections.data.some(c => c.name === COLLECTION);
    if (!exists) {
      try { await db.createCollection(COLLECTION); } catch (e) { /* 可能已存在 */ }
    }

    // 批量写入（每次最多10条）
    const batchSize = 10;
    let inserted = 0;
    for (let i = 0; i < events.length; i += batchSize) {
      const batch = events.slice(i, i + batchSize);
      const tasks = batch.map(evt => db.collection(COLLECTION).add({ data: evt }));
      await Promise.all(tasks);
      inserted += batch.length;
    }

    return { ok: true, inserted };
  } catch (err) {
    return { ok: false, errMsg: err.message || String(err), inserted: 0 };
  }
};
