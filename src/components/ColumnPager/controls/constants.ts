// ============================================================================
// 마커/제어용 data 속성
// ============================================================================

/** 페이지 넘김 마커 */
export const DATA_PAGE_BREAKER = 'data-page-breaker';

/** 컬럼 넘김 마커 */
export const DATA_COLUMN_BREAKER = 'data-column-breaker';

/** 페이지 메타정보 */
export const DATA_PAGE_INFORMATION = 'data-page-information';

/** 컬럼 수 변경 */
export const DATA_CHANGE_COLUMN_COUNT_TO = 'data-change-column-count-to';

/** 렌더링 완료 상태 */
export const DATA_COLUMN_PAGER_STABLE = 'data-column-pager-stable';

/** decorator 높이 */
export const DATA_DECORATOR_HEIGHT = 'data-decorator-height';

// ============================================================================
// 레이아웃/측정용 data-key 값
// ============================================================================

export const DATA_KEY = {
  /** 페이지 컨테이너 */
  PAGE_CONTAINER: 'page-container',
  /** 헤더 */
  PAGE_HEADER: 'page-header',
  /** 본문 영역 */
  PAGE_BODY: 'page-body',
  /** 푸터 */
  PAGE_FOOTER: 'page-footer',
  /** 컬럼 */
  PAGE_COLUMN: 'page-column',
  /** 아이템 래퍼 */
  PAGE_COLUMN_ITEM: 'page-column-item',
  /** 내부 콘텐츠 측정 */
  PAGE_COLUMN_ITEM_INNER: 'page-column-item-inner',
  /** 크롭용 콘텐츠 */
  PAGE_COLUMN_ITEM_INNER_DIV: 'page-column-item-inner-div',
  /** 크롭 위치 마커 */
  PAGE_COLUMN_ITEM_INNER_THRESHOLD: 'page-column-item-inner-threshold',
  /** decorator 감지 */
  PAGE_COLUMN_ITEM_DECORATOR: 'page-column-item-decorator',
} as const;

// ============================================================================
// 셀렉터 헬퍼
// ============================================================================

/** data 속성 셀렉터 생성 */
export const createSelector = (attr: string) => `[${attr}]`;

/** data-key 셀렉터 생성 */
export const createDataKeySelector = (key: string) => `[data-key="${key}"]`;
