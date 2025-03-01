import "./global.css";
import ColumnPager, { ColumnPagerHandle } from "./components/ColumnPager";
import useDataTransformer from "./hooks/useDataTransformer";
import styled from "@emotion/styled";
import { useRef } from "react";

function App() {
  const columnPagerRef = useRef<ColumnPagerHandle>(null);

  const { data } = useDataTransformer();

  const handleExtractText = () => {
    if (columnPagerRef.current) {
      columnPagerRef.current.reExtractText();
    }
  };

  return (
    <div style={{ padding: 40 }}>
      <button onClick={handleExtractText}>텍스트 추출</button>

      <ColumnPager
        columnGap={60}
        pageStyle={{ backgroundColor: "white" }}
        header={<Header />}
        footer={<Footer />}
        columnCount={3}
        debugMode={true}
        ref={columnPagerRef}
      >
        <div style={{ fontFamily: "Nanum Myeongjo, serif", fontSize: "0.825rem" }}>
          {data.map(({ items, startNumber, endNumber }, idx) => {
            return (
              <Section key={idx}>
                <h2>{`${startNumber} - ${endNumber}`}</h2>
                <PassageSection dangerouslySetInnerHTML={{ __html: items[0].passageAreaInfo.htmlText }} />

                {items.map((item, index) => (
                  <QuestionSection key={`${idx}-${index}`}>
                    <h3>{startNumber + index}</h3>
                    <div dangerouslySetInnerHTML={{ __html: item.questionAreaInfo.htmlText }} />
                  </QuestionSection>
                ))}
              </Section>
            );
          })}
        </div>
      </ColumnPager>
    </div>
  );
}
const Header = () => {
  return (
    <div style={{ borderBottom: "2px solid black", paddingLeft: 30, paddingRight: 30, paddingBottom: 20 }}>
      <h1>Hoonjo</h1>
      <p style={{ fontSize: 12 }}>
        Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's
        standard dummy text ever since the 1500s, when an unknown
      </p>
    </div>
  );
};

const Footer = () => {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between",
        fontSize: "10px",
        height: 50,
        alignItems: "center",
        borderTop: "2px solid black",
        paddingLeft: 30,
        paddingRight: 30,
      }}
    >
      <span>Lorem Ipsum is </span>
      <span>Lorem Ipsum is simply dummy text of the printing and typesetting industry</span>
      <span>Lorem Ipsum is </span>
    </div>
  );
};

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

export default App;
