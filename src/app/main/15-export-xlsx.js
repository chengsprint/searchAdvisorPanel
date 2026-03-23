// ============================================================
// XLSX EXPORT ADAPTER
// ============================================================

// 현재 runtime 빌드는 import/require 번들러가 아니라 단순 concat IIFE다.
// 따라서 XLSX는 node-style dependency를 직접 끼워넣기보다,
// 공식 standalone browser build를 필요 시점에만 로드하는 방식이 가장 안전하다.
//
// 중요:
// - 이 파일은 XLSX "정책 owner"가 아니라 workbook commit leaf다.
//   blocked/waiting/refresh/startup owner 판단은 여전히 runSnapshotSaveExecution()
//   쪽에서 끝나 있어야 한다.
// - 외부 SheetJS 로딩은 실패/타임아웃/CSP 차단 가능성이 있으므로,
//   실패 script는 제거하고 promise를 초기화해 다음 수동 시도에서 재시도 가능해야 한다.
const SNAPSHOT_XLSX_STANDALONE_URL =
  "https://cdn.sheetjs.com/xlsx-0.20.3/package/dist/xlsx.full.min.js";
const SNAPSHOT_XLSX_LIBRARY_TIMEOUT_MS = 15000;
let snapshotXlsxLibraryPromise = null;
const SNAPSHOT_XLSX_SHEET_NAMES = Object.freeze({
  readme: "안내",
  daily: "사이트 일별",
  summary: "사이트 요약",
  meta: "사이트 메타",
  queries: "검색어",
  pages: "페이지",
  indexed: "색인",
});
const SNAPSHOT_XLSX_RUNTIME_LABELS = Object.freeze({
  live: "라이브",
  snapshot: "저장본",
  saved: "저장본",
  merge: "병합",
});

function hasUsableSnapshotXlsxGlobal(XLSX) {
  return !!(
    XLSX &&
    XLSX.utils &&
    typeof XLSX.write === "function" &&
    typeof XLSX.utils.book_new === "function" &&
    typeof XLSX.utils.book_append_sheet === "function" &&
    typeof XLSX.utils.aoa_to_sheet === "function"
  );
}

function ensureSnapshotXlsxLibrary() {
  if (typeof window === "undefined") {
    return Promise.reject(new Error("xlsx export requires a browser runtime"));
  }
  if (hasUsableSnapshotXlsxGlobal(window.XLSX)) {
    return Promise.resolve(window.XLSX);
  }
  if (snapshotXlsxLibraryPromise) return snapshotXlsxLibraryPromise;
  snapshotXlsxLibraryPromise = new Promise(function (resolve, reject) {
    let timeoutId = null;
    const finishWithError = function (message, existingScript) {
      if (timeoutId) clearTimeout(timeoutId);
      // 실패한 script element는 그대로 두지 않는다.
      // 그래야 다음 수동 엑셀 저장 시도에서 깨진 DOM 노드를 재활용하지 않고
      // 새 standalone runtime load를 다시 시도할 수 있다.
      if (existingScript && existingScript.parentNode && existingScript.dataset.sadvXlsxState !== "ready") {
        existingScript.parentNode.removeChild(existingScript);
      }
      reject(new Error(message));
    };
    const finish = function () {
      if (timeoutId) clearTimeout(timeoutId);
      if (hasUsableSnapshotXlsxGlobal(window.XLSX)) {
        resolve(window.XLSX);
        return true;
      }
      return false;
    };
    let existing = document.querySelector('script[data-sadv-xlsx-lib="sheetjs"]');
    if (existing && existing.dataset.sadvXlsxState === "error") {
      existing.parentNode && existing.parentNode.removeChild(existing);
      existing = null;
    }
    if (finish()) return;
    const handleLoad = function () {
      if (existing) existing.dataset.sadvXlsxState = "ready";
      if (!finish()) finishWithError("sheetjs loaded but XLSX global missing", existing);
    };
    const handleError = function () {
      if (existing) existing.dataset.sadvXlsxState = "error";
      finishWithError(
        "failed to load sheetjs standalone runtime; check CSP/network access to " +
          SNAPSHOT_XLSX_STANDALONE_URL,
        existing,
      );
    };
    timeoutId = setTimeout(function () {
      if (existing) existing.dataset.sadvXlsxState = "error";
      finishWithError(
        "timed out while loading sheetjs standalone runtime; check CSP/network access to " +
          SNAPSHOT_XLSX_STANDALONE_URL,
        existing,
      );
    }, SNAPSHOT_XLSX_LIBRARY_TIMEOUT_MS);
    if (existing) {
      existing.addEventListener("load", handleLoad, { once: true });
      existing.addEventListener("error", handleError, { once: true });
      return;
    }
    const nextScript = document.createElement("script");
    nextScript.src = SNAPSHOT_XLSX_STANDALONE_URL;
    nextScript.async = true;
    nextScript.crossOrigin = "anonymous";
    const nonce =
      (document.currentScript && document.currentScript.nonce) ||
      (document.querySelector("script[nonce]") || {}).nonce ||
      "";
    if (nonce) nextScript.nonce = nonce;
    nextScript.dataset.sadvXlsxLib = "sheetjs";
    nextScript.dataset.sadvXlsxState = "loading";
    nextScript.addEventListener("load", function () {
      existing = nextScript;
      handleLoad();
    }, { once: true });
    nextScript.addEventListener("error", function () {
      existing = nextScript;
      handleError();
    }, { once: true });
    document.head.appendChild(nextScript);
  }).catch(function (error) {
    snapshotXlsxLibraryPromise = null;
    throw error;
  });
  return snapshotXlsxLibraryPromise;
}

