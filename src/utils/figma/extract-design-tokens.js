/**
 * Extract Design Tokens from Figma
 * Converts Figma styles to CSS custom properties and design tokens
 */

const fs = require('fs');
const path = require('path');
const { FigmaClient } = require('./figma-client');

/**
 * Convert Figma color to hex
 */
function figmaColorToHex(color) {
  if (!color) return null;
  
  const { r, g, b, a } = color;
  const toHex = (c) => {
    const hex = Math.round(c * 255).toString(16);
    return hex.length === 1 ? '0' + hex : hex;
  };
  
  const hex = `#${toHex(r)}${toHex(g)}${toHex(b)}`;
  const alpha = a !== undefined ? Math.round(a * 100) / 100 : 1;
  
  return { hex, alpha };
}

/**
 * Convert Figma typography to CSS
 */
function figmaTypographyToCSS(style) {
  if (!style) return null;
  
  const fontFamily = style.fontFamily || 'Inter';
  const fontSize = style.fontSize ? `${style.fontSize}px` : '16px';
  const fontWeight = style.fontWeight || 400;
  const lineHeight = style.lineHeightPx ? `${style.lineHeightPx}px` : 'normal';
  const letterSpacing = style.letterSpacing ? `${style.letterSpacing}px` : '0';
  const textTransform = style.textTransform || 'none';
  const textDecoration = style.textDecoration || 'none';
  
  return {
    fontFamily,
    fontSize,
    fontWeight,
    lineHeight,
    letterSpacing,
    textTransform,
    textDecoration
  };
}

/**
 * Extract and generate CSS custom properties
 */
