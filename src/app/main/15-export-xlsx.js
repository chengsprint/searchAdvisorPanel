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

function getSnapshotXlsxSummaryRows(payload) {
  const baseRows = Array.isArray(payload && payload.summaryRows) ? payload.summaryRows : [];
  const periodDays = getSnapshotXlsxPeriodDays(payload);
  if (typeof deriveAllSitesPeriodRows === "function") {
    return deriveAllSitesPeriodRows(baseRows, periodDays);
  }
  return baseRows;
}

function buildSnapshotXlsxSiteDailyRows(savedAt, payload) {
  const exportedAt = getSnapshotXlsxExportedAt(savedAt);
  const runtimeType = getSnapshotXlsxRuntimeType(payload);
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
        account_label: row && row.accountLabel ? row.accountLabel : "",
        source_account: formatSnapshotXlsxSourceAccount(row ? row.sourceAccount : null),
        runtime_type: runtimeType,
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

function buildSnapshotXlsxSiteSummaryRows(savedAt, payload) {
  const exportedAt = getSnapshotXlsxExportedAt(savedAt);
  const runtimeType = getSnapshotXlsxRuntimeType(payload);
  const periodDays = getSnapshotXlsxPeriodDays(payload);
  return getSnapshotXlsxSummaryRows(payload).map(function (row) {
    return {
      site: row && row.site ? row.site : "",
      account_label: row && row.accountLabel ? row.accountLabel : "",
      source_account: formatSnapshotXlsxSourceAccount(row ? row.sourceAccount : null),
      runtime_type: runtimeType,
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

function buildSnapshotXlsxSiteMetaRows(savedAt, payload) {
  const exportedAt = getSnapshotXlsxExportedAt(savedAt);
  const runtimeType = getSnapshotXlsxRuntimeType(payload);
  return getSnapshotXlsxSummaryRows(payload).map(function (row) {
    return {
      site: row && row.site ? row.site : "",
      account_label: row && row.accountLabel ? row.accountLabel : "",
      source_account: formatSnapshotXlsxSourceAccount(row ? row.sourceAccount : null),
      runtime_type: runtimeType,
      exported_at: exportedAt,
      diagnosis_meta_code:
        row && row.diagnosisMetaCode != null ? String(row.diagnosisMetaCode) : "",
      diagnosis_meta_status:
        row && row.diagnosisMetaStatus != null ? String(row.diagnosisMetaStatus) : "",
      diagnosis_meta_range: formatSnapshotXlsxDiagRange(row && row.diagnosisMetaRange),
    };
  });
}

function getSnapshotXlsxSheetColumns() {
  return {
    daily: [
      { key: "date", header: "date", width: 14 },
      { key: "site", header: "site", width: 34 },
      { key: "account_label", header: "account_label", width: 24 },
      { key: "source_account", header: "source_account", width: 24 },
      { key: "runtime_type", header: "runtime_type", width: 14 },
      { key: "period_days", header: "period_days", width: 12 },
      { key: "exported_at", header: "exported_at", width: 24 },
      { key: "daily_clicks", header: "daily_clicks", width: 14 },
      { key: "daily_exposes", header: "daily_exposes", width: 14 },
      { key: "daily_ctr", header: "daily_ctr", width: 12 },
      { key: "site_total_clicks", header: "site_total_clicks", width: 16 },
      { key: "site_total_exposes", header: "site_total_exposes", width: 17 },
      { key: "site_avg_ctr", header: "site_avg_ctr", width: 13 },
      { key: "site_trend", header: "site_trend", width: 13 },
      { key: "site_latest_click", header: "site_latest_click", width: 16 },
      { key: "site_prev_click_ratio", header: "site_prev_click_ratio", width: 19 },
      { key: "diagnosis_index_current", header: "diagnosis_index_current", width: 21 },
      { key: "diagnosis_meta_code", header: "diagnosis_meta_code", width: 20 },
      { key: "diagnosis_meta_status", header: "diagnosis_meta_status", width: 22 },
      { key: "diagnosis_meta_range", header: "diagnosis_meta_range", width: 28 },
    ],
    summary: [
      { key: "site", header: "site", width: 34 },
      { key: "account_label", header: "account_label", width: 24 },
      { key: "source_account", header: "source_account", width: 24 },
      { key: "runtime_type", header: "runtime_type", width: 14 },
      { key: "period_days", header: "period_days", width: 12 },
      { key: "exported_at", header: "exported_at", width: 24 },
      { key: "total_clicks", header: "total_clicks", width: 14 },
      { key: "total_exposes", header: "total_exposes", width: 15 },
      { key: "avg_ctr", header: "avg_ctr", width: 12 },
      { key: "trend", header: "trend", width: 12 },
      { key: "latest_click", header: "latest_click", width: 14 },
      { key: "prev_click_ratio", header: "prev_click_ratio", width: 17 },
      { key: "diagnosis_index_current", header: "diagnosis_index_current", width: 21 },
      { key: "diagnosis_meta_code", header: "diagnosis_meta_code", width: 20 },
      { key: "diagnosis_meta_status", header: "diagnosis_meta_status", width: 22 },
      { key: "diagnosis_meta_range", header: "diagnosis_meta_range", width: 28 },
    ],
    meta: [
      { key: "site", header: "site", width: 34 },
      { key: "account_label", header: "account_label", width: 24 },
      { key: "source_account", header: "source_account", width: 24 },
      { key: "runtime_type", header: "runtime_type", width: 14 },
      { key: "exported_at", header: "exported_at", width: 24 },
      { key: "diagnosis_meta_code", header: "diagnosis_meta_code", width: 20 },
      { key: "diagnosis_meta_status", header: "diagnosis_meta_status", width: 22 },
      { key: "diagnosis_meta_range", header: "diagnosis_meta_range", width: 28 },
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

function buildSnapshotXlsxReadmeSheet(XLSX, savedAt, payload, dailyRows, summaryRows, metaRows) {
  const exportedAt = getSnapshotXlsxExportedAt(savedAt);
  const periodDays = getSnapshotXlsxPeriodDays(payload);
  const runtimeType = getSnapshotXlsxRuntimeType(payload);
  const siteCount = Array.isArray(payload && payload.summaryRows) ? payload.summaryRows.length : 0;
  const aoa = [
    ["field", "value"],
    ["generated_at", exportedAt],
    ["runtime_type", runtimeType],
    ["period_days", periodDays],
    ["site_count", siteCount],
    ["site_daily_rows", dailyRows.length],
    ["site_summary_rows", summaryRows.length],
    ["site_meta_rows", metaRows.length],
    ["workbook_version", "xlsx-phase1-core"],
    ["main_sheet", "site_daily"],
    ["row_grain", "1 row = 1 site × 1 date"],
    ["notes", "existing HTML save contract reused; output adapter only"],
  ];
  const ws = XLSX.utils.aoa_to_sheet(aoa);
  ws["!cols"] = [{ wch: 22 }, { wch: 48 }];
  return ws;
}

function buildSnapshotXlsxWorkbook(savedAt, payload) {
  const XLSX = window.XLSX;
  const columns = getSnapshotXlsxSheetColumns();
  const dailyRows = buildSnapshotXlsxSiteDailyRows(savedAt, payload);
  const summaryRows = buildSnapshotXlsxSiteSummaryRows(savedAt, payload);
  const metaRows = buildSnapshotXlsxSiteMetaRows(savedAt, payload);
  const wb = XLSX.utils.book_new();
  wb.Props = {
    Title: "SearchAdvisor Detailed Export",
    Subject: "SearchAdvisor XLSX Export",
    Author: "SearchAdvisor Runtime",
    CreatedDate: savedAt instanceof Date ? savedAt : new Date(),
  };
  XLSX.utils.book_append_sheet(
    wb,
    buildSnapshotXlsxReadmeSheet(XLSX, savedAt, payload, dailyRows, summaryRows, metaRows),
    "README",
  );
  XLSX.utils.book_append_sheet(
    wb,
    buildSnapshotXlsxDataSheet(XLSX, columns.daily, dailyRows),
    "site_daily",
  );
  XLSX.utils.book_append_sheet(
    wb,
    buildSnapshotXlsxDataSheet(XLSX, columns.summary, summaryRows),
    "site_summary",
  );
  XLSX.utils.book_append_sheet(
    wb,
    buildSnapshotXlsxDataSheet(XLSX, columns.meta, metaRows),
    "site_meta",
  );
  return {
    workbook: wb,
    dailyRows: dailyRows,
    summaryRows: summaryRows,
    metaRows: metaRows,
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
        sheetNames: ["README", "site_daily", "site_summary", "site_meta"],
        dailyRowCount: workbookBundle.dailyRows.length,
        summaryRowCount: workbookBundle.summaryRows.length,
        metaRowCount: workbookBundle.metaRows.length,
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
