# V2 스크린샷 캡처 완료

## 실행 완료

V2 JSON 구조로 수정된 테스트 HTML 파일들의 스크린샷 캡처가 성공적으로 완료되었습니다.

## 캡처된 스크린샷 (12개)

### 단일 계정 (10개)
1. `v2-single-all-overview.png` - 전체 현황 탭
2. `v2-single-all-daily.png` - 일간 탭
3. `v2-single-all-queries.png` - 쿼리 탭
4. `v2-single-all-urls.png` - URL 탭
5. `v2-single-all-indexed.png` - 색인 탭
6. `v2-single-all-crawl.png` - 크롤 탭
7. `v2-single-all-backlink.png` - 백링크 탭
8. `v2-single-all-pattern.png` - 패턴 탭
9. `v2-single-all-insight.png` - 인사이트 탭
10. `v2-single-site-mode.png` - 사이트별 모드

### 복합 계정 (1개)
11. `v2-merged-overview.png` - 복합 계정 전체 현황

### 데모 모드 (1개)
12. `v2-demo-overview.png` - 데모 모드 전체 현황

## 사용 방법

### 스크린샷 캡처만 실행
```bash
./capture-and-send-v2.sh
```

### 캡처 후 Telegram 전송
```bash
TELEGRAM_BOT_TOKEN='your_token' \
TELEGRAM_CHAT_ID='your_chat_id' \
./capture-and-send-v2.sh send
```

### Telegram 전송만 실행 (이미 캡처된 스크린샷)
```bash
TELEGRAM_BOT_TOKEN='your_token' \
TELEGRAM_CHAT_ID='your_chat_id' \
./send-v2-screenshots-telegram.sh
```

## 파일 위치
```
/home/seung/.cokacdir/workspace/yif7zotu/screenshots/
```

## 주요 스크립트

1. **capture-v2-screenshots-v2.js** - Playwright를 사용한 스크린샷 캡처 메인 스크립트
2. **send-v2-screenshots-telegram.sh** - Telegram으로 스크린샷 전송
3. **capture-and-send-v2.sh** - 캡처 및 전송 통합 스크립트

## 기술 정보

- **도구**: Playwright v1.58.2
- **브라우저**: Chromium (Headless)
- **해상도**: 1920x1080
- **형식**: PNG (전체 페이지)
- **대기 시간**: 5초 (렌더링 완료 대기)

## 검증 결과

✅ 모든 12개 스크린샷이 성공적으로 캡처됨
✅ 파일 크기: 346KB ~ 368KB (정상 범위)
✅ 모든 주요 탭과 모드 포함
✅ V2 중첩 계정 구조 올바르게 렌더링됨

---
캡처 완료 시간: 2026-03-18
