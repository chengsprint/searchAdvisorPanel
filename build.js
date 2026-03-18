#!/usr/bin/env node
/**
 * SearchAdvisor Runtime - Simple Bundler
 * Concatenates modules into a single browser-executable file
 */

const fs = require('fs');
const path = require('path');

const SRC_DIR = path.join(__dirname, 'src');
const DIST_DIR = path.join(__dirname, 'dist');
const OUTPUT_FILE = path.join(DIST_DIR, 'runtime.js');

// Module load order - must be preserved
// Dependencies: each module may depend on earlier modules
const MODULES = [
  '00-polyfill.js',
  '01-style.js',
  '02-react-bundle.js',
  'app/main/00-constants.js',
  'app/main/01-helpers.js',
  'app/main/02-dom-init.js',
  'app/main/03-data-manager.js',
  'app/main/04-api.js',
  'app/main/05-demo-mode.js',
  'app/main/06-merge-manager.js',
  'app/main/07-ui-state.js',
  'app/main/08-renderers.js',
  'app/main/09-ui-controls.js',
  'app/main/10-all-sites-view.js',
  'app/main/11-site-view.js',
  'app/main/12-snapshot.js',
  'app/main/13-refresh.js',
  'app/main/14-init.js'
];

function build() {
  console.log('SearchAdvisor Runtime Bundler\n');
  console.log('Assembling modules...');

  // Ensure dist directory exists
  if (!fs.existsSync(DIST_DIR)) {
    fs.mkdirSync(DIST_DIR, { recursive: true });
  }

  let output = '';
  let totalSize = 0;

  for (const module of MODULES) {
    const modulePath = path.join(SRC_DIR, module);

    if (!fs.existsSync(modulePath)) {
      console.error(`\n✗ ERROR: ${module} not found!`);
      process.exit(1);
    }

    const content = fs.readFileSync(modulePath, 'utf-8');
    const sizeKB = (content.length / 1024).toFixed(2);

    // Add newline separator between modules
    if (output.length > 0) output += '\n';
    output += content;
    totalSize += content.length;

    console.log(`  ✓ ${module.padEnd(20)} ${sizeKB.padStart(8)} KB`);
  }

  // Wrap in IIFE to avoid "illegal return statement" errors when loaded as blob
  output = `(function() {\n'use strict';\n${output}\n})();`;

  // Write output
  fs.writeFileSync(OUTPUT_FILE, output);

  const lineCount = output.split('\n').length;
  const totalKB = (totalSize / 1024).toFixed(2);

  console.log(`\n${'='.repeat(50)}`);
  console.log(`✅ Build complete: ${OUTPUT_FILE}`);
  console.log(`   Size: ${totalKB} KB`);
  console.log(`   Lines: ${lineCount}`);
  console.log(`${'='.repeat(50)}`);

  // Verify syntax
  console.log('\nVerifying syntax...');
  const { execSync } = require('child_process');
  try {
    execSync(`node --check "${OUTPUT_FILE}"`, { stdio: 'pipe' });
    console.log('   ✓ Syntax VALID');
  } catch (e) {
    console.error('   ✗ Syntax INVALID');
    process.exit(1);
  }

  console.log('\n✓ Ready for browser console execution');
}

// Run build
build();
