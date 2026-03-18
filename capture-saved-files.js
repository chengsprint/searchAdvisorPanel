#!/usr/bin/env node

/**
 * 저장된 HTML 파일 스크린샷 캡처
 */

const { chromium } = require('playwright');
const path = require('path');

const SCREENSHOT_DIR = path.join(__dirname, 'screenshots');

async function captureSavedFile(htmlFile, prefix) {
  console.log(`\n${'='.repeat(60)}`);
  console.log(`캡처: ${htmlFile}`);
  console.log(`${'='.repeat(60)}`);

  const browser = await chromium.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const context = await browser.newContext({
    viewport: { width: 1920, height: 1200 }
  });

  const page = await context.newPage();
  await page.goto(`file:///home/seung/.cokacdir/workspace/yif7zotu/dist/${htmlFile}`);

  // 위젯이 로드될 때까지 대기
  await page.waitForTimeout(8000);

  // 전체 페이지 캡처
  const fullPagePath = path.join(SCREENSHOT_DIR, `${prefix}-full.png`);
  await page.screenshot({ path: fullPagePath, fullPage: true });
  console.log(`  ✓ 전체 페이지: ${prefix}-full.png`);

  // 우측 패널(sadv-p)만 캡처
  const panelExists = await page.evaluate(() => {
    const panel = document.getElementById('sadv-p');
    return !!panel;
  });

  if (panelExists) {
    const panelPath = path.join(SCREENSHOT_DIR, `${prefix}-panel.png`);
    await page.evaluate(() => {
      const panel = document.getElementById('sadv-p');
      if (panel) {
        panel.style.border = '2px solid #10b981';
        panel.style.boxShadow = '0 0 20px rgba(16, 185, 129, 0.5)';
      }
    });
    await page.waitForTimeout(500);
    
    const panel = await page.$('#sadv-p');
    if (panel) {
      await panel.screenshot({ path: panelPath });
      console.log(`  ✓ 우측 패널: ${prefix}-panel.png`);
    }
  } else {
    console.log(`  ⚠ 우측 패널을 찾을 수 없음`);
  }

  await browser.close();
}

async function main() {
  console.log('🎬 저장된 HTML 파일 스크린샷 캡처 시작...');

  await captureSavedFile('saved-single-account.html', 'saved-single');
  await captureSavedFile('saved-merged-account.html', 'saved-merged');

  console.log('\n' + '='.repeat(60));
  console.log('✅ 캡처 완료!');
}

main().catch(console.error);