function formatSnapshotXlsxSourceAccount(sourceAccount) {
  if (!sourceAccount) return "";
  if (typeof sourceAccount === "string") return sourceAccount;
  if (typeof sourceAccount === "object") {
    if (typeof sourceAccount.accountLabel === "string" && sourceAccount.accountLabel) {
      return sourceAccount.accountLabel;
    }
    if (typeof sourceAccount.email === "string" && sourceAccount.email) {
      return sourceAccount.email;
    }
    if (typeof sourceAccount.accountEncId === "string" && sourceAccount.accountEncId) {
      return sourceAccount.accountEncId;
    }
    if (typeof sourceAccount.encId === "string" && sourceAccount.encId) {
      return sourceAccount.encId;
    }
  }
  return String(sourceAccount);
}

function getSnapshotXlsxPrimaryAccountInfo(payload) {
  const accounts =
    payload && payload.accounts && typeof payload.accounts === "object" ? payload.accounts : {};
  const accountKeys = Object.keys(accounts).filter(Boolean);
  const primaryKey = accountKeys[0] || "";
  const primaryAccount = primaryKey ? accounts[primaryKey] || null : null;
  return {
    accountLabel:
      primaryKey ||
      (primaryAccount && typeof primaryAccount.accountLabel === "string"
        ? primaryAccount.accountLabel
        : "") ||
      (payload && typeof payload.accountLabel === "string" ? payload.accountLabel : ""),
    accountEncId:
      (primaryAccount && typeof primaryAccount.encId === "string" ? primaryAccount.encId : "") ||
      (payload && typeof payload.accountEncId === "string" ? payload.accountEncId : "") ||
      (payload && typeof payload.encId === "string" ? payload.encId : ""),
  };
}

function buildSnapshotXlsxAccountFallbackContext(payload) {
  const primaryAccount = getSnapshotXlsxPrimaryAccountInfo(payload);
  const accounts =
    payload && payload.accounts && typeof payload.accounts === "object" ? payload.accounts : {};
  const bySite = {};
  Object.keys(accounts).forEach(function (accountKey) {
    const account = accounts[accountKey];
    const dataBySite =
      account && account.dataBySite && typeof account.dataBySite === "object"
        ? account.dataBySite
        : {};
    Object.keys(dataBySite).forEach(function (site) {
      if (!site || bySite[site]) return;
      const siteData = dataBySite[site] || {};
      const sourceAccount =
        (siteData.__source && typeof siteData.__source === "object" && siteData.__source) ||
        (siteData.__meta && siteData.__meta.__source ? siteData.__meta.__source : null) ||
        (siteData._merge && siteData._merge.__source ? siteData._merge.__source : null) ||
        accountKey ||
        null;
      bySite[site] = {
        accountLabel:
          accountKey ||
          (sourceAccount && typeof sourceAccount === "object" && sourceAccount.accountLabel
            ? sourceAccount.accountLabel
            : "") ||
          "",
        sourceAccount: sourceAccount,
      };
    });
  });
  return {
    primaryAccount: primaryAccount,
    bySite: bySite,
  };
}

function getSnapshotXlsxRowAccountLabel(row, fallbackContext) {
  if (row && typeof row.accountLabel === "string" && row.accountLabel) return row.accountLabel;
  const site = row && row.site ? row.site : "";
  const siteFallback =
    site && fallbackContext && fallbackContext.bySite ? fallbackContext.bySite[site] : null;
  if (siteFallback && typeof siteFallback.accountLabel === "string" && siteFallback.accountLabel) {
    return siteFallback.accountLabel;
  }
  const sourceAccount = row ? row.sourceAccount : null;
  if (sourceAccount && typeof sourceAccount === "object") {
    if (typeof sourceAccount.accountLabel === "string" && sourceAccount.accountLabel) {
      return sourceAccount.accountLabel;
    }
    if (typeof sourceAccount.email === "string" && sourceAccount.email) {
      return sourceAccount.email;
    }
  }
  if (typeof sourceAccount === "string" && sourceAccount) return sourceAccount;
  return fallbackContext &&
    fallbackContext.primaryAccount &&
    typeof fallbackContext.primaryAccount.accountLabel === "string"
    ? fallbackContext.primaryAccount.accountLabel
    : "";
}

function getSnapshotXlsxRowSourceAccount(row, fallbackContext) {
  const sourceAccount = row ? row.sourceAccount : null;
  const formattedSource = formatSnapshotXlsxSourceAccount(sourceAccount);
  if (formattedSource) return formattedSource;
  const site = row && row.site ? row.site : "";
  const siteFallback =
    site && fallbackContext && fallbackContext.bySite ? fallbackContext.bySite[site] : null;
  if (siteFallback && siteFallback.sourceAccount) {
    const siteSource = formatSnapshotXlsxSourceAccount(siteFallback.sourceAccount);
    if (siteSource) return siteSource;
  }
  return fallbackContext &&
    fallbackContext.primaryAccount &&
    typeof fallbackContext.primaryAccount.accountLabel === "string"
    ? fallbackContext.primaryAccount.accountLabel
    : "";
}

