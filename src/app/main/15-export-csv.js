// ============================================================
// CSV EXPORT ADAPTER
// ============================================================

function getSnapshotCsvColumns() {
  // Phase 1 intentionally stays on canonical summaryRows-only fields.
  // Columns without a stable payload source (for example top keyword/page)
  // are excluded instead of emitting permanently blank placeholders.
  return [
    { key: "site", header: "사이트" },
    { key: "accountLabel", header: "계정 라벨" },
    { key: "sourceAccount", header: "소스 계정" },
    { key: "periodDays", header: "조회 기간(일)" },
    { key: "totalC", header: "총 클릭" },
    { key: "totalE", header: "총 노출" },
    { key: "avgCtr", header: "평균 CTR" },
    { key: "trend", header: "클릭 추세" },
    { key: "latestClick", header: "최근 클릭" },
    { key: "prevClickRatio", header: "직전 대비" },
    { key: "diagIndex", header: "진단 지수" },
    { key: "diagLabel", header: "진단 상태" },
    { key: "diagReason", header: "진단 사유" },
    { key: "savedAt", header: "저장 시각" },
  ];
}

function escapeSnapshotCsvCell(value) {
  const text =
    value == null || (typeof value === "number" && !Number.isFinite(value))
      ? ""
      : String(value);
  if (/[",\r\n]/.test(text)) {
    return '"' + text.replace(/"/g, '""') + '"';
  }
  return text;
}

function formatSnapshotCsvPercent(value) {
  if (value == null || value === "") return "";
  const num = Number(value);
  if (!Number.isFinite(num)) return "";
  return num.toFixed(2) + "%";
}

function formatSnapshotCsvTrend(value) {
  const num = Number(value);
  if (!Number.isFinite(num)) return "";
  if (num > 0) return "상승";
  if (num < 0) return "하락";
  return "보합";
}

function formatSnapshotCsvSourceAccount(sourceAccount) {
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

function formatSnapshotCsvDiagLabel(row) {
  const code = row && row.diagnosisMetaCode;
  if (code == null || code === "") return "";
  return Number(code) === 0 ? "정상" : "확인 필요";
}

function formatSnapshotCsvDiagReason(row) {
  if (!row) return "";
  const parts = [];
  if (row.diagnosisMetaCode != null && row.diagnosisMetaCode !== "") {
    parts.push("metaCode=" + String(row.diagnosisMetaCode));
  }
  if (row.diagnosisMetaStatus != null && row.diagnosisMetaStatus !== "") {
    parts.push("status=" + String(row.diagnosisMetaStatus));
  }
  if (row.diagnosisMetaRange != null && row.diagnosisMetaRange !== "") {
    const range = row.diagnosisMetaRange;
    if (typeof range === "string") {
      parts.push("range=" + range);
    } else if (range && typeof range === "object") {
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
      if (start || end) {
        parts.push("range=" + (start && end ? start + "~" + end : start || end));
      } else {
        try {
          parts.push("range=" + JSON.stringify(range));
        } catch (e) {}
      }
    } else {
      parts.push("range=" + String(range));
    }
  }
  return parts.join(" · ");
}

function buildSnapshotCsvRow(savedAt, row, context) {
  const fallbackAccountLabel =
    context && typeof context.accountLabel === "string" ? context.accountLabel : "";
  const fallbackAccountEncId =
    context && typeof context.accountEncId === "string" ? context.accountEncId : "";
  const sourceAccountText = formatSnapshotCsvSourceAccount(row ? row.sourceAccount : null);
  return {
    site: row && row.site ? row.site : "",
    accountLabel: row && row.accountLabel ? row.accountLabel : fallbackAccountLabel,
    sourceAccount: sourceAccountText || fallbackAccountLabel || fallbackAccountEncId,
    periodDays: row && row.baseWindowDays ? row.baseWindowDays : 90,
    totalC: row && Number.isFinite(Number(row.totalC)) ? Number(row.totalC) : 0,
    totalE: row && Number.isFinite(Number(row.totalE)) ? Number(row.totalE) : 0,
    avgCtr: formatSnapshotCsvPercent(row ? row.avgCtr : null),
    trend: formatSnapshotCsvTrend(row ? row.trend : null),
    latestClick: row && Number.isFinite(Number(row.latestClick)) ? Number(row.latestClick) : 0,
    prevClickRatio: formatSnapshotCsvPercent(row ? row.prevClickRatio : null),
    diagIndex:
      row && Number.isFinite(Number(row.diagnosisIndexedCurrent))
        ? Number(row.diagnosisIndexedCurrent)
        : 0,
    diagLabel: formatSnapshotCsvDiagLabel(row),
    diagReason: formatSnapshotCsvDiagReason(row),
    savedAt:
      savedAt && typeof savedAt.toISOString === "function"
        ? savedAt.toISOString()
        : savedAtIso(new Date()),
  };
}

function buildSnapshotCsv(savedAt, payload) {
  const rows = Array.isArray(payload && payload.summaryRows) ? payload.summaryRows : [];
  const columns = getSnapshotCsvColumns();
  const context = {
    accountLabel: payload && payload.accountLabel ? payload.accountLabel : "",
    accountEncId: payload && payload.accountEncId ? payload.accountEncId : "",
  };
  const headerLine = columns.map(function (column) {
    return escapeSnapshotCsvCell(column.header);
  }).join(",");
  const dataLines = rows.map(function (row) {
    const csvRow = buildSnapshotCsvRow(savedAt, row, context);
    return columns.map(function (column) {
      return escapeSnapshotCsvCell(csvRow[column.key]);
    }).join(",");
  });
  return "\uFEFF" + [headerLine].concat(dataLines).join("\r\n");
}

async function downloadSnapshotCsv(options) {
  const outputMeta = getSnapshotSaveOutputMeta("csv");
  const capabilities =
    typeof getRuntimeCapabilities === "function" ? getRuntimeCapabilities() : null;
  if (capabilities && capabilities.isReadOnly) {
    throw new Error("csv export is disabled in read-only mode");
  }
  const payload = options && options.payload ? options.payload : null;
  if (!payload) {
    throw new Error("csv export requires a precomputed payload");
  }
  const runtimeSites =
    typeof getRuntimeAllSites === "function" ? getRuntimeAllSites() : allSites;
  const startedAt =
    options && typeof options.startedAt === "number" ? options.startedAt : Date.now();
  const cacheDecision =
    options && options.cacheDecision && typeof options.cacheDecision === "object"
      ? options.cacheDecision
      : { neededRefresh: false, reason: null, missingSites: 0, expiredSites: 0 };
  const btn = getSnapshotSaveTriggerButton("csv");
  const originalText = btn ? btn.textContent : "CSV";
  setSnapshotSaveButtonBusy(btn, "CSV");
  try {
    const saveBlockDecision = buildSnapshotSaveBlockDecision(payload, runtimeSites);
    if (saveBlockDecision.blocked) {
      showError(
        saveBlockDecision.userMessage,
        saveBlockDecision.technicalMessage,
        "downloadSnapshotCsv-blocked",
        {
          dedupeKey: "downloadSnapshotCsv-blocked::" + saveBlockDecision.reason,
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
          context: "downloadSnapshotCsv-blocked",
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
    const savedAt = new Date();
    pushSnapshotSaveStatus({
      active: true,
      state: "building-html",
      phase: "download",
      stageLabel: outputMeta.buildingTitle,
      detail: outputMeta.buildingDetail,
      startedAt: startedAt,
      progress: {
        done: runtimeSites.length,
        total: runtimeSites.length,
        ratio: 1,
        percent: 100,
      },
      cacheDecision: cacheDecision,
      outputFormat: outputMeta.outputFormat,
      stats: payload && payload.stats ? payload.stats : { success: 0, partial: 0, failed: 0, errors: [] },
      site: null,
    });
    const csv = buildSnapshotCsv(savedAt, payload);
    const fileName = buildSnapshotDownloadFileName(savedAt, outputMeta.fileExtension);
    pushSnapshotSaveStatus({
      active: true,
      state: "triggering-download",
      phase: "download",
      stageLabel: outputMeta.triggeringTitle,
      detail: "브라우저 다운로드를 트리거하고 있어요.",
      fileName: fileName,
      cacheDecision: cacheDecision,
      outputFormat: outputMeta.outputFormat,
    });
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
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
      outputFormat: outputMeta.outputFormat,
      stats: saveStats,
    });
    return {
      ok: true,
      status: hasIssues ? "completed-with-issues" : "completed",
      hasIssues: hasIssues,
      outputFormat: outputMeta.outputFormat,
      fileName: fileName,
      payload: payload,
      stats: saveStats,
    };
  } catch (e) {
    pushSnapshotSaveStatus({
      active: false,
      state: "failed",
      phase: "download",
      stageLabel: outputMeta.failedTitle,
      detail: "CSV 저장 중 오류가 발생했어요. 상태 객체와 오류 배너를 확인한 뒤 다시 시도해 주세요.",
      completedAt: Date.now(),
      cacheDecision: cacheDecision,
      outputFormat: outputMeta.outputFormat,
      error: {
        message: e && e.message ? e.message : String(e),
        context: "downloadSnapshotCsv",
      },
    });
    showError(outputMeta.errorMessage, e, "downloadSnapshotCsv");
    throw e;
  } finally {
    restoreSnapshotSaveButton(btn, originalText);
  }
}
