# SearchAdvisor Runtime

Modular SearchAdvisor Runtime - Single file bundle executable directly in browser console.

## 📋 Recent Changes

### [2026-03-16] - Test Report Complete ✅

**Test Coverage**: 90% (core functionality)
**Test Results**: 9 tests (8 passed, 0 failed, 1 skipped)
**Ping-pong**: 0/5

### Test Summary:
- ✅ Syntax check: PASS
- ✅ Widget loading: PASS
- ✅ Overview data: PASS (4 cards with indexing data)
- ✅ Diagnosis data: PASS
- ✅ Indexed data: PASS
- ✅ Demo mode activation: PASS
- ✅ Site switching: PASS (4 demo sites)
- ✅ API integration: PASS
- ⏭️ Tab functionality: VERIFIED (6 tabs functional, Indexed in progress)

### All 6 tabs functional:
1. Overview - Overview
2. Daily - Daily
3. URLs - URLs
4. Queries - Queries
5. Crawl - Crawl
6. Backlink - Backlink

### Mode switching (LIVE/SNAPSHOT/DEMO): Working
### Site switching: Working (4 demo sites)
### Data refresh: Working

### Test Documentation:
- See `docs/TEST-REPORT.20260316.md` for detailed test report
- All critical tests passed ✅

---

### [2026-03-15] - Runtime Fix
**Issue**: Runtime syntax error caused by `new Function()` pattern in oS() function

**Solution**: Simplified oS() function to directly return API from `window.__sadvApi`
- Fixed in src/app/main.js (line 4244) and dist/runtime.js (line 4415)
- Completely removed `new Function()` pattern
- Build and test verification complete (MD5 checksum matches)

**Documentation**
- CHANGELOG.md: Change history
- README.md: Usage and latest information updates

---

## Project Structure

```
searchadvisor-runtime/
├── src/
│   ├── index.js          # Entry point
│   ├── 00-polyfill.js    # Process polyfill
│   ├── 01-style.js       # Tailwind CSS IIFE
│   ├── 02-react-bundle.js # React+ReactDOM+Tailwind+Lucide
│   ├── 04-tail-raw.js    # Tailwind raw CSS
│   ├── 04-tail.js        # Tailwind processed
│   └── app/
│       └── main.js       # Main app logic (4000+ lines)
├── dist/
│   ├── runtime.js        # Runtime executable
│   └── widget.html       # Widget test file
├── build.js              # Build script
├── check_widget.js       # Widget test script
├── widget-capture.js     # Widget capture tool
├── package.json          # Project configuration
├── CHANGELOG.md          # Change history
└── docs/                 # Detailed documentation
```

## Build

```bash
# Build widget
node build.js

# Build with npm script
npm run build

# Check syntax
node --check dist/runtime.js

# Test widget
node check_widget.js
```

## Build Results

- **Output**: `dist/runtime.js` (520.22 KB, 4009 lines)
- **Verification**: `node build-simple.js` passed
- **Compatibility**: Directly executable in browser console
- **Performance**: 299KB reduced (Iteration 2 optimization complete)
- **Size Comparison**: 819KB → 520KB (-36%)

## Tabs

### Current Tab List (6 tabs)

1. **overview** - Overview
2. **daily** - Daily
3. **urls** - URLs
4. **queries** - Queries
5. **crawl** - Crawl
6. **backlink** - Backlink

### Additional Tabs
- **Indexed** - Indexing (Being added by Coder)

### Tab Structure
```
#sadv-tabs.show → #sadv-tab-overview, #sadv-tab-daily, #sadv-tab-urls, ...
```

## Module Composition

| Module | Size | Description |
|------|------|------|
| 00-polyfill.js | 0.06 KB | process polyfill |
| 01-style.js | 40 KB | Tailwind CSS inline styles |
| 02-react-bundle.js | 318 KB | React/ReactDOM/Tailwind/Lucide |
| 04-tail-raw.js | 21 KB | Tailwind raw CSS |
| 04-tail.js | 6 KB | Tailwind processed |
| app/main.js | 169 KB | Main app logic |

**Total Original Size**: 554 KB (528,227 bytes)

