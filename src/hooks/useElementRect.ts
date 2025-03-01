import { useCallback, useEffect, useRef, useState } from "react";
import _ from "lodash";

const useElementRect = <T extends HTMLElement>(
  delay: number = 200,
): [React.RefObject<T | null>, DOMRect | undefined] => {
  const ref = useRef<T>(null);
  const [rect, setRect] = useState<DOMRect>();

  const handleResize = useCallback(
    _.debounce((entries: ResizeObserverEntry[]) => {
      const entry = entries[0];
      if (ref.current && entry) {
        setRect(ref.current.getBoundingClientRect());
      }
    }, delay),
    [delay],
  );

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new ResizeObserver(handleResize);
    observer.observe(element);

    return () => {
      observer.disconnect();
      handleResize.cancel();
    };
  }, [handleResize]);

  return [ref, rect];
};

export default useElementRect;
