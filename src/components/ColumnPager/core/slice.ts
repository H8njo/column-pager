import type { Slice } from './types';

/**
 * 슬라이스 수학 (순수) — V1 크롭 로직 이식.
 *
 * 원리: 키 큰 콘텐츠를 `columnCount:1` 컨테이너에 넣고 컬럼 높이로 클립하면,
 * 넘친 내용이 CSS 멀티컬럼으로 가로로 흐른다. 흐른 전체 폭(flowWidth)을 한
 * 컬럼 폭(sliceWidth)으로 나누면 조각 수가 나온다. 각 조각은 translateX로
 * 해당 컬럼을 보이게 이동시켜 표현한다.
 */

/**
 * 슬라이스(조각) 개수.
 * 서브픽셀 반올림으로 인한 컬럼 누락 방지: floor 대신 round.
 * (예: flowWidth=2090, sliceWidth=697 → 2.998이지만 실제로는 3 컬럼)
 */
export const sliceCount = (flowWidth: number, sliceWidth: number): number => {
  if (sliceWidth <= 0) return 1;
  return Math.max(1, Math.round(flowWidth / sliceWidth));
};

/** 첫 조각의 클립 높이 (이어받기 중이면 남은 높이만큼만) */
export const firstSliceClip = (
  columnHeight: number,
  carryOffset: number,
  advancing: boolean,
): number => (advancing ? columnHeight : columnHeight - carryOffset);

/** 마지막 조각의 클립 높이 (콘텐츠 실제 끝 + decorator 패딩 양쪽) */
export const lastSliceClip = (contentEnd: number, paddingHeight: number): number =>
  contentEnd + paddingHeight * 2;

/** 슬라이싱 종료 후 현재 컬럼에 채워진 높이 (= 마지막 조각 높이) */
export const tailFill = lastSliceClip;

/** 한 조각의 렌더 메타 생성 (순수) */
export const buildSlice = (args: {
  index: number;
  count: number;
  clipHeight: number;
  carryOffset: number;
  sliceWidth: number;
  columnHeight: number;
  paddingHeight: number;
  advancing: boolean;
}): Slice => {
  const {
    index,
    count,
    clipHeight,
    carryOffset,
    sliceWidth,
    columnHeight,
    paddingHeight,
    advancing,
  } = args;
  const effectiveCarry = advancing ? 0 : carryOffset;
  return {
    index,
    count,
    clipHeight,
    carryOffset: effectiveCarry,
    shiftX: index * sliceWidth,
    // 첫 조각만 carry만큼 위로 당겨 이전 컬럼 이어받기 정렬
    shiftY: index === 0 ? effectiveCarry : 0,
    innerHeight: columnHeight - paddingHeight * 2,
    paddingHeight,
  };
};
