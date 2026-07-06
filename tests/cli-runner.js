/**
 * 茅山趣测 · 自动跑测 CLI 入口
 * 
 * 用法：
 *   node tests/cli-runner.js                    # 默认3轮
 *   node tests/cli-runner.js --rounds=5         # 5轮
 *   node tests/cli-runner.js --rounds=1 --fast  # 快速1轮
 * 
 * 前置条件：
 *   1. 安装依赖：cd tests && npm install
 *   2. 打开微信开发者工具 → 设置 → 安全 → 开启「服务端口」
 *   3. 确保开发者账号已扫码登录
 *   4. 项目需已在开发工具中打开（或通过 CLI 自动打开）
 */

const automator = require('miniprogram-automator');
const fs = require('fs');
const path = require('path');
const {
  PROJECT_PATH, CUSTOM_CLI_PATHS, CLI_PATH_WIN, CLI_PATH_MAC,
  DEFAULT_ROUNDS, SCREENSHOT_DIR, REPORT_DIR,
  STEP_WAIT, PAGE_WAIT, ANIMATION_WAIT
} = require('./config');
const { runOneRound } = require('./flow-full');

// ====================== 命令行参数 ======================

function parseArgs() {
  const args = {};
  for (let i = 2; i < process.argv.length; i++) {
    const a = process.argv[i];
    if (a === '--fast') { args.fast = true; continue; }
    if (a.startsWith('--rounds=')) { args.rounds = parseInt(a.split('=')[1]) || DEFAULT_ROUNDS; continue; }
    if (a.startsWith('--cli=')) { args.cliPath = a.split('=')[1]; continue; }
    if (a === '--help' || a === '-h') { args.help = true; continue; }
  }
  return args;
}

// ====================== 日志工具 ======================

const TS = () => {
  const d = new Date();
  return `${String(d.getHours()).padStart(2,'0')}:${String(d.getMinutes()).padStart(2,'0')}:${String(d.getSeconds()).padStart(2,'0')}`;
};

const log = (msg) => {
  const line = `[${TS()}] ${msg}`;
  console.log(line);
  return line;
};

const logHr = (char = '─') => console.log(char.repeat(68));

const logBox = (title, msgs) => {
  console.log(`\n${'═'.repeat(68)}`);
  console.log(`  ${title}`);
  console.log(`${'─'.repeat(68)}`);
  msgs.forEach(m => console.log(`  ${m}`));
  console.log(`${'═'.repeat(68)}\n`);
};

// ====================== 主流程 ======================

