import { useState, useEffect, RefObject } from "react";

type ExtractTextProps = {
  contentsAreaRef: RefObject<HTMLDivElement | null>;
  columnGapOffset: number;
};

const useExtractText = ({ contentsAreaRef, columnGapOffset }: ExtractTextProps) => {
  const [extractedText, setExtractedText] = useState<string>("");
  const [isExtracting, setIsExtracting] = useState<boolean>(false);
  const [contentsRect, setContentsRect] = useState<DOMRect>();

  useEffect(() => {
    if (!contentsAreaRef.current) return;
    // Contents 부분의 영역을 가져옴
    const rect = contentsAreaRef.current.getBoundingClientRect();
    setContentsRect(rect);
  }, [contentsAreaRef]);

  // 실제 텍스트 감지에 사용될 영역 계산
  const getDetectionCoordinates = () => {
    if (!contentsRect) return { x: 0, y: 0, width: 0, height: 0 };

    const baseRect = contentsRect;

    return {
      x: baseRect.x + baseRect.width + columnGapOffset,
      y: baseRect.y,
      width: baseRect.width,
      height: baseRect.height,
    };
  };

  const getTextFromCoordinates = (detectionCoords: { x: number; y: number; width: number; height: number }): string => {
    if (!contentsRect) return "";

    const { x, y, width, height } = detectionCoords;
    const textContent: string[] = [];

    const extractVisibleText = (
      node: Node,
      range: Range,
      x: number,
      y: number,
      width: number,
      height: number,
    ): string | null => {
      if (!node.textContent) return null;

      let visibleText = "";
      const text = node.textContent.trim();

      for (let i = 0; i < text.length; i++) {
        range.setStart(node, i);
        range.setEnd(node, i + 1);
        const rects = range.getClientRects();

        for (const rect of rects) {
          if (!(rect.right < x || rect.left > x + width || rect.bottom < y || rect.top > y + height)) {
            visibleText += text[i];
          }
        }
      }

      return visibleText.trim() || null;
    };

    function checkTextNodes(node: Node) {
      if (node.nodeType === Node.TEXT_NODE && node.textContent?.trim()) {
        try {
          const range = document.createRange();
          range.selectNodeContents(node);
          const rects = range.getClientRects();

          for (let i = 0; i < rects.length; i++) {
            const rect = rects[i];

            if (!(rect.right < x || rect.left > x + width || rect.bottom < y || rect.top > y + height)) {
              const partialText = extractVisibleText(node, range, x, y, width, height);
              if (partialText) {
                textContent.push(partialText);
              }
              break;
            }
          }
        } catch (error) {
          console.error("텍스트 노드 처리 중 오류:", error);
        }
      } else if (node.nodeType === Node.ELEMENT_NODE) {
        const element = node as HTMLElement;
        const style = window.getComputedStyle(element);
        if (style.display !== "none" && style.visibility !== "hidden") {
          node.childNodes.forEach(checkTextNodes);
        }
      }
    }

    if (document.body) {
      checkTextNodes(document.body);
    }

    return [...new Set(textContent)].join(" ");
  };

  const extractText = () => {
    if (!contentsRect) {
      setExtractedText("");
      return;
    }

    setIsExtracting(true);
    setTimeout(() => {
      try {
        const detectionCoords = getDetectionCoordinates();
        const text = getTextFromCoordinates(detectionCoords);
        setExtractedText(text);
      } catch (error) {
        console.error("텍스트 추출 중 오류:", error);
        setExtractedText(`오류가 발생했습니다: ${(error as Error).message}`);
      } finally {
        setIsExtracting(false);
      }
    }, 0);
  };

  useEffect(() => {
    if (!contentsAreaRef.current || !contentsRect) return;

    extractText();

    const debugElement = document.createElement("div");

    Object.assign(debugElement.style, {
      position: "absolute",
      left: `${columnGapOffset + contentsRect.width}px`,
      top: "0",
      width: `${contentsRect.width}px`,
      height: `${contentsRect.height}px`,
      border: "2px dashed red",
      pointerEvents: "none",
      zIndex: "9999",
    });

    return () => {
      if (contentsAreaRef.current && debugElement.parentNode === contentsAreaRef.current) {
        contentsAreaRef.current.removeChild(debugElement);
      }
    };
  }, [contentsRect]);

  return { extractedText, isExtracting, extractText };
};

export default useExtractText;
