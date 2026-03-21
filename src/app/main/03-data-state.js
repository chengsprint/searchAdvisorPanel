// ============================================================
// DATA-STATE - State management and account switching
// ============================================================

/**
 * Load site list from various sources
 * @param {boolean} refresh - Force refresh from cache
 * @returns {Promise<Array>} List of site URLs
 */
async function recoverSiteListFromBoardApi() {
  // Fresh profile / 새 크롬처럼 local cache가 비어 있는 환경에서는
  // `__sadvInitData`나 merged/export payload가 아직 없더라도
  // board 페이지의 encId만 찾을 수 있으면 legacy `api-board/list/<encId>` 경로로
  // 사이트 목록을 복구할 수 있다.
  //
  // 왜 이 fallback을 유지하나:
  // - 과거 runtime은 board 페이지에서도 이 복구 경로로 사이트 목록을 채웠고,
  // - 새 프로필에서만 `사이트 목록을 찾을 수 없어요`가 뜨는 회귀를 막으려면
  //   initData/cache 의존만으로는 부족하기 때문이다.
  //
  // 주의:
  // - export payload / merged data / init data / cache보다 후순위다.
  // - verified 사이트만 채택한다.
  // - 성공하면 caller가 cache + global allSites를 동기화한다.
  const encId = ACCOUNT_UTILS.getEncId();
  if (!encId) {
    console.warn("[loadSiteList] Board API fallback skipped: encId missing");
    return [];
  }

  try {
    const response = await fetchWithRetry(
      "https://searchadvisor.naver.com/api-board/list/" + encId,
      {
        credentials: "include",
        headers: { accept: "application/json" },
      },
    );

    if (!response || !response.ok) {
      console.warn("[loadSiteList] Board API fallback failed:", response ? response.status : "no-response");
      return [];
    }

    const payload = await response.json();
    const sites = Array.isArray(payload && payload.items)
      ? payload.items
          .filter(function (item) { return item && item.verified; })
          .map(function (item) { return item && item.site; })
          .filter(Boolean)
          .sort()
      : [];

    if (sites.length) {
      console.log("[loadSiteList] Recovered sites from board API fallback:", sites);
    } else {
      console.warn("[loadSiteList] Board API fallback returned no verified sites");
    }

    return sites;
  } catch (e) {
    console.warn("[loadSiteList] Board API fallback error:", e);
    return [];
  }
}

