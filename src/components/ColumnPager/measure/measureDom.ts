import { createElement, type ReactNode } from 'react';
import { createRoot } from 'react-dom/client';
import ItemCell from '../components/ItemCell';
import { KEY, keySelector } from '../components/keys';
import Page from '../components/Page';
import type { ContentBlock, ItemMeasure, Measurer, OverflowMeasure, Size } from '../core/types';
import {
  createOffscreenContainer,
  removeContainer,
  renderElements,
  waitForFonts,
  waitForIdle,
  waitForNextFrame,
} from './offscreen';

/** 측정기 설정 (React 계층에서 주입) */
export type MeasurerConfig = {
  renderHeader?: (pageIndex: number) => ReactNode;
  renderFooter?: (pageIndex: number) => ReactNode;
  showDividers?: boolean;
  columnClassName?: string;
  chunkSize?: number;
  /** 컨테이너 폭(px) — 이 폭으로 오프스크린에서 컬럼을 측정(반응형) */
  containerWidth?: number;
  /** 페이지 높이(px) */
  pageHeight?: number;
};

const chunk = <T>(arr: readonly T[], size: number): T[][] => {
  if (size < 1) return [arr.slice()];
  const out: T[][] = [];
  for (let i = 0; i < arr.length; i += size) out.push(arr.slice(i, i + size));
  return out;
};

const rectSize = (el: Element | null): Size => {
  if (!el) return { width: 0, height: 0 };
  const r = el.getBoundingClientRect();
  return { width: r.width, height: r.height };
};

/** DOM 측정 어댑터 생성 */
export const createDomMeasurer = (config: MeasurerConfig = {}): Measurer => {
  const {
    renderHeader,
    renderFooter,
    showDividers,
    columnClassName,
    chunkSize = 30,
    containerWidth,
    pageHeight,
  } = config;

  const columnBoxCache = new Map<string, Size>();
  const decoratorHeightCache = new Map<object, number>();

  /** 빈 Page를 렌더해 한 컬럼 박스 크기 측정 (캐시) */
  const measureColumnBox = async (pageIndex: number, columnCount: number): Promise<Size> => {
    const cacheKey = `${pageIndex}-${columnCount}`;
    const cached = columnBoxCache.get(cacheKey);
    if (cached) return cached;

    // 컨테이너 폭으로 오프스크린 측정 → w-full 페이지가 그 폭을 채워 컬럼 폭이 실제와 일치
    const container = createOffscreenContainer({ width: containerWidth });
    await waitForFonts();
    try {
      const root = createRoot(container);
      renderElements(
        root,
        [
          createElement(Page, {
            columns: [],
            columnCount,
            header: renderHeader?.(pageIndex),
            footer: renderFooter?.(pageIndex),
            showDividers,
            columnClassName,
            pageHeight,
          }),
        ],
        'layout',
      );
      await waitForNextFrame();
      const column = container.querySelector(keySelector(KEY.COLUMN));
      const size = rectSize(column);
      root.unmount();
      columnBoxCache.set(cacheKey, size);
      return size;
    } finally {
      removeContainer(container);
    }
  };

  const measureDecoratorHeight = async (
    template: NonNullable<ContentBlock['decoratorTemplate']>,
    columnWidth: number,
  ): Promise<number> => {
    const cached = decoratorHeightCache.get(template);
    if (cached !== undefined) return cached;

    const container = createOffscreenContainer({ width: columnWidth });
    await waitForFonts();
    try {
      const root = createRoot(container);
      renderElements(root, [template], 'decorator');
      await waitForNextFrame();
      const height = (container.firstElementChild?.getBoundingClientRect().height ?? 0) as number;
      root.unmount();
      decoratorHeightCache.set(template, height);
      return height;
    } finally {
      removeContainer(container);
    }
  };

  return {
    async columnWidth(columnCount) {
      return (await measureColumnBox(0, columnCount)).width;
    },

    async columnHeight(pageIndex, columnCount) {
      return (await measureColumnBox(pageIndex, columnCount)).height;
    },

    async measureItems(blocks, columnWidth) {
      const results: ItemMeasure[] = [];
      const groups = chunk(blocks, chunkSize);
      const container = createOffscreenContainer({ width: columnWidth });
      await waitForFonts();

      try {
        for (let g = 0; g < groups.length; g++) {
          await waitForIdle();
          const group = groups[g];
          const wrapper = document.createElement('div');
          wrapper.style.cssText = 'display: contents;';
          container.appendChild(wrapper);
          const root = createRoot(wrapper);

          renderElements(
            root,
            group.map((b) =>
              createElement(ItemCell, { decoratorClassName: b.decoratorClassName }, b.node),
            ),
            `measure-${g}`,
          );
          await waitForNextFrame();

          const cells = Array.from(wrapper.children);
          cells.forEach((cell) => {
            results.push({
              container: rectSize(cell),
              sliceWidth: rectSize(cell.querySelector(keySelector(KEY.CELL_INNER))).width,
            });
          });

          root.unmount();
          container.removeChild(wrapper);
          if (g < groups.length - 1) await waitForNextFrame();
        }
      } finally {
        removeContainer(container);
      }

      // decorator chrome 높이 (해당 블록만)
      for (let i = 0; i < blocks.length; i++) {
        const template = blocks[i].decoratorTemplate;
        if (template) {
          results[i].decoratorHeight = await measureDecoratorHeight(template, columnWidth);
        }
      }

      return results;
    },

    async measureOverflow(block, columnWidth, columnHeight, carryOffset) {
      const container = createOffscreenContainer({
        width: columnWidth,
        height: columnHeight,
        overflow: 'hidden',
        position: 'fixed',
      });
      await waitForFonts();

      try {
        const wrapper = document.createElement('div');
        wrapper.style.cssText = 'display: contents;';
        container.appendChild(wrapper);
        const root = createRoot(wrapper);

        // V1 measureElementSize 구조 재현: CELL/INNER height 100%, 앞에 carry 스페이서
        const tree = createElement(
          'div',
          { 'data-cp': KEY.CELL, className: 'flex overflow-hidden', style: { height: '100%' } },
          createElement(
            'div',
            {
              'data-cp': KEY.CELL_INNER,
              className: 'w-full',
              style: { columnCount: 1, columnGap: 0, height: '100%' },
            },
            carryOffset
              ? createElement('div', { key: 'carry', style: { height: carryOffset } })
              : null,
            createElement('div', { key: 'content', 'data-cp': KEY.CELL_CONTENT }, block.node),
            createElement('div', { key: 'threshold', 'data-cp': KEY.CELL_THRESHOLD }),
          ),
        );

        renderElements(root, [tree], 'overflow');
        await waitForNextFrame();

        const innerEl = container.querySelector(keySelector(KEY.CELL_INNER));
        const contentEl = container.querySelector(keySelector(KEY.CELL_CONTENT));
        const thresholdEl = container.querySelector(keySelector(KEY.CELL_THRESHOLD));

        const flowWidth = rectSize(contentEl).width;
        const sliceWidth = rectSize(innerEl).width;
        let contentEnd = 0;
        if (innerEl && thresholdEl) {
          contentEnd =
            thresholdEl.getBoundingClientRect().top - innerEl.getBoundingClientRect().top;
        }

        root.unmount();
        container.removeChild(wrapper);

        const result: OverflowMeasure = { flowWidth, sliceWidth, contentEnd };
        return result;
      } finally {
        removeContainer(container);
      }
    },
  };
};
