/**
 * ========================================================================
 * SearchAdvisor DOM Initialization - 내부용 로컬 전용 모듈
 * ========================================================================
 *
 * ⚠️ INTERNAL LOCAL-ONLY MODULE
 *
 * 이 모듈은 각 사용자의 로컬 브라우저 환경에서만 사용됩니다.
 * 외부 배포 or npm 패키지로 제공하지 않습니다.
 *
 * @internal
 * @private
 */

// DOM Initialization Module
// This module handles the creation and initialization of the SearchAdvisor UI DOM elements
// P0 SECURITY: All innerHTML usage now uses sanitizeHTML() for XSS prevention
// Note: escHtml() and sanitizeHTML() functions are provided by 01-helpers.js

// Remove old panel if it exists
const old = document.getElementById("sadv-p");
if (old) {
  old.remove();
  document.getElementById("sadv-inj") &&
    document.getElementById("sadv-inj").remove();
  return;
}

// Inject style to adjust HTML margin for the panel
const inj = document.createElement("style");
inj.id = "sadv-inj";
inj.textContent = `html{margin-right:min(${PNL}px,100vw) !important;transition:margin-right .25s ease;box-sizing:border-box}@media(max-width:${CONFIG.UI.MOBILE_BREAKPOINT}px){html{margin-right:0 !important}}`;
document.head.appendChild(inj);

