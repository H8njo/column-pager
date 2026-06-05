/**
 * column-pager
 *
 * React children을 반응형 멀티컬럼 페이지로 페이지네이션하는 렌더러.
 *
 * - 작은 요소: 컬럼을 채우다 넘치면 다음 컬럼/페이지
 * - 큰 요소: CSS 멀티컬럼 기법으로 잘라 여러 컬럼/페이지에 이어 표현
 * - 컴파운드 컨트롤: ColumnPager.PageBreak / .ColumnBreak / .SectionMark / .StableGate
 * - onPagesGenerated(pages, html): 렌더된 outerHTML을 받아 PDF 등으로의 변환은 소비자가 처리
 */
export * from './components/ColumnPager';
