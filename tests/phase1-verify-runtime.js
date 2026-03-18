#!/usr/bin/env node

/**
 * Phase 1 빌드 검증 - runtime.js 직접 검사
 */

const fs = require('fs');
const path = require('path');

const runtimePath = path.join(__dirname, '../dist/runtime.js');
const runtimeContent = fs.readFileSync(runtimePath, 'utf-8');

console.log('\n═══════════════════════════════════════');
console.log('Phase 1 빌드 검증 - runtime.js 분석');
console.log('═══════════════════════════════════════\n');

// 테스트 1: ACCOUNT_UTILS 존재
console.log('📋 테스트 1: ACCOUNT_UTILS 정의 확인');
const hasAccountUtils = runtimeContent.includes('const ACCOUNT_UTILS = {');
console.log(`  ${hasAccountUtils ? '✅' : '❌'} ACCOUNT_UTILS 정의: ${hasAccountUtils ? '있음' : '없음'}`);

if (hasAccountUtils) {
  const methods = [
    'getAccountLabel',
    'getEncId',
    'getAccountInfo',
    'getCurrentAccount',
    'isMultiAccount',
    'getAllAccounts'
  ];

  console.log('\n  메서드 확인:');
  methods.forEach(method => {
    const hasMethod = runtimeContent.includes(`${method}:function`) ||
                     runtimeContent.includes(`${method}: function`);
    console.log(`    ${hasMethod ? '✅' : '❌'} ${method}`);
  });
}

// 테스트 2: XSS 방지
console.log('\n📋 테스트 2: XSS 방지 (ibox 함수)');
const hasXssWarning = runtimeContent.includes('[SECURITY]') &&
                     runtimeContent.includes('ibox');
console.log(`  ${hasXssWarning ? '✅' : '❌'} XSS 보안 경고: ${hasXssWarning ? '있음' : '없음'}`);

// 테스트 3: 다중 계정 지원
console.log('\n📋 테스트 3: 다중 계정 지원');
const hasHandleV2MultiAccount = runtimeContent.includes('function handleV2MultiAccount') ||
                                runtimeContent.includes('handleV2MultiAccount=function');
const hasSwitchAccount = runtimeContent.includes('function switchAccount') ||
                         runtimeContent.includes('switchAccount=function');
const hasGetAccountList = runtimeContent.includes('function getAccountList') ||
                          runtimeContent.includes('getAccountList=function');
const hasAccountState = runtimeContent.includes('__sadvAccountState');

console.log(`  ${hasHandleV2MultiAccount ? '✅' : '❌'} handleV2MultiAccount: ${hasHandleV2MultiAccount ? '있음' : '없음'}`);
console.log(`  ${hasSwitchAccount ? '✅' : '❌'} switchAccount: ${hasSwitchAccount ? '있음' : '없음'}`);
console.log(`  ${hasGetAccountList ? '✅' : '❌'} getAccountList: ${hasGetAccountList ? '있음' : '없음'}`);
console.log(`  ${hasAccountState ? '✅' : '❌'} __sadvAccountState: ${hasAccountState ? '사용함' : '안 함'}`);

// 테스트 4: exportCurrentAccountData 옵션 지원
console.log('\n📋 테스트 4: exportCurrentAccountData 옵션 지원');
const hasExportOptions = runtimeContent.includes('exportCurrentAccountData(options') ||
                       runtimeContent.includes('exportCurrentAccountData(options');
const hasExportSingle = runtimeContent.includes('function exportSingleAccount') ||
                        runtimeContent.includes('exportSingleAccount=function');
const hasIncludeAll = runtimeContent.includes('includeAll');

console.log(`  ${hasExportOptions ? '✅' : '❌'} options 파라미터: ${hasExportOptions ? '있음' : '없음'}`);
console.log(`  ${hasExportSingle ? '✅' : '❌'} exportSingleAccount: ${hasExportSingle ? '있음' : '없음'}`);
console.log(`  ${hasIncludeAll ? '✅' : '❌'} includeAll 옵션: ${hasIncludeAll ? '있음' : '없음'}`);

// 테스트 5: V2 구조
console.log('\n📋 테스트 5: V2 Payload 구조');
const hasV2Version = runtimeContent.includes('PAYLOAD_V2') ||
                    runtimeContent.includes('version: "1.0"');
const hasAccountsField = runtimeContent.includes('accounts:') ||
                        runtimeContent.includes('accounts:{');
const hasSiteOwnership = runtimeContent.includes('_siteOwnership') ||
                         runtimeContent.includes('siteOwnership');

console.log(`  ${hasV2Version ? '✅' : '❌'} V2 버전: ${hasV2Version ? '있음' : '없음'}`);
console.log(`  ${hasAccountsField ? '✅' : '❌'} accounts 필드: ${hasAccountsField ? '있음' : '없음'}`);
console.log(`  ${hasSiteOwnership ? '✅' : '❌'} siteOwnership: ${hasSiteOwnership ? '있음' : '없음'}`);

// 요약
console.log('\n═══════════════════════════════════════');
console.log('요약');
console.log('═══════════════════════════════════════');

const results = {
  accountUtils: hasAccountUtils,
  xssWarning: hasXssWarning,
  multiAccount: hasHandleV2MultiAccount && hasSwitchAccount && hasGetAccountList,
  exportOptions: hasExportOptions && hasExportSingle && hasIncludeAll,
  v2Structure: hasV2Version && hasAccountsField
};

const passCount = Object.values(results).filter(v => v).length;
const totalCount = Object.keys(results).length;

console.log(`\n통과: ${passCount}/${totalCount}`);
console.log('\n상세:');
Object.entries(results).forEach(([key, value]) => {
  console.log(`  ${value ? '✅' : '❌'} ${key}`);
});

console.log('\n');

if (passCount === totalCount) {
  console.log('🎉 모든 Phase 1 수정 사항이 빌드에 반영되었습니다!');
} else {
  console.log('⚠️  일부 수정 사항이 빠져있을 수 있습니다.');
}

process.exit(passCount === totalCount ? 0 : 1);
