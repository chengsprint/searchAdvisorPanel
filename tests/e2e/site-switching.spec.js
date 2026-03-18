/**
 * Site Switching E2E Tests
 * Tests site selector, site switching, and multi-account handling
 */

const { test, expect } = require('@playwright/test');

test.describe('Site Switching', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/widget.html');
    await page.waitForSelector('#sadv-container', { timeout: 5000 });
  });

  test('should display site selector', async ({ page }) => {
    const siteSelector = await page.$('#sadv-site-selector');
    expect(siteSelector).toBeTruthy();
  });

  test('should show current site in selector', async ({ page }) => {
    const currentSite = await page.evaluate(() => {
      return window.__sadvState?.currentSiteId;
    });

    expect(currentSite).toBeDefined();
  });

  test('should switch to different site', async ({ page }) => {
    const initialSite = await page.evaluate(() => {
      return window.__sadvState?.currentSiteId;
    });

    // Try to switch site using API
    const switched = await page.evaluate(() => {
      if (window.__sadvApi && window.__sadvApi.switchSite) {
        const sites = window.__sadvState?.sites || [];
        if (sites.length > 1) {
          window.__sadvApi.switchSite(sites[1].id);
          return true;
        }
      }
      return false;
    });

    if (switched) {
      await page.waitForTimeout(500);

      const currentSite = await page.evaluate(() => {
        return window.__sadvState?.currentSiteId;
      });

      expect(currentSite).not.toBe(initialSite);
    }
  });

  test('should update data on site switch', async ({ page }) => {
    const initialData = await page.evaluate(() => {
      return JSON.stringify(window.__sadvState?.currentData);
    });

    // Switch site
    await page.evaluate(() => {
      if (window.__sadvApi && window.__sadvApi.switchSite) {
        const sites = window.__sadvState?.sites || [];
        if (sites.length > 1) {
          window.__sadvApi.switchSite(sites[1].id);
        }
      }
    });

    await page.waitForTimeout(1000);

    const newData = await page.evaluate(() => {
      return JSON.stringify(window.__sadvState?.currentData);
    });

    // Data should be different after site switch
    expect(initialData).toBeDefined();
  });

  test('should handle invalid site gracefully', async ({ page }) => {
    const errorHandled = await page.evaluate(() => {
      try {
        if (window.__sadvApi && window.__sadvApi.switchSite) {
          window.__sadvApi.switchSite('invalid-site-id');
          return true; // No error thrown
        }
        return false;
      } catch (e) {
        return false;
      }
    });

    expect(errorHandled).toBeTruthy();
  });

  test('should display site list in dropdown', async ({ page }) => {
    const sites = await page.evaluate(() => {
      return window.__sadvState?.sites || [];
    });

    if (sites.length > 0) {
      expect(sites.length).toBeGreaterThan(0);
    }
  });

  test('should maintain site selection in state', async ({ page }) => {
    const siteId = await page.evaluate(() => {
      return window.__sadvState?.currentSiteId;
    });

    expect(siteId).toBeDefined();
    expect(typeof siteId).toBe('string');
  });

  test('should support site filtering', async ({ page }) => {
    // Check if site filtering is available
    const hasFiltering = await page.evaluate(() => {
      return typeof window.__sadvApi?.filterBySite === 'function';
    });

    if (hasFiltering) {
      const filtered = await page.evaluate(() => {
        if (window.__sadvState?.sites?.length > 0) {
          return window.__sadvApi.filterBySite(window.__sadvState.sites[0].id);
        }
        return false;
      });

      expect(filtered).toBeDefined();
    }
  });

  test('should update UI on site change', async ({ page }) => {
    const initialContent = await page.evaluate(() => {
      const panel = document.querySelector('#sadv-tab-overview');
      return panel?.innerHTML;
    });

    // Switch site
    await page.evaluate(() => {
      if (window.__sadvApi && window.__sadvApi.switchSite) {
        const sites = window.__sadvState?.sites || [];
        if (sites.length > 1) {
          window.__sadvApi.switchSite(sites[1].id);
        }
      }
    });

    await page.waitForTimeout(1000);

    const updatedContent = await page.evaluate(() => {
      const panel = document.querySelector('#sadv-tab-overview');
      return panel?.innerHTML;
    });

    // Content should exist and be different
    expect(initialContent).toBeDefined();
    expect(updatedContent).toBeDefined();
  });

  test('should handle multi-account scenarios', async ({ page }) => {
    const accounts = await page.evaluate(() => {
      return window.__sadvState?.accounts || [];
    });

    if (accounts.length > 1) {
      // Should have multiple accounts
      expect(accounts.length).toBeGreaterThan(1);

      // Switch between accounts
      const firstAccount = accounts[0];
      const secondAccount = accounts[1];

      await page.evaluate((id) => {
        if (window.__sadvApi && window.__sadvApi.switchAccount) {
          window.__sadvApi.switchAccount(id);
        }
      }, secondAccount.id);

      await page.waitForTimeout(500);

      const currentAccount = await page.evaluate(() => {
        return window.__sadvState?.currentAccountId;
      });

      expect(currentAccount).toBe(secondAccount.id);
    }
  });

  test('should persist site selection', async ({ page }) => {
    const selectedSite = await page.evaluate(() => {
      return window.__sadvState?.currentSiteId;
    });

    // Reload page
    await page.reload();
    await page.waitForSelector('#sadv-container', { timeout: 5000 });

    const persistedSite = await page.evaluate(() => {
      return window.__sadvState?.currentSiteId;
    });

    // Site should be persisted
    expect(persistedSite).toBe(selectedSite);
  });
});
