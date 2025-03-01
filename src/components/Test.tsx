import { useEffect, useState } from "react";
import _ from "lodash";
import useDataTransformer from "../hooks/useDataTransformer";
import useOverflowDetector from "../hooks/useOverflowDetector";
import styled from "@emotion/styled";
import useExtractText from "../hooks/useExtractText";

type TestProps = {
  columnGap?: number;
  padding?: number;
};
const Test = ({ columnGap = 0, padding = 0 }: TestProps) => {
  const { data } = useDataTransformer();
  const [area, setArea] = useState({ x: 0, y: 0, width: 0, height: 0 });
  const { overflowCheckRef } = useOverflowDetector();
  const { extractedText } = useExtractText(area, columnGap);
  useEffect(() => {
    if (!overflowCheckRef.current) return;
    const detectRect = overflowCheckRef.current.getBoundingClientRect();
    setArea({ x: detectRect.x, y: detectRect.y, width: detectRect.width, height: detectRect.height });
  }, [overflowCheckRef]);

  return (
    <div style={{ backgroundColor: "ButtonFace", padding }}>
      <Page id="column-pager" columnGap={columnGap}>
        <OverflowDetector ref={overflowCheckRef} />
        <div style={{ fontFamily: "Nanum Myeongjo, serif", fontSize: "0.825rem" }}>
          {/* FIXME: idx key 임시 */}
          {data.map(({ items, startNumber, endNumber }, idx) => {
            return (
              <Section key={idx}>
                <h2>{`${startNumber} - ${endNumber}`}</h2>
                <PassageSection dangerouslySetInnerHTML={{ __html: items[0].passageAreaInfo.htmlText }} />

                {items.map((item, index) => (
                  <QuestionSection>
                    <h3>{startNumber + index}</h3>
                    <div dangerouslySetInnerHTML={{ __html: item.questionAreaInfo.htmlText }} />
                  </QuestionSection>
                ))}
              </Section>
            );
          })}
        </div>
      </Page>
    </div>
  );
};

const Page = styled("div")<{ columnGap: number }>(({ columnGap }) => ({
  width: "100%",
  aspectRatio: 210 / 297,
  columnCount: 2,
  columnGap: columnGap,
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

const Section = styled("div")`
  border: 2px solid transparent;
  &:hover {
    border-color: blue;
  }
`;

const PassageSection = styled("div")({
  marginTop: "1.25rem",
  marginBottom: "1.25rem",
});
const QuestionSection = styled.div`
  & > div {
    word-break: break-word;
  }
`;

export default Test;
