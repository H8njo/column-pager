import type { HTMLAttributes } from 'react';
import { cn } from '../../../lib/utils';
import { KEY } from './keys';

type BodyProps = HTMLAttributes<HTMLDivElement> & {
  columnCount: number;
  showDividers?: boolean;
  /** 본문 박스 클립 여부 (기본 true). false면 overflow-visible — layout 애니메이션이 잘리지 않음. */
  clip?: boolean;
};

/** 컬럼들을 가로로 담는 본문 영역. showDividers 시 컬럼 사이 구분선. */
const Body = ({
  children,
  className,
  columnCount,
  showDividers,
  clip = true,
  ...props
}: BodyProps) => (
  <div
    data-cp={KEY.BODY}
    className={cn(
      'relative flex grow flex-row gap-10 px-8 py-5',
      clip ? 'overflow-hidden' : 'overflow-visible',
      className,
    )}
    {...props}
  >
    {showDividers &&
      Array.from({ length: Math.max(0, columnCount - 1) }).map((_, index) => {
        const gapPx = 40;
        const totalGap = (columnCount - 1) * gapPx;
        return (
          <div
            // biome-ignore lint/suspicious/noArrayIndexKey: 고정 개수의 정적 컬럼 구분선
            key={index}
            className="bg-gray-400 absolute inset-y-5 w-px"
            style={{
              left: `calc(32px + (100% - 64px - ${totalGap}px) * ${(index + 1) / columnCount} + ${index * gapPx + gapPx / 2}px)`,
            }}
          />
        );
      })}
    {children}
  </div>
);

export default Body;
