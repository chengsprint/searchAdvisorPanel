// ============================================================
// P2 Issue #2: V1 Migration Functions Test Suite
// ============================================================

/**
 * V1 Migration Functions Test
 * This script tests the V1 → V2 migration functionality
 */

// Mock data for testing
const MOCK_V1_PAYLOAD = {
  __schema_version: '1.0',
  __exported_at: '2026-03-18T10:00:00Z',
  __source_account: 'test@naver.com',
  __source_enc_id: 'test_enc_id_123',
  savedAt: 1710705600000,
  encId: 'test_enc_id_123',
  sites: {
    'https://example.com': {
      expose: { items: [{ logs: [] }] },
      crawl: { items: [{ stats: [] }] },
      detailLoaded: true,
      __cacheSavedAt: 1710705600000
    },
    'https://test.com': {
      backlink: { items: [] },
      diagnosisMeta: { code: 0, items: [] }
    }
  },
  dataBySite: {
    'https://example.com': {
      expose: { items: [{ logs: [{ date: '20260301', clickCount: 100 }] }] },
      __fetched_at: 1710705600000
    }
  },
  siteMeta: {
    'https://example.com': { label: 'Example Site' }
  },
  curMode: 'all',
  curSite: 'https://example.com',
  curTab: 'overview'
};

const MOCK_V1_MINIMAL = {
  sites: {
    'https://minimal.com': {
      expose: null,
      crawl: null,
      backlink: null
    }
  }
};

const EXPECTED_V2_STRUCTURE = {
  __meta: {
    version: '1.0',
    exportedAt: expect.any(Number),
    migratedFrom: 'V1',
    migratedAt: expect.any(Number),
    originalVersion: '1.0'
  },
  accounts: {
    'test@naver.com': {
      encId: 'test_enc_id_123',
      sites: expect.arrayContaining([
        'https://example.com',
        'https://test.com'
      ]),
      dataBySite: expect.any(Object),
      siteMeta: expect.any(Object)
    }
  }
};

