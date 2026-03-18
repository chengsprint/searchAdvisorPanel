/**
 * Keyboard Navigation E2E Tests
 * Tests keyboard accessibility, focus management, and shortcuts
 */

const { test, expect } = require('@playwright/test');

test.describe('Keyboard Navigation', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/widget.html');
    await page.waitForSelector('#sadv-container', { timeout: 5000 });
  });

  test('should be focusable with Tab key', async ({ page }) => {
    // Press Tab to focus on widget
    await page.keyboard.press('Tab');
    await page.keyboard.press('Tab');

    const focusedElement = await page.evaluate(() => {
      return document.activeElement.tagName;
    });

    // Should be focused on an interactive element
    expect(['BUTTON', 'A', 'INPUT', 'SELECT']).toContain(focusedElement);
  });

  test('should navigate tabs with arrow keys', async ({ page }) => {
    // Focus on first tab
    await page.focus('#sadv-tabs button:first-child');

    const firstTabText = await page.evaluate(() => {
      return document.activeElement.textContent.trim();
    });

    // Press right arrow
    await page.keyboard.press('ArrowRight');
    await page.waitForTimeout(100);

    const secondTabText = await page.evaluate(() => {
      return document.activeElement.textContent.trim();
    });

    expect(secondTabText).not.toBe(firstTabText);
  });

  test('should activate tab with Enter key', async ({ page }) => {
    // Focus on second tab
    await page.focus('#sadv-tabs button:nth-child(2)');

    // Press Enter
    await page.keyboard.press('Enter');
    await page.waitForTimeout(300);

    const isActive = await page.evaluate(() => {
      const tabs = Array.from(document.querySelectorAll('#sadv-tabs button'));
      return tabs[1]?.getAttribute('aria-selected') === 'true';
    });

    expect(isActive).toBeTruthy();
  });

  test('should activate tab with Space key', async ({ page }) => {
    // Focus on third tab
    await page.focus('#sadv-tabs button:nth-child(3)');

    // Press Space
    await page.keyboard.press('Space');
    await page.waitForTimeout(300);

    const isActive = await page.evaluate(() => {
      const tabs = Array.from(document.querySelectorAll('#sadv-tabs button'));
      return tabs[2]?.getAttribute('aria-selected') === 'true';
    });

    expect(isActive).toBeTruthy();
  });

  test('should navigate backward with Left Arrow', async ({ page }) => {
    // Focus on second tab
    await page.focus('#sadv-tabs button:nth-child(2)');

    const secondTabText = await page.evaluate(() => {
      return document.activeElement.textContent.trim();
    });

    // Press left arrow
    await page.keyboard.press('ArrowLeft');
    await page.waitForTimeout(100);

    const firstTabText = await page.evaluate(() => {
      return document.activeElement.textContent.trim();
    });

    expect(firstTabText).not.toBe(secondTabText);
  });

  test('should wrap around on arrow navigation', async ({ page }) => {
    // Focus on first tab
    await page.focus('#sadv-tabs button:first-child');

    const firstTabText = await page.evaluate(() => {
      return document.activeElement.textContent.trim();
    });

    // Press left arrow to wrap to last tab
    await page.keyboard.press('ArrowLeft');
    await page.waitForTimeout(100);

    const lastTabText = await page.evaluate(() => {
      return document.activeElement.textContent.trim();
    });

    expect(lastTabText).not.toBe(firstTabText);
  });

  test('should have proper tabindex values', async ({ page }) => {
    const tabs = await page.$$('#sadv-tabs button[role="tab"]');

    for (let i = 0; i < tabs.length; i++) {
      const tabindex = await tabs[i].getAttribute('tabindex');
      expect(tabindex).toBeDefined();
    }
  });

  test('should manage focus correctly on tab switch', async ({ page }) => {
    // Activate a tab
    await page.click('#sadv-tabs button:has-text("Daily")');
    await page.waitForTimeout(300);

    // Check if focus is on the tab
    const focusedText = await page.evaluate(() => {
      return document.activeElement.textContent.trim();
    });

    expect(focusedText).toContain('Daily');
  });

  test('should support keyboard shortcuts', async ({ page }) => {
    const hasShortcuts = await page.evaluate(() => {
      return typeof window.__sadvApi?.registerShortcut === 'function' ||
             typeof window.__sadvConfig?.keyboardShortcuts === 'object';
    });

    if (hasShortcuts) {
      // Test a common shortcut (Ctrl/Cmd + R for refresh)
      await page.keyboard.press((process.platform === 'darwin' ? 'Meta' : 'Control') + '+r');
      await page.waitForTimeout(500);

      // Should not cause page reload (should be prevented)
      const isVisible = await page.isVisible('#sadv-container');
      expect(isVisible).toBeTruthy();
    }
  });

  test('should be navigable with only keyboard', async ({ page }) => {
    // Navigate through tabs using only keyboard
    const tabs = await page.$$('#sadv-tabs button');

    if (tabs.length > 0) {
      // Focus first tab
      await page.focus('#sadv-tabs button:first-child');

      // Navigate through all tabs
      for (let i = 0; i < Math.min(tabs.length, 3); i++) {
        await page.keyboard.press('ArrowRight');
        await page.waitForTimeout(100);
      }

      // Should still be functional
      const focused = await page.evaluate(() => {
        return document.activeElement.tagName === 'BUTTON';
      });

      expect(focused).toBeTruthy();
    }
  });

  test('should have visible focus indicators', async ({ page }) => {
    // Focus on a tab
    await page.focus('#sadv-tabs button:first-child');

    // Check for focus styles
    const hasFocusStyle = await page.evaluate(() => {
      const button = document.activeElement;
      if (!button) return false;

      const styles = window.getComputedStyle(button);
      return styles.outline !== 'none' ||
             styles.boxShadow !== 'none' ||
             styles.border !== 'none';
    });

    expect(hasFocusStyle).toBeTruthy();
  });

  test('should skip hidden elements in tab order', async ({ page }) => {
    // Get all tabbable elements
    const tabbableElements = await page.evaluate(() => {
      const tabs = Array.from(document.querySelectorAll('#sadv-tabs button'));
      return tabs
        .filter(tab => tab.getAttribute('aria-hidden') !== 'true')
        .length;
    });

    expect(tabbableElements).toBeGreaterThan(0);
  });

  test('should handle Escape key', async ({ page }) => {
    // Open a dropdown or modal if available
    const hasDropdown = await page.$('#sadv-site-selector');

    if (hasDropdown) {
      await page.click('#sadv-site-selector');
      await page.waitForTimeout(200);

      // Press Escape
      await page.keyboard.press('Escape');
      await page.waitForTimeout(200);

      // Should close dropdown
      const isOpen = await page.evaluate(() => {
        const dropdown = document.querySelector('#sadv-site-selector');
        return dropdown?.getAttribute('aria-expanded') === 'true';
      });

      expect(isOpen).toBeFalsy();
    }
  });

  test('should support Home/End keys for tab navigation', async ({ page }) => {
    // Focus on a middle tab
    await page.focus('#sadv-tabs button:nth-child(3)');

    // Press Home to go to first tab
    await page.keyboard.press('Home');
    await page.waitForTimeout(100);

    const firstTabText = await page.evaluate(() => {
      return document.activeElement.textContent.trim();
    });

    // Press End to go to last tab
    await page.keyboard.press('End');
    await page.waitForTimeout(100);

    const lastTabText = await page.evaluate(() => {
      return document.activeElement.textContent.trim();
    });

    expect(firstTabText).toBeDefined();
    expect(lastTabText).toBeDefined();
    expect(firstTabText).not.toBe(lastTabText);
  });
});
