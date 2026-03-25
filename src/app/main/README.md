# `src/app/main/` 디렉토리 요약

이 디렉토리는 SearchAdvisor 런타임의 핵심 모듈이 모여 있는 곳입니다.
파일명 접두사는 대략적인 로딩/책임 순서를 반영합니다.

## 00 계층: 런타임 기초

- `00-react18-compat.js`
  - React 18 호환 레이어
- `00-constants.js`
  - 런타임 전역 상수, 아이콘, 토큰

## 01 계층: 공통 헬퍼

- `01-helpers.js`
  - 날짜/숫자/문자열/DOM 보조 함수

## 02 계층: DOM 셸

- `02-dom-init.js`
  - 헤더/컨테이너/상위 셸 DOM 구성
  - 현재 헤더 액션 셸 정규화의 기준 파일

## 03 계층: 데이터 수집과 상태 전처리

- `03-data-cache.js`
  - 캐시 판정과 저장 데이터 재사용
- `03-data-v2.js`
  - V2 payload 정규화/변환
- `03-data-api.js`
  - 데이터 취합용 API 보조
- `03-data-state.js`
  - 런타임 데이터 상태 조립
- `03-data-manager.js`
  - 위 모듈을 묶는 상위 엔트리

## 04 계층: 외부 API 연동

- `04-api.js`
  - 실제 원격 API 호출
  - 인증/권한 실패 감지와 전역 abort 계약의 핵심

## 05~07 계층: 동작 모드와 앱 상태

- `05-demo-mode.js`
  - 데모/샘플 실행 경로
- `06-merge-manager.js`
  - 병합 상태와 merge 관련 공통 처리
- `07-all-sites-period.js`
  - 전체현황 기간 상태 계산
- `07-data-provider.js`
  - live/saved/merge 데이터 공급 계층
- `07-ui-state.js`
  - 셸 상태, 스냅샷 상태, mergedMeta 유지

## 08 계층: 렌더러

- `08-renderers-*.js`
  - overview / daily / queries / pages / pattern / crawl / backlink / diagnosis / insight 렌더러
- `08-renderers.js`
  - 렌더러 레지스트리와 조합

## 09~11 계층: 상단 UI와 화면 전환

- `09-ui-controls.js`
  - 상단 액션, 상태 칩, 저장/엑셀/새로고침 동기화
  - 현재 live/snapshot action model의 핵심
- `10-all-sites-view.js`
  - 전체현황 화면
- `11-site-view.js`
  - 사이트별 상세 화면

## 12~15 계층: 스냅샷 / 갱신 / 내보내기

- `12-snapshot.js`
  - HTML 저장본 생성, 저장본 재오픈, merged snapshot 호환 처리
  - 현재 merge/saved shell 정렬의 핵심 경계
- `13-refresh.js`
  - 새로고침 파이프라인
- `14-init.js`
  - 최종 런타임 초기화
- `15-export-xlsx.js`
  - XLSX 생성과 다운로드 경로

## 실무상 가장 자주 보는 파일

- 저장/엑셀/헤더 UI: `02-dom-init.js`, `09-ui-controls.js`, `12-snapshot.js`, `15-export-xlsx.js`
- 데이터/인증: `03-data-*`, `04-api.js`, `07-data-provider.js`
- 병합/스냅샷: `06-merge-manager.js`, `12-snapshot.js`, 루트 `merge.py`

## 수정 시 주의점

- `12-snapshot.js`와 `legacy-main.js`는 저장본 재오픈 계약에 연결됩니다.
- 헤더 액션 구조를 바꿀 때는 live/saved/merge 세 경로를 함께 봐야 합니다.
- `merge.py`는 payload 조립기이고, UI 의미 체계는 이 디렉토리의 shell/runtime 계약을 따라야 합니다.

## 관련 문서

- [`src/app/` 문서](../README.md)
- [`scripts/` 문서](../../../scripts/README.md)
- [`dist/` 문서](../../../dist/README.md)
