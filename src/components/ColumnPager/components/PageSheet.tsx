import type { HTMLAttributes, Ref } from 'react';
import { cn } from '../../../lib/utils';
import { KEY } from './keys';

/** 페이지 높이 기본값 (px) */
export const DEFAULT_PAGE_HEIGHT = 1123;

type PageSheetProps = HTMLAttributes<HTMLDivElement> & {
  ref?: Ref<HTMLDivElement>;
  /** 페이지 높이 (px). 폭은 컨테이너에 맞춰 반응형(w-full). */
  height?: number;
};

/** 한 페이지 시트 — 폭은 컨테이너 폭에 반응(w-full), 높이는 prop으로 고정. */
const PageSheet = ({
  children,
  style,
  className,
  ref,
  height = DEFAULT_PAGE_HEIGHT,
  ...props
}: PageSheetProps) => (
  <div
    ref={ref}
    data-cp={KEY.PAGE}
    className={cn('flex w-full shrink-0 flex-col overflow-hidden bg-white', className)}
    style={{ height, ...style }}
    {...props}
  >
    {children}
  </div>
);

export default PageSheet;
