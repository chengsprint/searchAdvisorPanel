#!/usr/bin/env node

/**
 * 실제 브라우저 스크린샷 및 SVG 확인
 */

const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

async function realBrowserCheck(htmlFile) {
  console.log(`\n${'='.repeat(60)}`);
  console.log(`실제 브라우저 확인: ${htmlFile}`);
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
  await page.waitForTimeout(8000);

  // 스크린샷
  const screenshotPath = path.join(__dirname, 'screenshots', `real-${htmlFile.replace('.html', '')}.png`);
  await page.screenshot({ path: screenshotPath, fullPage: true });
  console.log(`\n스크린샷 저장: ${screenshotPath}`);

  // SVG 확인
  const svgInfo = await page.evaluate(() => {
    const svgs = Array.from(document.querySelectorAll('svg'));
    const chartSVGs = svgs.filter(svg => {
      const width = svg.getAttribute('width');
      const height = svg.getAttribute('height');
      // 그래프 SVG는 보통 더 큽니다
      return (parseInt(width) > 50 || parseInt(height) > 50);
    });

    return {
      totalSVGs: svgs.length,
      chartSVGs: chartSVGs.length,
      firstChartSVG: chartSVGs[0]?.outerHTML?.slice(0, 800) || 'no chart svg',
      chartSVGDetails: chartSVGs.slice(0, 3).map(svg => ({
        width: svg.getAttribute('width'),
        height: svg.getAttribute('height'),
        viewBox: svg.getAttribute('viewBox'),
        innerHTML: svg.innerHTML.slice(0, 300)
      }))
    };
  });

  console.log('\n[SVG 정보]');
  console.log(`전체 SVG 수: ${svgInfo.totalSVGs}`);
  console.log(`그래프 SVG 수: ${svgInfo.chartSVGs}`);
  if (svgInfo.chartSVGDetails.length > 0) {
    console.log('\n[그래프 SVG 상세]');
    svgInfo.chartSVGDetails.forEach((svg, i) => {
      console.log(`\nSVG #${i + 1}:`);
      console.log(`  width: ${svg.width}, height: ${svg.height}`);
      console.log(`  viewBox: ${svg.viewBox}`);
      console.log(`  innerHTML: ${svg.innerHTML}`);
    });
  }

  // 스파크라인 확인
  const sparklineInfo = await page.evaluate(() => {
    const sparklines = Array.from(document.querySelectorAll('[class*="sparkline"]'));
    return {
      count: sparklines.length,
      firstHTML: sparklines[0]?.outerHTML?.slice(0, 500) || 'no sparkline'
    };
  });

  console.log('\n[스파크라인 정보]');
  console.log(`개수: ${sparklineInfo.count}`);
  if (sparklineInfo.count > 0) {
    console.log(`첫 번째:\n${sparklineInfo.firstHTML}`);
  }

  await browser.close();
  console.log('\n확인 완료!');
}

async function main() {
  await realBrowserCheck('test-single.html');
}

main().catch(console.error);