async function loadSiteList(refresh = false) {
  console.log('[loadSiteList] Called with refresh:', refresh);
  const cacheSites = function (sites) {
    if (!Array.isArray(sites) || !sites.length) return;
    lsSet(getSiteListCacheKey(), {
      ts: Date.now(),
      sites: sites.slice(),
    }).catch(function (e) {
      console.warn('[loadSiteList] Failed to cache sites:', e);
    });
  };

  // Check V2 format EXPORT_PAYLOAD first
  const exportPayload = window.__SEARCHADVISOR_EXPORT_PAYLOAD__;
  if (exportPayload) {
    console.log('[loadSiteList] Found EXPORT_PAYLOAD');

    // P0-2: V2 다중 계정 구조 지원 완성
    if (exportPayload.__meta && exportPayload.accounts) {
      return handleV2MultiAccount(exportPayload);
    }

    // P2 Issue #2: V1 마이그레이션 지원
    // V1 페이로드 감지 및 자동 마이그레이션
    if (canMigrateV1(exportPayload)) {
      console.log('[loadSiteList] Detected V1 payload, attempting migration...');

      try {
        // V1 데이터 백업
        const backupKey = backupV1Data(exportPayload);

        // V1 → V2 마이그레이션
        const v2Payload = migrateV1ToV2(exportPayload, {
          accountEmail: ACCOUNT_UTILS.getAccountLabel(),
          encId: ACCOUNT_UTILS.getEncId(),
          validate: true
        });

        // 마이그레이션된 V2 페이로드 처리
        if (v2Payload.__meta && v2Payload.accounts) {
          console.log('[loadSiteList] V1 → V2 migration successful');

          // 마이그레이션된 데이터로 전역 변수 업데이트
          window.__SEARCHADVISOR_EXPORT_PAYLOAD__ = v2Payload;

          // 사용자에게 마이그레이션 알림 (선택사항)
          if (typeof __sadvNotify === 'function') {
            __sadvNotify('V1 데이터가 V2 형식으로 자동 마이그레이션되었습니다');
          }

          return handleV2MultiAccount(v2Payload);
        }
      } catch (e) {
        console.error('[loadSiteList] V1 migration failed:', e);

        // 마이그레이션 실패 시 사용자에게 알림
        if (typeof showError === 'function') {
          showError(
            'V1 데이터 마이그레이션에 실패했습니다',
            e,
            'V1_Migration'
          );
        }

        return [];
      }
    }

    // V2 포맷이 아닌 경우 빈 배열 반환
    if (exportPayload && !exportPayload.__meta) {
      console.warn('[loadSiteList] Unsupported payload format (missing __meta)');
      return [];
    }
  }

  // Check if we have init data
  const initData = window.__sadvInitData;
  if (initData && initData.sites) {
    const sites = Object.keys(initData.sites);
    console.log('[loadSiteList] Found init data with sites:', sites);
    const allSites = getAllSites();
    allSites.length = 0;
    allSites.push(...sites);
    cacheSites(sites);
    return sites;
  }

  // Check merged data
  const mergedData = window.__sadvMergedData;
  if (mergedData && mergedData.sites) {
    const sites = Object.keys(mergedData.sites);
    console.log('[loadSiteList] Found merged data with sites:', sites);
    const allSites = getAllSites();
    allSites.length = 0;
    allSites.push(...sites);
    cacheSites(sites);
    return sites;
  }

  // Check cache
  if (!refresh) {
    const cached = lsGet(getSiteListCacheKey());
    if (cached && cached.sites && Array.isArray(cached.sites)) {
      console.log('[loadSiteList] Found cached sites:', cached.sites);
      const allSites = getAllSites();
      allSites.length = 0;
      allSites.push(...cached.sites);
      return cached.sites;
    }
  }

  console.log('[loadSiteList] No sites found, returning empty array');

  // P2 Issue #2: 레거시 캐시에서 V1 데이터 탐지 시도
  if (!refresh) {
    try {
      const migrationResult = detectAndMigrateV1Data();
      if (migrationResult.detected && migrationResult.migrated && migrationResult.payload) {
        console.log('[loadSiteList] V1 data detected and migrated from cache');

        // 마이그레이션된 데이터 처리
        window.__SEARCHADVISOR_EXPORT_PAYLOAD__ = migrationResult.payload;

        return handleV2MultiAccount(migrationResult.payload);
      }
    } catch (e) {
      console.warn('[loadSiteList] V1 cache migration failed:', e);
    }
  }

  // Legacy parity / fresh-profile recovery:
  // initData/mergedData/cache/export payload가 모두 비어 있는 board 페이지에서도
  // 예전 runtime은 encId -> api-board/list fallback으로 사이트 목록을 회복했다.
  // 새 크롬 프로필에서만 전체현황이 비는 회귀를 막기 위해,
  // 마지막 복구 경로로 이 fallback을 유지한다.
  const recoveredSites = await recoverSiteListFromBoardApi();
  if (recoveredSites.length) {
    const allSites = getAllSites();
    allSites.length = 0;
    allSites.push(...recoveredSites);
    cacheSites(recoveredSites);
    return recoveredSites;
  }

  const siteMatch = location.search.match(/site=([^&]+)/);
  if (siteMatch) {
    const recoveredSite = decodeURIComponent(siteMatch[1]);
    if (recoveredSite) {
      const allSites = getAllSites();
      allSites.length = 0;
      allSites.push(recoveredSite);
      cacheSites([recoveredSite]);
      return [recoveredSite];
    }
  }

  return [];
}

