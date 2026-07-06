/**
 * aiAnalyze 云函数 — AI深度分析引擎
 * 
 * 调用链：用户测完 → 前端判断预算 → 调用此云函数 → AI API → 返回分析
 * 
 * 支持后端：
 *   - 腾讯混元 (hunyuan.tencentcloudapi.com)
 *   - 兼容 OpenAI 格式的任意API
 * 
 * 环境变量（在云函数中配置）：
 *   AI_API_KEY      — API密钥（必填）
 *   AI_API_URL       — API地址（选填，默认混元）
 *   AI_MODEL         — 模型名（选填，默认 hunyuan-lite）
 *   AI_MAX_TOKENS    — 最大输出token（选填，默认600）
 */

const cloud = require('wx-server-sdk');
cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV });

// ===== 配置 =====
const AI_CONFIG = {
  // 默认使用腾讯混元 API（OpenAI 兼容接口）
  defaultUrl: 'https://api.hunyuan.cloud.tencent.com/v1/chat/completions',
  defaultModel: 'hunyuan-lite',
  maxTokens: 600,
  temperature: 0.85,
  timeout: 18000,  // 18秒超时（云函数最长20秒）
};

// 获取配置
function getConfig() {
  return {
    apiKey: process.env.AI_API_KEY || '',
    apiUrl: process.env.AI_API_URL || AI_CONFIG.defaultUrl,
    model: process.env.AI_MODEL || AI_CONFIG.defaultModel,
    maxTokens: parseInt(process.env.AI_MAX_TOKENS) || AI_CONFIG.maxTokens,
  };
}

/**
 * 主函数
 */
exports.main = async (event, context) => {
  // 顶层 try-catch：防止 event 为 null/undefined 时解构崩掉整个云函数
  try {
  const config = getConfig();

  // Ping 检测：判断 AI API 是否已配置
  if (event && event.action === 'ping') {
    if (!config.apiKey) {
      return { success: false, message: 'AI_API_KEY not configured' };
    }
    return { success: true, message: 'pong', model: config.model };
  }

  // 检查 API 是否已配置
  if (!config.apiKey) {
    return {
      success: false,
      error: 'AI_API_KEY_NOT_CONFIGURED',
      message: '管理员尚未配置AI密钥',
      source: 'no_config'
    };
  }

  const {
    testName,      // 测试名称（如"修仙资质测试"）
    testId,        // 测试ID
    typeTitle,     // 结果类型（如"天灵根"）
    typeSummary,   // 结果简述
    strengths,     // 优势
    weaknesses,    // 不足
    tagline,       // 趣味标签
    answers,       // 用户答题记录 [{question, answer}]
    scores,        // 评分配置
    rarity,        // 稀有度
    userId         // 用户标识
  } = event;

  // 构建 Prompt
  const prompt = buildPrompt({
    testName, testId, typeTitle, typeSummary,
    strengths, weaknesses, tagline, answers, scores, rarity
  });

  try {
    const startTime = Date.now();
    const result = await callAI(prompt, config);
    const elapsed = Date.now() - startTime;

    return {
      success: true,
      content: result.content,
      tokens: {
        prompt: result.promptTokens || 0,
        completion: result.completionTokens || 0,
        total: result.totalTokens || 0
      },
      model: config.model,
      elapsed,
      source: 'real_ai'
    };
  } catch (err) {
    console.error('AI调用失败:', err.message);
    return {
      success: false,
      error: err.message || 'AI_SERVICE_ERROR',
      message: 'AI服务暂时不可用，请稍后重试',
      source: 'error'
    };
  }
  } catch (topErr) {
    // 顶层兜底：event 异常、配置异常等
    console.error('aiAnalyze 顶层异常:', topErr.message || topErr);
    return {
      success: false,
      error: 'SERVICE_ERROR',
      message: 'AI服务异常，请稍后重试',
      source: 'top_error'
    };
  }
};

/**
 * 构建分析 Prompt（精简有力，控制token消耗）
 */
