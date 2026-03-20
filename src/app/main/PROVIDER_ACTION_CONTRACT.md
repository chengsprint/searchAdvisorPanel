# Provider / Action Contract

이 문서는 UI가 의존해야 할 **public provider contract** 와
사용자 인터랙션이 들어가야 할 **action contract** 를 정의한다.

핵심 원칙:

> UI는 provider 세부 구현을 몰라야 하고,  
> live/saved 차이는 capabilities + actions + provider facade에서 흡수해야 한다.

---

## 1. 왜 필요한가

지금처럼 UI가 직접:
- `window.__sadvRows`
- `window.__sadvApi`
- `window.__SEARCHADVISOR_SNAPSHOT_API__`
- `curMode / curSite / curTab`

를 읽기 시작하면,
같은 UI / 다른 provider 구조로 가기 어렵다.

즉 이 문서는
**“UI가 무엇만 읽고 무엇만 호출해야 하는가”** 를 고정하기 위한 문서다.

---

## 2. 최소 provider contract

```js
provider = {
  kind: 'live' | 'snapshot',

  getCapabilities(),
  getShellState(),
  getAllSitesRows(),
  getAllSites(),
  getSiteMeta(),
  getMergedMeta(),
  getCacheMeta(),
  getSiteData(site),

  loadUiState(),
  saveUiState(patch),
}
```

### 설명
- `get*` 계열은 UI가 읽는 공용 seam
- `loadUiState/saveUiState`는 period/mode/site/tab 같은 뷰 상태를 보존하는 seam

---

## 3. live provider 전용 기능

```js
provider.refresh()
provider.downloadSnapshot()
provider.closePanel()
```

saved에서는 이 기능이 없어도 된다.

중요:
- saved가 이 API를 흉내 내는 것보다
- **capabilities에서 막고 action에서 no-op 처리**하는 방식이 더 안전하다.

---

## 4. capabilities contract

```js
capabilities = {
  canRefresh: boolean,
  canDownload: boolean,
  canClose: boolean,
  canChangeAllSitesPeriod: boolean,
  isReadOnly: boolean,
}
```

### 목적
UI가 직접 runtime kind를 보고 분기하지 않게 하기 위함.

예:
- refresh 버튼 노출 여부
- download 버튼 노출 여부
- close 버튼 노출 여부
- saved HTML에서 read-only 안내

---

## 5. action contract

UI는 provider를 직접 두드리지 말고 action을 호출한다.

```js
actions = {
  switchMode(mode),
  switchSite(site),
  switchTab(tab),
  setAllSitesPeriod(days),
  refresh(),
  downloadSnapshot(),
  close(),
}
```

설명:
- `switchSite(site)`는 canonical 의미를 가진 action이다.
  - 의미: **site 선택 + site mode 진입**
- `setSite(site)`는 기존 외부 호환성을 위해 public facade에 남아 있을 수 있지만,
  장기적으로는 `switchSite(site)` 쪽이 더 명확한 intent 이름으로 간주된다.

### public facade 게시 규칙

`window.__sadvApi`는 live/saved 모두가 공유하는 **canonical public facade 이름**으로 간주한다.

즉 앞으로는:

- live가 `window.__sadvApi = {...}` 를 직접 쓰는 구조
- saved가 별도로 `window.__sadvApi = api` 를 직접 쓰는 구조

를 유지하기보다,
가능한 한 공통 helper(`setRuntimePublicApi` / `clearRuntimePublicApi`)를 통해
게시/해제하도록 수렴시킨다.

이유:
- public entry 수렴이 쉬워진다.
- automation/QA가 runtime kind를 모른 채 같은 facade를 쓸 수 있다.
- saved richer API(`window.__SEARCHADVISOR_SNAPSHOT_API__`)와
  public facade(`window.__sadvApi`)의 역할을 분리해 유지하기 쉽다.

### 목적
- UI가 간단해짐
- live/saved 차이를 action layer가 흡수 가능
- 추후 공통 app entry로 갈 때 마이그레이션이 쉬움

---

## 6. 현재 코드에서 의미하는 것

현재 `07-data-provider.js`는 seam 수준이지만,
장기적으로는 이 파일이 **public provider facade** 의 중심이 되어야 한다.

즉 향후엔:
- `09-ui-controls.js`
- `10-all-sites-view.js`
- `11-site-view.js`

이쪽이 provider facade + action layer만 보게 정리해야 한다.

---

## 7. 금지사항

### 금지 1
UI에서 live provider 전용 API를 직접 호출하지 않는다.

### 금지 2
snapshot provider 전역을 UI가 직접 읽지 않는다.

### 금지 3
button visibility를 `runtimeKind === "snapshot"` 같은 하드코딩으로 처리하지 않는다.

### 금지 4
새 액션이 필요하다고 해서 UI 안에서 side effect를 직접 늘리지 않는다.

---

## 8. 작업자 체크리스트

새 UI/동작 추가 시 확인:

1. 이건 provider read인가, action인가?
2. capabilities에서 제어할 수 있는가?
3. live/saved가 같은 UI 코드를 그대로 쓸 수 있는가?
4. saved에서 no-op이어야 하는가, 숨겨야 하는가?

---

## 9. 한 줄 결론

UI는 앞으로

> **provider facade로 읽고, action layer로 행동하고, capabilities로 차이를 판단**

해야 한다.
