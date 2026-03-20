#!/usr/bin/env node
/**
 * stable.json 갱신용 최소 도구
 * ========================================================================
 *
 * 목적
 * - 운영 반영 시 stable.json 을 손으로 편집하다가 실수하는 일을 줄인다.
 * - 초보자도 "버전 하나 올려서 배포"하는 흐름을 단순하게 유지한다.
 *
 * 사용 예시
 *   node scripts/write_stable_manifest.js v2.0.5
 *   node scripts/write_stable_manifest.js v2.0.5 v2.0.4
 *
 * 규칙
 * - 첫 번째 인자: 운영으로 승격할 버전/태그
 * - 두 번째 인자: fallback 버전/태그 (선택)
 *
 * 이 스크립트는 GitHub 브랜치 전략 자체를 강제하지 않는다.
 * 대신 stable.json 파일을 일관된 형식으로 써 주는 역할만 맡는다.
 * 브랜치 운영(main/release 분리)은 문서 기준으로 수행한다.
 */
const fs = require('fs');
const path = require('path');

const version = process.argv[2];
const fallback = process.argv[3] || null;

if (!version) {
  console.error('Usage: node scripts/write_stable_manifest.js <version> [fallbackVersion]');
  process.exit(1);
}

const manifestPath = path.join(__dirname, '..', 'dist', 'stable.json');

let previous = null;
if (fs.existsSync(manifestPath)) {
  try {
    previous = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
  } catch (_) {
    previous = null;
  }
}

const nextFallback =
  fallback ||
  (previous && typeof previous.version === 'string' && previous.version ? previous.version : version);

const manifest = {
  channel: 'stable',
  version,
  runtime_url: `https://cdn.jsdelivr.net/gh/chengsprint/searchAdvisorPanel@${version}/dist/runtime.js`,
  fallback_url: `https://cdn.jsdelivr.net/gh/chengsprint/searchAdvisorPanel@${nextFallback}/dist/runtime.js`,
  notes:
    '실사용 외부 스크립트는 runtime.js를 직접 보지 말고 loader.js -> stable.json 경로를 통해 운영 승인된 버전만 로드한다.',
};

fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2) + '\n');
console.log(`Updated ${manifestPath}`);
console.log(JSON.stringify(manifest, null, 2));
