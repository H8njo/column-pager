import type { PagesData } from '../types';

export type PageRangeMap = Record<string, [number, number]>;

/**
 * PagesData에서 각 pageInformation별 페이지 범위를 계산합니다.
 *
 * @param pagesData - ColumnPager에서 생성된 페이지 데이터
 * @returns pageInformation을 키로, [시작페이지, 끝페이지]를 값으로 하는 객체
 *
 * @example
 * const pageRanges = getPageRangeByInformation(pagesData)
 * // { vocabularyChoice: [1, 3], grammarChoice: [4, 6], answers: [7, 8] }
 */
export const getPageRangeByInformation = (pagesData: PagesData): PageRangeMap => {
  const pageRangeMap: PageRangeMap = {};

  pagesData.forEach((pageData, pageIndex) => {
    const pageNumber = pageIndex + 1;

    // 페이지의 모든 컬럼을 순회
    pageData.forEach((columnItems) => {
      columnItems.forEach((item) => {
        const info = item.pageInformation;
        if (!info) return;

        if (!pageRangeMap[info]) {
          // 처음 등장하는 pageInformation
          pageRangeMap[info] = [pageNumber, pageNumber];
        } else {
          // 기존 범위의 끝 페이지 업데이트
          pageRangeMap[info][1] = pageNumber;
        }
      });
    });
  });

  return pageRangeMap;
};
