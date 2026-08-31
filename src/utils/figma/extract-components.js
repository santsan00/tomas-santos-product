/**
 * Extract Components from Figma
 * Generates React/Vue/HTML components from Figma frames
 */

const fs = require('fs');
const path = require('path');
const { FigmaClient } = require('./figma-client');

/**
 * Convert Figma node to HTML/CSS
 */
function figmaNodeToHTML(node, indent = 0) {
  const spaces = '  '.repeat(indent);
  let html = '';
  
  if (!node) return html;
  
  // Map Figma node types to HTML tags
  const typeMap = {
    FRAME: 'div',
    GROUP: 'div',
    RECTANGLE: 'div',
    TEXT: 'p',
    HEADING: 'h1',
    IMAGE: 'img',
    VECTOR: 'svg',
    BOOLEAN_OPERATION: 'div',
    LINE: 'hr',
    ELLIPSE: 'div',
    POLYGON: 'div'
  };
  
  const tag = typeMap[node.type] || 'div';
  
  // Generate class name from node name
  const className = node.name 
    ? `figma-${node.name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')}`
    : '';
  
  // Generate inline styles
  const styles = [];
  
  if (node.fills && node.fills.length > 0) {
    const fill = node.fills[0];
    if (fill.type === 'SOLID') {
      const { r, g, b, a } = fill.color;
      const color = `rgba(${Math.round(r * 255)}, ${Math.round(g * 255)}, ${Math.round(b * 255)}, ${a || 1})`;
      styles.push(`background-color: ${color}`);
    }
  }
  
  if (node.strokes && node.strokes.length > 0) {
    const stroke = node.strokes[0];
    if (stroke.type === 'SOLID') {
      const { r, g, b, a } = stroke.color;
      const color = `rgba(${Math.round(r * 255)}, ${Math.round(g * 255)}, ${Math.round(b * 255)}, ${a || 1})`;
      styles.push(`border-color: ${color}`);
      styles.push(`border-width: ${stroke.weight || 1}px`);
      styles.push(`border-style: solid`);
    }
  }
  
  if (node.cornerRadius) {
    styles.push(`border-radius: ${node.cornerRadius}px`);
  }
  
  if (node.size) {
    styles.push(`width: ${node.size.x}px`);
    styles.push(`height: ${node.size.y}px`);
  }
  
  if (node.absoluteBoundingBox) {
    const { x, y, width, height } = node.absoluteBoundingBox;
    styles.push(`position: absolute`);
    styles.push(`left: ${x}px`);
    styles.push(`top: ${y}px`);
    styles.push(`width: ${width}px`);
    styles.push(`height: ${height}px`);
  }
  
  if (node.characters && tag === 'p') {
    // Text node
    const styleObj = node.style || {};
    
    if (styleObj.fontFamily) {
      styles.push(`font-family: ${styleObj.fontFamily}`);
    }
    if (styleObj.fontSize) {
      styles.push(`font-size: ${styleObj.fontSize}px`);
    }
    if (styleObj.fontWeight) {
      styles.push(`font-weight: ${styleObj.fontWeight}`);
    }
    if (styleObj.fill) {
      const { r, g, b, a } = styleObj.fill;
      const color = `rgba(${Math.round(r * 255)}, ${Math.round(g * 255)}, ${Math.round(b * 255)}, ${a || 1})`;
      styles.push(`color: ${color}`);
    }
    if (styleObj.textAlign) {
      styles.push(`text-align: ${styleObj.textAlign}`);
    }
  }
  
  const styleStr = styles.length > 0 ? ` style="${styles.join('; ')}"` : '';
  const classStr = className ? ` class="${className}"` : '';
  
  // Open tag
  html += `${spaces}<${tag}${classStr}${styleStr}`;
  
  // Self-closing tags
  if (['img', 'hr', 'svg'].includes(tag)) {
    html += '/>';
  } else {
    html += '>';
    
    // Handle text content
    if (node.characters && tag !== 'img') {
      html += node.characters;
    }
    
    // Handle children
    if (node.children) {
      html += '\n';
      node.children.forEach(child => {
        html += figmaNodeToHTML(child, indent + 1);
      });
      html += `${spaces}`;
    }
    
    // Close tag
    html += `</${tag}>`;
  }
  
  return html + '\n';
}

/**
 * Extract components from Figma file
 */
async function extractComponents() {
  const client = new FigmaClient();
  const outputDir = process.env.COMPONENTS_OUTPUT || 'src/components/figma';
  
  try {
    // Ensure output directory exists
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }
    
    // Get file data
    const fileData = await client.getFile();
    const { document } = fileData;
    
    // Get components
    const componentsData = await client.getComponents();
    const { meta } = componentsData;
    
    // Find all frames that look like components
    const components = [];
    
    function traverse(node, parentPath = '') {
      if (node.document && node.document.children) {
        node.document.children.forEach(n => traverse(n, parentPath));
      }
      
      if (node.children) {
        node.children.forEach(n => traverse(n, `${parentPath}/${node.name || node.id}`));
      }
      
      // Check if this is a component or has component-like properties
      const isComponent = node.component || 
                         (node.name && (node.name.includes('Component') || 
                                        node.name.includes('Button') || 
                                        node.name.includes('Card') || 
                                        node.name.includes('Header') ||
                                        node.name.includes('Footer')));
      
      if (isComponent && node.absoluteBoundingBox) {
        components.push({
          id: node.id,
          name: node.name || `Component-${node.id}`,
          node: node,
          path: parentPath
        });
      }
    }
    
    if (document && document.children) {
      document.children.forEach(node => traverse(node));
    }
    
    console.log(`Found ${components.length} components`);
    
    // Generate HTML files for each component
    for (const component of components) {
      const safeName = component.name
        .toLowerCase()
        .replace(/\s+/g, '-')
        .replace(/[^a-z0-9-]/g, '')
        .substring(0, 50);
      
      const outputPath = path.join(outputDir, `${safeName}.html`);
      
      const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${component.name}</title>
  <link rel="stylesheet" href="../../styles/design-tokens.css">
</head>
<body>
  ${figmaNodeToHTML(component.node, 2)}
</body>
</html>`;
      
      fs.writeFileSync(outputPath, html);
      console.log(`  ✓ Generated: ${safeName}.html`);
    }
    
    // Also generate a combined components file
    const allComponentsHTML = components.map(c => {
      const safeName = c.name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
      return `<!-- ===== ${c.name} ===== -->
${figmaNodeToHTML(c.node, 2)}`;
    }).join('\n\n');
    
    const allOutputPath = path.join(outputDir, 'all-components.html');
    fs.writeFileSync(allOutputPath, allComponentsHTML);
    console.log(`  ✓ Generated: all-components.html`);
    
    return components.length;

  } catch (error) {
    console.error('Error extracting components:', error.message);
    throw error;
  }
}

module.exports = { extractComponents };
