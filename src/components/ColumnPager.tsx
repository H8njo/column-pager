import React, { PropsWithChildren, ReactNode, useRef } from "react";
import useExtractText from "../hooks/useExtractText";
import styled from "@emotion/styled";
import Divider from "./Divider";

type ColumnPagerProps = {
  columnGap?: number;
  pageStyle?: React.CSSProperties;
  dividerStyle?: React.CSSProperties;
  header?: ReactNode;
  footer?: ReactNode;
  columnCount?: number;
};

const ColumnPager = ({
  header,
  footer,
  columnGap = 0,
  pageStyle,
  dividerStyle,
  columnCount = 2,
  children,
}: PropsWithChildren<ColumnPagerProps>) => {
  const contentsAreaRef = useRef<HTMLDivElement>(null);
  const { extractedText } = useExtractText({ contentsAreaRef, columnGapOffset: columnGap });

  console.log(extractedText);
  return (
    <Page style={pageStyle}>
      {header}
      <Contents ref={contentsAreaRef}>
        <Divider columnCount={columnCount} style={dividerStyle} />
        <ColumnGenerator columnGap={columnGap} columnCount={columnCount} id="column-pager">
          {children}
        </ColumnGenerator>
      </Contents>
      {footer}
    </Page>
  );
};

const Contents = styled.div({
  flexGrow: 1,
  height: 0,
  position: "relative",
});

const Page = styled.div({
  position: "relative",
  display: "flex",
  flexDirection: "column",
  width: "100%",
  aspectRatio: "210 / 297",
});

const ColumnGenerator = styled.div<{ columnGap: number; columnCount: number }>(({ columnGap, columnCount }) => ({
  width: "100%",
  height: "100%",
  columnCount,
  columnGap,
  columnFill: "auto",
  position: "relative",
  // overflow: "hidden",
}));

export default ColumnPager;
