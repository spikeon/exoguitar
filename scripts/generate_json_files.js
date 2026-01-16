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

// Configuration
const rootPath = path.join(__dirname, '..');
const modelsPath = path.join(__dirname, '..', 'models');
const outputPath = path.join(__dirname, '..', 'docs', 'src', 'data');
const imagesOutputPath = path.join(__dirname, '..', 'docs', 'public', 'images');

// Data structures
const parts = [];
const unifiedBOM = new Map();
const partsBOM = {};

/**
 * Parse BOM.txt file - simple tab-separated format
 */
function parseBOMFile(filePath) {
    const bomItems = [];
    
    try {
        const content = fs.readFileSync(filePath, 'utf8');
        const regex = /^(?<qty>\d{1,4})[\s\t]{2,100}(?<name>(?:\w\s?)+)[\s\t]{0,100}(?<link>[^\s\t]*)[\s\t]{0,100}$/gm

        const matches = content.matchAll(regex);

        for(let {groups:{qty, name, link}} of matches){
            bomItems.push({
                qty: +qty,
                name: name.trim(),
                amazon_url: link,
                optional: false
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
function addToUnifiedBOM(item, directory) {
    // Normalize name for better aggregation
    const normalizedName = item.name
        .replace(/\s+/g, ' ')  // Normalize whitespace
        .trim()
        .replace(/s$/i, '');  // Remove trailing 's' for plurals
    
    const key = normalizedName.toLowerCase();
    
    if (unifiedBOM.has(key)) {
        const existing = unifiedBOM.get(key);
        existing.qty += item.qty;
        // Keep URL if we don't have one
        if (!existing.amazon_url && item.amazon_url) {
            existing.amazon_url = item.amazon_url;
        }
    } else {
        unifiedBOM.set(key, { 
            ...item,
            name: normalizedName  // Use normalized name
        });
    }

    if(!partsBOM.hasOwnProperty(directory)) partsBOM[directory] = [];
    const existingIndex = partsBOM[directory].findIndex((b) => b.name === normalizedName)
    console.log("Found Index: ", existingIndex)
    if(existingIndex != -1){
        const existing = partsBOM[directory][existingIndex];
        existing.qty += item.qty;
        // Keep URL if we don't have one
        if (!existing.amazon_url && item.amazon_url) {
            existing.amazon_url = item.amazon_url;
        }
        partsBOM[directory][existingIndex] = existing;
    } else {
        partsBOM[directory].push({
            ...item,
            name: normalizedName  // Use normalized name
        });
    }

}

/**
 * Copy images from part directories
 */
function copyImages(partPath, section, partName) {
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
function scanDirectory(dirPath, section) {
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
                const [,thumbUrl] = thumbPath.replace(/\\/g,'/').split("/models")

                const hasAssembly = fs.existsSync(assemblyPath);

                const hasMeta = fs.existsSync(metaPath)
                const meta = !hasMeta ? {} : JSON.parse(fs.readFileSync(metaPath))
                
                const isWingSet = bomPath.includes("Wing Sets")
                
                const isWingSetParentFolder = bomPath.endsWith("Wing Sets")
                const isBlank = bomPath.endsWith("Blank")
                const isInterface = bomPath.endsWith("Interface")
                
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
                        thumb: hasThumb ? path.join('images',thumbUrl) : undefined,
                        ...meta
                    };
                                        
                    // Parse BOM if exists
                    if (hasBOM) {
                        const bomItems = parseBOMFile(bomPath);
                        if (bomItems.length > 0) {
                            // Add to unified BOM
                            for (const bomItem of bomItems) {
                                addToUnifiedBOM(bomItem, partPath);
                            }
                        }
                    } 
                    if (isWingSet) {
                        part.hasBOM = true;
                        part.hasAssembly = true;

                        const bomItems = parseBOMFile(path.normalize(itemPath+"/../BOM.txt"))
                        
                        for(const bomItem of bomItems){
                            addToUnifiedBOM(bomItem, partPath)
                        }
                    }

                    part.bom = partsBOM[partPath] ?? [];
                    
                    // Copy images
                    copyImages(itemPath, section, item);

                    parts.push(part);
                    console.log(`  Found part: ${section}/${item}`);
                } else {
                    // Check subdirectories
                    scanDirectory(itemPath, section);
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
function main() {
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
        scanDirectory(sectionPath, section);
    }
    
    // Update Readme.md
    console.log('\n🚀 Generate new Readme...');    
    const readmeTemplate = fs.readFileSync(path.join(rootPath,"README.template.md"));
    var readmeLinksSection = "## Makerworld Links \n";
    for(const section of sectionsFileData){
        readmeLinksSection += `\n### ${section.name}\n\n`;
        parts.filter((p) => p.section === section.name).forEach((part) => {
            if(part.makerWorldUrl) readmeLinksSection += `- [${part.name}](${part.makerWorldUrl})\n`
            else readmeLinksSection += `- ${part.name} - Coming soon to MakerWorld!\n`
        })
    }
    const readme = readmeTemplate.toString().replace("[[GENERATED_MAKERWORLD_LINKS]]", readmeLinksSection);

    // Generate JSON files
    console.log('\n💾 Writing JSON files...');
    
    // Convert unified BOM to array
    const unifiedBOMArray = Array.from(unifiedBOM.values());
    
    // Write files

    fs.writeFileSync(
        path.join(outputPath, 'sections.json'),
        JSON.stringify(sectionsFileData, null, 2)
    );

    fs.writeFileSync(
        path.join(outputPath, 'parts.json'),
        JSON.stringify(parts, null, 2)
    );
    
    fs.writeFileSync(
        path.join(outputPath, 'unified_bom.json'),
        JSON.stringify(unifiedBOMArray, null, 2)
    );
    
    fs.writeFileSync(
        path.join(outputPath, 'bom.json'),
        JSON.stringify(partsBOM, null, 2)
    );

    fs.writeFileSync(
        path.join(rootPath, "README.md"),
        readme
    )
    
    // Summary
    console.log(`\n✅ Generation complete!`);
    console.log(`  📊 Found ${parts.length} parts`);
    console.log(`  📊 ${unifiedBOMArray.length} unique BOM items`);
    console.log(`  📊 ${Object.keys(partsBOM).length} parts with BOMs`);
}

// Run if called directly
if (require.main === module) {
    main();
}

module.exports = { main };