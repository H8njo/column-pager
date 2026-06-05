import type { ReactNode } from 'react';
import A4 from './A4';
import Body from './Body';
import Column from './Column';
import Footer from './Footer';
import Header from './Header';

type PageProps = {
  /** 컬럼별 내용 (length = columnCount). 측정 시엔 빈 배열/널을 넘김. */
  columns: ReactNode[];
  columnCount: number;
  header?: ReactNode;
  footer?: ReactNode;
  showDividers?: boolean;
  columnClassName?: string;
};

/** A4 한 장: Header / Body(Column×N) / Footer */
const Page = ({
  columns,
  columnCount,
  header,
  footer,
  showDividers,
  columnClassName,
}: PageProps) => (
  <A4>
    <Header>{header}</Header>
    <Body columnCount={columnCount} showDividers={showDividers}>
      {Array.from({ length: columnCount }).map((_, colIndex) => (
        <Column key={String(colIndex)} className={columnClassName}>
          {columns[colIndex] ?? null}
        </Column>
      ))}
    </Body>
    <Footer>{footer}</Footer>
  </A4>
);

export default Page;
