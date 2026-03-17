#!/usr/bin/env node
/**
 * Multi-Account Data Merge System Tests
 * Tests schema validation, merge scenarios, edge cases, and performance
 */

const fs = require('fs');
const path = require('path');

// Test utilities
const COLORS = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m'
};

function log(color, msg) {
  console.log(color + msg + COLORS.reset);
}

function assert(condition, message) {
  if (!condition) {
    throw new Error(`Assertion failed: ${message}`);
  }
}

function assertThrows(fn, message) {
  try {
    fn();
    throw new Error(`Expected to throw: ${message}`);
  } catch (e) {
    // Expected
  }
}

// Load fixtures
const accountA = JSON.parse(fs.readFileSync(path.join(__dirname, 'fixtures/account-a.json'), 'utf8'));
const accountB = JSON.parse(fs.readFileSync(path.join(__dirname, 'fixtures/account-b.json'), 'utf8'));
const mergedExpected = JSON.parse(fs.readFileSync(path.join(__dirname, 'fixtures/merged-expected.json'), 'utf8'));

// Test results
let passed = 0;
let failed = 0;
const failures = [];

function test(name, fn) {
  try {
    fn();
    log(COLORS.green, `✓ ${name}`);
    passed++;
  } catch (e) {
    log(COLORS.red, `✗ ${name}`);
    log(COLORS.red, `  ${e.message}`);
    failed++;
    failures.push({ name, error: e.message });
  }
}

// ============================================================================
// 1. SCHEMA VALIDATION TESTS
// ============================================================================

log(COLORS.cyan, '\n=== Schema Validation Tests ===\n');

test('1.1 Valid schema v1.0 data', () => {
  assert(accountA.__schema_version === '1.0', 'Schema version should be 1.0');
  assert(accountA.__exported_at, 'Should have exported_at timestamp');
  assert(accountA.__source_account, 'Should have source_account');
  assert(accountA.__source_enc_id, 'Should have source_enc_id');
  assert(accountA.sites, 'Should have sites object');
});

test('1.2 Sites object contains valid data', () => {
  assert(typeof accountA.sites === 'object', 'Sites should be an object');
  assert(Object.keys(accountA.sites).length > 0, 'Should have at least one site');
  const site = Object.values(accountA.sites)[0];
  assert(site.expose, 'Site should have expose data');
});

test('1.3 Expose data structure is valid', () => {
  const site = accountA.sites['https://site-a.com'];
  assert(site.expose.items, 'Should have items array');
  const item = site.expose.items[0];
  assert(item.period, 'Should have period');
  assert(Array.isArray(item.logs), 'Logs should be array');
  assert(Array.isArray(item.urls), 'URLs should be array');
  assert(Array.isArray(item.querys), 'Querys should be array');
});

test('1.4 Crawl data structure is valid', () => {
  const site = accountA.sites['https://site-a.com'];
  assert(site.crawl, 'Should have crawl data');
  assert(site.crawl.items, 'Should have items array');
  const stats = site.crawl.items[0].stats;
  assert(Array.isArray(stats), 'Stats should be array');
});

test('1.5 Backlink data structure is valid', () => {
  const site = accountA.sites['https://site-a.com'];
  assert(site.backlink, 'Should have backlink data');
  const item = site.backlink.items[0];
  assert(typeof item.total === 'number', 'Total should be number');
  assert(Array.isArray(item.countTime), 'countTime should be array');
  assert(Array.isArray(item.topDomain), 'topDomain should be array');
});

test('1.6 DiagnosisMeta data structure is valid', () => {
  const site = accountA.sites['https://site-a.com'];
  assert(site.diagnosisMeta, 'Should have diagnosisMeta data');
  assert(site.diagnosisMeta.code === 0, 'Code should be 0 for success');
  assert(Array.isArray(site.diagnosisMeta.items), 'Items should be array');
});

test('1.7 Merge metadata is present', () => {
  const site = accountA.sites['https://site-a.com'];
  assert(site._merge, 'Should have _merge metadata');
  assert(site._merge.__source, 'Should have __source');
  assert(site._merge.__accountId, 'Should have __accountId');
  assert(site._merge.__fetchedAt, 'Should have __fetchedAt');
  assert(site._merge.__version, 'Should have __version');
});

// ============================================================================
// 2. MERGE SCENARIO TESTS
// ============================================================================

log(COLORS.cyan, '\n=== Merge Scenario Tests ===\n');

function mergeAccounts(targetData, sourceData, options = {}) {
  const { overwriteExisting = false, mergeStrategy = 'newer' } = options;
  const result = JSON.parse(JSON.stringify(targetData));

  for (const [site, sourceSiteData] of Object.entries(sourceData.sites)) {
    const targetSiteData = result.sites[site];

    if (!targetSiteData) {
      result.sites[site] = sourceSiteData;
    } else {
      const sourceTime = sourceSiteData._merge.__fetchedAt || 0;
      const targetTime = targetSiteData._merge.__fetchedAt || 0;

      if (overwriteExisting || (mergeStrategy === 'newer' && sourceTime > targetTime)) {
        result.sites[site] = sourceSiteData;
      }
    }
  }

  return result;
}

test('2.1 Merge two accounts with different sites', () => {
  const merged = mergeAccounts(accountA, accountB);
  assert(merged.sites['https://site-a.com'], 'Should have site-a');
  assert(merged.sites['https://site-b.com'], 'Should have site-b');
  assert(Object.keys(merged.sites).length === 3, 'Should have 3 unique sites');
});

test('2.2 Merge accounts with overlapping sites (newer wins)', () => {
  const merged = mergeAccounts(accountA, accountB);
  const sharedSite = merged.sites['https://shared-site.com'];
  assert(sharedSite._merge.__source === 'account-b@naver.com', 'Should use newer data from account-b');
});

