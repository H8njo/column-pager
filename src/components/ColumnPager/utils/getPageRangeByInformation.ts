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

    // 페이지별 pageInformation 카운트
    const infoCountInPage: Record<string, number> = {};

    // 페이지의 모든 컬럼을 순회하며 각 pageInformation별 아이템 수 카운트
    pageData.forEach((columnItems) => {
      columnItems.forEach((item) => {
        const info = item.pageInformation;
        if (!info) return;
        infoCountInPage[info] = (infoCountInPage[info] || 0) + 1;
      });
    });

    // pageInformation별로 아이템이 2개 이상인 경우에만 range에 포함
    // (1개만 있으면 PageInformation 마커만 있는 것으로 간주)
    Object.entries(infoCountInPage).forEach(([info, count]) => {
      if (count < 2) return;

      if (!pageRangeMap[info]) {
        pageRangeMap[info] = [pageNumber, pageNumber];
      } else {
        pageRangeMap[info][1] = pageNumber;
      }
    });
  });

  return pageRangeMap;
};
