import { faker } from '@faker-js/faker';
import type { Meta, StoryObj } from '@storybook/react';
import { LayoutGroup, motion } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';
import Card from '../../ui/Card';
import { CARDS, type CardDatum, TALL_CARD } from '../../ui/cardData';
import ColumnPager from '../ColumnPager';
import { getSectionPageRanges, type SectionPageRanges } from '../core/sectionRanges';
import type { Page } from '../core/types';

type StoryArgs = {
  columnCount: number;
  pageDirection: 'horizontal' | 'vertical';
  showDividers: boolean;
  itemGap: number;
  columnGap: number;
  bodyClassName: string;
};

/** 컨트롤이 없는 데모용 기본값 */
const ITEM_GAP = 16;
const COLUMN_GAP = 40;
const BODY_CLASS = 'px-8 py-5';

/**
 * ColumnPager — children을 컨테이너 폭(반응형) × `pageHeight` 페이지로 자동 분할하는 렌더러.
 *
 * - 작은 요소: 컬럼을 채우다 넘치면 다음 컬럼/페이지
 * - 큰 요소: CSS 멀티컬럼으로 잘라 여러 컬럼·페이지에 이어 표현
 * - 컴파운드 컨트롤: `ColumnPager.PageBreak / .ColumnBreak / .SectionMark / .StableGate`
 * - `onPagesGenerated(pages, html)`로 결과(렌더된 outerHTML) 방출 — 문서/ PDF 변환은 소비자 몫
 *
 * 콘텐츠 카드는 ui/Card (faker, 고정 시드)를 사용한다. 측정·슬라이스 렌더는 실제 브라우저에서만
 * 유효하다(happy-dom 단위테스트에선 측정값이 0).
 */
