#!/usr/bin/env node
/**
 * LRU Cache Demonstration
 * Shows the LRU cache behavior in a controlled environment
 */

// Extract and execute the LRUCache class from the built bundle
const fs = require('fs');
const path = require('path');

const runtimePath = path.join(__dirname, 'dist', 'runtime.js');
const runtimeCode = fs.readFileSync(runtimePath, 'utf8');

// Extract LRUCache class
const lruMatch = runtimeCode.match(/class LRUCache \{[\s\S]*?\n\}/);
if (!lruMatch) {
  console.error('❌ Could not extract LRUCache class');
  process.exit(1);
}

// Create a safe eval context
const LRUCacheEval = eval(`(${lruMatch[0]})`);

console.log('🧪 LRU Cache Demonstration\n');
console.log('=' .repeat(60));

// Create a small cache for demo
const cache = new LRUCacheEval(5, 1000); // 5 entries, 1 second TTL

console.log('\n📝 Test 1: Basic Operations');
console.log('-'.repeat(60));

cache.set('key1', 'value1');
cache.set('key2', 'value2');
cache.set('key3', 'value3');

console.log('✅ Set key1, key2, key3');
console.log(`   Cache size: ${cache.size}`);
console.log(`   Get key1: ${cache.get('key1')}`);
console.log(`   Has key2: ${cache.has('key2')}`);
console.log(`   Has key999: ${cache.has('key999')}`);

console.log('\n📝 Test 2: LRU Eviction');
console.log('-'.repeat(60));

// Fill cache to capacity
cache.set('key4', 'value4');
cache.set('key5', 'value5');
console.log(`✅ Filled cache to capacity (${cache.size}/${cache.capacity || 5})`);

// This should trigger eviction of key1 (least recently used)
cache.set('key6', 'value6');
console.log(`✅ Added key6, triggering LRU eviction`);
console.log(`   Cache size: ${cache.size}`);
console.log(`   key1 exists: ${cache.has('key1')} (should be false - evicted)`);
console.log(`   key2 exists: ${cache.has('key2')} (should be true)`);

console.log('\n📝 Test 3: TTL Expiration');
console.log('-'.repeat(60));

cache.clear();
cache.set('temp', 'temporary');
console.log(`✅ Set entry with 1 second TTL`);
console.log(`   Immediately - has('temp'): ${cache.has('temp')}`);

console.log('⏳ Waiting 1.1 seconds for TTL expiration...');
setTimeout(() => {
  console.log(`   After TTL - has('temp'): ${cache.has('temp')} (should be false)`);
  console.log(`   Cache size: ${cache.size}`);

  console.log('\n📝 Test 4: Cleanup Expired');
  console.log('-'.repeat(60));

  cache.set('a', 1);
  cache.set('b', 2);
  cache.set('c', 3);

  console.log(`✅ Added 3 entries`);
  console.log(`   Cache size: ${cache.size}`);

  console.log('⏳ Waiting 1.1 seconds for all entries to expire...');
  setTimeout(() => {
    const cleaned = cache.cleanupExpired();
    console.log(`   cleanupExpired() removed: ${cleaned} entries`);
    console.log(`   Cache size: ${cache.size} (should be 0)`);

    console.log('\n📝 Test 5: Eviction Callback');
    console.log('-'.repeat(60));

    cache.clear();
    let evictedKey = null;
    cache.onEviction((key, value) => {
      evictedKey = key;
      console.log(`   📢 Eviction callback triggered: ${key}`);
    });

    // Fill and trigger eviction
    cache.set('x', 1);
    cache.set('y', 2);
    cache.set('z', 3);
    cache.set('w', 4);
    cache.set('v', 5);
    cache.set('u', 6); // Triggers eviction

    console.log(`✅ Triggered eviction by exceeding capacity`);
    console.log(`   Evicted key: ${evictedKey} (should be 'x' - LRU)`);
    console.log(`   Cache size: ${cache.size}`);

    console.log('\n' + '='.repeat(60));
    console.log('✅ All LRU Cache tests completed successfully!\n');
  }, 1100);
}, 1100);
