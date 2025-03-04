import React, { PropsWithChildren, useEffect, useState } from "react";
import useExtractText from "../hooks/useExtractText";
import styled from "@emotion/styled";
import Divider from "./Divider";
import useElementRect from "../hooks/useElementRect";
import _ from "lodash";
import { searchComponentForText } from "../utils/textSearcher";

type ContentsProps = PropsWithChildren<{
  columnGap: number;
  columnCount: number;
  dividerStyle?: React.CSSProperties;
  debugMode: boolean;
}>;

const Contents = ({ columnGap, columnCount, dividerStyle, debugMode, children }: ContentsProps) => {
  const [contentsAreaRef, contentsRect] = useElementRect<HTMLDivElement>();
  const [pagesText, setPagesText] = useState<string[]>([]);

  useEffect(() => {
    if (_.isEmpty(pagesText)) return;

    const test = pagesText.map((pageText) => searchComponentForText(children, pageText)[0]);
    console.log(test);
  }, [pagesText]);

  const { extractText } = useExtractText({
    debugMode,
  });

  useEffect(() => {
    if (!contentsRect) return;

    let pageIndex = 0;
    const pages = [];
    while (true) {
      const pagePosition = (contentsRect.width + columnGap) * pageIndex + contentsRect.x;
      const rect = Object.assign(DOMRect.fromRect(contentsRect), { x: pagePosition });

      const text = extractText(rect);
      if (_.isEmpty(text)) break;
      pages.push(text);
      pageIndex++;
    }
    setPagesText(pages);
  }, [contentsRect]);

  return (
    <Container>
      <OverflowDetector ref={contentsAreaRef} />
      <Divider columnCount={columnCount} style={dividerStyle} />
      <ColumnGenerator columnGap={columnGap} columnCount={columnCount} debugMode={debugMode}>
        {children}
      </ColumnGenerator>
    </Container>
  );
};

const OverflowDetector = styled.div({
  position: "absolute",
  width: "100%",
  height: "100%",
  pointerEvents: "none",
});
const Container = styled.div({
  flexGrow: 1,

  height: 0,
  position: "relative",
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
export default Contents;
