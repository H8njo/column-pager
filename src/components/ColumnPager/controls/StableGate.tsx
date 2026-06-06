import type { HTMLAttributes, PropsWithChildren } from 'react';
import { STABLE_ATTR } from '../components/keys';

export type StableGateProps = PropsWithChildren<
  HTMLAttributes<HTMLDivElement> & {
    /** 자식의 렌더가 완료되었는지 (비동기 콘텐츠가 알림) */
    stable: boolean;
  }
>;

/**
 * 렌더 완료 게이트.
 *
 * 비동기로 렌더되는 자식(이미지/데이터 로딩 등)을 감싸고, 준비되면 `stable={true}`.
 * ColumnPager는 HTML을 추출하기 전에 모든 StableGate가 stable 인지 폴링한다.
 * (타임아웃 fallback 으로 무한 대기 방지 — 결정 #4)
 */
const StableGate = ({ stable, children, ...rest }: StableGateProps) => (
  <div {...{ [STABLE_ATTR]: stable }} {...rest}>
    {children}
  </div>
);

export default StableGate;
