#!/usr/bin/env node

/**
 * 전체 화면 검증 및 캡처
 * 모든 페이지 유형, 모든 탭, 모드별로 캡처
 */

const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

const SCREENSHOT_DIR = path.join(__dirname, 'screenshots');
const BASE_URL = 'file:///home/seung/.cokacdir/workspace/yif7zotu/dist/';

// 탭 정의 (한국어 텍스트)
const TABS = [
  { name: 'overview', text: '개요' },
  { name: 'daily', text: '일별' },
  { name: 'urls', text: 'URL' },
  { name: 'queries', text: '검색어' },
  { name: 'indexed', text: '색인' },
  { name: 'crawl', text: '크롤' },
  { name: 'backlink', text: '백링크' },
  { name: 'pattern', text: '패턴' },
  { name: 'insight', text: '인사이트' }
];

async function capturePage(page, filename, description) {
  const filepath = path.join(SCREENSHOT_DIR, filename);
  await page.screenshot({ path: filepath, fullPage: true });
  console.log(`    ✓ ${description}`);
  return filepath;
}

async function waitForGraphs(page, timeout = 3000) {
  await page.waitForTimeout(timeout);
}

async function validatePageStructure(page, scenario) {
  return await page.evaluate(() => {
    const result = {
      hasPanel: !!document.getElementById('sadv-p'),
      hasTabPanel: !!document.getElementById('sadv-tabpanel'),
      hasModeBar: !!document.getElementById('sadv-mode-bar'),
      hasSiteBar: !!document.getElementById('sadv-site-bar'),
      hasTabs: !!document.getElementById('sadv-tabs'),
      tabCount: document.querySelectorAll('#sadv-tabs button').length,
      hasGraphs: document.querySelectorAll('svg[width*="100%"]').length,
      hasKPI: document.querySelectorAll('.sadv-kpi-grid').length
    };
    return result;
  });
}

async function captureAllTabs(page, prefix) {
  const results = [];
  
  for (const tab of TABS) {
    try {
      await page.click(`#sadv-tabs button.sadv-t:has-text("${tab.text}")`, { timeout: 5000 });
      await page.waitForTimeout(800);
      await waitForGraphs(page, 4000);
      
      const filename = `${prefix}-${tab.name}.png`;
      await capturePage(page, filename, `${tab.text} 탭`);
      
      // 탭별 데이터 검증
      const tabData = await page.evaluate(() => {
        const tp = document.getElementById('sadv-tabpanel');
        if (!tp) return { error: 'no tabpanel' };
        return {
          hasContent: tp.innerHTML.length > 1000,
          hasGraphs: tp.querySelectorAll('svg[width*="100%"]').length,
          childCount: tp.children.length
        };
      });
      
      results.push({ tab: tab.name, success: true, data: tabData });
    } catch (e) {
      console.log(`    ⚠ ${tab.text} 탭 실패: ${e.message}`);
      results.push({ tab: tab.name, success: false, error: e.message });
    }
  }
  
  return results;
}

