# ColumnPager 설계 계획서

> `/gstack-plan-eng-review`로 작성 · 브랜치: feat/columnpager-package
> 상태: DRAFT (구현 전 계획) · 작성일: 2026-06-05

ColumnPager를 처음부터 재설계한다. V1은 **개념·검증된 수학만 참고**하고, 폴더 구조·네이밍·아키텍처는 전면 새로 짠다. 동작은 동일하게 보장하되, V1에서 발견한 잠재 버그 하나(재생성 dedup)는 의도적으로 고친다.

---

## 1. 목표와 비목표

**목표**
- V1과 **기능적으로 동일하게 동작**: 4개 컨트롤(ColumnBreaker/PageBreaker/PageInformation/StableChecker), 작은 요소 정상 흐름, 큰 요소 CSS-column 분할 이어짓기, A4 페이지·헤더/푸터·dividers·pageDirection·hidden·loading·onPagesGenerated·getPageRangeByInformation·decorator 패턴.
- 복잡도/가독성 개선: god-hook(210줄) 해체, 4곳 복붙된 advance 로직 단일화, stringly-typed DOM 통신 제거, 타입 인덱스시그니처 제거.
- 순수 로직 100% 유닛테스트 가능.

**비목표 (NOT in scope)** — 11절 참조.

---

## 2. V1 분석 요약

### 2.1 파이프라인 (11단계)

```
children
  │ ① 안정화 게이트: useDeferredValue + requestIdleCallback → isStable
  ▼
② Fragment 평탄화(재귀)
  ▼
③ 전처리(async): child→ColumnItem 래핑(inner/inner-div/threshold 측정 div)
  │   + decorator 높이측정·2뎁스 Fragment 벗기기 + pageInformation sticky 전파
  ▼
④ usePageGenerator.calculateItemLayout  ← 핵심(210줄)
  │   columnCount별 오프스크린 측정(캐시) → 아이템 순회하며
  │   pageNumber/columnInPage/columnHeightAccumulated/itemIndex/currentColumnCount 추적
  │   PageBreaker→다음페이지(+columnCount변경시 잔여 재측정)
  │   ColumnBreaker→다음컬럼(꽉차면 페이지)
  │   itemHeight>columnHeight→크롭 분할 / 일반→누적 후 넘치면 advance
  │   → ItemLayout[] → groupItemsByPage
  ▼
⑤ pagesData(useMemo): groupBy(columnInPage) → [page][col][item]
  ▼
⑥ PageRenderer: Page/Column/ColumnItem. cropped는 translateX/Y + height 클립
  ▼
⑦ HTML emit(effect): rAF로 checkAllStable 폴링 → convertElementToHtmlString → onPagesGenerated
```

### 2.2 크롭 트릭 (검증된 핵심 — 이식 대상)
키 큰 아이템을 `columnCount:1` inner div에 넣으면, 세로로 넘친 내용이 **CSS 멀티컬럼으로 가로로 흐른다.** `cropCount = round(innerDivWidth / innerWidth)`. 각 조각은 `translateX(-N×innerItemWidth)` + 외부 `height` 클립 + `overflow:hidden`으로 표시. `offsetHeight`로 이전 컬럼 이어받기, `threshold` 마커로 마지막 조각 실제 높이 측정. (subpixel 반올림 보정 등 V1이 고생해서 맞춘 부분 포함)

### 2.3 핵심 문제점
| # | 문제 | 위치 |
|---|---|---|
| 1 | god hook/component, 6개 가변상태 동시 변경 | usePageGenerator.ts:151-364 |
| 2 | 이중 인덱스(`i` vs `itemIndex`) 수동 동기화 | usePageGenerator.ts:173-361 |
| 3 | "column++; if≥count then page++" 로직 4곳 복붙 (DRY 위반) | 192-348 |
| 4 | stringly-typed DOM 통신(data-* + querySelector) | constants/measureSize 전반 |
| 5 | 재생성 dedup이 `.length` 기반 (잠재 버그) | usePageGenerator.ts:386, index.tsx:310 |
| 6 | 안정화/dedup 메커니즘 4개 분산 | index.tsx + usePageGenerator |
| 7 | `MeasureSizeResult` 인덱스시그니처 → `as Size` 캐스팅 난무 | types.ts:57 |
| 8 | ColumnItem이 제어흐름(breaker/info 반환) 누수 | Column.tsx:30-54 |

