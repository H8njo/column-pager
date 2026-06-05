import { type ReactNode, useEffect, useMemo, useRef } from 'react';
import {
  convertElementToHtmlString,
  type HtmlDocumentOptions,
} from '../../lib/pdf/convertElementToHtmlString';
import Container from './components/Container';
import ItemCell from './components/ItemCell';
import { STABLE_ATTR, stableSelector } from './components/keys';
import Page from './components/Page';
import { type Orientation, type PageSizeName, resolvePageSize } from './components/pageSize';
import SliceView from './components/SliceView';
import ColumnBreak from './controls/ColumnBreak';
import PageBreak from './controls/PageBreak';
import SectionMark from './controls/SectionMark';
import StableGate from './controls/StableGate';
import type { Page as PageData, Placement } from './core/types';
import usePagination from './hooks/usePagination';
import { createDomMeasurer, type MeasurerConfig } from './measure/measureDom';

/** 숨김 처리용 CSS (DOM은 렌더, 화면에서만 숨김) */
const HIDDEN_CLASS = 'invisible absolute -top-[9999px] -left-[9999px]';

/** 헤더/푸터 렌더 함수 인자 */
export type PageInfo = { pageNumber: number; section?: string };

export type ColumnPagerProps = {
  children?: ReactNode;
  /** 페이지당 컬럼 수 (기본 1) */
  columnCount?: number;
  /** 페이지 나열 방향 (기본 vertical) */
  pageDirection?: 'horizontal' | 'vertical';
  /** 페이지 크기 프리셋 (기본 'A4') */
  pageSize?: PageSizeName;
  /** 페이지 방향 (기본 'portrait') */
  orientation?: Orientation;
  /** 페이지 폭/높이 직접 지정 (px) — 프리셋보다 우선 */
  pageWidth?: number;
  pageHeight?: number;
  /** 로딩 중이면 계산/렌더 보류 */
  loading?: boolean;
  /** 화면에서 숨김 (onPagesGenerated용으로 DOM은 유지) */
  hidden?: boolean;
  /** 컬럼에 적용할 클래스 */
  columnClassName?: string;
  /** 컬럼 사이 구분선 */
  showDividers?: boolean;
  /** 컬럼 높이 초과 아이템을 (자르기 전에) 다음 컬럼으로 먼저 이동 */
  moveOversizedItemToNextColumn?: boolean;
  /** 페이지 헤더 렌더 */
  header?: (info: PageInfo) => ReactNode;
  /** 페이지 푸터 렌더 */
  footer?: (info: PageInfo) => ReactNode;
  /** 페이지 생성 완료 콜백 (pages, PDF용 htmlString) */
  onPagesGenerated?: (pages: PageData[], htmlString: string) => void;
  /** stable 폴링 타임아웃 (ms). 초과 시 onStableTimeout 후 강제 emit. 기본 5000. */
  stableTimeoutMs?: number;
  /** stable 타임아웃 발생 시 콜백 */
  onStableTimeout?: () => void;
  /** 페이지네이션(측정/계산) 실패 콜백 */
  onError?: (error: unknown) => void;
  /** PDF용 HTML 문서 옵션 (폰트/페이지/기본 스타일 커스터마이즈) */
  htmlOptions?: HtmlDocumentOptions;
};

/** 컨테이너 내 모든 StableGate가 stable 인지 */
const checkAllStable = (container: HTMLElement): boolean => {
  const gates = container.querySelectorAll(stableSelector);
  return (
    gates.length === 0 || Array.from(gates).every((el) => el.getAttribute(STABLE_ATTR) === 'true')
  );
};

/** 페이지의 대표 section (첫 placement 기준) */
const sectionOfPage = (page: PageData): string | undefined => {
  for (const column of page) {
    for (const placement of column) {
      if (placement.section) return placement.section;
    }
  }
  return undefined;
};

