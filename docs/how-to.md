# How-to — 작업별 레시피

특정 작업을 어떻게 하는지. ColumnPager 기본 사용법을 안다고 가정한다(모르면 [튜토리얼](tutorial.md) 먼저).
전체 prop/타입은 [레퍼런스](reference.md), 원리는 [설명](explanation.md).

모든 예제는 `import { ColumnPager } from 'column-pager';`를 전제한다.

## 페이지/컬럼을 강제로 넘기기

`ColumnPager.PageBreak` / `ColumnPager.ColumnBreak`를 children 사이에 끼운다.

```tsx
<ColumnPager columnCount={2}>
  <Card a />
  <ColumnPager.ColumnBreak />   {/* 다음 컬럼으로 (마지막 컬럼이면 다음 페이지) */}
  <Card b />
  <ColumnPager.PageBreak />     {/* 무조건 다음 페이지로 */}
  <Card c />
</ColumnPager>
```

### 페이지마다 컬럼 수 바꾸기

`PageBreak`의 `changeColumnCountTo`로 그 넘김 이후 페이지의 컬럼 수를 바꾼다.

```tsx
<ColumnPager columnCount={1}>
  <Cover />                                           {/* 1컬럼 표지 */}
  <ColumnPager.PageBreak changeColumnCountTo={2} />
  {body.map((b) => <Card key={b.id} {...b} />)}       {/* 2컬럼 본문 */}
  <ColumnPager.PageBreak changeColumnCountTo={3} />
  {appendix.map((a) => <Card key={a.id} {...a} />)}   {/* 3컬럼 부록 */}
</ColumnPager>
```

**검증:** 각 페이지 폭은 그대로지만 컬럼 수가 1→2→3으로 바뀌고, 컬럼 수가 바뀐 페이지의 콘텐츠는
새 컬럼 폭으로 다시 측정된다.

## 페이지마다 다른 헤더·푸터 (높이 달라도 됨)

`header`/`footer`는 `pageNumber`를 받는 함수다. 분기만 하면 된다. 각 페이지의 컬럼 높이는 그 페이지의
헤더+푸터 높이를 빼고 측정되므로, chrome이 큰 페이지엔 아이템이 적게 들어간다(자동 반영).

```tsx
<ColumnPager
  columnCount={2}
  header={({ pageNumber }) => {
    if (pageNumber === 1) return <CoverHeader />;            // 첫 페이지: 키 큰 커버
    return pageNumber % 2 === 1 ? <OddHeader p={pageNumber} /> : <EvenHeader p={pageNumber} />;
  }}
  footer={({ pageNumber }) => (pageNumber === 1 ? <CoverFooter /> : <SmallFooter p={pageNumber} />)}
>
  {children}
</ColumnPager>
```

> "총 N쪽 중 n쪽"처럼 **마지막 페이지 번호**가 필요한 헤더는 단일 패스로는 안 된다([설명](explanation.md)의
> 트레이드오프 참고). 첫/홀수/짝수 분기는 문제없이 동작한다.

## 비동기 콘텐츠가 다 그려진 뒤에 내보내기

이미지나 원격 데이터로 높이가 나중에 정해지는 콘텐츠는 `ColumnPager.StableGate`로 감싸고, 준비되면
`stable={true}`로 알린다. ColumnPager는 모든 게이트가 stable일 때까지 `onPagesGenerated` emit을
미룬다(무한 대기 방지용 `stableTimeoutMs` 폴백 있음).

```tsx
function Report() {
  const [loaded, setLoaded] = useState(false);
  useEffect(() => { fetchData().then(() => setLoaded(true)); }, []);

  return (
    <ColumnPager onPagesGenerated={(pages) => console.log('settled:', pages.length)}>
      <ColumnPager.StableGate stable={loaded}>
        {loaded ? <Chart data={data} /> : <Skeleton />}
      </ColumnPager.StableGate>
    </ColumnPager>
  );
}
```

**검증:** 로드 전엔 emit이 안 일어나고, `loaded`가 `true`가 돼 게이트가 settle되면 그때 한 번 emit된다.
로드 전후로 페이지 수가 달라질 수 있다.

## 렌더된 HTML 내보내기 (PDF 등)

`onPagesGenerated`의 둘째 인자가 렌더된 컨테이너 `outerHTML`이다. 라이브러리는 **렌더 결과만** 준다.
완전한 문서로 감싸 PDF로 만드는 변환은 소비자가 한다. 화면에 안 띄우고 측정/emit만 하려면 `hidden`.

