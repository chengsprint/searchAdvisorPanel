# Visual Comparison: Current vs Proposed Schema

## Data Access Pattern Comparison

### Scenario 1: Get data for a specific site

**Current Approach (O(1)):**
```
┌─────────────────────────────────────────────────────────────┐
│ dataBySite["https://site1.com"]                             │
│ ┌─────────────────────────────────────────────────────────┐ │
│ │ expose: {...}                                           │ │
│ │ crawl: {...}                                            │ │
│ │ __source: {                                             │ │
│ │   accountLabel: "user1@naver.com",  ← Direct access     │ │
│ │   accountEncId: "abc12345"        ← Direct access       │ │
│ │ }                                                        │ │
│ └─────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
```

**Proposed Approach (O(n) - need to find account first):**
```
┌─────────────────────────────────────────────────────────────┐
│ payload.accounts["user1@naver.com"].dataBySite["site1.com"] │
│ ┌─────────────────────────────────────────────────────────┐ │
│ │ expose: {...}                                           │ │
│ │ crawl: {...}                                            │ │
│ │ (account info is in parent key - need to traverse up)   │ │
│ └─────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
         ↑
         │ Need to iterate through accounts to find which one
         │ contains this site (O(n) operation)
```

---

### Scenario 2: Iterate all sites

**Current Approach:**
```
for (const site of Object.keys(dataBySite)) {
  const data = dataBySite[site];
  const sourceAccount = data.__source?.accountLabel;
  // Process site
}
```

**Proposed Approach:**
```
for (const [email, account] of Object.entries(payload.accounts)) {
  for (const site of Object.keys(account.dataBySite)) {
    const data = account.dataBySite[site];
    const sourceAccount = email;  // Available but nested
    // Process site
  }
}
```

**Comparison:**
- Current: Single loop, direct access
- Proposed: Nested loops, extra indentation

---

### Scenario 3: Multi-account site handling

**Current Approach (Natural fit):**
```
dataBySite: {
  "https://site1.com": {
    __source: {
      accountLabel: "user1@naver.com",  // Clear source
      accountEncId: "abc12345"
    },
    expose: { click: 1000 }  // Data from user1
  }
}
```

**Proposed Approach (Not designed for this):**
```
accounts: {
  "user1@naver.com": {
    sites: ["https://site1.com"],
    dataBySite: {
      "https://site1.com": { expose: { click: 1000 } }
    }
  },
  "user2@naver.com": {
    sites: ["https://site1.com"],  // Same site?
    dataBySite: {
      "https://site1.com": { expose: { click: 2000 } }  // Conflict!
    }
  }
}
```

**Problem:** How to represent the same site from multiple accounts?
- Current: Just add another entry with different `__source`
- Proposed: Not designed for this scenario

---

## Complexity Metrics

### Code Complexity

| Operation | Current Lines | Proposed Lines | Increase |
|-----------|---------------|----------------|----------|
| Get site data | 1 | 1-2 | 0-100% |
| Get source account | 1 | 1 | 0% |
| Iterate sites | 3 | 5 | 67% |
| Check merged | 1 | 1 | 0% |
| Merge detection | 1 | 1 | 0% |
| **Total** | **7** | **9-10** | **29-43%** |

### Data Structure Complexity

| Aspect | Current | Proposed | Winner |
|--------|---------|----------|--------|
| Nesting levels | 1-2 | 2-3 | Current |
| Direct site access | Yes | No | Current |
| Multi-account support | Yes | No | Current |
| Data locality | High | Low | Current |
| Access pattern | O(1) | O(n) | Current |

---

## Real-World Example

### Current Implementation (working code)

**File:** `/src/app/main/10-all-sites-view.js:275-283`
```javascript
dataBySite[site] = {
  ...siteData,
  __source: {
    accountLabel: accountLabel || "unknown",
    accountEncId: encId || "unknown",
    fetchedAt: siteData.__cacheSavedAt || new Date().toISOString(),
    exportedAt: savedAtIso(new Date()),
  }
};
```

**File:** `/src/app/main/11-site-view.js:60-66`
```javascript
const sourceAccount =
  (data && data.__source) ||
  (initSiteData && initSiteData.__source) ||
  null;
```

