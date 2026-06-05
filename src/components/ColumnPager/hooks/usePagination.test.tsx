import { renderHook, waitFor } from '@testing-library/react';
import { createElement, type ReactNode } from 'react';
import { describe, expect, it } from 'vitest';
import type { Measurer } from '../core/types';
import usePagination from './usePagination';

/** measureItems 호출 횟수를 세는 fake measurer (모든 아이템이 한 페이지에 들어가는 작은 높이) */
const makeFake = () => {
  let calls = 0;
  const measurer: Measurer = {
    columnWidth: async () => 300,
    columnHeight: async () => 1000,
    measureItems: async (blocks) => {
      calls += 1;
      return blocks.map(() => ({ container: { width: 300, height: 50 }, sliceWidth: 300 }));
    },
    measureOverflow: async () => ({ flowWidth: 0, sliceWidth: 1, contentEnd: 0 }),
  };
  return { measurer, calls: () => calls };
};

const kids = (...labels: string[]): ReactNode =>
  labels.map((l, i) => createElement('div', { key: String(i) }, l));

describe('usePagination', () => {
  it('children을 페이지로 배치한다', async () => {
    const { measurer } = makeFake();
    const { result } = renderHook(() =>
      usePagination({ children: kids('a', 'b'), columnCount: 1, measurer }),
    );
    await waitFor(() => expect(result.current.pages.length).toBe(1));
    expect(result.current.pages[0][0]).toHaveLength(2); // 1컬럼에 2개
  });

  it('동일 내용 재렌더는 재계산하지 않는다 (signature dedup)', async () => {
    const { measurer, calls } = makeFake();
    const { result, rerender } = renderHook(
      (props: { children: ReactNode }) =>
        usePagination({ children: props.children, columnCount: 1, measurer }),
      { initialProps: { children: kids('a', 'b') } },
    );
    await waitFor(() => expect(result.current.pages.length).toBe(1));
    expect(calls()).toBe(1);

    rerender({ children: kids('a', 'b') }); // 새 엘리먼트지만 내용 동일
    await Promise.resolve();
    expect(calls()).toBe(1); // 재계산 없음
  });

  it('내용이 바뀌면 길이가 같아도 재계산한다 (V1 버그 수정)', async () => {
    const { measurer, calls } = makeFake();
    const { result, rerender } = renderHook(
      (props: { children: ReactNode }) =>
        usePagination({ children: props.children, columnCount: 1, measurer }),
      { initialProps: { children: kids('a', 'b') } },
    );
    await waitFor(() => expect(result.current.pages.length).toBe(1));
    expect(calls()).toBe(1);

    rerender({ children: kids('a', 'CHANGED') }); // 같은 길이, 다른 내용
    await waitFor(() => expect(calls()).toBe(2));
  });

  it('measurer가 바뀌면 재계산한다 (설정 변경 → 재페이지네이션)', async () => {
    const first = makeFake();
    const second = makeFake();
    const { result, rerender } = renderHook(
      (props: { measurer: Measurer }) =>
        usePagination({ children: kids('a', 'b'), columnCount: 1, measurer: props.measurer }),
      { initialProps: { measurer: first.measurer } },
    );
    await waitFor(() => expect(result.current.pages.length).toBe(1));
    expect(first.calls()).toBe(1);

    rerender({ measurer: second.measurer });
    await waitFor(() => expect(second.calls()).toBe(1)); // 새 measurer로 재측정
  });

  it('signature 동일해도 contentBlocks는 최신 노드를 반영한다 (StableGate 등 prop 변경)', async () => {
    const { measurer } = makeFake();
    const a: ReactNode = createElement('div', { key: '0' }, 'x');
    // 함수 prop만 다름 → signature 동일(함수는 시그니처에서 제외), 노드 식별자만 다름
    const b: ReactNode = createElement('div', { key: '0', onClick: () => {} }, 'x');
    const { result, rerender } = renderHook(
      (props: { children: ReactNode }) =>
        usePagination({ children: props.children, columnCount: 1, measurer }),
      { initialProps: { children: [a] } },
    );
    await waitFor(() => expect(result.current.contentBlocks[0]?.node).toBe(a));
    rerender({ children: [b] });
    expect(result.current.contentBlocks[0]?.node).toBe(b); // 최신 노드 반영
  });

  it('paused면 계산하지 않는다', async () => {
    const { measurer, calls } = makeFake();
    const { result } = renderHook(() =>
      usePagination({ children: kids('a', 'b'), columnCount: 1, measurer, paused: true }),
    );
    await Promise.resolve();
    expect(result.current.pages).toHaveLength(0);
    expect(calls()).toBe(0);
  });
});
