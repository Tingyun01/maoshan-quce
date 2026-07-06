/**
 * 毛山趣测 · 自动化跑测配置
 *
 * 使用方法：
 *   1. 确保已安装微信开发者工具（稳定版）
 *   2. 在工具设置 → 安全 → 开启"服务端口"
 *   3. 确保已用开发者账号扫码登录
 *   4. node tests/cli-runner.js --rounds=3
 */

const path = require('path');

// —— 项目路径 ——
const PROJECT_PATH = path.resolve(__dirname, '..');

// —— 微信开发者工具 CLI 路径 ——
// 自动检测优先级：自定义路径 > 注册表 > 常见默认路径
// 如果都找不到，手动填写你的实际路径到 CUSTOM_CLI_PATHS
const CUSTOM_CLI_PATHS = [
  'D:\\安装文件\\微信web开发者\\cli.bat',
  'D:\\安装文件\\微信web开发者工具\\cli.bat',
];
const CLI_PATH_WIN = 'C:\\Program Files (x86)\\Tencent\\微信web开发者工具\\cli.bat';
const CLI_PATH_MAC = '/Applications/wechatwebdevtools.app/Contents/MacOS/cli';

// —— 默认跑测轮数 ——
const DEFAULT_ROUNDS = 3;

// —— 每步操作等待时间 (ms) ——
const STEP_WAIT = 800;       // 普通步骤间隔
const PAGE_WAIT = 2000;      // 页面跳转后等待加载
const ANIMATION_WAIT = 600;  // 动画完成后等待

// —— 截图保存目录 ——
const SCREENSHOT_DIR = path.resolve(__dirname, 'screenshots');
const REPORT_DIR = path.resolve(__dirname, 'reports');

// —— 用户旅程定义 ——
// 每个 step 是一个 { name, action } 或 { name, handler: async (mp, page, log) => {...} }
// 如果 action 存在，走通用 tap/navigate 逻辑
// handler 用于复杂步骤

