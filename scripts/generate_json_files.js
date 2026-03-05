/**
 * The Plan: 
 * 
 * This file will use Node.js code to generate the following in the docs folder
 * - A List of parts at parts.json
 * - A List of all unique bom items and total counts at unified_bom.json
 * - A Map of parts to bom items with counts at bom.json
 * - A folder structure containing the images and exploded views from each part, eg: {section_name}/{part_name}/{gallery|exploded}/{filename}
 * 
 * 
 * A GitHub action will be created to run this file before deploying the GitHub page
 * 
 * The GitHub page will be written to read from these files and generate a BOM based on the user's inputs
 */

/**
 *  Part {
 *      name: string
 *      section: string // Folder containing part folder
 *  }
 */

/**
 *  BillOfMaterialsItem {
 *      name: string
 *      amazon_url: string
 *      qty: int
 *      optional: boolean
 *  }
 */

const fs = require('fs');
const path = require('path');

/**
 * Factory for in-memory BOM + parts state.
 * Kept separate so tests can create and reset their own state.
 */
function createState() {
    return {
        parts: [],
        unifiedBOM: new Map(),
        partsBOM: {}
    };
}

/**
 * Normalize an item name into a stable aggregation key.
 * - Collapses whitespace
 * - Normalizes patterns like "M3 x 4 x 5" -> "M3x4x5"
 * - Lowercases
 * - Strips a single trailing "s" (Insert/Inserts, Nut/Nuts, Screw/Screws)
 */
function makeItemKey(name) {
    if (!name) return '';
    let n = name.replace(/\s+/g, ' ').trim();
    // Remove spaces around "x" when used as a separator between numbers
    // e.g. "M3 x 4 x 5" -> "M3x4x5"
    n = n.replace(/(\d)\s*x\s*(\d)/gi, '$1x$2');
    n = n.toLowerCase();
    // Strip a single trailing "s" to merge simple plurals
    n = n.replace(/s$/i, '');
    return n;
}

/**
 * Parse BOM.txt file.
 *
 * Expected format per data line (header rows are ignored):
 *   Qty  Name  Url  Optional
 *
 * - Columns are separated by tabs or 2+ spaces.
 * - Url and Optional are optional; Optional defaults to false when omitted.
 */
function parseBOMFile(filePath) {
    const bomItems = [];
    
    try {
        const content = fs.readFileSync(filePath, 'utf8');
        const lines = content.split(/\r?\n/);

        for (const line of lines) {
            const trimmed = line.trim();
            if (!trimmed) continue;
            if (/^\s*qty\b/i.test(line)) continue; // skip header

            // Data lines must start with a quantity number
            if (!/^\d{1,4}\b/.test(trimmed)) continue;

            // Split into logical columns: Qty, Name, Url?, Optional?
            const cols = trimmed.split(/\t+|\s{2,}/);
            if (cols.length < 2) continue;

            const qty = parseInt(cols[0], 10);
            if (!Number.isFinite(qty)) continue;

            const name = cols[1].trim();
            let amazon_url = '';
            let optional = false;

            const rest = cols.slice(2);
            for (const token of rest) {
                if (/^https?:\/\//i.test(token)) {
                    amazon_url = token.trim();
                } else if (/^(true|false)$/i.test(token)) {
                    optional = token.toLowerCase() === 'true';
                }
            }

            bomItems.push({
                qty,
                name,
                amazon_url,
                optional,
            });
        }
    } catch (error) {
        console.warn(`Warning: Could not parse BOM file ${filePath}: ${error.message}`);
    }
    
    return bomItems;
}

/**
 * Add item to unified BOM with quantity aggregation
 * 
 * TODO: This needs logic so that items from the same group don't get counted more than once.  If one head needs 3 M3x5 screws and another head needs 5, then this should end up with 5 and not 8.
 */
function addToUnifiedBOM(item, directory, state) {
    // Normalize name for better aggregation
    const normalizedName = item.name
        .replace(/\s+/g, ' ')  // Normalize whitespace
        .trim();
    
    const key = makeItemKey(normalizedName);
    
    if (state.unifiedBOM.has(key)) {
        const existing = state.unifiedBOM.get(key);
        existing.qty += item.qty;
        // Keep URL if we don't have one
        if (!existing.amazon_url && item.amazon_url) {
            existing.amazon_url = item.amazon_url;
        }
    } else {
        state.unifiedBOM.set(key, { 
            ...item,
            name: normalizedName  // Use normalized name
        });
    }

    if (!Object.prototype.hasOwnProperty.call(state.partsBOM, directory)) {
        state.partsBOM[directory] = [];
    }

    const existingIndex = state.partsBOM[directory].findIndex(
        (b) => makeItemKey(b.name) === key
    );

    if (existingIndex !== -1) {
        const existing = state.partsBOM[directory][existingIndex];
        existing.qty += item.qty;
        // Keep URL if we don't have one
        if (!existing.amazon_url && item.amazon_url) {
            existing.amazon_url = item.amazon_url;
        }
        state.partsBOM[directory][existingIndex] = existing;
    } else {
        state.partsBOM[directory].push({
            ...item,
            name: normalizedName  // Use normalized name
        });
    }

}

