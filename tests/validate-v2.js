#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('='.repeat(60));
console.log('V2 JSON Schema 마이그레이션 검증');
console.log('='.repeat(60));

// 1. test-single.html 검증
console.log('\n[1] 단일 계정 더미 데이터 검증...');
const singleHtml = fs.readFileSync(path.join(__dirname, '../dist/test-single.html'), 'utf8');

// V2 데이터 추출 (정규식으로 window.__sadvInitData 추출)
const singleDataMatch = singleHtml.match(/window\.__sadvInitData\s*=\s*(\{[\s\S]*?\});/);
if (singleDataMatch) {
  try {
    const singleData = JSON.parse(singleDataMatch[1]);
    console.log('✓ V2 데이터 파싱 성공');
    console.log(`  - 스키마 버전: ${singleData.__schema_version}`);
    console.log(`  - 소스 계정: ${singleData.__source_account}`);
    console.log(`  - 데이터 형식: ${singleData.__data_format}`);
    console.log(`  - 사이트 수: ${Object.keys(singleData.sites).length}`);

    // 첫 번째 사이트 데이터 구조 확인
    const firstSite = Object.keys(singleData.sites)[0];
    const siteData = singleData.sites[firstSite];
    console.log(`\n  [${firstSite}]`);
    console.log(`    - __meta 존재: ${!!siteData.__meta}`);
    console.log(`    - expose 데이터: ${!!siteData.expose}`);
    console.log(`    - crawl 데이터: ${!!siteData.crawl}`);
    console.log(`    - backlink 데이터: ${!!siteData.backlink}`);
    console.log(`    - diagnosisMeta 데이터: ${!!siteData.diagnosisMeta}`);

    if (siteData.expose?.items?.[0]?.logs) {
      console.log(`    - expose logs 수: ${siteData.expose.items[0].logs.length}`);
    }
    if (siteData.crawl?.items?.[0]?.stats) {
      console.log(`    - crawl stats 수: ${siteData.crawl.items[0].stats.length}`);
    }
  } catch (e) {
    console.log(`✗ V2 데이터 파싱 실패: ${e.message}`);
  }
} else {
  console.log('✗ V2 데이터를 찾을 수 없음');
}

// 2. test-merged.html 검증
console.log('\n[2] 복합 계정 더미 데이터 검증...');
const mergedHtml = fs.readFileSync(path.join(__dirname, '../dist/test-merged.html'), 'utf8');

const mergedDataMatch = mergedHtml.match(/window\.__sadvMergedData\s*=\s*(\{[\s\S]*?\});/);
if (mergedDataMatch) {
  try {
    const mergedData = JSON.parse(mergedDataMatch[1]);
    console.log('✓ V2 병합 데이터 파싱 성공');
    console.log(`  - 스키마 버전: ${mergedData.__schema_version}`);
    console.log(`  - 병합된 계정: ${mergedData.accounts_merged.join(', ')}`);
    console.log(`  - 사이트 수: ${Object.keys(mergedData.sites).length}`);

    const sites = Object.keys(mergedData.sites);
    console.log(`  - 사이트 목록: ${sites.join(', ')}`);

    // 중복 사이트 확인
    const sharedSite = sites.find(s => s.includes('shared-site'));
    if (sharedSite) {
      console.log(`  - 중복 사이트 확인: ${sharedSite}`);
    }
  } catch (e) {
    console.log(`✗ V2 병합 데이터 파싱 실패: ${e.message}`);
  }
} else {
  console.log('✗ V2 병합 데이터를 찾을 수 없음');
}

// 3. runtime.js V2 지원 확인
console.log('\n[3] runtime.js V2 지원 확인...');
const runtimeJs = fs.readFileSync(path.join(__dirname, '../dist/runtime.js'), 'utf8');

const v2Features = {
  'exportCurrentAccountData': /function exportCurrentAccountData\(\)/.test(runtimeJs),
  'importAccountData': /function importAccountData\(/.test(runtimeJs),
  'validateDataSchema': /function validateDataSchema\(/.test(runtimeJs),
  'migrateSchema': /function migrateSchema\(/.test(runtimeJs),
  'detectConflicts': /function detectConflicts\(/.test(runtimeJs),
  'mergeAccounts': /function mergeAccounts\(/.test(runtimeJs),
  '__meta 지원': /__meta:/.test(runtimeJs),
  '__schema_version': /__schema_version/.test(runtimeJs),
  '__exported_at': /__exported_at/.test(runtimeJs),
  '__source_account': /__source_account/.test(runtimeJs),
  'DATA_LS_PREFIX': /const DATA_LS_PREFIX = "sadv_data_v2_"/.test(runtimeJs)
};

console.log('V2 기능 지원 현황:');
Object.entries(v2Features).forEach(([feature, supported]) => {
  console.log(`  ${supported ? '✓' : '✗'} ${feature}`);
});

const allSupported = Object.values(v2Features).every(v => v);
console.log(`\n${allSupported ? '✓' : '✗'} V2 기능 완전 지원: ${allSupported}`);

// 4. 빌드 정보
console.log('\n[4] 빌드 정보 확인...');
const runtimeStats = fs.statSync(path.join(__dirname, '../dist/runtime.js'));
console.log(`  - 파일 크기: ${(runtimeStats.size / 1024).toFixed(2)} KB`);
console.log(`  - 예상 크기: 583.64 KB (커밋 d450b60)`);

const content = fs.readFileSync(path.join(__dirname, '../dist/runtime.js'), 'utf8');
const lineCount = content.split('\n').length;
console.log(`  - 라인 수: ${lineCount}`);
console.log(`  - 예상 라인 수: 6175 (커밋 d450b60)`);

// 5. 요약
console.log('\n' + '='.repeat(60));
console.log('검증 요약');
console.log('='.repeat(60));

const issues = [];

if (!singleDataMatch) issues.push('단일 계정 더미 데이터 누락');
if (!mergedDataMatch) issues.push('복합 계정 더미 데이터 누락');
if (!allSupported) issues.push('V2 기능 미완전 지원');

if (issues.length === 0) {
  console.log('✓ 모든 검증 항목 통과');
  console.log('\n발견된 문제: 없음');
} else {
  console.log('✗ 일부 검증 항목 실패');
  console.log('\n발견된 문제:');
  issues.forEach((issue, i) => {
    console.log(`  ${i + 1}. ${issue}`);
  });
}

console.log('\n다음 단계:');
console.log('  1. 브라우저에서 dist/check.html 열어 시각적 검증');
console.log('  2. dist/test-single.html, dist/test-merged.html 직접 테스트');
console.log('  3. 모든 탭과 기능 수동 테스트');

console.log('\n스크린샷 경로 (수동 테스트시):');
console.log('  - 단일 계정: test-results/single-account.png');
console.log('  - 복합 계정: test-results/merged-account.png');
console.log('  - 원본 Demo: test-results/demo.png');

console.log('\n' + '='.repeat(60));
