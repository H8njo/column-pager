# Reference — column-pager API

`column-pager`가 내보내는 모든 공개 표면. 값과 기본값은 소스(`src/components/ColumnPager`)에서 직접 가져왔다.

- 빠른 시작은 [튜토리얼](tutorial.md), 작업별 사용법은 [How-to](how-to.md), 동작 원리는 [설명](explanation.md) 참고.

## `<ColumnPager>`

children을 반응형 멀티컬럼 페이지로 페이지네이션하는 메인 컴포넌트.

```tsx
import { ColumnPager } from 'column-pager';
```

### Props (`ColumnPagerProps`)

| Prop | 타입 | 기본값 | 설명 |
|---|---|---|---|
| `children` | `ReactNode` | — | 페이지네이션할 콘텐츠. 컴파운드 컨트롤을 섞을 수 있다. |
| `columnCount` | `number` | `1` | 페이지당 컬럼 수. `PageBreak.changeColumnCountTo`로 페이지별 변경 가능. 0/음수/소수는 1 이상 정수로 보정된다. |
| `pageDirection` | `'vertical' \| 'horizontal'` | `'vertical'` | 페이지 나열 방향. |
| `pageHeight` | `number` | `1123` | 페이지 높이(px). 폭은 prop이 아니라 컨테이너에 맞춰 반응형. `0` 이하면 기본값으로 폴백. |
| `resizeDebounceMs` | `number` | `150` | 컨테이너 폭 변경 후 재페이지네이션까지의 디바운스(ms). |
| `loading` | `boolean` | — | `true`면 계산/렌더를 보류. |
| `hidden` | `boolean` | — | 화면에서 숨기되 DOM은 유지(측정/`onPagesGenerated`용). |
| `columnClassName` | `string` | — | 각 컬럼에 적용할 클래스. |
| `showDividers` | `boolean` | — | 컬럼 사이 구분선 표시. |
| `moveOversizedItemToNextColumn` | `boolean` | `false` | 컬럼 높이 초과 아이템을, 이미 채워진 컬럼에선 자르기 전에 다음 컬럼으로 먼저 보낸다. |
| `header` | `(info: PageInfo) => ReactNode` | — | 페이지 헤더 렌더. `pageNumber`로 분기해 페이지별로 다르게 가능. |
| `footer` | `(info: PageInfo) => ReactNode` | — | 페이지 푸터 렌더. |
| `onPagesGenerated` | `(pages: Page[], html: string) => void` | — | 페이지 생성 완료 콜백. `html`은 렌더된 컨테이너 `outerHTML`. |
| `stableTimeoutMs` | `number` | `5000` | StableGate settle 폴링 타임아웃(ms). 초과 시 `onStableTimeout` 후 강제 emit. |
| `onStableTimeout` | `() => void` | — | settle 타임아웃 발생 시 콜백. |
| `onError` | `(error: unknown) => void` | — | 페이지네이션(측정/계산) 실패 콜백. |

### `PageInfo`

`header`/`footer` 렌더 함수의 인자.

```ts
type PageInfo = {
  pageNumber: number;   // 1-base
  section?: string;     // 그 페이지의 대표 섹션 (SectionMark 사용 시)
};
```

### 컴파운드 정적 속성

| 속성 | 설명 |
|---|---|
| `ColumnPager.PageBreak` | 강제 페이지 넘김 |
| `ColumnPager.ColumnBreak` | 강제 컬럼 넘김 |
| `ColumnPager.SectionMark` | 섹션 라벨 |
| `ColumnPager.StableGate` | 비동기 렌더 완료 게이트 |

---

## 컴파운드 컨트롤

컨트롤은 children 흐름 사이에 끼워 배치를 제어하는 **렌더 출력 없는 마커**다. ColumnPager가 타입으로
인식해 처리하며, 화면에 아무것도 그리지 않는다.

### `<ColumnPager.PageBreak>`

