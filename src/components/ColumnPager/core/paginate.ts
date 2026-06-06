import { contentBlocksOf } from './blocks';
import { buildSlice, firstSliceClip, lastSliceClip, sliceCount, tailFill } from './slice';
import type { Block, ItemMeasure, Measurer, Page, PaginateOptions, Placement } from './types';

/** 페이지네이션 진행 커서 */
type Cursor = {
  pageIndex: number;
  columnIndex: number;
  filledHeight: number;
  columnCount: number;
};

/**
 * 컬럼 진행 (단일 진실 — V1의 4곳 복붙 제거).
 * 컬럼을 넘기고, 페이지의 모든 컬럼이 차면 다음 페이지로.
 */
const advanceColumn = (cursor: Cursor): void => {
  cursor.columnIndex += 1;
  cursor.filledHeight = 0;
  if (cursor.columnIndex >= cursor.columnCount) {
    cursor.pageIndex += 1;
    cursor.columnIndex = 0;
  }
};

/** 페이지 진행 */
const advancePage = (cursor: Cursor): void => {
  cursor.pageIndex += 1;
  cursor.columnIndex = 0;
  cursor.filledHeight = 0;
};

/** 컬럼 수를 1 이상의 정수로 보정 (0/음수/소수 입력 방어) */
const clampColumnCount = (count: number | undefined): number => Math.max(1, Math.floor(count || 1));

/** 컬럼이 꽉 찼으면 다음 페이지로 래핑 (슬라이스 루프용) */
const wrapIfColumnFull = (cursor: Cursor): void => {
  if (cursor.columnIndex >= cursor.columnCount) {
    cursor.pageIndex += 1;
    cursor.columnIndex = 0;
  }
};

/**
 * 정규화된 블록 스트림을 배치 결과(Placement[])로 변환한다.
 *
 * 순수 로직 + 주입된 measurer(측정 포트). measurer를 fake로 주입하면
 * DOM 없이 결정적으로 유닛테스트 가능하다.
 */
