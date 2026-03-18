#!/usr/bin/env node

const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 8080;
const DIST_DIR = path.join(__dirname, '../dist');

const server = http.createServer((req, res) => {
  let filePath = path.join(DIST_DIR, req.url === '/' ? 'check.html' : req.url);

  // 파일 확장자 없으면 .html 추가
  if (!path.extname(filePath)) {
    filePath += '.html';
  }

  fs.readFile(filePath, (err, data) => {
    if (err) {
      res.writeHead(404);
      res.end('Not Found');
      return;
    }

    const ext = path.extname(filePath);
    const contentType = {
      '.html': 'text/html',
      '.js': 'application/javascript',
      '.css': 'text/css'
    }[ext] || 'text/plain';

    res.writeHead(200, { 'Content-Type': contentType });
    res.end(data);
  });
});

server.listen(PORT, () => {
  console.log('='.repeat(60));
  console.log('V2 마이그레이션 브라우저 테스트 서버');
  console.log('='.repeat(60));
  console.log(`\n서버가 시작되었습니다: http://localhost:${PORT}`);
  console.log('\n테스트 페이지:');
  console.log(`  1. 검증 대시보드: http://localhost:${PORT}/check.html`);
  console.log(`  2. 단일 계정 테스트: http://localhost:${PORT}/test-single.html`);
  console.log(`  3. 복합 계정 테스트: http://localhost:${PORT}/test-merged.html`);
  console.log(`  4. 원본 Demo: http://localhost:${PORT}/demo.html`);
  console.log('\n브라우저에서 위 URL을 열어 테스트하세요.');
  console.log('\nCtrl+C 로 서버를 중지할 수 있습니다.');
  console.log('='.repeat(60));
});