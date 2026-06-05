/**
 * column-pager
 *
 * React children을 A4 페이지 형태로 자동 페이지네이션하여
 * PDF 렌더링에 최적화된 레이아웃과 HTML 문자열을 생성하는 라이브러리.
 */

// 메인 컴포넌트 (compound: ColumnPager.PageBreaker / .ColumnBreaker / .PageInformation / .StableChecker)
export { default as ColumnPager } from './components/ColumnPager';

// 공개 타입
export type {
  ColumnPagerProps,
  ItemLayout,
  PageData,
  PageItemData,
  PagesData,
  Position,
  Size,
} from './components/ColumnPager/types';

// 타입 가드
export { isCroppedItem } from './components/ColumnPager/types';

// 유틸리티
export {
  getPageRangeByInformation,
  type PageRangeMap,
} from './components/ColumnPager/utils/getPageRangeByInformation';
export { convertElementToHtmlString } from './lib/pdf/convertElementToHtmlString';
