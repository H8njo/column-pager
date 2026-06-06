import type { Page, Placement } from './types';

/**
 * 배치 결과 조회 유틸 (순수).
 */

/** 슬라이스된(잘린) 조각인지 — V1 isCroppedItem 대체 */
export const isSliced = (placement: Placement): boolean => placement.slice !== undefined;

/** 총 페이지 수 */
export const getPageCount = (pages: Page[]): number => pages.length;

/**
 * 특정 콘텐츠 블록(blockIndex)이 처음 등장하는 페이지 번호(1-base).
 * 목차/북마크 생성에 유용. 없으면 -1.
 */
export const findItemPage = (pages: Page[], blockIndex: number): number => {
  for (let p = 0; p < pages.length; p++) {
    for (const column of pages[p]) {
      if (column.some((placement) => placement.blockIndex === blockIndex)) {
        return p + 1;
      }
    }
  }
  return -1;
};
