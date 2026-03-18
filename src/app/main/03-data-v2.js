// ============================================================
// DATA-V2 - V2 multi-account support and migration
// ============================================================

// ============================================================================
// V2 다중 계정 구조 지원 완성
// ============================================================================

/**
 * Handle V2 multi-account payload
 * @param {Object} payload - V2 export payload
 * @param {string} mergeStrategy - Merge strategy (NEWER, FIRST, SOURCE, ALL)
 * @returns {Array} List of site URLs
 */
function handleV2MultiAccount(payload, mergeStrategy = MERGE_STRATEGIES.DEFAULT) {
  // P1: V2 데이터 검증
  // 1. 기본 V2 포맷 검증
  if (!DATA_VALIDATION.isValidV2Payload(payload)) {
    console.error('[V2 Multi-Account] Invalid V2 payload format');
    return [];
  }

  // 2. 메타데이터 검증
  const meta = payload.__meta;
  if (!meta.version || !meta.exportedAt) {
    console.error('[V2 Multi-Account] Invalid metadata');
    return [];
  }

  // 3. 스키마 버전 검증
  if (!SCHEMA_VERSIONS.isSupported(meta.version)) {
    console.warn(`[V2 Multi-Account] Unsupported schema version: ${meta.version}`);
  }

  // 4. 계정 데이터 검증 및 유효한 계정만 필터링
  const accountKeys = Object.keys(payload.accounts);
  if (accountKeys.length === 0) {
    console.error('[V2 Multi-Account] No accounts found');
    return [];
  }

  const validAccounts = [];
  for (const accKey of accountKeys) {
    const account = payload.accounts[accKey];
    if (DATA_VALIDATION.isValidAccount(account)) {
      // P1: 데이터 일관성 검증
      const validation = DATA_VALIDATION.validateAccountData(account);
      if (!validation.valid) {
        console.warn(`[V2 Multi-Account] Account ${accKey} data inconsistency:`, validation);

        // 불일치가 있는 계정은 유효 목록에 추가하지 않음 (원본 데이터 보존)
        if (validation.missingData.length > 0 || validation.orphanSites.length > 0) {
          console.warn(`[V2 Multi-Account] Skipping ${accKey}: ${validation.missingData.length} missing, ${validation.orphanSites.length} orphan sites`);
        }
      } else {
        validAccounts.push(accKey);
      }
    } else {
      console.warn(`[V2 Multi-Account] Invalid account structure: ${accKey}`);
    }
  }

  if (validAccounts.length === 0) {
    console.error('[V2 Multi-Account] No valid accounts found');
    return [];
  }

  console.log(`[V2 Multi-Account] Found ${validAccounts.length} valid accounts (out of ${accountKeys.length} total)`);

  // P0-2: 다중 계정 상태 저장
  window.__sadvAccountState = {
    isMultiAccount: validAccounts.length > 1,
    currentAccount: validAccounts[0],
    allAccounts: validAccounts,
    accountsData: {},
    mergeStrategy: mergeStrategy
  };

  // 모든 계정 데이터 사이트별 병합
  const mergedSites = {};
  const siteOwnership = {}; // site -> [accountEmails]

  for (const accKey of validAccounts) {
    const account = payload.accounts[accKey];
    const sites = account.sites || [];

    for (const site of sites) {
      // 사이트별로 계정 목록 추적
      if (!siteOwnership[site]) {
        siteOwnership[site] = [];
      }
      siteOwnership[site].push(accKey);

      // 데이터 병합 (전략에 따라 처리)
      const siteData = account.dataBySite?.[site];
      if (siteData) {
        let shouldMerge = false;

        switch (mergeStrategy) {
          case MERGE_STRATEGIES.NEWER:
            // 최신 데이터 우선
            const existingTime = mergedSites[site]?.__meta?.__fetched_at ||
                                 mergedSites[site]?._merge?.__fetchedAt || 0;
            const newTime = siteData.__meta?.__fetched_at ||
                           siteData._merge?.__fetchedAt || 0;
            shouldMerge = !mergedSites[site] || newTime > existingTime;
            break;

          case MERGE_STRATEGIES.FIRST:
            // 첫 번째 계정 데이터 우선 (이미 병합된 데이터 유지)
            shouldMerge = !mergedSites[site];
            break;

          case MERGE_STRATEGIES.SOURCE:
            // 소스 데이터 우선 (나중에 들어온 데이터로 덮어쓰기)
            shouldMerge = true;
            break;

          case MERGE_STRATEGIES.ALL:
            // 모든 데이터 보존 - 현재는 첫 번째만 사용 (향후 확장)
            shouldMerge = !mergedSites[site];
            break;

          default:
            // 알 수 없는 전략은 NEWER로 처리
            const defTime = mergedSites[site]?.__meta?.__fetched_at ||
                            mergedSites[site]?._merge?.__fetchedAt || 0;
            const srcTime = siteData.__meta?.__fetched_at ||
                           siteData._merge?.__fetchedAt || 0;
            shouldMerge = !mergedSites[site] || srcTime > defTime;
        }

        if (shouldMerge) {
          mergedSites[site] = siteData;
        }
      }
    }

    // 계정별 데이터 저장
    window.__sadvAccountState.accountsData[accKey] = {
      encId: account.encId,
      sites: sites,
      siteMeta: account.siteMeta || {},
      dataBySite: account.dataBySite || {}
    };
  }

  // 병합된 사이트 데이터를 __sadvInitData에 저장
  window.__sadvInitData = {
    sites: mergedSites,
    siteOwnership: siteOwnership,
    isV2: true,
    currentAccount: accountKeys[0],
    _rawPayload: payload
  };

  const siteList = Object.keys(mergedSites);
  console.log(`[V2 Multi-Account] Merged ${siteList.length} sites from ${accountKeys.length} accounts`);

  // Update allSites array through cache module
  const allSites = getAllSites();
  allSites.length = 0;
  allSites.push(...siteList);

  return siteList;
}