---

## 3. V2 아키텍처

### 3.1 폴더 구조
```
ColumnPager/
  core/                  ← 순수 함수 (React/DOM 무관, 100% 유닛테스트)
    blocks.ts            Block 타입 + toBlocks(children) 변환
    paginate.ts          paginate() 상태머신 (advanceColumn/advancePage 단일 프리미티브)
    slice.ts             computeSlices() 큰 아이템 슬라이스 계산 (V1 수학 이식)
    signature.ts         blocksSignature() 구조 시그니처 (재생성 dedup)
    types.ts             Page/Column/Placement/MeasuredBlock 등 (인덱스시그니처 없음)
  measure/
    measureBlocks.ts     measureBlocks()/measureOverflow() 오프스크린 측정 (V1 이식)
    offscreen.ts         컨테이너 생성/정리
  components/
    A4.tsx Page.tsx Column.tsx Header.tsx Footer.tsx ItemCell.tsx SliceView.tsx
  controls/
    PageBreak.tsx ColumnBreak.tsx SectionMark.tsx StableGate.tsx
  ColumnPager.tsx      얇은 오케스트레이터 (usePagination 사용)
  index.ts
```

### 3.2 데이터 흐름 (3계층 분리)
```
                  ┌─────────────────────────────────────────────┐
   children ──►   │ measure/  (DOM 계층)                          │
                  │  measureBlocks(blocks, metrics) → Measured[]  │
                  └───────────────────┬─────────────────────────┘
                                      │ MeasuredBlock[] (순수 데이터)
                                      ▼
                  ┌─────────────────────────────────────────────┐
                  │ core/  (순수 계층 — React/DOM 무관)            │
                  │  paginate(measured, metrics, opts) → Page[]   │
                  │   └ crop.computeSlices() (큰 아이템)           │
                  └───────────────────┬─────────────────────────┘
                                      │ Page[] (순수 데이터)
                                      ▼
                  ┌─────────────────────────────────────────────┐
                  │ components/  (React 계층)                     │
                  │  <Page><Column><CropView/></Column></Page>   │
                  └───────────────────┬─────────────────────────┘
                                      ▼  emit (stable 후)
                          onPagesGenerated(pagesData, htmlString)
```
핵심: V1의 stringly-typed DOM 통신을 **타입드 블록 스트림**으로 대체. 측정 결과는 인덱스시그니처 없는 명시 타입.

### 3.3 블록 모델 (타입드, discriminated union)
```ts
type Block =
  | { kind: 'content'; node: ReactNode; section?: string; decoratorHeight?: number }
  | { kind: 'pageBreak'; columnCount?: number }
  | { kind: 'columnBreak' }
  | { kind: 'sectionMark'; section: string };

type MeasuredBlock = Extract<Block, { kind: 'content' }> & {
  container: Size;     // 바깥(셀) 측정
  flowWidth: number;   // 멀티컬럼으로 흐른 전체 폭 (sliceCount 계산용)
  sliceWidth: number;  // 한 컬럼(슬라이스) 폭
};
// pageBreak/columnBreak/sectionMark 블록은 측정 불필요 → 측정 단계 통과
```
`toBlocks(children)`(`blocks.ts`)가 V1의 ③전처리(Fragment 평탄화·decorator·sticky section)를 **순수 함수**로 흡수. 컨트롤은 마커 컴포넌트 + 타입 가드로 인식(querySelector 제거).

