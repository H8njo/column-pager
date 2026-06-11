import type { ReactNode } from 'react';
import { cn } from '../../../lib/utils';
import { KEY } from './keys';

type BodyProps = {
  children: ReactNode;
  columnCount: number;
  showDividers?: boolean;
  /** 본문 박스 클립 여부 (기본 true). false면 overflow-visible — layout 애니메이션이 잘리지 않음. */
  clip?: boolean;
  /** 컬럼 사이 가로 간격(px). 기본 0. */
  columnGap?: number;
  /** 본문 영역 클래스(패딩 등). 기본 없음 — 소비자가 ColumnPager.bodyClassName으로 지정. */
  bodyClassName?: string;
};

/**
 * 컬럼들을 가로로 담는 본문 영역. showDividers 시 컬럼 사이(gap 중앙) 구분선.
 *
 * 안쪽 row가 콘텐츠 영역(패딩 제외)을 채우고 구분선은 그 row 기준으로 절대배치되므로,
 * bodyClassName으로 어떤 패딩을 줘도 구분선 정렬이 어긋나지 않는다.
 */
const Body = ({
  children,
  columnCount,
  showDividers,
  clip = true,
  columnGap = 0,
  bodyClassName,
}: BodyProps) => (
  <div
    data-cp={KEY.BODY}
    className={cn('flex grow', clip ? 'overflow-hidden' : 'overflow-visible', bodyClassName)}
  >
    <div className="relative flex grow flex-row" style={{ gap: columnGap }}>
      {showDividers &&
        Array.from({ length: Math.max(0, columnCount - 1) }).map((_, index) => {
          // index번째 gap의 중앙. row(콘텐츠 영역) 기준 → padding 값이 필요 없다.
          // colW = (100% - (n-1)*gap) / n, 중앙 = (index+1)*colW + index*gap + gap/2.
          const n = columnCount;
          return (
            <div
              // biome-ignore lint/suspicious/noArrayIndexKey: 고정 개수의 정적 컬럼 구분선
              key={index}
              className="bg-gray-400 absolute inset-y-0 w-px"
              style={{
                left: `calc((100% - ${(n - 1) * columnGap}px) / ${n} * ${index + 1} + ${index * columnGap + columnGap / 2}px)`,
              }}
            />
          );
        })}
      {children}
    </div>
  </div>
);

export default Body;
