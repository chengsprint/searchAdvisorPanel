/**
 * Diagnosis Tab Renderer
 * Displays index status and diagnosis data
 *
 * @module renderers/diagnosis
 * @param {Object} data - Prepared data object containing:
 *   - diagnosisLogs: Diagnosis log array
 *   - dates: Date array
 * @returns {Function} Renderer function that returns DOM element
 */
function createDiagnosisRenderer(data) {
  return function indexed() {
    const { diagnosisLogs, dates } = data;
    const wrap = document.createElement("div");

    if (!diagnosisLogs.length) {
      wrap.replaceChildren(
        createStateCard(
          "색인 데이터 없음",
          "색인 상태/진단 로그가 아직 없습니다.",
          ICONS.database.replace('width="13" height="13"', 'width="20" height="20"'),
          "neutral",
        )
      );
      return wrap;
    }

    // Extract all state counts for each day
    const indexedDates = diagnosisLogs.map((r) => fmtB(r.date || ""));
    const indexedValues = diagnosisLogs.map((r) => (r.stateCount && r.stateCount["1"]) || 0);
    const pendingValues = diagnosisLogs.map((r) => (r.stateCount && r.stateCount["2"]) || 0);
    const errorValues = diagnosisLogs.map((r) => (r.stateCount && r.stateCount["3"]) || 0);
    const droppedValues = diagnosisLogs.map((r) => (r.stateCount && r.stateCount["4"]) || 0);

    const currentIndexed = indexedValues[indexedValues.length - 1] || 0;
    const currentPending = pendingValues[pendingValues.length - 1] || 0;
    const currentError = errorValues[errorValues.length - 1] || 0;
    const currentDropped = droppedValues[droppedValues.length - 1] || 0;

    const maxIndexed = Math.max(...indexedValues);
    const minIndexed = Math.min(...indexedValues);
    const indexedChange = currentIndexed - (indexedValues[0] || 0);
    const indexedTrend = st(indexedValues);
    const avgIndexed = Math.round(indexedValues.reduce((a, b) => a + b, 0) / indexedValues.length);

    wrap.appendChild(
      kpiGrid([
        {
          label: "현재 색인",
          value: fmt(currentIndexed) + "건",
          sub: "최고 " + fmt(maxIndexed),
          color: C.purple,
        },
        {
          label: "대기중",
          value: fmt(currentPending) + "건",
          color: C.amber,
        },
        {
          label: "오류",
          value: fmt(currentError) + "건",
          color: currentError > 0 ? C.red : C.sub,
        },
        {
          label: "색인에러",
          value: fmt(currentDropped) + "건",
          color: currentDropped > 0 ? C.red : C.sub,
        },
      ]),
    );

    wrap.appendChild(
      chartCard(
        "색인 추이",
        "현재 " + fmt(currentIndexed) + "건",
        C.purple,
        sparkline(indexedValues, indexedDates, 80, C.purple, "건", { minValue: 0 }),
        indexedDates,
      ),
    );

    if (indexedChange !== 0) {
      wrap.appendChild(
        ibox(
          indexedChange > 0 ? "green" : "red",
          `<span style="display:inline-flex;vertical-align:text-bottom;margin-right:3px">${ICONS.trendUp}</span>기간 대비 <b style="color:${indexedChange > 0 ? C.green : C.red}">${indexedChange > 0 ? "+" : ""}${fmt(indexedChange)}건</b> ${indexedChange > 0 ? "증가" : "감소"}`,
        ),
      );
    }

    if (currentError > 0 || currentDropped > 0) {
      wrap.appendChild(
        ibox(
          "amber",
          `<span style="display:inline-flex;vertical-align:text-bottom;margin-right:3px">${ICONS.lightbulb}</span>주의: 오류 ${fmt(currentError)}건, 색인에러 ${fmt(currentDropped)}건 발생`,
        ),
      );
    }

    wrap.appendChild(secTitle("일별 색인 현황"));
    const mxVal = Math.max(...indexedValues, ...pendingValues) || 1;

    diagnosisLogs.slice().reverse().slice(0, 14).forEach(function (r, i) {
      const indexed = (r.stateCount && r.stateCount["1"]) || 0;
      const pending = (r.stateCount && r.stateCount["2"]) || 0;
      const error = (r.stateCount && r.stateCount["3"]) || 0;
      const dropped = (r.stateCount && r.stateCount["4"]) || 0;
      const total = indexed + pending + error + dropped;

      const row = document.createElement("div");
      row.style.cssText =
        "background:var(--sadv-layer-01,#0d0d0f);border:1px solid " +
        (error > 0 || dropped > 0 ? "rgba(255,90,54,0.18)" : "var(--sadv-border-subtle,#2b2200)") +
        ";padding:10px 12px;margin-bottom:6px";

      row.innerHTML = sanitizeHTML(`
        <div style="display:flex;justify-content:space-between;margin-bottom:6px">
          <span style="font-size:11px;color:var(--sadv-text-secondary,#ffe9a8)">${escHtml(fmtD(r.date))}</span>
          <span style="font-size:11px;font-weight:700;color:${C.purple}">색인 ${escHtml(fmt(indexed))}건</span>
        </div>
        <div style="display:flex;gap:2px;height:8px;margin-bottom:4px">
          <div style="flex:${indexed};background:${C.purple};border-radius:2px 0 0 2px;min-width:${indexed > 0 ? 2 : 0}px"></div>
          <div style="flex:${pending};background:${C.amber};min-width:${pending > 0 ? 2 : 0}px"></div>
          <div style="flex:${error};background:${C.red};min-width:${error > 0 ? 2 : 0}px"></div>
          <div style="flex:${dropped};background:${C.orange};border-radius:0 2px 2px 0;min-width:${dropped > 0 ? 2 : 0}px"></div>
        </div>
        <div style="display:flex;gap:12px;font-size:10px;color:var(--sadv-text-tertiary,#b9a55a)">
          <span style="color:${C.purple}">색인 <b>${escHtml(fmt(indexed))}</b></span>
          <span style="color:${C.amber}">대기 <b>${escHtml(fmt(pending))}</b></span>
          ${error > 0 ? `<span style="color:${C.red}">오류 <b>${escHtml(fmt(error))}</b></span>` : ""}
          ${dropped > 0 ? `<span style="color:${C.orange}">색인에러 <b>${escHtml(fmt(dropped))}</b></span>` : ""}
        </div>
      `);
      wrap.appendChild(row);
    });

    // Legend
    const legend = document.createElement("div");
    legend.style.cssText =
      "display:flex;gap:16px;justify-content:center;padding:10px;background:var(--sadv-layer-01,#0d0d0f);border:1px solid var(--sadv-border-subtle,#2b2200);margin-top:8px";
    legend.innerHTML = sanitizeHTML(`
      <span style="font-size:10px;color:${C.purple}">■ 색인</span>
      <span style="font-size:10px;color:${C.amber}">■ 대기중</span>
      <span style="font-size:10px;color:${C.red}">■ 오류</span>
      <span style="font-size:10px;color:${C.orange}">■ 색인에러</span>
    `);
    wrap.appendChild(legend);

    return wrap;
  };
}