const ColumnPager = ({
  children,
  columnCount = 1,
  pageDirection = 'vertical',
  pageSize = 'A4',
  orientation = 'portrait',
  pageWidth,
  pageHeight,
  loading,
  hidden,
  columnClassName,
  showDividers,
  moveOversizedItemToNextColumn = false,
  header,
  footer,
  onPagesGenerated,
  stableTimeoutMs = 5000,
  onStableTimeout,
  onError,
  htmlOptions,
}: ColumnPagerProps) => {
  const pageDims = useMemo(
    () => resolvePageSize(pageSize, orientation, pageWidth, pageHeight),
    [pageSize, orientation, pageWidth, pageHeight],
  );

  const measurerConfig: MeasurerConfig = useMemo(
    () => ({
      renderHeader: header ? (pageIndex) => header({ pageNumber: pageIndex + 1 }) : undefined,
      renderFooter: footer ? (pageIndex) => footer({ pageNumber: pageIndex + 1 }) : undefined,
      showDividers,
      columnClassName,
      pageWidth: pageDims.width,
      pageHeight: pageDims.height,
    }),
    [header, footer, showDividers, columnClassName, pageDims],
  );

  // measurer는 config가 바뀔 때만 새로 생성 → 캐시가 run 간 유지되고,
  // 설정 변경 시엔 새 인스턴스가 주입되어 재페이지네이션이 트리거된다.
  const measurer = useMemo(() => createDomMeasurer(measurerConfig), [measurerConfig]);

  const { pages, contentBlocks } = usePagination({
    children,
    columnCount,
    measurer,
    options: { moveOversizedItemToNextColumn },
    paused: loading,
    onError,
  });

  const containerRef = useRef<HTMLDivElement>(null);

  // ---- 렌더: placement → ItemCell / SliceView ----
  const renderPlacement = (placement: Placement): ReactNode => {
    const block = contentBlocks[placement.blockIndex];
    if (!block) return null;
    const { node, decoratorClassName } = block;

    if (placement.slice) {
      return (
        <SliceView
          key={`b${placement.blockIndex}-s${placement.slice.index}`}
          slice={placement.slice}
          decoratorClassName={decoratorClassName}
        >
          {node}
        </SliceView>
      );
    }
    return (
      <ItemCell key={`b${placement.blockIndex}`} decoratorClassName={decoratorClassName}>
        {node}
      </ItemCell>
    );
  };

  const renderedPages = pages.map((page, pageIndex) => {
    const section = sectionOfPage(page);
    const pageColumnCount = page.length || columnCount;
    return (
      <Page
        // biome-ignore lint/suspicious/noArrayIndexKey: 페이지 순서는 안정적
        key={pageIndex}
        columnCount={pageColumnCount}
        columns={page.map((column) => column.map(renderPlacement))}
        header={header?.({ pageNumber: pageIndex + 1, section })}
        footer={footer?.({ pageNumber: pageIndex + 1, section })}
        showDividers={showDividers}
        columnClassName={columnClassName}
        pageWidth={pageDims.width}
        pageHeight={pageDims.height}
      />
    );
  });

  // ---- HTML emit: stable 폴링 + 타임아웃 (결정 #4) ----
  const lastEmitted = useRef<PageData[] | null>(null);
  const htmlOptionsRef = useRef(htmlOptions);
  htmlOptionsRef.current = htmlOptions;

  useEffect(() => {
    if (loading || pages.length === 0) {
      lastEmitted.current = null;
      return;
    }
    if (lastEmitted.current === pages) return;
    const container = containerRef.current;
    if (!container || !onPagesGenerated) return;

    let rafId: number | null = null;
    let timedOut = false;
    const startedAt = Date.now();

    const emit = () => {
      const htmlString = convertElementToHtmlString(container.outerHTML, htmlOptionsRef.current);
      onPagesGenerated(pages, htmlString);
      lastEmitted.current = pages;
    };

    const tick = () => {
      if (timedOut) return;
      if (Date.now() - startedAt > stableTimeoutMs) {
        timedOut = true;
        onStableTimeout?.();
        emit(); // 무한 미생성 방지: 타임아웃 시 강제 emit
        return;
      }
      if (!checkAllStable(container)) {
        rafId = requestAnimationFrame(tick);
        return;
      }
      // stable 발견 후 한 사이클 더 settle 보장
      rafId = requestAnimationFrame(() => {
        rafId = requestAnimationFrame(() => {
          if (!checkAllStable(container) && Date.now() - startedAt <= stableTimeoutMs) {
            rafId = requestAnimationFrame(tick);
            return;
          }
          emit();
        });
      });
    };

    // 2프레임 워밍업 후 폴링 시작
    rafId = requestAnimationFrame(() => {
      rafId = requestAnimationFrame(tick);
    });

    return () => {
      if (rafId !== null) cancelAnimationFrame(rafId);
    };
  }, [pages, loading, onPagesGenerated, stableTimeoutMs, onStableTimeout]);

  if (loading || pages.length === 0) return null;

  return (
    <div className={hidden ? HIDDEN_CLASS : undefined}>
      <Container ref={containerRef} pageDirection={pageDirection}>
        {renderedPages}
      </Container>
    </div>
  );
};

export default Object.assign(ColumnPager, {
  PageBreak,
  ColumnBreak,
  SectionMark,
  StableGate,
});
