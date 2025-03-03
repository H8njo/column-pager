import { useEffect, useState } from "react";

type ExtractTextProps = {
  detectionRect: DOMRect | undefined;
  tolerance?: { x?: number; y?: number };
  debugMode?: boolean;
};

/**
 * DOMRect 값을 받아 해당 위치의 text를 추출하는 hook
 * @param detectionRect 감지할 좌표값
 * @param tolerance 감지 오차범위 (x, y)
 * @param debugMode true일 경우 감지 영역에 디버깅용 border 생성
 * @returns 추출된 텍스트와 추출 중 여부
 */
const useExtractText = ({ detectionRect, tolerance = { x: 0, y: 0 }, debugMode }: ExtractTextProps) => {
  const [extractedText, setExtractedText] = useState<string>("");
  const [isExtracting, setIsExtracting] = useState<boolean>(false);

  const toleranceX = tolerance.x || 0;
  const toleranceY = tolerance.y || 0;

  const getTextFromCoordinates = (rect: DOMRect): string => {
    if (!rect) return "";

    const { x, y, width, height } = rect;
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

    const checkTextNodes = (node: Node) => {
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
    };

    if (document.body) {
      checkTextNodes(document.body);
    }

    return [...new Set(textContent)].join(" ");
  };

  const extractText = (rect?: DOMRect) => {
    if (!rect) return;

    try {
      setIsExtracting(true);
      const text = getTextFromCoordinates(rect);
      setExtractedText(text);
      return text;
    } catch (error) {
      console.error("텍스트 추출 중 오류:", error);
      setExtractedText(`오류가 발생했습니다: ${(error as Error).message}`);
    } finally {
      setIsExtracting(false);
    }
  };
  const drawDebugBorder = (rect: DOMRect) => {
    if (!debugMode) return;
    const debugElement = document.createElement("div");

    Object.assign(debugElement.style, {
      position: "absolute",
      left: `${toleranceX + rect.width}px`,
      top: `${0 + toleranceY}px`,
      width: `${rect.width}px`,
      height: `${rect.height}px`,
      border: "2px dashed red",
      pointerEvents: "none",
      zIndex: "9999",
    });

    console.log("텍스트 감지 영역:", rect);

    const contentsArea = document.getElementById("column-pager-contents-area");
    contentsArea?.appendChild(debugElement);
  };

  useEffect(() => {
    if (!detectionRect) return;
    extractText(detectionRect);
    drawDebugBorder(detectionRect);
  }, [detectionRect]);

  return { extractedText, isExtracting, extractText };
};

export default useExtractText;
