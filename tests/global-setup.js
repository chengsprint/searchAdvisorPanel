/**
 * Playwright Global Setup
 * Runs once before all tests
 */

async function globalSetup(config) {
  console.log('🚀 Starting Playwright E2E tests...');

  // Ensure build exists
  const fs = require('fs');
  const path = require('path');

  const distPath = path.join(__dirname, '..', 'dist', 'runtime.js');
  if (!fs.existsSync(distPath)) {
    console.log('📦 Build not found, running build...');
    const { execSync } = require('child_process');
    execSync('npm run build', { stdio: 'inherit' });
  }

  console.log('✅ Playwright global setup complete');
}

module.exports = globalSetup;