function buildPrompt(data) {
  const answersSummary = (data.answers || [])
    .slice(0, 5)
    .map((a, i) => `Q${i + 1}: ${(a.question || '').substring(0, 20)} → ${a.answer || a.optionText || ''}`)
    .join('; ');

  return `你是茅山道院的AI仙师，请为以下测试结果写一段风趣的解读（150-200字）。

测试：${data.testName || '未知'}
结果：${data.typeTitle || '未知'}
简述：${data.typeSummary || ''}
优势：${data.strengths || ''}
短板：${data.weaknesses || ''}
标签：${data.tagline || ''}
稀有度：${data.rarity || '普通'}
答题：${answersSummary || '无记录'}

要求：
1. 幽默风趣，有网络梗，让人想截图分享
2. 融入道教元素（灵根/修为/法宝等）但不生硬
3. 给一句"修炼建议"
4. 结尾附带一个适合发朋友圈的slogan
5. 纯文字，不需要markdown，不要超过200字`;
}

/**
 * 调用 AI API（兼容 OpenAI 格式）
 */
async function callAI(prompt, config) {
  const { apiKey, apiUrl, model, maxTokens } = config;

  const body = JSON.stringify({
    model: model,
    messages: [
      { role: 'system', content: '你是一个风趣幽默的道教AI仙师，善用网络热梗和道教文化混合解读。回答精炼有趣。内容安全红线：不生成色情/暴力/违法/政治敏感内容；不提供医疗诊断/金融投资建议；不宣扬封建迷信；所有解读仅限趣味娱乐，不做真实预测或指导人生重大决策。' },
      { role: 'user', content: prompt }
    ],
    max_tokens: maxTokens,
    temperature: AI_CONFIG.temperature,
  });

  return new Promise((resolve, reject) => {
    const parsedUrl = parseUrl(apiUrl);
    const isHttps = parsedUrl.protocol === 'https:';
    const httpModule = isHttps ? require('https') : require('http');

    const options = {
      hostname: parsedUrl.hostname,
      port: parsedUrl.port || (isHttps ? 443 : 80),
      path: parsedUrl.path,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
        'Content-Length': Buffer.byteLength(body),
      },
      timeout: AI_CONFIG.timeout,
    };

    const req = httpModule.request(options, (res) => {
      let data = '';
      res.on('data', chunk => { data += chunk; });
      res.on('end', () => {
        try {
          const json = JSON.parse(data);

          // 检查错误
          if (json.error) {
            reject(new Error(json.error.message || json.error.code || 'AI返回错误'));
            return;
          }

          // 提取内容（兼容 OpenAI / 混元 格式）
          const choice = json.choices && json.choices[0];
          if (!choice || !choice.message || !choice.message.content) {
            reject(new Error('AI返回格式异常'));
            return;
          }

          resolve({
            content: choice.message.content.trim(),
            promptTokens: json.usage?.prompt_tokens || 0,
            completionTokens: json.usage?.completion_tokens || 0,
            totalTokens: json.usage?.total_tokens || 0,
          });
        } catch (e) {
          reject(new Error(`解析AI响应失败: ${e.message}`));
        }
      });
    });

    req.on('error', (e) => {
      reject(new Error(`网络请求失败: ${e.message}`));
    });

    req.on('timeout', () => {
      req.destroy();
      reject(new Error('AI请求超时'));
    });

    req.write(body);
    req.end();
  });
}

/**
 * 简易 URL 解析（兼容 Node.js 内置模块）
 */
function parseUrl(urlStr) {
  // 处理没有协议的 URL
  if (!urlStr.startsWith('http://') && !urlStr.startsWith('https://')) {
    urlStr = 'https://' + urlStr;
  }

  const match = urlStr.match(/^(https?):\/\/([^\/:]+)(?::(\d+))?(\/.*)?$/);
  if (!match) {
    throw new Error('无效的API URL格式');
  }

  return {
    protocol: match[1],
    hostname: match[2],
    port: match[3] ? parseInt(match[3]) : (match[1] === 'https' ? 443 : 80),
    path: match[4] || '/',
  };
}