const USER_JOURNEY = [
  // ====== 阶段 0：启动 ======
  { phase: '启动', name: '小程序启动' },
  { phase: '启动', name: '等待首页加载', wait: PAGE_WAIT },

  // ====== 阶段 1：欢迎遮罩 + 隐私协议 ======
  { phase: '引导', name: '等待欢迎遮罩出现', waitFor: '.welcome-overlay', optional: true },
  { phase: '引导', name: '点击欢迎遮罩空白处进入', tap: '.welcome-overlay', optional: true, waitAfter: ANIMATION_WAIT },
  { phase: '引导', name: '等待隐私弹窗出现', waitFor: '.modal-overlay', waitAfter: STEP_WAIT },
  { phase: '引导', name: '点击「同意并继续」', tap: '.modal-confirm', waitAfter: PAGE_WAIT },
  { phase: '引导', name: '关闭新手引导（如有）', tap: '.tut-skip', optional: true, waitAfter: ANIMATION_WAIT },

  // ====== 阶段 2：首页元素完整性检查 ======
  { phase: '首页', name: '检查顶部品牌区', checkExists: '.header-section' },
  { phase: '首页', name: '检查图鉴进度条', checkExists: '.collect-bar' },
  { phase: '首页', name: '检查核心入口卡片', checkExists: '.home-entries' },
  { phase: '首页', name: '检查随缘一测按钮', checkExists: '.core-btn-wrap' },
  { phase: '首页', name: '检查全部道法折叠区', checkExists: '.all-tests-section' },
  { phase: '首页', name: '检查底部工具条', checkExists: '.bottom-bar' },
  { phase: '首页', name: '检查底部法律信息', checkExists: '.bottom-legal' },

  // ====== 阶段 3：音乐开关 ======
  { phase: '首页·音乐', name: '点击BGM开关', tap: '.header-music-btn', waitAfter: ANIMATION_WAIT },
  { phase: '首页·音乐', name: '等待音乐播放', wait: 1500 },
  { phase: '首页·音乐', name: '再次点击关闭BGM', tap: '.header-music-btn', waitAfter: ANIMATION_WAIT },

  // ====== 阶段 4：打开全部道法 ======
  { phase: '首页', name: '点击「全部道法」展开', tap: '.ats-header', waitAfter: ANIMATION_WAIT },
  { phase: '首页', name: '检查核心测试列表', checkExists: '.ats-grid' },
  { phase: '首页', name: '收起全部道法', tap: '.ats-header', waitAfter: ANIMATION_WAIT },

  // ====== 阶段 5：进入一个测试 ======
  { phase: '答题', name: '点击「随缘一测」按钮', tap: '.core-btn-wrap', waitAfter: PAGE_WAIT },
  { phase: '答题', name: '等待quiz页面加载（Skip加载动画）', wait: 2500 },
  { phase: '答题', name: '答题第1题：选择第1个选项', tap: '.qc-opt', index: 0, waitAfter: STEP_WAIT },
  { phase: '答题', name: '答题第2题：选择第1个选项', tap: '.qc-opt', index: 1, waitAfter: STEP_WAIT },
  { phase: '答题', name: '答题第3题：选择第1个选项', tap: '.qc-opt', index: 2, waitAfter: STEP_WAIT },
  { phase: '答题', name: '答题第4题：选择第1个选项', tap: '.qc-opt', index: 3, waitAfter: STEP_WAIT },
  { phase: '答题', name: '答题第5题：选择第1个选项', tap: '.qc-opt', index: 4, waitAfter: ANIMATION_WAIT },
  { phase: '答题', name: '点击「查看结果」', tap: '.qf-submit-btn', waitAfter: PAGE_WAIT * 2 },

  // ====== 阶段 6：结果页 ======
  { phase: '结果', name: '等待结果卡片出现', waitFor: '.result-card', waitAfter: ANIMATION_WAIT },
  { phase: '结果', name: '检查结果卡片内容', checkExists: '.result-card' },
  { phase: '结果', name: '检查称号', checkExists: '.rank-badge', optional: true },
  { phase: '结果', name: '检查稀有度标签', checkExists: '.rarity-tag', optional: true },
  { phase: '结果', name: '检查评分条', checkExists: '.ratings-bar', optional: true },
  { phase: '结果', name: '检查操作按钮', checkExists: '.share-row' },
  { phase: '结果', name: '返回首页', tap: '.page-back', waitAfter: PAGE_WAIT },

  // ====== 阶段 7：图鉴页 ======
  { phase: '图鉴', name: '点击底部图鉴按钮', tap: '.bb-item', index: 2, waitAfter: PAGE_WAIT },
  { phase: '图鉴', name: '检查图鉴统计区', checkExists: '.album-stats' },
  { phase: '图鉴', name: '检查分组列表', checkExists: '.album-groups' },
  { phase: '图鉴', name: '返回首页', tap: '.page-back', waitAfter: PAGE_WAIT },

  // ====== 阶段 8：仙山音境 ======
  { phase: '音境', name: '点击底部「我的」', tap: '.bb-item', index: 3, waitAfter: PAGE_WAIT },
  { phase: '音境', name: '点击「仙山音境」菜单', tap: '.menu-item', index: 2, waitAfter: PAGE_WAIT },
  { phase: '音境', name: '检查音境标题', checkExists: '.header-title' },
  { phase: '音境', name: '点击「山间流水」音境卡片', tap: '.theme-card', index: 1, waitAfter: ANIMATION_WAIT },
  { phase: '音境', name: '等待试听', wait: 2000 },
  { phase: '音境', name: '再次点击启动持续播放', tap: '.theme-card', index: 1, waitAfter: ANIMATION_WAIT },
  { phase: '音境', name: '检查播放状态栏', checkExists: '.status-indicator' },
  { phase: '音境', name: '点击古琴短句·6音', tap: '.gq-btn', index: 0, waitAfter: ANIMATION_WAIT },
  { phase: '音境', name: '等待古琴播放完成', wait: 2500 },
  { phase: '音境', name: '停止播放', tap: '.sa-btn', waitAfter: ANIMATION_WAIT },
  { phase: '音境', name: '返回我的页', tap: '.back-btn', waitAfter: PAGE_WAIT },

  // ====== 阶段 9：关于页 → 协议页 ======
  { phase: '法务', name: '点击「隐私政策」', tap: '.menu-item', index: 4, waitAfter: PAGE_WAIT },
  { phase: '法务', name: '检查隐私页内容', checkExists: '.container' },
  { phase: '法务', name: '返回我的页', navigateBack: true, waitAfter: PAGE_WAIT },
  { phase: '法务', name: '点击「用户服务协议」', tap: '.menu-item', index: 5, waitAfter: PAGE_WAIT },
  { phase: '法务', name: '检查协议页内容', checkExists: '.container' },
  { phase: '法务', name: '连续返回首页', navigateBack: true, waitAfter: PAGE_WAIT },

  // ====== 阶段 10：首页快速入口 ======
  { phase: '首页', name: '检查核心入口卡片可点击', checkExists: '.entry-card' },
  { phase: '首页', name: '点击第一个核心入口', tap: '.entry-card', index: 0, waitAfter: PAGE_WAIT },
  { phase: '首页', name: '返回首页', navigateBack: true, waitAfter: PAGE_WAIT },

  // ====== 完成 ======
  { phase: '完成', name: '✅ 两轮旅程跑完' },
];

module.exports = {
  PROJECT_PATH,
  CUSTOM_CLI_PATHS,
  CLI_PATH_WIN,
  CLI_PATH_MAC,
  DEFAULT_ROUNDS,
  STEP_WAIT,
  PAGE_WAIT,
  ANIMATION_WAIT,
  SCREENSHOT_DIR,
  REPORT_DIR,
  USER_JOURNEY,
};
