const { chromium } = require('playwright');
const path = require('path');

async function debugRuntime() {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();

  await page.goto(`file://${path.join(__dirname, 'dist', 'test-single.html')}`);
  await page.waitForTimeout(12000);

  // Take full page screenshot
  await page.screenshot({
    path: path.join(__dirname, 'screenshots', 'v2-graph-check.png'),
    fullPage: true
  });
  
  // Check if tabpanel is visible
  const visible = await page.evaluate(() => {
    const tabpanel = document.getElementById('sadv-tabpanel');
    if (!tabpanel) return 'no tabpanel';
    
    return {
      offsetParent: !!tabpanel.offsetParent,
      display: window.getComputedStyle(tabpanel).display,
      visibility: window.getComputedStyle(tabpanel).visibility,
      opacity: window.getComputedStyle(tabpanel).opacity,
      innerHTML: tabpanel.innerHTML.substring(0, 500),
      parentDisplay: tabpanel.parentElement ? window.getComputedStyle(tabpanel.parentElement).display : 'no parent'
    };
  });
  
  console.log('[Tabpanel Visibility]', JSON.stringify(visible, null, 2));

  await browser.close();
}

debugRuntime().catch(console.error);
