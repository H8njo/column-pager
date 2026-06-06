import { cn } from '../../lib/utils';

/**
 * 예시 전용 카드 (Storybook 데모 / ColumnPager 콘텐츠용 — 배포 산출물 제외).
 *
 * 레퍼런스 이미지 스타일: 상단 번호 → 파란 볼드 타이틀 → 회색 본문(2~5줄).
 * 콘텐츠는 props로 받는 프레젠테이션 컴포넌트(렌더 간 안정 — ColumnPager 측정에 필수).
 */
export type CardProps = {
  /** 1-base 카드 번호 (01, 02, ...) */
  number: number;
  title: string;
  /** 본문 줄 (2~5줄) */
  lines: string[];
  className?: string;
};

const Card = ({ number, title, lines, className }: CardProps) => (
  <article className={cn('flex flex-col gap-3 rounded-2xl bg-gray-100 p-7', className)}>
    <span className="font-mono text-sm font-medium tracking-wider text-blue-600">
      {String(number).padStart(2, '0')}
    </span>

    <h3 className="text-2xl font-bold leading-tight text-blue-600">{title}</h3>

    <div className="flex flex-col gap-1.5">
      {lines.map((line, i) => (
        <p
          // biome-ignore lint/suspicious/noArrayIndexKey: 예시 데모 카드의 정적 본문 줄
          key={`${number}-line-${i}`}
          className="text-sm leading-relaxed text-gray-500"
        >
          {line}
        </p>
      ))}
    </div>
  </article>
);

export default Card;