/**
 * Copy images from part directories
 */
function copyImages(partPath, section, partName, imagesOutputPath) {
    const imageDirs = ['exploded views', 'photos', 'gallery', 'pictures', 'Photos'];
    
    for (const imageDir of imageDirs) {
        const sourcePath = path.join(partPath, imageDir);
        
        if (fs.existsSync(sourcePath)) {
            const targetPath = path.join(imagesOutputPath, section, partName, imageDir.replace(' ', '_'));
            
            // Create target directory
            fs.mkdirSync(targetPath, { recursive: true });
            
            try {
                const files = fs.readdirSync(sourcePath);
                
                for (const file of files) {
                    if (file.match(/\.(jpg|jpeg|png|gif|svg|webp)$/i)) {
                        const sourceFile = path.join(sourcePath, file);
                        const targetFile = path.join(targetPath, file);
                        fs.copyFileSync(sourceFile, targetFile);
                    }
                }
                
                console.log(`  ✓ Copied images from ${imageDir} for ${section}/${partName}`);
            } catch (error) {
                console.warn(`  Warning: Could not copy images from ${sourcePath}: ${error.message}`);
            }
        }
    }
}

/**
 * Scan directory for parts (directories with BOM.txt or ASSEMBLY.md)
 */
function scanDirectory(dirPath, section, context) {
    const { modelsPath, imagesOutputPath, state, copyImagesFn = copyImages } = context;
    try {
        const items = fs.readdirSync(dirPath);
        
        for (const item of items) {
            if (item.startsWith('.')) continue; // Skip hidden files
            
            const itemPath = path.join(dirPath, item);
            const stat = fs.statSync(itemPath);

            
            if (stat.isDirectory()) {
                const bomPath = path.join(itemPath, 'BOM.txt');
                const assemblyPath = path.join(itemPath, 'ASSEMBLY.md');
                const metaPath = path.join(itemPath, 'meta.json');
                const thumbPath = path.join(itemPath, 'photos', 'thumb.wide.png');
                const hasBOM = fs.existsSync(bomPath);
                const hasThumb = fs.existsSync(thumbPath);
                const hasAssembly = fs.existsSync(assemblyPath);

                const hasMeta = fs.existsSync(metaPath);
                const meta = !hasMeta ? {} : JSON.parse(fs.readFileSync(metaPath, 'utf8'));

                const baseName = path.basename(itemPath);
                const isWingSetSection = section === 'Wing Sets';
                const isWingSetParentFolder = isWingSetSection && baseName === 'Wing Sets';
                const isWingSet = isWingSetSection && !isWingSetParentFolder;
                const isBlank = baseName === 'Blank';
                const isInterface = baseName === 'Interface';
                
                if ((hasBOM || hasAssembly || isWingSet) && !isWingSetParentFolder && !isBlank && !isInterface) {
                    // This is a part
                    const relativePath = path.relative(modelsPath, itemPath);
                    const partPath = relativePath.replace(/\\/g, '/');

                    
                    const part = {
                        name: item,
                        section: section,
                        path: partPath,
                        hasBOM: hasBOM,
                        hasAssembly: hasAssembly,
                        thumb: hasThumb
                            ? path.join(
                                'images',
                                thumbPath.replace(/\\/g, '/').split('/models')[1]
                              )
                            : undefined,
                        ...meta
                    };
                                        
                    // Parse BOM if exists
                    if (hasBOM) {
                        const bomItems = parseBOMFile(bomPath);
                        if (bomItems.length > 0) {
                            // Add to unified BOM
                            for (const bomItem of bomItems) {
                                addToUnifiedBOM(bomItem, partPath, state);
                            }
                        }
                    } 
                    if (isWingSet) {
                        part.hasBOM = true;
                        part.hasAssembly = true;

                        const bomItems = parseBOMFile(path.normalize(path.join(itemPath, '..', 'BOM.txt')));
                        
                        for (const bomItem of bomItems) {
                            addToUnifiedBOM(bomItem, partPath, state);
                        }
                    }

                    part.bom = state.partsBOM[partPath] ?? [];
                    
                    // Copy images (can be mocked in tests via copyImagesFn)
                    copyImagesFn(itemPath, section, item, imagesOutputPath);

                    state.parts.push(part);
                    console.log(`  Found part: ${section}/${item}`);
                } else {
                    // Check subdirectories
                    scanDirectory(itemPath, section, context);
                }
            }
        }
    } catch (error) {
        console.warn(`Warning: Could not scan directory ${dirPath}: ${error.message}`);
    }
}

