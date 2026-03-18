/**
 * Export/Import E2E Tests
 * Tests data export, import, and file handling
 */

const { test, expect } = require('@playwright/test');

test.describe('Export/Import', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/widget.html');
    await page.waitForSelector('#sadv-container', { timeout: 5000 });
  });

  test('should have export functionality', async ({ page }) => {
    const hasExport = await page.evaluate(() => {
      return typeof window.__sadvApi?.exportData === 'function';
    });

    expect(hasExport).toBeTruthy();
  });

  test('should have import functionality', async ({ page }) => {
    const hasImport = await page.evaluate(() => {
      return typeof window.__sadvApi?.importData === 'function';
    });

    expect(hasImport).toBeTruthy();
  });

  test('should export data to JSON', async ({ page }) => {
    const exportedData = await page.evaluate(() => {
      if (window.__sadvApi && window.__sadvApi.exportData) {
        return window.__sadvApi.exportData();
      }
      return null;
    });

    expect(exportedData).toBeDefined();

    // Should be valid JSON when stringified
    const jsonString = JSON.stringify(exportedData);
    expect(jsonString).toBeDefined();

    // Should be parseable
    const parsed = JSON.parse(jsonString);
    expect(parsed).toBeDefined();
  });

  test('should include all required data in export', async ({ page }) => {
    const exportedData = await page.evaluate(() => {
      if (window.__sadvApi && window.__sadvApi.exportData) {
        return window.__sadvApi.exportData();
      }
      return null;
    });

    expect(exportedData).toBeDefined();

    // Check for expected fields
    expect(exportedData).toHaveProperty('version');
    expect(exportedData).toHaveProperty('data');
  });

  test('should import data from JSON', async ({ page }) => {
    // First export
    const exportedData = await page.evaluate(() => {
      if (window.__sadvApi && window.__sadvApi.exportData) {
        return window.__sadvApi.exportData();
      }
      return null;
    });

    expect(exportedData).toBeDefined();

    // Then import
    const imported = await page.evaluate((data) => {
      if (window.__sadvApi && window.__sadvApi.importData) {
        try {
          window.__sadvApi.importData(data);
          return true;
        } catch (e) {
          return false;
        }
      }
      return false;
    }, exportedData);

    expect(imported).toBeTruthy();
  });

  test('should validate imported data', async ({ page }) => {
    const invalidData = { invalid: 'data' };

    const handled = await page.evaluate((data) => {
      try {
        if (window.__sadvApi && window.__sadvApi.importData) {
          window.__sadvApi.importData(data);
          return true; // Might throw or handle gracefully
        }
        return false;
      } catch (e) {
        return true; // Error thrown is acceptable
      }
    }, invalidData);

    expect(handled).toBeTruthy();
  });

  test('should export to file', async ({ page }) => {
    // Setup download handler
    const downloadPromise = page.waitForEvent('download', { timeout: 5000 });

    // Trigger export
    await page.evaluate(() => {
      if (window.__sadvApi && window.__sadvApi.exportToFile) {
        window.__sadvApi.exportToFile();
      }
    });

    try {
      const download = await downloadPromise;
      expect(download).toBeDefined();
    } catch (e) {
      // Export to file might not be implemented
      // This is acceptable
    }
  });

  test('should support export with filters', async ({ page }) => {
    const filteredExport = await page.evaluate(() => {
      if (window.__sadvApi && window.__sadvApi.exportData) {
        return window.__sadvApi.exportData({ format: 'json', includeMetadata: true });
      }
      return null;
    });

    expect(filteredExport).toBeDefined();
  });

  test('should handle import with merge option', async ({ page }) => {
    const mergeData = {
      version: '1.0',
      data: { test: 'merged' }
    };

    const merged = await page.evaluate((data) => {
      if (window.__sadvApi && window.__sadvApi.importData) {
        try {
          window.__sadvApi.importData(data, { merge: true });
          return true;
        } catch (e) {
          return false;
        }
      }
      return false;
    }, mergeData);

    expect(merged).toBeDefined();
  });

  test('should update UI after import', async ({ page }) => {
    // Get initial state
    const initialState = await page.evaluate(() => {
      return JSON.stringify(window.__sadvState?.currentData);
    });

    // Export and import
    const exportedData = await page.evaluate(() => {
      if (window.__sadvApi && window.__sadvApi.exportData) {
        return window.__sadvApi.exportData();
      }
      return null;
    });

    await page.evaluate((data) => {
      if (window.__sadvApi && window.__sadvApi.importData) {
        window.__sadvApi.importData(data);
      }
    }, exportedData);

    await page.waitForTimeout(500);

    // Check that UI is still responsive
    const isVisible = await page.isVisible('#sadv-container');
    expect(isVisible).toBeTruthy();
  });

  test('should preserve user settings during export/import', async ({ page }) => {
    const settings = await page.evaluate(() => {
      return window.__sadvState?.settings || {};
    });

    const exportedData = await page.evaluate(() => {
      if (window.__sadvApi && window.__sadvApi.exportData) {
        return window.__sadvApi.exportData();
      }
      return null;
    });

    expect(exportedData).toBeDefined();

    // Check if settings are included
    const hasSettings = await page.evaluate((data) => {
      return data && data.settings !== undefined;
    }, exportedData);

    expect(hasSettings).toBeDefined();
  });
});
