import type { HTMLAttributes, PropsWithChildren } from 'react';
import { createSelector, DATA_COLUMN_PAGER_STABLE } from './constants';

/**
 * ColumnPager stable 속성 관련 유틸리티
 *
 * ColumnPager는 자식 컴포넌트들이 렌더링을 완료했는지 확인한 후 HTML을 추출합니다.
 * 비동기적으로 렌더링되는 컴포넌트(예: Sentence의 Decorator)는 이 속성을 사용하여
 * 렌더링 완료 상태를 ColumnPager에 알립니다.
 *
 * 사용법:
 * <ColumnPager.StableChecker isStable={isStable}>
 *   <div>...</div>
 * </ColumnPager.StableChecker>
 */

export const STABLE_SELECTOR = createSelector(DATA_COLUMN_PAGER_STABLE);

interface StableCheckerProps extends PropsWithChildren, HTMLAttributes<HTMLDivElement> {
  isStable: boolean;
}

/**
 * ColumnPager가 HTML 추출 전에 자식 컴포넌트의 렌더링 완료를 확인하기 위한 컴포넌트
 *
 * @example
 * <ColumnPager.StableChecker isStable={isStable}>
 *   <div>비동기적으로 렌더링되는 컨텐츠</div>
 * </ColumnPager.StableChecker>
 */
const StableChecker = ({ isStable, children, ...rest }: StableCheckerProps) => {
  return (
    <div data-column-pager-stable={isStable} {...rest}>
      {children}
    </div>
  );
};

/**
 * 컨테이너 내 모든 stable 속성을 가진 요소들이 안정화되었는지 확인
 */
export const checkAllStable = (container: HTMLElement): boolean => {
  const elements = container.querySelectorAll(STABLE_SELECTOR);
  return (
    elements.length === 0 ||
    Array.from(elements).every((el) => el.getAttribute(DATA_COLUMN_PAGER_STABLE) === 'true')
  );
};

export default StableChecker;
