import type { CSSProperties, HTMLAttributes, ReactNode } from 'react';

export type KeepTogetherProps = HTMLAttributes<HTMLDivElement> & {
  children?: ReactNode;
};

/**
 * 이 안의 콘텐츠를 컬럼/페이지 경계에서 라인별로 쪼개지 않고 "통째로" 다음 컬럼/페이지로 넘긴다.
 *
 * 슬라이싱은 CSS multicol 기반이라 `break-inside: avoid`를 존중한다. 리스트·표·코드블록·이미지
 * 캡션처럼 묶여서 함께 넘어가야 하는 것에 감싸 쓴다. (감싸지 않은 일반 콘텐츠는 라인 단위로 흐름.)
 *
 * 단 내용이 컬럼 높이보다 크면 회피 불가 → 어쩔 수 없이 쪼개진다(브라우저 강제 분할).
 *
 * Tailwind 의존을 피하려 inline style로 break-inside를 적용한다(라이브러리 배포 안전).
 */
const KEEP_TOGETHER_STYLE: CSSProperties = { breakInside: 'avoid' };

const KeepTogether = ({ children, style, ...props }: KeepTogetherProps) => (
  <div style={{ ...KEEP_TOGETHER_STYLE, ...style }} {...props}>
    {children}
  </div>
);

export default KeepTogether;
