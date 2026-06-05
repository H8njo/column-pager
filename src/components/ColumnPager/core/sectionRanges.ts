import type { Page } from './types';

/** section 이름 → [시작페이지, 끝페이지] (1-base) */
export type SectionPageRanges = Record<string, [number, number]>;

/**
 * 각 section이 차지하는 페이지 범위를 계산한다.
 *
 * @example
 * getSectionPageRanges(pages)
 * // { vocabulary: [1, 3], grammar: [4, 6], answers: [7, 8] }
 */
export const getSectionPageRanges = (pages: Page[]): SectionPageRanges => {
  const ranges: SectionPageRanges = {};

  pages.forEach((columns, pageIndex) => {
    const pageNumber = pageIndex + 1;
    const sectionsInPage = new Set<string>();

    for (const column of columns) {
      for (const placement of column) {
        if (placement.section) sectionsInPage.add(placement.section);
      }
    }

    for (const section of sectionsInPage) {
      const existing = ranges[section];
      if (!existing) {
        ranges[section] = [pageNumber, pageNumber];
      } else {
        existing[1] = pageNumber;
      }
    }
  });

  return ranges;
};