### 3.4 페이지네이션 상태머신 (`paginate.ts`)
```
Cursor = { pageIndex, columnIndex, filledHeight, columnCount }

advanceColumn(cursor):                 ← 단일 진실 (V1의 4곳 복붙 제거)
  cursor.columnIndex += 1; cursor.filledHeight = 0
  if cursor.columnIndex >= cursor.columnCount:
    cursor.pageIndex += 1; cursor.columnIndex = 0

advancePage(cursor):
  cursor.pageIndex += 1; cursor.columnIndex = 0; cursor.filledHeight = 0

paginate(blocks, metrics, opts) → Page[]:
  cursor = { pageIndex:0, columnIndex:0, filledHeight:0, columnCount: initial }
  section = undefined; placements: Placement[] = []
  for b in blocks:
    sectionMark → section = b.section                    (sticky, 미배치)
    pageBreak   → advancePage; if b.columnCount: 재측정 신호
    columnBreak → advanceColumn
    content:
      h = b.container.height
      h <= remainingHeight(cursor, metrics) → place; filledHeight += h
      h <= columnHeight(cursor)             → advanceColumn; place; filledHeight = h
      else (큰 아이템)                       → computeSlices(...) 후 슬라이스별 배치
  return groupByPage(placements)
```

### 3.5 슬라이스 (`slice.ts`, 순수)
`computeSlices(measured, cursor, metrics, opts) → Slice[]` — V1의 sliceCount(=flowWidth/sliceWidth, subpixel round)/carryOffset/contentEnd/shiftX 수학을 **그대로 이식**. 입력은 측정 수치(순수), 출력은 슬라이스 메타(`{ index, count, clipHeight, carryOffset, shiftX }`). `<SliceView>`가 메타를 받아 `transform: translateX(-shiftX)` + `clipHeight` + `overflow:hidden` 렌더(V1 index.tsx:207-251 인라인 로직을 전용 컴포넌트로 분리).

---

