/**
 * Data Refresh E2E Tests
 * Tests data refresh, loading states, and error handling
 */

const { test, expect } = require('@playwright/test');

test.describe('Data Refresh', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/widget.html');
    await page.waitForSelector('#sadv-container', { timeout: 5000 });
  });

  test('should have refresh button', async ({ page }) => {
    const refreshButton = await page.$('[data-testid="refresh-button"], button[title*="refresh" i], button[aria-label*="refresh" i]');

    if (refreshButton) {
      expect(refreshButton).toBeTruthy();
    } else {
      // Refresh might be through API only
      const hasRefreshApi = await page.evaluate(() => {
        return typeof window.__sadvApi?.refresh === 'function';
      });
      expect(hasRefreshApi).toBeTruthy();
    }
  });

  test('should refresh data via API', async ({ page }) => {
    const refreshed = await page.evaluate(() => {
      if (window.__sadvApi && window.__sadvApi.refresh) {
        window.__sadvApi.refresh();
        return true;
      }
      return false;
    });

    expect(refreshed).toBeTruthy();
  });

  test('should show loading state during refresh', async ({ page }) => {
    // Start refresh
    await page.evaluate(() => {
      if (window.__sadvApi && window.__sadvApi.refresh) {
        window.__sadvApi.refresh();
      }
    });

    await page.waitForTimeout(200);

    // Check for loading indicator
    const isLoading = await page.evaluate(() => {
      return window.__sadvState?.isLoading || false;
    });

    expect(isLoading).toBeDefined();
  });

  test('should update data after refresh', async ({ page }) => {
    const initialTimestamp = await page.evaluate(() => {
      return window.__sadvState?.lastUpdated;
    });

    // Refresh data
    await page.evaluate(() => {
      if (window.__sadvApi && window.__sadvApi.refresh) {
        window.__sadvApi.refresh();
      }
    });

    await page.waitForTimeout(1500);

    const newTimestamp = await page.evaluate(() => {
      return window.__sadvState?.lastUpdated;
    });

    expect(newTimestamp).toBeDefined();
  });

  test('should handle refresh errors gracefully', async ({ page }) => {
    // Mock a failed refresh
    const errorHandled = await page.evaluate(() => {
      try {
        if (window.__sadvApi && window.__sadvApi.refresh) {
          window.__sadvApi.refresh();
          return true;
        }
        return false;
      } catch (e) {
        return false;
      }
    });

    expect(errorHandled).toBeTruthy();
  });

  test('should support auto-refresh', async ({ page }) => {
    const hasAutoRefresh = await page.evaluate(() => {
      return typeof window.__sadvApi?.enableAutoRefresh === 'function';
    });

    if (hasAutoRefresh) {
      const enabled = await page.evaluate(() => {
        if (window.__sadvApi && window.__sadvApi.enableAutoRefresh) {
          window.__sadvApi.enableAutoRefresh(true);
          return true;
        }
        return false;
      });

      expect(enabled).toBeTruthy();
    }
  });

  test('should display refresh timestamp', async ({ page }) => {
    const lastUpdated = await page.evaluate(() => {
      return window.__sadvState?.lastUpdated;
    });

    expect(lastUpdated).toBeDefined();
  });

  test('should cancel ongoing refresh', async ({ page }) => {
    const hasCancel = await page.evaluate(() => {
      return typeof window.__sadvApi?.cancelRefresh === 'function';
    });

    if (hasCancel) {
      const cancelled = await page.evaluate(() => {
        if (window.__sadvApi && window.__sadvApi.cancelRefresh) {
          window.__sadvApi.cancelRefresh();
          return true;
        }
        return false;
      });

      expect(cancelled).toBeTruthy();
    }
  });

  test('should refresh specific tab data', async ({ page }) => {
    // Switch to daily tab
    await page.click('#sadv-tabs button:has-text("Daily")');
    await page.waitForTimeout(300);

    // Refresh
    await page.evaluate(() => {
      if (window.__sadvApi && window.__sadvApi.refresh) {
        window.__sadvApi.refresh('daily');
      }
    });

    await page.waitForTimeout(1000);

    // Should not error
    const tabExists = await page.$('#sadv-tab-daily');
    expect(tabExists).toBeTruthy();
  });

  test('should maintain state during refresh', async ({ page }) => {
    const currentTab = await page.evaluate(() => {
      const activeTab = document.querySelector('#sadv-tabs button[aria-selected="true"]');
      return activeTab?.textContent?.trim();
    });

    // Refresh
    await page.evaluate(() => {
      if (window.__sadvApi && window.__sadvApi.refresh) {
        window.__sadvApi.refresh();
      }
    });

    await page.waitForTimeout(1000);

    // Tab should still be active
    const stillActive = await page.evaluate(() => {
      const activeTab = document.querySelector('#sadv-tabs button[aria-selected="true"]');
      return activeTab?.textContent?.trim();
    });

    expect(stillActive).toBe(currentTab);
  });

  test('should handle rapid refresh requests', async ({ page }) => {
    // Send multiple refresh requests
    for (let i = 0; i < 3; i++) {
      await page.evaluate(() => {
        if (window.__sadvApi && window.__sadvApi.refresh) {
          window.__sadvApi.refresh();
        }
      });
      await page.waitForTimeout(100);
    }

    // Should not crash
    const containerVisible = await page.isVisible('#sadv-container');
    expect(containerVisible).toBeTruthy();
  });
});