async function main() {
  console.clear();
  console.log(`
╔══════════════════════════════════════════════════════════════╗
║             ☯️ 茅山趣测 · 自动化回归跑测系统                    ║
║                                                              ║
║  模拟真实用户：打开→勾选协议→探索首页→答题→看结果                ║
║               →逛图鉴→开音境→查协议→多轮迭代                    ║
║                                                              ║
║  基于 微信 miniprogram-automator 官方框架                      ║
╚══════════════════════════════════════════════════════════════╝
`);

  const args = parseArgs();
  if (args.help) {
    console.log(`
用法: node cli-runner.js [选项]

选项:
  --rounds=N    跑测轮数，默认 ${DEFAULT_ROUNDS}
  --fast        快速模式（减少等待时间）
  --cli=PATH    手动指定微信开发者工具 CLI 路径
  --help, -h    显示帮助

示例:
  node tests/cli-runner.js                    默认3轮
  node tests/cli-runner.js --rounds=5         跑5轮
  node tests/cli-runner.js --rounds=1 --fast  快速检查
  node tests/cli-runner.js --cli="D:\\WeChat\\cli.bat"

前置:
  1. 微信开发者工具 → 设置 → 安全 → 开启"服务端口"
  2. 已用开发者账号登录
`);
    process.exit(0);
  }

  const ROUNDS = args.rounds || DEFAULT_ROUNDS;

  // 如果 fast 模式，覆盖全局等待时间
  if (args.fast) {
    log('⚡ 快速模式：减少等待间隔');
    // 通过环境变量传递（flow-full.js 读取 config 的值）
    process.env.FAST_MODE = '1';
  }

  // ====================== 检测微信开发者工具 ======================

  logHr();
  log('🔍 检测微信开发者工具...');

  let cliPath = args.cliPath || null;
  if (!cliPath) {
    // 自动检测：先查自定义路径，再查常见默认路径
    const possible = [
      ...(CUSTOM_CLI_PATHS || []),
      CLI_PATH_WIN,
      'C:\\Program Files (x86)\\Tencent\\微信web开发者工具\\cli.bat',
      'C:\\Program Files\\Tencent\\微信web开发者工具\\cli.bat',
      process.env.LOCALAPPDATA + '\\Programs\\wechat-devtools\\cli.bat',
      CLI_PATH_MAC,
    ].filter(Boolean);
    for (const p of possible) {
      if (p && fs.existsSync(p)) {
        cliPath = p;
        break;
      }
    }
  }

  if (!cliPath) {
    logBox('❌ 未找到微信开发者工具 CLI', [
      '请确保已安装微信开发者工具。',
      'Windows 默认路径：C:\\Program Files (x86)\\Tencent\\微信web开发者工具\\cli.bat',
      '或手动指定：node tests/cli-runner.js --cli="你的路径\\cli.bat"',
      'macOS：/Applications/wechatwebdevtools.app/Contents/MacOS/cli',
    ]);
    process.exit(1);
  }
  log(`✅ 找到 CLI: ${cliPath}`);

  // ====================== 连接/启动小程序 ======================

  logHr();
  log('🔌 连接微信开发者工具...');

  let miniProgram;
  
  // 方案1：尝试连接到已运行的开发者工具（新版默认开启端口）
  try {
    log('   尝试方式1: 自动连接已运行的工具...');
    miniProgram = await automator.connect();
    log('✅ 已连接到运行中的小程序！');
  } catch (e1) {
    log(`   方式1失败: ${e1.message}`);
    
    // 方案2：通过项目路径连接
    try {
      log('   尝试方式2: 通过项目路径连接...');
      miniProgram = await automator.connect({
        projectPath: PROJECT_PATH,
      });
      log('✅ 已通过项目路径连接！');
    } catch (e2) {
      log(`   方式2失败: ${e2.message}`);
      
      // 方案3：启动新的工具窗口
      try {
        log('   尝试方式3: 通过CLI启动新窗口...');
        miniProgram = await automator.launch({
          projectPath: PROJECT_PATH,
          cliPath: cliPath,
        });
        log('✅ 已启动新窗口！');
      } catch (e3) {
        logBox('❌ 所有连接/启动方式均失败', [
          `方式1(自动连接): ${e1.message}`,
          `方式2(项目路径): ${e2.message}`,
          `方式3(CLI启动): ${e3.message}`,
          '',
          '解决步骤：',
          '1. 关闭所有微信开发者工具窗口',
          '2. 重新打开微信开发者工具并导入本项目',
          '3. 确保已扫码登录',
          '4. 重试: node cli-runner.js --rounds=1 --fast',
          '',
          '新版开发者工具(2.01+)可能需要在工具内:',
          '  设置 → 安全 → 开启"CLI/HTTP调用功能"',
          '  或: 设置 → 通用 → 命令行调用',
        ]);
        process.exit(1);
      }
    }
  }

  // 确保截图目录
  if (!fs.existsSync(SCREENSHOT_DIR)) fs.mkdirSync(SCREENSHOT_DIR, { recursive: true });
  if (!fs.existsSync(REPORT_DIR)) fs.mkdirSync(REPORT_DIR, { recursive: true });

  // ====================== 多轮跑测 ======================

  logHr('═');
  log(`🚀 开始 ${ROUNDS} 轮跑测...`);
  logHr('═');

  const allResults = [];
  const totalStart = Date.now();

  for (let r = 1; r <= ROUNDS; r++) {
    console.log(`\n${'▇'.repeat(60)}`);
    log(`☯️  === 第 ${r}/${ROUNDS} 轮跑测 ===`);
    console.log(`${'▇'.repeat(60)}\n`);

    // 回到首页（第一轮除外）
    if (r > 1) {
      try {
        // 多次返回确保到首页
        for (let b = 0; b < 3; b++) {
          try { await miniProgram.navigateBack(); } catch (_) {}
          await new Promise(r => setTimeout(r, 600));
          const pg = await miniProgram.currentPage();
          if (pg && pg.path === 'pages/index/index') break;
        }
        // 如果还没回到首页，用 reLaunch
        const pg = await miniProgram.currentPage();
        if (pg && pg.path !== 'pages/index/index') {
          await miniProgram.reLaunch('/pages/index/index');
          await new Promise(r => setTimeout(r, PAGE_WAIT));
        }
      } catch (e) {
        // 直接 relaunch
        try { await miniProgram.reLaunch('/pages/index/index'); } catch (_) {}
        await new Promise(r => setTimeout(r, PAGE_WAIT));
      }
    }

    const result = await runOneRound(miniProgram, r, log);
    allResults.push(result);

    // 单轮小结
    console.log('');
    log(`📊 第 ${r} 轮完成: ${result.okSteps}✅ ${result.skippedSteps}⏭️ ${result.errorSteps}❌  耗时 ${(result.duration / 1000).toFixed(1)}s`);
    if (result.consoleErrors.length > 0) {
      log(`⚠️  控制台错误 ${result.consoleErrors.length} 条`);
    }

    // 轮间休息
    if (r < ROUNDS) {
      log('⏳ 间隔 3 秒后开始下一轮...');
      await new Promise(r => setTimeout(r, 3000));
    }
  }

  const totalDuration = Date.now() - totalStart;

  // ====================== 关闭小程序 ======================

  logHr('═');
  log('🛑 关闭小程序...');
  try { await miniProgram.close(); } catch (_) {}
  log('✅ 已关闭');

  // ====================== 生成报告 ======================

  generateReport(allResults, ROUNDS, totalDuration, args);
}

