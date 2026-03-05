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

  // Rename screw/nut hardware to: [Nut|Screw] - ([Type] -)? M[diameter](x[length])?
  const nutMatch = name.match(/^M(\d+(?:\.\d+)?)\s+(.*?)\s*Nut(s)?\s*$/i);
  if (nutMatch) {
    const diam = nutMatch[1];
    const type = nutMatch[2].trim().replace(/\s*-\s*$/, ''); // e.g. "T-" -> "T"
    if (/^Slide\s+In$/i.test(type)) name = `Nut - Slide In - M${diam}`;
    else if (/^Acorn$/i.test(type)) name = `Nut - Acorn - M${diam}`;
    else if (/^T$/i.test(type) || /^T-?Nuts?$/i.test(type)) name = `Nut - Slide In - M${diam}`;
    else if (!type || /^M\d+$/i.test(type)) name = `Nut - M${diam}`;
    else name = `Nut - ${type} - M${diam}`;
  } else {
    const screwMatch = name.match(/^M(\d+(?:\.\d+)?)x?(\d*)\s+(.*?)\s+Screw(s)?\s*$/i);
    if (screwMatch) {
      const diam = screwMatch[1];
      const len = screwMatch[2];
      const type = screwMatch[3].trim();
      const size = len ? `M${diam}x${len}` : `M${diam}`;
      const typeMap = {
        'Button Head': 'Button Head',
        'Flat Head': 'Flat Head',
        'Socket Head': 'Socket Head',
        'Grub': 'Grub',
        'Set': 'Set',
        'Nylon Tipped Set': 'Nylon Tipped Set',
      };
      const t = typeMap[type] || type;
      name = t ? `Screw - ${t} - ${size}` : `Screw - ${size}`;
    }
  }

  // T-nuts are slide-in nuts; fix if already in "Nut - T - M..." form
  if (/^Nut - T - M\d+/.test(name)) name = name.replace(/^Nut - T - /, 'Nut - Slide In - ');

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

