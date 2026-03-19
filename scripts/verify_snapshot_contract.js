#!/usr/bin/env node
/**
 * Snapshot contract verifier
 *
 * Why this exists:
 * - Saved snapshot HTML is assembled by serializing function bodies into an
 *   offline document. If a helper such as `isFiniteValue` is not embedded, the
 *   saved HTML can throw ReferenceError at runtime even though the live panel
 *   looks fine.
 * - The repository still contains a legacy monolithic snapshot path
 *   (`src/app/main.js`) alongside the modular canonical path
 *   (`src/app/main/12-snapshot.js`). If only one side is updated, stale combo
 *   search logic can silently reappear in saved HTML.
 *
 * This script is intentionally static and fast. It fails the build/check
 * pipeline if the known-bad patterns come back.
 */

const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');

const read = (rel) => fs.readFileSync(path.join(root, rel), 'utf8');

const files = {
  modularSnapshot: read('src/app/main/12-snapshot.js'),
  legacyMain: read('src/app/main.js'),
  runtime: read('dist/runtime.js'),
};

const failures = [];

function assertIncludes(label, source, pattern, reason) {
  if (!source.includes(pattern)) {
    failures.push(`${label}: missing "${pattern}" (${reason})`);
  }
}

function assertNotIncludes(label, source, pattern, reason) {
  if (source.includes(pattern)) {
    failures.push(`${label}: found forbidden "${pattern}" (${reason})`);
  }
}

assertIncludes(
  'src/app/main/12-snapshot.js',
  files.modularSnapshot,
  'const isFiniteValue = ${isFiniteValue.toString()};',
  'snapshot HTML must embed isFiniteValue helper before sparkline/barchart usage',
);

assertIncludes(
  'src/app/main/12-snapshot.js',
  files.modularSnapshot,
  'const S = ${JSON.stringify(S)};',
  'snapshot HTML must embed shared style token map used by renderers',
);

assertIncludes(
  'src/app/main.js',
  files.legacyMain,
  'const isFiniteValue = ${isFiniteValue.toString()};',
  'legacy snapshot path must stay aligned with modular snapshot helper set',
);

assertIncludes(
  'src/app/main.js',
  files.legacyMain,
  'const S = ${JSON.stringify(S)};',
  'legacy snapshot path must embed shared style token map used by renderers',
);

assertNotIncludes(
  'src/app/main/12-snapshot.js',
  files.modularSnapshot,
  'el.style.display = !q || searchTarget.includes(q) ? "flex" : "none";',
  'stale combo filtering can survive in saved HTML and ignore grid/!important layout rules',
);

assertNotIncludes(
  'src/app/main.js',
  files.legacyMain,
  'el.style.display = !q || searchTarget.includes(q) ? "flex" : "none";',
  'legacy snapshot path must not emit stale combo search code',
);

assertIncludes(
  'dist/runtime.js',
  files.runtime,
  'const isFiniteValue = ${isFiniteValue.toString()};',
  'built runtime must embed snapshot helper serialization',
);

assertIncludes(
  'dist/runtime.js',
  files.runtime,
  'const S = ${JSON.stringify(S)};',
  'built runtime must embed shared renderer style map in snapshot bootstrap',
);

assertIncludes(
  'dist/runtime.js',
  files.runtime,
  'el.style.setProperty("display", !q || searchTarget.includes(q) ? "grid" : "none", "important");',
  'built runtime must use grid/!important combo filtering in snapshot HTML',
);

if (failures.length) {
  console.error('Snapshot contract verification failed:\n');
  failures.forEach((line) => console.error(`- ${line}`));
  process.exit(1);
}

console.log('Snapshot contract verification passed.');
