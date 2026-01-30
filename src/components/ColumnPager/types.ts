import type { ReactElement, ReactNode } from 'react';

// ============================================================================
// 기본 타입
// ============================================================================

/** 2D 크기 */
export type Size = {
  width: number;
  height: number;
};

/** DOM 요소의 위치 및 크기 (threshold 측정용) */
export type Position = {
  top: number;
  left: number;
  bottom: number;
  right: number;
  width: number;
  height: number;
};

// ============================================================================
// 측정 관련 타입
// ============================================================================

/** measureSize 함수의 입력 */
export type MeasureSizeInput = {
  elements: ReactNode[];
  config?: {
    /** 측정할 data-key 속성 목록 */
    measureTargetKeys?: string[];
    /** 측정 컨테이너의 너비 (px) */
    containerWidth?: number;
    /** 청크 단위 크기 (기본값: 20) */
    chunkSize?: number;
  };
};

/** measureSize 함수의 출력 - 단일 아이템 측정 결과 */
export type MeasureSizeResult = {
  /** 컨테이너(외부) 크기 */
  container?: Size;
  /** PageBreaker 여부 */
  isPageBreaker?: boolean;
  /** ColumnBreaker 여부 */
  isColumnBreaker?: boolean;
  /** 변경할 컬럼 수 (PageBreaker와 함께 사용) */
  changeColumnCountTo?: number;
  /** 페이지 정보 (헤더/푸터에 표시) */
  pageInformation?: string;
  /** threshold 요소의 위치 (크롭 계산용) */
  thresholdPosition?: Position;
  /** decorator 높이 (크롭 시 패딩 계산용) */
  decoratorHeight: number;
  /** data-key로 측정된 추가 크기들 */
  [key: string]: Size | Position | boolean | number | string | undefined;
};

/** measureElementSize 함수의 입력 */
export type MeasureElementInput = {
  element: ReactElement;
  containerWidth?: number;
  containerHeight?: number;
  measureTargetKeys?: string[];
  offsetHeight?: number;
};

// ============================================================================
// 아이템 배치 관련 타입
// ============================================================================

/** 측정된 아이템 정보 (usePageGenerator 내부용) */
export type MeasuredItem = {
  /** 원본 children 배열에서의 인덱스 */
  index: number;
  /** 컨테이너 크기 */
  size: Size;
  /** 내부 콘텐츠 크기 (크롭 계산용) */
  innerSize: Size;
  /** PageBreaker 여부 */
  isPageBreaker?: boolean;
  /** ColumnBreaker 여부 */
  isColumnBreaker?: boolean;
  /** 변경할 컬럼 수 */
  changeColumnCountTo?: number;
  /** 페이지 정보 */
  pageInformation?: string;
  /** decorator 높이 */
  decoratorHeight?: number;
};

/**
 * 아이템 배치 정보 (usePageGenerator 출력)
 * - 일반 아이템: 기본 필드만 사용
 * - 크롭 아이템: isCropped=true일 때 추가 필드 사용
 */
export type ItemLayout = {
  /** 원본 children 배열에서의 인덱스 */
  index: number;
  /** 배치된 페이지 번호 (0-indexed) */
  pageNumber: number;
  /** 페이지 내 컬럼 번호 (0-indexed) */
  columnInPage: number;
  /** 해당 페이지의 컬럼 수 */
  columnCount: number;
  /** 페이지 정보 */
  pageInformation?: string;
  /** 크롭 여부 */
  isCropped?: boolean;
  /** 아이템의 원본 높이 (크롭 시) */
  itemHeight?: number;
  /** 크롭된 조각의 인덱스 (크롭 시, 0부터 시작) */
  croppedItemIndex?: number;
  /** 전체 크롭 조각 수 (크롭 시) */
  totalCroppedParts?: number;
  /** 이전 컬럼에서 표시한 높이 (크롭 시) */
  offsetHeight?: number;
  /** 컨테이너(컬럼) 높이 (크롭 시) */
  containerHeight?: number;
  /** 내부 아이템 너비 (크롭 시, translateX 계산용) */
  innerItemWidth?: number;
  /** 이 조각의 표시 높이 (크롭 시) */
  height?: number;
  /** 패딩/보더/마진 높이 (크롭 시, decorator) */
  paddingBorderMarginHeight?: number;
};

/** 타입 가드: 크롭된 아이템인지 확인 */
export const isCroppedItem = (item: ItemLayout): boolean => {
  return item.isCropped === true;
};

// ============================================================================
// 페이지 데이터 관련 타입
// ============================================================================

/** 페이지 내 아이템 데이터 (렌더링용) */
export type PageItemData = {
  /** 컬럼 내 순서 (0-indexed) */
  arrayIndex: number;
} & ItemLayout;

/** 페이지 데이터: 컬럼 배열 (2차원: [컬럼][아이템]) */
export type PageData = PageItemData[][];

/** 전체 페이지 데이터: 페이지 배열 (3차원: [페이지][컬럼][아이템]) */
export type PagesData = PageData[];

// ============================================================================
// 컴포넌트 Props 타입
// ============================================================================

/** ColumnPager 컴포넌트 Props */
export type ColumnPagerProps = {
  children?: ReactNode;
  /** 페이지당 컬럼 수 (기본값: 1) */
  columnCount?: number;
  /** 페이지 방향 (기본값: 'horizontal') */
  pageDirection?: 'horizontal' | 'vertical';
  /** 로딩 상태 */
  loading?: boolean;
  /** 페이지 생성 완료 콜백 */
  onPagesGenerated?: (pages: PagesData, htmlString: string) => void;
  /** 숨김 여부 (DOM은 렌더링하되 화면에 표시하지 않음) */
  hidden?: boolean;
  /** 컬럼에 적용할 클래스명 */
  columnClassName?: string;
  /** 컬럼 사이에 구분선 표시 여부 */
  showDividers?: boolean;
  /** 헤더 렌더 함수 */
  header: (props: { pageNumber: number; pageInformation: string | undefined }) => ReactNode;
  /** 푸터 렌더 함수 */
  footer: (props: { pageNumber: number; pageInformation: string | undefined }) => ReactNode;
};

/** 평탄화된 자식 요소 정보 */
export type FlattenedChild = {
  child: ReactNode;
  decoratorClassName?: string;
  decoratorHeight?: number;
};

// ============================================================================
// usePageGenerator 관련 타입
// ============================================================================

/** 페이지 레이아웃 캐시 (페이지 번호 -> 컬럼 크기) */
export type PageLayoutCache = Map<number, Size>;

/** 아이템 크기 캐시 (컬럼 수 -> 측정된 아이템 배열) */
export type ItemSizeCache = Map<string, MeasuredItem[]>;

/** 페이지 레이아웃 컴포넌트 생성 함수 */
export type PageLayoutRenderer = (
  pageNumber: number,
  columnData: PageData,
  columnCount: number,
) => ReactNode[];

// ============================================================================
// 내부 컴포넌트 타입
// ============================================================================

/** ColumnItem 렌더링용 Props 타입 */
export type ColumnItemElementProps = ReactElement<{
  children: ReactNode;
  style?: React.CSSProperties;
}>;
