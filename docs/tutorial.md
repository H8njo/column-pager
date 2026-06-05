# Tutorial — 첫 멀티컬럼 문서 만들기

설치부터 시작해, 카드 목록을 2컬럼 페이지로 자동 분할하고, 페이지가 넘어가는 걸 직접 보고, 마지막엔
섹션 목차까지 뽑는 동작하는 예제를 만든다. 끝나면 ColumnPager의 핵심 흐름을 이해하게 된다.

## 준비물

- React 18 또는 19 프로젝트 (Vite 등)
- Tailwind CSS v3.4+ 또는 v4 설정 (ColumnPager는 레이아웃을 Tailwind 클래스로 그린다)

## 1단계: 설치하고 Tailwind에 등록

```bash
pnpm add column-pager
```

ColumnPager의 클래스가 purge되지 않도록 Tailwind content 스캔에 패키지를 추가한다.

Tailwind v4 (CSS 파일):

```css
@import 'tailwindcss';
@source '../node_modules/column-pager/dist/**/*.{js,cjs}';
```

Tailwind v3 (`tailwind.config.js`):

```js
export default {
  content: ['./src/**/*.{ts,tsx}', './node_modules/column-pager/dist/**/*.{js,cjs}'],
};
```

## 2단계: 화면에 첫 페이지 띄우기

카드 몇 개를 ColumnPager에 넣는다. 폭은 부모(`width: 600`)가 정하고, 높이는 `pageHeight`로 준다.

```tsx
import { ColumnPager } from 'column-pager';

const CARDS = Array.from({ length: 12 }, (_, i) => ({
  id: i + 1,
  title: `카드 ${i + 1}`,
  body: '여기에 본문이 들어갑니다. '.repeat(8),
}));

export function Demo() {
  return (
    <div style={{ width: 600 }}>
      <ColumnPager columnCount={2} pageHeight={700} showDividers>
        {CARDS.map((c) => (
          <article key={c.id} className="mb-4 rounded border p-3">
            <h3 className="font-bold">{c.title}</h3>
            <p className="text-sm text-gray-600">{c.body}</p>
          </article>
        ))}
      </ColumnPager>
    </div>
  );
}
```

이 화면을 띄우면 카드들이 **2컬럼으로 채워지고, 700px를 넘으면 둘째 페이지가 자동으로 생긴다.**
첫 결과가 여기서 바로 보인다. 카드 수를 늘리거나 `pageHeight`를 줄이면 페이지가 더 늘어난다.

> 아무것도 안 보이면: 부모 `div`에 폭이 잡혀 있는지, Tailwind에 패키지를 등록했는지 확인하라.
> 측정은 실제 브라우저 레이아웃이 필요하다.

## 3단계: 헤더·푸터 붙이기

`header`/`footer`는 `pageNumber`를 받는 함수다. 페이지마다 호출된다.

```tsx
<ColumnPager
  columnCount={2}
  pageHeight={700}
  showDividers
  header={({ pageNumber }) => (
    <div className="flex h-10 items-center justify-between border-b px-2 text-sm">
      <span>내 문서</span>
      <span>{pageNumber}쪽</span>
    </div>
  )}
  footer={({ pageNumber }) => (
    <div className="flex h-6 items-center justify-center text-xs text-gray-400">- {pageNumber} -</div>
  )}
>
  {/* ...카드... */}
</ColumnPager>
```

이제 각 페이지에 머리말/꼬리말이 붙는다. 컬럼 높이는 헤더+푸터를 뺀 만큼으로 자동 계산돼, 한 컬럼에
들어가는 카드 수가 그만큼 줄어든다.

## 4단계: 섹션으로 나누고 목차 뽑기

`ColumnPager.SectionMark`로 콘텐츠를 섹션으로 나누고, `onPagesGenerated`에서 `getSectionPageRanges`로
각 섹션이 몇 쪽에 걸치는지 얻는다.

```tsx
import { ColumnPager, getSectionPageRanges } from 'column-pager';
import { useState } from 'react';

export function Workbook() {
  const [toc, setToc] = useState<Record<string, [number, number]>>({});

  return (
    <div style={{ width: 600 }}>
      <pre className="text-xs">{JSON.stringify(toc)}</pre>

      <ColumnPager
        columnCount={2}
        pageHeight={700}
        onPagesGenerated={(pages) => setToc(getSectionPageRanges(pages))}
      >
        <ColumnPager.SectionMark section="intro" />
        {CARDS.slice(0, 6).map((c) => <article key={c.id} className="mb-4">{c.title}</article>)}

        <ColumnPager.SectionMark section="appendix" />
        {CARDS.slice(6).map((c) => <article key={c.id} className="mb-4">{c.title}</article>)}
      </ColumnPager>
    </div>
  );
}
```

`<pre>`에 `{"intro":[1,1],"appendix":[1,2]}` 같은 목차가 찍힌다(실제 값은 콘텐츠 양에 따라 다름).
페이지네이션이 끝날 때마다 `onPagesGenerated`가 불려 목차가 갱신된다.

## 만든 것

- 카드 목록을 2컬럼 × 고정 높이 페이지로 자동 분할했고,
- 페이지마다 헤더·푸터를 붙였고,
- 섹션을 나눠 페이지 범위(목차)를 뽑았다.

여기서 더 나아가려면:

- 강제 페이지/컬럼 넘김, 컬럼 수 변경, 비동기 콘텐츠, HTML/PDF 내보내기 → [How-to](how-to.md)
- 모든 prop·타입·유틸 → [레퍼런스](reference.md)
- 측정·슬라이스·반응형이 동작하는 원리 → [설명](explanation.md)
