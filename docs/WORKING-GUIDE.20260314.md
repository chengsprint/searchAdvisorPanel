# SearchAdvisor Diagnosis Meta Tab Working Guide

Date: `2026-03-14`

Status: active working guide for `_tmp/diagnosis-meta-tab`

Current note:

- read `searchadvisor/_tmp/diagnosis-meta-tab/docs/AI-CONTROL-CENTER.20260314.md` first before using this file as implementation guidance
- if this file conflicts with the newer architecture docs, prefer the control center and architecture docs
- if a newly exported saved HTML is version-correct but still looks visually different from the live panel, treat that as saved-shell architectural drift first
- do not diagnose that situation as missing `lucide`, `shadcn`, or some other third-party UI asset unless there is direct evidence

This document is an active working reference for the temporary diagnosis-meta work area.

It exists to prevent three recurring failures:

1. `_tmp` experimental work getting mentally mixed with production runtime work
2. merge-aware payload / saved HTML work getting mixed with live bookmarklet runtime work
3. repeated regressions caused by editing the same monolithic runtime for different goals at the same time

This file should be read before any further changes inside:

- `searchadvisor/_tmp/diagnosis-meta-tab/`

## 1A. Core User Intent

This section records the actual intended use of this workspace in plain terms.

It should be treated as the highest-priority product intent for future work.

### Primary purpose

The first purpose of this script system is:

- to run the bookmarklet directly in Chrome DevTools on the currently logged-in Naver account
- to inspect that account's indexing state in detail
- to support deliberate manual analysis, not just passive viewing

In other words:

- the live bookmarklet path is the primary analysis interface
- the browser session and currently logged-in account are part of the intended workflow
- the tool is expected to help the operator inspect index-related conditions deeply and manually

### Secondary purpose

The second purpose is:

- to save each account's data into separate HTML files
- to review those files individually later
- and then to run a Python merge script that combines the latest valid data from multiple accounts into one merged HTML report
- and later to support saving or exporting equivalent data as CSV files for spreadsheet-style review

In other words:

- one account can produce one saved HTML snapshot
- many accounts can produce many saved HTML snapshots
- later, those multiple snapshots should be merged into one view without losing compatibility
- and future export modes should not be limited to HTML only

### Why compatibility is critical

The saved HTML files may come from:

- different accounts
- different save times
- different intermediate runtime revisions
- slightly different HTML layouts or framework structures

If these saved HTML files are inconsistent, old, or structurally incompatible:

- the merge script may fail
- the merge result may become wrong
- the merged output may open but show incomplete or misleading data
- the data contract may silently drift and become unsafe

Therefore the system must be designed so that:

- HTML structure differences do not become the main merge dependency
- payload compatibility is more important than incidental UI layout similarity
- the latest HTML shell can consume raw payload values from older or different saved files as long as the payload contract is still valid
- future CSV export can be produced from the same stable payload contract rather than from a separate fragile scraping path

### The exact design direction requested

The requested direction is this:

1. When HTML is downloaded, or when the original script is loaded, the screen composition and framework behavior should be normalized around a payload-based fixed contract.
2. The site receives raw data and renders HTML from it, but the visible design may continue to change as features are added.
3. Even if the design changes, merging should be based on extracting the raw data values from each HTML file and adapting them to the latest HTML structure.
4. The script system should be modified with future extensibility in mind, not as a one-off patch.

### Practical interpretation

This means the architecture should aim for the following:

- the live runtime is free to evolve visually
- saved HTML files should preserve stable payload data
- the merge script should operate on payload contracts first
- the merged output should be rendered by the latest compatible shell whenever possible
- future CSV output should be derived from the same normalized payload model
- design drift should be survivable
- payload drift must be controlled explicitly

Additional design-stage clarification from `2026-03-14`:

- a saved HTML file can carry the correct runtime version and the correct payload markers and still visually diverge from the live panel
- when that happens, the root cause should be treated as saved-html-shell divergence, not external asset failure
- the correct long-term fix is snapshot control-shell/state convergence, not more permanent save-shell-only styling patches

### Non-negotiable takeaway

