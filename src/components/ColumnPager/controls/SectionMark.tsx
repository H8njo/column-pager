import { markControl } from '../core/blocks';

export type SectionMarkProps = {
  /** 이후 콘텐츠가 속하는 섹션 이름 (sticky) */
  section: string;
};

/**
 * 섹션 라벨. 이후 콘텐츠들은 다음 SectionMark 전까지 이 섹션에 속한다.
 * `getSectionPageRanges` 로 섹션별 페이지 범위를 뽑을 때 사용.
 *
 * 렌더 출력 없음 — toBlocks가 타입으로 인식해 sectionMark 블록으로 변환.
 */
const SectionMark = (_props: SectionMarkProps) => null;

export default markControl(SectionMark, 'sectionMark');
