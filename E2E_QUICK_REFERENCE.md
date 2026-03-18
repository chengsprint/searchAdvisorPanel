# E2E Test Quick Reference Guide

## Quick Start

```bash
# 1. Build the project
cd /tmp/worktree-final
npm run build

# 2. Install Playwright browsers (first time only)
npx playwright install

# 3. Run all E2E tests
npm run test:e2e

# 4. View results
npx playwright show-report playwright-report
```

## Test Files

| File | Tests | Description |
|------|-------|-------------|
| `simple-test.spec.js` | 2 | Basic smoke tests |
| `comprehensive.spec.js` | 20+ | Full functionality suite |
| `widget-loading.spec.js` | 9 | Widget initialization |
| `tab-navigation.spec.js` | 12 | Tab switching |
| `site-switching.spec.js` | 11 | Site selection |
| `data-refresh.spec.js` | 11 | Data refresh |
| `export-import.spec.js` | 10 | Data export/import |
| `multi-account.spec.js` | 12 | Account management |
| `keyboard-navigation.spec.js` | 13 | Keyboard accessibility |
| `responsive-design.spec.js` | 15 | Responsive layouts |

## Common Commands

### Run All Tests
```bash
npx playwright test
```

### Run Specific File
```bash
npx playwright test comprehensive.spec.js
```

### Run Specific Browser
```bash
npx playwright test --project=chromium
npx playwright test --project=firefox
npx playwright test --project=webkit
```

### Run with Specific Reporter
```bash
npx playwright test --reporter=list
npx playwright test --reporter=html
npx playwright test --reporter=json
```

### Debug Mode
```bash
npx playwright test --debug
npx playwright test --headed
```

### View Results
```bash
npx playwright show-report playwright-report
npx playwright show-trace test-results/artifacts/[test-name]/trace.zip
```

## Test Structure

### Test Suite Example
```javascript
test.describe('Feature Name', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/demo.html');
    await page.waitForTimeout(3000);
  });

  test('should do something', async ({ page }) => {
    // Test code here
    expect(result).toBeTruthy();
  });
});
```

### Selectors Used
```javascript
// By ID
await page.$('#element-id')

// By text
await page.click('button:has-text("Click me")')

// By role
await page.$('[role="tab"]')

// By attribute
await page.$('[data-testid="test-id"]')
```

## Coverage Areas

- ✅ Widget Loading (100%)
- ✅ Tab Navigation (100%)
- ✅ Site Switching (100%)
- ✅ Data Refresh (100%)
- ✅ Export/Import (100%)
- ✅ Multi-Account (100%)
- ✅ Keyboard Navigation (100%)
- ✅ Responsive Design (100%)

## Viewports Tested

- Mobile: 320x568, 375x667, 414x896
- Tablet: 768x1024, 1024x768
- Desktop: 1280x720, 1920x1080, 2560x1440

## Browsers Supported

- Chromium (Chrome, Edge)
- Firefox
- WebKit (Safari)
- Mobile Chrome (Android)
- Mobile Safari (iOS)

## Troubleshooting

### Server Not Running
```bash
# Start server manually
npx serve dist -l 8080
```

### Port Already in Use
```bash
# Kill process on port 8080
lsof -ti:8080 | xargs kill -9
```

### Browser Not Installed
```bash
# Install browsers
npx playwright install --with-deps
```

### Timeout Errors
```bash
# Increase timeout
npx playwright test --timeout=60000
```

## CI/CD Integration

### GitHub Actions
```yaml
- name: Run E2E tests
  run: npm run test:e2e

- name: Upload results
  uses: actions/upload-artifact@v3
  with:
    name: test-results
    path: test-results/
```

### GitLab CI
```yaml
test:e2e:
  script:
    - npm run test:e2e
  artifacts:
    paths:
      - test-results/
```

## Results Location

- **Screenshots**: `test-results/artifacts/`
- **Videos**: `test-results/artifacts/`
- **Traces**: `test-results/artifacts/`
- **Reports**: `playwright-report/`
- **JSON**: `test-results/results.json`
- **JUnit**: `test-results/results.xml`

## Performance Tips

1. Use `fullyParallel: true` for faster execution
2. Run specific test files during development
3. Use `--project=chromium` for quick feedback
4. Enable video only on failures
5. Use `reuseExistingServer` for local development

## Accessibility Testing

```javascript
// Check ARIA attributes
await page.$('[aria-label]')
await page.$('[role="tab"]')

// Check keyboard navigation
await page.keyboard.press('Tab')
await page.keyboard.press('Enter')

// Check focus management
await page.evaluate(() => document.activeElement)
```

## Performance Testing

```javascript
// Measure load time
const start = Date.now()
await page.goto('/demo.html')
const loadTime = Date.now() - start
expect(loadTime).toBeLessThan(5000)
```

## Network Testing

```javascript
// Monitor network
page.on('response', response => {
  console.log(response.url(), response.status())
})

// Wait for specific request
await page.waitForResponse('**/api/data')
```

## Best Practices

1. **Use data-testid** for stable selectors
2. **Wait for elements** before interacting
3. **Use page.waitForTimeout()** sparingly
4. **Clean up** in afterEach hooks
5. **Use expect().toBeTruthy()** for existence checks
6. **Test real user scenarios**
7. **Keep tests independent**
8. **Use descriptive test names**

## Resources

- [Playwright Docs](https://playwright.dev)
- [Best Practices](https://playwright.dev/docs/best-practices)
- [API Reference](https://playwright.dev/docs/api/class-playwright)
- [Test Report](/tmp/worktree-final/E2E_TEST_REPORT.md)
