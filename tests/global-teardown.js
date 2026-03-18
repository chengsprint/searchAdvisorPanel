/**
 * Playwright Global Teardown
 * Runs once after all tests
 */

async function globalTeardown(config) {
  console.log('🧹 Cleaning up Playwright E2E tests...');
  console.log('✅ Playwright global teardown complete');
}

module.exports = globalTeardown;