// ============================================================================
// V1 MIGRATION FUNCTIONS
// ============================================================================

/**
 * V1 페이로드 유효성 검증
 * @param {Object} payload - 검증할 V1 페이로드
 * @returns {Object} { valid: boolean, errors: string[], version: string }
 */
function validateV1Payload(payload) {
  if (!payload || typeof payload !== 'object') {
    return {
      valid: false,
      errors: ['페이로드가 객체가 아닙니다'],
      version: null
    };
  }

  const errors = [];

  // V1 필수 필드 검증 (sites 또는 dataBySite 중 하나는 있어야 함)
  const hasSites = payload.sites && typeof payload.sites === 'object';
  const hasDataBySite = payload.dataBySite && typeof payload.dataBySite === 'object';

  if (!hasSites && !hasDataBySite) {
    errors.push('sites 또는 dataBySite 필드가 없습니다');
  }

  // V1 스키마 버전 확인
  const schemaVersion = payload.__schema_version || payload[V1_SCHEMA.META.SCHEMA_VERSION] || '1.0';

  if (V1_MIGRATION.SUPPORTED_V1_VERSIONS.indexOf(schemaVersion) === -1) {
    errors.push(`지원하지 않는 V1 스키마 버전: ${schemaVersion}`);
  }

  // encId 검증 (선택사항이지만 있으면 검증)
  if (payload.encId && typeof payload.encId !== 'string') {
    errors.push('encId 필드가 문자열이 아닙니다');
  }

  // savedAt 검증 (선택사항이지만 있으면 검증)
  if (payload.savedAt && !DATA_VALIDATION.isValidTimestamp(payload.savedAt)) {
    errors.push('savedAt 타임스탬프가 유효하지 않습니다');
  }

  return {
    valid: errors.length === 0,
    errors: errors,
    version: schemaVersion
  };
}

/**
 * V1 페이로드를 V2 페이로드로 변환
 * @param {Object} v1Payload - V1 페이로드
 * @param {Object} options - 변환 옵션
 * @returns {Object} V2 페이로드
 */
