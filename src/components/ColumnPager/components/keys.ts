/**
 * 측정용 DOM 마커 (`data-cp` 속성값).
 *
 * 컨트롤 식별은 타입 레벨(core/blocks)에서 처리하고, 여기 키들은 순수하게
 * "DOM에서 무엇을 측정할지" 찾기 위한 내부 마커다. measure/ 와 components/
 * 만 사용한다. (V1의 흩어진 data-key 들을 한곳에 모음)
 */
export const KEY = {
  /** 페이지 컨테이너 */
  PAGE: 'page',
  /** 헤더 */
  HEADER: 'header',
  /** 본문 */
  BODY: 'body',
  /** 푸터 */
  FOOTER: 'footer',
  /** 컬럼 (컬럼 폭/높이 측정 기준) */
  COLUMN: 'column',
  /** 아이템 셀(바깥) */
  CELL: 'cell',
  /** columnCount:1 흐름 컨테이너 (sliceWidth 측정) */
  CELL_INNER: 'cell-inner',
  /** 콘텐츠 래퍼 (flowWidth 측정) */
  CELL_CONTENT: 'cell-content',
  /** 콘텐츠 끝 마커 (contentEnd 측정) */
  CELL_THRESHOLD: 'cell-threshold',
} as const;

export type Key = (typeof KEY)[keyof typeof KEY];

/** data-cp="key" 셀렉터 */
export const keySelector = (key: Key): string => `[data-cp="${key}"]`;

/** 렌더 완료 상태 마커 (StableGate) */
export const STABLE_ATTR = 'data-cp-stable';
export const stableSelector = `[${STABLE_ATTR}]`;
