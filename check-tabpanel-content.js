#!/usr/bin/env node

/**
 * sadv-tabpanel 내부 내용 확인
 */

const { chromium } = require('playwright');

async function checkTabPanel(htmlFile) {
  console.log(`\n${'='.repeat(60)}`);
  console.log(`TabPanel 확인: ${htmlFile}`);
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

  // 콘솔 로그 수집
  const logs = [];
  page.on('console', msg => {
    const text = msg.text();
    if (text.includes('[renderTab]') || text.includes('[loadSiteView]')) {
      logs.push(text);
    }
  });

  await page.waitForTimeout(5000);

  const tabPanelInfo = await page.evaluate(() => {
    const tp = document.getElementById('sadv-tabpanel');
    if (!tp) return { error: 'sadv-tabpanel not found' };

    return {
      exists: true,
      innerHTML: tp.innerHTML,
      childCount: tp.children.length,
      textContent: tp.textContent?.slice(0, 200)
    };
  });

  console.log('\n[sadv-tabpanel 정보]');
  console.log(`존재: ${tabPanelInfo.exists}`);
  console.log(`자식 수: ${tabPanelInfo.childCount}`);
  console.log(`내부 HTML 길이: ${tabPanelInfo.innerHTML?.length || 0}`);
  if (tabPanelInfo.innerHTML && tabPanelInfo.innerHTML.length > 0) {
    console.log(`내부 HTML (앞 500자):\n${tabPanelInfo.innerHTML.slice(0, 500)}`);
  } else {
    console.log('내부가 비어있습니다!');
  }

  console.log('\n[관련 콘솔 로그]');
  logs.forEach(log => console.log(`  ${log}`));

  await browser.close();
}

async function main() {
  await checkTabPanel('test-single.html');
}

main().catch(console.error);