/**
 * Main execution
 */
function main(options = {}) {
    const rootPath = options.rootPath || path.join(__dirname, '..');
    const modelsPath = options.modelsPath || path.join(rootPath, 'models');
    const outputPath = options.outputPath || path.join(rootPath, 'docs', 'src', 'data');
    const imagesOutputPath = options.imagesOutputPath || path.join(rootPath, 'docs', 'public', 'images');

    const state = createState();
    console.log('🚀 Starting ExoGuitar JSON generation...\n');
    
    // Create output directories
    fs.mkdirSync(outputPath, { recursive: true });
    fs.mkdirSync(imagesOutputPath, { recursive: true });
    
    // Scan models directory
    const sections = fs.readdirSync(modelsPath).filter(item => {
        const itemPath = path.join(modelsPath, item);
        return fs.statSync(itemPath).isDirectory() && !item.startsWith('.');
    }).filter((section) => {
        // Skip extras
        if(section.endsWith("Extras")) return false
        // Skip straps
        if(section.endsWith("Strap")) return false

        return true
    });

    const sectionsFileData = sections.map((name) => {
        const metaPath = path.join(modelsPath, name, "meta.json")
        const extraData = fs.existsSync(metaPath) ? JSON.parse(fs.readFileSync(metaPath)) : {}
        return {
            name,
            ...extraData
        }
    })
    
    for (const section of sections) {
        console.log(`📁 Scanning section: ${section}`);
        const sectionPath = path.join(modelsPath, section);
        scanDirectory(sectionPath, section, { modelsPath, imagesOutputPath, state });
    }
    
    // Update Readme.md
    console.log('\n🚀 Generate new Readme...');    
    const readmeTemplate = fs.readFileSync(path.join(rootPath,"README.template.md"));
    var readmeLinksSection = "## Makerworld Links \n";
    for (const section of sectionsFileData) {
        readmeLinksSection += `\n### ${section.name}\n\n`;
        state.parts.filter((p) => p.section === section.name).forEach((part) => {
            if(part.makerWorldUrl) readmeLinksSection += `- [${part.name}](${part.makerWorldUrl})\n`
            else readmeLinksSection += `- ${part.name} - Coming soon to MakerWorld!\n`
        })
    }
    const readme = readmeTemplate.toString().replace("[[GENERATED_MAKERWORLD_LINKS]]", readmeLinksSection);

    // Generate JSON files
    console.log('\n💾 Writing JSON files...');
    
    // Convert unified BOM to array
    const unifiedBOMArray = Array.from(state.unifiedBOM.values());

    // Backfill canonical names/URLs into per-part BOMs using unified map
    for (const [partPath, items] of Object.entries(state.partsBOM)) {
        state.partsBOM[partPath] = items.map((item) => {
            const key = makeItemKey(item.name);
            const canonical = state.unifiedBOM.get(key);
            if (canonical) {
                return {
                    ...item,
                    name: canonical.name,
                    amazon_url: canonical.amazon_url,
                };
            }
            return item;
        });
    }

    // Write files

    fs.writeFileSync(
        path.join(outputPath, 'sections.json'),
        JSON.stringify(sectionsFileData, null, 2)
    );

    fs.writeFileSync(
        path.join(outputPath, 'parts.json'),
        JSON.stringify(state.parts, null, 2)
    );
    
    fs.writeFileSync(
        path.join(outputPath, 'unified_bom.json'),
        JSON.stringify(unifiedBOMArray, null, 2)
    );
    
    fs.writeFileSync(
        path.join(outputPath, 'bom.json'),
        JSON.stringify(state.partsBOM, null, 2)
    );

    fs.writeFileSync(
        path.join(rootPath, "README.md"),
        readme
    )
    
    // Summary
    console.log(`\n✅ Generation complete!`);
    console.log(`  📊 Found ${state.parts.length} parts`);
    console.log(`  📊 ${unifiedBOMArray.length} unique BOM items`);
    console.log(`  📊 ${Object.keys(state.partsBOM).length} parts with BOMs`);
}

// Run if called directly
if (require.main === module) {
    main();
}

module.exports = {
    main,
    parseBOMFile,
    addToUnifiedBOM,
    copyImages,
    scanDirectory,
    createState,
    makeItemKey,
};