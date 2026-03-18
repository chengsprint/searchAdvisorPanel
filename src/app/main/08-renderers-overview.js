/**
 * Overview Tab Renderer
 * Displays key performance indicators and trend charts
 *
 * @module renderers/overview
 * @param {Object} data - Prepared data object containing:
 *   - totalC: Total clicks
 *   - totalE: Total exposes
 *   - avgCtr: Average CTR
 *   - clicks: Click array
 *   - exposes: Expose array
 *   - ctrs: CTR array
 *   - dates: Date array
 *   - logs: Raw log data
 *   - period: Period data with prevClickRatio, prevExposeRatio
 *   - diagnosisIndexedSeries: Diagnosis indexed series data
 * @returns {Function} Renderer function that returns DOM element
 */
function createOverviewRenderer(data) {
  return function overview() {
    const {
      totalC, totalE, avgCtr, clicks, exposes, ctrs, dates, logs,
      period, diagnosisIndexedSeries
    } = data;

    const wrap = document.createElement("div");

    // KPI Grid
    wrap.appendChild(
      kpiGrid([
        {
          label: "총 클릭",
          value: fmt(totalC) + "회",
          sub: "90일 합계",
          color: C.green,
          icon: ICONS.click,
        },
        {
          label: "총 노출",
          value: (totalE / 10000).toFixed(1) + "만",
          sub: "90일 합계",
          color: C.blue,
          icon: ICONS.eye,
        },
        {
          label: "평균 CTR",
          value: avgCtr + "%",
          color: C.amber,
          sub: "90일 평균",
          icon: ICONS.chart,
        },
        {
          label: "분석기간",
          value: logs.length + "일",
          color: C.sub,
          icon: ICONS.calendar,
        },
      ]),
    );

    // Period comparison
    const prevCR = period.prevClickRatio != null ? parseFloat(period.prevClickRatio) : null;
    const prevER = period.prevExposeRatio != null ? parseFloat(period.prevExposeRatio) : null;
    if (prevCR !== null || prevER !== null) {
      wrap.appendChild(
        kpiGrid(
          [
            prevCR !== null && {
              label: "클릭 전기비",
              value: (prevCR >= 0 ? "+" : "") + prevCR + "%",
              color: prevCR >= 0 ? C.green : C.red,
              sub: "90일 전 대비",
              icon: prevCR >= 0 ? ICONS.up : ICONS.down,
            },
            prevER !== null && {
              label: "노출 전기비",
              value: (prevER >= 0 ? "+" : "") + prevER + "%",
              color: prevER >= 0 ? C.green : C.red,
              sub: "90일 전 대비",
              icon: prevER >= 0 ? ICONS.up : ICONS.down,
            },
          ].filter(Boolean),
        ),
      );
    }

    // Charts
    wrap.appendChild(
      chartCard(
        "일별 클릭수",
        "최고 " + fmt(Math.max(...clicks)) + "회",
        C.green,
        sparkline(clicks, dates, window.innerWidth <= 768 ? 65 : 80, C.green, "회"),
        dates,
      ),
    );

    wrap.appendChild(
      chartCard(
        "일별 노출수",
        "최고 " + fmt(Math.max(...exposes)),
        C.blue,
        sparkline(exposes, dates, window.innerWidth <= 768 ? 55 : 65, C.blue, "회"),
        dates,
      ),
    );

    wrap.appendChild(
      chartCard(
        "일별 CTR",
        "평균 " + avgCtr + "%",
        C.amber,
        sparkline(ctrs, dates, window.innerWidth <= 768 ? 45 : 55, C.amber, "%"),
        dates,
      ),
    );

    // Diagnosis indexed trend
    if (diagnosisIndexedSeries.values && diagnosisIndexedSeries.values.length) {
      wrap.appendChild(
        chartCard(
          "색인 추이",
          fmt(diagnosisIndexedSeries.current) + "건",
          diagnosisIndexedSeries.color,
          sparkline(
            diagnosisIndexedSeries.values.slice(-15),
            dates,
            80,
            diagnosisIndexedSeries.color,
            "건",
            { minValue: 0 },
          ),
          dates,
        ),
      );
    }

    // Top 3 days
    const topEl = document.createElement("div");
    topEl.appendChild(secTitle("클릭 TOP 3"));
    [...logs]
      .sort((a, b) => b.clickCount - a.clickCount)
      .slice(0, 3)
      .forEach(function (r, i) {
        const d = document.createElement("div");
        d.style.cssText = S.row + ";border-color:" + (i === 0 ? C.green + "44" : C.border);
        d.innerHTML = sanitizeHTML(`<span>${["🥇", "🥈", "🥉"][i]} <span style="font-size:12px;color:#94a3b8;margin-left:8px">${escHtml(fmtD(r.date))}</span></span><b style="color:${C.green};font-size:14px">${escHtml(fmt(r.clickCount))}회</b>`);
        topEl.appendChild(d);
      });
    wrap.appendChild(topEl);

    return wrap;
  };
}