// Create main panel
const p = document.createElement("div");
p.id = "sadv-p";
p.style.cssText = `position:fixed;top:0;right:0;width:min(${PNL}px,100vw);max-width:100vw;height:100vh;display:flex;flex-direction:column;background:${C.bg0};z-index:9999999;font-family:"IBM Plex Sans KR","IBM Plex Sans",Pretendard,system-ui,sans-serif;font-size:13px;color:${C.text};border-left:1px solid ${C.border};box-sizing:border-box;box-shadow:-20px 0 40px rgba(0,0,0,0.45)`;
p.innerHTML = sanitizeHTML(`<style>#sadv-p *{box-sizing:border-box}#sadv-p ::-webkit-scrollbar{width:6px}#sadv-p ::-webkit-scrollbar-thumb{background:#334155;border-radius:3px}#sadv-header{padding:20px;border-bottom:1px solid #1e293b;background:rgba(2,6,23,0.8);backdrop-filter:blur(12px)}#sadv-mode-bar{display:flex;gap:4px;margin-top:16px;background:#0f172a;padding:4px;border-radius:12px;border:1px solid #334155}.sadv-mode{flex:1;background:transparent;border:none;color:#94a3b8;border-radius:8px;padding:8px;font-size:12px;font-weight:600;cursor:pointer;transition:all .2s}.sadv-mode.on{background:#1e293b;color:#0ea5e9;box-shadow:0 4px 6px -1px rgba(0,0,0,0.2)}#sadv-site-bar{margin-top:12px;position:relative;display:none}#sadv-site-bar.show{display:block}#sadv-combo-wrap{position:relative}#sadv-combo-btn{width:100%;background:#0f172a;border:1px solid #334155;color:#f8fafc;border-radius:10px;padding:10px 36px 10px 12px;font-size:13px;cursor:pointer;text-align:left;font-family:inherit;transition:all .2s;display:flex;align-items:center;gap:10px}#sadv-combo-btn:hover{border-color:#0ea5e9;background:#1e293b}#sadv-combo-btn:focus-visible{outline:2px solid #0ea5e9;outline-offset:2px;box-shadow:0 0 0 4px rgba(14, 165, 233, 0.1)}#sadv-combo-dot{width:8px;height:8px;border-radius:50%;flex-shrink:0;background:#64748b}#sadv-combo-label{flex:1;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;font-size:13px;font-weight:500}#sadv-combo-arrow{position:absolute;right:12px;top:50%;transform:translateY(-50%);color:#64748b;font-size:12px;pointer-events:none;transition:transform .2s}#sadv-combo-wrap.open #sadv-combo-arrow{transform:translateY(-50%) rotate(180deg)}#sadv-combo-drop{display:none;position:absolute;top:calc(100% + 8px);left:0;right:0;background:#0f172a;border:1px solid #334155;border-radius:12px;padding:6px;z-index:100;box-shadow:0 10px 15px -3px rgba(0,0,0,0.1);max-height:300px;overflow-y:auto}#sadv-combo-wrap.open #sadv-combo-drop{display:block}.sadv-combo-item{display:flex;align-items:center;gap:10px;padding:8px 12px;border-radius:8px;cursor:pointer;transition:all .1s;border:1px solid transparent}.sadv-combo-item:hover{background:#1e293b}.sadv-combo-item:focus-visible{outline:2px solid #0ea5e9;outline-offset:-2px}.sadv-combo-item.active{background:#1e293b;border-color:#334155;color:#0ea5e9}#sadv-tabs{display:none;flex-wrap:wrap;gap:6px;padding:12px 20px;background:#020617;border-bottom:1px solid #1e293b;justify-content:center}#sadv-tabs.show{display:flex;justify-content:center}#sadv-tabs::-webkit-scrollbar{display:none}.sadv-t{background:transparent;border:1px solid transparent;color:#64748b;border-radius:8px;padding:6px 12px;font-size:12px;font-weight:600;cursor:pointer;transition:all .2s}.sadv-t:hover{color:#f8fafc;background:#1e293b}.sadv-t.on{background:rgba(14,165,233,0.1);border-color:rgba(14,165,233,0.2);color:#0ea5e9}#sadv-refresh-btn,#sadv-save-btn{display:inline-flex;align-items:center;justify-content:center;gap:6px;background:#0f172a;border:1px solid #334155;color:#94a3b8;border-radius:8px;padding:6px 12px;font-size:12px;font-weight:600;cursor:pointer;font-family:inherit;transition:all .2s;white-space:nowrap;flex-shrink:0;min-width:74px;line-height:1.1}#sadv-refresh-btn:hover,#sadv-save-btn:hover{border-color:#0ea5e9;color:#0ea5e9;background:#1e293b}#sadv-refresh-btn:focus-visible,#sadv-save-btn:focus-visible{outline:2px solid #0ea5e9;outline-offset:2px;box-shadow:0 0 0 4px rgba(14, 165, 233, 0.1)}#sadv-cache-meta{display:flex;flex-wrap:wrap;gap:6px;margin-top:6px}#sadv-bd{flex:1;overflow-y:auto;overflow-x:hidden;padding:20px}#sadv-tabpanel{flex:1;overflow-y:auto;overflow-x:hidden;padding:20px}.sadv-allcard{background:#0f172a;border:1px solid #1e293b;border-radius:16px;padding:20px;margin-bottom:16px;cursor:pointer;transition:all .2s}.sadv-allcard:hover{border-color:#334155;transform:translateY(-2px)}</style><div id="sadv-header"><div style="display:flex;justify-content:space-between;align-items:center"><div><div style="display:flex;align-items:center;gap:8px;flex-wrap:wrap"><div style="display:flex;align-items:center;gap:7px;font-size:18px;font-weight:800;letter-spacing:-0.03em"><span style="display:inline-flex;opacity:0.95">${ICONS.logoSearch}</span>Search<span style="color:#ffd400">Advisor</span></div><div id="sadv-account-badge" style="display:none;padding:4px 12px;border-radius:999px;border:1px solid rgba(255,212,0,0.2);color:#ffd400;background:rgba(255,212,0,0.12);font-size:11px;font-weight:600;line-height:1.2;overflow:hidden;text-overflow:ellipsis;white-space:nowrap"></div></div><div id="sadv-site-label" style="font-size:11px;color:#64748b;margin-top:4px;display:flex;align-items:center;gap:4px">\ub85c\ub529 \uc911...</div><div id="sadv-cache-meta"></div></div><div style="display:flex;gap:8px;align-items:center"><button id="sadv-refresh-btn" class="sadv-btn" title="새로고침" style="display:inline-flex;align-items:center;justify-content:center;gap:5px;white-space:nowrap;flex-shrink:0;min-width:74px">${ICONS.refresh} 새로고침</button><button id="sadv-save-btn" class="sadv-btn" title="현재 화면 저장" style="display:inline-flex;align-items:center;justify-content:center;gap:5px;white-space:nowrap;flex-shrink:0;min-width:74px">${ICONS.save} 저장</button><button id="sadv-x" style="background:none;border:1px solid #1e293b;color:#475569;width:32px;height:32px;border-radius:8px;cursor:pointer;display:inline-flex;align-items:center;justify-content:center;flex-shrink:0;transition:all 0.2s">${ICONS.xMark}</button></div></div><div id="sadv-mode-bar"><button class="sadv-mode on" data-m="all" style="display:inline-flex;align-items:center;justify-content:center;gap:5px">${ICONS.globe} 전체현황</button><button class="sadv-mode" data-m="site" style="display:inline-flex;align-items:center;justify-content:center;gap:5px">${ICONS.layers} 사이트별</button></div><div id="sadv-site-bar"><div id="sadv-combo-wrap"><button id="sadv-combo-btn"><span id="sadv-combo-dot"></span><span id="sadv-combo-label">\uc0ac\uc774\ud2b8 \uc120\ud0dd</span></button><span id="sadv-combo-arrow" style="display:inline-flex;align-items:center">${ICONS.chevronDown}</span><div id="sadv-combo-drop"></div></div></div></div><div id="sadv-tabs"></div><div id="sadv-bd"><div style="padding:60px 20px;text-align:center;color:#64748b">⏳ \ub85c\ub529 \uc911...</div></div>`);
const initialShellStyleEl = p.querySelector("style");
if (initialShellStyleEl) {
  initialShellStyleEl.textContent = initialShellStyleEl.textContent
    .replace(/#334155/g, "#2b2200")
    .replace(/#1e293b/g, "#3b2d00")
    .replace(/#0f172a/g, "#17110a")
    .replace(/#94a3b8/g, "#ffe9a8")
    .replace(/#64748b/g, "#b9a55a")
    .replace(/#020617/g, "#050505")
    .replace(/#0ea5e9/g, "#ffd400")
    .replace(/rgba\(2,6,23,0\.8\)/g, "rgba(5,5,5,0.96)")
    .replace(/rgba\(14,\s*165,\s*233,\s*0\.1\)/g, "rgba(255,212,0,0.12)")
    .replace(/rgba\(14,\s*165,\s*233,\s*0\.2\)/g, "rgba(255,212,0,0.24)");
}
document.body.appendChild(p);

const requiredShellIds = [
  "sadv-mode-bar",
  "sadv-site-bar",
  "sadv-combo-wrap",
  "sadv-combo-btn",
  "sadv-tabs",
  "sadv-bd",
  "sadv-site-label",
];
const missingShellIds = requiredShellIds.filter((id) => !document.getElementById(id));
if (missingShellIds.length) {
  console.error("[DOM Init] Missing required shell elements after initialization:", missingShellIds);
}

// Add additional UI styles
const siteUiStyle = document.createElement("style");
siteUiStyle.textContent = `
#sadv-p{
  --sadv-bg:${C.bg0};
  --sadv-layer-01:${C.bg1};
  --sadv-layer-02:${C.bg2};
  --sadv-layer-hover:#3b2d00;
  --sadv-border:${C.border};
  --sadv-border-subtle:#2b2200;
  --sadv-text:${C.text};
  --sadv-text-secondary:${C.sub};
  --sadv-text-tertiary:${C.muted};
  --sadv-accent:${C.blue};
  --sadv-success:${C.green};
  --sadv-danger:${C.red};
}
#sadv-p *{
  scrollbar-color:#6f6f6f #262626;
}
#sadv-p svg{
  vertical-align:middle;
}
#sadv-header{
  position:relative !important;
  z-index:40 !important;
  overflow:visible !important;
  padding:24px 24px 16px !important;
  background:var(--sadv-bg) !important;
  border-bottom:1px solid var(--sadv-border-subtle) !important;
  backdrop-filter:none !important;
}
#sadv-header > div:first-child{
  display:flex !important;
  justify-content:space-between !important;
  align-items:flex-start !important;
  gap:16px !important;
}
#sadv-header > div:first-child > div:first-child{
  min-width:0;
  flex:1 1 auto;
}
#sadv-header > div:first-child > div:last-child{
  display:flex !important;
  gap:8px !important;
  align-items:center !important;
  flex-wrap:wrap !important;
  justify-content:flex-end !important;
}
#sadv-site-label{
  color:var(--sadv-text-secondary) !important;
  margin-top:8px !important;
  font-size:12px !important;
}
#sadv-cache-meta{
  display:flex !important;
  flex-wrap:wrap !important;
  gap:8px !important;
  margin-top:8px !important;
}
#sadv-account-badge{
  border-radius:4px !important;
  background:rgba(255,212,0,0.12) !important;
  border:1px solid rgba(255,212,0,0.26) !important;
  color:var(--sadv-accent) !important;
}
#sadv-mode-bar{
  display:grid !important;
  grid-template-columns:1fr 1fr !important;
  gap:0 !important;
  margin-top:20px !important;
  background:var(--sadv-layer-01) !important;
  padding:0 !important;
  border-radius:0 !important;
  border:1px solid var(--sadv-border-subtle) !important;
  overflow:hidden !important;
}
.sadv-mode{
  min-height:40px !important;
  padding:0 16px !important;
  border-radius:0 !important;
  border:none !important;
  border-right:1px solid var(--sadv-border-subtle) !important;
  background:transparent !important;
  color:var(--sadv-text-secondary) !important;
  font-size:13px !important;
  font-weight:600 !important;
  transition:background-color .18s ease,color .18s ease,box-shadow .18s ease !important;
}
.sadv-mode:last-child{
  border-right:none !important;
}
.sadv-mode:hover{
  background:var(--sadv-layer-02) !important;
  color:var(--sadv-text) !important;
}
.sadv-mode.on{
  background:rgba(255,212,0,0.16) !important;
  color:var(--sadv-accent) !important;
  box-shadow:inset 0 -2px 0 var(--sadv-accent) !important;
}
#sadv-site-bar{
  margin-top:16px !important;
  position:relative !important;
  z-index:70 !important;
  overflow:visible !important;
}
#sadv-combo-wrap{
  position:relative !important;
  z-index:80 !important;
  overflow:visible !important;
}
#sadv-combo-btn{
  width:100% !important;
  min-height:48px !important;
  padding:0 44px 0 16px !important;
  border-radius:0 !important;
  border:1px solid var(--sadv-border) !important;
  background:var(--sadv-layer-01) !important;
  color:var(--sadv-text) !important;
  font-size:14px !important;
  font-weight:500 !important;
  gap:12px !important;
}
#sadv-combo-btn:hover{
  background:var(--sadv-layer-02) !important;
  border-color:var(--sadv-accent) !important;
}
#sadv-combo-btn:focus-visible,
#sadv-refresh-btn:focus-visible,
#sadv-save-btn:focus-visible,
#sadv-x:focus-visible,
.sadv-mode:focus-visible,
.sadv-t:focus-visible,
.sadv-allcard:focus-visible{
  outline:2px solid #ffffff !important;
  outline-offset:-2px !important;
  box-shadow:0 0 0 1px var(--sadv-accent) inset !important;
}
#sadv-combo-dot{
  width:10px !important;
  height:10px !important;
  border-radius:999px !important;
  box-shadow:0 0 0 2px rgba(255,255,255,0.08) !important;
}
#sadv-combo-label{
  font-size:14px !important;
  font-weight:500 !important;
  color:var(--sadv-text) !important;
}
#sadv-combo-arrow{
  right:14px !important;
  color:var(--sadv-text-secondary) !important;
}
#sadv-combo-drop{
  display:none;
  position:absolute !important;
  top:calc(100% + 2px) !important;
  left:0 !important;
  right:0 !important;
  z-index:120 !important;
  background:var(--sadv-layer-01) !important;
  border:1px solid var(--sadv-border) !important;
  border-radius:0 !important;
  padding:0 !important;
  overflow-x:hidden !important;
  overflow-y:auto !important;
  max-height:min(56vh, 420px) !important;
  box-shadow:0 18px 40px rgba(0,0,0,0.48) !important;
}
#sadv-combo-wrap.open #sadv-combo-drop{
  display:block !important;
}
.sadv-combo-item{
  display:grid !important;
  grid-template-columns:10px minmax(0,1fr) auto !important;
  align-items:center !important;
  gap:12px !important;
  min-height:58px !important;
  padding:12px 16px !important;
  border:0 !important;
  border-left:3px solid transparent !important;
  border-bottom:1px solid var(--sadv-border-subtle) !important;
  border-radius:0 !important;
  background:transparent !important;
}
.sadv-combo-item:last-child{
  border-bottom:none !important;
}
.sadv-combo-item:hover{
  background:var(--sadv-layer-02) !important;
}
.sadv-combo-item.active{
  background:rgba(255,212,0,0.12) !important;
  color:var(--sadv-text) !important;
  border-left-color:var(--sadv-accent) !important;
}
.sadv-combo-item-dot{
  width:10px;
  height:10px;
  border-radius:999px;
}
.sadv-combo-item-info{
  min-width:0;
}
.sadv-combo-item-name{
  font-size:13px;
  font-weight:600;
  color:var(--sadv-text);
  white-space:nowrap;
  overflow:hidden;
  text-overflow:ellipsis;
}
.sadv-combo-item-url{
  margin-top:3px;
  font-size:11px;
  color:var(--sadv-text-tertiary);
  white-space:nowrap;
  overflow:hidden;
  text-overflow:ellipsis;
}
.sadv-combo-item-click{
  font-size:12px;
  font-weight:700;
  white-space:nowrap;
}
#sadv-tabs{
  position:relative !important;
  z-index:10 !important;
}
#sadv-tabs.show{
  display:flex !important;
  flex-wrap:wrap !important;
  overflow-x:visible !important;
  gap:8px !important;
  padding:12px 20px 14px !important;
  background:var(--sadv-bg) !important;
  border-bottom:1px solid var(--sadv-border-subtle) !important;
  justify-content:center !important;
}
.sadv-t{
  position:relative !important;
  display:inline-flex !important;
  align-items:center !important;
  justify-content:center !important;
  gap:8px !important;
  flex:0 0 auto !important;
  min-width:78px !important;
  min-height:44px !important;
  padding:0 12px !important;
  border-radius:0 !important;
  border:none !important;
  border-bottom:2px solid transparent !important;
  background:transparent !important;
  color:var(--sadv-text-tertiary) !important;
  font-size:13px !important;
  font-weight:500 !important;
  white-space:nowrap !important;
  transition:color .18s ease,border-color .18s ease,background-color .18s ease !important;
  margin:0 !important;
}
.sadv-t svg{
  flex-shrink:0 !important;
}
.sadv-t:hover{
  color:var(--sadv-text) !important;
  background:rgba(255,255,255,0.03) !important;
}
.sadv-t.on{
  background:transparent !important;
  border-bottom-color:var(--sadv-accent) !important;
  color:var(--sadv-text) !important;
}
#sadv-refresh-btn,
#sadv-save-btn,
#sadv-x{
  min-height:40px !important;
  border-radius:0 !important;
}
#sadv-refresh-btn,
#sadv-save-btn{
  background:var(--sadv-layer-01) !important;
  border:1px solid var(--sadv-border) !important;
  color:var(--sadv-text-secondary) !important;
  padding:0 14px !important;
}
#sadv-refresh-btn:hover,
#sadv-save-btn:hover{
  background:var(--sadv-layer-02) !important;
  border-color:var(--sadv-accent) !important;
  color:var(--sadv-text) !important;
}
#sadv-x{
  background:transparent !important;
  border:1px solid var(--sadv-border-subtle) !important;
  color:var(--sadv-text-secondary) !important;
}
#sadv-x:hover {
  border-color:var(--sadv-danger) !important;
  color:var(--sadv-danger) !important;
  background:rgba(250,77,86,0.08) !important;
}
#sadv-bd,
#sadv-tabpanel{
  background:var(--sadv-bg) !important;
  padding:18px !important;
}
.sadv-allcard{
  background:var(--sadv-layer-01) !important;
  border:1px solid var(--sadv-border-subtle) !important;
  border-radius:0 !important;
  padding:18px !important;
  margin-bottom:16px !important;
  box-shadow:0 8px 24px rgba(0,0,0,0.22) !important;
}
.sadv-allcard:hover{
  border-color:var(--sadv-accent) !important;
  transform:none !important;
}

@media (max-width: 768px) {
  #sadv-p {
    width:100vw !important;
    max-width:100vw !important;
    border-left:none;
  }
  #sadv-header {
    padding:18px 16px 14px !important;
  }
  #sadv-header > div:first-child{
    flex-direction:column !important;
  }
  #sadv-header > div:first-child > div:last-child{
    width:100%;
    justify-content:flex-start !important;
  }
  #sadv-mode-bar {
    margin-top:16px !important;
  }
  #sadv-combo-btn {
    min-height:44px !important;
  }
  #sadv-combo-drop {
    max-height:48vh !important;
  }
  #sadv-tabs.show {
    padding:10px 16px 12px !important;
    gap:6px !important;
  }
  .sadv-t {
    min-height:42px !important;
    min-width:74px !important;
    padding:0 10px !important;
    font-size:12px !important;
  }
  #sadv-bd,
  #sadv-tabpanel {
    padding:14px !important;
  }
  .sadv-allcard {
    padding:16px !important;
  }
}
`;
p.appendChild(siteUiStyle);

// Setup close button handler with keyboard support
const closeBtn = document.getElementById("sadv-x");
if (closeBtn) {
  closeBtn.onclick = function () {
    p.remove();
    document.getElementById("sadv-inj") &&
      document.getElementById("sadv-inj").remove();
    if (TIP) {
      TIP.remove();
      TIP = null;
    }
  };
  closeBtn.addEventListener('keydown', (e) => {
  if (e.key === 'Enter' || e.key === ' ') {
    e.preventDefault();
    closeBtn.click();
  }
  if (e.key === 'Escape') {
    e.preventDefault();
    closeBtn.click();
  }
  });
}

// Helper functions
// Note: escHtml() is provided by 01-helpers.js

/**
 * Pad a number with leading zeros to ensure 2 digits
 * @param {number|string} v - Value to pad
 * @returns {string} Two-digit string with leading zeros
 * @example
 * pad2(5) // returns "05"
 * pad2(12) // returns "12"
 */
function pad2(v) {
  return String(v).padStart(2, "0");
}

/**
 * Generate a filename timestamp from a date object
 * Format: YYYYMMDD-HHmmss
 * @param {Date} d - Date object
 * @returns {string} Formatted timestamp string
 * @example
 * stampFile(new Date(2026, 2, 15, 14, 30, 45)) // returns "20260315-143045"
 * @see {stampLabel}
 */
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

/**
 * Generate a human-readable timestamp label from a date object
 * Format: YYYY.MM.DD HH:mm:ss
 * @param {Date} d - Date object
 * @returns {string} Formatted timestamp string
 * @example
 * stampLabel(new Date(2026, 2, 15, 14, 30, 45)) // returns "2026.03.15 14:30:45"
 * @see {stampFile}
 */
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

/**
 * Convert a value to a filesystem-safe filename
 * Removes protocol, replaces special characters with hyphens
 * @param {string} v - Value to convert (URL, email, etc.)
 * @returns {string} Filesystem-safe string (max 80 chars)
 * @example
 * fileSafe('https://example.com/path') // returns "example-com-path"
 * fileSafe('user@example.com') // returns "userexample-com"
 */
function fileSafe(v) {
  return String(v || "snapshot")
    .replace(/^https?:\/\//, "")
    .replace(/[\\/:*?"<>|]+/g, "-")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 80);
}

/**
 * Extract account identifier from an email address or label
 * @param {string} v - Email address or account label
 * @returns {string} Filesystem-safe account identifier
 * @example
 * accountIdFromLabel('user@example.com') // returns "user"
 * accountIdFromLabel('unknown') // returns "unknown"
 * @see {fileSafe}
 */
function accountIdFromLabel(v) {
  const raw = String(v || "").trim();
  const localPart = raw.includes("@") ? raw.split("@")[0] : raw;
  return fileSafe(localPart || "unknown");
}

// P0-3: ACCOUNT_UTILS 통합 - 중복 제거
// 이제 ACCOUNT_UTILS.getAccountLabel()을 사용하세요.
// getAccountLabel()은 ACCOUNT_UTILS로 이동됨.

/**
 * Apply account label badge to the UI header
 * Shows or hides the account badge based on the provided label
 * @param {string|null} accountLabel - Account email/label to display, or null to hide
 * @returns {void}
 * @example
 * applyAccountBadge('user@example.com') // Shows badge with email
 * applyAccountBadge(null) // Hides badge
 * @see {ACCOUNT_UTILS.getAccountLabel}
 */
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

var accountLabel = ACCOUNT_UTILS.getAccountInfo().accountLabel || "";
var encId = ACCOUNT_UTILS.getEncId() || "";
applyAccountBadge(accountLabel);

// Initialize tabsEl for global access
var modeBar = document.getElementById("sadv-mode-bar");
var siteBar = document.getElementById("sadv-site-bar");
var tabsEl = document.getElementById("sadv-tabs");
var bdEl = document.getElementById("sadv-bd");
var labelEl = document.getElementById("sadv-site-label");
var comboDotEl = document.getElementById("sadv-combo-dot");
var comboLabelEl = document.getElementById("sadv-combo-label");
window.__sadvTabsEl = tabsEl;
