import type { HTMLAttributes, Ref } from 'react';
import { cn } from '../../../lib/utils';
import { KEY } from './keys';

/** A4 고정 크기 (px) — 추후 동적화 가능 */
export const A4_WIDTH_PX = 794;
export const A4_HEIGHT_PX = 1123;

type A4Props = HTMLAttributes<HTMLDivElement> & { ref?: Ref<HTMLDivElement> };

/** A4 한 장 (헤더/본문/푸터를 세로로 담는 페이지 박스) */
const A4 = ({ children, style, className, ref, ...props }: A4Props) => (
  <div
    ref={ref}
    data-cp={KEY.PAGE}
    className={cn('flex w-full flex-col overflow-hidden bg-white', className)}
    style={{ height: A4_HEIGHT_PX, width: A4_WIDTH_PX, ...style }}
    {...props}
  >
    {children}
  </div>
);

export default A4;