function formatSnapshotXlsxDiagRange(range) {
  if (range == null || range === "") return "";
  if (typeof range === "string") return range;
  if (range && typeof range === "object") {
    const start =
      typeof range.start === "string"
        ? range.start
        : typeof range.startDate === "string"
          ? range.startDate
          : "";
    const end =
      typeof range.end === "string"
        ? range.end
        : typeof range.endDate === "string"
          ? range.endDate
          : "";
    if (start || end) return start && end ? start + "~" + end : start || end;
    try {
      return JSON.stringify(range);
    } catch (_) {
      return "";
    }
  }
  return String(range);
}

function normalizeSnapshotXlsxDate(value) {
  const digits = String(value || "").replace(/[^\d]/g, "").slice(0, 8);
  if (digits.length !== 8) return "";
  return digits.slice(0, 4) + "-" + digits.slice(4, 6) + "-" + digits.slice(6, 8);
}

function normalizeSnapshotXlsxNumber(value) {
  const num = Number(value);
  return Number.isFinite(num) ? num : 0;
}

function getSnapshotXlsxExportedAt(savedAt) {
  return savedAt && typeof savedAt.toISOString === "function"
    ? savedAt.toISOString()
    : savedAtIso(new Date());
}

function getSnapshotXlsxPeriodDays(payload) {
  const raw =
    payload && payload.ui && Object.prototype.hasOwnProperty.call(payload.ui, "allSitesPeriodDays")
      ? payload.ui.allSitesPeriodDays
      : payload && Object.prototype.hasOwnProperty.call(payload, "allSitesPeriodDays")
        ? payload.allSitesPeriodDays
        : 90;
  return typeof normalizeAllSitesPeriodDays === "function"
    ? normalizeAllSitesPeriodDays(raw)
    : 90;
}

function getSnapshotXlsxRuntimeType(payload) {
  if (
    payload &&
    payload.__meta &&
    typeof payload.__meta.runtimeType === "string" &&
    payload.__meta.runtimeType
  ) {
    return payload.__meta.runtimeType;
  }
  return getSnapshotSaveRuntimeType();
}

function getSnapshotXlsxRuntimeTypeLabel(runtimeType) {
  if (runtimeType === "snapshot") runtimeType = "saved";
  if (SNAPSHOT_XLSX_RUNTIME_LABELS[runtimeType]) {
    return SNAPSHOT_XLSX_RUNTIME_LABELS[runtimeType];
  }
  return runtimeType ? String(runtimeType) : "";
}

function getSnapshotXlsxSummaryRows(payload) {
  const baseRows = Array.isArray(payload && payload.summaryRows) ? payload.summaryRows : [];
  const periodDays = getSnapshotXlsxPeriodDays(payload);
  if (typeof deriveAllSitesPeriodRows === "function") {
    return deriveAllSitesPeriodRows(baseRows, periodDays);
  }
  return baseRows;
}

function getSnapshotXlsxSiteEntries(payload, fallbackContext) {
  const accounts =
    payload && payload.accounts && typeof payload.accounts === "object" ? payload.accounts : {};
  const entries = [];
  Object.keys(accounts).forEach(function (accountKey) {
    const account = accounts[accountKey];
    const dataBySite =
      account && account.dataBySite && typeof account.dataBySite === "object"
        ? account.dataBySite
        : {};
    Object.keys(dataBySite).forEach(function (site) {
      if (!site) return;
      const siteData = dataBySite[site] || {};
      entries.push({
        site: site,
        siteData: siteData,
        accountLabel: getSnapshotXlsxRowAccountLabel(
          { site: site, accountLabel: accountKey || "", sourceAccount: siteData.__source || null },
          fallbackContext,
        ),
        sourceAccount: getSnapshotXlsxRowSourceAccount(
          { site: site, accountLabel: accountKey || "", sourceAccount: siteData.__source || null },
          fallbackContext,
        ),
      });
    });
  });
  return entries;
}

function buildSnapshotXlsxSiteDailyRows(savedAt, payload, fallbackContext) {
  const exportedAt = getSnapshotXlsxExportedAt(savedAt);
  const runtimeType = getSnapshotXlsxRuntimeType(payload);
  const runtimeTypeLabel = getSnapshotXlsxRuntimeTypeLabel(runtimeType);
  const periodDays = getSnapshotXlsxPeriodDays(payload);
  return getSnapshotXlsxSummaryRows(payload).flatMap(function (row) {
    const clicks = Array.isArray(row && row.clicks) ? row.clicks : [];
    const exposes = Array.isArray(row && row.exposes) ? row.exposes : [];
    const dates = Array.isArray(row && row.dates) ? row.dates : [];
    const rowCount = Math.max(clicks.length, exposes.length, dates.length);
    if (!rowCount) return [];
    return Array.from({ length: rowCount }, function (_, index) {
      const dailyClicks = normalizeSnapshotXlsxNumber(clicks[index]);
      const dailyExposes = normalizeSnapshotXlsxNumber(exposes[index]);
      return {
        date: normalizeSnapshotXlsxDate(dates[index]),
        site: row && row.site ? row.site : "",
        account_label: getSnapshotXlsxRowAccountLabel(row, fallbackContext),
        source_account: getSnapshotXlsxRowSourceAccount(row, fallbackContext),
        runtime_type: runtimeTypeLabel,
        period_days: periodDays,
        exported_at: exportedAt,
        daily_clicks: dailyClicks,
        daily_exposes: dailyExposes,
        daily_ctr: dailyExposes > 0 ? +((dailyClicks / dailyExposes) * 100).toFixed(2) : 0,
        site_total_clicks: normalizeSnapshotXlsxNumber(row && row.totalC),
        site_total_exposes: normalizeSnapshotXlsxNumber(row && row.totalE),
        site_avg_ctr: normalizeSnapshotXlsxNumber(row && row.avgCtr),
        site_trend: normalizeSnapshotXlsxNumber(row && row.trend),
        site_latest_click: normalizeSnapshotXlsxNumber(row && row.latestClick),
        site_prev_click_ratio: normalizeSnapshotXlsxNumber(row && row.prevClickRatio),
        diagnosis_index_current: normalizeSnapshotXlsxNumber(row && row.diagnosisIndexedCurrent),
        diagnosis_meta_code:
          row && row.diagnosisMetaCode != null ? String(row.diagnosisMetaCode) : "",
        diagnosis_meta_status:
          row && row.diagnosisMetaStatus != null ? String(row.diagnosisMetaStatus) : "",
        diagnosis_meta_range: formatSnapshotXlsxDiagRange(row && row.diagnosisMetaRange),
      };
    });
  });
}

