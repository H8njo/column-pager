import type { HTMLAttributes, ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface QuestionCardProps extends HTMLAttributes<HTMLDivElement> {
  /** 카테고리 (예: Gateway, Reading) */
  category?: string;
  /** 문제 번호 */
  questionNumber: number;
  /** 문제 제목/지시문 */
  title: string;
  /** 본문 내용 */
  passage?: string;
  /** 보기 목록 */
  options?: string[];
}

const QuestionCard = ({
  category,
  questionNumber,
  title,
  passage,
  options,
  className,
  children,
  ...props
}: QuestionCardProps & { children?: ReactNode }) => {
  return (
    <div className={cn('bg-white rounded-lg shadow-sm space-y-4', className)} {...props}>
      {/* 카테고리 */}
      {category && <p className="text-sm text-gray-500">{category}</p>}

      {/* 문제 번호 + 제목 */}
      <h3 className="text-base font-bold">
        {questionNumber}. {title}
      </h3>

      {/* 본문 */}
      {passage && (
        <div className="text-sm leading-relaxed text-gray-800 text-justify whitespace-pre-line">
          {passage}
        </div>
      )}

      {/* 커스텀 children */}
      {children}

      {/* 보기 목록 */}
      {options && options.length > 0 && (
        <ol className="space-y-1.5 text-sm">
          {options.map((option, index) => (
            <li key={index} className="flex gap-2">
              <span className="flex-shrink-0">{getCircleNumber(index + 1)}</span>
              <span>{option}</span>
            </li>
          ))}
        </ol>
      )}
    </div>
  );
};

/** 원형 숫자 반환 (①②③④⑤) */
const getCircleNumber = (num: number): string => {
  const circleNumbers = ['①', '②', '③', '④', '⑤', '⑥', '⑦', '⑧', '⑨', '⑩'];
  return circleNumbers[num - 1] ?? `(${num})`;
};

export default QuestionCard;
