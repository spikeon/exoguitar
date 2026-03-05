const fs = require('fs');
const path = require('path');

const rootPath = path.join(__dirname, '..');
const modelsPath = path.join(rootPath, 'models');

const QTY_WIDTH = 4;
const OPTIONAL_WIDTH = 5;

function parseBOMLines(content) {
  const lines = content.split(/\r?\n/);
  const rows = [];

  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed) continue;
    if (/^\s*Qty\b/i.test(line)) continue;

    if (!/^\d{1,4}\b/.test(trimmed)) continue;

    const cols = trimmed.split(/\t+|\s{2,}/);
    if (cols.length < 2) continue;

    const qty = cols[0].trim();
    const name = cols[1].trim();
    let url = '';
    let optional = 'false';

    for (const token of cols.slice(2)) {
      if (/^https?:\/\//i.test(token)) url = token.trim();
      else if (/^(true|false)$/i.test(token)) optional = token.toLowerCase();
    }

    rows.push({ qty, name, url, optional });
  }

  return rows;
}

function formatBOM(filePath) {
  const original = fs.readFileSync(filePath, 'utf8');
  const lines = original.split(/\r?\n/);

  const headerLine = lines.find((l) => /^\s*Qty\b/i.test(l));
  const rows = parseBOMLines(original);
  if (!rows.length) return;

  const nameWidth = Math.max(4, ...rows.map((r) => r.name.length));
  const urlWidth = Math.max(10, ...rows.map((r) => r.url.length));

  const out = [];
  out.push(
    'Qty'.padEnd(QTY_WIDTH) +
      '  ' +
      'Name'.padEnd(nameWidth) +
      '  ' +
      'Url'.padEnd(urlWidth) +
      '  ' +
      'Optional'
  );

  for (const r of rows) {
    out.push(
      r.qty.padStart(QTY_WIDTH) +
        '  ' +
        r.name.padEnd(nameWidth) +
        '  ' +
        r.url.padEnd(urlWidth) +
        '  ' +
        r.optional
    );
  }

  const updated = out.join('\n') + (original.endsWith('\n') ? '\n' : '');
  if (updated !== original) {
    fs.writeFileSync(filePath, updated, 'utf8');
    console.log(`Formatted ${path.relative(rootPath, filePath)}`);
  }
}

function walk(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      walk(fullPath);
    } else if (entry.isFile() && entry.name === 'BOM.txt') {
      formatBOM(fullPath);
    }
  }
}

walk(modelsPath);
console.log('Done formatting BOM columns.');