function migrateV1ToV2(v1Payload, options = {}) {
  const {
    accountEmail = null,
    encId = null,
    validate = true
  } = options;

  // 유효성 검증
  if (validate) {
    const validation = validateV1Payload(v1Payload);
    if (!validation.valid) {
      console.error('[migrateV1ToV2] Invalid V1 payload:', validation.errors);
      throw new Error(`유효하지 않은 V1 페이로드: ${validation.errors.join(', ')}`);
    }
  }

  // 계정 이메일 결정 (우선순위: options > payload > ACCOUNT_UTILS)
  const finalAccountEmail = accountEmail ||
                            v1Payload.__source_account ||
                            ACCOUNT_UTILS.getAccountLabel() ||
                            'unknown@naver.com';

  // encId 결정
  const finalEncId = encId ||
                     v1Payload.__source_enc_id ||
                     v1Payload.encId ||
                     ACCOUNT_UTILS.getEncId() ||
                     'unknown';

  // V1 데이터 추출
  const v1Sites = v1Payload.sites || {};
  const v1DataBySite = v1Payload.dataBySite || {};
  const v1SiteMeta = v1Payload.siteMeta || {};

  // V2 구조로 변환
  const v2Payload = {
    __meta: {
      version: PAYLOAD_V2.VERSION,
      exportedAt: v1Payload.savedAt || Date.now(),
      migratedFrom: 'V1',
      migratedAt: Date.now(),
      originalVersion: v1Payload.__schema_version || '1.0'
    },
    accounts: {
      [finalAccountEmail]: {
        encId: finalEncId,
        sites: [],
        dataBySite: {},
        siteMeta: v1SiteMeta
      }
    }
  };

  // sites 배열 결합 (V1의 sites와 dataBySite 키 통합)
  const allSiteKeys = new Set([
    ...Object.keys(v1Sites),
    ...Object.keys(v1DataBySite)
  ]);

  // 사이트 데이터 변환
  for (const siteUrl of allSiteKeys) {
    const siteData = v1Sites[siteUrl] || {};
    const detailData = v1DataBySite[siteUrl] || {};

    // 기본 사이트 데이터 구조 생성
    const migratedSiteData = {
      expose: siteData.expose || detailData.expose || null,
      crawl: siteData.crawl || detailData.crawl || null,
      backlink: siteData.backlink || detailData.backlink || null,
      diagnosisMeta: siteData.diagnosisMeta || detailData.diagnosisMeta || null,
      detailLoaded: siteData.detailLoaded || detailData.detailLoaded || false,
      __cacheSavedAt: siteData.__cacheSavedAt || detailData.__cacheSavedAt || null,
      // 마이그레이션 메타데이터
      __source: finalAccountEmail,
      __fetchedAt: siteData.__fetched_at || detailData.__fetched_at || null,
      __version: 1,
      __accountId: finalEncId,
      __migratedFrom: 'V1',
      __migratedAt: Date.now()
    };

    // 추가 필드 복사 (알 수 없는 필드 보존)
    const allKeys = new Set([
      ...Object.keys(siteData),
      ...Object.keys(detailData)
    ]);

    const knownFields = ['expose', 'crawl', 'backlink', 'diagnosisMeta',
                         'detailLoaded', '__cacheSavedAt', '__fetched_at',
                         '__source', '__version', '__accountId'];

    for (const key of allKeys) {
      if (!knownFields.includes(key)) {
        migratedSiteData[key] = siteData[key] || detailData[key];
      }
    }

    // V2 구조에 추가
    v2Payload.accounts[finalAccountEmail].sites.push(siteUrl);
    v2Payload.accounts[finalAccountEmail].dataBySite[siteUrl] = migratedSiteData;
  }

  // UI 상태 초기화 (선택사항)
  if (v1Payload.curMode || v1Payload.curSite || v1Payload.curTab) {
    v2Payload.ui = {
      curMode: v1Payload.curMode || CONFIG.MODE.ALL,
      curSite: v1Payload.curSite || null,
      curTab: v1Payload.curTab || 'overview'
    };
  }

  console.log('[migrateV1ToV2] Migration completed:', {
    from: v1Payload.__schema_version || '1.0',
    to: PAYLOAD_V2.VERSION,
    account: finalAccountEmail,
    siteCount: v2Payload.accounts[finalAccountEmail].sites.length
  });

  return v2Payload;
}

/**
 * V2 페이로드를 V1 페이로드로 변환 (롤백)
 * @param {Object} v2Payload - V2 페이로드
 * @param {Object} options - 변환 옵션
 * @returns {Object} V1 페이로드
 */
