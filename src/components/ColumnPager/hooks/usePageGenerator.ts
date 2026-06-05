import React, {
  type ReactElement,
  type ReactNode,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { DATA_KEY } from '../controls/constants';
import type {
  ItemLayout,
  ItemSizeCache,
  MeasuredItem,
  PageLayoutCache,
  PageLayoutRenderer,
  Size,
} from '../types';
import { measureElementSize, measureSize } from '../utils/measureSize';

/** 측정 시 청크 크기 */
const MEASURE_CHUNK_SIZE = 30;

/** 레이아웃 측정 대상 키 목록 */
const LAYOUT_MEASURE_KEYS = [
  DATA_KEY.PAGE_HEADER,
  DATA_KEY.PAGE_BODY,
  DATA_KEY.PAGE_FOOTER,
  DATA_KEY.PAGE_COLUMN,
];

/**
 * columnCount에 맞는 아이템 크기 측정
 */
const measureItemsForColumnCount = async (
  targetColumnCount: number,
  childrenArray: ReactNode[],
  startIndex: number,
  endIndex: number,
  pageLayoutRenderer: PageLayoutRenderer,
  itemSizeCache: ItemSizeCache,
): Promise<MeasuredItem[]> => {
  const cacheKey = `${targetColumnCount}`;

  // 캐시에 있으면 재사용
  if (itemSizeCache.has(cacheKey)) {
    return itemSizeCache.get(cacheKey)!.slice(startIndex, endIndex);
  }

  // 레이아웃 측정
  const [layoutSizes] = await measureSize({
    elements: pageLayoutRenderer(0, [], targetColumnCount),
    config: {
      measureTargetKeys: LAYOUT_MEASURE_KEYS,
    },
  });
  const columnWidth = (layoutSizes?.[DATA_KEY.PAGE_COLUMN] as Size)?.width ?? 0;

  // 아이템 크기 측정
  const itemSizes = await measureSize({
    elements: childrenArray,
    config: {
      containerWidth: columnWidth,
      chunkSize: MEASURE_CHUNK_SIZE,
      measureTargetKeys: [DATA_KEY.PAGE_COLUMN_ITEM_INNER],
    },
  });

  const measuredItems: MeasuredItem[] = itemSizes.map(
    (
      {
        container,
        isPageBreaker,
        isColumnBreaker,
        changeColumnCountTo,
        pageInformation,
        [DATA_KEY.PAGE_COLUMN_ITEM_INNER]: innerItemSize,
        decoratorHeight,
      },
      index,
    ) => ({
      index,
      size: container ?? { width: 0, height: 0 },
      isPageBreaker,
      isColumnBreaker,
      changeColumnCountTo,
      pageInformation: pageInformation ?? undefined,
      innerSize: (innerItemSize as Size) ?? { width: 0, height: 0 },
      decoratorHeight,
    }),
  );

  itemSizeCache.set(cacheKey, measuredItems);
  return measuredItems.slice(startIndex, endIndex);
};

/**
 * 페이지 레이아웃 높이 측정
 */
const getPageHeight = async (
  pageNumber: number,
  columnCount: number,
  pageLayoutRenderer: PageLayoutRenderer,
  pageLayoutCache: PageLayoutCache,
): Promise<number> => {
  const cacheKey = `${pageNumber}-${columnCount}`;

  if (!pageLayoutCache.has(cacheKey)) {
    const [layoutSizes] = await measureSize({
      elements: pageLayoutRenderer(pageNumber, [], columnCount),
      config: {
        measureTargetKeys: LAYOUT_MEASURE_KEYS,
      },
    });

    const pageColumnSize = layoutSizes?.[DATA_KEY.PAGE_COLUMN] as Size | undefined;
    if (pageColumnSize) {
      pageLayoutCache.set(cacheKey, pageColumnSize);
    }
  }

  return pageLayoutCache.get(cacheKey)?.height ?? 0;
};

/**
 * 페이지별로 아이템 그룹화
 */
const groupItemsByPage = (items: ItemLayout[]): ItemLayout[][] => {
  const grouped = new Map<number, ItemLayout[]>();

  for (const item of items) {
    if (!item) continue;

    if (!grouped.has(item.pageNumber)) {
      grouped.set(item.pageNumber, []);
    }
    grouped.get(item.pageNumber)!.push(item);
  }

  return Array.from(grouped.values());
};

/** usePageGenerator 옵션 */
type UsePageGeneratorOptions = {
  /** 컬럼 높이를 초과하는 아이템을 다음 컬럼으로 이동시킬지 여부 */
  moveOversizedItemToNextColumn?: boolean;
};

/**
 * 아이템 배치 계산 - 메인 로직
 */
const calculateItemLayout = async (
  childrenArray: ReactNode[],
  initialColumnCount: number,
  pageLayoutRenderer: PageLayoutRenderer,
  pageLayoutCache: PageLayoutCache,
  itemSizeCache: ItemSizeCache,
  options: UsePageGeneratorOptions = {},
): Promise<ItemLayout[]> => {
  const { moveOversizedItemToNextColumn = false } = options;
  let currentColumnCount = initialColumnCount;

  // 초기 columnCount로 모든 아이템 측정
  let measuredItems = await measureItemsForColumnCount(
    currentColumnCount,
    childrenArray,
    0,
    childrenArray.length,
    pageLayoutRenderer,
    itemSizeCache,
  );

  // 배치 계산 변수
  let itemIndex = 0;
  let pageNumber = 0;
  let columnInPage = 0;
  let columnHeightAccumulated = 0;

  const layoutResults: ItemLayout[] = [];

  for (let i = 0; i < measuredItems.length; i++) {
    const item = measuredItems[i];
    const itemHeight = item.size.height;

    // 페이지 높이 가져오기
    const containerHeight = await getPageHeight(
      pageNumber,
      currentColumnCount,
      pageLayoutRenderer,
      pageLayoutCache,
    );

    // PageBreaker 인 경우 다음 페이지로 이동
    if (item.isPageBreaker) {
      pageNumber += 1;
      columnInPage = 0;
      columnHeightAccumulated = 0;

      // columnCount 변경 시 재측정
      if (item.changeColumnCountTo && item.changeColumnCountTo !== currentColumnCount) {
        currentColumnCount = item.changeColumnCountTo;
        const remainingItems = await measureItemsForColumnCount(
          currentColumnCount,
          childrenArray,
          i + 1,
          childrenArray.length,
          pageLayoutRenderer,
          itemSizeCache,
        );
        measuredItems = [...measuredItems.slice(0, i + 1), ...remainingItems];
      }

      itemIndex++;
      continue;
    }

    // ColumnBreaker 인 경우 다음 column으로 이동
    if (item.isColumnBreaker) {
      columnInPage += 1;
      columnHeightAccumulated = 0;

      // 페이지의 모든 column이 차면 다음 페이지로 이동
      if (columnInPage >= currentColumnCount) {
        pageNumber += 1;
        columnInPage = 0;
      }

      itemIndex++;
      continue;
    }

    if (itemHeight > containerHeight) {
      // 현재 컬럼에 내용이 있고, 남은 공간이 컨테이너 높이의 5% 미만이면 다음 컬럼으로 이동
      // (남은 공간이 너무 작으면 의미 있는 콘텐츠를 표시할 수 없으므로)
      const remainingHeight = containerHeight - columnHeightAccumulated;
      const shouldAdvanceToNextColumn =
        columnHeightAccumulated > 0 &&
        (moveOversizedItemToNextColumn || remainingHeight < containerHeight * 0.05);

      if (shouldAdvanceToNextColumn) {
        columnInPage += 1;
        columnHeightAccumulated = 0;

        // 페이지의 모든 column이 차면 다음 페이지로 이동
        if (columnInPage >= currentColumnCount) {
          pageNumber += 1;
          columnInPage = 0;
        }
      }

      const measuredOverflow = await measureElementSize({
        element: childrenArray[itemIndex] as ReactElement,
        containerWidth: item.size.width,
        containerHeight: containerHeight,
        offsetHeight: shouldAdvanceToNextColumn ? 0 : columnHeightAccumulated,
        measureTargetKeys: [DATA_KEY.PAGE_COLUMN_ITEM_INNER_DIV, DATA_KEY.PAGE_COLUMN_ITEM_INNER],
      });
      const paddingBorderMarginHeight = (item.decoratorHeight ?? 0) / 2;

      const innerDivSize = measuredOverflow[DATA_KEY.PAGE_COLUMN_ITEM_INNER_DIV] as
        | Size
        | undefined;
      const innerSize = measuredOverflow[DATA_KEY.PAGE_COLUMN_ITEM_INNER] as Size | undefined;
      // 서브픽셀 반올림으로 인한 column 누락 방지: floor 대신 round 사용
      // (예: innerDivWidth=2090, innerWidth=697 → 2.998이지만 실제로는 3 columns)
      const cropCount = Math.round((innerDivSize?.width ?? 0) / (innerSize?.width ?? 1));

      const firstItemHeight = shouldAdvanceToNextColumn
        ? containerHeight
        : containerHeight - columnHeightAccumulated;

      let croppedItemIndex = 0;

      const croppedItems: ItemLayout[] = [];

      for (let currentCropIndex = 0; currentCropIndex < cropCount; currentCropIndex++) {
        const cropTotalCount = cropCount;

        const isFirstItem = currentCropIndex === 0;
        const isLastItem = currentCropIndex + 1 === cropCount;

        // 페이지의 모든 column이 차면 다음 페이지로 이동
        if (columnInPage >= currentColumnCount) {
          pageNumber += 1;
          columnInPage = 0;
        }

        // 현재 페이지의 실제 높이 가져오기 (페이지별 헤더/푸터 차이 대응)
        const currentPageHeight = isFirstItem
          ? containerHeight
          : await getPageHeight(
              pageNumber,
              currentColumnCount,
              pageLayoutRenderer,
              pageLayoutCache,
            );

        const height = isFirstItem
          ? firstItemHeight
          : isLastItem
            ? (measuredOverflow.thresholdPosition?.top ?? 0) + paddingBorderMarginHeight * 2
            : currentPageHeight;

        const croppedItem: ItemLayout = {
          pageNumber,
          columnInPage,
          columnCount: currentColumnCount,
          index: itemIndex,
          pageInformation: item.pageInformation,
          // Crop 정보
          // - height: 외부 요소의 클리핑 높이 (페이지별 실제 높이 사용)
          // - containerHeight: 내부 CSS column 분할 기준 높이 (측정 시 사용한 값 유지)
          //   → translateX로 N번째 column을 표시하므로, 측정과 렌더링의 column 경계가 일치해야 함
          //   → 페이지별 높이가 다를 경우 외부 height가 클리핑을 담당
          height,
          offsetHeight: shouldAdvanceToNextColumn ? 0 : columnHeightAccumulated,
          paddingBorderMarginHeight,
          containerHeight: containerHeight,
          croppedItemIndex,
          innerItemWidth: item.innerSize.width,
          itemHeight: itemHeight,
          totalCroppedParts: cropTotalCount,
          isCropped: true,
        };

        croppedItems.push(croppedItem);
        if (!isLastItem) columnInPage += 1;

        croppedItemIndex++;
      }

      layoutResults.push(...croppedItems);
      itemIndex++;
      columnHeightAccumulated =
        (measuredOverflow.thresholdPosition?.top ?? 0) + paddingBorderMarginHeight * 2;
      continue;
    }

    // 높이 누적 및 오버플로우 체크 (column이 넘치면 다음 column으로 이동)
    columnHeightAccumulated += itemHeight;

    if (columnHeightAccumulated > containerHeight) {
      columnInPage += 1;

      // 페이지의 모든 column이 차면 다음 페이지로 이동
      if (columnInPage >= currentColumnCount) {
        pageNumber += 1;
        columnInPage = 0;
      }

      columnHeightAccumulated = itemHeight;
    }

    layoutResults.push({
      pageNumber,
      columnInPage,
      columnCount: currentColumnCount,
      index: itemIndex,
      pageInformation: item.pageInformation,
    });
    itemIndex++;
  }

  return layoutResults;
};

const usePageGenerator = (
  children: ReactNode,
  columnCount: number,
  pageLayoutRenderer: PageLayoutRenderer,
  options: UsePageGeneratorOptions = {},
): ItemLayout[][] => {
  const childrenArray = useMemo(() => React.Children.toArray(children), [children]);

  const [pages, setPages] = useState<ItemLayout[][]>([]);
  const pageLayoutCacheRef = useRef<PageLayoutCache>(new Map());
  const itemSizeCacheRef = useRef<ItemSizeCache>(new Map());
  const isCalculating = useRef(false);
  const lastChildrenLengthRef = useRef(0);

  useEffect(() => {
    if (childrenArray.length === 0) {
      setPages([]);
      return;
    }

    if (lastChildrenLengthRef.current === childrenArray.length && pages.length > 0) {
      return;
    }

    if (isCalculating.current) return;

    isCalculating.current = true;
    lastChildrenLengthRef.current = childrenArray.length;

    const calculatePages = async () => {
      try {
        const layoutResults = await calculateItemLayout(
          childrenArray,
          columnCount,
          pageLayoutRenderer,
          pageLayoutCacheRef.current,
          itemSizeCacheRef.current,
          options,
        );

        const groupedPages = groupItemsByPage(layoutResults);
        setPages(groupedPages);
      } catch (error) {
        console.error('Page calculation failed:', error);
      } finally {
        isCalculating.current = false;
      }
    };

    queueMicrotask(() => calculatePages());
  }, [childrenArray.length, columnCount, pageLayoutRenderer, pages.length]);

  return pages;
};

export default usePageGenerator;
