// DOM Initialization Module
// This module handles the creation and initialization of the SearchAdvisor UI DOM elements
// Note: escHtml() function is provided by 01-helpers.js

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
inj.textContent = `html{margin-right:min(${PNL}px,100vw) !important;transition:margin-right .25s ease;box-sizing:border-box;}`;
document.head.appendChild(inj);

// Create main panel
const p = document.createElement("div");
p.id = "sadv-p";
p.style.cssText = `position:fixed;top:0;right:0;width:min(${PNL}px,100vw);max-width:100vw;height:100vh;display:flex;flex-direction:column;background:#020617;z-index:9999999;font-family:Pretendard,system-ui,sans-serif;font-size:13px;color:#f8fafc;border-left:1px solid #334155;box-sizing:border-box;box-shadow:-10px 0 15px -3px rgba(0,0,0,0.1)`;
p.innerHTML = `<style>#sadv-p *{box-sizing:border-box}#sadv-p ::-webkit-scrollbar{width:6px}#sadv-p ::-webkit-scrollbar-thumb{background:#334155;border-radius:3px}#sadv-header{padding:20px;border-bottom:1px solid #1e293b;background:rgba(2,6,23,0.8);backdrop-filter:blur(12px)}#sadv-mode-bar{display:flex;gap:4px;margin-top:16px;background:#0f172a;padding:4px;border-radius:12px;border:1px solid #334155}.sadv-mode{flex:1;background:transparent;border:none;color:#94a3b8;border-radius:8px;padding:8px;font-size:12px;font-weight:600;cursor:pointer;transition:all .2s}.sadv-mode.on{background:#1e293b;color:#0ea5e9;box-shadow:0 4px 6px -1px rgba(0,0,0,0.2)}#sadv-site-bar{margin-top:12px;position:relative;display:none}#sadv-site-bar.show{display:block}#sadv-combo-wrap{position:relative}#sadv-combo-btn{width:100%;background:#0f172a;border:1px solid #334155;color:#f8fafc;border-radius:10px;padding:10px 36px 10px 12px;font-size:13px;cursor:pointer;text-align:left;font-family:inherit;transition:all .2s;display:flex;align-items:center;gap:10px}#sadv-combo-btn:hover{border-color:#0ea5e9;background:#1e293b}#sadv-combo-dot{width:8px;height:8px;border-radius:50%;flex-shrink:0;background:#64748b}#sadv-combo-label{flex:1;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;font-size:13px;font-weight:500}#sadv-combo-arrow{position:absolute;right:12px;top:50%;transform:translateY(-50%);color:#64748b;font-size:12px;pointer-events:none;transition:transform .2s}#sadv-combo-wrap.open #sadv-combo-arrow{transform:translateY(-50%) rotate(180deg)}#sadv-combo-drop{display:none;position:absolute;top:calc(100% + 8px);left:0;right:0;background:#0f172a;border:1px solid #334155;border-radius:12px;padding:6px;z-index:100;box-shadow:0 10px 15px -3px rgba(0,0,0,0.1);max-height:300px;overflow-y:auto}#sadv-combo-wrap.open #sadv-combo-drop{display:block}.sadv-combo-item{display:flex;align-items:center;gap:10px;padding:8px 12px;border-radius:8px;cursor:pointer;transition:all .1s;border:1px solid transparent}.sadv-combo-item:hover{background:#1e293b}.sadv-combo-item.active{background:#1e293b;border-color:#334155;color:#0ea5e9}#sadv-tabs{display:none;flex-wrap:wrap;gap:6px;padding:12px 20px;background:#020617;border-bottom:1px solid #1e293b;justify-content:center}#sadv-tabs.show{display:flex;justify-content:center}#sadv-tabs::-webkit-scrollbar{display:none}.sadv-t{background:transparent;border:1px solid transparent;color:#64748b;border-radius:8px;padding:6px 12px;font-size:12px;font-weight:600;cursor:pointer;transition:all .2s}.sadv-t:hover{color:#f8fafc;background:#1e293b}.sadv-t.on{background:rgba(14,165,233,0.1);border-color:rgba(14,165,233,0.2);color:#0ea5e9}#sadv-refresh-btn{display:inline-flex;align-items:center;gap:6px;background:#0f172a;border:1px solid #334155;color:#94a3b8;border-radius:8px;padding:6px 10px;font-size:12px;font-weight:600;cursor:pointer;font-family:inherit;transition:all .2s}#sadv-refresh-btn:hover{border-color:#0ea5e9;color:#0ea5e9;background:#1e293b}#sadv-bd{flex:1;overflow-y:auto;overflow-x:hidden;padding:20px}#sadv-tabpanel{flex:1;overflow-y:auto;overflow-x:hidden;padding:20px}.sadv-allcard{background:#0f172a;border:1px solid #1e293b;border-radius:16px;padding:20px;margin-bottom:16px;cursor:pointer;transition:all .2s}.sadv-allcard:hover{border-color:#334155;transform:translateY(-2px)}</style><div id="sadv-header"><div style="display:flex;justify-content:space-between;align-items:center"><div><div style="display:flex;align-items:center;gap:8px;flex-wrap:wrap"><div style="display:flex;align-items:center;gap:7px;font-size:18px;font-weight:800;letter-spacing:-0.03em"><span style="display:inline-flex;opacity:0.95">${ICONS.logoSearch}</span>Search<span style="color:#10b981">Advisor</span></div><div id="sadv-account-badge" style="display:none;padding:4px 12px;border-radius:999px;border:1px solid #1e293b;color:#0ea5e9;background:rgba(15,23,42,0.6);font-size:11px;font-weight:600;line-height:1.2;overflow:hidden;text-overflow:ellipsis;white-space:nowrap"></div></div><div id="sadv-site-label" style="font-size:11px;color:#64748b;margin-top:4px;display:flex;align-items:center;gap:4px">\ub85c\ub529 \uc911...</div></div><div style="display:flex;gap:8px;align-items:center"><button id="sadv-refresh-btn" class="sadv-btn" title="새로고침" style="display:inline-flex;align-items:center;gap:5px">${ICONS.refresh} 새로고침</button><button id="sadv-save-btn" class="sadv-btn" title="현재 화면 저장" style="display:inline-flex;align-items:center;gap:5px">${ICONS.save} 저장</button><button id="sadv-x" style="background:none;border:1px solid #1e293b;color:#475569;width:32px;height:32px;border-radius:8px;cursor:pointer;display:inline-flex;align-items:center;justify-content:center;flex-shrink:0;transition:all 0.2s">${ICONS.xMark}</button></div></div><div id="sadv-mode-bar"><button class="sadv-mode on" data-m="all" style="display:inline-flex;align-items:center;justify-content:center;gap:5px">${ICONS.globe} 전체현황</button><button class="sadv-mode" data-m="site" style="display:inline-flex;align-items:center;justify-content:center;gap:5px">${ICONS.layers} 사이트별</button></div><div id="sadv-site-bar"><div id="sadv-combo-wrap"><button id="sadv-combo-btn"><span id="sadv-combo-dot"></span><span id="sadv-combo-label">\uc0ac\uc774\ud2b8 \uc120\ud0dd</span></button><span id="sadv-combo-arrow" style="display:inline-flex;align-items:center">${ICONS.chevronDown}</span><div id="sadv-combo-drop"></div></div></div></div><div id="sadv-tabs"></div><div id="sadv-bd"><div style="padding:60px 20px;text-align:center;color:#64748b">⏳ \ub85c\ub529 \uc911...</div></div>`;
document.body.appendChild(p);

// Add additional UI styles
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

// Setup close button handler
document.getElementById("sadv-x").onclick = function () {
  p.remove();
  document.getElementById("sadv-inj") &&
    document.getElementById("sadv-inj").remove();
  if (TIP) {
    TIP.remove();
    TIP = null;
  }
};

// Helper functions
// Note: escHtml() is provided by 01-helpers.js
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

// P0-3: ACCOUNT_UTILS 통합 - 중복 제거
// 이제 ACCOUNT_UTILS.getAccountLabel()을 사용하세요.
// getAccountLabel()은 ACCOUNT_UTILS로 이동됨.

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

// Initialize tabsEl for global access
window.__sadvTabsEl = document.getElementById("sadv-tabs");
