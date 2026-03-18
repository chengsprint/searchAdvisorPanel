/**
 * Puppeteer로 모든 탭 스크린샷 캡처
 * 픽셀 단위 분석용
 */

const fs = require('fs');
const path = require('path');
const { URL } = require('url');

// 간단한 HTML 파일 생성 (Puppeteer용)
const htmlPath = path.join(__dirname, 'screenshots', 'capture-target.html');
const screenshotsDir = path.join(__dirname, 'screenshots', 'pixel-analysis');

if (!fs.existsSync(screenshotsDir)) {
  fs.mkdirSync(screenshotsDir, { recursive: true });
}

const htmlContent = `<!DOCTYPE html>
<html lang="ko">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Widget Capture</title>
  <style>
    body {
      margin: 0;
      padding: 20px;
      background: #0f172a;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    }
    .capture-container {
      width: 400px;
      margin: 0 auto;
    }
  </style>
</head>
<body>
  <div class="capture-container">
    <div id="widget-mount"></div>
  </div>
  <script>
    // 테스트 데이터
    const TEST_DATA = {
      __meta: { version: '2.0.0', generatedAt: new Date().toISOString() },
      accounts: [{
        id: 'test-1',
        label: '테스트 계정',
        siteUrl: 'https://example.com',
        crawlData: {
          '2026-03-18': {
            clicks: 1250,
            impressions: 8500,
            ctr: 14.7,
            position: 12.5,
            pages: [
              { url: 'https://example.com/page1', clicks: 450, impressions: 3200, ctr: 14.1, position: 8.5 },
              { url: 'https://example.com/page2', clicks: 320, impressions: 2100, ctr: 15.2, position: 15.2 },
              { url: 'https://example.com/page3', clicks: 180, impressions: 1500, ctr: 12.0, position: 22.1 }
            ],
            queries: [
              { query: 'test keyword', clicks: 280, impressions: 1200, ctr: 23.3, position: 5.2 },
              { query: 'example search', clicks: 195, impressions: 980, ctr: 19.9, position: 8.1 },
              { query: 'demo query', clicks: 120, impressions: 850, ctr: 14.1, position: 12.5 }
            ]
          }
        },
        backlinkData: {
          totalBacklinks: 1250,
          newBacklinks: 45,
          lostBacklinks: 12,
          referringDomains: 180,
          topAnchors: [
            { text: 'example', count: 45 },
            { text: 'test', count: 32 },
            { text: 'demo', count: 28 }
          ]
        },
        diagnosisMeta: {
          siteHealth: 85,
          indexedPages: 1250,
          crawlErrors: 12,
          mobileFriendly: true,
          pageSpeedScore: 78
        }
      }],
      ui: { currentTab: 'overview', currentAccount: 'test-1' },
      stats: {
        totalClicks: 1250,
        totalImpressions: 8500,
        avgCtr: 14.7,
        avgPosition: 12.5
      }
    };

    // 데이터 저장
    localStorage.setItem('sadv_data_v2', JSON.stringify(TEST_DATA));
  </script>
  <script src="../dist/runtime.js"></script>
  <script>
    // 위젯이 로드될 때까지 기다림
    window.addEventListener('load', () => {
      window.__widgetReady = true;
    });
  </script>
</body>
</html>`;

fs.writeFileSync(htmlPath, htmlContent);

// Puppeteer 캡처 스크립트
const captureScript = `
const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

const htmlPath = '${htmlPath}';
const screenshotsDir = '${screenshotsDir}';
const tabs = [
  { id: 'overview', name: '전체현황' },
  { id: 'daily', name: '일별현황' },
  { id: 'queries', name: '검색어' },
  { id: 'pages', name: '페이지' },
  { id: 'pattern', name: '패턴' },
  { id: 'crawl', name: '크롤링' },
  { id: 'backlink', name: '백링크' },
  { id: 'diagnosis', name: '진단' },
  { id: 'insight', name: '인사이트' }
];

(async () => {
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 400, height: 800 });

  const results = [];

  for (const tab of tabs) {
    console.log(\`Capturing: \${tab.name}...\`);

    await page.goto(\`file://\${htmlPath}\`);

    // 위젯 로드 대기
    await page.waitForSelector('#sadv-p', { timeout: 10000 });
    await page.waitForTimeout(2000);

    // 탭 클릭
    const tabClicked = await page.evaluate((tabId) => {
      const tabButton = document.querySelector(\`[data-t="\${tabId}"]\`);
      if (tabButton) {
        tabButton.click();
        return true;
      }
      return false;
    }, tab.id);

    if (!tabClicked) {
      console.log(\`  ❌ Tab not found: \${tab.id}\`);
      results.push({ tab: tab.name, status: 'failed', reason: 'Tab not found' });
      continue;
    }

    // 렌더링 대기
    await page.waitForTimeout(1500);

    // 스크린샷 캡처
    const screenshotPath = path.join(screenshotsDir, \`tab-\${tab.id}.png\`);
    await page.screenshot({
      path: screenshotPath,
      clip: { x: 0, y: 0, width: 400, height: 800 }
    });

    // 픽셀 분석
    const analysis = await page.evaluate((tabId) => {
      const widget = document.querySelector('#sadv-p');
      if (!widget) return { error: 'Widget not found' };

      const rect = widget.getBoundingClientRect();
      const tabpanel = document.querySelector('#sadv-tabpanel');
      const activeTab = document.querySelector('[role="tab"][aria-selected="true"]');

      return {
        widgetVisible: rect.width > 0 && rect.height > 0,
        widgetSize: { width: rect.width, height: rect.height },
        hasContent: tabpanel ? tabpanel.children.length : 0,
        activeTab: activeTab ? activeTab.textContent.trim() : null,
        textLength: tabpanel ? tabpanel.textContent.trim().length : 0
      };
    }, tab.id);

    results.push({
      tab: tab.name,
      status: 'success',
      screenshot: screenshotPath,
      analysis: analysis
    });

    console.log(\`  ✓ Captured: \${tab.name}\`);
  }

  await browser.close();

  // 결과 저장
  fs.writeFileSync(
    path.join(screenshotsDir, 'capture-results.json'),
    JSON.stringify(results, null, 2)
  );

  console.log('\\n=== 캡처 완료 ===');
  console.log(\`저장 위치: \${screenshotsDir}\`);
  results.forEach(r => {
    if (r.status === 'success') {
      console.log(\`  ✓ \${r.tab}: \${r.analysis.textLength}자 콘텐츠\`);
    } else {
      console.log(\`  ✗ \${r.tab}: \${r.reason}\`);
    }
  });
})();
`;

fs.writeFileSync(path.join(__dirname, 'run-capture-all-tabs.js'), captureScript);
console.log('Created: run-capture-all-tabs.js');
