/**
 * HTTP 서버 사용하여 모든 탭 스크린샷 캡처
 */

const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

const screenshotsDir = path.join(__dirname, 'screenshots', 'pixel-analysis');
if (!fs.existsSync(screenshotsDir)) {
  fs.mkdirSync(screenshotsDir, { recursive: true });
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

const SERVER_URL = 'http://localhost:8765';
const TEST_PAGE = `${SERVER_URL}/test-single-fixed.html`;

(async () => {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ viewport: { width: 400, height: 800 } });
  const page = await context.newPage();

  // 콘솔 로그 수집
  const logs = [];
  page.on('console', msg => {
    logs.push({ type: msg.type(), text: msg.text() });
  });

  const results = [];

  for (const tab of tabs) {
    console.log(`캡처 중: ${tab.name}...`);

    try {
      await page.goto(TEST_PAGE, { waitUntil: 'networkidle', timeout: 30000 });
    } catch (e) {
      console.log(`  ⚠️ 페이지 로드 타임아웃, 계속 시도...`);
    }

    // 위젯 로드 대기
    try {
      await page.waitForSelector('#sadv-p, #sadv-tabs, [role="tab"], .sadv-t', { timeout: 20000 });
    } catch (e) {
      console.log(`  ⚠️ 위젯 로드 타임아웃`);

      // 디버깅 정보
      const bodyInfo = await page.evaluate(() => {
        return {
          bodyContent: document.body.innerHTML.substring(0, 300),
          scriptTags: Array.from(document.querySelectorAll('script')).map(s => s.src || 'inline'),
          consoleErrors: (window.__errors || []).slice(0, 3)
        };
      });
      console.log(`  - 페이지 내용: ${bodyInfo.bodyContent.substring(0, 100)}...`);

      results.push({ tab: tab.name, status: 'failed', reason: 'Widget load timeout' });
      continue;
    }

    await page.waitForTimeout(2000);

    // 탭 존재 확인
    const tabCount = await page.locator('[role="tab"], .sadv-t').count();
    console.log(`  - 발견된 탭 수: ${tabCount}`);

    if (tabCount === 0) {
      results.push({ tab: tab.name, status: 'failed', reason: 'No tabs found' });
      continue;
    }

    // 탭 클릭
    const clicked = await page.evaluate((tabId) => {
      const selectors = [
        `[data-t="${tabId}"]`,
        `[role="tab"][data-t="${tabId}"]`,
        `.sadv-t[data-t="${tabId}"]`,
        `button[data-t="${tabId}"]`
      ];

      for (const selector of selectors) {
        const el = document.querySelector(selector);
        if (el) {
          el.click();
          return { clicked: true, selector, tabName: el.textContent.trim() };
        }
      }
      return { clicked: false };
    }, tab.id);

    if (!clicked.clicked) {
      console.log(`  ❌ 탭 클릭 실패: ${tab.id}`);
      results.push({ tab: tab.name, status: 'failed', reason: 'Tab click failed' });
      continue;
    }

    console.log(`  - 클릭된 탭: ${clicked.tabName}`);
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
      const tabsEl = document.querySelector('#sadv-tabs');
      const tabpanel = document.querySelector('#sadv-tabpanel');
      const activeTab = document.querySelector('[role="tab"][aria-selected="true"]') ||
                        document.querySelector('.sadv-t.on');
      const allTabs = document.querySelectorAll('[role="tab"], .sadv-t');

      let result = {
        widgetFound: !!widget,
        tabsElFound: !!tabsEl,
        tabpanelFound: !!tabpanel,
        tabCount: allTabs.length,
        activeTab: activeTab ? activeTab.textContent.trim() : null,
      };

      if (widget) {
        const rect = widget.getBoundingClientRect();
        const styles = window.getComputedStyle(widget);
        result.widgetSize = { width: Math.round(rect.width), height: Math.round(rect.height) };
        result.bgColor = styles.backgroundColor;
        result.fontSize = styles.fontSize;
        result.padding = styles.padding;
      }

      if (tabpanel) {
        result.contentLength = tabpanel.textContent.trim().length;
        result.childrenCount = tabpanel.children.length;

        // 세부 요소 분석
        const cards = tabpanel.querySelectorAll('.card, .sadv-card, [class*="card"]');
        const tables = tabpanel.querySelectorAll('table');
        const lists = tabpanel.querySelectorAll('ul, ol');
        const charts = tabpanel.querySelectorAll('svg, canvas');

        result.cardsCount = cards.length;
        result.tablesCount = tables.length;
        result.listsCount = lists.length;
        result.chartsCount = charts.length;

        // 첫 번째 카드 분석
        if (cards.length > 0) {
          const firstCard = cards[0];
          const cardRect = firstCard.getBoundingClientRect();
          const cardStyles = window.getComputedStyle(firstCard);
          result.firstCardInfo = {
            size: { width: Math.round(cardRect.width), height: Math.round(cardRect.height) },
            bgColor: cardStyles.backgroundColor,
            hasBorder: cardStyles.border !== 'none',
            borderRadius: cardStyles.borderRadius
          };
        }
      }

      return result;
    }, tab.id);

    results.push({
      tab: tab.name,
      status: 'success',
      screenshot: screenshotPath,
      analysis: analysis
    });

    console.log(`  ✓ 캡처 완료: ${tab.name} (${analysis.contentLength || 0}자, ${analysis.childrenCount || 0}개 요소)`);
  }

  await browser.close();

  // 결과 저장
  fs.writeFileSync(
    path.join(screenshotsDir, 'capture-results.json'),
    JSON.stringify(results, null, 2)
  );

  console.log('\n=== 캡처 완료 ===');
  console.log(`저장 위치: ${screenshotsDir}`);

  // 상세 보고서 생성
  const report = [`# 위젯 스크린샷 픽셀 단위 분석 보고서`, ``, `생성 시간: ${new Date().toLocaleString('ko-KR')}`, ``, `## 캡처 요약`, ``];

  let successCount = 0;
  results.forEach(r => {
    if (r.status === 'success') {
      successCount++;
      const a = r.analysis;
      report.push(`### ${r.tab} (${r.tab === r.analysis.activeTab ? '✓' : '⚠️'})`);
      report.push(``);
      report.push(`**위젯 상태**`);
      report.push(`- 위젯 발견: ${a.widgetFound ? '✓' : '✗'}`);
      report.push(`- 탭 영역 발견: ${a.tabsElFound ? '✓' : '✗'}`);
      report.push(`- 콘텐츠 영역 발견: ${a.tabpanelFound ? '✓' : '✗'}`);
      report.push(`- 전체 탭 수: ${a.tabCount}개`);
      report.push(`- 활성 탭: "${a.activeTab}"`);
      report.push(``);

      if (a.widgetFound) {
        report.push(`**위젯 스타일**`);
        report.push(`- 크기: \`${a.widgetSize.width} x ${a.widgetSize.height}px\``);
        report.push(`- 배경색: \`${a.bgColor}\``);
        report.push(`- 폰트 크기: \`${a.fontSize}\``);
        report.push(`- 패딩: \`${a.padding}\``);
        report.push(``);
      }

      report.push(`**콘텐츠 분석**`);
      report.push(`- 텍스트 길이: ${a.contentLength}자`);
      report.push(`- 하위 요소: ${a.childrenCount}개`);
      report.push(`- 카드: ${a.cardsCount}개`);
      report.push(`- 테이블: ${a.tablesCount}개`);
      report.push(`- 리스트: ${a.listsCount}개`);
      report.push(`- 차트: ${a.chartsCount}개`);

      if (a.firstCardInfo) {
        report.push(``);
        report.push(`**첫 번째 카드**`);
        report.push(`- 크기: \`${a.firstCardInfo.size.width} x ${a.firstCardInfo.size.height}px\``);
        report.push(`- 배경색: \`${a.firstCardInfo.bgColor}\``);
        report.push(`- 보더: ${a.firstCardInfo.hasBorder ? '있음' : '없음'}`);
        report.push(`- 둥근 모서리: \`${a.firstCardInfo.borderRadius}\``);
      }

      report.push(``);
      report.push(`---`);
      report.push(``);
    } else {
      report.push(`### ${r.tab} ❌`);
      report.push(`- 실패 사유: ${r.reason}`);
      report.push(``);
      report.push(`---`);
      report.push(``);
    }
  });

  report.push(`## 종합 평가`);
  report.push(``);
  report.push(`- 성공: ${successCount}/${tabs.length} 탭`);
  report.push(`- 성공률: ${Math.round(successCount/tabs.length*100)}%`);

  if (successCount === tabs.length) {
    report.push(``);
    report.push(`✅ **모든 탭이 정상적으로 렌더링되었습니다.**`);
  } else {
    report.push(``);
    report.push(`⚠️ **일부 탭에 문제가 있습니다.**`);
  }

  fs.writeFileSync(
    path.join(screenshotsDir, 'DETAILED_ANALYSIS_REPORT.md'),
    report.join('\n')
  );

  console.log('상세 분석 보고서: screenshots/pixel-analysis/DETAILED_ANALYSIS_REPORT.md');
})();
