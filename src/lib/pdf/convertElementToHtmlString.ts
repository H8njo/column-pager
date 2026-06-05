/** convertElementToHtmlString 옵션 */
export type HtmlDocumentOptions = {
  /** 폰트 @import URL 목록 (기본: Pretendard + Nanum Myeongjo) */
  fontImports?: string[];
  /** body 기본 font-family (기본: 'Pretendard', sans-serif) */
  fontFamily?: string;
  /** @page size (기본: 'A4') */
  pageSize?: string;
  /** 위 기본 스타일을 통째로 대체 (지정 시 fontImports/fontFamily/pageSize 무시) */
  baseStyles?: string;
};

const DEFAULT_FONT_IMPORTS = [
  'https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/static/pretendard-dynamic-subset.min.css',
  'https://fonts.googleapis.com/css2?family=Nanum+Myeongjo:wght@400;700;800&display=swap',
];

const buildBaseStyles = (options: HtmlDocumentOptions): string => {
  if (options.baseStyles !== undefined) return options.baseStyles;

  const fontImports = options.fontImports ?? DEFAULT_FONT_IMPORTS;
  const fontFamily = options.fontFamily ?? "'Pretendard', sans-serif";
  const pageSize = options.pageSize ?? 'A4';

  const imports = fontImports.map((url) => `@import url('${url}');`).join('\n        ');

  return `
        ${imports}

        @page {
          size: ${pageSize};
          margin: 0;
        }
        body {
          margin: 0;
          padding: 0;
          font-family: ${fontFamily};
        }
        * {
          box-sizing: border-box;
          -webkit-print-color-adjust: exact !important;
          print-color-adjust: exact !important;
        }
      `;
};

/**
 * 요소의 outerHTML + 현재 문서 스타일시트를 결합해 PDF 변환용 완전한 HTML 문서를 만든다.
 *
 * @param htmlString  container.outerHTML
 * @param options     폰트/페이지/기본 스타일 커스터마이즈 (생략 시 기본값 = 기존 동작)
 */
export const convertElementToHtmlString = (
  htmlString: string,
  options: HtmlDocumentOptions = {},
): string => {
  const styleSheets = Array.from(document.styleSheets)
    .map((styleSheet) => {
      try {
        return Array.from(styleSheet.cssRules)
          .map((rule) => rule.cssText)
          .join('\n');
      } catch {
        return '';
      }
    })
    .join('');

  const baseStyles = buildBaseStyles(options);

  return `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>PDF Document</title>
          <style>
            ${styleSheets}
          </style>
          <style>
            ${baseStyles}
          </style>
        </head>
        <body>
          ${htmlString}
        </body>
      </html>
    `;
};
