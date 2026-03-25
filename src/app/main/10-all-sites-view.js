// ============================================================
// ALL-SITES-VIEW - All sites view rendering and export
// ============================================================

/**
 * Read selection state for the all-sites view through the public seam first.
 *
 * Why this helper exists:
 * - all-sites view currently has several request/render guards that only need
 *   the current mode/site/tab, not the raw globals themselves.
 * - pulling those reads behind one helper reduces repeated fallback objects and
 *   makes later shared-app migration easier without changing behavior now.
 */
function getAllSitesSelectionState() {
  return typeof getRuntimeSelectionState === "function"
    ? getRuntimeSelectionState()
    : { curMode, curSite, curTab };
}

function getAllSitesRenderLeaseForSave() {
  // 저장 실행 contract seam:
  // 캐시 비움 직후 전체현황이 expose/diagnosis 메타를 배치로 불러오는 동안
  // save가 바로 collectExportData()를 시작하면 expose 요청이 중복될 수 있다.
  // 따라서 save는 "이미 진행 중인 all-sites 초기 로딩"을 join 가능한 lease로 보고
  // 먼저 기다린 뒤 refresh/cache-first 판단을 다시 내려야 한다.
  // 중요:
  // - 이 lease는 "현재 UI에 뭐가 보이는가"가 아니라 "현재 진행 중인 all-sites bootstrap work"만 대표한다.
  // - save modal이 미러링하는 progress도 save 자체 진행률이 아니라 owner snapshot의 보조 projection이다.
  const selectionState = getAllSitesSelectionState();
  const reusable = !!(
    allSitesRenderInFlightPromise &&
    allSitesRenderInFlightMeta &&
    allSitesRenderInFlightMeta.requestId === allViewReqId &&
    selectionState.curMode === CONFIG.MODE.ALL
  );
  return {
    reusable: reusable,
    kind: "all-sites-render",
    startedAt:
      reusable && typeof allSitesRenderInFlightMeta.startedAt === "number"
        ? allSitesRenderInFlightMeta.startedAt
        : null,
    siteCount:
      reusable && typeof allSitesRenderInFlightMeta.siteCount === "number"
        ? allSitesRenderInFlightMeta.siteCount
        : 0,
    promise: reusable ? allSitesRenderInFlightPromise : null,
    getProgress:
      reusable && allSitesRenderInFlightMeta
        ? function () {
            const progress =
              allSitesRenderInFlightMeta && allSitesRenderInFlightMeta.progress
                ? allSitesRenderInFlightMeta.progress
                : null;
            return progress ? { ...progress } : null;
          }
        : null,
  };
}

function getAllSitesCanonicalRows() {
  return typeof getRuntimeRows === "function"
    ? getRuntimeRows()
    : (typeof getCanonicalRowsState === "function"
        ? getCanonicalRowsState()
        : (Array.isArray(window.__sadvRows) && window.__sadvRows.length ? window.__sadvRows.slice() : []));
}

/**
 * Persist canonical all-sites rows through the provider seam first.
 *
 * Why this helper exists:
 * - `10-all-sites-view.js` is currently the main writer of canonical rows.
 * - Leaving repeated `setRuntimeRows(...)` / `window.__sadvRows = ...` branches
 *   in render code makes later Phase 2 shared-app work noisier than necessary.
 * - Centralizing the write path here is a safe Phase 1 step because it does not
 *   change what gets stored, only how the write fallback is expressed.
 *
 * Guardrail:
 * - This helper only stores rows. It must not sort, mutate, notify, or render.
 * - Phase 1 후반부터는 all-sites view가 raw storage write(`window.__sadvRows`)를
 *   직접 알지 않게 좁힌다. 실제 저장소 세부 구현은 provider/state 레이어가 소유한다.
 */
function setAllSitesCanonicalRows(rows) {
  if (typeof setRuntimeRows === "function") return setRuntimeRows(rows);
  if (typeof setCanonicalRowsState === "function") return setCanonicalRowsState(rows);
  return Array.isArray(rows) ? rows.slice() : [];
}

/**
 * Persist all-sites card site selection through the runtime action seam first.
 *
 * This helper is intentionally tiny:
 * - it only updates "which site is selected"
 * - it does not change mode or trigger rendering
 *
 * Keeping that separation avoids hidden side-effects that could diverge between
 * live and saved runtimes.
 */
function setAllSitesSelectedSite(site) {
  if (typeof setRuntimeSite === "function") return setRuntimeSite(site);
  curSite = site;
  return getAllSitesSelectionState();
}

