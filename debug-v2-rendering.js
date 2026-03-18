#!/usr/bin/env node

/**
 * V2 렌더링 디버깅 스크립트
 * 실제 브라우저에서 콘솔 로그를 확인하여 문제 파악
 */

const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

const BASE_URL = 'file:///home/seung/.cokacdir/workspace/yif7zotu/dist/';

async function debugPage(htmlFile) {
  console.log(`\n${'='.repeat(60)}`);
  console.log(`디버깅: ${htmlFile}`);
  console.log(`${'='.repeat(60)}`);

  const browser = await chromium.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const context = await browser.newContext({
    viewport: { width: 1920, height: 1080 }
  });

  const page = await context.newPage();

  // 콘솔 로그 수집
  const logs = [];
  page.on('console', msg => {
    const text = msg.text();
    logs.push({
      type: msg.type(),
      text: text
    });
    console.log(`  [${msg.type()}] ${text}`);
  });

  // 에러 수집
  page.on('pageerror', error => {
    console.log(`  [ERROR] ${error.message}`);
  });

  await page.goto(`${BASE_URL}${htmlFile}`, {
    waitUntil: 'networkidle',
    timeout: 30000
  });

  // 대기
  await page.waitForTimeout(5000);

  // DOM 상태 확인
  const domCheck = await page.evaluate(() => {
    return {
      hasChartContainer: !!document.querySelector('#chart-daily-clicks'),
      chartContainerHTML: document.querySelector('#chart-daily-clicks')?.outerHTML?.slice(0, 200),
      hasGraphElements: document.querySelectorAll('svg').length,
      hasCanvas: document.querySelectorAll('canvas').length,
      curTab: typeof curTab !== 'undefined' ? curTab : 'undefined',
      curMode: typeof curMode !== 'undefined' ? curMode : 'undefined',
      curSite: typeof curSite !== 'undefined' ? curSite : 'undefined',
      gSiteDataExists: typeof gSiteData !== 'undefined',
      gSiteDataType: typeof gSiteData,
      gSiteDataKeys: typeof gSiteData !== 'undefined' ? Object.keys(gSiteData || {}).slice(0, 3) : []
    };
  });

  console.log('\n  [DOM 상태]');
  console.log(`    chart-daily-clicks 존재: ${domCheck.hasChartContainer}`);
  console.log(`    SVG 요소 수: ${domCheck.hasGraphElements}`);
  console.log(`    Canvas 요소 수: ${domCheck.hasCanvas}`);
  console.log(`    curTab: ${domCheck.curTab}`);
  console.log(`    curMode: ${domCheck.curMode}`);
  console.log(`    curSite: ${domCheck.curSite}`);
  console.log(`    gSiteData 존재: ${domCheck.gSiteDataExists}`);
  console.log(`    gSiteData 타입: ${domCheck.gSiteDataType}`);
  console.log(`    gSiteData 키: ${JSON.stringify(domCheck.gSiteDataKeys)}`);

  // 데이터 확인
  const dataCheck = await page.evaluate(() => {
    if (typeof gSiteData === 'undefined') return { error: 'gSiteData is undefined' };

    const sites = Object.keys(gSiteData);
    if (sites.length === 0) return { error: 'No sites in gSiteData' };

    const firstSite = sites[0];
    const siteData = gSiteData[firstSite];

    return {
      firstSite: firstSite,
      hasExpose: !!siteData?.expose,
      hasCrawl: !!siteData?.crawl,
      hasBacklink: !!siteData?.backlink,
      exposeItems: siteData?.expose?.items?.length || 0,
      exposeHasLogs: siteData?.expose?.items?.[0]?.logs?.length || 0
    };
  });

  console.log('\n  [데이터 상태]');
  console.log(`    ${JSON.stringify(dataCheck, null, 2)}`);

  // 로그 저장
  const logPath = path.join(__dirname, 'debug-logs', `${htmlFile.replace('.html', '')}.log`);
  fs.mkdirSync(path.dirname(logPath), { recursive: true });
  fs.writeFileSync(logPath, JSON.stringify({ logs, domCheck, dataCheck }, null, 2));
  console.log(`\n  로그 저장: ${logPath}`);

  await browser.close();
}

async function main() {
  const files = [
    'demo.html',
    'test-single.html',
    'test-merged.html'
  ];

  for (const file of files) {
    await debugPage(file);
  }

  console.log('\n' + '='.repeat(60));
  console.log('디버깅 완료!');
}

main().catch(console.error);
