/**
 * ExoGuitar Missing Documentation Checker
 * 
 * Scans the models directory and generates a checklist of parts missing documentation.
 * Creates MISSING_DOCS_CHECKLIST.md with organized findings.
 */

const fs = require('fs');
const path = require('path');

// Configuration
const modelsPath = path.join(__dirname, '..', 'models');
const outputFile = path.join(__dirname, '..', 'MISSING_DOCS_CHECKLIST.md');

// Data structures for categorizing parts
const partsData = {
    missingBoth: [],
    missingBOM: [],
    missingAssembly: [],
    complete: []
};

/**
 * Check if a file exists and contains meaningful content
 */
function checkFileStatus(filePath, fileType) {
    if (!fs.existsSync(filePath)) {
        return { exists: false, empty: false, hasContent: false };
    }
    
    try {
        const content = fs.readFileSync(filePath, 'utf8');
        const trimmedContent = content.trim();
        
        if (trimmedContent === '') {
            return { exists: true, empty: true, hasContent: false };
        }
        
        // Check for meaningful content based on file type
        let hasContent = false;
        
        if (fileType === 'BOM') {
            hasContent = checkBOMContent(trimmedContent);
        } else if (fileType === 'ASSEMBLY') {
            hasContent = checkAssemblyContent(trimmedContent);
        }
        
        return { 
            exists: true, 
            empty: false, 
            hasContent: hasContent 
        };
    } catch (error) {
        return { exists: false, empty: false, hasContent: false };
    }
}

/**
 * Check if BOM.txt contains actual items (not just headers)
 */
function checkBOMContent(content) {
    const lines = content.split('\n').map(line => line.trim()).filter(line => line);
    
    // If file is very small, consider it empty
    if (content.length < 50) {
        return false;
    }
    
    // Count non-header lines that look like BOM items
    let itemCount = 0;
    
    for (const line of lines) {
        // Skip empty lines and obvious headers
        if (!line || 
            line.toLowerCase().includes('qty') || 
            line.toLowerCase().includes('name') ||
            line.toLowerCase().includes('url') ||
            line.startsWith('#') ||
            line.startsWith('//')) {
            continue;
        }
        
        // Check if line starts with a number (quantity)
        if (/^\d+/.test(line)) {
            itemCount++;
        }
    }
    
    return itemCount > 0;
}

/**
 * Check if ASSEMBLY.md contains actual assembly steps
 */
function checkAssemblyContent(content) {
    // If file is very small, consider it empty
    if (content.length < 100) {
        return false;
    }
    
    const lines = content.split('\n').map(line => line.trim()).filter(line => line);
    
    // Count meaningful lines (not just headers or empty placeholder content)
    let meaningfulLines = 0;
    
    for (const line of lines) {
        // Skip empty lines and basic headers
        if (!line || 
            line === '# Assembly' ||
            line === '## Assembly' ||
            line === '# ASSEMBLY' ||
            line === '## ASSEMBLY') {
            continue;
        }
        
        // Count lines that contain actual content
        if (line.length > 10) { // Arbitrary threshold for meaningful content
            meaningfulLines++;
        }
    }
    
    return meaningfulLines > 0;
}

/**
 * Check if directory appears to be a part (not just a category folder)
 */
function isPartDirectory(dirPath, dirName) {
    try {
        const items = fs.readdirSync(dirPath);
        
        // Check for documentation files
        const hasBOM = items.includes('BOM.txt');
        const hasAssembly = items.includes('ASSEMBLY.md');

        // Handle Special Cases
        if(dirName == "Wing Sets") return false;
        if(dirName == "Interface") return false;
        if(dirName == "Blank") return false;

        if ((hasBOM || hasAssembly)) return true;

        // Check for 3D model files
        const has3DFiles = items.some(item => 
            item.match(/\.(stl|3mf|step)$/i)
        );
        
        // Check for exploded views folder
        const hasExplodedViews = items.includes('exploded views');
        
        // Check for photos folder
        const hasPhotos = items.includes('photos');
        
        return has3DFiles || hasExplodedViews || hasPhotos;
    } catch (error) {
        return false;
    }
}

/**
 * Scan directory recursively for parts
 */
function scanDirectory(dirPath, section, depth = 0) {
    if (depth > 3) return; // Prevent too deep recursion
    
    try {
        const items = fs.readdirSync(dirPath);
        
        for (const item of items) {
            if (item.startsWith('.')) continue; // Skip hidden files
            
            const itemPath = path.join(dirPath, item);
            const stat = fs.statSync(itemPath);
            
            if (stat.isDirectory()) {
                if (isPartDirectory(itemPath, item)) {
                    // This is a part - check its documentation
                    const bomPath = path.join(itemPath, 'BOM.txt');
                    const assemblyPath = path.join(itemPath, 'ASSEMBLY.md');
                    
                    const bomStatus = checkFileStatus(bomPath, 'BOM');
                    const assemblyStatus = checkFileStatus(assemblyPath, 'ASSEMBLY');
                    
                    const partInfo = {
                        name: item,
                        section: section,
                        path: path.relative(modelsPath, itemPath),
                        bomEmpty: bomStatus.exists && !bomStatus.hasContent,
                        assemblyEmpty: assemblyStatus.exists && !assemblyStatus.hasContent
                    };
                    
                    // Categorize the part based on documentation status
                    let hasMeaningfulBOM = bomStatus.exists && bomStatus.hasContent;
                    let hasMeaningfulAssembly = assemblyStatus.exists && assemblyStatus.hasContent;

                    // Wing Sets have a default BOM and Assembly file. 
                    if(bomPath.includes("Wing Sets")){
                        hasMeaningfulAssembly = true;
                        hasMeaningfulBOM = true;
                    }
                    
                    if (!hasMeaningfulBOM && !hasMeaningfulAssembly) {
                        partsData.missingBoth.push(partInfo);
                    } else if (!hasMeaningfulBOM && hasMeaningfulAssembly) {
                        partsData.missingBOM.push(partInfo);
                    } else if (hasMeaningfulBOM && !hasMeaningfulAssembly) {
                        partsData.missingAssembly.push(partInfo);
                    } else {
                        partsData.complete.push(partInfo);
                    }
                } else {
                    // Check subdirectories
                    scanDirectory(itemPath, section, depth + 1);
                }
            }
        }
    } catch (error) {
        console.warn(`Warning: Could not scan directory ${dirPath}: ${error.message}`);
    }
}

