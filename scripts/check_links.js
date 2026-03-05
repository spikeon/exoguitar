/**
 * Run markdown-link-check on all Markdown files (excluding node_modules).
 * Used in CI to catch broken links.
 */
const { execSync } = require('child_process');
const path = require('path');
const fs = require('fs');

const root = path.join(__dirname, '..');

function findMarkdownFiles(dir, list = []) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const full = path.join(dir, entry.name);
    if (entry.name === 'node_modules' || entry.name === '.git') continue;
    if (entry.isDirectory()) {
      findMarkdownFiles(full, list);
    } else if (entry.name.endsWith('.md')) {
      list.push(full);
    }
  }
  return list;
}

const configPath = path.join(root, '.markdown-link-check.json');
const configArg = fs.existsSync(configPath) ? `--config "${configPath}"` : '';
const files = findMarkdownFiles(root);
let failed = 0;
for (const file of files) {
  const rel = path.relative(root, file);
  try {
    execSync(`npx markdown-link-check ${configArg} "${rel}"`.trim(), {
      cwd: root,
      stdio: 'inherit',
    });
  } catch (e) {
    failed++;
  }
}
if (failed > 0) process.exit(1);
