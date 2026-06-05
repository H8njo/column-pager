import React, { type ReactNode } from 'react';
import { flushSync } from 'react-dom';
import type { Root } from 'react-dom/client';

/** idle 콜백 기본 타임아웃 (ms) */
const IDLE_TIMEOUT = 1000;

// ============================================================================
// 스케줄링 (메인 스레드 블로킹 최소화 — V1 이식)
// ============================================================================

/** 브라우저 유휴 시간까지 대기 */
export const waitForIdle = (timeout = IDLE_TIMEOUT): Promise<void> =>
  new Promise((resolve) => {
    if (typeof requestIdleCallback === 'function') {
      requestIdleCallback(() => resolve(), { timeout });
    } else {
      setTimeout(resolve, 0);
    }
  });

/** 다음 프레임까지 대기 (1: React 렌더 완료, 2: 브라우저 레이아웃 완료) */
export const waitForNextFrame = (): Promise<void> =>
  new Promise((resolve) => {
    requestAnimationFrame(() => requestAnimationFrame(() => resolve()));
  });

/** 폰트 로딩 완료 대기 */
export const waitForFonts = async (): Promise<void> => {
  if (typeof document !== 'undefined' && document.fonts) {
    await document.fonts.ready;
  }
};

// ============================================================================
// 오프스크린 컨테이너
// ============================================================================

export type OffscreenOptions = {
  width?: number;
  height?: number;
  overflow?: 'hidden' | 'auto' | 'visible';
  position?: 'absolute' | 'fixed';
};

/** 화면 밖 측정용 컨테이너 생성 */
export const createOffscreenContainer = (options: OffscreenOptions = {}): HTMLElement => {
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

/** 컨테이너 제거 */
export const removeContainer = (container: HTMLElement): void => {
  if (container.isConnected) document.body.removeChild(container);
};

/** React 요소들을 root에 동기 렌더 */
export const renderElements = (root: Root, elements: ReactNode[], keyPrefix: string): void => {
  flushSync(() => {
    const withKeys = elements.map((element, index) =>
      React.isValidElement(element)
        ? // biome-ignore lint/suspicious/noArrayIndexKey: 측정용 일회성 렌더링
          React.cloneElement(element, { key: `${keyPrefix}-${index}` })
        : element,
    );
    root.render(React.createElement(React.Fragment, null, withKeys));
  });
};
