import type { ReactNode } from 'react';
import { markControl } from '../core/blocks';

export type DecoratorProps = {
  /** 묶음 전체에 전파될 프레임 클래스(테두리/배경/패딩 등). 각 자식 셀에 동일 적용된다. */
  className?: string;
  children?: ReactNode;
};

/**
 * 데코레이터(프레임 그룹). 자식들을 같은 `className` 프레임으로 묶되, 각 자식은
 * 독립적으로 컬럼·페이지를 흐른다.
 *
 * - 래퍼 자체는 레이아웃에 렌더되지 않는다 — toBlocks가 타입으로 인식해 자식을 풀고,
 *   `className`을 각 자식 셀에 전파한다(묶음처럼 보이되 분할/페이지 넘김은 아이템 단위).
 * - 프레임의 패딩/보더(chrome) 높이는 빈 복제본으로 측정돼 슬라이스 계산에 반영된다.
 *
 * 이 컴포넌트의 실제 렌더(className만 가진 div)는 chrome 높이 측정 용도로만 쓰인다.
 */
const Decorator = ({ className, children }: DecoratorProps) => (
  <div className={className}>{children}</div>
);

export default markControl(Decorator, 'decorator');
