#!/usr/bin/env node

/**
 * Figma Sync Script
 * Main entry point for syncing Figma designs to code
 */

require('dotenv').config();
const { extractDesignTokens } = require('../src/utils/figma/extract-design-tokens');
const { extractAssets } = require('../src/utils/figma/extract-assets');
const { extractComponents } = require('../src/utils/figma/extract-components');

async function syncFigma() {
  console.log('🎨 Starting Figma sync...\n');

  try {
    // Validate configuration
    if (!process.env.FIGMA_API_TOKEN) {
      throw new Error('FIGMA_API_TOKEN not set in environment variables');
    }
    if (!process.env.FIGMA_FILE_ID) {
      throw new Error('FIGMA_FILE_ID not set in environment variables');
    }

    console.log('✓ Configuration validated\n');

    // Extract design tokens (colors, typography, etc.)
    console.log('🎨 Extracting design tokens...');
    await extractDesignTokens();
    console.log('✓ Design tokens extracted\n');

    // Extract assets (images, SVGs)
    console.log('📁 Extracting assets...');
    await extractAssets();
    console.log('✓ Assets extracted\n');

    // Extract components
    console.log('🧩 Extracting components...');
    await extractComponents();
    console.log('✓ Components extracted\n');

    console.log('🎉 Figma sync completed successfully!');
    console.log('\nNext steps:');
    console.log('- Run `npm start` to view your website');
    console.log('- Check the generated files in src/ and public/');

  } catch (error) {
    console.error('❌ Error during Figma sync:', error.message);
    if (error.response) {
      console.error('Figma API Error:', error.response.data);
    }
    process.exit(1);
  }
}

syncFigma();