The system is not just:

- "save some HTML"
- or "merge some HTML"

It is a coordinated workflow with these steps:

1. live manual analysis in Chrome for the current logged-in account
2. per-account HTML snapshot saving
3. later multi-file merge across accounts
4. viewing the merged result through a stable, payload-compatible presentation layer
5. later optional CSV export from the same contract for tabular analysis

Any future change that helps one step but breaks another step is not an acceptable improvement.

## 1. Scope

This folder is for temporary development and verification of the diagnosis-meta feature set.

It is not the production deployment pointer.

Current path split:

- Production root:
  - `searchadvisor/latest.json`
  - `searchadvisor/runtime.20260312-48.js`
- Temporary diagnosis-meta lab:
  - `searchadvisor/_tmp/diagnosis-meta-tab/latest.json`
  - `searchadvisor/_tmp/diagnosis-meta-tab/loader.js`
  - `searchadvisor/_tmp/diagnosis-meta-tab/runtime.20260313-diagnosis-meta-tab.js`
  - `searchadvisor/_tmp/diagnosis-meta-tab/bookmarklet.txt`

Current pointers now:

- Production: `20260312-48`
- Tmp diagnosis tab: `20260314-diagnosis-meta-tab-r80`

Important principle:

- A change in `_tmp/diagnosis-meta-tab` must not require or assume a production-root runtime change.
- A change in production root must be treated as a separate task and separate review.

## 2. Why This Guide Exists

The work in this folder gradually expanded from a focused diagnosis-meta tab experiment into a mixed work area containing:

- live bookmarklet runtime work
- saved HTML export work
- merge-aware payload work
- snapshot shell bootstrap work
- cache and retry policy work
- loader patch hardening
- UI regression fixes

As those concerns accumulated in one runtime file, the following confusion appeared:

- it became hard to tell whether a visible bug belonged to the live runtime or the saved HTML path
- it became hard to tell whether a regression came from diagnosis-meta rendering, loader patching, or merge/export work
- `_tmp` changes and production-root changes started to feel conceptually mixed even when the version pointers were still separate

That is the main problem to avoid from this point forward.

## 3. Current Understanding Of The Work Streams

There are two different work streams in this folder history.

### A. Live runtime stream

Purpose:

- run from bookmarklet
- fetch live data
- show overall dashboard and site detail tabs
- support diagnosis-meta cards in live UI

Typical concerns:

- stale response guard
- card rendering
- color rotation
- index sparkline rendering
- cache scoping
- request pacing
- loader patch stability

### B. Merge / saved HTML stream

Purpose:

- export HTML snapshots
- preserve richer payload in exported HTML
- support merged reports across accounts or files
- let saved HTML reopen with context and metadata

Typical concerns:

- `EXPORT_PAYLOAD`
- `siteMeta`
- `mergedMeta`
- snapshot shell bootstrap
- saved HTML direct open
- fallback site switching
- file naming
- merge source tracking

Critical rule:

- These two streams are related, but they are not the same problem.
- They should not be evolved in the same risky edit unless there is a clear reason and explicit verification for both paths.

### C. Merge script stream

Primary file:

- `searchadvisor/_tmp/diagnosis-meta-tab/searchadvisor_merge_minimal.py`

Purpose:

- scan many `searchadvisor-*.html` files
- select the right source file per account
- extract `EXPORT_PAYLOAD`
- merge payloads into one coherent merged payload
- choose one latest source HTML as the rendering template
- write `searchadvisor-MERGED-YYYYMMDD.html`
- preserve enough metadata so reopened merged HTML can explain where its data came from
- stay extensible enough to support future CSV output from the same data model

Important clarification:

- the merge script is allowed to evolve
- it is not a frozen helper
- but it must evolve as a compatibility-focused merger, not as a second renderer implementation

That means:

- payload extraction logic may change
- source-file selection rules may change
- merge conflict resolution rules may change
- cleanup and retention policy may change
- helper script injection may change
- output adapters may expand beyond HTML into CSV or other tabular forms

But it should avoid:

