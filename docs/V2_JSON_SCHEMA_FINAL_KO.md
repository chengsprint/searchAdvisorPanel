# SearchAdvisor V2 JSON Schema 최종 명세

**버전**: 1.0
**상태**: ✅ 확정
**작성일**: 2026-03-18

---

## 📋 전체 구조

```json
{
  "__meta": { ... },
  "accounts": {
    "account@email.com": {
      "encId": "...",
      "sites": ["url1", "url2"],
      "siteMeta": { "url1": { ... } },
      "dataBySite": { "url1": { ... } }
    }
  },
  "ui": { ... },
  "stats": { ... },
  "_siteOwnership": { ... }
}
```

---

## 🔤 필드 상세

### `__meta` (필수)
메타데이터 정보

```json
{
  "__meta": {
    "version": "1.0",                    // 스키마 버전
    "savedAt": "2026-03-18T10:30:00.000Z",  // 저장 시간
    "exportedAt": "2026-03-18T10:30:00.000Z", // 내보내기 시간
    "generator": "SearchAdvisor Runtime",    // 생성자
    "generatorVersion": "1.0.0",            // 생성자 버전
    "accountCount": 2                       // 계정 수
  }
}
```

### `accounts` (필수)
중첩 계정 구조

```json
{
  "accounts": {
    "user@naver.com": {
      "encId": "encrypted-id-123",         // 계정 encId
      "sites": [                           // 사이트 목록 (배열)
        "https://site1.com",
        "https://site2.com"
      ],
      "siteMeta": {                        // 사이트 메타데이터 (객체)
        "https://site1.com": {
          "label": "내 사이트"
        }
      },
      "dataBySite": {                      // 사이트 데이터 (객체)
        "https://site1.com": {
          "__meta": { ... },
          "expose": { ... },
          "crawl": null,
          "backlink": null,
          "detailLoaded": true
        }
      }
    }
  }
}
```

### `ui` (필수)
현재 UI 상태

```json
{
  "ui": {
    "curMode": "all",              // "all" | "site"
    "curSite": "https://site1.com", // 현재 선택 사이트
    "curTab": "overview",          // 현재 탭
    "curAccount": "user@naver.com"  // 현재 계정 (다중 계정 시)
  }
}
```

### `stats` (필수)
수집 통계

```json
{
  "stats": {
    "success": 10,      // 성공한 사이트 수
    "partial": 0,       // 부분 성공
    "failed": 0,        // 실패
    "errors": []        // 에러 메시지 목록
  }
}
```

### `_siteOwnership` (선택, 다중 계정 시)
사이트 소유권 추적

```json
{
  "_siteOwnership": {
    "https://site1.com": ["user1@naver.com", "user2@naver.com"],
    "https://site2.com": ["user1@naver.com"]
  }
}
```

---

## ✅ 설계 결정 및 이유

### 1. `sites`는 배열인 이유
```
"sites": ["url1", "url2", "url3"]  ✅ 배열
```

- **순서 보장**: 사용자 정렬, 추가 순서 유지
- **순회 용이**: `for`문으로 자연스럽게 순회
- **목록 표시**: UI에 순서대로 표시

### 2. `dataBySite`는 객체인 이유
```
"dataBySite": {
  "url1": { ... },
  "url2": { ... }
}  ✅ 객체
```

- **O(1) 조회**: `dataBySite[url]`로 즉시 찾기
- **URL 중복 방지**: 키이므로 자동으로 중복 방지
- **성능**: 사이트가 많을 때 조회가 빠름

### 3. 3개로 분리한 이유
```
sites      → 순서, 순회, 목록 표시용
siteMeta   → 메타데이터 O(1) 조회용
dataBySite → 데이터 O(1) 조회용
```

- **목적 분리**: 각자의 역할이 명확
- **성능 최적화**: 조회가 빈번하므로 객체 사용
- **확장성**: 새로운 필드 추가 용이

---

## 📊 완전 예시

