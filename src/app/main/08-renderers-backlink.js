/**
 * Backlink Tab Renderer
 * Displays backlink trends and top domains
 *
 * @module renderers/backlink
 * @param {Object} data - Prepared data object containing:
 *   - blTime: Backlink time series data
 *   - blTopDomains: Top backlink domains
 *   - dates: Date array
 * @returns {Function} Renderer function that returns DOM element
 */
function createBacklinkRenderer(data) {
  return function backlink() {
    const { blTime, blTopDomains, dates } = data;
    const wrap = document.createElement("div");

    if (!blTime.length) {
      wrap.innerHTML = sanitizeHTML(
        '<div style="padding:40px 20px;text-align:center;color:#64748b;font-size:13px"><div style="margin-bottom:12px;opacity:0.5">' + ICONS.link + '</div>백링크 데이터 없음</div>'
      );
      return wrap;
    }

    const blVals = blTime.map((r) => r.backlinkCnt);
    const blDates = blTime.map((r) => fmtB(r.timeStamp));
    const latestBl = blVals[blVals.length - 1] || 0;
    const maxBl = Math.max(...blVals);
    const minBl = Math.min(...blVals);
    const blChange = latestBl - blVals[0];

    wrap.appendChild(
      kpiGrid([
        { label: "현재 백링크", value: fmt(latestBl), color: C.teal, icon: ICONS.link },
        { label: "기간 최고", value: fmt(maxBl), color: C.green, icon: ICONS.up },
        { label: "기간 최저", value: fmt(minBl), color: C.sub, icon: ICONS.down },
        {
          label: "증감",
          value: (blChange >= 0 ? "+" : "") + blChange,
          color: blChange >= 0 ? C.green : C.red,
          icon: ICONS.chart,
        },
      ]),
    );

    wrap.appendChild(
      chartCard(
        "백링크 추이 (기간별)",
        "현재 " + fmt(latestBl) + "개",
        C.teal,
        sparkline(blVals, blDates, 80, C.teal, "개"),
        blDates,
      ),
    );

    if (blTopDomains.length) {
      wrap.appendChild(
        secTitle(
          '탑 도메인 <span style="font-size:10px;font-weight:400;letter-spacing:0;text-transform:none;color:#64748b;margin-left:6px">도메인별 누적 링크수</span>',
        ),
      );

      const mxD = Math.max(...blTopDomains.map((d) => d.backlinkCnt)) || 1;
      blTopDomains.forEach(function (d, i) {
        const row = document.createElement("div");
        row.style.cssText = S.row + ";flex-direction:column;align-items:stretch;gap:8px;border-color:" + (i === 0 ? C.teal + "44" : C.border);
        row.innerHTML = sanitizeHTML(`<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:4px"><div style="display:flex;align-items:center;gap:10px"><span style="font-size:11px;font-weight:800;color:${i === 0 ? C.teal : "#64748b"}">#${i + 1}</span><span style="font-size:13px;color:#f8fafc;font-weight:600">${escHtml(d.domain)}</span></div><span style="font-size:13px;color:${C.teal};font-weight:700">${escHtml(fmt(d.backlinkCnt))}개</span></div>${hbar(d.backlinkCnt, mxD, C.teal)}`);
        wrap.appendChild(row);
      });
    }

    return wrap;
  };
}
