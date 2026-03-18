/**
 * Simple E2E Test
 * Basic smoke test to verify setup
 */

const { test, expect } = require('@playwright/test');

test('should load demo page', async ({ page }) => {
  await page.goto('/demo.html');
  await page.waitForTimeout(2000);

  const title = await page.title();
  expect(title).toContain('SearchAdvisor');
});

test('should render widget on page', async ({ page }) => {
  await page.goto('/demo.html');
  await page.waitForTimeout(3000);

  // Check if any widget elements are rendered
  const hasWidgetElements = await page.evaluate(() => {
    // Check for various possible widget elements
    const tabs = document.querySelector('[role="tablist"]');
    const buttons = document.querySelectorAll('button').length;
    const divs = document.querySelectorAll('div').length;

    return {
      hasTabs: !!tabs,
      buttonCount: buttons,
      divCount: divs
    };
  });

  // Should have some interactive elements
  expect(hasWidgetElements.buttonCount).toBeGreaterThan(0);
  expect(hasWidgetElements.divCount).toBeGreaterThan(10);
});
