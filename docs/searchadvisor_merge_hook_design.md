# SearchAdvisor Merge Hook Design

Date: `2026-03-14`

Status: active merge architecture note aligned with the current payload-contract direction

## Purpose

This document defines what the merger should do and what it should stop doing.

It exists because merge behavior has historically become fragile when:

- merged HTML depended on the exact saved HTML DOM shape
- merger code tried to patch UI strings directly
- save-path runtime and merged runtime drifted apart

The target direction is:

- merger owns data selection and merged payload assembly
- runtime owns rendering
- merged HTML remains a normal payload-driven snapshot with extra provenance metadata

## Relationship To Other Documents

Read these with this file:

- `AI-CONTROL-CENTER.20260314.md`
- `ARCHITECTURE.20260314-html-snapshot-contract.md`
- `ARCHITECTURE.20260314-cache-bootstrap.md`
- `WORKING-GUIDE.20260314.md`

If this file conflicts with the control center or the two architecture files, those documents win.

## Merger Responsibilities

The merger should own the following:

1. discover candidate source HTML files
2. parse filename-level metadata such as account id and timestamp
3. choose one source file per account using deterministic rules
4. extract payloads from source HTML
5. normalize payload shapes when older variants differ
6. merge site data deterministically
7. populate merged metadata
8. write merged output

The merger may also inject minimal compatibility hooks when older saved HTML variants still require them.

## Merger Non-Responsibilities

The merger should not become the long-term owner of:

- visible label rendering logic
- site selector UI logic
- per-tab rendering logic
- ad-hoc DOM surgery for every runtime revision
- a second independent HTML application

If the merged output needs different labels or banners, the runtime should render those from `siteMeta` and `mergedMeta`.

## Source File Selection Rules

### File naming assumptions

Expected input file pattern:

`searchadvisor-{naver_id}-{YYYYMMDD}-{HHMMSS}.html`

Expected merged output pattern:

`searchadvisor-MERGED-{YYYYMMDD}.html`

### Per-account selection

For each account id:

- if one or more files exist for the target day, pick the latest file from that day
- otherwise, pick the latest available file overall for that account as fallback

This preserves accounts that have no same-day snapshot while still preferring fresh data.

### Duplicate site resolution

If the same site URL appears in multiple selected account payloads:

- prefer the newest selected source snapshot
- if timestamps tie, use a deterministic tie-breaker such as account id ordering

The merger must not resolve duplicates nondeterministically.

## Merged Payload Contract

The merged output should remain payload-first.

At minimum, the merged payload should preserve or provide:

- `summaryRows`
- `dataBySite`
- `siteMeta`
- `mergedMeta`
- any contract markers required by the snapshot shell

### `siteMeta`

`siteMeta` should carry site-level provenance and display assistance.

Recommended fields:

```json
{
  "https://car.infofafa.com": {
    "naverId": "hovertasty",
    "shortName": "car.infofafa.com",
    "displayLabel": "car.infofafa.com [hovertasty]"
  }
}
```

### `mergedMeta`

`mergedMeta` should carry report-level provenance.

Recommended fields:

```json
{
  "isMerged": true,
  "targetDate": "20260314",
  "naverIds": ["hovertasty", "beurself7777"],
  "fileNames": [
    "searchadvisor-hovertasty-20260314-010000.html",
    "searchadvisor-beurself7777-20260313-235959.html"
  ],
  "selectedFilesById": {
    "hovertasty": "searchadvisor-hovertasty-20260314-010000.html",
    "beurself7777": "searchadvisor-beurself7777-20260313-235959.html"
  },
  "selectedDatesById": {
    "hovertasty": "20260314",
    "beurself7777": "20260313"
  }
}
```

### `targetDate`

`targetDate` means:

- the date this merged report run is representing

It should not mean:

- the date of the first selected source file

If a fallback file from an older day is used for one account, `targetDate` still refers to the merged report run day.

## Runtime Hook Expectations

The runtime should be able to answer questions like:

- is this a merged report?
- what label should this site display?
- which source files were used?
- which accounts are represented?

That means the runtime should consume:

- `siteMeta`
- `mergedMeta`

through stable contract hooks rather than merger-owned text replacement.

Examples of runtime-level helper concepts:

- `isMergedReport()`
- `getSiteDisplayLabel(site)`
- `getMergedMeta()`

The merger should prepare the data those helpers need, but not own the rendering decisions.

## Compatibility Strategy

### Preferred path

The preferred merged-output strategy is:

1. extract payloads from source HTML
2. assemble merged payload
3. hand off merged payload to a compatible snapshot shell
4. let the shell render from payload

### Fallback path

If older source or shell variants still require compatibility work:

- minimal patch injection is acceptable
- payload-level handoff still has priority
- UI-string patching should remain a shrinking fallback, not the target design

## Why Older String-Patching Broke Easily

Older merge flows became fragile because they depended on:

- exact function names
- exact UI labels
- exact container structure
- exact save-time HTML composition

Small changes such as:

- a label rename
- a selector structure change
- a tab count change
- a DOM nesting change

could break merged output even when the payload meaning had not changed.

That is exactly what this payload-contract direction is designed to reduce.

## Current Direction For Saved And Merged HTML

Merged HTML should not be special in architecture terms.

It should behave like:

- the same snapshot shell
- the same renderer contract
- a different payload instance with merged provenance

This keeps:

- single-account saved HTML
- merged HTML
- future CSV export mapping

aligned around one normalized payload model.

## Future-Proofing For Additional Fields

If new site-level fields are added later, such as diagnosis-specific detail fields:

- they should be added to the payload contract
- the merger should carry them through normalization and merge assembly
- the runtime should render them conditionally without crashing if some sites do not have them

The key rule is:

- field absence must not crash rendering
- new fields should extend the payload, not redefine the whole contract

## Verification Expectations

Any change to merger logic should verify at minimum:

1. source HTML payload extraction still works
2. one-account saved HTML still reopens
3. merged HTML still opens and indicates merged provenance
4. duplicate site resolution remains deterministic
5. fallback-to-older-file logic still works when one account has no same-day snapshot
6. older compatible saved variants still merge if fallback support is expected

## Practical Summary

The merger should behave like a compatibility-aware data adapter:

- choose files
- extract payloads
- normalize and merge data
- add provenance metadata
- hand the result to a payload-driven snapshot shell

It should not keep growing into a second UI renderer.
