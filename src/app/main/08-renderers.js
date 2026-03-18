  /**
 * Build renderer functions for all site data tabs
 * Processes expose, crawl, backlink, and diagnosisMeta data to create renderers
 * @param {Object} expose - Expose data with items array
 * @param {Object} crawlData - Crawl data with stats
 * @param {Object} backlinkData - Backlink data with total, domains, countTime
 * @param {Object} diagnosisMeta - Diagnosis metadata with items array
 * @returns {Object} Object with renderer functions for each tab (overview, daily, urls, queries, pattern, crawl, backlink, insight)
 * @example
 * const renderers = buildRenderers(exposeData, crawlData, backlinkData, diagnosisData);
 * renderers.overview(); // Renders overview tab
 * renderers.daily(); // Renders daily tab
 * @see {sparkline}
 * @see {barchart}
 * @see {kpiGrid}
 */
  function buildRenderers(expose, crawlData, backlinkData, diagnosisMeta) {
    const item = (expose && expose.items && expose.items[0]) || {};
    const period = item.period || {},
      rawLogs = item.logs || [],
      urls = item.urls || [],
      queries = item.querys || [];
    const logs = [...rawLogs].sort((a, b) => (a.date || "").localeCompare(b.date || ""));
    const dates = logs.map((r) => fmtB(r.date)),
      clicks = logs.map((r) => Number(r.clickCount) || 0),
      exposes = logs.map((r) => Number(r.exposeCount) || 0),
      ctrs = logs.map((r) => { const n = parseFloat(r.ctr); return Number.isFinite(n) ? n : 0; });
    const cSt = st(clicks),
      totalC = clicks.reduce((a, b) => a + b, 0),
      totalE = exposes.reduce((a, b) => a + b, 0),
      avgCtr = totalE ? ((totalC / totalE) * 100).toFixed(2) : "0.00",
      corr = pearson(exposes, clicks);

    // Extract diagnosis data
    const diagnosisItem = (diagnosisMeta && diagnosisMeta.items && diagnosisMeta.items[0]) || {};
    const diagnosisLogs = [...(diagnosisItem.meta || [])].sort((a, b) =>
      (a.date || "").localeCompare(b.date || ""),
    );
    const diagnosisLatest = diagnosisLogs.length > 0 ? diagnosisLogs[diagnosisLogs.length - 1] : null;
    const diagnosisLatestCounts = diagnosisLatest && diagnosisLatest.stateCount ? diagnosisLatest.stateCount : {};
    const diagnosisIndexedCurrent = diagnosisLatestCounts["1"] || 0;
    const diagnosisIndexedValues = diagnosisLogs.map(function (row) {
      return (row.stateCount && row.stateCount["1"]) || 0;
    });
    const diagnosisIndexedSeries = {
      current: diagnosisIndexedCurrent,
      values: diagnosisIndexedValues,
      color: C.purple,
    };
    const diagnosisIndexedOverviewValues = diagnosisIndexedValues.slice(-15);
    const dowAcc = {};
    logs.forEach(function (r) {
      const dw = new Date(fmtD(r.date)).getDay();
      if (!dowAcc[dw]) dowAcc[dw] = { c: 0, n: 0 };
      dowAcc[dw].c += r.clickCount;
      dowAcc[dw].n++;
    });
    const dowRows = DOW.map(function (l, i) {
      return {
        label: l,
        avgC: dowAcc[i] ? Math.round(dowAcc[i].c / dowAcc[i].n) : 0,
        n: dowAcc[i] ? dowAcc[i].n : 0,
      };
    });
    const bestDow = dowRows.reduce(
        (a, b) => (b.avgC > a.avgC ? b : a),
        dowRows[0],
      ),
      worstDow = dowRows
        .filter((x) => x.n > 0)
        .reduce((a, b) => (b.avgC < a.avgC ? b : a), dowRows[0]);
    const crawlStats =
      (crawlData &&
        crawlData.items &&
        crawlData.items[0] &&
        crawlData.items[0].stats) ||
      [];
    const crawlSorted = [...crawlStats].sort((a, b) =>
      (a.date || "").localeCompare(b.date || ""),
    );
    const blData =
      (backlinkData && backlinkData.items && backlinkData.items[0]) || {};
    const blTime = (blData.countTime || []).sort((a, b) =>
      a.timeStamp.localeCompare(b.timeStamp),
    );
    const blTopDomains = blData.topDomain || [];
    return {
      overview: function () {
        const wrap = document.createElement("div");
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
        const prevCR = period.prevClickRatio != null ? parseFloat(period.prevClickRatio) : null;
        const prevER = period.prevExposeRatio != null ? parseFloat(period.prevExposeRatio) : null;
        if (prevCR !== null || prevER !== null)
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
        if (diagnosisLogs.length) {
          wrap.appendChild(
            chartCard(
              "색인 추이",
              fmt(diagnosisIndexedSeries.current) + "건",
              diagnosisIndexedSeries.color,
              sparkline(
                diagnosisIndexedOverviewValues,
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
        const topEl = document.createElement("div");
        topEl.appendChild(secTitle("클릭 TOP 3"));
        [...logs]
          .sort((a, b) => b.clickCount - a.clickCount)
          .slice(0, 3)
          .forEach(function (r, i) {
            const d = document.createElement("div");
            d.style.cssText = S.row + ";border-color:" + (i === 0 ? C.green + "44" : C.border);
            d.innerHTML = `<span>${["🥇", "🥈", "🥉"][i]} <span style="font-size:12px;color:#94a3b8;margin-left:8px">${escHtml(fmtD(r.date))}</span></span><b style="color:${C.green};font-size:14px">${escHtml(fmt(r.clickCount))}회</b>`;
            topEl.appendChild(d);
          });
        wrap.appendChild(topEl);
        return wrap;
      },
      daily: function () {
        const wrap = document.createElement("div"),
          mxC = Math.max(...clicks) || 1;
        wrap.appendChild(
          chartCard(
            "일별 클릭 추이",
            "최고 " + fmt(mxC) + "회",
            C.green,
            sparkline(clicks, dates, window.innerWidth <= 768 ? 75 : 90, C.green, "회"),
            dates,
          ),
        );
        wrap.appendChild(secTitle("날짜별 상세"));
        [...logs].reverse().forEach(function (r) {
          const isOut = cSt.outliers && cSt.outliers.includes(r.clickCount),
            d = document.createElement("div");
          d.style.cssText = "margin-bottom:12px;padding:4px 0";
          d.innerHTML = `<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:6px"><span style="font-size:12px;color:#94a3b8;font-weight:500">${escHtml(fmtD(r.date))} (${escHtml(DOW[new Date(fmtD(r.date)).getDay()])})${isOut ? ' <span style="color:' + C.red + ';font-size:10px;background:' + C.red + '15;padding:1px 4px;border-radius:4px">이상치</span>' : ""}</span><span style="font-size:13px;font-weight:700;color:${r.clickCount >= (cSt.mean || 0) ? C.green : C.text}">${escHtml(fmt(r.clickCount))}회</span></div>${hbar(r.clickCount, mxC, r.clickCount >= (cSt.mean || 0) ? C.green : C.blue)}<div style="display:flex;gap:12px;font-size:11px;color:#64748b;margin-top:4px"><span>노출 <b style="color:#94a3b8">${escHtml(fmt(r.exposeCount))}</b></span><span>CTR ${ctrBadge(r.ctr)}</span></div>`;
          wrap.appendChild(d);
        });
        return wrap;
      },
      urls: function () {
        const wrap = document.createElement("div"),
          mxC = Math.max(...urls.map((u) => u.clickCount)) || 1;
        if (!urls.length) {
          const em = document.createElement("div");
          em.style.cssText = "text-align:center;padding:40px 20px;color:#64748b;font-size:13px";
          em.innerHTML = `<div style="margin-bottom:12px;opacity:0.5">${ICONS.link}</div>URL 데이터 없음`;
          wrap.appendChild(em);
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
            })(),
            linkLabel =
              pageUrl.length > 92 ? pageUrl.slice(0, 92) + "..." : pageUrl,
            d = document.createElement("div");
          d.style.cssText = S.row + ";flex-direction:column;align-items:stretch;gap:8px;border-color:" + (i === 0 ? C.green + "44" : C.border);
          d.innerHTML = `<div style="display:flex;gap:10px;align-items:flex-start"><span style="font-size:11px;font-weight:800;color:${i === 0 ? C.green : "#64748b"};min-width:24px;margin-top:2px">#${i + 1}</span><div style="flex:1;min-width:0"><div style="display:flex;align-items:center;gap:6px;margin-bottom:6px"><a href="${pageUrl.replace(/"/g, "&quot;")}" target="_blank" rel="noopener noreferrer" style="font-size:12px;color:${C.blue};line-height:1.4;word-break:break-all;text-decoration:none;font-weight:500">${escHtml(linkLabel)}</a><span style="flex-shrink:0;opacity:0.5">${ICONS.external}</span></div>${hbar(u.clickCount, mxC, i === 0 ? C.green : C.blue)}<div style="display:flex;gap:12px;font-size:11px;color:#64748b"><span>클릭 <b style="color:${C.green}">${escHtml(fmt(u.clickCount))}</b></span><span>노출 <b style="color:${C.blue}">${escHtml(fmt(u.exposeCount))}</b></span><span>CTR ${ctrBadge(u.ctr)}</span></div></div></div>`;
          wrap.appendChild(d);
        });
        return wrap;
      },
      queries: function () {
        const wrap = document.createElement("div"),
          mxC = Math.max(...queries.map((q) => q.clickCount)) || 1;
        if (!queries.length) {
          const em = document.createElement("div");
          em.style.cssText = "text-align:center;padding:40px 20px;color:#64748b;font-size:13px";
          em.innerHTML = `<div style="margin-bottom:12px;opacity:0.5">${ICONS.search}</div>검색어 데이터 없음`;
          wrap.appendChild(em);
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
              encodeURIComponent(q.key),
            safeKey = escHtml(q.key),
            d = document.createElement("div");
          d.style.cssText = S.row + ";flex-direction:column;align-items:stretch;gap:8px;border-color:" + (i === 0 ? C.teal + "44" : C.border);
          d.innerHTML = `<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:4px"><div style="display:flex;align-items:center;gap:8px;min-width:0"><span style="font-size:11px;font-weight:800;color:${i < 3 ? C.teal : "#64748b"}">#${i + 1}</span><a href="${searchUrl}" target="_blank" rel="noopener noreferrer" style="font-size:13px;font-weight:600;color:${C.blue};text-decoration:none;min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">${escHtml(safeKey)}</a><span style="opacity:0.5">${ICONS.external}</span></div><span style="font-size:13px;font-weight:700;color:${C.green}">${escHtml(fmt(q.clickCount))}회</span></div>${hbar(q.clickCount, mxC, C.teal)}<div style="display:flex;gap:12px;font-size:11px;color:#64748b"><span>노출 <b style="color:#94a3b8">${escHtml(fmt(q.exposeCount))}</b></span><span>CTR ${ctrBadge(q.ctr)}</span></div>`;
          wrap.appendChild(d);
        });
        return wrap;
      },
      pattern: function () {
        const wrap = document.createElement("div"),
          mxC = Math.max(...dowRows.map((x) => x.avgC)) || 1;
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
          const isB = d.label === bestDow.label,
            isW = d.label === worstDow.label && d.n > 0,
            hh = d.avgC ? Math.max(4, Math.round((d.avgC / mxC) * 40)) : 2;
          const cell = document.createElement("div");
          cell.style.cssText =
            "background:#1e293b;border:1px solid " +
            (isB ? C.green + "44" : isW ? C.red + "44" : C.border) +
            ";border-radius:10px;padding:10px 4px;text-align:center;transition:all 0.2s";
          cell.innerHTML = `<div style="font-size:11px;color:#94a3b8;margin-bottom:6px;font-weight:600">${escHtml(d.label)}</div><div style="height:40px;display:flex;align-items:flex-end;justify-content:center;margin-bottom:8px"><div style="height:${hh}px;background:${isB ? C.green : isW ? C.red : C.blue};border-radius:3px;width:16px;min-height:2px;opacity:0.8;box-shadow:0 0 8px ${isB ? C.green : isW ? C.red : C.blue}33"></div></div><div style="font-size:11px;font-weight:700;color:${isB ? C.green : isW ? C.red : C.text}">${d.avgC ? escHtml(fmt(d.avgC)) : "-"}</div><div style="font-size:10px;color:#64748b;margin-top:2px">${escHtml(d.n)}일</div>`;
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
            d.innerHTML = `<span style="font-size:12px;color:#94a3b8;font-weight:500">${escHtml(x.date)} (${escHtml(x.dow)}) <span style="font-size:10px;color:#64748b;margin-left:4px">+${i + 1}일</span></span><b style="color:${cSt.slope >= 0 ? C.green : C.red};font-size:14px">약 ${escHtml(fmt(x.pred))}회</b>`;
            wrap.appendChild(d);
          });
        }
        return wrap;
      },
      crawl: function () {
        const wrap = document.createElement("div");
        if (!crawlSorted.length) {
          wrap.innerHTML =
            '<div style="padding:30px;text-align:center;color:#3d5a78">\ud06c\ub864 \ub370\uc774\ud130 \uc5c6\uc74c</div>';
          return wrap;
        }
        const pageCounts = crawlSorted.map((r) => r.pageCount),
          cDates = crawlSorted.map((r) => fmtB(r.date)),
          totalPages = pageCounts.reduce((a, b) => a + b, 0),
          totalSize = crawlSorted.reduce((a, r) => a + r.downloadSize, 0),
          avgPage = Math.round(totalPages / crawlSorted.length),
          maxPage = Math.max(...pageCounts);
        const errDays = crawlSorted.filter(
          (r) => r.sumErrorCount > 0 || r.notFound > 0,
        ).length;
        const total404 = crawlSorted.reduce((a, r) => a + (r.notFound || 0), 0);
        wrap.appendChild(
          kpiGrid([
            {
              label: "\ucd1d \ud06c\ub864",
              value: (totalPages / 10000).toFixed(1) + "\ub9cc",
              sub: "90\uc77c \ud569\uacc4",
              color: C.blue,
            },
            { label: "\uc77c\ud3c9\uade0", value: fmt(avgPage), color: C.teal },
            {
              label: "\uc5d0\ub7ec·404\uc77c",
              value: errDays + "\uc77c",
              color: errDays > 5 ? C.red : errDays > 0 ? C.amber : C.green,
            },
            {
              label: "\ucd1d \uc6a9\ub7c9",
              value: (totalSize / 1024 / 1024 / 1024).toFixed(1) + "GB",
              color: C.sub,
            },
          ]),
        );
        wrap.appendChild(
          chartCard(
            "\uc77c\ubcc4 \ud06c\ub864 \ud398\uc774\uc9c0",
            "\ucd5c\uace0 " + fmt(maxPage) + "p",
            C.blue,
            sparkline(pageCounts, cDates, 80, C.blue, "p"),
            cDates,
          ),
        );
        if (total404 > 0)
          wrap.appendChild(
            ibox(
              "amber",
              `<span style="display:inline-flex;vertical-align:text-bottom;margin-right:3px">${ICONS.lightbulb}</span>404 Not Found 누적 <b style="color:${C.amber}">${fmt(total404)}건</b> · 삭제된 URL 확인 권장`,
            ),
          );
        wrap.appendChild(secTitle("\uc5d0\ub7ec \uc0c1\uc138"));
        const errRows = crawlSorted
          .filter((r) => r.sumErrorCount > 0 || r.notFound > 0)
          .reverse();
        if (!errRows.length) {
          const ok = document.createElement("div");
          ok.style.cssText =
            "text-align:center;padding:20px;color:#00e676;font-size:13px";
          ok.innerHTML = `<span style="display:inline-flex;align-items:center;gap:6px;color:#10b981">${ICONS.trendUp} 크롤 상태 양호!</span>`;
          wrap.appendChild(ok);
        } else {
          errRows.forEach(function (r) {
            const hasServerErr = r.sumErrorCount > 0,
              has404 = r.notFound > 0;
            const d = document.createElement("div");
            d.style.cssText =
              "background:#0d1829;border:1px solid " +
              (hasServerErr ? "#ff525233" : has404 ? "#ffca2833" : "#1a2d45") +
              ";border-radius:9px;padding:10px 12px;margin-bottom:6px";
            const errs =
              [
                r.serverError && `\uC11C\uBC84\uC624\uB958 ${escHtml(r.serverError)}`,
                r.notFound && `404 ${escHtml(r.notFound)}`,
                r.connectTimeout && `\ud0c0\uc784\uc544\uc6c3 ${escHtml(r.connectTimeout)}`,
              ]
                .filter(Boolean)
                .join(" · ") || "-";
            const dispErrCnt = (r.sumErrorCount || 0) + (r.notFound || 0);
            d.innerHTML = `<div style="display:flex;justify-content:space-between;margin-bottom:4px"><span style="font-size:12px;color:#94a3b8;font-weight:500">${escHtml(fmtD(r.date))}</span><span style="font-size:13px;font-weight:700;color:${hasServerErr ? C.red : C.amber}">에러·404 ${escHtml(fmt(dispErrCnt))}건</span></div><div style="font-size:11px;color:${hasServerErr ? C.red : C.amber};opacity:0.8">${escHtml(errs)}</div><div style="font-size:10px;color:#64748b;margin-top:4px">크롤 ${escHtml(fmt(r.pageCount))}p · 시도 ${escHtml(fmt(r.sumTryCount))}</div>`;
            wrap.appendChild(d);
          });
        }
        return wrap;
      },
      backlink: function () {
        const wrap = document.createElement("div");
        if (!blTime.length) {
          wrap.innerHTML =
            '<div style="padding:40px 20px;text-align:center;color:#64748b;font-size:13px"><div style="margin-bottom:12px;opacity:0.5">' + ICONS.link + '</div>백링크 데이터 없음</div>';
          return wrap;
        }
        const blVals = blTime.map((r) => r.backlinkCnt),
          blDates = blTime.map((r) => fmtB(r.timeStamp)),
          latestBl = blVals[blVals.length - 1] || 0,
          maxBl = Math.max(...blVals),
          minBl = Math.min(...blVals),
          blChange = latestBl - blVals[0];
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
            row.innerHTML = `<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:4px"><div style="display:flex;align-items:center;gap:10px"><span style="font-size:11px;font-weight:800;color:${i === 0 ? C.teal : "#64748b"}">#${i + 1}</span><span style="font-size:13px;color:#f8fafc;font-weight:600">${escHtml(d.domain)}</span></div><span style="font-size:13px;color:${C.teal};font-weight:700">${escHtml(fmt(d.backlinkCnt))}개</span></div>${hbar(d.backlinkCnt, mxD, C.teal)}`;
            wrap.appendChild(row);
          });
        }
        return wrap;
      },
      insight: function () {
        const wrap = document.createElement("div"),
          ctrNum = Number(avgCtr) || 0;
        wrap.appendChild(secTitle("\uC885\uD569 \uBD84\uC11D"));
        wrap.appendChild(
          ibox(
            cSt.slope >= 0 ? "green" : "red",
            `<span style="display:inline-flex;vertical-align:text-bottom;margin-right:3px">${ICONS.trendUp}</span><b>클릭 추세:</b> ${cSt.slope >= 0 ? '하루 평균 <b style="color:#10b981">+' + fmt(Math.round(cSt.slope)) + '회</b> 증가' : '하루 평균 <b style="color:#ef4444">' + fmt(Math.round(Math.abs(cSt.slope || 0))) + '회</b> 감소'}`,
          ),
        );
        wrap.appendChild(
          ibox(
            ctrNum >= 3 ? "green" : ctrNum >= 1.5 ? "amber" : "red",
            `<span style="display:inline-flex;vertical-align:text-bottom;margin-right:3px">${ICONS.pieChart}</span><b>평균 CTR ${avgCtr}%:</b> ${ctrNum >= 3 ? "우수해요." : ctrNum >= 1.5 ? "보통이에요. 제목을 개선하세요." : "낮아요. 메타 타이틀을 전면 개선하세요."}`,
          ),
        );
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
        wrap.appendChild(
          ibox(
            "green",
            `<span style="display:inline-flex;vertical-align:text-bottom;margin-right:3px">${ICONS.calendarDays}</span><b>${bestDow.label}요일</b> 평균 ${fmt(bestDow.avgC)}회 최고, <b>${worstDow.label}요일</b> ${fmt(worstDow.avgC)}회 최저`,
          ),
        );
        if (cSt.outliers && cSt.outliers.length)
          wrap.appendChild(
            ibox("amber", `<span style="display:inline-flex;vertical-align:text-bottom;margin-right:3px">${ICONS.lightbulb}</span>이상치 <b>${cSt.outliers.length}개</b> 감지`),
          );
        wrap.appendChild(
          ibox(
            cSt.cv < 0.3 ? "green" : cSt.cv < 0.5 ? "amber" : "red",
            `<span style="display:inline-flex;vertical-align:text-bottom;margin-right:3px">${ICONS.barChart}</span><b>안정성 CV=${((cSt.cv || 0) * 100).toFixed(0)}%:</b> ${cSt.cv < 0.3 ? "매우 안정적" : cSt.cv < 0.5 ? "약간 변동 있음" : "일별 편차 큼"}`,
          ),
        );
        if (urls.length > 0) {
          const top = urls[0],
            slug =
              decodeURIComponent(top.key).split("/").filter(Boolean).pop() ||
              "";
          wrap.appendChild(
            ibox(
              "blue",
              `<span style="display:inline-flex;vertical-align:text-bottom;margin-right:3px">${ICONS.dashboard}</span><b>최고 URL:</b> "${escHtml(slug.replace(/-/g, " ").slice(0, 30))}…" CTR <b style="color:#f59e0b">${top.ctr}%</b> 클릭 <b style="color:#10b981">${fmt(top.clickCount)}회</b>`,
            ),
          );
        }
        const todo = document.createElement("div");
        todo.style.cssText =
          "background:#0d1829;border:1px solid #00e67622;border-radius:9px;padding:11px 13px;margin-top:6px";
        todo.innerHTML =
          `<div style="display:flex;align-items:center;gap:6px;font-size:12px;font-weight:700;color:#f8fafc;margin-bottom:10px"><span style="display:inline-flex;color:#10b981">${ICONS.lightbulb}</span>지금 바로 해볼 것</div>` +
          [
            bestDow
              ? bestDow.label + "\uC694\uC77C\uC5D0 \uC2E0\uADDC \uCF58\uD150\uCE20 \uC9D1\uC911 \uBC1C\uD589"
              : "\uAFB8\uC900\uD55C \uBC1C\uD589 \uC8FC\uAE30 \uD655\uB9BD",
            ctrNum < 2
              ? "\uC0C1\uC704 URL \uC81C\uBAA9/\uBA54\uD0C0\uC124\uBA85 A/B \uD14C\uC2A4\uD2B8"
              : "\uD604\uC7AC CTR \uC720\uC9C0, \uB178\uCD9C \uD655\uB300 \uC9D1\uC911",
            (cSt.slope || 0) < 0
              ? "\uD074\uB9AD \uAC10\uC18C \uC6D0\uC778 \uD30C\uC545"
              : "\uC0C1\uC2B9 \uD328\uD134 \uBD84\uC11D \uD6C4 \uC131\uACF5 \uACF5\uC2DD \uBC18\uBCF5",
            queries.length
              ? `"${escHtml(queries[0].key)}" \ud0a4\uc6cc\ub4dc \ubcc0\ud615 \uae00 \ubc1c\ud589`
              : "\uAC80\uC0C9\uC5B4 \uB2E4\uC591\uD654\uB85C \uB835\uD14C\uC778 \uD2B8\uB799\uD53C \uD655\uBCF4",
          ]
            .map(
              (a) =>
                `<div style="font-size:12px;color:#7a9ab8;padding:5px 0;border-bottom:1px solid #1a2d45;display:flex;gap:7px"><span style="color:#00e676">→</span>${a}</div>`,
            )
            .join("");
        wrap.appendChild(todo);
        return wrap;
      },
      indexed: function () {
        const wrap = document.createElement("div");
        if (!diagnosisLogs.length) {
          wrap.innerHTML =
            '<div style="padding:30px;text-align:center;color:#3d5a78">\uC0C9\uC778 \uB370\uC774\uD130 \uC5C6\uC74C</div>';
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
              label: "\uD604\uC7AC \uC0C9\uC778",
              value: fmt(currentIndexed) + "\uAC74",
              sub: "\uCD5C\uACE0 " + fmt(maxIndexed),
              color: C.purple,
            },
            {
              label: "\uB300\uAE30\uC911",
              value: fmt(currentPending) + "\uAC74",
              color: C.amber,
            },
            {
              label: "\uC624\uB958",
              value: fmt(currentError) + "\uAC74",
              color: currentError > 0 ? C.red : C.sub,
            },
            {
              label: "\uC0C9\uC778\uC5D0\uB7EC",
              value: fmt(currentDropped) + "\uAC74",
              color: currentDropped > 0 ? C.red : C.sub,
            },
          ]),
        );

        wrap.appendChild(
          chartCard(
            "\uC0C9\uC778 \uCD94\uC774",
            "\uD604\uC7AC " + fmt(currentIndexed) + "\uAC74",
            C.purple,
            sparkline(indexedValues, indexedDates, 80, C.purple, "\uAC74", { minValue: 0 }),
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

        wrap.appendChild(secTitle("\uC77C\uCBDC \uC0C9\uC778 \uD604\uD669"));
        const mxVal = Math.max(...indexedValues, ...pendingValues) || 1;

        diagnosisLogs.slice().reverse().slice(0, 14).forEach(function (r, i) {
          const indexed = (r.stateCount && r.stateCount["1"]) || 0;
          const pending = (r.stateCount && r.stateCount["2"]) || 0;
          const error = (r.stateCount && r.stateCount["3"]) || 0;
          const dropped = (r.stateCount && r.stateCount["4"]) || 0;
          const total = indexed + pending + error + dropped;

          const row = document.createElement("div");
          row.style.cssText =
            "background:#0d1829;border:1px solid " +
            (error > 0 || dropped > 0 ? "#ff525222" : "#1a2d45") +
            ";border-radius:9px;padding:10px 12px;margin-bottom:6px";

          row.innerHTML = `
            <div style="display:flex;justify-content:space-between;margin-bottom:6px">
              <span style="font-size:11px;color:#7a9ab8">${escHtml(fmtD(r.date))}</span>
              <span style="font-size:11px;font-weight:700;color:${C.purple}">\uC0C9\uC778 ${escHtml(fmt(indexed))}\uAC74</span>
            </div>
            <div style="display:flex;gap:2px;height:8px;margin-bottom:4px">
              <div style="flex:${indexed};background:${C.purple};border-radius:2px 0 0 2px;min-width:${indexed > 0 ? 2 : 0}px"></div>
              <div style="flex:${pending};background:${C.amber};min-width:${pending > 0 ? 2 : 0}px"></div>
              <div style="flex:${error};background:${C.red};min-width:${error > 0 ? 2 : 0}px"></div>
              <div style="flex:${dropped};background:#ff525288;border-radius:0 2px 2px 0;min-width:${dropped > 0 ? 2 : 0}px"></div>
            </div>
            <div style="display:flex;gap:12px;font-size:10px;color:#3d5a78">
              <span style="color:${C.purple}">\uC0C9\uC778 <b>${escHtml(fmt(indexed))}</b></span>
              <span style="color:${C.amber}">\uB300\uAE30 <b>${escHtml(fmt(pending))}</b></span>
              ${error > 0 ? `<span style="color:${C.red}">\uC624\uB958 <b>${escHtml(fmt(error))}</b></span>` : ""}
              ${dropped > 0 ? `<span style="color:#ff5252">\uC5D0\uB7EC <b>${escHtml(fmt(dropped))}</b></span>` : ""}
            </div>
          `;
          wrap.appendChild(row);
        });

        // Legend
        const legend = document.createElement("div");
        legend.style.cssText =
          "display:flex;gap:16px;justify-content:center;padding:10px;background:#0d1829;border-radius:8px;margin-top:8px";
        legend.innerHTML = `
          <span style="font-size:10px;color:${C.purple}">■ \uC0C9\uC778</span>
          <span style="font-size:10px;color:${C.amber}">■ \uB300\uAE30\uC911</span>
          <span style="font-size:10px;color:${C.red}">■ \uC624\uB958</span>
          <span style="font-size:10px;color:#ff5252">■ \uC0C9\uC778\uC5D0\uB7EC</span>
        `;
        wrap.appendChild(legend);

        return wrap;
      },
    };
  };
