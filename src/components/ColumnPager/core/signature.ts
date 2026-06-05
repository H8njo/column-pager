import { Children, isValidElement, type ReactNode } from 'react';

/**
 * children의 구조 시그니처를 만든다 (재생성 dedup용).
 *
 * V1은 children '길이'로만 dedup해서, 길이가 같고 내용만 바뀌면 재페이지네이션이
 * 안 되는 잠재 버그가 있었다. 여기서는 key/type/주요 식별 정보를 포함한 구조
 * 시그니처를 만들어, 길이가 같아도 내용이 다르면 다른 시그니처가 나오게 한다.
 */
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
      const props = child.props as { children?: ReactNode; section?: string };
      parts.push(`e:${typeId(child.type)}:${child.key ?? '-'}`);
      // section / changeColumnCountTo 같은 식별 prop 포함
      if (props.section !== undefined) parts.push(`s:${props.section}`);
      if (props.children !== undefined) {
        parts.push('(');
        walk(props.children);
        parts.push(')');
      }
    });
  };

  walk(children);
  return parts.join('|');
};
