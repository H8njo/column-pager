import "./global.css";
import Test from "./components/Test";
import useDataTransformer from "./hooks/useDataTransformer";
import styled from "@emotion/styled";

function App() {
  const { data } = useDataTransformer();

  return (
    <div style={{ padding: 100 }}>
      <Test columnGap={60} pageStyle={{ padding: 50 }} dividerStyle={{ backgroundColor: "red", paddingTop: 50 }}>
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
      </Test>
    </div>
  );
}

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
