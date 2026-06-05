import { type ReactNode, useEffect, useMemo, useRef, useState } from 'react';
import {
  convertElementToHtmlString,
  type HtmlDocumentOptions,
} from '../../lib/pdf/convertElementToHtmlString';
import Container from './components/Container';
import ItemCell from './components/ItemCell';
import { STABLE_ATTR, stableSelector } from './components/keys';
import Page from './components/Page';
import { DEFAULT_PAGE_HEIGHT } from './components/PageSheet';
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

/** 헤더/푸터 렌더 함수 인자. (첫 페이지 = pageNumber===1, 마지막 = pageNumber===pageCount) */
export type PageInfo = { pageNumber: number; pageCount: number; section?: string };

export type ColumnPagerProps = {
  children?: ReactNode;
  /** 페이지당 컬럼 수 (기본 1) */
  columnCount?: number;
  /** 페이지 나열 방향 (기본 vertical) */
  pageDirection?: 'horizontal' | 'vertical';
  /** 페이지 높이 (px). 폭은 컨테이너에 맞춰 반응형. 기본 1123. */
  pageHeight?: number;
  /** 컨테이너 폭 변경 후 재페이지네이션까지의 디바운스 (ms). 기본 150. */
  resizeDebounceMs?: number;
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
  /** 페이지 생성 완료 콜백 (pages, htmlString) */
  onPagesGenerated?: (pages: PageData[], htmlString: string) => void;
  /** stable 폴링 타임아웃 (ms). 초과 시 onStableTimeout 후 강제 emit. 기본 5000. */
  stableTimeoutMs?: number;
  /** stable 타임아웃 발생 시 콜백 */
  onStableTimeout?: () => void;
  /** 페이지네이션(측정/계산) 실패 콜백 */
  onError?: (error: unknown) => void;
  /** HTML 문서 옵션 (폰트/페이지/기본 스타일 커스터마이즈) */
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
  pageHeight = DEFAULT_PAGE_HEIGHT,
  resizeDebounceMs = 150,
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
  const containerRef = useRef<HTMLDivElement>(null);

  // 콜백/렌더 함수의 "식별자 변화"가 재계산/재emit을 유발하지 않도록 ref로 분리한다.
  // (소비자가 header/footer/onPagesGenerated를 인라인 함수로 넘기는 흔한 패턴에서
  //  measurer가 매 렌더 재생성 → 무한 재페이지네이션 루프가 되는 것을 방지)
  const headerRef = useRef(header);
  headerRef.current = header;
  const footerRef = useRef(footer);
  footerRef.current = footer;
  const onPagesGeneratedRef = useRef(onPagesGenerated);
  onPagesGeneratedRef.current = onPagesGenerated;
  const onStableTimeoutRef = useRef(onStableTimeout);
  onStableTimeoutRef.current = onStableTimeout;

  // 컨테이너 폭을 측정(반응형). 리사이즈는 디바운스 후 반영 → 재페이지네이션.
  const [containerWidth, setContainerWidth] = useState(0);

  useEffect(() => {
    const el = containerRef.current;
    if (!el || typeof ResizeObserver === 'undefined') return;

    let timer: ReturnType<typeof setTimeout> | undefined;
    const observer = new ResizeObserver((entries) => {
      const width = Math.round(entries[0]?.contentRect.width ?? 0);
      if (timer) clearTimeout(timer);
      timer = setTimeout(() => setContainerWidth(width), resizeDebounceMs);
    });
    observer.observe(el);

    return () => {
      if (timer) clearTimeout(timer);
      observer.disconnect();
    };
  }, [resizeDebounceMs]);

  // 측정 차원에 실제 영향을 주는 입력만 deps에 둔다. header/footer는 "존재 여부"만
  // 보고(높이 0 여부), 내용은 ref로 최신값을 읽어 측정 → 함수 식별자 변화로 measurer가
  // 재생성되지 않는다(루프 방지). header/footer 높이가 동적으로 바뀌는 드문 경우는
  // 폭/높이/columnCount 변경이나 콘텐츠 변경 시 함께 반영된다.
  const hasHeader = !!header;
  const hasFooter = !!footer;
  const measurerConfig: MeasurerConfig = useMemo(
    () => ({
      renderHeader: hasHeader
        ? (pageIndex: number, pageCount: number) =>
            headerRef.current?.({ pageNumber: pageIndex + 1, pageCount })
        : undefined,
      renderFooter: hasFooter
        ? (pageIndex: number, pageCount: number) =>
            footerRef.current?.({ pageNumber: pageIndex + 1, pageCount })
        : undefined,
      showDividers,
      columnClassName,
      containerWidth,
      pageHeight,
    }),
    [hasHeader, hasFooter, showDividers, columnClassName, containerWidth, pageHeight],
  );

  // measurer는 config(컨테이너 폭 포함)가 바뀔 때만 새로 생성 → 캐시 유지 + 폭 변경 시 재페이지네이션.
  const measurer = useMemo(() => createDomMeasurer(measurerConfig), [measurerConfig]);

  const { pages, contentBlocks } = usePagination({
    children,
    columnCount,
    measurer,
    options: { moveOversizedItemToNextColumn },
    // 폭이 아직 측정되지 않았으면(0) 보류 — 0폭 측정은 무의미
    paused: loading || containerWidth === 0,
    onError,
  });

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
        header={header?.({ pageNumber: pageIndex + 1, pageCount: pages.length, section })}
        footer={footer?.({ pageNumber: pageIndex + 1, pageCount: pages.length, section })}
        showDividers={showDividers}
        columnClassName={columnClassName}
        pageHeight={pageHeight}
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
    if (!container || !onPagesGeneratedRef.current) return;

    let rafId: number | null = null;
    let timedOut = false;
    const startedAt = Date.now();

    const emit = () => {
      const htmlString = convertElementToHtmlString(container.outerHTML, htmlOptionsRef.current);
      onPagesGeneratedRef.current?.(pages, htmlString);
      lastEmitted.current = pages;
    };

    // 빠른 경로: StableGate가 하나도 없으면 settle을 기다릴 이유가 없다.
    // effect는 커밋 후 실행되어 DOM이 이미 최신이므로 즉시 emit.
    if (container.querySelectorAll(stableSelector).length === 0) {
      emit();
      return;
    }

    const tick = () => {
      if (timedOut) return;
      if (Date.now() - startedAt > stableTimeoutMs) {
        timedOut = true;
        onStableTimeoutRef.current?.();
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

    rafId = requestAnimationFrame(() => {
      rafId = requestAnimationFrame(tick);
    });

    return () => {
      if (rafId !== null) cancelAnimationFrame(rafId);
    };
    // 콜백은 ref로 최신값을 읽으므로 deps에서 제외 — 인라인 콜백 식별자 변화로 재emit하지 않음
  }, [pages, loading, stableTimeoutMs]);

  // 컨테이너는 항상 렌더 — ResizeObserver가 폭을 측정해야 첫 페이지네이션이 시작된다.
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
