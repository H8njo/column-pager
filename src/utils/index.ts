export const normalizeText =
  (...functions: ((text: string) => string)[]) =>
  (text: string) =>
    functions.reduce((acc, fn) => fn(acc), text);

// 문자열에서 공백 제거
export const trimAllSpaces = (text: string): string => {
  return text.replace(/\s+/g, "");
};

// 문자열에서 < 를 &lt;로 인코딩
export const encodeLt = (text: string): string => {
  return text.replace(/</g, "&lt;");
};
// 문자열에서 > 를 &gt;로 인코딩
export const encodeGt = (text: string): string => {
  return text.replace(/>/g, "&gt;");
};
// 문자열에서 &lt;를 <로 디코딩
export const decodeLt = (text: string): string => {
  return text.replace(/&lt;/g, "<");
};
// 문자열에서 &gt;를 >로 디코딩
export const decodeGt = (text: string): string => {
  return text.replace(/&gt;/g, ">");
};

// 문자열에서 &nbsp;를 공백으로 디코딩
export const decodeSpace = (text: string): string => {
  return text.replace(/&nbsp;/g, " ");
};
