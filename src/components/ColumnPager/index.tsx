import { groupBy, isEmpty } from 'lodash-es';
import React, {
  cloneElement,
  type ReactElement,
  type ReactNode,
  useDeferredValue,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { cn } from '@/lib/utils';
import Column, { ColumnItem } from './@layout/Column';
import Container from './@layout/Container';
import Page from './@layout/Page';
import ColumnBreaker from './controls/ColumnBreaker';
import { DATA_KEY, DATA_PAGE_INFORMATION } from './controls/constants';
import PageBreaker from './controls/PageBreaker';
import PageInformation from './controls/PageInformation';
import StableChecker, { checkAllStable } from './controls/StableChecker';
import usePageGenerator from './hooks/usePageGenerator';
import type { ColumnItemElementProps, ColumnPagerProps, FlattenedChild, PageData } from './types';
import { convertElementToHtmlString } from './utils/convertElementToHtmlString';
import { measureElementSize } from './utils/measureSize';

/** 숨김 처리용 CSS 클래스 */
const HIDDEN_CLASS = 'invisible absolute -top-[9999px] -left-[9999px]';

// Re-export types for external use
export type { ItemLayout, PageData, PageItemData, PagesData } from './types';
export { isCroppedItem } from './types';
export { getPageRangeByInformation, type PageRangeMap } from './utils/getPageRangeByInformation';

const ColumnPager = ({
  columnCount = 1,
  pageDirection = 'vertical',
  children,
  loading,
  hidden,
  columnClassName,
  showDividers,
  onPagesGenerated,
  header,
  footer,
}: ColumnPagerProps) => {
  const [isStable, setIsStable] = useState(false);
  const deferredChildren = useDeferredValue(children);

  useEffect(() => {
    if (loading) {
      setIsStable(false);
      return;
    }

    const idleId = requestIdleCallback(
      () => setIsStable(true),
      // NOTE: 유후 대기시간이 너무 길면 주석 풀 예정
      // { timeout: 2000 },
    );

    return () => cancelIdleCallback(idleId);
  }, [deferredChildren, loading]);

  const childrenArray = useMemo(() => {
    if (!isStable) return [];

    // Fragment를 재귀적으로 평탄화하는 함수
    const flattenFragments = (children: ReactNode): ReactNode[] => {
      const result: ReactNode[] = [];

      React.Children.forEach(children, (child) => {
        if (React.isValidElement(child) && child.type === React.Fragment) {
          // Fragment인 경우 재귀적으로 평탄화
          const childProps = child.props as { children?: ReactNode };
          result.push(...flattenFragments(childProps.children));
        } else {
          result.push(child);
        }
      });

      return result;
    };

    return flattenFragments(deferredChildren);
  }, [deferredChildren, isStable]);

  // 최상위 Fragment만 평탄화하여 children 배열 생성
  const [flattenedChildren, setFlattenedChildren] = useState<ReactNode[]>([]);

  useEffect(() => {
    if (childrenArray.length === 0) {
      setFlattenedChildren([]);
      return;
    }

    const processFlattenedChildren = async () => {
      const result: ReactNode[] = [];
      let informationName: string | undefined;

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
            <div
              data-key={DATA_KEY.PAGE_COLUMN_ITEM_INNER}
              className="w-full"
              style={{ columnCount: 1, columnGap: 0 }}
            >
              <div data-key={DATA_KEY.PAGE_COLUMN_ITEM_INNER_DIV}>{child}</div>
              <div data-key={DATA_KEY.PAGE_COLUMN_ITEM_INNER_THRESHOLD} />
            </div>
          </ColumnItem>,
        );
      };

      // child를 평탄화하는 함수 (decorator, Fragment 2뎁스만 확인)
      const flattenChild = async (child: ReactNode): Promise<FlattenedChild[]> => {
        if (!React.isValidElement(child)) return [{ child }];

        const childProps = child.props as Record<string, unknown>;

        if (childProps['data-key'] === DATA_KEY.PAGE_COLUMN_ITEM_DECORATOR) {
          const decoratorClass = childProps['className'] as string | undefined;
          const decoratorChildren = React.Children.toArray(childProps.children as ReactNode);

          // decorator 높이 측정
          const emptyDecorator = cloneElement(child, { children: [] } as never);
          const decoratorSize = await measureElementSize({
            element: emptyDecorator as ReactElement,
            containerWidth: 100,
            measureTargetKeys: ['page-column-item-decorator'],
          });
          const decoratorHeight = decoratorSize.container?.height;

          // 2뎁스: decorator 안에 Fragment가 있으면 벗겨내기
          return decoratorChildren.flatMap((decoratorChild) => {
            if (React.isValidElement(decoratorChild) && decoratorChild.type === React.Fragment) {
              const fragmentProps = decoratorChild.props as Record<string, unknown>;
              const fragmentChildren = React.Children.toArray(fragmentProps.children as ReactNode);
              return fragmentChildren.map((c) => ({
                child: c,
                decoratorClassName: decoratorClass,
              }));
            }
            return [{ child: decoratorChild, decoratorClassName: decoratorClass, decoratorHeight }];
          });
        }

        // 1뎁스: Fragment인 경우 벗겨내기
        if (child.type === React.Fragment) {
          const fragmentChildren = React.Children.toArray(childProps.children as ReactNode);
          return fragmentChildren.map((c) => ({ child: c }));
        }

        return [{ child }];
      };

      for (const child of childrenArray) {
        if (React.isValidElement(child)) {
          const childProps = child.props as Record<string, unknown>;
          informationName =
            (childProps[DATA_PAGE_INFORMATION] as string | undefined) || informationName;
        }

        const flattened = await flattenChild(child);
        flattened.forEach(({ child: flatChild, decoratorClassName, decoratorHeight }) => {
          addColumnItem(flatChild, informationName, decoratorClassName, decoratorHeight);
        });
      }

      setFlattenedChildren(result);
    };

    processFlattenedChildren();
  }, [childrenArray]);

  const PageRenderer = useMemo(
    () =>
      (pageNumber: number, columnData?: PageData, pageColumnCount: number = columnCount) => {
        const pageInformation = columnData?.[0]?.[0]?.pageInformation;
        return [
          <Page
            showDividers={showDividers}
            columnCount={pageColumnCount}
            key={String(pageNumber)}
            pageInformation={pageInformation}
            header={header?.({ pageNumber, pageInformation })}
            footer={footer?.({ pageNumber, pageInformation })}
          >
            {Array.from({ length: pageColumnCount }).map((_, colIndex) => (
              <Column key={String(colIndex)} className={columnClassName}>
                {columnData?.[colIndex]?.map((item) => {
                  const element = flattenedChildren[item.index] as ColumnItemElementProps;
                  // 아이템별 키 추가

                  if (!React.isValidElement(element)) return element;
                  if (!item.isCropped) {
                    return React.cloneElement(element, { key: `item-${item.index}` });
                  }

                  // data-key가 page-column-item-inner인 요소 찾기
                  const elementProps = element.props as {
                    children: ReactElement;
                    style?: React.CSSProperties;
                  };
                  const innerElement = elementProps.children;
                  const innerProps = innerElement.props as {
                    children?: ReactNode;
                    style?: React.CSSProperties;
                  };

                  const innerElementWithOffset = React.cloneElement(innerElement, {
                    children: [
                      <div
                        key={`item-${item.index}-offset`}
                        style={{ height: item.offsetHeight }}
                      />,
                      ...(React.Children.toArray(innerProps.children) as ReactNode[]),
                    ],
                    style: {
                      ...innerProps.style,
                      flexGrow: 1,
                      height:
                        item.croppedItemIndex !== 0
                          ? (item.containerHeight ?? 0) - (item.paddingBorderMarginHeight ?? 0) * 2
                          : (item.height ?? 0) - (item.paddingBorderMarginHeight ?? 0) * 2,
                      transform: `translateX(-${(item.croppedItemIndex ?? 0) * (item.innerItemWidth ?? 0)}px)`,
                    },
                  } as never);

                  return React.cloneElement(element, {
                    key: `item-${item.index}`,
                    style: {
                      ...elementProps.style,
                      height: item.height,
                    },
                    children: (
                      <div className="flex flex-grow overflow-hidden">{innerElementWithOffset}</div>
                    ),
                  });
                })}
              </Column>
            ))}
          </Page>,
        ];
      },
    [columnCount, flattenedChildren, columnClassName, header, footer],
  );

  const pages = usePageGenerator(flattenedChildren, columnCount, PageRenderer);

  const pagesData = useMemo(() => {
    return pages.map((page) => {
      if (page.length === 0) return [];

      // 페이지의 columnCount 가져오기 (모든 아이템이 같은 columnCount를 가짐)
      const pageColumnCount = page[0].columnCount;
      const columnData: PageData = Array.from({ length: pageColumnCount }, () => []);

      // 데이터가 있는 column에만 아이템 채우기
      const grouped = groupBy(page, 'columnInPage');
      Object.entries(grouped).forEach(([columnInPage, items]) => {
        const colIndex = Number(columnInPage);
        columnData[colIndex] = items.map((item, cardIndex) => ({
          ...item,
          index: Number(item.index),
          arrayIndex: cardIndex,
          columnCount: pageColumnCount,
        }));
      });

      return columnData;
    });
  }, [pages]);

  const containerRef = useRef<HTMLDivElement>(null);

  const renderedPages = useMemo(
    () =>
      pagesData.map((columns, pageIndex) =>
        PageRenderer(pageIndex + 1, columns, columns[0]?.[0]?.columnCount),
      ),
    [pagesData, PageRenderer],
  );

  const hasGeneratedRef = useRef(false);
  const lastPagesLengthRef = useRef(0);

  useEffect(() => {
    if (isEmpty(pagesData)) {
      hasGeneratedRef.current = false;
      lastPagesLengthRef.current = 0;
      return;
    }

    // pages 길이가 변경되지 않았고 이미 생성했다면 재생성하지 않음
    if (hasGeneratedRef.current && lastPagesLengthRef.current === pagesData.length) {
      return;
    }

    const container = containerRef.current;
    if (!container) return;

    let rafId: number | null = null;
    const checkAndGenerate = () => {
      if (checkAllStable(container)) {
        const htmlString = convertElementToHtmlString(container.outerHTML);
        onPagesGenerated?.(pagesData, htmlString);
        hasGeneratedRef.current = true;
        lastPagesLengthRef.current = pagesData.length;
      } else {
        // 아직 stable하지 않으면 다음 프레임에 다시 체크
        rafId = requestAnimationFrame(checkAndGenerate);
      }
    };

    // 2프레임 후 체크 시작 (초기 렌더링 대기)
    rafId = requestAnimationFrame(() => {
      rafId = requestAnimationFrame(checkAndGenerate);
    });

    return () => {
      if (rafId !== null) {
        cancelAnimationFrame(rafId);
      }
    };
  }, [pagesData.length, onPagesGenerated, pagesData]);

  if (isEmpty(pages) || loading) {
    return null;
  }

  // hidden일 때도 DOM 렌더링 (onPagesGenerated를 위해), CSS로 숨김
  return (
    <div className={hidden ? HIDDEN_CLASS : undefined}>
      <Container ref={containerRef} pageDirection={pageDirection}>
        {renderedPages}
      </Container>
    </div>
  );
};

export default Object.assign(ColumnPager, {
  StableChecker,
  PageBreaker,
  ColumnBreaker,
  PageInformation,
});
