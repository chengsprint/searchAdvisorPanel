/**
 * Daily Tab Renderer
 * Displays day-by-day detailed click data with outlier detection
 *
 * @module renderers/daily
 * @param {Object} data - Prepared data object containing:
 *   - clicks: Click array
 *   - dates: Date array
 *   - logs: Raw log data
 *   - cSt: Click statistics (mean, outliers)
 * @returns {Function} Renderer function that returns DOM element
 */
function createDailyRenderer(data) {
  return function daily() {
    const { clicks, logs, cSt } = data;
    const wrap = document.createElement("div");
    const mxC = Math.max(...clicks) || 1;

    wrap.appendChild(
      chartCard(
        "일별 클릭 추이",
        "최고 " + fmt(mxC) + "회",
        C.green,
        sparkline(clicks, data.dates, window.innerWidth <= 768 ? 75 : 90, C.green, "회"),
        data.dates,
      ),
    );

    wrap.appendChild(secTitle("날짜별 상세"));

    [...logs].reverse().forEach(function (r) {
      const isOut = cSt.outliers && cSt.outliers.includes(r.clickCount);
      const d = document.createElement("div");
      d.style.cssText = "margin-bottom:12px;padding:4px 0";
      d.innerHTML = sanitizeHTML(`<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:6px"><span style="font-size:12px;color:var(--sadv-text-secondary,#ffe9a8);font-weight:500">${escHtml(fmtD(r.date))} (${escHtml(DOW[new Date(fmtD(r.date)).getDay()])})${isOut ? ' <span style="color:' + C.red + ';font-size:10px;background:' + C.red + '15;padding:1px 4px;border-radius:4px">이상치</span>' : ""}</span><span style="font-size:13px;font-weight:700;color:${r.clickCount >= (cSt.mean || 0) ? C.green : C.text}">${escHtml(fmt(r.clickCount))}회</span></div>${hbar(r.clickCount, mxC, r.clickCount >= (cSt.mean || 0) ? C.green : C.blue)}<div style="display:flex;gap:12px;font-size:11px;color:var(--sadv-text-tertiary,#b9a55a);margin-top:4px"><span>노출 <b style="color:var(--sadv-text-secondary,#ffe9a8)">${escHtml(fmt(r.exposeCount))}</b></span><span>CTR ${ctrBadge(r.ctr)}</span></div>`);
      wrap.appendChild(d);
    });

    return wrap;
  };
}
