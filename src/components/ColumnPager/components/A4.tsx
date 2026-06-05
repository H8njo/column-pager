import type { HTMLAttributes, Ref } from 'react';
import { cn } from '../../../lib/utils';
import { KEY } from './keys';
import { PAGE_PRESETS } from './pageSize';

/** A4 기본 크기 (px, 96dpi) */
export const A4_WIDTH_PX = PAGE_PRESETS.A4.width;
export const A4_HEIGHT_PX = PAGE_PRESETS.A4.height;

type A4Props = HTMLAttributes<HTMLDivElement> & {
  ref?: Ref<HTMLDivElement>;
  /** 페이지 폭 (기본 A4) */
  width?: number;
  /** 페이지 높이 (기본 A4) */
  height?: number;
};

/** 한 페이지 시트 (헤더/본문/푸터를 세로로 담는 박스). 기본 A4, width/height로 변경 가능. */
const A4 = ({
  children,
  style,
  className,
  ref,
  width = A4_WIDTH_PX,
  height = A4_HEIGHT_PX,
  ...props
}: A4Props) => (
  <div
    ref={ref}
    data-cp={KEY.PAGE}
    className={cn('flex w-full flex-col overflow-hidden bg-white', className)}
    style={{ height, width, ...style }}
    {...props}
  >
    {children}
  </div>
);

export default A4;
