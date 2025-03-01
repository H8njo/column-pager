import styled from "@emotion/styled";
import React from "react";

type DividerProps = { columnCount: number; style?: React.CSSProperties };

const Divider = ({ columnCount, style }: DividerProps) => {
  return [...Array(columnCount - 1)].map((_, idx) => (
    <ColumnDivider
      key={idx}
      style={{
        ...style,
        left: `${((idx + 1) * 100) / columnCount}%`,
      }}
    />
  ));
};

const ColumnDivider = styled.div({
  width: 2,
  left: "50%",
  top: "50%",
  height: "100%",
  backgroundColor: "black",
  position: "absolute",
  transform: "translate(-50%, -50%)",
});
export default Divider;