- re-implementing large parts of the live UI renderer
- depending on too many fragile UI text replacements
- becoming tightly coupled to one exact HTML layout beyond the minimum required payload handoff
- making future CSV output depend on brittle HTML scraping when payload data already exists

## 4. Key Checkpoints And Milestones

### Stable baseline

- `r36`
- tag: `diagnosis-meta-tab-r36-stable`
- file: `CHECKPOINT.20260313-r36.md`

Why it matters:

- loader startup was stable
- stale site-response overwrite bug was guarded
- half-finished warm shortcuts were removed
- diagnosis-meta card rendering existed without the later pile-up of merge/export changes

### Merge-aware payload start

- `r40`
- commit: `e7a0493`
- message: `feat: add tmp merge-aware export hooks`

Why it matters:

- this is the practical start of merge-aware payload structure work
- `EXPORT_PAYLOAD`, `siteMeta`, `mergedMeta`, shell bootstrap helpers begin here

### Merge-aware first cluster

- `r40` to `r43`

Why it matters:

- this is the first meaningful block of merge-aware payload and saved HTML stabilization work
- if we want to re-enter that line carefully, this range is the cleanest conceptual starting point

### Merge script baseline behavior

At the time of writing, `searchadvisor_merge_minimal.py` already assumes this flow:

- input file pattern:
  - `searchadvisor-{naver_id}-{YYYYMMDD}-{HHMMSS}.html`
- merged output file pattern:
  - `searchadvisor-MERGED-{YYYYMMDD}.html`
- payload anchor:
  - `const EXPORT_PAYLOAD = `
- merged metadata fields:
  - `siteMeta`
  - `mergedMeta.targetDate`
  - `mergedMeta.selectedFilesById`
  - `mergedMeta.selectedDatesById`

This means the script is already part of the contract surface, not just a throwaway utility.

Future extension expectation:

- the same merged payload contract should later support CSV output
- CSV support should be added as another output mode, not as a disconnected second data model

### Loader hardening cluster

- `r44` to `r57`

Why it matters:

- this period is dominated by patch-anchor hardening, loader resilience, cache-aware export, retry policy, saved HTML switching, and related defensive work
- many fixes were valid, but the runtime became more fragile to reason about because too many concerns lived together

### Current head

- `r67`
- commit: `6537271`
- message: `fix: restore saved snapshot ui state helpers`

Why it matters:

- this patch fixed a real saved-HTML interaction regression where snapshot-local UI state helpers were missing
- however, `r67` should not be treated as the final saved-HTML architecture baseline
- it is a safer transitional state, not the end of canonical renderer convergence

## 5. What Actually Went Wrong

This section is the most important part of the document.

The main failure was not just "a bug happened".

The failure was architectural drift inside a temporary work area.

### 5.1 Concern mixing

The following concerns ended up sharing the same runtime editing surface:

- live UI behavior
- saved HTML bootstrap behavior
- merge-aware payload design
- export retry and cooldown policy
- cache key strategy
- anti-stale request guards
- loader patch fallback logic
- direct DOM patch cleanup for legacy HTML

That made local fixes interfere with each other.

### 5.2 Verification gap between executed paths

For a while, the transformed embedded runtime path was tested better than the actual top-level visible `renderAllSites()` path.

Result:

- code markers existed
- tests passed
- remote runtime contained the patch text
- but the browser still showed old cards because the actual visible body path was different

Lesson:

- every important user-visible behavior must be verified on the exact runtime path that paints the visible DOM

### 5.3 Merge-aware payload work changed the surface area

Once `siteMeta`, `mergedMeta`, saved HTML shell state, and export hooks entered the runtime, this was no longer "just a diagnosis tab experiment".

That was the moment where the work required explicit boundaries and did not get them.

### 5.4 Production-root contamination risk

Most diagnosis-meta tmp work only touched:

- `_tmp/diagnosis-meta-tab/latest.json`
- `_tmp/diagnosis-meta-tab/runtime.20260313-diagnosis-meta-tab.js`
- `_tmp/diagnosis-meta-tab/runtime-regression.test.cjs`

But there was at least one meaningful production-root-side merge-aware change in repository history:

