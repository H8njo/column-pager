# Tutorial — build your first multi-column document

Starting from install, you'll auto-paginate a list of cards into 2-column pages, watch pages wrap, and finally extract a section table of contents. By the end you'll understand ColumnPager's core flow.

## Prerequisites

- A React 18 or 19 project (Vite, etc.)
- Tailwind CSS v3.4+ or v4 configured (ColumnPager draws its layout with Tailwind classes)

## Step 1: Install and register with Tailwind

```bash
pnpm add column-pager
```

Add the package to Tailwind's content scan so ColumnPager's classes are not purged.

Tailwind v4 (CSS file):

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

## Step 2: Render your first page

Put a few cards into ColumnPager. Width is decided by the parent (`width: 600`); height is given with `pageHeight`. Use `itemGap` for spacing between cards instead of margins.

```tsx
import { ColumnPager } from 'column-pager';

const CARDS = Array.from({ length: 12 }, (_, i) => ({
  id: i + 1,
  title: `Card ${i + 1}`,
  body: 'Body text goes here. '.repeat(8),
}));

export function Demo() {
  return (
    <div style={{ width: 600 }}>
      <ColumnPager columnCount={2} pageHeight={700} itemGap={16} showDividers>
        {CARDS.map((c) => (
          <article key={c.id} className="rounded border p-3">
            <h3 className="font-bold">{c.title}</h3>
            <p className="text-sm text-gray-600">{c.body}</p>
          </article>
        ))}
      </ColumnPager>
    </div>
  );
}
```

Render this and the cards **fill 2 columns, and a second page appears automatically once content exceeds 700px.** You see your first result right here. Add more cards or lower `pageHeight` to get more pages.

> If nothing shows: check that the parent `div` has a width and that you registered the package with Tailwind. Measurement needs real browser layout.

## Step 3: Add a header and footer

`header`/`footer` are functions that receive `pageNumber`. They are called per page.

```tsx
<ColumnPager
  columnCount={2}
  pageHeight={700}
  itemGap={16}
  showDividers
  header={({ pageNumber }) => (
    <div className="flex h-10 items-center justify-between border-b px-2 text-sm">
      <span>My Document</span>
      <span>p.{pageNumber}</span>
    </div>
  )}
  footer={({ pageNumber }) => (
    <div className="flex h-6 items-center justify-center text-xs text-gray-400">- {pageNumber} -</div>
  )}
>
  {/* ...cards... */}
</ColumnPager>
```

Now each page has a header/footer. The column height is computed with the header + footer subtracted, so fewer cards fit per column.

## Step 4: Divide into sections and extract a table of contents

Divide content into sections with `ColumnPager.SectionMark`, then in `onPagesGenerated` get the page span of each section with `getSectionPageRanges`.

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
        {CARDS.slice(0, 6).map((c) => <article key={c.id}>{c.title}</article>)}

        <ColumnPager.SectionMark section="appendix" />
        {CARDS.slice(6).map((c) => <article key={c.id}>{c.title}</article>)}
      </ColumnPager>
    </div>
  );
}
```

The `<pre>` prints a TOC like `{"intro":[1,1],"appendix":[1,2]}` (actual values depend on content volume). `onPagesGenerated` fires whenever pagination finishes, keeping the TOC in sync.

## What you built

- Auto-split a list of cards into 2-column, fixed-height pages,
- added a header/footer per page,
- and divided content into sections to extract page ranges (a TOC).

To go further:

- Forced page/column breaks, per-page column counts, tight fill, keep-together, layout animation, async content, HTML/PDF export → [How-to](how-to.md)
- Every prop, type, and utility → [Reference](reference.md)
- How measurement, slicing, and responsiveness work → [Explanation](explanation.md)
