/**
 * 기존 HTML 파일 사용하여 모든 탭 캡처
 */

const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

const screenshotsDir = path.join(__dirname, 'screenshots', 'pixel-analysis');
if (!fs.existsSync(screenshotsDir)) {
  fs.mkdirSync(screenshotsDir, { recursive: true });
}

const testHtmlPath = path.join(__dirname, 'dist', 'test-single-fixed.html');

// HTML 파일이 있는지 확인
if (!fs.existsSync(testHtmlPath)) {
  console.error(`테스트 HTML 파일을 찾을 수 없음: ${testHtmlPath}`);
  process.exit(1);
}

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

    await page.goto(`file://${testHtmlPath}`);

    // 위젯 로드 대기 - 위젯 ID 확인
    try {
      await page.waitForSelector('#sadv-p, #sadv-tabs, [role="tab"]', { timeout: 15000 });
    } catch (e) {
      console.log(`  ⚠️ 위젯 로드 타임아웃, 계속 시도...`);
    }

    await page.waitForTimeout(3000);

    // 탭 존재 확인
    const tabCount = await page.locator('[role="tab"], .sadv-t').count();
    console.log(`  - 발견된 탭 수: ${tabCount}`);

    if (tabCount === 0) {
      // 디버깅: 페이지 내용 확인
      const bodyText = await page.evaluate(() => document.body.innerHTML.substring(0, 500));
      console.log(`  - 페이지 내용 미리보기: ${bodyText.substring(0, 200)}...`);

      results.push({ tab: tab.name, status: 'failed', reason: 'No tabs found' });
      continue;
    }

    // 탭 클릭
    const clicked = await page.evaluate((tabId) => {
      // 다양한 셀렉터 시도
      const selectors = [
        `[data-t="${tabId}"]`,
        `[role="tab"][data-t="${tabId}"]`,
        `.sadv-t[data-t="${tabId}"]`
      ];

      for (const selector of selectors) {
        const el = document.querySelector(selector);
        if (el) {
          el.click();
          return { clicked: true, selector };
        }
      }
      return { clicked: false };
    }, tab.id);

    if (!clicked.clicked) {
      console.log(`  ❌ 탭 클릭 실패: ${tab.id}`);
      results.push({ tab: tab.name, status: 'failed', reason: 'Tab click failed' });
      continue;
    }

    await page.waitForTimeout(2000);

    // 스크린샷 캡처
    const screenshotPath = path.join(screenshotsDir, `tab-${tab.id}.png`);
    await page.screenshot({
      path: screenshotPath,
      fullPage: false
    });

    // 픽셀 분석
    const analysis = await page.evaluate((tabId) => {
      const widget = document.querySelector('#sadv-p') || document.querySelector('[id*="sadv"]');
      const tabpanel = document.querySelector('#sadv-tabpanel');
      const activeTab = document.querySelector('[role="tab"][aria-selected="true"]') ||
                        document.querySelector('.sadv-t.on');
      const tabsList = document.querySelectorAll('[role="tab"], .sadv-t');

      let result = {
        widgetFound: !!widget,
        tabCount: tabsList.length,
        activeTab: activeTab ? activeTab.textContent.trim() : null,
      };

      if (widget) {
        const rect = widget.getBoundingClientRect();
        const styles = window.getComputedStyle(widget);
        result.widgetSize = { width: Math.round(rect.width), height: Math.round(rect.height) };
        result.bgColor = styles.backgroundColor;
        result.fontSize = styles.fontSize;
      }

      if (tabpanel) {
        result.contentLength = tabpanel.textContent.trim().length;
        result.childrenCount = tabpanel.children.length;
        result.hasCards = tabpanel.querySelectorAll('.card, .sadv-card').length;
        result.hasTables = tabpanel.querySelectorAll('table').length;
      } else {
        result.contentLength = 0;
      }

      return result;
    }, tab.id);

    results.push({
      tab: tab.name,
      status: 'success',
      screenshot: screenshotPath,
      analysis: analysis
    });

    console.log(`  ✓ 캡처 완료: ${tab.name} (${analysis.contentLength || 0}자)`);
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
  const report = [`# 위젯 스크린샷 픽셀 분석 보고서`, ``, `## 캡처 탭 요약`, ``];

  results.forEach(r => {
    if (r.status === 'success') {
      const a = r.analysis;
      report.push(`### ${r.tab}`);
      report.push(`- 위젯 발견: ${a.widgetFound ? '✓' : '✗'}`);
      if (a.widgetFound) {
        report.push(`- 위젯 크기: ${a.widgetSize.width} x ${a.widgetSize.height}px`);
        report.push(`- 배경색: ${a.bgColor}`);
        report.push(`- 폰트 크기: ${a.fontSize}`);
      }
      report.push(`- 콘텐츠 길이: ${a.contentLength}자`);
      report.push(`- 하위 요소: ${a.childrenCount || 0}개`);
      report.push(`- 활성 탭: ${a.activeTab}`);
      report.push(``);
    } else {
      report.push(`### ${r.tab} ❌`);
      report.push(`- 실패: ${r.reason}`);
      report.push(``);
    }
  });

  fs.writeFileSync(
    path.join(screenshotsDir, 'ANALYSIS_REPORT.md'),
    report.join('\n')
  );

  console.log('분석 보고서: screenshots/pixel-analysis/ANALYSIS_REPORT.md');
})();
