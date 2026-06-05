import React, { type ReactElement, type ReactNode } from 'react';
import { flushSync } from 'react-dom';
import { createRoot, type Root } from 'react-dom/client';
import {
  createDataKeySelector,
  createSelector,
  DATA_CHANGE_COLUMN_COUNT_TO,
  DATA_COLUMN_BREAKER,
  DATA_DECORATOR_HEIGHT,
  DATA_KEY,
  DATA_PAGE_BREAKER,
  DATA_PAGE_INFORMATION,
} from '../controls/constants';
import type { MeasureElementInput, MeasureSizeInput, MeasureSizeResult, Position } from '../types';
import { chunk } from './collection';

/** idle 콜백 기본 타임아웃 (ms) */
const IDLE_CALLBACK_TIMEOUT = 1000;

// ============================================================================
// 스케줄링 유틸리티
// ============================================================================

/** 브라우저 유휴 시간까지 대기 (메인 스레드 블로킹 방지) */
const waitForIdle = (timeout = IDLE_CALLBACK_TIMEOUT): Promise<void> => {
  return new Promise((resolve) => requestIdleCallback(() => resolve(), { timeout }));
};

/**
 * 다음 프레임까지 대기 (레이아웃 계산 완료 보장)
 * - 첫 번째 rAF: React 렌더링 완료
 * - 두 번째 rAF: 브라우저 레이아웃 계산 완료
 */
const waitForNextFrame = (): Promise<void> => {
  return new Promise((resolve) => {
    requestAnimationFrame(() => {
      requestAnimationFrame(() => resolve());
    });
  });
};

/** 폰트 로딩 완료 대기 */
const waitForFonts = async (): Promise<void> => {
  if (document.fonts) {
    await document.fonts.ready;
  }
};

// ============================================================================
// DOM 유틸리티
// ============================================================================

type OffscreenContainerOptions = {
  width?: number;
  height?: number;
  overflow?: 'hidden' | 'auto' | 'visible';
  position?: 'absolute' | 'fixed';
};

/** 오프스크린 컨테이너 생성 (화면 밖에서 측정) */
const createOffscreenContainer = (options: OffscreenContainerOptions = {}): HTMLElement => {
  const { width, height, overflow, position = 'absolute' } = options;

  const container = document.createElement('div');
  container.style.cssText = `
    position: ${position};
    left: -9999px;
    top: -9999px;
    z-index: -9999;
    visibility: hidden;
    pointer-events: none;
    ${width ? `width: ${width}px;` : ''}
    ${height ? `height: ${height}px;` : ''}
    ${overflow ? `overflow: ${overflow};` : ''}
  `;

  document.body.appendChild(container);
  return container;
};

/** 컨테이너 정리 */
const removeContainer = (container: HTMLElement): void => {
  if (container.isConnected) {
    document.body.removeChild(container);
  }
};

// ============================================================================
// 측정 로직
// ============================================================================

/**
 * 배치 측정 - Layout Thrashing 방지
 * DOM read 작업을 모두 모아서 한 번에 처리 (read → read → read 패턴)
 */
const batchMeasure = (children: Element[], measureTargetKeys?: string[]): MeasureSizeResult[] => {
  // 1단계: DOM read - 모든 요소 및 타겟 찾기
  const measurements = children.map((child) => {
    const targets = measureTargetKeys?.map((key) => ({
      key,
      element: child.querySelector(createDataKeySelector(key)),
    }));
    return { child, targets };
  });

  // 2단계: DOM read - 한 번에 모든 크기 측정
  return measurements.map(({ child, targets }) => {
    // 타겟별 크기 측정
    const sizeByKeys = targets?.reduce(
      (acc, { key, element }) => {
        const rect = element?.getBoundingClientRect();
        acc[key] = rect ? { width: rect.width, height: rect.height } : { width: 0, height: 0 };
        return acc;
      },
      {} as Record<string, { width: number; height: number }>,
    );

    // 컨테이너 크기
    const containerRect = child.getBoundingClientRect();

    // data 속성들 읽기
    const isPageBreaker = child.querySelector(createSelector(DATA_PAGE_BREAKER)) !== null;
    const isColumnBreaker = child.querySelector(createSelector(DATA_COLUMN_BREAKER)) !== null;
    const changeColumnCountToAttr = child
      .querySelector(createSelector(DATA_CHANGE_COLUMN_COUNT_TO))
      ?.getAttribute(DATA_CHANGE_COLUMN_COUNT_TO);
    const decoratorHeightAttr = child.getAttribute(DATA_DECORATOR_HEIGHT);
    const pageInformation = child.getAttribute(DATA_PAGE_INFORMATION) || undefined;

    return {
      container: { width: containerRect.width, height: containerRect.height },
      isPageBreaker,
      isColumnBreaker,
      changeColumnCountTo: changeColumnCountToAttr ? Number(changeColumnCountToAttr) : undefined,
      pageInformation,
      decoratorHeight: decoratorHeightAttr ? Number(decoratorHeightAttr) : 0,
      ...sizeByKeys,
    };
  });
};

/** threshold 요소의 상대 위치 측정 */
const measureThresholdPosition = (container: HTMLElement): Position | undefined => {
  const benchmark = container.querySelector(createDataKeySelector(DATA_KEY.PAGE_COLUMN_ITEM_INNER));
  const threshold = container.querySelector(
    createDataKeySelector(DATA_KEY.PAGE_COLUMN_ITEM_INNER_THRESHOLD),
  );

  if (!threshold || !benchmark) return undefined;

  const thresholdRect = threshold.getBoundingClientRect();
  const benchmarkRect = benchmark.getBoundingClientRect();

  return {
    top: thresholdRect.top - benchmarkRect.top,
    left: thresholdRect.left - benchmarkRect.left,
    bottom: thresholdRect.bottom - benchmarkRect.top,
    right: thresholdRect.right - benchmarkRect.left,
    width: thresholdRect.width,
    height: thresholdRect.height,
  };
};

