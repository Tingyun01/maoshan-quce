// 搜索开发者工具的配置文件，查找安全/端口相关配置
const fs = require('fs');
const path = require('path');

const base = path.join(process.env.LOCALAPPDATA, '微信开发者工具', 'User Data');

function searchDir(dir, depth = 0) {
  if (depth > 4) return;
  try {
    const items = fs.readdirSync(dir);
    for (const item of items) {
      const fullPath = path.join(dir, item);
      try {
        const stat = fs.statSync(fullPath);
        if (stat.isFile()) {
          // 查找配置文件
          if (item === '.ide' || item.includes('setting') || item.includes('config') || 
              item.includes('pref') || item.includes('state') || item === 'Preferences' ||
              item === 'Local State') {
            try {
              const content = fs.readFileSync(fullPath, 'utf8');
              if (content.length < 5000) {
                console.log('文件:', fullPath);
                console.log('内容:', content.substring(0, 2000));
                console.log('---');
              }
            } catch(e) {}
          }
        } else if (stat.isDirectory() && !item.startsWith('.')) {
          searchDir(fullPath, depth + 1);
        }
      } catch(e) {}
    }
  } catch(e) {}
}

searchDir(base);
