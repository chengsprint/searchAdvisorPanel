# Snapshot Combo Top Layer Notes

## 목적

저장된 HTML(snapshot)에서 `사이트별 > 콤보박스 하단 팝업`이 `#sadv-bd` 뒤로 가려지지 않도록,
원본 패널과 최대한 유사한 체감으로 동작하게 만드는 전용 설계 메모입니다.

이 문서는 특히 아래 질문에 답하기 위해 작성되었습니다.

- 왜 저장본에서 콤보 드롭다운이 원본 패널과 100% 자동 동일화되지 않는가?
- 왜 별도 top-layer 처리가 필요한가?
- 이후 디자인이 바뀌면 어디를 같이 봐야 하는가?

---

## 문제 요약

저장본 HTML은 단순 DOM 스냅샷이 아니라, 오프라인에서도 탭/콤보/하위탭이 동작하도록
별도 snapshot runtime을 품고 있습니다.

그 결과 live panel과 snapshot HTML은 아래 차이가 있습니다.

1. live panel
   - 원래 패널 DOM과 stacking context 안에서 렌더됨
   - 콤보 드롭다운이 기존 패널 구조를 그대로 탐

2. snapshot HTML
   - 저장 시점 payload로 다시 부팅되는 오프라인 runtime
   - 본문(`#sadv-bd`)과 헤더 레이어 관계가 live와 완전히 동일하지 않음
   - 같은 CSS만 복사해도 하단 팝업이 본문 뒤로 깔릴 수 있음

즉, snapshot에서는 콤보 드롭다운 레이어를 별도로 다뤄야 합니다.

---

## 실제 확인된 증상

- `#sadv-combo-drop`의 하단이 `#sadv-bd`와 겹치는 영역에서
  `elementFromPoint(...)` 결과가 `#sadv-bd`를 반환
- 시각적으로는 드롭다운이 열려 있어도
  하단 일부가 본문 뒤로 들어간 것처럼 보임
- 저장본 기준 ref `@f5b1a86`에서 재현됨

---

## 근본 원인

### 1) Snapshot의 stacking context가 live와 다름

저장본은 헤더/본문/탭/콤보가 같은 패널에 있더라도, 실제 그려지는 순서와 레이어 체감이
live runtime과 완전히 동일하지 않았습니다.

### 2) 기본 CSS에 `!important`가 이미 많음

`#sadv-combo-drop`는 기본 스타일에서 다음과 같은 강한 규칙을 가집니다.

- `position:absolute !important`
- `z-index:120 !important`
- `display:block/none` 관련 규칙

그래서 단순히 JS에서:

```js
snapshotComboDrop.style.position = "fixed";
snapshotComboDrop.style.zIndex = "2147483646";
```

처럼 넣어도 실제 브라우저 계산 결과에는 반영되지 않을 수 있습니다.

즉, snapshot top-layer 전환은 반드시:

```js
style.setProperty(name, value, "important")
```

형태로 넣어야 합니다.

### 3) 오픈 직후 rect가 아직 0일 수 있음

`사이트별` 전환 직후 또는 콤보 open 직후에는 버튼 rect가 아직 안정화되지 않아
`getBoundingClientRect()`가 유효하지 않을 수 있습니다.

이 경우 위치 계산을 바로 하면:

- 0,0 근처
- 잘못된 viewport 좌표
- 기본 absolute 위치 fallback

같은 문제가 생깁니다.

그래서 snapshot에서는 **유효한 rect가 잡힐 때까지 retry**하는 로직이 필요합니다.

---

## 현재 채택한 해결 전략

### 원칙

저장본 콤보 드롭다운은 다음 5가지를 만족해야 합니다.

1. **panel/body 위의 top layer**
2. **viewport 기준 fixed 위치**
3. **기본 CSS의 !important를 이기는 inline important**
4. **오픈 직후 rect 안정화 재시도**
5. **resize/scroll/outside click와 동기화**

### 구현 요약

`src/app/main/12-snapshot.js` 에서:

1. `#sadv-combo-drop`를 `document.body`로 이동
2. `position: fixed`
3. `top/left/width/max-height/z-index/display`를
   `style.setProperty(..., "important")`로 지정
4. `scheduleSnapshotComboDropPositionSync()`로 rect retry
5. 아래 이벤트에서 위치 재동기화
   - open
   - input search
   - resize
   - scroll
   - mode switch
   - outside click close

---

## 왜 live와 snapshot이 완전히 자동 동일화되지 않는가?

핵심 이유는 **구조 차이**입니다.

- live panel은 기존 패널 구조 안에서 뜨는 드롭다운
- snapshot은 오프라인 HTML 안에서 다시 부팅되는 드롭다운

둘이 완전히 같은 DOM 층에 있지 않기 때문에,
인터랙션이 있는 popup 계열은 자동 동일화가 깨질 수 있습니다.

따라서 popup 계열은 앞으로도 아래 원칙으로 유지하는 것이 좋습니다.

### 권장 유지 원칙

1. 마크업은 최대한 공통화
2. 색/spacing/radius는 토큰 공유
3. live/snapshot 차이는 오직
   - 데이터 소스
   - 위치 계산
   로만 제한

---

## 이후 디자인 변경 시 꼭 같이 확인할 항목

원본 패널 디자인이 바뀌면 아래를 반드시 함께 확인해야 합니다.

1. 콤보 버튼 높이
2. 콤보 드롭다운 배경/테두리/그림자
3. 검색 input 스타일
4. active item 스타일
5. row 간 padding / min-height
6. portal 위치 계산
7. `elementFromPoint` 기준 실제 top layer 여부

특히 **디자인이 바뀌어도 snapshot top-layer 로직을 건드리지 않으면**
겉보기는 비슷하지만 레이어 버그가 다시 재발할 수 있습니다.

---

## 검증 체크리스트

### 기능

- `전체현황 -> 사이트별` 전환
- 콤보 open
- 사이트 검색 input 입력
- 다른 사이트 클릭 후 닫힘
- outside click 닫힘

### 레이어

- 드롭다운 하단이 `#sadv-bd`와 겹치는 좌표에서도
  `elementFromPoint(...)`가 드롭다운 내부 요소를 반환하는지 확인

### 시각

- 드롭다운이 본문 뒤로 들어가 보이지 않는지
- 그림자/면 분리감이 유지되는지
- 원본 패널과 popup surface 톤이 크게 다르지 않은지

---

## 권장 후속 작업

현재 top-layer 버그는 해결되었지만, 장기적으로는 아래가 좋습니다.

1. combo popup surface 스타일을 live/snapshot 공통 컴포넌트화
2. popup 전용 토큰 문서화
3. snapshot popup Playwright 회귀 테스트 추가

---

## 관련 파일

- `src/app/main/12-snapshot.js`
- `dist/runtime.js`
- `src/app/main/09-ui-controls.js`

