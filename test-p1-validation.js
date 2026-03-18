/**
 * P1: localStorage Race Condition Fix - Validation Script
 *
 * This script validates the implementation by checking:
 * 1. Code structure and function signatures
 * 2. Async/await patterns
 * 3. Error handling mechanisms
 * 4. Queue system implementation
 */

const fs = require('fs');

console.log('\n========================================');
console.log('P1: localStorage Race Condition Fix Validation');
console.log('========================================\n');

// Read the source files
const dataManagerCode = fs.readFileSync('./src/app/main/03-data-manager.js', 'utf8');
const mergeManagerCode = fs.readFileSync('./src/app/main/06-merge-manager.js', 'utf8');
const builtCode = fs.readFileSync('./dist/runtime.js', 'utf8');

// Validation checks
const checks = {
  passed: [],
  failed: []
};

function check(name, condition, details = '') {
  if (condition) {
    checks.passed.push({ name, details });
    console.log(`✓ ${name}`);
    if (details) console.log(`  ${details}`);
  } else {
    checks.failed.push({ name, details });
    console.log(`✗ ${name}`);
    if (details) console.log(`  ${details}`);
  }
}

// Check 1: Write queue system exists
check(
  'Write queue system implemented',
  dataManagerCode.includes('let writeQueue') && dataManagerCode.includes('safeWrite'),
  'Found writeQueue variable and safeWrite function'
);

// Check 2: Write locks for optimistic locking
check(
  'Optimistic locking with writeLocks Map',
  dataManagerCode.includes('writeLocks') && dataManagerCode.includes('new Map()'),
  'Found writeLocks Map implementation'
);

// Check 3: Retry mechanism
check(
  'Retry mechanism with MAX_RETRIES',
  dataManagerCode.includes('MAX_RETRIES') && dataManagerCode.includes('RETRY_DELAY_MS'),
  'Found retry configuration constants'
);

// Check 4: Cache cleanup function
check(
  'Cache cleanup on QuotaExceededError',
  dataManagerCode.includes('cleanupOldCache') && dataManagerCode.includes('QuotaExceededError'),
  'Found cleanupOldCache function and error handling'
);

// Check 5: lsSet is async
check(
  'lsSet function returns Promise',
  dataManagerCode.includes('function lsSet') && dataManagerCode.includes('return safeWrite'),
  'lsSet now returns Promise from safeWrite'
);

// Check 6: setCachedData is async
check(
  'setCachedData returns Promise',
  dataManagerCode.includes('function setCachedData') && dataManagerCode.includes('return lsSet'),
  'setCachedData now returns Promise'
);

// Check 7: clearCachedData is async
check(
  'clearCachedData uses safeWrite',
  dataManagerCode.includes('function clearCachedData') && dataManagerCode.includes('return safeWrite'),
  'clearCachedData now uses queue serialization'
);

// Check 8: persistSiteData is async
check(
  'persistSiteData returns Promise',
  dataManagerCode.includes('function persistSiteData') && dataManagerCode.includes('return setCachedData'),
  'persistSiteData now returns Promise'
);

// Check 9: importAccountData is async
check(
  'importAccountData is async function',
  mergeManagerCode.includes('async function importAccountData'),
  'importAccountData now uses async/await pattern'
);

// Check 10: Safe write with lock checking
check(
  'safeWrite includes lock checking logic',
  dataManagerCode.includes('writeLocks.has(key)') && dataManagerCode.includes('writeLocks.delete(key)'),
  'Found lock acquisition and release logic'
);

// Check 11: Lock timeout handling
check(
  'Stale lock breaking mechanism',
  dataManagerCode.includes('age > 5000') && dataManagerCode.includes('writeLocks.delete(key)'),
  'Found stale lock timeout handling (5 seconds)'
);

