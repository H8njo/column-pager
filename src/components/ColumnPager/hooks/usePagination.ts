import { type ReactNode, useEffect, useMemo, useRef, useState } from 'react';
import { contentBlocksOf, toBlocks } from '../core/blocks';
import { groupIntoPages, paginate } from '../core/paginate';
import { blocksSignature } from '../core/signature';
import type { ContentBlock, Measurer, Page, PaginateOptions } from '../core/types';

type UsePaginationArgs = {
  children: ReactNode;
  columnCount: number;
  /** 측정 포트 — 주입식(테스트에선 fake, 실사용은 createDomMeasurer). 캐시는 인스턴스에 귀속. */
  measurer: Measurer;
  options?: PaginateOptions;
  /** loading 중이면 계산 보류 */
  paused?: boolean;
  /** 페이지네이션 실패 콜백 */
  onError?: (error: unknown) => void;
};

type UsePaginationResult = {
  pages: Page[];
  contentBlocks: ContentBlock[];
};

/**
 * children을 블록으로 정규화 → 측정(주입된 measurer) → 페이지네이션하여 Page[] 산출.
 *
 * 재계산 트리거:
 * - 구조 시그니처(내용 변화) — 길이 같고 내용만 바뀌어도 재계산
 * - columnCount 변화
 * - measurer 변화 — 페이지 크기/헤더·푸터 등 측정 설정이 바뀌면 새 measurer가 주입되어 재계산
 *
 * 동시성: runId로 "마지막 입력이 이긴다"를 보장 — 계산 중 입력이 또 바뀌어도 드롭하지 않고
 * 최신 결과만 반영한다(stale/race 방지).
 */
const usePagination = ({
  children,
  columnCount,
  measurer,
  options,
  paused,
  onError,
}: UsePaginationArgs): UsePaginationResult => {
  // signature: 재페이지네이션 트리거(구조 변화 감지)
  const signature = useMemo(() => blocksSignature(children), [children]);
  // options(예: moveOversizedItemToNextColumn)도 배치 결과를 바꾸므로 트리거에 포함.
  // 매 렌더 새 객체로 와도 직렬화 키는 내용이 같으면 안정적 → 토글 시에만 재계산.
  const optionsKey = useMemo(() => JSON.stringify(options ?? {}), [options]);
  // blocks/contentBlocks: 렌더용 — 최신 children 노드를 반영해야 한다.
  // (signature가 같아도 비구조적 prop 변경 — 예: StableGate의 stable — 이 화면에 반영되도록)
  const blocks = useMemo(() => toBlocks(children), [children]);
  const contentBlocks = useMemo(() => contentBlocksOf(blocks), [blocks]);

  const [pages, setPages] = useState<Page[]>([]);
  const runIdRef = useRef(0);
  const lastInputsRef = useRef<{
    signature: string;
    columnCount: number;
    measurer: Measurer;
    optionsKey: string;
  } | null>(null);

  const optionsRef = useRef(options);
  optionsRef.current = options;
  const onErrorRef = useRef(onError);
  onErrorRef.current = onError;

  useEffect(() => {
    if (paused) return;

    if (blocks.length === 0) {
      setPages([]);
      lastInputsRef.current = { signature, columnCount, measurer, optionsKey };
      return;
    }

    const prev = lastInputsRef.current;
    const sameInputs =
      prev?.signature === signature &&
      prev.columnCount === columnCount &&
      prev.measurer === measurer &&
      prev.optionsKey === optionsKey;
    if (sameInputs && pages.length > 0) return;

    const myRun = ++runIdRef.current;
    lastInputsRef.current = { signature, columnCount, measurer, optionsKey };

    (async () => {
      try {
        const placements = await paginate(blocks, columnCount, measurer, optionsRef.current ?? {});
        // 최신 실행만 반영 (계산 중 입력이 또 바뀌었으면 이 결과는 버림)
        if (myRun === runIdRef.current) setPages(groupIntoPages(placements));
      } catch (error) {
        if (myRun === runIdRef.current) {
          console.error('[ColumnPager] pagination failed:', error);
          onErrorRef.current?.(error);
        }
      }
    })();
  }, [signature, blocks, columnCount, measurer, paused, pages.length, optionsKey]);

  return { pages, contentBlocks };
};

export default usePagination;
