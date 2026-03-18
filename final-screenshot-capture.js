#!/usr/bin/env node

/**
 * V2 마이그레이션 포괄적 스크린샷 캡처
 * 
 * 캡처 시나리오:
 * 1. 데모 모드 (demo.html)
 * 2. 개별 계정 (test-single.html)
 * 3. 병합 계정 (test-merged.html)
 * 
 * 각 시나리오별 캡처:
 * - 전체 모드 (All Sites) - 개요 탭
 * - 사이트별 모드 (Site) - 모든 탭
 */

const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');

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
  console.log(`  ✓ ${description}: ${filename}`);
}

async function waitForGraphs(page, timeout = 3000) {
  await page.waitForTimeout(timeout);
}

async function captureAllTabsInSiteMode(page, prefix) {
  console.log(`\n  사이트별 모드 - 모든 탭 캡처:`);
  
  for (const tab of TABS) {
    try {
      // 텍스트로 탭 클릭
      await page.click(`#sadv-tabs button.sadv-t:has-text("${tab.text}")`, { timeout: 5000 });
      await page.waitForTimeout(500);
      await waitForGraphs(page);
      await capturePage(page, `${prefix}-site-${tab.name}.png`, `사이트별 ${tab.text} 탭`);
    } catch (e) {
      console.log(`    ⚠ ${tab.text} 탭 건너뜀: ${e.message}`);
    }
  }
}

async function captureScenario(htmlFile, prefix, description) {
  console.log(`\n${'='.repeat(60)}`);
  console.log(`시나리오: ${description}`);
  console.log(`URL: ${BASE_URL}${htmlFile}`);
  console.log(`${'='.repeat(60)}`);

  const browser = await chromium.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const context = await browser.newContext({
    viewport: { width: 1920, height: 1080 }
  });

  const page = await context.newPage();
  await page.goto(`${BASE_URL}${htmlFile}`);
  
  // 페이지 로딩 대기
  await page.waitForLoadState('networkidle');
  await page.waitForTimeout(2000);
  await waitForGraphs(page, 8000);

  // 1. 전체 모드 (기본 상태) - 개요 탭
  await capturePage(page, `${prefix}-all-overview.png`, '전체 모드 - 개요');

  // 2. 사이트별 모드로 전환
  try {
    // 사이트별 모드 버튼 클릭 (data-m="site")
    await page.click('#sadv-mode-bar button[data-m="site"]', { timeout: 5000 });
    await page.waitForTimeout(1000);
    await waitForGraphs(page);
    
    // 3. 사이트별 모드 - 개요 탭
    await capturePage(page, `${prefix}-site-overview.png`, '사이트별 모드 - 개요');
    
    // 4. 사이트별 모드 - 모든 탭 캡처
    await captureAllTabsInSiteMode(page, prefix);
    
  } catch (e) {
    console.log(`    ⚠ 사이트별 모드 전환 실패: ${e.message}`);
  }

  await browser.close();
  console.log(`✅ ${description} 완료`);
}

async function main() {
  console.log('🎬 V2 마이그레이션 포괄적 스크린샷 캡처 시작...');
  console.log(`저장 경로: ${SCREENSHOT_DIR}\n`);

  if (!fs.existsSync(SCREENSHOT_DIR)) {
    fs.mkdirSync(SCREENSHOT_DIR, { recursive: true });
  }

  const scenarios = [
    {
      html: 'demo.html',
      prefix: 'v2-final-demo',
      description: '🎭 데모 모드 (더미 데이터)'
    },
    {
      html: 'test-single.html',
      prefix: 'v2-final-single',
      description: '📁 개별 계정 (실제 데이터)'
    },
    {
      html: 'test-merged.html',
      prefix: 'v2-final-merged',
      description: '🔗 병합 계정 (다중 계정)'
    }
  ];

  for (const scenario of scenarios) {
    await captureScenario(scenario.html, scenario.prefix, scenario.description);
  }

  console.log('\n' + '='.repeat(60));
  console.log('✅ 모든 스크린샷 캡처 완료!');
  console.log(`📁 저장 경로: ${SCREENSHOT_DIR}`);
  console.log('\n📸 캡처된 파일 목록:');

  const files = fs.readdirSync(SCREENSHOT_DIR)
    .filter(f => f.startsWith('v2-final-') && f.endsWith('.png'))
    .sort();

  for (const file of files) {
    const filepath = path.join(SCREENSHOT_DIR, file);
    const stats = fs.statSync(filepath);
    console.log(`  - ${file} (${(stats.size / 1024).toFixed(1)} KB)`);
  }
}

main().catch(console.error);