/**
 * Group parts by section for organized output
 */
function groupBySection(parts) {
    const grouped = {};
    
    for (const part of parts) {
        if (!grouped[part.section]) {
            grouped[part.section] = [];
        }
        grouped[part.section].push(part);
    }
    
    return grouped;
}

/**
 * Generate markdown checklist section
 */
function generateSection(title, parts) {
    if (parts.length === 0) return '';
    
    const grouped = groupBySection(parts);
    const sections = Object.keys(grouped).sort();
    
    let markdown = `## ${title}\n`;
    
    for (const section of sections) {
        markdown += `### ${section}\n`;
        
        for (const part of grouped[section]) {
            let note = '';
            
            // Add notes for empty files
            if (title.includes('Missing Only BOM') && part.bomEmpty) {
                note = ' (empty BOM.txt file)';
            } else if (title.includes('Missing Only ASSEMBLY') && part.assemblyEmpty) {
                note = ' (empty ASSEMBLY.md file)';
            } else if (title.includes('Missing Both')) {
                const emptyNotes = [];
                if (part.bomEmpty) emptyNotes.push('empty BOM.txt');
                if (part.assemblyEmpty) emptyNotes.push('empty ASSEMBLY.md');
                if (emptyNotes.length > 0) {
                    note = ` (has ${emptyNotes.join(' and ')})`;
                }
            }
            
            markdown += `- [ ] ${part.name}${note}\n`;
        }
        markdown += '\n';
    }
    
    return markdown;
}

/**
 * Generate the complete markdown checklist
 */
function generateMarkdown() {
    const timestamp = new Date().toISOString();
    
    let markdown = `# Missing Documentation Checklist\n`;
    markdown += `Generated: ${timestamp}\n\n`;
    
    markdown += generateSection('Parts Missing Both BOM.txt and ASSEMBLY.md', partsData.missingBoth);
    markdown += generateSection('Parts Missing Only BOM.txt', partsData.missingBOM);
    markdown += generateSection('Parts Missing Only ASSEMBLY.md', partsData.missingAssembly);
    
    if (partsData.complete.length > 0) {
        markdown += `## ✅ Parts With Complete Documentation\n`;
        markdown += `${partsData.complete.length} parts have both BOM.txt and ASSEMBLY.md files.\n\n`;
    }
    
    return markdown;
}

/**
 * Print summary to console
 */
function printSummary() {
    const total = partsData.missingBoth.length + 
                  partsData.missingBOM.length + 
                  partsData.missingAssembly.length + 
                  partsData.complete.length;
    
    // Count empty files for additional info
    let emptyBOMCount = 0;
    let emptyAssemblyCount = 0;
    
    [...partsData.missingBoth, ...partsData.missingBOM, ...partsData.missingAssembly].forEach(part => {
        if (part.bomEmpty) emptyBOMCount++;
        if (part.assemblyEmpty) emptyAssemblyCount++;
    });
    
    console.log('\n📊 Documentation Status:');
    console.log(`- Complete documentation: ${partsData.complete.length} parts`);
    console.log(`- Missing both files: ${partsData.missingBoth.length} parts`);
    console.log(`- Missing only BOM: ${partsData.missingBOM.length} parts`);
    console.log(`- Missing only ASSEMBLY: ${partsData.missingAssembly.length} parts`);
    console.log(`Total parts found: ${total}`);
    
    if (emptyBOMCount > 0 || emptyAssemblyCount > 0) {
        console.log('\n📄 Empty Files Found:');
        if (emptyBOMCount > 0) console.log(`- Empty BOM.txt files: ${emptyBOMCount}`);
        if (emptyAssemblyCount > 0) console.log(`- Empty ASSEMBLY.md files: ${emptyAssemblyCount}`);
    }
}

/**
 * Main execution
 */
function main() {
    console.log('🔍 Scanning for missing documentation...\n');
    
    // Get all sections in models directory
    const sections = fs.readdirSync(modelsPath).filter(item => {
        const itemPath = path.join(modelsPath, item);
        return fs.statSync(itemPath).isDirectory() && !item.startsWith('.');
    });
    
    // Scan each section
    for (const section of sections) {
        console.log(`📁 Scanning section: ${section}`);
        const sectionPath = path.join(modelsPath, section);
        scanDirectory(sectionPath, section);
    }
    
    // Generate markdown checklist
    console.log('\n📝 Generating checklist...');
    const markdown = generateMarkdown();
    
    // Write to file
    fs.writeFileSync(outputFile, markdown);
    console.log(`✅ Checklist saved to: ${path.basename(outputFile)}`);
    
    // Print summary
    printSummary();
}

// Run if called directly
if (require.main === module) {
    main();
}

module.exports = { main };