function buildAllSitesPeriodToolbar(periodDays) {
  const currentDays = normalizeAllSitesPeriodDays(periodDays);
  const bar = document.createElement("div");
  bar.style.cssText =
    "display:flex;justify-content:space-between;align-items:flex-start;gap:12px;flex-wrap:wrap;margin-bottom:14px";

  const copy = document.createElement("div");
  copy.style.cssText = "display:flex;flex-direction:column;gap:4px;min-width:0";
  copy.innerHTML = sanitizeHTML(
    '<div style="font-size:13px;font-weight:800;color:var(--sadv-text,#fffdf5)">전체현황</div>' +
      '<div style="font-size:11px;line-height:1.5;color:var(--sadv-text-tertiary,#b9a55a)">클릭/노출/CTR만 기간 필터를 적용하고, 색인 추이는 90일 고정으로 유지합니다.</div>'
  );

  const toggle = document.createElement("div");
  toggle.className = "sadv-all-period-toggle";
  toggle.style.cssText =
    "display:inline-flex;flex-wrap:wrap;gap:6px;align-items:center;justify-content:flex-end";
  ALL_SITES_PERIOD_OPTIONS.forEach(function (days) {
    const isActive = days === currentDays;
    const button = document.createElement("button");
    button.type = "button";
    button.className = "sadv-all-period-btn" + (isActive ? " on" : "");
    button.dataset.allSitesPeriod = String(days);
    button.setAttribute("aria-pressed", isActive ? "true" : "false");
    button.style.cssText =
      "border:1px solid " +
      (isActive ? "rgba(255,212,0,0.34)" : "var(--sadv-border-subtle,#2b2200)") +
      ";background:" +
      (isActive ? "rgba(255,212,0,0.14)" : "rgba(255,255,255,0.02)") +
      ";color:" +
      (isActive ? "#ffd400" : "var(--sadv-text-secondary,#ffe9a8)") +
      ";padding:6px 10px;border-radius:" +
      T.radiusPill +
      ";font-size:11px;font-weight:" +
      (isActive ? "800" : "700") +
      ";cursor:pointer;min-width:54px";
    button.textContent = getAllSitesPeriodLabel(days);
    toggle.appendChild(button);
  });

  bar.appendChild(copy);
  bar.appendChild(toggle);
  return bar;
}

