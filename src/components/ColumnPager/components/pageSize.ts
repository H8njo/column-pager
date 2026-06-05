/**
 * 페이지 크기 프리셋 + 해석 (96dpi 기준 px).
 */
export const PAGE_PRESETS = {
  A4: { width: 794, height: 1123 },
  letter: { width: 816, height: 1056 },
  legal: { width: 816, height: 1344 },
} as const;

export type PageSizeName = keyof typeof PAGE_PRESETS;
export type Orientation = 'portrait' | 'landscape';

export type PageDimensions = { width: number; height: number };

/**
 * 페이지 크기 해석. 명시적 width/height가 있으면 우선, 없으면 프리셋.
 * landscape면 가로>세로가 되도록 정렬한다.
 */
export const resolvePageSize = (
  size: PageSizeName = 'A4',
  orientation: Orientation = 'portrait',
  width?: number,
  height?: number,
): PageDimensions => {
  const preset = PAGE_PRESETS[size] ?? PAGE_PRESETS.A4;
  let w = width ?? preset.width;
  let h = height ?? preset.height;
  if (orientation === 'landscape' && h > w) {
    [w, h] = [h, w];
  }
  return { width: w, height: h };
};
