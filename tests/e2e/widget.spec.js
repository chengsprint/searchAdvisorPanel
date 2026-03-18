/**
 * Widget E2E Tests
 * Tests the complete widget functionality in a browser
 */

const { test, expect } = require('@playwright/test');

test.describe('Widget Loading', () => {
  test('should load widget in browser console', async ({ page }) => {
    // Navigate to widget test page
    await page.goto('/widget.html');

    // Wait for page to load
    await page.waitForLoadState('networkidle');

    // Check if SearchAdvisor is available
    const hasSearchAdvisor = await page.evaluate(() => {
      return typeof window.SearchAdvisor !== 'undefined';
    });

    expect(hasSearchAdvisor).toBeTruthy();
  });

  test('should display widget UI elements', async ({ page }) => {
    await page.goto('/widget.html');

    // Wait for widget to render
    await page.waitForSelector('#sadv-tabs', { timeout: 5000 });

    // Check for main tabs container
    const tabsVisible = await page.isVisible('#sadv-tabs');
    expect(tabsVisible).toBeTruthy();
  });
});

test.describe('Tab Navigation', () => {
  test('should display all tabs', async ({ page }) => {
    await page.goto('/widget.html');
    await page.waitForSelector('#sadv-tabs');

    const tabs = await page.$$('#sadv-tabs button');
    expect(tabs.length).toBeGreaterThanOrEqual(6);
  });

  test('should switch between tabs', async ({ page }) => {
    await page.goto('/widget.html');
    await page.waitForSelector('#sadv-tabs');

    // Click on daily tab
    await page.click('button:has-text("Daily")');

    // Wait for content to update
    await page.waitForTimeout(500);

    // Verify tab is active
    const isActive = await page.evaluate(() => {
      const button = document.querySelector('button:has-text("Daily")');
      return button && button.classList.contains('active');
    });

    expect(isActive).toBeTruthy();
  });
});

test.describe('Demo Mode', () => {
  test('should activate demo mode', async ({ page }) => {
    await page.goto('/widget.html?demo=true');
    await page.waitForSelector('#sadv-tabs');

    const isDemoMode = await page.evaluate(() => {
      return window.__SADV_DEMO_MODE__ === true;
    });

    expect(isDemoMode).toBeTruthy();
  });

  test('should display demo data', async ({ page }) => {
    await page.goto('/widget.html?demo=true');
    await page.waitForSelector('#sadv-tabs');

    // Wait for data to load
    await page.waitForTimeout(1000);

    const hasContent = await page.evaluate(() => {
      const content = document.querySelector('#sadv-tab-overview');
      return content && content.children.length > 0;
    });

    expect(hasContent).toBeTruthy();
  });
});

test.describe('Site Switching', () => {
  test('should switch between demo sites', async ({ page }) => {
    await page.goto('/widget.html?demo=true');
    await page.waitForSelector('#sadv-tabs');

    // Get initial site
    const initialSite = await page.evaluate(() => {
      return window.__sadvState?.currentSiteId;
    });

    // Trigger site switch
    await page.evaluate(() => {
      if (window.__sadvApi && window.__sadvApi.switchSite) {
        window.__sadvApi.switchSite('demo-site-2');
      }
    });

    await page.waitForTimeout(500);

    // Verify site changed
    const currentSite = await page.evaluate(() => {
      return window.__sadvState?.currentSiteId;
    });

    expect(currentSite).not.toBe(initialSite);
  });
});

test.describe('Data Refresh', () => {
  test('should refresh data on demand', async ({ page }) => {
    await page.goto('/widget.html?demo=true');
    await page.waitForSelector('#sadv-tabs');

    const refreshClicked = await page.evaluate(() => {
      const refreshBtn = document.querySelector('[data-testid="refresh-button"]');
      if (refreshBtn) {
        refreshBtn.click();
        return true;
      }
      return false;
    });

    expect(refreshClicked).toBeTruthy();
  });
});

test.describe('Responsive Design', () => {
  test('should work on mobile viewport', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/widget.html?demo=true');
    await page.waitForSelector('#sadv-tabs');

    const isVisible = await page.isVisible('#sadv-tabs');
    expect(isVisible).toBeTruthy();
  });

  test('should work on tablet viewport', async ({ page }) => {
    await page.setViewportSize({ width: 768, height: 1024 });
    await page.goto('/widget.html?demo=true');
    await page.waitForSelector('#sadv-tabs');

    const isVisible = await page.isVisible('#sadv-tabs');
    expect(isVisible).toBeTruthy();
  });
});

test.describe('Keyboard Navigation', () => {
  test('should be keyboard accessible', async ({ page }) => {
    await page.goto('/widget.html?demo=true');
    await page.waitForSelector('#sadv-tabs');

    // Tab to first button
    await page.keyboard.press('Tab');

    // Check if button is focused
    const focused = await page.evaluate(() => {
      return document.activeElement.tagName === 'BUTTON';
    });

    expect(focused).toBeTruthy();
  });
});