const meta: Meta<StoryArgs> = {
  title: 'PDF/ColumnPager',
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
  args: { columnGap: COLUMN_GAP, bodyClassName: BODY_CLASS },
  argTypes: {
    columnCount: { control: { type: 'number', min: 1, max: 4 } },
    pageDirection: { control: 'radio', options: ['horizontal', 'vertical'] },
    showDividers: { control: 'boolean' },
    itemGap: {
      control: { type: 'range', min: 0, max: 48, step: 2 },
      description: '아이템(카드) 사이 간격(px). 컬럼 첫 아이템 위에는 적용되지 않음.',
    },
    columnGap: {
      control: { type: 'range', min: 0, max: 80, step: 4 },
      description: '컬럼 사이 가로 간격(px). 라이브러리 기본값은 0.',
    },
    bodyClassName: {
      control: 'text',
      description: '본문 영역 클래스(패딩 등). 라이브러리 기본값은 없음(패딩 0).',
    },
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

/** 카드 목록을 ColumnPager children으로 (간격은 ColumnPager의 itemGap이 처리) */
const renderCards = (cards: typeof CARDS) =>
  cards.map((card) => <Card key={card.number} {...card} />);

export const Default: Story = {
  name: '기본 (1컬럼)',
  args: { columnCount: 1, pageDirection: 'vertical', showDividers: false, itemGap: 16 },
  render: (args) => (
    <ColumnPager
      columnCount={args.columnCount}
      pageDirection={args.pageDirection}
      showDividers={args.showDividers}
      itemGap={args.itemGap}
      columnGap={args.columnGap}
      bodyClassName={args.bodyClassName}
      header={({ pageNumber }) => <SampleHeader pageNumber={pageNumber} />}
      footer={({ pageNumber }) => <SampleFooter pageNumber={pageNumber} />}
    >
      {renderCards(CARDS.slice(0, 8))}
    </ColumnPager>
  ),
};

export const TwoColumns: Story = {
  name: '2컬럼 + 구분선',
  args: { columnCount: 2, pageDirection: 'vertical', showDividers: true, itemGap: 16 },
  render: (args) => (
    <ColumnPager
      columnCount={args.columnCount}
      pageDirection={args.pageDirection}
      showDividers={args.showDividers}
      itemGap={args.itemGap}
      columnGap={args.columnGap}
      bodyClassName={args.bodyClassName}
      header={({ pageNumber }) => <SampleHeader pageNumber={pageNumber} />}
      footer={({ pageNumber }) => <SampleFooter pageNumber={pageNumber} />}
    >
      {renderCards(CARDS.slice(0, 40))}
    </ColumnPager>
  ),
};

export const WithPageBreak: Story = {
  name: 'PageBreak / ColumnBreak',
  args: { columnCount: 2, pageDirection: 'vertical', showDividers: false, itemGap: 16 },
  render: (args) => (
    <ColumnPager
      columnCount={args.columnCount}
      pageDirection={args.pageDirection}
      showDividers={args.showDividers}
      itemGap={args.itemGap}
      columnGap={args.columnGap}
      bodyClassName={args.bodyClassName}
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
  args: { columnCount: 2, pageDirection: 'vertical', showDividers: true, itemGap: 16 },
  render: (args) => (
    <ColumnPager
      columnCount={args.columnCount}
      pageDirection={args.pageDirection}
      showDividers={args.showDividers}
      itemGap={args.itemGap}
      columnGap={args.columnGap}
      bodyClassName={args.bodyClassName}
      header={({ pageNumber }) => <SampleHeader pageNumber={pageNumber} />}
      footer={({ pageNumber }) => <SampleFooter pageNumber={pageNumber} />}
    >
      <Card {...CARDS[3]} />
      {/* 컬럼 높이를 초과하는 키 큰 카드 → 여러 컬럼으로 잘려 이어짐 */}
      <Card {...TALL_CARD} />
      <Card {...CARDS[4]} />
    </ColumnPager>
  ),
};

/**
 * moveOversizedItemToNextColumn — 컬럼 높이를 넘는 큰 아이템을, 이미 채워진 컬럼에선
 * 자르기 전에 다음 컬럼으로 먼저 보낸 뒤 빈 컬럼 맨 위에서 슬라이스를 시작한다.
 *
 * - off(기본): 앞 카드로 일부 찬 컬럼의 남은 공간부터 큰 카드가 잘려 이어짐(carry).
 * - on: 큰 카드가 통째로 다음 컬럼으로 이동 → 빈 컬럼 위에서부터 깔끔하게 슬라이스.
 *
 * 컨트롤의 `moveOversizedItemToNextColumn`을 켜고/끄며 첫 컬럼의 큰 카드 시작 위치를 비교.
 */
type OversizedArgs = {
  moveOversizedItemToNextColumn: boolean;
  showDividers: boolean;
  itemGap: number;
};

export const MoveOversizedItem: StoryObj<OversizedArgs> = {
  name: '큰 아이템 다음 컬럼으로 이동',
  args: { moveOversizedItemToNextColumn: false, showDividers: true, itemGap: 16 },
  argTypes: {
    moveOversizedItemToNextColumn: { control: 'boolean' },
    showDividers: { control: 'boolean' },
    itemGap: { control: { type: 'range', min: 0, max: 48, step: 2 } },
  },
  render: (args) => (
    <ColumnPager
      columnCount={2}
      showDividers={args.showDividers}
      itemGap={args.itemGap}
      columnGap={COLUMN_GAP}
      bodyClassName={BODY_CLASS}
      moveOversizedItemToNextColumn={args.moveOversizedItemToNextColumn}
      header={({ pageNumber }) => <SampleHeader pageNumber={pageNumber} />}
      footer={({ pageNumber }) => <SampleFooter pageNumber={pageNumber} />}
    >
      {/* 첫 컬럼을 일부 채우는 일반 카드 */}
      <Card {...CARDS[0]} />
      {/* 컬럼 높이를 초과하는 큰 카드:
          off → 위 카드 아래(남은 공간)부터 잘려 시작 / on → 다음 컬럼 맨 위에서 시작 */}
      <Card {...TALL_CARD} />
    </ColumnPager>
  ),
};

/**
 * PageBreak 의 changeColumnCountTo 로 페이지마다 컬럼 수를 바꾼다.
 * 1컬럼 페이지 → 2컬럼 페이지 → 3컬럼 페이지.
 */
export const DynamicColumnCount: Story = {
  name: 'PageBreak 컬럼 수 변경',
  args: { columnCount: 1, pageDirection: 'vertical', showDividers: true, itemGap: 16 },
  render: (args) => (
    <ColumnPager
      columnCount={args.columnCount}
      pageDirection={args.pageDirection}
      showDividers={args.showDividers}
      itemGap={args.itemGap}
      columnGap={args.columnGap}
      bodyClassName={args.bodyClassName}
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
        itemGap={ITEM_GAP}
        columnGap={COLUMN_GAP}
        bodyClassName={BODY_CLASS}
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
  parameters: { controls: { disable: true } },
  render: () => <SectionsDemo />,
};

// 스토리 본문 텍스트도 faker로 생성(고정 시드). CARDS/TALL_CARD가 import 시점에 이미
// 생성된 뒤이므로 여기서 재시드해도 카드 데이터엔 영향 없음.
faker.seed(20240608);

/** 비동기로 "불러온" 긴 콘텐츠 (로드 후 컬럼 높이를 초과 → 슬라이스되어 페이지 증가) */
const ASYNC_PARAGRAPHS = Array.from(
  { length: 45 },
  (_, i) => `비동기 항목 ${i + 1}. ${faker.lorem.sentences(2)}`,
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
        itemGap={ITEM_GAP}
        columnGap={COLUMN_GAP}
        bodyClassName={BODY_CLASS}
        header={({ pageNumber }) => <SampleHeader pageNumber={pageNumber} />}
        footer={({ pageNumber }) => <SampleFooter pageNumber={pageNumber} />}
        onPagesGenerated={(pages) => setPageCount(pages.length)}
      >
        <Card {...CARDS[0]} />
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
        <Card {...CARDS[1]} />
      </ColumnPager>
    </>
  );
};

export const AsyncStableGate: Story = {
  name: 'StableGate (비동기 콘텐츠)',
  parameters: { controls: { disable: true } },
  render: () => <StableGateDemo />,
};

/** 길게 만들기용 샘플 (여러 줄, faker) */
const LONG_TEXT = Array.from(
  { length: 30 },
  (_, i) => `${i + 1}행. ${faker.lorem.sentence({ min: 8, max: 14 })}`,
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
        itemGap={ITEM_GAP}
        columnGap={COLUMN_GAP}
        bodyClassName={BODY_CLASS}
        header={({ pageNumber }) => <SampleHeader pageNumber={pageNumber} />}
        footer={({ pageNumber }) => <SampleFooter pageNumber={pageNumber} />}
        onPagesGenerated={(pages) => {
          setPageCount(pages.length);
          if (editStartRef.current)
            setElapsed(Math.round(performance.now() - editStartRef.current));
        }}
      >
        {renderCards(CARDS.slice(0, 4))}
        <Card key="editable" number={5} title="✏️ 편집 카드 (중간)" lines={lines} />
        {renderCards(CARDS.slice(5, 12))}
      </ColumnPager>
    </>
  );
};

export const EditableContent: Story = {
  name: '데이터 편집 → 즉시 반영',
  parameters: { controls: { disable: true } },
  render: () => <EditableDemo />,
};

/**
 * 순서 섞기 → 재배치 속도 확인.
 * 카드 배열 순서만 바꾼다(내용·크기는 동일). 배치(페이지네이션)는 다시 계산되지만
 * per-item 측정 캐시가 콘텐츠 시그니처 기준이라 DOM 사이즈 측정은 전부 캐시 히트 →
 * 재측정 없이 매우 빠르게 재반영된다. 좌상단에 [섞기]→emit까지 걸린 ms 표시.
 */
const ShuffleDemo = () => {
  const [cards, setCards] = useState(() => CARDS); // 100장
  const [elapsed, setElapsed] = useState<number | null>(null);
  const [pageCount, setPageCount] = useState(0);
  const startRef = useRef(0);

  const shuffle = () => {
    startRef.current = performance.now();
    setCards((prev) => {
      const next = [...prev];
      // Fisher-Yates
      for (let i = next.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [next[i], next[j]] = [next[j], next[i]];
      }
      return next;
    });
  };

  return (
    <>
      <div className="fixed top-2 left-2 z-10 w-[320px] space-y-2 rounded bg-white p-3 shadow">
        <div className="font-mono text-gray-600 text-xs">
          재배치(emit): {elapsed === null ? '-' : `${elapsed}ms`} · 총 {pageCount} 페이지 · 카드{' '}
          {cards.length}개
        </div>
        <div className="max-h-16 overflow-auto font-mono text-[10px] text-gray-400 leading-tight">
          순서: {cards.map((c) => c.number).join(' ')}
        </div>
        <button
          type="button"
          className="rounded bg-blue-600 px-2 py-1 text-white text-xs"
          onClick={shuffle}
        >
          섞기 (순서만 변경)
        </button>
      </div>

      <ColumnPager
        columnCount={2}
        showDividers
        itemGap={ITEM_GAP}
        columnGap={COLUMN_GAP}
        bodyClassName={BODY_CLASS}
        header={({ pageNumber }) => <SampleHeader pageNumber={pageNumber} />}
        footer={({ pageNumber }) => <SampleFooter pageNumber={pageNumber} />}
        onPagesGenerated={(pages) => {
          setPageCount(pages.length);
          if (startRef.current)
            setElapsed(Math.round((performance.now() - startRef.current) * 100) / 100);
        }}
      >
        {renderCards(cards)}
      </ColumnPager>
    </>
  );
};

export const ShuffleOrder: Story = {
  name: '순서 섞기 → 재배치 속도',
  parameters: { controls: { disable: true } },
  render: () => <ShuffleDemo />,
};

/**
 * 넓이/높이 설정.
 * - 높이: `pageHeight` prop으로 직접 지정 (슬라이더).
 * - 넓이: prop이 아니라 컨테이너 폭에 반응 — 래퍼 폭을 슬라이더로 바꾸면
 *   ResizeObserver가 감지(디바운스) 후 재페이지네이션.
 */
type SizingArgs = {
  width: number;
  pageHeight: number;
  columnCount: number;
  showDividers: boolean;
  itemGap: number;
};

export const PageSizing: StoryObj<SizingArgs> = {
  name: '넓이 / 높이 설정',
  args: { width: 794, pageHeight: 1123, columnCount: 2, showDividers: true, itemGap: 16 },
  argTypes: {
    width: {
      control: { type: 'range', min: 360, max: 1200, step: 10 },
      description: '컨테이너 폭(px)',
    },
    pageHeight: {
      control: { type: 'range', min: 480, max: 1400, step: 20 },
      description: '페이지 높이(px)',
    },
    columnCount: { control: { type: 'number', min: 1, max: 4 } },
    showDividers: { control: 'boolean' },
    itemGap: { control: { type: 'range', min: 0, max: 48, step: 2 } },
  },
  render: (args) => (
    <div style={{ width: args.width }}>
      <ColumnPager
        columnCount={args.columnCount}
        pageHeight={args.pageHeight}
        showDividers={args.showDividers}
        itemGap={args.itemGap}
        columnGap={COLUMN_GAP}
        bodyClassName={BODY_CLASS}
        header={({ pageNumber }) => <SampleHeader pageNumber={pageNumber} />}
        footer={({ pageNumber }) => <SampleFooter pageNumber={pageNumber} />}
      >
        {renderCards(CARDS.slice(0, 24))}
      </ColumnPager>
    </div>
  ),
};

// 첫 페이지용(키 큰 커버), 홀수 페이지용, 짝수 페이지용 — 높이를 다 다르게.
const CoverHeader = () => (
  <div className="flex h-[160px] flex-col items-center justify-center gap-1 border-blue-500 border-b-2 bg-blue-50">
    <span className="font-bold text-2xl text-blue-700">표지 헤더 (첫 페이지)</span>
    <span className="text-blue-500 text-sm">키 큰 커버 → 첫 페이지는 컬럼이 짧음</span>
  </div>
);

const OddHeader = ({ pageNumber }: { pageNumber: number }) => (
  <div className="flex h-[64px] items-center justify-between border-emerald-400 border-b bg-emerald-50 px-4">
    <span className="font-medium text-emerald-700 text-sm">홀수 페이지 헤더</span>
    <span className="text-emerald-500 text-xs">p.{pageNumber}</span>
  </div>
);

const EvenHeader = ({ pageNumber }: { pageNumber: number }) => (
  <div className="flex h-[32px] items-center justify-between border-red-300 border-b bg-red-50 px-4">
    <span className="text-gray-600 text-xs">짝수 페이지 헤더</span>
    <span className="text-gray-400 text-xs">p.{pageNumber}</span>
  </div>
);

// 푸터도 커버(첫 페이지)/홀수/짝수 — 높이 다 다르게.
const CoverFooter = () => (
  <div className="flex h-[80px] items-center justify-center border-blue-500 border-t-2 bg-blue-50">
    <span className="font-medium text-blue-700 text-sm">표지 푸터 (첫 페이지)</span>
  </div>
);

const OddFooter = ({ pageNumber }: { pageNumber: number }) => (
  <div className="flex h-[44px] items-center justify-center border-emerald-400 border-t bg-emerald-50">
    <span className="text-emerald-600 text-xs">홀수 페이지 푸터 · p.{pageNumber}</span>
  </div>
);

const EvenFooter = ({ pageNumber }: { pageNumber: number }) => (
  <div className="flex h-[24px] items-center justify-center border-red-300 border-t bg-red-50">
    <span className="text-gray-400 text-xs">짝수 페이지 푸터 · p.{pageNumber}</span>
  </div>
);

/**
 * 페이지별 헤더·푸터 3종: 첫 페이지(키 큰 커버) / 홀수 / 짝수 — 높이가 전부 다름.
 * header·footer에서 pageNumber로 분기만 하면 됨. 각 페이지의 컬럼 높이가 그 페이지의
 * 헤더+푸터 높이로 측정되어, chrome이 큰 페이지는 아이템이 적게 들어간다(자동 반영).
 */
export const PerPageHeaders: Story = {
  name: '첫/홀수/짝수 헤더·푸터',
  args: { columnCount: 2, pageDirection: 'vertical', showDividers: true, itemGap: 16 },
  render: (args) => (
    <ColumnPager
      columnCount={args.columnCount}
      pageDirection={args.pageDirection}
      showDividers={args.showDividers}
      itemGap={args.itemGap}
      columnGap={args.columnGap}
      bodyClassName={args.bodyClassName}
      header={({ pageNumber }) => {
        if (pageNumber === 1) return <CoverHeader />;
        return pageNumber % 2 === 1 ? (
          <OddHeader pageNumber={pageNumber} />
        ) : (
          <EvenHeader pageNumber={pageNumber} />
        );
      }}
      footer={({ pageNumber }) => {
        if (pageNumber === 1) return <CoverFooter />;
        return pageNumber % 2 === 1 ? (
          <OddFooter pageNumber={pageNumber} />
        ) : (
          <EvenFooter pageNumber={pageNumber} />
        );
      }}
    >
      {renderCards(CARDS.slice(0, 40))}
    </ColumnPager>
  ),
};

/**
 * 순서 변경 애니메이션 (framer-motion `layout`).
 *
 * 라이브러리는 framer-motion에 의존하지 않는다. 소비자가 `renderItem`으로 각 셀을
 * `motion.div`(layout + layoutId)로 감싸고, child에 안정적 key를 부여하면(여기선
 * `card.number`) 라이브러리가 그 key를 셀 정체성으로 전파한다(`RenderItemInfo.id`).
 *
 * - 같은 컬럼 내 이동: 같은 인스턴스 유지 → `layout`이 연속 애니메이션
 * - 컬럼/페이지 경계를 넘는 이동: 인스턴스 remount → `layoutId` 공유 전환으로 애니메이션
 * - 슬라이스(큰 아이템 분할)는 1:1 정체성이 없어 애니메이션에서 제외(셀 그대로 렌더)
 *
 * 셀 간격은 `itemGap`으로 준다(컬럼 flex gap + 페이지네이션 누적에 반영).
 *
 * 각 카드의 ▲/▼ 버튼으로 그 카드를 한 칸 위/아래로 이동(이웃과 자리 교환)한다. 측정 후
 * 재페이지네이션이 비동기라, 페이지 경계를 넘는 이동은 살짝 늦거나 튈 수 있다(아키텍처
 * 한계 — 같은 컬럼 내 재배치가 가장 매끈).
 */
const AnimatedReorderDemo = ({
  columnCount,
  showDividers,
  itemGap,
}: {
  columnCount: number;
  showDividers: boolean;
  itemGap: number;
}) => {
  const [order, setOrder] = useState<CardDatum[]>(() => {
    // 일반 카드들 사이에 컬럼 높이를 넘는 큰 카드(TALL_CARD)를 섞어 슬라이스 케이스를 보여준다.
    // 큰 카드는 여러 조각으로 잘려(sliced) 애니메이션/이동 버튼에서 제외된다.
    const base = CARDS.slice(0, 16);
    base.splice(6, 0, TALL_CARD);
    return base;
  });

  // 카드(id=card.number)를 한 칸 위(-1)/아래(+1)로 이동 — 이웃과 자리 교환.
  const move = (id: string, dir: -1 | 1) =>
    setOrder((prev) => {
      const i = prev.findIndex((c) => String(c.number) === id);
      const j = i + dir;
      if (i < 0 || j < 0 || j >= prev.length) return prev;
      const next = prev.slice();
      [next[i], next[j]] = [next[j], next[i]];
      return next;
    });

  const arrowBtn =
    'flex h-7 w-7 items-center justify-center rounded-full bg-blue-600 text-white shadow ' +
    'transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-gray-300';

  // 카드 위에 떠 있는 위/아래 이동 버튼 (셀 overflow 밖). id로 order에서 한 칸 이동.
  const controls = (cardId: string, index: number) => (
    <div className="absolute top-2 right-2 z-10 flex flex-col gap-1">
      <button
        type="button"
        aria-label="위로"
        className={arrowBtn}
        disabled={index <= 0}
        onClick={() => move(cardId, -1)}
      >
        ▲
      </button>
      <button
        type="button"
        aria-label="아래로"
        className={arrowBtn}
        disabled={index < 0 || index >= order.length - 1}
        onClick={() => move(cardId, 1)}
      >
        ▼
      </button>
    </div>
  );

  return (
    <LayoutGroup>
      <ColumnPager
        columnCount={columnCount}
        showDividers={showDividers}
        itemGap={itemGap}
        columnGap={COLUMN_GAP}
        bodyClassName={BODY_CLASS}
        // 애니메이션 중 이동 셀이 컬럼/본문 박스에 잘리지 않도록 클립 해제
        clipOverflow={false}
        header={({ pageNumber }) => <SampleHeader pageNumber={pageNumber} />}
        footer={({ pageNumber }) => <SampleFooter pageNumber={pageNumber} />}
        renderItem={({ id, sliced, sliceIndex, pageNumber, children }) => {
          if (!id) return children;
          const index = order.findIndex((c) => String(c.number) === id);

          // 큰 카드(슬라이스): 조각마다 정체성이 1:1이 아니라 layout 애니메이션은 없다.
          // 순서 변경은 가능 — 첫 조각(sliceIndex===0)에만 컨트롤을 띄우고, 클릭 시 재배치.
          if (sliced) {
            if (sliceIndex !== 0) return children;
            return (
              <div className="relative">
                {controls(id, index)}
                {children}
              </div>
            );
          }

          return (
            <motion.div
              // layoutId에 페이지 번호를 섞는다:
              // - 같은 페이지 내 이동 → layoutId 유지 → 슬라이드(layout 애니메이션)
              // - 페이지 경계를 넘는 이동 → layoutId가 바뀜 → 새 요소로 취급 →
              //   날아가지(공유 전환) 않고 도착 페이지에서 initial opacity로 fade-in.
              //   (출발 페이지에선 즉시 사라짐 — fade-out은 코어 훅 필요, 이번 범위 밖)
              layout
              layoutId={`${id}-p${pageNumber}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              // opacity(fade-in) 포함 전이.
              transition={{ type: 'tween', duration: 0.5 }}
              className="relative"
            >
              {controls(id, index)}
              {children}
            </motion.div>
          );
        }}
      >
        {order.map((card) => (
          // key → block.id → RenderItemInfo.id (layoutId). 간격은 itemGap이 처리.
          <Card key={card.number} {...card} />
        ))}
      </ColumnPager>
    </LayoutGroup>
  );
};

export const AnimatedReorder: Story = {
  name: '순서 변경 애니메이션 (framer-motion)',
  args: { columnCount: 2, pageDirection: 'vertical', showDividers: true, itemGap: 16 },
  render: (args) => (
    <AnimatedReorderDemo
      columnCount={args.columnCount}
      showDividers={args.showDividers}
      itemGap={args.itemGap}
    />
  ),
};

/**
 * 데코레이터 패턴 — `data-cp-decorator` 래퍼로 묶인 자식들이 "같은 프레임(배경/패딩/라운드)"을
 * 입은 채, 각자 독립적으로 컬럼·페이지를 흐른다.
 *
 * - 래퍼 자체는 DOM으로 렌더되지 않는다. 래퍼의 `className`이 각 자식 셀에 전파된다
 *   → 묶음처럼 보이지만 페이지네이션은 아이템 단위로 자연스럽게 흐름.
 * - 프레임의 패딩/보더(chrome) 높이는 빈 래퍼 복제본으로 측정돼 슬라이스 계산에 반영된다
 *   → 큰 카드가 잘려도 각 조각이 프레임 패딩을 유지(그룹 B의 TALL_CARD).
 *
 * 응용: "섹션 박스", "강조 묶음", "카테고리별 배경" 등 — 한 번 감싸면 그룹 전체가 같은
 * 시각 처리를 받으면서도 분할/페이지 넘김은 그대로 동작한다.
 *
 * 셀 간 간격은 `itemGap`이 처리한다(그룹 안/그룹 사이 모두 동일 간격).
 */
const decoFrame = 'rounded-2xl p-10';

export const DecoratorGroups: Story = {
  name: '데코레이터 (프레임 그룹)',
  args: { columnCount: 2, pageDirection: 'vertical', showDividers: true, itemGap: 16 },
  render: (args) => (
    <ColumnPager
      columnCount={args.columnCount}
      pageDirection={args.pageDirection}
      showDividers={args.showDividers}
      itemGap={args.itemGap}
      columnGap={args.columnGap}
      bodyClassName={args.bodyClassName}
      header={({ pageNumber }) => <SampleHeader pageNumber={pageNumber} />}
      footer={({ pageNumber }) => <SampleFooter pageNumber={pageNumber} />}
    >
      {/* 그룹 A: 일반 카드 묶음 — 각 카드가 같은 인디고 프레임을 입고 컬럼을 넘어 흐른다 */}
      <ColumnPager.Decorator className={`${decoFrame} bg-indigo-100`}>
        {CARDS.slice(0, 6).map((c) => (
          <Card key={c.number} {...c} />
        ))}
      </ColumnPager.Decorator>

      {/* 그룹 B: 큰 카드 포함 — 컬럼 높이를 넘어 잘려도 각 조각이 앰버 프레임을 유지 */}
      <ColumnPager.Decorator className={`${decoFrame} bg-amber-100`}>
        <Card {...CARDS[6]} />
        <Card {...TALL_CARD} />
        <Card {...CARDS[7]} />
      </ColumnPager.Decorator>
    </ColumnPager>
  ),
};

/**
 * itemGap — 아이템(카드) 사이 세로 간격.
 *
 * 별도 스페이서 블록(`<div className="h-4" />`)이나 카드 padding 없이 `itemGap` prop 하나로
 * 카드를 그냥 나열하면 된다. 간격은:
 * - **같은 컬럼 아이템 사이에만** 들어가고 **컬럼 첫 아이템 위에는 없음**(고아 갭 방지).
 * - 페이지네이션 누적 높이 계산과 렌더(Column flex gap) 양쪽에 반영돼 어긋나지 않음.
 *
 * 슬라이더로 간격을 바꿔보면 페이지 수/배치가 즉시 다시 계산된다.
 */
type ItemGapArgs = { itemGap: number; columnCount: number; showDividers: boolean };

export const ItemGapStory: StoryObj<ItemGapArgs> = {
  name: '아이템 간격 (itemGap)',
  args: { itemGap: 16, columnCount: 2, showDividers: true },
  argTypes: {
    itemGap: {
      control: { type: 'range', min: 0, max: 48, step: 2 },
      description: '카드(아이템) 사이 간격(px). 컬럼 첫 아이템 위에는 적용되지 않음.',
    },
    columnCount: { control: { type: 'number', min: 1, max: 4 } },
    showDividers: { control: 'boolean' },
  },
  render: (args) => (
    <ColumnPager
      columnCount={args.columnCount}
      itemGap={args.itemGap}
      columnGap={COLUMN_GAP}
      bodyClassName={BODY_CLASS}
      showDividers={args.showDividers}
      header={({ pageNumber }) => <SampleHeader pageNumber={pageNumber} />}
      footer={({ pageNumber }) => <SampleFooter pageNumber={pageNumber} />}
    >
      {/* 스페이서/padding 없이 카드만 나열 — 간격은 itemGap이 처리 */}
      {CARDS.slice(0, 20).map((c) => (
        <Card key={c.number} {...c} />
      ))}
    </ColumnPager>
  ),
};
