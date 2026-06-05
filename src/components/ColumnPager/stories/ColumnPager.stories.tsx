import type { Meta, StoryObj } from '@storybook/react';
import { Fragment } from 'react';
import Card from '../../ui/Card';
import { CARDS, TALL_CARD } from '../../ui/cardData';
import ColumnPager from '../ColumnPager';

/**
 * ColumnPager - PDF 페이지네이션 컴포넌트 (재설계판)
 *
 * children을 A4 페이지에 맞게 자동 분할한다.
 * - 작은 요소: 컬럼을 채우다 넘치면 다음 컬럼/페이지
 * - 큰 요소: CSS 멀티컬럼으로 잘라 이어 표현
 *
 * Compound: `ColumnPager.PageBreak / .ColumnBreak / .SectionMark / .StableGate`
 *
 * 콘텐츠 카드는 ui/Card (faker, 고정 시드)를 사용한다. 이 스토리는 측정/슬라이스
 * 렌더의 브라우저 통합 검증 용도이기도 하다(happy-dom에선 측정이 0).
 */
type StoryArgs = {
  columnCount: number;
  pageDirection: 'horizontal' | 'vertical';
  showDividers: boolean;
};

const meta: Meta<StoryArgs> = {
  title: 'PDF/ColumnPager',
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
  argTypes: {
    columnCount: { control: { type: 'number', min: 1, max: 4 } },
    pageDirection: { control: 'radio', options: ['horizontal', 'vertical'] },
    showDividers: { control: 'boolean' },
  },
  decorators: [
    (Story) => (
      <div style={{ backgroundColor: '#b6b6b6', padding: 20, minHeight: '100vh', minWidth: 834 }}>
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<StoryArgs>;

const SampleHeader = ({ pageNumber }: { pageNumber: number }) => (
  <div className="flex h-[40px] items-center justify-between border-b border-gray-300 px-4">
    <span className="text-sm font-medium">Sample Document</span>
    <span className="text-sm text-gray-500">Page {pageNumber}</span>
  </div>
);

const SampleFooter = ({ pageNumber }: { pageNumber: number }) => (
  <div className="flex h-[30px] items-center justify-center border-t border-gray-300">
    <span className="text-xs text-gray-400">- {pageNumber} -</span>
  </div>
);

/** 카드 목록을 ColumnPager children으로 (사이 간격 포함) */
const renderCards = (cards: typeof CARDS) =>
  cards.map((card) => (
    <Fragment key={card.number}>
      <Card {...card} />
      <div className="h-4" />
    </Fragment>
  ));

export const Default: Story = {
  name: '기본 (1컬럼)',
  args: { columnCount: 1, pageDirection: 'vertical', showDividers: false },
  render: (args) => (
    <ColumnPager
      columnCount={args.columnCount}
      pageDirection={args.pageDirection}
      showDividers={args.showDividers}
      header={({ pageNumber }) => <SampleHeader pageNumber={pageNumber} />}
      footer={({ pageNumber }) => <SampleFooter pageNumber={pageNumber} />}
    >
      {renderCards(CARDS.slice(0, 8))}
    </ColumnPager>
  ),
};

export const TwoColumns: Story = {
  name: '2컬럼 + 구분선',
  args: { columnCount: 2, pageDirection: 'vertical', showDividers: true },
  render: (args) => (
    <ColumnPager
      columnCount={args.columnCount}
      pageDirection={args.pageDirection}
      showDividers={args.showDividers}
      header={({ pageNumber }) => <SampleHeader pageNumber={pageNumber} />}
      footer={({ pageNumber }) => <SampleFooter pageNumber={pageNumber} />}
    >
      {renderCards(CARDS.slice(0, 40))}
    </ColumnPager>
  ),
};

export const WithPageBreak: Story = {
  name: 'PageBreak / ColumnBreak',
  args: { columnCount: 2, pageDirection: 'vertical', showDividers: false },
  render: (args) => (
    <ColumnPager
      columnCount={args.columnCount}
      pageDirection={args.pageDirection}
      showDividers={args.showDividers}
      header={({ pageNumber }) => <SampleHeader pageNumber={pageNumber} />}
      footer={({ pageNumber }) => <SampleFooter pageNumber={pageNumber} />}
    >
      <Card {...CARDS[0]} />
      <ColumnPager.ColumnBreak />
      <Card {...CARDS[1]} />
      <ColumnPager.PageBreak />
      <Card {...CARDS[2]} />
    </ColumnPager>
  ),
};

export const TallItemSlicing: Story = {
  name: '큰 아이템 슬라이스',
  args: { columnCount: 2, pageDirection: 'vertical', showDividers: true },
  render: (args) => (
    <ColumnPager
      columnCount={args.columnCount}
      pageDirection={args.pageDirection}
      showDividers={args.showDividers}
      header={({ pageNumber }) => <SampleHeader pageNumber={pageNumber} />}
      footer={({ pageNumber }) => <SampleFooter pageNumber={pageNumber} />}
    >
      <Card {...CARDS[3]} />
      <div className="h-4" />
      {/* 컬럼 높이를 초과하는 키 큰 카드 → 여러 컬럼으로 잘려 이어짐 */}
      <Card {...TALL_CARD} />
      <div className="h-4" />
      <Card {...CARDS[4]} />
    </ColumnPager>
  ),
};
