#!/usr/bin/env node

/**
 * DOM 확인 스크립트 - 실제 렌더링된 HTML 확인
 */

const { chromium } = require('playwright');

async function checkDOM(htmlFile) {
  console.log(`\n${'='.repeat(60)}`);
  console.log(`DOM 확인: ${htmlFile}`);
  console.log(`${'='.repeat(60)}`);

  const browser = await chromium.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const context = await browser.newContext({
    viewport: { width: 1920, height: 1080 }
  });

  const page = await context.newPage();
  await page.goto(`file:///home/seung/.cokacdir/workspace/yif7zotu/dist/${htmlFile}`);

  // 대기
  await page.waitForTimeout(5000);

  // sadv-bd 내부 HTML 확인
  const bdHTML = await page.evaluate(() => {
    const bdEl = document.getElementById('sadv-bd');
    if (!bdEl) return 'sadv-bd not found';

    return {
      innerHTML: bdEl.innerHTML.slice(0, 2000),
      childCount: bdEl.children.length,
      firstChildHTML: bdEl.firstElementChild?.outerHTML?.slice(0, 500) || 'no first child'
    };
  });

  console.log('\n[sadv-bd 내부]');
  console.log(`자식 요소 수: ${bdHTML.childCount}`);
  console.log(`첫 번째 자식:\n${bdHTML.firstChildHTML}`);

  // SVG 확인
  const svgInfo = await page.evaluate(() => {
    const svgs = Array.from(document.querySelectorAll('svg'));
    return {
      count: svgs.length,
      firstSVG: svgs[0]?.outerHTML?.slice(0, 500) || 'no svg'
    };
  });

  console.log('\n[SVG 정보]');
  console.log(`SVG 수: ${svgInfo.count}`);
  if (svgInfo.count > 0) {
    console.log(`첫 번째 SVG:\n${svgInfo.firstSVG}`);
  }

  // 그래프 카드 확인
  const graphCards = await page.evaluate(() => {
    const cards = Array.from(document.querySelectorAll('.sadv-chart-card, .sadv-kpi-grid'));
    return {
      count: cards.length,
      firstCard: cards[0]?.outerHTML?.slice(0, 500) || 'no card'
    };
  });

  console.log('\n[그래프 카드]');
  console.log(`카드 수: ${graphCards.count}`);
  if (graphCards.count > 0) {
    console.log(`첫 번째 카드:\n${graphCards.firstCard}`);
  }

  await browser.close();
}

async function main() {
  await checkDOM('test-single.html');
}

main().catch(console.error);
