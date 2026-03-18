/**
 * External Constants - Module for tree-shaking optimization
 * These constants can be loaded separately to reduce initial bundle size
 * @version 1.0.0
 */

// ============================================================
// P2-3: API RESPONSE SCHEMAS
// ============================================================
/**
 * API 응답 스키마 정의
 * 각 API 엔드포인트의 예상 응답 구조를 정의
 */
const API_RESPONSE_SCHEMAS = {
  /**
   * Expose API 응답 스키마
   * GET /report/expose/{encId}
   */
  EXPOSE: {
    type: 'object',
    required: ['code'],
    properties: {
      code: { type: 'number', enum: [0] },
      message: { type: 'string', optional: true },
      items: {
        type: 'array',
        optional: true,
        items: {
          type: 'object',
          properties: {
            period: {
              type: 'object',
              optional: true,
              properties: {
                prevClickRatio: { type: 'number', optional: true },
                prevExposeRatio: { type: 'number', optional: true }
              }
            },
            logs: {
              type: 'array',
              optional: true,
              items: {
                type: 'object',
                properties: {
                  date: { type: 'string' },
                  clickCount: { type: 'number' },
                  exposeCount: { type: 'number' },
                  ctr: { type: 'number' }
            }
              }
            },
            urls: {
              type: 'array',
              optional: true,
              items: {
                type: 'object',
                properties: {
                  key: { type: 'string' },
                  clickCount: { type: 'number' },
                  exposeCount: { type: 'number' },
                  ctr: { type: 'number' }
                }
              }
            },
            querys: {
              type: 'array',
              optional: true,
              items: {
                type: 'object',
                properties: {
                  key: { type: 'string' },
                  clickCount: { type: 'number' },
                  exposeCount: { type: 'number' },
                  ctr: { type: 'number' }
                }
              }
            }
          }
        }
      }
    }
  },

  /**
   * Crawl API 응답 스키마
   * GET /report/crawl/{encId}
   */
  CRAWL: {
    type: 'object',
    required: ['code'],
    properties: {
      code: { type: 'number', enum: [0] },
      message: { type: 'string', optional: true },
      items: {
        type: 'array',
        optional: true,
        items: {
          type: 'object',
          properties: {
            stats: {
              type: 'array',
              optional: true,
              items: {
                type: 'object',
                properties: {
                  date: { type: 'string' },
                  pageCount: { type: 'number' },
                  downloadSize: { type: 'number' },
                  sumErrorCount: { type: 'number' },
                  sumTryCount: { type: 'number' },
                  notFound: { type: 'number', optional: true },
                  serverError: { type: 'number', optional: true },
                  connectTimeout: { type: 'number', optional: true }
                }
              }
            }
          }
        }
      }
    }
  },

  /**
   * Backlink API 응답 스키마
   * GET /report/backlink/{encId}
   */
  BACKLINK: {
    type: 'object',
    required: ['code'],
    properties: {
      code: { type: 'number', enum: [0] },
      message: { type: 'string', optional: true },
      items: {
        type: 'array',
        optional: true,
        items: {
          type: 'object',
          properties: {
            countTime: {
              type: 'array',
              optional: true,
              items: {
                type: 'object',
                properties: {
                  timeStamp: { type: 'string' },
                  backlinkCnt: { type: 'number' }
                }
              }
            },
            topDomain: {
              type: 'array',
              optional: true,
              items: {
                type: 'object',
                properties: {
                  domain: { type: 'string' },
                  backlinkCnt: { type: 'number' }
                }
              }
            }
          }
        }
      }
    }
  },

  /**
   * Diagnosis Meta API 응답 스키마
   * GET /report/diagnosis/meta/{encId}
   */
  DIAGNOSIS_META: {
    type: 'object',
    required: ['code'],
    properties: {
      code: { type: 'number', enum: [0] },
      message: { type: 'string', optional: true },
      items: {
        type: 'array',
        optional: true,
        items: {
          type: 'object',
          properties: {
            meta: {
              type: 'array',
              optional: true,
              items: {
                type: 'object',
                properties: {
                  date: { type: 'string' },
                  stateCount: {
                    type: 'object',
                    optional: true,
                    properties: {
                      '1': { type: 'number' },  // indexed
                      '2': { type: 'number' },  // pending
                      '3': { type: 'number' },  // error
                      '4': { type: 'number' }   // dropped
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  }
};

/**
 * API 응답 검증 함수
 * @param {object} response - 검증할 API 응답 객체
 * @param {string} apiType - API 유형 ('EXPOSE', 'CRAWL', 'BACKLINK', 'DIAGNOSIS_META')
 * @returns {object} { valid: boolean, errors: string[] }
 */
function validateApiResponse(response, apiType) {
  const schema = API_RESPONSE_SCHEMAS[apiType];
  if (!schema) {
    return { valid: false, errors: [`Unknown API type: ${apiType}`] };
  }

  const errors = [];

  // null 체크
  if (!response || typeof response !== 'object') {
    return { valid: false, errors: ['Response is null or not an object'] };
  }

  // 필수 필드 검증
  if (schema.required) {
    for (const field of schema.required) {
      if (!(field in response)) {
        errors.push(`Missing required field: ${field}`);
      }
    }
  }

  // code 필드 검증 (대부분의 API 응답에 있음)
  if ('code' in response && response.code !== 0) {
    errors.push(`API returned error code: ${response.code}`);
  }

  // items 배열 구조 검증
  if (schema.properties.items && response.items) {
    if (!Array.isArray(response.items)) {
      errors.push('items field is not an array');
    } else if (response.items.length > 0) {
      const firstItem = response.items[0];
      if (!firstItem || typeof firstItem !== 'object') {
        errors.push('items[0] is not a valid object');
      }
    }
  }

  return {
    valid: errors.length === 0,
    errors
  };
}

/**
 * 안전한 JSON 파싱 함수
 * @param {Response} response - fetch Response 객체
 * @param {string} apiType - API 유형
 * @returns {Promise<object|null>} 파싱된 데이터 또는 null
 */
async function safeParseJson(response, apiType) {
  try {
    const data = await response.json();
    const validation = validateApiResponse(data, apiType);

    if (!validation.valid) {
      console.warn(`[API] ${apiType} validation warnings:`, validation.errors);
      // 데이터가 있으면 반환하고, 에러만 기록
      if (data && typeof data === 'object') {
        return data;
      }
    }
    return data;
  } catch (e) {
    console.error(`[API] ${apiType} JSON parse error:`, e);
    return null;
  }
}

// Export for external loading
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    API_RESPONSE_SCHEMAS,
    validateApiResponse,
    safeParseJson
  };
}
