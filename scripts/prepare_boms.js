/**
 * Single entry point for BOM preparation. Run this after editing BOM.txt files
 * to normalize names (M1–M8, FHCS/BHCS/SHCS), ensure Optional column exists,
 * and align columns for the editor. Order: normalize → add optional → format.
 */
const { execSync } = require('child_process');
const path = require('path');

const root = path.join(__dirname, '..');
const run = (script) => execSync(`node "${path.join(__dirname, script)}"`, { cwd: root, stdio: 'inherit' });

console.log('Running BOM normalization (M1–M8, FHCS/BHCS/SHCS/FHSC)...');
run('normalize_boms.js');

console.log('\nEnsuring Optional column and moving (optional) from names...');
run('add_optional_column.js');

console.log('\nFormatting BOM columns for editor alignment...');
run('format_bom_columns.js');

console.log('\n✅ BOM preparation complete.');
