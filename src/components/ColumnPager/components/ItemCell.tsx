import type { CSSProperties, ReactNode } from 'react';
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
 * 구조(측정에 필수 — V1과 동일):
 *   CELL (overflow-hidden)
 *     └ CELL_INNER (columnCount:1 — 넘치면 가로 컬럼으로 흐름)
 *         ├ CELL_CONTENT (실제 콘텐츠 — flowWidth 측정)
 *         └ CELL_THRESHOLD (콘텐츠 끝 마커 — contentEnd 측정)
 */
const ItemCell = ({ children, decoratorClassName, style }: ItemCellProps) => (
  <div data-cp={KEY.CELL} className={cn('flex overflow-hidden', decoratorClassName)} style={style}>
    <div data-cp={KEY.CELL_INNER} className="w-full" style={{ columnCount: 1, columnGap: 0 }}>
      <div data-cp={KEY.CELL_CONTENT}>{children}</div>
      <div data-cp={KEY.CELL_THRESHOLD} />
    </div>
  </div>
);

export default ItemCell;
