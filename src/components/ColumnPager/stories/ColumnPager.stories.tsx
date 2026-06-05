import type { Meta, StoryObj } from '@storybook/react';
import { Fragment } from 'react';

import ColumnPager from '../index';

/**
 * ColumnPager - PDF 페이지네이션 컴포넌트
 *
 * React children을 A4 페이지 크기에 맞게 자동으로 분할하여 PDF 렌더링에 최적화된 레이아웃을 생성합니다.
 *
 * ## 주요 기능
 * - 자동 페이지 분할: children의 높이를 측정하여 A4 페이지에 맞게 자동 분할
 * - 멀티 컬럼 레이아웃: 1~N개의 컬럼 지원
 * - 페이지/컬럼 브레이커: 강제 페이지 또는 컬럼 나누기
 * - 동적 컬럼 수 변경: 페이지별로 다른 컬럼 수 적용 가능
 * - HTML 문자열 생성: PDF 변환을 위한 HTML 출력
 *
 * ## Compound Components
 * - `ColumnPager.PageBreaker` - 강제 페이지 나누기
 * - `ColumnPager.ColumnBreaker` - 강제 컬럼 나누기
 * - `ColumnPager.PageInformation` - 페이지 메타 정보 설정
 * - `ColumnPager.StableChecker` - 렌더링 안정성 체크
 */

type StoryArgs = {
  columnCount: number;
  pageDirection: 'horizontal' | 'vertical';
  hidden: boolean;
  loading: boolean;
};