// ====================== 报告生成 ======================

function generateReport(allResults, rounds, totalDuration, args) {
  const totalSteps = allResults.reduce((s, r) => s + r.totalSteps, 0);
  const totalOk = allResults.reduce((s, r) => s + r.okSteps, 0);
  const totalSkipped = allResults.reduce((s, r) => s + r.skippedSteps, 0);
  const totalErrors = allResults.reduce((s, r) => s + r.errorSteps, 0);
  const allErrors = allResults.flatMap(r => r.errors);
  const allWarnings = allResults.flatMap(r => r.warnings);
  const allConsoleErrors = allResults.flatMap(r => r.consoleErrors);

  // —— Console 输出 ——
  console.log('\n\n');
  logBox(`☯️ 跑测完成 · ${rounds} 轮汇总`, [
    `总步骤: ${totalSteps}  |  ✅ 通过: ${totalOk}  |  ⏭️ 跳过: ${totalSkipped}  |  ❌ 失败: ${totalErrors}`,
    `总耗时: ${(totalDuration / 1000).toFixed(1)}s  |  平均每轮: ${(totalDuration / rounds / 1000).toFixed(1)}s`,
    `控制台错误: ${allConsoleErrors.length} 条`,
    `通过率: ${((totalOk / (totalOk + totalErrors)) * 100).toFixed(1)}%`,
    '',
    `截图保存在: ${SCREENSHOT_DIR}\\round-XX\\`,
    `报告保存在: ${REPORT_DIR}\\`,
  ]);

  if (allErrors.length > 0) {
    console.log(`\n${'━'.repeat(68)}`);
    console.log('  ❌ 错误详情:');
    console.log(`${'━'.repeat(68)}`);
    allErrors.forEach((e, i) => console.log(`  ${i + 1}. ${e}`));
  }

  if (allWarnings.length > 0 && allWarnings.length <= 10) {
    console.log(`\n${'━'.repeat(68)}`);
    console.log('  ⚠️  警告列表:');
    console.log(`${'━'.repeat(68)}`);
    allWarnings.forEach((w, i) => console.log(`  ${i + 1}. ${w}`));
  }

  if (allConsoleErrors.length > 0) {
    console.log(`\n${'━'.repeat(68)}`);
    console.log('  🔴 控制台错误 (前10条):');
    console.log(`${'━'.repeat(68)}`);
    allConsoleErrors.slice(0, 10).forEach((e, i) => console.log(`  ${i + 1}. [${e.time}] ${e.message}`));
  }

  // —— JSON 报告 ——
  const reportPath = path.join(REPORT_DIR, `report-${Date.now()}.json`);
  const report = {
    generatedAt: new Date().toISOString(),
    config: { rounds, fastMode: !!args.fast, projectPath: PROJECT_PATH },
    summary: {
      totalSteps, totalOk, totalSkipped, totalErrors,
      passRate: ((totalOk / (totalOk + totalErrors)) * 100).toFixed(1) + '%',
      totalDuration: (totalDuration / 1000).toFixed(1) + 's',
      avgDurationPerRound: (totalDuration / rounds / 1000).toFixed(1) + 's',
      consoleErrors: allConsoleErrors.length,
    },
    roundResults: allResults.map(r => ({
      round: r.round,
      duration: (r.duration / 1000).toFixed(1) + 's',
      ok: r.okSteps,
      skipped: r.skippedSteps,
      errors: r.errorSteps,
      consoleErrors: r.consoleErrors.length,
    })),
    allErrors,
    allConsoleErrors: allConsoleErrors.slice(0, 50), // 最多50条
  };

  fs.writeFileSync(reportPath, JSON.stringify(report, null, 2), 'utf8');
  console.log(`\n📄 详细报告已保存: ${reportPath}`);

  // —— 文字报告 ——
  const txtPath = path.join(REPORT_DIR, `report-${Date.now()}.txt`);
  let txt = `茅山趣测 · 自动化跑测报告\n`;
  txt += `${'═'.repeat(50)}\n`;
  txt += `生成时间: ${new Date().toLocaleString('zh-CN')}\n`;
  txt += `跑测轮数: ${rounds}\n`;
  txt += `总步骤数: ${totalSteps}\n`;
  txt += `✅ 通过: ${totalOk}  |  ⏭️ 跳过: ${totalSkipped}  |  ❌ 失败: ${totalErrors}\n`;
  txt += `通过率: ${report.summary.passRate}\n`;
  txt += `总耗时: ${report.summary.totalDuration}\n`;
  txt += `${'─'.repeat(50)}\n\n`;
  if (allErrors.length > 0) {
    txt += `错误列表:\n`;
    allErrors.forEach((e, i) => { txt += `  ${i + 1}. ${e}\n`; });
  } else {
    txt += `🎉 全部通过！未发现错误。\n`;
  }
  txt += `\n${'─'.repeat(50)}\n`;
  txt += `每轮耗时:\n`;
  allResults.forEach(r => {
    txt += `  第${r.round}轮: ${(r.duration / 1000).toFixed(1)}s  (${r.okSteps}✅ ${r.errorSteps}❌)\n`;
  });
  fs.writeFileSync(txtPath, txt, 'utf8');

  // 最终退出码
  if (totalErrors > 0) {
    console.log(`\n❌ 存在 ${totalErrors} 个错误，请检查报告。退出码 1`);
    process.exit(1);
  } else {
    console.log(`\n🎉 恭喜！${rounds} 轮跑测全部通过，未发现错误。`);
    process.exit(0);
  }
}

// ====================== 启动 ======================

main().catch(e => {
  console.error(`\n💥 未捕获异常: ${e.stack || e.message}`);
  process.exit(2);
});
