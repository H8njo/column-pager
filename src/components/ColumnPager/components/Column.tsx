import type { HTMLAttributes, PropsWithChildren } from 'react';
import { cn } from '../../../lib/utils';
import { KEY } from './keys';

/** 한 컬럼 (폭/높이 측정 기준) */
const Column = ({
  children,
  className,
  ...props
}: PropsWithChildren<HTMLAttributes<HTMLDivElement>>) => (
  <div data-cp={KEY.COLUMN} className={cn('flex-1 overflow-hidden', className)} {...props}>
    {children}
  </div>
);

export default Column;
