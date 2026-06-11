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
| `bodyClassName` | `string` | — | 본문(컬럼들을 담는 영역)에 적용할 클래스. 패딩 등에 쓴다. 기본 패딩 없음(0). |
| `columnGap` | `number` | `0` | 컬럼 사이 가로 간격(px). |
| `itemGap` | `number` | `0` | 같은 컬럼 안 아이템 사이 세로 간격(px). 컬럼 첫 아이템 위에는 적용되지 않는다(= flex-col gap 시맨틱). 페이지네이션 높이 계산과 렌더에 함께 반영돼 별도 스페이서가 필요 없다. |
| `showDividers` | `boolean` | — | 컬럼 사이 구분선 표시. |
| `clipOverflow` | `boolean` | `true` | 컬럼/본문 박스 클립 여부. `false`면 Column·Body가 `overflow-visible`이 되어 `renderItem` layout 애니메이션 중 이동하는 셀이 잘리지 않는다(슬라이스·페이지 높이 클립은 유지). |
| `moveOversizedItemToNextColumn` | `boolean` | `false` | 컬럼 높이 초과 아이템을, 이미 채워진 컬럼에선 자르기 전에 다음 컬럼으로 먼저 보낸다. |
| `tightFill` | `number` | `0` | 컬럼을 빽빽하게 채우는 "최소 여백(px) 임계값". 경계에 걸친 아이템(남은 공간보다 큰)을 잘라 남은 공간부터 채우고 다음 컬럼/페이지로 이어 분할한다. `0`/미지정이면 분할 없이 통째로 넘긴다(여백 허용, box 보존). `N`(px)이면 남은 공간이 N보다 클 때만 잘라 채운다(작은 여백은 통째). 원자적 박스(inline-block 등)는 통째 이동 폴백. (컬럼 높이보다 큰 아이템은 이 옵션과 무관하게 항상 분할.) |
| `header` | `(info: PageInfo) => ReactNode` | — | 페이지 헤더 렌더. `pageNumber`로 분기해 페이지별로 다르게 가능. |
| `footer` | `(info: PageInfo) => ReactNode` | — | 페이지 푸터 렌더. |
| `renderItem` | `(info: RenderItemInfo) => ReactNode` | — | 배치된 각 셀을 감싸는 래퍼(선택). 순서/위치 변경 시 framer-motion 등으로 layout 애니메이션을 입히는 용도. 라이브러리는 framer-motion에 의존하지 않으며, 소비자가 `motion.div(layoutId)` 등을 직접 반환한다. 미지정 시 셀을 그대로 렌더. |
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

### `RenderItemInfo`

`renderItem` 래퍼 함수의 인자. 배치된 한 셀을 감쌀 때 전달된다.

```ts
type RenderItemInfo = {
  id?: string;          // 소비자 child key 기반 안정적 정체성 (key 미지정 시 undefined). layout 애니메이션 식별자.
  blockIndex: number;   // content 블록 인덱스 (위치 기반)
  sliced: boolean;      // 큰 아이템이 잘린 슬라이스 조각인지 (true면 layout 애니메이션 비권장)
  sliceIndex?: number;  // 슬라이스 조각 인덱스 (0부터). 슬라이스가 아니면 undefined.
  sliceCount?: number;  // 전체 슬라이스 조각 수. 슬라이스가 아니면 undefined.
  pageNumber: number;   // 페이지 번호 (1부터)
  children: ReactNode;  // 렌더된 셀(ItemCell/SliceView) — 이걸 motion 등으로 감싸 반환
};
```

### 컴파운드 정적 속성

| 속성 | 설명 |
|---|---|
| `ColumnPager.PageBreak` | 강제 페이지 넘김 |
| `ColumnPager.ColumnBreak` | 강제 컬럼 넘김 |
| `ColumnPager.SectionMark` | 섹션 라벨 |
| `ColumnPager.StableGate` | 비동기 렌더 완료 게이트 |
| `ColumnPager.Decorator` | 자식들을 같은 프레임 클래스로 묶는 데코레이터(분할은 아이템 단위) |
| `ColumnPager.KeepTogether` | 안의 콘텐츠를 경계에서 쪼개지 않고 통째로 다음 컬럼/페이지로 넘김 |

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

### `<ColumnPager.Decorator>`

자식들을 같은 `className` 프레임(테두리/배경/패딩 등)으로 묶는다. 래퍼 자체는 레이아웃에 렌더되지 않고,
ColumnPager가 타입으로 인식해 자식을 풀고 `className`을 각 자식 셀에 전파한다. 묶음처럼 보이되 분할·페이지
넘김은 아이템 단위로 일어난다. 프레임의 패딩/보더(chrome) 높이는 빈 복제본으로 측정돼 슬라이스 계산에 반영된다.

```ts
type DecoratorProps = {
  className?: string;  // 묶음 전체에 전파될 프레임 클래스. 각 자식 셀에 동일 적용.
  children?: ReactNode;
};
```

### `<ColumnPager.KeepTogether>`

안의 콘텐츠를 컬럼/페이지 경계에서 라인별로 쪼개지 않고 통째로 다음 컬럼/페이지로 넘긴다. 슬라이싱이 CSS
multicol 기반이라 `break-inside: avoid`(inline style)를 적용해 동작한다. 리스트·표·코드블록·이미지 캡션처럼
함께 넘어가야 하는 것에 감싸 쓴다. 내용이 컬럼 높이보다 크면 회피 불가 → 브라우저가 강제 분할한다. `div`의 모든
속성을 전달받는다.

```ts
type KeepTogetherProps = HTMLAttributes<HTMLDivElement> & {
  children?: ReactNode;
};
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
