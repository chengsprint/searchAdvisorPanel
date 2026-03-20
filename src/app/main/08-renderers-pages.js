/**
 * Pages Tab Renderer
 * Displays URL performance data
 *
 * @module renderers/pages
 * @param {Object} data - Prepared data object containing:
 *   - urls: URL array with clickCount, exposeCount, ctr, key
 *   - dates: Date array
 * @returns {Function} Renderer function that returns DOM element
 */
function createPagesRenderer(data) {
  return function pages() {
    const { urls, dates } = data;
    const wrap = document.createElement("div");
    const mxC = Math.max(...urls.map((u) => u.clickCount)) || 1;

    if (!urls.length) {
      wrap.appendChild(
        createStateCard(
          "URL 데이터 없음",
          "URL별 클릭/노출 데이터가 아직 없습니다.",
          ICONS.link.replace('width="14" height="14"', 'width="20" height="20"'),
          "neutral",
        )
      );
      return wrap;
    }

    wrap.appendChild(
      chartCard(
        "URL별 클릭 TOP 10",
        "총 " + urls.length + "개",
        C.green,
        barchart(
          urls.slice(0, 10).map((u) => u.clickCount),
          urls.slice(0, 10).map((_, i) => "#" + (i + 1)),
          65,
          C.green,
          "회",
        ),
        urls.slice(0, 10).map((_, i) => "#" + (i + 1)),
      ),
    );

    wrap.appendChild(secTitle("URL 상세"));

    urls.forEach(function (u, i) {
      const pageUrl = (() => {
          try {
            return /^https?:\/\//.test(u.key)
              ? u.key
              : new URL(u.key, curSite).toString();
          } catch (e) {
            return u.key;
          }
        })();
      // href는 원본 URL을 그대로 유지하되,
      // 사람이 읽는 표시 텍스트만 decode 해서 한글 path/query를 더 알아보기 쉽게 만든다.
      // decode 실패(불완전 인코딩) 시에는 원본 문자열을 fallback으로 사용한다.
      const displayUrl = (() => {
        try {
          return decodeURI(pageUrl);
        } catch (e) {
          return pageUrl;
        }
      })();
      const linkLabel =
          displayUrl.length > 92 ? displayUrl.slice(0, 92) + "..." : displayUrl;
      const d = document.createElement("div");
      d.style.cssText = S.row + ";flex-direction:column;align-items:stretch;gap:8px;border-color:" + (i === 0 ? C.green + "44" : C.border);
      d.innerHTML = sanitizeHTML(`<div style="display:flex;gap:10px;align-items:flex-start"><span style="font-size:11px;font-weight:800;color:${i === 0 ? C.green : "var(--sadv-text-tertiary,#b9a55a)"};min-width:24px;margin-top:2px">#${i + 1}</span><div style="flex:1;min-width:0"><div style="display:flex;align-items:center;gap:6px;margin-bottom:6px"><a href="${pageUrl.replace(/"/g, "&quot;")}" target="_blank" rel="noopener noreferrer" title="${escHtml(displayUrl)}" style="font-size:12px;color:${C.blue};line-height:1.4;word-break:break-all;text-decoration:none;font-weight:500">${escHtml(linkLabel)}</a><span style="flex-shrink:0;opacity:0.5">${ICONS.external}</span></div>${hbar(u.clickCount, mxC, i === 0 ? C.green : C.blue)}<div style="display:flex;gap:12px;font-size:11px;color:var(--sadv-text-tertiary,#b9a55a)"><span>클릭 <b style="color:${C.green}">${escHtml(fmt(u.clickCount))}</b></span><span>노출 <b style="color:${C.blue}">${escHtml(fmt(u.exposeCount))}</b></span><span>CTR ${ctrBadge(u.ctr)}</span></div></div></div>`);
      wrap.appendChild(d);
    });

    return wrap;
  };
}
