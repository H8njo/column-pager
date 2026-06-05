import type { ReactNode } from 'react';
import { cn } from '../../../lib/utils';
import type { Slice } from '../core/types';
import { KEY } from './keys';

type SliceViewProps = {
  children: ReactNode;
  slice: Slice;
  decoratorClassName?: string;
};

/**
 * 큰 아이템의 한 슬라이스 렌더 (V1 크롭 렌더 이식).
 *
 * - 바깥 CELL: clipHeight 로 클립 (overflow hidden)
 * - 안쪽 CELL_INNER: columnCount:1 흐름 컨테이너를 translateX(-shiftX)로 이동시켜
 *   N번째 가로 컬럼(슬라이스)을 화면에 노출. 첫 조각은 carryOffset 만큼 위로 당겨
 *   이전 컬럼에서 이어받기 정렬.
 */
const SliceView = ({ children, slice, decoratorClassName }: SliceViewProps) => (
  <div
    data-cp={KEY.CELL}
    className={cn('flex overflow-hidden', decoratorClassName)}
    style={{ height: slice.clipHeight }}
  >
    <div className="flex grow overflow-hidden">
      <div
        data-cp={KEY.CELL_INNER}
        className="w-full"
        style={{
          columnCount: 1,
          columnGap: 0,
          flexGrow: 1,
          height: slice.innerHeight,
          transform: `translateX(-${slice.shiftX}px) translateY(-${slice.shiftY}px)`,
        }}
      >
        <div style={{ height: slice.carryOffset }} />
        <div data-cp={KEY.CELL_CONTENT}>{children}</div>
        <div data-cp={KEY.CELL_THRESHOLD} />
      </div>
    </div>
  </div>
);

export default SliceView;