function buildAllSitesDisplayWrap(baseRows) {
  // 전체현황 period filter의 핵심 규칙:
  // - baseRows는 90일 canonical rows로 절대 유지
  // - 여기서만 displayRows를 파생 계산
  // - live/saved/merge 모두 이 helper를 타게 만들어 parity를 유지
  const canonicalRows = Array.isArray(baseRows) ? baseRows.slice() : [];
  const periodDays =
    typeof getRuntimeAllSitesPeriodDays === "function"
      ? getRuntimeAllSitesPeriodDays()
      : normalizeAllSitesPeriodDays(90);
  const periodLabel = getAllSitesPeriodLabel(periodDays);
  const displayRows = deriveAllSitesPeriodRows(canonicalRows, periodDays).sort(function (a, b) {
    return (b.totalC || 0) - (a.totalC || 0);
  });
  const summary = computeAllSitesPeriodSummary(displayRows);
  window.__sadvAllSitesDisplayRows = displayRows.slice();

  if (typeof assignColors === "function") {
    assignColors(
      displayRows.map(function (row) {
        return row.site;
      })
    );
  }

  const wrap = document.createElement("div");
  const mergedMeta =
    typeof getRuntimeMergedMeta === "function" ? getRuntimeMergedMeta() : getMergedMetaState();
  if (isMergedReport() && mergedMeta && mergedMeta.accounts) {
    wrap.appendChild(createMergedAccountsInfo(mergedMeta));
  }
  wrap.appendChild(buildAllSitesPeriodToolbar(periodDays));

  const kpiData = [
    { label: "전체 클릭", value: fmt(summary.totalClicks), sub: periodLabel + " 합계", color: C.green },
    { label: "전체 노출", value: fmt(summary.totalExposes), sub: periodLabel + " 합계", color: C.blue },
    { label: "평균CTR", value: summary.avgCtr.toFixed(2) + "%", sub: periodLabel + " 평균", color: C.amber },
    { label: "활성사이트", value: summary.activeSites + "개", sub: periodLabel + " 클릭 발생", color: C.teal },
  ];
  // 전체현황 KPI는 모바일/데스크톱 모두 공통 kpiGrid 정렬 규칙을 사용한다.
  // 별도 모바일 카드 구현을 두면 line-height / min-height / 세로 중심축이 갈라져
  // 같은 데이터라도 화면마다 위로 쏠리거나 들쭉날쭉해 보이는 회귀가 생기기 쉽다.
  wrap.appendChild(kpiGrid(kpiData));

  wrap.appendChild(
    secTitle(
      "클릭 랭킹 TOP " +
        Math.min(displayRows.length, 30) +
        ' <span style="font-size:9px;font-weight:400;color:var(--sadv-text-tertiary,#b9a55a);letter-spacing:0">' +
        escHtml("최근 " + periodLabel) +
        "</span>"
    )
  );
  const topRows = displayRows.slice(0, 30);
  wrap.appendChild(
    chartCard(
      "최근 " + periodLabel + " 클릭 TOP " + topRows.length,
      "",
      C.green,
      barchart(
        topRows.map(function (row) {
          return row.totalC;
        }),
        topRows.map(function (row) {
          return row.site.replace(/^https?:\/\//, "");
        }),
        window.innerWidth <= 768 ? 65 : 80,
        C.green,
        "회"
      ),
      topRows.map(function (_, index) {
        return "#" + (index + 1);
      })
    )
  );

  wrap.appendChild(secTitle("사이트별 상세"));
  displayRows.forEach(function (r, i) {
    const col = SITE_COLORS_MAP[r.site] || COLORS[i % COLORS.length] || C.green;
    const toneBg = col + "12";
    const toneBorder = col + "2e";
    const card = document.createElement("div");
    card.className = "sadv-allcard";
    card.style.borderTop = "2px solid " + col + "44";
    const shortName =
      typeof getSiteLabel === "function" ? getSiteLabel(r.site) : r.site.replace(/^https?:\/\//, "");
    const displayAccount = r.accountLabel || r.sourceAccount;
    const accountBadge =
      displayAccount && (typeof displayAccount === "string" ? displayAccount.trim() : "")
        ? `<span style="font-size:10px;color:${T.accentSoftText};background:${T.accentSoftBg};padding:3px 8px;border-radius:999px;margin-left:8px;white-space:nowrap;border:1px solid ${T.accentSoftBorder}" title="${escHtml(displayAccount)}">${escHtml(displayAccount.includes("@") ? displayAccount.split("@")[0] : displayAccount)}</span>`
        : "";
    const compact = window.innerWidth <= 768;
    const gridTemplate = compact
      ? "grid-template-columns:repeat(2,minmax(0,1fr));gap:6px"
      : "grid-template-columns:repeat(3,minmax(0,1fr));gap:8px";
    const paddingStyle = compact ? "padding:7px 6px" : "padding:8px";
    const fontSizeValue = compact ? "font-size:13px" : "font-size:15px";
    const fontSizeLabel = compact ? "font-size:9px" : "font-size:10px";
    const statSpanStyle = compact ? "grid-column:1 / -1;" : "";
    const statMinHeight = compact ? "58px" : "64px";
    const statGap = compact ? "3px" : "4px";
    const statBoxBase =
      "display:flex;flex-direction:column;align-items:center;justify-content:center;gap:" +
      statGap +
      ";text-align:center;min-width:0;min-height:" +
      statMinHeight +
      ";background:" +
      toneBg +
      ";border:1px solid " +
      toneBorder +
      ";" +
      paddingStyle +
      ';border-radius:8px';

    card.innerHTML = sanitizeHTML(
      '<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:12px"><div style="display:flex;align-items:center;gap:8px;min-width:0"><div style="width:10px;height:10px;border-radius:50%;background:' +
        col +
        ';flex-shrink:0;box-shadow:0 0 0 4px ' +
        col +
        '15"></div><span style="font-size:14px;font-weight:700;line-height:1.3;color:var(--sadv-text,#fffdf5);overflow:hidden;text-overflow:ellipsis;white-space:nowrap;max-width:240px">' +
        escHtml(shortName) +
        "</span>" +
        accountBadge +
        '</div></div><div style="display:grid;' +
        gridTemplate +
        ';margin-bottom:12px"><div style="' +
        statBoxBase +
        '"><div style="' +
        fontSizeValue +
        ';font-weight:800;line-height:1.1;color:' +
        col +
        '">' +
        escHtml(fmt(r.totalC)) +
        '</div><div style="' +
        fontSizeLabel +
        ';line-height:1.35;color:var(--sadv-text-tertiary,#b9a55a)">클릭</div></div><div style="' +
        statBoxBase +
        '"><div style="' +
        fontSizeValue +
        ';font-weight:800;line-height:1.1;color:' +
        col +
        '">' +
        escHtml((r.totalE / 10000).toFixed(1)) +
        '만</div><div style="' +
        fontSizeLabel +
        ';line-height:1.35;color:var(--sadv-text-tertiary,#b9a55a)">노출</div></div><div style="' +
        statSpanStyle +
        statBoxBase +
        '"><div style="' +
        fontSizeValue +
        ';font-weight:800;line-height:1.1;color:' +
        col +
        '">' +
        escHtml(r.avgCtr) +
        '%</div><div style="' +
        fontSizeLabel +
        ';line-height:1.35;color:var(--sadv-text-tertiary,#b9a55a)">CTR</div></div></div>'
    );
    card.setAttribute("tabindex", "0");
    card.setAttribute("role", "button");
    card.setAttribute("aria-label", shortName + " 사이트 상세 보기");

    const clickBlock = document.createElement("div");
    clickBlock.style.cssText = "margin-top:10px;padding-top:12px;border-top:1px solid var(--sadv-border-subtle,#2b2200)";
    clickBlock.innerHTML = sanitizeHTML(
      '<div style="display:flex;justify-content:space-between;align-items:flex-start;gap:8px;margin-bottom:8px"><span style="display:inline-flex;align-items:center;gap:6px;font-size:11px;font-weight:700;color:var(--sadv-text-secondary,#ffe9a8)">클릭 추이 <span style="padding:2px 6px;border-radius:999px;border:1px solid rgba(255,212,0,0.18);background:rgba(255,212,0,0.08);color:#ffd400;font-size:10px;font-weight:700">' +
        escHtml(periodLabel) +
        '</span></span><span style="font-size:13px;font-weight:800;color:' +
        col +
        '">' +
        escHtml(fmt(r.totalC)) +
        "회</span></div>"
    );
    const miniDates = (r.dates || []).map(function (date) {
      return fmtB(date);
    });
    const mini = sparkline(r.clicks || [], miniDates, 52, col, "회", { minValue: 0 });
    mini.style.cssText += "opacity:.95";
    clickBlock.appendChild(mini);
    card.appendChild(clickBlock);

    const indexBlock = document.createElement("div");
    indexBlock.style.cssText = "margin-top:12px;padding-top:12px;border-top:1px solid var(--sadv-border-subtle,#2b2200)";
    if (r.diagnosisIndexedValues && r.diagnosisIndexedValues.length > 1) {
      indexBlock.innerHTML = sanitizeHTML(
        '<div style="display:flex;justify-content:space-between;align-items:flex-start;gap:8px;margin-bottom:8px"><span style="display:inline-flex;align-items:center;gap:6px;font-size:11px;font-weight:700;color:var(--sadv-text-secondary,#ffe9a8)">색인 추이 <span style="padding:2px 6px;border-radius:999px;border:1px solid rgba(255,255,255,0.12);background:rgba(255,255,255,0.04);color:var(--sadv-text-tertiary,#b9a55a);font-size:10px;font-weight:700">고정</span></span><span style="font-size:13px;font-weight:800;color:' +
          col +
          '">' +
          escHtml(fmt(r.diagnosisIndexedCurrent)) +
          "건</span></div>"
      );
      const indexMini = sparkline(r.diagnosisIndexedValues, r.diagnosisIndexedDates, 44, col, "건", { minValue: 0 });
      indexMini.style.cssText += "opacity:.9";
      indexBlock.appendChild(indexMini);
    } else {
      const metaCode = r.diagnosisMetaCode == null ? "-" : String(r.diagnosisMetaCode);
      const httpText = r.diagnosisMetaStatus == null ? "-" : String(r.diagnosisMetaStatus);
      indexBlock.innerHTML = sanitizeHTML(
        '<div style="display:flex;justify-content:space-between;align-items:flex-start;gap:8px;margin-bottom:6px"><span style="display:inline-flex;align-items:center;gap:6px;font-size:11px;font-weight:700;color:var(--sadv-text-secondary,#ffe9a8)">색인 추이 <span style="padding:2px 6px;border-radius:999px;border:1px solid rgba(255,255,255,0.12);background:rgba(255,255,255,0.04);color:var(--sadv-text-tertiary,#b9a55a);font-size:10px;font-weight:700">고정</span></span><span style="font-size:12px;color:var(--sadv-text-tertiary,#b9a55a)">응답 확인</span></div><div style="font-size:11px;line-height:1.5;color:var(--sadv-text-tertiary,#b9a55a)">HTTP ' +
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

  wrap.addEventListener("click", function (e) {
    const periodBtn = e.target.closest("[data-all-sites-period]");
    if (periodBtn) {
      const nextDays = normalizeAllSitesPeriodDays(periodBtn.dataset.allSitesPeriod);
      if (nextDays !== periodDays) {
        if (typeof setRuntimeAllSitesPeriodDays === "function") {
          setRuntimeAllSitesPeriodDays(nextDays);
        }
        renderAllSitesFromCanonicalRows();
      }
      return;
    }
    const card = e.target.closest(".sadv-allcard");
    if (card && card.dataset.site) {
      setAllSitesSelectedSite(card.dataset.site);
      switchMode("site");
    }
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
      card.style.borderColor = "var(--sadv-border-subtle,#2b2200)";
      card.style.borderTopColor = card.dataset.col + "44";
    }
  }, true);
  wrap.addEventListener("keydown", function (e) {
    const card = e.target.closest(".sadv-allcard");
    if (!card) return;
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      card.click();
    }
    if (e.key === "ArrowDown" || e.key === "ArrowUp") {
      e.preventDefault();
      const cards = Array.from(wrap.querySelectorAll(".sadv-allcard"));
      const currentIndex = cards.indexOf(card);
      const nextIndex =
        e.key === "ArrowDown"
          ? Math.min(currentIndex + 1, cards.length - 1)
          : Math.max(currentIndex - 1, 0);
      cards[nextIndex].focus();
    }
  });

  return wrap;
}

function renderAllSitesFromCanonicalRows() {
  const selectionState = getAllSitesSelectionState();
  if (!bdEl || selectionState.curMode !== CONFIG.MODE.ALL) return;
  const canonicalRows = getAllSitesCanonicalRows();
  if (!canonicalRows.length) return;
  const wrap = buildAllSitesDisplayWrap(canonicalRows);
  bdEl.replaceChildren(wrap);
  if (typeof bindSnapshotAllCardLinks === "function") bindSnapshotAllCardLinks();
  bdEl.scrollTop = 0;
}

/**
 * Render the all sites overview view
 * Fetches expose data and diagnosis meta for all sites, then displays summary cards
 * @returns {Promise<void>}
 * @example
 * await renderAllSites();
 * @see {buildSiteSummaryRow}
 */
async function renderAllSites() {
  // 전체현황 UI 정본(parity source).
  // 저장본 전체현황이 이 구조와 멀어지기 시작하면 drift가 생기므로,
  // 카드 구조/미니 KPI/그래프/반응형 규칙 변경 시 snapshot 쪽도 함께 점검한다.
  //
  // stage 2 seam:
  // fetch는 live provider가 계속 담당하지만,
  // 어떤 사이트/메타를 기준으로 그릴지는 facade를 통해 읽는다.
  // 즉 UI 정본은 유지하고 입력 경계만 provider 쪽으로 밀어낸다.
  const requestId = ++allViewReqId;
  const runtimeSites =
    typeof getRuntimeAllSites === "function" ? getRuntimeAllSites() : allSites;
  const requestStartedAt = Date.now();
  const requestMeta = {
    requestId: requestId,
    startedAt: requestStartedAt,
    siteCount: runtimeSites.length,
    progress: {
      owner: "runtime-bootstrap",
      kind: "all-sites-render",
      state: "loading",
      progressKind: "determinate",
      done: 0,
      total: runtimeSites.length,
      ratio: 0,
      percent: 0,
      label: "원본 패널 진행상태와 동기화 중",
      detail: "원본 패널이 전체현황 기본 데이터를 불러오는 중입니다.",
      updatedAt: requestStartedAt,
    },
  };
  allSitesRenderInFlightMeta = requestMeta;
  const requestPromise = (async function () {
  setAllSitesLabel();
  const loading = document.createElement("div");
  loading.style.cssText =
    "padding:" + T.spaceCardXl + " " + T.spaceCardLg + ";color:var(--sadv-text-secondary,#c6c6c6);text-align:left;line-height:1.6;background:var(--sadv-layer-01,#262626);border:1px solid var(--sadv-border-subtle,#393939);box-shadow:" + T.shadowCard;

  // 예상 소요 시간 계산 (사이트당 약 0.5초로 가정)
  const estimatedTimeSeconds = Math.ceil(runtimeSites.length * 0.5);
  const estimatedTimeText = estimatedTimeSeconds > 60
    ? `${Math.floor(estimatedTimeSeconds / 60)}분 ${estimatedTimeSeconds % 60}초`
    : `${estimatedTimeSeconds}초`;

  loading.innerHTML = sanitizeHTML(
    '<div style="font-size:13px;font-weight:700;color:var(--sadv-text,#f4f4f4);margin-bottom:8px">전체 현황을 준비 중입니다</div>' +
    `<div id="sadv-all-progress-detail" style="font-size:11px;margin-bottom:10px">기본 리포트를 불러오는 중입니다. (예상: ${estimatedTimeText})</div>` +
    '<div style="height:10px;border-radius:' + T.radiusPill + ';background:var(--sadv-layer-02,#171717);border:1px solid var(--sadv-border-subtle,#2b2200);overflow:hidden"><div id="sadv-all-progress-bar" style="width:6%;height:100%;background:linear-gradient(90deg,#ffd400,#ff7a00)"></div></div>' +
    '<div id="sadv-all-progress-meta" style="font-size:10px;color:var(--sadv-text-tertiary,#b9a55a);margin-top:8px">메타 진단은 2개씩 천천히 요청합니다.</div>' +
    '<div id="sadv-all-progress-percent" style="font-size:11px;color:#ffd400;margin-top:4px;font-weight:600">0%</div>'
  );
  bdEl.innerHTML = "";
  bdEl.appendChild(loading);

  if (!runtimeSites.length) {
    bdEl.replaceChildren(
      createStateCard(
        "사이트 목록을 찾을 수 없어요",
        "↻ 버튼을 눌러 새로고침 해보세요.<br>또는 서치어드바이저 콘솔 페이지에서 다시 실행해주세요.",
        ICONS.layers.replace('width="14" height="14"', 'width="20" height="20"'),
        "warning",
      )
    );
    return;
  }
  const sitesToLoad = runtimeSites;
  const siteDataBySite = {};
  const loadingDetail = loading.querySelector("#sadv-all-progress-detail");
  const loadingBar = loading.querySelector("#sadv-all-progress-bar");
  const loadingMeta = loading.querySelector("#sadv-all-progress-meta");
  const loadingPercent = loading.querySelector("#sadv-all-progress-percent");
  let missingDiagnosisMetaCount = null;

  // 시작 시간 기록 (예상 시간 정확도 개선)
  const startTime = Date.now();

  const setProgress = function (label, ratio, note) {
    // Phase 1 seam:
    // all-sites loading/progress 가드는 더 이상 curMode 전역을 직접 믿지 않고
    // selection seam을 통해 현재 모드를 읽는다.
    // 이유:
    // - live/saved가 같은 "현재 모드" 해석 규칙을 공유해야 하고
    // - 이후 shared app entry 단계에서 global 직접 read를 줄여야 하기 때문이다.
    const currentSelectionState = getAllSitesSelectionState();
    if (requestId !== allViewReqId || currentSelectionState.curMode !== CONFIG.MODE.ALL) return;
    if (ratio >= CONFIG.PROGRESS.META_PHASE_RATIO_START && missingDiagnosisMetaCount === 0) return;
    if (loadingDetail) loadingDetail.textContent = label;
    if (loadingBar) loadingBar.style.width = Math.max(6, Math.round(ratio * 100)) + "%";
    if (loadingPercent) {
      const percent = Math.round(ratio * 100);
      loadingPercent.textContent = `${percent}%`;
      // 진행률 색상 변경 (완료 시 녹색)
      loadingPercent.style.color = percent >= 100 ? C.green : C.blue;
    }
    if (loadingMeta && note) loadingMeta.textContent = note;
    if (requestMeta.progress) {
      requestMeta.progress = {
        ...requestMeta.progress,
        state: "loading",
        progressKind: "determinate",
        done: Math.max(
          0,
          Math.min(runtimeSites.length, Math.round(runtimeSites.length * Math.max(0, Math.min(1, ratio)))),
        ),
        total: runtimeSites.length,
        ratio: Math.max(0, Math.min(1, ratio)),
        percent: Math.max(0, Math.min(100, Math.round(ratio * 100))),
        label: "원본 패널 진행상태와 동기화 중",
        detail: label + (note ? " · " + note : ""),
        updatedAt: Date.now(),
      };
    }

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
  if (typeof clearFatalAuthAbortState === "function") {
    clearFatalAuthAbortState();
  }
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
    {
      const currentSelectionState = getAllSitesSelectionState();
      if (requestId !== allViewReqId || currentSelectionState.curMode !== CONFIG.MODE.ALL) return;
    }
    let failedCount = 0;
    let firstBatchError = null;
    batchResults.forEach(function (result, offset) {
      exposeResults[i + offset] = result;
      if (result.status === "fulfilled") {
        siteDataBySite[batchSites[offset]] = result.value;
      } else {
        failedCount++;
        if (!firstBatchError) firstBatchError = result.reason || new Error("expose data missing");
      }
    });
    if (failedCount > 0) {
      showError(
        "일부 사이트 기본 데이터를 불러오지 못했습니다.",
        firstBatchError,
        "renderAllSites-expose",
        { dedupeKey: "renderAllSites-expose-batch", dedupeWindowMs: 5000 },
      );
      if (loadingMeta) {
        loadingMeta.textContent = `${failedCount}개 사이트 실패 · 나머지 데이터로 계속 진행합니다.`;
      }
    }
    const fatalAuthState =
      typeof getFatalAuthAbortState === "function" ? getFatalAuthAbortState() : null;
    if (fatalAuthState) {
      setProgress(
        "로그인/권한 문제로 전체현황 갱신을 중단했습니다.",
        CONFIG.PROGRESS.BASE_RATIO_START + (Math.min(i + batchSites.length, sitesToLoad.length) / sitesToLoad.length) * CONFIG.PROGRESS.EXPOSE_PHASE_RATIO_RANGE,
        "남은 사이트 요청은 보내지 않았습니다. 다시 로그인한 뒤 새로고침 후 재시도해 주세요.",
      );
      if (loadingMeta) {
        loadingMeta.textContent =
          "로그인/권한 문제를 감지해 남은 사이트 요청을 중단했습니다.";
      }
      return;
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
    {
      const currentSelectionState = getAllSitesSelectionState();
      if (requestId !== allViewReqId || currentSelectionState.curMode !== CONFIG.MODE.ALL) return;
    }
    batchResults.forEach(function (result, offset) {
      metaLoaded += 1;
      if (result.status === "fulfilled") {
        siteDataBySite[batchSites[offset]] = result.value;
      }
    });
    const fatalAuthState =
      typeof getFatalAuthAbortState === "function" ? getFatalAuthAbortState() : null;
    if (fatalAuthState) {
      setProgress(
        "로그인/권한 문제로 색인 진단 갱신을 중단했습니다.",
        CONFIG.PROGRESS.META_PHASE_RATIO_START + (metaLoaded / Math.max(1, metaSitesToLoad.length)) * CONFIG.PROGRESS.META_PHASE_RATIO_RANGE,
        "남은 사이트 요청은 보내지 않았습니다. 다시 로그인한 뒤 새로고침 후 재시도해 주세요.",
      );
      if (loadingMeta) {
        loadingMeta.textContent =
          "로그인/권한 문제를 감지해 남은 사이트 요청을 중단했습니다.";
      }
      return;
    }
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
  setAllSitesCanonicalRows(rows);
  buildCombo(rows);
  {
    const currentSelectionState = getAllSitesSelectionState();
    if (requestId !== allViewReqId || currentSelectionState.curMode !== CONFIG.MODE.ALL) return;
  }
  renderAllSitesFromCanonicalRows();
  })();
  allSitesRenderInFlightPromise = requestPromise;
  try {
    return await requestPromise;
  } finally {
    if (allSitesRenderInFlightPromise === requestPromise) {
      allSitesRenderInFlightPromise = null;
      allSitesRenderInFlightMeta = null;
    }
  }
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
  if (typeof clearFatalAuthAbortState === "function") {
    clearFatalAuthAbortState();
  }
  const dataBySite = {};
  const summaryRows = [];
  const siteOwnershipBySite = {};
  const batchSize = FULL_REFRESH_BATCH_SIZE;
  const refreshMode = options && options.refreshMode === "refresh" ? "refresh" : "cache-first";
  const selectionState = getAllSitesSelectionState();
  const allSitesPeriodDays =
    typeof getRuntimeAllSitesPeriodDays === "function"
      ? getRuntimeAllSitesPeriodDays()
      : normalizeAllSitesPeriodDays(90);
  const liveAccountInfo =
    typeof ACCOUNT_UTILS !== "undefined" && ACCOUNT_UTILS && typeof ACCOUNT_UTILS.getAccountInfo === "function"
      ? ACCOUNT_UTILS.getAccountInfo()
      : { accountLabel: accountLabel || "", encId: encId || "" };
  const exportAccountLabel = liveAccountInfo?.accountLabel || accountLabel || "";
  const exportEncId = liveAccountInfo?.encId || encId || "unknown";
  await ensureExportSiteList(refreshMode);
  const exportSites =
    typeof getRuntimeAllSites === "function" ? getRuntimeAllSites() : allSites;
  const total = exportSites.length;
  let done = 0;
  const stats = { success: 0, partial: 0, failed: 0, errors: [] };
  for (let i = 0; i < exportSites.length; i += batchSize) {
    const fatalAuthBeforeBatch =
      typeof getFatalAuthAbortState === "function" ? getFatalAuthAbortState() : null;
    if (fatalAuthBeforeBatch) {
      const abortError =
        typeof buildFatalAuthAbortErrorFromState === "function"
          ? buildFatalAuthAbortErrorFromState(fatalAuthBeforeBatch)
          : new Error(fatalAuthBeforeBatch.userMessage || ERROR_MESSAGES.INVALID_ENCID);
      abortError.authAbortStats = { ...stats };
      abortError.authAbortDone = done;
      abortError.authAbortTotal = total;
      throw abortError;
    }
    const batch = exportSites.slice(i, i + batchSize);
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
      const sourceAccountInfo = {
        accountLabel: exportAccountLabel || "unknown",
        accountEncId: exportEncId,
        fetchedAt:
          siteData && typeof siteData.__cacheSavedAt === "number"
            ? siteData.__cacheSavedAt
            : new Date().toISOString(),
        exportedAt: savedAtIso(new Date()),
      };
      const normalizedSiteData = {
        ...siteData,
        __source: sourceAccountInfo,
      };
      dataBySite[site] = normalizedSiteData;
      const summaryRow = buildSiteSummaryRow(site, normalizedSiteData);
      if (!summaryRow.accountLabel && sourceAccountInfo.accountLabel) {
        summaryRow.accountLabel = sourceAccountInfo.accountLabel;
      }
      if (!summaryRow.sourceAccount) {
        summaryRow.sourceAccount = sourceAccountInfo;
      }
      summaryRows.push(summaryRow);
      if (!siteOwnershipBySite[site]) siteOwnershipBySite[site] = [];
      if (
        sourceAccountInfo.accountLabel &&
        siteOwnershipBySite[site].indexOf(sourceAccountInfo.accountLabel) === -1
      ) {
        siteOwnershipBySite[site].push(sourceAccountInfo.accountLabel);
      }
      done++;
      if (onProgress) onProgress(done, total, site, stats);
    });
    const fatalAuthState =
      typeof getFatalAuthAbortState === "function" ? getFatalAuthAbortState() : null;
    if (fatalAuthState) {
      const abortError =
        typeof buildFatalAuthAbortErrorFromState === "function"
          ? buildFatalAuthAbortErrorFromState(fatalAuthState)
          : new Error(fatalAuthState.userMessage || ERROR_MESSAGES.INVALID_ENCID);
      abortError.authAbortStats = { ...stats };
      abortError.authAbortDone = done;
      abortError.authAbortTotal = total;
      throw abortError;
    }
    if (refreshMode === "refresh" && i + batchSize < exportSites.length) {
      const jitter = Math.floor(Math.random() * FULL_REFRESH_JITTER_MS);
      await new Promise(function (resolve) {
        setTimeout(resolve, FULL_REFRESH_SITE_DELAY_MS + jitter);
      });
    }
  }
  summaryRows.sort((a, b) => b.totalC - a.totalC);

  // V2: Nested accounts structure
  // Use email as key (fallback to unknown@naver.com if not available)
  const accountEmail = (exportAccountLabel && exportAccountLabel.includes('@'))
    ? exportAccountLabel
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
        encId: exportEncId,
        sites: [...exportSites],
        siteMeta: typeof getSiteMetaMap === "function" ? getSiteMetaMap() : {},
        dataBySite: dataBySite
      }
    },
    ui: {
      curMode: selectionState.curMode,
      curSite: selectionState.curSite,
      curTab: selectionState.curTab,
      allSitesPeriodDays: allSitesPeriodDays,
    },
    mergedMeta:
      typeof getRuntimeMergedMeta === "function"
        ? getRuntimeMergedMeta()
        : (typeof getMergedMetaState === "function" ? getMergedMetaState() : null),
    siteOwnershipBySite: siteOwnershipBySite,
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
