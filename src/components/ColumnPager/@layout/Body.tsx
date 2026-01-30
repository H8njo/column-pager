import type { HTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

const Body = ({
  children,
  className,
  columnCount,
  showDividers,
  ...props
}: HTMLAttributes<HTMLDivElement> & { columnCount?: number; showDividers?: boolean }) => {
  const count = columnCount ?? 1;

  return (
    <div
      className={cn('relative flex grow flex-row gap-10 overflow-hidden px-8 py-5', className)}
      {...props}
    >
      {showDividers &&
        Array.from({ length: count - 1 }).map((_, index) => {
          // 콘텐츠 영역 = 100% - 64px (px-8 양쪽)
          // 총 gap 영역 = (count - 1) * 40px
          // 컬럼 하나의 너비 = (콘텐츠 영역 - 총 gap) / count
          // n번째 구분선 위치 = 32px + (컬럼 너비 * (n+1)) + (gap * n) + (gap / 2) - (gap / 2)
          //                  = 32px + (컬럼 너비 + gap) * (n+1) - gap/2
          const gapPx = 40;
          const totalGap = (count - 1) * gapPx;
          // left = padding + (index+1) * columnWidth + index * gap + gap/2
          //      = padding + (index+1) * ((contentWidth - totalGap) / count) + index * gap + gap/2
          return (
            <div
              key={index}
              className="bg-mono-400 absolute inset-y-5 w-px"
              style={{
                left: `calc(32px + (100% - 64px - ${totalGap}px) * ${(index + 1) / count} + ${index * gapPx + gapPx / 2}px)`,
              }}
            />
          );
        })}
      {children}
    </div>
  );
};

export default Body;