- `bcf7cca` `feat: add merge-aware export hooks`
- file touched: `searchadvisor/runtime.20260312-48.js`

This is exactly the kind of history that creates mental mixing, even when the current version pointers are still separate.

Lesson:

- tmp experimentation and production-root runtime work must never be blended into one mental bucket

### 5.5 The merge script became part of the architecture

Once merged HTML generation started to depend on:

- stable `EXPORT_PAYLOAD` extraction
- injected helper scripts
- `siteMeta` and `mergedMeta`
- display-label patching
- reopenable shell state

the Python merger stopped being "just a file combiner".

It became one side of a 4-party compatibility system:

1. a single original HTML file
2. many original HTML files collected over time
3. the merged HTML output
4. the merge script that transforms 1 and 2 into 3

This is why merger changes must now be treated as product-surface changes, not mere utility edits.

## 6. Known Repeated Problem Areas

The same categories of issues kept returning. They must be treated as explicit risk areas, not incidental bugs.

### 6.1 HTML download related issues

Repeated themes:

- saved HTML missing state needed for reopen
- downloaded HTML opening with incomplete shell state
- site switching not working after reopen
- direct save path not forcing the right refresh path
- snapshot metadata not surviving export correctly
- file naming consistency problems

What to remember:

- HTML save is a separate execution target
- if saved HTML is touched, live runtime and reopened HTML must both be re-verified
- merger-generated HTML and browser-saved HTML are different producers and both must remain consumable
- future CSV export should stay semantically aligned with HTML export

### 6.2 Efficiency related issues

Repeated themes:

- too many repeated requests for diagnosis/meta
- same site being reloaded unnecessarily
- export path over-fetching fields that already existed
- no clear cache reuse rules between live view and export view

What to remember:

- request minimization is not optional
- diagnosis/meta should reuse cached results when safe
- retries should target missing or failed fields, not re-download everything
- the merge script should merge existing payloads first and only rely on live refetch when absolutely necessary
- CSV export should also reuse normalized payload data instead of triggering a separate heavy collection path

### 6.2A Cache And HTML Download Operating Policy

This section now records the current unified policy from `2026-03-14`.

It replaces the older split model where:

- live browsing was selective
- visible HTML save was `cache-first`
- direct HTML save was `refresh`

That older model is no longer the preferred design direction in this lab.

#### Current unified policy

The following triggers should all use one shared full-refresh pipeline:

1. cache expiry detected at startup or reopen
2. manual full refresh button click
3. regular HTML save button click
4. direct HTML save flow

The target reason is operator trust and output consistency:

- the summary view should reflect the refreshed baseline
- the per-site detail tabs should reflect the refreshed baseline
- the saved HTML should reflect the refreshed baseline
- the direct-saved HTML should reflect the refreshed baseline

#### Full-refresh pipeline

Every full refresh should run in this order:

1. refresh site list
2. collect `expose` for all sites
3. collect `diagnosisMeta` for all sites
4. collect `crawl` for all sites
5. collect `backlink` for all sites
6. commit results to memory cache and `localStorage`
7. re-render the active UI from the new state
8. if requested, save HTML from that refreshed state

This means that HTML save quality should not depend on whether the operator used:

- the visible button path
- the direct console path

Only the trigger surface is different. The data baseline should be the same.

#### Live browsing policy

Live browsing should still remain lightweight while cache is valid.

That means:

- if cache is valid, render immediately from cached state
- reopening the panel should restore the last `mode/site/tab`
- selecting a site should not silently trigger a whole-account recollection unless the policy says the cache is expired

However, once cache is expired, the system should no longer stay in a selective partial-refresh model.

It should:

- explain why a full refresh is starting
- run the same full-refresh pipeline used by manual refresh and HTML save

#### Cache expiry policy

If cache is expired:

- do not silently keep mixing old per-field data with a new operator session
- do not rely on hidden partial fetches that the operator cannot reason about
- do start a visible full refresh with a clear reason

The operator-facing explanation should make clear that:

- the cache expired
- the system is recollecting all sites
- the summary, detail views, and saved HTML are being aligned to one fresh baseline

