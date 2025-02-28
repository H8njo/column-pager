import { Fragment, useEffect } from "react";
import _ from "lodash";
import useDataTransformer from "../hooks/useDataTransformer";
import useOverflowDetector from "../hooks/useOverflowDetector";

const Test = () => {
  const { data } = useDataTransformer();
  const { detectorRef } = useOverflowDetector();

  useEffect(() => {
    console.log(detectorRef.current);
  }, [detectorRef]);

  return (
    <>
      <div style={{ padding: 20 }}>
        <div
          ref={detectorRef}
          style={{
            width: "100%",
            padding: 32,
            backgroundColor: "ButtonFace",
            aspectRatio: 210 / 297,
            columnCount: 2,
            columnGap: "2rem",
            columnFill: "auto",
            columnRule: "1px solid #e2e8f0",
          }}
        >
          <div style={{ fontFamily: "Nanum Myeongjo, serif", fontSize: "0.825rem" }}>
            {/* FIXME: idx key 임시 */}
            {data.map(({ items, startNumber, endNumber }, idx) => {
              return (
                <Fragment key={idx}>
                  <h2>{`${startNumber} - ${endNumber}`}</h2>
                  <div
                    style={{ marginTop: "1.25rem", marginBottom: "1.25rem" }}
                    dangerouslySetInnerHTML={{ __html: items[0].passageAreaInfo.htmlText }}
                  ></div>

                  {items.map((item, index) => (
                    <>
                      <h3>{startNumber + index}</h3>
                      <div dangerouslySetInnerHTML={{ __html: item.questionAreaInfo.htmlText }} />
                    </>
                  ))}
                </Fragment>
              );
            })}
          </div>
        </div>
      </div>
    </>
  );
};

export default Test;