async function validateScenario(htmlFile, scenarioName) {
  console.log(`\n${'='.repeat(70)}`);
  console.log(`검증: ${scenarioName} (${htmlFile})`);
  console.log(`${'='.repeat(70)}`);

  const browser = await chromium.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const context = await browser.newContext({
    viewport: { width: 1920, height: 1200 }
  });

  const page = await context.newPage();
  
  // 콘솔 로그 수집
  const logs = [];
  page.on('console', msg => {
    if (msg.type() === 'error') {
      logs.push(`[ERROR] ${msg.text()}`);
    }
  });

  await page.goto(`${BASE_URL}${htmlFile}`);
  await page.waitForLoadState('networkidle');
  await page.waitForTimeout(5000);
  await waitForGraphs(page, 8000);

  // 구조 검증
  const structure = await validatePageStructure(page, scenarioName);
  console.log('\n[구조 검증]');
  console.log(`  우측 패널(sadv-p): ${structure.hasPanel ? '✅' : '❌'}`);
  console.log(`  탭 패널(sadv-tabpanel): ${structure.hasTabPanel ? '✅' : '❌'}`);
  console.log(`  모드 바: ${structure.hasModeBar ? '✅' : '❌'}`);
  console.log(`  사이트 바: ${structure.hasSiteBar ? '✅' : '❌'}`);
  console.log(`  탭 버튼 수: ${structure.tabCount}`);
  console.log(`  그래프 SVG 수: ${structure.hasGraphs}`);
  console.log(`  KPI 카드 수: ${structure.hasKPI}`);

  // 데이터 확인
  const dataInfo = await page.evaluate(() => {
    const payload = window.__SEARCHADVISOR_EXPORT_PAYLOAD__;
    if (!payload) return { error: 'no payload' };
    
    return {
      hasMeta: !!payload.__meta,
      version: payload.__meta?.version,
      accountCount: payload.__meta?.accountCount,
      hasAccounts: !!payload.accounts,
      accountKeys: payload.accounts ? Object.keys(payload.accounts) : [],
      hasUI: !!payload.ui,
      hasStats: !!payload.stats
    };
  });

  console.log('\n[V2 데이터 검증]');
  console.log(`  __meta 존재: ${dataInfo.hasMeta ? '✅' : '❌'}`);
  console.log(`  version: ${dataInfo.version || 'N/A'}`);
  console.log(`  accountCount: ${dataInfo.accountCount || 'N/A'}`);
  console.log(`  accounts 존재: ${dataInfo.hasAccounts ? '✅' : '❌'}`);
  console.log(`  계정 키: ${dataInfo.accountKeys.join(', ') || 'N/A'}`);
  console.log(`  ui 존재: ${dataInfo.hasUI ? '✅' : '❌'}`);
  console.log(`  stats 존재: ${dataInfo.hasStats ? '✅' : '❌'}`);

  const results = {
    scenario: scenarioName,
    file: htmlFile,
    structure,
    dataInfo,
    errors: logs,
    tabs: []
  };

  // 전체 모드 개요 캡처
  await capturePage(page, `${scenarioName}-all-overview.png`, '전체 모드 - 개요');
  
  // 사이트별 모드 전환 및 캡처
  try {
    await page.click('#sadv-mode-bar button[data-m="site"]', { timeout: 5000 });
    await page.waitForTimeout(1000);
    await waitForGraphs(page);
    await capturePage(page, `${scenarioName}-site-overview.png`, '사이트별 모드 - 개요');
    
    // 모든 탭 캡처
    results.tabs = await captureAllTabs(page, scenarioName);
    
    // 다시 전체 모드로
    await page.click('#sadv-mode-bar button[data-m="all"]', { timeout: 5000 });
    await page.waitForTimeout(1000);
  } catch (e) {
    console.log(`    ⚠ 사이트 모드 전환 실패: ${e.message}`);
  }

  await browser.close();
  return results;
}

async function main() {
  console.log('🎬 전체 화면 검증 및 캡처 시작...');
  console.log(`저장 경로: ${SCREENSHOT_DIR}\n`);

  if (!fs.existsSync(SCREENSHOT_DIR)) {
    fs.mkdirSync(SCREENSHOT_DIR, { recursive: true });
  }

  const scenarios = [
    { file: 'saved-single-account.html', name: '개별-계정-저장본' },
    { file: 'saved-merged-account.html', name: '병합-계정-저장본' },
    { file: 'test-single-fixed.html', name: '개별-계정-테스트' },
    { file: 'test-merged-fixed.html', name: '병합-계정-테스트' },
    { file: 'demo.html', name: '데모-모드' }
  ];

  const allResults = [];
  
  for (const scenario of scenarios) {
    const result = await validateScenario(scenario.file, scenario.name);
    allResults.push(result);
  }

  // 최종 리포트 생성
  console.log('\n' + '='.repeat(70));
  console.log('📊 최종 검증 리포트');
  console.log('='.repeat(70));

  const report = {
    timestamp: new Date().toISOString(),
    scenarios: allResults,
    summary: {
      total: allResults.length,
      passed: allResults.filter(r => r.structure.hasPanel && r.structure.hasTabPanel).length,
      failed: allResults.filter(r => !r.structure.hasPanel || !r.structure.hasTabPanel).length
    }
  };

  const reportPath = path.join(__dirname, 'docs', 'VALIDATION_REPORT.json');
  fs.mkdirSync(path.dirname(reportPath), { recursive: true });
  fs.writeFileSync(reportPath, JSON.stringify(report, null, 2), 'utf-8');
  console.log(`\n📄 리포트 저장: ${reportPath}`);

  // 상세 출력
  console.log('\n[시나리오별 결과]');
  allResults.forEach(r => {
    const status = (r.structure.hasPanel && r.structure.hasTabPanel) ? '✅' : '❌';
    const tabStatus = r.tabs.filter(t => t.success).length + '/' + r.tabs.length;
    console.log(`  ${status} ${r.scenario}: 탭 ${tabStatus}`);
    if (r.errors.length > 0) {
      console.log(`      에러: ${r.errors.join(', ')}`);
    }
  });
}

main().catch(console.error);
