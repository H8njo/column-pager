import { markControl } from '../core/blocks';

export type PageBreakProps = {
  /** 이 페이지 넘김 이후부터 적용할 컬럼 수 */
  changeColumnCountTo?: number;
};

/**
 * 강제 페이지 넘김. 이후 콘텐츠는 다음 페이지부터 배치된다.
 * `changeColumnCountTo` 로 이후 페이지의 컬럼 수를 바꿀 수 있다.
 *
 * 렌더 출력 없음 — toBlocks가 타입으로 인식해 pageBreak 블록으로 변환.
 */
const PageBreak = (_props: PageBreakProps = {}) => null;

export default markControl(PageBreak, 'pageBreak');
