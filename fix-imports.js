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

// Function to update imports
function updateImports(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  
  // Replace GoogleGenAI imports
  const updatedContent = content
    .replace(/import\s*{\s*GoogleGenAI\s*}\s*from\s*'@google\/generative-ai'/g, "// Using stub implementation")
    .replace(/import\s*{\s*GenerativeModel\s*}\s*from\s*'@google\/generative-ai'/g, "// Using stub implementation")
    .replace(/private\s+client\s*:\s*GoogleGenAI/g, "private client: any")
    .replace(/constructor\(client\s*:\s*GoogleGenAI\)/g, "constructor(client: any)");
  
  if (content !== updatedContent) {
    fs.writeFileSync(filePath, updatedContent, 'utf8');
    console.log(`Updated imports in ${filePath}`);
    return true;
  }
  
  return false;
}

// Process all TypeScript files in the src directory
const srcDir = path.join(__dirname, 'src');
const files = findTypeScriptFiles(srcDir);
let fixedCount = 0;

files.forEach(file => {
  if (updateImports(file)) {
    fixedCount++;
  }
});

console.log(`\nUpdated imports in ${fixedCount} files.`); 