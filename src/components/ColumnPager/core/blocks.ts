import {
  Children,
  cloneElement,
  Fragment,
  isValidElement,
  type ReactElement,
  type ReactNode,
} from 'react';
import type { Block, ContentBlock } from './types';

/**
 * 컨트롤 컴포넌트 식별용 정적 마커 키.
 * 컨트롤(PageBreak 등)은 함수에 이 프로퍼티를 달고, toBlocks는 이를 읽어
 * DOM querySelector 없이 타입 레벨로 컨트롤을 인식한다. (core ↔ controls 순환 없음)
 */
export const CP_CONTROL = '__cpControl' as const;

export type ControlKind = 'pageBreak' | 'columnBreak' | 'sectionMark';

/** 컨트롤 컴포넌트에 마커를 부착 (controls/ 에서 사용) */
export const markControl = <T extends object>(component: T, kind: ControlKind): T => {
  (component as Record<string, unknown>)[CP_CONTROL] = kind;
  return component;
};

/** decorator(테두리 그룹) 마커 prop */
export const DECORATOR_PROP = 'data-cp-decorator';

type WithControl = { [CP_CONTROL]?: ControlKind };

const controlKindOf = (type: unknown): ControlKind | undefined => {
  if (typeof type === 'function' || (typeof type === 'object' && type !== null)) {
    return (type as WithControl)[CP_CONTROL];
  }
  return undefined;
};

const content = (node: ReactNode, extra: Partial<ContentBlock> = {}): ContentBlock => ({
  kind: 'content',
  node,
  ...extra,
});

/**
 * React children을 정규화된 Block 스트림으로 변환한다 (순수).
 *
 * - 최상위/중첩 Fragment 평탄화
 * - 컨트롤(PageBreak/ColumnBreak/SectionMark) → 해당 Block
 * - decorator 래퍼 → 자식을 풀어 content 블록으로(클래스/chrome 높이 전파)
 * - 그 외 → content 블록
 */
export const toBlocks = (children: ReactNode): Block[] => {
  const blocks: Block[] = [];

  const pushDecorator = (element: ReactElement) => {
    const props = element.props as { className?: string; children?: ReactNode };
    const decoratorClassName = props.className;
    // 빈 decorator 템플릿 — chrome(패딩+보더) 높이 측정용
    const decoratorTemplate = cloneElement(element, {} as never, null);

    Children.toArray(props.children).forEach((dc) => {
      if (isValidElement(dc) && dc.type === Fragment) {
        // 2뎁스: decorator 안 Fragment의 자식들 — 클래스만 전파(개별 chrome 높이 없음)
        const fragProps = dc.props as { children?: ReactNode };
        Children.toArray(fragProps.children).forEach((c) => {
          blocks.push(content(c, { decoratorClassName }));
        });
      } else {
        blocks.push(content(dc, { decoratorClassName, decoratorTemplate }));
      }
    });
  };

  const walk = (node: ReactNode): void => {
    Children.forEach(node, (child) => {
      if (!isValidElement(child)) {
        // 텍스트/숫자 노드 등 — 유효한 콘텐츠면 블록으로
        if (child !== null && child !== undefined && child !== false && child !== '') {
          blocks.push(content(child));
        }
        return;
      }

      const kind = controlKindOf(child.type);
      if (kind === 'pageBreak') {
        const props = child.props as { changeColumnCountTo?: number };
        blocks.push({ kind: 'pageBreak', columnCount: props.changeColumnCountTo });
        return;
      }
      if (kind === 'columnBreak') {
        blocks.push({ kind: 'columnBreak' });
        return;
      }
      if (kind === 'sectionMark') {
        const props = child.props as { section: string };
        blocks.push({ kind: 'sectionMark', section: props.section });
        return;
      }

      if (child.type === Fragment) {
        const props = child.props as { children?: ReactNode };
        walk(props.children);
        return;
      }

      const props = child.props as Record<string, unknown>;
      if (props[DECORATOR_PROP] !== undefined) {
        pushDecorator(child);
        return;
      }

      blocks.push(content(child));
    });
  };

  walk(children);
  return blocks;
};

/** 콘텐츠 블록만 추출 (측정/렌더 노드 조회용 인덱스 기준) */
export const contentBlocksOf = (blocks: Block[]): ContentBlock[] =>
  blocks.filter((b): b is ContentBlock => b.kind === 'content');
