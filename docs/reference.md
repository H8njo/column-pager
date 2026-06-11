# Reference — column-pager API

Every public surface `column-pager` exports. Values and defaults are taken directly from the source (`src/components/ColumnPager`).

- For a quick start see the [tutorial](tutorial.md), for task recipes the [how-to](how-to.md), and for how it works the [explanation](explanation.md).

## `<ColumnPager>`

The main component that paginates children into responsive multi-column pages.

```tsx
import { ColumnPager } from 'column-pager';
```

### Props (`ColumnPagerProps`)

| Prop | Type | Default | Description |
|---|---|---|---|
| `children` | `ReactNode` | — | Content to paginate. You can interleave compound controls. |
| `columnCount` | `number` | `1` | Columns per page. Changeable per page via `PageBreak.changeColumnCountTo`. Zero/negative/fractional values are clamped to an integer ≥ 1. |
| `pageDirection` | `'vertical' \| 'horizontal'` | `'vertical'` | Direction pages are laid out. |
| `pageHeight` | `number` | `1123` | Page height (px). Width is not a prop — it is responsive to the container. Values ≤ `0` fall back to the default. |
| `resizeDebounceMs` | `number` | `150` | Debounce (ms) from a container-width change to re-pagination. |
| `loading` | `boolean` | — | When `true`, computation/render is deferred. |
| `hidden` | `boolean` | — | Hide from screen while keeping the DOM (for measurement / `onPagesGenerated`). |
| `columnClassName` | `string` | — | Class applied to each column. |
| `bodyClassName` | `string` | — | Class applied to the body (the box that holds the columns). Use for padding, etc. No padding by default. |
| `columnGap` | `number` | `0` | Horizontal gap between columns (px). |
| `itemGap` | `number` | `0` | Vertical gap between items in the same column (px). Not applied above the first item in a column (flex-col gap semantics). Reflected in both pagination height math and render, so no spacer elements are needed. |
| `showDividers` | `boolean` | — | Show divider lines between columns. |
| `clipOverflow` | `boolean` | `true` | Whether the column/body boxes clip. When `false`, Column and Body become `overflow-visible` so cells moving during `renderItem` layout animation are not clipped (slice and page-height clipping are still kept). |
| `moveOversizedItemToNextColumn` | `boolean` | `false` | For an item taller than the column, when the current column is already partly filled, move it to the next column before slicing. |
| `tightFill` | `number` | `0` | Minimum-leftover (px) threshold for packing columns tight. A boundary item (taller than the leftover space) is sliced to fill the leftover and continued into the next column/page. `0`/unset: no slicing — the boundary item moves whole to the next column/page (leftover allowed, box preserved). `N` (px): slice only when the leftover exceeds `N` (small leftovers move whole). Atomic boxes (e.g. `inline-block`) fall back to moving whole. (Items taller than the column itself are always sliced, regardless of this option.) |
| `header` | `(info: PageInfo) => ReactNode` | — | Render a page header. Branch on `pageNumber` for per-page variation. |
| `footer` | `(info: PageInfo) => ReactNode` | — | Render a page footer. |
| `renderItem` | `(info: RenderItemInfo) => ReactNode` | — | Optional wrapper around each placed cell, for layout animation (e.g. framer-motion) on reorder/move. The library does not depend on framer-motion; you return your own `motion.div(layoutId)` etc. When unset, cells render as-is. |
| `onPagesGenerated` | `(pages: Page[], html: string) => void` | — | Called when pages are generated. `html` is the rendered container `outerHTML`. |
| `stableTimeoutMs` | `number` | `5000` | StableGate settle-polling timeout (ms). On timeout, `onStableTimeout` fires and emission is forced. |
| `onStableTimeout` | `() => void` | — | Called when settle polling times out. |
| `onError` | `(error: unknown) => void` | — | Called when pagination (measurement/computation) fails. |

### `PageInfo`

Argument to the `header`/`footer` render functions.

```ts
type PageInfo = {
  pageNumber: number;   // 1-based
  section?: string;     // the page's representative section (when SectionMark is used)
};
```

### `RenderItemInfo`

Argument to the `renderItem` wrapper. Passed when wrapping a single placed cell.

```ts
type RenderItemInfo = {
  id?: string;          // stable identity from the consumer child key (undefined if no key). Used as the layout-animation id.
  blockIndex: number;   // content block index (position-based)
  sliced: boolean;      // is this a slice piece of a tall item? (layout animation not recommended when true)
  sliceIndex?: number;  // slice piece index (from 0). undefined when not a slice.
  sliceCount?: number;  // total number of slice pieces. undefined when not a slice.
  pageNumber: number;   // page number (from 1)
  children: ReactNode;  // the rendered cell (ItemCell/SliceView) — wrap this with motion, etc. and return it
};
```

### Compound static properties

