/**
 * ColumnPager
 *
 * React children을 A4 페이지로 자동 페이지네이션. 작은 요소는 컬럼을 채우며 흐르고,
 * 컬럼 높이를 초과하는 요소는 CSS 멀티컬럼 기법으로 잘라 여러 컬럼/페이지에 이어 표현.
 */

export type { ColumnPagerProps, PageInfo } from './ColumnPager';
export { default as ColumnPager } from './ColumnPager';
// 컨트롤 props 타입 (컴파운드 API: ColumnPager.PageBreak 등)
export type { PageBreakProps } from './controls/PageBreak';
export type { SectionMarkProps } from './controls/SectionMark';
export type { StableGateProps } from './controls/StableGate';
// 배치 결과 조회 유틸
export { findItemPage, getPageCount, isSliced } from './core/query';
// 섹션 페이지 범위 유틸
export { getSectionPageRanges, type SectionPageRanges } from './core/sectionRanges';
// 공개 데이터 타입
export type { Column, Page, Placement, Size, Slice } from './core/types';
