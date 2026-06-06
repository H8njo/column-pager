import { createElement } from 'react';
import { describe, expect, it, vi } from 'vitest';
import type { ContentBlock } from '../core/types';
import { createDomMeasurer } from './measureDom';
import * as offscreen from './offscreen';

/**
 * 회귀 방지: 카드 "순서만" 바꾸면 배치는 다시 계산하더라도 사이즈 측정(DOM)은
 * 다시 하면 안 된다. per-item 측정 캐시 키가 위치가 아니라 각 노드의 콘텐츠
 * 시그니처라 reorder 시 전부 캐시 히트여야 한다.
 *
 * 측정 캐시 미스(=실제 DOM 측정)일 때만 createOffscreenContainer가 호출되므로,
 * 그 호출 횟수로 "DOM 측정이 일어났는지"를 관측한다.
 */
const block = (text: string): ContentBlock => ({
  kind: 'content',
  node: createElement('div', null, text),
});

describe('createDomMeasurer measureItems 캐시', () => {
  it('순서만 바꾸면 재측정하지 않는다 (DOM 측정 0건, 캐시 히트)', async () => {
    const measurer = createDomMeasurer({ containerWidth: 300 });
    const spy = vi.spyOn(offscreen, 'createOffscreenContainer');

    const a = block('a');
    const b = block('b');
    const c = block('c');

    await measurer.measureItems([a, b, c], 300);
    expect(spy).toHaveBeenCalled(); // 최초엔 측정함
    spy.mockClear();

    // 순서만 뒤집어 다시 측정 요청
    await measurer.measureItems([c, b, a], 300);
    expect(spy).not.toHaveBeenCalled(); // 캐시 히트 → 오프스크린 측정 안 함

    spy.mockRestore();
  });

  it('내용이 바뀐 항목만 재측정한다 (나머지는 캐시 히트)', async () => {
    const measurer = createDomMeasurer({ containerWidth: 300 });

    await measurer.measureItems([block('a'), block('b'), block('c')], 300);

    const spy = vi.spyOn(offscreen, 'createOffscreenContainer');
    // a,b는 동일 / c→CHANGED 만 신규 → 측정은 일어나되 신규 항목만 대상
    await measurer.measureItems([block('a'), block('b'), block('CHANGED')], 300);
    expect(spy).toHaveBeenCalledTimes(1); // 신규 청크 1회만

    spy.mockClear();
    // 다시 동일 입력 → 전부 캐시 히트
    await measurer.measureItems([block('a'), block('b'), block('CHANGED')], 300);
    expect(spy).not.toHaveBeenCalled();

    spy.mockRestore();
  });

  it('컬럼 폭이 바뀌면 재측정한다 (키에 columnWidth 포함)', async () => {
    const measurer = createDomMeasurer({ containerWidth: 300 });
    await measurer.measureItems([block('a')], 300);

    const spy = vi.spyOn(offscreen, 'createOffscreenContainer');
    await measurer.measureItems([block('a')], 250); // 폭 변경 → 캐시 미스
    expect(spy).toHaveBeenCalled();

    spy.mockRestore();
  });
});
