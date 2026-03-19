/**
 * Insight Tab Renderer
 * Displays comprehensive analysis and actionable insights
 *
 * @module renderers/insight
 * @param {Object} data - Prepared data object containing:
 *   - avgCtr: Average CTR
 *   - cSt: Click statistics (slope, cv, outliers, mean)
 *   - corr: Correlation coefficient
 *   - bestDow: Best day of week
 *   - worstDow: Worst day of week
 *   - urls: URL array
 *   - queries: Query array
 * @returns {Function} Renderer function that returns DOM element
 */
function createInsightRenderer(data) {
  return function insight() {
    const {
      avgCtr, cSt, corr, bestDow, worstDow, urls, queries
    } = data;

    const wrap = document.createElement("div");
    const ctrNum = Number(avgCtr) || 0;

    wrap.appendChild(secTitle("종합 분석"));

    // Trend insight
    wrap.appendChild(
      ibox(
        cSt.slope >= 0 ? "green" : "red",
        `<span style="display:inline-flex;vertical-align:text-bottom;margin-right:3px">${ICONS.trendUp}</span><b>클릭 추세:</b> ${cSt.slope >= 0 ? '하루 평균 <b style="color:' + C.blue + '">+' + fmt(Math.round(cSt.slope)) + '회</b> 증가' : '하루 평균 <b style="color:' + C.red + '">' + fmt(Math.round(Math.abs(cSt.slope || 0))) + '회</b> 감소'}`,
      ),
    );

    // CTR insight
    wrap.appendChild(
      ibox(
        ctrNum >= 3 ? "green" : ctrNum >= 1.5 ? "amber" : "red",
        `<span style="display:inline-flex;vertical-align:text-bottom;margin-right:3px">${ICONS.pieChart}</span><b>평균 CTR ${avgCtr}%:</b> ${ctrNum >= 3 ? "우수해요." : ctrNum >= 1.5 ? "보통이에요. 제목을 개선하세요." : "낮아요. 메타 타이틀을 전면 개선하세요."}`,
      ),
    );

    // Correlation insight
    wrap.appendChild(
      ibox(
        Math.abs(corr) > 0.7
          ? "green"
          : Math.abs(corr) > 0.4
            ? "amber"
            : "red",
        `<span style="display:inline-flex;vertical-align:text-bottom;margin-right:3px">${ICONS.linkInsight}</span><b>노출↔클릭 상관 ${corr.toFixed(2)}:</b> ${Math.abs(corr) > 0.7 ? "노출 확대가 효과적이에요." : Math.abs(corr) > 0.4 ? "CTR 개선과 노출 확대를 병행하세요." : "클릭 전환이 낮아요. 콘텐츠 품질을 점검하세요."}`,
      ),
    );

    // Day of week insight
    wrap.appendChild(
      ibox(
        "green",
        `<span style="display:inline-flex;vertical-align:text-bottom;margin-right:3px">${ICONS.calendarDays}</span><b>${bestDow.label}요일</b> 평균 ${fmt(bestDow.avgC)}회 최고, <b>${worstDow.label}요일</b> ${fmt(worstDow.avgC)}회 최저`,
      ),
    );

    // Outlier insight
    if (cSt.outliers && cSt.outliers.length) {
      wrap.appendChild(
        ibox("amber", `<span style="display:inline-flex;vertical-align:text-bottom;margin-right:3px">${ICONS.lightbulb}</span>이상치 <b>${cSt.outliers.length}개</b> 감지`),
      );
    }

    // Stability insight
    wrap.appendChild(
      ibox(
        cSt.cv < 0.3 ? "green" : cSt.cv < 0.5 ? "amber" : "red",
        `<span style="display:inline-flex;vertical-align:text-bottom;margin-right:3px">${ICONS.barChart}</span><b>안정성 CV=${((cSt.cv || 0) * 100).toFixed(0)}%:</b> ${cSt.cv < 0.3 ? "매우 안정적" : cSt.cv < 0.5 ? "약간 변동 있음" : "일별 편차 큼"}`,
      ),
    );

    // Top URL insight
    if (urls.length > 0) {
      const top = urls[0];
      const slug =
        decodeURIComponent(top.key).split("/").filter(Boolean).pop() ||
        "";
      wrap.appendChild(
        ibox(
          "blue",
          `<span style="display:inline-flex;vertical-align:text-bottom;margin-right:3px">${ICONS.dashboard}</span><b>최고 URL:</b> "${escHtml(slug.replace(/-/g, " ").slice(0, 30))}…" CTR <b style="color:${C.amber}">${top.ctr}%</b> 클릭 <b style="color:${C.blue}">${fmt(top.clickCount)}회</b>`,
        ),
      );
    }

    // Action items
    const todo = document.createElement("div");
    todo.style.cssText =
      "background:var(--sadv-layer-01,#0d0d0f);border:1px solid rgba(255,212,0,0.18);padding:12px 14px;margin-top:8px;box-shadow:0 8px 24px rgba(0,0,0,0.16)";
    todo.innerHTML = sanitizeHTML(
      `<div style="display:flex;align-items:center;gap:6px;font-size:12px;font-weight:700;color:var(--sadv-text,#fffdf5);margin-bottom:10px"><span style="display:inline-flex;color:${C.blue}">${ICONS.lightbulb}</span>지금 바로 해볼 것</div>` +
      [
        bestDow
          ? bestDow.label + "요일에 신규 콘텐츠 집중 발행"
          : "균등한 발행 주기 확립",
        ctrNum < 2
          ? "상위 URL 제목/메타설명 A/B 테스트"
          : "현재 CTR 유지, 노출 확대 집중",
        (cSt.slope || 0) < 0
          ? "클릭 감소 원인 파악"
          : "상승 패턴 분석 후 성공 공식 반복",
        queries.length
          ? `"${escHtml(queries[0].key)}" 키워드 변형 글 발행`
          : "검색어 다양화로 랭킹 트래픽 확보",
      ]
        .map(
          (a) =>
            `<div style="font-size:12px;color:var(--sadv-text-secondary,#ffe9a8);padding:6px 0;border-bottom:1px solid var(--sadv-border-subtle,#2b2200);display:flex;gap:7px"><span style="color:${C.blue}">→</span>${escHtml(a)}</div>`,
        )
        .join("")
    );
    wrap.appendChild(todo);

    return wrap;
  };
}
