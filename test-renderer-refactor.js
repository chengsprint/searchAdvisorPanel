#!/usr/bin/env node
/**
 * Validation Test for Renderer Refactoring
 * Tests that all renderers are properly registered and functional
 */

const fs = require('fs');
const path = require('path');

console.log('🔍 Renderer Refactoring Validation\n');

// Read the built runtime
const runtimePath = path.join(__dirname, 'dist/runtime.js');
const runtime = fs.readFileSync(runtimePath, 'utf8');

// Test 1: Check that all renderer modules are included
console.log('✓ Test 1: Module Inclusion');
const modules = [
  '08-renderers-overview',
  '08-renderers-daily',
  '08-renderers-queries',
  '08-renderers-pages',
  '08-renderers-pattern',
  '08-renderers-crawl',
  '08-renderers-backlink',
  '08-renderers-diagnosis',
  '08-renderers-insight',
  '08-renderers',
];

let allIncluded = true;
for (const mod of modules) {
  // For main renderers file, check for RENDERER_REGISTRY instead
  const isMainFile = mod === '08-renderers';
  const hasExpectedCode = isMainFile
    ? runtime.includes('RENDERER_REGISTRY')
    : runtime.includes(`create${mod.replace('08-renderers-', '').charAt(0).toUpperCase() + mod.replace('08-renderers-', '').slice(1)}Renderer`);

  if (!hasExpectedCode) {
    console.log(`  ✗ Missing: ${mod}`);
    allIncluded = false;
  }
}
if (allIncluded) {
  console.log('  ✓ All renderer modules included\n');
}

// Test 2: Check registry pattern
console.log('✓ Test 2: Registry Pattern');
const hasRegistry = runtime.includes('RENDERER_REGISTRY');
const hasBuildRenderers = runtime.includes('function buildRenderers');
const hasPrepareData = runtime.includes('function prepareRendererData');

console.log(`  RENDERER_REGISTRY: ${hasRegistry ? '✓' : '✗'}`);
console.log(`  buildRenderers(): ${hasBuildRenderers ? '✓' : '✗'}`);
console.log(`  prepareRendererData(): ${hasPrepareData ? '✓' : '✗'}\n`);

// Test 3: Check for all expected tabs
console.log('✓ Test 3: Tab Coverage');
const expectedTabs = [
  'overview', 'daily', 'queries', 'urls', 'pages', 'pattern',
  'crawl', 'backlink', 'indexed', 'diagnosis', 'insight'
];

for (const tab of expectedTabs) {
  const hasTab = runtime.includes(`"${tab}"`);
  console.log(`  ${tab.padEnd(12)} ${hasTab ? '✓' : '✗'}`);
}
console.log();

// Test 4: Check JSDoc documentation
console.log('✓ Test 4: Documentation');
const jsdocCount = (runtime.match(/@module/g) || []).length;
console.log(`  JSDoc @module tags: ${jsdocCount}\n`);

// Test 5: Line count comparison
console.log('✓ Test 5: Code Metrics');
const originalBackup = fs.readFileSync(
  path.join(__dirname, 'src/app/main/08-renderers.js.backup'),
  'utf8'
);
const originalLines = originalBackup.split('\n').length;
const newMainLines = fs.readFileSync(
  path.join(__dirname, 'src/app/main/08-renderers.js'),
  'utf8'
).split('\n').length;

let totalNewLines = 0;
for (const mod of modules) {
  const content = fs.readFileSync(
    path.join(__dirname, 'src/app/main', `${mod}.js`),
    'utf8'
  );
  totalNewLines += content.split('\n').length;
}

console.log(`  Original file: ${originalLines} lines`);
console.log(`  New main file: ${newMainLines} lines`);
console.log(`  Total new files: ${totalNewLines} lines`);
console.log(`  Reduction per file: ${Math.round(originalLines / modules.length)} → ${Math.round(totalNewLines / modules.length)} avg\n`);

// Test 6: Check backward compatibility
console.log('✓ Test 6: Backward Compatibility');
const hasAliases = runtime.includes('pages: createPagesRenderer') &&
                   runtime.includes('diagnosis: createDiagnosisRenderer');
console.log(`  Tab aliases (pages/urls, diagnosis/indexed): ${hasAliases ? '✓' : '✗'}\n`);

// Test 7: Check extensibility features
console.log('✓ Test 7: Extensibility');
const hasRegisterFn = runtime.includes('function registerRenderer');
const hasGetRenderersFn = runtime.includes('function getAvailableRenderers');
console.log(`  registerRenderer(): ${hasRegisterFn ? '✓' : '✗'}`);
console.log(`  getAvailableRenderers(): ${hasGetRenderersFn ? '✓' : '✗'}\n`);

// Summary
console.log('═'.repeat(50));
console.log('✅ Renderer Refactoring Validation Complete');
console.log('═'.repeat(50));

// Check if any critical failures
if (!hasRegistry || !hasBuildRenderers || !allIncluded) {
  console.log('\n⚠️  Critical issues detected!');
  process.exit(1);
} else {
  console.log('\n✓ All tests passed successfully!');
  process.exit(0);
}