**File:** `/src/app/main/10-all-sites-view.js:143-146`
```javascript
const sourceBadge = r.sourceAccount
  ? `<span title="${escHtml(r.sourceAccount)}">
      ${escHtml(r.sourceAccount.split("@")[0])}
    </span>`
  : "";
```

**Result:** ✅ Working, displaying account badges in UI

---

### Proposed Implementation (hypothetical)

**Would require:**
```javascript
// 1. Restructure data export
payload = {
  accounts: {
    [email]: {
      encId,
      sites,
      siteMeta,
      dataBySite
    }
  }
};

// 2. Rewrite data access
const accountEmail = findAccountForSite(site);  // New function
const data = payload.accounts[accountEmail]?.dataBySite[site];

// 3. Rewrite all iteration loops
for (const [email, account] of Object.entries(payload.accounts)) {
  for (const [site, data] of Object.entries(account.dataBySite)) {
    // Process
  }
}

// 4. Update UI rendering
// 5. Update snapshot generation
// 6. Update import/export logic
// 7. Migration script for existing data
```

**Result:** ❌ Not implemented, high cost, unclear benefit

---

## Feature Completeness Matrix

| Feature | Current | Proposed | Notes |
|---------|---------|----------|-------|
| Track account per site | ✅ | ✅ | Both do it |
| Track account encId | ✅ | ✅ | Both do it |
| Track timestamps | ✅ | ✅ | Both do it |
| Merge detection | ✅ | ✅ | Both do it |
| Account count | ✅ | ✅ | Both do it |
| Account list | ✅ | ✅ | Both do it |
| Direct site access | ✅ | ❌ | Current wins |
| Multi-account sites | ✅ | ❌ | Current wins |
| Implemented | ✅ | ❌ | Current wins |
| No migration needed | ✅ | ❌ | Current wins |
| Backward compatible | ✅ | ❌ | Current wins |
| Simple access pattern | ✅ | ❌ | Current wins |
| Flexible provenance | ✅ | ❌ | Current wins |

**Score:**
- Current: 13/13 (100%)
- Proposed: 6/13 (46%)

---

## Decision Tree

```
Should we implement the proposed nested schema?

Question 1: Does the current approach track multi-account data?
├─ YES (via __source field)
└─ → No need for change

Question 2: Does the current approach support merge detection?
├─ YES (via mergedMeta field)
└─ → No need for change

Question 3: Does the current approach handle multi-account sites?
├─ YES (natural fit)
└─ → No need for change

Question 4: Does the proposed approach add any new features?
├─ NO (same features, different structure)
└─ → No benefit to change

Question 5: Is the proposed approach simpler?
├─ NO (more nesting, more complexity)
└─ → Current approach is better

FINAL ANSWER: NO ❌
→ Enhance existing approach instead
```

---

## Migration Cost Analysis

### Current → Proposed (if implemented)

| Component | Lines to Change | Risk Level |
|-----------|-----------------|------------|
| Data export | ~50 | High |
| Data access | ~100 | High |
| Iteration loops | ~30 | Medium |
| UI rendering | ~20 | Low |
| Snapshot generation | ~40 | High |
| Import/export | ~30 | Medium |
| Migration script | ~100 | Critical |
| **Total** | **~370** | **Very High** |

### Current → Enhanced (recommended)

| Component | Lines to Change | Risk Level |
|-----------|-----------------|------------|
| Documentation | ~50 | Low |
| Helper functions | ~30 | Low |
| Validation | ~20 | Low |
| Unit tests | ~50 | Low |
| **Total** | **~150** | **Low** |

**Comparison:**
- Proposed: ~370 lines, Very High risk
- Enhanced: ~150 lines, Low risk
- **Savings: 220 lines, significantly lower risk**

---

## Conclusion

The current `__source` + `mergedMeta` approach:
- ✅ Solves the problem
- ✅ Is simpler
- ✅ Is already implemented
- ✅ Is more flexible
- ✅ Handles edge cases better

The proposed nested `accounts.{email}` schema:
- ❌ Adds no new features
- ❌ Is more complex
- ❌ Is not implemented
- ❌ Is less flexible
- ❌ Handles edge cases poorly

**Recommendation: Enhance the existing approach, do not implement the proposed schema.**
