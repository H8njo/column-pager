import { type HTMLAttributes, isValidElement, type PropsWithChildren } from 'react';
import { cn } from '../../../lib/utils';
import {
  DATA_COLUMN_BREAKER,
  DATA_KEY,
  DATA_PAGE_BREAKER,
  DATA_PAGE_INFORMATION,
} from '../controls/constants';

const Column = ({
  children,
  className,
  ...props
}: PropsWithChildren<HTMLAttributes<HTMLDivElement>> & {
  columnCount?: number;
  columnGap?: number;
  className?: string;
}) => {
  return (
    <div
      data-key={DATA_KEY.PAGE_COLUMN}
      className={cn('flex-1 overflow-hidden', className)}
      {...props}
    >
      {children}
    </div>
  );
};

export const ColumnItem = ({
  children,
  ...props
}: PropsWithChildren<HTMLAttributes<HTMLDivElement>>) => {
  // children이 유틸 컴포넌트(PageBreaker, ColumnBreaker, Information)인 경우 계산에서 제외될 수 있도록 바로 children을 반환
  if (isValidElement(children)) {
    const childProps = children.props as Record<string, unknown>;
    const isBreaker =
      childProps[DATA_PAGE_BREAKER] !== undefined || childProps[DATA_COLUMN_BREAKER] !== undefined;
    const isInformation = childProps[DATA_PAGE_INFORMATION] !== undefined;
    if (isInformation) {
      return children;
    }

    if (isBreaker) {
      return children;
    }
  }

  return (
    <div data-key={DATA_KEY.PAGE_COLUMN_ITEM} {...props}>
      {children}
    </div>
  );
};
export default Column;
