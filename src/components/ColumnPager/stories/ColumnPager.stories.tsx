import type { Meta, StoryObj } from '@storybook/react';
import { Fragment, useEffect, useRef, useState } from 'react';
import Card from '../../ui/Card';
import { CARDS, TALL_CARD } from '../../ui/cardData';
import ColumnPager from '../ColumnPager';
import { getSectionPageRanges, type SectionPageRanges } from '../core/sectionRanges';
import type { Page } from '../core/types';

/**
 * ColumnPager - PDF 페이지네이션 컴포넌트 (재설계판)
 *
 * children을 컨테이너 폭(반응형) × pageHeight 페이지에 맞게 자동 분할한다.
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

/**
 * PageBreak 의 changeColumnCountTo 로 페이지마다 컬럼 수를 바꾼다.
 * 1컬럼 페이지 → 2컬럼 페이지 → 3컬럼 페이지.
 */
export const DynamicColumnCount: Story = {
  name: 'PageBreak 컬럼 수 변경',
  args: { columnCount: 1, pageDirection: 'vertical', showDividers: true },
  render: (args) => (
    <ColumnPager
      columnCount={args.columnCount}
      pageDirection={args.pageDirection}
      showDividers={args.showDividers}
      header={({ pageNumber }) => <SampleHeader pageNumber={pageNumber} />}
      footer={({ pageNumber }) => <SampleFooter pageNumber={pageNumber} />}
    >
      {/* 1컬럼 */}
      {renderCards(CARDS.slice(0, 3))}

      <ColumnPager.PageBreak changeColumnCountTo={2} />
      {/* 2컬럼 */}
      {renderCards(CARDS.slice(3, 15))}

      <ColumnPager.PageBreak changeColumnCountTo={3} />
      {/* 3컬럼 */}
      {renderCards(CARDS.slice(15, 33))}
    </ColumnPager>
  ),
};

/**
 * SectionMark + getSectionPageRanges.
 * 콘텐츠를 섹션으로 나누고, 생성 후 섹션별 페이지 범위를 화면에 표시한다.
 */
const SectionsDemo = () => {
  const [ranges, setRanges] = useState<SectionPageRanges>({});
  return (
    <>
      <div className="fixed top-2 left-2 z-10 rounded bg-white p-2 font-mono text-xs shadow">
        sectionRanges: {JSON.stringify(ranges)}
      </div>
      <ColumnPager
        columnCount={2}
        showDividers
        header={({ pageNumber, section }) => (
          <div className="flex h-[40px] items-center justify-between border-gray-300 border-b px-4">
            <span className="text-sm font-medium">{section ?? '-'}</span>
            <span className="text-gray-500 text-sm">Page {pageNumber}</span>
          </div>
        )}
        footer={({ pageNumber }) => <SampleFooter pageNumber={pageNumber} />}
        onPagesGenerated={(pages: Page[]) => setRanges(getSectionPageRanges(pages))}
      >
        <ColumnPager.SectionMark section="vocabulary" />
        {renderCards(CARDS.slice(0, 8))}
        <ColumnPager.SectionMark section="grammar" />
        {renderCards(CARDS.slice(8, 16))}
        <ColumnPager.SectionMark section="answers" />
        {renderCards(CARDS.slice(16, 22))}
      </ColumnPager>
    </>
  );
};

export const WithSections: Story = {
  name: 'SectionMark + 섹션 범위',
  render: () => <SectionsDemo />,
};

/** 비동기로 "불러온" 긴 콘텐츠 (로드 후 컬럼 높이를 초과 → 슬라이스되어 페이지 증가) */
const ASYNC_PARAGRAPHS = Array.from(
  { length: 45 },
  (_, i) =>
    `비동기 항목 ${i + 1}. ${'Lorem ipsum dolor sit amet, consectetur adipiscing elit. '.repeat(2)}`,
);

/**
 * StableGate — 비동기 콘텐츠 로드 전/후로 페이지 수가 달라진다.
 * 로딩 중엔 짧은 플레이스홀더(적은 페이지) → 로드되면 긴 콘텐츠가 들어와 여러 페이지로 늘어남.
 * StableGate가 stable=true가 될 때까지 emit(onPagesGenerated)을 대기한다.
 */
