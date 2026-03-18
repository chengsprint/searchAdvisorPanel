#!/usr/bin/env node

const { chromium } = require('playwright');

async function inspectTabs(htmlFile) {
  console.log(`\n${'='.repeat(60)}`);
  console.log(`탭 버튼 확인: ${htmlFile}`);
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
  await page.waitForTimeout(5000);

  const tabInfo = await page.evaluate(() => {
    const tabsEl = document.getElementById('sadv-tabs');
    if (!tabsEl) return { error: 'sadv-tabs not found' };

    const buttons = Array.from(tabsEl.querySelectorAll('button, [role="tab"], [data-tab]'));

    return {
      tabsElExists: true,
      buttonCount: buttons.length,
      buttons: buttons.map(btn => ({
        tagName: btn.tagName,
        id: btn.id,
        className: btn.className,
        textContent: btn.textContent?.trim(),
        dataTab: btn.getAttribute('data-tab'),
        role: btn.getAttribute('role'),
        ariaSelected: btn.getAttribute('aria-selected')
      }))
    };
  });

  console.log('\n[탭 버튼 정보]');
  console.log(`버튼 수: ${tabInfo.buttonCount}`);
  tabInfo.buttons.forEach((btn, i) => {
    console.log(`\n버튼 #${i + 1}:`);
    console.log(`  태그: ${btn.tagName}`);
    console.log(`  텍스트: ${btn.textContent}`);
    console.log(`  data-tab: ${btn.dataTab}`);
    console.log(`  class: ${btn.className}`);
  });

  await browser.close();
}

async function main() {
  await inspectTabs('test-single.html');
}

main().catch(console.error);