#### Progress UI policy

If the system is allowed to recollect all sites, it must expose detailed progress.

At minimum the UI should show:

- trigger reason
- current activity or phase
- current site when a site-specific step is active
- completed site count / total site count
- the latest status detail line

Recommended when available:

- success count
- partial failure count
- hard failure count
- recent log lines
- estimated remaining time

The operator should never be left with an unexplained spinner during a heavy recollection path.

#### Pacing and anti-blocking policy

The unified full-refresh model must still be conservative.

Recommended baseline:

- site-list concurrency: `1`
- `expose` concurrency: `1` or `2`
- `diagnosisMeta` concurrency: `1`
- `crawl` concurrency: `1`
- `backlink` concurrency: `1`

Recommended pacing:

- per-site delay
- per-phase transition delay
- small jitter

Adaptive backoff should reduce speed when 429, 403, anti-bot responses, or clustered failures appear.

#### Failure policy

The system must distinguish:

- success
- partial success
- hard failure

Examples:

- `expose` succeeded but `crawl` failed for a site -> partial success
- site list failed and no valid site inventory exists -> hard failure

At the end of a full refresh, the operator should receive an explicit summary rather than a silent best-effort outcome.

#### Field-level cache meaning

Field-level timestamps and status remain useful, but their meaning has changed.

They should now support:

- resume and retry decisions
- partial failure reporting
- pacing and cooldown logic
- state inspection and debugging

They should not be used to preserve the old policy that one HTML save path is cache-first while another path is force-refresh.

#### Current target meaning

The current intended meaning is now:

- cache valid -> show cached state immediately
- cache expired -> run full refresh automatically
- manual refresh -> run full refresh
- regular HTML save -> run full refresh, then save
- direct HTML save -> run full refresh, then save

Any future change that splits these save paths into different freshness guarantees should be treated as a design change that must be explicitly re-documented.
- cache record structure
- retry or cooldown policy
- direct-save bootstrap flow

### 6.3 Blocking / rate-limit / avoidance related issues

Repeated themes:

- diagnosis/meta requests being too aggressive
- need to request slowly in small batches
- risk of upstream blocking when many sites are loaded at once
- warm shortcuts trying to optimize too early and creating logic bugs

What to remember:

- "faster" is not better if it causes unstable or blocked behavior
- small-batch paced fetch is a design requirement
- request pacing must be preserved during refactors

### 6.4 Loader patch fragility

Repeated themes:

- `Legacy patch point not found`
- small upstream drift breaking string anchor patches
- non-ASCII label text inside patch anchors making matches brittle
- patches targeting exact source text instead of structure

What to remember:

- patch anchors must stay ASCII-only where possible
- Korean labels should use escaped `\uXXXX` in replacement strings
- structural helper patches are safer than raw string surgery
- merge-script side replacements should prefer payload-level handoff over UI-string rewrites whenever possible

### 6.5 View switching regressions

Repeated themes:

- site view responses landing late and overwriting overall view
- all-sites body showing old layout while top shell showed new version
- tab switching or mode switching using stale state

What to remember:

- request guards are mandatory
- every async path must check mode and target before applying DOM changes

### 6.6 Encoding and Korean text corruption

Repeated themes:

- Korean text becoming garbled during read or rewrite
- UTF-8 files being reopened through tools or commands that assume a different encoding
- terminal output looking broken even when the file itself is still correct
- runtime strings becoming fragile because raw Korean text was inserted into patch anchors
- documents becoming partially unreadable and then being reused as if they were still trustworthy

Why this matters:

- it wastes time
- it causes repeated rework
- it creates false debugging paths
- it can corrupt runtime code, test strings, and documents at the same time

What to remember:

- encoding handling is a correctness requirement, not a cosmetic issue
- once a file becomes garbled, it must be treated as potentially untrustworthy until re-verified
- patch design should assume Korean text is a high-risk surface unless handled deliberately

## 7. Current Recommended Recovery Strategy

The correct direction is:

- return to a safe baseline conceptually
- keep production root separate
- re-enter merge-aware payload work in a controlled way

