import { describe, expect, it } from 'vitest';
import { getSectionPageRanges } from './sectionRanges';
import type { Page, Placement } from './types';

const place = (section?: string): Placement => ({
  blockIndex: 0,
  pageIndex: 0,
  columnIndex: 0,
  columnCount: 1,
  section,
});

describe('getSectionPageRanges', () => {
  it('각 section의 [시작, 끝] 페이지(1-base)를 계산', () => {
    const pages: Page[] = [
      [[place('vocab'), place('vocab')]], // page 1
      [[place('vocab')]], // page 2
      [[place('grammar')]], // page 3
      [[place('answers')], [place('answers')]], // page 4 (2컬럼)
    ];
    expect(getSectionPageRanges(pages)).toEqual({
      vocab: [1, 2],
      grammar: [3, 3],
      answers: [4, 4],
    });
  });

  it('section 없는 placement는 무시', () => {
    const pages: Page[] = [[[place(), place()]]];
    expect(getSectionPageRanges(pages)).toEqual({});
  });
});
