/**
 * column-pager
 *
 * React children을 A4 페이지로 자동 페이지네이션하여 PDF 렌더링용 레이아웃과
 * HTML 문자열을 생성하는 라이브러리.
 *
 * - 작은 요소: 컬럼을 채우다 넘치면 다음 컬럼/페이지
 * - 큰 요소: CSS 멀티컬럼 기법으로 잘라 여러 컬럼/페이지에 이어 표현
 * - 컴파운드 컨트롤: ColumnPager.PageBreak / .ColumnBreak / .SectionMark / .StableGate
 */
export * from './components/ColumnPager';
export {
  convertElementToHtmlString,
  type HtmlDocumentOptions,
} from './lib/pdf/convertElementToHtmlString';