Recommended interpretation:

- use `r36` as the stable live-runtime baseline reference
- use `r40-r43` as the merge-aware payload design baseline reference
- do not use `r59` as the conceptual starting point for redesign

This does not automatically mean "hard reset everything now".

It means:

- when rebuilding or reorganizing, compare against `r36` for live-runtime behavior
- compare against `r40-r43` for payload / saved HTML structure
- only carry forward changes that are clearly necessary and verified

## 7A. Encoding Safety Rules

These rules exist specifically to prevent repeated Korean text corruption and wasted work.

### Rule E1. UTF-8 is the source-of-truth file encoding

Files in this workspace that contain documentation, scripts, HTML, or runtime code should be treated as UTF-8 by default.

This applies especially to:

- `.md`
- `.py`
- `.js`
- `.html`
- `.json`
- `.txt`

### Rule E2. Garbled text means stop trusting the file blindly

If Korean text appears broken:

- do not continue editing as if the content were reliable
- first determine whether the corruption is in the file itself or only in terminal output
- if necessary, replace the document with a fresh UTF-8 source-of-truth version

### Rule E3. Do not use raw Korean text in fragile patch anchors

For runtime patching work:

- keep patch anchors ASCII-only whenever possible
- prefer structural anchors over visible-label anchors
- if Korean labels must appear in replacement strings, prefer escaped `\uXXXX` forms in fragile runtime patch sections

### Rule E4. Distinguish file corruption from console corruption

Terminal or PowerShell output can display broken Korean even when the file itself is still correct.

Therefore:

- verify the file contents before assuming data loss
- do not rewrite a file solely because one terminal rendering looked broken
- if the file is correct, fix the workflow, not the content

### Rule E5. Generated documents must stay readable or be replaced

If a design document becomes unreadable due to encoding issues:

- do not keep extending that file as the primary spec
- create a new clean UTF-8 guide and mark the old one as historical or untrusted

This is already the case for:

- `searchadvisor_merge_hook_design.md`

### Rule E6. Prefer data contracts over visible Korean labels

Whenever possible:

- match by field name
- match by payload structure
- match by explicit metadata

instead of depending on visible Korean text in UI strings.

### Rule E7. Before large edits, preserve readable checkpoints

Before major restructuring:

- keep a readable checkpoint document
- keep version pointers clear
- avoid mixing emergency fixes with document rewrites in the same blind flow

## 8. The Four-Party Compatibility Model

Any future merge-related design work must satisfy all four of these at the same time.

### Party 1. Original single HTML

This is one normal SearchAdvisor saved HTML file.

It must remain:

- parseable by the merger
- understandable as a source of truth for one account
- usable as a template candidate for merged output

### Party 2. Original many-HTML set

This is the real operating condition.

Examples:

- different accounts
- same account across multiple times in one day
- older fallback files for accounts that were not refreshed today
- overlapping sites across multiple accounts

The system must define:

- which file wins for each account
- which file wins for each site
- how target date is represented
- how duplicate URLs are resolved

### Party 3. Merged HTML output

This is not just an export artifact.

It must remain:

- openable in the browser
- self-describing enough to explain its merged origin
- safe to use later as a historical report
- stable enough that shell state and labels still work after reopen
- as aligned as possible with the latest compatible HTML shell rather than with each source file's incidental old layout

Related future output:

- the system should also be able to represent equivalent merged data as CSV without redefining field meaning

### Party 4. The merge script

This is the compatibility bridge between the other three parties.

The merge script must:

- accept original HTML variability
- produce a merged payload that the runtime can understand
- prefer extracting raw payload values over depending on visible layout details
- avoid overfitting to one brittle HTML layout
- preserve enough metadata for later debugging and provenance
- prepare the system so HTML and CSV outputs can both be generated from one normalized contract

### Practical design rule

A change is not acceptable unless you can explain its effect on all four parties.

For example:

- if original HTML layout changes, can the merger still find `EXPORT_PAYLOAD`?
- if many originals disagree on one site, does the merge rule still pick deterministically?
- if merged HTML is reopened later, can it still expose merged provenance?
- if the merge script changes, does it still work with both old and new saved HTML variants?