### 단일 계정
```json
{
  "__meta": {
    "version": "1.0",
    "savedAt": "2026-03-18T10:30:00.000Z",
    "exportedAt": "2026-03-18T10:30:00.000Z",
    "generator": "SearchAdvisor Runtime",
    "generatorVersion": "1.0.0",
    "accountCount": 1
  },
  "accounts": {
    "myemail@naver.com": {
      "encId": "my-enc-id",
      "sites": [
        "https://mysite.com",
        "https://myothersite.com"
      ],
      "siteMeta": {
        "https://mysite.com": {
          "label": "내 사이트"
        },
        "https://myothersite.com": {
          "label": "내 다른 사이트"
        }
      },
      "dataBySite": {
        "https://mysite.com": {
          "__meta": {
            "__source": "myemail@naver.com",
            "__fetched_at": 1742318400000,
            "__schema": "1.0"
          },
          "expose": {
            "items": [
              {
                "period": {
                  "start": "20260301",
                  "end": "20260315"
                },
                "logs": [
                  {
                    "date": "20260301",
                    "clickCount": 100,
                    "exposureCount": 1000
                  }
                ]
              }
            ]
          },
          "crawl": null,
          "backlink": null,
          "detailLoaded": true
        },
        "https://myothersite.com": { ... }
      }
    }
  },
  "ui": {
    "curMode": "site",
    "curSite": "https://mysite.com",
    "curTab": "daily",
    "curAccount": "myemail@naver.com"
  },
  "stats": {
    "success": 2,
    "partial": 0,
    "failed": 0,
    "errors": []
  }
}
```

### 다중 계정
```json
{
  "__meta": {
    "version": "1.0",
    "savedAt": "2026-03-18T10:30:00.000Z",
    "exportedAt": "2026-03-18T10:30:00.000Z",
    "generator": "SearchAdvisor Runtime",
    "generatorVersion": "1.0.0",
    "accountCount": 2
  },
  "accounts": {
    "account1@naver.com": {
      "encId": "enc-1",
      "sites": [
        "https://shared-site.com",
        "https://account1-only.com"
      ],
      "siteMeta": {
        "https://shared-site.com": { "label": "공유 사이트" },
        "https://account1-only.com": { "label": "계정1 전용" }
      },
      "dataBySite": {
        "https://shared-site.com": { ... },
        "https://account1-only.com": { ... }
      }
    },
    "account2@naver.com": {
      "encId": "enc-2",
      "sites": [
        "https://shared-site.com",
        "https://account2-only.com"
      ],
      "siteMeta": {
        "https://shared-site.com": { "label": "공유 사이트" },
        "https://account2-only.com": { "label": "계정2 전용" }
      },
      "dataBySite": {
        "https://shared-site.com": { ... },
        "https://account2-only.com": { ... }
      }
    }
  },
  "ui": {
    "curMode": "all",
    "curSite": null,
    "curTab": "overview",
    "curAccount": "account1@naver.com"
  },
  "stats": {
    "success": 3,
    "partial": 0,
    "failed": 0,
    "errors": []
  },
  "_siteOwnership": {
    "https://shared-site.com": ["account1@naver.com", "account2@naver.com"],
    "https://account1-only.com": ["account1@naver.com"],
    "https://account2-only.com": ["account2@naver.com"]
  }
}
```

---

## 🎯 데이터 접근 패턴

### 사이트 목록 순회
```javascript
const sites = payload.accounts[email].sites;
for (const site of sites) {
  console.log(site);  // 순서대로 출력
}
```

### 특정 사이트 데이터 조회
```javascript
const siteData = payload.accounts[email].dataBySite["https://site.com"];
// O(1) 즉시 조회
```

### 특정 사이트 메타데이터 조회
```javascript
const meta = payload.accounts[email].siteMeta["https://site.com"];
// O(1) 즉시 조회
```

---

## 📝 버전 관리

| 버전 | 날짜 | 변경 사항 |
|------|------|-----------|
| 1.0  | 2026-03-18 | 최초 명세, 다중 계정 지원 추가 |
