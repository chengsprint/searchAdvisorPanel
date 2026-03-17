# Findings

## 2026-03-14

- `WORKING-GUIDE.20260314.md` is the authoritative guide for this folder.
- The guide defines four compatibility parties: original single HTML, many saved HTML files, merged HTML output, and the merge script.
- The required design direction is payload-contract-first, with HTML structure treated as an adaptable shell.
- The work must stay inside `_tmp/diagnosis-meta-tab` and keep production-root `searchadvisor/` untouched.
- Korean text must remain UTF-8 and should not be used as fragile patch anchors.
- The saved HTML runtime already carried `siteMeta`/`mergedMeta`, but the merger still depended on UI-string rewrites.
- The right boundary is: runtime owns DOM-facing decoration hooks; merger owns payload selection, merge metadata, and contract-aware handoff.
- A modern saved snapshot can now be detected by a payload contract marker and handled without label-level HTML rewrites.
