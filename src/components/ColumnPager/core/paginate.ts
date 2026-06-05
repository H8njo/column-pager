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

/** 컬럼이 꽉 찼으면 다음 페이지로 래핑 (슬라이스 루프용) */
const wrapIfColumnFull = (cursor: Cursor): void => {
  if (cursor.columnIndex >= cursor.columnCount) {
    cursor.pageIndex += 1;
    cursor.columnIndex = 0;
  }
};

/**
 * 콘텐츠 블록들의 자연 크기를 측정한다 (pageCount와 무관 — 1회만).
 *
 * 각 블록의 columnCount는 앞선 PageBreak(changeColumnCountTo)로 정적으로 정해지므로,
 * columnCount별로 묶어 해당 폭에서 측정한다. 결과는 contentBlocks 순서로 정렬된
 * ItemMeasure[]. 수렴 재-pass(placeBlocks)는 이 결과를 재사용해 카드를 다시 재지 않는다.
 */
export const measureBlocks = async (
  blocks: Block[],
  initialColumnCount: number,
  measurer: Measurer,
): Promise<ItemMeasure[]> => {
  const contentBlocks = contentBlocksOf(blocks);

  // 각 콘텐츠 블록이 속한 columnCount (앞선 PageBreak로 결정)
  let cc = initialColumnCount;
  const countPerContent: number[] = [];
  for (const block of blocks) {
    if (block.kind === 'pageBreak' && block.columnCount) cc = block.columnCount;
    else if (block.kind === 'content') countPerContent.push(cc);
  }

  // columnCount별로 인덱스를 묶어 한 번에 측정
  const indicesByCount = new Map<number, number[]>();
  countPerContent.forEach((count, index) => {
    const list = indicesByCount.get(count) ?? [];
    list.push(index);
    indicesByCount.set(count, list);
  });

  const measures: ItemMeasure[] = new Array(contentBlocks.length);
  for (const [count, indices] of indicesByCount) {
    const width = await measurer.columnWidth(count);
    const group = indices.map((i) => contentBlocks[i]);
    const groupMeasures = await measurer.measureItems(group, width);
    indices.forEach((i, k) => {
      measures[i] = groupMeasures[k];
    });
  }

  return measures;
};

/**
 * 미리 측정된 블록을 배치 결과(Placement[])로 변환한다 (순수 배치 — 카드 재측정 없음).
 *
 * 측정이 분리돼 있어, 수렴 루프가 pageCount만 바꿔 이 함수를 여러 번 호출해도
 * 카드는 다시 재지 않는다(컬럼 높이/오버플로우 측정만 발생, 캐시됨).
 */
export const placeBlocks = async (
  blocks: Block[],
  initialColumnCount: number,
  measures: ItemMeasure[],
  measurer: Measurer,
  options: PaginateOptions = {},
): Promise<Placement[]> => {
  const { moveOversizedItemToNextColumn = false, pageCount = 0 } = options;
  const contentBlocks = contentBlocksOf(blocks);

  const cursor: Cursor = {
    pageIndex: 0,
    columnIndex: 0,
    filledHeight: 0,
    columnCount: initialColumnCount,
  };

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
      if (block.columnCount) cursor.columnCount = block.columnCount; // 측정은 이미 반영됨
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

    const columnHeight = await measurer.columnHeight(
      cursor.pageIndex,
      cursor.columnCount,
      pageCount,
    );
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
          : await measurer.columnHeight(cursor.pageIndex, cursor.columnCount, pageCount);
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

/**
 * 측정 + 배치를 한 번에 (단일 pass). 측정은 measureBlocks, 배치는 placeBlocks.
 * 여러 pageCount로 수렴시키려면 measureBlocks를 한 번 호출하고 placeBlocks를 반복하라.
 */
export const paginate = async (
  blocks: Block[],
  initialColumnCount: number,
  measurer: Measurer,
  options: PaginateOptions = {},
): Promise<Placement[]> => {
  const measures = await measureBlocks(blocks, initialColumnCount, measurer);
  return placeBlocks(blocks, initialColumnCount, measures, measurer, options);
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