강제 페이지 넘김. 이후 콘텐츠는 다음 페이지부터 배치된다.

```ts
type PageBreakProps = {
  changeColumnCountTo?: number; // 이 넘김 이후부터 적용할 컬럼 수
};
```

### `<ColumnPager.ColumnBreak>`

강제 컬럼 넘김. 이후 콘텐츠는 다음 컬럼부터. 마지막 컬럼이면 다음 페이지로 넘어간다. props 없음.

### `<ColumnPager.SectionMark>`

섹션 라벨. 이후 콘텐츠들은 다음 `SectionMark` 전까지 이 섹션에 속한다(sticky). `getSectionPageRanges`로
섹션별 페이지 범위를 뽑을 때 쓴다.

```ts
type SectionMarkProps = {
  section: string;
};
```

### `<ColumnPager.StableGate>`

비동기로 렌더되는 자식(이미지/데이터 로딩 등)을 감싼다. 준비되면 `stable={true}`. ColumnPager는
`onPagesGenerated`로 HTML을 내보내기 전에 모든 StableGate가 stable인지 폴링한다(타임아웃 폴백 있음).
`div`의 모든 속성을 전달받는다.

```ts
type StableGateProps = PropsWithChildren<
  HTMLAttributes<HTMLDivElement> & {
    stable: boolean;
  }
>;
```

---

## 유틸리티

배치 결과(`Page[]`)를 조회하는 순수 함수들. `onPagesGenerated`의 `pages`에 대해 쓴다.

### `isSliced(placement: Placement): boolean`

해당 배치가 큰 아이템의 슬라이스(잘린) 조각인지.

### `getPageCount(pages: Page[]): number`

총 페이지 수.

### `findItemPage(pages: Page[], blockIndex: number): number`

특정 콘텐츠 블록(`blockIndex`)이 처음 등장하는 페이지 번호(1-base). 없으면 `-1`. 목차/북마크 생성에 유용.

### `getSectionPageRanges(pages: Page[]): SectionPageRanges`

각 섹션이 차지하는 페이지 범위.

```ts
type SectionPageRanges = Record<string, [number, number]>; // 1-base [시작, 끝]

getSectionPageRanges(pages);
// { vocabulary: [1, 3], grammar: [4, 6], answers: [7, 8] }
```

---

## 공개 타입

`onPagesGenerated`가 넘기는 배치 결과의 데이터 구조.

```ts
type Size = { width: number; height: number };

// 배치 결과는 3차원: Page[] → Column[] → Placement[]
type Page = Column[];        // 한 페이지의 컬럼들
type Column = Placement[];   // 한 컬럼에 배치된 아이템들

type Placement = {
  blockIndex: number;   // content 블록 인덱스 (렌더 노드 조회용)
  pageIndex: number;    // 0-base
  columnIndex: number;  // 0-base
  columnCount: number;  // 그 페이지의 컬럼 수
  section?: string;     // SectionMark로 지정된 섹션
  slice?: Slice;        // 슬라이스된 경우의 조각 메타 (없으면 일반 배치)
};

type Slice = {
  index: number;        // 조각 인덱스 (0부터)
  count: number;        // 전체 조각 수
  clipHeight: number;   // 외부 클립 높이
  carryOffset: number;  // 이전 컬럼에서 이어받은 높이
  shiftX: number;       // 가로 이동량(px) — translateX(-shiftX)
  shiftY: number;       // 세로 이동량(px) — 첫 조각의 carryOffset 보정
  innerHeight: number;  // 내부 콘텐츠 높이
  paddingHeight: number;// decorator padding/border 높이 (한쪽)
};
```

`pageIndex`/`columnIndex`는 0-base, `PageInfo.pageNumber`와 유틸의 페이지 번호는 1-base다.

## 관련 문서

- [튜토리얼](tutorial.md) · [How-to](how-to.md) · [설명: 동작 원리](explanation.md)
