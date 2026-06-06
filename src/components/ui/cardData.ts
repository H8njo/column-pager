import { faker } from '@faker-js/faker';
import type { CardProps } from './Card';

/**
 * 예시 카드 데이터 (faker 생성, 배포 제외).
 *
 * 모듈 로드 시 seed를 고정해 한 번만 생성한다 → 결정적이고 렌더 간 안정적이라
 * ColumnPager의 오프스크린 측정과 최종 렌더가 동일한 콘텐츠를 본다.
 * 본문은 2~5줄, 각 줄은 단어 수가 다른 문장으로 길이를 다양화한다.
 */
export type CardDatum = Pick<CardProps, 'number' | 'title' | 'lines'>;

const capitalize = (text: string) => text.charAt(0).toUpperCase() + text.slice(1);

faker.seed(20240607);

const makeCard = (index: number): CardDatum => {
  const lineCount = faker.number.int({ min: 2, max: 5 });
  return {
    number: index + 1,
    title: capitalize(faker.lorem.words({ min: 3, max: 6 })),
    lines: Array.from({ length: lineCount }, () => faker.lorem.sentence({ min: 5, max: 16 })),
  };
};

/** 예시 카드 100장 (faker, 고정 시드) */
export const CARDS: CardDatum[] = Array.from({ length: 100 }, (_, i) => makeCard(i));

/** 컬럼 높이를 초과하는 키 큰 카드 (슬라이스 데모용) */
export const TALL_CARD: CardDatum = {
  number: 0,
  title: capitalize(faker.lorem.words({ min: 4, max: 7 })),
  lines: Array.from({ length: 80 }, () => faker.lorem.sentence({ min: 6, max: 18 })),
};
