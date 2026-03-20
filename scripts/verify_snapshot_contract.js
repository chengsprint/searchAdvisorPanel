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
 *   (`src/app/legacy-main.js`) alongside the modular canonical path
 *   (`src/app/main/12-snapshot.js`). If only one side is updated, stale combo
 *   search logic can silently reappear in saved HTML.
 *
 * This script is intentionally static and fast. It fails the build/check
 * pipeline if the known-bad patterns come back.
 *
 * What this script is NOT:
 * - not an AST-aware semantic verifier
 * - not a runtime browser workflow test
 * - not permission to edit dist/runtime.js directly
 *
 * Read it as a cheap guardrail for "must-have serialized bindings / must-not-
 * have stale strings", then pair it with snapshot_workflow_audit.js when the
 * reopened saved HTML behavior itself matters.
 *
 * See also:
 * - src/app/main/SNAPSHOT_EXPORT_CONTRACT.md
 * - docs/SNAPSHOT_CONTRACT_GUARDRAILS.20260320.md
 */

const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');

const read = (rel) => fs.readFileSync(path.join(root, rel), 'utf8');

const files = {
  modularSnapshot: read('src/app/main/12-snapshot.js'),
  uiState: read('src/app/main/07-ui-state.js'),
  legacyMain: read('src/app/legacy-main.js'),
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

// Section 1. Active canonical source must serialize helper/style bindings
// explicitly for the reopened saved HTML runtime.
assertIncludes(
  'active source contract: src/app/main/12-snapshot.js',
  files.modularSnapshot,
  'const isFiniteValue = ${isFiniteValue.toString()};',
  'snapshot HTML must embed isFiniteValue helper before sparkline/barchart usage',
);

assertIncludes(
  'active source contract: src/app/main/12-snapshot.js',
  files.modularSnapshot,
  'const S = ${JSON.stringify(S)};',
  'snapshot HTML must embed shared style token map used by renderers',
);

[
  ['const C = ${JSON.stringify(C)};', 'snapshot HTML must embed shared color token map used by renderers'],
  ['const T = ${JSON.stringify(T)};', 'snapshot HTML must embed shared label/token map used by renderers'],
  ['const TABS = ${JSON.stringify(TABS)};', 'snapshot HTML must embed tab registry used by saved HTML shell'],
].forEach(([pattern, reason]) => {
  assertIncludes(
    'active source contract: src/app/main/12-snapshot.js',
    files.modularSnapshot,
    pattern,
    reason,
  );
});

assertIncludes(
  'shell state contract: src/app/main/07-ui-state.js',
  files.uiState,
  'mergedMeta: Object.prototype.hasOwnProperty.call(normalizedPayload, "mergedMeta")',
  'buildSnapshotShellState must preserve mergedMeta for injected shell state parity',
);

assertIncludes(
  'all-sites period state contract: src/app/main/07-ui-state.js',
  files.uiState,
  'allSitesPeriodDays: normalizeAllSitesPeriodDays(allSitesPeriodDays)',
  'live shell state must preserve all-sites period selection for snapshot/export parity',
);

assertIncludes(
  'snapshot API compat contract: src/app/main/12-snapshot.js',
  files.modularSnapshot,
  'mergedMeta: Object.prototype.hasOwnProperty.call(shellStateSource, "mergedMeta") ? shellStateSource.mergedMeta : null,',
  'compat snapshot API must preserve mergedMeta when rebuilding state from injected shell JSON',
);

assertIncludes(
  'snapshot API compat contract: src/app/main/12-snapshot.js',
  files.modularSnapshot,
  'mergedMeta: Object.prototype.hasOwnProperty.call(snapshotState, "mergedMeta") ? snapshotState.mergedMeta : null,',
  'compat snapshot API cloneState must keep mergedMeta instead of silently dropping it',
);

assertIncludes(
  'runtime version contract: src/app/main/12-snapshot.js',
  files.modularSnapshot,
  'EXPORT_PAYLOAD.generatorVersion ||',
  'reopened saved HTML should preserve runtimeVersion via embedded payload when window runtime globals are absent',
);

[
  ['const EXPORT_PAYLOAD_RAW = ${exportPayloadJson};', 'active snapshot path must keep raw export payload before offline normalization'],
  ['const normalizeSnapshotPayloadForOfflineShell = ${normalizeSnapshotPayloadForOfflineShell.toString()};', 'active snapshot path must serialize offline normalization seam into saved HTML'],
  ['const EXPORT_PAYLOAD = normalizeSnapshotPayloadForOfflineShell(EXPORT_PAYLOAD_RAW);', 'active snapshot path must normalize saved HTML payload through the shared offline seam'],
  ['${getRuntimeAllSitesPeriodDays.toString()}', 'saved HTML must serialize period state getter for all-sites parity'],
  ['${setRuntimeAllSitesPeriodDays.toString()}', 'saved HTML must serialize period state setter for all-sites parity'],
  ['${deriveAllSitesPeriodRows.toString()}', 'saved HTML must serialize derived row calculator for period toggle'],
  ['${buildAllSitesDisplayWrap.toString()}', 'saved HTML must reuse the same all-sites render path for live/snapshot period parity'],
  ['setAllSitesPeriodDays: function (days) {', 'saved HTML snapshot API must expose period mutation seam'],
  ['.sadv-snapshot-combo-drop{', 'active snapshot path must include fixed top-layer combo CSS contract'],
  ['snapshotComboDrop.classList.add("sadv-snapshot-combo-drop");', 'active snapshot path must mark the detached combo dropdown with the snapshot top-layer class'],
  ['snapshotComboDrop.style.setProperty("position", "fixed", "important");', 'active snapshot path must force fixed combo positioning in saved HTML'],
].forEach(([pattern, reason]) => {
  assertIncludes(
    'active source contract: src/app/main/12-snapshot.js',
    files.modularSnapshot,
    pattern,
    reason,
  );
});

// Section 2. Legacy mirror path is still present in-repo, so we keep it
// aligned enough to avoid stale snapshot behavior reappearing accidentally.
assertIncludes(
  'legacy mirror contract: src/app/legacy-main.js',
  files.legacyMain,
  'const isFiniteValue = ${isFiniteValue.toString()};',
  'legacy snapshot path must stay aligned with modular snapshot helper set',
);

assertIncludes(
  'legacy mirror contract: src/app/legacy-main.js',
  files.legacyMain,
  'const S = ${JSON.stringify(S)};',
  'legacy snapshot path must embed shared style token map used by renderers',
);

[
  ['const C = ${JSON.stringify(C)};', 'legacy snapshot path must embed shared color token map used by renderers'],
  ['const T = ${JSON.stringify(T)};', 'legacy snapshot path must embed shared label/token map used by renderers'],
  ['const TABS = ${JSON.stringify(TABS)};', 'legacy snapshot path must embed tab registry used by saved HTML shell'],
].forEach(([pattern, reason]) => {
  assertIncludes(
    'legacy mirror contract: src/app/legacy-main.js',
    files.legacyMain,
    pattern,
    reason,
  );
});

assertIncludes(
  'legacy shell contract: src/app/legacy-main.js',
  files.legacyMain,
  'mergedMeta: Object.prototype.hasOwnProperty.call(normalizedPayload, "mergedMeta")',
  'legacy shell state mirror must preserve mergedMeta for parity with active snapshot state',
);

assertIncludes(
  'legacy compat contract: src/app/legacy-main.js',
  files.legacyMain,
  'mergedMeta: Object.prototype.hasOwnProperty.call(shellStateSource, "mergedMeta") ? shellStateSource.mergedMeta : null,',
  'legacy compat snapshot API must preserve mergedMeta when rebuilding state from shell JSON',
);

assertIncludes(
  'legacy compat contract: src/app/legacy-main.js',
  files.legacyMain,
  'mergedMeta: Object.prototype.hasOwnProperty.call(snapshotState, "mergedMeta") ? snapshotState.mergedMeta : null,',
  'legacy compat snapshot API cloneState must keep mergedMeta instead of silently dropping it',
);

assertIncludes(
  'legacy runtime version contract: src/app/legacy-main.js',
  files.legacyMain,
  'EXPORT_PAYLOAD.generatorVersion ||',
  'legacy reopened saved HTML should preserve runtimeVersion via embedded payload when window runtime globals are absent',
);

[
  ['const EXPORT_PAYLOAD_RAW = ${exportPayloadJson};', 'legacy snapshot path must keep raw export payload before offline normalization'],
  ['const normalizeSnapshotPayloadForOfflineShell = ${normalizeSnapshotPayloadForOfflineShell.toString()};', 'legacy snapshot path must serialize the offline normalization seam'],
  ['const EXPORT_PAYLOAD = normalizeSnapshotPayloadForOfflineShell(EXPORT_PAYLOAD_RAW);', 'legacy snapshot path must normalize saved HTML payload through the shared offline seam'],
  ['.sadv-snapshot-combo-drop{', 'legacy snapshot path must include fixed top-layer combo CSS contract'],
  ['snapshotComboDrop.classList.add("sadv-snapshot-combo-drop");', 'legacy snapshot path must mark the detached combo dropdown with the snapshot top-layer class'],
  ['snapshotComboDrop.style.setProperty("position", "fixed", "important");', 'legacy snapshot path must force fixed combo positioning in saved HTML'],
].forEach(([pattern, reason]) => {
  assertIncludes(
    'legacy mirror contract: src/app/legacy-main.js',
    files.legacyMain,
    pattern,
    reason,
  );
});

// Section 3. Known-bad stale combo filter string must stay gone from both
// active and legacy sources.
assertNotIncludes(
  'active source contract: src/app/main/12-snapshot.js',
  files.modularSnapshot,
  'el.style.display = !q || searchTarget.includes(q) ? "flex" : "none";',
  'stale combo filtering can survive in saved HTML and ignore grid/!important layout rules',
);

assertNotIncludes(
  'legacy mirror contract: src/app/legacy-main.js',
  files.legacyMain,
  'el.style.display = !q || searchTarget.includes(q) ? "flex" : "none";',
  'legacy snapshot path must not emit stale combo search code',
);

// Section 4. Built output is checked only as a generated mirror of source
// intent. If this block fails, fix src/app/main/* and rebuild; do not patch
// dist/runtime.js directly.
assertIncludes(
  'built output contract: dist/runtime.js',
  files.runtime,
  'const isFiniteValue = ${isFiniteValue.toString()};',
  'built runtime must embed snapshot helper serialization',
);

assertIncludes(
  'built output contract: dist/runtime.js',
  files.runtime,
  'const S = ${JSON.stringify(S)};',
  'built runtime must embed shared renderer style map in snapshot bootstrap',
);

[
  ['const C = ${JSON.stringify(C)};', 'built runtime must embed shared color token map in snapshot bootstrap'],
  ['const T = ${JSON.stringify(T)};', 'built runtime must embed shared label/token map in snapshot bootstrap'],
  ['const TABS = ${JSON.stringify(TABS)};', 'built runtime must embed tab registry in snapshot bootstrap'],
].forEach(([pattern, reason]) => {
  assertIncludes(
    'built output contract: dist/runtime.js',
    files.runtime,
    pattern,
    reason,
  );
});

assertIncludes(
  'built output contract: dist/runtime.js',
  files.runtime,
  'el.style.setProperty("display", !q || searchTarget.includes(q) ? "grid" : "none", "important");',
  'built runtime must use grid/!important combo filtering in snapshot HTML',
);

assertIncludes(
  'built shell contract: dist/runtime.js',
  files.runtime,
  'mergedMeta: Object.prototype.hasOwnProperty.call(normalizedPayload, "mergedMeta")',
  'built runtime must preserve mergedMeta in buildSnapshotShellState',
);

assertIncludes(
  'built compat contract: dist/runtime.js',
  files.runtime,
  'mergedMeta: Object.prototype.hasOwnProperty.call(shellStateSource, "mergedMeta") ? shellStateSource.mergedMeta : null,',
  'built runtime compat snapshot API must preserve mergedMeta from injected shell JSON',
);

assertIncludes(
  'built compat contract: dist/runtime.js',
  files.runtime,
  'mergedMeta: Object.prototype.hasOwnProperty.call(snapshotState, "mergedMeta") ? snapshotState.mergedMeta : null,',
  'built runtime compat snapshot API cloneState must keep mergedMeta intact',
);

assertIncludes(
  'built runtime version contract: dist/runtime.js',
  files.runtime,
  'EXPORT_PAYLOAD.generatorVersion ||',
  'built runtime should preserve runtimeVersion via embedded payload when reopened saved HTML lacks window runtime globals',
);

[
  ['const EXPORT_PAYLOAD_RAW = ${exportPayloadJson};', 'built runtime must keep raw export payload before offline normalization'],
  ['const normalizeSnapshotPayloadForOfflineShell = ${normalizeSnapshotPayloadForOfflineShell.toString()};', 'built runtime must serialize the offline normalization seam into saved HTML'],
  ['const EXPORT_PAYLOAD = normalizeSnapshotPayloadForOfflineShell(EXPORT_PAYLOAD_RAW);', 'built runtime must normalize saved HTML payload through the shared offline seam'],
  ['.sadv-snapshot-combo-drop{', 'built runtime must include fixed top-layer combo CSS contract'],
  ['snapshotComboDrop.classList.add("sadv-snapshot-combo-drop");', 'built runtime must mark the detached combo dropdown with the snapshot top-layer class'],
  ['snapshotComboDrop.style.setProperty("position", "fixed", "important");', 'built runtime must force fixed combo positioning in saved HTML'],
].forEach(([pattern, reason]) => {
  assertIncludes(
    'built output contract: dist/runtime.js',
    files.runtime,
    pattern,
    reason,
  );
});

if (failures.length) {
  console.error('Snapshot contract verification failed:\n');
  failures.forEach((line) => console.error(`- ${line}`));
  process.exit(1);
}

// Keep success output intentionally short so npm run check stays readable.
console.log('Snapshot contract verification passed.');
