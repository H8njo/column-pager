import {
  Children,
  cloneElement,
  Fragment,
  isValidElement,
  type ReactElement,
  type ReactNode,
} from 'react';
import { blocksSignature } from './signature';
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
  // 블록 생성 시 노드 시그니처를 1회 계산해 부착 → 측정 캐시 키/재계산 트리거에서 재사용
  // (measureItems마다, 그리고 usePagination 렌더마다 다시 트리를 순회하던 비용 제거).
  signature: blocksSignature(node),
  // 소비자가 element에 부여한 key를 안정적 정체성으로 보관(순서 변경 추적/layout 애니메이션용).
  // element가 아니거나 key가 없으면 undefined.
  id: isValidElement(node) && node.key != null ? String(node.key) : undefined,
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

/**
 * 정규화된 블록 스트림의 재페이지네이션 시그니처.
 * 각 블록은 이미 계산된 per-block signature(+decorator 클래스)와 컨트롤 정보를 쓰므로
 * 트리를 다시 순회하지 않는다(blocksSignature(children) 전체 재순회 대체).
 */
export const streamSignature = (blocks: Block[]): string =>
  blocks
    .map((b) => {
      if (b.kind === 'content') return `c:${b.signature ?? ''}:${b.decoratorClassName ?? ''}`;
      if (b.kind === 'pageBreak') return `pb:${b.columnCount ?? ''}`;
      if (b.kind === 'sectionMark') return `sm:${b.section}`;
      return 'cb';
    })
    .join('|');
