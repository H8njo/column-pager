import React from "react";
import ReactDOMServer from "react-dom/server";
import { decodeSpace, encodeGt, encodeLt, normalizeText, trimAllSpaces } from ".";

/**
 * 검색 결과 인터페이스
 */
export interface SearchResult {
  found: boolean;
  html: string;
  text: string;
  element?: React.ReactNode;
  startIndex?: number;
  endIndex?: number;
}

/**
 * HTML 문자열에서 태그를 가로질러 텍스트를 검색하는 함수 (여러 결과 반환, 공백 무시)
 *
 * @param html - 검색할 HTML 문자열 (ReactDOMServer.renderToString 결과 등)
 * @param rawSearchText - 검색할 텍스트
 * @returns SearchResult 배열
 */
const search = (html: string, rawSearchText: string): SearchResult[] => {
  if (!rawSearchText || !html) {
    return [{ found: false, html: "", text: "" }];
  }

  // TODO: encodeLt, encodeGt와 같은 예외 처리들을 내려받도록 해야함.
  const formatText = normalizeText(decodeSpace, trimAllSpaces, encodeLt, encodeGt);
  const formattedSearchText = formatText(rawSearchText);

  // 검색어가 공백만으로 이루어진 경우
  if (formattedSearchText === "") {
    return [{ found: false, html: "", text: rawSearchText }];
  }

  const results: SearchResult[] = [];

  // 모든 HTML 태그 위치와 내용을 기록
  const tagPositions: { start: number; end: number; tag: string }[] = [];
  const tagRegex = /<[^>]+>/g;
  let match;

  while ((match = tagRegex.exec(html)) !== null) {
    tagPositions.push({
      start: match.index,
      end: match.index + match[0].length,
      tag: match[0],
    });
  }

  const textOnly = html.replace(/<[^>]+>/g, "");
  const formattedHtml = formatText(textOnly);

  const positionMapping: number[] = [];
  let noSpaceIndex = 0;

  for (let i = 0; i < textOnly.length; i++) {
    if (!/\s/.test(textOnly[i])) {
      positionMapping[noSpaceIndex] = i;
      noSpaceIndex++;
    }
  }

  // 모든 검색어 위치 찾기 (공백 무시)
  let searchIndex = 0;
  let currentIndex = formattedHtml.indexOf(formattedSearchText, searchIndex);

  while (currentIndex !== -1) {
    // 공백이 없는 텍스트에서 검색어의 시작과 끝 위치
    const noSpaceStart = currentIndex;
    const noSpaceEnd = currentIndex + formattedSearchText.length;

    // 공백이 있는 원본 텍스트에서의 위치로 변환
    const textStart = positionMapping[noSpaceStart];
    const textEnd = positionMapping[noSpaceEnd - 1] + 1; // 마지막 문자의 다음 위치

    if (textStart !== undefined && textEnd !== undefined) {
      // 태그 고려하여 HTML에서의 실제 위치 계산
      let htmlStart = textStart;
      let htmlEnd = textEnd;

      // 텍스트 시작 위치 앞에 있는 태그의 길이 합산
      for (const pos of tagPositions) {
        if (pos.start <= htmlStart) {
          // 이 태그는 텍스트 시작점 이전에 있음
          htmlStart += pos.end - pos.start;
        }
        if (pos.start < htmlEnd) {
          // 이 태그는 텍스트 끝점 이전에 있음
          htmlEnd += pos.end - pos.start;
        }
      }

      // 시작점과 끝점 주변의 태그 완전성 확인을 위한 확장 범위
      let rangeStart = htmlStart;
      let rangeEnd = htmlEnd;

      // 시작 태그 완전성 확인
      for (let i = tagPositions.length - 1; i >= 0; i--) {
        if (
          tagPositions[i].end <= htmlStart &&
          tagPositions[i].tag.startsWith("<") &&
          !tagPositions[i].tag.startsWith("</")
        ) {
          // 시작 태그 찾기 (닫는 태그가 아닌 경우)
          const tagNameMatch = tagPositions[i].tag.match(/<([a-zA-Z0-9]+)/);
          if (tagNameMatch && tagNameMatch[1]) {
            const tagName = tagNameMatch[1];
            const closingTag = `</${tagName}>`;

            // 대응하는 닫는 태그가 범위 안에 없으면 범위 확장
            const closingPos = html.indexOf(closingTag, rangeEnd);
            if (closingPos !== -1 && closingPos > rangeEnd) {
              rangeEnd = closingPos + closingTag.length;
            }
          }
        }
      }

      // 완성된 HTML 조각 추출
      const resultHtml = html.substring(rangeStart, rangeEnd);

      // 원본 검색어 텍스트 (공백 포함)
      const originalSearchText = textOnly.substring(textStart, textEnd);

      results.push({
        found: true,
        html: resultHtml,
        text: originalSearchText, // 원본 텍스트 (공백 포함)
        startIndex: textStart,
        endIndex: textEnd,
      });
    }

    // 다음 검색 위치 설정
    searchIndex = currentIndex + formattedSearchText.length;
    currentIndex = formattedHtml.indexOf(formattedSearchText, searchIndex);
  }

  // 결과가 없는 경우
  if (results.length === 0) {
    return [{ found: false, html: "", text: rawSearchText }];
  }

  return results;
};

/**
 * React 컴포넌트에서 텍스트를 검색하는 함수 (일치하면 여러 결과 반환, 공백 무시)
 *
 * @param component - 검색할 React 컴포넌트
 * @param searchText - 검색할 텍스트
 * @returns SearchResult 배열
 */
export const searchComponentForText = (component: React.ReactNode, searchText: string): SearchResult[] => {
  try {
    const html = ReactDOMServer.renderToString(component);
    return search(html, searchText);
  } catch (error) {
    console.error("Error searching component for text:", error);
    return [{ found: false, html: "", text: searchText }];
  }
};