```tsx
function toDocument(bodyHtml: string): string {
  // 현재 페이지의 스타일시트를 인라인해 독립 문서로 만든다
  const styles = Array.from(document.styleSheets)
    .map((s) => { try { return Array.from(s.cssRules).map((r) => r.cssText).join('\n'); } catch { return ''; } })
    .join('\n');
  return `<!doctype html><html><head><style>${styles}</style></head><body>${bodyHtml}</body></html>`;
}

function PdfSource({ children }) {
  return (
    <ColumnPager
      hidden
      columnCount={2}
      onPagesGenerated={(_pages, html) => {
        const doc = toDocument(html);
        // doc를 새 창/iframe/서버 PDF 변환기로 넘긴다
      }}
    >
      {children}
    </ColumnPager>
  );
}
```

> `hidden`을 써도 폭은 정상 측정된다(화면 밖이 아니라 높이 0으로 접어둔 형태). 측정이 0이 되어
> emit이 영영 안 나오는 일은 없다.

## 섹션별 페이지 범위 뽑기 (목차)

`ColumnPager.SectionMark`로 콘텐츠를 섹션으로 나누고, `getSectionPageRanges`로 각 섹션의 페이지 범위를
얻는다. 목차나 인덱스 생성에 쓴다.

```tsx
import { ColumnPager, getSectionPageRanges } from 'column-pager';

function Workbook() {
  const [ranges, setRanges] = useState({});
  return (
    <>
      <pre>{JSON.stringify(ranges)} {/* { vocabulary: [1,3], grammar: [4,6] } */}</pre>
      <ColumnPager columnCount={2} onPagesGenerated={(pages) => setRanges(getSectionPageRanges(pages))}>
        <ColumnPager.SectionMark section="vocabulary" />
        {vocab.map((v) => <Card key={v.id} {...v} />)}
        <ColumnPager.SectionMark section="grammar" />
        {grammar.map((g) => <Card key={g.id} {...g} />)}
      </ColumnPager>
    </>
  );
}
```

특정 아이템이 몇 쪽에 처음 나오는지는 `findItemPage(pages, blockIndex)`로 얻는다.

## 큰 아이템을 자르는 대신 다음 컬럼으로 보내기

컬럼 높이를 넘는 아이템이 이미 채워진 컬럼 중간에서 시작해 잘리는 게 싫으면
`moveOversizedItemToNextColumn`을 켠다. 그 아이템을 빈 컬럼 맨 위로 보낸 뒤 슬라이스를 시작한다.

```tsx
<ColumnPager columnCount={2} moveOversizedItemToNextColumn>
  {children}
</ColumnPager>
```

## 페이지 높이 지정 / 폭 반응형 다루기

높이는 `pageHeight`(px) prop. 폭은 prop이 아니라 **부모 컨테이너 폭**에 맞춰 반응형이다.

```tsx
<div style={{ width: 794 }}>            {/* 폭은 이 래퍼가 결정 */}
  <ColumnPager pageHeight={1123}>       {/* 높이만 지정 */}
    {children}
  </ColumnPager>
</div>
```

리사이즈는 `resizeDebounceMs`(기본 150ms) 후 한 번 재페이지네이션한다.

### 슬라이스가 두 번 그려지는(translateX 점프) 현상 없애기

내용이 길어 세로 스크롤바가 뒤늦게 생기면 가용 폭이 줄어 재페이지네이션이 한 번 더 일어난다. 스크롤
컨테이너에 거터를 미리 예약하면 사라진다.

```css
html { scrollbar-gutter: stable; }
```

## 트러블슈팅

- **아무것도 안 보인다 / 페이지가 0개.** 컨테이너 폭이 0으로 측정되면 페이지네이션이 보류된다. 부모에
  폭이 잡히는지, SSR로 서버에서 렌더 중은 아닌지 확인. 측정은 브라우저 레이아웃이 필요하다.
- **스타일이 안 먹는다.** Tailwind content 스캔에 패키지를 포함했는지 확인(README의 설치 절). 클래스가
  purge되면 레이아웃이 깨진다.
- **`onPagesGenerated`가 안 불린다.** StableGate가 영영 stable이 안 되면 `stableTimeoutMs`까지 기다린
  뒤 `onStableTimeout` 후 강제 emit된다. `stable`을 실제로 `true`로 만드는지 확인.
- **편집 반영이 느리다.** 한 아이템만 바꾸면 그 아이템만 재측정된다. 카드 컴포넌트를 `React.memo`로
  감싸면 안 바뀐 카드의 재렌더도 줄어든다.

## 관련 문서

- [튜토리얼](tutorial.md) · [레퍼런스](reference.md) · [설명: 동작 원리](explanation.md)
