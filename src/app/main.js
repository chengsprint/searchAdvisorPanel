  const ICONS = {
    // KPI / 통계 아이콘
    click: '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m5 11 4-7"/><path d="m19 11-4-7"/><path d="M2 11h20"/><path d="m3.5 11 1.6 7.4a2 2 0 0 0 2 1.6h9.8a2 2 0 0 0 2-1.6l1.7-7.4"/><path d="m9 11 1 9"/><path d="m15 11-1 9"/></svg>',
    eye: '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/></svg>',
    chart: '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="20" x2="12" y2="10"/><line x1="18" y1="20" x2="18" y2="4"/><line x1="6" y1="20" x2="6" y2="16"/></svg>',
    calendar: '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="18" height="18" x="3" y="4" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>',
    up: '<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></svg>',
    down: '<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="23 18 13.5 8.5 8.5 13.5 1 6"/><polyline points="17 18 23 18 23 12"/></svg>',
    index: '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>',
    link: '<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>',
    search: '<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>',
    external: '<svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>',
    // 탭 전용 아이콘 (13px)
    dashboard: '<svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="7" height="9" x="3" y="3" rx="1"/><rect width="7" height="5" x="14" y="3" rx="1"/><rect width="7" height="9" x="14" y="12" rx="1"/><rect width="7" height="5" x="3" y="16" rx="1"/></svg>',
    calendarDays: '<svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="18" height="18" x="3" y="4" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/><path d="M8 14h.01"/><path d="M12 14h.01"/><path d="M16 14h.01"/><path d="M8 18h.01"/><path d="M12 18h.01"/><path d="M16 18h.01"/></svg>',
    urlLink: '<svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>',
    searchTab: '<svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>',
    database: '<svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><ellipse cx="12" cy="5" rx="9" ry="3"/><path d="M3 5v14c0 1.66 4.03 3 9 3s9-1.34 9-3V5"/><path d="M3 12c0 1.66 4.03 3 9 3s9-1.34 9-3"/></svg>',
    activity: '<svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg>',
    backLinkTab: '<svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>',
    barChart: '<svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>',
    lightbulb: '<svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="9" y1="18" x2="15" y2="18"/><line x1="10" y1="22" x2="14" y2="22"/><path d="M15.09 14c.18-.98.65-1.74 1.41-2.5A4.65 4.65 0 0 0 18 8 6 6 0 0 0 6 8c0 1 .23 2.23 1.5 3.5A4.61 4.61 0 0 1 8.91 14"/></svg>',
    // UI 컨트롤 아이콘
    globe: '<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>',
    layers: '<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 2 7 12 12 22 7 12 2"/><polyline points="2 17 12 22 22 17"/><polyline points="2 12 12 17 22 12"/></svg>',
    refresh: '<svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8"/><path d="M21 3v5h-5"/><path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16"/><path d="M8 16H3v5"/></svg>',
    save: '<svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/></svg>',
    xMark: '<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>',
    chevronDown: '<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"/></svg>',
    logoSearch: '<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#10b981" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>',
    trendUp: '<svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="22 7 13.5 15.5 8.5 10.5 2 17"/><polyline points="16 7 22 7 22 13"/></svg>',
    linkInsight: '<svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>',
    pieChart: '<svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21.21 15.89A10 10 0 1 1 8 2.83"/><path d="M22 12A10 10 0 0 0 12 2v10z"/></svg>',
  };
  const C = {
    green: "#10b981",
    blue: "#0ea5e9",
    amber: "#f59e0b",
    red: "#ef4444",
    purple: "#a855f7",
    teal: "#14b8a6",
    orange: "#f97316",
    pink: "#ec4899",
    bg0: "#020617",
    bg1: "#0f172a",
    bg2: "#1e293b",
    border: "#334155",
    text: "#f8fafc",
    muted: "#64748b",
    sub: "#94a3b8",
  };
  const COLORS = [C.green, C.blue, C.amber, C.teal, C.purple, C.orange, C.pink];

  // Performance: Reusable style strings (reduces string allocation)
  const S = {
    card: "background:#0f172a;border:1px solid #334155;border-radius:12px;padding:16px;margin-bottom:12px;box-shadow:0 4px 6px -1px rgba(0,0,0,0.1)",
    row: "display:flex;justify-content:space-between;align-items:center;padding:16px;background:#0f172a;border:1px solid #334155;border-radius:12px;margin-bottom:12px;transition:all 0.2s",
    flexBetween: "display:flex;justify-content:space-between;align-items:center",
    muted: "font-size:12px;color:#94a3b8",
    valueGreen: "font-size:12px;font-weight:600;color:#10b981",
  };

  // Performance: Hoisted helper functions (avoids recreation on each call)
  const isFiniteValue = (v) => typeof v === "number" && Number.isFinite(v);
  const fmt = (v) => Number(v).toLocaleString();
  const fmtD = (s) =>
    s ? s.slice(0, 4) + "-" + s.slice(4, 6) + "-" + s.slice(6, 8) : "";
  const fmtB = (s) => (s ? s.slice(4, 6) + "/" + s.slice(6, 8) : "");
  const PNL = 490;
  const CHART_W = PNL - 32;
  const DOW = ["\uC77C", "\uC6D4", "\uD654", "\uC218", "\uBAA9", "\uAE08", "\uD1A0"];
  const SITE_COLORS_MAP = {};
  const SITE_LS_KEY = "sadv_sites_v1";
  const DATA_LS_PREFIX = "sadv_data_v2_";
  const UI_STATE_LS_KEY = "sadv_ui_state_v1";
  const DATA_TTL = 12 * 60 * 60 * 1000;
  const ALL_SITES_BATCH = 4;
  const FULL_REFRESH_BATCH_SIZE = 1;
  const FULL_REFRESH_SITE_DELAY_MS = 350;
  const FULL_REFRESH_JITTER_MS = 150;
  const BACKOFF_BASE_DELAY_MS = 2000;
  const BACKOFF_MAX_DELAY_MS = 30000;

  async function fetchWithRetry(url, options, maxRetries = 2) {
    let attempt = 0;
    while (attempt <= maxRetries) {
      try {
        const res = await fetch(url, options);
        if (res.ok) return res;
        if (res.status !== 429 && res.status < 500) return res; // Don't retry 4xx (except 429)
      } catch (e) {
        if (attempt === maxRetries) throw e;
      }
      attempt++;
      if (attempt <= maxRetries) {
        const delay = Math.min(BACKOFF_BASE_DELAY_MS * Math.pow(2, attempt - 1), BACKOFF_MAX_DELAY_MS);
        const jitter = Math.floor(Math.random() * 500);
        await new Promise((r) => setTimeout(r, delay + jitter));
      }
    }
    throw new Error("Max retries exceeded");
  }
  let TIP = null;
  function tip() {
    if (!TIP) {
      TIP = document.createElement("div");
      TIP.style.cssText =
        "position:fixed;background:rgba(15,23,42,0.9);backdrop-filter:blur(8px);border:1px solid #334155;border-radius:8px;padding:8px 12px;font-size:12px;color:#f8fafc;pointer-events:none;z-index:10000000;display:none;white-space:nowrap;box-shadow:0 10px 15px -3px rgba(0,0,0,0.1);font-family:Pretendard,system-ui";
      document.body.appendChild(TIP);
    }
    return TIP;
  }
  function showTip(e, h) {
    const t = tip();
    t.innerHTML = escHtml(h);
    t.style.display = "block";
    moveTip(e);
  }
  function moveTip(e) {
    const t = tip();
    if (t.style.display === "none") return;
    const tw = t.offsetWidth;
    t.style.left =
      (e.clientX + 14 + tw > window.innerWidth
        ? e.clientX - tw - 10
        : e.clientX + 14) + "px";
    t.style.top = e.clientY - 36 + "px";
  }
  function hideTip() {
    tip().style.display = "none";
  }
  function sparkline(vals, labels, H, col, unit, opts) {
    unit = unit || "";
    opts = opts || {};
    if (!vals || vals.length < 2) return document.createElement("div");
    const W2 = CHART_W;
    const definedVals = vals.filter(isFiniteValue);
    if (!definedVals.length) return document.createElement("div");
    const floorMin =
      typeof opts.minValue === "number" && Number.isFinite(opts.minValue)
        ? opts.minValue
        : null;
    const pL = 4,
      pR = 4,
      pT = 6,
      pB = 6,
      mx = Math.max(...definedVals),
      mn = floorMin == null ? Math.min(...definedVals) : Math.min(floorMin, Math.min(...definedVals)),
      rng = mx - mn || 1;
    const showYAxisGuides = H >= 65;
    const formatAxisValue = function (value) {
      const rounded =
        Math.abs(value - Math.round(value)) < 0.05
          ? Math.round(value)
          : Math.round(value * 10) / 10;
      return fmt(rounded) + unit;
    };
    const uid = "g" + Math.random().toString(36).slice(2, 6),
      cid = "c" + uid,
      wid = "w" + uid;
    const pts = vals.map((v, i) => {
      const x = +(pL + (i * (W2 - pL - pR)) / (vals.length - 1)).toFixed(1);
      return isFiniteValue(v)
        ? [x, +(pT + (1 - (v - mn) / rng) * (H - pT - pB)).toFixed(1)]
        : [x, null];
    });
    const cleanSegments = [];
    let currentSegment = null;
    pts.forEach(function (pt) {
      if (pt[1] == null) {
        if (currentSegment && currentSegment.length) {
          cleanSegments.push(currentSegment);
          currentSegment = null;
        }
        return;
      }
      if (!currentSegment) {
        currentSegment = [];
      }
      currentSegment.push(pt);
    });
    if (currentSegment && currentSegment.length) {
      cleanSegments.push(currentSegment);
    }
    const path = cleanSegments
      .map(function (seg) {
        return "M" + seg.map((p) => p.join(",")).join(" L");
      })
      .join(" ");
    const area = cleanSegments
      .map(function (seg) {
        return (
          "M" +
          seg[0][0] +
          "," +
          H +
          " L" +
          seg.map((p) => p.join(",")).join(" L") +
          " L" +
          seg[seg.length - 1][0] +
          "," +
          H +
          " Z"
        );
      })
      .join(" ");
    const guideMarkup = showYAxisGuides
      ? [mx, mn + (mx - mn) / 2, mn]
          .reduce(function (acc, value) {
            const y = +(
              pT +
              (1 - (value - mn) / rng) * (H - pT - pB)
            ).toFixed(1);
            if (
              !acc.some(function (entry) {
                return Math.abs(entry.y - y) < 8;
              })
            ) {
              acc.push({ value, y });
            }
            return acc;
          }, [])
          .map(function (entry) {
            return (
              '<line x1="' +
              pL +
              '" y1="' +
              entry.y +
              '" x2="' +
              (W2 - pR) +
              '" y2="' +
              entry.y +
              '" stroke="#9cb6cf" stroke-width="1" stroke-dasharray="4,4" opacity="0.34"/>' +
              '<text x="' +
              +(W2 / 2).toFixed(1) +
              '" y="' +
              entry.y +
              '" fill="#d7e5f4" font-size="9" font-weight="700" text-anchor="middle" dominant-baseline="middle" opacity="0.78" style="paint-order:stroke;stroke:#07111d;stroke-width:4;stroke-linejoin:round">' +
              formatAxisValue(entry.value) +
              "</text>"
            );
          })
          .join("")
      : "";
    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.setAttribute("width", "100%");
    svg.setAttribute("height", H);
    svg.setAttribute("viewBox", "0 0 " + W2 + " " + H);
    svg.setAttribute("preserveAspectRatio", "none");
    svg.style.cssText = "display:block;width:100%;height:auto;cursor:crosshair";
    svg.innerHTML =

      '<defs><linearGradient id="' +

      uid +

      '" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="' +

      col +

      '" stop-opacity="0.22"/><stop offset="100%" stop-color="' +

      col +

      '" stop-opacity="0.01"/></linearGradient></defs>' +

      guideMarkup +

      '<path d="' +

      area +

      '" fill="url(#' +

      uid +

      ')"/><path d="' +

      path +

      '" fill="none" stroke="' +

      col +

      '" stroke-width="1.6" stroke-linejoin="round" stroke-linecap="round"/><line id="' +

      wid +

      '" x1="0" y1="0" x2="0" y2="' +

      H +

      '" stroke="#3d5a78" stroke-width="1" stroke-dasharray="3,2" opacity="0"/><circle id="' +

      cid +

      '" cx="0" cy="0" r="3.5" fill="' +

      col +

      '" stroke="#060b14" stroke-width="1.5" opacity="0"/>';

    svg.addEventListener("mousemove", function (e) {
      const rect = svg.getBoundingClientRect(),
        rx = e.clientX - rect.left,
        chartX = rect.width ? (rx / rect.width) * W2 : rx;
      const idx = Math.max(
          0,
          Math.min(
            vals.length - 1,
            Math.round(((chartX - pL) / (W2 - pL - pR)) * (vals.length - 1)),
          ),
        ),
        pt = pts[idx];
      svg.querySelector("#" + wid).setAttribute("x1", pt[0]);
      svg.querySelector("#" + wid).setAttribute("x2", pt[0]);
      svg.querySelector("#" + wid).setAttribute("opacity", "1");
      const c = svg.querySelector("#" + cid);
      if (pt[1] == null) {
        c.setAttribute("opacity", "0");
      } else {
        c.setAttribute("cx", pt[0]);
        c.setAttribute("cy", pt[1]);
        c.setAttribute("opacity", "1");
      }
      showTip(
        e,
        '<span style="color:#7a9ab8;font-size:10px">' +
          ((labels && labels[idx]) || "") +
          '</span><br><b style="color:' +
          col +
          '">' +
          (isFiniteValue(vals[idx])
            ? fmt(vals[idx]) + unit
            : "\uB370\uC774\uD130 \uC5C6\uC74C") +
          "</b>",
      );
    });
    svg.addEventListener("mouseleave", function () {
      svg.querySelector("#" + wid).setAttribute("opacity", "0");
      svg.querySelector("#" + cid).setAttribute("opacity", "0");
      hideTip();
    });
    svg.addEventListener("mousemove", moveTip);
    return svg;
  }
