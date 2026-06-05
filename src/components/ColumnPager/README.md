# ColumnPager 컴포넌트 가이드

## 목차

1. [개요](#개요)
2. [핵심 개념](#핵심-개념)
3. [아키텍처](#아키텍처)
4. [컴포넌트 상세](#컴포넌트-상세)
5. [사용법](#사용법)
6. [데이터 흐름](#데이터-흐름)
7. [알고리즘 상세](#알고리즘-상세)
8. [유틸리티 함수](#유틸리티-함수)
9. [트러블슈팅](#트러블슈팅)

---

## 개요

ColumnPager는 React 컴포넌트들을 A4 페이지 형태의 PDF로 변환하기 위한 **자동 페이지네이션 모듈**입니다.

### 주요 기능

- **자동 페이지 분할**: 콘텐츠 높이를 측정하여 A4 페이지 높이를 초과하면 자동으로 다음 페이지로 이동
- **자동 컬럼 분할**: 다중 컬럼 레이아웃에서 한 컬럼이 가득 차면 자동으로 다음 컬럼으로 이동
- **동적 컬럼 수 변경**: PageBreaker를 통해 페이지마다 다른 컬럼 수 적용 가능
- **오버플로우 항목 크롭**: 단일 항목이 컬럼 높이보다 큰 경우 여러 컬럼/페이지에 걸쳐 분할
- **HTML 문자열 생성**: PDF 변환용 완전한 HTML 문서 출력

### 사용 시나리오

```
React 컴포넌트 → ColumnPager → 페이지네이션된 HTML → PDF 생성 서버 → PDF 파일
```

---

## 핵심 개념

### 1. 페이지 구조

```
+-------------------------------------+
|              Header                 |  <- 페이지 헤더 (교재명, 단원명 등)
+-------------------------------------+
|   +-----------+   +-----------+     |
|   | Column 1  |   | Column 2  |     |  <- Body (다중 컬럼)
|   |           |   |           |     |
|   |  Item 1   |   |  Item 4   |     |
|   |  Item 2   |   |  Item 5   |     |
|   |  Item 3   |   |  Item 6   |     |
|   |           |   |           |     |
|   +-----------+   +-----------+     |
+-------------------------------------+
|              Footer                 |  <- 페이지 푸터 (페이지 번호 등)
+-------------------------------------+
```

### 2. 데이터 구조

```typescript
// 3차원 배열 구조: [페이지][컬럼][아이템]
type PagesData = PageData[][][]

type PageData = {
  index: number // children 배열에서의 원본 인덱스
  arrayIndex: number // 해당 컬럼 내에서의 순서
  pageNumber: number // 페이지 번호 (0-indexed)
  columnInPage: number // 컬럼 인덱스 (0-indexed)
  columnCount: number // 해당 페이지의 컬럼 수
  pageInformation?: string // 페이지 정보 (섹션명 등)

  // 크롭된 항목일 경우 추가 정보
  isCropped?: boolean
  croppedItemIndex?: number
  height?: number
  offsetHeight?: number
  // ... 기타 크롭 관련 속성
}
```

### 3. 제어 요소

| 요소              | 역할                           |
| ----------------- | ------------------------------ |
| `PageBreaker`     | 강제 페이지 나눔, 컬럼 수 변경 |
| `ColumnBreaker`   | 강제 컬럼 나눔                 |
| `PageInformation` | 페이지 메타정보 설정           |
| `StableChecker`   | 비동기 렌더링 완료 감지        |

---

## 아키텍처

### 파일 구조

```
src/components/ColumnPager/
├── index.tsx                 # 메인 컴포넌트
├── PageBreaker.tsx          # 페이지 브레이커
├── ColumnBreaker.tsx        # 컬럼 브레이커
├── PageInformation.tsx      # 페이지 정보
├── @layout/
│   ├── Container.tsx        # 전체 컨테이너
│   ├── Page.tsx            # 단일 페이지
│   ├── A4.tsx              # A4 크기 정의
│   ├── Header.tsx          # 페이지 헤더
│   ├── Body.tsx            # 페이지 본문
│   ├── Footer.tsx          # 페이지 푸터
│   └── Column.tsx          # 단일 컬럼
└── utils/
    ├── measureSize.ts       # 요소 크기 측정
    └── StableChecker.tsx    # 안정화 체크
```

### 관련 훅

```
src/hooks/
└── usePageGenerator.ts      # 페이지 레이아웃 계산 훅
```

### 의존성 그래프

```
ColumnPager
    │
    ├── usePageGenerator (훅)
    │       │
    │       └── measureSize (유틸)
    │
    ├── @layout/* (레이아웃 컴포넌트)
    │
    └── StableChecker (안정화 체크)
```

---

## 컴포넌트 상세

### ColumnPager (메인 컴포넌트)

```typescript
interface ColumnPagerProps {
  columnCount?: number // 기본 컬럼 수 (default: 1)
  loading?: boolean // 로딩 상태
  hidden?: boolean // 화면 숨김 여부 (HTML 생성만 할 때)
  columnClassName?: string // 컬럼에 적용할 클래스

  // 헤더 렌더러
  header: (props: { pageNumber: number; pageInformation: string | undefined }) => ReactNode

  // 푸터 렌더러
  footer: (props: { pageNumber: number; pageInformation: string | undefined }) => ReactNode

  // 페이지 생성 완료 콜백
  onPagesGenerated?: (pages: PagesData, htmlString: string) => void

  children: ReactNode // 페이지네이션할 콘텐츠
}
```

### PageBreaker

페이지를 강제로 나누고, 선택적으로 컬럼 수를 변경합니다.

```typescript
// 단순 페이지 나눔
<PageBreaker />

// 페이지 나눔 + 다음 페이지부터 2컬럼으로 변경
<PageBreaker changeColumnCountTo={2} />
```

**내부 구현:**

```tsx
const PageBreaker = (props?: { changeColumnCountTo?: number }) => {
  return <div data-page-breaker data-change-column-count-to={props?.changeColumnCountTo} />
}
```

### ColumnBreaker

현재 컬럼을 강제로 종료하고 다음 컬럼으로 이동합니다.

```typescript
<ColumnBreaker />
```

**내부 구현:**

```tsx
const ColumnBreaker = () => {
  return <div data-column-breaker />
}
```

### PageInformation

페이지의 메타 정보를 설정합니다. 이 정보는 header/footer에서 `pageInformation`으로 접근 가능합니다.

```typescript
<PageInformation pageName="vocabulary" />
```

### StableChecker

비동기적으로 렌더링되는 컴포넌트의 안정화 상태를 ColumnPager에 알립니다.

```typescript
// 사용 예시
const MyAsyncComponent = () => {
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    loadData().then(() => setIsLoaded(true))
  }, [])

  return (
    <ColumnPager.StableChecker isStable={isLoaded}>
      <div>{/* 비동기 콘텐츠 */}</div>
    </ColumnPager.StableChecker>
  )
}
```

**작동 원리:**

- `data-column-pager-stable` 속성으로 안정화 상태 전달
- ColumnPager는 모든 StableChecker가 `true`가 될 때까지 HTML 생성 대기

---

## 사용법

### 기본 사용

```tsx
import { ColumnPager } from 'column-pager'

const MyPDFContent = () => {
  const handlePagesGenerated = (pages, htmlString) => {
    // htmlString을 서버로 전송하여 PDF 생성
    console.log('생성된 HTML:', htmlString)
  }

  return (
    <ColumnPager
      columnCount={1}
      header={({ pageNumber }) => <div>페이지 {pageNumber}</div>}
      footer={({ pageNumber }) => <div>{pageNumber}</div>}
      onPagesGenerated={handlePagesGenerated}
    >
      <div>첫 번째 콘텐츠</div>
      <div>두 번째 콘텐츠</div>
      <ColumnPager.PageBreaker />
      <div>새 페이지의 콘텐츠</div>
    </ColumnPager>
  )
}
```

### 다중 컬럼 레이아웃

```tsx
<ColumnPager
  columnCount={2}
  header={({ pageNumber }) => <Header pageNumber={pageNumber} />}
  footer={({ pageNumber }) => <Footer pageNumber={pageNumber} />}
>
  {items.map((item, i) => (
    <div key={i}>{item}</div>
  ))}
</ColumnPager>
```

### 동적 컬럼 수 변경

```tsx
<ColumnPager columnCount={1}>
  <div>1컬럼 레이아웃</div>
  <ColumnPager.PageBreaker changeColumnCountTo={2} />
  <div>2컬럼 레이아웃</div>
  <div>2컬럼 계속</div>
  <ColumnPager.PageBreaker changeColumnCountTo={1} />
  <div>다시 1컬럼</div>
</ColumnPager>
```

### Decorator 패턴 (테두리 있는 그룹)

연속된 항목들을 테두리로 감싸면서 페이지 경계에서 자연스럽게 분할:

```tsx
<ColumnPager>
  <ContentTitle title="핵심 단어" />
  <div data-key="page-column-item-decorator" className="decorator-item rounded border border-gray-500">
    {vocabularyItems.map((item, i) => (
      <VocabularyItem key={i} {...item} />
    ))}
  </div>
  <PageBreaker />
</ColumnPager>
```

**decorator의 역할:**

- `data-key="page-column-item-decorator"` 속성으로 decorator 감지
- decorator 내부 항목들이 페이지 경계에서 분할될 때 테두리 스타일 자동 처리
- decorator 높이가 측정되어 크롭 계산에 반영

### 화면에 숨기고 HTML만 생성

```tsx
<ColumnPager
  hidden={true}
  onPagesGenerated={(pages, htmlString) => {
    uploadToServer(htmlString)
  }}
>
  {content}
</ColumnPager>
```

---

## 데이터 흐름

### 전체 플로우

```
+-------------------------------------------------------------------+
|                    1. Props 입력                                   |
|  children, columnCount, loading, header, footer, onPagesGenerated |
+-------------------------------------------------------------------+
                              |
                              v
+------------------------------------------------------------------+
|              2. useDeferredValue로 children 지연                   |
|                                                                  |
|  const deferredChildren = useDeferredValue(children)             |
|                                                                  |
|  목적: 빈번한 children 변경 시 렌더링 우선순위를 낮춰                      |
|        UI 응답성 유지 (React 18 Concurrent Feature)                 |
+------------------------------------------------------------------+
                              |
                              v
+------------------------------------------------------------------+
|              3. isStable 상태 관리                                 |
|                                                                  |
|  - loading=true -> isStable=false                                |
|  - loading=false -> requestIdleCallback으로 유휴 시간에              |
|                     isStable=true로 변경                           |
|                                                                  |
|  목적: 브라우저가 바쁠 때는 처리를 미뤄서 UI 블로킹 방지                     |
+------------------------------------------------------------------+
                              |
                              v
+------------------------------------------------------------------+
|              4. childrenArray 생성 (useMemo)                      |
|                                                                  |
|  - isStable=false면 빈 배열 반환 (처리 스킵)                          |
|  - isStable=true면 Fragment를 재귀적으로 평탄화                       |
|                                                                  |
|  flattenFragments(children):                                     |
|    <Fragment>           ->  [Item1, Item2, Item3]                |
|      <Item1/>                                                    |
|      <Fragment>                                                  |
|        <Item2/>                                                  |
|        <Item3/>                                                  |
|      </Fragment>                                                 |
|    </Fragment>                                                   |
+------------------------------------------------------------------+
                              |
                              v
+------------------------------------------------------------------+
|        5. flattenedChildren 생성 (useEffect + async)              |
|                                                                  |
|  각 child를 ColumnItem으로 래핑:                                    |
|                                                                  |
|  - data-page-information: 페이지 메타정보 전파                        |
|  - data-decorator-height: decorator 높이 (크롭 계산용)               |
|  - page-column-item-inner: 크기 측정 타겟                           |
|  - page-column-item-inner-div: 실제 콘텐츠 래퍼                      |
|  - page-column-item-inner-threshold: 크롭 위치 측정용 마커            |
|                                                                  |
|  decorator 처리:                                                  |
|    data-key="page-column-item-decorator" 감지 시                  |
|    -> 빈 decorator 렌더링하여 높이 측정 (measureElementSize)          |
|    -> 내부 children을 개별 ColumnItem으로 분리                        |
+------------------------------------------------------------------+
                              |
                              v
+------------------------------------------------------------------+
|              6. usePageGenerator 호출                             |
|                                                                  |
|  +------------------------------------------------------------+  |
|  |  6.1 레이아웃 크기 측정 (measureSize)                           |  |
|  |                                                             |  |
|  |  빈 페이지 렌더링 -> page-column 영역 크기 획득                    |  |
|  |  - columnWidth: 컬럼 너비                                     |  |
|  |  - containerHeight: 컬럼 높이 (배치 기준)                       |  |
|  +------------------------------------------------------------+   |
|                              |                                    |
|                              v                                    |
|  +------------------------------------------------------------+   |
|  |  6.2 아이템 크기 측정 (measureSize)                             |  |
|  |                                                             |  |
|  |  - 청크 단위(30개)로 분할하여 측정                                 |  |
|  |  - 각 청크 사이에 waitForIdle(), waitForNextFrame()             |  |
|  |  - Layout Thrashing 방지 (배치 읽기 -> 일괄 처리)                 |  |
|  |  - document.fonts.ready 대기 (폰트 로딩 완료 보장)                |  |
|  |                                                             |  |
|  |  측정 결과 (BodyItem[]):                                      |  |
|  |  - size: 컨테이너 크기                                         |  |
|  |  - innerSize: 내부 콘텐츠 크기                                  |  |
|  |  - isPageBreaker: PageBreaker 여부                           |  |
|  |  - isColumnBreaker: ColumnBreaker 여부                       |  |
|  |  - changeColumnCountTo: 컬럼 수 변경값                         |  |
|  |  - pageInformation: 페이지 메타정보                             |  |
|  |  - decoratorHeight: decorator 높이                           |  |
|  +------------------------------------------------------------+   |
|                              |                                    |
|                              v                                    |
|  +------------------------------------------------------------+   |
|  |  6.3 배치 계산 (calculateItemLayout)                          |  |
|  |                                                             |  |
|  |  상태 변수:                                                   |  |
|  |  - pageNumber: 현재 페이지 (0-indexed)                         |  |
|  |  - columnInPage: 현재 컬럼 (0-indexed)                        |  |
|  |  - columnHeightAccumulated: 현재 컬럼 누적 높이                  |  |
|  |  - currentColumnCount: 현재 페이지 컬럼 수                       |  |
|  |                                                              |  |
|  |  처리 순서:                                                    |  |
|  |  1) PageBreaker -> 다음 페이지, 컬럼 수 변경 시 재측정               |  |
|  |  2) ColumnBreaker -> 다음 컬럼                                 |  |
|  |  3) 오버플로우 항목 -> 크롭하여 여러 컬럼에 분배                       |  |
|  |  4) 일반 항목 -> 누적 높이 체크 후 배치                             |  |
|  |                                                              |  |
|  |  결과: IndexedDataType[] (각 아이템의 위치 정보)                   |  |
|  +------------------------------------------------------------+    |
|                              |                                     |
|                              v                                     |
|  +------------------------------------------------------------+    |
|  |  6.4 페이지별 그룹화 (groupItemsByPage)                         |   |
|  |                                                             |   |
|  |  IndexedDataType[] -> IndexedDataType[][] (페이지별)          |   |
|  +------------------------------------------------------------+   |
+-------------------------------------------------------------------+
                              |
                              v
+------------------------------------------------------------------+
|              7. pagesData 생성 (useMemo)                          |
|                                                                  |
|  IndexedDataType[][] -> PagesData (3차원 배열)                     |
|                                                                  |
|  [페이지][컬럼][아이템] 구조로 변환                                     |
|  - columnInPage로 그룹화                                           |
|  - arrayIndex 부여 (컬럼 내 순서)                                    |
+------------------------------------------------------------------+
                              |
                              v
+------------------------------------------------------------------+
|              8. PageRenderer로 DOM 렌더링                          |
|                                                                  |
|  Container                                                       |
|    +-- Page 1                                                    |
|    |     +-- Header (pageNumber, pageInformation)                |
|    |     +-- Body                                                |
|    |     |     +-- Column 0                                      |
|    |     |     |     +-- ColumnItem (flattenedChildren[index])   |
|    |     |     |     +-- ColumnItem ...                          |
|    |     |     +-- Column 1                                      |
|    |     |           +-- ColumnItem ...                          |
|    |     +-- Footer (pageNumber, pageInformation)                |
|    +-- Page 2                                                    |
|          ...                                                     |
|                                                                  |
|  크롭된 항목 처리 (CSS columnCount 활용):                             |
|                                                                  |
|  원리: CSS columnCount: 1 적용 시 콘텐츠가 세로로 넘치면                  |
|        자동으로 가로(column) 방향으로 확장됨                             |
|                                                                   |
|  +------------------+------------------+------------------+       |
|  |    Column 0      |    Column 1      |    Column 2      |       |
|  |  (보이는 영역)      |   (숨겨진 영역)     |   (숨겨진 영역)    |       |
|  +------------------+------------------+------------------+       |
|         ^                                                         |
|         |                                                         |
|    translateX(-N * innerItemWidth)로 원하는 영역을 보이게 이동           |
|                                                                   |
|  - height: 컨테이너 높이 (크롭 영역 크기 결정)                            |
|  - transform: translateX로 N번째 크롭 영역을 화면에 표시                  |
|  - offsetHeight: 이전 컬럼에서 이미 표시한 높이만큼 스킵                    |
|  - innerItemWidth: CSS column으로 확장된 각 영역의 너비                  |
+--------------------------------------------------------------------+
                              |
                              v
+------------------------------------------------------------------+
|              9. 안정화 체크 (checkAllStable)                        |
|                                                                  |
|  requestAnimationFrame 루프:                                      |
|  1) 2프레임 대기 (초기 렌더링 완료)                                     |
|  2) [data-column-pager-stable] 요소들 확인                          |
|  3) 모두 "true"면 -> 다음 단계                                       |
|  4) 아니면 -> 다음 프레임에 재확인                                      |
|                                                                  |
|  목적: 비동기 렌더링 컴포넌트(이미지, 데이터 로딩 등)                        |
|        완료 후에 HTML 추출                                           |
+------------------------------------------------------------------+
                              |
                              v
+------------------------------------------------------------------+
|              10. HTML 문자열 생성 (convertElementToHtmlString)       |
|                                                                   |
|  container.outerHTML + document.styleSheets 결합                   |
|                                                                   |
|  <!DOCTYPE html>                                                  |
|  <html>                                                           |
|    <head>                                                         |
|      <style>/* 모든 CSS 규칙 */</style>                             |
|      <style>/* 기본 스타일 (폰트, @page, print-color-adjust) */</style>
|    </head>                                                        |
|    <body>                                                         |
|      <!-- container HTML -->                                      |
|    </body>                                                        |
|  </html>                                                          |
+------------------------------------------------------------------+
                              |
                              v
+------------------------------------------------------------------+
|              11. onPagesGenerated 콜백 호출                         |
|                                                                   |
|  onPagesGenerated(pagesData, htmlString)                          |
|                                                                   |
|  - pagesData: 페이지/컬럼/아이템 구조 정보                               |
|  - htmlString: PDF 변환용 완전한 HTML 문서                             |
|                                                                   |
|  중복 호출 방지:                                                     |
|  - hasGeneratedRef: 이미 생성했는지 체크                               |
|  - lastPagesLengthRef: 페이지 수 변경 시에만 재생성                     |
+------------------------------------------------------------------+
```

### 상세 단계별 코드

#### 1-2단계: Props 입력 및 지연 처리

```typescript
const ColumnPager = ({
  columnCount = 1,
  children,
  loading,
  hidden,
  columnClassName,
  onPagesGenerated,
  header,
  footer,
}: ColumnPagerProps) => {
  const [isStable, setIsStable] = useState(false)

  // React 18 Concurrent Feature: 우선순위가 낮은 업데이트로 처리
  // children이 빈번하게 변경되어도 UI가 버벅이지 않음
  const deferredChildren = useDeferredValue(children)
  // ...
}
```

#### 3단계: 안정화 상태 관리

```typescript
useEffect(() => {
  if (loading) {
    setIsStable(false)
    return
  }

  // requestIdleCallback: 브라우저가 유휴 상태일 때 실행
  // 메인 스레드가 바쁘면 실행을 미룸 -> UI 응답성 유지
  const idleId = requestIdleCallback(
    () => setIsStable(true),
    // { timeout: 2000 }, // 필요시 최대 대기 시간 설정
  )

  return () => cancelIdleCallback(idleId)
}, [deferredChildren, loading])
```

#### 4단계: Fragment 평탄화

```typescript
const childrenArray = useMemo(() => {
  if (!isStable) return [] // stable 전에는 처리 스킵

  const flattenFragments = (children: ReactNode): ReactNode[] => {
    const result: ReactNode[] = []

    React.Children.forEach(children, (child) => {
      if (React.isValidElement(child) && child.type === React.Fragment) {
        // Fragment면 재귀적으로 내부 children 추출
        const childProps = child.props as { children?: ReactNode }
        result.push(...flattenFragments(childProps.children))
      } else {
        result.push(child)
      }
    })

    return result
  }

  return flattenFragments(deferredChildren)
}, [deferredChildren, isStable])
```

#### 5단계: ColumnItem 래핑

```typescript
useEffect(() => {
  if (childrenArray.length === 0) {
    setFlattenedChildren([])
    return
  }

  const processFlattenedChildren = async () => {
    const result: ReactNode[] = []
    let informationName: string | undefined

    // ColumnItem으로 래핑하는 헬퍼 함수
    const addColumnItem = (
      child: ReactNode,
      informationName: string | undefined,
      decoratorClassName?: string,
      decoratorHeight?: number,
    ) => {
      result.push(
        <ColumnItem
          key={`column-item-${result.length}`}
          data-page-information={informationName}
          className={cn('flex overflow-hidden', decoratorClassName)}
          data-decorator-height={decoratorHeight ?? 0}
        >
          {/* 크기 측정 및 크롭을 위한 구조 */}
          <div data-key="page-column-item-inner" style={{ columnCount: 1, columnGap: 0 }}>
            <div data-key="page-column-item-inner-div">{child}</div>
            <div data-key="page-column-item-inner-threshold" />  {/* 크롭 위치 마커 */}
          </div>
        </ColumnItem>,
      )
    }

    // decorator 처리: 테두리 있는 그룹을 개별 아이템으로 분리
    const flattenChild = async (child: ReactNode): Promise<FlattenedChild[]> => {
      if (!React.isValidElement(child)) return [{ child }]

      const childProps = child.props as Record<string, unknown>

      // decorator 감지
      if (childProps['data-key'] === 'page-column-item-decorator') {
        const decoratorClass = childProps['className'] as string | undefined
        const decoratorChildren = React.Children.toArray(childProps.children as ReactNode)

        // decorator 높이 측정 (빈 decorator 렌더링)
        const emptyDecorator = cloneElement(child, { children: [] } as never)
        const decoratorSize = await measureElementSize({
          element: emptyDecorator as ReactElement,
          containerWidth: 100,
          measureTargetKeys: ['page-column-item-decorator'],
        })
        const decoratorHeight = decoratorSize.container?.height

        // decorator 내부 children을 개별 아이템으로 분리
        return decoratorChildren.flatMap((decoratorChild) => {
          // 2뎁스: decorator 안의 Fragment도 벗김
          if (React.isValidElement(decoratorChild) && decoratorChild.type === React.Fragment) {
            // ...
          }
          return [{ child: decoratorChild, decoratorClassName: decoratorClass, decoratorHeight }]
        })
      }

      // 1뎁스: Fragment 벗기기
      if (child.type === React.Fragment) {
        const fragmentChildren = React.Children.toArray(childProps.children as ReactNode)
        return fragmentChildren.map((c) => ({ child: c }))
      }

      return [{ child }]
    }

    // 모든 children 처리
    for (const child of childrenArray) {
      // pageInformation 전파
      if (React.isValidElement(child)) {
        const childProps = child.props as Record<string, unknown>
        informationName = (childProps['data-page-information'] as string) || informationName
      }

      const flattened = await flattenChild(child)
      flattened.forEach(({ child: flatChild, decoratorClassName, decoratorHeight }) => {
        addColumnItem(flatChild, informationName, decoratorClassName, decoratorHeight)
      })
    }

    setFlattenedChildren(result)
  }

  processFlattenedChildren()
}, [childrenArray])
```

#### 6단계: usePageGenerator

```typescript
// 5.1 페이지 레이아웃 측정
const layoutSizes = await measureSize({
  elements: pageLayoutComponents(0, [], columnCount),
  config: {
    measureTargetKeys: ['page-header', 'page-body', 'page-footer', 'page-column'],
  },
})
const columnWidth = layoutSizes['page-column'].width
const containerHeight = layoutSizes['page-column'].height

// 5.2 아이템 크기 측정 (청크 단위로 처리)
const itemSizes = await measureSize({
  elements: childrenArray,
  config: {
    containerWidth: columnWidth,
    chunkSize: 30,  // Layout Thrashing 방지
  },
})

// 5.3 배치 계산
for (const item of bodyItems) {
  // PageBreaker 처리
  if (item.isPageBreaker) {
    pageNumber += 1
    columnInPage = 0
    continue
  }

  // ColumnBreaker 처리
  if (item.isColumnBreaker) {
    columnInPage += 1
    continue
  }

  // 오버플로우 처리 (항목이 컬럼 높이보다 큰 경우)
  if (itemHeight > containerHeight) {
    // 크롭 로직...
  }

  // 일반 배치
  columnHeightAccumulated += itemHeight
  if (columnHeightAccumulated > containerHeight) {
    columnInPage += 1
    if (columnInPage >= columnCount) {
      pageNumber += 1
      columnInPage = 0
    }
  }

  indexedData.push({ pageNumber, columnInPage, index, ... })
}
```

#### 7-11단계: 렌더링 및 출력

```typescript
// 7. 3차원 배열로 변환
const pagesData = pages.map(page => {
  const columnData = Array.from({ length: pageColumnCount }, () => [])
  // columnInPage로 그룹화
  return columnData
})

// 8. 렌더링
const PageRenderer = (pageNumber, columnData, columnCount) => (
  <Page header={header} footer={footer}>
    {columns.map((col, i) => (
      <Column key={i}>
        {col.items.map(item => (
          // 크롭된 항목은 transform으로 오프셋 적용
          item.isCropped
            ? <CroppedItem {...item} />
            : flattenedChildren[item.index]
        ))}
      </Column>
    ))}
  </Page>
)

// 9-11. 안정화 체크 후 HTML 추출 및 콜백
useEffect(() => {
  // ...
  const checkAndGenerate = () => {
    if (checkAllStable(container)) {
      const htmlString = convertElementToHtmlString(container.outerHTML)
      onPagesGenerated?.(pagesData, htmlString)
      hasGeneratedRef.current = true
    } else {
      rafId = requestAnimationFrame(checkAndGenerate)
    }
  }

  // 2프레임 후 체크 시작
  rafId = requestAnimationFrame(() => {
    rafId = requestAnimationFrame(checkAndGenerate)
  })
}, [pagesData.length, onPagesGenerated, pagesData])
```

---

## 알고리즘 상세

### 자동 페이지 분할

콘텐츠 높이를 측정하여 A4 페이지 높이를 초과하면 자동으로 다음 페이지로 넘깁니다.

**작동 원리:**

```
컬럼 높이: 1000px (A4 Body 영역)

아이템 배치 과정:
+-----------------+
| Item 1 (200px)  |  누적: 200px
| Item 2 (300px)  |  누적: 500px
| Item 3 (400px)  |  누적: 900px
| Item 4 (250px)  |  누적: 1150px -> 오버플로우!
+-----------------+

-> Item 4는 다음 컬럼/페이지로 이동
```

**핵심 로직 (usePageGenerator.ts):**

```typescript
// 높이 누적 및 오버플로우 체크
columnHeightAccumulated += itemHeight

if (columnHeightAccumulated > containerHeight) {
  // 컬럼 오버플로우 → 다음 컬럼으로 이동
  columnInPage += 1

  // 페이지의 모든 컬럼이 차면 다음 페이지로 이동
  if (columnInPage >= currentColumnCount) {
    pageNumber += 1
    columnInPage = 0
  }

  // 누적 높이를 현재 아이템 높이로 리셋
  columnHeightAccumulated = itemHeight
}
```

**시각화:**

```
[Page 1]                              [Page 2]
+---------+---------+                +---------+---------+
| Item 1  | Item 4  |                | Item 7  | Item 10 |
| Item 2  | Item 5  |   -------->    | Item 8  | Item 11 |
| Item 3  | Item 6  |   자동 분할      | Item 9  |         |
+---------+---------+                +---------+---------+
  Column 0  Column 1                   Column 0  Column 1

columnCount = 2일 때:
- Column 0이 가득 차면 -> Column 1로 이동
- Column 1도 가득 차면 -> Page 2의 Column 0으로 이동
```

---

### 자동 컬럼 분할

다중 컬럼 레이아웃에서 한 컬럼이 가득 차면 자동으로 다음 컬럼으로 콘텐츠를 이동합니다.

**작동 원리:**

```typescript
// columnCount = 2인 경우

// 상태 변수
let columnInPage = 0 // 현재 컬럼 인덱스 (0 또는 1)
let columnHeightAccumulated = 0 // 현재 컬럼의 누적 높이
let pageNumber = 0 // 현재 페이지 번호

// 아이템 배치 로직
for (const item of bodyItems) {
  const itemHeight = item.size.height

  // 현재 컬럼에 추가
  columnHeightAccumulated += itemHeight

  // 컬럼 높이 초과 시
  if (columnHeightAccumulated > containerHeight) {
    columnInPage += 1 // 다음 컬럼으로 이동

    // 모든 컬럼이 찼으면 다음 페이지로
    if (columnInPage >= columnCount) {
      pageNumber += 1
      columnInPage = 0
    }

    columnHeightAccumulated = itemHeight // 리셋
  }

  // 아이템의 위치 정보 저장
  indexedData.push({
    index: itemIndex,
    pageNumber,
    columnInPage,
    columnCount,
  })
}
```

**예시 - 2컬럼 레이아웃:**

```
입력: 8개의 아이템 (각각 다른 높이)
컬럼 높이: 1000px

아이템별 높이:
- Item 0: 300px
- Item 1: 400px
- Item 2: 350px  <- 누적 1050px, 오버플로우 -> Column 1로
- Item 3: 500px
- Item 4: 300px
- Item 5: 250px  <- 누적 1050px, 오버플로우 -> Page 2, Column 0으로
- Item 6: 400px
- Item 7: 300px

결과:
+--------------------------------------+
|           Page 1                     |
|  +-------------+-------------+       |
|  |   Column 0  |   Column 1  |       |
|  |             |             |       |
|  |   Item 0    |   Item 2    |       |
|  |   (300px)   |   (350px)   |       |
|  |             |             |       |
|  |   Item 1    |   Item 3    |       |
|  |   (400px)   |   (500px)   |       |
|  |             |             |       |
|  |             |   Item 4    |       |
|  |             |   (300px)   |       |
|  +-------------+-------------+       |
+--------------------------------------+

+--------------------------------------+
|           Page 2                     |
|  +-------------+-------------+       |
|  |   Column 0  |   Column 1  |       |
|  |             |             |       |
|  |   Item 5    |   Item 7    |       |
|  |   (250px)   |   (300px)   |       |
|  |             |             |       |
|  |   Item 6    |             |       |
|  |   (400px)   |             |       |
|  +-------------+-------------+       |
+--------------------------------------+
```

**결과 데이터 구조:**

```typescript
// indexedData 배열
[
  { index: 0, pageNumber: 0, columnInPage: 0, columnCount: 2 },
  { index: 1, pageNumber: 0, columnInPage: 0, columnCount: 2 },
  { index: 2, pageNumber: 0, columnInPage: 1, columnCount: 2 },  // Column 1로 이동
  { index: 3, pageNumber: 0, columnInPage: 1, columnCount: 2 },
  { index: 4, pageNumber: 0, columnInPage: 1, columnCount: 2 },
  { index: 5, pageNumber: 1, columnInPage: 0, columnCount: 2 },  // Page 2로 이동
  { index: 6, pageNumber: 1, columnInPage: 0, columnCount: 2 },
  { index: 7, pageNumber: 1, columnInPage: 1, columnCount: 2 },  // Column 1로 이동
]

// 3차원 배열로 변환 (pagesData)
[
  // Page 0
  [
    // Column 0
    [{ index: 0 }, { index: 1 }],
    // Column 1
    [{ index: 2 }, { index: 3 }, { index: 4 }],
  ],
  // Page 1
  [
    // Column 0
    [{ index: 5 }, { index: 6 }],
    // Column 1
    [{ index: 7 }],
  ],
]
```

**컬럼 렌더링 (PageRenderer):**

```tsx
const PageRenderer = (pageNumber, columnData, columnCount) => (
  <Page>
    {Array.from({ length: columnCount }).map((_, colIndex) => (
      <Column key={colIndex}>{columnData[colIndex]?.map((item) => flattenedChildren[item.index])}</Column>
    ))}
  </Page>
)
```

---

### 크기 측정 (measureSize)

**Layout Thrashing 방지 패턴:**

```typescript
// BAD: 읽기-쓰기가 반복됨
items.forEach((item) => {
  const size = item.getBoundingClientRect() // READ
  item.style.width = size.width + 'px' // WRITE
})

// GOOD: 읽기를 모아서 처리
const batchMeasure = (children) => {
  // 1단계: DOM read - 모든 요소 찾기
  const measurements = children.map((child) => ({
    child,
    targets: measureTargetKeys.map((key) => child.querySelector(`[data-key="${key}"]`)),
  }))

  // 2단계: DOM read - 한 번에 모든 크기 측정
  return measurements.map(({ child, targets }) => {
    const sizes = targets.map((t) => t.getBoundingClientRect())
    return { container: child.getBoundingClientRect(), ...sizes }
  })
}
```

**청크 처리:**

```typescript
const measureSize = async ({ elements, config }) => {
  const chunks = chunk(elements, config.chunkSize || 20)

  for (const chunk of chunks) {
    // 유휴 시간까지 대기
    await waitForIdle()

    // 청크 렌더링 및 측정
    const results = await renderAndMeasureChunk(chunk, container)
    allResults.push(...results)

    // 다음 프레임으로 양보
    await waitForNextFrame()
  }

  return allResults
}
```

### 오버플로우 항목 크롭

컬럼 높이보다 큰 항목을 여러 페이지/컬럼에 걸쳐 분할합니다.

**CSS columnCount의 동작 원리:**

CSS `columnCount: 1`을 적용하면, 컨테이너 높이를 초과하는 콘텐츠가
자동으로 **가로 방향으로 확장**됩니다. 이 특성을 활용하여 크롭을 구현합니다.

```
CSS columnCount: 1, height: 1000px 적용 시:

원본 콘텐츠 (높이: 3000px)가 자동으로 3개 컬럼으로 확장됨:

+-----------------+-----------------+-----------------+
|    Column 0     |    Column 1     |    Column 2     |
|   (0~1000px)    |  (1000~2000px)  |  (2000~3000px)  |
|                 |                 |                 |
|   첫 번째         |   두 번째        |   세 번째         |
|   영역           |   영역           |   영역           |
|                 |                 |                 |
+-----------------+-----------------+-----------------+
      ^
      |
   기본적으로 Column 0만 보임 (overflow: hidden)
```

**translateX로 원하는 영역 표시:**

```
croppedItemIndex = 0 (첫 번째 크롭)
translateX(0)
+-----------------+-----------------+-----------------+
| [  보이는 영역  ]  |                 |                 |
+-----------------+-----------------+-----------------+

croppedItemIndex = 1 (두 번째 크롭)
translateX(-innerItemWidth)
+-----------------+-----------------+-----------------+
|                 | [  보이는 영역  ]  |                 |
+-----------------+-----------------+-----------------+
     <-- 왼쪽으로 이동

croppedItemIndex = 2 (세 번째 크롭)
translateX(-2 * innerItemWidth)
+-----------------+-----------------+-----------------+
|                 |                 | [  보이는 영역  ]  |
+-----------------+-----------------+-----------------+
          <-- 더 왼쪽으로 이동
```

**결과적으로 각 페이지/컬럼에 배치:**

```
Page 1, Column 0     Page 1, Column 1     Page 2, Column 0
+-----------------+  +-----------------+  +-----------------+
| +-------------+ |  | +-------------+ |  | +-------------+ |
| | 첫 번째       | |  | | 두 번째      | |  | | 세 번째       | |
| | 크롭 영역     | |  | | 크롭 영역     | |  | | 크롭 영역      | |
| | (0~1000px)  | |  | |(1000~2000px)| |  | |(2000~3000px)| |
| +-------------+ |  | +-------------+ |  | +-------------+ |
+-----------------+  +-----------------+  +-----------------+
```

**구현 코드:**

```typescript
// page-column-item-inner 구조
<div
  data-key="page-column-item-inner"
  style={{
    columnCount: 1,      // 세로 오버플로우 시 가로로 확장
    columnGap: 0,        // 컬럼 간격 없음
    height: containerHeight,  // 컨테이너 높이 고정 -> 오버플로우 발생
    transform: `translateX(-${croppedItemIndex * innerItemWidth}px)`
  }}
>
  {/* 이전 크롭에서 이미 표시한 영역 스킵 (첫 번째 크롭이 아닐 때) */}
  <div style={{ height: offsetHeight }} />

  {/* 실제 콘텐츠 */}
  <div data-key="page-column-item-inner-div">{content}</div>

  {/* 콘텐츠 끝 위치 측정용 마커 */}
  <div data-key="page-column-item-inner-threshold" />
</div>
```

**크롭 계산 과정:**

```typescript
// 1. 오버플로우 항목 감지
if (itemHeight > containerHeight) {
  // 2. 오프스크린에서 CSS column으로 확장된 상태 측정
  const measuredOverflow = await measureElementSize({
    element: childrenArray[itemIndex],
    containerWidth: item.size.width,
    containerHeight: containerHeight,
    offsetHeight: columnHeightAccumulated, // 이미 채워진 높이
  })

  // 3. 몇 개의 크롭이 필요한지 계산
  const innerDivWidth = measuredOverflow['page-column-item-inner-div'].width
  const innerWidth = measuredOverflow['page-column-item-inner'].width
  const cropCount = Math.floor(innerDivWidth / innerWidth)

  // 4. 각 크롭에 대해 IndexedData 생성
  for (let i = 0; i < cropCount; i++) {
    indexedData.push({
      index: itemIndex,
      pageNumber,
      columnInPage,
      isCropped: true,
      croppedItemIndex: i,
      height: isFirstItem ? firstItemHeight : isLastItem ? lastItemHeight : containerHeight,
      offsetHeight: i > 0 ? columnHeightAccumulated : 0,
      innerItemWidth: innerWidth,
      // ...
    })

    // 다음 컬럼/페이지로 이동
    if (!isLastItem) columnInPage += 1
    if (columnInPage >= columnCount) {
      pageNumber += 1
      columnInPage = 0
    }
  }
}
```

**threshold 요소의 역할:**

- 콘텐츠 끝 위치를 측정하기 위한 마커
- `thresholdPosition.top`: 마지막 크롭 영역의 실제 높이 계산
- 마지막 크롭 영역은 containerHeight보다 작을 수 있음

### 안정화 체크

비동기 렌더링 완료를 보장하는 메커니즘:

```typescript
// 1. StableChecker로 비동기 상태 표시
<ColumnPager.StableChecker isStable={isDataLoaded}>
  <AsyncContent />
</ColumnPager.StableChecker>

// 2. ColumnPager에서 모든 StableChecker 확인
const checkAllStable = (container) => {
  const elements = container.querySelectorAll('[data-column-pager-stable]')
  return elements.length === 0 ||
    Array.from(elements).every(el =>
      el.getAttribute('data-column-pager-stable') === 'true'
    )
}

// 3. requestAnimationFrame으로 반복 체크
const checkAndGenerate = () => {
  if (checkAllStable(container)) {
    onPagesGenerated(pagesData, htmlString)
  } else {
    requestAnimationFrame(checkAndGenerate)
  }
}
```

---

## 유틸리티 함수

### measureSize

여러 요소의 크기를 효율적으로 측정:

```typescript
const results = await measureSize({
  elements: [<div>1</div>, <div>2</div>],
  config: {
    containerWidth: 400,           // 측정 컨테이너 너비
    chunkSize: 20,                 // 청크 크기
    measureTargetKeys: ['header'], // 특정 요소 측정
  },
})

// 결과
[
  {
    container: { width: 400, height: 50 },
    isPageBreaker: false,
    isColumnBreaker: false,
    header: { width: 400, height: 30 },
  },
  // ...
]
```

### measureElementSize

단일 요소의 상세 크기 측정 (크롭 계산용):

```typescript
const result = await measureElementSize({
  element: <MyComponent />,
  containerWidth: 400,
  containerHeight: 1000,
  offsetHeight: 200,  // 시작 오프셋
  measureTargetKeys: ['page-column-item-inner-div'],
})

// 결과
{
  container: { width: 400, height: 1000 },
  thresholdPosition: {
    top: 850,    // threshold 요소의 상대 위치
    left: 0,
    // ...
  },
}
```

### convertElementToHtmlString

DOM을 완전한 HTML 문서로 변환:

```typescript
const htmlString = convertElementToHtmlString(container.outerHTML)

// 결과: 스타일시트 포함된 완전한 HTML
// <!DOCTYPE html>
// <html>
//   <head>
//     <style>/* 모든 CSS 규칙 */</style>
//   </head>
//   <body>
//     <!-- container HTML -->
//   </body>
// </html>
```

---

## A4 크기 참조

```typescript
// @layout/A4.tsx
export const A4_WIDTH = 210 // mm
export const A4_HEIGHT = 297 // mm

const A4_HEIGHT_PX = 1123 // px (96 DPI 기준)
const A4_WIDTH_PX = 794 // px (96 DPI 기준)
```

**DPI 계산:**

```
1 inch = 25.4 mm
A4 width = 210 mm = 8.27 inch
At 96 DPI: 8.27 * 96 ≈ 794 px
```

---

## 참고 자료

### 관련 파일

- [index.tsx](./index.tsx) - 메인 컴포넌트
- [usePageGenerator.ts](../../hooks/usePageGenerator.ts) - 페이지 계산 훅
- [measureSize.ts](./utils/measureSize.ts) - 크기 측정 유틸
- [convertElementToHtmlString.ts](../../lib/pdf/convertElementToHtmlString.ts) - HTML 변환

### 사용 예시

- [AnalysisPager.tsx](../Analysis/@PDF/AnalysisPager.tsx) - 분석 PDF
- [RequestPDFDialog.tsx](../Analysis/@PDF/RequestPDFDialog.tsx) - PDF 요청 다이얼로그
