/**
 * 브라우저용 빌드 - export 문 제거
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const DIST_DIR = path.join(__dirname, 'dist');
const RUNTIME_FILE = path.join(DIST_DIR, 'runtime.js');
const BROWSER_FILE = path.join(DIST_DIR, 'runtime-browser.js');

console.log('Building browser-compatible bundle...\n');

// 1. 기존 빌드 실행
console.log('Step 1: Running original build...');
try {
  execSync('npm run build', { stdio: 'inherit' });
} catch (e) {
  console.error('Build failed');
  process.exit(1);
}

// 2. export 문 제거
console.log('\nStep 2: Removing ES6 export statements...');
let content = fs.readFileSync(RUNTIME_FILE, 'utf-8');

// export 블록 제거 (멀티라인)
content = content.replace(/^export\s*\{[\s\S]*?\};\s*$/gm, '');

// 개별 export 문 제거
content = content.replace(/^export\s+(const|let|var|function|class)\s+/gm, '$1 ');
content = content.replace(/^export\s+default\s+/gm, '');

// import 문 제거
content = content.replace(/^import\s+.*from\s+['"][^'"]+['"];\s*$/gm, '');

// 3. 브라우저용 파일 작성
fs.writeFileSync(BROWSER_FILE, content);

const stats = fs.statSync(BROWSER_FILE);
console.log(`\n✅ Browser bundle created: runtime-browser.js`);
console.log(`   Size: ${(stats.size / 1024).toFixed(2)} KB`);

// 4. 구문 검증
console.log('\nStep 3: Verifying syntax...');
try {
  execSync(`node --check "${BROWSER_FILE}"`, { stdio: 'pipe' });
  console.log('   ✓ Syntax VALID');
} catch (e) {
  console.error('   ✗ Syntax INVALID');
  process.exit(1);
}

// 5. HTML 템플릿 생성
console.log('\nStep 4: Creating browser-compatible HTML...');
const htmlTemplate = `<!DOCTYPE html>
<html lang="ko">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>SearchAdvisor - Browser Compatible</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      background: #0a1628;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    }
  </style>
</head>
<body>
  <div id="widget-mount"></div>

  <!-- V2 테스트 데이터 -->
  <script>
    window.__SEARCHADVISOR_EXPORT_PAYLOAD__ = {
      __meta: {
        version: "2.0.0",
        generatedAt: new Date().toISOString()
      },
      accounts: [{
        id: 'browser-test',
        label: '브라우저 테스트',
        siteUrl: 'https://example.com',
        crawlData: {
          '2026-03-18': {
            clicks: 1250,
            impressions: 8500,
            ctr: 14.7,
            position: 12.5,
            pages: [
              { url: 'https://example.com/page1', clicks: 450, impressions: 3200, ctr: 14.1, position: 8.5 }
            ],
            queries: [
              { query: 'test keyword', clicks: 280, impressions: 1200, ctr: 23.3, position: 5.2 }
            ]
          }
        },
        backlinkData: {
          totalBacklinks: 1250,
          newBacklinks: 45
        },
        diagnosisMeta: {
          siteHealth: 85,
          indexedPages: 1250
        }
      }],
      ui: { currentTab: 'overview', currentAccount: 'browser-test' },
      stats: {
        totalClicks: 1250,
        totalImpressions: 8500
      }
    };
  </script>

  <!-- 브라우저 호환 번들 -->
  <script src="runtime-browser.js"></script>
</body>
</html>`;

fs.writeFileSync(path.join(DIST_DIR, 'browser-test.html'), htmlTemplate);
console.log('   ✓ Created: dist/browser-test.html');

console.log('\n✓ Done! Open dist/browser-test.html in your browser.');