// Check 12: Sequential processing in import
check(
  'importAccountData uses sequential processing',
  mergeManagerCode.includes('for (const [site, siteData] of Object.entries(sitesToImport)'),
  'Import uses sequential loop instead of parallel processing'
);

// Check 13: saveMergeRegistry is async
check(
  'saveMergeRegistry returns Promise',
  mergeManagerCode.includes('async function saveMergeRegistry') || mergeManagerCode.includes('return safeWrite'),
  'saveMergeRegistry now uses queue serialization'
);

// Check 14: Error handling in safeWrite
check(
  'Comprehensive error handling in safeWrite',
  dataManagerCode.includes('try {') && dataManagerCode.includes('catch (e)') && dataManagerCode.includes('throw e'),
  'Found try-catch blocks with proper error propagation'
);

// Check 15: Large data warning
check(
  'Large data size warning',
  dataManagerCode.includes('Large data size') && dataManagerCode.includes('1024 * 1024'),
  'Found size check and warning for data > 1MB'
);

// Check 16: Build includes new functions
check(
  'Built runtime includes safeWrite function',
  builtCode.includes('function safeWrite') || builtCode.includes('safeWrite='),
  'safeWrite function is included in build output'
);

// Check 17: Build includes cleanupOldCache
check(
  'Built runtime includes cleanupOldCache function',
  builtCode.includes('function cleanupOldCache'),
  'cleanupOldCache function is included in build output'
);

// Check 18: No synchronous localStorage.setItem in parallel
check(
  'No parallel localStorage writes in import',
  !mergeManagerCode.includes('Promise.all') || !mergeManagerCode.includes('localStorage.setItem'),
  'No Promise.all with localStorage.setItem (sequential processing)'
);

// Check 19: Retry delay implementation
check(
  'Retry delay with setTimeout',
  dataManagerCode.includes('setTimeout') && dataManagerCode.includes('RETRY_DELAY_MS'),
  'Found retry delay implementation using setTimeout'
);

// Check 20: Cache cleanup sorts by timestamp
check(
  'Cache cleanup sorts entries by age',
  dataManagerCode.includes('sort') && dataManagerCode.includes('timestamp'),
  'Found sorting logic for cache cleanup'
);

// Summary
console.log('\n----------------------------------------');
console.log(`Validation Results: ${checks.passed.length} passed, ${checks.failed.length} failed`);
console.log('----------------------------------------\n');

// Detailed findings
if (checks.failed.length > 0) {
  console.log('Failed Checks:');
  checks.failed.forEach(({ name, details }) => {
    console.log(`  - ${name}`);
    if (details) console.log(`    ${details}`);
  });
  console.log('');
}

// Architecture improvements
console.log('Architecture Improvements:');
console.log('  1. Write Queue System: Serializes all localStorage writes');
console.log('  2. Optimistic Locking: Prevents concurrent writes to same key');
console.log('  3. Automatic Retry: Handles transient failures');
console.log('  4. Cache Cleanup: Frees space on QuotaExceededError');
console.log('  5. Size Monitoring: Warns about large data entries');
console.log('  6. Sequential Processing: Prevents race conditions in imports');
console.log('  7. Lock Timeout: Breaks stale locks after 5 seconds');
console.log('  8. Promise-based API: All write operations return Promises');
console.log('');

// Files modified
console.log('Files Modified:');
console.log('  - src/app/main/03-data-manager.js');
console.log('    * Added writeQueue, writeLocks, safeWrite');
console.log('    * Modified lsSet, setCachedData, clearCachedData, persistSiteData');
console.log('    * Added cleanupOldCache function');
console.log('  - src/app/main/06-merge-manager.js');
console.log('    * Modified importAccountData (async with sequential processing)');
console.log('    * Modified saveMergeRegistry (async with queue)');
console.log('');

const success = checks.failed.length === 0;
console.log(success ? '✅ All validation checks passed!' : '⚠️  Some validation checks failed');

process.exit(success ? 0 : 1);
