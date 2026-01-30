import type { HTMLAttributes, Ref } from 'react';
import { cn } from '@/lib/utils';

export const A4_WIDTH = 210;
export const A4_HEIGHT = 297;

// FIXME: 임시 고정값이므로 추후에 동적값으로 변경 예정
const A4_HEIGHT_PX = 1123;
const A4_WIDTH_PX = 794;

interface A4Props extends HTMLAttributes<HTMLDivElement> {
  ref?: Ref<HTMLDivElement>;
}

const A4 = ({ children, style, className, ref, ...props }: A4Props) => {
  return (
    <div
      ref={ref}
      className={cn('flex w-full flex-col overflow-hidden bg-white', className)}
      style={{
        // FIXME: column-pager 구현 시 동적값으로 변경 예정
        height: A4_HEIGHT_PX,
        width: A4_WIDTH_PX,
        ...style,
      }}
      {...props}
    >
      {children}
    </div>
  );
};

export default A4;
