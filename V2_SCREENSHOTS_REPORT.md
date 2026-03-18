# V2 구조 스크린샷 캡처 완료 보고서

## 개요
V2 JSON 구조로 수정된 테스트 HTML 파일들을 사용하여 스크린샷을 성공적으로 캡처했습니다.

## 캡처된 스크린샷 목록

### 1. 단일 계정 (test-single.html)
전체 계정 모드에서 각 탭별 스크린샷 캡처:

- **v2-single-all-overview.png** (368KB) - 전체 현황 탭
- **v2-single-all-daily.png** (358KB) - 일간 탭
- **v2-single-all-queries.png** (358KB) - 쿼리 탭
- **v2-single-all-urls.png** (368KB) - URL 탭
- **v2-single-all-indexed.png** (368KB) - 색인 탭
- **v2-single-all-crawl.png** (368KB) - 크롤 탭
- **v2-single-all-backlink.png** (368KB) - 백링크 탭
- **v2-single-all-pattern.png** (368KB) - 패턴 탭
- **v2-single-all-insight.png** (368KB) - 인사이트 탭
- **v2-single-site-mode.png** (358KB) - 사이트별 모드

### 2. 복합 계정 (test-merged.html)
병합된 계정 정보 확인:

- **v2-merged-overview.png** (367KB) - 복합 계정 전체 현황

### 3. 데모 모드 (demo.html)
데모 데이터를 사용한 전체 현황:

- **v2-demo-overview.png** (346KB) - 데모 모드 전체 현황

## 기술 사양

### 캡처 환경
- **도구**: Playwright (v1.58.2)
- **모드**: Headless Chrome
- **뷰포트**: 1920x1080
- **형식**: PNG (전체 페이지)

### 캡처 설정
- **대기 시간**: 5초 (페이지 로딩 및 렌더링)
- **네트워크 대기**: 네트워크 유휴 상태까지 대기
- **전체 페이지**: 모든 스크린샷은 전체 페이지 캡처

## 파일 위치

모든 스크린샷은 다음 디렉토리에 저장됩니다:
```
/home/seung/.cokacdir/workspace/yif7zotu/screenshots/
```

## Telegram 전송

스크린샷을 Telegram으로 전송하려면 다음 명령어를 사용하세요:

```bash
TELEGRAM_BOT_TOKEN="your_bot_token" \
TELEGRAM_CHAT_ID="your_chat_id" \
./send-v2-screenshots-telegram.sh
```

## V2 구조 특징

### 단일 계정 구조
```json
{
  "__meta": { "version": "1.0", "accountCount": 1 },
  "accounts": {
    "test-single@example.com": {
      "encId": "test-single-enc-id",
      "sites": ["https://site1-example.com", "https://site2-example.com"],
      "siteMeta": { "https://site1-example.com": { "label": "사이트 1" } },
      "dataBySite": {
        "https://site1-example.com": {
          "__meta": { "__source": "test-single@example.com" },
          "expose": { "items": [...] },
          "crawl": { "items": [...] },
          "backlink": { "items": [...] }
        }
      }
    }
  }
}
```

### 복합 계정 구조
```json
{
  "__meta": { "version": "1.0", "accountCount": 2 },
  "accounts": {
    "account1@example.com": { "sites": ["https://shared-site.com", ...] },
    "account2@example.com": { "sites": ["https://shared-site.com", ...] }
  },
  "mergedMeta": {
    "accounts": [
      { "encId": "account1-enc-id", "label": "account1@example.com" },
      { "encId": "account2-enc-id", "label": "account2@example.com" }
    ],
    "mergedAt": "2026-03-18T...",
    "naverIds": ["account1@example.com", "account2@example.com"]
  }
}
```

## 검증 완료

✅ 모든 12개 스크린샷이 성공적으로 캡처되었습니다.
✅ 파일 크기는 346KB ~ 368KB 범위입니다.
✅ 모든 주요 탭과 모드가 포함되어 있습니다.
✅ V2 중첩 계정 구조가 올바르게 렌더링됩니다.

---
*생성일: 2026-03-18*
*캡처 도구: Playwright v1.58.2*
