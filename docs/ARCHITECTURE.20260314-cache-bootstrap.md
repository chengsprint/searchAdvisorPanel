# SearchAdvisor Cache And Full Refresh Architecture

Date: `2026-03-14`

Status: active target architecture for refresh policy in `_tmp/diagnosis-meta-tab`

## Purpose

This document defines one refresh model that the operator can understand without guessing:

- if cache is still valid, show it immediately
- if cache is expired, run one explicit full refresh pipeline
- if the operator clicks full refresh, run that same full refresh pipeline
- if the operator saves HTML, run that same full refresh pipeline before saving

This document replaces older mixed ideas such as:

- some flows being cache-first while others are force-refresh
- different refresh rules per screen without clear operator explanation
- HTML export quality depending on which button path happened to be used

## Core Policy

The following triggers must converge on one shared full refresh pipeline:

1. cache expiry detected at startup or reopen
2. manual full refresh button click
3. regular HTML save button click
4. direct HTML save flow

The target operator mental model is intentionally simple:

- cached and still valid -> show immediately
- expired or explicitly requested -> collect everything again, slowly and visibly

## Full Refresh Pipeline

Every full refresh must follow this order:

1. refresh site list
2. collect `expose` for all sites
3. collect `diagnosisMeta` for all sites
4. collect `crawl` for all sites
5. collect `backlink` for all sites
6. commit results to memory cache and `localStorage`
7. re-render the live UI from the new state
8. if requested, produce HTML from that refreshed state

The important invariant is:

- `all-sites` view
- per-site detail view
- saved HTML
- direct-saved HTML

must all reflect the same refreshed data baseline after the pipeline completes.

## Why This Model Is Preferred

### Operator clarity

The operator should not need to understand special cases like:

- live refresh is partial
- one save path is cache-first
- another save path is force-refresh
- one reopened panel restores state
- another silently triggers a hidden heavy fetch

One pipeline is slower than selective optimization, but it is easier to trust.

### Stable snapshot meaning

If HTML save does not use the same data freshness model as the UI, the saved file becomes ambiguous:

- it may open correctly but not be truly current
- the operator cannot tell which fields are fresh
- later merge behavior becomes harder to reason about

### Centralized pacing and anti-blocking control

A shared full refresh engine allows:

- one concurrency policy
- one delay policy
- one retry policy
- one progress UI model
- one failure summary model

This is safer than spreading rate-limit behavior across unrelated code paths.

## Trigger Rules

### Startup or reopen with valid cache

- restore last `mode/site/tab`
- render immediately from cache
- do not silently start full refresh

### Startup or reopen with expired cache

- render a clear refresh reason
- start the full refresh pipeline automatically

Example operator-facing message:

`Cache expired. Recollecting all sites so the summary, detail tabs, and saved HTML all use the same fresh data.`

### Manual full refresh

- always start the full refresh pipeline
- current screen does not change the scope
- after completion, re-render whatever the operator is currently viewing

### Regular HTML save

- always start the full refresh pipeline first
- save only after the pipeline completes or fails with an explicit partial-failure summary

### Direct HTML save

- same collection quality target as regular HTML save
- different trigger path only, not different data quality

## Progress UI Requirements

If the system is allowed to recollect all sites, it must explain itself in detail.

The progress UI should show at minimum:

- trigger reason: `ttl-expired`, `manual-refresh`, `html-save`, `direct-html-save`
- current activity or phase
- current site when a site-specific step is in progress
- completed site count / total site count
- the latest status detail line

The operator should never be left with only a spinner.

Recommended when available:

- success count
- partial failure count
- hard failure count
- recent log lines
- estimated remaining time

## Pacing And Anti-Blocking Policy

The target is cautious, not aggressive.

Recommended baseline:

- site-list concurrency: `1`
- expose concurrency: `1` or `2`
- diagnosisMeta concurrency: `1`
- crawl concurrency: `1`
- backlink concurrency: `1`

Recommended pacing:

- per-site delay: `250ms` to `600ms`
- phase transition delay: `400ms` to `800ms`
- small jitter: `0ms` to `250ms`

Adaptive behavior should reduce speed when:

- 429 responses appear
- 403 or anti-bot responses appear
- latency spikes sharply
- multiple failures cluster in the same phase

## Failure Handling

The pipeline must distinguish:

- success
- partial success
- hard failure

Examples:

- `expose` succeeded but `crawl` failed -> partial success
- site list failed and no site inventory exists -> hard failure

At the end, the operator should see a clear summary such as:

`Full refresh complete: 94 sites fully refreshed, 4 sites partially failed.`

HTML save behavior should also be explicit:

- if partial failures are allowed, the saved HTML must include failure metadata
- if policy forbids partial-save output, saving must stop with a clear message

## Relationship To Other Documents

This document defines refresh policy only.

Use these companion documents for adjacent concerns:

- `AI-CONTROL-CENTER.20260314.md`: document priority, reading order, and AI entrypoint
- `ARCHITECTURE.20260314-html-snapshot-contract.md`: saved HTML and payload-contract architecture
- `searchadvisor_merge_hook_design.md`: merge-script responsibilities and merged payload contract
- `WORKING-GUIDE.20260314.md`: broader lab history, guardrails, and recovery notes

## Current Status

This document is the intended architecture target.

The current runtime still contains legacy behavior and compatibility workarounds. Until implementation fully converges:

- treat this document as policy
- treat `WORKING-GUIDE.20260314.md` as broader operational context
- treat any older cache-first export notes as superseded where they conflict with this file
