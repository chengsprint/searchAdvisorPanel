// ============================================================
// P0 SECURITY: DOMPurify Integration for XSS Prevention
// ============================================================

const SANITIZE_DEFAULT_ALLOWED_TAGS = [
  'div', 'span', 'p', 'a', 'strong', 'em', 'i', 'b',
  'br', 'hr', 'ul', 'ol', 'li', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
  'table', 'thead', 'tbody', 'tr', 'td', 'th',
  'button', 'input',
  'svg', 'path', 'line', 'circle', 'rect', 'ellipse', 'polyline', 'polygon', 'defs', 'linearGradient',
  'text', 'g', 'stop', 'style'
];

const SANITIZE_DEFAULT_ALLOWED_ATTR = [
  'class', 'style', 'href', 'id', 'title',
  'type', 'placeholder', 'value', 'disabled', 'tabindex', 'role',
  'name', 'autocomplete', 'target', 'rel',
  'width', 'height', 'viewBox', 'preserveAspectRatio', 'cx', 'cy',
  'r', 'x', 'x1', 'x2', 'y', 'y1', 'y2', 'fill', 'stroke',
  'stroke-width', 'stroke-dasharray', 'opacity', 'stop-color',
  'stop-opacity', 'offset', 'd', 'points', 'xmlns', 'text-anchor', 'dominant-baseline',
  'font-size', 'font-weight', 'letter-spacing', 'paint-order',
  'stroke-linejoin', 'stroke-linecap', 'rx', 'ry', 'transform',
  'color', 'background', 'border', 'padding', 'margin', 'display',
  'align-items', 'justify-content', 'gap', 'flex', 'grid',
  'border-radius', 'box-shadow', 'transition', 'white-space',
  'overflow', 'text-overflow', 'line-height', 'visibility',
  'word-break', 'text-align', 'vertical-align', 'position',
  'top', 'left', 'right', 'bottom', 'z-index', 'cursor',
  'pointer-events', 'backdrop-filter', 'max-width', 'min-width',
  'min-height', 'max-height', 'transform-origin', 'filter'
];

const SANITIZE_DEFAULT_FORBID_TAGS = ['script', 'object', 'embed', 'iframe', 'form'];
const SANITIZE_DEFAULT_FORBID_ATTR = ['onerror', 'onload', 'onclick', 'onmouseover', 'onfocus', 'onblur'];

function isAllowedSanitizeAttr(attrName, allowedAttrs) {
  return (
    allowedAttrs.includes(attrName) ||
    attrName.startsWith('data-') ||
    attrName.startsWith('aria-')
  );
}

function isSafeSanitizeUrl(value) {
  const normalized = String(value || '').trim().replace(/[\u0000-\u001F\u007F\s]+/g, '').toLowerCase();
  if (!normalized) return true;
  return !(
    normalized.startsWith('javascript:') ||
    normalized.startsWith('vbscript:') ||
    normalized.startsWith('data:text/html') ||
    normalized.startsWith('data:text/javascript')
  );
}

