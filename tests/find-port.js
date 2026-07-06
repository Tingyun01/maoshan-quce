// 查找微信开发者工具的IDE端口文件
const fs = require('fs');
const path = require('path');

const base = path.join(process.env.LOCALAPPDATA, '微信开发者工具', 'User Data');
console.log('搜索目录:', base);

if (!fs.existsSync(base)) {
  console.log('目录不存在');
  process.exit(1);
}

const dirs = fs.readdirSync(base);
console.log('子目录:', dirs);

for (const d of dirs) {
  const ideFile = path.join(base, d, 'Default', '.ide');
  if (fs.existsSync(ideFile)) {
    const content = fs.readFileSync(ideFile, 'utf8');
    console.log('找到端口文件:', ideFile);
    console.log('内容:', content);
  } else {
    console.log('未找到:', ideFile);
  }
}

// 也搜索其他可能的端口文件
for (const d of dirs) {
  const defaultDir = path.join(base, d, 'Default');
  if (fs.existsSync(defaultDir)) {
    const files = fs.readdirSync(defaultDir);
    const portFiles = files.filter(f => f.startsWith('.') || f.includes('port') || f.includes('socket'));
    console.log('Default目录 隐藏/端口文件:', portFiles);
  }
}
