/**
 * Queries Tab Renderer
 * Displays search query performance data
 *
 * @module renderers/queries
 * @param {Object} data - Prepared data object containing:
 *   - queries: Query array with clickCount, exposeCount, ctr, key
 *   - dates: Date array
 * @returns {Function} Renderer function that returns DOM element
 */
function createQueriesRenderer(data) {
  return function queries() {
    const { queries, dates } = data;
    const wrap = document.createElement("div");
    const mxC = Math.max(...queries.map((q) => q.clickCount)) || 1;

    if (!queries.length) {
      wrap.appendChild(
        createStateCard(
          "검색어 데이터 없음",
          "검색어별 클릭/노출 데이터가 아직 없습니다.",
          ICONS.search.replace('width="14" height="14"', 'width="20" height="20"'),
          "neutral",
        )
      );
      return wrap;
    }

    wrap.appendChild(
      chartCard(
        "검색어별 클릭 TOP 10",
        "총 " + queries.length + "개",
        C.teal,
        barchart(
          queries.slice(0, 10).map((q) => q.clickCount),
          queries.slice(0, 10).map((_, i) => "#" + (i + 1)),
          65,
          C.teal,
          "회",
        ),
        queries.slice(0, 10).map((_, i) => "#" + (i + 1)),
      ),
    );

    wrap.appendChild(secTitle("검색어 상세"));

    queries.forEach(function (q, i) {
      const searchUrl =
          "https://search.naver.com/search.naver?query=" +
          encodeURIComponent(q.key);
      const safeKey = escHtml(q.key);
      const d = document.createElement("div");
      d.style.cssText = S.row + ";flex-direction:column;align-items:stretch;gap:8px;border-color:" + (i === 0 ? C.teal + "44" : C.border);
      d.innerHTML = sanitizeHTML(`<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:4px"><div style="display:flex;align-items:center;gap:8px;min-width:0"><span style="font-size:11px;font-weight:800;color:${i < 3 ? C.teal : "var(--sadv-text-tertiary,#b9a55a)"}">#${i + 1}</span><a href="${searchUrl}" target="_blank" rel="noopener noreferrer" style="font-size:13px;font-weight:600;color:${C.blue};text-decoration:none;min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">${safeKey}</a><span style="opacity:0.5">${ICONS.external}</span></div><span style="font-size:13px;font-weight:700;color:${C.green}">${escHtml(fmt(q.clickCount))}회</span></div>${hbar(q.clickCount, mxC, C.teal)}<div style="display:flex;gap:12px;font-size:11px;color:var(--sadv-text-tertiary,#b9a55a)"><span>노출 <b style="color:var(--sadv-text-secondary,#ffe9a8)">${escHtml(fmt(q.exposeCount))}</b></span><span>CTR ${ctrBadge(q.ctr)}</span></div>`);
      wrap.appendChild(d);
    });

    return wrap;
  };
}
