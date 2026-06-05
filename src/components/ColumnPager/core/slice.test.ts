import { describe, expect, it } from 'vitest';
import { buildSlice, firstSliceClip, lastSliceClip, sliceCount } from './slice';

describe('sliceCount', () => {
  it('flowWidth / sliceWidth 를 반올림한다 (서브픽셀 보정)', () => {
    expect(sliceCount(2090, 697)).toBe(3); // 2.998 → 3
    expect(sliceCount(1394, 697)).toBe(2);
    expect(sliceCount(697, 697)).toBe(1);
  });

  it('최소 1, sliceWidth<=0 방어', () => {
    expect(sliceCount(0, 697)).toBe(1);
    expect(sliceCount(2090, 0)).toBe(1);
  });
});

describe('firstSliceClip', () => {
  it('advancing이면 컬럼 전체 높이', () => {
    expect(firstSliceClip(1000, 300, true)).toBe(1000);
  });
  it('이어받기면 남은 높이만큼', () => {
    expect(firstSliceClip(1000, 300, false)).toBe(700);
  });
});

describe('lastSliceClip', () => {
  it('콘텐츠 끝 + 패딩 양쪽', () => {
    expect(lastSliceClip(400, 10)).toBe(420);
  });
});

describe('buildSlice', () => {
  it('shiftX는 index*sliceWidth, 첫 조각만 shiftY=carry', () => {
    const s0 = buildSlice({
      index: 0,
      count: 3,
      clipHeight: 700,
      carryOffset: 300,
      sliceWidth: 697,
      columnHeight: 1000,
      paddingHeight: 10,
      advancing: false,
    });
    expect(s0.shiftX).toBe(0);
    expect(s0.shiftY).toBe(300);
    expect(s0.innerHeight).toBe(980); // 1000 - 10*2

    const s1 = buildSlice({
      index: 1,
      count: 3,
      clipHeight: 1000,
      carryOffset: 300,
      sliceWidth: 697,
      columnHeight: 1000,
      paddingHeight: 10,
      advancing: false,
    });
    expect(s1.shiftX).toBe(697);
    expect(s1.shiftY).toBe(0);
  });

  it('advancing이면 carry/shiftY 0', () => {
    const s = buildSlice({
      index: 0,
      count: 2,
      clipHeight: 1000,
      carryOffset: 300,
      sliceWidth: 500,
      columnHeight: 1000,
      paddingHeight: 0,
      advancing: true,
    });
    expect(s.carryOffset).toBe(0);
    expect(s.shiftY).toBe(0);
  });
});
