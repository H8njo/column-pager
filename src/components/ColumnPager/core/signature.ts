import { Children, isValidElement, type ReactNode } from 'react';

/**
 * children의 구조 시그니처를 만든다 (재페이지네이션 dedup + per-item 측정 캐시 키).
 *
 * type/key + props(children 제외) + 자식 구조를 모두 반영한다. 그래서 콘텐츠를
 * children이 아니라 prop으로 받는 컴포넌트(예: <Card lines={...} />)도 prop이
 * 바뀌면 시그니처가 바뀐다.
 *
 * 함수 prop은 제외한다 — 렌더 크기에 무관하고, 렌더마다 새 클로저라 포함하면
 * 불필요한 재계산을 유발한다.
 */
const serializeProps = (props: Record<string, unknown>): string => {
  const out: string[] = [];
  for (const key of Object.keys(props).sort()) {
    if (key === 'children' || key === 'key') continue;
    const value = props[key];
    if (typeof value === 'function' || value === undefined) continue;
    if (value === null) {
      out.push(`${key}=null`);
    } else if (typeof value === 'object') {
      try {
        out.push(`${key}=${JSON.stringify(value)}`);
      } catch {
        out.push(`${key}=obj`);
      }
    } else {
      out.push(`${key}=${String(value)}`);
    }
  }
  return out.join(',');
};

export const blocksSignature = (children: ReactNode): string => {
  const parts: string[] = [];

  const typeId = (type: unknown): string => {
    if (typeof type === 'string') return type;
    if (typeof type === 'function') return type.name || 'fn';
    if (type === null || type === undefined) return 'null';
    // Fragment, memo, forwardRef 등
    return 'node';
  };

  const walk = (node: ReactNode): void => {
    Children.forEach(node, (child) => {
      if (!isValidElement(child)) {
        parts.push(`t:${String(child)}`);
        return;
      }
      const props = child.props as Record<string, unknown>;
      parts.push(`e:${typeId(child.type)}:${child.key ?? '-'}{${serializeProps(props)}}`);
      const childChildren = (props as { children?: ReactNode }).children;
      if (childChildren !== undefined) {
        parts.push('(');
        walk(childChildren);
        parts.push(')');
      }
    });
  };

  walk(children);
  return parts.join('|');
};
