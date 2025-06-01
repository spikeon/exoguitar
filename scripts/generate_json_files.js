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
const modelsPath = path.join(__dirname, '..', 'models');
const outputPath = path.join(__dirname, '..', 'docs', 'src', 'data');
const imagesOutputPath = path.join(__dirname, '..', 'docs', 'src', 'images');

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
        const lines = content.split('\n').filter(line => line.trim());
        
        for (const line of lines) {
            // Skip empty lines and headers
            if (!line.trim() || line.toLowerCase().includes('qty')) continue;
            
            // Parse tab-separated: qty \t name \t url
            // Filter out empty parts caused by multiple tabs
            const parts = line.split('\t').map(p => p.trim()).filter(p => p !== '');
            
            if (parts.length >= 2) {
                const qty = parseInt(parts[0]);
                if (!isNaN(qty)) {
                    bomItems.push({
                        qty: qty,
                        name: parts[1],
                        amazon_url: parts[2] && parts[2] !== '' ? parts[2] : '',
                        optional: false
                    });
                }
            }
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
function addToUnifiedBOM(item) {
    // Normalize name for better aggregation
    const normalizedName = item.name
        .replace(/s$/i, '')  // Remove trailing 's' for plurals
        .replace(/\s+/g, ' ')  // Normalize whitespace
        .trim();
    
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
}

/**
 * Copy images from part directories
 */
function copyImages(partPath, section, partName) {
    const imageDirs = ['exploded views', 'photos', 'gallery'];
    
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
                const hasBOM = fs.existsSync(bomPath);
                const hasAssembly = fs.existsSync(assemblyPath);
                
                const isWingSet = bomPath.includes("Wing Sets")
                
                const isWingSetParentFolder = bomPath.endsWith("Wing Sets")
                const isBlank = bomPath.endsWith("Blank")
                const isInterface = bomPath.endsWith("Interface")
                
                if ((hasBOM || hasAssembly) && !isWingSetParentFolder && !isBlank && !isInterface) {
                    // This is a part
                    const relativePath = path.relative(modelsPath, itemPath);
                    const partPath = relativePath.replace(/\\/g, '/');
                    
                    const part = {
                        name: item,
                        section: section,
                        path: partPath,
                        hasBOM: hasBOM,
                        hasAssembly: hasAssembly
                    };
                    
                    parts.push(part);
                    console.log(`  Found part: ${section}/${item}`);
                    
                    // Parse BOM if exists
                    if (hasBOM) {
                        const bomItems = parseBOMFile(bomPath);
                        if (bomItems.length > 0) {
                            partsBOM[partPath] = bomItems;
                            
                            // Add to unified BOM
                            for (const bomItem of bomItems) {
                                addToUnifiedBOM(bomItem);
                            }
                        }
                        if(isWingSet){
                            const bomItems = parseBOMFile(path.normalize(bomPath+"/.."))
                            
                            partsBOM[partPath] = [... partsBOM[partPath], ...bomItems] || [];
                            
                            for(const bomItem of bomItems){
                                addToUnifiedBOM(bomItem)
                            }                            
                        }
                    } else if (isWingSet) {
                        part.hasBOM = true;
                        part.hasAssembly = true;

                        const bomItems = parseBOMFile(path.normalize(bomPath+"/.."))
                        
                        partsBOM[partPath] = bomItems || [];
                        
                        for(const bomItem of bomItems){
                            addToUnifiedBOM(bomItem)
                        }
                    }
                    
                    // Copy images
                    copyImages(itemPath, section, item);
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
    });
    
    for (const section of sections) {
        console.log(`📁 Scanning section: ${section}`);
        const sectionPath = path.join(modelsPath, section);
        scanDirectory(sectionPath, section);
    }
    
    // Generate JSON files
    console.log('\n💾 Writing JSON files...');
    
    // Convert unified BOM to array
    const unifiedBOMArray = Array.from(unifiedBOM.values());
    
    // Write files
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