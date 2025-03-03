import React, { PropsWithChildren, ReactNode } from "react";
import styled from "@emotion/styled";
import Contents from "./Contents";

type ColumnPagerProps = {
  columnGap?: number;
  pageStyle?: React.CSSProperties;
  dividerStyle?: React.CSSProperties;
  header?: ReactNode;
  footer?: ReactNode;
  columnCount?: number;
  debugMode?: boolean;
};

const ColumnPager = ({
  header,
  footer,
  columnGap = 0,
  pageStyle,
  dividerStyle,
  columnCount = 2,
  debugMode = false,
  children,
}: PropsWithChildren<ColumnPagerProps>) => {
  return (
    <Page style={pageStyle}>
      {header}
      <Contents columnGap={columnGap} columnCount={columnCount} dividerStyle={dividerStyle} debugMode={debugMode}>
        {children}
      </Contents>
      {footer}
    </Page>
  );
};
const Page = styled.div({
  position: "relative",
  display: "flex",
  flexDirection: "column",
  width: "100%",
  aspectRatio: "210 / 297",
});

export default ColumnPager;
