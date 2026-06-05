import type { Meta, StoryObj } from '@storybook/react';
import { Fragment } from 'react';
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
 * 이 스토리는 측정/슬라이스 렌더의 브라우저 통합 검증 용도이기도 하다
 * (happy-dom에선 레이아웃 측정이 0이므로 실제 브라우저에서 확인).
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

const Card = ({ title, height = 'auto' }: { title: string; height?: string | number }) => (
  <div
    className="rounded-md border border-blue-200 bg-blue-50 p-4"
    style={{ height: typeof height === 'number' ? `${height}px` : height }}
  >
    <h3 className="mb-2 font-semibold text-blue-800">{title}</h3>
    <p className="text-sm text-blue-600">
      Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut
      labore et dolore magna aliqua.
    </p>
  </div>
);

export const Default: Story = {
  name: '기본 (1컬럼)',
  args: { columnCount: 2, pageDirection: 'vertical', showDividers: false },
  render: (args) => (
    <ColumnPager
      columnCount={args.columnCount}
      pageDirection={args.pageDirection}
      showDividers={args.showDividers}
      header={({ pageNumber }) => <SampleHeader pageNumber={pageNumber} />}
      footer={({ pageNumber }) => <SampleFooter pageNumber={pageNumber} />}
    >
      {Array.from({ length: 6 }).map((_, i) => (
        <Fragment key={`s${i + 1}`}>
          <Card title={`Section ${i + 1}`} />
          <div className="h-4" />
        </Fragment>
      ))}
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
      {Array.from({ length: 23 }).map((_, i) => (
        <Fragment key={`i${i + 1}`}>
          <Card title={`Item ${i + 1}`} />
          <div className="h-4" />
        </Fragment>
      ))}
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
      <Card title="Page 1 - A" />
      <ColumnPager.ColumnBreak />
      <Card title="Page 1 - B (다음 컬럼)" />
      <ColumnPager.PageBreak />
      <Card title="Page 2 - A" />
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
      <Card title="앞 콘텐츠" />
      {/* 컬럼 높이를 초과하는 키 큰 아이템 → 여러 컬럼으로 잘려 이어짐 */}
      <Card title="아주 긴 콘텐츠" height={2500} />
      <Card title="뒤 콘텐츠" />
    </ColumnPager>
  ),
};