async function extractDesignTokens() {
  const client = new FigmaClient();
  const outputPath = process.env.DESIGN_TOKENS_OUTPUT || 'src/styles/design-tokens.css';
  
  try {
    // Get file data
    const fileData = await client.getFile();
    const styles = await client.getStyles();
    
    const { meta } = styles;
    const { colors, textStyles } = meta;
    
    let cssContent = `/**
 * Design Tokens
 * Auto-generated from Figma
 * File: ${client.fileId}
 * Generated: ${new Date().toISOString()}
 */

:root {
`;

    // Process colors
    if (colors && colors.length > 0) {
      cssContent += '\n  /* Colors */\n';
      colors.forEach((color, index) => {
        const colorData = figmaColorToHex(color.styles);
        if (colorData) {
          const varName = `--color-${color.name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')}`;
          cssContent += `  ${varName}: ${colorData.hex};\n`;
        }
      });
    }

    // Process typography
    if (textStyles && textStyles.length > 0) {
      cssContent += '\n  /* Typography */\n';
      textStyles.forEach((textStyle, index) => {
        const cssProps = figmaTypographyToCSS(textStyle.style);
        if (cssProps) {
          const varName = `--typography-${textStyle.name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')}`;
          // For typography, we create a CSS class instead of a variable
          cssContent += `  /* ${textStyle.name} */\n`;
          cssContent += `  --font-family-${index}: ${cssProps.fontFamily};\n`;
          cssContent += `  --font-size-${index}: ${cssProps.fontSize};\n`;
          cssContent += `  --font-weight-${index}: ${cssProps.fontWeight};\n`;
          cssContent += `  --line-height-${index}: ${cssProps.lineHeight};\n`;
        }
      });
    }

    // Add spacing scale (common for portfolio sites)
    cssContent += '\n  /* Spacing Scale */\n';
    const spacingScale = [0, 4, 8, 12, 16, 24, 32, 48, 64, 96, 128, 192, 256];
    spacingScale.forEach((size) => {
      cssContent += `  --spacing-${size}: ${size}px;\n`;
    });

    // Add border radius scale
    cssContent += '\n  /* Border Radius */\n';
    const radiusScale = [0, 4, 8, 12, 16, 24, 32, 50, 100];
    radiusScale.forEach((radius) => {
      cssContent += `  --radius-${radius}: ${radius}px;\n`;
    });

    // Add shadows
    cssContent += '\n  /* Shadows */\n';
    cssContent += '  --shadow-sm: 0 1px 2px rgba(0, 0, 0, 0.05);\n';
    cssContent += '  --shadow-md: 0 4px 6px rgba(0, 0, 0, 0.1);\n';
    cssContent += '  --shadow-lg: 0 10px 15px rgba(0, 0, 0, 0.1);\n';
    cssContent += '  --shadow-xl: 0 20px 25px rgba(0, 0, 0, 0.1);\n';

    // Add transitions
    cssContent += '\n  /* Transitions */\n';
    cssContent += '  --transition-fast: 150ms ease;\n';
    cssContent += '  --transition-normal: 250ms ease;\n';
    cssContent += '  --transition-slow: 350ms ease;\n';

    cssContent += '}\n\n';

    // Generate typography classes
    if (textStyles && textStyles.length > 0) {
      cssContent += '/* Typography Classes */\n';
      textStyles.forEach((textStyle, index) => {
        const className = textStyle.name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
        const cssProps = figmaTypographyToCSS(textStyle.style);
        
        cssContent += `.text-${className} {
`;
        cssContent += `  font-family: ${cssProps.fontFamily};\n`;
        cssProps.fontWeight && (cssContent += `  font-weight: ${cssProps.fontWeight};\n`);
        cssContent += `  font-size: ${cssProps.fontSize};\n`;
        cssContent += `  line-height: ${cssProps.lineHeight};\n`;
        cssProps.letterSpacing !== '0' && (cssContent += `  letter-spacing: ${cssProps.letterSpacing};\n`);
        cssProps.textTransform !== 'none' && (cssContent += `  text-transform: ${cssProps.textTransform};\n`);
        cssProps.textDecoration !== 'none' && (cssContent += `  text-decoration: ${cssProps.textDecoration};\n`);
        cssContent += `}\n\n`;
      });
    }

    // Ensure output directory exists
    const dirname = path.dirname(outputPath);
    if (!fs.existsSync(dirname)) {
      fs.mkdirSync(dirname, { recursive: true });
    }

    // Write the CSS file
    fs.writeFileSync(outputPath, cssContent);
    
    console.log(`✓ Design tokens written to ${outputPath}`);
    
    // Also create a JSON version for JavaScript usage
    const jsonOutputPath = outputPath.replace('.css', '.json');
    const tokens = {
      colors: {},
      typography: {},
      spacing: {},
      radius: {},
      shadows: {
        sm: '0 1px 2px rgba(0, 0, 0, 0.05)',
        md: '0 4px 6px rgba(0, 0, 0, 0.1)',
        lg: '0 10px 15px rgba(0, 0, 0, 0.1)',
        xl: '0 20px 25px rgba(0, 0, 0, 0.1)'
      },
      transitions: {
        fast: '150ms ease',
        normal: '250ms ease',
        slow: '350ms ease'
      }
    };

    if (colors) {
      colors.forEach((color) => {
        const colorData = figmaColorToHex(color.styles);
        if (colorData) {
          const key = color.name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
          tokens.colors[key] = colorData.hex;
        }
      });
    }

    if (textStyles) {
      textStyles.forEach((textStyle) => {
        const cssProps = figmaTypographyToCSS(textStyle.style);
        if (cssProps) {
          const key = textStyle.name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
          tokens.typography[key] = cssProps;
        }
      });
    }

    spacingScale.forEach((size) => {
      tokens.spacing[size] = `${size}px`;
    });

    radiusScale.forEach((radius) => {
      tokens.radius[radius] = `${radius}px`;
    });

    fs.writeFileSync(jsonOutputPath, JSON.stringify(tokens, null, 2));
    console.log(`✓ Design tokens JSON written to ${jsonOutputPath}`);

    return tokens;

  } catch (error) {
    console.error('Error extracting design tokens:', error.message);
    throw error;
  }
}

module.exports = { extractDesignTokens };