// ============================================================================
// P0-2: 계정 전환 UI 추가
// ============================================================================

/**
 * Switch to a different account in multi-account mode
 * @param {string} accountEmail - Account email to switch to
 */
function switchAccount(accountEmail) {
  if (!window.__sadvAccountState || !window.__sadvAccountState.isMultiAccount) {
    console.warn('[Account] Not multi-account mode');
    return;
  }

  const prevAccount = window.__sadvAccountState.currentAccount;

  // 현재 계정 업데이트
  window.__sadvAccountState.currentAccount = accountEmail;

  console.log(`[Account] Switching from ${prevAccount} to ${accountEmail}`);

  // 계정별 데이터 로드
  const accountData = window.__sadvAccountState.accountsData[accountEmail];
  if (!accountData) {
    console.error(`[Account] No data found for account: ${accountEmail}`);
    return;
  }

  // 현재 사이트가 이 계정에 있는지 확인
  const currentSite = curSite || null;
  const sitesInAccount = accountData.sites || [];

  // __sadvInitData 업데이트
  window.__sadvInitData.sites = accountData.dataBySite || {};
  window.__sadvInitData.currentAccount = accountEmail;

  // UI 업데이트
  if (typeof updateUIState === 'function') {
    updateUIState({ curAccount: accountEmail });
  }

  // 현재 사이트가 이 계정에 없으면 첫 번째 사이트로 변경
  if (currentSite && !sitesInAccount.includes(currentSite)) {
    const newSite = sitesInAccount[0] || null;
    if (typeof updateUIState === 'function') {
      updateUIState({ curSite: newSite });
    }
    if (newSite && typeof setComboSite === 'function') {
      setComboSite(newSite);
    }
  }

  // 사이트 콤보 재구축
  if (typeof buildCombo === 'function') {
    buildCombo(window.__sadvRows || null);
  }

  // 현재 뷰 다시 렌더링
  if (curMode === CONFIG.MODE.SITE && curSite) {
    if (typeof loadSiteView === 'function') {
      loadSiteView(curSite);
    }
  } else if (curMode === CONFIG.MODE.ALL) {
    if (typeof renderAllSites === 'function') {
      renderAllSites();
    }
  }

  if (typeof __sadvNotify === 'function') {
    __sadvNotify();
  }
}

/**
 * Get list of accounts in multi-account mode
 * @returns {Array} List of account objects
 */
function getAccountList() {
  if (!window.__sadvAccountState || !window.__sadvAccountState.isMultiAccount) {
    return [];
  }

  return window.__sadvAccountState.allAccounts.map(accKey => {
    const accData = window.__sadvAccountState.accountsData[accKey];
    return {
      email: accKey,
      label: accKey.split('@')[0],
      fullLabel: accKey,
      encId: accData?.encId || '',
      siteCount: accData?.sites?.length || 0
    };
  });
}

/**
 * Get current account in multi-account mode
 * @returns {string|null} Current account email or null
 */
function getCurrentAccount() {
  if (!window.__sadvAccountState || !window.__sadvAccountState.isMultiAccount) {
    return null;
  }
  return window.__sadvAccountState.currentAccount;
}

/**
 * Check if in multi-account mode
 * @returns {boolean} True if multi-account mode
 */
function isMultiAccountMode() {
  return !!(window.__sadvAccountState && window.__sadvAccountState.isMultiAccount);
}

/**
 * Get account state object
 * @returns {Object|null} Account state or null
 */
function getAccountState() {
  return window.__sadvAccountState || null;
}

/**
 * Update account state
 * @param {Object} state - New account state
 */
function setAccountState(state) {
  if (state && typeof state === 'object') {
    window.__sadvAccountState = state;
  }
}
