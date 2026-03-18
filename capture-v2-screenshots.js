const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');

const screenshotsDir = path.join(__dirname, 'screenshots');
if (!fs.existsSync(screenshotsDir)) {
  fs.mkdirSync(screenshotsDir, { recursive: true });
}

const TABS = ['overview', 'daily', 'queries', 'urls', 'indexed', 'crawl', 'backlink', 'pattern', 'insight'];
const DELAY_MS = 3000; // Wait for rendering

async function captureScreenshots() {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 1920, height: 1080 }
  });

  console.log('Starting V2 screenshot capture...');

  // 1. Single account screenshots
  console.log('\n1. Capturing single account screenshots...');
  const singlePage = await context.newPage();
  await singlePage.goto(`file://${path.join(__dirname, 'dist', 'test-single.html')}`);
  await singlePage.waitForTimeout(DELAY_MS);

  // Overview tab
  console.log('  - Overview tab');
  await singlePage.screenshot({
    path: path.join(screenshotsDir, 'v2-single-all-overview.png'),
    fullPage: true
  });

  // Other tabs
  for (const tab of TABS.slice(1)) {
    console.log(`  - ${tab} tab`);
    try {
      // Click tab
      await singlePage.click(`[data-tab="${tab}"], button:has-text("${tab.charAt(0).toUpperCase() + tab.slice(1)}")`);
      await singlePage.waitForTimeout(2000);
      await singlePage.screenshot({
        path: path.join(screenshotsDir, `v2-single-all-${tab}.png`),
        fullPage: true
      });
    } catch (e) {
      console.log(`    Error capturing ${tab}: ${e.message}`);
    }
  }

  // Site-specific mode
  console.log('  - Site-specific mode');
  try {
    // Try to click site selector or switch to site mode
    await singlePage.click('[data-mode="site"], .site-selector, button:has-text("Site")');
    await singlePage.waitForTimeout(2000);
    await singlePage.screenshot({
      path: path.join(screenshotsDir, 'v2-single-site-overview.png'),
      fullPage: true
    });
  } catch (e) {
    console.log(`    Note: Site mode may not be available: ${e.message}`);
  }

  await singlePage.close();

  // 2. Merged account screenshots
  console.log('\n2. Capturing merged account screenshots...');
  const mergedPage = await context.newPage();
  await mergedPage.goto(`file://${path.join(__dirname, 'dist', 'test-merged.html')}`);
  await mergedPage.waitForTimeout(DELAY_MS);

  console.log('  - Overview tab');
  await mergedPage.screenshot({
    path: path.join(screenshotsDir, 'v2-merged-overview.png'),
    fullPage: true
  });

  await mergedPage.close();

  // 3. Demo mode screenshots
  console.log('\n3. Capturing demo mode screenshots...');
  const demoPage = await context.newPage();
  await demoPage.goto(`file://${path.join(__dirname, 'dist', 'demo.html')}`);
  await demoPage.waitForTimeout(DELAY_MS);

  console.log('  - Overview tab');
  await demoPage.screenshot({
    path: path.join(screenshotsDir, 'v2-demo-overview.png'),
    fullPage: true
  });

  await demoPage.close();

  await browser.close();
  console.log('\n✅ All screenshots captured successfully!');
  console.log(`📁 Screenshots saved to: ${screenshotsDir}`);

  // List captured files
  const files = fs.readdirSync(screenshotsDir).filter(f => f.startsWith('v2-'));
  console.log('\n📸 Captured files:');
  files.forEach(f => console.log(`  - ${f}`));
}

captureScreenshots().catch(console.error);