| Property | Description |
|---|---|
| `ColumnPager.PageBreak` | Forced page break |
| `ColumnPager.ColumnBreak` | Forced column break |
| `ColumnPager.SectionMark` | Section label |
| `ColumnPager.StableGate` | Async-render completion gate |
| `ColumnPager.Decorator` | Wrap children in one shared frame class (splitting still happens per item) |
| `ColumnPager.KeepTogether` | Keep the wrapped content from splitting at a boundary — move it whole to the next column/page |

---

## Compound controls

Controls are **render-free markers** you interleave between children to steer placement. ColumnPager recognizes them by type and draws nothing on screen.

### `<ColumnPager.PageBreak>`

Forced page break. Following content starts on the next page.

```ts
type PageBreakProps = {
  changeColumnCountTo?: number; // column count to apply from this break onward
};
```

### `<ColumnPager.ColumnBreak>`

Forced column break. Following content starts in the next column; on the last column it moves to the next page. No props.

### `<ColumnPager.SectionMark>`

Section label. Following content belongs to this section until the next `SectionMark` (sticky). Used with `getSectionPageRanges` to extract per-section page ranges.

```ts
type SectionMarkProps = {
  section: string;
};
```

### `<ColumnPager.StableGate>`

Wrap children that render asynchronously (images, remote data). Set `stable={true}` when ready. Before emitting HTML via `onPagesGenerated`, ColumnPager polls until every StableGate is stable (with a timeout fallback). Forwards all `div` attributes.

```ts
type StableGateProps = PropsWithChildren<
  HTMLAttributes<HTMLDivElement> & {
    stable: boolean;
  }
>;
```

### `<ColumnPager.Decorator>`

Wrap children in one shared `className` frame (border/background/padding, etc.). The wrapper itself is not rendered into the layout; ColumnPager recognizes it by type, unwraps the children, and propagates `className` to each child cell. It looks like one group, but splitting and page breaks happen per item. The frame's padding/border (chrome) height is measured from an empty clone and factored into slice math.

```ts
type DecoratorProps = {
  className?: string;  // frame class propagated to the whole group; applied to each child cell.
  children?: ReactNode;
};
```

### `<ColumnPager.KeepTogether>`

Keep the wrapped content from being split line-by-line at a column/page boundary — move it whole to the next column/page instead. Because slicing is CSS-multicol based, this works by applying `break-inside: avoid` (inline style). Wrap things that should travel together: lists, tables, code blocks, image captions. If the content is taller than a column, avoidance is impossible and the browser splits it anyway. Forwards all `div` attributes.

```ts
type KeepTogetherProps = HTMLAttributes<HTMLDivElement> & {
  children?: ReactNode;
};
```

---

## Utilities

Pure functions for querying the pagination result (`Page[]`). Use them on the `pages` from `onPagesGenerated`.

### `isSliced(placement: Placement): boolean`

Whether the placement is a slice (cut) piece of a tall item.

### `getPageCount(pages: Page[]): number`

Total page count.

### `findItemPage(pages: Page[], blockIndex: number): number`

The page number (1-based) where a content block (`blockIndex`) first appears, or `-1` if absent. Useful for tables of contents / bookmarks.

### `getSectionPageRanges(pages: Page[]): SectionPageRanges`

The page range each section spans.

```ts
type SectionPageRanges = Record<string, [number, number]>; // 1-based [start, end]

getSectionPageRanges(pages);
// { vocabulary: [1, 3], grammar: [4, 6], answers: [7, 8] }
```

---

## Public types

The shape of the pagination result passed to `onPagesGenerated`.

```ts
type Size = { width: number; height: number };

// The result is 3-dimensional: Page[] → Column[] → Placement[]
type Page = Column[];        // the columns of one page
type Column = Placement[];   // the items placed in one column

type Placement = {
  blockIndex: number;   // content block index (to look up the render node)
  pageIndex: number;    // 0-based
  columnIndex: number;  // 0-based
  columnCount: number;  // column count of that page
  section?: string;     // section set by SectionMark
  slice?: Slice;        // slice piece meta when sliced (absent for normal placement)
};

type Slice = {
  index: number;        // piece index (from 0)
  count: number;        // total piece count
  clipHeight: number;   // outer clip height
  carryOffset: number;  // height carried over from the previous column
  shiftX: number;       // horizontal shift (px) — translateX(-shiftX)
  shiftY: number;       // vertical shift (px) — first piece's carryOffset correction
  innerHeight: number;  // inner content height
  paddingHeight: number;// decorator padding/border height (one side)
};
```

`pageIndex`/`columnIndex` are 0-based; `PageInfo.pageNumber` and the utility page numbers are 1-based.

## Related docs

- [Tutorial](tutorial.md) · [How-to](how-to.md) · [Explanation: how it works](explanation.md)