## 9. Merge Script Responsibilities And Non-Responsibilities

This section defines what `searchadvisor_merge_minimal.py` should and should not own.

### Responsibilities

- file discovery
- source-file filtering and retention
- latest-file selection by account and date
- deterministic winner selection for duplicate site data
- payload extraction from source HTML
- merged payload assembly
- `siteMeta` and `mergedMeta` population
- merged-output file writing
- minimal compatibility patch injection required to keep merged HTML understandable
- future CSV-output preparation from the same normalized payload model

### Non-responsibilities

- owning the full UI rendering model
- hard-coding every visible label change in the runtime
- replacing the runtime as the primary renderer
- becoming the place where business logic is duplicated from the runtime without necessity

### Design target

The merge script should behave like a compatibility adapter:

- it prepares merged data
- it injects the minimum bridge logic required for the runtime to consume that data
- it helps older or different saved HTML payloads remain consumable by a newer compatible shell
- it avoids becoming a second full implementation of SearchAdvisor behavior
- it should eventually allow multiple output targets, including HTML and CSV, from the same normalized payload

## 10. Working Rules From Now On

These rules exist to stop repeated mistakes.

### Rule 1. One change stream per task

A single task must be one of:

- live bookmarklet/runtime behavior
- saved HTML/export behavior
- merge-aware payload schema
- loader patch infrastructure

If a task touches more than one, it must say so explicitly and verify all affected paths.

### Rule 2. Production root and tmp are separate review scopes

If a commit touches both:

- `searchadvisor/`
- and `searchadvisor/_tmp/diagnosis-meta-tab/`

that commit is high risk by default and must be treated as an exception.

### Rule 3. Save-path work is not "just UI work"

Any change affecting:

- `EXPORT_PAYLOAD`
- `siteMeta`
- `mergedMeta`
- snapshot shell bootstrap
- save / reopen behavior

must be reviewed as a data-contract change, not just a rendering tweak.

### Rule 3A. Merge script changes are contract changes

Any change to:

- `searchadvisor_merge_minimal.py`
- file naming patterns
- source selection policy
- duplicate-resolution logic
- payload extraction logic
- merged metadata population

must be reviewed against the four-party compatibility model.

### Rule 3B. New export formats must reuse the same contract

If CSV export is added later:

- it must use the same normalized payload concepts as HTML export
- field meaning must stay consistent across HTML and CSV
- CSV generation must not become an unrelated second extraction pipeline unless there is no safer option

### Rule 4. Visible-DOM verification beats marker verification

Passing tests and string markers are not enough.

If the user-facing bug is visual, verify the exact visible path:

- body DOM
- shadow root shell DOM
- actual bookmarklet path

### Rule 5. Avoid clever shortcuts until behavior is stable

Do not introduce:

- warm shortcuts
- hidden bypass paths
- optimistic fetch collapsing

until the simpler flow is already verified and documented.

### Rule 6. Keep temporary docs readable

If a design document becomes garbled or loses encoding readability, treat it as untrusted and replace it with a fresh readable source of truth.

At the time of writing:

- `AI-CONTROL-CENTER.20260314.md` is the first-read control document
- `searchadvisor_merge_hook_design.md` has been re-authored in clean form and should now be read together with the newer architecture docs
- this file remains the broader lab guide, not the only design authority

### Rule 7. Encoding safety must be considered before implementation speed

If a workflow is likely to corrupt Korean text:

- slow down and use the safer path
- preserve readable UTF-8 source files
- avoid creating more garbled intermediate artifacts

Preventing repeated corruption is more important than rushing a local edit.

## 11. Practical Rebuild Plan For Merge-Aware Payload Work

When resuming `searchadvisor_merge_hook_design.md` type work, do it in this order.

### Phase 1. Freeze the live runtime contract

Decide and document:

- what the live bookmarklet runtime must do
- what it must not do
- what UI is required in overall view
- what request pacing is required

Baseline reference:

- `r36`

### Phase 2. Freeze the payload contract

Define only the data structure for:

