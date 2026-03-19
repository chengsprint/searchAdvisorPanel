/**
 * Crawl Tab Renderer
 * Displays crawl statistics and error information
 *
 * @module renderers/crawl
 * @param {Object} data - Prepared data object containing:
 *   - crawlSorted: Sorted crawl stats array
 *   - dates: Date array
 * @returns {Function} Renderer function that returns DOM element
 */
function createCrawlRenderer(data) {
  return function crawl() {
    const { crawlSorted, dates } = data;
    const wrap = document.createElement("div");

    if (!crawlSorted.length) {
      wrap.replaceChildren(
        createStateCard(
          "크롤 데이터 없음",
          "크롤 통계와 오류 데이터가 아직 없습니다.",
          ICONS.activity.replace('width="13" height="13"', 'width="20" height="20"'),
          "neutral",
        )
      );
      return wrap;
    }

    const pageCounts = crawlSorted.map((r) => r.pageCount);
    const cDates = crawlSorted.map((r) => fmtB(r.date));
    const totalPages = pageCounts.reduce((a, b) => a + b, 0);
    const totalSize = crawlSorted.reduce((a, r) => a + r.downloadSize, 0);
    const avgPage = Math.round(totalPages / crawlSorted.length);
    const maxPage = Math.max(...pageCounts);
    const errDays = crawlSorted.filter(
      (r) => r.sumErrorCount > 0 || r.notFound > 0,
    ).length;
    const total404 = crawlSorted.reduce((a, r) => a + (r.notFound || 0), 0);

    wrap.appendChild(
      kpiGrid([
        {
          label: "총 크롤",
          value: (totalPages / 10000).toFixed(1) + "만",
          sub: "90일 합계",
          color: C.blue,
        },
        { label: "일평균", value: fmt(avgPage), color: C.teal },
        {
          label: "에러·404일",
          value: errDays + "일",
          color: errDays > 5 ? C.red : errDays > 0 ? C.amber : C.green,
        },
        {
          label: "총 용량",
          value: (totalSize / 1024 / 1024 / 1024).toFixed(1) + "GB",
          color: C.sub,
        },
      ]),
    );

    wrap.appendChild(
      chartCard(
        "일별 크롤 페이지",
        "최고 " + fmt(maxPage) + "p",
        C.blue,
        sparkline(pageCounts, cDates, 80, C.blue, "p"),
        cDates,
      ),
    );

    if (total404 > 0) {
      wrap.appendChild(
        ibox(
          "amber",
          `<span style="display:inline-flex;vertical-align:text-bottom;margin-right:3px">${ICONS.lightbulb}</span>404 Not Found 누적 <b style="color:${C.amber}">${fmt(total404)}건</b> · 삭제된 URL 확인 권장`,
        ),
      );
    }

    wrap.appendChild(secTitle("에러 상세"));

    const errRows = crawlSorted
      .filter((r) => r.sumErrorCount > 0 || r.notFound > 0)
      .reverse();

    if (!errRows.length) {
      wrap.appendChild(
        createStateCard(
          "크롤 상태 양호",
          "최근 크롤 에러/404 이슈가 감지되지 않았습니다.",
          ICONS.trendUp.replace('width="13" height="13"', 'width="20" height="20"'),
          "success",
        )
      );
    } else {
      errRows.forEach(function (r) {
        const hasServerErr = r.sumErrorCount > 0;
        const has404 = r.notFound > 0;
        const d = document.createElement("div");
        d.style.cssText =
          "background:var(--sadv-layer-01,#0d0d0f);border:1px solid " +
          (hasServerErr ? "rgba(255,90,54,0.22)" : has404 ? "rgba(255,159,28,0.22)" : "var(--sadv-border-subtle,#2b2200)") +
          ";padding:10px 12px;margin-bottom:6px";
        const errs =
          [
            r.serverError && `서버오류 ${escHtml(r.serverError)}`,
            r.notFound && `404 ${escHtml(r.notFound)}`,
            r.connectTimeout && `타임아웃 ${escHtml(r.connectTimeout)}`,
          ]
            .filter(Boolean)
            .join(" · ") || "-";
        const dispErrCnt = (r.sumErrorCount || 0) + (r.notFound || 0);
        d.innerHTML = sanitizeHTML(`<div style="display:flex;justify-content:space-between;margin-bottom:4px"><span style="font-size:12px;color:var(--sadv-text-secondary,#ffe9a8);font-weight:500">${escHtml(fmtD(r.date))}</span><span style="font-size:13px;font-weight:700;color:${hasServerErr ? C.red : C.amber}">에러·404 ${escHtml(fmt(dispErrCnt))}건</span></div><div style="font-size:11px;color:${hasServerErr ? C.red : C.amber};opacity:0.9">${escHtml(errs)}</div><div style="font-size:10px;color:var(--sadv-text-tertiary,#b9a55a);margin-top:4px">크롤 ${escHtml(fmt(r.pageCount))}p · 시도 ${escHtml(fmt(r.sumTryCount))}</div>`);
        wrap.appendChild(d);
      });
    }

    return wrap;
  };
}
