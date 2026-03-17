# Multi-Account Data Merge Specification

## Schema Version 1.0

### Overview
This specification defines the data format for merging SearchAdvisor snapshot data from multiple Naver accounts. The webapp's core value is DATA - this architecture ensures data portability, versioning, and conflict-free merging.

### Export Format

```json
{
  "__schema_version": "1.0",
  "__exported_at": "2026-03-16T12:00:00.000Z",
  "__source_account": "user@naver.com",
  "__source_enc_id": "abc123... (64-char hex)",
  "__source_namespace": "label_encid",
  "__data_format": "sadv_snapshot_v1",
  "__generator": "SearchAdvisor Runtime",
  "__generator_version": "2026.03.15",

  "sites": {
    "https://site.com": {
      "__meta": {
        "__source": "account-identifier",
        "__fetched_at": 1710123456789,
        "__schema": "1.0",
        "__namespace": "label_encid"
      },
      "expose": {
        "items": [{
          "period": {
            "start": "20260301",
            "end": "20260315",
            "prevClickRatio": "+5.2",
            "prevExposeRatio": "+3.1"
          },
          "logs": [...],           // 15 days of click/expose data
          "urls": [...],           // URL-level data
          "querys": [...]          // Search query data
        }]
      },
      "crawl": {
        "items": [{
          "stats": [...],        // Daily crawl statistics
          "sitemaps": [...]      // Sitemap information
        }]
      },
      "backlink": {
        "items": [{
          "total": 580,
          "domains": 35,
          "countTime": [...],    // Time-series backlink counts
          "topDomain": [...]     // Top referring domains
        }]
      },
      "diagnosisMeta": {
        "code": 0,
        "items": [{
          "meta": [...]          // Index status by date
        }]
      },
      "diagnosisMetaRange": {
        "start": "20260301",
        "end": "20260315"
      }
    }
  }
}
```

## API Functions

### Export
```javascript
window.__sadvApi.exportCurrentAccountData()
// Returns export object with all site data
```

### Import
```javascript
window.__sadvApi.importAccountData(exportData, {
  overwrite: false,      // Don't overwrite existing
  mergeStrategy: 'newer', // Use newer data on conflicts
  validate: true          // Validate schema before import
})
```

### Validation
```javascript
window.__sadvApi.validateDataSchema(data)
// Returns { valid: boolean, version: string, errors: string[] }
```

### Migration
```javascript
window.__sadvApi.migrateSchema(data, "1.0")
// Migrates data to target version
```

### Conflict Detection
```javascript
window.__sadvApi.detectConflicts({
  'account1': { sites: {...} },
  'account2': { sites: {...} }
})
// Returns { conflicts: [], bySite: {} }
```

### Merge
```javascript
window.__sadvApi.mergeAccounts(targetData, sourceData, {
  strategy: 'newer',      // 'newer', 'all', 'target', 'source'
  mergeLogs: true,        // Merge log arrays
  mergeDates: true,       // Combine date ranges
  preserveSources: true    // Track data sources
})
```

## Merge Strategies

| Strategy | Behavior |
|----------|----------|
| `newer` | Keep data with latest __fetched_at |
| `source` | Use source data, overwrite target |
| `target` | Keep target data, ignore source |
| `all` | Deep merge: combine logs, URLs, queries by key |

## Data Provenance

Each site data maintains:
- `__meta.__source` - Original account
- `__meta.__fetched_at` - Collection time
- `__meta.__sources[]` - All accounts contributing data
- `__meta.__imported_from` - If imported from another account
- `__meta.__imported_at` - Import timestamp

## Versioning

- Current version: `1.0`
- Backward compatible with legacy data (no __schema_version = treat as 1.0)
- Schema migrations handled by `migrateSchema()`