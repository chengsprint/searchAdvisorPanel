const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');

const screenshotsDir = path.join(__dirname, 'screenshots');
if (!fs.existsSync(screenshotsDir)) {
  fs.mkdirSync(screenshotsDir, { recursive: true });
}

const TABS = ['overview', 'daily', 'queries', 'urls', 'indexed', 'crawl', 'backlink', 'pattern', 'insight'];
const DELAY_MS = 5000; // Longer wait for rendering

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

  // Wait for page to fully load
  console.log('  Waiting for page load...');
  await singlePage.waitForLoadState('networkidle');
  await singlePage.waitForTimeout(DELAY_MS);

  // Debug: Check page structure
  console.log('  Debugging page structure...');
  const pageContent = await singlePage.content();
  const hasTabs = pageContent.includes('data-tab') || pageContent.includes('tab-') || pageContent.includes('tabs');
  console.log(`    Has tabs: ${hasTabs}`);

  // Try to find any clickable elements
  const buttons = await singlePage.$$eval('button', els => els.map(e => ({
    text: e.textContent?.trim(),
    className: e.className,
    dataset: Object.assign({}, e.dataset)
  })));
  console.log(`    Found ${buttons.length} buttons`);
  if (buttons.length > 0) {
    console.log('    First few buttons:', buttons.slice(0, 5));
  }

  // Capture overview first
  console.log('  - Overview tab');
  await singlePage.screenshot({
    path: path.join(screenshotsDir, 'v2-single-all-overview.png'),
    fullPage: true
  });

  // Try different approaches to click tabs
  for (const tab of TABS.slice(1)) {
    console.log(`  - ${tab} tab`);
    try {
      // Approach 1: Try data-tab attribute
      await singlePage.click(`[data-tab="${tab}"]`, { timeout: 5000 });
    } catch (e1) {
      try {
        // Approach 2: Try with capitalized text
        const tabText = tab.charAt(0).toUpperCase() + tab.slice(1);
        await singlePage.click(`button:has-text("${tabText}")`, { timeout: 5000 });
      } catch (e2) {
        try {
          // Approach 3: Try lowercase text
          await singlePage.click(`button:has-text("${tab}")`, { timeout: 5000 });
        } catch (e3) {
          try {
            // Approach 4: Try Korean text
            const koreanTabs = {
              'daily': '일간',
              'queries': '쿼리',
              'urls': 'URL',
              'indexed': '색인',
              'crawl': '크롤',
              'backlink': '백링크',
              'pattern': '패턴',
              'insight': '인사이트'
            };
            await singlePage.click(`button:has-text("${koreanTabs[tab] || tab}")`, { timeout: 5000 });
          } catch (e4) {
            console.log(`    Could not find ${tab} tab, skipping...`);
            continue;
          }
        }
      }
    }

    await singlePage.waitForTimeout(3000);
    await singlePage.screenshot({
      path: path.join(screenshotsDir, `v2-single-all-${tab}.png`),
      fullPage: true
    });
  }

  await singlePage.close();

  // 2. Merged account screenshots
  console.log('\n2. Capturing merged account screenshots...');
  const mergedPage = await context.newPage();
  await mergedPage.goto(`file://${path.join(__dirname, 'dist', 'test-merged.html')}`);
  await mergedPage.waitForLoadState('networkidle');
  await mergedPage.waitForTimeout(DELAY_MS);

  console.log('  - Overview tab');
  await mergedPage.screenshot({
    path: path.join(screenshotsDir, 'v2-merged-overview.png'),
    fullPage: true
  });

  await mergedPage.close();

  // 3. Demo mode screenshots
  console.log('\n3. Capturing demo mode screenshots...');
  try {
    const demoPage = await context.newPage();
    await demoPage.goto(`file://${path.join(__dirname, 'dist', 'demo.html')}`);
    await demoPage.waitForLoadState('networkidle');
    await demoPage.waitForTimeout(DELAY_MS);

    console.log('  - Overview tab');
    await demoPage.screenshot({
      path: path.join(screenshotsDir, 'v2-demo-overview.png'),
      fullPage: true
    });

    await demoPage.close();
  } catch (e) {
    console.log(`  Note: Demo page may not exist: ${e.message}`);
  }

  await browser.close();
  console.log('\n✅ All screenshots captured successfully!');
  console.log(`📁 Screenshots saved to: ${screenshotsDir}`);

  // List captured files
  const files = fs.readdirSync(screenshotsDir).filter(f => f.startsWith('v2-'));
  console.log('\n📸 Captured files:');
  files.forEach(f => console.log(`  - ${f}`));
}

captureScreenshots().catch(console.error);
