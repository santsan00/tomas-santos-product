#!/usr/bin/env node

/**
 * Figma Sync Script
 * Main entry point for syncing Figma designs to code
 *
 * Usage: node scripts/sync-figma.js [tokens] [assets] [components]
 * With no arguments, every step runs.
 */

require('dotenv').config();
const { extractDesignTokens } = require('../src/utils/figma/extract-design-tokens');
const { extractAssets } = require('../src/utils/figma/extract-assets');
const { extractComponents } = require('../src/utils/figma/extract-components');

const STEPS = {
  tokens: { label: '🎨 Extracting design tokens...', done: '✓ Design tokens extracted\n', run: extractDesignTokens },
  assets: { label: '📁 Extracting assets...', done: '✓ Assets extracted\n', run: extractAssets },
  components: { label: '🧩 Extracting components...', done: '✓ Components extracted\n', run: extractComponents },
};

async function syncFigma(stepNames) {
  console.log('🎨 Starting Figma sync...\n');

  try {
    const unknown = stepNames.filter((name) => !STEPS[name]);
    if (unknown.length) {
      throw new Error(`Unknown sync step(s): ${unknown.join(', ')}. Valid steps: ${Object.keys(STEPS).join(', ')}`);
    }
    const selected = stepNames.length ? stepNames : Object.keys(STEPS);

    // Validate configuration
    if (!process.env.FIGMA_API_TOKEN) {
      throw new Error('FIGMA_API_TOKEN not set in environment variables');
    }
    if (!process.env.FIGMA_FILE_ID) {
      throw new Error('FIGMA_FILE_ID not set in environment variables');
    }

    console.log('✓ Configuration validated\n');

    for (const name of selected) {
      const step = STEPS[name];
      console.log(step.label);
      await step.run();
      console.log(step.done);
    }

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

syncFigma(process.argv.slice(2));