function buildSnapshotXlsxSiteSummaryRows(savedAt, payload, fallbackContext) {
  const exportedAt = getSnapshotXlsxExportedAt(savedAt);
  const runtimeType = getSnapshotXlsxRuntimeType(payload);
  const runtimeTypeLabel = getSnapshotXlsxRuntimeTypeLabel(runtimeType);
  const periodDays = getSnapshotXlsxPeriodDays(payload);
  return getSnapshotXlsxSummaryRows(payload).map(function (row) {
    return {
      site: row && row.site ? row.site : "",
      account_label: getSnapshotXlsxRowAccountLabel(row, fallbackContext),
      source_account: getSnapshotXlsxRowSourceAccount(row, fallbackContext),
      runtime_type: runtimeTypeLabel,
      period_days: periodDays,
      exported_at: exportedAt,
      total_clicks: normalizeSnapshotXlsxNumber(row && row.totalC),
      total_exposes: normalizeSnapshotXlsxNumber(row && row.totalE),
      avg_ctr: normalizeSnapshotXlsxNumber(row && row.avgCtr),
      trend: normalizeSnapshotXlsxNumber(row && row.trend),
      latest_click: normalizeSnapshotXlsxNumber(row && row.latestClick),
      prev_click_ratio: normalizeSnapshotXlsxNumber(row && row.prevClickRatio),
      diagnosis_index_current: normalizeSnapshotXlsxNumber(row && row.diagnosisIndexedCurrent),
      diagnosis_meta_code:
        row && row.diagnosisMetaCode != null ? String(row.diagnosisMetaCode) : "",
      diagnosis_meta_status:
        row && row.diagnosisMetaStatus != null ? String(row.diagnosisMetaStatus) : "",
      diagnosis_meta_range: formatSnapshotXlsxDiagRange(row && row.diagnosisMetaRange),
    };
  });
}

function buildSnapshotXlsxSiteMetaRows(savedAt, payload, fallbackContext) {
  const exportedAt = getSnapshotXlsxExportedAt(savedAt);
  const runtimeType = getSnapshotXlsxRuntimeType(payload);
  const runtimeTypeLabel = getSnapshotXlsxRuntimeTypeLabel(runtimeType);
  return getSnapshotXlsxSummaryRows(payload).map(function (row) {
    return {
      site: row && row.site ? row.site : "",
      account_label: getSnapshotXlsxRowAccountLabel(row, fallbackContext),
      source_account: getSnapshotXlsxRowSourceAccount(row, fallbackContext),
      runtime_type: runtimeTypeLabel,
      exported_at: exportedAt,
      diagnosis_meta_code:
        row && row.diagnosisMetaCode != null ? String(row.diagnosisMetaCode) : "",
      diagnosis_meta_status:
        row && row.diagnosisMetaStatus != null ? String(row.diagnosisMetaStatus) : "",
      diagnosis_meta_range: formatSnapshotXlsxDiagRange(row && row.diagnosisMetaRange),
    };
  });
}

function buildSnapshotXlsxQueryRows(savedAt, payload, fallbackContext) {
  const exportedAt = getSnapshotXlsxExportedAt(savedAt);
  const runtimeTypeLabel = getSnapshotXlsxRuntimeTypeLabel(getSnapshotXlsxRuntimeType(payload));
  const periodDays = getSnapshotXlsxPeriodDays(payload);
  return getSnapshotXlsxSiteEntries(payload, fallbackContext).flatMap(function (entry) {
    const exposeItem =
      entry &&
      entry.siteData &&
      entry.siteData.expose &&
      Array.isArray(entry.siteData.expose.items) &&
      entry.siteData.expose.items.length
        ? entry.siteData.expose.items[0] || {}
        : {};
    const queries = Array.isArray(exposeItem.querys) ? exposeItem.querys : [];
    return queries.map(function (query) {
      return {
        site: entry.site,
        account_label: entry.accountLabel,
        source_account: entry.sourceAccount,
        runtime_type: runtimeTypeLabel,
        period_days: periodDays,
        exported_at: exportedAt,
        query: query && query.key != null ? String(query.key) : "",
        clicks: normalizeSnapshotXlsxNumber(query && query.clickCount),
        exposes: normalizeSnapshotXlsxNumber(query && query.exposeCount),
        ctr: normalizeSnapshotXlsxNumber(query && query.ctr),
      };
    });
  });
}

