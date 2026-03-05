const fs = require('fs');
const path = require('path');

const rootPath = path.join(__dirname, '..');
const modelsPath = path.join(rootPath, 'models');

function processBOM(filePath) {
  const original = fs.readFileSync(filePath, 'utf8');
  const lines = original.split(/\r?\n/);

  if (!lines.length) return;

  const result = [];
  let headerProcessed = false;

  for (const line of lines) {
    if (!headerProcessed && /^\s*Qty\b/i.test(line)) {
      // Standardize header to include Optional column
      result.push('Qty\tName\tUrl\tOptional');
      headerProcessed = true;
      continue;
    }

    if (!line.trim()) {
      result.push(line);
      continue;
    }

    const trimmed = line.trim();

    // Skip non-data lines
    if (!/^\d/.test(trimmed)) {
      result.push(line);
      continue;
    }

    // Split on tabs or 2+ spaces to find logical columns
    const cols = trimmed.split(/\t+|\s{2,}/);
    if (cols.length < 2) {
      result.push(line);
      continue;
    }

    let [qty, name, ...rest] = cols;
    let url = '';
    let optional = false;

    for (const token of rest) {
      if (/^https?:\/\//i.test(token)) {
        url = token;
      } else if (/^(true|false)$/i.test(token)) {
        optional = token.toLowerCase() === 'true';
      }
    }

    // If the name text itself indicates optional, move that into the Optional column
    if (/\boptional\b/i.test(name)) {
      optional = true;
      name = name
        .replace(/\(\s*optional\s*\)/gi, '')
        .replace(/\s*[-–]\s*optional\b/gi, '')
        .replace(/\boptional\b/gi, '')
        .replace(/\s{2,}/g, ' ')
        .trim();
    }

    const outCols = [qty, name];
    if (url) outCols.push(url);
    outCols.push(optional ? 'true' : 'false');

    result.push(outCols.join('\t'));
  }

  const updated = result.join('\n');
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
console.log('Done adding Optional column to BOM files.');

