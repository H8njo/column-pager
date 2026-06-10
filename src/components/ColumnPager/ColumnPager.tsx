import { Fragment, type ReactNode, useEffect, useMemo, useRef, useState } from 'react';
import Container from './components/Container';
import ItemCell from './components/ItemCell';
import { STABLE_ATTR, stableSelector } from './components/keys';
import Page from './components/Page';
import { DEFAULT_PAGE_HEIGHT } from './components/PageSheet';
import SliceView from './components/SliceView';
import ColumnBreak from './controls/ColumnBreak';
import Decorator from './controls/Decorator';
import PageBreak from './controls/PageBreak';
import SectionMark from './controls/SectionMark';
import StableGate from './controls/StableGate';
import type { Page as PageData, Placement } from './core/types';
import usePagination from './hooks/usePagination';
import { createDomMeasurer, type MeasurerConfig } from './measure/measureDom';

/**
 * 숨김 처리용 CSS (DOM은 렌더, 화면에서만 숨김).
 * absolute로 흐름에서 빼면 폭이 0으로 축소돼 ResizeObserver가 0을 측정 → 영구 paused가 되어
 * onPagesGenerated가 영영 안 fire된다(hidden 측정 전용 용도가 깨짐). 흐름 안에 두되 높이만
 * 0으로 접고 overflow를 숨겨, 폭은 정상 측정되면서 화면엔 안 보이고 세로 공간도 안 먹게 한다.
 */
const HIDDEN_CLASS = 'invisible h-0 overflow-hidden';

/** 헤더/푸터 렌더 함수 인자 */
export type PageInfo = { pageNumber: number; section?: string };

