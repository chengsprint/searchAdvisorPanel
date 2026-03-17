#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

const runtime = fs.readFileSync(path.join(__dirname, 'dist/runtime.js'), 'utf8');

const html = `<!DOCTYPE html>
<html lang="ko">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>SearchAdvisor - Demo</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    html, body {
      width: 100%; height: 100%;
      background: #020617;
      font-family: Pretendard, system-ui, sans-serif;
      overflow: hidden;
    }
    #demo-bg {
      position: fixed; inset: 0;
      background: radial-gradient(ellipse at 70% 50%, #0f172a 0%, #020617 70%);
      display: flex; flex-direction: column;
      align-items: center; justify-content: center;
      gap: 16px;
    }
    #demo-title {
      font-size: 28px; font-weight: 900; color: #f8fafc;
      letter-spacing: -0.03em;
    }
    #demo-title span { color: #10b981; }
    #demo-sub { font-size: 14px; color: #64748b; }
    #demo-badge {
      font-size: 11px; background: #10b98120; border: 1px solid #10b98144;
      color: #10b981; padding: 4px 12px; border-radius: 999px; font-weight: 700;
    }
  </style>
</head>
<body>
  <div id="demo-bg">
    <div id="demo-badge">DEMO MODE</div>
    <div id="demo-title"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#10b981" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="vertical-align:middle;margin-right:6px"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>Search<span>Advisor</span></div>
    <div id="demo-sub">데모 데이터로 UI를 미리보기합니다 — 우측 패널을 확인하세요</div>
  </div>
  <script>
    // Force demo mode regardless of protocol
    window.__FORCE_DEMO_MODE__ = true;
  </script>
  <script>
${runtime}
  </script>
</body>
</html>`;

const outPath = path.join(__dirname, 'dist/demo.html');
fs.writeFileSync(outPath, html, 'utf8');
const sizeKB = (html.length / 1024).toFixed(0);
console.log('✅ demo.html 생성 완료');
console.log('   경로: ' + outPath);
console.log('   크기: ' + sizeKB + ' KB');
console.log('\n브라우저에서 열기:');
console.log('   dist/demo.html');
