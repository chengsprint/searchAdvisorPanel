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

    // 전기비 KPI는 정보량 대비 세로 공간 점유가 크고, overview 첫 화면의 핵심
    // "현재 상태" 집중도를 흐려서 제거한다. 필요 시 추후 별도 섹션/인사이트로
    // 옮기는 편이 더 적합하다. 공통 overview renderer에서 제거해 live/snapshot
    // 양쪽 모두 동일하게 단순화한다.

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
        d.innerHTML = sanitizeHTML(`<span>${["🥇", "🥈", "🥉"][i]} <span style="font-size:12px;color:var(--sadv-text-secondary,#ffe9a8);margin-left:8px">${escHtml(fmtD(r.date))}</span></span><b style="color:${C.green};font-size:14px">${escHtml(fmt(r.clickCount))}회</b>`);
        topEl.appendChild(d);
      });
    wrap.appendChild(topEl);

    return wrap;
  };
}
