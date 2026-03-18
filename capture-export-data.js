#!/usr/bin/env node

/**
 * 페이지의 EXPORT_PAYLOAD를 읽어서 저장된 HTML 형태로 출력
 */

const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

async function createSavedHTML(htmlFile, outputName) {
  console.log(`\n${'='.repeat(60)}`);
  console.log(`저장 파일 생성: ${htmlFile} → ${outputName}`);
  console.log(`${'='.repeat(60)}`);

  const browser = await chromium.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const context = await browser.newContext({
    viewport: { width: 1920, height: 1080 }
  });

  const page = await context.newPage();
  await page.goto(`file:///home/seung/.cokacdir/workspace/yif7zotu/dist/${htmlFile}`);
  await page.waitForTimeout(3000);

  // 페이지의 EXPORT_PAYLOAD 읽기
  const payloadData = await page.evaluate(() => {
    return window.__SEARCHADVISOR_EXPORT_PAYLOAD__;
  });

  if (!payloadData) {
    console.log('  ❌ EXPORT_PAYLOAD를 찾을 수 없음');
    await browser.close();
    return null;
  }

  // 데이터 구조 확인
  console.log('\n  데이터 구조 확인:');
  console.log(`    __meta.version: ${payloadData.__meta?.version}`);
  console.log(`    __meta.accountCount: ${payloadData.__meta?.accountCount}`);
  console.log(`    accounts 키: ${Object.keys(payloadData.accounts || {}).join(', ')}`);
  console.log(`    ui.curMode: ${payloadData.ui?.curMode}`);
  console.log(`    stats.success: ${payloadData.stats?.success}`);

  // 실제 저장된 HTML 파일과 동일한 형태로 생성
  const htmlContent = `<!DOCTYPE html>
<html lang="ko">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>SearchAdvisor 저장됨 - ${outputName}</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    html, body {
      width: 100%; height: 100%;
      background: #0a1628;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    }
  </style>
</head>
<body>
  <div id="test"></div>
  <script>
    window.onerror = function(msg, url, line, col, error) {
      console.error('[Error]', msg, 'at', url, 'line:', line);
      document.getElementById('test').textContent = 'Error: ' + msg;
      return true;
    };
  </script>
  <script>
    window.__SEARCHADVISOR_EXPORT_PAYLOAD__ = ${JSON.stringify(payloadData, null, 2)};
  </script>
  <script src="runtime.js"></script>
</body>
</html>`;

  const outputPath = path.join(__dirname, 'dist', `${outputName}.html`);
  fs.writeFileSync(outputPath, htmlContent, 'utf-8');
  
  // JSON도 별도로 저장
  const jsonPath = path.join(__dirname, 'dist', `${outputName}.json`);
  fs.writeFileSync(jsonPath, JSON.stringify(payloadData, null, 2), 'utf-8');

  console.log(`\n  ✅ HTML 저장: ${outputName}.html`);
  console.log(`  ✅ JSON 저장: ${outputName}.json`);

  await browser.close();
  
  return { htmlPath: outputPath, jsonPath: jsonPath };
}

async function main() {
  // 개별 계정 저장 파일
  await createSavedHTML('test-single-fixed.html', 'saved-single-account');
  
  console.log('\n' + '='.repeat(60));
  
  // 병합 계정 저장 파일
  await createSavedHTML('test-merged-fixed.html', 'saved-merged-account');

  console.log('\n' + '='.repeat(60));
  console.log('✅ 모든 저장 파일 생성 완료!');
  console.log('\n📁 생성된 파일:');
  console.log('   - dist/saved-single-account.html (개별 계정 저장본)');
  console.log('   - dist/saved-single-account.json (개별 계정 JSON)');
  console.log('   - dist/saved-merged-account.html (병합 계정 저장본)');
  console.log('   - dist/saved-merged-account.json (병합 계정 JSON)');
}

main().catch(console.error);
