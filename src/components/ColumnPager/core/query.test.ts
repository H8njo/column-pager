import { describe, expect, it } from 'vitest';
import { findItemPage, getPageCount, isSliced } from './query';
import type { Page, Placement, Slice } from './types';

const slice: Slice = {
  index: 0,
  count: 2,
  clipHeight: 100,
  carryOffset: 0,
  shiftX: 0,
  shiftY: 0,
  innerHeight: 100,
  paddingHeight: 0,
};

const place = (blockIndex: number, withSlice = false): Placement => ({
  blockIndex,
  pageIndex: 0,
  columnIndex: 0,
  columnCount: 1,
  ...(withSlice ? { slice } : {}),
});

describe('isSliced', () => {
  it('slice 있으면 true, 없으면 false', () => {
    expect(isSliced(place(0, true))).toBe(true);
    expect(isSliced(place(0, false))).toBe(false);
  });
});

describe('getPageCount', () => {
  it('페이지 배열 길이', () => {
    const pages: Page[] = [[[place(0)]], [[place(1)]]];
    expect(getPageCount(pages)).toBe(2);
    expect(getPageCount([])).toBe(0);
  });
});

describe('findItemPage', () => {
  it('blockIndex가 처음 등장하는 페이지(1-base)', () => {
    const pages: Page[] = [[[place(0)], [place(1)]], [[place(2)]]];
    expect(findItemPage(pages, 0)).toBe(1);
    expect(findItemPage(pages, 1)).toBe(1);
    expect(findItemPage(pages, 2)).toBe(2);
  });
  it('없으면 -1', () => {
    expect(findItemPage([[[place(0)]]], 99)).toBe(-1);
  });
});
