import { markControl } from '../core/blocks';

/**
 * 강제 컬럼 넘김. 이후 콘텐츠는 다음 컬럼부터 배치된다.
 * (마지막 컬럼이면 다음 페이지로 넘어감)
 *
 * 렌더 출력 없음 — toBlocks가 타입으로 인식해 columnBreak 블록으로 변환.
 */
const ColumnBreak = () => null;

export default markControl(ColumnBreak, 'columnBreak');
