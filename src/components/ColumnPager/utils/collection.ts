/**
 * 컬렉션 유틸리티
 *
 * lodash-es 의존성을 제거하기 위한 최소 구현.
 * ColumnPager 내부에서 사용하는 chunk / groupBy / isEmpty 만 제공한다.
 */

/**
 * 배열을 `size` 길이의 청크로 분할한다. (lodash `chunk` 대체)
 *
 * @example
 * chunk([1, 2, 3, 4, 5], 2) // => [[1, 2], [3, 4], [5]]
 */
export const chunk = <T>(array: readonly T[], size: number): T[][] => {
  if (size < 1) return [];
  const result: T[][] = [];
  for (let i = 0; i < array.length; i += size) {
    result.push(array.slice(i, i + size));
  }
  return result;
};

/**
 * 배열을 각 항목의 특정 속성 값으로 그룹화한다. (lodash `groupBy(array, key)` 대체)
 * 키는 문자열로 변환되어 객체의 키가 된다.
 *
 * @example
 * groupBy([{ c: 0 }, { c: 1 }, { c: 0 }], 'c') // => { '0': [{c:0},{c:0}], '1': [{c:1}] }
 */
export const groupBy = <T, K extends keyof T>(array: readonly T[], key: K): Record<string, T[]> => {
  const result: Record<string, T[]> = {};
  for (const item of array) {
    const groupKey = String(item[key]);
    if (result[groupKey] === undefined) {
      result[groupKey] = [];
    }
    result[groupKey].push(item);
  }
  return result;
};

/**
 * 값이 비어있는지 확인한다. (lodash `isEmpty` 대체)
 * nullish / 빈 배열·문자열 / 빈 Map·Set / 키 없는 객체는 모두 비어있는 것으로 간주한다.
 */
export const isEmpty = (value: unknown): boolean => {
  if (value == null) return true;
  if (Array.isArray(value) || typeof value === 'string') return value.length === 0;
  if (value instanceof Map || value instanceof Set) return value.size === 0;
  if (typeof value === 'object') return Object.keys(value).length === 0;
  return true;
};
