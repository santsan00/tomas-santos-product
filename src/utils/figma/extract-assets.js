/**
 * Extract Assets from Figma
 * Downloads images and SVGs from Figma frames
 */

const fs = require('fs');
const path = require('path');
const axios = require('axios');
const { FigmaClient } = require('./figma-client');

/**
 * Download an image from a URL
 */
async function downloadImage(url, outputPath) {
  try {
    const response = await axios.get(url, {
      responseType: 'arraybuffer'
    });
    
    // Ensure directory exists
    const dirname = path.dirname(outputPath);
    if (!fs.existsSync(dirname)) {
      fs.mkdirSync(dirname, { recursive: true });
    }
    
    fs.writeFileSync(outputPath, response.data);
    return true;
  } catch (error) {
    console.error(`Error downloading ${url}:`, error.message);
    return false;
  }
}

/**
 * Extract all exportable assets from Figma file
 */
async function extractAssets() {
  const client = new FigmaClient();
  const outputDir = process.env.ASSETS_OUTPUT || 'public/assets';
  
  try {
    // Get file data
    const fileData = await client.getFile();
    const { document, meta } = fileData;
    
    // Find all nodes with export settings
    const nodesToExport = [];
    
    function traverse(node) {
      if (node.document && node.document.children) {
        node.document.children.forEach(traverse);
      }
      
      if (node.children) {
        node.children.forEach(traverse);
      }
      
      // Check if this node has export settings
      if (node.exportSettings && node.exportSettings.length > 0) {
        nodesToExport.push({
          id: node.id,
          name: node.name || `asset-${node.id}`,
          exportSettings: node.exportSettings
        });
      }
    }
    
    // Start traversal from the document root
    if (document && document.children) {
      document.children.forEach(traverse);
    }
    
    if (nodesToExport.length === 0) {
      console.log('No exportable assets found in Figma file');
      return;
    }
    
    console.log(`Found ${nodesToExport.length} exportable assets`);
    
    // Get image URLs for all nodes
    const nodeIds = nodesToExport.map(n => n.id);
    const imagesData = await client.getImages(nodeIds, 'png', 2); // PNG at 2x scale
    
    // Download each asset
    let downloadedCount = 0;
    
    for (const asset of nodesToExport) {
      const imageUrl = imagesData.images[asset.id];
      if (!imageUrl) continue;
      
      // Create a safe filename
      const ext = asset.exportSettings[0].format?.toLowerCase() || 'png';
      const safeName = asset.name
        .toLowerCase()
        .replace(/\s+/g, '-')
        .replace(/[^a-z0-9-_.]/g, '')
        .substring(0, 100);
      
      const outputPath = path.join(outputDir, `${safeName}.${ext}`);
      
      const success = await downloadImage(imageUrl, outputPath);
      if (success) {
        console.log(`  ✓ Downloaded: ${safeName}.${ext}`);
        downloadedCount++;
      }
    }
    
    console.log(`✓ Downloaded ${downloadedCount} assets to ${outputDir}`);
    
    // Also check for SVG exports
    const svgImagesData = await client.getImages(nodeIds, 'svg', 1);
    
    for (const asset of nodesToExport) {
      const hasSvgExport = asset.exportSettings.some(s => s.format?.toLowerCase() === 'svg');
      if (!hasSvgExport) continue;
      
      const imageUrl = svgImagesData.images[asset.id];
      if (!imageUrl) continue;
      
      const safeName = asset.name
        .toLowerCase()
        .replace(/\s+/g, '-')
        .replace(/[^a-z0-9-_.]/g, '')
        .substring(0, 100);
      
      const outputPath = path.join(outputDir, `${safeName}.svg`);
      
      const success = await downloadImage(imageUrl, outputPath);
      if (success) {
        console.log(`  ✓ Downloaded SVG: ${safeName}.svg`);
        downloadedCount++;
      }
    }
    
    return downloadedCount;

  } catch (error) {
    console.error('Error extracting assets:', error.message);
    throw error;
  }
}

module.exports = { extractAssets };
