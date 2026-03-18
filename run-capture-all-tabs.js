
const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

const htmlPath = '/home/seung/.cokacdir/workspace/yif7zotu/screenshots/capture-target.html';
const screenshotsDir = '/home/seung/.cokacdir/workspace/yif7zotu/screenshots/pixel-analysis';
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
    console.log(`Capturing: ${tab.name}...`);

    await page.goto(`file://${htmlPath}`);

    // 위젯 로드 대기
    await page.waitForSelector('#sadv-p', { timeout: 10000 });
    await page.waitForTimeout(2000);

    // 탭 클릭
    const tabClicked = await page.evaluate((tabId) => {
      const tabButton = document.querySelector(`[data-t="${tabId}"]`);
      if (tabButton) {
        tabButton.click();
        return true;
      }
      return false;
    }, tab.id);

    if (!tabClicked) {
      console.log(`  ❌ Tab not found: ${tab.id}`);
      results.push({ tab: tab.name, status: 'failed', reason: 'Tab not found' });
      continue;
    }

    // 렌더링 대기
    await page.waitForTimeout(1500);

    // 스크린샷 캡처
    const screenshotPath = path.join(screenshotsDir, `tab-${tab.id}.png`);
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

    console.log(`  ✓ Captured: ${tab.name}`);
  }

  await browser.close();

  // 결과 저장
  fs.writeFileSync(
    path.join(screenshotsDir, 'capture-results.json'),
    JSON.stringify(results, null, 2)
  );

  console.log('\n=== 캡처 완료 ===');
  console.log(`저장 위치: ${screenshotsDir}`);
  results.forEach(r => {
    if (r.status === 'success') {
      console.log(`  ✓ ${r.tab}: ${r.analysis.textLength}자 콘텐츠`);
    } else {
      console.log(`  ✗ ${r.tab}: ${r.reason}`);
    }
  });
})();
