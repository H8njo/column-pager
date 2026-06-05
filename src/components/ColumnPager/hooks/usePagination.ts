import { type ReactNode, useEffect, useMemo, useRef, useState } from 'react';
import { contentBlocksOf, toBlocks } from '../core/blocks';
import { groupIntoPages, paginate } from '../core/paginate';
import { blocksSignature } from '../core/signature';
import type { ContentBlock, Page, PaginateOptions } from '../core/types';
import { createDomMeasurer, type MeasurerConfig } from '../measure/measureDom';

type UsePaginationArgs = {
  children: ReactNode;
  columnCount: number;
  measurerConfig: MeasurerConfig;
  options?: PaginateOptions;
  /** loading 중이면 계산 보류 */
  paused?: boolean;
};

type UsePaginationResult = {
  pages: Page[];
  contentBlocks: ContentBlock[];
};

/**
 * children을 블록으로 정규화 → 측정 → 페이지네이션하여 Page[] 산출.
 *
 * 재계산 트리거는 children '길이'가 아니라 구조 시그니처(결정 #2). 길이가 같고
 * 내용만 바뀌어도 올바르게 재계산된다.
 */
const usePagination = ({
  children,
  columnCount,
  measurerConfig,
  options,
  paused,
}: UsePaginationArgs): UsePaginationResult => {
  const signature = useMemo(() => blocksSignature(children), [children]);
  // biome-ignore lint/correctness/useExhaustiveDependencies: signature가 children 구조 변화를 대표 (의도적 dedup)
  const blocks = useMemo(() => toBlocks(children), [signature]);
  const contentBlocks = useMemo(() => contentBlocksOf(blocks), [blocks]);

  const [pages, setPages] = useState<Page[]>([]);
  const calculating = useRef(false);
  const lastSignature = useRef<string | null>(null);

  // 최신 측정 설정/옵션을 effect 안에서 stale 없이 참조
  const configRef = useRef(measurerConfig);
  configRef.current = measurerConfig;
  const optionsRef = useRef(options);
  optionsRef.current = options;

  useEffect(() => {
    if (paused) return;
    if (blocks.length === 0) {
      setPages([]);
      lastSignature.current = signature;
      return;
    }
    if (lastSignature.current === signature && pages.length > 0) return;
    if (calculating.current) return;

    calculating.current = true;
    lastSignature.current = signature;
    let cancelled = false;

    (async () => {
      try {
        const measurer = createDomMeasurer(configRef.current);
        const placements = await paginate(blocks, columnCount, measurer, optionsRef.current ?? {});
        if (!cancelled) setPages(groupIntoPages(placements));
      } catch (error) {
        console.error('[ColumnPager] pagination failed:', error);
      } finally {
        calculating.current = false;
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [signature, blocks, columnCount, paused, pages.length]);

  return { pages, contentBlocks };
};

export default usePagination;
