import { createElement, type FC, Fragment } from 'react';
import { describe, expect, it } from 'vitest';
import { contentBlocksOf, DECORATOR_PROP, markControl, toBlocks } from './blocks';

// 마커 부착된 테스트용 컨트롤 (controls/ 와 동일 메커니즘)
const PageBreak: FC<{ changeColumnCountTo?: number }> = markControl(() => null, 'pageBreak');
const ColumnBreak: FC = markControl(() => null, 'columnBreak');
const SectionMark: FC<{ section: string }> = markControl(() => null, 'sectionMark');

describe('toBlocks', () => {
  it('일반 children → content 블록', () => {
    const blocks = toBlocks([
      createElement('div', { key: 'a' }),
      createElement('div', { key: 'b' }),
    ]);
    expect(blocks.map((b) => b.kind)).toEqual(['content', 'content']);
  });

  it('Fragment 평탄화', () => {
    const tree = createElement(
      Fragment,
      null,
      createElement('div', { key: 'a' }),
      createElement('div', { key: 'b' }),
    );
    const blocks = toBlocks(tree);
    expect(blocks).toHaveLength(2);
    expect(blocks.every((b) => b.kind === 'content')).toBe(true);
  });

  it('컨트롤을 타입으로 인식 (DOM querySelector 없이)', () => {
    const blocks = toBlocks([
      createElement('div', { key: '1' }),
      createElement(PageBreak, { key: '2', changeColumnCountTo: 2 }),
      createElement(ColumnBreak, { key: '3' }),
      createElement(SectionMark, { key: '4', section: 'answers' }),
    ]);
    expect(blocks.map((b) => b.kind)).toEqual([
      'content',
      'pageBreak',
      'columnBreak',
      'sectionMark',
    ]);
    expect(blocks[1]).toMatchObject({ kind: 'pageBreak', columnCount: 2 });
    expect(blocks[3]).toMatchObject({ kind: 'sectionMark', section: 'answers' });
  });

  it('decorator 래퍼: 자식을 풀어 className 전파', () => {
    const decorator = createElement(
      'div',
      { [DECORATOR_PROP]: true, className: 'border' },
      createElement('p', { key: 'x' }),
      createElement('p', { key: 'y' }),
    );
    const blocks = contentBlocksOf(toBlocks(decorator));
    expect(blocks).toHaveLength(2);
    expect(blocks.every((b) => b.decoratorClassName === 'border')).toBe(true);
    expect(blocks[0].decoratorTemplate).toBeDefined();
  });

  it('contentBlocksOf: content 블록만 추출', () => {
    const blocks = toBlocks([
      createElement('div', { key: '1' }),
      createElement(PageBreak, { key: '2' }),
      createElement('div', { key: '3' }),
    ]);
    expect(contentBlocksOf(blocks)).toHaveLength(2);
  });
});
