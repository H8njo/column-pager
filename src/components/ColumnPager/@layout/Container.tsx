import type { HTMLAttributes, PropsWithChildren, Ref } from 'react';
import { cn } from '../../../lib/utils';

interface ContainerProps extends PropsWithChildren<HTMLAttributes<HTMLDivElement>> {
  ref?: Ref<HTMLDivElement>;
  pageDirection?: 'horizontal' | 'vertical';
}

const Container = ({ children, ref, pageDirection, className, ...props }: ContainerProps) => {
  return (
    <div
      ref={ref}
      className={cn(
        'flex h-full flex-col gap-8',
        pageDirection === 'vertical' ? 'flex-col' : 'flex-row',
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
};

export default Container;
