/**
 * 茅山趣测 · 测试报告查看器
 * 
 * 用法：node tests/report.js                    # 查看最新报告
 *       node tests/report.js reports/xxx.json    # 查看指定报告
 */

const fs = require('fs');
const path = require('path');

const REPORT_DIR = path.resolve(__dirname, 'reports');

function listReports() {
  if (!fs.existsSync(REPORT_DIR)) return [];
  return fs.readdirSync(REPORT_DIR)
    .filter(f => f.endsWith('.json'))
    .sort()
    .reverse();
}

function formatDuration(ms) {
  if (ms < 1000) return ms + 'ms';
  return (ms / 1000).toFixed(1) + 's';
}

function main() {
  let reportPath = process.argv[2];
  
  if (!reportPath) {
    const reports = listReports();
    if (reports.length === 0) {
      console.log('暂无报告。请先运行 node tests/cli-runner.js');
      process.exit(0);
    }
    reportPath = path.join(REPORT_DIR, reports[0]);
    console.log('📄 显示最新报告...\n');
  }

  if (!fs.existsSync(reportPath)) {
    console.error('报告不存在:', reportPath);
    process.exit(1);
  }

  const data = JSON.parse(fs.readFileSync(reportPath, 'utf8'));

  console.log(`${'═'.repeat(66)}`);
  console.log('  ☯️ 茅山趣测 · 自动化测试报告');
  console.log(`${'═'.repeat(66)}`);
  console.log(`  生成时间: ${data.generatedAt}`);
  console.log(`  配置:     ${data.config.rounds} 轮 ${data.config.fastMode ? '(快速模式)' : '(正常模式)'}`);
  console.log(`${'─'.repeat(66)}`);
  console.log('  📊 总体汇总:');
  console.log(`    总步骤: ${data.summary.totalSteps}`);
  console.log(`    ✅ 通过: ${data.summary.totalOk}`);
  console.log(`    ⏭️ 跳过: ${data.summary.totalSkipped}`);
  console.log(`    ❌ 失败: ${data.summary.totalErrors}`);
  console.log(`    通过率: ${data.summary.passRate}`);
  console.log(`    总耗时: ${data.summary.totalDuration}`);
  console.log(`    平均/轮: ${data.summary.avgDurationPerRound}`);
  console.log(`    🔴 控制台错误: ${data.summary.consoleErrors}`);
  console.log(`${'─'.repeat(66)}`);

  if (data.roundResults && data.roundResults.length > 0) {
    console.log('  各轮详情:');
    data.roundResults.forEach(r => {
      const bar = '█'.repeat(Math.max(1, r.ok - r.errors));
      console.log(`    轮${r.round}: ${bar} ${r.ok}✅ ${r.errors}❌ [${r.duration}]`);
    });
  }

  if (data.allErrors && data.allErrors.length > 0) {
    console.log(`${'─'.repeat(66)}`);
    console.log('  ❌ 错误列表:');
    data.allErrors.forEach((e, i) => console.log(`    ${i + 1}. ${e}`));
  }

  if (data.allConsoleErrors && data.allConsoleErrors.length > 0) {
    console.log(`${'─'.repeat(66)}`);
    console.log('  🔴 控制台错误:');
    data.allConsoleErrors.forEach((e, i) => console.log(`    ${i + 1}. [${e.time}] ${e.message}`));
  }

  console.log(`${'═'.repeat(66)}\n`);

  // 列出所有可用报告
  const allReports = listReports();
  if (allReports.length > 1) {
    console.log('📁 可用历史报告:');
    allReports.slice(0, 5).forEach(r => console.log(`   ${r}`));
  }
}

main();