const meta: Meta<StoryArgs> = {
  title: 'PDF/ColumnPager',
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: `
## ColumnPager

PDF 페이지네이션을 위한 핵심 컴포넌트입니다.

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| \`columnCount\` | \`number\` | \`1\` | 페이지당 컬럼 수 |
| \`pageDirection\` | \`'horizontal' \\| 'vertical'\` | \`'vertical'\` | 페이지 방향 |
| \`loading\` | \`boolean\` | \`false\` | 로딩 상태 |
| \`hidden\` | \`boolean\` | \`false\` | 숨김 여부 (DOM은 렌더링) |
| \`columnClassName\` | \`string\` | - | 컬럼에 적용할 CSS 클래스 |
| \`header\` | \`(props) => ReactNode\` | - | 헤더 렌더 함수 |
| \`footer\` | \`(props) => ReactNode\` | - | 푸터 렌더 함수 |
| \`onPagesGenerated\` | \`(pages, html) => void\` | - | 페이지 생성 완료 콜백 |

### Compound Components

\`\`\`tsx
// 강제 페이지 나누기
{ColumnPager.PageBreaker()}

// 컬럼 수 변경과 함께 페이지 나누기
{ColumnPager.PageBreaker({ changeColumnCountTo: 2 })}

// 강제 컬럼 나누기
{ColumnPager.ColumnBreaker()}

// 페이지 메타 정보 설정
{ColumnPager.PageInformation('answers')}
\`\`\`
        `,
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    columnCount: {
      control: { type: 'number', min: 1, max: 4 },
      description: '페이지당 컬럼 수',
    },
    pageDirection: {
      control: 'radio',
      options: ['horizontal', 'vertical'],
      description: '페이지 방향',
    },
    hidden: {
      control: 'boolean',
      description: '숨김 여부',
    },
    loading: {
      control: 'boolean',
      description: '로딩 상태',
    },
  },
  decorators: [
    (Story) => (
      <div
        style={{
          backgroundColor: '#b6b6b6',
          padding: '20px',
          minHeight: '100vh',
          minWidth: '834px',
        }}
      >
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<StoryArgs>;

// 샘플 헤더/푸터 컴포넌트
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

// 샘플 콘텐츠 아이템
const ContentItem = ({ title, height = 'auto' }: { title: string; height?: string | number }) => (
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

/**
 * 기본 사용 예시
 *
 * 단일 컬럼으로 여러 콘텐츠를 페이지에 배치합니다.
 */
export const Default: Story = {
  name: '기본 (1컬럼)',
  args: {
    columnCount: 1,
    pageDirection: 'vertical',
    hidden: false,
    loading: false,
  },
  render: (args) => (
    <ColumnPager
      columnCount={args.columnCount}
      pageDirection={args.pageDirection}
      hidden={args.hidden}
      loading={args.loading}
      header={({ pageNumber }) => <SampleHeader pageNumber={pageNumber} />}
      footer={({ pageNumber }) => <SampleFooter pageNumber={pageNumber} />}
    >
      <ContentItem title="Section 1" />
      <div className="h-4" />
      <ContentItem title="Section 2" />
      <div className="h-4" />
      <ContentItem title="Section 3" />
      <div className="h-4" />
      <ContentItem title="Section 4" />
      <div className="h-4" />
      <ContentItem title="Section 5" />
    </ColumnPager>
  ),
};

/**
 * 2컬럼 레이아웃
 *
 * 페이지를 2개의 컬럼으로 나누어 콘텐츠를 배치합니다.
 */
export const TwoColumns: Story = {
  name: '2컬럼 레이아웃',
  args: {
    columnCount: 2,
    pageDirection: 'vertical',
    hidden: false,
    loading: false,
  },
  render: (args) => (
    <ColumnPager
      columnCount={args.columnCount}
      pageDirection={args.pageDirection}
      hidden={args.hidden}
      loading={args.loading}
      header={({ pageNumber }) => <SampleHeader pageNumber={pageNumber} />}
      footer={({ pageNumber }) => <SampleFooter pageNumber={pageNumber} />}
    >
      {Array.from({ length: 23 }).map((_, i) => (
        // biome-ignore lint/suspicious/noArrayIndexKey: 고정 길이 데모 데이터 - 순서 불변
        <Fragment key={i}>
          <ContentItem title={`Item ${i + 1}`} />
          <div className="h-4" />
        </Fragment>
      ))}
    </ColumnPager>
  ),
};

/**
 * PageBreaker 사용
 *
 * `{ColumnPager.PageBreaker()}`를 사용하여 강제로 페이지를 나눕니다.
 */
export const WithPageBreaker: Story = {
  name: 'PageBreaker 사용',
  args: {
    columnCount: 1,
    pageDirection: 'vertical',
    hidden: false,
    loading: false,
  },
  render: (args) => (
    <ColumnPager
      columnCount={args.columnCount}
      pageDirection={args.pageDirection}
      hidden={args.hidden}
      loading={args.loading}
      header={({ pageNumber }) => <SampleHeader pageNumber={pageNumber} />}
      footer={({ pageNumber }) => <SampleFooter pageNumber={pageNumber} />}
    >
      <ContentItem title="Page 1 - Section 1" />
      <div className="h-4" />
      <ContentItem title="Page 1 - Section 2" />

      {ColumnPager.PageBreaker()}

      <ContentItem title="Page 2 - Section 1" />
      <div className="h-4" />
      <ContentItem title="Page 2 - Section 2" />

      {ColumnPager.PageBreaker()}

      <ContentItem title="Page 3 - Section 1" />
    </ColumnPager>
  ),
};

/**
 * 동적 컬럼 수 변경
 *
 * `PageBreaker`의 `changeColumnCountTo` prop을 사용하여
 * 페이지마다 다른 컬럼 수를 적용할 수 있습니다.
 */
export const DynamicColumnCount: Story = {
  name: '동적 컬럼 수 변경',
  args: {
    columnCount: 1,
    pageDirection: 'vertical',
    hidden: false,
    loading: false,
  },
  render: (args) => (
    <ColumnPager
      columnCount={args.columnCount}
      pageDirection={args.pageDirection}
      hidden={args.hidden}
      loading={args.loading}
      header={({ pageNumber }) => <SampleHeader pageNumber={pageNumber} />}
      footer={({ pageNumber }) => <SampleFooter pageNumber={pageNumber} />}
    >
      {/* 1컬럼 페이지 */}
      <ContentItem title="Content 1 (1 Column)" />

      {ColumnPager.PageBreaker({ changeColumnCountTo: 2 })}

      {/* 2컬럼 페이지 */}
      {Array.from({ length: 8 }).map((_, i) => (
        // biome-ignore lint/suspicious/noArrayIndexKey: 고정 길이 데모 데이터 - 순서 불변
        <Fragment key={i}>
          <ContentItem title={`Content ${i + 2} (2 Column)`} />
          <div className="h-4" />
        </Fragment>
      ))}

      {ColumnPager.PageBreaker({ changeColumnCountTo: 1 })}

      {/* 다시 1컬럼 */}
      <ContentItem title="Content 10 (1 Column)" />
    </ColumnPager>
  ),
};

/**
 * PageInformation 사용
 *
 * `{ColumnPager.PageInformation('type')}`을 사용하여 페이지별 메타 정보를 설정합니다.
 * 이 정보는 header/footer의 `pageInformation` prop으로 전달됩니다.
 */
export const WithPageInformation: Story = {
  name: 'PageInformation 사용',
  args: {
    columnCount: 1,
    pageDirection: 'vertical',
    hidden: false,
    loading: false,
  },
  render: (args) => (
    <ColumnPager
      columnCount={args.columnCount}
      pageDirection={args.pageDirection}
      hidden={args.hidden}
      loading={args.loading}
      header={({ pageNumber, pageInformation }) => (
        <div className="flex h-[40px] items-center justify-between border-b border-gray-300 px-4">
          <span className="text-sm font-medium">{pageInformation || 'Document'}</span>
          <span className="text-sm text-gray-500">Page {pageNumber}</span>
        </div>
      )}
      footer={({ pageNumber }) => <SampleFooter pageNumber={pageNumber} />}
    >
      {ColumnPager.PageInformation('introduction')}
      <ContentItem title="Content 1 (introduction)" />

      {ColumnPager.PageBreaker()}
      {ColumnPager.PageInformation('main-content')}

      <ContentItem title="Content 2 (main-content)" />
      <div className="h-4" />
      <ContentItem title="Content 3 (main-content)" />

      {ColumnPager.PageBreaker()}
      {ColumnPager.PageInformation('conclusion')}

      <ContentItem title="Content 4 (conclusion)" />
    </ColumnPager>
  ),
};

/**
 * 가로 방향 페이지
 *
 * `pageDirection="horizontal"`을 사용하여 가로 방향으로 페이지를 배치합니다.
 */
export const HorizontalDirection: Story = {
  name: '가로 방향 (horizontal)',
  args: {
    columnCount: 1,
    pageDirection: 'horizontal',
    hidden: false,
    loading: false,
  },
  render: (args) => (
    <ColumnPager
      columnCount={args.columnCount}
      pageDirection={args.pageDirection}
      hidden={args.hidden}
      loading={args.loading}
      header={({ pageNumber }) => <SampleHeader pageNumber={pageNumber} />}
      footer={({ pageNumber }) => <SampleFooter pageNumber={pageNumber} />}
    >
      {Array.from({ length: 20 }).map((_, i) => (
        // biome-ignore lint/suspicious/noArrayIndexKey: 고정 길이 데모 데이터 - 순서 불변
        <Fragment key={i}>
          <ContentItem title={`Content ${i + 1}`} />
          <div className="h-4" />
        </Fragment>
      ))}
    </ColumnPager>
  ),
};

/**
 * 로딩 상태
 *
 * `loading={true}`일 때는 컴포넌트가 렌더링되지 않습니다.
 */
export const Loading: Story = {
  name: '로딩 상태',
  args: {
    columnCount: 1,
    pageDirection: 'vertical',
    hidden: false,
    loading: true,
  },
  render: (args) => (
    <div>
      <div className="mb-4 rounded-md bg-yellow-100 p-4 text-yellow-800">
        loading=true 상태에서는 아무것도 렌더링되지 않습니다.
      </div>
      <ColumnPager
        columnCount={args.columnCount}
        pageDirection={args.pageDirection}
        hidden={args.hidden}
        loading={args.loading}
        header={({ pageNumber }) => <SampleHeader pageNumber={pageNumber} />}
        footer={({ pageNumber }) => <SampleFooter pageNumber={pageNumber} />}
      >
        <ContentItem title="This won't render" />
      </ColumnPager>
    </div>
  ),
};

/**
 * 숨김 상태
 *
 * `hidden={true}`일 때는 DOM은 렌더링되지만 화면에 보이지 않습니다.
 * 이는 `onPagesGenerated` 콜백을 위해 HTML을 생성해야 할 때 유용합니다.
 */
export const Hidden: Story = {
  name: '숨김 상태',
  args: {
    columnCount: 1,
    pageDirection: 'vertical',
    hidden: true,
    loading: false,
  },
  render: (args) => (
    <div>
      <div className="mb-4 rounded-md bg-blue-100 p-4 text-blue-800">
        hidden=true 상태에서는 DOM은 존재하지만 화면에 보이지 않습니다.
        <br />
        (DevTools에서 DOM을 확인할 수 있습니다)
      </div>
      <ColumnPager
        columnCount={args.columnCount}
        pageDirection={args.pageDirection}
        hidden={args.hidden}
        loading={args.loading}
        header={({ pageNumber }) => <SampleHeader pageNumber={pageNumber} />}
        footer={({ pageNumber }) => <SampleFooter pageNumber={pageNumber} />}
      >
        <ContentItem title="Hidden Content" />
      </ColumnPager>
    </div>
  ),
};