const StableGateDemo = () => {
  const [loaded, setLoaded] = useState(false);
  const [pageCount, setPageCount] = useState(0);
  useEffect(() => {
    const t = setTimeout(() => setLoaded(true), 1200);
    return () => clearTimeout(t);
  }, []);
  return (
    <>
      <div className="fixed top-2 left-2 z-10 rounded bg-white p-2 font-mono text-xs shadow">
        {loaded ? `✅ 로드 완료 · 총 ${pageCount} 페이지` : '⏳ 로딩 중… (1.2s)'}
      </div>
      <ColumnPager
        columnCount={1}
        header={({ pageNumber }) => <SampleHeader pageNumber={pageNumber} />}
        footer={({ pageNumber }) => <SampleFooter pageNumber={pageNumber} />}
        onPagesGenerated={(pages) => setPageCount(pages.length)}
      >
        <Card {...CARDS[0]} />
        <div className="h-4" />
        <ColumnPager.StableGate stable={loaded}>
          {loaded ? (
            <div className="space-y-2">
              {ASYNC_PARAGRAPHS.map((text, i) => (
                // biome-ignore lint/suspicious/noArrayIndexKey: 고정 길이 데모 문단
                <p key={i} className="text-sm leading-relaxed text-gray-600">
                  {text}
                </p>
              ))}
            </div>
          ) : (
            <div className="flex h-[100px] items-center justify-center rounded bg-amber-100 text-amber-700">
              로딩 중…
            </div>
          )}
        </ColumnPager.StableGate>
        <div className="h-4" />
        <Card {...CARDS[1]} />
      </ColumnPager>
    </>
  );
};

export const AsyncStableGate: Story = {
  name: 'StableGate (비동기 콘텐츠)',
  render: () => <StableGateDemo />,
};

/**
 * PDF 출력 미리보기 — onPagesGenerated의 htmlString을 iframe에 그려 실제 결과물을 본다.
 * ColumnPager는 hidden으로 측정용만, 좌측 iframe이 최종 HTML.
 */
const PdfPreviewDemo = () => {
  const [html, setHtml] = useState('');
  return (
    <>
      <iframe
        title="PDF preview"
        srcDoc={html}
        className="h-[80vh] w-[420px] border border-gray-400 bg-white"
      />
      <ColumnPager
        hidden
        columnCount={2}
        showDividers
        header={({ pageNumber }) => <SampleHeader pageNumber={pageNumber} />}
        footer={({ pageNumber }) => <SampleFooter pageNumber={pageNumber} />}
        onPagesGenerated={(_pages, htmlString) => setHtml(htmlString)}
      >
        {renderCards(CARDS.slice(0, 12))}
      </ColumnPager>
    </>
  );
};

export const PdfPreview: Story = {
  name: 'PDF 출력 미리보기 (iframe)',
  render: () => <PdfPreviewDemo />,
};

/** 길게 만들기용 샘플 (여러 줄) */
const LONG_TEXT = Array.from(
  { length: 30 },
  (_, i) => `${i + 1}행. Lorem ipsum dolor sit amet, consectetur adipiscing elit.`,
).join('\n');

/**
 * 데이터 편집 → 즉시 반영.
 * 가운데 카드의 내용을 textarea로 바꾸면 그 카드만 재측정되어 거의 즉시 재배치된다.
 * 좌상단에 반영(emit) 소요 ms와 총 페이지 수 표시. ([길게]를 눌러 짧은→긴 변화 확인)
 */
const EditableDemo = () => {
  const [text, setText] = useState('짧은 한 줄짜리 내용입니다.');
  const [pageCount, setPageCount] = useState(0);
  const [elapsed, setElapsed] = useState<number | null>(null);
  const editStartRef = useRef(0);

  const edit = (value: string) => {
    editStartRef.current = performance.now();
    setText(value);
  };

  const lines = text.trim() ? text.split('\n') : ['(빈 내용)'];

  return (
    <>
      <div className="fixed top-2 left-2 z-10 w-[320px] space-y-2 rounded bg-white p-3 shadow">
        <div className="font-mono text-xs text-gray-600">
          반영(emit): {elapsed === null ? '-' : `${elapsed}ms`} · 총 {pageCount} 페이지
        </div>
        <textarea
          className="h-28 w-full rounded border border-gray-300 p-2 text-xs"
          value={text}
          onChange={(e) => edit(e.target.value)}
        />
        <div className="flex gap-2">
          <button
            type="button"
            className="rounded bg-blue-600 px-2 py-1 text-xs text-white"
            onClick={() => edit('짧은 한 줄짜리 내용입니다.')}
          >
            짧게
          </button>
          <button
            type="button"
            className="rounded bg-blue-600 px-2 py-1 text-xs text-white"
            onClick={() => edit(LONG_TEXT)}
          >
            길게
          </button>
        </div>
      </div>

      <ColumnPager
        columnCount={2}
        showDividers
        header={({ pageNumber }) => <SampleHeader pageNumber={pageNumber} />}
        footer={({ pageNumber }) => <SampleFooter pageNumber={pageNumber} />}
        onPagesGenerated={(pages) => {
          setPageCount(pages.length);
          if (editStartRef.current)
            setElapsed(Math.round(performance.now() - editStartRef.current));
        }}
      >
        {renderCards(CARDS.slice(0, 4))}
        <Fragment key="editable">
          <Card number={5} title="✏️ 편집 카드 (중간)" lines={lines} />
          <div className="h-4" />
        </Fragment>
        {renderCards(CARDS.slice(5, 12))}
      </ColumnPager>
    </>
  );
};

export const EditableContent: Story = {
  name: '데이터 편집 → 즉시 반영',
  render: () => <EditableDemo />,
};
