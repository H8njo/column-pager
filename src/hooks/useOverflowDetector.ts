import { useRef } from "react";

const useOverflowDetector = () => {
  const overflowCheckRef = useRef<HTMLDivElement>(null);
  return {
    overflowCheckRef,
  };
};

export default useOverflowDetector;