function barchart(vals, labels, H, col, unit) {
    unit = unit || "";
    if (!vals || !vals.length) return document.createElement("div");
    const W2 = CHART_W;
    const mx = Math.max(...vals) || 1,
      gap = 3,
      bw = Math.max(3, (W2 - gap * (vals.length + 1)) / vals.length);
    const showYAxisGuides = H >= 65;
    const formatAxisValue = function (value) {
      const rounded =
        Math.abs(value - Math.round(value)) < 0.05
          ? Math.round(value)
          : Math.round(value * 10) / 10;
      return fmt(rounded) + unit;
    };
    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.setAttribute("width", "100%");
    svg.setAttribute("height", H);
    svg.setAttribute("viewBox", "0 0 " + W2 + " " + H);
    svg.setAttribute("preserveAspectRatio", "none");
    svg.style.cssText = "display:block;width:100%;height:auto";
    const uid = "b" + Math.random().toString(36).slice(2, 5);
    const guideMarkup = showYAxisGuides
      ? [mx, mx / 2, 0]
          .reduce(function (acc, value) {
            const y = +(H - Math.max(2, (value / mx) * (H - 4))).toFixed(1);
            if (
              !acc.some(function (entry) {
                return Math.abs(entry.y - y) < 8;
              })
            ) {
              acc.push({ value, y });
            }
            return acc;
          }, [])
          .map(function (entry) {
            return (
              '<line x1="0" y1="' +
              entry.y +
              '" x2="' +
              W2 +
              '" y2="' +
              entry.y +
              '" stroke="#9cb6cf" stroke-width="1" stroke-dasharray="4,4" opacity="0.34"/>' +
              '<text x="' +
              +(W2 / 2).toFixed(1) +
              '" y="' +
              entry.y +
              '" fill="#d7e5f4" font-size="9" font-weight="700" text-anchor="middle" dominant-baseline="middle" opacity="0.78" style="paint-order:stroke;stroke:#07111d;stroke-width:4;stroke-linejoin:round">' +
              formatAxisValue(entry.value) +
              "</text>"
            );
          })
          .join("")
      : "";
    svg.innerHTML = `<defs><linearGradient id="${uid}" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="${col}" stop-opacity="0.9"/><stop offset="100%" stop-color="${col}" stop-opacity="0.35"/></linearGradient></defs>${guideMarkup}`;
    vals.forEach(function (v, i) {
      const bh = Math.max(2, (v / mx) * (H - 4)),
        x = gap + i * (bw + gap),
        y = H - bh,
        isBest = v === mx;
      const rect = document.createElementNS(
        "http://www.w3.org/2000/svg",
        "rect",
      );
      rect.setAttribute("x", +x.toFixed(1));
      rect.setAttribute("y", +y.toFixed(1));
      rect.setAttribute("width", +bw.toFixed(1));
      rect.setAttribute("height", +bh.toFixed(1));
      rect.setAttribute("rx", "2");
      rect.setAttribute("fill", isBest ? C.green : "url(#" + uid + ")");
      rect.setAttribute("opacity", isBest ? "1" : "0.7");
      rect.addEventListener("mouseenter", function (e) {
        rect.setAttribute("opacity", "1");
        showTip(
          e,
          `<span style="color:#7a9ab8;font-size:10px">${escHtml((labels && labels[i]) || "")}</span><br><b style="color:${col}">${fmt(v)}${unit}</b>`,
        );
      });
      rect.addEventListener("mouseleave", function () {
        rect.setAttribute("opacity", isBest ? "1" : "0.7");
        hideTip();
      });
      rect.addEventListener("mousemove", moveTip);
      svg.appendChild(rect);
    });
    return svg;
  }
  function xlbl(arr) {
    if (!arr || !arr.length) return "";
    const rankLike = arr.every(function (v) {
      return /^#\\d+$/.test(v || "");
    });
    const labels = [];
    if (rankLike && arr.length >= 20) {
      labels.push(arr[0]);
      for (let i = 9; i < arr.length; i += 10) labels.push(arr[i]);
      if (labels[labels.length - 1] !== arr[arr.length - 1]) {
        labels.push(arr[arr.length - 1]);
      }
    } else {
      labels.push(arr[0]);
      if (arr.length > 2) labels.push(arr[Math.floor(arr.length / 2)]);
      if (arr.length > 1) labels.push(arr[arr.length - 1]);
    }
    return `<div style="display:flex;justify-content:space-between;gap:8px;padding:4px 2px 0">${labels
      .map(function (label) {
        return `<span style="font-size:9px;color:#3d5a78">${escHtml(label || "")}</span>`;
      })
      .join("")}</div>`;
  }
  function chartCard(title, valueStr, valueCol, svgEl, labelsArr) {
    const wrap = document.createElement("div");
    wrap.style.cssText =
      "background:#0f172a;border:1px solid #334155;border-radius:12px;padding:16px;margin-bottom:12px;overflow:hidden;box-shadow:0 1px 3px rgba(0,0,0,0.1)";
    const hd = document.createElement("div");
    hd.style.cssText =
      "display:flex;justify-content:space-between;align-items:flex-start;gap:12px;margin-bottom:12px";
    hd.innerHTML = `<span style="font-size:12px;line-height:1.4;color:#94a3b8;font-weight:600">${escHtml(title)}</span><span style="font-size:14px;line-height:1.2;font-weight:800;color:${valueCol};text-align:right;letter-spacing:-0.01em">${escHtml(valueStr)}</span>`;
    wrap.appendChild(hd);
    wrap.appendChild(svgEl);
    if (labelsArr) {
      const lbl = document.createElement("div");
      lbl.innerHTML = xlbl(labelsArr);
      wrap.appendChild(lbl);
    }
    return wrap;
  }
  function kpiGrid(items) {
    const g = document.createElement("div");
    g.style.cssText = `display:grid;grid-template-columns:repeat(${Math.min(items.length, 4)},minmax(0,1fr));gap:8px;margin-bottom:12px`;
    items.forEach(function (it) {
      const d = document.createElement("div");
      d.style.cssText =
        "background:#0f172a;border:1px solid #334155;border-radius:12px;padding:16px 8px;text-align:center;min-width:0;min-height:90px;display:flex;flex-direction:column;justify-content:center;align-items:center;transition:all 0.2s;box-shadow:0 1px 2px rgba(0,0,0,0.05)";
      const iconHtml = it.icon ? `<div style="margin-bottom:8px;color:${it.color || '#94a3b8'};opacity:0.8">${it.icon}</div>` : "";
      d.innerHTML = `${iconHtml}<div style="font-size:16px;font-weight:800;color:${it.color || C.text};line-height:1.1;letter-spacing:-0.02em;word-break:keep-all">${escHtml(it.value)}</div><div style="font-size:10px;color:#64748b;line-height:1.4;margin-top:4px;visibility:${it.sub ? "visible" : "hidden"}">${escHtml(it.sub || "&nbsp;")}</div><div style="font-size:10px;color:#94a3b8;line-height:1.4;margin-top:6px;word-break:keep-all;font-weight:500">${escHtml(it.label)}</div>`;
      g.appendChild(d);
    });
    return g;
  }
  function secTitle(t) {
    const d = document.createElement("div");
    d.style.cssText =
      "font-size:11px;font-weight:700;letter-spacing:0.05em;text-transform:uppercase;color:#64748b;margin:24px 0 12px;display:flex;align-items:center;gap:10px";
    d.innerHTML =
      t +
      ' <span style="flex:1;height:1px;background:#334155;display:inline-block;opacity:0.3"></span>';
    return d;
  }
  function ibox(type, html) {
    const col =
      { green: C.green, amber: C.amber, red: C.red, blue: C.blue }[type] ||
      C.blue;
    const d = document.createElement("div");
    d.style.cssText = `border-left:3px solid ${col};background:${col}0d;border-radius:12px;padding:16px;margin-bottom:12px;font-size:12px;line-height:1.6;color:#94a3b8;border:1px solid ${col}22`;
    d.innerHTML = html; // Warning: callers must ensure HTML is safe or sanitized
    return d;
  }
  function ctrBadge(v) {
    const n = parseFloat(v);
    if (isNaN(n)) {
      return '<span style="display:inline-block;background:#1e293b;border:1px solid #334155;color:#64748b;font-size:10px;font-weight:700;padding:1px 6px;border-radius:20px">-</span>';
    }
    const col = n >= 3 ? C.green : n >= 1.5 ? C.amber : C.blue;
    return `<span style="display:inline-block;background:${col}18;border:1px solid ${col}44;color:${col};font-size:10px;font-weight:700;padding:1px 6px;border-radius:20px">${n.toFixed(2)}%</span>`;
  }
  function hbar(v, mx, col) {
    const pct = mx ? Math.round((v / mx) * 100) : 0;
    return `<div style="height:6px;background:#1e293b;border-radius:3px;margin:8px 0 10px;overflow:hidden"><div style="width:${pct}%;height:100%;background:${col};border-radius:3px;transition:width 0.5s ease-out"></div></div>`;
  }
  function st(arr) {
    if (!arr || !arr.length)
      return { mean: 0, std: 0, cv: 0, slope: 0, outliers: [] };
    const n = arr.length,
      mean = arr.reduce((a, b) => a + b, 0) / n;
    const sorted = [...arr].sort((a, b) => a - b);
    const std = Math.sqrt(arr.reduce((a, b) => a + (b - mean) ** 2, 0) / n);
    const cv = mean ? std / mean : 0;
    const xs = arr.map((_, i) => i),
      xm = xs.reduce((a, b) => a + b, 0) / n;
    const slope =
      xs.reduce((a, x, i) => a + (x - xm) * (arr[i] - mean), 0) /
      (xs.reduce((a, x) => a + (x - xm) ** 2, 0) || 1);
    const q1 = sorted[Math.floor(n * 0.25)],
      q3 = sorted[Math.floor(n * 0.75)],
      iqr = q3 - q1;
    const outliers = arr.filter(
      (v) => v < q1 - 1.5 * iqr || v > q3 + 1.5 * iqr,
    );
    return { mean, std, cv, slope, outliers };
  }
  function pearson(xs, ys) {
    const n = xs.length,
      mx = xs.reduce((a, b) => a + b, 0) / n,
      my = ys.reduce((a, b) => a + b, 0) / n;
    const num = xs.reduce((a, x, i) => a + (x - mx) * (ys[i] - my), 0);
    const den = Math.sqrt(
      xs.reduce((a, x) => a + (x - mx) ** 2, 0) *
        ys.reduce((a, y) => a + (y - my) ** 2, 0),
    );
    return den ? num / den : 0;
  }
  const old = document.getElementById("sadv-p");
  if (old) {
    old.remove();
    document.getElementById("sadv-inj") &&
      document.getElementById("sadv-inj").remove();
    return;
  }
  const inj = document.createElement("style");
  inj.id = "sadv-inj";
  inj.textContent = `html{margin-right:min(${PNL}px,100vw) !important;transition:margin-right .25s ease;box-sizing:border-box;}`;
  document.head.appendChild(inj);
  const p = document.createElement("div");
  p.id = "sadv-p";
  p.style.cssText = `position:fixed;top:0;right:0;width:min(${PNL}px,100vw);max-width:100vw;height:100vh;display:flex;flex-direction:column;background:#020617;z-index:9999999;font-family:Pretendard,system-ui,sans-serif;font-size:13px;color:#f8fafc;border-left:1px solid #334155;box-sizing:border-box;box-shadow:-10px 0 15px -3px rgba(0,0,0,0.1)`;
  p.innerHTML = `<style>#sadv-p *{box-sizing:border-box}#sadv-p ::-webkit-scrollbar{width:6px}#sadv-p ::-webkit-scrollbar-thumb{background:#334155;border-radius:3px}#sadv-header{padding:20px;border-bottom:1px solid #1e293b;background:rgba(2,6,23,0.8);backdrop-filter:blur(12px)}#sadv-mode-bar{display:flex;gap:4px;margin-top:16px;background:#0f172a;padding:4px;border-radius:12px;border:1px solid #334155}.sadv-mode{flex:1;background:transparent;border:none;color:#94a3b8;border-radius:8px;padding:8px;font-size:12px;font-weight:600;cursor:pointer;transition:all .2s}.sadv-mode.on{background:#1e293b;color:#0ea5e9;box-shadow:0 4px 6px -1px rgba(0,0,0,0.2)}#sadv-site-bar{margin-top:12px;position:relative;display:none}#sadv-site-bar.show{display:block}#sadv-combo-wrap{position:relative}#sadv-combo-btn{width:100%;background:#0f172a;border:1px solid #334155;color:#f8fafc;border-radius:10px;padding:10px 36px 10px 12px;font-size:13px;cursor:pointer;text-align:left;font-family:inherit;transition:all .2s;display:flex;align-items:center;gap:10px}#sadv-combo-btn:hover{border-color:#0ea5e9;background:#1e293b}#sadv-combo-dot{width:8px;height:8px;border-radius:50%;flex-shrink:0;background:#64748b}#sadv-combo-label{flex:1;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;font-size:13px;font-weight:500}#sadv-combo-arrow{position:absolute;right:12px;top:50%;transform:translateY(-50%);color:#64748b;font-size:12px;pointer-events:none;transition:transform .2s}#sadv-combo-wrap.open #sadv-combo-arrow{transform:translateY(-50%) rotate(180deg)}#sadv-combo-drop{display:none;position:absolute;top:calc(100% + 8px);left:0;right:0;background:#0f172a;border:1px solid #334155;border-radius:12px;padding:6px;z-index:100;box-shadow:0 10px 15px -3px rgba(0,0,0,0.1);max-height:300px;overflow-y:auto}#sadv-combo-wrap.open #sadv-combo-drop{display:block}.sadv-combo-item{display:flex;align-items:center;gap:10px;padding:8px 12px;border-radius:8px;cursor:pointer;transition:all .1s;border:1px solid transparent}.sadv-combo-item:hover{background:#1e293b}.sadv-combo-item.active{background:#1e293b;border-color:#334155;color:#0ea5e9}#sadv-tabs{display:none;flex-wrap:wrap;gap:6px;padding:12px 20px;background:#020617;border-bottom:1px solid #1e293b;justify-content:center}#sadv-tabs.show{display:flex;justify-content:center}#sadv-tabs::-webkit-scrollbar{display:none}.sadv-t{background:transparent;border:1px solid transparent;color:#64748b;border-radius:8px;padding:6px 12px;font-size:12px;font-weight:600;cursor:pointer;transition:all .2s}.sadv-t:hover{color:#f8fafc;background:#1e293b}.sadv-t.on{background:rgba(14,165,233,0.1);border-color:rgba(14,165,233,0.2);color:#0ea5e9}#sadv-refresh-btn{display:inline-flex;align-items:center;gap:6px;background:#0f172a;border:1px solid #334155;color:#94a3b8;border-radius:8px;padding:6px 10px;font-size:12px;font-weight:600;cursor:pointer;font-family:inherit;transition:all .2s}#sadv-refresh-btn:hover{border-color:#0ea5e9;color:#0ea5e9;background:#1e293b}#sadv-bd{flex:1;overflow-y:auto;overflow-x:hidden;padding:20px}#sadv-tabpanel{flex:1;overflow-y:auto;overflow-x:hidden;padding:20px}.sadv-allcard{background:#0f172a;border:1px solid #1e293b;border-radius:16px;padding:20px;margin-bottom:16px;cursor:pointer;transition:all .2s}.sadv-allcard:hover{border-color:#334155;transform:translateY(-2px)}</style><div id="sadv-header"><div style="display:flex;justify-content:space-between;align-items:center"><div><div style="display:flex;align-items:center;gap:8px;flex-wrap:wrap"><div style="display:flex;align-items:center;gap:7px;font-size:18px;font-weight:800;letter-spacing:-0.03em"><span style="display:inline-flex;opacity:0.95">${ICONS.logoSearch}</span>Search<span style="color:#10b981">Advisor</span></div><div id="sadv-account-badge" style="display:none;padding:4px 12px;border-radius:999px;border:1px solid #1e293b;color:#0ea5e9;background:rgba(15,23,42,0.6);font-size:11px;font-weight:600;line-height:1.2;overflow:hidden;text-overflow:ellipsis;white-space:nowrap"></div></div><div id="sadv-site-label" style="font-size:11px;color:#64748b;margin-top:4px;display:flex;align-items:center;gap:4px">\ub85c\ub529 \uc911...</div></div><div style="display:flex;gap:8px;align-items:center"><button id="sadv-refresh-btn" class="sadv-btn" title="새로고침" style="display:inline-flex;align-items:center;gap:5px">${ICONS.refresh} 새로고침</button><button id="sadv-save-btn" class="sadv-btn" title="현재 화면 저장" style="display:inline-flex;align-items:center;gap:5px">${ICONS.save} 저장</button><button id="sadv-x" style="background:none;border:1px solid #1e293b;color:#475569;width:32px;height:32px;border-radius:8px;cursor:pointer;display:inline-flex;align-items:center;justify-content:center;flex-shrink:0;transition:all 0.2s">${ICONS.xMark}</button></div></div><div id="sadv-mode-bar"><button class="sadv-mode on" data-m="all" style="display:inline-flex;align-items:center;justify-content:center;gap:5px">${ICONS.globe} 전체현황</button><button class="sadv-mode" data-m="site" style="display:inline-flex;align-items:center;justify-content:center;gap:5px">${ICONS.layers} 사이트별</button></div><div id="sadv-site-bar"><div id="sadv-combo-wrap"><button id="sadv-combo-btn"><span id="sadv-combo-dot"></span><span id="sadv-combo-label">\uc0ac\uc774\ud2b8 \uc120\ud0dd</span></button><span id="sadv-combo-arrow" style="display:inline-flex;align-items:center">${ICONS.chevronDown}</span><div id="sadv-combo-drop"></div></div></div></div><div id="sadv-tabs"></div><div id="sadv-bd"><div style="padding:60px 20px;text-align:center;color:#64748b">⏳ \ub85c\ub529 \uc911...</div></div>`;
  document.body.appendChild(p);
  const siteUiStyle = document.createElement("style");
  siteUiStyle.textContent = `
#sadv-tabs{
  position:relative;
}
#sadv-tabs.show{
  display:flex !important;
  flex-wrap:wrap;
  gap:6px;
  padding:12px 20px;
  background:#020617;
  border-bottom:1px solid #1e293b;
}
.sadv-t{
  position:relative;
  min-height:32px;
  padding:6px 12px;
  border-radius:8px;
  border:1px solid transparent;
  background:transparent;
  color:#64748b;
  font-size:12px;
  font-weight:600;
  transition:all 0.2s ease;
  margin:0;
}
.sadv-t:hover{
  color:#f8fafc;
  background:#1e293b;
}
.sadv-t.on{
  background:rgba(14, 165, 233, 0.1);
  border-color:rgba(14, 165, 233, 0.2);
  color:#0ea5e9;
}
#sadv-bd{
  padding:20px;
}
#sadv-save-btn{
  display:inline-flex;
  align-items:center;
  gap:6px;
  background:#0f172a;
  border:1px solid #334155;
  color:#94a3b8;
  border-radius:8px;
  padding:6px 10px;
  font-size:12px;
  font-weight:600;
  cursor:pointer;
  font-family:inherit;
  transition:all 0.2s ease;
}
#sadv-save-btn:hover{
  border-color:#0ea5e9;
  color:#0ea5e9;
  background:#1e293b;
}
#sadv-x:hover {
  border-color:#ef4444;
  color:#ef4444;
  background:rgba(239,68,68,0.1);
}
`;
  p.appendChild(siteUiStyle);
  document.getElementById("sadv-x").onclick = function () {
    p.remove();
    document.getElementById("sadv-inj") &&
      document.getElementById("sadv-inj").remove();
    if (TIP) {
      TIP.remove();
      TIP = null;
    }
  };
  function escHtml(v) {
    return String(v || "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");
  }
  function pad2(v) {
    return String(v).padStart(2, "0");
  }
  function stampFile(d) {
    return (
      d.getFullYear() +
      pad2(d.getMonth() + 1) +
      pad2(d.getDate()) +
      "-" +
      pad2(d.getHours()) +
      pad2(d.getMinutes()) +
      pad2(d.getSeconds())
    );
  }
  function stampLabel(d) {
    return (
      d.getFullYear() +
      "." +
      pad2(d.getMonth() + 1) +
      "." +
      pad2(d.getDate()) +
      " " +
      pad2(d.getHours()) +
      ":" +
      pad2(d.getMinutes()) +
      ":" +
      pad2(d.getSeconds())
    );
  }
  function fileSafe(v) {
    return String(v || "snapshot")
      .replace(/^https?:\/\//, "")
      .replace(/[\\/:*?"<>|]+/g, "-")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-")
      .replace(/^-|-$/g, "")
      .slice(0, 80);
  }
  function accountIdFromLabel(v) {
    const raw = String(v || "").trim();
    const localPart = raw.includes("@") ? raw.split("@")[0] : raw;
    return fileSafe(localPart || "unknown");
  }
  function getAccountLabel() {
    try {
      const authUser =
        window.__NUXT__ &&
        window.__NUXT__.state &&
        window.__NUXT__.state.authUser;
      return authUser && typeof authUser.email === "string"
        ? authUser.email
        : "";
    } catch (e) {}
    return "";
  }
  function applyAccountBadge(accountLabel) {
    const badge = document.getElementById("sadv-account-badge");
    if (!badge) return;
    if (!accountLabel) {
      badge.style.display = "none";
      badge.textContent = "";
      badge.removeAttribute("title");
      return;
    }
    badge.style.display = "inline-flex";
    badge.textContent = accountLabel;
    badge.title = accountLabel;
  }
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
            fetchedAt: siteData.__cacheSavedAt || new Date().toISOString(),
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
    return {
      savedAt: savedAtIso(new Date()),
      accountLabel: accountLabel || "unknown",
      accountEncId: encId || "unknown",
      generatorVersion: window.__SEARCHADVISOR_RUNTIME_VERSION__ || "unknown",
      exportFormat: "snapshot-v2",
      curMode,
      curSite,
      curTab,
      allSites: [...allSites],
      summaryRows,
      dataBySite,
      siteMeta: typeof getSiteMetaMap === "function" ? getSiteMetaMap() : {},
      mergedMeta: typeof getMergedMetaState === "function" ? getMergedMetaState() : null,
      stats,
    };
  }
  function renderFullRefreshProgress(label, detail, progress, stats) {
    const ratio =
      typeof progress === "number" && isFinite(progress)
        ? Math.max(0.06, Math.min(1, progress))
        : 0.06;
    const st = stats || { success: 0, partial: 0, failed: 0, errors: [] };
    const pct = Math.round(ratio * 100);
    let statsHtml = "";
    if (st.success > 0 || st.partial > 0 || st.failed > 0) {
      statsHtml =
        '<div style="display:flex;gap:12px;margin-top:8px;font-size:10px">' +
        '<span style="color:#4ade80">' + st.success + ' success</span>' +
        '<span style="color:#fbbf24">' + st.partial + ' partial</span>' +
        '<span style="color:#f87171">' + st.failed + ' failed</span>' +
        "</div>";
    }
    let errorsHtml = "";
    if (st.errors && st.errors.length > 0 && st.errors.length <= 3) {
      errorsHtml =
        '<div style="margin-top:10px;font-size:10px;color:#f87171;line-height:1.4">' +
        st.errors.map(function (e) { return escHtml(e.site) + ": " + escHtml(e.error); }).join("<br>") +
        "</div>";
    }
    bdEl.innerHTML =
      '<div style="padding:24px 18px 20px;color:#7a9ab8;text-align:left;line-height:1.6">' +
      '<div style="font-size:13px;font-weight:700;color:#d4ecff;margin-bottom:8px">' +
      label +
      "</div>" +
      '<div style="font-size:11px;margin-bottom:10px">' +
      (detail || "") +
      "</div>" +
      '<div style="display:flex;align-items:center;gap:8px;margin-bottom:4px">' +
      '<div style="flex:1;height:10px;border-radius:999px;background:#0d1829;border:1px solid #1a2d45;overflow:hidden">' +
      '<div style="width:' +
      pct +
      '%;height:100%;background:linear-gradient(90deg,#40c4ff,#00e676)"></div>' +
      "</div>" +
      '<span style="font-size:11px;font-weight:700;color:#d4ecff;min-width:48px;text-align:right">' +
      pct +
      "%</span>" +
      "</div>" +
      statsHtml +
      errorsHtml +
      "</div>";
  }
  function shouldBootstrapFullRefresh() {
    if (!allSites.length) return false;
    const now = Date.now();
    const siteListTs = getSiteListCacheStamp();
    if (!(typeof siteListTs === "number") || now - siteListTs >= DATA_TTL) return true;
    return allSites.some(function (site) {
      const siteTs = getSiteDataCacheStamp(site);
      return !(typeof siteTs === "number") || now - siteTs >= DATA_TTL;
    });
  }
  async function runFullRefreshPipeline(options = {}) {
    const trigger = options && options.trigger ? options.trigger : "manual";
    const triggerLabel =
      trigger === "cache-expiry"
        ? "\uce90\uc2dc\uac00 \ub9cc\ub8cc\ub418\uc5b4 \uc804\uccb4 \ub370\uc774\ud130\ub97c \ub2e4\uc2dc \uc218\uc9d1\ud558\uace0 \uc788\uc5b4\uc694."
        : "\uc804\uccb4 \ub370\uc774\ud130\ub97c \ub2e4\uc2dc \uc218\uc9d1\ud558\uace0 \uc788\uc5b4\uc694.";
    const triggerDetail =
      trigger === "cache-expiry"
        ? "\uc804\uccb4\ud604\ud669\uacfc \uc0ac\uc774\ud2b8\ubcc4 \uc0c1\uc138\ud0ed\uc744 \ubaa8\ub450 \ucd5c\uc2e0 \uc0c1\ud0dc\ub85c \ub9de\ucd94\ub294 \uc911\uc785\ub2c8\ub2e4."
        : "\uc0ac\uc774\ud2b8 \ubaa9\ub85d\ubd80\ud130 expose, diagnosisMeta, crawl, backlink\uae4c\uc9c0 \uc21c\uc11c\ub300\ub85c \uac31\uc2e0\ud569\ub2c8\ub2e4.";
    renderFullRefreshProgress(triggerLabel, triggerDetail, 0);
    labelEl.innerHTML = "<span>\uc804\uccb4 \uc7ac\uc218\uc9d1 \uc9c4\ud589 \uc911</span>";
    const btn = options && options.button ? options.button : null;
    const payload = await collectExportData(
      function (done, total, site, stats) {
        const safeTotal = Math.max(1, total);
        const shortSite = site
          ? site.replace("https://", "").replace("http://", "")
          : "";
        const detail =
          done +
          " / " +
          safeTotal +
          " \uc0ac\uc774\ud2b8 \ucc98\ub9ac \uc911" +
          (shortSite ? " · " + shortSite : "");
        renderFullRefreshProgress(triggerLabel, detail, done / safeTotal, stats);
        if (btn) btn.textContent = done + "/" + safeTotal;
      },
      { refreshMode: "refresh" },
    );
    window.__sadvRows = payload.summaryRows;
    buildCombo(payload.summaryRows);
    assignColors();
    ensureCurrentSite();
    if (curSite) setComboSite(curSite);
    if (curMode === "site" && curSite) {
      await loadSiteView(curSite);
    } else {
      setAllSitesLabel();
      await renderAllSites();
    }
    setCachedUiState();
    if (payload.stats && (payload.stats.failed > 0 || payload.stats.errors.length > 0)) {
      renderFailureSummary(payload.stats);
    }
    return payload;
  }
  function renderFailureSummary(stats) {
    if (!stats || (stats.failed === 0 && stats.errors.length === 0)) return;
    const summaryEl = document.createElement("div");
    summaryEl.id = "sadv-failure-summary";
    summaryEl.style.cssText =
      "position:fixed;bottom:12px;right:12px;background:#1a1a2e;border:1px solid #f87171;border-radius:8px;padding:12px 16px;font-size:11px;color:#f87171;max-width:320px;z-index:10000000;box-shadow:0 4px 20px rgba(0,0,0,.5);font-family:Apple SD Gothic Neo,system-ui";
    const failedCount = stats.failed || 0;
    const partialCount = stats.partial || 0;
    const errorItems = (stats.errors || []).slice(0, 5);
    const headerRow = document.createElement("div");
    headerRow.style.cssText = "display:flex;justify-content:space-between;align-items:center;margin-bottom:4px";
    const titleSpan = document.createElement("span");
    titleSpan.style.fontWeight = "700";
    titleSpan.textContent = "Data Collection Issues";
    headerRow.appendChild(titleSpan);
    const closeBtn = document.createElement("button");
    closeBtn.textContent = "\u00d7";
    closeBtn.style.cssText = "background:none;border:none;color:#f87171;cursor:pointer;font-size:14px;padding:0 4px";
    closeBtn.onclick = function () { summaryEl.remove(); };
    headerRow.appendChild(closeBtn);
    summaryEl.appendChild(headerRow);
    const countDiv = document.createElement("div");
    countDiv.style.color = "#fcd34d";
    countDiv.textContent = failedCount + " failed" + (partialCount > 0 ? ", " + partialCount + " partial" : "");
    summaryEl.appendChild(countDiv);
    if (errorItems.length > 0) {
      const errorDiv = document.createElement("div");
      errorDiv.style.cssText = "margin-top:8px;padding-top:8px;border-top:1px solid #f8717155;font-size:10px;line-height:1.5";
      errorItems.forEach(function (e) {
        const line = document.createElement("div");
        const siteShort = e.site ? e.site.replace(/^https?:\/\//, "").slice(0, 30) : "unknown";
        line.textContent = siteShort + ": " + (e.error || "unknown error");
        errorDiv.appendChild(line);
      });
      if (stats.errors.length > 5) {
        const moreLine = document.createElement("div");
        moreLine.style.color = "#fbbf24";
        moreLine.textContent = "... +" + (stats.errors.length - 5) + " more";
        errorDiv.appendChild(moreLine);
      }
      summaryEl.appendChild(errorDiv);
    }
    const existing = document.getElementById("sadv-failure-summary");
    if (existing) existing.remove();
    document.body.appendChild(summaryEl);
    setTimeout(function () {
      if (summaryEl && summaryEl.parentElement) summaryEl.remove();
    }, 30000);
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
  async function renderSnapshotAllSites() {
    const requestId = ++allViewReqId;
    const exportPayload =
      typeof window !== "undefined" && window.__SEARCHADVISOR_EXPORT_PAYLOAD__
        ? window.__SEARCHADVISOR_EXPORT_PAYLOAD__
        : typeof EXPORT_PAYLOAD !== "undefined"
          ? EXPORT_PAYLOAD
          : null;
    setAllSitesLabel();
    bdEl.innerHTML =
      '<div style="padding:30px 20px;text-align:center;color:#3d5a78">Preparing all-sites snapshot...</div>';
    if (!allSites.length) {
      bdEl.innerHTML =
        '<div style="padding:30px 20px;text-align:center"><div style="font-size:32px">[!]</div><div style="color:#ffca28;font-weight:700;margin:10px 0">No sites available</div></div>';
      return;
    }
    let rows =
      exportPayload && Array.isArray(exportPayload.summaryRows) && exportPayload.summaryRows.length
        ? exportPayload.summaryRows.filter(function (row) {
            return allSites.includes(row.site);
          })
        : null;
    if (!rows || !rows.length) {
      const sitesToLoad = allSites;
      const results = await fetchExposeDataBatch(sitesToLoad);
      if (requestId !== allViewReqId || curMode !== "all") return;
      rows = sitesToLoad.map(function (site, i) {
        return results[i].status === "fulfilled"
          ? buildSiteSummaryRow(site, results[i].value)
          : buildSiteSummaryRow(site, null);
      });
    }
    rows = rows.slice().sort(function (a, b) {
      return b.totalC - a.totalC;
    });
    window.__sadvRows = rows;
    buildCombo(rows);
    const wrap = document.createElement("div");
    const grandC = rows.reduce(function (acc, row) {
      return acc + row.totalC;
    }, 0);
    const grandE = rows.reduce(function (acc, row) {
      return acc + row.totalE;
    }, 0);
    const avgCtrAll = grandE ? (grandC / grandE) * 100 : 0;
    wrap.appendChild(
      kpiGrid([
        { label: "Total Clicks", value: (grandC / 10000).toFixed(1) + "m", sub: "90d total", color: C.green },
        { label: "Total Expose", value: (grandE / 10000000).toFixed(1) + "10m", sub: "90d total", color: C.blue },
        { label: "Avg CTR", value: avgCtrAll.toFixed(2) + "%", sub: "90d avg", color: C.amber },
        { label: "Active Sites", value: rows.filter(function (row) { return row.totalC > 0; }).length + "", color: C.teal },
      ]),
    );
    wrap.appendChild(
      secTitle(
        "Top Clicks " +
          Math.min(rows.length, 30) +
          ' <span style="font-size:9px;font-weight:400;color:#3d5a78;letter-spacing:0">90d total</span>',
      ),
    );
    const top30 = rows.slice(0, 30);
    wrap.appendChild(
      chartCard(
        "Top " + top30.length + " Clicks",
        "",
        C.green,
        barchart(
          top30.map(function (row) { return row.totalC; }),
          top30.map(function (row) { return getSiteShortName(row.site); }),
          80,
          C.green,
          "",
        ),
        top30.map(function (_, i) { return "#" + (i + 1); }),
      ),
    );
    wrap.appendChild(secTitle("Site Details"));
    rows.forEach(function (r, i) {
      const col = SITE_COLORS_MAP[r.site] || COLORS[i % COLORS.length];
      const card = document.createElement("div");
      card.className = "sadv-allcard";
      card.style.borderTop = "2px solid " + col + "33";
      const shortName = getSiteLabel(r.site);
      const trendCol = r.trend > 0 ? C.green : r.trend < 0 ? C.red : C.sub;
      const trendIcon = r.trend > 0 ? "up" : r.trend < 0 ? "down" : "flat";
      const prevBadge =
        r.prevClickRatio != null
          ? '<span style="font-size:10px;color:' + (r.prevClickRatio >= 0 ? C.green : C.red) + ";background:" + (r.prevClickRatio >= 0 ? C.green : C.red) + '15;padding:1px 6px;border-radius:10px;margin-left:4px">' + (r.prevClickRatio >= 0 ? "+" : "") + r.prevClickRatio + "%</span>"
          : "";
      card.innerHTML =
        '<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px"><div style="display:flex;align-items:center;gap:6px;min-width:0"><div style="width:8px;height:8px;border-radius:50%;background:' +
        col +
        ';flex-shrink:0"></div><span style="font-size:12px;font-weight:700;line-height:1.3;color:#e0ecff;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;max-width:220px">' +
        escHtml(shortName) +
        "</span>" +
        prevBadge +
        '</div><span style="font-size:11px;line-height:1.2;color:' +
        trendCol +
        ';flex-shrink:0">' +
        escHtml(trendIcon) +
        '</span></div><div style="display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:6px;margin-bottom:8px"><div style="text-align:center;min-width:0"><div style="font-size:13px;font-weight:800;line-height:1.1;color:' +
        C.green +
        '">' +
        escHtml(fmt(r.totalC)) +
        '</div><div style="font-size:9px;line-height:1.35;color:#6482a2;margin-top:3px">Clicks</div></div><div style="text-align:center;min-width:0"><div style="font-size:13px;font-weight:800;line-height:1.1;color:' +
        C.blue +
        '">' +
        escHtml((r.totalE / 10000).toFixed(1)) +
        'w</div><div style="font-size:9px;line-height:1.35;color:#6482a2;margin-top:3px">Expose</div></div><div style="text-align:center;min-width:0"><div style="font-size:13px;font-weight:800;line-height:1.1;color:' +
        C.amber +
        '">' +
        escHtml(r.avgCtr) +
        '%</div><div style="font-size:9px;line-height:1.35;color:#6482a2;margin-top:3px">CTR</div></div><div style="text-align:center;min-width:0"><div style="font-size:13px;font-weight:800;line-height:1.1;color:' +
        trendCol +
        '">' +
        escHtml(fmt(Math.round(r.trend * 7))) +
        '</div><div style="font-size:9px;line-height:1.35;color:#6482a2;margin-top:3px">Trend</div></div></div>';
      if (r.clicks && r.clicks.length > 1) {
        const miniDates = (r.logs || []).map(function (log) { return fmtB(log.date); });
        const mini = sparkline(r.clicks, miniDates, 34, col, "");
        mini.style.cssText += "opacity:.7";
        card.appendChild(mini);
      }
      card.addEventListener("mouseenter", function () {
        card.style.borderColor = col + "66";
      });
      card.addEventListener("mouseleave", function () {
        card.style.borderColor = "#1a2d45";
        card.style.borderTopColor = col + "33";
      });
      card.addEventListener("click", function () {
        curSite = r.site;
        switchMode("site");
      });
      wrap.appendChild(card);
    });
    if (requestId !== allViewReqId || curMode !== "all") return;
    bdEl.innerHTML = "";
    bdEl.appendChild(wrap);
    bdEl.scrollTop = 0;
    if (typeof notifySnapshotShellState === "function") notifySnapshotShellState();
    __sadvNotify();
  }
  function buildSnapshotShellState(payload) {
    const allSites = Array.isArray(payload.allSites) ? payload.allSites.slice() : [];
    const snapshotTabIds = [
      "overview",
      "daily",
      "queries",
      "pages",
      "crawl",
      "backlink",
      "diagnosis",
      "insight",
    ];
    const cacheSavedAtValues = allSites
      .map(function (site) {
        const dataBySite = payload.dataBySite && payload.dataBySite[site];
        return dataBySite && typeof dataBySite.__cacheSavedAt === "number"
          ? dataBySite.__cacheSavedAt
          : null;
      })
      .filter(function (value) {
        return typeof value === "number";
      });
    const savedAtValue =
      payload.savedAt && !Number.isNaN(new Date(payload.savedAt).getTime())
        ? new Date(payload.savedAt)
        : null;
    const updatedAt = cacheSavedAtValues.length
      ? new Date(Math.max.apply(null, cacheSavedAtValues))
      : savedAtValue;
    return {
      accountLabel: payload.accountLabel || "",
      allSites,
      rows: Array.isArray(payload.summaryRows) ? payload.summaryRows.slice() : [],
      siteMeta:
        payload.siteMeta && typeof payload.siteMeta === "object" ? payload.siteMeta : {},
      curMode: "all",
      curSite:
        typeof payload.curSite === "string"
          ? payload.curSite
          : allSites[0] || null,
      curTab: "overview",
      runtimeVersion: window.__SEARCHADVISOR_RUNTIME_VERSION__ || "snapshot",
      cacheMeta: updatedAt
        ? {
            label: "snapshot",
            updatedAt,
            remainingMs: null,
            sourceCount: allSites.length,
            measuredAt: Date.now(),
          }
        : null,
    };
  }
  function buildSnapshotShellBootstrapScript() {
    return [
      "(function () {",
      '  const host = document.getElementById("sadv-react-shell-host");',
      "  const snapshotApi = window.__SEARCHADVISOR_SNAPSHOT_API__ || null;",
      "  if (!host || !snapshotApi) return;",
      '  host.setAttribute("style", "display:block !important;width:100% !important;flex-shrink:0;");',
      '  let portal = host.querySelector("#sadv-react-portal-root");',
      "  if (!portal) {",
      '    portal = document.createElement("div");',
      '    portal.id = "sadv-react-portal-root";',
      "    host.appendChild(portal);",
      "  }",
      '  let mount = host.querySelector("#sadv-react-shell-root");',
      "  if (!mount) {",
      '    mount = document.createElement("div");',
      '    mount.id = "sadv-react-shell-root";',
      "  }",
      '  mount.setAttribute("data-sadvx", "snapshot-shell");',
      '  const shellIds = ["sadv-header", "sadv-mode-bar", "sadv-site-bar", "sadv-tabs"];',
      "  const moved = [];",
      "  shellIds.forEach(function (id) {",
      "    const node = document.getElementById(id);",
      "    if (!node || !node.parentNode) return;",
      "    moved.push({ node: node, parent: node.parentNode, next: node.nextSibling });",
      "    mount.appendChild(node);",
      "  });",
      "  const previousUnmount = window.__SEARCHADVISOR_SNAPSHOT_SHELL_UNMOUNT__;",
      '  if (typeof previousUnmount === "function") {',
      "    try { previousUnmount(); } catch (_) {}",
      "  }",
      '  const hideStyle = document.getElementById("sadv-snapshot-shell-hide");',
      "  if (hideStyle) hideStyle.remove();",
      "  host.replaceChildren(mount);",
      "  host.appendChild(portal);",
      "  window.__SEARCHADVISOR_SNAPSHOT_SHELL_UNMOUNT__ = function () {",
      "    moved.forEach(function (entry) {",
      "      if (entry.parent) entry.parent.insertBefore(entry.node, entry.next);",
      "    });",
      "    host.replaceChildren();",
      "    host.appendChild(portal);",
      "    delete window.__SEARCHADVISOR_SNAPSHOT_SHELL_UNMOUNT__;",
      "  };",
      "})();",
    ].join(String.fromCharCode(10));
  }
  function buildSnapshotApiCompatScript() {
    return [
      "(function () {",
      "  if (window.__SEARCHADVISOR_SNAPSHOT_API__) return;",
      "  const shellStateSource = window.__SEARCHADVISOR_SNAPSHOT_SHELL_STATE__ || {};",
      "  const snapshotState = {",
      '    accountLabel: shellStateSource.accountLabel || "",',
      "    allSites: Array.isArray(shellStateSource.allSites) ? shellStateSource.allSites.slice() : [],",
      "    rows: Array.isArray(shellStateSource.rows) ? shellStateSource.rows.slice() : [],",
      '    siteMeta: shellStateSource.siteMeta && typeof shellStateSource.siteMeta === "object" ? shellStateSource.siteMeta : {},',
      '    curMode: shellStateSource.curMode === "site" ? "site" : "all",',
      '    curSite: typeof shellStateSource.curSite === "string" ? shellStateSource.curSite : null,',
      '    curTab: typeof shellStateSource.curTab === "string" ? shellStateSource.curTab : "overview",',
      '    runtimeVersion: shellStateSource.runtimeVersion || "snapshot",',
      "    cacheMeta: shellStateSource.cacheMeta",
      "      ? {",
      '          label: shellStateSource.cacheMeta.label || "snapshot",',
      "          updatedAt: shellStateSource.cacheMeta.updatedAt ? new Date(shellStateSource.cacheMeta.updatedAt) : null,",
      '          remainingMs: typeof shellStateSource.cacheMeta.remainingMs === "number" ? shellStateSource.cacheMeta.remainingMs : null,',
      '          sourceCount: typeof shellStateSource.cacheMeta.sourceCount === "number" ? shellStateSource.cacheMeta.sourceCount : (Array.isArray(shellStateSource.allSites) ? shellStateSource.allSites.length : 0),',
      '          measuredAt: typeof shellStateSource.cacheMeta.measuredAt === "number" ? shellStateSource.cacheMeta.measuredAt : Date.now(),',
      "        }",
      "      : null,",
      "  };",
      "  const listeners = new Set();",
      "  function cloneState() {",
      "    return {",
      "      accountLabel: snapshotState.accountLabel,",
      "      allSites: Array.isArray(snapshotState.allSites) ? snapshotState.allSites.slice() : [],",
      "      rows: Array.isArray(snapshotState.rows) ? snapshotState.rows.slice() : [],",
      '      siteMeta: snapshotState.siteMeta && typeof snapshotState.siteMeta === "object" ? snapshotState.siteMeta : {},',
      '      curMode: snapshotState.curMode === "site" ? "site" : "all",',
      '      curSite: typeof snapshotState.curSite === "string" ? snapshotState.curSite : null,',
      '      curTab: typeof snapshotState.curTab === "string" ? snapshotState.curTab : "overview",',
      '      runtimeVersion: snapshotState.runtimeVersion || "snapshot",',
      "      cacheMeta: snapshotState.cacheMeta",
      "        ? {",
      '            label: snapshotState.cacheMeta.label || "snapshot",',
      "            updatedAt: snapshotState.cacheMeta.updatedAt instanceof Date ? snapshotState.cacheMeta.updatedAt : null,",
      '            remainingMs: typeof snapshotState.cacheMeta.remainingMs === "number" ? snapshotState.cacheMeta.remainingMs : null,',
      '            sourceCount: typeof snapshotState.cacheMeta.sourceCount === "number" ? snapshotState.cacheMeta.sourceCount : snapshotState.allSites.length,',
      '            measuredAt: typeof snapshotState.cacheMeta.measuredAt === "number" ? snapshotState.cacheMeta.measuredAt : Date.now(),',
      "          }",
      "        : null,",
      "    };",
      "  }",
      "  function notify() {",
      "    const nextState = cloneState();",
      "    listeners.forEach(function (listener) {",
      "      try { listener(nextState); } catch (_) {}",
      "    });",
      "  }",
      "  function getSiteShortName(site) {",
      '    if (!site) return "site";',
      '    if (site.indexOf("https://") === 0) return site.slice(8);',
      '    if (site.indexOf("http://") === 0) return site.slice(7);',
      "    return site;",
      "  }",
      "  function getSiteLabel(site) {",
      '    if (!site) return "site";',
      '    const meta = snapshotState.siteMeta && typeof snapshotState.siteMeta === "object" ? snapshotState.siteMeta[site] || null : null;',
      '    const label = meta ? (meta.displayLabel || meta.label || meta.shortName || "").trim() : "";',
      "    return label || getSiteShortName(site);",
      "  }",
      "  function resolveSiteFromLegacyLabel(labelText) {",
      '    const trimmed = (labelText || "").trim();',
      "    if (!trimmed) return null;",
      "    const exact = snapshotState.allSites.find(function (site) {",
      "      return site === trimmed || getSiteShortName(site) === trimmed || getSiteLabel(site) === trimmed;",
      "    });",
      "    if (exact) return exact;",
      "    const normalized = trimmed.toLowerCase();",
      "    return snapshotState.allSites.find(function (site) {",
      "      return site.toLowerCase() === normalized || getSiteShortName(site).toLowerCase() === normalized || getSiteLabel(site).toLowerCase() === normalized;",
      "    }) || null;",
      "  }",
      "  function syncFromLegacy() {",
      '    const activeMode = document.querySelector("#sadv-mode-bar .sadv-mode.on");',
      '    const activeTab = document.querySelector("#sadv-tabs .sadv-t.on");',
      '    const comboLabel = document.getElementById("sadv-combo-label");',
      '    const siteLabel = document.querySelector("#sadv-site-label span") || document.getElementById("sadv-site-label");',
      "    if (activeMode) snapshotState.curMode = activeMode.getAttribute('data-m') === 'site' ? 'site' : 'all';",
      "    if (activeTab) snapshotState.curTab = activeTab.getAttribute('data-t') || 'overview';",
      "    const resolvedSite =",
      '      resolveSiteFromLegacyLabel(comboLabel ? comboLabel.textContent : "") ||',
      '      resolveSiteFromLegacyLabel(siteLabel ? siteLabel.textContent : "") ||',
      "      snapshotState.curSite ||",
      "      snapshotState.allSites[0] ||",
      "      null;",
      "    snapshotState.curSite = resolvedSite;",
      "    notify();",
      "  }",
      "  function scheduleSync() { Promise.resolve().then(syncFromLegacy); }",
      "  const api = {",
      "    getState: cloneState,",
      "    isReady: function () { return true; },",
      "    waitUntilReady: function () { return Promise.resolve(true); },",
      "    subscribe: function (listener) { listeners.add(listener); return function () { listeners.delete(listener); }; },",
      '    switchMode: function (mode) { if (typeof switchMode === "function") switchMode(mode); else { const button = document.querySelector("#sadv-mode-bar [data-m=\\"" + mode + "\\"]"); if (button) button.click(); } scheduleSync(); },',
      '    setSite: function (site) { if (typeof setComboSite === "function") setComboSite(site); else { const items = Array.from(document.querySelectorAll(".sadv-combo-item")); const button = items.find(function (item) { return (item.getAttribute("data-site") || "") === site; }); if (button) button.click(); } if (typeof switchMode === "function") switchMode("site"); scheduleSync(); },',
      '    setTab: function (tab) { if (typeof setTab === "function") setTab(tab); else { const button = document.querySelector("#sadv-tabs [data-t=\\"" + tab + "\\"]"); if (button) button.click(); } scheduleSync(); },',
      '    refresh: function () { return false; },',
      '    download: function () { return false; },',
      '    close: function () { return false; },',
      "  };",
      "  window.__SEARCHADVISOR_SNAPSHOT_API__ = api;",
      '  const target = document.getElementById("sadv-p") || document.body;',
      '  if (target && typeof MutationObserver === "function") {',
      "    const observer = new MutationObserver(function () { scheduleSync(); });",
      "    observer.observe(target, { subtree: true, childList: true, attributes: true, characterData: true });",
      "  }",
      "  syncFromLegacy();",
      "})();",
    ].join("\n");
  }
  function escapeInlineStyleText(text) {
    return String(text || "").replace(/<\/style/gi, "<\\/style");
  }
  function escapeInlineScriptText(text) {
    return String(text || "").replace(/<\/script/gi, "<\\/script");
  }
  function stringifyForInlineJson(value) {
    return JSON.stringify(value)
      .replace(/</g, "\\u003C")
      .replace(/>/g, "\\u003E")
      .replace(/&/g, "\\u0026")
      .replace(/\u2028/g, "\\u2028")
      .replace(/\u2029/g, "\\u2029");
  }
  function injectSnapshotReactShell(html, payload) {
    if (!html.includes('<div id="sadv-bd">')) {
      throw new Error("snapshot panel not found");
    }
    const reactShellCss = escapeInlineStyleText(
      document.getElementById("sadv-react-style")?.textContent || "",
    );
    const shellState = buildSnapshotShellState(payload);
    html = html.replace(
      "</head>",
      `<style id="sadv-react-style">${reactShellCss}</style><style id="sadv-snapshot-shell-hide">#sadv-header,#sadv-mode-bar,#sadv-site-bar{display:none !important}#sadv-react-shell-host{display:block !important;width:100% !important;flex-shrink:0}</style></head>`,
    );
    html = html.replace(
      "<body>",
      `<body><script>window.__SEARCHADVISOR_SNAPSHOT_SHELL_STATE__=${stringifyForInlineJson(shellState)};<\/script>`,
    );
    html = html.replace('<div id="sadv-bd">', `<div id="sadv-react-shell-host"></div><div id="sadv-bd">`);
    html = html.replace(
      "</body>",
      `<script>${escapeInlineScriptText(buildSnapshotShellBootstrapScript())}<\/script></body>`,
    );
    return html;
  }
  function buildSnapshotHtml(savedAt, payload) {
    const clone = p.cloneNode(true);
    clone
      .querySelectorAll(
        '#sadv-react-shell-host,#sadv-react-shell-root,#sadv-react-portal-root,[data-sadvx="snapshot-shell"],[data-sadvx-action="top"]',
      )
      .forEach(function (node) {
        node.remove();
      });
    clone.style.setProperty("display", "flex");
    clone.style.setProperty("visibility", "visible");
    clone.style.setProperty("opacity", "1");
    clone.style.removeProperty("transform");
    clone.style.removeProperty("pointer-events");
    clone.style.removeProperty("background");
    clone.style.removeProperty("border-left-color");
    delete clone.dataset.sadvSaveHidden;
    delete clone.dataset.sadvPrevVisibility;
    delete clone.dataset.sadvPrevPointerEvents;
    delete clone.dataset.sadvPrevBackground;
    delete clone.dataset.sadvPrevBorderLeftColor;
    const savedLabel = stampLabel(savedAt);
    const snapshotCurMode = "all";
    const snapshotCurTab = "overview";
    const modeLabel = "\uc804\uccb4\ud604\ud669";
    const activeTab = TABS.find(function (t) {
      return t.id === snapshotCurTab;
    });
    const activeTabLabel = activeTab ? activeTab.label : modeLabel;
    const siteLabel = payload.allSites.length + "\uac1c \uc0ac\uc774\ud2b8";
    const topRow = clone.querySelector("#sadv-header > div");
    const siteLabelEl = clone.querySelector("#sadv-site-label");
    const comboWrap = clone.querySelector("#sadv-combo-wrap");
    if (comboWrap) comboWrap.classList.remove("open");
    if (siteLabelEl) {
      siteLabelEl.innerHTML = `<span>${escHtml(siteLabel)}</span><span style="display:inline-flex;align-items:center;padding:2px 7px;border-radius:999px;border:1px solid #284766;color:#a8d8ff;background:rgba(12,23,38,.72)">${escHtml(activeTabLabel)}</span>`;
    }
    ["sadv-refresh-btn", "sadv-save-btn", "sadv-x"].forEach(function (id) {
      const el = clone.querySelector("#" + id);
      if (el) el.remove();
    });
    if (topRow && topRow.lastElementChild) {
      const meta = document.createElement("div");
      meta.style.cssText =
        "display:flex;align-items:center;padding:6px 10px;border-radius:999px;border:1px solid #284766;color:#d4ecff;background:rgba(7,13,22,.62);font-size:10px;font-weight:800";
      meta.textContent = "Saved " + savedLabel;
      topRow.lastElementChild.replaceWith(meta);
    }
    const exportPayloadJson = stringifyForInlineJson(
      Object.assign({}, payload, {
        curMode: snapshotCurMode,
        curTab: snapshotCurTab,
      }),
    );
    const html = `<!doctype html>
<html lang="ko">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${escHtml("SearchAdvisor Snapshot - " + siteLabel)}</title>
  <style>
    html,body{margin:0;padding:0;background:#06101a;color:#e0ecff;font-family:Apple SD Gothic Neo,system-ui,sans-serif}
    body{padding:28px 18px 40px}
    a{color:#40c4ff}
    :root{--snapshot-panel-width:520px}
    .snapshot-meta{
      width:min(100%,var(--snapshot-panel-width));
      box-sizing:border-box;
      margin:0 auto 12px;
      padding:10px 12px;
      border:1px solid #1a2d45;
      border-radius:20px;
      background:
        radial-gradient(circle at top right, rgba(64,196,255,.12), transparent 34%),
        linear-gradient(180deg, rgba(13,24,41,.98), rgba(7,13,22,.98));
      box-shadow:0 26px 60px rgba(0,0,0,.3);
      overflow:hidden;
    }
    .snapshot-meta-details{display:block}
    .snapshot-meta-details[open]{padding-bottom:2px}
    .snapshot-meta-summary{
      list-style:none;
      display:flex;
      align-items:center;
      justify-content:space-between;
      gap:12px;
      cursor:pointer;
      user-select:none;
      outline:none;
    }
    .snapshot-meta-summary::-webkit-details-marker{display:none}
    .snapshot-meta-summary::after{
      content:"\uba54\ud0c0 \ubcf4\uae30";
      flex-shrink:0;
      padding:4px 9px;
      border-radius:999px;
      border:1px solid rgba(255,255,255,.1);
      background:rgba(255,255,255,.03);
      font-size:10px;
      font-weight:700;
      line-height:1;
      color:#8fb4d6;
    }
    .snapshot-meta-details[open] .snapshot-meta-summary::after{content:"\uba54\ud0c0 \uc811\uae30"}
    .snapshot-meta-title{font-size:13px;font-weight:800;line-height:1.2;color:#f3fbff}
    .snapshot-meta-copy{margin-top:6px;font-size:11px;line-height:1.7;color:#7f9cbc}
    #sadv-p{
      position:relative !important;
      top:auto !important;
      right:auto !important;
      width:min(100%,var(--snapshot-panel-width)) !important;
      box-sizing:border-box !important;
      height:auto !important;
      margin:0 auto !important;
      border:1px solid #1a2d45 !important;
      border-radius:20px !important;
      overflow:hidden !important;
      box-shadow:0 26px 60px rgba(0,0,0,.3) !important;
    }
    #sadv-bd{
      overflow:visible !important;
      max-height:none !important;
      height:auto !important;
    }
  </style>
</head>
<body>
  <div class="snapshot-meta">
    <details class="snapshot-meta-details">
      <summary class="snapshot-meta-summary">
        <span class="snapshot-meta-title">SearchAdvisor Snapshot</span>
      </summary>
      <div class="snapshot-meta-copy">\uc800\uc7a5 \uc2dc\uac01: ${escHtml(savedLabel)}<br>\ud504\ub85c\uadf8\ub7a8 \ubc84\uc804: ${escHtml((window.__SEARCHADVISOR_RUNTIME_VERSION__ || "snapshot"))}</div>
    </details>
  </div>
  ${clone.outerHTML}
  <script>
    // <!-- SADV_PAYLOAD_START -->
    const EXPORT_PAYLOAD = ${exportPayloadJson};
    // <!-- SADV_PAYLOAD_END -->
    window.__SEARCHADVISOR_EXPORT_PAYLOAD__ = EXPORT_PAYLOAD;
    const SITE_META_MAP = EXPORT_PAYLOAD.siteMeta || {};
    const MERGED_META = EXPORT_PAYLOAD.mergedMeta || null;
    var snapshotShellMetaState = {
      siteMeta: SITE_META_MAP,
      mergedMeta: MERGED_META,
    };
    function setSnapshotMetaState(state) {
      snapshotShellMetaState = {
        siteMeta:
          state && state.siteMeta
            ? state.siteMeta
            : SITE_META_MAP,
        mergedMeta:
          state && Object.prototype.hasOwnProperty.call(state, "mergedMeta")
            ? state.mergedMeta
            : MERGED_META,
      };
      if (typeof notifySnapshotShellState === "function") notifySnapshotShellState();
    }
    function getSiteMetaMap() {
      return snapshotShellMetaState && snapshotShellMetaState.siteMeta
        ? snapshotShellMetaState.siteMeta
        : SITE_META_MAP;
    }
    function getMergedMetaState() {
      return snapshotShellMetaState ? snapshotShellMetaState.mergedMeta : MERGED_META;
    }
    const FIELD_FAILURE_RETRY_MS = 5 * 60 * 1000;
    function hasSuccessfulDiagnosisMetaSnapshot(data) {
      return !!(
        data &&
        ((data.diagnosisMeta && data.diagnosisMeta.code === 0 && data.diagnosisMetaRange) ||
          data.diagnosisMetaFetchState === "success")
      );
    }
    function hasRecentDiagnosisMetaFailure(data, cooldownMs = FIELD_FAILURE_RETRY_MS) {
      return !!(
        data &&
        data.diagnosisMetaFetchState === "failure" &&
        typeof data.diagnosisMetaFetchedAt === "number" &&
        Date.now() - data.diagnosisMetaFetchedAt < cooldownMs
      );
    }
    function hasDiagnosisMetaSnapshot(data) {
      return hasSuccessfulDiagnosisMetaSnapshot(data) || hasRecentDiagnosisMetaFailure(data);
    }
    function getSiteShortName(a) {
      const s = a ? getSiteMetaMap()[a] || null : null;
      const f = s ? (s.displayLabel || s.label || s.shortName || "").trim() : "";
      return f || (a ? a.replace(/^https?:\\\\/\\\\//, "") : "\uc0ac\uc774\ud2b8 \uc120\ud0dd");
    }
    function getSiteLabel(a) {
      if (!a) return "\uc0ac\uc774\ud2b8 \uc120\ud0dd";
      const s = getSiteMetaMap()[a] || null;
      const f = s ? (s.displayLabel || s.label || s.shortName || "").trim() : "";
      return f || getSiteShortName(a);
    }
    function isMergedReport() {
      return !!getMergedMetaState();
    }
    function fmtDateTime(value) {
      if (!value) return "";
      const d = new Date(value);
      if (Number.isNaN(d.getTime())) return String(value);
      return (
        d.getFullYear() +
        "-" +
        String(d.getMonth() + 1).padStart(2, "0") +
        "-" +
        String(d.getDate()).padStart(2, "0") +
        " " +
        String(d.getHours()).padStart(2, "0") +
        ":" +
        String(d.getMinutes()).padStart(2, "0") +
        ":" +
        String(d.getSeconds()).padStart(2, "0")
      );
    }
    function buildDefaultReportDecoration() {
      const mergedMeta = getMergedMetaState();
      if (!mergedMeta || !mergedMeta.isMerged) return null;
      const siteCount = Array.isArray(allSites) ? allSites.length : 0;
      const naverIds = Array.isArray(mergedMeta.naverIds) ? mergedMeta.naverIds.filter(Boolean) : [];
      const fileNames = Array.isArray(mergedMeta.fileNames) ? mergedMeta.fileNames.filter(Boolean) : [];
      const snapshotLines = [
        "Saved at: " + fmtDateTime(EXPORT_PAYLOAD.savedAt || ""),
        "Merged accounts: " + naverIds.length + " / sites: " + siteCount,
      ];
      if (fileNames.length) snapshotLines.push("Sources: " + fileNames.join(", "));
      return {
        title: "SearchAdvisor Merged Report - " + siteCount + " sites",
        snapshotTitle: "SearchAdvisor Merged Report",
        snapshotLines,
        accountBadge: "MERGED " + naverIds.length + " IDs",
        accountTitle: naverIds.join(", "),
        siteStatus: siteCount + " sites loaded",
        siteSummary: "All " + siteCount + " sites sorted by clicks",
        currentSite: curMode === "site" ? curSite || "" : "",
      };
    }
    function applySnapshotReportDecorations(decoration) {
      const patch = decoration || buildDefaultReportDecoration();
      if (!patch) return;
      if (patch.title) document.title = patch.title;
      const snapshotTitleEl = document.querySelector(".snapshot-meta-title");
      if (snapshotTitleEl && patch.snapshotTitle) snapshotTitleEl.textContent = patch.snapshotTitle;
      const snapshotCopyEl = document.querySelector(".snapshot-meta-copy");
      if (snapshotCopyEl && Array.isArray(patch.snapshotLines)) {
        snapshotCopyEl.replaceChildren();
        patch.snapshotLines.forEach(function (line, index) {
          if (index > 0) snapshotCopyEl.appendChild(document.createElement("br"));
          snapshotCopyEl.appendChild(document.createTextNode(String(line)));
        });
      }
      const accountBadgeEl = document.getElementById("sadv-account-badge");
      if (accountBadgeEl && patch.accountBadge) {
        accountBadgeEl.textContent = patch.accountBadge;
        accountBadgeEl.title = patch.accountTitle || "";
      }
      const siteLabelEl = document.querySelector("#sadv-site-label span");
      if (siteLabelEl && patch.siteStatus) siteLabelEl.textContent = patch.siteStatus;
      const comboLabelEl = document.getElementById("sadv-combo-label");
      if (comboLabelEl && patch.currentSite) comboLabelEl.textContent = getSiteLabel(patch.currentSite);
      const statusTextEl = document.querySelector('[data-sadvx="status-text"] span');
      if (statusTextEl && patch.siteStatus) statusTextEl.textContent = patch.siteStatus;
      const currentSiteEl = document.querySelector('[data-sadvx="current-site"]');
      if (currentSiteEl) {
        currentSiteEl.textContent = patch.currentSite ? getSiteLabel(patch.currentSite) : "Select site";
      }
      const siteSummaryEl = document.querySelector('[data-sadvx="site-summary"]');
      if (siteSummaryEl && patch.siteSummary) siteSummaryEl.textContent = patch.siteSummary;
      document.querySelectorAll("[data-sadvx-site]").forEach(function (button) {
        const site = button.getAttribute("data-sadvx-site") || "";
        const labelWrap = button.children[1];
        const titleEl = labelWrap ? labelWrap.firstElementChild : null;
        if (titleEl) titleEl.textContent = getSiteLabel(site);
        if (patch.currentSite) button.dataset.active = site === patch.currentSite ? "true" : "false";
      });
    }
    window.__SEARCHADVISOR_APPLY_REPORT_DECORATIONS__ = applySnapshotReportDecorations;
    window.__SEARCHADVISOR_PAYLOAD_CONTRACT__ = {
      version: "20260314-payload-contract-v1",
      mode: "saved-html",
      getSiteMetaMap,
      getMergedMetaState,
      getSiteShortName,
      getSiteLabel,
      applyReportDecorations: applySnapshotReportDecorations,
    };
    const ICONS = ${JSON.stringify(ICONS)};
    const C = ${JSON.stringify(C)};
    const COLORS = ${JSON.stringify(COLORS)};
    const DOW = ${JSON.stringify(DOW)};
    const PNL = ${JSON.stringify(PNL)};
    const CHART_W = PNL - 32;
    const TABS = ${JSON.stringify(TABS)};
    let TIP = null;
    const fmt = (v) => Number(v).toLocaleString();
    const fmtD = (s) => s ? s.slice(0, 4) + "-" + s.slice(4, 6) + "-" + s.slice(6, 8) : "";
    const fmtB = (s) => s ? s.slice(4, 6) + "/" + s.slice(6, 8) : "";
    ${tip.toString()}
    ${showTip.toString()}
    ${moveTip.toString()}
    ${hideTip.toString()}
    ${sparkline.toString()}
    ${barchart.toString()}
    ${xlbl.toString()}
    ${chartCard.toString()}
    ${kpiGrid.toString()}
    ${secTitle.toString()}
    ${ibox.toString()}
    ${ctrBadge.toString()}
    ${hbar.toString()}
    ${st.toString()}
    ${pearson.toString()}
    ${buildSiteSummaryRow.toString()}
    ${buildRenderers.toString()}
    ${assignColors.toString()}
    ${ensureCurrentSite.toString()}
    ${buildCombo.toString()}
    ${setComboSite.toString()}
    ${renderTab.toString()}
    ${switchMode.toString()}
    ${setAllSitesLabel.toString()}
    ${renderSnapshotAllSites.toString()}
    ${loadSiteView.toString()}
    async function fetchExposeData(site) {
      return (
        EXPORT_PAYLOAD.dataBySite[site] || {
          expose: null,
          crawl: null,
          backlink: null,
          detailLoaded: false,
        }
      );
    }
    async function fetchSiteData(site) {
      return fetchExposeData(site);
    }
    async function fetchExposeDataBatch(sites) {
      return sites.map(function (site) {
        return {
          status: "fulfilled",
          value:
            EXPORT_PAYLOAD.dataBySite[site] || {
              expose: null,
              crawl: null,
              backlink: null,
              detailLoaded: false,
            },
        };
      });
    }
    let allSites = EXPORT_PAYLOAD.allSites || [];
    const INITIAL_MODE = "all";
    let curMode = null;  // Initialize to null so switchMode() triggers on first call
    let curSite = EXPORT_PAYLOAD.curSite || (allSites[0] || null);
    let curTab = EXPORT_PAYLOAD.curTab || "overview";
    const SNAPSHOT_SHELL_LISTENERS = new Set();
    function cloneSnapshotShellState() {
      const cacheSavedAtValues = allSites
        .map(function (site) {
          const dataBySite = EXPORT_PAYLOAD.dataBySite && EXPORT_PAYLOAD.dataBySite[site];
          return dataBySite && typeof dataBySite.__cacheSavedAt === "number"
            ? dataBySite.__cacheSavedAt
            : null;
        })
        .filter(function (value) {
          return typeof value === "number";
        });
      const savedAtValue =
        EXPORT_PAYLOAD.savedAt && !Number.isNaN(new Date(EXPORT_PAYLOAD.savedAt).getTime())
          ? new Date(EXPORT_PAYLOAD.savedAt)
          : null;
      const updatedAt = cacheSavedAtValues.length
        ? new Date(Math.max.apply(null, cacheSavedAtValues))
        : savedAtValue;
      return {
        accountLabel: EXPORT_PAYLOAD.accountLabel || "",
        allSites: Array.isArray(allSites) ? allSites.slice() : [],
        rows: Array.isArray(window.__sadvRows) ? window.__sadvRows.slice() : [],
        siteMeta: getSiteMetaMap(),
        mergedMeta: getMergedMetaState(),
        curMode: curMode === "site" ? "site" : "all",
        curSite: typeof curSite === "string" ? curSite : allSites[0] || null,
        curTab: TABS.some(function (tab) {
          return tab.id === curTab;
        })
          ? curTab
          : "overview",
        runtimeVersion: window.__SEARCHADVISOR_RUNTIME_VERSION__ || "snapshot",
        cacheMeta: updatedAt
          ? {
              label: "snapshot",
              updatedAt,
              remainingMs: null,
              sourceCount: allSites.length,
              measuredAt: Date.now(),
            }
          : null,
      };
    }
    function notifySnapshotShellState() {
      const nextState = cloneSnapshotShellState();
      SNAPSHOT_SHELL_LISTENERS.forEach(function (listener) {
        try {
          listener(nextState);
        } catch (e) {}
      });
    }
    const SNAPSHOT_UI_STATE_KEY =
      "sadv_snapshot_ui_v1::" +
      String(EXPORT_PAYLOAD.savedAt || "") +
      "::" +
      String(EXPORT_PAYLOAD.curSite || "");
    function lsGet(k) {
      try {
        const v = localStorage.getItem(k);
        return v ? JSON.parse(v) : null;
      } catch (e) {
        return null;
      }
    }
    function lsSet(k, v) {
      try {
        localStorage.setItem(k, JSON.stringify(v));
      } catch (e) {}
    }
    function getUiStateCacheKey() {
      return SNAPSHOT_UI_STATE_KEY;
    }
    function getCachedUiState() {
      const cached = lsGet(getUiStateCacheKey());
      if (!cached || typeof cached !== "object") return null;
      const mode = cached.mode === "site" ? "site" : cached.mode === "all" ? "all" : null;
      const tab = typeof cached.tab === "string" ? cached.tab : null;
      const site = typeof cached.site === "string" ? cached.site : null;
      if (!mode && !tab && !site) return null;
      return {
        mode,
        tab,
        site,
      };
    }
    function setCachedUiState() {
      lsSet(getUiStateCacheKey(), {
        ts: Date.now(),
        mode: curMode,
        tab: curTab,
        site: curSite,
      });
    }
    const SITE_COLORS_MAP = {};
    const memCache = {};
    let siteViewReqId = 0;
    let allViewReqId = 0;
    const p = document.getElementById("sadv-p");
    const modeBar = document.getElementById("sadv-mode-bar");
    const siteBar = document.getElementById("sadv-site-bar");
    const tabsEl = document.getElementById("sadv-tabs");
    const bdEl = document.getElementById("sadv-bd");
    const labelEl = document.getElementById("sadv-site-label");
    const snapshotUiReady = !!(p && modeBar && siteBar && tabsEl && bdEl && labelEl);
    if (!snapshotUiReady) {
      console.error("[Snapshot] Required UI scaffold is incomplete.");
    }
    if (tabsEl) {
      tabsEl.innerHTML = TABS.map(function (t) {
        return '<button class="sadv-t' + (t.id === curTab ? " on" : "") + '" data-t="' + t.id + '">' + t.label + "</button>";
      }).join("");
    }
    function setTab(tab) {
      if (!tabsEl || !tab || tab === curTab) return;
      const t = tabsEl.querySelector('[data-t="' + tab + '"]');
      if (!t) return;
      curTab = tab;
      tabsEl.querySelectorAll(".sadv-t").forEach(function (b) {
        b.classList.remove("on");
      });
      t.classList.add("on");
      if (window.__sadvR) renderTab(window.__sadvR);
      setCachedUiState();
      notifySnapshotShellState();
    }
    if (tabsEl) {
      tabsEl.addEventListener("click", function (e) {
        const t = e.target.closest("[data-t]");
        if (!t) return;
        setTab(t.dataset.t);
      });
    }
    const snapshotComboBtn = document.getElementById("sadv-combo-btn");
    if (snapshotComboBtn) {
      snapshotComboBtn.addEventListener("click", function (e) {
        e.stopPropagation();
        const wrap = document.getElementById("sadv-combo-wrap");
        if (!wrap) return;
        wrap.classList.toggle("open");
        if (wrap.classList.contains("open")) {
          setTimeout(function () {
            const inp = document.getElementById("sadv-combo-search");
            if (inp) {
              inp.style.display = "block";
              inp.value = "";
              inp.focus();
              inp.oninput = function () {
                const q = inp.value.toLowerCase();
                document.querySelectorAll(".sadv-combo-item[data-site]").forEach(function (el) {
                  const searchTarget = ((el.dataset.site || "") + " " + getSiteLabel(el.dataset.site || "")).toLowerCase();
                  el.style.display = !q || searchTarget.includes(q) ? "flex" : "none";
                });
              };
            }
          }, 50);
        }
      });
    } else {
      console.warn("[Snapshot] #sadv-combo-btn not found during initialization");
    }
    document.addEventListener("click", function (e) {
      const wrap = document.getElementById("sadv-combo-wrap");
      if (wrap && !wrap.contains(e.target)) wrap.classList.remove("open");
    });
    if (modeBar) {
      modeBar.addEventListener("click", function (e) {
        const m = e.target.closest("[data-m]");
        if (!m) return;
        switchMode(m.dataset.m);
      });
    }
    window.__SEARCHADVISOR_SNAPSHOT_API__ = {
      getState: cloneSnapshotShellState,
      isReady: function () {
        return snapshotUiReady;
      },
      waitUntilReady: function () {
        return Promise.resolve(snapshotUiReady);
      },
      subscribe: function (listener) {
        SNAPSHOT_SHELL_LISTENERS.add(listener);
        return function () {
          SNAPSHOT_SHELL_LISTENERS.delete(listener);
        };
      },
      switchMode: function (mode) {
        switchMode(mode);
      },
      setSite: function (site) {
        setComboSite(site);
        if (curMode !== "site") switchMode("site");
      },
      setTab: function (tab) {
        setTab(tab);
      },
      refresh: function () {
        return false;
      },
      download: function () {
        return false;
      },
      close: function () {
        return false;
      },
    };
    if (snapshotUiReady) {
      assignColors();
      window.__sadvRows = (EXPORT_PAYLOAD.summaryRows || []).filter(function (row) {
        return row && allSites.includes(row.site);
      });
      ensureCurrentSite();
      buildCombo(window.__sadvRows.length ? window.__sadvRows : null);
      if (curSite) setComboSite(curSite);
      setAllSitesLabel();
      switchMode(INITIAL_MODE);
      applySnapshotReportDecorations();
      notifySnapshotShellState();
    }
  <\/script>
</body>
</html>`;
    return html;
  }
  async function downloadSnapshot() {
    const btn = document.getElementById("sadv-save-btn");
    const originalText = btn.textContent;
    btn.disabled = true;
    btn.textContent = "0/" + allSites.length;
    try {
      const savedAt = new Date();
      const payload = await collectExportData(
        function (done, total) {
          btn.textContent = done + "/" + total;
        },
        { refreshMode: "cache-first" },
      );
      const html = injectSnapshotReactShell(buildSnapshotHtml(savedAt, payload), payload);
      const fileName =
        "searchadvisor-" +
        accountIdFromLabel(accountLabel) +
        "-" +
        stampFile(savedAt) +
        ".html";
      const blob = new Blob([html], { type: "text/html;charset=utf-8" });
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      link.remove();
      setTimeout(function () {
        URL.revokeObjectURL(link.href);
      }, 1000);
    } catch (e) {
      console.error(e);
      alert("HTML \uC800\uC7A5 \uC911 \uC624\uB958\uAC00 \uBC1C\uC0DD\uD588\uC5B4\uC694. \uB2E4\uC2DC \uC2DC\uB3C4\uD574\uC8FC\uC138\uC694.");
    } finally {
      btn.disabled = false;
      btn.textContent = originalText;
    }
  }
  function lsGet(k) {
    try {
      const v = localStorage.getItem(k);
      return v ? JSON.parse(v) : null;
    } catch (e) {
      return null;
    }
  }
  function lsSet(k, v) {
    try {
      localStorage.setItem(k, JSON.stringify(v));
    } catch (e) {}
  }
  function getCachedData(site) {
    const d = lsGet(getSiteDataCacheKey(site));
    if (!d) return null;
    if (!d.data || typeof d.data !== "object") return null;
    if (d.ts && Date.now() - d.ts > DATA_TTL) return null; // TTL 검증 추가
    return {
      ...d.data,
      __cacheSavedAt: typeof d.ts === "number" ? d.ts : null,
    };
  }
  function setCachedData(site, data) {
    lsSet(getSiteDataCacheKey(site), {
      ts: Date.now(),
      data,
    });
  }
  function clearCachedData(site) {
    try {
      localStorage.removeItem(getSiteDataCacheKey(site));
    } catch (e) {}
  }
  const accountLabel = getAccountLabel();
  applyAccountBadge(accountLabel);
  // ============================================================
  // DEMO_MODE - Shows full UI with dummy data on localhost/file://
  // ============================================================
  const IS_DEMO_MODE = (function() {
    try {
      const protocol = (location && location.protocol) || "";
      const host = (location && location.hostname) || "";
      // Enable demo mode for localhost, local networks, and file:// protocol
      return protocol === "file:" ||
             host === "localhost" ||
             host === "127.0.0.1" ||
             host.startsWith("192.168.") ||
             host.startsWith("10.") ||
             host.startsWith("172.");
    } catch (e) {
      return false;
    }
  })();

  if (IS_DEMO_MODE) {
    window.__DEMO_MODE__ = true;
    console.log("%c[SearchAdvisor Demo Mode] Running with dummy data", "color: #40c4ff; font-weight: bold");
  }

  // Define demo constants (used later, after allSites is declared)
  const DEMO_ENC_ID = IS_DEMO_MODE ? "demo_mode_00000000000000000000000000000000000000000000000000000000000000" : null;
  const DEMO_SITES = IS_DEMO_MODE ? [
    "https://example-shop.com",
    "https://tech-blog.kr",
    "https://online-store.net",
    "https://company-site.co.kr"
  ] : [];


  // Mock API data for demo mode
  if (IS_DEMO_MODE) {
    const DEMO_SITE_DATA = {};
    const now = Date.now();
    const today = new Date();
    const startDate = new Date(today);
    startDate.setDate(today.getDate() - 14);

    DEMO_SITES.forEach((site, idx) => {
      const baseClicks = Math.floor(Math.random() * 5000) + 1000;
      const baseExposes = Math.floor(baseClicks * (1.5 + Math.random()));

      // Generate proper date format (YYYYMMDD)
      const logs = Array.from({length: 15}, (_, i) => {
        const d = new Date(startDate);
        d.setDate(startDate.getDate() + i);
        const dateStr = d.toISOString().slice(0, 10).replace(/-/g, ''); // YYYYMMDD
        return {
          date: dateStr,
          clickCount: Math.floor(Math.random() * 400) + 50,
          exposeCount: Math.floor(Math.random() * 800) + 100
        };
      });

      // Calculate totals from logs
      const totalClicks = logs.reduce((sum, log) => sum + log.clickCount, 0);
      const totalExposes = logs.reduce((sum, log) => sum + log.exposeCount, 0);

      DEMO_SITE_DATA[site] = {
        expose: {
          items: [{
            period: {
              start: "20260301",
              end: "20260315",
              prevClickRatio: (Math.random() * 20 - 5).toFixed(1),
              prevExposeRatio: (Math.random() * 15 - 3).toFixed(1)
            },
            logs: logs.map(log => ({
              ...log,
              ctr: log.exposeCount > 0 ? ((log.clickCount / log.exposeCount) * 100).toFixed(2) : "0.00"
            })),
            urls: Array.from({length: 20}, (_, i) => ({
              key: `${site}/page-${i+1}`,
              clickCount: Math.floor(Math.random() * 200) + 10,
              exposeCount: Math.floor(Math.random() * 500) + 50,
              ctr: (Math.random() * 5 + 0.5).toFixed(2)
            })),
            querys: Array.from({length: 15}, (_, i) => ({
              key: `검색어${idx+1}-${i+1}`,
              clickCount: Math.floor(Math.random() * 100) + 5,
              exposeCount: Math.floor(Math.random() * 300) + 20,
              ctr: (Math.random() * 3 + 0.5).toFixed(2)
            }))
          }]
        },
        crawl: {
          items: [{
            stats: logs.map(log => ({
              date: log.date,
              pageCount: Math.floor(Math.random() * 5000) + 1000,
              downloadSize: Math.floor(Math.random() * 50000000) + 10000000,
              sumTryCount: Math.floor(Math.random() * 100) + 50,
              sumErrorCount: Math.random() > 0.8 ? Math.floor(Math.random() * 5) + 1 : 0,
              notFound: Math.random() > 0.9 ? Math.floor(Math.random() * 3) + 1 : 0,
              serverError: Math.random() > 0.95 ? Math.floor(Math.random() * 2) + 1 : 0,
              connectTimeout: 0
            })),
            sitemaps: [{ url: `${site}/sitemap.xml`, status: "ok", count: 156 }]
          }]
        },
        backlink: {
          items: [{
            total: Math.floor(Math.random() * 1000) + 200,
            domains: Math.floor(Math.random() * 50) + 10,
            countTime: logs.map(log => ({
              timeStamp: log.date,
              backlinkCnt: Math.floor(Math.random() * 200) + 180
            })),
            topDomain: [
              { domain: `backlink-source-${idx+1}.com`, backlinkCnt: Math.floor(Math.random() * 100) + 50 },
              { domain: `partner-site-${idx+1}.net`, backlinkCnt: Math.floor(Math.random() * 80) + 30 },
              { domain: `news-portal-${idx+1}.kr`, backlinkCnt: Math.floor(Math.random() * 60) + 20 },
              { domain: `blog-platform-${idx+1}.com`, backlinkCnt: Math.floor(Math.random() * 40) + 10 }
            ]
          }]
        },
        diagnosisMeta: {
          code: 0,  // 0 = success for diagnosis API
          items: [{
            meta: Array.from({length: 15}, (_, i) => {
              const d = new Date(startDate);
              d.setDate(startDate.getDate() + i);
              const dateStr = d.toISOString().slice(0, 10).replace(/-/g, '');
              return {
                date: dateStr,
                stateCount: {
                  "1": 1000 + idx * 100 + i * 10,
                  "2": Math.floor(Math.random() * 50) + 10,
                  "3": Math.floor(Math.random() * 30) + 5,
                  "4": Math.floor(Math.random() * 20) + 2
                }
              };
            })
          }]
        },
        diagnosisMetaRange: { start: "20260301", end: "20260315" }
      };

    });
    
    // Override fetch to return demo data
    const originalFetch = window.fetch.bind(window);
    window.fetch = function(url, options) {
      const urlStr = String(url);

      if (urlStr.includes("searchadvisor.naver.com")) {
        console.log("[Demo Mode API]", urlStr);

        return new Promise((resolve) => {
          setTimeout(() => {
            if (urlStr.includes("/api-board/list/")) {
              // Use custom sites if available, otherwise fall back to DEMO_SITES
              const customInitData = window.__sadvInitData;
              const customMergedData = window.__sadvMergedData;
              const customSites = customMergedData?.sites || customInitData?.sites || null;
              const sitesToUse = customSites ? Object.keys(customSites) : DEMO_SITES;

              resolve({
                ok: true,
                json: () => ({ items: sitesToUse.map(s => ({ site: s, verified: true })) }),
                text: () => JSON.stringify({ items: sitesToUse.map(s => ({ site: s, verified: true })) })
              });
              return;
            }

            const siteMatch = urlStr.match(/site=([^&]+)/);
            const customInitData = window.__sadvInitData;
            const customMergedData = window.__sadvMergedData;
            const customSites = customMergedData?.sites || customInitData?.sites || null;
            const customSitesList = customSites ? Object.keys(customSites) : DEMO_SITES;
            const site = siteMatch ? decodeURIComponent(siteMatch[1]) : customSitesList[0];

            // Priority: custom injected data > DEMO_SITE_DATA > memCache
            let siteData = null;
            if (customSites && customSites[site]) {
              siteData = customSites[site];
            } else if (DEMO_SITE_DATA[site]) {
              siteData = DEMO_SITE_DATA[site];
            } else {
              siteData = memCache[site] || {};
            }
            console.log('[Demo Mode] API call - site:', site, 'source:', customSites && customSites[site] ? 'custom' : (DEMO_SITE_DATA[site] ? 'DEMO_SITE_DATA' : 'memCache'));

            if (urlStr.includes("/report/expose/") || urlStr.includes("field=expose")) {
              const exposeData = siteData.expose || { items: [] };
              console.log('[Demo Mode] Returning expose data for', site, 'logs:', exposeData.items?.[0]?.logs?.length || 0);
              resolve({ ok: true, json: () => exposeData, text: () => JSON.stringify(exposeData) });
            } else if (urlStr.includes("/report/crawl/") || urlStr.includes("field=crawl")) {
              const crawlData = siteData.crawl || { items: [] };
              resolve({ ok: true, json: () => crawlData, text: () => JSON.stringify(crawlData) });
            } else if (urlStr.includes("/report/backlink/") || urlStr.includes("field=backlink")) {
              const backlinkData = siteData.backlink || { items: [] };
              resolve({ ok: true, json: () => backlinkData, text: () => JSON.stringify(backlinkData) });
            } else if (urlStr.includes("/diagnosis/meta") || urlStr.includes("field=diagnosisMeta")) {
              const diagnosisData = siteData.diagnosisMeta || { code: 1, items: [] };
              resolve({ ok: true, json: () => diagnosisData, text: () => JSON.stringify(diagnosisData) });
            } else {
              resolve({ ok: true, json: () => ({ items: [] }), text: () => "{}" });
            }
          }, 50);
        });
      }
      
      return originalFetch(url, options);
    };
  }


  let encId = IS_DEMO_MODE ? DEMO_ENC_ID : null;
  if (!encId) {
    try {
      encId =
        (window.__NUXT__ &&
          window.__NUXT__.state &&
          window.__NUXT__.state.authUser &&
          window.__NUXT__.state.authUser.enc_id) ||
        null;
    } catch (e) {}
  }
  if (!encId) {
    try {
      for (const k of Object.keys(window)) {
        const v = window[k];
        if (
          v &&
          typeof v === "object" &&
          typeof v.enc_id === "string" &&
          v.enc_id.length === 64
        ) {
          encId = v.enc_id;
          break;
        }
      }
    } catch (e) {}
  }
  if (!encId) {
    try {
      for (const e of performance.getEntriesByType("resource")) {
        const m = e.name.match(new RegExp("([a-f0-9]{64})"));
        if (m) {
          encId = m[1];
          break;
        }
      }
    } catch (e) {}
  }
  if (!encId) {
    const host = (location && location.hostname) || "",
      onAdvisor = /searchadvisor\\.naver\\.com$/i.test(host),
      stateLabel = onAdvisor ? "\uCD08\uAE30\uD654 \uC2E4\uD328" : "\uC2E4\uD589 \uC704\uCE58 \uC624\uB958",
      title = onAdvisor
        ? "\uB85C\uADF8\uC778 \uC0C1\uD0DC\uB97C \uD655\uC778\uD574\uC8FC\uC138\uC694"
        : "\uC11C\uCE58\uC5B4\uB4DC\uBC14\uC774\uC800 \uD398\uC774\uC9C0\uC5D0\uC11C \uC2E4\uD589\uD574\uC8FC\uC138\uC694",
      desc = onAdvisor
        ? "\uB124\uC774\uBC84 \uC11C\uCE58\uC5B4\uB4DC\uBC14\uC774\uC800\uC5D0 \uB85C\uADF8\uC778\uD55C \uB4A4 \uCF58\uC194 \uD398\uC774\uC9C0\uC5D0\uC11C \uB2E4\uC2DC \uC2E4\uD589\uD574\uC8FC\uC138\uC694."
        : "\uC774 \uC2A4\uD06C\uB9BD\uD2B8\uB294 \uB124\uC774\uBC84 \uC11C\uCE58\uC5B4\uB4DC\uBC14\uC774\uC800 \uCF58\uC194 \uC804\uC6A9\uC785\uB2C8\uB2E4. \uC544\uB798 \uBC84\uD2BC\uC73C\uB85C \uC11C\uCE58\uC5B4\uB4DC\uBC14\uC774\uC800\uB97C \uC5F0 \uB4A4 \uB2E4\uC2DC \uC2E4\uD589\uD574\uC8FC\uC138\uC694.";
    document.getElementById("sadv-site-label").innerHTML =
      `<span>${stateLabel}</span>`;
    document.getElementById("sadv-bd").innerHTML =
      `<div style="padding:28px 20px;text-align:center"><div style="font-size:32px">${onAdvisor ? "\\uD83D\\uDD12" : "\\uD83E\\uDDED"}</div><div style="color:#ffca28;font-weight:800;margin:10px 0 8px">${escHtml(title)}</div><div style="color:#7a9ab8;font-size:12px;line-height:1.8">${escHtml(desc)}</div><div style="margin-top:14px"><a href="https://searchadvisor.naver.com/" target="_blank" rel="noopener noreferrer" style="display:inline-flex;align-items:center;justify-content:center;gap:6px;background:#132236;border:1px solid #40c4ff55;color:#40c4ff;text-decoration:none;border-radius:8px;padding:9px 12px;font-size:12px;font-weight:700">\uc11c\uce58\uc5b4\ub4dc\ubc14\uc774\uc800 \uc5f4\uae30 ↗</a></div><div style="margin-top:12px;font-size:10px;color:#3d5a78">\ud604\uc7ac \ud398\uc774\uc9c0: ${escHtml(host || "unknown")}</div></div>`;
    return;
  }
  function getCacheNamespace() {
    const parts = [];
    const labelId = accountIdFromLabel(accountLabel);
    if (labelId && labelId !== "unknown") parts.push(labelId);
    if (encId) parts.push(fileSafe(String(encId).trim()));
    if (parts.length) return parts.join("_");
    return "unknown";
  }

  // Multi-account merge support
  // ============================================================
  // SCHEMA VERSION 1.0 - Multi-Account Data Merge Standard
  // ============================================================
  // This schema enables merging HTML snapshot data from multiple
  // Naver SearchAdvisor accounts while preserving data provenance.
  //
  // EXPORT FORMAT:
  // {
  //   "__schema_version": "1.0",
  //   "__exported_at": "2026-03-16T12:00:00.000Z",
  //   "__source_account": "email@naver.com",     // Account label
  //   "__source_enc_id": "abc123...",            // 64-char hex
  //   "__source_namespace": "label_encid",      // Cache namespace
  //   "__data_format": "sadv_snapshot_v1",      // Format identifier
  //   "sites": {
  //     "https://site.com": {
  //       "__meta": {
  //         "__source": "account-1",
  //         "__fetched_at": 1710123456789,
  //         "__schema": "1.0"
  //       },
  //       "expose": { ... },
  //       "crawl": { ... },
  //       "backlink": { ... },
  //       "diagnosisMeta": { ... }
  //     }
  //   }
  // }
  // ============================================================

  const MERGE_REGISTRY_KEY = "sadv_merge_registry";
  const SCHEMA_VERSION = "1.0";
  const DATA_FORMAT = "sadv_snapshot_v1";

  /**
   * Validate data schema version
   * @param {Object} data - Data to validate
   * @returns {Object} { valid: boolean, version: string, errors: string[] }
   */
  function validateDataSchema(data) {
    const result = { valid: true, version: null, errors: [] };

    if (!data || typeof data !== 'object') {
      result.valid = false;
      result.errors.push('Data is not an object');
      return result;
    }

    // Check schema version
    if (data.__schema_version) {
      result.version = data.__schema_version;
      const supportedVersions = ['1.0', '1'];
      if (!supportedVersions.includes(result.version)) {
        result.valid = false;
        result.errors.push(`Unsupported schema version: ${result.version}`);
      }
    } else {
      // Legacy data (no version) - treat as v1.0
      result.version = '1.0';
    }

    // Check required metadata fields
    const isSingleExport = data.exportFormat === "snapshot-v2" || (data.__exported_at && data.__source_enc_id);
    const isMerged = data.__merged_at && data.accounts_merged;
    
    if (!isSingleExport && !isMerged) {
      result.valid = false;
      result.errors.push('Missing required export/merge metadata fields');
    }

    // Validate sites object
    if (data.sites && typeof data.sites === 'object') {
      for (const [site, siteData] of Object.entries(data.sites)) {
        if (!site.startsWith('http')) {
          result.valid = false;
          result.errors.push(`Invalid site URL: ${site}`);
        }
        if (siteData && typeof siteData === 'object') {
          // Site data must have at least expose field
          if (!siteData.expose && !siteData.crawl && !siteData.backlink) {
            result.valid = false;
            result.errors.push(`Site ${site} has no data fields`);
          }
        }
      }
    }

    return result;
  }

  /**
   * Migrate data to target schema version
   * @param {Object} data - Data to migrate
   * @param {string} targetVersion - Target version (e.g., "1.0")
   * @returns {Object} Migrated data
   */
  function migrateSchema(data, targetVersion = SCHEMA_VERSION) {
    if (!data) return null;

    const validation = validateDataSchema(data);
    let currentVersion = validation.version || '1.0';

    // Add version if missing (must be before version check for legacy data)
    if (!data.__schema_version) {
      data.__schema_version = currentVersion;
    }

    // If already at target version, return as-is
    if (currentVersion === targetVersion) {
      return data;
    }

    // Future migrations will go here
    // Example: if (currentVersion === '1.0' && targetVersion === '2.0') { ... }

    return data;
  }

  /**
   * Detect conflicts between multiple accounts
   * @param {Object} accounts - Map of account data { encId: { sites: {...} } }
   * @returns {Object} { conflicts: [], bySite: {} }
   */
  function detectConflicts(accounts) {
    const result = { conflicts: [], bySite: {} };

    if (!accounts || typeof accounts !== 'object') {
      return result;
    }

    // Collect all sites from all accounts
    const siteAccounts = {}; // { site: [encId1, encId2, ...] }

    for (const [encId, accountData] of Object.entries(accounts)) {
      if (!accountData.sites) continue;

      for (const site of Object.keys(accountData.sites)) {
        if (!siteAccounts[site]) {
          siteAccounts[site] = [];
        }
        siteAccounts[site].push(encId);
      }
    }

    // Find sites that appear in multiple accounts
    for (const [site, accountList] of Object.entries(siteAccounts)) {
      if (accountList.length > 1) {
        result.bySite[site] = {
          accounts: accountList,
          count: accountList.length,
          severity: accountList.length > 2 ? 'high' : 'medium'
        };
        result.conflicts.push({
          site: site,
          accounts: accountList,
          message: `Site "${site}" exists in ${accountList.length} accounts`
        });
      }
    }

    return result;
  }

  /**
   * Merge data from multiple accounts
   * @param {Object} targetData - Base data
   * @param {Object} sourceData - Data to merge in
   * @param {Object} options - Merge options
   * @returns {Object} Merged data
   */
  function mergeAccounts(targetData, sourceData, options = {}) {
    const {
      strategy = 'newer',      // 'newer', 'all', 'target', 'source'
      onConflict = null,        // Custom conflict handler
      mergeLogs = true,         // Merge logs arrays
      mergeDates = true,        // Merge date ranges
      preserveSources = true    // Track data sources
    } = options;

    if (!sourceData || !sourceData.sites) {
      return targetData;
    }

    if (!targetData || !targetData.sites) {
      return sourceData;
    }

    const result = {
      ...targetData,
      sites: { ...targetData.sites }
    };

    const mergeInfo = [];

    for (const [site, sourceSiteData] of Object.entries(sourceData.sites)) {
      const targetSiteData = result.sites[site];

      if (!targetSiteData) {
        // New site - just add it
        result.sites[site] = sourceSiteData;
        mergeInfo.push({ site, action: 'added', source: 'source' });
      } else {
        // Site exists in both - merge based on strategy
        let mergedSiteData;

        switch (strategy) {
          case 'newer':
            // Support both _merge and __meta formats
            const sourceTime = sourceSiteData.__meta?.__fetched_at ||
                              sourceSiteData._merge?.__fetchedAt || 0;
            const targetTime = targetSiteData.__meta?.__fetched_at ||
                              targetSiteData._merge?.__fetchedAt || 0;
            mergedSiteData = sourceTime > targetTime ? sourceSiteData : targetSiteData;
            mergeInfo.push({ site, action: sourceTime > targetTime ? 'newer_source' : 'kept_target' });
            break;

          case 'source':
            mergedSiteData = sourceSiteData;
            mergeInfo.push({ site, action: 'overwrote_source' });
            break;

          case 'target':
            mergedSiteData = targetSiteData;
            mergeInfo.push({ site, action: 'kept_target' });
            break;

          case 'all':
            mergedSiteData = deepMergeSiteData(targetSiteData, sourceSiteData, {
              mergeLogs,
              mergeDates,
              preserveSources
            });
            mergeInfo.push({ site, action: 'deep_merged' });
            break;

          default:
            mergedSiteData = targetSiteData;
            mergeInfo.push({ site, action: 'kept_target_default' });
        }

        result.sites[site] = mergedSiteData;

        // Track sources if requested
        if (preserveSources) {
          if (!mergedSiteData.__sources) {
            mergedSiteData.__sources = [];
          }
          if (!mergedSiteData.__sources.includes(sourceData.__source_account)) {
            mergedSiteData.__sources.push(sourceData.__source_account);
          }
        }
      }
    }

    // Add merge metadata
    result.__merge_info = {
      merged_at: Date.now(),
      merge_count: mergeInfo.length,
      details: mergeInfo,
      strategy_used: strategy
    };

    return result;
  }

  /**
   * Deep merge site data (for 'all' strategy)
   */
  function deepMergeSiteData(target, source, options = {}) {
    const { mergeLogs = true, mergeDates = true, preserveSources = true } = options;

    const merged = { ...target };

    // Merge each data type (expose, crawl, backlink, diagnosisMeta)
    const dataTypes = ['expose', 'crawl', 'backlink', 'diagnosisMeta'];

    for (const type of dataTypes) {
      if (source[type] && target[type]) {
        merged[type] = deepMergeDataType(target[type], source[type], type, options);
      } else if (source[type]) {
        merged[type] = source[type];
      }
    }

    // Merge metadata (support both __meta and _merge)
    if (source.__meta && target.__meta) {
      merged.__meta = {
        ...target.__meta,
        __merged_at: Date.now(),
        __merge_sources: [
          ...(target.__meta.__merge_sources || [target.__meta.__source]),
          source.__meta.__source
        ].filter(Boolean)
      };
    }

    // Also merge _merge for compatibility
    if (source._merge && target._merge) {
      merged._merge = {
        ...target._merge,
        __mergedAt: Date.now(),
        __mergedFrom: [
          ...(target._merge.__mergedFrom || [target._merge.__source]),
          source._merge.__source
        ].filter(Boolean)
      };
    }

    return merged;
  }

  /**
   * Deep merge specific data type
   */
  function deepMergeDataType(target, source, type, options) {
    const { mergeLogs = true } = options;

    if (!target.items || !source.items) {
      return source || target;
    }

    const targetItem = target.items[0] || {};
    const sourceItem = source.items[0] || {};

    const mergedItem = { ...targetItem };

    // Merge logs by date
    if (mergeLogs && targetItem.logs && sourceItem.logs) {
      const logsMap = new Map();

      for (const log of [...targetItem.logs, ...sourceItem.logs]) {
        if (log && log.date) {
          const existing = logsMap.get(log.date);
          if (!existing || (log.__fetched_at || 0) > (existing.__fetched_at || 0)) {
            logsMap.set(log.date, log);
          }
        }
      }

      mergedItem.logs = Array.from(logsMap.values()).sort((a, b) => a.date.localeCompare(b.date));
    }

    // Merge other arrays (urls, querys, stats, countTime)
    const arrayFields = {
      expose: ['urls', 'querys'],
      crawl: ['stats'],
      backlink: ['countTime'],
      diagnosisMeta: ['meta']
    }[type] || [];

    for (const field of arrayFields) {
      if (targetItem[field] && sourceItem[field]) {
        const map = new Map();
        for (const item of [...targetItem[field], ...sourceItem[field]]) {
          if (item && (item.url || item.key || item.domain || item.date || item.timeStamp)) {
            const key = item.url || item.key || item.domain || item.date || item.timeStamp;
            const existing = map.get(key);
            if (!existing) {
              map.set(key, item);
            }
          }
        }
        mergedItem[field] = Array.from(map.values());
      } else if (sourceItem[field]) {
        mergedItem[field] = sourceItem[field];
      }
    }

    // Merge topDomain if exists
    if (type === 'backlink' && (targetItem.topDomain || sourceItem.topDomain)) {
      mergedItem.topDomain = [...(targetItem.topDomain || []), ...(sourceItem.topDomain || [])];
    }

    return { items: [mergedItem] };
  }

  /**
   * Export current account data with full metadata
   * @returns {Object} Exportable data object
   */
  function exportCurrentAccountData() {
    const now = new Date().toISOString();

    // Collect all site data from localStorage
    const sites = {};
    const keysToCheck = Object.keys(localStorage);

    for (const key of keysToCheck) {
      if (!key.startsWith(DATA_LS_PREFIX)) continue;
      if (!key.includes(getCacheNamespace())) continue;

      try {
        const value = localStorage.getItem(key);
        if (!value) continue;

        const data = JSON.parse(value);

        // Extract site from key
        const match = key.match(/_([^_]+)$/);
        if (!match) continue;

        const site = atob(match[1]);

        // Structure site data
        const fetchedAt = data.__cacheSavedAt || data.__fetched_at || Date.now();
        sites[site] = {
          // Current format (__meta)
          __meta: {
            __source: encId || 'unknown',
            __fetched_at: fetchedAt,
            __schema: SCHEMA_VERSION,
            __namespace: getCacheNamespace()
          },
          // Legacy format (_merge) for test compatibility
          _merge: {
            __source: accountLabel || 'unknown',
            __accountId: encId || 'unknown',
            __fetchedAt: fetchedAt,
            __version: 1
          },
          expose: data.expose || null,
          crawl: data.crawl || null,
          backlink: data.backlink || null,
          diagnosisMeta: data.diagnosisMeta || null,
          diagnosisMetaRange: data.diagnosisMetaRange || null,
          detailLoaded: data.detailLoaded || false
        };
      } catch (e) {
        console.error('[Export] Error processing key:', key, e);
      }
    }

    return {
      __schema_version: SCHEMA_VERSION,
      __exported_at: now,
      __source_account: accountLabel || 'unknown',
      __source_enc_id: encId || 'unknown',
      __source_namespace: getCacheNamespace(),
      __data_format: DATA_FORMAT,
      __generator: 'SearchAdvisor Runtime',
      __generator_version: window.__SEARCHADVISOR_RUNTIME_VERSION__ || 'unknown',
      sites: sites
    };
  }

  /**
   * Import account data from exported format
   * @param {Object} exportData - Data from exportCurrentAccountData()
   * @param {Object} options - Import options
   * @returns {Object} Import result
   */
  function importAccountData(exportData, options = {}) {
    const {
      overwrite = false,
      mergeStrategy = 'newer',
      validate = true
    } = options;

    // Validate schema if requested
    if (validate) {
      const validation = validateDataSchema(exportData);
      if (!validation.valid) {
        return {
          success: false,
          error: 'Schema validation failed',
          errors: validation.errors
        };
      }
    }

    // Migrate to current schema if needed
    const data = migrateSchema(exportData);

    const sourceAccount = data.__source_account || 'unknown';
    const sourceEncId = data.__source_enc_id || 'unknown';

    const registry = getMergeRegistry();

    // Track this account
    registry.accounts[sourceEncId] = {
      label: sourceAccount,
      importedAt: Date.now(),
      encId: sourceEncId,
      schemaVersion: data.__schema_version
    };

    let importedCount = 0;
    let mergedCount = 0;
    let skippedCount = 0;
    const errors = [];

    // Import each site
    for (const [site, siteData] of Object.entries(data.sites)) {
      try {
        const cacheKey = getSiteDataCacheKey(site);
        const existing = localStorage.getItem(cacheKey);

        if (existing && !overwrite) {
          const existingData = JSON.parse(existing);
          // Support both _merge and __meta formats
          const sourceTime = siteData.__meta?.__fetched_at ||
                            siteData._merge?.__fetchedAt || 0;
          const targetTime = existingData.__cacheSavedAt ||
                            existingData.__meta?.__fetched_at ||
                            existingData._merge?.__fetchedAt || 0;

          if (mergeStrategy === 'newer' && sourceTime > targetTime) {
            // Import newer data
            siteData.__meta.__imported_from = sourceEncId;
            siteData.__meta.__imported_at = Date.now();
            localStorage.setItem(cacheKey, JSON.stringify(siteData));
            mergedCount++;
          } else {
            skippedCount++;
          }
        } else {
          // No existing data or overwrite
          siteData.__meta = siteData.__meta || {};
          siteData.__meta.__imported_from = sourceEncId;
          siteData.__meta.__imported_at = Date.now();
          localStorage.setItem(cacheKey, JSON.stringify(siteData));
          importedCount++;
        }

        // Track in registry
        if (!registry.mergedSites) {
          registry.mergedSites = {};
        }
        if (!registry.mergedSites[site]) {
          registry.mergedSites[site] = [];
        }
        registry.mergedSites[site].push({
          encId: sourceEncId,
          importedAt: Date.now(),
          strategy: mergeStrategy
        });

      } catch (e) {
        errors.push({ site, error: e.message });
        console.error('[Import] Error importing site:', site, e);
      }
    }

    saveMergeRegistry(registry);

    return {
      success: true,
      importedCount,
      mergedCount,
      skippedCount,
      errors,
      sourceAccount,
      sourceEncId
    };
  }

  /**
   * Get merge registry (tracks all imported accounts)
   */
  function getMergeRegistry() {
    try {
      const reg = localStorage.getItem(MERGE_REGISTRY_KEY);
      return reg ? JSON.parse(reg) : { accounts: {}, mergedSites: {} };
    } catch (e) {
      return { accounts: {}, mergedSites: {} };
    }
  }

  /**
   * Save merge registry
   */
  function saveMergeRegistry(registry) {
    try {
      localStorage.setItem(MERGE_REGISTRY_KEY, JSON.stringify(registry));
    } catch (e) {}
  }

  /**
   * Get imported accounts list
   * @returns {Array} List of imported account info
   */
  function getImportedAccounts() {
    const registry = getMergeRegistry();
    return Object.values(registry.accounts).map(acc => ({
      label: acc.label,
      encId: acc.encId,
      importedAt: acc.importedAt,
      schemaVersion: acc.schemaVersion
    }));
  }

  /**
   * Get sites from a specific account
   * @param {string} encId - Account encId
   * @returns {Array} List of sites
   */
  function getSitesByAccount(encId) {
    const registry = getMergeRegistry();
    const sites = [];

    for (const [site, merges] of Object.entries(registry.mergedSites)) {
      if (merges && merges.some(m => m.encId === encId)) {
        sites.push(site);
      }
    }
    return sites;
  }

  function getSiteListCacheKey() {
    return SITE_LS_KEY + "_" + getCacheNamespace();
  }
  function getSiteDataCacheKey(site) {
    return DATA_LS_PREFIX + getCacheNamespace() + "_" + btoa(site).replace(/=/g, "");
  }
  function getSiteListCacheStamp() {
    const cached = lsGet(getSiteListCacheKey());
    return cached && typeof cached.ts === "number" ? cached.ts : null;
  }
  function getSiteDataCacheStamp(site) {
    const cached = lsGet(getSiteDataCacheKey(site));
    return cached && typeof cached.ts === "number" ? cached.ts : null;
  }
  function getUiStateCacheKey() {
    return UI_STATE_LS_KEY + "_" + getCacheNamespace();
  }
  function getCachedUiState() {
    const cached = lsGet(getUiStateCacheKey());
    if (!cached || typeof cached !== "object") return null;
    if (cached.ts && Date.now() - cached.ts > 7 * 24 * 60 * 60 * 1000) return null; // 7일 TTL
    const mode = cached.mode === "site" ? "site" : cached.mode === "all" ? "all" : null;
    const tab = typeof cached.tab === "string" ? cached.tab : null;
    const site = typeof cached.site === "string" ? cached.site : null;
    if (!mode && !tab && !site) return null;
    return {
      mode,
      tab,
      site,
    };
  }
  function setCachedUiState() {
    lsSet(getUiStateCacheKey(), {
      ts: Date.now(),
      mode: curMode,
      tab: curTab,
      site: curSite,
    });
  }
  let allSites = [];
  async function loadSiteList(force = false) {
    console.log('[loadSiteList] Starting, force:', force, 'encId:', encId?.substring(0, 20) + '...');
    if (!force) {
      const c = lsGet(getSiteListCacheKey());
      if (c && c.ts && Date.now() - c.ts < DATA_TTL && c.sites && c.sites.length) {
        console.log('[loadSiteList] Using cached sites:', c.sites);
        allSites = c.sites;
        return;
      }
    }
    try {
      const r = await fetchWithRetry(
        "https://searchadvisor.naver.com/api-board/list/" + encId,
        { credentials: "include", headers: { accept: "application/json" } },
      );
      console.log('[loadSiteList] Fetch response ok:', r.ok);
      if (r.ok) {
        const j = await r.json();
        console.log('[loadSiteList] Response data:', JSON.stringify(j).substring(0, 200));
        allSites = (j.items || [])
          .filter((s) => s.verified)
          .map((s) => s.site)
          .filter(Boolean)
          .sort();
        console.log('[loadSiteList] Extracted sites:', allSites);
      }
    } catch (e) {
      console.log('[loadSiteList] Fetch error:', e);
    }
    if (!allSites.length) {
      const sm = location.search.match(/site=([^&]+)/);
      if (sm) allSites = [decodeURIComponent(sm[1])];
    }
    if (allSites.length) {
      lsSet(getSiteListCacheKey(), { ts: Date.now(), sites: allSites });
      console.log('[loadSiteList] Cached sites, total:', allSites.length);
    } else {
      console.log('[loadSiteList] No sites found!');
    }
  }
  function assignColors() {
    allSites.forEach((s, i) => {
      if (!SITE_COLORS_MAP[s]) SITE_COLORS_MAP[s] = COLORS[i % COLORS.length];
    });
  }

  const memCache = {};

  // Demo mode: inject mock data when running on localhost or file://
  function injectDemoData() {
    const protocol = (location && location.protocol) || "";
    const host = (location && location.hostname) || "";
    console.log('[injectDemoData] protocol:', protocol, 'host:', host);
    // Enable demo mode for localhost, local networks, file:// protocol, or forced demo mode
    const isDemoMode = window.__FORCE_DEMO_MODE__ ||
                       protocol === "file:" ||
                       host === "localhost" ||
                       host === "127.0.0.1" ||
                       host.startsWith("192.168.") ||
                       host.startsWith("10.") ||
                       host.startsWith("172.") ||
                       host.includes("local");
    console.log('[injectDemoData] isDemoMode:', isDemoMode);
    if (!isDemoMode) return false;

    console.log('[Demo Mode] Setting up demo sites and data...');

    // Check for custom injected data first (from generate-html-files.js)
    const customInitData = window.__sadvInitData;
    const customMergedData = window.__sadvMergedData;
    const hasCustomData = !!(customInitData || customMergedData);

    if (hasCustomData) {
      console.log('[Demo Mode] Found custom injected data, using it instead of DEMO_SITES');

      // Get sites from custom data
      const customSites = customMergedData?.sites || customInitData?.sites || {};
      const siteUrls = Object.keys(customSites);

      if (siteUrls.length > 0) {
        allSites = siteUrls;
        assignColors();

        // Populate memCache with custom data
        siteUrls.forEach((siteUrl) => {
          const siteData = customSites[siteUrl];
          if (siteData) {
            memCache[siteUrl] = {
              ...siteData,
              __source:
                (siteData._merge && siteData._merge.__source) ||
                siteData.__source ||
                "demo",
              exposeFetchedAt: Date.now(),
              exposeFetchState: 'success',
              crawlFetchedAt: Date.now(),
              crawlFetchState: 'success',
              backlinkFetchedAt: Date.now(),
              backlinkFetchState: 'success',
              diagnosisMetaFetchedAt: Date.now(),
              diagnosisMetaFetchState: 'success',
              diagnosisMetaRange: (siteData.diagnosisMeta && siteData.diagnosisMeta.items && siteData.diagnosisMeta.items.length > 0 && siteData.diagnosisMeta.items[0].meta && siteData.diagnosisMeta.items[0].meta.length > 0) ?
                { start: siteData.diagnosisMeta.items[0].meta[0].date, end: siteData.diagnosisMeta.items[0].meta[siteData.diagnosisMeta.items[0].meta.length - 1].date } :
                { start: "20260301", end: "20260315" },
              detailLoaded: true,
              __cacheSavedAt: Date.now()
            };
            console.log('[Demo Mode] Custom data loaded for', siteUrl);
          }
        });

        // Set up mergedMeta for merged view header
        if (customMergedData) {
          const accountsMerged = customMergedData.accounts_merged || [];
          const sourceCount = accountsMerged.length || 1;

          window.__SEARCHADVISOR_EXPORT_PAYLOAD__ = {
            siteMeta: {},
            mergedMeta: {
              isMerged: true,
              sourceCount: sourceCount,
              accounts: accountsMerged.map((acc, i) => ({
                encId: acc,
                label: acc
              })),
              naverIds: accountsMerged
            },
            mode: 'saved-html'
          };

          // Update snapshotMetaState
          setSnapshotMetaState({
            siteMeta: {},
            mergedMeta: window.__SEARCHADVISOR_EXPORT_PAYLOAD__.mergedMeta
          });

          console.log('[Demo Mode] Merged meta set for', sourceCount, 'accounts');
        }

        console.log('[Demo Mode] Complete: Custom data injected for', allSites.length, 'sites');
        return true;
      }
    }

    // Fall back to DEMO_SITES for consistency
    allSites = DEMO_SITES.slice();
    assignColors();

    // Populate memCache with complete data for each site
    const today = new Date();
    const startDate = new Date(today);
    startDate.setDate(today.getDate() - 14);

    allSites.forEach((site, idx) => {
      // Generate logs with proper date format (YYYYMMDD)
      const logs = Array.from({length: 15}, (_, i) => {
        const d = new Date(startDate);
        d.setDate(startDate.getDate() + i);
        const dateStr = d.toISOString().slice(0, 10).replace(/-/g, '');
        return {
          date: dateStr,
          clickCount: Math.floor(Math.random() * 400) + 50,
          exposeCount: Math.floor(Math.random() * 800) + 100
        };
      });

      const exposeData = {
        items: [{
          period: {
            start: "20260301",
            end: "20260315",
            prevClickRatio: (Math.random() * 20 - 5).toFixed(1),
            prevExposeRatio: (Math.random() * 15 - 3).toFixed(1)
          },
          logs: logs.map(log => ({
            ...log,
            ctr: log.exposeCount > 0 ? ((log.clickCount / log.exposeCount) * 100).toFixed(2) : "0.00"
          })),
          urls: Array.from({length: 20}, (_, i) => ({
            key: `${site}/page-${i+1}`,
            clickCount: Math.floor(Math.random() * 200) + 10,
            exposeCount: Math.floor(Math.random() * 500) + 50,
            ctr: (Math.random() * 5 + 0.5).toFixed(2)
          })),
          querys: Array.from({length: 15}, (_, i) => ({
            key: `검색어${idx+1}-${i+1}`,
            clickCount: Math.floor(Math.random() * 100) + 5,
            exposeCount: Math.floor(Math.random() * 300) + 20,
            ctr: (Math.random() * 3 + 0.5).toFixed(2)
          }))
        }]
      };

      const crawlData = {
        items: [{
          stats: logs.map(log => ({
            date: log.date,
            pageCount: 1000 + Math.floor(Math.random() * 500),
            downloadSize: 50000 + Math.floor(Math.random() * 10000),
            sumTryCount: 200 + Math.floor(Math.random() * 100),
            sumErrorCount: Math.floor(Math.random() * 10),
            notFound: Math.floor(Math.random() * 5),
            serverError: Math.floor(Math.random() * 2),
            connectTimeout: 0,
          })),
          sitemaps: [{ url: `${site}/sitemap.xml`, status: "ok", count: 156 }]
        }]
      };

      const backlinkData = {
        items: [{
          total: Math.floor(Math.random() * 1000) + 200,
          domains: Math.floor(Math.random() * 50) + 10,
          countTime: logs.map(log => ({
            timeStamp: log.date,
            backlinkCnt: Math.floor(Math.random() * 20) + 180
          })),
          topDomain: [
            { domain: `backlink-source-${idx+1}.com`, backlinkCnt: Math.floor(Math.random() * 100) + 50 },
            { domain: `partner-site-${idx+1}.net`, backlinkCnt: Math.floor(Math.random() * 80) + 30 },
            { domain: `news-portal-${idx+1}.kr`, backlinkCnt: Math.floor(Math.random() * 60) + 20 },
            { domain: `blog-platform-${idx+1}.com`, backlinkCnt: Math.floor(Math.random() * 40) + 10 }
          ]
        }]
      };

      const diagnosisData = {
        code: 0,
        items: [{
          meta: Array.from({length: 15}, (_, i) => {
            const d = new Date(startDate);
            d.setDate(startDate.getDate() + i);
            const dateStr = d.toISOString().slice(0, 10).replace(/-/g, '');
            return {
              date: dateStr,
              stateCount: {
                "1": 1000 + idx * 100 + i * 10,
                "2": Math.floor(Math.random() * 50) + 10,
                "3": Math.floor(Math.random() * 30) + 5,
                "4": Math.floor(Math.random() * 20) + 2
              }
            };
          })
        }]
      };

      // Store in memCache with merge metadata
      memCache[site] = {
        // Core data
        expose: exposeData,
        crawl: crawlData,
        backlink: backlinkData,
        diagnosisMeta: diagnosisData,
        // Fetch metadata
        exposeFetchedAt: Date.now(),
        exposeFetchState: 'success',
        crawlFetchedAt: Date.now(),
        crawlFetchState: 'success',
        backlinkFetchedAt: Date.now(),
        backlinkFetchState: 'success',
        diagnosisMetaFetchedAt: Date.now(),
        diagnosisMetaFetchState: 'success',
        diagnosisMetaRange: { start: "20260301", end: "20260315" },
        detailLoaded: true,
        __cacheSavedAt: Date.now(),
        // Merge metadata for multi-account support
        __source: 'demo',
        __fetchedAt: Date.now(),
        __version: 1
      };

      console.log('[Demo Mode] Data injected for', site, '- logs:', logs.length, 'clicks:', logs.reduce((s, l) => s + l.clickCount, 0));
    });

    console.log('[Demo Mode] Complete: All mock data injected for', allSites.length, 'sites');

    // Remove snapshot shell hide CSS in demo mode
    const hideStyle = document.getElementById("sadv-snapshot-shell-hide");
    if (hideStyle) {
      hideStyle.remove();
      console.log('[Demo Mode] Removed snapshot shell hide CSS');
    }

    return true;
  }

  const FIELD_FAILURE_RETRY_MS = 5 * 60 * 1000;
  const FIELD_SUCCESS_TTL_MS = DATA_TTL;
  function hasOwnDataField(data, key) {
    return !!data && Object.prototype.hasOwnProperty.call(data, key);
  }
  function getFieldSnapshotFetchedAt(data, key) {
    if (!data) return null;
    const fetchedAt = data[key + "FetchedAt"];
    if (typeof fetchedAt === "number") return fetchedAt;
    return typeof data.__cacheSavedAt === "number" ? data.__cacheSavedAt : null;
  }
  function hasFreshFieldSnapshot(data, key, ttlMs = FIELD_SUCCESS_TTL_MS) {
    const fetchedAt = getFieldSnapshotFetchedAt(data, key);
    return typeof fetchedAt === "number" && Date.now() - fetchedAt < ttlMs;
  }
  function hasLegacySuccessfulFieldSnapshot(data, key) {
    if (!data) return false;
    if (key === "expose") return data.expose != null;
    if ((key === "crawl" || key === "backlink") && data.detailLoaded === true) {
      return data[key] != null;
    }
    return false;
  }
  function hasSuccessfulFieldSnapshot(data, key) {
    return !!(
      data &&
      hasFreshFieldSnapshot(data, key) &&
      hasOwnDataField(data, key) &&
      (data[key + "FetchState"] === "success" ||
        hasLegacySuccessfulFieldSnapshot(data, key))
    );
  }
  function hasRecentFieldFailure(data, key, cooldownMs = FIELD_FAILURE_RETRY_MS) {
    return !!(
      data &&
      data[key + "FetchState"] === "failure" &&
      typeof data[key + "FetchedAt"] === "number" &&
      Date.now() - data[key + "FetchedAt"] < cooldownMs
    );
  }
  function shouldFetchField(data, key, options) {
    if (options && options.force) return true;
    if (hasSuccessfulFieldSnapshot(data, key)) return false;
    if (options && options.retryIncomplete) return true;
    return !hasRecentFieldFailure(data, key);
  }
  function hasDetailSnapshot(data) {
    return hasSuccessfulFieldSnapshot(data, "crawl") && hasSuccessfulFieldSnapshot(data, "backlink");
  }
  function normalizeSiteData(data) {
    if (!data) return null;
    const normalized = {
      expose: hasOwnDataField(data, "expose") ? data.expose ?? null : null,
      crawl: hasOwnDataField(data, "crawl") ? data.crawl ?? null : null,
      backlink: hasOwnDataField(data, "backlink") ? data.backlink ?? null : null,
      detailLoaded:
        typeof data.detailLoaded === "boolean"
          ? data.detailLoaded || hasDetailSnapshot(data)
          : hasDetailSnapshot(data),
    };
    if (hasOwnDataField(data, "diagnosisMeta")) normalized.diagnosisMeta = data.diagnosisMeta ?? null;
    if (hasOwnDataField(data, "diagnosisMetaStatus"))
      normalized.diagnosisMetaStatus = data.diagnosisMetaStatus ?? null;
    if (hasOwnDataField(data, "diagnosisMetaRange"))
      normalized.diagnosisMetaRange = data.diagnosisMetaRange ?? null;
    if (hasOwnDataField(data, "diagnosisMetaFetchState"))
      normalized.diagnosisMetaFetchState = data.diagnosisMetaFetchState ?? null;
    if (hasOwnDataField(data, "diagnosisMetaFetchedAt"))
      normalized.diagnosisMetaFetchedAt = data.diagnosisMetaFetchedAt ?? null;
    if (hasOwnDataField(data, "exposeFetchState")) normalized.exposeFetchState = data.exposeFetchState ?? null;
    if (hasOwnDataField(data, "exposeFetchedAt")) normalized.exposeFetchedAt = data.exposeFetchedAt ?? null;
    if (hasOwnDataField(data, "exposeStatus")) normalized.exposeStatus = data.exposeStatus ?? null;
    if (hasOwnDataField(data, "crawlFetchState")) normalized.crawlFetchState = data.crawlFetchState ?? null;
    if (hasOwnDataField(data, "crawlFetchedAt")) normalized.crawlFetchedAt = data.crawlFetchedAt ?? null;
    if (hasOwnDataField(data, "crawlStatus")) normalized.crawlStatus = data.crawlStatus ?? null;
    if (hasOwnDataField(data, "backlinkFetchState"))
      normalized.backlinkFetchState = data.backlinkFetchState ?? null;
    if (hasOwnDataField(data, "backlinkFetchedAt"))
      normalized.backlinkFetchedAt = data.backlinkFetchedAt ?? null;
    if (hasOwnDataField(data, "backlinkStatus")) normalized.backlinkStatus = data.backlinkStatus ?? null;
    if (hasOwnDataField(data, "__cacheSavedAt")) normalized.__cacheSavedAt = data.__cacheSavedAt ?? null;

    // Merge metadata for multi-account support
    normalized.__source = hasOwnDataField(data, "__source") ? data.__source : null;
    normalized.__fetchedAt = hasOwnDataField(data, "__fetchedAt") ? data.__fetchedAt : null;
    normalized.__version = hasOwnDataField(data, "__version") ? data.__version : 1;
    normalized.__accountId = hasOwnDataField(data, "__accountId") ? data.__accountId : null;
    normalized.__importedFrom = hasOwnDataField(data, "__importedFrom") ? data.__importedFrom : null;
    normalized.__importedAt = hasOwnDataField(data, "__importedAt") ? data.__importedAt : null;

    return normalized;
  }

  /**
   * Merge data from multiple accounts into a single dataset
   * @param {Object} target - Target memCache object
   * @param {Object} source - Source data to merge
   * @param {Object} options - Merge options { overwrite: boolean, mergeStrategy: 'newer'|'all' }
   * @returns {Object} Merged data
   */
  function mergeSiteData(target, source, options = {}) {
    const { overwrite = false, mergeStrategy = 'newer' } = options;

    if (!source) return target;
    if (!target) return source;

    const result = { ...target };

    for (const site of Object.keys(source)) {
      const sourceData = source[site];
      const targetData = result[site];

      if (!targetData) {
        // New site - just add it
        result[site] = sourceData;
      } else {
        // Existing site - merge based on strategy
        const shouldOverwrite = overwrite ||
          (mergeStrategy === 'newer' &&
           (sourceData.__fetchedAt || 0) > (targetData.__fetchedAt || 0));

        if (shouldOverwrite) {
          result[site] = sourceData;
        } else {
          // Merge individual fields
          for (const key of Object.keys(sourceData)) {
            if (!targetData[key] || overwrite) {
              result[site][key] = sourceData[key];
            }
          }
        }
      }
    }

    return result;
  }

  /**
   * Export data for backup/transfer
   * @param {Object} memCache - Memory cache to export
   * @returns {Object} Exportable data with metadata
   */
  function exportSiteData(memCache) {
    return {
      __exportVersion: 1,
      __exportedAt: Date.now(),
      __exportSource: 'SearchAdvisor Runtime',
      sites: Object.keys(memCache).reduce((acc, site) => {
        acc[site] = { ...memCache[site] };
        return acc;
      }, {})
    };
  }

  /**
   * Import data from export
   * @param {Object} memCache - Target memory cache
   * @param {Object} exportData - Data to import
   * @param {Object} options - Import options
   * @returns {Object} Merged memCache
   */
  function importSiteData(memCache, exportData, options = {}) {
    if (!exportData || !exportData.sites) return memCache;

    const importedCache = { ...memCache };

    // Add import metadata
    for (const site of Object.keys(exportData.sites)) {
      const data = exportData.sites[site];
      data.__importedFrom = exportData.__exportSource || 'unknown';
      data.__importedAt = Date.now();

      if (!importedCache[site]) {
        importedCache[site] = data;
      } else {
        // Use merge function
        importedCache[site] = mergeSiteData(
          { [site]: importedCache[site] },
          { [site]: data },
          options
        )[site];
      }
    }

    return importedCache;
  }

  function buildSiteSummaryRow(site, data) {
    const item = (data && data.expose && data.expose.items && data.expose.items[0]) || {};
    const logs = (item.logs || []).sort((a, b) => (a.date || "").localeCompare(b.date || ""));
    const clicks = logs.map((r) => Number(r.clickCount) || 0);
    const exposes = logs.map((r) => Number(r.exposeCount) || 0);
    const totalC = clicks.reduce((a, b) => a + b, 0);
    const totalE = exposes.reduce((a, b) => a + b, 0);
    const avgCtr = totalE ? (totalC / totalE) * 100 : 0;
    const cSt = st(clicks);
    const period = item.period || {};
    const diagnosisItem =
      (data && data.diagnosisMeta && data.diagnosisMeta.items && data.diagnosisMeta.items[0]) || {};
    const diagnosisLogs = [...(diagnosisItem.meta || [])].sort((a, b) =>
      (a.date || "").localeCompare(b.date || ""),
    );

    // Debug logging for diagnosis data
    if (diagnosisLogs.length > 0) {
      }
    const diagnosisLatest =
      diagnosisLogs.length > 0 ? diagnosisLogs[diagnosisLogs.length - 1] : null;
    const diagnosisLatestCounts =
      diagnosisLatest && diagnosisLatest.stateCount ? diagnosisLatest.stateCount : {};
    const diagnosisIndexedValues = diagnosisLogs.map(function (row) {
      return (row.stateCount && row.stateCount["1"]) || 0;
    });
    const diagnosisIndexedDates = diagnosisLogs.map(function (row) {
      const digits = String(row.date || "").replace(/[^\\d]/g, "");
      return digits.length === 8 ? fmtB(digits) : row.date || "";
    });
    // Get source account from active payload/merge metadata
    const initSiteData =
      (typeof window !== "undefined" && window.__sadvMergedData && window.__sadvMergedData.sites
        ? window.__sadvMergedData.sites[site]
        : null) ||
      (typeof window !== "undefined" && window.__sadvInitData && window.__sadvInitData.sites
        ? window.__sadvInitData.sites[site]
        : null) ||
      (typeof window !== "undefined" && window.__SEARCHADVISOR_EXPORT_PAYLOAD__ && window.__SEARCHADVISOR_EXPORT_PAYLOAD__.siteData
        ? window.__SEARCHADVISOR_EXPORT_PAYLOAD__.siteData[site]
        : null);
    const sourceAccount =
      (data && data._merge && data._merge.__source) ||
      (data && data.__meta && data.__meta.__source) ||
      (data && data.__source) ||
      (initSiteData && initSiteData._merge && initSiteData._merge.__source) ||
      (initSiteData && initSiteData.__meta && initSiteData.__meta.__source) ||
      null;

    return {
      site,
      totalC,
      totalE,
      avgCtr: +avgCtr.toFixed(2),
      trend: cSt.slope || 0,
      latestClick: clicks.slice(-7).reduce((a, b) => a + b, 0),
      prevClickRatio: period.prevClickRatio != null && Number.isFinite(parseFloat(period.prevClickRatio)) ? parseFloat(period.prevClickRatio) : undefined,
      logs,
      clicks,
      diagnosisIndexedCurrent: diagnosisLatestCounts["1"] || 0,
      diagnosisIndexedValues,
      diagnosisIndexedDates,
      diagnosisLatestDate: diagnosisLatest && diagnosisLatest.date ? diagnosisLatest.date : "-",
      diagnosisMetaCode:
        data && data.diagnosisMeta && typeof data.diagnosisMeta.code !== "undefined"
          ? data.diagnosisMeta.code
          : null,
      diagnosisMetaStatus:
        data && typeof data.diagnosisMetaStatus !== "undefined"
          ? data.diagnosisMetaStatus
          : null,
      diagnosisMetaRange:
        data && typeof data.diagnosisMetaRange !== "undefined"
          ? data.diagnosisMetaRange
          : null,
      sourceAccount: sourceAccount,
    };
  }
  const inflightExpose = {};
  const inflightDetail = {};
  const inflightDiagnosisMeta = {};
  function hasSuccessfulDiagnosisMetaSnapshot(data) {
    return !!(
      data &&
      hasFreshFieldSnapshot(data, "diagnosisMeta") &&
      ((data.diagnosisMeta && data.diagnosisMeta.code === 0 && data.diagnosisMetaRange) ||
        data.diagnosisMetaFetchState === "success")
    );
  }
  function hasRecentDiagnosisMetaFailure(
    data,
    cooldownMs = FIELD_FAILURE_RETRY_MS,
  ) {
    return !!(
      data &&
      data.diagnosisMetaFetchState === "failure" &&
      typeof data.diagnosisMetaFetchedAt === "number" &&
      Date.now() - data.diagnosisMetaFetchedAt < cooldownMs
    );
  }
  function hasDiagnosisMetaSnapshot(data) {
    return hasSuccessfulDiagnosisMetaSnapshot(data) || hasRecentDiagnosisMetaFailure(data);
  }
  function shouldFetchDiagnosisMeta(data, options) {
    if (options && options.force) return true;
    if (hasSuccessfulDiagnosisMetaSnapshot(data)) return false;
    if (options && options.retryIncomplete) return true;
    return !hasRecentDiagnosisMetaFailure(data);
  }
  function getDiagnosisMetaRange() {
    const formatYmd = function (date) {
      if (!date) return "";
      const year = date.getUTCFullYear();
      const month = String(date.getUTCMonth() + 1).padStart(2, "0");
      const day = String(date.getUTCDate()).padStart(2, "0");
      return String(year) + month + day;
    };
    const todayKstLocal = new Date(
      new Date().toLocaleString("en-US", { timeZone: "Asia/Seoul" }),
    );
    const todayKst = new Date(
      Date.UTC(
        todayKstLocal.getFullYear(),
        todayKstLocal.getMonth(),
        todayKstLocal.getDate(),
      ),
    );
    const effectiveEndDate = todayKst;
    const effectiveStartDate = new Date(effectiveEndDate.getTime() - 40 * 864e5);
    return {
      startDate: formatYmd(effectiveStartDate),
      endDate: formatYmd(effectiveEndDate),
    };
  }
  async function fetchDiagnosisMeta(site, seedData, options) {
    const baseData = seedData || (await fetchExposeData(site, options));
    if (!shouldFetchDiagnosisMeta(baseData, options)) return baseData;
    if (!(options && options.force) && inflightDiagnosisMeta[site]) return inflightDiagnosisMeta[site];
    const enc = encodeURIComponent(site),
      base = "https://searchadvisor.naver.com/api-console/report";
    const range = getDiagnosisMetaRange();
    inflightDiagnosisMeta[site] = (async function () {
      try {
        let response = null;
        let diagnosisMeta = null;
        let diagnosisMetaFetchState = "failure";
        const diagnosisMetaFetchedAt = Date.now();
        try {
          response = await fetchWithRetry(
            base +
              "/diagnosis/meta/" +
              encId +
              "?site=" +
              enc +
              "&startDate=" +
              range.startDate +
              "&endDate=" +
              range.endDate,
            { credentials: "include", headers: { accept: "application/json" } },
          );
          diagnosisMeta = response.ok ? await response.json() : null;
          if (response.ok && diagnosisMeta && diagnosisMeta.code === 0) {
            diagnosisMetaFetchState = "success";
          }
        } catch (e) {}
        return persistSiteData(site, {
          ...baseData,
          diagnosisMeta: diagnosisMetaFetchState === "success" ? diagnosisMeta : null,
          diagnosisMetaStatus: response ? response.status : null,
          diagnosisMetaRange: range,
          diagnosisMetaFetchState,
          diagnosisMetaFetchedAt,
          detailLoaded: !!baseData.detailLoaded,
        });
      } finally {
        delete inflightDiagnosisMeta[site];
      }
    })();
    return inflightDiagnosisMeta[site];
  }
  function getCachedSiteSnapshot(site) {
    const cached = normalizeSiteData(getCachedData(site));
    const live = normalizeSiteData(memCache[site]);
    if (!cached && !live) return null;
    return normalizeSiteData({ ...(cached || {}), ...(live || {}) });
  }
  function emptySiteData() {
    return {
      expose: null,
      crawl: null,
      backlink: null,
      detailLoaded: false,
    };
  }
  function persistSiteData(site, data) {
    const next =
      normalizeSiteData({ ...(getCachedSiteSnapshot(site) || emptySiteData()), ...(data || {}) }) ||
      emptySiteData();
    memCache[site] = next;
    setCachedData(site, next);
    return next;
  }
  async function fetchExposeData(site, options) {
    if (memCache[site] && !shouldFetchField(memCache[site], "expose", options)) {
      return normalizeSiteData(memCache[site]);
    }
    const cached = getCachedSiteSnapshot(site);
    if (cached && !shouldFetchField(cached, "expose", options)) {
      memCache[site] = cached;
      return cached;
    }
    if (!(options && options.force) && inflightExpose[site]) return inflightExpose[site];
    const enc = encodeURIComponent(site),
      base = "https://searchadvisor.naver.com/api-console/report";
    inflightExpose[site] = (async function () {
      try {
        const exposeFetchedAt = Date.now();
        const exposeRes = await fetchWithRetry(
          base + "/expose/" + encId + "?site=" + enc + "&period=90&device=&topN=50",
          { credentials: "include", headers: { accept: "application/json" } },
        );
        const expose = exposeRes.ok ? await exposeRes.json() : null;
        return persistSiteData(site, {
          expose: exposeRes.ok ? expose : null,
          exposeFetchState: exposeRes.ok ? "success" : "failure",
          exposeFetchedAt,
          exposeStatus: exposeRes.status,
          detailLoaded: false,
        });
      } catch (e) {
        return persistSiteData(site, {
          expose: null,
          exposeFetchState: "failure",
          exposeFetchedAt: Date.now(),
          exposeStatus: null,
          detailLoaded: false,
        });
      } finally {
        delete inflightExpose[site];
      }
    })();
    return inflightExpose[site];
  }
  async function fetchSiteData(site, options) {
    const baseData = await fetchDiagnosisMeta(site, null, options);
    const needCrawl = shouldFetchField(baseData, "crawl", options);
    const needBacklink = shouldFetchField(baseData, "backlink", options);
    if (!needCrawl && !needBacklink) return baseData;
    if (!(options && options.force) && inflightDetail[site]) return inflightDetail[site];
    const enc = encodeURIComponent(site),
      base = "https://searchadvisor.naver.com/api-console/report";
    const today = new Date().toISOString().slice(0, 10).replace(/-/g, "");
    const d90 = new Date(Date.now() - 90 * 864e5)
      .toISOString()
      .slice(0, 10)
      .replace(/-/g, "");
    inflightDetail[site] = (async function () {
      try {
        const requests = await Promise.all([
          needCrawl
            ? fetchWithRetry(
                base +
                  "/crawl/" +
                  encId +
                  "?site=" +
                  enc +
                  "&start_date=" +
                  d90 +
                  "&end_date=" +
                  today +
                  "&isAlly=false&count=5",
                { credentials: "include", headers: { accept: "application/json" } },
              )
                .then(async function (response) {
                  return {
                    key: "crawl",
                    ok: response.ok,
                    status: response.status,
                    data: response.ok ? await response.json() : null,
                    fetchedAt: Date.now(),
                  };
                })
                .catch(function () {
                  return {
                    key: "crawl",
                    ok: false,
                    status: null,
                    data: null,
                    fetchedAt: Date.now(),
                  };
                })
            : Promise.resolve({
                key: "crawl",
                ok: hasSuccessfulFieldSnapshot(baseData, "crawl"),
                status: baseData.crawlStatus ?? null,
                data: baseData.crawl ?? null,
                fetchedAt: baseData.crawlFetchedAt ?? null,
              }),
          needBacklink
            ? fetchWithRetry(
                base +
                  "/backlink/" +
                  encId +
                  "?site=" +
                  enc +
                  "&start_date=" +
                  d90 +
                  "&end_date=" +
                  today,
                { credentials: "include", headers: { accept: "application/json" } },
              )
                .then(async function (response) {
                  return {
                    key: "backlink",
                    ok: response.ok,
                    status: response.status,
                    data: response.ok ? await response.json() : null,
                    fetchedAt: Date.now(),
                  };
                })
                .catch(function () {
                  return {
                    key: "backlink",
                    ok: false,
                    status: null,
                    data: null,
                    fetchedAt: Date.now(),
                  };
                })
            : Promise.resolve({
                key: "backlink",
                ok: hasSuccessfulFieldSnapshot(baseData, "backlink"),
                status: baseData.backlinkStatus ?? null,
                data: baseData.backlink ?? null,
                fetchedAt: baseData.backlinkFetchedAt ?? null,
              }),
        ]);
        const next = { ...baseData };
        requests.forEach(function (result) {
          next[result.key] = result.ok ? result.data : null;
          next[result.key + "FetchState"] = result.ok ? "success" : "failure";
          next[result.key + "FetchedAt"] = result.fetchedAt;
          next[result.key + "Status"] = result.status;
        });
        next.detailLoaded =
          next.crawlFetchState === "success" && next.backlinkFetchState === "success";
        return persistSiteData(site, next);
      } finally {
        delete inflightDetail[site];
      }
    })();
    return inflightDetail[site];
  }
  async function refreshExportSiteData(site) {
    delete memCache[site];
    clearCachedData(site);
    return fetchSiteData(site, { force: true, retryIncomplete: true });
  }
  async function ensureExportSiteList(refreshMode) {
    const forceSiteListRefresh = refreshMode === "refresh";
    await loadSiteList(forceSiteListRefresh);
    assignColors();
    ensureCurrentSite();
  }
  async function resolveExportSiteData(site, options) {
    const refreshMode = options && options.refreshMode === "refresh" ? "refresh" : "cache-first";
    if (refreshMode === "refresh") return refreshExportSiteData(site);
    return fetchSiteData(site, { retryIncomplete: true });
  }
  let curMode = "all",
    curSite = null,
    curTab = "overview";
  let siteViewReqId = 0;
  let allViewReqId = 0;
  const __sadvListeners = new Set();
  let __sadvInitialReady = false;
  const __sadvReadyResolvers = [];

  function __sadvSnapshot() {
    return {
      curMode,
      curSite,
      curTab,
      allSites: [...allSites],
      rows: window.__sadvRows || [],
      accountLabel,
    };
  }

  function __sadvNotify() {
    const snap = __sadvSnapshot();
    __sadvListeners.forEach(function (fn) {
      try {
        fn(snap);
      } catch (e) {}
    });
  }

  function __sadvMarkReady() {
    if (__sadvInitialReady) return;
    __sadvInitialReady = true;
    while (__sadvReadyResolvers.length) {
      const resolve = __sadvReadyResolvers.shift();
      try {
        resolve(true);
      } catch (e) {}
    }
    __sadvNotify();
  }

  window.__sadvApi = {
    getState: __sadvSnapshot,
    isReady: function () {
      return __sadvInitialReady;
    },
    waitUntilReady: function (timeoutMs) {
      return new Promise(function (resolve, reject) {
        if (__sadvInitialReady) {
          resolve(true);
          return;
        }
        let timer = null;
        const done = function (ok) {
          if (timer) clearTimeout(timer);
          resolve(ok);
        };
        __sadvReadyResolvers.push(done);
        if (timeoutMs && timeoutMs > 0) {
          timer = setTimeout(function () {
            const idx = __sadvReadyResolvers.indexOf(done);
            if (idx >= 0) __sadvReadyResolvers.splice(idx, 1);
            reject(new Error("legacy init timeout"));
          }, timeoutMs);
        }
      });
    },
    subscribe: function (fn) {
      __sadvListeners.add(fn);
      return function () {
        __sadvListeners.delete(fn);
      };
    },
    switchMode: function (mode) {
      switchMode(mode);
    },
    setSite: function (site) {
      setComboSite(site);
    },
    setTab: function (tab) {
      if (!TABS.some(function (item) { return item.id === tab; }) || curTab === tab) return;
      curTab = tab;
      tabsEl.querySelectorAll(".sadv-t").forEach(function (b) {
        b.classList.remove("on");
      });
      const btn = tabsEl.querySelector('[data-t="' + tab + '"]');
      if (btn) btn.classList.add("on");
      if (window.__sadvR) renderTab(window.__sadvR);
      __sadvNotify();
    },
    refresh: function () {
      const btn = document.getElementById("sadv-refresh-btn");
      if (btn) btn.click();
    },
    download: function () {
      downloadSnapshot();
    },
    exportSnapshotData: function (onProgress, options) {
      return collectExportData(onProgress, options);
    },
    buildLegacySnapshotHtml: function (savedAt, payload) {
      return buildSnapshotHtml(savedAt, payload);
    },
    close: function () {
      const panel = document.getElementById("sadv-p");
      const inj = document.getElementById("sadv-inj");
      if (panel) panel.remove();
      if (inj) inj.remove();
      delete window.__sadvApi;
    },
    // Multi-account merge functions
    validateDataSchema: validateDataSchema,
    migrateSchema: migrateSchema,
    detectConflicts: detectConflicts,
    mergeAccounts: mergeAccounts,
    getMergeRegistry: getMergeRegistry,
    saveMergeRegistry: saveMergeRegistry,
    importAccountData: importAccountData,
    exportCurrentAccountData: exportCurrentAccountData,
    getImportedAccounts: getImportedAccounts,
    getSitesByAccount: getSitesByAccount
  };
  const modeBar = document.getElementById("sadv-mode-bar"),
    siteBar = document.getElementById("sadv-site-bar"),
    tabsEl = document.getElementById("sadv-tabs"),
    bdEl = document.getElementById("sadv-bd"),
    labelEl = document.getElementById("sadv-site-label");
  let snapshotMetaState = { siteMeta: {}, mergedMeta: null };
  function setSnapshotMetaState(state) {
    snapshotMetaState = {
      siteMeta: state && state.siteMeta ? state.siteMeta : {},
      mergedMeta: state && state.mergedMeta ? state.mergedMeta : null,
    };
  }
  function getSiteMetaMap() {
    const liveMap = snapshotMetaState.siteMeta;
    if (liveMap && Object.keys(liveMap).length) return liveMap;
    const payload =
      typeof window !== "undefined" && window.__SEARCHADVISOR_EXPORT_PAYLOAD__
        ? window.__SEARCHADVISOR_EXPORT_PAYLOAD__
        : null;
    return payload && payload.siteMeta ? payload.siteMeta : {};
  }
  function getMergedMetaState() {
    if (snapshotMetaState.mergedMeta) return snapshotMetaState.mergedMeta;
    const payload =
      typeof window !== "undefined" && window.__SEARCHADVISOR_EXPORT_PAYLOAD__
        ? window.__SEARCHADVISOR_EXPORT_PAYLOAD__
        : null;
    return payload && payload.mergedMeta ? payload.mergedMeta : null;
  }
  function getSiteShortName(a) {
    const meta = a ? getSiteMetaMap()[a] || null : null;
    const label = meta ? (meta.displayLabel || meta.label || meta.shortName || "").trim() : "";
    return label || (a ? a.replace(/^https?:\/\//, "") : "\uC0AC\uC774\uD2B8 \uC120\uD0DD");
  }
  function getSiteLabel(a) {
    if (!a) return "\uC0AC\uC774\uD2B8 \uC120\uD0DD";
    const meta = getSiteMetaMap()[a] || null;
    const label = meta ? (meta.displayLabel || meta.label || meta.shortName || "").trim() : "";
    return label || getSiteShortName(a);
  }
  function isMergedReport() {
    return !!getMergedMetaState();
  }
  /**
   * 병합된 계정 정보를 표시하는 DOM 요소를 생성합니다.
   * @param {Object} mergedMeta - 병합 메타데이터 (accounts, mergedAt 포함)
   * @returns {HTMLElement} 병합된 계정 정보를 표시하는 div 요소
   */
  function createMergedAccountsInfo(mergedMeta) {
    const mergedInfo = document.createElement("div");
    mergedInfo.style.cssText = "background:linear-gradient(135deg,#1a2d45,#0d1829);border:1px solid #2a4060;border-radius:8px;padding:12px 16px;margin-bottom:16px";
    const validAccounts = mergedMeta.accounts.filter(Boolean);
    const accountLabels = validAccounts.map((acc, i) => {
      const fullLabel = acc.label || acc.encId?.slice(0, 8) || `계정${i + 1}`;
      const shortLabel = fullLabel.includes('@') ? fullLabel.split('@')[0] : fullLabel;
      return `<span tabindex="0" role="button" aria-describedby="merged-acc-full-${i}" style="display:inline-block;background:#2a4060;color:#8bb8e8;padding:3px 8px;border-radius:4px;font-size:11px;margin:2px;cursor:default" title="${escHtml(fullLabel)}">${escHtml(shortLabel)}<span id="merged-acc-full-${i}" style="position:absolute;width:1px;height:1px;padding:0;margin:-1px;overflow:hidden;clip:rect(0,0,0,0);white-space:nowrap;border:0">전체: ${escHtml(fullLabel)}</span></span>`;
    }).join(" ");
    mergedInfo.setAttribute("role", "region");
    mergedInfo.setAttribute("aria-label", `병합된 계정 정보, ${validAccounts.length}개 계정`);
    mergedInfo.innerHTML = `
        <div style="display:flex;align-items:center;gap:8px;margin-bottom:8px">
          <span style="font-size:16px" aria-hidden="true">🔀</span>
          <span style="font-size:13px;font-weight:700;color:#e0ecff">병합된 계정</span>
          <span style="font-size:10px;color:#6482a2;background:#0d1829;padding:2px 6px;border-radius:4px">${validAccounts.length}개 계정</span>
        </div>
        <div style="display:flex;flex-wrap:wrap;gap:4px">${accountLabels}</div>
        <div style="font-size:9px;color:#6482a2;margin-top:8px">병합 시각: ${mergedMeta.mergedAt ? new Date(mergedMeta.mergedAt).toLocaleString('ko-KR') : '-'}</div>
      `;
    return mergedInfo;
  }
  function ensureCurrentSite() {
    if (!allSites.length) {
      curSite = null;
      return null;
    }
    if (!curSite || !allSites.includes(curSite)) curSite = allSites[0];
    return curSite;
  }
  function setAllSitesLabel() {
    const mergedMeta = getMergedMetaState();
    const summary = isMergedReport() && mergedMeta && mergedMeta.sourceCount
      ? `<span>${allSites.length}\uac1c \uc0ac\uc774\ud2b8 \ub4f1\ub85d\ub428 · ${mergedMeta.sourceCount}\uac1c \uc2a4\ub0c5\uc0f7 \ubcd1\ud569</span>`
      : `<span>${allSites.length}\uac1c \uc0ac\uc774\ud2b8 \ub4f1\ub85d\ub428</span>`;
    labelEl.innerHTML = summary;
  }
  function buildCombo(rows) {
    console.log('[buildCombo] Called, allSites:', allSites, 'rows:', rows);
    const drop = document.getElementById("sadv-combo-drop");
    if (!drop) {
      console.error('[buildCombo] sadv-combo-drop not found!');
      return;
    }
    const rowsMap = {};
    if (rows && rows.length)
      rows.forEach((r) => {
        if (allSites.includes(r.site)) rowsMap[r.site] = r;
      });
    const rowSites =
      rows && rows.length
        ? rows.map((r) => r.site).filter((site) => allSites.includes(site))
        : [];
    const restSites = allSites.filter((s) => !rowsMap[s]);
    const orderedSites = [...rowSites, ...restSites];
    console.log('[buildCombo] orderedSites:', orderedSites);
    drop.innerHTML =
      '<div style="padding:6px 6px 4px;position:relative"><input id="sadv-combo-search" placeholder="사이트 검색..."></div><div style="font-size:9px;font-weight:700;letter-spacing:1px;text-transform:uppercase;color:#3d5a78;padding:3px 9px 6px;border-bottom:1px solid #1a2d45;margin-bottom:3px">\uC804\uCCB4 ' +
      orderedSites.length +
      "\uAC1C · \uD074\uB9AD\uB9CE\uC740\uC21C</div>";
    orderedSites.forEach(function (s) {
      const col = SITE_COLORS_MAP[s] || C.muted,
        shortName = getSiteLabel(s),
        row = rowsMap[s],
        clickStr = row ? fmt(row.totalC) + "\uD074\uB9AD" : "—",
        clickCol = row ? C.green : C.muted;
      const item = document.createElement("div");
      item.className = "sadv-combo-item sadv-copt" + (s === curSite ? " active" : "");
      item.dataset.site = s;
      item.setAttribute("tabindex", "0");
      item.setAttribute("role", "option");
      item.setAttribute("aria-selected", s === curSite ? "true" : "false");
      item.innerHTML = `<div class="sadv-combo-item-dot" style="background:${col}"></div><div class="sadv-combo-item-info"><div class="sadv-combo-item-name">${escHtml(shortName.split("/")[0])}</div><div class="sadv-combo-item-url">${escHtml(shortName)}</div></div><div class="sadv-combo-item-click" style="color:${clickCol}">${escHtml(clickStr)}</div>`;
      item.addEventListener("click", function () {
        setComboSite(s);
        const wrap = document.getElementById("sadv-combo-wrap");
        if (wrap) {
          wrap.classList.remove("open");
          wrap.setAttribute("aria-expanded", "false");
        }
      });
      drop.appendChild(item);
    });
    console.log('[buildCombo] Built', orderedSites.length, 'combo items');
  }
  function setComboSite(site) {
    if (!site || !allSites.includes(site)) return;
    const sameSite = curSite === site;
    curSite = site;
    const col = SITE_COLORS_MAP[site] || C.muted,
      shortName = getSiteLabel(site);
    const comboDotEl = document.getElementById("sadv-combo-dot");
    const comboLabelEl = document.getElementById("sadv-combo-label");
    if (comboDotEl) comboDotEl.style.background = col;
    if (comboLabelEl) comboLabelEl.textContent = shortName;
    document.querySelectorAll(".sadv-combo-item[data-site]").forEach((el) => {
      const isActive = el.dataset.site === site;
      el.classList.toggle("active", isActive);
      el.setAttribute("aria-selected", isActive ? "true" : "false");
    });
    setCachedUiState();
    if (typeof notifySnapshotShellState === "function") notifySnapshotShellState();
    if (curMode === "site" && !sameSite) loadSiteView(site);
    __sadvNotify();
  }
  const comboWrapMain = document.getElementById("sadv-combo-wrap");
  if (comboWrapMain) {
    comboWrapMain.setAttribute("role", "combobox");
    comboWrapMain.setAttribute("aria-expanded", "false");
  }

  const comboBtn = document.getElementById("sadv-combo-btn");
  if (comboBtn) {
    comboBtn.addEventListener("click", function (e) {
      e.stopPropagation();
      const wrap = document.getElementById("sadv-combo-wrap");
      if (!wrap) return;
      wrap.classList.toggle("open");
      wrap.setAttribute("aria-expanded", wrap.classList.contains("open") ? "true" : "false");
      if (wrap.classList.contains("open")) {
        setTimeout(function () {
          const inp = document.getElementById("sadv-combo-search");
          if (inp) {
            inp.style.display = "block";
            inp.value = "";
            inp.focus();
            inp.oninput = function () {
              const q = inp.value.toLowerCase();
              document
                .querySelectorAll(".sadv-combo-item[data-site]")
                .forEach(function (el) {
                  el.style.display =
                    !q ||
                    (((el.dataset.site || "") + " " + getSiteLabel(el.dataset.site || "")).toLowerCase().includes(q))
                      ? "flex"
                      : "none";
                });
            };
          }
        }, 50);
      }
    });
  } else {
    console.warn("[UI Controls] #sadv-combo-btn not found during initialization");
  }
  document.addEventListener("click", function (e) {
    const wrap = document.getElementById("sadv-combo-wrap");
    if (wrap && !wrap.contains(e.target)) {
      wrap.classList.remove("open");
      wrap.setAttribute("aria-expanded", "false");
    }
  });
  const TABS = [
    { id: "overview", label: "개요", icon: ICONS.dashboard },
    { id: "daily", label: "일별", icon: ICONS.calendarDays },
    { id: "urls", label: "URL", icon: ICONS.urlLink },
    { id: "queries", label: "검색어", icon: ICONS.searchTab },
    { id: "indexed", label: "색인", icon: ICONS.database },
    { id: "crawl", label: "크롤", icon: ICONS.activity },
    { id: "backlink", label: "백링크", icon: ICONS.backLinkTab },
    { id: "pattern", label: "패턴", icon: ICONS.barChart },
    { id: "insight", label: "인사이트", icon: ICONS.lightbulb },
  ];
  if (tabsEl) {
    tabsEl.setAttribute("role", "tablist");
    tabsEl.innerHTML = TABS.map(
      (t) =>
        `<button class="sadv-t${t.id === curTab ? " on" : ""}" data-t="${t.id}" role="tab" aria-selected="${t.id === curTab ? "true" : "false"}" aria-controls="sadv-tabpanel" style="display:inline-flex;align-items:center;gap:5px">${t.icon}${t.label}</button>`,
    ).join("");
    tabsEl.addEventListener("click", function (e) {
      const t = e.target.closest("[data-t]");
      if (!t || t.dataset.t === curTab) return;
      curTab = t.dataset.t;
      tabsEl.querySelectorAll(".sadv-t").forEach((b) => {
        b.classList.remove("on");
        b.setAttribute("aria-selected", "false");
      });
      t.classList.add("on");
      t.setAttribute("aria-selected", "true");
      setCachedUiState();
      if (window.__sadvR) renderTab(window.__sadvR);
      __sadvNotify();
    });
  } else {
    console.warn("[UI Controls] #sadv-tabs not found during initialization");
  }
  function renderTab(R) {
    if (!bdEl || !R || typeof R[curTab] !== "function") return;
    bdEl.setAttribute("role", "tabpanel");
    bdEl.id = "sadv-tabpanel";
    bdEl.replaceChildren(R[curTab]());
    bdEl.scrollTop = 0;
  }
  if (modeBar) {
    modeBar.setAttribute("role", "tablist");
    modeBar.addEventListener("click", function (e) {
      const m = e.target.closest("[data-m]");
      if (!m) return;
      switchMode(m.dataset.m);
    });
  } else {
    console.warn("[UI Controls] #sadv-mode-bar not found during initialization");
  }
  function switchMode(mode) {
    if (mode === curMode) return;
    if (!modeBar || !siteBar || !tabsEl) {
      curMode = mode;
      console.warn("[UI Controls] Missing mode UI containers; switchMode skipped");
      setCachedUiState();
      if (typeof notifySnapshotShellState === "function") notifySnapshotShellState();
      __sadvNotify();
      return;
    }
    curMode = mode;
    modeBar
      .querySelectorAll(".sadv-mode")
      .forEach((b) => {
        b.classList.remove("on");
        b.setAttribute("aria-selected", "false");
      });
    const targetBtn = modeBar.querySelector(`[data-m="${mode}"]`);
    if (targetBtn) {
      targetBtn.classList.add("on");
      targetBtn.setAttribute("aria-selected", "true");
    }
    if (mode === "all") {
      siteBar.classList.remove("show");
      tabsEl.classList.remove("show");
      setAllSitesLabel();
      renderAllSites();
    } else {
      siteBar.classList.add("show");
      tabsEl.classList.add("show");
      ensureCurrentSite();
      if (curSite) loadSiteView(curSite);
    }
    setCachedUiState();
    if (typeof notifySnapshotShellState === "function") notifySnapshotShellState();
    __sadvNotify();
  }
  async function fetchExposeDataBatch(sites) {
    const results = [];
    for (let i = 0; i < sites.length; i += ALL_SITES_BATCH) {
      results.push(
        ...(await Promise.allSettled(
          sites.slice(i, i + ALL_SITES_BATCH).map((s) => fetchExposeData(s)),
        )),
      );
      if (i + ALL_SITES_BATCH < sites.length) {
        await new Promise(r => setTimeout(r, 150 + Math.floor(Math.random() * 100)));
      }
    }
    return results;
  }
  document
    .getElementById("sadv-refresh-btn")
    .addEventListener("click", async function () {
      const btn = this;
      const originalHTML = btn.innerHTML;
      btn.classList.add("spinning");
      btn.innerHTML = ICONS.refresh + ' 로딩 중...';
      try {
        await runFullRefreshPipeline({ trigger: "manual", button: btn });
      } finally {
        btn.classList.remove("spinning");
        btn.innerHTML = originalHTML;
      }
    });
  document
    .getElementById("sadv-save-btn")
    .addEventListener("click", function () {
      downloadSnapshot();
    });
  async function renderAllSites() {
    const requestId = ++allViewReqId;
    setAllSitesLabel();
    const loading = document.createElement("div");
    loading.style.cssText =
      "padding:32px 24px;color:#94a3b8;text-align:left;line-height:1.6";
    loading.innerHTML =
      '<div style="font-size:15px;font-weight:700;color:#f8fafc;margin-bottom:12px">\uc804\uccb4 \ud604\ud669\uc744 \uc900\ube44 \uc911\uc785\ub2c8\ub2e4</div>' +
      '<div id="sadv-all-progress-detail" style="font-size:12px;margin-bottom:16px">\uae30\ubcf8 \ub9ac\ud3ec\ud2b8\ub97c \ubd88\ub7ec\uc624\ub294 \uc911\uc785\ub2c8\ub2e4.</div>' +
      '<div style="height:8px;border-radius:999px;background:#1e293b;border:1px solid #334155;overflow:hidden;box-shadow:inset 0 1px 2px rgba(0,0,0,0.1)"><div id="sadv-all-progress-bar" style="width:6%;height:100%;background:linear-gradient(90deg,#0ea5e9,#10b981);transition:width 0.3s ease"></div></div>' +
      '<div id="sadv-all-progress-meta" style="font-size:11px;color:#64748b;margin-top:12px">\uba54\ud0c0 \uc9c4\ub2e8\uc740 2\uac1c\uc529 \ucc9c\ucc9c\ud788 \uc694\uccad\ud569\ub2c8\ub2e4.</div>';
    bdEl.innerHTML = "";
    bdEl.appendChild(loading);
    if (!allSites.length) {
      bdEl.innerHTML =
        `<div style="padding:40px 20px;text-align:center"><div style="display:inline-flex;align-items:center;justify-content:center;width:48px;height:48px;background:#0f172a;border:1px solid #334155;border-radius:12px;margin-bottom:16px;color:#64748b">${ICONS.refresh.replace('width="13" height="13"','width="22" height="22"')}</div><div style="color:#f8fafc;font-weight:700;font-size:14px;margin-bottom:8px">사이트 목록을 찾을 수 없어요</div><div style="color:#64748b;font-size:12px;line-height:1.8">새로고침 버튼을 눌러 다시 시도하거나<br>서치어드바이저 콘솔 페이지에서 실행해주세요</div></div>`;
      return;
    }
    const sitesToLoad = allSites;
    const siteDataBySite = {};
    const loadingDetail = loading.querySelector("#sadv-all-progress-detail");
    const loadingBar = loading.querySelector("#sadv-all-progress-bar");
    const loadingMeta = loading.querySelector("#sadv-all-progress-meta");
    let missingDiagnosisMetaCount = null;
    const setProgress = function (label, ratio, note) {
      if (requestId !== allViewReqId || curMode !== "all") return;
      if (ratio >= 0.55 && missingDiagnosisMetaCount === 0) return;
      if (loadingDetail) loadingDetail.textContent = label;
      if (loadingBar) loadingBar.style.width = Math.max(6, Math.round(ratio * 100)) + "%";
      if (loadingMeta && note) loadingMeta.textContent = note;
    };
    const exposeResults = [];
    for (let i = 0; i < sitesToLoad.length; i += ALL_SITES_BATCH) {
      const batchSites = sitesToLoad.slice(i, i + ALL_SITES_BATCH);
      setProgress(
        "\uae30\ubcf8 \ub9ac\ud3ec\ud2b8 " +
          Math.min(i + batchSites.length, sitesToLoad.length) +
          " / " +
          sitesToLoad.length,
        0.08 + (Math.min(i + batchSites.length, sitesToLoad.length) / sitesToLoad.length) * 0.42,
      );
      const batchResults = await Promise.allSettled(batchSites.map((site) => fetchExposeData(site)));
      if (requestId !== allViewReqId || curMode !== "all") return;
      batchResults.forEach(function (result, offset) {
        exposeResults[i + offset] = result;
        if (result.status === "fulfilled") {
          siteDataBySite[batchSites[offset]] = result.value;
        }
      });
    }
    const metaSitesToLoad = sitesToLoad.filter(function (site) {
      return !hasDiagnosisMetaSnapshot(siteDataBySite[site] || null);
    });
    missingDiagnosisMetaCount = metaSitesToLoad.length;
    const metaBatchSize = 2;
    let metaLoaded = 0;
    for (let i = 0; i < metaSitesToLoad.length; i += metaBatchSize) {
      const batchSites = metaSitesToLoad.slice(i, i + metaBatchSize);
      setProgress(
        "\uc0c9\uc778 \uc9c4\ub2e8 " + metaLoaded + " / " + metaSitesToLoad.length,
        0.55 + (metaLoaded / Math.max(1, metaSitesToLoad.length)) * 0.38,
        "\uba54\ud0c0 \uc9c4\ub2e8\uc740 2\uac1c\uc529 \ucc9c\ucc9c\ud788 \uc694\uccad\ud574 \ucc28\ub2e8 \uc704\ud5d8\uc744 \ub0ae\ucda5\ub2c8\ub2e4.",
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
    }
    setProgress("\ub80c\ub354\ub9c1 \uc911...", 0.97, null);
    const rows = sitesToLoad.map((site) => {
      const data = siteDataBySite[site] || null;
        return buildSiteSummaryRow(site, data);
    });
    rows.sort((a, b) => b.totalC - a.totalC);
    window.__sadvRows = rows;
    buildCombo(rows);
    const wrap = document.createElement("div");

    // 병합된 계정 정보 표시 (merged view인 경우)
    const mergedMeta = getMergedMetaState();
    if (isMergedReport() && mergedMeta && mergedMeta.accounts) {
      wrap.appendChild(createMergedAccountsInfo(mergedMeta));
    }

    const grandC = rows.reduce((a, r) => a + r.totalC, 0),
      grandE = rows.reduce((a, r) => a + r.totalE, 0),
      avgCtrAll = grandE ? (grandC / grandE) * 100 : 0;
    wrap.appendChild(
      kpiGrid([
        {
          label: "전체 클릭",
          value: (grandC / 10000).toFixed(1) + "만",
          sub: "90일 합계",
          color: C.green,
          icon: ICONS.click,
        },
        {
          label: "전체 노출",
          value: (grandE / 10000000).toFixed(1) + "천만",
          sub: "90일 합계",
          color: C.blue,
          icon: ICONS.eye,
        },
        {
          label: "평균 CTR",
          value: avgCtrAll.toFixed(2) + "%",
          sub: "90일 평균",
          color: C.amber,
          icon: ICONS.chart,
        },
        {
          label: "활성사이트",
          value: rows.filter((r) => r.totalC > 0).length + "개",
          color: C.teal,
          icon: ICONS.calendar,
        },
      ]),
    );
    wrap.appendChild(
      secTitle(
        "\ud074\ub9ad \ub7ad\ud0b9 TOP " +
          Math.min(rows.length, 30) +
          ' <span style="font-size:9px;font-weight:400;color:#3d5a78;letter-spacing:0">90\uc77c \ud569\uacc4</span>',
      ),
    );
    const top30 = rows.slice(0, 30);
    wrap.appendChild(
      chartCard(
        "TOP " + top30.length + " \ud074\ub9ad",
        "",
        C.green,
        barchart(
          top30.map((r) => r.totalC),
          top30.map((r) => r.site.replace(/^https?:\/\//, "")),
          80,
          C.green,
          "\ud68c",
        ),
        top30.map((_, i) => "#" + (i + 1)),
      ),
    );
    wrap.appendChild(secTitle("\uc0ac\uc774\ud2b8\ubcc4 \uc0c1\uc138"));
    rows.forEach(function (r, i) {
      const col = SITE_COLORS_MAP[r.site] || COLORS[i % COLORS.length];
      const card = document.createElement("div");
      card.className = "sadv-allcard";
      card.style.borderTop = `2px solid ${col}44`;
      const shortName = typeof getSiteLabel === "function" ? getSiteLabel(r.site) : r.site.replace(/^https?:\/\//, ""),
        trendCol = r.trend > 0 ? C.green : r.trend < 0 ? C.red : C.sub,
        trendIcon = r.trend > 0 ? ICONS.up : r.trend < 0 ? ICONS.down : "";
      const prevBadge =
        r.prevClickRatio != null
          ? `<span style="font-size:10px;color:${r.prevClickRatio >= 0 ? C.green : C.red};background:${r.prevClickRatio >= 0 ? C.green : C.red}15;padding:1px 6px;border-radius:10px;margin-left:4px">${r.prevClickRatio >= 0 ? "+" : ""}${r.prevClickRatio}%</span>`
          : "";
      const sourceBadge =
        r.sourceAccount && (typeof r.sourceAccount === "string" ? r.sourceAccount.trim() : "")
          ? `<span style="font-size:10px;color:#64748b;background:#1e293b;padding:2px 6px;border-radius:4px;margin-left:8px;white-space:nowrap;border:1px solid #334155" title="${escHtml(r.sourceAccount)}">${escHtml(r.sourceAccount.split("@")[0])}</span>`
          : "";
      card.innerHTML = `<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:12px"><div style="display:flex;align-items:center;gap:8px;min-width:0;flex-wrap:wrap"><div style="width:10px;height:10px;border-radius:50%;background:${col};flex-shrink:0;box-shadow:0 0 0 4px ${col}15"></div><span style="font-size:14px;font-weight:700;line-height:1.3;color:#f8fafc;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;max-width:240px">${escHtml(shortName)}</span>${prevBadge}${sourceBadge}</div><span style="opacity:0.8;color:${trendCol}">${trendIcon}</span></div><div style="display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:8px;margin-bottom:12px"><div style="text-align:center;min-width:0;background:rgba(30,41,59,0.3);padding:8px;border-radius:8px"><div style="font-size:15px;font-weight:800;line-height:1.1;color:${C.green}">${escHtml(fmt(r.totalC))}</div><div style="font-size:10px;line-height:1.4;color:#64748b;margin-top:4px">클릭</div></div><div style="text-align:center;min-width:0;background:rgba(30,41,59,0.3);padding:8px;border-radius:8px"><div style="font-size:15px;font-weight:800;line-height:1.1;color:${C.blue}">${escHtml((r.totalE / 10000).toFixed(1))}만</div><div style="font-size:10px;line-height:1.4;color:#64748b;margin-top:4px">노출</div></div><div style="text-align:center;min-width:0;background:rgba(30,41,59,0.3);padding:8px;border-radius:8px"><div style="font-size:15px;font-weight:800;line-height:1.1;color:${C.amber}">${escHtml(r.avgCtr)}%</div><div style="font-size:10px;line-height:1.4;color:#64748b;margin-top:4px">CTR</div></div></div>`;
      if (r.clicks && r.clicks.length > 1) {
        const miniDates = (r.logs || []).map((l) => fmtB(l.date));
        const mini = sparkline(r.clicks, miniDates, 36, col, "");
        mini.style.cssText += "opacity:0.9";
        card.appendChild(mini);
      }
      card.addEventListener("mouseenter", () => {
        card.style.borderColor = col + "88";
      });
      card.addEventListener("mouseleave", () => {
        card.style.borderColor = "#334155";
        card.style.borderTopColor = col + "44";
      });
      card.addEventListener("click", function () {
        curSite = r.site;
        switchMode("site");
      });
      wrap.appendChild(card);
    });
    bdEl.innerHTML = "";
    bdEl.appendChild(wrap);
    bdEl.scrollTop = 0;
  }
  renderAllSites = async function renderAllSitesPatched() {
    const requestId = ++allViewReqId;
    setAllSitesLabel();
    const loading = document.createElement("div");
    loading.style.cssText =
      "padding:24px 18px 20px;color:#7a9ab8;text-align:left;line-height:1.6";
    loading.innerHTML =
      '<div style="font-size:13px;font-weight:700;color:#d4ecff;margin-bottom:8px">\uC804\uCCB4 \uD604\uD669\uC744 \uC900\uBE44 \uC911\uC785\uB2C8\uB2E4</div>' +
      '<div id="sadv-all-progress-detail" style="font-size:11px;margin-bottom:10px">\uAE30\uBCF8 \uB9AC\uD3EC\uD2B8\uB97C \uBD88\uB7EC\uC624\uB294 \uC911\uC785\uB2C8\uB2E4.</div>' +
      '<div style="height:10px;border-radius:999px;background:#0d1829;border:1px solid #1a2d45;overflow:hidden"><div id="sadv-all-progress-bar" style="width:6%;height:100%;background:linear-gradient(90deg,#40c4ff,#00e676)"></div></div>' +
      '<div id="sadv-all-progress-meta" style="font-size:10px;color:#3d5a78;margin-top:8px">\uBA54\uD0C0 \uC9C4\uB2E8\uC740 2\uAC1C\uC529 \uCC9C\uCC9C\uD788 \uC694\uCCAD\uD569\uB2C8\uB2E4.</div>';
    bdEl.innerHTML = "";
    bdEl.appendChild(loading);
    if (!allSites.length) {
      bdEl.innerHTML =
        '<div style="padding:30px 20px;text-align:center"><div style="font-size:32px">\u21BB</div><div style="color:#ffca28;font-weight:700;margin:10px 0">\uC0AC\uC774\uD2B8 \uBAA9\uB85D\uC744 \uCC3E\uC744 \uC218 \uC5C6\uC5B4\uC694</div><div style="color:#7a9ab8;font-size:12px;line-height:2">\u21BB \uBC84\uD2BC\uC744 \uB20C\uB7EC \uC0C8\uB85C\uACE0\uCE68 \uD574\uBCF4\uC138\uC694<br>\uB610\uB294 \uC11C\uCE58\uC5B4\uB4DC\uBC14\uC774\uC800 \uCF58\uC194 \uD398\uC774\uC9C0\uC5D0\uC11C \uC2E4\uD589\uD574\uC8FC\uC138\uC694</div></div>';
      return;
    }
    const sitesToLoad = allSites;
    const siteDataBySite = {};
    const loadingDetail = loading.querySelector("#sadv-all-progress-detail");
    const loadingBar = loading.querySelector("#sadv-all-progress-bar");
    const loadingMeta = loading.querySelector("#sadv-all-progress-meta");
    let missingDiagnosisMetaCount = null;
    const setProgress = function (label, ratio, note) {
      if (requestId !== allViewReqId || curMode !== "all") return;
      if (ratio >= 0.55 && missingDiagnosisMetaCount === 0) return;
      if (loadingDetail) loadingDetail.textContent = label;
      if (loadingBar) loadingBar.style.width = Math.max(6, Math.round(ratio * 100)) + "%";
      if (loadingMeta && note) loadingMeta.textContent = note;
    };
    const exposeResults = [];
    for (let i = 0; i < sitesToLoad.length; i += ALL_SITES_BATCH) {
      const batchSites = sitesToLoad.slice(i, i + ALL_SITES_BATCH);
      setProgress(
        "\uAE30\uBCF8 \uB9AC\uD3EC\uD2B8 " +
          Math.min(i + batchSites.length, sitesToLoad.length) +
          " / " +
          sitesToLoad.length,
        0.08 + (Math.min(i + batchSites.length, sitesToLoad.length) / sitesToLoad.length) * 0.42,
      );
      const batchResults = await Promise.allSettled(batchSites.map((site) => fetchExposeData(site)));
      if (requestId !== allViewReqId || curMode !== "all") return;
      batchResults.forEach(function (result, offset) {
        exposeResults[i + offset] = result;
        if (result.status === "fulfilled") {
          siteDataBySite[batchSites[offset]] = result.value;
        }
      });
    }
    const metaSitesToLoad = sitesToLoad.filter(function (site) {
      return !hasDiagnosisMetaSnapshot(siteDataBySite[site] || null);
    });
    missingDiagnosisMetaCount = metaSitesToLoad.length;
    let metaLoaded = 0;
    for (let i = 0; i < metaSitesToLoad.length; i += 2) {
      const batchSites = metaSitesToLoad.slice(i, i + 2);
      setProgress(
        "\uC0C9\uC778 \uC9C4\uB2E8 " + metaLoaded + " / " + metaSitesToLoad.length,
        0.55 + (metaLoaded / Math.max(1, metaSitesToLoad.length)) * 0.38,
        "\uBA54\uD0C0 \uC9C4\uB2E8\uC740 2\uAC1C\uC529 \uCC9C\uCC9C\uD788 \uC694\uCCAD\uD574 \uCC28\uB2E8 \uC704\uD5D8\uC744 \uB0AE\uCDA5\uB2C8\uB2E4.",
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
        "\uC0C9\uC778 \uC9C4\uB2E8 " + metaLoaded + " / " + metaSitesToLoad.length,
        0.55 + (metaLoaded / Math.max(1, metaSitesToLoad.length)) * 0.38,
        "\uAC00\uC838\uC628 \uC0C9\uC778 \uC9C4\uB2E8 \uCE90\uC2DC\uB294 \uC0AC\uC774\uD2B8\uBCC4 \uD0ED\uC5D0\uC11C\uB3C4 \uADF8\uB300\uB85C \uC7AC\uC0AC\uC6A9\uD569\uB2C8\uB2E4.",
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
    wrap.appendChild(
      kpiGrid([
        { label: "\uC804\uCCB4 \uD074\uB9AD", value: (grandC / 10000).toFixed(1) + "\uB9CC", sub: "90\uC77C \uD569\uACC4", color: C.green },
        { label: "\uC804\uCCB4 \uB178\uCD9C", value: (grandE / 10000000).toFixed(1) + "\uCC9C\uB9CC", sub: "90\uC77C \uD569\uACC4", color: C.blue },
        { label: "\uD3C9\uADE0CTR", value: avgCtrAll.toFixed(2) + "%", sub: "90\uC77C \uD3C9\uADE0", color: C.amber },
        { label: "\uD65C\uC131\uC0AC\uC774\uD2B8", value: rows.filter((r) => r.totalC > 0).length + "\uAC1C", color: C.teal },
      ]),
    );
    wrap.appendChild(
      secTitle(
        "\uD074\uB9AD \uB7AD\uD0B9 TOP " +
          Math.min(rows.length, 30) +
          ' <span style="font-size:9px;font-weight:400;color:#3d5a78;letter-spacing:0">90\uC77C \uD569\uACC4</span>',
      ),
    );
    const top30 = rows.slice(0, 30);
    wrap.appendChild(
      chartCard(
        "TOP " + top30.length + " \uD074\uB9AD",
        "",
        C.green,
        barchart(
          top30.map((r) => r.totalC),
          top30.map((r) => r.site.replace(/^https?:\/\//, "")),
          80,
          C.green,
          "\uD68C",
        ),
        top30.map((_, i) => "#" + (i + 1)),
      ),
    );
    wrap.appendChild(secTitle("\uC0AC\uC774\uD2B8\uBCC4 \uC0C1\uC138"));
    rows.forEach(function (r, i) {
      const allCardColors = [C.green, C.blue, C.amber, C.teal, C.purple];
      const col = allCardColors[i % allCardColors.length];
      const card = document.createElement("div");
      card.className = "sadv-allcard";
      card.style.borderTop = "2px solid " + col + "44";
      const shortName = typeof getSiteLabel === "function" ? getSiteLabel(r.site) : r.site.replace(/^https?:\/\//, "");
      const sourceBadge =
        r.sourceAccount && (typeof r.sourceAccount === "string" ? r.sourceAccount.trim() : "")
          ? `<span style="font-size:10px;color:#64748b;background:#1e293b;padding:2px 6px;border-radius:4px;margin-left:8px;white-space:nowrap;border:1px solid #334155" title="${escHtml(r.sourceAccount)}">${escHtml(r.sourceAccount.split("@")[0])}</span>`
          : "";
      card.innerHTML =
        '<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:12px"><div style="display:flex;align-items:center;gap:8px;min-width:0"><div style="width:10px;height:10px;border-radius:50%;background:' +
        col +
        ';flex-shrink:0;box-shadow:0 0 0 4px ' +
        col +
        '15"></div><span style="font-size:14px;font-weight:700;line-height:1.3;color:#f8fafc;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;max-width:240px">' +
        escHtml(shortName) +
        '</span>' +
        sourceBadge +
        '</div></div><div style="display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:8px;margin-bottom:12px"><div style="text-align:center;min-width:0;background:rgba(30,41,59,0.3);padding:8px;border-radius:8px"><div style="font-size:15px;font-weight:800;line-height:1.1;color:' +
        C.green +
        '">' +
        escHtml(fmt(r.totalC)) +
        '</div><div style="font-size:10px;line-height:1.4;color:#64748b;margin-top:4px">클릭</div></div><div style="text-align:center;min-width:0;background:rgba(30,41,59,0.3);padding:8px;border-radius:8px"><div style="font-size:15px;font-weight:800;line-height:1.1;color:' +
        C.blue +
        '">' +
        escHtml((r.totalE / 10000).toFixed(1)) +
        '만</div><div style="font-size:10px;line-height:1.4;color:#64748b;margin-top:4px">노출</div></div><div style="text-align:center;min-width:0;background:rgba(30,41,59,0.3);padding:8px;border-radius:8px"><div style="font-size:15px;font-weight:800;line-height:1.1;color:' +
        C.amber +
        '">' +
        escHtml(r.avgCtr) +
        '%</div><div style="font-size:10px;line-height:1.4;color:#64748b;margin-top:4px">CTR</div></div></div>';
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
        indexBlock.innerHTML =
          '<div style="display:flex;justify-content:space-between;align-items:flex-start;gap:8px;margin-bottom:8px"><span style="font-size:11px;font-weight:700;color:#94a3b8">색인 추이</span><span style="font-size:13px;font-weight:800;color:' +
          col +
          '">' +
          fmt(r.diagnosisIndexedCurrent) +
          '건</span></div>';
        const indexMini = sparkline(r.diagnosisIndexedValues, r.diagnosisIndexedDates, 44, col, "건", { minValue: 0 });
        indexMini.style.cssText += "opacity:.9";
        indexBlock.appendChild(indexMini);
      } else {
        const metaCode = r.diagnosisMetaCode == null ? "-" : String(r.diagnosisMetaCode);
        const httpText = r.diagnosisMetaStatus == null ? "-" : String(r.diagnosisMetaStatus);
        indexBlock.innerHTML =
          '<div style="display:flex;justify-content:space-between;align-items:flex-start;gap:8px;margin-bottom:6px"><span style="font-size:11px;font-weight:700;color:#94a3b8">색인 추이</span><span style="font-size:12px;color:#64748b">응답 확인</span></div><div style="font-size:11px;line-height:1.5;color:#64748b">HTTP ' +
          httpText +
          " / code " +
          metaCode +
          "</div>";
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

    if (requestId !== allViewReqId || curMode !== "all") return;
    bdEl.replaceChildren(wrap);
    bdEl.scrollTop = 0;
  };
  async function loadSiteView(site) {
    if (!site) return;
    const requestId = ++siteViewReqId;
    labelEl.innerHTML = `<span>${escHtml(getSiteLabel(site))}</span>`;
    bdEl.innerHTML = `<div style="padding:50px 20px;text-align:center;color:#64748b"><div style="display:inline-flex;align-items:center;gap:8px">${ICONS.refresh.replace('width="13" height="13"','width="16" height="16"')} 로딩 중...</div></div>`;
    const d = await fetchSiteData(site);
    if (requestId !== siteViewReqId || site !== curSite) return;
    if (!d || !d.expose || !d.expose.items || !d.expose.items.length) {
      bdEl.innerHTML =
        `<div style="padding:40px 20px;text-align:center"><div style="display:inline-flex;align-items:center;justify-content:center;width:48px;height:48px;background:#0f172a;border:1px solid #334155;border-radius:12px;margin-bottom:16px;color:#ef4444">${ICONS.xMark.replace('width="14" height="14"','width="22" height="22"')}</div><div style="color:#f8fafc;font-weight:700;font-size:14px;margin-bottom:6px">데이터 없음</div><div style="color:#64748b;font-size:12px">이 사이트의 데이터가 없습니다</div></div>`;
      return;
    }
    const R = buildRenderers(d.expose, d.crawl, d.backlink, d.diagnosisMeta);
    window.__sadvR = R;
    renderTab(R);
    if (typeof notifySnapshotShellState === "function") notifySnapshotShellState();
  }
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
            sparkline(clicks, dates, 80, C.green, "회"),
            dates,
          ),
        );
        wrap.appendChild(
          chartCard(
            "일별 노출수",
            "최고 " + fmt(Math.max(...exposes)),
            C.blue,
            sparkline(exposes, dates, 65, C.blue, "회"),
            dates,
          ),
        );
        wrap.appendChild(
          chartCard(
            "일별 CTR",
            "평균 " + avgCtr + "%",
            C.amber,
            sparkline(ctrs, dates, 55, C.amber, "%"),
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
            sparkline(clicks, dates, 90, C.green, "회"),
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
              `<span style="display:inline-flex;vertical-align:text-bottom;margin-right:3px">${ICONS.dashboard}</span><b>최고 URL:</b> "${slug.replace(/-/g, " ").slice(0, 30)}…" CTR <b style="color:#f59e0b">${top.ctr}%</b> 클릭 <b style="color:#10b981">${fmt(top.clickCount)}회</b>`,
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
              ? `"${queries[0].key}" \ud0a4\uc6cc\ub4dc \ubcc0\ud615 \uae00 \ubc1c\ud589`
              : "\uAC80\uC0C9\uC5B4 \uB2E4\uC591\uD654\uB85C \uB835\uD14C\uC778 \uD2B8\uB799\uD53D \uD655\uBCF4",
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

  // Async initialization - wait for site list to load
  console.log('[Init] Starting async initialization...');
  (async function() {
    console.log('[Init] Inside async IIFE, calling loadSiteList...');
    await loadSiteList(false);
    injectDemoData(); // Inject mock data if on localhost
    assignColors();
    const cachedUiState = getCachedUiState();
    shouldBootstrapFullRefresh() && runFullRefreshPipeline({ trigger: "cache-expiry" });
    let bootMode = "all";
    let bootSite = null;
    // In demo mode, default to site mode with first demo site
    if (IS_DEMO_MODE && allSites.length > 0) {
      bootMode = "site";
      bootSite = allSites[0];
    }
    const curSiteMatch = location.search.match(/site=([^&]+)/);
    if (curSiteMatch) {
      const cur = decodeURIComponent(curSiteMatch[1]);
      if (allSites.includes(cur)) {
        bootSite = cur;
        bootMode = "site";
      }
    } else if (cachedUiState) {
      if (cachedUiState.site && allSites.includes(cachedUiState.site)) bootSite = cachedUiState.site;
      if (cachedUiState.mode === "site" && bootSite) bootMode = "site";
      if (cachedUiState.mode === "all") bootMode = "all";
      if (
        cachedUiState.tab &&
        TABS.some(function (tab) {
          return tab.id === cachedUiState.tab;
        })
      ) {
        curTab = cachedUiState.tab;
        if (tabsEl) {
          tabsEl.querySelectorAll(".sadv-t").forEach(function (btn) {
            btn.classList.toggle("on", btn.dataset.t === curTab);
          });
        }
      }
    }
    if (bootSite) curSite = bootSite;
    ensureCurrentSite();
    buildCombo(null);
    if (curSite) setComboSite(curSite);
    if (bootMode === "site" && curSite && modeBar && siteBar && tabsEl) {
      curMode = "site";
      modeBar.querySelectorAll(".sadv-mode").forEach((b) => b.classList.remove("on"));
      modeBar.querySelector('[data-m="site"]').classList.add("on");
      siteBar.classList.add("show");
      tabsEl.classList.add("show");
      loadSiteView(curSite);
    } else {
      if (bootMode === "site" && curSite && (!modeBar || !siteBar || !tabsEl)) {
        console.error("[Init] Site mode UI scaffold missing, falling back to all-sites view.");
      }
      setAllSitesLabel();
      renderAllSites();
    }
    setCachedUiState();
    __sadvMarkReady();
  })().catch((e) => {
    console.error('[Init Error]', e);
  });