function buildSnapshotXlsxPageRows(savedAt, payload, fallbackContext) {
  const exportedAt = getSnapshotXlsxExportedAt(savedAt);
  const runtimeTypeLabel = getSnapshotXlsxRuntimeTypeLabel(getSnapshotXlsxRuntimeType(payload));
  const periodDays = getSnapshotXlsxPeriodDays(payload);
  return getSnapshotXlsxSiteEntries(payload, fallbackContext).flatMap(function (entry) {
    const exposeItem =
      entry &&
      entry.siteData &&
      entry.siteData.expose &&
      Array.isArray(entry.siteData.expose.items) &&
      entry.siteData.expose.items.length
        ? entry.siteData.expose.items[0] || {}
        : {};
    const urls = Array.isArray(exposeItem.urls) ? exposeItem.urls : [];
    return urls.map(function (urlRow) {
      return {
        site: entry.site,
        account_label: entry.accountLabel,
        source_account: entry.sourceAccount,
        runtime_type: runtimeTypeLabel,
        period_days: periodDays,
        exported_at: exportedAt,
        url: urlRow && urlRow.key != null ? String(urlRow.key) : "",
        clicks: normalizeSnapshotXlsxNumber(urlRow && urlRow.clickCount),
        exposes: normalizeSnapshotXlsxNumber(urlRow && urlRow.exposeCount),
        ctr: normalizeSnapshotXlsxNumber(urlRow && urlRow.ctr),
      };
    });
  });
}

function buildSnapshotXlsxIndexedRows(savedAt, payload, fallbackContext) {
  const exportedAt = getSnapshotXlsxExportedAt(savedAt);
  const runtimeTypeLabel = getSnapshotXlsxRuntimeTypeLabel(getSnapshotXlsxRuntimeType(payload));
  const periodDays = getSnapshotXlsxPeriodDays(payload);
  return getSnapshotXlsxSiteEntries(payload, fallbackContext).flatMap(function (entry) {
    const diagnosisItem =
      entry &&
      entry.siteData &&
      entry.siteData.diagnosisMeta &&
      Array.isArray(entry.siteData.diagnosisMeta.items) &&
      entry.siteData.diagnosisMeta.items.length
        ? entry.siteData.diagnosisMeta.items[0] || {}
        : {};
    const logs = Array.isArray(diagnosisItem.meta) ? diagnosisItem.meta : [];
    return logs
      .slice()
      .sort(function (a, b) {
        return String((a && a.date) || "").localeCompare(String((b && b.date) || ""));
      })
      .map(function (logRow) {
        const stateCount = logRow && typeof logRow.stateCount === "object" ? logRow.stateCount : {};
        const indexedCount = normalizeSnapshotXlsxNumber(stateCount["1"]);
        const pendingCount = normalizeSnapshotXlsxNumber(stateCount["2"]);
        const errorCount = normalizeSnapshotXlsxNumber(stateCount["3"]);
        const droppedCount = normalizeSnapshotXlsxNumber(stateCount["4"]);
        return {
          date: normalizeSnapshotXlsxDate(logRow && logRow.date),
          site: entry.site,
          account_label: entry.accountLabel,
          source_account: entry.sourceAccount,
          runtime_type: runtimeTypeLabel,
          period_days: periodDays,
          exported_at: exportedAt,
          indexed_count: indexedCount,
          pending_count: pendingCount,
          error_count: errorCount,
          dropped_count: droppedCount,
          total_count: indexedCount + pendingCount + errorCount + droppedCount,
        };
      });
  });
}

