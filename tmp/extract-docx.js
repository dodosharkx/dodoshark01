const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

function extractDocx(docxPath, extractDir) {
    if (!fs.existsSync(extractDir)) {
        fs.mkdirSync(extractDir, { recursive: true });
    }
    
    // Copy to zip and unzip
    const zipPath = docxPath.replace('.docx', '.zip');
    fs.copyFileSync(docxPath, zipPath);
    
    try {
        // Use powershell to unzip on windows
        execSync(`powershell Expand-Archive -Path "${zipPath}" -DestinationPath "${extractDir}" -Force`);
    } catch (e) {
        console.error('Error unzipping:', e);
    } finally {
        fs.unlinkSync(zipPath);
    }
    
    const documentXmlPath = path.join(extractDir, 'word', 'document.xml');
    if (!fs.existsSync(documentXmlPath)) {
        throw new Error('Could not find word/document.xml');
    }
    
    const xml = fs.readFileSync(documentXmlPath, 'utf8');
    
    // Simple regex to extract text from <w:t> tags
    const matches = xml.match(/<w:t[^>]*>(.*?)<\/w:t>/g);
    if (!matches) return '';
    
    let text = '';
    // Group by paragraphs <w:p>
    const paragraphs = xml.split('</w:p>');
    for (const p of paragraphs) {
        const tMatches = p.match(/<w:t[^>]*>(.*?)<\/w:t>/g);
        if (tMatches) {
            text += tMatches.map(m => m.replace(/<[^>]+>/g, '')).join('') + '\n';
        }
    }
    
    return text;
}

const docxFiles = [
    'solutions/grains-and-beans-grinding-solution/grains-and-beans-grinding-solution.docx',
    'solutions/soaked-rice-grinding-solution/soaked-rice-grinding-solution.docx',
    'solutions/corn-grinding-solution/corn-grinding-solution.docx',
    'solutions/powder-mixing-solution/powder-mixing-solution.docx'
];

docxFiles.forEach(file => {
    const fullPath = path.resolve(process.argv[2] || '.', file);
    if (fs.existsSync(fullPath)) {
        const name = path.basename(file, '.docx');
        const extractDir = path.join('tmp', name);
        try {
            const text = extractDocx(fullPath, extractDir);
            fs.writeFileSync(path.join('tmp', `${name}.txt`), text);
            console.log(`Extracted ${file} to tmp/${name}.txt`);
        } catch (e) {
            console.error(`Failed to extract ${file}:`, e.message);
        }
    } else {
        console.error(`File not found: ${fullPath}`);
    }
});
