import type { ReactElement, ReactNode } from 'react';

/** 2D 크기 */
export type Size = { width: number; height: number };

// ============================================================================
// 블록 모델 (정규화된 페이지네이션 입력 단위)
// ============================================================================

/** 실제 콘텐츠 블록 (측정·배치 대상) */
export type ContentBlock = {
  kind: 'content';
  node: ReactNode;
  /** decorator(테두리 그룹)에서 나온 경우의 클래스 */
  decoratorClassName?: string;
  /** 빈 decorator 템플릿 — chrome 높이 측정용 (measure 계층에서 사용) */
  decoratorTemplate?: ReactElement;
  /**
   * 이 블록 노드의 콘텐츠 시그니처 (toBlocks에서 1회 계산해 부착).
   * 측정 캐시 키 + 재페이지네이션 트리거에 재사용해 트리 중복 순회를 막는다.
   */
  signature?: string;
};

/** 강제 페이지 넘김 (+선택적 columnCount 변경) */
export type PageBreakBlock = { kind: 'pageBreak'; columnCount?: number };

/** 강제 컬럼 넘김 */
export type ColumnBreakBlock = { kind: 'columnBreak' };

/** 섹션 라벨 (sticky 메타데이터) */
export type SectionMarkBlock = { kind: 'sectionMark'; section: string };

export type Block = ContentBlock | PageBreakBlock | ColumnBreakBlock | SectionMarkBlock;

// ============================================================================
// 측정 결과 (DOM 어댑터 → 순수 코어, 인덱스시그니처 없음)
// ============================================================================

/** 한 콘텐츠 블록의 자연 크기 측정값 */
export type ItemMeasure = {
  /** 셀(바깥) 크기 */
  container: Size;
  /** 한 컬럼(슬라이스) 폭 */
  sliceWidth: number;
  /** decorator chrome(패딩+보더) 높이 — 슬라이스 패딩 계산용 */
  decoratorHeight?: number;
};

/** 컬럼 높이를 초과한 블록의 오버플로우 측정값 */
export type OverflowMeasure = {
  /** 멀티컬럼으로 흐른 전체 폭 (sliceCount 계산용) */
  flowWidth: number;
  /** 한 컬럼(슬라이스) 폭 */
  sliceWidth: number;
  /** 콘텐츠가 끝나는 위치 (마지막 슬라이스 높이 기준), benchmark 기준 상대 top */
  contentEnd: number;
};

/**
 * 측정 포트 — 순수 코어(paginate)에 주입된다.
 * 실제 구현은 measure/ (DOM), 테스트에서는 결정적 fake 주입.
 */
export interface Measurer {
  /** columnCount에 대한 한 컬럼의 폭 (페이지와 무관하게 안정적) */
  columnWidth(columnCount: number): Promise<number>;
  /** 특정 페이지·columnCount의 한 컬럼 가용 높이 (헤더/푸터 차이 반영) */
  columnHeight(pageIndex: number, columnCount: number): Promise<number>;
  /** 콘텐츠 블록들의 자연 크기 일괄 측정 */
  measureItems(blocks: ContentBlock[], columnWidth: number): Promise<ItemMeasure[]>;
  /** 단일 오버플로우 블록의 슬라이스 측정 */
  measureOverflow(
    block: ContentBlock,
    columnWidth: number,
    columnHeight: number,
    carryOffset: number,
  ): Promise<OverflowMeasure>;
}

// ============================================================================
// 배치 결과
// ============================================================================

/** 큰 아이템을 컬럼 높이 단위로 자른 한 조각의 렌더 메타 */
export type Slice = {
  /** 조각 인덱스 (0부터) */
  index: number;
  /** 전체 조각 수 */
  count: number;
  /** 외부 클립 높이 */
  clipHeight: number;
  /** 이전 컬럼에서 이어받은 높이 */
  carryOffset: number;
  /** 가로 이동량 (px) — translateX(-shiftX) */
  shiftX: number;
  /** 세로 이동량 (px) — 첫 조각의 carryOffset 보정 */
  shiftY: number;
  /** 내부 콘텐츠 높이 (containerHeight - paddingHeight*2) */
  innerHeight: number;
  /** decorator padding/border 높이 (한쪽) */
  paddingHeight: number;
};

/** 한 블록의 배치 정보 */
export type Placement = {
  /** content 블록 배열에서의 인덱스 (렌더 노드 조회용) */
  blockIndex: number;
  pageIndex: number;
  columnIndex: number;
  columnCount: number;
  section?: string;
  /** 슬라이스된 경우의 조각 메타 (없으면 일반 배치) */
  slice?: Slice;
};

/** 한 컬럼에 배치된 아이템들 */
export type Column = Placement[];
/** 한 페이지의 컬럼들 */
export type Page = Column[];

/** paginate 옵션 */
export type PaginateOptions = {
  /** 컬럼 높이를 초과하는 아이템을 (자르지 않고) 다음 컬럼으로 먼저 이동 */
  moveOversizedItemToNextColumn?: boolean;
};