function migrateV2ToV1(v2Payload, options = {}) {
  const {
    accountEmail = null,
    includeMetadata = true
  } = options;

  // V2 페이로드 검증
  if (!DATA_VALIDATION.isValidV2Payload(v2Payload)) {
    console.error('[migrateV2ToV1] Invalid V2 payload');
    throw new Error('유효하지 않은 V2 페이로드');
  }

  // 변환할 계정 결정
  const targetAccount = accountEmail ||
                        Object.keys(v2Payload.accounts)[0] ||
                        ACCOUNT_UTILS.getAccountLabel();

  if (!targetAccount || !v2Payload.accounts[targetAccount]) {
    throw new Error(`계정을 찾을 수 없습니다: ${targetAccount}`);
  }

  const account = v2Payload.accounts[targetAccount];

  // V1 구조로 변환
  const v1Payload = {
    sites: {},
    dataBySite: account.dataBySite || {},
    siteMeta: account.siteMeta || {},
    savedAt: v2Payload.__meta?.exportedAt || Date.now(),
    encId: account.encId || ''
  };

  // 메타데이터 추가
  if (includeMetadata) {
    v1Payload.__schema_version = '1.0';
    v1Payload.__source_account = targetAccount;
    v1Payload.__source_enc_id = account.encId;
    v1Payload.__rolled_back_from = v2Payload.__meta?.version || PAYLOAD_V2.VERSION;
    v1Payload.__rolled_back_at = Date.now();
  }

  // sites 배열 기반으로 sites 객체 구성
  if (Array.isArray(account.sites)) {
    for (const siteUrl of account.sites) {
      const siteData = account.dataBySite?.[siteUrl] || {};
      v1Payload.sites[siteUrl] = {
        expose: siteData.expose || null,
        crawl: siteData.crawl || null,
        backlink: siteData.backlink || null,
        diagnosisMeta: siteData.diagnosisMeta || null,
        detailLoaded: siteData.detailLoaded || false,
        __cacheSavedAt: siteData.__cacheSavedAt || null
      };
    }
  }

  // UI 상태 복원
  if (v2Payload.ui) {
    v1Payload.curMode = v2Payload.ui.curMode;
    v1Payload.curSite = v2Payload.ui.curSite;
    v1Payload.curTab = v2Payload.ui.curTab;
  }

  console.log('[migrateV2ToV1] Rollback completed:', {
    from: v2Payload.__meta?.version || PAYLOAD_V2.VERSION,
    to: '1.0',
    account: targetAccount,
    siteCount: account.sites?.length || 0
  });

  return v1Payload;
}

/**
 * 레거시 캐시 호환성 유지를 위한 데이터 변환
 * @param {string} cacheKey - localStorage 캐시 키
 * @param {Object} data - 캐시 데이터
 * @returns {Object} 변환된 데이터
 */
function normalizeLegacyCache(cacheKey, data) {
  if (!data || typeof data !== 'object') {
    return data;
  }

  // V1 캐시 키 패턴 확인
  const isV1Key = cacheKey.includes('sadv_data_v1') ||
                  cacheKey.includes('sadv_sites_v1');

  if (!isV1Key) {
    return data; // V2 캐시는 그대로 반환
  }

  // V1 캐시 데이터 변환
  const normalized = { ...data };

  // V1 데이터 구조를 V2 호환 형태로 변환
  if (normalized.sites && !normalized.dataBySite) {
    // V1 sites 객체를 dataBySite로 변환
    normalized.dataBySite = normalized.sites;
    delete normalized.sites;
  }

  // 캐시 저장 시간 표준화
  if (normalized.ts && !normalized.__cacheSavedAt) {
    normalized.__cacheSavedAt = normalized.ts;
  }

  console.log('[normalizeLegacyCache] V1 cache normalized:', cacheKey);

  return normalized;
}

/**
 * localStorage에서 V1 데이터 탐지 및 마이그레이션
 * @returns {Object} { detected: boolean, migrated: boolean, payload: Object|null }
 */
