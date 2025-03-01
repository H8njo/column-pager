import { useState, useEffect } from "react";

type ExtractTextProps = {
  x: number;
  y: number;
  width: number;
  height: number;
};

const useExtractText = ({ x, y, width, height }: ExtractTextProps, columnGapOffset: number) => {
  const [extractedText, setExtractedText] = useState<string>("");
  const [isExtracting, setIsExtracting] = useState<boolean>(false);

  const getTextFromCoordinates = (x: number, y: number, width: number, height: number): string => {
    const textContent: string[] = [];

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

  const extractText = () => {
    setIsExtracting(true);
    setTimeout(() => {
      try {
        const text = getTextFromCoordinates(x, y, width, height);
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
    extractText();

    const debugElement = document.createElement("div");
    Object.assign(debugElement.style, {
      position: "absolute",
      left: `${width + columnGapOffset}px`,
      top: 0,
      width: `${width}px`,
      height: `${height}px`,
      border: "2px dashed red",
      pointerEvents: "none",
      zIndex: "9999",
    });

    const parentElement = document.getElementById("column-pager"); // 특정 ID 선택
    parentElement?.appendChild(debugElement);
    return () => {
      parentElement?.removeChild(debugElement);
    };
  }, [x, y, width, height]);

  return { extractedText, isExtracting, extractText };
};

export default useExtractText;
