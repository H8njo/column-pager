import type { PropsWithChildren } from 'react';
import { DATA_KEY } from '../controls/constants';
import A4 from './A4';
import Body from './Body';
import Footer from './Footer';
import Header from './Header';

interface PageProps extends PropsWithChildren {
  pageInformation?: string;
  header: React.ReactNode;
  footer: React.ReactNode;
  columnCount: number;
  showDividers?: boolean;
}

const Page = ({
  children,
  header,
  footer,
  pageInformation,
  columnCount,
  showDividers,
}: PageProps) => {
  return (
    <A4 data-key={DATA_KEY.PAGE_CONTAINER} data-page-information={pageInformation}>
      <Header>{header}</Header>
      <Body data-key={DATA_KEY.PAGE_BODY} columnCount={columnCount} showDividers={showDividers}>
        {children}
      </Body>
      <Footer>{footer}</Footer>
    </A4>
  );
};

export default Page;