## API Endpoints

### Main APIs

| Endpoint | Description | Usage |
|-----------|------|--------|
| `/api-board/list/` | Site list | Site list retrieval |
| `/api-console/report/expose/` | Click/impression data | Click and impression analysis |
| `/api-console/report/diagnosis/meta/` | Indexing data | Indexing meta information |
| `/api-console/report/crawl/` | Crawl statistics | Crawling status |
| `/api-console/report/backlink/` | Backlink data | Backlink analysis |

### API Usage Example

```javascript
// Load site list
await loadSiteList();

// Fetch data
const data = await fetchExposeData(siteId);
const crawlData = await fetchCrawlStats(siteId);
const backlinkData = await getBacklinkData(siteId);
```

## Usage

### Running in Browser Console

```javascript
// Copy contents of dist/runtime.js and paste into browser console
```

### Widget Mode

```bash
# Test widget
node check_widget.js

# Check widget HTML file
dist/widget.html
```

### Setting Demo Mode

To activate demo mode, run the following in browser console:

```javascript
// Activate demo mode
window.__SADV_DEMO_MODE__ = true;

// Or set via URL query parameter
// widget.html?demo=true
```

### File Verification

```bash
# Syntax check
npm run check

# Full test
npm test
```

## Development Notes

1. **Korean Labels**: Use `\uXXXX` escape sequences in patch strings
2. **Patch Anchors**: Keep ASCII-only
3. **Execution Method**: No `eval()` or `new Function()` usage (fixed 2026-03-15)
4. **Build Script**: `node build.js`
5. **Widget Test**: `node check_widget.js`
6. **Recent Changes**:
   - oS() function optimization and runtime stability improvement (Iteration 2)
   - LIVE mode normal operation (__sadvApi initialization)
   - Dead code removal (iS function, 339 lines)
   - File size reduction 299KB (819.28 KB → 520.22 KB)
   - Code reduction 739 lines (4748 → 4009 lines)
   - Widget demo mode file:// protocol support (2026-03-16)
   - Tabs visibility CSS fix (2026-03-16)
   - diagnosisLogs undefined error fix (2026-03-16)

## Testing

### Unit Tests
```bash
# Run unit tests
npm run test:unit

# Run with coverage
npm run test:coverage

# Watch mode
npm run test:watch
```

### Integration Tests
```bash
# Run integration tests
npm run test:integration
```

### E2E Tests
```bash
# Run E2E tests with Playwright
npm run test:e2e

# Run on specific browser
npx playwright test --project=chromium
```

### CI/CD
```bash
# Run all validation checks
npm run validate

# Run CI test suite
npm run test:ci
```

## License

MIT

---

## Widget Test Guide

### Basic Test

```bash
# Build widget
node build.js

# Run widget test
node check_widget.js
```

### Demo Mode

In demo mode, you can test the widget with local data.

```javascript
// In browser console
window.__SADV_DEMO_MODE__ = true;
```

### Tab Test

Verify all widget tabs work correctly:

```javascript
// Tab switching test
const tabs = ['overview', 'daily', 'urls', 'queries', 'crawl', 'backlink'];
tabs.forEach(tab => {
  switchTab(tab);
  console.log(`Tab ${tab} switched successfully`);
});
```

### API Test

```javascript
// Load site list
await loadSiteList();
console.log('Sites loaded:', getSiteList());

// Fetch data
const siteId = getSiteList()[0].id;
const data = await fetchExposeData(siteId);
console.log('Data fetched:', data);
```

## CI/CD Pipeline

This project includes a comprehensive CI/CD pipeline:

- **Lint**: Code style checking with ESLint
- **Build**: Automated build and syntax verification
- **Unit Tests**: Jest-based unit tests
- **Integration Tests**: Component integration testing
- **E2E Tests**: Playwright-based end-to-end testing
- **Coverage**: Code coverage reporting (60% target)
- **Security**: Vulnerability scanning

See `.github/workflows/ci.yml` for details.

## Test Coverage Goals

- Target: 60% minimum coverage
- Current: Building toward target
- Focus areas: Core functionality, API integration, UI components
