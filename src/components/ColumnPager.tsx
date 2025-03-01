import React, { PropsWithChildren, ReactNode } from "react";
import useExtractText from "../hooks/useExtractText";
import styled from "@emotion/styled";
import Divider from "./Divider";
import useElementRect from "../hooks/useElementRect";

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
  const [contentsAreaRef, contentsRect] = useElementRect<HTMLDivElement>();
  const { extractedText } = useExtractText({
    detectionRect: contentsRect,
    tolerance: { x: columnGap },
    debugMode,
  });
  console.log(extractedText);

  return (
    <Page style={pageStyle}>
      {header}
      <Contents ref={contentsAreaRef} id="column-pager-contents-area">
        <Divider columnCount={columnCount} style={dividerStyle} />
        <ColumnGenerator columnGap={columnGap} columnCount={columnCount} debugMode={debugMode}>
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

const ColumnGenerator = styled.div<{ columnGap: number; columnCount: number; debugMode: boolean }>(
  ({ columnGap, columnCount, debugMode }) => ({
    width: "100%",
    height: "100%",
    columnCount,
    columnGap,
    columnFill: "auto",
    position: "relative",
    overflow: debugMode ? "visible" : "hidden",
  }),
);

export default ColumnPager;
