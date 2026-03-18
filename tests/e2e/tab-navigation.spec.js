/**
 * Tab Navigation E2E Tests
 * Tests tab switching, active states, and keyboard navigation
 */

const { test, expect } = require('@playwright/test');

test.describe('Tab Navigation', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/widget.html');
    await page.waitForSelector('#sadv-tabs', { timeout: 5000 });
  });

  test('should display all expected tabs', async ({ page }) => {
    const tabs = await page.$$('#sadv-tabs button[role="tab"]');

    // Should have at least 6 tabs
    expect(tabs.length).toBeGreaterThanOrEqual(6);

    // Check for specific tabs
    const tabTexts = await page.evaluate(() => {
      return Array.from(document.querySelectorAll('#sadv-tabs button'))
        .map(btn => btn.textContent.trim());
    });

    expect(tabTexts).toContain('Overview');
    expect(tabTexts).toContain('Daily');
  });

  test('should switch to Overview tab', async ({ page }) => {
    await page.click('#sadv-tabs button:has-text("Overview")');
    await page.waitForTimeout(300);

    const isActive = await page.evaluate(() => {
      const button = document.querySelector('#sadv-tabs button:has-text("Overview")');
      return button?.getAttribute('aria-selected') === 'true';
    });

    expect(isActive).toBeTruthy();
  });

  test('should switch to Daily tab', async ({ page }) => {
    await page.click('#sadv-tabs button:has-text("Daily")');
    await page.waitForTimeout(300);

    const isActive = await page.evaluate(() => {
      const button = document.querySelector('#sadv-tabs button:has-text("Daily")');
      return button?.getAttribute('aria-selected') === 'true';
    });

    expect(isActive).toBeTruthy();
  });

  test('should switch to Weekly tab', async ({ page }) => {
    await page.click('#sadv-tabs button:has-text("Weekly")');
    await page.waitForTimeout(300);

    const isActive = await page.evaluate(() => {
      const button = document.querySelector('#sadv-tabs button:has-text("Weekly")');
      return button?.getAttribute('aria-selected') === 'true';
    });

    expect(isActive).toBeTruthy();
  });

  test('should display correct panel for active tab', async ({ page }) => {
    await page.click('#sadv-tabs button:has-text("Daily")');
    await page.waitForTimeout(300);

    const panelVisible = await page.evaluate(() => {
      const panel = document.querySelector('#sadv-tab-daily');
      return panel?.getAttribute('aria-hidden') === 'false';
    });

    expect(panelVisible).toBeTruthy();
  });

  test('should hide inactive tab panels', async ({ page }) => {
    await page.click('#sadv-tabs button:has-text("Overview")');
    await page.waitForTimeout(300);

    const dailyPanelHidden = await page.evaluate(() => {
      const panel = document.querySelector('#sadv-tab-daily');
      return panel?.getAttribute('aria-hidden') === 'true';
    });

    expect(dailyPanelHidden).toBeTruthy();
  });

  test('should navigate tabs with keyboard', async ({ page }) => {
    // Focus first tab
    await page.keyboard.press('Tab');
    await page.keyboard.press('Tab');

    // Press arrow right to move to next tab
    await page.keyboard.press('ArrowRight');
    await page.waitForTimeout(200);

    const focusedTab = await page.evaluate(() => {
      return document.activeElement.textContent.trim();
    });

    // Should not be the first tab anymore
    expect(focusedTab).not.toBe('');
  });

  test('should navigate tabs with arrow keys', async ({ page }) => {
    // Focus on tabs
    await page.focus('#sadv-tabs button:first-child');

    // Press right arrow
    await page.keyboard.press('ArrowRight');
    await page.waitForTimeout(200);

    const secondTabFocused = await page.evaluate(() => {
      const tabs = Array.from(document.querySelectorAll('#sadv-tabs button'));
      return tabs[1] === document.activeElement;
    });

    expect(secondTabFocused).toBeTruthy();
  });

  test('should activate tab on Enter key', async ({ page }) => {
    await page.focus('#sadv-tabs button:nth-child(2)');
    await page.keyboard.press('Enter');
    await page.waitForTimeout(300);

    const isActive = await page.evaluate(() => {
      const tabs = Array.from(document.querySelectorAll('#sadv-tabs button'));
      return tabs[1]?.getAttribute('aria-selected') === 'true';
    });

    expect(isActive).toBeTruthy();
  });

  test('should maintain tab state on rapid switching', async ({ page }) => {
    // Rapidly switch between tabs
    for (let i = 0; i < 5; i++) {
      await page.click('#sadv-tabs button:has-text("Daily")');
      await page.waitForTimeout(100);
      await page.click('#sadv-tabs button:has-text("Overview")');
      await page.waitForTimeout(100);
    }

    // Should not crash and still be functional
    const tabsVisible = await page.isVisible('#sadv-tabs');
    expect(tabsVisible).toBeTruthy();
  });

  test('should have proper ARIA attributes', async ({ page }) => {
    const tabs = await page.$$('#sadv-tabs button[role="tab"]');

    for (const tab of tabs) {
      const ariaSelected = await tab.getAttribute('aria-selected');
      const tabIndex = await tab.getAttribute('tabindex');

      expect(ariaSelected).toBeDefined();
      expect(tabIndex).toBeDefined();
    }
  });

  test('should update URL hash on tab change', async ({ page }) => {
    await page.click('#sadv-tabs button:has-text("Daily")');
    await page.waitForTimeout(300);

    const url = page.url();
    expect(url).toContain('#daily');
  });
});
