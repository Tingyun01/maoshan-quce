/**
 * 茅山趣测 · 用户旅程自动执行引擎
 * 
 * 模拟完整用户操作：启动 → 同意协议 → 首页探索 → 答题 → 结果 → 图鉴 → 音境 → 法务
 * 
 * 每一步都会：
 *   1. 截图留证
 *   2. 监听控制台错误
 *   3. 超时保护
 *   4. 记录耗时
 */

const fs = require('fs');
const path = require('path');
const { 
  USER_JOURNEY, STEP_WAIT, PAGE_WAIT, ANIMATION_WAIT, 
  SCREENSHOT_DIR,
} = require('./config');

// ====================== 工具函数 ======================

/** 安全等待 */
const sleep = ms => new Promise(r => setTimeout(r, ms));

/** 当前时间戳，用于日志 */
const now = () => {
  const d = new Date();
  return `${d.getHours().toString().padStart(2,'0')}:${d.getMinutes().toString().padStart(2,'0')}:${d.getSeconds().toString().padStart(2,'0')}`;
};

/** 确保目录存在 */
const ensureDir = (dir) => {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
};

// ====================== 单轮跑测 ======================

/**
 * 跑完一轮完整用户旅程
 * @param {object} mp - miniprogram-automator 实例
 * @param {number} round 第几轮
 * @param {function} log 日志函数
 * @returns {object} 跑测结果 { steps, errors, warnings, duration }
 */
async function runOneRound(mp, round, log) {
  const roundStart = Date.now();
  const steps = [];
  const errors = [];
  const warnings = [];
  const consoleErrors = [];

  // 监听控制台错误
  const onConsole = (msg) => {
    if (msg.type === 'error' || (msg.args && msg.args[0] && String(msg.args[0]).includes('Error'))) {
      const errMsg = msg.args ? msg.args.map(a => String(a)).join(' ') : JSON.stringify(msg);
      consoleErrors.push({
        time: now(),
        type: msg.type,
        message: errMsg.substring(0, 300),
      });
    }
  };
  if (mp.on) mp.on('console', onConsole);

  const roundDir = path.join(SCREENSHOT_DIR, `round-${String(round).padStart(2, '0')}`);
  ensureDir(roundDir);

  let currentPage = null;

  for (let i = 0; i < USER_JOURNEY.length; i++) {
    const step = USER_JOURNEY[i];
    const stepStart = Date.now();
    let stepResult = { index: i, phase: step.phase, name: step.name, status: 'ok', duration: 0, error: null };

    try {
      // 获取当前页面
      try { currentPage = await mp.currentPage(); } catch (_) { /* 页面可能未加载 */ }

      // ==== 执行步骤动作 ====
      if (step.wait) {
        // 纯等待
        await sleep(step.wait);
      } else if (step.waitFor) {
        // 等待某元素出现
        try {
          await mp.waitFor(step.waitFor, { timeout: 8000 });
        } catch (e) {
          if (step.optional) {
            stepResult.status = 'skipped';
            stepResult.note = `可选元素未出现: ${step.waitFor}`;
            warnings.push(`[Round${round}] ${step.name}: ${stepResult.note}`);
          } else {
            throw new Error(`等待超时: ${step.waitFor} (8s)`);
          }
        }
      } else if (step.navigateBack) {
        await mp.navigateBack();
        await sleep(step.waitAfter || PAGE_WAIT);
      } else if (step.tap) {
        // 点击元素
        let el = null;
        try {
          if (step.index !== undefined) {
            const els = await currentPage.$$(step.tap);
            if (els.length > step.index) {
              el = els[step.index];
            }
          } else {
            el = await currentPage.$(step.tap);
          }
          if (el) {
            await el.tap();
          } else if (step.optional) {
            stepResult.status = 'skipped';
            stepResult.note = `可选元素未找到: ${step.tap}`;
            warnings.push(`[Round${round}] ${step.name}: ${stepResult.note}`);
          } else {
            throw new Error(`元素未找到: ${step.tap}${step.index !== undefined ? `[${step.index}]` : ''}`);
          }
        } catch (e) {
          if (step.optional) {
            stepResult.status = 'skipped';
            stepResult.note = `tap失败(可选): ${e.message.substring(0, 80)}`;
            warnings.push(`[Round${round}] ${step.name}: ${stepResult.note}`);
          } else {
            throw e;
          }
        }
        if (step.waitAfter) await sleep(step.waitAfter);
      } else if (step.checkExists) {
        // 检查元素存在
        try {
          const el = await currentPage.$(step.checkExists);
          if (!el && !step.optional) {
            stepResult.status = 'warning';
            stepResult.note = `元素未找到: ${step.checkExists}`;
            warnings.push(`[Round${round}] ${step.name}: ${stepResult.note}`);
          }
        } catch (e) {
          if (!step.optional) {
            stepResult.status = 'warning';
            stepResult.note = `检查失败: ${e.message.substring(0, 80)}`;
            warnings.push(`[Round${round}] ${step.name}: ${stepResult.note}`);
          }
        }
      } else if (step.handler) {
        // 自定义处理器
        await step.handler(mp, currentPage, log);
      }
      // 无动作（纯标记步骤）

    } catch (e) {
      stepResult.status = 'error';
      stepResult.error = e.message.substring(0, 200);
      errors.push(`[Round${round}] ${step.name}: ${stepResult.error}`);
    }

    // 截图
    try {
      const pcm = await mp.currentPage();
      const pn = (pcm && pcm.path) ? pcm.path.replace(/\//g, '_').replace(/^_/, '') : 'unknown';
      const ssPath = path.join(roundDir, `${String(i).padStart(2, '0')}-${pn}-${step.name.replace(/[\\/:*?"<>|]/g,'_').substring(0,20)}.png`);
      ensureDir(path.dirname(ssPath));
      await mp.screenshot({ path: ssPath });
      stepResult.screenshot = ssPath;
    } catch (e) {
      // 截图失败不阻塞流程
      stepResult.screenshot = null;
    }

    stepResult.duration = Date.now() - stepStart;
    steps.push(stepResult);

    // 进度输出
    const emoji = stepResult.status === 'ok' ? '✅' : stepResult.status === 'skipped' ? '⏭️' : '❌';
    log(`${emoji} [${step.phase}] ${step.name}  [${stepResult.duration}ms]${stepResult.error ? ' ⚠️'+stepResult.error : ''}`);
  }

  // 取消控制台监听
  if (mp.off) mp.off('console', onConsole);

  const roundDuration = Date.now() - roundStart;

  return {
    round,
    startTime: new Date(roundStart).toISOString(),
    duration: roundDuration,
    totalSteps: steps.length,
    okSteps: steps.filter(s => s.status === 'ok').length,
    skippedSteps: steps.filter(s => s.status === 'skipped').length,
    errorSteps: steps.filter(s => s.status === 'error').length,
    steps,
    errors,
    warnings,
    consoleErrors,
    screenshotDir: roundDir,
  };
}

module.exports = { runOneRound };
