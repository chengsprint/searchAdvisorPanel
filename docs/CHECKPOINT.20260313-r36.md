# SearchAdvisor Tmp Stable Checkpoint

Checkpoint version: `20260313-diagnosis-meta-tab-r36`

Date captured: `2026-03-13`

Purpose:

- Preserve the currently stable `_tmp/diagnosis-meta-tab` state so future regressions can be compared against a known-good point.
- Make it easy to identify which runtime behavior was intentionally working well at this point.

Current stable behavior:

- The tmp loader resolves and runs without `Legacy patch point not found` popups.
- The overall dashboard keeps the diagnosis-meta additions while avoiding the broken warm-shortcut path introduced after the earlier stable revisions.
- Site-to-all tab switching no longer allows late site responses to overwrite the all-sites view.
- Diagnosis-meta rendering remains available for the overall cards and site detail flows.
- The all-sites path is not relying on the removed `warmData` or `allWarm` shortcuts.

Why this checkpoint matters:

- Earlier tmp revisions were stable before the overall diagnosis-meta view was added.
- Later revisions added useful diagnosis-meta data but also introduced regressions in loader patching, tab switching, and warm-cache behavior.
- `r36` is the first tmp checkpoint in this line where the loader patch chain, stale-response guard, and diagnosis-meta card rendering are all verified together.

Verified implementation points:

- Runtime pointer: `searchadvisor/_tmp/diagnosis-meta-tab/latest.json`
- Runtime bundle: `searchadvisor/_tmp/diagnosis-meta-tab/runtime.20260313-diagnosis-meta-tab.js`
- Regression tests: `searchadvisor/_tmp/diagnosis-meta-tab/runtime-regression.test.cjs`

Behavior recorded in code:

- A stale site-response guard requires `curMode === "site"` before applying the response.
- Broken identity `Ho(...)` patch anchors for the all-sites loading section were removed.
- Half-finished warm shortcuts were removed so the loader and tab flow return to a simpler, more predictable path.
- The diagnosis-meta index block patch remains present.

Verification completed:

- `node --test searchadvisor/_tmp/diagnosis-meta-tab/runtime-regression.test.cjs`
- `node --check searchadvisor/_tmp/diagnosis-meta-tab/runtime.20260313-diagnosis-meta-tab.js`
- Direct `iS(nS)` runtime patch assembly check completed successfully.

Relevant commits before this checkpoint:

- `abff59f` `fix: restore tmp diagnosis meta stability`
- `63214ba` `fix: remove broken tmp loader anchor`

How to use this checkpoint later:

- If a future tmp change breaks loader startup, compare `Ho(...)` anchors against this checkpoint first.
- If overall cards start showing zeros or tab switching feels like a refetch loop, compare cache and mode-switch behavior against this checkpoint.
- If necessary, return to the tag created for this checkpoint and retest from that exact state.
