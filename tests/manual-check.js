const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

async function manualCheck() {
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();

  // 콘솔 로그 수집
  page.on('console', msg => {
    const type = msg.type();
    const text = msg.text();
    console.log(`[${type.toUpperCase()}]`, text);
  });

  // 에러 수집
  page.on('pageerror', error => {
    console.error('Page Error:', error.message);
  });

  try {
    console.log('\n=== 테스트 1: 단일 계정 ===');
    await page.goto('http://localhost:8080/test-single.html', {
      waitUntil: 'networkidle2',
      timeout: 10000
    });

    // 초기화 대기
    await page.waitForTimeout(3000);

    // 스크린샷
    await page.screenshot({
      path: 'test-results/single-account.png',
      fullPage: true
    });

    // DOM 구조 확인
    const domCheck = await page.evaluate(() => {
      return {
        hasSadVPanel: !!document.getElementById('sadv-react-shell-root'),
        hasSadVShell: !!document.querySelector('.sadvx-shell'),
        hasSadVP: !!document.getElementById('sadv-p'),
        allSites: window.allSites || [],
        memCacheKeys: window.memCache ? Object.keys(window.memCache) : [],
        curMode: window.curMode,
        curSite: window.curSite,
        curTab: window.curTab
      };
    });

    console.log('DOM Check:', JSON.stringify(domCheck, null, 2));

    // 데이터 확인
    const dataCheck = await page.evaluate(() => {
      const site = 'https://site1-example.com';
      const data = window.memCache?.[site];
      if (!data) return { error: 'No data found' };

      return {
        hasExpose: !!data.expose,
        hasCrawl: !!data.crawl,
        hasBacklink: !!data.backlink,
        hasDiagnosis: !!data.diagnosisMeta,
        hasMeta: !!data.__meta,
        schemaVersion: data.__meta?.__schema,
        detailLoaded: data.detailLoaded,
        exposeLogsCount: data.expose?.items?.[0]?.logs?.length || 0,
        crawlStatsCount: data.crawl?.items?.[0]?.stats?.length || 0,
        backlinkTotal: data.backlink?.items?.[0]?.total || 0,
        diagnosisMetaCount: data.diagnosisMeta?.items?.[0]?.meta?.length || 0
      };
    });

    console.log('Data Check:', JSON.stringify(dataCheck, null, 2));

    console.log('\n=== 테스트 2: 복합 계정 ===');
    await page.goto('http://localhost:8080/test-merged.html', {
      waitUntil: 'networkidle2',
      timeout: 10000
    });

    await page.waitForTimeout(3000);

    await page.screenshot({
      path: 'test-results/merged-account.png',
      fullPage: true
    });

    const mergedCheck = await page.evaluate(() => {
      return {
        allSites: window.allSites || [],
        memCacheKeys: window.memCache ? Object.keys(window.memCache) : [],
        mergedMeta: window.__SEARCHADVISOR_EXPORT_PAYLOAD__?.mergedMeta,
        hasInitData: !!window.__sadvInitData,
        hasMergedData: !!window.__sadvMergedData
      };
    });

    console.log('Merged Check:', JSON.stringify(mergedCheck, null, 2));

    console.log('\n=== 테스트 3: 원본 demo.html ===');
    await page.goto('http://localhost:8080/demo.html', {
      waitUntil: 'networkidle2',
      timeout: 10000
    });

    await page.waitForTimeout(3000);

    await page.screenshot({
      path: 'test-results/demo.png',
      fullPage: true
    });

    const demoCheck = await page.evaluate(() => {
      return {
        hasSadVPanel: !!document.getElementById('sadv-react-shell-root'),
        hasSadVShell: !!document.querySelector('.sadvx-shell'),
        allSites: window.allSites || [],
        memCacheKeys: window.memCache ? Object.keys(window.memCache) : []
      };
    });

    console.log('Demo Check:', JSON.stringify(demoCheck, null, 2));

  } catch (error) {
    console.error('Test Error:', error);
  } finally {
    await browser.close();
  }

  console.log('\n스크린샷이 test-results/ 디렉토리에 저장되었습니다.');
}

// 결과 디렉토리 생성
if (!fs.existsSync('test-results')) {
  fs.mkdirSync('test-results', { recursive: true });
}

manualCheck().then(() => {
  process.exit(0);
}).catch(error => {
  console.error('Fatal Error:', error);
  process.exit(1);
});