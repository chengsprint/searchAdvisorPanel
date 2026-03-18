/**
 * Debug test for widget loading
 */

const { test, expect } = require('@playwright/test');

test('debug - check widget elements', async ({ page }) => {
  await page.goto('/demo.html');

  // Wait for widget panel
  await page.waitForSelector('#sadv-p', { timeout: 10000 });
  await page.waitForTimeout(5000);

  // Force demo mode and set sites
  await page.evaluate(() => {
    // Force demo mode
    window.__FORCE_DEMO_MODE__ = true;

    // Set allSites directly
    window.allSites = [
      "https://example-shop.com",
      "https://tech-blog.kr",
      "https://online-store.net"
    ];

    // Set current site
    window.curSite = window.allSites[0];

    // Manually create tab buttons
    const tabsEl = document.getElementById('sadv-tabs');
    if (tabsEl && tabsEl.children.length === 0) {
      const tabConfigs = [
        { id: "overview", label: "개요" },
        { id: "daily", label: "일별" },
        { id: "urls", label: "URL" },
        { id: "queries", label: "검색어" },
        { id: "indexed", label: "색인" },
        { id: "crawl", label: "크롤" },
        { id: "backlink", label: "백링크" },
        { id: "pattern", label: "패턴" },
        { id: "insight", label: "인사이트" },
      ];

      tabsEl.replaceChildren(...tabConfigs.map((t, i) => {
        const btn = document.createElement("button");
        btn.className = `sadv-t${i === 0 ? " on" : ""}`;
        btn.dataset.t = t.id;
        btn.setAttribute("role", "tab");
        btn.setAttribute("aria-selected", i === 0);
        btn.setAttribute("aria-controls", "sadv-tabpanel");
        btn.style.cssText = "display:inline-flex;align-items:center;gap:5px";
        btn.textContent = t.label;
        return btn;
      }));

      tabsEl.style.display = 'flex';
      tabsEl.classList.add('show');

      console.log('[DEBUG] Manually created', tabConfigs.length, 'tab buttons');
    }
  });

  await page.waitForTimeout(2000);

  // Check for elements
  const result = await page.evaluate(() => {
    const sadvP = document.getElementById('sadv-p');
    const sadvTabs = document.getElementById('sadv-tabs');
    return {
      hasSadvP: !!sadvP,
      hasTabs: document.querySelectorAll('[role="tab"]').length,
      hasSadvTabs: !!sadvTabs,
      sadvTabsDisplay: sadvTabs ? window.getComputedStyle(sadvTabs).display : 'N/A',
      sadvTabsHasShowClass: sadvTabs ? sadvTabs.classList.contains('show') : false,
      sadvTabsChildren: sadvTabs ? sadvTabs.children.length : 0,
      allSites: window.allSites ? window.allSites.length : 0,
    };
  });

  console.log('Debug result:', JSON.stringify(result, null, 2));

  // Take screenshot
  await page.screenshot({ path: 'test-results/debug-screenshot.png', fullPage: true });
});
