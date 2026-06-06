import type { HTMLAttributes, PropsWithChildren, Ref } from 'react';
import { cn } from '../../../lib/utils';

type ContainerProps = PropsWithChildren<HTMLAttributes<HTMLDivElement>> & {
  ref?: Ref<HTMLDivElement>;
  pageDirection?: 'horizontal' | 'vertical';
};

/** 페이지들을 세로/가로로 나열하는 최상위 컨테이너 */
const Container = ({
  children,
  ref,
  pageDirection = 'vertical',
  className,
  ...props
}: ContainerProps) => (
  <div
    ref={ref}
    className={cn(
      'flex h-full gap-8',
      pageDirection === 'vertical' ? 'flex-col' : 'flex-row',
      className,
    )}
    {...props}
  >
    {children}
  </div>
);

export default Container;
