# Task Plan

## Goal

Separate the temporary diagnosis-meta-tab workspace so these paths stop bleeding into each other:

- live bookmarklet analysis path
- saved HTML / reopen path
- merge-aware payload path
- `searchadvisor_merge_minimal.py` compatibility path

The stable center is the payload contract, not the current HTML structure or design.

## Constraints

- Follow `WORKING-GUIDE.20260314.md` as the source of truth.
- Only modify files inside `searchadvisor/_tmp/diagnosis-meta-tab/`.
- Do not modify deployment-root `searchadvisor/`.
- Keep Korean text safe in UTF-8.
- Avoid fragile patch anchors that depend on visible Korean labels.

## Phases

1. Inventory the current contract surfaces and execution paths. `in_progress`
2. Design a clearer separation around the payload contract. `pending`
3. Implement the tmp-only refactor. `pending`
4. Verify syntax/tests and document residual risks. `pending`

## Errors Encountered

- None yet.
