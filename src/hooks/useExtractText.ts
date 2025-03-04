import { useState } from "react";

type ExtractTextProps = {
  debugMode?: boolean;
};

/**
 * DOMRect 값을 받아 해당 위치의 text를 추출하는 hook
 * @param debugMode true일 경우 감지 영역에 디버깅용 border 생성
 * @returns 추출된 텍스트와 추출 중 여부
 */
const useExtractText = ({ debugMode }: ExtractTextProps) => {
  const [extractedText, setExtractedText] = useState<string>("");
  const [isExtracting, setIsExtracting] = useState<boolean>(false);

  const getTextFromCoordinates = (rect: DOMRect): string => {
    if (!rect) return "";

    const { x, y, width, height } = rect;
    const textContent: string[] = [];

    const checkTextNodes = (node: Node) => {
      if (node.nodeType === Node.TEXT_NODE && node.textContent?.trim()) {
        try {
          const range = document.createRange();
          range.selectNodeContents(node);
          const rects = range.getClientRects();

          for (let i = 0; i < rects.length; i++) {
            const rect = rects[i];

            if (!(rect.right < x || rect.left > x + width || rect.bottom < y || rect.top > y + height)) {
              const partialText = node.textContent.trim();
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

    return [...textContent].join("");
  };

  const extractText = (rect?: DOMRect): string => {
    if (!rect) return "rect 값이 없습니다.";

    try {
      setIsExtracting(true);
      drawDebugBorder(rect);
      const text = getTextFromCoordinates(rect);
      setExtractedText(text);
      return text;
    } catch (error) {
      console.error("텍스트 추출 중 오류:", error);
      return `오류가 발생했습니다: ${(error as Error).message}`;
    } finally {
      setIsExtracting(false);
    }
  };

  const drawDebugBorder = (rect: DOMRect) => {
    if (!debugMode) return;

    const div = document.createElement("div");
    Object.assign(div.style, {
      position: "absolute",
      top: `${rect.top}px`,
      left: `${rect.left}px`,
      width: `${rect.width}px`,
      height: `${rect.height}px`,
      border: "2px dashed red",
      background: "rgba(255, 0, 0, 0.1)",
    });
    document.body.appendChild(div);
  };

  return { extractedText, isExtracting, extractText };
};

export default useExtractText;
