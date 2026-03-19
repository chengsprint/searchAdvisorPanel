// ============================================================
// ALL-SITES-VIEW - All sites view rendering and export
// ============================================================

/**
 * Render the all sites overview view
 * Fetches expose data and diagnosis meta for all sites, then displays summary cards
 * @returns {Promise<void>}
 * @example
 * await renderAllSites();
 * @see {buildSiteSummaryRow}
 */
async function renderAllSites() {
  const requestId = ++allViewReqId;
  setAllSitesLabel();
  const loading = document.createElement("div");
  loading.style.cssText =
    "padding:24px 18px 20px;color:#7a9ab8;text-align:left;line-height:1.6";

  // 예상 소요 시간 계산 (사이트당 약 0.5초로 가정)
  const estimatedTimeSeconds = Math.ceil(allSites.length * 0.5);
  const estimatedTimeText = estimatedTimeSeconds > 60
    ? `${Math.floor(estimatedTimeSeconds / 60)}분 ${estimatedTimeSeconds % 60}초`
    : `${estimatedTimeSeconds}초`;

  loading.innerHTML = sanitizeHTML(
    '<div style="font-size:13px;font-weight:700;color:#d4ecff;margin-bottom:8px">전체 현황을 준비 중입니다</div>' +
    `<div id="sadv-all-progress-detail" style="font-size:11px;margin-bottom:10px">기본 리포트를 불러오는 중입니다. (예상: ${estimatedTimeText})</div>` +
    '<div style="height:10px;border-radius:999px;background:#0d1829;border:1px solid #1a2d45;overflow:hidden"><div id="sadv-all-progress-bar" style="width:6%;height:100%;background:linear-gradient(90deg,#40c4ff,#00e676)"></div></div>' +
    '<div id="sadv-all-progress-meta" style="font-size:10px;color:#3d5a78;margin-top:8px">메타 진단은 2개씩 천천히 요청합니다.</div>' +
    '<div id="sadv-all-progress-percent" style="font-size:11px;color:#40c4ff;margin-top:4px;font-weight:600">0%</div>'
  );
  bdEl.innerHTML = "";
  bdEl.appendChild(loading);

  if (!allSites.length) {
    bdEl.innerHTML = sanitizeHTML(
      '<div style="padding:30px 20px;text-align:center"><div style="font-size:32px">⚠️</div><div style="color:#ffca28;font-weight:700;margin:10px 0">사이트 목록을 찾을 수 없어요</div><div style="color:#7a9ab8;font-size:12px;line-height:2">↻ 버튼을 눌러 새로고침 해보세요<br>또는 서치어드바이저 콘솔 페이지에서 실행해주세요</div></div>'
    );
    return;
  }
  const sitesToLoad = allSites;
  const siteDataBySite = {};
  const loadingDetail = loading.querySelector("#sadv-all-progress-detail");
  const loadingBar = loading.querySelector("#sadv-all-progress-bar");
  const loadingMeta = loading.querySelector("#sadv-all-progress-meta");
  const loadingPercent = loading.querySelector("#sadv-all-progress-percent");
  let missingDiagnosisMetaCount = null;

  // 시작 시간 기록 (예상 시간 정확도 개선)
  const startTime = Date.now();

  const setProgress = function (label, ratio, note) {
    if (requestId !== allViewReqId || curMode !== CONFIG.MODE.ALL) return;
    if (ratio >= CONFIG.PROGRESS.META_PHASE_RATIO_START && missingDiagnosisMetaCount === 0) return;
    if (loadingDetail) loadingDetail.textContent = label;
    if (loadingBar) loadingBar.style.width = Math.max(6, Math.round(ratio * 100)) + "%";
    if (loadingPercent) {
      const percent = Math.round(ratio * 100);
      loadingPercent.textContent = `${percent}%`;
      // 진행률 색상 변경 (완료 시 녹색)
      loadingPercent.style.color = percent >= 100 ? '#00e676' : '#40c4ff';
    }
    if (loadingMeta && note) loadingMeta.textContent = note;

    // 경과 시간 및 남은 시간 표시
    if (loadingMeta && ratio < 1) {
      const elapsed = Date.now() - startTime;
      const estimatedTotal = elapsed / ratio;
      const remaining = Math.max(0, estimatedTotal - elapsed);
      const remainingSeconds = Math.ceil(remaining / 1000);
      if (remainingSeconds > 5) {
        const remainingText = remainingSeconds > 60
          ? `${Math.floor(remainingSeconds / 60)}분 ${remainingSeconds % 60}초`
          : `${remainingSeconds}초`;
        loadingMeta.textContent = `${note} (남은 시간: 약 ${remainingText})`;
      }
    }
  };
  const exposeResults = [];
  for (let i = 0; i < sitesToLoad.length; i += ALL_SITES_BATCH) {
    const batchSites = sitesToLoad.slice(i, i + ALL_SITES_BATCH);
    setProgress(
      "기본 리포트 " +
        Math.min(i + batchSites.length, sitesToLoad.length) +
        " / " +
        sitesToLoad.length,
      CONFIG.PROGRESS.BASE_RATIO_START + (Math.min(i + batchSites.length, sitesToLoad.length) / sitesToLoad.length) * CONFIG.PROGRESS.EXPOSE_PHASE_RATIO_RANGE,
    );
    const batchResults = await Promise.allSettled(batchSites.map((site) => fetchExposeData(site)));
    if (requestId !== allViewReqId || curMode !== "all") return;
    let failedCount = 0;
    batchResults.forEach(function (result, offset) {
      exposeResults[i + offset] = result;
      if (result.status === "fulfilled") {
        siteDataBySite[batchSites[offset]] = result.value;
      } else {
        // 실패한 사이트 에러 추적
        failedCount++;
        const errorDetail = result.reason?.message || result.reason || '알 수 없는 오류';
        showError(
          `${batchSites[offset]} 사이트 데이터 로딩 실패`,
          result.reason,
          'renderAllSites-expose'
        );
      }
    });
    // 배치 실패 시 진행률 메타에 표시
    if (failedCount > 0 && loadingMeta) {
      const currentNote = loadingMeta.textContent;
      loadingMeta.textContent = `${currentNote} (${failedCount}개 사이트 실패 - 자동 재시도됨)`;
    }
  }
  const metaSitesToLoad = sitesToLoad.filter(function (site) {
    return !hasDiagnosisMetaSnapshot(siteDataBySite[site] || null);
  });
  missingDiagnosisMetaCount = metaSitesToLoad.length;
  let metaLoaded = 0;
  for (let i = 0; i < metaSitesToLoad.length; i += 2) {
    const batchSites = metaSitesToLoad.slice(i, i + 2);
    setProgress(
      "색인 진단 " + metaLoaded + " / " + metaSitesToLoad.length,
      CONFIG.PROGRESS.META_PHASE_RATIO_START + (metaLoaded / Math.max(1, metaSitesToLoad.length)) * CONFIG.PROGRESS.META_PHASE_RATIO_RANGE,
      "메타 진단은 2개씩 천천히 요청해 차단 위험을 낮춥니다.",
    );
    const batchResults = await Promise.allSettled(
      batchSites.map((site) => fetchDiagnosisMeta(site, siteDataBySite[site] || null)),
    );
    if (requestId !== allViewReqId || curMode !== "all") return;
    batchResults.forEach(function (result, offset) {
      metaLoaded += 1;
      if (result.status === "fulfilled") {
        siteDataBySite[batchSites[offset]] = result.value;
      }
    });
    setProgress(
      "색인 진단 " + metaLoaded + " / " + metaSitesToLoad.length,
      CONFIG.PROGRESS.META_PHASE_RATIO_START + (metaLoaded / Math.max(1, metaSitesToLoad.length)) * CONFIG.PROGRESS.META_PHASE_RATIO_RANGE,
      "가져온 색인 진단 캐시는 사이트별 테이블에서도 그대로 재사용합니다.",
    );
    if (i + 2 < metaSitesToLoad.length) {
      await new Promise((resolve) => setTimeout(resolve, 140));
    }
  }
  const rows = sitesToLoad.map((site, i) =>
    siteDataBySite[site]
      ? buildSiteSummaryRow(site, siteDataBySite[site])
      : exposeResults[i] && exposeResults[i].status === "fulfilled"
        ? buildSiteSummaryRow(site, exposeResults[i].value)
        : buildSiteSummaryRow(site, null),
  );
  rows.sort((a, b) => b.totalC - a.totalC);
  window.__sadvRows = rows;
  buildCombo(rows);
  const wrap = document.createElement("div");
  const mergedMeta = getMergedMetaState();
  if (isMergedReport() && mergedMeta && mergedMeta.accounts) {
    wrap.appendChild(createMergedAccountsInfo(mergedMeta));
  }
  const grandC = rows.reduce((a, r) => a + r.totalC, 0);
  const grandE = rows.reduce((a, r) => a + r.totalE, 0);
  const avgCtrAll = grandE ? (grandC / grandE) * 100 : 0;
  const isMobile = window.innerWidth <= 768;

  // Responsive KPI grid: 2 columns on mobile, 4 on desktop
  const kpiData = [
    { label: "전체 클릭", value: (grandC / 10000).toFixed(1) + "만", sub: "90일 합계", color: C.green },
    { label: "전체 노출", value: (grandE / 10000000).toFixed(1) + "천만", sub: "90일 합계", color: C.blue },
    { label: "평균CTR", value: avgCtrAll.toFixed(2) + "%", sub: "90일 평균", color: C.amber },
    { label: "활성사이트", value: rows.filter((r) => r.totalC > 0).length + "개", color: C.teal },
  ];

  // On mobile, show in 2x2 grid
  if (isMobile) {
    const mobileKpiWrapper = document.createElement("div");
    mobileKpiWrapper.style.cssText = "display:grid;grid-template-columns:repeat(2,1fr);gap:8px;margin-bottom:16px";

    kpiData.forEach(kpi => {
      const kpiCard = document.createElement("div");
      kpiCard.style.cssText = `background:#0f172a;border:1px solid #334155;border-radius:12px;padding:16px;text-align:center`;
      kpiCard.innerHTML = sanitizeHTML(`
        <div style="font-size:11px;color:#94a3b8;margin-bottom:4px">${escHtml(kpi.label)}</div>
        <div style="font-size:20px;font-weight:800;color:${kpi.color};line-height:1.1;margin-bottom:4px">${escHtml(kpi.value)}</div>
        <div style="font-size:10px;color:#64748b">${escHtml(kpi.sub)}</div>
      `);
      mobileKpiWrapper.appendChild(kpiCard);
    });

    wrap.appendChild(mobileKpiWrapper);
  } else {
    wrap.appendChild(kpiGrid(kpiData));
  }
  wrap.appendChild(
    secTitle(
      "클릭 랭킹 TOP " +
        Math.min(rows.length, 30) +
        ' <span style="font-size:9px;font-weight:400;color:#3d5a78;letter-spacing:0">90일 합계</span>',
    ),
  );
  const top30 = rows.slice(0, 30);
  wrap.appendChild(
    chartCard(
      "TOP " + top30.length + " 클릭",
      "",
      C.green,
      barchart(
        top30.map((r) => r.totalC),
        top30.map((r) => r.site.replace(/^https?:\/\//, "")),
        window.innerWidth <= 768 ? 65 : 80,
        C.green,
        "회",
      ),
      top30.map((_, i) => "#" + (i + 1)),
    ),
  );
  wrap.appendChild(secTitle("사이트별 상세"));
  rows.forEach(function (r, i) {
    const allCardColors = [C.green, C.blue, C.amber, C.teal, C.purple];
    const col = allCardColors[i % allCardColors.length];
    const card = document.createElement("div");
    card.className = "sadv-allcard";
    card.style.borderTop = "2px solid " + col + "44";
    const shortName = typeof getSiteLabel === "function" ? getSiteLabel(r.site) : r.site.replace(/^https?:\/\//, "");

    // PRIORITY: Use accountLabel first (from siteOwnership), fallback to sourceAccount
    const displayAccount = r.accountLabel || r.sourceAccount;
    const accountBadge = displayAccount && (typeof displayAccount === "string" ? displayAccount.trim() : "")
      ? `<span style="font-size:10px;color:#0ea5e9;background:rgba(14,165,233,0.1);padding:2px 6px;border-radius:4px;margin-left:8px;white-space:nowrap;border:1px solid rgba(14,165,233,0.2)" title="${escHtml(displayAccount)}">${escHtml(displayAccount.includes("@") ? displayAccount.split("@")[0] : displayAccount)}</span>`
      : "";

    // Responsive card layout
    const isMobile = window.innerWidth <= 768;
    const gridTemplate = isMobile ? "grid-template-columns:repeat(3,minmax(0,1fr));gap:6px" : "grid-template-columns:repeat(3,minmax(0,1fr));gap:8px";
    const paddingStyle = isMobile ? "padding:6px" : "padding:8px";
    const fontSizeValue = isMobile ? "font-size:14px" : "font-size:15px";
    const fontSizeLabel = isMobile ? "font-size:9px" : "font-size:10px";

    card.innerHTML = sanitizeHTML(
      '<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:12px"><div style="display:flex;align-items:center;gap:8px;min-width:0"><div style="width:10px;height:10px;border-radius:50%;background:' +
      col +
      ';flex-shrink:0;box-shadow:0 0 0 4px ' +
      col +
      '15"></div><span style="font-size:14px;font-weight:700;line-height:1.3;color:#f8fafc;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;max-width:240px">' +
      escHtml(shortName) +
      '</span>' +
      accountBadge +
      '</div></div><div style="display:grid;' +
      gridTemplate +
      ';margin-bottom:12px"><div style="text-align:center;min-width:0;background:rgba(30,41,59,0.3);' +
      paddingStyle +
      ';border-radius:8px"><div style="' +
      fontSizeValue +
      ';font-weight:800;line-height:1.1;color:' +
      C.green +
      '">' +
      escHtml(fmt(r.totalC)) +
      '</div><div style="' +
      fontSizeLabel +
      ';line-height:1.4;color:#64748b;margin-top:4px">클릭</div></div><div style="text-align:center;min-width:0;background:rgba(30,41,59,0.3);' +
      paddingStyle +
      ';border-radius:8px"><div style="' +
      fontSizeValue +
      ';font-weight:800;line-height:1.1;color:' +
      C.blue +
      '">' +
      escHtml((r.totalE / 10000).toFixed(1)) +
      '만</div><div style="' +
      fontSizeLabel +
      ';line-height:1.4;color:#64748b;margin-top:4px">노출</div></div><div style="text-align:center;min-width:0;background:rgba(30,41,59,0.3);' +
      paddingStyle +
      ';border-radius:8px"><div style="' +
      fontSizeValue +
      ';font-weight:800;line-height:1.1;color:' +
      C.amber +
      '">' +
      escHtml(r.avgCtr) +
      '%</div><div style="' +
      fontSizeLabel +
      ';line-height:1.4;color:#64748b;margin-top:4px">CTR</div></div></div>'
    );
    // Add keyboard accessibility
    card.setAttribute("tabindex", "0");
    card.setAttribute("role", "button");
    card.setAttribute("aria-label", `${shortName} 사이트 상세 보기`);
    if (r.clicks && r.clicks.length > 1) {
      const miniDates = (r.logs || []).map(function (log) {
        return fmtB(log.date);
      });
      const mini = sparkline(r.clicks, miniDates, 36, col, "");
      mini.style.cssText += "opacity:.9";
      card.appendChild(mini);
    }
    const indexBlock = document.createElement("div");
    indexBlock.style.cssText = "margin-top:12px;padding-top:12px;border-top:1px solid #334155";
    if (r.diagnosisIndexedValues && r.diagnosisIndexedValues.length > 1) {
      indexBlock.innerHTML = sanitizeHTML(
        '<div style="display:flex;justify-content:space-between;align-items:flex-start;gap:8px;margin-bottom:8px"><span style="font-size:11px;font-weight:700;color:#94a3b8">색인 추이</span><span style="font-size:13px;font-weight:800;color:' +
        col +
        '">' +
        escHtml(fmt(r.diagnosisIndexedCurrent)) +
        '건</span></div>'
      );
      const indexMini = sparkline(r.diagnosisIndexedValues, r.diagnosisIndexedDates, 44, col, "건", { minValue: 0 });
      indexMini.style.cssText += "opacity:.9";
      indexBlock.appendChild(indexMini);
    } else {
      const metaCode = r.diagnosisMetaCode == null ? "-" : String(r.diagnosisMetaCode);
      const httpText = r.diagnosisMetaStatus == null ? "-" : String(r.diagnosisMetaStatus);
      indexBlock.innerHTML = sanitizeHTML(
        '<div style="display:flex;justify-content:space-between;align-items:flex-start;gap:8px;margin-bottom:6px"><span style="font-size:11px;font-weight:700;color:#94a3b8">색인 추이</span><span style="font-size:12px;color:#64748b">응답 확인</span></div><div style="font-size:11px;line-height:1.5;color:#64748b">HTTP ' +
        escHtml(httpText) +
        " / code " +
        escHtml(metaCode) +
        "</div>"
      );
    }
    card.appendChild(indexBlock);
    card.dataset.site = r.site;
    card.dataset.col = col;
    wrap.appendChild(card);
  });

  wrap.addEventListener("mouseenter", function (e) {
    const card = e.target.closest(".sadv-allcard");
    if (card && card.dataset.col) {
      card.style.borderColor = card.dataset.col + "88";
    }
  }, true);
  wrap.addEventListener("mouseleave", function (e) {
    const card = e.target.closest(".sadv-allcard");
    if (card && card.dataset.col) {
      card.style.borderColor = "#334155";
      card.style.borderTopColor = card.dataset.col + "44";
    }
  }, true);
  wrap.addEventListener("click", function (e) {
    const card = e.target.closest(".sadv-allcard");
    if (card && card.dataset.site) {
      curSite = card.dataset.site;
      switchMode("site");
    }
  });
  // Keyboard navigation for site cards
  wrap.addEventListener('keydown', function(e) {
    const card = e.target.closest(".sadv-allcard");
    if (!card) return;
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      card.click();
    }
    // Arrow key navigation between cards
    if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
      e.preventDefault();
      const cards = Array.from(wrap.querySelectorAll('.sadv-allcard'));
      const currentIndex = cards.indexOf(card);
      const nextIndex = e.key === 'ArrowDown'
        ? Math.min(currentIndex + 1, cards.length - 1)
        : Math.max(currentIndex - 1, 0);
      cards[nextIndex].focus();
    }
  });

  if (requestId !== allViewReqId || curMode !== "all") return;
  bdEl.replaceChildren(wrap);
  bdEl.scrollTop = 0;
}

/**
 * Collect export data for all sites with progress reporting
 * Fetches all data types (expose, crawl, backlink, diagnosisMeta) for export
 * @param {Function} onProgress - Progress callback function(done, total, site, stats)
 * @param {Object} options - Options object
 * @param {string} options.refreshMode - Refresh mode ('refresh' or 'cache-first')
 * @returns {Promise<Object>} Export payload with dataBySite, summaryRows, stats
 * @example
 * const payload = await collectExportData(
 *   (done, total, site) => console.log(`${done}/${total}: ${site}`),
 *   { refreshMode: 'cache-first' }
 * );
 */
async function collectExportData(onProgress, options) {
  const dataBySite = {};
  const summaryRows = [];
  const batchSize = FULL_REFRESH_BATCH_SIZE;
  const refreshMode = options && options.refreshMode === "refresh" ? "refresh" : "cache-first";
  await ensureExportSiteList(refreshMode);
  const total = allSites.length;
  let done = 0;
  const stats = { success: 0, partial: 0, failed: 0, errors: [] };
  for (let i = 0; i < allSites.length; i += batchSize) {
    const batch = allSites.slice(i, i + batchSize);
    const results = await Promise.allSettled(
      batch.map(function (site) {
        return resolveExportSiteData(site, { refreshMode });
      }),
    );
    results.forEach(function (res, idx) {
      const site = batch[idx];
      let siteData;
      if (res.status === "fulfilled") {
        siteData = normalizeSiteData(res.value);
        const hasExpose = siteData && siteData.expose != null;
        const hasDetail = siteData && siteData.detailLoaded === true;
        if (hasExpose && hasDetail) {
          stats.success++;
        } else if (hasExpose) {
          stats.partial++;
        } else {
          stats.failed++;
          if (res.reason && res.reason.message) {
            stats.errors.push({ site, error: res.reason.message.slice(0, 100) });
          } else {
            stats.errors.push({ site, error: "expose data missing" });
          }
        }
      } else {
        siteData = { expose: null, crawl: null, backlink: null, detailLoaded: false };
        stats.failed++;
        if (res.reason && res.reason.message) {
          stats.errors.push({ site, error: res.reason.message.slice(0, 100) });
        } else {
          stats.errors.push({ site, error: "request rejected" });
        }
      }
      dataBySite[site] = {
        ...siteData,
        __source: {
          accountLabel: accountLabel || "unknown",
          accountEncId: encId || "unknown",
          fetchedAt:
            siteData && typeof siteData.__cacheSavedAt === "number"
              ? siteData.__cacheSavedAt
              : new Date().toISOString(),
          exportedAt: savedAtIso(new Date()),
        }
      };
      summaryRows.push(buildSiteSummaryRow(site, siteData));
      done++;
      if (onProgress) onProgress(done, total, site, stats);
    });
    if (refreshMode === "refresh" && i + batchSize < allSites.length) {
      const jitter = Math.floor(Math.random() * FULL_REFRESH_JITTER_MS);
      await new Promise(function (resolve) {
        setTimeout(resolve, FULL_REFRESH_SITE_DELAY_MS + jitter);
      });
    }
  }
  summaryRows.sort((a, b) => b.totalC - a.totalC);

  // V2: Nested accounts structure
  // Use email as key (fallback to unknown@naver.com if not available)
  const accountEmail = (accountLabel && accountLabel.includes('@'))
    ? accountLabel
    : 'unknown@naver.com';

  const savedAt = savedAtIso(new Date());

  return {
    __meta: {
      version: PAYLOAD_V2.VERSION,
      savedAt: savedAt,
      generatorVersion: window.__SEARCHADVISOR_RUNTIME_VERSION__ || "unknown",
      exportFormat: "snapshot-v2",
      accountCount: 1
    },
    accounts: {
      [accountEmail]: {
        encId: encId || "unknown",
        sites: [...allSites],
        siteMeta: typeof getSiteMetaMap === "function" ? getSiteMetaMap() : {},
        dataBySite: dataBySite
      }
    },
    ui: {
      curMode,
      curSite,
      curTab
    },
    mergedMeta: typeof getMergedMetaState === "function" ? getMergedMetaState() : null,
    summaryRows,
    stats
  };
}

function savedAtIso(d) {
  return (
    d.getFullYear() +
    "-" +
    pad2(d.getMonth() + 1) +
    "-" +
    pad2(d.getDate()) +
    "T" +
    pad2(d.getHours()) +
    ":" +
    pad2(d.getMinutes()) +
    ":" +
    pad2(d.getSeconds())
  );
}