function getSnapshotXlsxSheetColumns() {
  return {
    daily: [
      { key: "date", header: "날짜", width: 14 },
      { key: "site", header: "사이트", width: 34 },
      { key: "account_label", header: "계정 라벨", width: 24 },
      { key: "source_account", header: "소스 계정", width: 24 },
      { key: "runtime_type", header: "런타임 유형", width: 14 },
      { key: "period_days", header: "기간(일)", width: 12 },
      { key: "exported_at", header: "생성 시각", width: 24 },
      { key: "daily_clicks", header: "일별 클릭", width: 14 },
      { key: "daily_exposes", header: "일별 노출", width: 14 },
      { key: "daily_ctr", header: "일별 CTR(%)", width: 12 },
      { key: "site_total_clicks", header: "사이트 총 클릭", width: 16 },
      { key: "site_total_exposes", header: "사이트 총 노출", width: 17 },
      { key: "site_avg_ctr", header: "사이트 평균 CTR(%)", width: 17 },
      { key: "site_trend", header: "클릭 추세", width: 13 },
      { key: "site_latest_click", header: "최근 클릭", width: 16 },
      { key: "site_prev_click_ratio", header: "직전 대비(%)", width: 19 },
      { key: "diagnosis_index_current", header: "진단 지수 현재값", width: 21 },
      { key: "diagnosis_meta_code", header: "진단 코드", width: 20 },
      { key: "diagnosis_meta_status", header: "진단 상태", width: 22 },
      { key: "diagnosis_meta_range", header: "진단 범위", width: 28 },
    ],
    summary: [
      { key: "site", header: "사이트", width: 34 },
      { key: "account_label", header: "계정 라벨", width: 24 },
      { key: "source_account", header: "소스 계정", width: 24 },
      { key: "runtime_type", header: "런타임 유형", width: 14 },
      { key: "period_days", header: "기간(일)", width: 12 },
      { key: "exported_at", header: "생성 시각", width: 24 },
      { key: "total_clicks", header: "총 클릭", width: 14 },
      { key: "total_exposes", header: "총 노출", width: 15 },
      { key: "avg_ctr", header: "평균 CTR(%)", width: 12 },
      { key: "trend", header: "클릭 추세", width: 12 },
      { key: "latest_click", header: "최근 클릭", width: 14 },
      { key: "prev_click_ratio", header: "직전 대비(%)", width: 17 },
      { key: "diagnosis_index_current", header: "진단 지수 현재값", width: 21 },
      { key: "diagnosis_meta_code", header: "진단 코드", width: 20 },
      { key: "diagnosis_meta_status", header: "진단 상태", width: 22 },
      { key: "diagnosis_meta_range", header: "진단 범위", width: 28 },
    ],
    meta: [
      { key: "site", header: "사이트", width: 34 },
      { key: "account_label", header: "계정 라벨", width: 24 },
      { key: "source_account", header: "소스 계정", width: 24 },
      { key: "runtime_type", header: "런타임 유형", width: 14 },
      { key: "exported_at", header: "생성 시각", width: 24 },
      { key: "diagnosis_meta_code", header: "진단 코드", width: 20 },
      { key: "diagnosis_meta_status", header: "진단 상태", width: 22 },
      { key: "diagnosis_meta_range", header: "진단 범위", width: 28 },
    ],
    queries: [
      { key: "site", header: "사이트", width: 34 },
      { key: "account_label", header: "계정 라벨", width: 24 },
      { key: "source_account", header: "소스 계정", width: 24 },
      { key: "runtime_type", header: "런타임 유형", width: 14 },
      { key: "period_days", header: "기간(일)", width: 12 },
      { key: "exported_at", header: "생성 시각", width: 24 },
      { key: "query", header: "검색어", width: 32 },
      { key: "clicks", header: "클릭", width: 12 },
      { key: "exposes", header: "노출", width: 12 },
      { key: "ctr", header: "CTR(%)", width: 12 },
    ],
    pages: [
      { key: "site", header: "사이트", width: 34 },
      { key: "account_label", header: "계정 라벨", width: 24 },
      { key: "source_account", header: "소스 계정", width: 24 },
      { key: "runtime_type", header: "런타임 유형", width: 14 },
      { key: "period_days", header: "기간(일)", width: 12 },
      { key: "exported_at", header: "생성 시각", width: 24 },
      { key: "url", header: "URL", width: 64 },
      { key: "clicks", header: "클릭", width: 12 },
      { key: "exposes", header: "노출", width: 12 },
      { key: "ctr", header: "CTR(%)", width: 12 },
    ],
    indexed: [
      { key: "date", header: "날짜", width: 14 },
      { key: "site", header: "사이트", width: 34 },
      { key: "account_label", header: "계정 라벨", width: 24 },
      { key: "source_account", header: "소스 계정", width: 24 },
      { key: "runtime_type", header: "런타임 유형", width: 14 },
      { key: "period_days", header: "기간(일)", width: 12 },
      { key: "exported_at", header: "생성 시각", width: 24 },
      { key: "indexed_count", header: "색인 수", width: 12 },
      { key: "pending_count", header: "대기 수", width: 12 },
      { key: "error_count", header: "오류 수", width: 12 },
      { key: "dropped_count", header: "제외 수", width: 12 },
      { key: "total_count", header: "총 상태 수", width: 12 },
    ],
  };
}

function buildSnapshotXlsxDataSheet(XLSX, columns, rows) {
  const aoa = [
    columns.map(function (column) {
      return column.header;
    }),
  ].concat(
    rows.map(function (row) {
      return columns.map(function (column) {
        const value = row && Object.prototype.hasOwnProperty.call(row, column.key) ? row[column.key] : "";
        if (value == null) return "";
        return value;
      });
    }),
  );
  const ws = XLSX.utils.aoa_to_sheet(aoa);
  ws["!cols"] = columns.map(function (column) {
    return { wch: column.width || 14 };
  });
  if (aoa.length > 1) {
    ws["!autofilter"] = { ref: ws["!ref"] };
  }
  return ws;
}

function buildSnapshotXlsxReadmeSheet(XLSX, savedAt, payload, dailyRows, summaryRows, metaRows, queryRows, pageRows, indexedRows) {
  const exportedAt = getSnapshotXlsxExportedAt(savedAt);
  const periodDays = getSnapshotXlsxPeriodDays(payload);
  const runtimeType = getSnapshotXlsxRuntimeType(payload);
  const runtimeTypeLabel = getSnapshotXlsxRuntimeTypeLabel(runtimeType);
  const siteCount = Array.isArray(payload && payload.summaryRows) ? payload.summaryRows.length : 0;
  const aoa = [
    ["항목", "값"],
    ["생성 시각", exportedAt],
    ["런타임 유형", runtimeTypeLabel],
    ["기간(일)", periodDays],
    ["사이트 수", siteCount],
    ["사이트 일별 행 수", dailyRows.length],
    ["사이트 요약 행 수", summaryRows.length],
    ["사이트 메타 행 수", metaRows.length],
    ["검색어 행 수", queryRows.length],
    ["페이지 행 수", pageRows.length],
    ["색인 행 수", indexedRows.length],
    ["워크북 버전", "xlsx-phase1-expanded"],
    ["메인 시트", SNAPSHOT_XLSX_SHEET_NAMES.daily],
    ["행 기준", "1행 = 1사이트 × 1날짜"],
    ["설명", "기존 HTML 저장 계약을 재사용하고, 사이트 일별/요약/메타에 더해 검색어·페이지·색인 시트를 함께 제공합니다."],
  ];
  const ws = XLSX.utils.aoa_to_sheet(aoa);
  ws["!cols"] = [{ wch: 22 }, { wch: 48 }];
  return ws;
}

