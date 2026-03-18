// Tooltip helper functions
let TIP = null;
function tip() {
  if (!TIP) {
    TIP = document.createElement("div");
    TIP.style.cssText =
      "position:fixed;background:rgba(15,23,42,0.9);backdrop-filter:blur(8px);border:1px solid #334155;border-radius:8px;padding:8px 12px;font-size:12px;color:#f8fafc;pointer-events:none;z-index:" + CONFIG.UI.Z_INDEX_TOOLTIP + ";display:none;white-space:nowrap;box-shadow:0 10px 15px -3px rgba(0,0,0,0.1);font-family:Pretendard,system-ui";
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
    (e.clientX + CONFIG.CHART.TOOLTIP_OFFSET.X + tw > window.innerWidth
      ? e.clientX - tw - 10
      : e.clientX + CONFIG.CHART.TOOLTIP_OFFSET.X) + "px";
  t.style.top = e.clientY - CONFIG.CHART.TOOLTIP_OFFSET.Y + "px";
}
function hideTip() {
  tip().style.display = "none";
}

// Sparkline chart function (SVG line chart)
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
  const pL = CONFIG.CHART.PADDING.LEFT,
    pR = CONFIG.CHART.PADDING.RIGHT,
    pT = CONFIG.CHART.PADDING.TOP,
    pB = CONFIG.CHART.PADDING.BOTTOM,
    mx = Math.max(...definedVals),
    mn = floorMin == null ? Math.min(...definedVals) : Math.min(floorMin, Math.min(...definedVals)),
    rng = mx - mn || 1;
  const showYAxisGuides = H >= CONFIG.CHART.MIN_HEIGHT;
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
              return Math.abs(entry.y - y) < CONFIG.CHART.Y_AXIS_COLLISION_THRESHOLD;
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

// Bar chart function
function barchart(vals, labels, H, col, unit) {
  unit = unit || "";
  if (!vals || !vals.length) return document.createElement("div");
  const W2 = CHART_W;
  const mx = Math.max(...vals) || 1,
    gap = CONFIG.CHART.BAR_GAP,
    bw = Math.max(CONFIG.CHART.MIN_BAR_WIDTH, (W2 - gap * (vals.length + 1)) / vals.length);
  const showYAxisGuides = H >= CONFIG.CHART.MIN_HEIGHT;
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
              return Math.abs(entry.y - y) < CONFIG.CHART.Y_AXIS_COLLISION_THRESHOLD;
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

// X-axis labels function
function xlbl(arr) {
  if (!arr || !arr.length) return "";
  const rankLike = arr.every(function (v) {
    return /^#\d+$/.test(v || "");
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

// Chart card wrapper function
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

// KPI grid function
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

// Section title function
function secTitle(t) {
  const d = document.createElement("div");
  d.style.cssText =
    "font-size:11px;font-weight:700;letter-spacing:0.05em;text-transform:uppercase;color:#64748b;margin:24px 0 12px;display:flex;align-items:center;gap:10px";
  d.innerHTML =
    escHtml(t) +
    ' <span style="flex:1;height:1px;background:#334155;display:inline-block;opacity:0.3"></span>';
  return d;
}

// Info box function
// Security Note: This function uses innerHTML for HTML content. All dynamic values in
// call sites MUST be escaped using escHtml(). Fixed: 08-renderers.js line 558 (slug value).
// When adding new ibox() calls with dynamic content, always use escHtml() for user/API data.
// P0-1: XSS 취약점 수정 - 개발 환경에서 보안 경고 추가
function ibox(type, html) {
  // 개발 환경에서 잠재적 XSS 위험 경고
  if (typeof window !== "undefined" &&
      typeof html === "string" &&
      html.includes("<") &&
      !html.includes("&lt;") &&
      // 이미 escape된 HTML인지 확인 (안전한 패턴)
      !/^(<span|<div|<b>|<strong>|<em>|<i>|<br|<hr|\/[a-z]+>|\s+)*$/i.test(html)) {
    console.warn("[SECURITY] ibox() 호출에 원시 HTML이 포함되어 있습니다. 동적 값에는 escHtml()를 사용하세요.");
    console.warn("[SECURITY] HTML 내용:", html.substring(0, 100));
    console.trace("[SECURITY] 호출 스택:");
  }

  const col =
    { green: C.green, amber: C.amber, red: C.red, blue: C.blue }[type] ||
      C.blue;
  const d = document.createElement("div");
  d.style.cssText = `border-left:3px solid ${col};background:${col}0d;border-radius:12px;padding:16px;margin-bottom:12px;font-size:12px;line-height:1.6;color:#94a3b8;border:1px solid ${col}22`;
  d.innerHTML = html; // SECURITY WARNING: Ensure html parameter is sanitized before use
  return d;
}

// CTR badge function
function ctrBadge(v) {
  const n = parseFloat(v);
  if (isNaN(n)) {
    return '<span style="display:inline-block;background:#1e293b;border:1px solid #334155;color:#64748b;font-size:10px;font-weight:700;padding:1px 6px;border-radius:20px">-</span>';
  }
  const col = n >= 3 ? C.green : n >= 1.5 ? C.amber : C.blue;
  return `<span style="display:inline-block;background:${col}18;border:1px solid ${col}44;color:${col};font-size:10px;font-weight:700;padding:1px 6px;border-radius:20px">${n.toFixed(2)}%</span>`;
}

// Horizontal bar function
function hbar(v, mx, col) {
  const pct = mx ? Math.round((v / mx) * 100) : 0;
  return `<div style="height:6px;background:#1e293b;border-radius:3px;margin:8px 0 10px;overflow:hidden"><div style="width:${pct}%;height:100%;background:${col};border-radius:3px;transition:width 0.5s ease-out"></div></div>`;
}

// Statistics function (mean, std, cv, slope, outliers)
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

// Pearson correlation coefficient function
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

// HTML escape function (must be defined before functions that use it)
function escHtml(v) {
  return String(v || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;")
    .replace(/\//g, "&#x2F;");
}

// ============================================================
// V2 PAYLOAD HELPER FUNCTIONS - FINAL VERSION
// ============================================================
// Integration Point: After line 485 (after escHtml function)
// Dependencies: Uses P, PAYLOAD_SCHEMA, PAYLOAD_FIELDS from 00-constants.js
// Strategy: Big Bang Migration (v1 legacy removed)
// ============================================================

// ============================================================
// CACHE IMPLEMENTATION (Map + TTL 5 minutes)
// ============================================================

const V2_CACHE_TTL_MS = 5 * 60 * 1000; // 5 minutes
const v2Cache = new Map();

/**
 * Create cache entry with timestamp
 * @private
 */
function createV2CacheEntry(value) {
  return {
    value,
    expiresAt: Date.now() + V2_CACHE_TTL_MS
  };
}

/**
 * Get cached value if not expired
 * @private
 */
function getV2Cached(key) {
  const entry = v2Cache.get(key);
  if (!entry) return null;

  if (Date.now() > entry.expiresAt) {
    v2Cache.delete(key);
    return null;
  }

  return entry.value;
}

/**
 * Set cached value with TTL
 * @private
 */
function setV2Cached(key, value) {
  v2Cache.set(key, createV2CacheEntry(value));

  // Prevent unbounded growth: clean old entries periodically
  if (v2Cache.size > 100) {
    const now = Date.now();
    for (const [k, v] of v2Cache.entries()) {
      if (now > v.expiresAt) {
        v2Cache.delete(k);
      }
    }
  }
}

/**
 * Clear all V2 cache entries
 * @public
 */
function clearV2Cache() {
  v2Cache.clear();
}

// ============================================================
// URL NORMALIZATION (Extracted to reduce duplication)
// ============================================================

/**
 * Normalize site URL to canonical form
 * Removes trailing slashes, ensures https:// prefix
 * @param {string} url - Site URL
 * @returns {string} Normalized URL
 */
function normalizeSiteUrl(url) {
  if (!url || typeof url !== 'string') return '';

  let normalized = url.trim().toLowerCase();

  // Remove trailing slashes
  normalized = normalized.replace(/\/+$/, '');

  // Ensure protocol
  if (!normalized.startsWith('http://') && !normalized.startsWith('https://')) {
    normalized = 'https://' + normalized;
  }

  return normalized;
}

// ============================================================
// V2 PAYLOAD DETECTION & VALIDATION
// ============================================================

/**
 * Check if payload is V2 format
 * Uses P constants from 00-constants.js for field names
 * @param {Object} payload - Payload object to check
 * @returns {boolean} True if V2 payload
 */
function isV2Payload(payload) {
  if (!payload || typeof payload !== 'object') return false;

  // Check for __meta field (V2 marker)
  const meta = payload[P.ROOT.META] || payload.__meta;
  if (!meta || typeof meta !== 'object') return false;

  // Check version (use P constant or fallback)
  const version = meta[PAYLOAD_FIELDS.VERSION] || meta.version;
  return version === PAYLOAD_V2.VERSION;
}

/**
 * Validate V2 payload structure
 * @param {Object} payload - Payload to validate
 * @returns {Object} Validation result {valid, errors}
 */
function validateV2Payload(payload) {
  const errors = [];

  if (!payload || typeof payload !== 'object') {
    errors.push('Payload must be an object');
    return { valid: false, errors };
  }

  // Check required root fields
  const meta = payload[PAYLOAD_FIELDS.META] || payload.__meta;
  if (!meta) errors.push('Missing __meta field');

  const accounts = payload[PAYLOAD_FIELDS.ACCOUNTS] || payload.accounts;
  if (!accounts || typeof accounts !== 'object') {
    errors.push('Missing or invalid accounts field');
  }

  const ui = payload[PAYLOAD_FIELDS.UI] || payload.ui;
  if (!ui || typeof ui !== 'object') {
    errors.push('Missing or invalid ui field');
  }

  return {
    valid: errors.length === 0,
    errors
  };
}

// ============================================================
// ACCOUNT OPERATIONS
// ============================================================

/**
 * Get account count from payload
 * @param {Object} payload - V2 payload
 * @returns {number} Account count (0 if invalid)
 */
function getAccountCount(payload) {
  if (!payload) return 0;

  const meta = payload[PAYLOAD_FIELDS.META] || payload.__meta;
  if (meta) {
    return meta[PAYLOAD_FIELDS.ACCOUNT_COUNT] || meta.accountCount || 0;
  }

  // Fallback: count actual accounts
  const accounts = payload[PAYLOAD_FIELDS.ACCOUNTS] || payload.accounts;
  if (accounts && typeof accounts === 'object') {
    return Object.keys(accounts).length;
  }

  return 0;
}

/**
 * Get all account emails from payload
 * @param {Object} payload - V2 payload
 * @returns {string[]} Array of email addresses
 */
function getAccountEmails(payload) {
  if (!payload) return [];

  const accounts = payload[PAYLOAD_FIELDS.ACCOUNTS] || payload.accounts;
  if (!accounts || typeof accounts !== 'object') return [];

  return Object.keys(accounts);
}

/**
 * Get specific account data by email
 * @param {Object} payload - V2 payload
 * @param {string} email - Account email
 * @returns {Object|null} Account object or null
 */
function getAccountByEmail(payload, email) {
  if (!payload || !email) return null;

  const accounts = payload[PAYLOAD_FIELDS.ACCOUNTS] || payload.accounts;
  if (!accounts || typeof accounts !== 'object') return null;

  return accounts[email] || null;
}

// ============================================================
// SITE OPERATIONS (O(1) optimized with index)
// ============================================================

/**
 * Build site-to-account index for O(1) lookups
 * Cached for 5 minutes to avoid rebuilding
 * @private
 */
function buildSiteToAccountIndex(payload) {
  const cacheKey = 'siteIndex_' + (payload?.__meta?.savedAt || 'unknown');
  let index = getV2Cached(cacheKey);

  if (index) return index;

  index = new Map();

  const accounts = payload[PAYLOAD_FIELDS.ACCOUNTS] || payload.accounts;
  if (!accounts || typeof accounts !== 'object') {
    setV2Cached(cacheKey, index);
    return index;
  }

  for (const [email, account] of Object.entries(accounts)) {
    const sites = account[PAYLOAD_FIELDS.SITES] || account.sites || [];
    for (const site of sites) {
      const normalized = normalizeSiteUrl(site);
      if (normalized) {
        index.set(normalized, email);
      }
    }
  }

  setV2Cached(cacheKey, index);
  return index;
}

/**
 * Get all unique sites from all accounts (deduplicated, sorted)
 * @param {Object} payload - V2 payload
 * @returns {string[]} Sorted array of unique site URLs
 */
function getAllSites(payload) {
  if (!payload) return [];

  const cacheKey = 'allSites_' + (payload?.__meta?.savedAt || 'unknown');
  let cached = getV2Cached(cacheKey);
  if (cached) return cached;

  const sites = new Set();

  const accounts = payload[PAYLOAD_FIELDS.ACCOUNTS] || payload.accounts;
  if (!accounts || typeof accounts !== 'object') {
    return [];
  }

  for (const account of Object.values(accounts)) {
    const accountSites = account[PAYLOAD_FIELDS.SITES] || account.sites || [];
    for (const site of accountSites) {
      const normalized = normalizeSiteUrl(site);
      if (normalized) {
        sites.add(normalized);
      }
    }
  }

  const result = Array.from(sites).sort();
  setV2Cached(cacheKey, result);
  return result;
}

/**
 * Find account email that owns a specific site
 * Uses index for O(1) lookup instead of O(n) iteration
 * @param {string} siteUrl - Site URL to find
 * @param {Object} payload - V2 payload
 * @returns {string|null} Account email or null
 */
function getAccountForSite(siteUrl, payload) {
  if (!payload || !siteUrl) return null;

  const normalized = normalizeSiteUrl(siteUrl);
  if (!normalized) return null;

  const index = buildSiteToAccountIndex(payload);
  return index.get(normalized) || null;
}

/**
 * Check if a site exists in the payload
 * @param {string} siteUrl - Site URL to check
 * @param {Object} payload - V2 payload
 * @returns {boolean} True if site exists
 */
function hasSite(siteUrl, payload) {
  return getAccountForSite(siteUrl, payload) !== null;
}

// ============================================================
// SITE DATA OPERATIONS
// ============================================================

/**
 * Get data for a specific site
 * @param {string} siteUrl - Site URL
 * @param {Object} payload - V2 payload
 * @returns {Object|null} Site data object or null
 */
function getSiteData(siteUrl, payload) {
  if (!payload || !siteUrl) return null;

  const email = getAccountForSite(siteUrl, payload);
  if (!email) return null;

  const account = getAccountByEmail(payload, email);
  if (!account) return null;

  const normalized = normalizeSiteUrl(siteUrl);
  const dataBySite = account[PAYLOAD_FIELDS.DATA_BY_SITE] || account.dataBySite;

  return dataBySite?.[normalized] || null;
}

/**
 * Get metadata for a specific site
 * @param {string} siteUrl - Site URL
 * @param {Object} payload - V2 payload
 * @returns {Object|null} Site metadata or null
 */
function getSiteMeta(siteUrl, payload) {
  if (!payload || !siteUrl) return null;

  const email = getAccountForSite(siteUrl, payload);
  if (!email) return null;

  const account = getAccountByEmail(payload, email);
  if (!account) return null;

  const normalized = normalizeSiteUrl(siteUrl);
  const siteMeta = account[PAYLOAD_FIELDS.SITE_META] || account.siteMeta;

  return siteMeta?.[normalized] || null;
}

/**
 * Get site label (display name)
 * @param {string} siteUrl - Site URL
 * @param {Object} payload - V2 payload
 * @returns {string} Label or URL fallback
 */
function getSiteLabel(siteUrl, payload) {
  const meta = getSiteMeta(siteUrl, payload);
  if (meta) {
    return meta[PAYLOAD_FIELDS.LABEL] || meta.label || siteUrl;
  }
  return siteUrl || '';
}

// ============================================================
// UI STATE OPERATIONS
// ============================================================

/**
 * Get current UI state from payload
 * @param {Object} payload - V2 payload
 * @returns {Object} {curMode, curSite, curTab}
 */
function getUIState(payload) {
  if (!payload) {
    return {
      curMode: P.DEFAULTS.MODE,
      curSite: P.DEFAULTS.CUR_SITE,
      curTab: P.DEFAULTS.CUR_TAB
    };
  }

  const ui = payload[PAYLOAD_FIELDS.UI] || payload.ui || {};

  return {
    curMode: ui[PAYLOAD_FIELDS.CUR_MODE] || ui.curMode || P.DEFAULTS.MODE,
    curSite: ui[PAYLOAD_FIELDS.CUR_SITE] || ui.curSite || P.DEFAULTS.CUR_SITE,
    curTab: ui[PAYLOAD_FIELDS.CUR_TAB] || ui.curTab || P.DEFAULTS.CUR_TAB
  };
}

/**
 * Set UI state in payload
 * @param {Object} payload - V2 payload (modified in place)
 * @param {Object} state - {curMode, curSite, curTab}
 * @returns {Object} Modified payload
 */
function setUIState(payload, state) {
  if (!payload || !state) return payload;

  if (!payload.ui) payload.ui = {};
  const ui = payload.ui;

  if (state.curMode !== undefined) ui.curMode = state.curMode;
  if (state.curSite !== undefined) ui.curSite = state.curSite;
  if (state.curTab !== undefined) ui.curTab = state.curTab;

  return payload;
}

// ============================================================
// STATS & SUMMARY OPERATIONS
// ============================================================

/**
 * Get stats from payload
 * @param {Object} payload - V2 payload
 * @returns {Object} {success, partial, failed, errors}
 */
function getStats(payload) {
  if (!payload) {
    return { success: 0, partial: 0, failed: 0, errors: [] };
  }

  const stats = payload.stats || {};
  return {
    success: stats.success || 0,
    partial: stats.partial || 0,
    failed: stats.failed || 0,
    errors: Array.isArray(stats.errors) ? stats.errors : []
  };
}

/**
 * Get summary data (for merged reports)
 * @param {Object} payload - V2 payload
 * @returns {Object|null} Summary object or null
 */
function getSummary(payload) {
  if (!payload) return null;
  return payload[PAYLOAD_FIELDS.SUMMARY] || payload._summary || null;
}

/**
 * Get site ownership map (for conflict resolution)
 * @param {Object} payload - V2 payload
 * @returns {Object} Map of site -> [emails]
 */
function getSiteOwnership(payload) {
  const summary = getSummary(payload);
  if (!summary) return {};

  return summary.siteOwnership || {};
}

// ============================================================
// MIGRATION HELPERS (Big Bang - no v1 support)
// ============================================================

/**
 * Create empty V2 payload structure
 * @param {string} email - Account email
 * @param {string} encId - Encrypted ID
 * @returns {Object} Empty V2 payload
 */
function createEmptyV2Payload(email, encId) {
  return {
    __meta: {
      version: PAYLOAD_V2.VERSION,
      savedAt: new Date().toISOString(),
      accountCount: 1
    },
    accounts: {
      [email]: {
        encId: encId || 'unknown',
        sites: [],
        siteMeta: {},
        dataBySite: {}
      }
    },
    ui: {
      curMode: P.DEFAULTS.MODE,
      curSite: P.DEFAULTS.CUR_SITE,
      curTab: P.DEFAULTS.CUR_TAB
    },
    stats: {
      success: 0,
      partial: 0,
      failed: 0,
      errors: []
    }
  };
}

/**
 * Clone V2 payload (deep copy)
 * @param {Object} payload - V2 payload
 * @returns {Object} Cloned payload
 */
function cloneV2Payload(payload) {
  if (!payload) return null;

  try {
    return JSON.parse(JSON.stringify(payload));
  } catch (e) {
    console.error('[cloneV2Payload] Failed to clone:', e);
    return null;
  }
}

// ============================================================
// END OF V2 HELPER FUNCTIONS
// ============================================================