// Test functions
function runV1MigrationTests() {
  console.log('=== V1 Migration Test Suite ===\n');

  let passedTests = 0;
  let failedTests = 0;

  // Test 1: validateV1Payload with valid V1 payload
  console.log('Test 1: validateV1Payload with valid V1 payload');
  try {
    const validation = validateV1Payload(MOCK_V1_PAYLOAD);
    if (validation.valid && validation.version === '1.0') {
      console.log('✓ Test 1 PASSED: Valid V1 payload recognized\n');
      passedTests++;
    } else {
      console.error('✗ Test 1 FAILED: Valid payload rejected', validation);
      failedTests++;
    }
  } catch (e) {
    console.error('✗ Test 1 FAILED: Exception thrown', e);
    failedTests++;
  }

  // Test 2: validateV1Payload with invalid payload
  console.log('Test 2: validateV1Payload with invalid payload');
  try {
    const validation = validateV1Payload({ invalid: 'data' });
    if (!validation.valid && validation.errors.length > 0) {
      console.log('✓ Test 2 PASSED: Invalid payload rejected\n');
      passedTests++;
    } else {
      console.error('✗ Test 2 FAILED: Invalid payload accepted');
      failedTests++;
    }
  } catch (e) {
    console.error('✗ Test 2 FAILED: Exception thrown', e);
    failedTests++;
  }

  // Test 3: migrateV1ToV2 with full V1 payload
  console.log('Test 3: migrateV1ToV2 with full V1 payload');
  try {
    const v2Payload = migrateV1ToV2(MOCK_V1_PAYLOAD, {
      accountEmail: 'test@naver.com',
      encId: 'test_enc_id_123',
      validate: false
    });

    if (v2Payload.__meta &&
        v2Payload.__meta.version === '1.0' &&
        v2Payload.__meta.migratedFrom === 'V1' &&
        v2Payload.accounts &&
        v2Payload.accounts['test@naver.com']) {
      console.log('✓ Test 3 PASSED: V1 → V2 migration successful');
      console.log('  - V2 structure:', Object.keys(v2Payload));
      console.log('  - Account:', Object.keys(v2Payload.accounts));
      console.log('  - Sites:', v2Payload.accounts['test@naver.com'].sites);
      console.log();
      passedTests++;
    } else {
      console.error('✗ Test 3 FAILED: Invalid V2 structure', v2Payload);
      failedTests++;
    }
  } catch (e) {
    console.error('✗ Test 3 FAILED: Exception thrown', e);
    failedTests++;
  }

  // Test 4: migrateV1ToV2 with minimal V1 payload
  console.log('Test 4: migrateV1ToV2 with minimal V1 payload');
  try {
    const v2Payload = migrateV1ToV2(MOCK_V1_MINIMAL, {
      validate: false
    });

    if (v2Payload.__meta && v2Payload.accounts) {
      const accountKey = Object.keys(v2Payload.accounts)[0];
      if (v2Payload.accounts[accountKey].sites.includes('https://minimal.com')) {
        console.log('✓ Test 4 PASSED: Minimal V1 payload migrated\n');
        passedTests++;
      } else {
        console.error('✗ Test 4 FAILED: Site not found in migrated data');
        failedTests++;
      }
    } else {
      console.error('✗ Test 4 FAILED: Invalid V2 structure');
      failedTests++;
    }
  } catch (e) {
    console.error('✗ Test 4 FAILED: Exception thrown', e);
    failedTests++;
  }

  // Test 5: migrateV2ToV1 rollback
  console.log('Test 5: migrateV2ToV1 rollback');
  try {
    const v2Payload = migrateV1ToV2(MOCK_V1_PAYLOAD, {
      accountEmail: 'rollback@naver.com',
      validate: false
    });

    const v1Payload = migrateV2ToV1(v2Payload, {
      accountEmail: 'rollback@naver.com',
      includeMetadata: true
    });

    if (v1Payload.sites &&
        v1Payload.dataBySite &&
        v1Payload.__rolled_back_from) {
      console.log('✓ Test 5 PASSED: V2 → V1 rollback successful');
      console.log('  - Rolled back from:', v1Payload.__rolled_back_from);
      console.log('  - Sites:', Object.keys(v1Payload.sites));
      console.log();
      passedTests++;
    } else {
      console.error('✗ Test 5 FAILED: Invalid V1 rollback structure');
      failedTests++;
    }
  } catch (e) {
    console.error('✗ Test 5 FAILED: Exception thrown', e);
    failedTests++;
  }

  // Test 6: canMigrateV1 detection
  console.log('Test 6: canMigrateV1 detection');
  try {
    const v1Result = canMigrateV1(MOCK_V1_PAYLOAD);
    const v2Result = canMigrateV1({ __meta: { version: '1.0' }, accounts: {} });

    if (v1Result && !v2Result) {
      console.log('✓ Test 6 PASSED: V1/V2 detection working\n');
      passedTests++;
    } else {
      console.error('✗ Test 6 FAILED: Detection incorrect', { v1Result, v2Result });
      failedTests++;
    }
  } catch (e) {
    console.error('✗ Test 6 FAILED: Exception thrown', e);
    failedTests++;
  }

  // Test 7: normalizeLegacyCache
  console.log('Test 7: normalizeLegacyCache');
  try {
    const v1Cache = { sites: { 'https://test.com': {} }, ts: 123456 };
    const normalized = normalizeLegacyCache('sadv_data_v1_test', v1Cache);

    if (normalized.dataBySite && normalized.__cacheSavedAt) {
      console.log('✓ Test 7 PASSED: Legacy cache normalized\n');
      passedTests++;
    } else {
      console.error('✗ Test 7 FAILED: Cache normalization failed');
      failedTests++;
    }
  } catch (e) {
    console.error('✗ Test 7 FAILED: Exception thrown', e);
    failedTests++;
  }

  // Test 8: extractSiteUrlFromCacheKey
  console.log('Test 8: extractSiteUrlFromCacheKey');
  try {
    // Test with base64 encoded URL
    const testUrl = 'https://example.com';
    const encoded = btoa(encodeURIComponent(testUrl));
    const cacheKey = `sadv_data_v2_default_${encoded.replace(/=/g, '')}`;
    const extracted = extractSiteUrlFromCacheKey(cacheKey);

    if (extracted === testUrl) {
      console.log('✓ Test 8 PASSED: Site URL extraction working\n');
      passedTests++;
    } else {
      console.error('✗ Test 8 FAILED: URL extraction incorrect', { extracted, expected: testUrl });
      failedTests++;
    }
  } catch (e) {
    console.error('✗ Test 8 FAILED: Exception thrown', e);
    failedTests++;
  }

  // Summary
  console.log('=== Test Summary ===');
  console.log(`Total tests: ${passedTests + failedTests}`);
  console.log(`Passed: ${passedTests}`);
  console.log(`Failed: ${failedTests}`);
  console.log(`Success rate: ${((passedTests / (passedTests + failedTests)) * 100).toFixed(1)}%`);

  return { passed: passedTests, failed: failedTests };
}

// Integration test for loadSiteList
function testLoadSiteListIntegration() {
  console.log('\n=== Integration Test: loadSiteList with V1 Migration ===\n');

  // Mock window.__SEARCHADVISOR_EXPORT_PAYLOAD__ with V1 data
  const originalPayload = window.__SEARCHADVISOR_EXPORT_PAYLOAD__;
  window.__SEARCHADVISOR_EXPORT_PAYLOAD__ = MOCK_V1_PAYLOAD;

  try {
    const sites = loadSiteList(false);

    if (Array.isArray(sites) && sites.length > 0) {
      console.log('✓ Integration test PASSED');
      console.log('  - Sites loaded:', sites);
      console.log('  - Account state:', window.__sadvAccountState);
      console.log();
      return true;
    } else {
      console.error('✗ Integration test FAILED: No sites loaded');
      return false;
    }
  } catch (e) {
    console.error('✗ Integration test FAILED: Exception', e);
    return false;
  } finally {
    // Restore original payload
    window.__SEARCHADVISOR_EXPORT_PAYLOAD__ = originalPayload;
  }
}

// Run all tests
if (typeof window !== 'undefined') {
  // Browser environment
  console.log('Running V1 Migration Tests in Browser...\n');
  const results = runV1MigrationTests();

  if (results.failed === 0) {
    console.log('\n✅ All tests passed!');
  } else {
    console.log(`\n⚠️  ${results.failed} test(s) failed`);
  }

  // Uncomment to run integration test
  // testLoadSiteListIntegration();
} else {
  // Node.js environment
  console.log('V1 Migration Test Suite loaded. Call runV1MigrationTests() to run tests.');
  module.exports = {
    runV1MigrationTests,
    testLoadSiteListIntegration,
    MOCK_V1_PAYLOAD,
    MOCK_V1_MINIMAL
  };
}