function buildSnapshotXlsxWorkbook(savedAt, payload) {
  const XLSX = window.XLSX;
  const columns = getSnapshotXlsxSheetColumns();
  const fallbackContext = buildSnapshotXlsxAccountFallbackContext(payload);
  const dailyRows = buildSnapshotXlsxSiteDailyRows(savedAt, payload, fallbackContext);
  const summaryRows = buildSnapshotXlsxSiteSummaryRows(savedAt, payload, fallbackContext);
  const metaRows = buildSnapshotXlsxSiteMetaRows(savedAt, payload, fallbackContext);
  const queryRows = buildSnapshotXlsxQueryRows(savedAt, payload, fallbackContext);
  const pageRows = buildSnapshotXlsxPageRows(savedAt, payload, fallbackContext);
  const indexedRows = buildSnapshotXlsxIndexedRows(savedAt, payload, fallbackContext);
  const wb = XLSX.utils.book_new();
  wb.Props = {
    Title: "서치어드바이저 상세 엑셀 내보내기",
    Subject: "서치어드바이저 XLSX 내보내기",
    Author: "서치어드바이저 런타임",
    CreatedDate: savedAt instanceof Date ? savedAt : new Date(),
  };
  XLSX.utils.book_append_sheet(
    wb,
    buildSnapshotXlsxReadmeSheet(
      XLSX,
      savedAt,
      payload,
      dailyRows,
      summaryRows,
      metaRows,
      queryRows,
      pageRows,
      indexedRows,
    ),
    SNAPSHOT_XLSX_SHEET_NAMES.readme,
  );
  XLSX.utils.book_append_sheet(
    wb,
    buildSnapshotXlsxDataSheet(XLSX, columns.daily, dailyRows),
    SNAPSHOT_XLSX_SHEET_NAMES.daily,
  );
  XLSX.utils.book_append_sheet(
    wb,
    buildSnapshotXlsxDataSheet(XLSX, columns.summary, summaryRows),
    SNAPSHOT_XLSX_SHEET_NAMES.summary,
  );
  XLSX.utils.book_append_sheet(
    wb,
    buildSnapshotXlsxDataSheet(XLSX, columns.meta, metaRows),
    SNAPSHOT_XLSX_SHEET_NAMES.meta,
  );
  XLSX.utils.book_append_sheet(
    wb,
    buildSnapshotXlsxDataSheet(XLSX, columns.queries, queryRows),
    SNAPSHOT_XLSX_SHEET_NAMES.queries,
  );
  XLSX.utils.book_append_sheet(
    wb,
    buildSnapshotXlsxDataSheet(XLSX, columns.pages, pageRows),
    SNAPSHOT_XLSX_SHEET_NAMES.pages,
  );
  XLSX.utils.book_append_sheet(
    wb,
    buildSnapshotXlsxDataSheet(XLSX, columns.indexed, indexedRows),
    SNAPSHOT_XLSX_SHEET_NAMES.indexed,
  );
  return {
    workbook: wb,
    dailyRows: dailyRows,
    summaryRows: summaryRows,
    metaRows: metaRows,
    queryRows: queryRows,
    pageRows: pageRows,
    indexedRows: indexedRows,
  };
}

