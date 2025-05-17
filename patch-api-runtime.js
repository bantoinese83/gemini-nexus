const fs = require('fs');
const path = require('path');

const apiRoot = path.join(__dirname, 'demo/src/app/api/gemini');

function patchFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  if (!content.includes('export const runtime = "nodejs";')) {
    content = 'export const runtime = "nodejs";\n' + content;
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`Patched: ${filePath}`);
  }
}

function walk(dir) {
  fs.readdirSync(dir, { withFileTypes: true }).forEach(entry => {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      walk(fullPath);
    } else if (entry.isFile() && entry.name === 'route.ts') {
      patchFile(fullPath);
    }
  });
}

walk(apiRoot);
console.log('✅ All API routes patched with Node.js runtime!'); 