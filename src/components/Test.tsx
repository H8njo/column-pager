import React, { PropsWithChildren, ReactNode, useEffect, useState } from "react";
import _ from "lodash";
import useOverflowDetector from "../hooks/useOverflowDetector";
import useExtractText from "../hooks/useExtractText";
import styled from "@emotion/styled";

type TestProps = {
  columnGap?: number;
  pageStyle?: React.CSSProperties;
  dividerStyle?: React.CSSProperties;
  header?: ReactNode;
  footer?: ReactNode;
  columnCount?: number;
};
const Test = ({
  header,
  footer,
  columnGap = 0,
  pageStyle,
  dividerStyle,
  columnCount = 2,
  children,
}: PropsWithChildren<TestProps>) => {
  const [area, setArea] = useState({ x: 0, y: 0, width: 0, height: 0 });
  const { overflowCheckRef } = useOverflowDetector();
  const { extractedText } = useExtractText(area, columnGap);
  useEffect(() => {
    if (!overflowCheckRef.current) return;
    const detectRect = overflowCheckRef.current.getBoundingClientRect();
    setArea({ x: detectRect.x, y: detectRect.y, width: detectRect.width, height: detectRect.height });
  }, [overflowCheckRef]);

  console.log(extractedText);
  return (
    <Page style={pageStyle}>
      {header}
      <Contents>
        {Array(columnCount - 1)
          .fill(null)
          .map((_, idx) => {
            const dividerPosition = (100 / columnCount) * (idx + 1); // 균등 배치 위치 계산

            return (
              <ColumnDvider
                key={idx}
                style={{
                  ...dividerStyle,
                  left: `${dividerPosition}%`, // X축 기준 위치 설정
                  top: "50%", // Y축 기준 중앙 정렬
                  transform: "translate(-50%, -50%)", // 정확한 중앙 정렬
                }}
              />
            );
          })}

        <ColumnGenerator columnGap={columnGap} columnCount={columnCount} id="column-pager">
          <OverflowDetector ref={overflowCheckRef} />
          {children}
        </ColumnGenerator>
      </Contents>
      {footer}
    </Page>
  );
};
const Contents = styled("div")({
  flexGrow: 1,
  height: 0,
  padding: 30,
  position: "relative",
});

const Page = styled("div")({
  position: "relative",
  display: "flex",
  flexDirection: "column",
  width: "100%",
  aspectRatio: 210 / 297,
});

const ColumnDvider = styled("div")({
  width: 2,
  left: "50%",
  top: "50%",
  height: "100%",
  backgroundColor: "black",
  position: "absolute",
  transform: "translate(-50%, -50%)",
});
const ColumnGenerator = styled("div")<{ columnGap: number; columnCount: number }>(({ columnGap, columnCount }) => ({
  width: "100%",
  height: "100%",
  columnCount,
  columnGap,
  columnFill: "auto",
  position: "relative",
  overflow: "hidden",
}));

const OverflowDetector = styled("div")({
  width: "100%",
  height: "100%",
  position: "absolute",
  opacity: 0.3,
  left: "100%",
  zIndex: -1,
});

export default Test;
