import React, { PropsWithChildren, ReactNode, useEffect, useMemo } from "react";
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

  const tolerance = { x: columnGap };
  const detectionRect = useMemo(() => {
    if (!contentsRect) return;
    // 텍스트를 감지할 영역을 계산
    return {
      ...contentsRect,
      x: contentsRect.x + contentsRect.width + tolerance.x,
      y: contentsRect.y,
      width: contentsRect.width,
      height: contentsRect.height,
    };
  }, [contentsRect, columnGap]);

  const { extractText, extractedText } = useExtractText({
    detectionRect,
    tolerance,
    debugMode,
  });

  const handleClick = () => {
    const text = extractText(detectionRect);
  };

  return (
    <Page style={pageStyle}>
      {header} <button onClick={handleClick}>test</button>
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
  overflow: "auto",
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
