import { useRef } from "react";

const useOverflowDetector = () => {
  const detectorRef = useRef(null);
  return {
    detectorRef,
  };
};

export default useOverflowDetector;
