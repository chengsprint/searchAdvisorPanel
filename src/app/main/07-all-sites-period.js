// ============================================================================
// ALL-SITES PERIOD HELPERS
// ============================================================================

/**
 * 전체현황 기간 필터용 순수 계산 모듈
 * ---------------------------------
 *
 * 왜 별도 모듈로 분리하는가:
 * - 이번 기능은 "전체현황에만 적용되는 표시용 기간 필터"다.
 * - 따라서 canonical 90일 row를 직접 바꾸지 않고,
 *   base row -> derived row 변환을 한 곳에 모아두는 것이 가장 안전하다.
 * - 이 모듈은 DOM, fetch, snapshot/live 분기 없이 오직 계산만 담당한다.
 *
 * 절대 하지 말아야 할 것:
 * - buildSiteSummaryRow()의 의미를 90일 정본 -> 기간별 row로 바꾸는 것
 * - period 변경 시 renderAllSites()를 통째로 다시 호출해 fetch를 재실행하는 것
 * - 색인 추이(diagnosisIndexed*)를 기간 필터에 섞는 것
 *
 * 이 모듈의 계약:
 * - 입력: canonical 90일 rows
 * - 출력: 전체현황 표시 전용 derived rows
 * - 색인 추이 관련 필드는 pass-through
 */

const ALL_SITES_PERIOD_OPTIONS = [1, 7, 30, 60, 90];

function normalizeAllSitesPeriodDays(value) {
  const parsed = Number(value);
  return ALL_SITES_PERIOD_OPTIONS.includes(parsed) ? parsed : 90;
}

function getAllSitesPeriodLabel(days) {
  return normalizeAllSitesPeriodDays(days) + "일";
}

function sliceLogsForPeriod(logs, days) {
  const normalizedDays = normalizeAllSitesPeriodDays(days);
  const list = Array.isArray(logs) ? logs.slice() : [];
  if (!list.length) return [];
  return list.slice(Math.max(0, list.length - normalizedDays));
}

function deriveCtrSeries(clicks, exposes) {
  return clicks.map(function (clickCount, index) {
    const exposeCount = Number(exposes[index]) || 0;
    return exposeCount > 0 ? +(((Number(clickCount) || 0) / exposeCount) * 100).toFixed(2) : 0;
  });
}

function deriveAllSitesPeriodRow(baseRow, periodDays) {
  const normalizedDays = normalizeAllSitesPeriodDays(periodDays);
  const baseLogs = Array.isArray(baseRow && baseRow.logs) ? baseRow.logs.slice() : [];
  const periodLogs = sliceLogsForPeriod(baseLogs, normalizedDays);
  const periodClicks = periodLogs.map(function (log) {
    return Number(log && log.clickCount) || 0;
  });
  const periodExposes = periodLogs.map(function (log) {
    return Number(log && log.exposeCount) || 0;
  });
  const periodDates = periodLogs.map(function (log) {
    return String((log && log.date) || "").replace(/[^\d]/g, "").slice(0, 8);
  });
  const totalC = periodClicks.reduce(function (sum, value) {
    return sum + value;
  }, 0);
  const totalE = periodExposes.reduce(function (sum, value) {
    return sum + value;
  }, 0);
  const avgCtr = totalE > 0 ? (totalC / totalE) * 100 : 0;
  const clickTrend = periodClicks.length > 1 ? st(periodClicks).slope || 0 : 0;

  return Object.assign({}, baseRow, {
    periodDays: normalizedDays,
    totalC: totalC,
    totalE: totalE,
    avgCtr: +avgCtr.toFixed(2),
    trend: clickTrend,
    latestClick: periodClicks.slice(-7).reduce(function (sum, value) {
      return sum + value;
    }, 0),
    logs: periodLogs,
    clicks: periodClicks,
    exposes: periodExposes,
    dates: periodDates,
    ctrs: deriveCtrSeries(periodClicks, periodExposes),
    baseWindowDays:
      typeof baseRow?.baseWindowDays === "number" && Number.isFinite(baseRow.baseWindowDays)
        ? baseRow.baseWindowDays
        : 90,
  });
}

function deriveAllSitesPeriodRows(baseRows, periodDays) {
  const normalizedDays = normalizeAllSitesPeriodDays(periodDays);
  const rows = Array.isArray(baseRows) ? baseRows : [];
  return rows.map(function (row) {
    return deriveAllSitesPeriodRow(row, normalizedDays);
  });
}

function computeAllSitesPeriodSummary(rows) {
  const list = Array.isArray(rows) ? rows : [];
  const totalClicks = list.reduce(function (sum, row) {
    return sum + (Number(row && row.totalC) || 0);
  }, 0);
  const totalExposes = list.reduce(function (sum, row) {
    return sum + (Number(row && row.totalE) || 0);
  }, 0);
  const activeSites = list.filter(function (row) {
    return (Number(row && row.totalC) || 0) > 0;
  }).length;
  const avgCtr = totalExposes > 0 ? (totalClicks / totalExposes) * 100 : 0;

  return {
    totalClicks: totalClicks,
    totalExposes: totalExposes,
    activeSites: activeSites,
    avgCtr: +avgCtr.toFixed(2),
  };
}
