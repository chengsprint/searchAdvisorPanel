/**
 * Pattern Tab Renderer
 * Displays day-of-week patterns and future predictions
 *
 * @module renderers/pattern
 * @param {Object} data - Prepared data object containing:
 *   - dowRows: Day of week analysis data
 *   - bestDow: Best day of week
 *   - worstDow: Worst day of week
 *   - logs: Raw log data
 *   - cSt: Click statistics (mean, slope)
 *   - dates: Date array
 * @returns {Function} Renderer function that returns DOM element
 */
function createPatternRenderer(data) {
  return function pattern() {
    const { dowRows, bestDow, worstDow, logs, cSt, dates } = data;
    const wrap = document.createElement("div");
    const mxC = Math.max(...dowRows.map((x) => x.avgC)) || 1;

    wrap.appendChild(
      chartCard(
        "요일별 평균 클릭",
        bestDow.label + "요일 최고 " + fmt(bestDow.avgC) + "회",
        C.green,
        barchart(
          dowRows.map((x) => x.avgC),
          dowRows.map((d) => d.label + "요일"),
          70,
          C.purple,
          "회",
        ),
        dowRows.map((d) => d.label),
      ),
    );

    const grid = document.createElement("div");
    grid.style.cssText =
      "display:grid;grid-template-columns:repeat(7,1fr);gap:6px;margin-bottom:20px";

    dowRows.forEach(function (d) {
      const isB = d.label === bestDow.label;
      const isW = d.label === worstDow.label && d.n > 0;
      const hh = d.avgC ? Math.max(4, Math.round((d.avgC / mxC) * 40)) : 2;
      const cell = document.createElement("div");
      cell.style.cssText =
        "background:#1e293b;border:1px solid " +
        (isB ? C.green + "44" : isW ? C.red + "44" : C.border) +
        ";border-radius:10px;padding:10px 4px;text-align:center;transition:all 0.2s";
      cell.innerHTML = sanitizeHTML(`<div style="font-size:11px;color:#94a3b8;margin-bottom:6px;font-weight:600">${escHtml(d.label)}</div><div style="height:40px;display:flex;align-items:flex-end;justify-content:center;margin-bottom:8px"><div style="height:${hh}px;background:${isB ? C.green : isW ? C.red : C.blue};border-radius:3px;width:16px;min-height:2px;opacity:0.8;box-shadow:0 0 8px ${isB ? C.green : isW ? C.red : C.blue}33"></div></div><div style="font-size:11px;font-weight:700;color:${isB ? C.green : isW ? C.red : C.text}">${d.avgC ? escHtml(fmt(d.avgC)) : "-"}</div><div style="font-size:10px;color:#64748b;margin-top:2px">${escHtml(d.n)}일</div>`);
      grid.appendChild(cell);
    });

    wrap.appendChild(secTitle("요일별 분석"));
    wrap.appendChild(grid);

    if (logs.length > 0) {
      const lastDate = new Date(fmtD(logs[logs.length - 1].date));
      const fc = Array.from({ length: 7 }, function (_, i) {
        const fd = new Date(lastDate);
        fd.setDate(fd.getDate() + i + 1);
        return {
          date: fd.toISOString().slice(0, 10),
          pred: Math.max(
            0,
            Math.round(
              (cSt.mean || 0) + (cSt.slope || 0) * (logs.length + i),
            ),
          ),
          dow: DOW[fd.getDay()],
        };
      });

      wrap.appendChild(secTitle("향후 7일 예상"));
      wrap.appendChild(ibox("amber", `<span style="display:inline-flex;vertical-align:text-bottom;margin-right:3px">${ICONS.lightbulb}</span>추세 기반 참고용 예상치입니다.`));

      wrap.appendChild(
        chartCard(
          "예상 클릭",
          "",
          `#f59e0b`,
          sparkline(
            fc.map((x) => x.pred),
            fc.map((x) => x.date.slice(5)),
            65,
            "#f59e0b",
            "회",
          ),
          fc.map((x) => x.date.slice(5)),
        ),
      );

      fc.forEach(function (x, i) {
        const d = document.createElement("div");
        d.style.cssText = S.row + ";margin-bottom:6px";
        d.innerHTML = sanitizeHTML(`<span style="font-size:12px;color:#94a3b8;font-weight:500">${escHtml(x.date)} (${escHtml(x.dow)}) <span style="font-size:10px;color:#64748b;margin-left:4px">+${i + 1}일</span></span><b style="color:${cSt.slope >= 0 ? C.green : C.red};font-size:14px">약 ${escHtml(fmt(x.pred))}회</b>`);
        wrap.appendChild(d);
      });
    }

    return wrap;
  };
}
