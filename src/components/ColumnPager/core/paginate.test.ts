import { createElement, type ReactElement } from 'react';
import { describe, expect, it } from 'vitest';
import { groupIntoPages, paginate } from './paginate';
import type { Block, ContentBlock, Measurer } from './types';

// ----------------------------------------------------------------------------
// 테스트 헬퍼: 높이/오버플로우 정보를 노드 props에 실어 fake measurer가 읽는다.
// ----------------------------------------------------------------------------
type OverflowInfo = { flowWidth: number; sliceWidth: number; contentEnd: number };

const item = (height: number, overflow?: OverflowInfo): ContentBlock => ({
  kind: 'content',
  node: createElement('div', {
    'data-h': height,
    'data-overflow': overflow ? JSON.stringify(overflow) : undefined,
  }),
});

const pageBreak = (columnCount?: number): Block => ({ kind: 'pageBreak', columnCount });
const columnBreak = (): Block => ({ kind: 'columnBreak' });
const sectionMark = (section: string): Block => ({ kind: 'sectionMark', section });

const heightOf = (b: ContentBlock): number =>
  Number(((b.node as ReactElement).props as Record<string, unknown>)['data-h'] ?? 0);

const overflowOf = (b: ContentBlock): OverflowInfo => {
  const raw = ((b.node as ReactElement).props as Record<string, unknown>)['data-overflow'];
  return raw
    ? (JSON.parse(raw as string) as OverflowInfo)
    : { flowWidth: 0, sliceWidth: 1, contentEnd: 0 };
};

const fakeMeasurer = (columnHeight: number, columnWidth = 300): Measurer => ({
  columnWidth: async () => columnWidth,
  columnHeight: async () => columnHeight,
  measureItems: async (blocks) =>
    blocks.map((b) => ({
      container: { width: columnWidth, height: heightOf(b) },
      sliceWidth: columnWidth,
    })),
  measureOverflow: async (b) => overflowOf(b),
});

describe('paginate — 일반(작은) 아이템', () => {
  it('컬럼을 채우다 넘치면 다음 컬럼(1컬럼이면 다음 페이지)', async () => {
    const blocks = [item(100), item(100), item(100)]; // columnHeight 250, 1컬럼
    const placements = await paginate(blocks, 1, fakeMeasurer(250));

    // 100, 200 → page0; 300>250 → page1
    expect(placements.map((p) => p.pageIndex)).toEqual([0, 0, 1]);
    expect(placements.map((p) => p.columnIndex)).toEqual([0, 0, 0]);
  });

  it('2컬럼: 컬럼 넘침은 같은 페이지의 다음 컬럼으로', async () => {
    const blocks = [item(200), item(200), item(200)]; // columnHeight 250, 2컬럼
    const placements = await paginate(blocks, 2, fakeMeasurer(250));

    // item0 col0(200), item1 400>250 → col1(200), item2 → col0이 꽉찼으니 col2... 2컬럼이므로 page1 col0
    expect(placements[0]).toMatchObject({ pageIndex: 0, columnIndex: 0 });
    expect(placements[1]).toMatchObject({ pageIndex: 0, columnIndex: 1 });
    expect(placements[2]).toMatchObject({ pageIndex: 1, columnIndex: 0 });
  });
});

describe('paginate — 컨트롤', () => {
  it('PageBreak: 다음 페이지로 이동', async () => {
    const blocks = [item(50), pageBreak(), item(50)];
    const placements = await paginate(blocks, 1, fakeMeasurer(1000));
    expect(placements.map((p) => p.pageIndex)).toEqual([0, 1]);
  });

  it('ColumnBreak: 다음 컬럼으로 이동', async () => {
    const blocks = [item(50), columnBreak(), item(50)];
    const placements = await paginate(blocks, 2, fakeMeasurer(1000));
    expect(placements[0]).toMatchObject({ pageIndex: 0, columnIndex: 0 });
    expect(placements[1]).toMatchObject({ pageIndex: 0, columnIndex: 1 });
  });

  it('ColumnBreak: 마지막 컬럼이면 다음 페이지로 래핑', async () => {
    const blocks = [item(50), columnBreak(), item(50)];
    const placements = await paginate(blocks, 1, fakeMeasurer(1000));
    expect(placements[1]).toMatchObject({ pageIndex: 1, columnIndex: 0 });
  });

  it('PageBreak + columnCount 변경: 이후 페이지의 columnCount가 바뀐다', async () => {
    const blocks = [item(50), pageBreak(2), item(50)];
    const placements = await paginate(blocks, 1, fakeMeasurer(1000));
    expect(placements[0].columnCount).toBe(1);
    expect(placements[1].columnCount).toBe(2);
  });

  it('SectionMark: sticky 하게 이후 아이템에 section 전파', async () => {
    const blocks = [item(50), sectionMark('vocab'), item(50), item(50)];
    const placements = await paginate(blocks, 1, fakeMeasurer(1000));
    expect(placements[0].section).toBeUndefined();
    expect(placements[1].section).toBe('vocab');
    expect(placements[2].section).toBe('vocab');
  });
});

describe('paginate — 큰 아이템 슬라이스', () => {
  it('컬럼 높이를 초과하면 sliceCount개 조각으로 분할', async () => {
    // columnHeight 500, item 1500 → flowWidth=900, sliceWidth=300 → 3 조각
    const blocks = [item(1500, { flowWidth: 900, sliceWidth: 300, contentEnd: 200 })];
    const placements = await paginate(blocks, 1, fakeMeasurer(500));

    expect(placements).toHaveLength(3);
    expect(placements.every((p) => p.slice !== undefined)).toBe(true);
    expect(placements.map((p) => p.slice?.index)).toEqual([0, 1, 2]);
    expect(placements[0].slice?.count).toBe(3);
    // 1컬럼이므로 각 조각이 다음 페이지로
    expect(placements.map((p) => p.pageIndex)).toEqual([0, 1, 2]);
  });

  it('shiftX는 조각 인덱스 * sliceWidth', async () => {
    const blocks = [item(1500, { flowWidth: 900, sliceWidth: 300, contentEnd: 200 })];
    const placements = await paginate(blocks, 1, fakeMeasurer(500));
    expect(placements.map((p) => p.slice?.shiftX)).toEqual([0, 300, 600]);
  });
});

describe('paginate — 측정 실패 가드', () => {
  it('columnHeight<=0 이면 슬라이스 없이 그대로 배치 (퇴화/무한분할 방지)', async () => {
    const blocks = [item(1500, { flowWidth: 900, sliceWidth: 300, contentEnd: 200 }), item(50)];
    const placements = await paginate(blocks, 1, fakeMeasurer(0));
    expect(placements).toHaveLength(2);
    expect(placements.every((p) => p.slice === undefined)).toBe(true);
  });
});

describe('groupIntoPages', () => {
  it('Placement[] → Page[][] 페이지/컬럼 구조', async () => {
    const blocks = [item(200), item(200), item(200)];
    const placements = await paginate(blocks, 2, fakeMeasurer(250));
    const pages = groupIntoPages(placements);

    expect(pages).toHaveLength(2);
    expect(pages[0]).toHaveLength(2); // 2컬럼
    expect(pages[0][0]).toHaveLength(1); // page0 col0: item0
    expect(pages[0][1]).toHaveLength(1); // page0 col1: item1
    expect(pages[1][0]).toHaveLength(1); // page1 col0: item2
  });
});
