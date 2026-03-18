/**
 * Widget Loading E2E Tests
 * Tests widget initialization, loading states, and error handling
 */

const { test, expect } = require('@playwright/test');

test.describe('Widget Loading', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to demo page before each test
    await page.goto('/demo.html');
  });

  test('should load SearchAdvisor global object', async ({ page }) => {
    // Check if SearchAdvisor is available
    const hasSearchAdvisor = await page.evaluate(() => {
      return typeof window.SearchAdvisor !== 'undefined';
    });

    expect(hasSearchAdvisor).toBeTruthy();
  });

  test('should display widget container', async ({ page }) => {
    // Wait for widget to render
    await page.waitForTimeout(3000);

    // Check for widget elements
    const hasWidgetElements = await page.evaluate(() => {
      const tabs = document.querySelector('[role="tablist"]');
      const buttons = document.querySelectorAll('button').length;
      return !!tabs && buttons > 0;
    });

    expect(hasWidgetElements).toBeTruthy();
  });

  test('should display main tabs navigation', async ({ page }) => {
    await page.waitForSelector('#sadv-tabs', { timeout: 5000 });

    const tabsVisible = await page.isVisible('#sadv-tabs');
    expect(tabsVisible).toBeTruthy();
  });

  test('should initialize with default state', async ({ page }) => {
    await page.waitForTimeout(3000);

    const initialState = await page.evaluate(() => {
      return window.__sadvState || {};
    });

    expect(initialState).toBeDefined();
    expect(initialState.isInitialized).toBe(true);
  });

  test('should handle loading state gracefully', async ({ page }) => {
    const loadingState = await page.evaluate(() => {
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve(window.__sadvState?.isLoading || false);
        }, 100);
      });
    });

    // After initialization, loading should be complete
    expect(loadingState).toBe(false);
  });

  test('should render all required UI components', async ({ page }) => {
    await page.waitForTimeout(3000);

    // Check for tabs
    const tabsExist = await page.$('#sadv-tabs');
    expect(tabsExist).toBeTruthy();

    // Check for tab panels
    const panelsExist = await page.$$('#sadv-tab-panel');
    expect(panelsExist.length).toBeGreaterThan(0);
  });

  test('should have proper accessibility attributes', async ({ page }) => {
    await page.waitForSelector('#sadv-tabs', { timeout: 5000 });

    // Check for proper ARIA roles
    const tabListRole = await page.getAttribute('#sadv-tabs', 'role');
    expect(tabListRole).toBe('tablist');

    // Check for tab buttons
    const tabButtons = await page.$$('#sadv-tabs button[role="tab"]');
    expect(tabButtons.length).toBeGreaterThan(0);
  });

  test('should load without console errors', async ({ page }) => {
    const errors = [];

    page.on('console', msg => {
      if (msg.type() === 'error') {
        errors.push(msg.text());
      }
    });

    await page.waitForTimeout(3000);

    // Allow some time for any async errors
    await page.waitForTimeout(1000);

    expect(errors.length).toBe(0);
  });

  test('should be responsive to viewport changes', async ({ page }) => {
    await page.waitForTimeout(3000);

    // Test mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    await page.waitForTimeout(500);

    let isVisible = await page.isVisible('#sadv-container');
    expect(isVisible).toBeTruthy();

    // Test desktop viewport
    await page.setViewportSize({ width: 1920, height: 1080 });
    await page.waitForTimeout(500);

    isVisible = await page.isVisible('#sadv-container');
    expect(isVisible).toBeTruthy();
  });
});
