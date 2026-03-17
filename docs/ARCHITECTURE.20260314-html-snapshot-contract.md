# SearchAdvisor HTML Snapshot Contract Architecture

Date: `2026-03-14`

Status: adopted architecture for snapshot state/control handoff; new exports and current live shell mount use the same direct snapshot API plus light-DOM shell ownership model, while body renderer convergence remains incremental

## Purpose

This document defines how saved HTML should work so that:

- live UI changes do not constantly break saved HTML
- merged HTML stays compatible with newer runtime revisions
- HTML export is payload-driven instead of DOM-patch-driven
- one canonical control shell and one normalized snapshot state API can serve live, saved, and merged flows

## The Problem To Solve

The current save path is still too brittle because it behaves like a partially separate app:

- it reconstructs a saved HTML shell
- it injects helper functions and compatibility code
- it depends on structural assumptions about the live DOM and save-time runtime
- small UI or click-handler changes can make saved HTML drift from live behavior

That leads to familiar breakage:

- saved HTML opens but some controls do nothing
- layout structure drifts after design edits
- interactions silently stop responding
- merged HTML requires special string patches to keep working

## Design Goal

Saved HTML should not be a second UI implementation.

Saved HTML should be:

- one payload
- one contract version
- one lightweight shell
- one canonical control shell
- one normalized snapshot state API

The control layer should interpret payload state directly, not depend on the exact save-time DOM shape.

## Decision Summary

This direction is considered the correct long-term architecture.

The system should converge on:

- one canonical state model
- one payload contract
- one control-shell contract
- one snapshot-state contract

It should not keep expanding the number of save-path-specific control shells or view-specific click forks.

## Why This Direction Is Architecturally Correct

### Compatibility

If the stable boundary is the payload contract rather than the saved DOM shape:

- older files remain usable longer
- merged files are less sensitive to markup drift
- saved HTML remains interpretable even after visible design changes

### Extensibility

If the renderer reads normalized payload state:

- future tabs or cards can be added without redefining the save format every time
- CSV and other export targets can reuse the same normalized model
- merged provenance can evolve through metadata instead of shell rewrites

### Operational simplicity

If live, saved, and merged all share one conceptual renderer:

- debugging becomes simpler
- regression tests can compare one state model across multiple reopen paths
- design changes no longer require repeated saved-shell hand patching

### Merge safety

If merged HTML is just another payload source:

- the merger remains a data adapter
- the runtime remains the renderer
- compatibility failures become contract failures, not arbitrary DOM failures

## Core Principle

The stable unit is the payload contract, not the incidental rendered DOM.

That means:

- live runtime produces a normalized payload
- saved HTML embeds that payload
- merged HTML embeds a merged payload with provenance metadata
- reopening HTML runs the same rendering rules against that payload

## What The Current Evidence Shows

As of `2026-03-14`, the working evidence in this lab is:

- a version-correct saved HTML can still look visually different from the live panel
- a saved HTML can contain valid payload contract markers and still show menu/header drift
- that drift is produced by the dedicated saved-html shell path, not by missing external UI libraries
- newly exported snapshots mount the canonical shell through a direct snapshot API in light DOM
- the current live shell mount should use the same light-DOM ownership model so live and saved chrome do not diverge just because of host topology
- compat bridge code may still exist only as fallback for older snapshot variants rather than the primary reopen path

This matters because it changes the diagnosis rule:

- visual mismatch in a valid saved file should first be treated as renderer divergence
- it should not be treated as proof that `lucide`, `shadcn`, or some other asset bundle failed to load

## Contract Layers

### Layer 1. Payload

The payload is the durable state container.

It should include at minimum:

- summary rows
- `dataBySite`
- `siteMeta`
- `mergedMeta`
- fetch status and timestamps needed for deterministic interpretation
- contract version marker

### Layer 2. Snapshot metadata

Saved HTML should declare snapshot-level metadata separately from data content.

Examples:

- saved time
- snapshot mode such as `saved-html`
- runtime contract version
- export source type such as single-account or merged

### Layer 3. Renderer contract

The runtime must expose a stable rendering contract that can:

- boot from payload only
- restore `mode/site/tab`
- render all-sites view
- render per-site detail view
- render merged provenance when `mergedMeta` exists

## Required Behavioral Rules

### Rule 1. Live and saved must share the same state model

If live uses one state shape but saved HTML uses an ad-hoc fork, drift is inevitable.

Corollary:

- saved HTML must not invent a second control-state machine for menu, tab, or site switching
- the top-level shell should read and mutate a snapshot API directly, not infer state back out of rendered DOM

### Rule 2. Reopen must not depend on hidden mirrored controls

Saved HTML should not rely on shadow DOM controls or duplicated invisible widgets just to keep click logic alive.

Compatibility note:

- temporary hidden body anchors may remain while snapshot-local body renderers converge
- but the canonical shell must not read those anchors to discover current mode, current tab, or current site
- if legacy reopen support is needed, a compat bridge may read legacy DOM once and expose a normalized snapshot API for the shell
- new exports should not depend on shadow-root shell mounting when a direct snapshot API is already present

### Rule 3. Render from state, not from patched DOM fragments

The snapshot control layer should produce visible output from payload state.

It should not require fragile string replacement such as:

- swapping labels by searching specific markup text
- patching event handlers into previously rendered nodes
- assuming exact container nesting from an older runtime revision

Corollary:

- `buildSnapshotHtml()` should expose a stable payload contract and a direct snapshot API
- it may temporarily preserve snapshot-local body renderers while those renderers continue to read payload state directly
- it should not remain the permanent owner of alternate interaction semantics for top-level shell controls
- any generated wrapper that is embedded into a transformed or minified runtime must stay self-contained
- a generated export wrapper must not call outer-scope helper names that do not exist inside the generated runtime scope
- if a helper is required inside transformed runtime code, it must either be inlined into that generated scope or attached through an explicit stable global contract

### Rule 4. Merged HTML is just another payload source

Merged output should not be treated as a special renderer fork.

It should be:

- normal snapshot shell
- merged payload
- merged metadata

### Rule 5. Legacy compatibility is allowed only as fallback

If old saved HTML variants still exist, compatibility code may remain temporarily.

But the target architecture is:

- payload handoff first
- snapshot API compat bridge second
- legacy DOM patching only as fallback for old files

Compatibility note:

- saved-shell-only fixes are acceptable only when they protect already exported files or unblock short-term verification
- they should not become the main growth path for new features

## Recommended Snapshot File Contents

Every saved or merged HTML should contain:

1. snapshot HTML shell markup
2. embedded payload JSON
3. contract version marker
4. snapshot metadata marker
5. snapshot state API bootstrap
6. control-shell bootstrap

The bootstrap layer should do this:

1. load payload
2. validate contract version
3. initialize snapshot state
4. expose a direct snapshot API
5. mount the canonical control shell
6. attach interactions that mutate state and re-render

The bootstrap layer should not permanently own:

- alternate menu bar markup
- alternate tab markup
- alternate site-switch semantics
- alternate merge-label rendering rules

Allowed during convergence:

- snapshot-local body render functions
- hidden legacy body anchors that are updated by the snapshot API rather than read by the shell

## Interaction Model

A saved HTML click should not directly mutate random DOM nodes.

The correct flow is:

1. user action
2. state transition
3. renderer updates visible UI from state

For example:

- click `all-sites` -> state mode becomes `all` -> render all-sites
- select a site -> state site becomes chosen site -> render detail view
- click a tab -> state tab changes -> render selected tab

This is heavier than manual DOM patching in the short term, but much less fragile over time.

Behavioral expectation:

- live, saved, and merged do not need pixel-perfect implementation identity during migration
- but they should follow the same conceptual state transitions and render decisions
- long term, visual and behavioral parity is the target

## Merge Compatibility Model

Merged HTML should add meaning through metadata, not ad-hoc view rewrites.

Recommended merged metadata includes:

- `isMerged`
- `targetDate`
- `naverIds`
- `fileNames`
- `selectedFilesById`
- `selectedDatesById`

Recommended per-site metadata includes:

- canonical site key
- `naverId`
- `displayLabel`
- source provenance as needed

The renderer should then decide:

- how site labels look
- how merged headers look
- how provenance is displayed

The merger should not own those UI decisions.

## What This Architecture Replaces

This architecture is meant to replace or reduce:

- save-time DOM surgery
- hidden mirror controls to keep saved HTML interactive
- direct string patching for merged labels
- duplicated logic between live and saved paths
- save-path-specific click behavior forks

It also replaces the assumption that:

- cloning the live panel DOM
- injecting helper functions
- and preserving interaction through save-shell patches

is a stable enough long-term design. It is not.

## Migration Direction

### Stage 1. Freeze the payload contract

Define and version the payload fields that live, saved, and merged all depend on.

### Stage 2. Freeze the snapshot bootstrap contract

Define how saved HTML boots from payload without needing live DOM assumptions.

### Stage 3. Freeze the merged metadata contract

Define how merged provenance is represented without merger-owned rendering logic.

### Stage 4. Remove legacy save-path forks gradually

Keep fallback compatibility only where old files still require it.

### Stage 5. Use the same contract for future export targets

CSV export should consume the same normalized payload concepts, not a separate scraping path.

### Stage 6. Reach visual and behavioral parity

Remove remaining saved-shell-specific view divergence so that:

- menu structure matches the live model
- tab switching follows the canonical renderer path
- saved HTML no longer looks like a second product surface

## Non-Goals

This direction does not require:

- preserving every historical saved-shell quirk forever
- reproducing old DOM structures exactly
- making the merger own UI markup decisions
- keeping save-time DOM cloning as a protected abstraction

## Compatibility And Expansion Guarantees To Aim For

The design should aim to guarantee:

1. design changes in live runtime do not immediately break saved HTML reopen behavior
2. merged HTML remains readable as long as payload contract compatibility is preserved
3. saved HTML does not need one-off UI patch updates for ordinary label or layout changes
4. future output targets can reuse normalized payload state without building a second extraction model
5. failures are diagnosable as contract mismatches instead of vague click-break regressions

## Verification Checklist

Any meaningful save-path change should verify all of the following:

1. live bookmarklet still works
2. newly saved single HTML reopens and all major controls respond
3. merged HTML reopens and shows merged provenance
4. changing a live UI label or layout does not require a separate saved-HTML logic patch
5. payload contract markers and contract version markers are present
6. old compatibility fallback still opens older saved variants if required
7. a version-correct saved file that still looks different is investigated as renderer drift, not immediately blamed on missing external UI libraries
8. menu, tab, and site-switch behavior are conceptually aligned across live, saved, and merged reopen paths

## Relationship To Other Documents

- `AI-CONTROL-CENTER.20260314.md`: read first for document priority
- `ARCHITECTURE.20260314-cache-bootstrap.md`: defines when full refresh must happen before save
- `searchadvisor_merge_hook_design.md`: defines merger responsibilities and merged payload production
- `WORKING-GUIDE.20260314.md`: broader lab notes and historical guardrails
