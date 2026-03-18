# SearchAdvisor Runtime API Reference

Complete API documentation for SearchAdvisor Runtime widget.

## Table of Contents

- [Global Objects](#global-objects)
- [Core Functions](#core-functions)
- [API Functions](#api-functions)
- [UI Functions](#ui-functions)
- [Data Management](#data-management)
- [Event Handlers](#event-handlers)
- [Constants](#constants)

---

## Global Objects

### `window.SearchAdvisor`

Main runtime object that provides access to all widget functionality.

```javascript
// Check if widget is loaded
if (window.SearchAdvisor) {
  console.log('SearchAdvisor Runtime is ready');
}
```

### `window.__sadvApi`

Internal API object for advanced operations.

```javascript
// Access internal API
const api = window.__sadvApi;
```

### `window.__sadvState`

Current state object containing widget state.

```javascript
// Get current state
const state = window.__sadvState;
console.log('Current site:', state.currentSiteId);
```

### `window.__SADV_DEMO_MODE__`

Demo mode flag. Set to `true` to enable demo mode.

```javascript
// Enable demo mode
window.__SADV_DEMO_MODE__ = true;
```

---

## Core Functions

### `initWidget(config)`

Initialize the widget with optional configuration.

**Parameters:**
- `config` (Object): Configuration object
  - `container` (String): CSS selector for container (default: `'#sadv-widget'`)
  - `demoMode` (Boolean): Enable demo mode (default: `false`)
  - `autoShow` (Boolean): Auto show widget on init (default: `true`)

**Returns:** `Promise<void>`

**Example:**
```javascript
await initWidget({
  container: '#my-widget',
  demoMode: true,
  autoShow: true
});
```

### `showWidget()`

Display the widget.

**Returns:** `void`

**Example:**
```javascript
showWidget();
```

### `hideWidget()`

Hide the widget.

**Returns:** `void`

**Example:**
```javascript
hideWidget();
```

---

## API Functions

### `loadSiteList()`

Load the list of available sites.

**Returns:** `Promise<Array<Site>>`

**Site Object:**
```javascript
{
  id: String,        // Site ID
  name: String,      // Site name
  url: String,       // Site URL
  status: String     // Site status
}
```

**Example:**
```javascript
const sites = await loadSiteList();
console.log('Available sites:', sites);
```

### `fetchExposeData(siteId)`

Fetch click and impression data for a site.

**Parameters:**
- `siteId` (String): Site ID

**Returns:** `Promise<Object>`

**Example:**
```javascript
const data = await fetchExposeData('site-123');
console.log('Clicks:', data.totalClicks);
console.log('Impressions:', data.totalImpressions);
```

### `fetchDiagnosisData(siteId)`

Fetch indexing diagnosis data for a site.

**Parameters:**
- `siteId` (String): Site ID

**Returns:** `Promise<Object>`

**Example:**
```javascript
const diagnosis = await fetchDiagnosisData('site-123');
console.log('Indexed pages:', diagnosis.indexedCount);
```

### `fetchCrawlStats(siteId)`

Fetch crawling statistics for a site.

**Parameters:**
- `siteId` (String): Site ID

**Returns:** `Promise<Object>`

**Example:**
```javascript
const crawl = await fetchCrawlStats('site-123');
console.log('Crawled pages:', crawl.crawledCount);
```

### `fetchBacklinkData(siteId)`

Fetch backlink data for a site.

**Parameters:**
- `siteId` (String): Site ID

**Returns:** `Promise<Object>`

**Example:**
```javascript
const backlinks = await fetchBacklinkData('site-123');
console.log('Total backlinks:', backlinks.totalCount);
```

---

## UI Functions

### `switchTab(tabId)`

Switch to a different tab.

**Parameters:**
- `tabId` (String): Tab identifier
  - `'overview'` - Overview tab
  - `'daily'` - Daily statistics
  - `'urls'` - URL analysis
  - `'queries'` - Query analysis
  - `'crawl'` - Crawl status
  - `'backlink'` - Backlink analysis

**Returns:** `void`

**Example:**
```javascript
switchTab('overview');
```

### `refreshData()`

Refresh current data.

**Returns:** `Promise<void>`

**Example:**
```javascript
await refreshData();
```

### `switchSite(siteId)`

Switch to a different site.

**Parameters:**
- `siteId` (String): Site ID

**Returns:** `Promise<void>`

**Example:**
```javascript
await switchSite('site-456');
```

### `setMode(mode)`

Set data display mode.

**Parameters:**
- `mode` (String): Mode
  - `'LIVE'` - Live data
  - `'SNAPSHOT'` - Snapshot data
  - `'DEMO'` - Demo data

**Returns:** `void`

**Example:**
```javascript
setMode('DEMO');
```

---

## Data Management

### `saveSiteData(siteId, data)`

Save site data to localStorage.

**Parameters:**
- `siteId` (String): Site ID
- `data` (Object): Data to save

**Returns:** `void`

**Example:**
```javascript
saveSiteData('site-123', myData);
```

### `loadSiteData(siteId)`

Load site data from localStorage.

**Parameters:**
- `siteId` (String): Site ID

**Returns:** `Object|null`

**Example:**
```javascript
const data = loadSiteData('site-123');
if (data) {
  console.log('Loaded data:', data);
}
```

### `clearSiteData(siteId)`

Clear saved site data.

**Parameters:**
- `siteId` (String): Site ID

**Returns:** `void`

**Example:**
```javascript
clearSiteData('site-123');
```

### `exportData()`

Export all current data as JSON.

**Returns:** `String` JSON string

**Example:**
```javascript
const json = exportData();
console.log('Export:', json);
```

### `importData(jsonString)`

Import data from JSON string.

**Parameters:**
- `jsonString` (String): JSON data string

**Returns:** `void`

**Example:**
```javascript
importData(myJsonString);
```

---

## Event Handlers

### `onSiteChange(callback)`

Register callback for site changes.

**Parameters:**
- `callback` (Function): Callback function
  - Parameters: `(siteId) => void`

**Example:**
```javascript
onSiteChange((siteId) => {
  console.log('Site changed to:', siteId);
});
```

### `onTabChange(callback)`

Register callback for tab changes.

**Parameters:**
- `callback` (Function): Callback function
  - Parameters: `(tabId) => void`

**Example:**
```javascript
onTabChange((tabId) => {
  console.log('Tab changed to:', tabId);
});
```

### `onDataUpdate(callback)`

Register callback for data updates.

**Parameters:**
- `callback` (Function): Callback function
  - Parameters: `(data) => void`

**Example:**
```javascript
onDataUpdate((data) => {
  console.log('Data updated:', data);
});
```

---

## Constants

### Data Modes

```javascript
const DATA_MODES = {
  LIVE: 'LIVE',       // Live API data
  SNAPSHOT: 'SNAPSHOT', // Saved snapshot
  DEMO: 'DEMO'        // Demo data
};
```

### Tab IDs

```javascript
const TABS = [
  { id: 'overview', label: 'Overview' },
  { id: 'daily', label: 'Daily' },
  { id: 'urls', label: 'URLs' },
  { id: 'queries', label: 'Queries' },
  { id: 'crawl', label: 'Crawl' },
  { id: 'backlink', label: 'Backlink' }
];
```

### API Endpoints

```javascript
const ENDPOINTS = {
  SITE_LIST: '/api-board/list/',
  EXPOSE_DATA: '/api-console/report/expose/',
  DIAGNOSIS: '/api-console/report/diagnosis/meta/',
  CRAWL: '/api-console/report/crawl/',
  BACKLINK: '/api-console/report/backlink/'
};
```

### Storage Keys

```javascript
const STORAGE_KEYS = {
  SITE_DATA: 'sadv_site_data_',
  SETTINGS: 'sadv_settings',
  CACHE: 'sadv_cache_'
};
```

---

## Utility Functions

### `formatDate(date)`

Format date for display.

**Parameters:**
- `date` (Date|String): Date to format

**Returns:** `String`

**Example:**
```javascript
const formatted = formatDate(new Date());
console.log(formatted); // "2026-03-18"
```

### `formatNumber(num)`

Format number with commas.

**Parameters:**
- `num` (Number): Number to format

**Returns:** `String`

**Example:**
```javascript
const formatted = formatNumber(1234567);
console.log(formatted); // "1,234,567"
```

### `L(key)`

Get localized string.

**Parameters:**
- `key` (String): Translation key

**Returns:** `String`

**Example:**
```javascript
const label = L('tab.overview');
console.log(label); // "Overview"
```

---

## Error Handling

### Error Types

```javascript
// Network error
{
  type: 'NetworkError',
  message: 'Failed to fetch data',
  code: 'NETWORK_ERROR'
}

// Validation error
{
  type: 'ValidationError',
  message: 'Invalid site ID',
  code: 'VALIDATION_ERROR'
}

// Data error
{
  type: 'DataError',
  message: 'No data available',
  code: 'NO_DATA'
}
```

### Error Handling Example

```javascript
try {
  const data = await fetchExposeData('site-123');
} catch (error) {
  if (error.code === 'NETWORK_ERROR') {
    console.error('Network issue:', error.message);
  } else if (error.code === 'VALIDATION_ERROR') {
    console.error('Invalid input:', error.message);
  }
}
```

---

## Browser Compatibility

- Chrome/Edge: 90+
- Firefox: 88+
- Safari: 14+
- Mobile browsers: iOS Safari 14+, Chrome Mobile 90+

---

## Performance Tips

1. **Use Demo Mode** for development and testing
2. **Enable Caching** to reduce API calls
3. **Batch Operations** when handling multiple sites
4. **Use Snapshots** for offline analysis
5. **Optimize Tab Switching** by preloading data

---

## Support

For issues or questions, please refer to the main README.md or contact the development team.