export const paginate = async (
  blocks: Block[],
  initialColumnCount: number,
  measurer: Measurer,
  options: PaginateOptions = {},
): Promise<Placement[]> => {
  const { moveOversizedItemToNextColumn = false } = options;
  const contentBlocks = contentBlocksOf(blocks);

  const cursor: Cursor = {
    pageIndex: 0,
    columnIndex: 0,
    filledHeight: 0,
    columnCount: clampColumnCount(initialColumnCount),
  };

  let columnWidth = await measurer.columnWidth(cursor.columnCount);
  let measures: ItemMeasure[] = await measurer.measureItems(contentBlocks, columnWidth);

  const placements: Placement[] = [];
  let section: string | undefined;
  let contentIndex = 0; // contentBlocks / measures 정렬 인덱스

  for (const block of blocks) {
    if (block.kind === 'sectionMark') {
      section = block.section; // sticky, 미배치
      continue;
    }

    if (block.kind === 'pageBreak') {
      advancePage(cursor);
      const nextColumnCount = block.columnCount ? clampColumnCount(block.columnCount) : undefined;
      if (nextColumnCount && nextColumnCount !== cursor.columnCount) {
        cursor.columnCount = nextColumnCount;
        // 남은 콘텐츠 블록을 새 컬럼 폭으로 재측정 (V1 동작 이식)
        columnWidth = await measurer.columnWidth(cursor.columnCount);
        const remaining = await measurer.measureItems(
          contentBlocks.slice(contentIndex),
          columnWidth,
        );
        measures = [...measures.slice(0, contentIndex), ...remaining];
      }
      continue;
    }

    if (block.kind === 'columnBreak') {
      advanceColumn(cursor);
      continue;
    }

    // content 블록
    const measure = measures[contentIndex];
    const blockIndex = contentIndex;
    contentIndex += 1;

    const columnHeight = await measurer.columnHeight(cursor.pageIndex, cursor.columnCount);
    const itemHeight = measure.container.height;

    // 가드: 컬럼 높이 측정 실패(<=0) 시 슬라이싱하면 퇴화/과도 분할 → 그냥 현재 위치에 배치
    if (columnHeight <= 0) {
      placements.push({
        blockIndex,
        pageIndex: cursor.pageIndex,
        columnIndex: cursor.columnIndex,
        columnCount: cursor.columnCount,
        section,
      });
      continue;
    }

    // ---- 큰 아이템: 슬라이스 분할 ----
    if (itemHeight > columnHeight) {
      const remainingHeight = columnHeight - cursor.filledHeight;
      const advancing =
        cursor.filledHeight > 0 &&
        (moveOversizedItemToNextColumn || remainingHeight < columnHeight * 0.05);

      if (advancing) advanceColumn(cursor);

      const carry = advancing ? 0 : cursor.filledHeight;
      const overflow = await measurer.measureOverflow(
        contentBlocks[blockIndex],
        measure.container.width,
        columnHeight,
        carry,
      );
      const paddingHeight = (measure.decoratorHeight ?? 0) / 2;
      const count = sliceCount(overflow.flowWidth, overflow.sliceWidth);
      const firstClip = firstSliceClip(columnHeight, cursor.filledHeight, advancing);

      for (let idx = 0; idx < count; idx++) {
        const isFirst = idx === 0;
        const isLast = idx + 1 === count;

        wrapIfColumnFull(cursor);

        const pageHeight = isFirst
          ? columnHeight
          : await measurer.columnHeight(cursor.pageIndex, cursor.columnCount);
        const clipHeight = isFirst
          ? firstClip
          : isLast
            ? lastSliceClip(overflow.contentEnd, paddingHeight)
            : pageHeight;

        placements.push({
          blockIndex,
          pageIndex: cursor.pageIndex,
          columnIndex: cursor.columnIndex,
          columnCount: cursor.columnCount,
          section,
          slice: buildSlice({
            index: idx,
            count,
            clipHeight,
            carryOffset: carry,
            sliceWidth: overflow.sliceWidth,
            columnHeight,
            paddingHeight,
            advancing,
          }),
        });

        if (!isLast) cursor.columnIndex += 1;
      }

      cursor.filledHeight = tailFill(overflow.contentEnd, paddingHeight);
      continue;
    }

    // ---- 일반 아이템: 누적 후 넘치면 다음 컬럼 ----
    cursor.filledHeight += itemHeight;
    if (cursor.filledHeight > columnHeight) {
      advanceColumn(cursor);
      cursor.filledHeight = itemHeight;
    }

    placements.push({
      blockIndex,
      pageIndex: cursor.pageIndex,
      columnIndex: cursor.columnIndex,
      columnCount: cursor.columnCount,
      section,
    });
  }

  return placements;
};

/** Placement[] → Page[] (3D 구조). 페이지·컬럼 인덱스로 그룹화. */
export const groupIntoPages = (placements: Placement[]): Page[] => {
  const pageMap = new Map<number, Map<number, Placement[]>>();

  for (const p of placements) {
    if (!pageMap.has(p.pageIndex)) pageMap.set(p.pageIndex, new Map());
    const columns = pageMap.get(p.pageIndex);
    if (!columns) continue;
    if (!columns.has(p.columnIndex)) columns.set(p.columnIndex, []);
    columns.get(p.columnIndex)?.push(p);
  }

  // 페이지 번호 순 정렬 후, 각 페이지를 columnCount만큼 빈 배열 포함해 채움
  const sortedPages = [...pageMap.entries()].sort((a, b) => a[0] - b[0]);

  return sortedPages.map(([, columns]) => {
    const anyPlacement = [...columns.values()][0]?.[0];
    const declaredCount = anyPlacement?.columnCount ?? 1;
    const maxColumnIndex = Math.max(...[...columns.keys()]) + 1;
    const columnTotal = Math.max(declaredCount, maxColumnIndex);

    const page: Placement[][] = [];
    for (let c = 0; c < columnTotal; c++) {
      page.push(columns.get(c) ?? []);
    }
    return page;
  });
};
