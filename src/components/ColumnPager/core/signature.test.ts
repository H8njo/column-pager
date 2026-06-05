import { createElement, Fragment } from 'react';
import { describe, expect, it } from 'vitest';
import { blocksSignature } from './signature';

describe('blocksSignature', () => {
  it('길이가 같아도 내용이 다르면 다른 시그니처 (V1 버그 수정)', () => {
    const a = [
      createElement('div', { key: '1' }, 'apple'),
      createElement('div', { key: '2' }, 'banana'),
    ];
    const b = [
      createElement('div', { key: '1' }, 'apple'),
      createElement('div', { key: '2' }, 'cherry'),
    ];
    expect(blocksSignature(a)).not.toBe(blocksSignature(b));
  });

  it('동일 내용은 동일 시그니처 (불필요 재계산 방지)', () => {
    const make = () => [
      createElement('div', { key: '1' }, 'x'),
      createElement('div', { key: '2' }, 'y'),
    ];
    expect(blocksSignature(make())).toBe(blocksSignature(make()));
  });

  it('key/type 변화 감지', () => {
    const a = [createElement('div', { key: '1' }, 'x')];
    const b = [createElement('span', { key: '1' }, 'x')];
    expect(blocksSignature(a)).not.toBe(blocksSignature(b));
  });

  it('중첩(Fragment) 구조까지 반영', () => {
    const a = createElement(Fragment, null, createElement('div', null, 'a'));
    const b = createElement(Fragment, null, createElement('div', null, 'b'));
    expect(blocksSignature(a)).not.toBe(blocksSignature(b));
  });
});
