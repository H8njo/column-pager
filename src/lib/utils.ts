import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Tailwind CSS 클래스를 조건부로 병합하는 유틸리티 함수
 * @param inputs - 클래스명 또는 조건부 클래스 객체
 * @returns 병합된 클래스명 문자열
 *
 * @example
 * cn('px-2 py-1', 'bg-blue-500')
 * // => 'px-2 py-1 bg-blue-500'
 *
 * @example
 * cn('px-2 py-1', isActive && 'bg-blue-500')
 * // => isActive가 true면 'px-2 py-1 bg-blue-500'
 * // => isActive가 false면 'px-2 py-1'
 *
 * @example
 * cn('px-2', { 'bg-blue-500': isActive, 'bg-gray-500': !isActive })
 * // => 'px-2 bg-blue-500' 또는 'px-2 bg-gray-500'
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
