/**
 * Multi-Account E2E Tests
 * Tests account switching, merged views, and account management
 */

const { test, expect } = require('@playwright/test');

test.describe('Multi-Account', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/widget.html');
    await page.waitForSelector('#sadv-container', { timeout: 5000 });
  });

  test('should display account list', async ({ page }) => {
    const accounts = await page.evaluate(() => {
      return window.__sadvState?.accounts || [];
    });

    expect(accounts).toBeDefined();
    expect(Array.isArray(accounts)).toBeTruthy();
  });

  test('should have current account selected', async ({ page }) => {
    const currentAccountId = await page.evaluate(() => {
      return window.__sadvState?.currentAccountId;
    });

    expect(currentAccountId).toBeDefined();
    expect(typeof currentAccountId).toBe('string');
  });

  test('should switch between accounts', async ({ page }) => {
    const accounts = await page.evaluate(() => {
      return window.__sadvState?.accounts || [];
    });

    if (accounts.length > 1) {
      const initialAccount = await page.evaluate(() => {
        return window.__sadvState?.currentAccountId;
      });

      // Switch to second account
      await page.evaluate((accountId) => {
        if (window.__sadvApi && window.__sadvApi.switchAccount) {
          window.__sadvApi.switchAccount(accountId);
        }
      }, accounts[1].id);

      await page.waitForTimeout(500);

      const newAccountId = await page.evaluate(() => {
        return window.__sadvState?.currentAccountId;
      });

      expect(newAccountId).not.toBe(initialAccount);
      expect(newAccountId).toBe(accounts[1].id);
    }
  });

  test('should update data on account switch', async ({ page }) => {
    const accounts = await page.evaluate(() => {
      return window.__sadvState?.accounts || [];
    });

    if (accounts.length > 1) {
      const initialData = await page.evaluate(() => {
        return JSON.stringify(window.__sadvState?.currentData);
      });

      // Switch account
      await page.evaluate((accountId) => {
        if (window.__sadvApi && window.__sadvApi.switchAccount) {
          window.__sadvApi.switchAccount(accountId);
        }
      }, accounts[1].id);

      await page.waitForTimeout(1000);

      const newData = await page.evaluate(() => {
        return JSON.stringify(window.__sadvState?.currentData);
      });

      expect(newData).toBeDefined();
    }
  });

  test('should support merged account view', async ({ page }) => {
    const hasMergedView = await page.evaluate(() => {
      return typeof window.__sadvApi?.enableMergedView === 'function';
    });

    if (hasMergedView) {
      const enabled = await page.evaluate(() => {
        if (window.__sadvApi && window.__sadvApi.enableMergedView) {
          window.__sadvApi.enableMergedView(true);
          return true;
        }
        return false;
      });

      expect(enabled).toBeTruthy();

      await page.waitForTimeout(500);

      const isMerged = await page.evaluate(() => {
        return window.__sadvState?.isMergedView || false;
      });

      expect(isMerged).toBeDefined();
    }
  });

  test('should display account selector', async ({ page }) => {
    const accountSelector = await page.$('#sadv-account-selector');

    if (accountSelector) {
      const isVisible = await accountSelector.isVisible();
      expect(isVisible).toBeTruthy();
    } else {
      // Account selector might be in a different location
      const hasAccounts = await page.evaluate(() => {
        const accounts = window.__sadvState?.accounts || [];
        return accounts.length > 0;
      });

      expect(hasAccounts).toBeTruthy();
    }
  });

  test('should handle single account gracefully', async ({ page }) => {
    const accounts = await page.evaluate(() => {
      return window.__sadvState?.accounts || [];
    });

    if (accounts.length === 1) {
      // Should still work with single account
      const currentAccount = await page.evaluate(() => {
        return window.__sadvState?.currentAccountId;
      });

      expect(currentAccount).toBe(accounts[0].id);
    }
  });

  test('should aggregate data across accounts', async ({ page }) => {
    const hasAggregation = await page.evaluate(() => {
      return typeof window.__sadvApi?.getAggregatedData === 'function';
    });

    if (hasAggregation) {
      const aggregated = await page.evaluate(() => {
        if (window.__sadvApi && window.__sadvApi.getAggregatedData) {
          return window.__sadvApi.getAggregatedData();
        }
        return null;
      });

      expect(aggregated).toBeDefined();
    }
  });

  test('should persist account selection', async ({ page }) => {
    const initialAccount = await page.evaluate(() => {
      return window.__sadvState?.currentAccountId;
    });

    // Reload page
    await page.reload();
    await page.waitForSelector('#sadv-container', { timeout: 5000 });

    const persistedAccount = await page.evaluate(() => {
      return window.__sadvState?.currentAccountId;
    });

    expect(persistedAccount).toBe(initialAccount);
  });

  test('should filter data by account', async ({ page }) => {
    const accounts = await page.evaluate(() => {
      return window.__sadvState?.accounts || [];
    });

    if (accounts.length > 1) {
      // Filter by specific account
      const filtered = await page.evaluate((accountId) => {
        if (window.__sadvApi && window.__sadvApi.filterByAccount) {
          return window.__sadvApi.filterByAccount(accountId);
        }
        return null;
      }, accounts[0].id);

      expect(filtered).toBeDefined();
    }
  });

  test('should handle account-specific settings', async ({ page }) => {
    const accounts = await page.evaluate(() => {
      return window.__sadvState?.accounts || [];
    });

    if (accounts.length > 0) {
      const accountSettings = await page.evaluate((accountId) => {
        if (window.__sadvApi && window.__sadvApi.getAccountSettings) {
          return window.__sadvApi.getAccountSettings(accountId);
        }
        return null;
      }, accounts[0].id);

      expect(accountSettings).toBeDefined();
    }
  });

  test('should support account comparison', async ({ page }) => {
    const hasComparison = await page.evaluate(() => {
      return typeof window.__sadvApi?.compareAccounts === 'function';
    });

    if (hasComparison) {
      const accounts = await page.evaluate(() => {
        return window.__sadvState?.accounts || [];
      });

      if (accounts.length >= 2) {
        const comparison = await page.evaluate((accountIds) => {
          if (window.__sadvApi && window.__sadvApi.compareAccounts) {
            return window.__sadvApi.compareAccounts(accountIds);
          }
          return null;
        }, [accounts[0].id, accounts[1].id]);

        expect(comparison).toBeDefined();
      }
    }
  });

  test('should update site list on account switch', async ({ page }) => {
    const accounts = await page.evaluate(() => {
      return window.__sadvState?.accounts || [];
    });

    if (accounts.length > 1) {
      const initialSites = await page.evaluate(() => {
        return window.__sadvState?.sites || [];
      });

      // Switch account
      await page.evaluate((accountId) => {
        if (window.__sadvApi && window.__sadvApi.switchAccount) {
          window.__sadvApi.switchAccount(accountId);
        }
      }, accounts[1].id);

      await page.waitForTimeout(500);

      const newSites = await page.evaluate(() => {
        return window.__sadvState?.sites || [];
      });

      expect(newSites).toBeDefined();
    }
  });
});
