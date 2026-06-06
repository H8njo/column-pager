import type { ReactNode } from 'react';
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
}: PageProps) => (
  <PageSheet height={pageHeight}>
    <Header>{header}</Header>
    <Body columnCount={columnCount} showDividers={showDividers}>
      {Array.from({ length: columnCount }).map((_, colIndex) => (
        <Column key={String(colIndex)} className={columnClassName}>
          {columns[colIndex] ?? null}
        </Column>
      ))}
    </Body>
    <Footer>{footer}</Footer>
  </PageSheet>
);

export default Page;