function sanitizeInlineStyle(styleValue) {
  return String(styleValue || '')
    .replace(/expression\s*\([^)]*\)/gi, '')
    .replace(/url\s*\(\s*(['"]?)\s*javascript:[^)]*\)/gi, '')
    .replace(/-moz-binding\s*:[^;]+;?/gi, '')
    .replace(/behavior\s*:[^;]+;?/gi, '');
}

function fallbackSanitizeHTML(dirty, options = {}) {
  if (typeof document === 'undefined') {
    return String(dirty || '')
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");
  }

  const allowedTags = new Set((options.ALLOWED_TAGS || SANITIZE_DEFAULT_ALLOWED_TAGS).map((tag) => String(tag).toLowerCase()));
  const allowedAttrs = (options.ALLOWED_ATTR || SANITIZE_DEFAULT_ALLOWED_ATTR).map((attr) => String(attr).toLowerCase());
  const forbidTags = new Set((options.FORBID_TAGS || SANITIZE_DEFAULT_FORBID_TAGS).map((tag) => String(tag).toLowerCase()));
  const forbidAttrs = (options.FORBID_ATTR || SANITIZE_DEFAULT_FORBID_ATTR).map((attr) => String(attr).toLowerCase());
  const template = document.createElement('template');
  template.innerHTML = String(dirty || '');

  function unwrapNode(node) {
    const parent = node.parentNode;
    if (!parent) return;
    while (node.firstChild) {
      parent.insertBefore(node.firstChild, node);
    }
    parent.removeChild(node);
  }

  function walk(node) {
    if (!node) return;

    if (node.nodeType === Node.ELEMENT_NODE) {
      const tag = node.tagName.toLowerCase();
      if (forbidTags.has(tag)) {
        node.remove();
        return;
      }
      if (!allowedTags.has(tag)) {
        unwrapNode(node);
        return;
      }

      Array.from(node.attributes).forEach((attr) => {
        const name = attr.name.toLowerCase();
        const value = attr.value;

        if (
          forbidAttrs.includes(name) ||
          name.startsWith('on') ||
          !isAllowedSanitizeAttr(name, allowedAttrs)
        ) {
          node.removeAttribute(attr.name);
          return;
        }

        if ((name === 'href' || name === 'src' || name === 'xlink:href') && !isSafeSanitizeUrl(value)) {
          node.removeAttribute(attr.name);
          return;
        }

        if (name === 'style') {
          const sanitizedStyle = sanitizeInlineStyle(value);
          if (sanitizedStyle) {
            node.setAttribute('style', sanitizedStyle);
          } else {
            node.removeAttribute('style');
          }
        }
      });
    }

    Array.from(node.childNodes).forEach(walk);
  }

  Array.from(template.content.childNodes).forEach(walk);
  return template.innerHTML;
}

// ============================================================
// Shared boot request helpers
// ============================================================
// Boot request는 snapshot 전용이 아니라 live app boot 단계 전체가 공유하는 계약이다.
// 특히 background download는
// - 02-dom-init.js: 패널 first-frame 비노출
// - 14-init.js: 준비 완료 직후 background save 자동 실행
// - 12-snapshot.js: cleanup / gate 판정
// 에서 함께 쓰므로 공통 helper로 둔다.
function getSearchAdvisorBootRequest() {
  if (typeof window === "undefined") return null;
  const request = window[SEARCHADVISOR_BOOT.REQUEST_WINDOW_KEY];
  return request && typeof request === "object" ? request : null;
}

function isSearchAdvisorBackgroundDownloadBootRequest(request) {
  return !!(
    request &&
    request.action === SEARCHADVISOR_BOOT.ACTIONS.BACKGROUND_DOWNLOAD
  );
}

function clearSearchAdvisorBootRequest() {
  if (typeof window === "undefined") return;
  delete window[SEARCHADVISOR_BOOT.REQUEST_WINDOW_KEY];
}

/**
 * DOMPurify sanitizer for HTML content
 * Prevents XSS attacks by sanitizing HTML before injection
 * @param {string} dirty - Untrusted HTML string
 * @param {Object} options - DOMPurify configuration options
 * @returns {string} Sanitized HTML safe for innerHTML use
 */
function sanitizeHTML(dirty, options = {}) {
  // Check if DOMPurify is available
  if (typeof DOMPurify !== 'undefined' && DOMPurify.sanitize) {
    const defaultOptions = {
      ALLOWED_TAGS: SANITIZE_DEFAULT_ALLOWED_TAGS,
      ALLOWED_ATTR: SANITIZE_DEFAULT_ALLOWED_ATTR,
      ALLOW_ARIA_ATTR: true,
      ALLOW_DATA_ATTR: true,
      SAFE_FOR_TEMPLATES: true,
      FORBID_TAGS: SANITIZE_DEFAULT_FORBID_TAGS,
      FORBID_ATTR: SANITIZE_DEFAULT_FORBID_ATTR
    };

    const mergedOptions = { ...defaultOptions, ...options };
    return DOMPurify.sanitize(dirty, mergedOptions);
  }

  // Fallback: if DOMPurify is not available, use built-in sanitizer
  if (typeof window !== 'undefined') {
    if (!window.__sadvFallbackSanitizeWarned) {
      console.warn('[SECURITY] DOMPurify not available. Using built-in fallback sanitizer.');
      console.warn('[SECURITY] Please ensure DOMPurify is loaded before this script.');
      window.__sadvFallbackSanitizeWarned = true;
    }
  }

  return fallbackSanitizeHTML(dirty, options);
}

// Internal SVG fragments are generated only from trusted code paths and
// already escape dynamic values with escHtml(). Using sanitizeHTML() on raw
// SVG fragments in HTML context can strip chart primitives (path/line/circle),
// so we assign them directly to the SVG namespace host.
function setTrustedSvgMarkup(svgEl, markup) {
  if (!svgEl) return;
  svgEl.innerHTML = String(markup || "");
}

// ============================================================
// Tooltip helper functions
// ============================================================

let TIP = null;
function tip() {
  if (!TIP) {
    TIP = document.createElement("div");
    TIP.style.cssText =
      "position:fixed;background:rgba(13,13,15,0.94);backdrop-filter:blur(8px);border:1px solid var(--sadv-border-subtle,#2b2200);padding:8px 12px;font-size:12px;color:var(--sadv-text,#fffdf5);pointer-events:none;z-index:" + CONFIG.UI.Z_INDEX_TOOLTIP + ";display:none;white-space:nowrap;box-shadow:0 10px 20px rgba(0,0,0,0.28);font-family:Pretendard,system-ui";
    document.body.appendChild(TIP);
  }
  return TIP;
}
function showTip(e, h) {
  const t = tip();
  t.innerHTML = sanitizeHTML(h);
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
  setTrustedSvgMarkup(
    svg,
    '<defs><linearGradient id="' +
      uid +
      '" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="' +
      escHtml(col) +
      '" stop-opacity="0.22"/><stop offset="100%" stop-color="' +
      escHtml(col) +
      '" stop-opacity="0.01"/></linearGradient></defs>' +
      guideMarkup +
      '<path d="' +
      escHtml(area) +
      '" fill="url(#' +
      escHtml(uid) +
      ')"/><path d="' +
      escHtml(path) +
      '" fill="none" stroke="' +
      escHtml(col) +
      '" stroke-width="1.6" stroke-linejoin="round" stroke-linecap="round"/><line id="' +
      escHtml(wid) +
      '" x1="0" y1="0" x2="0" y2="' +
      escHtml(H) +
      '" stroke="#3d5a78" stroke-width="1" stroke-dasharray="3,2" opacity="0"/><circle id="' +
      escHtml(cid) +
      '" cx="0" cy="0" r="3.5" fill="' +
      escHtml(col) +
      '" stroke="#060b14" stroke-width="1.5" opacity="0"/>'
  );

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
      '<span style="color:var(--sadv-text-tertiary,#b9a55a);font-size:10px">' +
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
  setTrustedSvgMarkup(
    svg,
    `<defs><linearGradient id="${escHtml(uid)}" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="${escHtml(col)}" stop-opacity="0.9"/><stop offset="100%" stop-color="${escHtml(col)}" stop-opacity="0.35"/></linearGradient></defs>${guideMarkup}`
  );
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
    rect.setAttribute("fill", isBest ? col : "url(#" + uid + ")");
    rect.setAttribute("opacity", isBest ? "1" : "0.7");
    rect.addEventListener("mouseenter", function (e) {
      rect.setAttribute("opacity", "1");
      showTip(
        e,
        `<span style="color:var(--sadv-text-tertiary,#b9a55a);font-size:10px">${escHtml((labels && labels[i]) || "")}</span><br><b style="color:${col}">${fmt(v)}${unit}</b>`,
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
      return `<span style="font-size:9px;color:var(--sadv-text-tertiary,#b9a55a)">${escHtml(label || "")}</span>`;
    })
    .join("")}</div>`;
}

// Chart card wrapper function
function chartCard(title, valueStr, valueCol, svgEl, labelsArr) {
  const wrap = document.createElement("div");
  wrap.style.cssText =
    "background:var(--sadv-layer-01,#262626);border:1px solid var(--sadv-border-subtle,#393939);border-radius:" + T.radiusNone + ";padding:" + T.spaceCard + " " + T.spaceCard + " 14px;margin-bottom:" + T.spaceCard + ";overflow:hidden;box-shadow:" + T.shadowCardStrong;
  const hd = document.createElement("div");
  hd.style.cssText =
    "display:flex;justify-content:space-between;align-items:flex-start;gap:12px;margin-bottom:14px";
  hd.innerHTML = sanitizeHTML(`<span style="font-size:12px;line-height:1.4;color:var(--sadv-text-secondary,#c6c6c6);font-weight:600;letter-spacing:0.01em">${escHtml(title)}</span><span style="font-size:15px;line-height:1.2;font-weight:700;color:${valueCol};text-align:right;letter-spacing:-0.01em">${escHtml(valueStr)}</span>`);
  wrap.appendChild(hd);
  wrap.appendChild(svgEl);
  if (labelsArr) {
    const lbl = document.createElement("div");
    lbl.innerHTML = sanitizeHTML(xlbl(labelsArr));
    wrap.appendChild(lbl);
  }
  return wrap;
}

// KPI grid function
function kpiGrid(items) {
  const g = document.createElement("div");
  const panelWidth =
    typeof document !== "undefined" && document.getElementById("sadv-p")
      ? document.getElementById("sadv-p").getBoundingClientRect().width
      : 0;
  const effectiveWidth =
    panelWidth > 0
      ? panelWidth
      : (typeof window !== "undefined" ? window.innerWidth : 0);
  // window 폭만 보면 desktop narrow 상태를 놓칠 수 있다.
  // KPI grid는 "실제 패널이 얼마나 좁은가"를 기준으로 열 수를 줄여야
  // 카드 숫자가 박스를 뚫고 나오는 회귀를 막을 수 있다.
  const isCompactViewport = effectiveWidth > 0 && effectiveWidth <= 560;
  const isUltraNarrow = effectiveWidth > 0 && effectiveWidth <= 430;
  const columns = isCompactViewport ? Math.min(items.length, 2) : Math.min(items.length, 4);
  g.style.cssText = `display:grid;grid-template-columns:repeat(${columns},minmax(0,1fr));gap:${isCompactViewport ? "8px" : "12px"};margin-bottom:${T.spaceCard}`;
  const valueFontSize = isUltraNarrow ? "14px" : isCompactViewport ? "15px" : "18px";
  const labelFontSize = isUltraNarrow ? "9px" : isCompactViewport ? "10px" : "11px";
  const subFontSize = isUltraNarrow ? "9px" : isCompactViewport ? "10px" : "11px";
  const cardPadding = isUltraNarrow ? "12px 10px" : isCompactViewport ? "14px 12px" : `${T.spaceCard} 18px`;
  const minHeight = isUltraNarrow ? "92px" : isCompactViewport ? "96px" : "104px";
  const contentGap = isUltraNarrow ? "4px" : isCompactViewport ? "5px" : "6px";
  const iconSize = isUltraNarrow ? "15px" : isCompactViewport ? "16px" : "17px";
  items.forEach(function (it) {
    const hasIcon = !!it.icon;
    const hasSub = !!(it.sub && String(it.sub).trim());
    const stackGap = hasSub
      ? contentGap
      : isUltraNarrow
        ? "3px"
        : isCompactViewport
          ? "4px"
          : "5px";
    const d = document.createElement("div");
    d.style.cssText =
      "background:var(--sadv-layer-01,#262626);border:1px solid var(--sadv-border-subtle,#393939);border-radius:" + T.radiusNone + ";padding:" + cardPadding + ";text-align:center;min-width:0;min-height:" + minHeight + ";display:flex;align-items:center;justify-content:center;transition:all 0.2s;box-shadow:" + T.shadowCard + ";overflow:hidden";
    const iconHtml = hasIcon
      ? `<div style="width:100%;display:flex;align-items:center;justify-content:center;color:${it.color || 'var(--sadv-text-secondary,#c6c6c6)'};opacity:0.92;line-height:1;min-height:${iconSize}">${it.icon}</div>`
      : "";
    const subHtml = hasSub
      ? `<div style="width:100%;font-size:${subFontSize};color:var(--sadv-text-secondary,#c6c6c6);line-height:1.4;min-height:${subFontSize === "9px" ? "1.5em" : "1.6em"};text-align:center">${escHtml(it.sub)}</div>`
      : "";
    d.innerHTML = sanitizeHTML(
      `<div style="width:100%;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:${stackGap};min-height:100%">` +
        `${iconHtml}` +
        `<div style="width:100%;font-size:${labelFontSize};color:var(--sadv-text-tertiary,#8d8d8d);line-height:1.4;word-break:keep-all;font-weight:600;text-transform:uppercase;letter-spacing:${isCompactViewport ? "0.02em" : "0.04em"};text-align:center">${escHtml(it.label)}</div>` +
        `<div style="width:100%;font-size:${valueFontSize};font-weight:650;color:${it.color || C.text};line-height:1.08;letter-spacing:${isCompactViewport ? "-0.03em" : "-0.01em"};word-break:keep-all;text-align:center">${escHtml(it.value)}</div>` +
        `${subHtml}` +
      `</div>`
    );
    const iconSvg = d.querySelector("svg");
    if (iconSvg) {
      iconSvg.style.width = iconSize + "px";
      iconSvg.style.height = iconSize + "px";
      iconSvg.style.display = "block";
      iconSvg.style.flexShrink = "0";
    }
    g.appendChild(d);
  });
  return g;
}

// Section title function
function secTitle(t) {
  const d = document.createElement("div");
  d.style.cssText =
    "font-size:12px;font-weight:600;letter-spacing:0.02em;text-transform:none;color:var(--sadv-text-secondary,#c6c6c6);margin:28px 0 14px;display:flex;align-items:center;gap:12px";
  d.innerHTML = sanitizeHTML(
    String(t || "") +
    ' <span style="flex:1;height:1px;background:var(--sadv-border-subtle,#393939);display:inline-block;opacity:1"></span>'
  );
  return d;
}

function createStateCard(title, description, iconHtml, tone = "neutral") {
  const accentMap = {
    neutral: "var(--sadv-accent,#ffd400)",
    warning: C.amber,
    danger: C.red,
    success: C.blue,
  };
  const accent = accentMap[tone] || accentMap.neutral;
  const wrap = document.createElement("div");
  wrap.style.cssText =
    "display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center;padding:28px " + T.spaceCardXl + ";background:var(--sadv-layer-01,#0d0d0f);border:1px solid var(--sadv-border-subtle,#2b2200);box-shadow:" + T.shadowCardStrong + ";margin:8px 0 " + T.spaceCard;
  const iconBox = document.createElement("div");
  iconBox.style.cssText =
    "display:inline-flex;align-items:center;justify-content:center;width:56px;height:56px;border:1px solid color-mix(in srgb, " +
    accent +
    " 28%, transparent);background:color-mix(in srgb, " +
    accent +
    " 10%, transparent);color:" +
    accent +
    ";margin-bottom:14px;box-shadow:" + T.shadowCard;
  iconBox.innerHTML = sanitizeHTML(iconHtml || ICONS.lightbulb);
  let iconSvg = iconBox.querySelector("svg");
  const hasRenderableShape = iconSvg && iconSvg.querySelector("path,line,circle,rect,ellipse,polyline,polygon");
  if (!hasRenderableShape) {
    iconBox.innerHTML = sanitizeHTML(
      ICONS.lightbulb.replace('width="13" height="13"', 'width="20" height="20"')
    );
    iconSvg = iconBox.querySelector("svg");
  }
  if (iconSvg) {
    iconSvg.setAttribute("width", iconSvg.getAttribute("width") || "22");
    iconSvg.setAttribute("height", iconSvg.getAttribute("height") || "22");
    iconSvg.style.width = "22px";
    iconSvg.style.height = "22px";
    iconSvg.style.display = "block";
    iconSvg.style.flexShrink = "0";
    iconSvg.style.opacity = "0.96";
  }
  const titleEl = document.createElement("div");
  titleEl.style.cssText =
    "font-size:15px;font-weight:700;color:var(--sadv-text,#fffdf5);margin-bottom:6px;letter-spacing:-0.01em";
  titleEl.textContent = title || "";
  const descEl = document.createElement("div");
  descEl.style.cssText =
    "font-size:12px;line-height:1.7;color:var(--sadv-text-secondary,#ffe9a8);max-width:320px";
  descEl.innerHTML = sanitizeHTML(description || "");
  wrap.appendChild(iconBox);
  wrap.appendChild(titleEl);
  wrap.appendChild(descEl);
  return wrap;
}

// Info box function
// Security Note: This function uses innerHTML for HTML content. All dynamic values in
// call sites MUST be escaped using escHtml() AND sanitized with sanitizeHTML().
// P0 SECURITY: XSS Prevention - DOMPurify is now applied automatically
function ibox(type, html) {
  const col =
    { green: C.green, amber: C.amber, red: C.red, blue: C.blue }[type] ||
      C.blue;
  const d = document.createElement("div");
  d.style.cssText = `border-left:4px solid ${col};background:color-mix(in srgb, ${col} 12%, transparent);border-radius:${T.radiusNone};padding:${T.spaceCard};margin-bottom:${T.spaceCard};font-size:12px;line-height:1.6;color:var(--sadv-text-secondary,#c6c6c6);border:1px solid color-mix(in srgb, ${col} 35%, transparent)`;
  // P0 SECURITY: Apply DOMPurify sanitization
  d.innerHTML = sanitizeHTML(html);
  return d;
}

// CTR badge function
function ctrBadge(v) {
  const n = parseFloat(v);
  if (isNaN(n)) {
    return '<span style="display:inline-block;background:var(--sadv-layer-02,#393939);border:1px solid var(--sadv-border-subtle,#393939);color:var(--sadv-text-tertiary,#8d8d8d);font-size:10px;font-weight:700;padding:2px 8px;border-radius:999px">-</span>';
  }
  const col = n >= 3 ? C.green : n >= 1.5 ? C.amber : C.blue;
  return `<span style="display:inline-block;background:color-mix(in srgb, ${col} 14%, transparent);border:1px solid color-mix(in srgb, ${col} 35%, transparent);color:${col};font-size:10px;font-weight:700;padding:2px 8px;border-radius:999px">${n.toFixed(2)}%</span>`;
}

// Horizontal bar function
function hbar(v, mx, col) {
  const pct = mx ? Math.round((v / mx) * 100) : 0;
  return `<div style="height:8px;background:var(--sadv-layer-02,#393939);border-radius:999px;margin:10px 0 12px;overflow:hidden"><div style="width:${pct}%;height:100%;background:${col};border-radius:999px;transition:width 0.5s ease-out"></div></div>`;
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

function getSiteShortName(siteUrl, payload) {
  const meta = getSiteMeta(siteUrl, payload);
  const candidate = meta
    ? meta.shortName || meta.displayLabel || meta[PAYLOAD_FIELDS.LABEL] || meta.label || siteUrl
    : siteUrl;
  const normalized = normalizeSiteUrl(candidate || siteUrl || '');
  return normalized.replace(/^https?:\/\//i, "").split("/")[0] || candidate || '';
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
