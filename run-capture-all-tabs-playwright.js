/**
 * Playwright로 모든 탭 스크린샷 캡처
 * 픽셀 단위 분석용
 */

const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

const screenshotsDir = path.join(__dirname, 'screenshots', 'pixel-analysis');
const htmlPath = path.join(__dirname, 'screenshots', 'capture-target.html');
const distPath = path.resolve(__dirname, 'dist');
const runtimeJsPath = path.join(distPath, 'runtime.js');

if (!fs.existsSync(screenshotsDir)) {
  fs.mkdirSync(screenshotsDir, { recursive: true });
}

// 먼저 runtime.js를 읽어서 HTML에 인라인으로 넣기
const runtimeJsContent = fs.readFileSync(runtimeJsPath, 'utf-8');

const htmlContent = `<!DOCTYPE html>
<html lang="ko">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Widget Capture</title>
  <style>
    body {
      margin: 0;
      padding: 0;
      background: #0f172a;
    }
  </style>
</head>
<body>
  <div id="widget-mount"></div>
  <script>
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

    localStorage.setItem('sadv_data_v2', JSON.stringify(TEST_DATA));
  </script>
  <script>
    ${runtimeJsContent.replace(/`/g, '\\`')}
  </script>
</body>
</html>`;

fs.writeFileSync(htmlPath, htmlContent);

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
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ viewport: { width: 400, height: 800 } });
  const page = await context.newPage();

  const results = [];

  for (const tab of tabs) {
    console.log(`캡처 중: ${tab.name}...`);

    await page.goto(`file://${htmlPath}`);

    // 위젯 로드 대기
    await page.waitForSelector('#sadv-p', { timeout: 15000 });
    await page.waitForTimeout(2000);

    // 탭 클릭
    const tabExists = await page.locator(`[data-t="${tab.id}"]`).count() > 0;

    if (!tabExists) {
      console.log(`  ❌ 탭을 찾을 수 없음: ${tab.id}`);
      results.push({ tab: tab.name, status: 'failed', reason: 'Tab not found' });
      continue;
    }

    await page.locator(`[data-t="${tab.id}"]`).click();
    await page.waitForTimeout(2000);

    // 스크린샷 캡처
    const screenshotPath = path.join(screenshotsDir, `tab-${tab.id}.png`);
    await page.screenshot({
      path: screenshotPath,
      fullPage: false
    });

    // 픽셀 분석
    const analysis = await page.evaluate((tabId) => {
      const widget = document.querySelector('#sadv-p');
      if (!widget) return { error: 'Widget not found' };

      const rect = widget.getBoundingClientRect();
      const tabpanel = document.querySelector('#sadv-tabpanel');
      const activeTab = document.querySelector('[role="tab"][aria-selected="true"]');
      const tabsList = document.querySelectorAll('[role="tab"]');

      // 색상 분석
      const styles = window.getComputedStyle(widget);
      const bgColor = styles.backgroundColor;
      const fontSize = styles.fontSize;

      // 탭 패널 내용 분석
      let contentInfo = {};
      if (tabpanel) {
        const hasCards = tabpanel.querySelectorAll('.card, .sadv-card').length;
        const hasTables = tabpanel.querySelectorAll('table').length;
        const hasCharts = tabpanel.querySelectorAll('svg, canvas').length;

        contentInfo = {
          childrenCount: tabpanel.children.length,
          hasCards,
          hasTables,
          hasCharts,
          textLength: tabpanel.textContent.trim().length
        };
      }

      return {
        widgetVisible: rect.width > 0 && rect.height > 0,
        widgetSize: { width: Math.round(rect.width), height: Math.round(rect.height) },
        tabCount: tabsList.length,
        activeTab: activeTab ? activeTab.textContent.trim() : null,
        styles: { bgColor, fontSize },
        contentInfo
      };
    }, tab.id);

    results.push({
      tab: tab.name,
      status: 'success',
      screenshot: screenshotPath,
      analysis: analysis
    });

    console.log(`  ✓ 캡처 완료: ${tab.name} (${analysis.contentInfo?.textLength || 0}자)`);
  }

  await browser.close();

  // 결과 저장
  fs.writeFileSync(
    path.join(screenshotsDir, 'capture-results.json'),
    JSON.stringify(results, null, 2)
  );

  console.log('\n=== 캡처 완료 ===');
  console.log(`저장 위치: ${screenshotsDir}`);

  // 요약 보고서 생성
  const report = [`# 위젯 스크린샷 픽셀 분석 보고서`, '', `## 캡처 탭 요약`, ''];

  results.forEach(r => {
    if (r.status === 'success') {
      const a = r.analysis;
      report.push(`### ${r.tab}`);
      report.push(`- 위젯 크기: ${a.widgetSize.width} x ${a.widgetSize.height}px`);
      report.push(`- 배경색: ${a.styles.bgColor}`);
      report.push(`- 폰트 크기: ${a.styles.fontSize}`);
      report.push(`- 콘텐츠 길이: ${a.contentInfo.textLength}자`);
      report.push(`- 하위 요소: ${a.contentInfo.childrenCount}개`);
      report.push('');
    } else {
      report.push(`### ${r.tab} ❌`);
      report.push(`- 실패: ${r.reason}`);
      report.push('');
    }
  });

  fs.writeFileSync(
    path.join(screenshotsDir, 'ANALYSIS_REPORT.md'),
    report.join('\n')
  );

  console.log('분석 보고서: screenshots/pixel-analysis/ANALYSIS_REPORT.md');
})();