function detectAndMigrateV1Data() {
  console.log('[detectAndMigrateV1Data] Scanning for V1 data...');

  // V1 localStorage 키 패턴 검색
  const v1Keys = Object.keys(localStorage).filter(key =>
    key.startsWith('sadv_') && (key.includes('v1') || key.includes('sites'))
  );

  if (v1Keys.length === 0) {
    console.log('[detectAndMigrateV1Data] No V1 data found');
    return { detected: false, migrated: false, payload: null };
  }

  console.log(`[detectAndMigrateV1Data] Found ${v1Keys.length} V1 keys:`, v1Keys);

  let v1Payload = null;
  let migrationSuccess = false;

  try {
    // 사이트 목록 캐시 확인
    const sitesCacheKey = v1Keys.find(key => key.includes('sites'));
    if (sitesCacheKey) {
      const cachedData = JSON.parse(localStorage.getItem(sitesCacheKey));
      if (cachedData && cachedData.sites) {
        v1Payload = {
          sites: cachedData.sites.reduce((acc, siteUrl) => {
            acc[siteUrl] = {};
            return acc;
          }, {}),
          savedAt: cachedData.ts || Date.now()
        };
      }
    }

    // 데이터 캐시 확인 및 병합
    const dataCacheKeys = v1Keys.filter(key => key.includes('data'));
    if (dataCacheKeys.length > 0) {
      if (!v1Payload) v1Payload = { sites: {}, dataBySite: {}, savedAt: Date.now() };

      for (const cacheKey of dataCacheKeys) {
        try {
          const cachedData = JSON.parse(localStorage.getItem(cacheKey));
          if (cachedData && cachedData.data) {
            // URL 디코딩 (V1 캐시 키에서 사이트 URL 추출)
            const siteUrl = extractSiteUrlFromCacheKey(cacheKey);
            if (siteUrl) {
              v1Payload.dataBySite[siteUrl] = cachedData.data;
              if (!v1Payload.sites[siteUrl]) {
                v1Payload.sites[siteUrl] = {};
              }
            }
          }
        } catch (e) {
          console.warn(`[detectAndMigrateV1Data] Failed to parse cache: ${cacheKey}`, e);
        }
      }
    }

    // V1 데이터 마이그레이션
    if (v1Payload && (Object.keys(v1Payload.sites).length > 0 || Object.keys(v1Payload.dataBySite).length > 0)) {
      const v2Payload = migrateV1ToV2(v1Payload, { validate: false });

      // 마이그레이션 로그 저장
      const migrationLog = {
        detectedAt: Date.now(),
        migratedAt: Date.now(),
        v1Keys: v1Keys,
        status: V1_MIGRATION.STATUS.SUCCESS,
        siteCount: Object.keys(v1Payload.sites).length
      };
      localStorage.setItem(V1_MIGRATION.LS_KEYS.LAST_MIGRATION, JSON.stringify(migrationLog));

      migrationSuccess = true;

      return {
        detected: true,
        migrated: true,
        payload: v2Payload,
        log: migrationLog
      };
    }

    return { detected: true, migrated: false, payload: null };
  } catch (e) {
    console.error('[detectAndMigrateV1Data] Migration failed:', e);
    return {
      detected: true,
      migrated: false,
      payload: null,
      error: e.message
    };
  }
}

/**
 * V1 캐시 키에서 사이트 URL 추출 (헬퍼 함수)
 * @param {string} cacheKey - V1 캐시 키
 * @returns {string|null} 사이트 URL 또는 null
 */
function extractSiteUrlFromCacheKey(cacheKey) {
  try {
    // V1 캐시 키 패턴: sadv_data_v2_{namespace}_{encodedUrl}
    const parts = cacheKey.split('_');
    if (parts.length >= 4) {
      const encodedPart = parts.slice(3).join('_');
      // Base64 디코딩 시도
      const decoded = atob(encodedPart);
      return decodeURIComponent(decoded);
    }
  } catch (e) {
    console.warn('[extractSiteUrlFromCacheKey] Failed to decode:', cacheKey, e);
  }
  return null;
}

/**
 * V1 데이터 백업 생성
 * @param {Object} v1Payload - 백업할 V1 페이로드
 * @returns {string} 백업 키
 */
function backupV1Data(v1Payload) {
  const backupKey = V1_MIGRATION.LS_KEYS.V1_BACKUP + Date.now();
  const backupData = {
    payload: v1Payload,
    backedUpAt: Date.now(),
    version: v1Payload.__schema_version || '1.0'
  };

  try {
    localStorage.setItem(backupKey, JSON.stringify(backupData));
    console.log('[backupV1Data] V1 data backed up to:', backupKey);
    return backupKey;
  } catch (e) {
    console.error('[backupV1Data] Backup failed:', e);
    throw new Error('V1 데이터 백업 실패');
  }
}

/**
 * 마이그레이션 가능한 V1 데이터 확인
 * @param {Object} payload - 확인할 페이로드
 * @returns {boolean} 마이그레이션 가능 여부
 */
function canMigrateV1(payload) {
  if (!payload || typeof payload !== 'object') {
    return false;
  }

  // V2 페이로드인 경우 (이미 마이그레이션됨)
  if (payload.__meta && payload.accounts) {
    return false;
  }

  // V1 페이로드 필수 필드 확인
  const hasV1Fields = payload.sites || payload.dataBySite;
  return hasV1Fields;
}

/**
 * 마이그레이션 통계 반환
 * @returns {Object} 마이그레이션 통계
 */
function getMigrationStats() {
  try {
    const lastMigration = localStorage.getItem(V1_MIGRATION.LS_KEYS.LAST_MIGRATION);
    if (lastMigration) {
      return JSON.parse(lastMigration);
    }
  } catch (e) {
    console.error('[getMigrationStats] Failed to parse migration log:', e);
  }

  return {
    detectedAt: null,
    migratedAt: null,
    status: null,
    siteCount: 0
  };
}
