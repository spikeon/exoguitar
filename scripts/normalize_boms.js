const fs = require('fs');
const path = require('path');

const rootPath = path.join(__dirname, '..');
const modelsPath = path.join(rootPath, 'models');

function transformLine(line) {
  // Keep header as-is
  if (/^\s*Qty\b/i.test(line)) return line;

  const match = line.match(/^(\s*\d+\s+)(.+?)(\s{2,}\S+.*)?\s*$/);
  if (!match) return line;

  const [, qtyAndSpace, rawName, urlPart = ''] = match;
  let name = rawName;

  // Ensure M1–M8 screws/nuts use uppercase M in the name
  name = name.replace(/\bm([1-8])/g, 'M$1');

  // Expand common head-style abbreviations (FHSC is typo for FHCS)
  name = name.replace(/\bFHCS\b/g, 'Flat Head Screw');
  name = name.replace(/\bFHSC\b/g, 'Flat Head Screw');
  name = name.replace(/\bBHCS\b/g, 'Button Head Screw');
  name = name.replace(/\bSHCS\b/g, 'Socket Head Screw');

  return `${qtyAndSpace}${name}${urlPart}`.trimEnd();
}

function processBOM(filePath) {
  const original = fs.readFileSync(filePath, 'utf8');
  const lines = original.split(/\r?\n/);
  const updatedLines = lines.map(transformLine);
  const updated = updatedLines.join('\n');

  if (updated !== original) {
    fs.writeFileSync(filePath, updated, 'utf8');
    console.log(`Updated ${path.relative(rootPath, filePath)}`);
  }
}

function walk(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      walk(fullPath);
    } else if (entry.isFile() && entry.name === 'BOM.txt') {
      processBOM(fullPath);
    }
  }
}

walk(modelsPath);
console.log('Done normalizing BOM files.');