## 4. 컨트롤 (전부 구현, 동작 동일)
| 컨트롤 (V2) | V1 | 동작 | V2 구현 |
|---|---|---|---|
| `ColumnBreak` | ColumnBreaker | 다음 열로 이동 | 마커 → `columnBreak` 블록 → `advanceColumn` |
| `PageBreak` | PageBreaker | 다음 페이지로 이동(+columnCount 변경) | 마커 → `pageBreak{columnCount?}` → `advancePage` + 재측정 |
| `SectionMark` | PageInformation | 페이지 메타데이터(sticky section) | 마커 → `sectionMark{section}` → 커서 section 갱신 |
| `StableGate` | StableChecker | 렌더 완료 체크 | `stable` prop, emit 전 rAF 폴링 + timeout(결정 #4) |
컴파운드 API: `ColumnPager.PageBreak / .ColumnBreak / .SectionMark / .StableGate`.

---

## 5. 결정 사항 (이번 리뷰에서 확정)
1. **범위:** 클린 재설계 + 검증된 크롭/측정 수학 이식 (전면 클린룸 재작성 아님 — 회귀 위험 제거).
2. **재생성 dedup:** `.length` → **구조 시그니처**(key+type+주요 props 해시). V1의 잠재 버그(길이 같고 내용 다르면 재계산 안 됨)를 고침. ⚠️ V1과 미세하게 다른 동작.
3. **테스트:** 순수 core는 유닛테스트로 전수, 측정·크롭 렌더는 Storybook 기반 브라우저 통합테스트.
4. **stable timeout:** V2에 `stableTimeoutMs` + `onStableTimeout` 추가해 무한 미생성 방지. ⚠️ V1에 없던 신규 동작.

---

## 6. 테스트 계획

### 6.1 커버리지
```
CORE (vitest, 합성 fixture — 결정적, happy-dom 무관)
[+] core/paginate.ts
  ├── 작은 아이템: 컬럼 채우기 / 넘침→다음컬럼 / 페이지 wrap   [unit ★★★]
  ├── PageBreak (+columnCount 변경 재측정 신호)               [unit ★★★]
  ├── ColumnBreak (꽉 찬 페이지 wrap)                         [unit ★★★]
  ├── SectionMark sticky 전파                                 [unit ★★★]
  └── 큰 아이템 슬라이스: sliceCount/carryOffset/연속성/마지막조각 [unit ★★★]
[+] core/slice.ts       flowWidth/sliceWidth, contentEnd, subpixel round [unit ★★★]
[+] core/signature.ts   blocksSignature: 길이같음+내용다름→재계산        [unit ★★★]
[+] core/blocks.ts      toBlocks: Fragment평탄화/decorator/sticky 변환   [unit ★★★]

DOM/렌더 (Storybook 기반 브라우저 통합 — 실제 레이아웃 필요)
[+] measure/measureBlocks  측정 정확도(컬럼폭 기준 height)          [→E2E]
[+] SliceView              shiftX/clipHeight 클리핑 시각 연속성     [→E2E]
[+] 통합: children→PDF htmlString 산출 + stable 게이트              [→E2E]

목표 커버리지: core 100%, DOM 계층 통합테스트로 핵심 경로 커버
```

### 6.2 회귀 방지 (IRON RULE)
구조 시그니처 변경(결정 #2)은 동작을 바꾸므로 **회귀 테스트 필수**: "children 길이 동일 + key/내용 변경 → 재페이지네이션 발생" 유닛테스트를 critical로 추가.

---

## 7. 측정 어댑터 (`measure/`)
V1 measureSize.ts를 이식: 오프스크린 컨테이너 + `createRoot`+`flushSync`, 청크(30) 렌더, `requestIdleCallback`+더블 `requestAnimationFrame`+`document.fonts.ready` 대기, `batchMeasure`(read-only DOM 패스로 layout thrashing 방지). 차이: 반환 타입을 인덱스시그니처 없는 `MeasuredBlock`으로 정규화, 측정 대상은 문자열 data-key 대신 타입드 enum.

---

## 8. 실패 모드 (production)
| 코드패스 | 실패 시나리오 | 테스트 | 에러 처리 | 사용자 노출 |
|---|---|---|---|---|
| paginate 무한 루프 | sliceCount=0/NaN로 진행 안 됨 | unit(경계값) | sliceCount<1 가드 | (방지) |
| measure가 0 반환 | 폰트 미로드/레이아웃 미완 | E2E | fonts.ready+rAF 대기 | 빈 페이지 대신 재시도 |
| stable 영원히 false | 비동기 자식이 stable 안 알림 | E2E | **rAF 폴링 + timeout fallback(V2 신규)** | timeout 후 onStableTimeout 호출(또는 강제 emit) |
| 시그니처 충돌 | 다른 내용이 같은 해시 | unit | key 포함으로 완화 | 드묾 |

✅ **해결(결정 #4):** V1의 stable rAF 폴링은 timeout이 없어(index.tsx:325-343) 비동기 자식이 영원히 stable=false면 emit이 안 됨. **V2는 `stableTimeoutMs` prop(기본값 예: 5000)을 추가**해 초과 시 `onStableTimeout?.()` 콜백 호출 후 강제 emit. 무한 미생성 방지. ⚠️ V1에 없던 신규 동작. E2E로 timeout 경로 검증.

---

## 9. 빌드 순서 (병렬화)

| Step | 모듈 | 의존 |
|---|---|---|
| S1 | core/types, blocks | — |
| S2 | core/paginate, crop, signature | S1 |
| S3 | measure/ | S1 |
| S4 | components/, controls/ | S1 |
| S5 | ColumnPager.tsx (오케스트레이터) | S2,S3,S4 |
| S6 | index.ts + 통합/E2E 테스트 | S5 |

```
Lane A: S1 → S2 (순수 core, 유닛테스트 동반)
Lane B: S3 (measure)           ← S1 후 독립
Lane C: S4 (components/controls)← S1 후 독립
→ A,B,C 병렬 가능. 모두 머지 후 S5 → S6.
```
충돌 위험: 셋 다 `core/types.ts`만 공유(읽기) → 낮음.

---

## 10. 이미 존재하는 것 (재사용)
- `convertElementToHtmlString` ([lib/pdf](../../lib/pdf/convertElementToHtmlString.ts)) — 그대로 재사용.
- `cn` ([lib/utils](../../lib/utils.ts)) — 그대로.
- V1 크롭/측정 **수학·타이밍** — `core/crop.ts`, `measure/`로 이식(재작성 아님).
- V1 레이아웃 컴포넌트(A4/Page/Column/Header/Footer) — 구조 참고해 재작성(제어흐름 누수 제거).

---

## 11. NOT in scope
- **V1 삭제/교체:** V2는 별도 폴더에 병존. V1 제거는 별도 작업.
- **A4 동적 사이즈:** V1의 고정값(794×1123) 유지(코드에 FIXME 있으나 본 작업 범위 밖).
- **공개 패키지 진입점(src/index.ts) 전환:** V2 안정화 후 별도 결정.
- **decorator 패턴 재설계:** 동작 보존만, API 단순화는 범위 밖.

(이전에 deferred였던 stable timeout fallback은 결정 #4로 **범위에 포함**됨.)

---

## 12. 완료 요약
- Step 0 범위: **클린 재설계 + 검증 로직 이식** (사용자 승인)
- Architecture: Option A가 골격 확정, 추가 이슈 0
- Code Quality: 1건(재생성 dedup) → 구조 시그니처로 수정 승인
- Test: 커버리지 다이어그램 작성, DOM 계층 2 gap → 브라우저 통합테스트로 커버 승인
- Performance: 이슈 0 (V1 최적화 이식)
- 실패 모드: critical gap 1건(stable timeout) → 결정 #4로 V2에 구현 (해소)
- 병렬화: 3 lane (S1 공유, 이후 A/B/C 병렬)
- 결정 4건 모두 사용자 승인 완료

---

## 13. 네이밍 규칙 (V1 → V2)

V1의 모호하거나 stringly-typed였던 이름을 **일관된 도메인 언어**로 통일한다. 구현은 이 표를 따른다.

### 13.1 도메인 용어 정의
- **block**: 페이지네이션 입력 단위(정규화). content / pageBreak / columnBreak / sectionMark 4종.
- **placement**: 한 블록이 어디에 놓이는지(페이지·컬럼·슬라이스).
- **slice**: 컬럼 높이보다 큰 콘텐츠를 잘라낸 한 조각(=V1의 "crop").
- **section**: 페이지가 속한 논리 구획 라벨(=V1의 "pageInformation", 예: vocabulary/answers).
- **cursor**: 페이지네이션 진행 상태(현재 페이지·컬럼·채운 높이).

### 13.2 타입/함수/변수 매핑
| 분류 | V1 | V2 | 이유 |
|---|---|---|---|
| 측정 단위 타입 | `MeasuredItem`/`MeasureSizeResult` | `MeasuredBlock` | 블록 모델 통일, 인덱스시그니처 제거 |
| 배치 정보 | `ItemLayout` | `Placement` | 의미 직관 |
| 크롭 조각 | `isCropped`/`croppedItemIndex`/`totalCroppedParts`/`cropCount` | `Slice`/`slice.index`/`slice.count` | crop→slice 통일, 중첩 구조 |
| 전처리 결과 | `flattenedChildren` | `blocks` | 정규화된 블록 스트림 |
| children 변환 | (인라인 전처리) | `toBlocks(children)` | 순수 함수로 추출 |
| 페이지네이션 | `calculateItemLayout`/`usePageGenerator` | `paginate()` / `usePagination()` | 동사 명확 |
| 측정 | `measureSize`/`measureElementSize` | `measureBlocks()` / `measureOverflow()` | 대상 명확 |
| 재생성 키 | (children `.length`) | `blocksSignature()` | 구조 시그니처 (결정 #2) |
| 페이지 범위 | `getPageRangeByInformation` | `getSectionPageRanges` | section 용어 통일 |
| **커서 상태** | | | |
| 누적 높이 | `columnHeightAccumulated` | `filledHeight` | 짧고 명확 |
| 컬럼 인덱스 | `columnInPage` | `columnIndex` | 일관 |
| 페이지 인덱스 | `pageNumber`(0-base인데 number) | `pageIndex` | 0-base 명시 |
| 컬럼 가용 높이 | `containerHeight` | `columnHeight` | 무엇의 높이인지 |
| **슬라이스 수학** | | | |
| 멀티컬럼 확장 전체 폭 | `innerDivSize.width` | `flowWidth` | CSS column으로 흐른 총 폭 |
| 한 컬럼 폭 | `innerSize.width`/`innerItemWidth` | `sliceWidth` | 슬라이스 폭 |
| 슬라이스 수 | `cropCount`(=innerDivW/innerW) | `sliceCount`(=flowWidth/sliceWidth) | 동일 수학, 명확 이름 |
| 콘텐츠 끝 위치 | `thresholdPosition.top` | `contentEnd` | 마지막 슬라이스 높이 기준 |
| 외부 클립 높이 | `height` | `clipHeight` | 클리핑 높이 명시 |
| 이어받기 오프셋 | `offsetHeight` | `carryOffset` | 이전 컬럼서 이어받은 양 |
| 가로 이동량 | `translateX`(인라인 계산) | `shiftX` | |
| **컴포넌트** | | | |
| 아이템 래퍼 | `ColumnItem` | `ItemCell` | 측정 셀 |
| 크롭 렌더 | (index.tsx 인라인 207-251) | `<SliceView>` | 전용 컴포넌트 분리 |
| 마커: 데코레이터 | `data-key=page-column-item-decorator` | `decorator`(개념 유지) | 기존 개념 유지 |
| **컨트롤(컴파운드)** | | | |
| 다음 열 | `ColumnBreaker` | `ColumnBreak` | 마커 일관 |
| 다음 페이지 | `PageBreaker` | `PageBreak` | |
| 섹션 라벨 | `PageInformation` | `SectionMark` | section 용어 |
| 렌더 게이트 | `StableChecker`/`isStable` | `StableGate`/`stable` prop | 게이트 의미 |
| **공개 데이터 타입** | | | |
| 3D 페이지 데이터 | `PagesData`/`PageData`/`PageItemData` | `Page[]` / `Page=Column[]` / `Column=Placement[]` | 평이한 중첩 |
| 콜백 | `onPagesGenerated(pages, html)` | 유지 (시그니처 동일, 타입만 `Page[]`) | API 친숙성 |

### 13.3 파일명 (3.1 반영)
`core/blocks.ts`(`toBlocks`) · `core/paginate.ts`(`paginate`,`advanceColumn`,`advancePage`) · `core/slice.ts`(`computeSlices`) · `core/signature.ts`(`blocksSignature`) · `measure/measureBlocks.ts` · `components/SliceView.tsx` · `controls/{PageBreak,ColumnBreak,SectionMark,StableGate}.tsx`.

> 주관적 선택(예: `SectionMark` vs `PageMark`, `StableGate` vs `RenderGate`, `slice` vs `crop`)은 거부권 환영 — 바꾸고 싶은 이름 알려주면 표 갱신.

---

## 14. eng-review 후속 반영 (구현 후)

`/plan-eng-review`에서 나온 보완점/기능 반영:

- **measurer 주입**: `usePagination`이 measurer 주입받음 → 훅 유닛테스트 가능, 측정 캐시 run 간 유지, 설정 변경 시 재페이지네이션, headless 사용 가능.
- **재계산 버그 수정**: 설정(header/footer/columnClassName/페이지크기) 변경이 재페이지네이션 트리거. 계산 중 입력 변경은 runId로 "마지막이 이긴다"(race/stale 방지).
- **페이지 크기/방향**: `pageSize`('A4'|'letter'|'legal') + `orientation` + 명시 `pageWidth`/`pageHeight`. (이전 §11의 "A4 동적 사이즈 NOT-in-scope" 해제)
- **HTML 옵션화**: `convertElementToHtmlString(html, options)` 폰트/페이지/기본 스타일 커스터마이즈, `htmlOptions` prop. 하드코딩 한국어 폰트 교체 가능.
- **공개 유틸**: `isSliced` / `getPageCount` / `findItemPage`.
- **가드/통지**: `columnHeight<=0` 가드(측정 실패 시 퇴화 방지), `onError` 콜백.
- **테스트**: core 유닛 + usePagination 훅 유닛(dedup/race/paused) = 44개.
