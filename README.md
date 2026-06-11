# column-pager

Automatically paginate React children into **responsive, multi-column pages**.

- Small items flow down a column and continue into the next column/page when they overflow.
- Items taller than a column are sliced with a CSS multi-column technique and continue across columns/pages.
- Width is responsive to the container (`ResizeObserver` + debounce); height is set with the `pageHeight` prop.
- Supports forced page/column breaks, per-page headers/footers, section metadata, async content gates, grouping frames, keep-together blocks, layout-animation hooks, and rendered-HTML emission.

> Measurement relies on real browser layout (off-screen `getBoundingClientRect`).
> In SSR/Node the container width measures as `0`, so pagination is deferred until it runs in a browser.

## Install

```bash
pnpm add column-pager
# or
npm install column-pager
```

### peerDependencies

| Package | Version |
|---|---|
| `react` | ^18 \|\| ^19 |
| `react-dom` | ^18 \|\| ^19 |
| `tailwindcss` | ^3.4 \|\| ^4 |

ColumnPager renders its layout with **Tailwind utility classes**. Your project must have Tailwind set up, and you must include the package in Tailwind's content scan so its classes are not purged.

Tailwind v4 (CSS):

```css
@import 'tailwindcss';
@source '../node_modules/column-pager/dist/**/*.{js,cjs}';
```

Tailwind v3 (`tailwind.config`):

```js
export default {
  content: ['./src/**/*.{ts,tsx}', './node_modules/column-pager/dist/**/*.{js,cjs}'],
};
```

## Quick start

```tsx
import { ColumnPager } from 'column-pager';

export function Report({ items }) {
  return (
    <ColumnPager
      columnCount={2}
      pageHeight={1123}
      itemGap={16}
      showDividers
      header={({ pageNumber }) => <div className="h-10">My Document · p.{pageNumber}</div>}
      footer={({ pageNumber }) => <div className="h-6 text-center">- {pageNumber} -</div>}
    >
      {items.map((it) => (
        <article key={it.id}>{it.body}</article>
      ))}
    </ColumnPager>
  );
}
```

Width shrinks to fit the parent container, and a new page is created automatically whenever the content exceeds one page.

## Core concepts

- **Page**: width = container width (responsive), height = `pageHeight` (px). Laid out vertically or horizontally.
- **Column**: a vertical column inside a page. Set the count with `columnCount`; it can change per page.
- **Flow placement**: small items fill a column and continue into the next column/page when they overflow.
- **Slice**: an item taller than a column is cut into pieces via CSS multi-column and continued across columns/pages.
- **Compound controls**: render-free markers you interleave between children to steer the flow.

## Compound controls

```tsx
<ColumnPager columnCount={1}>
  <Cover />
  <ColumnPager.PageBreak changeColumnCountTo={2} />   {/* next page + 2 columns from here on */}
  <ColumnPager.SectionMark section="vocabulary" />     {/* section label for following content */}
  <Card />
  <ColumnPager.ColumnBreak />                           {/* move to next column */}
  <Card />
  <ColumnPager.StableGate stable={loaded}>              {/* gate emission on async render */}
    <AsyncChart />
  </ColumnPager.StableGate>
  <ColumnPager.Decorator className="border rounded p-4">{/* wrap children in one shared frame */}
    <Card /><Card />
  </ColumnPager.Decorator>
  <ColumnPager.KeepTogether>                            {/* never split this across a boundary */}
    <Table />
  </ColumnPager.KeepTogether>
</ColumnPager>
```

## Spacing, packing, and layout animation

```tsx
<ColumnPager
  columnCount={2}
  itemGap={16}        // vertical gap between items in a column (not above the first item)
  columnGap={40}      // horizontal gap between columns
  bodyClassName="px-8 py-5"  // padding around the column area
  tightFill={8}       // pack columns tight: slice boundary items to fill leftover space
>
  {items.map((it) => <Card key={it.id} {...it} />)}
</ColumnPager>
```

`renderItem` lets you wrap each placed cell for layout animation (e.g. framer-motion). The library does not depend on framer-motion; you return your own wrapper. A stable identity (`info.id`) comes from the React `key` you put on each child.

```tsx
<ColumnPager columnCount={2} clipOverflow={false} renderItem={({ id, sliced, children }) =>
  sliced ? children : <motion.div layout layoutId={id}>{children}</motion.div>
}>
  {items.map((it) => <Card key={it.id} {...it} />)}
</ColumnPager>
```

## Emitting rendered HTML (PDF / document conversion)

`onPagesGenerated(pages, html)` gives you the pagination result and the rendered container `outerHTML`. Wrapping that HTML into a full document for PDF is **the consumer's job** — the library only emits the rendered result.

```tsx
<ColumnPager
  hidden                                   // off-screen: measure and emit only, nothing on screen
  onPagesGenerated={(pages, html) => {
    // `html` is the rendered outerHTML. Inline stylesheets and wrap it into a
    // standalone document for PDF, etc.
  }}
>
  {children}
</ColumnPager>
```

## API at a glance

```ts
import {
  ColumnPager,          // main component (+ .PageBreak / .ColumnBreak / .SectionMark / .StableGate / .Decorator / .KeepTogether)
  isSliced,             // is this placement a slice piece?
  getPageCount,         // total page count
  findItemPage,         // page (1-based) where an item first appears
  getSectionPageRanges, // per-section [start, end] page ranges
} from 'column-pager';

import type {
  ColumnPagerProps, PageInfo, RenderItemInfo,
  PageBreakProps, SectionMarkProps, StableGateProps, DecoratorProps, KeepTogetherProps,
  Page, Column, Placement, Slice, Size, SectionPageRanges,
} from 'column-pager';
```

See [docs/reference.md](docs/reference.md) for the full props/types/utilities.

## Documentation

- [Tutorial — from zero to a working example](docs/tutorial.md)
- [How-to — task recipes](docs/how-to.md) (page/column breaks, per-page headers/footers, async content, spacing & tight fill, keep-together, layout animation, HTML export, section ranges)
- [Reference — full API](docs/reference.md)
- [Explanation — how pagination works](docs/explanation.md) (measurement, slicing, responsiveness, caching)

## Development

```bash
pnpm install
pnpm storybook     # explore behavior in Storybook (real browser measurement)
pnpm test:run      # unit tests
pnpm build         # library bundle (ESM + CJS + d.ts)
```

## Release (automated)

When a PR merges to `main`, [semantic-release](https://semantic-release.gitbook.io/) reads the commit messages ([Conventional Commits](https://www.conventionalcommits.org/)) to decide the version, then handles the CHANGELOG, git tag, GitHub release, and npm publish.

| Commit type | Version |
|---|---|
| `fix:` / `perf:` | patch |
| `feat:` | minor |
| `feat!:` or `BREAKING CHANGE:` in the body | major |
| `docs:` / `chore:` / `refactor:` / `test:` / `ci:` | no release |

Setup:
- Add `NPM_TOKEN` (an npm token for automated publishing) under repository **Settings → Secrets → Actions**.
- The first automated release defaults to `1.0.0`. To stay on `0.x`, create a baseline tag on `main` before the first merge: `git tag v0.1.0 && git push origin v0.1.0`.

No manual tagging needed — merging is releasing.

## License

MIT
