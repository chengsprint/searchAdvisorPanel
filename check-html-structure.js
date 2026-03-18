#!/usr/bin/env node

/**
 * HTML 구조 확인
 */

const { chromium } = require('playwright');

async function checkStructure(htmlFile) {
  console.log(`\n${'='.repeat(60)}`);
  console.log(`HTML 구조 확인: ${htmlFile}`);
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

  const structure = await page.evaluate(() => {
    return {
      bodyChildren: Array.from(document.body.children).map(el => ({
        tag: el.tagName,
        id: el.id,
        class: el.className
      })),
      sadvElements: Array.from(document.querySelectorAll('[id^="sadv-"]')).map(el => ({
        id: el.id,
        tag: el.tagName,
        visible: window.getComputedStyle(el).display !== 'none'
      }))
    };
  });

  console.log('\n[Body 자식 요소들]');
  structure.bodyChildren.forEach(el => {
    console.log(`  ${el.tag} id="${el.id}" class="${el.class}"`);
  });

  console.log('\n[sadv- 요소들]');
  structure.sadvElements.forEach(el => {
    console.log(`  ${el.id} (${el.tag}) - visible: ${el.visible}`);
  });

  await browser.close();
}

async function main() {
  await checkStructure('test-single.html');
}

main().catch(console.error);