- `EXPORT_PAYLOAD`
- `siteMeta`
- `mergedMeta`
- summary rows
- per-site cached detail fields

Do this before any further renderer changes.

Design requirement:

- payload compatibility is the stable contract
- visual layout is allowed to evolve
- saved HTML from different revisions should be merged through the payload layer, not by assuming identical rendered structure
- future CSV export should also be specified against the same payload layer

Baseline reference:

- `r40-r43`

Also freeze the merger contract at the same time:

- source file naming assumptions
- payload extraction marker assumptions
- account selection rules
- duplicate site precedence rules
- merged metadata fields

### Phase 3. Rebuild saved HTML bootstrap against the contract

Saved HTML should:

- read the payload
- restore shell state
- support site switching safely
- not depend on fragile string replacements beyond the minimum necessary
- prefer reopening through the latest compatible shell logic whenever the payload contract allows it

### Phase 4. Reintroduce pacing, retry, and anti-blocking control

Only after the contracts are stable:

- conservative request pacing
- failed-field retry rules
- cooldown behavior
- adaptive backoff
- detailed progress reporting

Do not reintroduce the older split idea where one HTML save path is cache-first while another save path is refresh-only unless that policy is deliberately re-approved and documented again.

### Phase 5. Add secondary export modes after the contract is stable

Examples:

- CSV export for one-account snapshots
- CSV export for merged reports

Requirement:

- export formatting may differ
- data semantics must not differ
- HTML and CSV must remain two presentations of one contract

### Phase 6. Reintroduce cosmetic refinements last

Only after functional stability:

- card grouping
- color rolling
- sparkline tuning
- labels and badges

## 12. Minimum Verification Checklist

Before claiming any future fix in this folder:

1. `node --check searchadvisor/_tmp/diagnosis-meta-tab/runtime.20260313-diagnosis-meta-tab.js`
2. `node --test searchadvisor/_tmp/diagnosis-meta-tab/runtime-regression.test.cjs`
3. confirm `window.__SEARCHADVISOR_RUNTIME_VERSION__`
4. confirm visible overall cards in the actual browser path
5. if save/export touched:
   - save HTML
   - reopen saved HTML
   - verify shell state and site switching
   - verify merger-generated HTML still opens and shows merged provenance
6. if merge-aware payload touched:
   - verify `siteMeta`
   - verify `mergedMeta`
   - verify merged report labels and fallback behavior
7. if CSV export is added or changed:
   - verify CSV field names map cleanly to the normalized payload
   - verify one-account export
   - verify merged multi-account export
   - verify HTML and CSV show the same underlying values for the same rows
8. if merge script touched:
   - test one original HTML input
   - test multiple original HTML inputs across different accounts
   - test duplicate-site conflict resolution
   - test fallback to older file when one account has no same-day snapshot
   - test merged output filename and reopenability
9. if a file containing Korean text was edited:
   - verify the file is still readable as UTF-8
   - verify garbling is not being introduced by the edit path
   - verify runtime patch anchors did not become dependent on broken Korean text

## 13. Immediate Actionable Notes For Future Work

- Do not use `searchadvisor_merge_hook_design.md` alone as the implementation guide; read it together with the control center and the newer architecture docs.
- If a new reset is performed, preserve this file and `CHECKPOINT.20260313-r36.md`.
- If a new merge-lab path is created later, this document should be copied and adjusted there.
- Treat temporary console helper `.txt` files as disposable diagnostics, not project documentation.
- Any future rewrite of `searchadvisor_merge_minimal.py` should keep backward compatibility as an explicit requirement, not an implied hope.
- When CSV export is introduced, update this guide first so the field contract is written down before implementation spreads.
- When Korean text corruption appears, update the workflow first rather than repeatedly patching symptoms.

## 14. One-Sentence Summary

This folder should be handled as a temporary diagnosis-meta lab with three explicitly managed concerns: stable live runtime behavior, controlled merge-aware payload experimentation, and a compatibility-first merge script that keeps original HTML, multiple source HTML files, merged outputs such as HTML and future CSV, and merger logic aligned without silently mixing responsibilities.
