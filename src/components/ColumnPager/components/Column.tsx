import type { HTMLAttributes, PropsWithChildren } from 'react';
import { cn } from '../../../lib/utils';
import { KEY } from './keys';

type ColumnProps = HTMLAttributes<HTMLDivElement> & {
  /** 같은 컬럼 아이템 사이 세로 간격(px). >0이면 flex-col + gap (첫 아이템 위엔 없음). */
  itemGap?: number;
};

/** 한 컬럼 (폭/높이 측정 기준) */
const Column = ({
  children,
  className,
  itemGap = 0,
  style,
  ...props
}: PropsWithChildren<ColumnProps>) => (
  <div
    data-cp={KEY.COLUMN}
    className={cn('flex-1 overflow-hidden', itemGap > 0 && 'flex flex-col', className)}
    style={itemGap > 0 ? { gap: itemGap, ...style } : style}
    {...props}
  >
    {children}
  </div>
);

export default Column;