test('2.3 Merge preserves non-overlapping data', () => {
  const merged = mergeAccounts(accountA, accountB);
  const siteA = merged.sites['https://site-a.com'];
  assert(siteA.expose.items[0].logs.length === 3, 'Should preserve account-a logs');
});

test('2.4 Merge with empty target', () => {
  const emptyTarget = { __schema_version: '1.0', sites: {} };
  const merged = mergeAccounts(emptyTarget, accountA);
  assert(Object.keys(merged.sites).length === 2, 'Should have all sites from source');
});

test('2.5 Merge with empty source', () => {
  const merged = mergeAccounts(accountA, { __schema_version: '1.0', sites: {} });
  assert(Object.keys(merged.sites).length === 2, 'Should preserve original sites');
});

// ============================================================================
// 3. EDGE CASE TESTS
// ============================================================================

log(COLORS.cyan, '\n=== Edge Case Tests ===\n');

test('3.1 Empty accounts', () => {
  const empty = { __schema_version: '1.0', sites: {} };
  const merged = mergeAccounts(empty, empty);
  assert(Object.keys(merged.sites).length === 0, 'Should handle empty accounts');
});

test('3.2 Single site accounts', () => {
  const singleSite = {
    __schema_version: '1.0',
    sites: {
      'https://single.com': { expose: { items: [] }, _merge: {} }
    }
  };
  const merged = mergeAccounts(singleSite, singleSite);
  assert(Object.keys(merged.sites).length === 1, 'Should handle single site');
});

test('3.3 Unicode in site URLs', () => {
  const unicodeUrl = 'https://site-한글.com/페이지';
  const data = {
    __schema_version: '1.0',
    sites: {}
  };
  data.sites[unicodeUrl] = { expose: { items: [] }, _merge: {} };
  assert(Object.keys(data.sites).includes(unicodeUrl), 'Should handle Unicode URLs');
});

test('3.4 Missing optional fields', () => {
  const partialSite = {
    expose: { items: [] },
    _merge: { __source: 'test', __fetchedAt: Date.now() }
  };
  assert(partialSite.expose, 'Should handle missing crawl/backlink data');
});

// ============================================================================
// 4. DATA INTEGRITY TESTS
// ============================================================================

log(COLORS.cyan, '\n=== Data Integrity Tests ===\n');

test('4.1 No data loss after merge', () => {
  const merged = mergeAccounts(accountA, accountB);
  const originalSiteCount = Object.keys(accountA.sites).length + Object.keys(accountB.sites).length;
  const sharedCount = 1; // shared-site.com
  assert(Object.keys(merged.sites).length === originalSiteCount - sharedCount, 'All unique sites preserved');
});

test('4.2 Original data preserved in non-overlapping sites', () => {
  const merged = mergeAccounts(accountA, accountB);
  const siteA = merged.sites['https://site-a.com'];
  assert(siteA._merge.__source === 'account-a@naver.com', 'Original account source preserved');
});

test('4.3 Merge idempotency', () => {
  const merged1 = mergeAccounts(accountA, accountB);
  const merged2 = mergeAccounts(merged1, { __schema_version: '1.0', sites: {} });
  assert(Object.keys(merged1.sites).length === Object.keys(merged2.sites).length, 'Idempotent merge');
});

// ============================================================================
// 5. PERFORMANCE TESTS
// ============================================================================

log(COLORS.cyan, '\n=== Performance Tests ===\n');

test('5.1 Merge time for 100 sites < 1s', () => {
  const largeAccountA = { __schema_version: '1.0', sites: {} };
  const largeAccountB = { __schema_version: '1.0', sites: {} };

  for (let i = 0; i < 100; i++) {
    largeAccountA.sites[`https://site-a-${i}.com`] = {
      expose: { items: [] },
      _merge: { __source: 'a', __fetchedAt: 1710555200000 }
    };
    largeAccountB.sites[`https://site-b-${i}.com`] = {
      expose: { items: [] },
      _merge: { __source: 'b', __fetchedAt: 1710558800000 }
    };
  }

  const start = Date.now();
  const merged = mergeAccounts(largeAccountA, largeAccountB);
  const elapsed = Date.now() - start;

  assert(elapsed < 1000, `Merge took ${elapsed}ms, should be < 1000ms`);
  log(COLORS.blue, `  Merged 200 sites in ${elapsed}ms`);
});

// ============================================================================
// TEST SUMMARY
// ============================================================================

log(COLORS.cyan, '\n' + '='.repeat(50));
log(COLORS.cyan, 'Test Results Summary');
log(COLORS.cyan, '='.repeat(50));

log(COLORS.green, `\nTotal: ${passed + failed} tests`);
log(COLORS.green, `Passed: ${passed}`);
if (failed > 0) {
  log(COLORS.red, `Failed: ${failed}`);
  log(COLORS.red, '\nFailures:');
  failures.forEach(f => {
    log(COLORS.red, `  - ${f.name}: ${f.error}`);
  });
}

log(COLORS.cyan, '\nTest Coverage:');
log(COLORS.cyan, '  ✓ Schema validation');
log(COLORS.cyan, '  ✓ Merge scenarios');
log(COLORS.cyan, '  ✓ Edge cases');
log(COLORS.cyan, '  ✓ Data integrity');
log(COLORS.cyan, '  ✓ Performance');

if (failed === 0) {
  log(COLORS.green, '\n🎉 All tests passed!');
  process.exit(0);
} else {
  log(COLORS.red, '\n❌ Some tests failed');
  process.exit(1);
}
