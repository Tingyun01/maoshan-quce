const fs = require('fs');
const path = require('path');

const root = 'd:\\停云小程序\\茅山趣测\\趣测-official';

// 检查 .wxml 文件是否被错误覆盖为 JS 内容
function isLikelyJsContent(content) {
  return content.includes('module.exports') || 
         content.includes('wx-server-sdk') ||
         (content.includes('_ctx') && content.includes('_muted'));
}

function isLikelyWxssContent(content) {
  return content.includes('rpx') || 
         content.includes('px;') ||
         content.includes('display:') ||
         content.includes('.container');
}

function checkFile(filePath) {
  try {
    const ext = path.extname(filePath);
    const content = fs.readFileSync(filePath, 'utf8');
    
    if (!content || content.length === 0) return null;
    
    const issues = [];
    
    // .wxml 文件不应该包含 JS 代码特征
    if (ext === '.wxml' && isLikelyJsContent(content)) {
      issues.push('被覆盖为JS内容');
    }
    
    // .wxss 文件不应该包含 JS 代码特征
    if (ext === '.wxss' && isLikelyJsContent(content)) {
      issues.push('被覆盖为JS内容');
    }
    
    // .js 文件不应该包含明显的 wxss 内容
    if (ext === '.js' && isLikelyWxssContent(content) && !isLikelyJsContent(content)) {
      issues.push('可能被覆盖为样式内容');
    }
    
    return issues.length > 0 ? issues : null;
  } catch (e) {
    return ['读取失败'];
  }
}

// 遍历所有文件
const dirsToCheck = ['pages', 'utils', 'components', 'config'];

dirsToCheck.forEach(dir => {
  const fullDir = path.join(root, dir);
  if (!fs.existsSync(fullDir)) return;
  
  function walk(dirPath) {
    const files = fs.readdirSync(dirPath, { withFileTypes: true });
    files.forEach(f => {
      const fp = path.join(dirPath, f.name);
      if (f.isDirectory()) {
        walk(fp);
      } else {
        const ext = path.extname(f.name);
        if (['.js', '.wxml', '.wxss', '.json'].includes(ext)) {
          const issues = checkFile(fp);
          if (issues) {
            const relPath = path.relative(root, fp);
            console.log(`❌ ${relPath} — ${issues.join(', ')}`);
          }
        }
      }
    });
  }
  
  walk(fullDir);
});

console.log('=== 扫描完毕 ===');
