import { createElement, type ReactNode } from 'react';
import { createRoot, type Root } from 'react-dom/client';
import ItemCell from '../components/ItemCell';
import { KEY, keySelector } from '../components/keys';
import Page from '../components/Page';
import { blocksSignature } from '../core/signature';
import type { ContentBlock, ItemMeasure, Measurer, OverflowMeasure, Size } from '../core/types';
import {
  createOffscreenContainer,
  removeContainer,
  renderElements,
  waitForFonts,
  waitForIdle,
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
  // 아이템 측정 캐시: key = `${columnWidth}|${콘텐츠 시그니처}`.
  // 안 바뀐 카드는 재측정하지 않고 캐시 재사용 → 한 카드만 편집하면 그 카드만 측정.
  const itemMeasureCache = new Map<string, ItemMeasure>();
  // toBlocks가 미리 계산한 block.signature를 재사용(트리 재순회 회피). 직접 만든
  // ContentBlock(테스트 등 signature 없는 경우)은 노드에서 즉석 계산으로 폴백.
  const itemKey = (block: ContentBlock, columnWidth: number): string =>
    `${columnWidth}|${block.signature ?? blocksSignature(block.node)}`;

  /** 빈 Page를 렌더해 한 컬럼 박스 크기 측정 (캐시) */
  const measureColumnBox = async (pageIndex: number, columnCount: number): Promise<Size> => {
    const cacheKey = `${pageIndex}-${columnCount}`;
    const cached = columnBoxCache.get(cacheKey);
    if (cached) return cached;

    // 컨테이너 폭으로 오프스크린 측정 → w-full 페이지가 그 폭을 채워 컬럼 폭이 실제와 일치
    const container = createOffscreenContainer({ width: containerWidth });
    await waitForFonts();
    let root: Root | undefined;
    try {
      root = createRoot(container);
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
      // flushSync로 동기 커밋됨 → getBoundingClientRect가 강제 레이아웃을 일으켜 즉시 정확.
      const column = container.querySelector(keySelector(KEY.COLUMN));
      const size = rectSize(column);
      columnBoxCache.set(cacheKey, size);
      return size;
    } finally {
      // 측정 중 throw가 나도 root를 정리해 React 루트/파이버 누수를 막는다.
      try {
        root?.unmount();
      } catch {}
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
    let root: Root | undefined;
    try {
      root = createRoot(container);
      renderElements(root, [template], 'decorator');
      const height = (container.firstElementChild?.getBoundingClientRect().height ?? 0) as number;
      decoratorHeightCache.set(template, height);
      return height;
    } finally {
      try {
        root?.unmount();
      } catch {}
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
      const keys = blocks.map((b) => itemKey(b, columnWidth));
      // 캐시에 없는(=바뀐/새) 블록만 측정 대상
      const todo = blocks
        .map((block, index) => ({ block, key: keys[index] }))
        .filter((x) => !itemMeasureCache.has(x.key));

      if (todo.length > 0) {
        const groups = chunk(todo, chunkSize);
        const container = createOffscreenContainer({ width: columnWidth });
        await waitForFonts();

        try {
          for (let g = 0; g < groups.length; g++) {
            // 대량(여러 청크)일 때만 메인 스레드에 양보 — 단일 청크(편집 1건)는 즉시 측정
            if (groups.length > 1) await waitForIdle();
            const group = groups[g];
            const wrapper = document.createElement('div');
            wrapper.style.cssText = 'display: contents;';
            container.appendChild(wrapper);
            let root: Root | undefined;

            try {
              root = createRoot(wrapper);
              renderElements(
                root,
                group.map(({ block }) =>
                  createElement(
                    ItemCell,
                    { decoratorClassName: block.decoratorClassName },
                    block.node,
                  ),
                ),
                `measure-${g}`,
              );
              // flushSync 동기 커밋 → getBoundingClientRect 강제 레이아웃으로 즉시 측정.
              const cells = Array.from(wrapper.children);
              group.forEach(({ key }, idx) => {
                const cell = cells[idx];
                itemMeasureCache.set(key, {
                  container: rectSize(cell),
                  sliceWidth: rectSize(cell?.querySelector(keySelector(KEY.CELL_INNER)) ?? null)
                    .width,
                });
              });
            } finally {
              try {
                root?.unmount();
              } catch {}
              container.removeChild(wrapper);
            }
          }
        } finally {
          removeContainer(container);
        }

        // decorator chrome 높이 (새로 측정한 블록만)
        for (const { block, key } of todo) {
          if (block.decoratorTemplate) {
            const measure = itemMeasureCache.get(key);
            if (measure) {
              measure.decoratorHeight = await measureDecoratorHeight(
                block.decoratorTemplate,
                columnWidth,
              );
            }
          }
        }
      }

      // 메모리 bound: 현재 키 집합에 없는 캐시 항목 제거 (편집 시 옛 콘텐츠 키 정리)
      const live = new Set(keys);
      for (const cached of itemMeasureCache.keys()) {
        if (!live.has(cached)) itemMeasureCache.delete(cached);
      }

      return keys.map(
        (key) => itemMeasureCache.get(key) ?? { container: { width: 0, height: 0 }, sliceWidth: 0 },
      );
    },

    async measureOverflow(block, columnWidth, columnHeight, carryOffset) {
      const container = createOffscreenContainer({
        width: columnWidth,
        height: columnHeight,
        overflow: 'hidden',
        position: 'fixed',
      });
      await waitForFonts();

      let root: Root | undefined;
      try {
        const wrapper = document.createElement('div');
        wrapper.style.cssText = 'display: contents;';
        container.appendChild(wrapper);
        root = createRoot(wrapper);

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
        // flushSync 동기 커밋 → 즉시 측정.
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

        const result: OverflowMeasure = { flowWidth, sliceWidth, contentEnd };
        return result;
      } finally {
        try {
          root?.unmount();
        } catch {}
        removeContainer(container);
      }
    },
  };
};