async function downloadSnapshotXlsx(options) {
  const outputMeta = getSnapshotSaveOutputMeta("xlsx");
  const capabilities =
    typeof getRuntimeCapabilities === "function" ? getRuntimeCapabilities() : null;
  if (capabilities && capabilities.isReadOnly) {
    throw new Error("xlsx export is disabled in read-only mode");
  }
  const payload = options && options.payload ? options.payload : null;
  if (!payload) {
    throw new Error("xlsx export requires a precomputed payload");
  }
  const runtimeSites =
    typeof getRuntimeAllSites === "function" ? getRuntimeAllSites() : allSites;
  const startedAt =
    options && typeof options.startedAt === "number" ? options.startedAt : Date.now();
  const cacheDecision =
    options && options.cacheDecision && typeof options.cacheDecision === "object"
      ? options.cacheDecision
      : { neededRefresh: false, reason: null, missingSites: 0, expiredSites: 0 };
  const btn = getSnapshotSaveTriggerButton("xlsx");
  const originalText = btn ? btn.textContent : "엑셀";
  setSnapshotSaveButtonBusy(btn, "엑셀");
  try {
    const saveBlockDecision = buildSnapshotSaveBlockDecision(payload, runtimeSites);
    if (saveBlockDecision.blocked) {
      showError(
        saveBlockDecision.userMessage,
        saveBlockDecision.technicalMessage,
        "downloadSnapshotXlsx-blocked",
        {
          dedupeKey: "downloadSnapshotXlsx-blocked::" + saveBlockDecision.reason,
          dedupeWindowMs: 1500,
        },
      );
      pushSnapshotSaveStatus({
        active: false,
        state: "blocked",
        phase: "download",
        stageLabel: outputMeta.blockedTitle,
        detail: saveBlockDecision.detail,
        completedAt: Date.now(),
        cacheDecision: cacheDecision,
        stats: saveBlockDecision.stats,
        outputFormat: outputMeta.outputFormat,
        fileName: null,
        site: null,
        error: {
          message: saveBlockDecision.userMessage,
          context: "downloadSnapshotXlsx-blocked",
        },
      });
      return {
        ok: false,
        status: "blocked",
        reason: saveBlockDecision.reason,
        downloaded: false,
        outputFormat: outputMeta.outputFormat,
        stats: saveBlockDecision.stats,
        block: saveBlockDecision,
      };
    }

    // `building-html`은 historical generic save phase 이름이다.
    // HTML/XLSX 모두 동일한 save state contract를 재사용하고,
    // 실제 포맷 구분은 stageLabel/outputFormat이 담당한다.
    pushSnapshotSaveStatus({
      active: true,
      state: "building-html",
      phase: "download",
      stageLabel: outputMeta.buildingTitle,
      detail: "엑셀 라이브러리를 준비하고 시트를 조립하고 있어요.",
      startedAt: startedAt,
      progress: {
        done: runtimeSites.length,
        total: runtimeSites.length,
        ratio: 1,
        percent: 100,
      },
      stats: payload && payload.stats ? payload.stats : { success: 0, partial: 0, failed: 0, errors: [] },
      site: null,
      cacheDecision: cacheDecision,
      outputFormat: outputMeta.outputFormat,
    });

    await ensureSnapshotXlsxLibrary();
    const savedAt = new Date();
    const workbookBundle = buildSnapshotXlsxWorkbook(savedAt, payload);
    const workbookBytes = window.XLSX.write(workbookBundle.workbook, {
      bookType: "xlsx",
      type: "array",
      compression: true,
    });
    const fileName = buildSnapshotDownloadFileName(savedAt, "xlsx");

    pushSnapshotSaveStatus({
      active: true,
      state: "triggering-download",
      phase: "download",
      stageLabel: outputMeta.triggeringTitle,
      detail:
        "메인 시트 " +
        workbookBundle.dailyRows.length +
        "행을 포함한 상세 엑셀 파일 다운로드를 시작하고 있어요.",
      fileName: fileName,
      cacheDecision: cacheDecision,
      outputFormat: outputMeta.outputFormat,
    });

    const blob = new Blob([workbookBytes], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    link.remove();
    setTimeout(function () {
      URL.revokeObjectURL(link.href);
    }, 1000);

    const saveStats =
      payload && payload.stats ? payload.stats : { success: 0, partial: 0, failed: 0, errors: [] };
    const hasIssues = hasSnapshotSaveIssues(saveStats);
    if (hasIssues && typeof renderFailureSummary === "function") {
      renderFailureSummary(saveStats);
    }
    pushSnapshotSaveStatus({
      active: false,
      state: hasIssues ? "completed-with-issues" : "completed",
      phase: "download",
      stageLabel: hasIssues ? outputMeta.completedWithIssuesTitle : outputMeta.completedTitle,
      detail: hasIssues
        ? buildSnapshotSaveIssuesDetail(saveStats, fileName, outputMeta.outputFormat)
        : "브라우저 다운로드 요청을 전송했어요.",
      fileName: fileName,
      completedAt: Date.now(),
      cacheDecision: cacheDecision,
      stats: saveStats,
      outputFormat: outputMeta.outputFormat,
    });
    return {
      ok: true,
      status: hasIssues ? "completed-with-issues" : "completed",
      hasIssues: hasIssues,
      outputFormat: outputMeta.outputFormat,
      fileName: fileName,
      payload: payload,
      stats: saveStats,
      workbook: {
        sheetNames: [
          SNAPSHOT_XLSX_SHEET_NAMES.readme,
          SNAPSHOT_XLSX_SHEET_NAMES.daily,
          SNAPSHOT_XLSX_SHEET_NAMES.summary,
          SNAPSHOT_XLSX_SHEET_NAMES.meta,
          SNAPSHOT_XLSX_SHEET_NAMES.queries,
          SNAPSHOT_XLSX_SHEET_NAMES.pages,
          SNAPSHOT_XLSX_SHEET_NAMES.indexed,
        ],
        dailyRowCount: workbookBundle.dailyRows.length,
        summaryRowCount: workbookBundle.summaryRows.length,
        metaRowCount: workbookBundle.metaRows.length,
        queryRowCount: workbookBundle.queryRows.length,
        pageRowCount: workbookBundle.pageRows.length,
        indexedRowCount: workbookBundle.indexedRows.length,
      },
    };
  } catch (e) {
    showError(outputMeta.errorMessage, e, "downloadSnapshotXlsx");
    pushSnapshotSaveStatus({
      active: false,
      state: "failed",
      phase: "download",
      stageLabel: outputMeta.failedTitle,
      detail: outputMeta.errorMessage,
      completedAt: Date.now(),
      cacheDecision: cacheDecision,
      outputFormat: outputMeta.outputFormat,
      fileName: null,
      site: null,
      error: {
        message: e && e.message ? e.message : outputMeta.errorMessage,
        context: "downloadSnapshotXlsx",
      },
    });
    return {
      ok: false,
      status: "failed",
      downloaded: false,
      outputFormat: outputMeta.outputFormat,
      error: e,
    };
  } finally {
    restoreSnapshotSaveButton(btn, originalText);
  }
}