// ============================================================================
// 렌더링 & 측정
// ============================================================================

/** React 요소들을 DOM에 렌더링 */
const renderElements = (root: Root, elements: ReactNode[], keyPrefix: string): void => {
  flushSync(() => {
    const elementsWithKeys = elements.map((element, index) =>
      React.isValidElement(element)
        ? // biome-ignore lint/suspicious/noArrayIndexKey: 측정용 일회성 렌더링 - 키 안정성 불필요
          React.cloneElement(element, { key: `${keyPrefix}-${index}` })
        : element,
    );
    root.render(React.createElement(React.Fragment, null, elementsWithKeys));
  });
};

/** 청크 단위로 렌더링 및 측정 */
const renderAndMeasureChunk = async (
  elements: ReactNode[],
  container: HTMLElement,
  measureTargetKeys?: string[],
  chunkStartIndex = 0,
): Promise<MeasureSizeResult[]> => {
  // 청크 래퍼 생성 (독립적 관리를 위해)
  const chunkWrapper = document.createElement('div');
  chunkWrapper.style.cssText = 'display: contents;';
  container.appendChild(chunkWrapper);

  const root = createRoot(chunkWrapper);

  try {
    // 렌더링
    renderElements(root, elements, `measure-${chunkStartIndex}`);

    // 레이아웃 계산 대기
    await waitForNextFrame();

    // 측정
    return batchMeasure(Array.from(chunkWrapper.children), measureTargetKeys);
  } finally {
    // 정리
    root.unmount();
    container.removeChild(chunkWrapper);
  }
};

// ============================================================================
// Public API
// ============================================================================

/**
 * 여러 요소의 크기를 청크 단위로 측정
 *
 * 최적화:
 * - 청크 단위로 나누어 메인 스레드 블로킹 최소화
 * - waitForIdle로 유휴 시간 활용
 * - waitForNextFrame으로 프레임 양보
 */
export const measureSize = async ({
  elements,
  config,
}: MeasureSizeInput): Promise<MeasureSizeResult[]> => {
  const { measureTargetKeys, containerWidth, chunkSize = 20 } = config ?? {};

  const elementChunks = chunk(elements, chunkSize);
  const allResults: MeasureSizeResult[] = [];

  const container = createOffscreenContainer({ width: containerWidth });

  await waitForFonts();

  try {
    for (let i = 0; i < elementChunks.length; i++) {
      await waitForIdle();

      const chunkStartIndex = i * chunkSize;
      const results = await renderAndMeasureChunk(
        elementChunks[i],
        container,
        measureTargetKeys,
        chunkStartIndex,
      );
      allResults.push(...results);

      // 다음 청크 전 프레임 양보
      if (i < elementChunks.length - 1) {
        await waitForNextFrame();
      }
    }
  } finally {
    removeContainer(container);
  }

  return allResults;
};

/**
 * 단일 요소의 크기를 특정 컨테이너 크기에서 측정
 * - 오버플로우 크롭 계산에 사용
 * - threshold 위치도 함께 측정
 */
export const measureElementSize = async ({
  element,
  containerWidth,
  containerHeight,
  offsetHeight,
  measureTargetKeys,
}: MeasureElementInput): Promise<MeasureSizeResult> => {
  const container = createOffscreenContainer({
    width: containerWidth,
    height: containerHeight,
    overflow: 'hidden',
    position: 'fixed',
  });

  await waitForFonts();

  try {
    const wrapper = document.createElement('div');
    wrapper.style.cssText = 'display: contents;';
    container.appendChild(wrapper);

    const root = createRoot(wrapper);

    // offsetHeight 요소 생성
    const offsetHeightElement = offsetHeight
      ? React.createElement('div', { key: 'offset-height', style: { height: offsetHeight } })
      : null;

    // element의 children 앞에 offsetHeight 추가
    const elementProps = element.props as { style?: React.CSSProperties; children?: ReactElement };
    const innerChild = elementProps.children;

    const innerChildProps =
      innerChild && React.isValidElement(innerChild)
        ? (innerChild.props as { children?: ReactNode; style?: React.CSSProperties })
        : null;

    const modifiedChild =
      innerChild && React.isValidElement(innerChild) && innerChildProps
        ? React.cloneElement(innerChild, {
            children: [
              offsetHeightElement,
              ...React.Children.toArray(innerChildProps.children),
            ].filter(Boolean),
            style: {
              ...innerChildProps.style,
              height: '100%',
            },
          } as React.Attributes)
        : innerChild;

    const clonedElement = React.cloneElement(element, {
      style: { ...elementProps.style, height: '100%' },
      children: modifiedChild,
    } as React.Attributes);

    // 렌더링
    renderElements(root, [clonedElement], 'element');

    await waitForNextFrame();

    // 측정
    const childElement = wrapper.firstChild as Element;
    if (!childElement) {
      throw new Error('No element rendered');
    }

    const result = batchMeasure([childElement], measureTargetKeys)[0];
    result.thresholdPosition = measureThresholdPosition(container);

    // 정리
    root.unmount();
    container.removeChild(wrapper);

    return result;
  } finally {
    removeContainer(container);
  }
};
