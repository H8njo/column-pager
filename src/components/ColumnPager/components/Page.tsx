import type { ReactNode } from 'react';
import { cn } from '../../../lib/utils';
import Body from './Body';
import Column from './Column';
import Footer from './Footer';
import Header from './Header';
import PageSheet from './PageSheet';

type PageProps = {
  /** 컬럼별 내용 (length = columnCount). 측정 시엔 빈 배열/널을 넘김. */
  columns: ReactNode[];
  columnCount: number;
  header?: ReactNode;
  footer?: ReactNode;
  showDividers?: boolean;
  columnClassName?: string;
  /** 페이지 높이 (px). 폭은 컨테이너 반응형. */
  pageHeight?: number;
  /**
   * 컬럼/본문 박스 클립 여부 (기본 true). false면 Column·Body가 overflow-visible —
   * layout 애니메이션 중 이동 셀이 잘리지 않는다. 슬라이스는 SliceView 자체 클립,
   * 페이지 높이는 PageSheet가 계속 클립하므로 정상 상태 모양은 유지된다.
   */
  clip?: boolean;
  /** 같은 컬럼 아이템 사이 세로 간격(px). Column의 flex gap으로 렌더. */
  itemGap?: number;
};

/** 한 페이지: Header / Body(Column×N) / Footer. 폭은 컨테이너 반응형. */
const Page = ({
  columns,
  columnCount,
  header,
  footer,
  showDividers,
  columnClassName,
  pageHeight,
  clip = true,
  itemGap = 0,
}: PageProps) => (
  <PageSheet height={pageHeight}>
    <Header>{header}</Header>
    <Body columnCount={columnCount} showDividers={showDividers} clip={clip}>
      {Array.from({ length: columnCount }).map((_, colIndex) => (
        // clip=false면 컬럼 overflow-visible (twMerge가 기본 overflow-hidden을 덮어씀)
        <Column
          key={String(colIndex)}
          itemGap={itemGap}
          className={cn(columnClassName, !clip && 'overflow-visible')}
        >
          {columns[colIndex] ?? null}
        </Column>
      ))}
    </Body>
    <Footer>{footer}</Footer>
  </PageSheet>
);

export default Page;
