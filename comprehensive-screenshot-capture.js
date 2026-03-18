#!/usr/bin/env node

/**
 * 포괄적인 V2 스크린샷 캡처
 *
 * 캡처 시나리오:
 * 1. 데모 모드 (demo.html)
 *    - 전체 현황
 *    - 각 탭 (daily, queries, urls, indexed, crawl, backlink, pattern, insight)
 *    - 개별 사이트 모드
 *
 * 2. 개별 계정 (test-single.html)
 *    - 전체 현황
 *    - 각 탭
 *    - 개별 사이트 모드
 *
 * 3. 병합 계정 (test-merged.html)
 *    - 전체 현황
 *    - 각 탭
 *    - 개별 사이트 모드
 */

const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');

const SCREENSHOT_DIR = path.join(__dirname, 'screenshots');
const BASE_URL = 'file:///home/seung/.cokacdir/workspace/yif7zotu/dist/';

// 탭 정의
const TABS = [
  { id: 'overview', selector: '[data-tab="overview"], button:has-text("Overview")', name: 'overview' },
  { id: 'daily', selector: '[data-tab="daily"], button:has-text("Daily")', name: 'daily' },
  { id: 'queries', selector: '[data-tab="queries"], button:has-text("Queries")', name: 'queries' },
  { id: 'urls', selector: '[data-tab="urls"], button:has-text("Urls")', name: 'urls' },
  { id: 'indexed', selector: '[data-tab="indexed"], button:has-text("Indexed")', name: 'indexed' },
  { id: 'crawl', selector: '[data-tab="crawl"], button:has-text("Crawl")', name: 'crawl' },
  { id: 'backlink', selector: '[data-tab="backlink"], button:has-text("Backlink")', name: 'backlink' },
  { id: 'pattern', selector: '[data-tab="pattern"], button:has-text("Pattern")', name: 'pattern' },
  { id: 'insight', selector: '[data-tab="insight"], button:has-text("Insight")', name: 'insight' },
];

async function capturePage(page, filename, description) {
  const filepath = path.join(SCREENSHOT_DIR, filename);
  await page.screenshot({
    path: filepath,
    fullPage: true
  });
  console.log(`  ✓ ${description}: ${filename}`);
}

async function waitForGraphs(page, timeout = 5000) {
  // 그래프가 렌더링될 때까지 대기
  await page.waitForTimeout(timeout);
}

async function captureAllTabs(page, prefix, description) {
  console.log(`\n  캡처 중: ${description}`);

  for (const tab of TABS) {
    try {
      // 탭 클릭
      await page.click(tab.selector, { timeout: 5000 });
      await page.waitForTimeout(500);

      // 그래프 렌더링 대기
      await waitForGraphs(page);

      // 캡처
      await capturePage(page, `${prefix}-${tab.name}.png`, `${tab.name} 탭`);
    } catch (e) {
      console.log(`    ⚠ 탭 ${tab.name} 건너뜀: ${e.message}`);
    }
  }
}

async function captureSiteMode(page, prefix) {
  try {
    // 사이트별 모드로 전환
    const siteSelector = '[data-mode="site"], .site-selector, button:has-text("Site")';
    await page.click(siteSelector, { timeout: 5000 });
    await page.waitForTimeout(500);
    await waitForGraphs(page);
    await capturePage(page, `${prefix}-site-mode.png`, '사이트별 모드');

    // 사이트별 모드에서도 탭 캡처
    await captureAllTabs(page, `${prefix}-site`, '사이트별 모드 탭들');

    // 다시 전체 모드로
    const allSelector = '[data-mode="all"], .all-sites-selector, button:has-text("All")';
    await page.click(allSelector, { timeout: 5000 });
    await page.waitForTimeout(500);
  } catch (e) {
    console.log(`    ⚠ 사이트 모드 캡처 건너뜀: ${e.message}`);
  }
}

async function captureScenario(htmlFile, prefix, description) {
  console.log(`\n${'='.repeat(50)}`);
  console.log(`시나리오: ${description}`);
  console.log(`URL: ${BASE_URL}${htmlFile}`);
  console.log(`${'='.repeat(50)}`);

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
  await page.waitForTimeout(1000);
  await waitForGraphs(page, 8000);

  // 전체 현황 (Overview 탭이 기본)
  await capturePage(page, `${prefix}-overview.png`, '전체 현황');

  // 모든 탭 캡처
  await captureAllTabs(page, `${prefix}-all`, '전체 모드 탭들');

  // 사이트별 모드 캡처
  await captureSiteMode(page, prefix);

  await browser.close();
  console.log(`✅ ${description} 완료`);
}

async function main() {
  console.log('🎬 포괄적인 V2 스크린샷 캡처 시작...');
  console.log(`저장 경로: ${SCREENSHOT_DIR}\n`);

  // 스크린샷 디렉토리 생성
  if (!fs.existsSync(SCREENSHOT_DIR)) {
    fs.mkdirSync(SCREENSHOT_DIR, { recursive: true });
  }

  const scenarios = [
    {
      html: 'demo.html',
      prefix: 'v2-demo',
      description: '🎭 데모 모드 (더미 데이터)'
    },
    {
      html: 'test-single.html',
      prefix: 'v2-single',
      description: '📁 개별 계정 (실제 데이터)'
    },
    {
      html: 'test-merged.html',
      prefix: 'v2-merged',
      description: '🔗 병합 계정 (다중 계정)'
    }
  ];

  for (const scenario of scenarios) {
    await captureScenario(scenario.html, scenario.prefix, scenario.description);
  }

  console.log('\n' + '='.repeat(50));
  console.log('✅ 모든 스크린샷 캡처 완료!');
  console.log(`📁 저장 경로: ${SCREENSHOT_DIR}`);
  console.log('\n📸 캡처된 파일 목록:');

  const files = fs.readdirSync(SCREENSHOT_DIR)
    .filter(f => f.startsWith('v2-') && f.endsWith('.png'))
    .sort();

  for (const file of files) {
    const filepath = path.join(SCREENSHOT_DIR, file);
    const stats = fs.statSync(filepath);
    console.log(`  - ${file} (${(stats.size / 1024).toFixed(1)} KB)`);
  }
}

main().catch(console.error);
