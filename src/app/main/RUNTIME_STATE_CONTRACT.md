# Runtime State Contract

이 문서는 live / saved(snapshot) / merge가 공유해야 할 **최소 공용 state shape**를 정의한다.

코드가 이 문서와 다르게 drift되면, 이후 리팩토링과 saved parity 검증이 매우 어려워진다.
즉, 이 문서는 단순 설명이 아니라 **공용 계약(contract)** 이다.

---

## 1. 목적

현재 상태는 여러 경로로 흩어져 있다.

- `curMode`
- `curSite`
- `curTab`
- `allSitesPeriodDays`
- `window.__sadvRows`
- `siteMeta`
- `mergedMeta`
- `runtimeVersion`

이렇게 흩어져 있으면:
- 어떤 상태가 canonical인지 애매해지고
- live/saved parity가 깨지고
- 새 기능 추가 시 saved-only 회귀가 잘 생긴다.

그래서 공용 state shape를 먼저 정의한다.

---

## 2. 권장 canonical shape

```js
state = {
  runtimeKind: 'live' | 'snapshot',

  selection: {
    mode: 'all' | 'site',
    site: string | null,
    tab: string,
  },

  allSitesUi: {
    periodDays: 90,
  },

  data: {
    allSites: string[],
    rows: Row[],
    siteMeta: Record<string, any>,
    mergedMeta: any,
    cacheMeta: any,
  },

  runtimeMeta: {
    version: string,
    accountLabel: string,
  }
}
```

---

## 3. 필드 의미

### `runtimeKind`
- `live`
- `snapshot`

UI가 saved 전용 분기를 직접 만들기 위해 남용하는 용도가 아니라,
capability와 provider 동작을 구분하기 위한 **최소 meta**다.

### `selection`
현재 사용자가 보고 있는 뷰 선택 상태.

- `mode`
- `site`
- `tab`

이 값은 saved HTML에서도 반드시 복원 가능해야 한다.

### `allSitesUi.periodDays`
전체현황 전용 뷰 상태.

주의:
- global filter가 아니다
- site mode 전체에 영향을 주면 안 된다
- canonical data를 바꾸는 값이 아니다

### `data.rows`
canonical summary rows.

중요:
- 이 값은 90일 정본 row 의미를 유지해야 한다
- display용 파생 계산 결과를 여기에 덮어쓰면 안 된다

### `data.siteMeta / data.mergedMeta / data.cacheMeta`
provider가 공급하는 meta state.

saved에서도 이 값은 가능한 한 같은 의미로 유지돼야 한다.

### `runtimeMeta`
버전/계정 라벨 같은 설명용 meta.

saved와 live 사이에서 불일치가 나면 디버깅과 사용자 안내가 어려워진다.

---

## 4. 현재 코드에 대응되는 임시 매핑

현재 코드는 아직 완전한 shape로 정리되지 않았기 때문에,
아래처럼 임시 대응으로 생각한다.

- `curMode` -> `selection.mode`
- `curSite` -> `selection.site`
- `curTab` -> `selection.tab`
- `allSitesPeriodDays` -> `allSitesUi.periodDays`
- `window.__sadvRows` -> `data.rows`
- `window.__SEARCHADVISOR_RUNTIME_VERSION__` -> `runtimeMeta.version`

중요:
- 이 매핑은 최종 상태가 아니라 **Phase 1 임시 정렬표**다.
- 향후 코드 정리 시 이 방향으로 수렴시켜야 한다.

---

## 5. 금지사항

### 금지 1
새 UI 기능이 필요하다고 해서 state를 임의 전역 변수로 또 추가하지 않는다.

### 금지 2
display용 계산 결과를 canonical state에 덮어쓰지 않는다.

### 금지 3
saved에서만 필요한 임시 값이라고 해서 shell state 밖에 숨기지 않는다.

### 금지 4
`selection` / `allSitesUi` / `data`를 섞어서 취급하지 않는다.

---

## 6. 작업자 지침

향후 state 관련 변경 시 반드시 확인할 것:

1. 이 값은 selection인가, all-sites local UI state인가, canonical data인가?
2. saved HTML에서도 복원되어야 하는가?
3. provider가 공급해야 하는가, UI가 계산해야 하는가?
4. 기존 canonical 의미를 깨지는 않는가?

---

## 7. 한 줄 결론

runtime state는 앞으로

> **selection / allSitesUi / canonical data / runtime meta**

로 나눠서 생각해야 하며, 이 경계를 흐리게 만드는 변경은 회귀 위험이 높다.
