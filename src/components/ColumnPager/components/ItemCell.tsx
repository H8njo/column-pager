import { type CSSProperties, memo, type ReactNode } from 'react';
import { cn } from '../../../lib/utils';
import { KEY } from './keys';

type ItemCellProps = {
  children?: ReactNode;
  /** decorator(테두리 그룹)에서 온 경우의 클래스 */
  decoratorClassName?: string;
  style?: CSSProperties;
};

/**
 * 측정·렌더 공용 아이템 셀.
 *
 * 구조:
 *   CELL (overflow-hidden)
 *     └ CELL_INNER (콘텐츠 자연 높이 컨테이너)
 *         ├ CELL_CONTENT (실제 콘텐츠)
 *         └ CELL_THRESHOLD (콘텐츠 끝 마커)
 *
 * 일반 아이템엔 멀티컬럼(columnCount)을 쓰지 않는다 — 멀티컬럼은 tall inline-block 콘텐츠
 * 높이를 line-box 단위로만 세서 과소 계산(셀이 콘텐츠보다 짧아져 잘림). 큰 아이템의
 * 가로-흐름 슬라이싱은 SliceView / measureOverflow가 자체 멀티컬럼 트리로 처리한다.
 */
const ItemCell = ({ children, decoratorClassName, style }: ItemCellProps) => (
  <div
    data-cp={KEY.CELL}
    // min-h-max: Column이 flex-col(itemGap>0)일 때, inline-block 콘텐츠의 flex 높이가
    // line-box 기준으로 과소 산정돼 셀이 콘텐츠보다 짧아지는(잘림) 것을 막아 콘텐츠 높이로 맞춘다.
    className={cn('flex min-h-max overflow-hidden', decoratorClassName)}
    style={style}
  >
    <div data-cp={KEY.CELL_INNER} className="w-full">
      <div data-cp={KEY.CELL_CONTENT}>{children}</div>
      <div data-cp={KEY.CELL_THRESHOLD} />
    </div>
  </div>
);

// memo: node/props ref가 안정적이면(소비자가 카드 element를 메모이즈) 재렌더 생략 → 무거운 카드 보호
export default memo(ItemCell);