/** renderItem 래퍼 인자 — 배치된 한 셀을 감쌀 때 전달된다 */
export type RenderItemInfo = {
  /** 소비자 child key 기반 안정적 정체성 (key 미지정 시 undefined). layout 애니메이션 식별자로 사용. */
  id?: string;
  /** content 블록 인덱스 (위치 기반) */
  blockIndex: number;
  /** 큰 아이템이 잘려 여러 조각으로 렌더되는 슬라이스인지 (true면 layout 애니메이션 비권장) */
  sliced: boolean;
  /** 슬라이스 조각 인덱스 (0부터). 슬라이스가 아니면 undefined. 첫 조각(0)에만 컨트롤을 다는 용도. */
  sliceIndex?: number;
  /** 전체 슬라이스 조각 수. 슬라이스가 아니면 undefined. */
  sliceCount?: number;
  /** 페이지 번호 (1부터) */
  pageNumber: number;
  /** 렌더된 셀(ItemCell/SliceView) — 이걸 motion 등으로 감싸 반환 */
  children: ReactNode;
};

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
  /**
   * 컬럼/본문 박스 클립 여부 (기본 true = 현 동작). false면 Column·Body가 overflow-visible이
   * 되어 layout 애니메이션(renderItem) 중 이동하는 셀이 잘리지 않는다. 큰 아이템 슬라이스는
   * SliceView가 자체 클립하고 페이지 높이는 PageSheet가 계속 클립하므로 정상 상태 모양은 유지.
   */
  clipOverflow?: boolean;
  /** 컬럼 높이 초과 아이템을 (자르기 전에) 다음 컬럼으로 먼저 이동 */
  moveOversizedItemToNextColumn?: boolean;
  /**
   * 같은 컬럼 안 아이템(카드) 사이 세로 간격(px). 컬럼 첫 아이템 위에는 적용되지 않는다.
   * 페이지네이션 높이 계산과 렌더(Column flex gap)에 함께 반영되어 별도 스페이서가 필요 없다.
   */
  itemGap?: number;
  /** 페이지 헤더 렌더 */
  header?: (info: PageInfo) => ReactNode;
  /** 페이지 푸터 렌더 */
  footer?: (info: PageInfo) => ReactNode;
  /**
   * 배치된 각 셀을 감싸는 래퍼(선택). 순서/위치 변경 시 framer-motion 등으로 layout
   * 애니메이션을 입히는 용도. 라이브러리는 framer-motion에 의존하지 않으며, 소비자가
   * motion.div(layoutId) 등을 직접 반환한다. 미지정 시 셀을 그대로 렌더.
   * 안정적 정체성(info.id)은 child에 부여한 React key에서 온다.
   */
  renderItem?: (info: RenderItemInfo) => ReactNode;
  /** 페이지 생성 완료 콜백. html은 렌더된 컨테이너의 outerHTML(문서 변환은 소비자 몫). */
  onPagesGenerated?: (pages: PageData[], html: string) => void;
  /** stable 폴링 타임아웃 (ms). 초과 시 onStableTimeout 후 강제 emit. 기본 5000. */
  stableTimeoutMs?: number;
  /** stable 타임아웃 발생 시 콜백 */
  onStableTimeout?: () => void;
  /** 페이지네이션(측정/계산) 실패 콜백 */
  onError?: (error: unknown) => void;
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
  clipOverflow = true,
  moveOversizedItemToNextColumn = false,
  itemGap = 0,
  header,
  footer,
  renderItem,
  onPagesGenerated,
  stableTimeoutMs = 5000,
  onStableTimeout,
  onError,
}: ColumnPagerProps) => {
  const containerRef = useRef<HTMLDivElement>(null);

  // pageHeight<=0이면 columnHeight가 0이 되어 모든 아이템이 한 자리에 쌓여 클리핑된다.
  // 잘못된 입력은 기본값으로 폴백.
  const safePageHeight = pageHeight > 0 ? pageHeight : DEFAULT_PAGE_HEIGHT;

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
        ? (pageIndex: number) => headerRef.current?.({ pageNumber: pageIndex + 1 })
        : undefined,
      renderFooter: hasFooter
        ? (pageIndex: number) => footerRef.current?.({ pageNumber: pageIndex + 1 })
        : undefined,
      showDividers,
      columnClassName,
      containerWidth,
      pageHeight: safePageHeight,
    }),
    [hasHeader, hasFooter, showDividers, columnClassName, containerWidth, safePageHeight],
  );

  // measurer는 config(컨테이너 폭 포함)가 바뀔 때만 새로 생성 → 캐시 유지 + 폭 변경 시 재페이지네이션.
  const measurer = useMemo(() => createDomMeasurer(measurerConfig), [measurerConfig]);

  const { pages, contentBlocks } = usePagination({
    children,
    columnCount,
    measurer,
    options: { moveOversizedItemToNextColumn, itemGap },
    // 폭이 아직 측정되지 않았으면(0) 보류 — 0폭 측정은 무의미
    paused: loading || containerWidth === 0,
    onError,
  });

  // ---- 렌더: placement → ItemCell / SliceView (+ 선택적 renderItem 래퍼) ----
  const renderPlacement = (placement: Placement, pageIndex: number): ReactNode => {
    const block = contentBlocks[placement.blockIndex];
    if (!block) return null;
    const { node, decoratorClassName, id } = block;
    const sliced = !!placement.slice;

    const cell = sliced ? (
      <SliceView
        slice={placement.slice as NonNullable<Placement['slice']>}
        decoratorClassName={decoratorClassName}
      >
        {node}
      </SliceView>
    ) : (
      <ItemCell decoratorClassName={decoratorClassName}>{node}</ItemCell>
    );

    // 안정적 정체성: 소비자 key(id) 우선, 없으면 위치 기반(blockIndex)으로 폴백.
    // 순서가 바뀌어도 같은 아이템이 같은 React key를 유지 → layout 애니메이션이 "이동"으로 인식.
    const baseKey = id ?? `b${placement.blockIndex}`;
    const key = sliced
      ? `${baseKey}-s${(placement.slice as NonNullable<Placement['slice']>).index}`
      : baseKey;

    const rendered = renderItem
      ? renderItem({
          id,
          blockIndex: placement.blockIndex,
          sliced,
          sliceIndex: placement.slice?.index,
          sliceCount: placement.slice?.count,
          pageNumber: pageIndex + 1,
          children: cell,
        })
      : cell;

    return <Fragment key={key}>{rendered}</Fragment>;
  };

  const renderedPages = pages.map((page, pageIndex) => {
    const section = sectionOfPage(page);
    const pageColumnCount = page.length || columnCount;
    return (
      <Page
        // biome-ignore lint/suspicious/noArrayIndexKey: 페이지 순서는 안정적
        key={pageIndex}
        columnCount={pageColumnCount}
        columns={page.map((column) => column.map((p) => renderPlacement(p, pageIndex)))}
        header={header?.({ pageNumber: pageIndex + 1, section })}
        footer={footer?.({ pageNumber: pageIndex + 1, section })}
        showDividers={showDividers}
        columnClassName={columnClassName}
        pageHeight={safePageHeight}
        clip={clipOverflow}
        itemGap={itemGap}
      />
    );
  });

  // ---- emit: stable 폴링 + 타임아웃 (결정 #4) ----
  // 라이브러리는 "렌더된 내용(outerHTML)"만 내보낸다. PDF용 문서 변환(폰트/@page/
  // 스타일시트 인라인)은 소비자 몫.
  const lastEmitted = useRef<PageData[] | null>(null);

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
      onPagesGeneratedRef.current?.(pages, container.outerHTML);
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
  Decorator,
});
