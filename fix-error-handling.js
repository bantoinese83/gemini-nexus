const fs = require('fs');
const path = require('path');

// Helper to find all TypeScript files in a directory
function findTypeScriptFiles(dir, fileList = []) {
  const files = fs.readdirSync(dir);
  
  files.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    
    if (stat.isDirectory()) {
      findTypeScriptFiles(filePath, fileList);
    } else if (file.endsWith('.ts')) {
      fileList.push(filePath);
    }
  });
  
  return fileList;
}

// Fix error.message to use proper type checking
function fixErrorHandling(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  
  // Replace error.message with proper type checking
  const replacedContent = content.replace(
    /(\s*throw new Error\(.*)\$\{error\.message\}/g,
    '$1${error instanceof Error ? error.message : String(error)}'
  );
  
  if (content !== replacedContent) {
    fs.writeFileSync(filePath, replacedContent, 'utf8');
    console.log(`Fixed error handling in ${filePath}`);
    return true;
  }
  
  return false;
}

// Process all TypeScript files in the src directory
const srcDir = path.join(__dirname, 'src');
const files = findTypeScriptFiles(srcDir);
let fixedCount = 0;

files.forEach(file => {
  if (fixErrorHandling(file)) {
    fixedCount++;
  }
});

console.log(`\nFixed error handling in ${fixedCount} files.`); 