# How-to — task recipes

How to do specific tasks. Assumes you know the basics of ColumnPager (if not, start with the [tutorial](tutorial.md)).
For all props/types see the [reference](reference.md); for the why, the [explanation](explanation.md).

Every example assumes `import { ColumnPager } from 'column-pager';`.

## Force a page/column break

Interleave `ColumnPager.PageBreak` / `ColumnPager.ColumnBreak` between children.

```tsx
<ColumnPager columnCount={2}>
  <Card a />
  <ColumnPager.ColumnBreak />   {/* next column (next page if on the last column) */}
  <Card b />
  <ColumnPager.PageBreak />     {/* always the next page */}
  <Card c />
</ColumnPager>
```

### Change the column count per page

Use `PageBreak`'s `changeColumnCountTo` to change the column count of pages after that break.

```tsx
<ColumnPager columnCount={1}>
  <Cover />                                           {/* 1-column cover */}
  <ColumnPager.PageBreak changeColumnCountTo={2} />
  {body.map((b) => <Card key={b.id} {...b} />)}       {/* 2-column body */}
  <ColumnPager.PageBreak changeColumnCountTo={3} />
  {appendix.map((a) => <Card key={a.id} {...a} />)}   {/* 3-column appendix */}
</ColumnPager>
```

**Verify:** each page keeps its width, but the column count changes 1 → 2 → 3, and content on a page whose column count changed is re-measured at the new column width.

## Different headers/footers per page (heights may differ)

`header`/`footer` are functions that receive `pageNumber`. Just branch. Each page's column height is measured with that page's header + footer subtracted, so pages with taller chrome fit fewer items (handled automatically).

```tsx
<ColumnPager
  columnCount={2}
  header={({ pageNumber }) => {
    if (pageNumber === 1) return <CoverHeader />;            // first page: tall cover
    return pageNumber % 2 === 1 ? <OddHeader p={pageNumber} /> : <EvenHeader p={pageNumber} />;
  }}
  footer={({ pageNumber }) => (pageNumber === 1 ? <CoverFooter /> : <SmallFooter p={pageNumber} />)}
>
  {children}
</ColumnPager>
```

> A header that needs the **last page number** (e.g. "page n of N") cannot be done in a single pass (see the trade-offs in the [explanation](explanation.md)). First/odd/even branching works fine.

## Space items without spacer elements (`itemGap`)

Set vertical spacing between items with `itemGap` instead of margins or spacer `<div>`s. The gap goes **only between items in a column** (never above the first item in a column), and it is reflected in both the pagination height math and the rendered flex gap, so they never drift.

```tsx
<ColumnPager columnCount={2} itemGap={16} columnGap={40} bodyClassName="px-8 py-5">
  {cards.map((c) => <Card key={c.id} {...c} />)}   {/* no margins/spacers needed */}
</ColumnPager>
```

- `columnGap` — horizontal gap between columns (px).
- `bodyClassName` — class for the box around the columns (use for page padding).

## Pack columns tight, slicing boundary items (`tightFill`)

By default a card that does not fit the leftover space moves whole to the next column, leaving a gap at the bottom. With `tightFill`, a boundary card is sliced to fill the leftover space and continued into the next column/page.

```tsx
<ColumnPager columnCount={2} tightFill={8}>
  {cards.map((c) => <Card key={c.id} {...c} />)}
</ColumnPager>
```

- `0`/unset: no slicing — boundary items move whole (gaps allowed, boxes preserved).
- `N` (px): slice only when the leftover exceeds `N` (small leftovers move whole, to avoid thin slivers). A small value (e.g. `1`) means "almost always fill".
- Atomic boxes that CSS multi-column cannot split (e.g. `inline-block`) fall back to moving whole.

> Items taller than the column itself are always sliced, regardless of `tightFill`.

## Keep a block from being split (`KeepTogether`)

Lists, tables, code blocks, and image captions should travel together. Wrap them in `ColumnPager.KeepTogether` so they are not split line-by-line at a boundary — they move whole to the next column/page (via `break-inside: avoid`).

```tsx
<ColumnPager columnCount={2} tightFill={8}>
  <article>
    <p>{intro}</p>
    <ColumnPager.KeepTogether className="rounded bg-amber-50 p-3">
      <ul>{items.map((i) => <li key={i}>{i}</li>)}</ul>
    </ColumnPager.KeepTogether>
    <p>{outro}</p>
  </article>
</ColumnPager>
```

> If the kept-together content is taller than a column, avoidance is impossible and the browser splits it anyway.

## Wrap a group in one shared frame (`Decorator`)

To give several items the same frame (border/background/padding) while they still flow independently across columns/pages, wrap them in `ColumnPager.Decorator`. The wrapper is not rendered as a box; its `className` is propagated to each child cell, and the frame's padding/border height is measured and factored into slice math.

```tsx
<ColumnPager columnCount={2}>
  <ColumnPager.Decorator className="rounded-2xl bg-indigo-50 p-6">
    {section.map((s) => <Card key={s.id} {...s} />)}
  </ColumnPager.Decorator>
</ColumnPager>
```

## Animate items on reorder/move (`renderItem`)

`renderItem` wraps each placed cell. The library does not depend on framer-motion — you return your own `motion.div`. A stable identity (`info.id`) comes from the React `key` on each child, so the same item keeps the same identity when the order changes and the animation reads it as a move. Set `clipOverflow={false}` so a moving cell is not clipped by the column box.

```tsx
import { LayoutGroup, motion } from 'framer-motion';

<LayoutGroup>
  <ColumnPager
    columnCount={2}
    clipOverflow={false}
    renderItem={({ id, sliced, pageNumber, children }) => {
      if (!id || sliced) return children; // slices have no 1:1 identity
      return (
        <motion.div layout layoutId={`${id}-p${pageNumber}`} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          {children}
        </motion.div>
      );
    }}
  >
    {order.map((card) => <Card key={card.id} {...card} />)}
  </ColumnPager>
</LayoutGroup>
```

> Re-pagination after measurement is async, so moves that cross a page boundary may lag or jump slightly. Same-column reorders are the smoothest (see the [explanation](explanation.md)).

## Emit only after async content has rendered

Content whose height is decided later (images, remote data) should be wrapped in `ColumnPager.StableGate`, and you signal readiness with `stable={true}`. ColumnPager defers `onPagesGenerated` until every gate is stable (with a `stableTimeoutMs` fallback to avoid waiting forever).

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

**Verify:** no emission before load; once `loaded` is `true` and the gate settles, it emits once. The page count may differ before and after the load.

## Export rendered HTML (PDF, etc.)

The second argument to `onPagesGenerated` is the rendered container `outerHTML`. The library gives you **only the rendered result** — wrapping it into a full document for PDF is the consumer's job. Use `hidden` to measure and emit without showing anything on screen.

```tsx
function toDocument(bodyHtml: string): string {
  // inline the current page's stylesheets into a standalone document
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
        // send `doc` to a new window / iframe / server-side PDF converter
      }}
    >
      {children}
    </ColumnPager>
  );
}
```

> `hidden` still measures width correctly (it collapses height to 0 rather than moving off-screen). Measurement never drops to 0 and stalls emission.

## Extract per-section page ranges (table of contents)

Divide content into sections with `ColumnPager.SectionMark`, then get each section's page range with `getSectionPageRanges`. Use it to build a table of contents or index.

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

To find which page an item first appears on, use `findItemPage(pages, blockIndex)`.

## Send a tall item to the next column instead of slicing

If you do not want an item taller than the column to start mid-column and get sliced, turn on `moveOversizedItemToNextColumn`. It moves the item to the top of an empty column before slicing.

```tsx
<ColumnPager columnCount={2} moveOversizedItemToNextColumn>
  {children}
</ColumnPager>
```

## Set page height / handle responsive width

Height is the `pageHeight` (px) prop. Width is not a prop — it is responsive to the **parent container's width**.

```tsx
<div style={{ width: 794 }}>            {/* width is decided by this wrapper */}
  <ColumnPager pageHeight={1123}>       {/* set height only */}
    {children}
  </ColumnPager>
</div>
```

Resizing re-paginates once after `resizeDebounceMs` (default 150ms).

### Remove the double-paint (translateX jump) on slices

If content is long enough that a vertical scrollbar appears late, the available width shrinks and pagination runs once more. Reserve the gutter ahead of time on the scroll container to remove it.

```css
html { scrollbar-gutter: stable; }
```

## Troubleshooting

- **Nothing shows / zero pages.** If the container width measures as 0, pagination is deferred. Check that the parent has a width and that you are not rendering server-side (SSR). Measurement needs browser layout.
- **Styles do not apply.** Confirm the package is in your Tailwind content scan (see the install section in the README). If classes are purged, the layout breaks.
- **`onPagesGenerated` never fires.** If a StableGate never becomes stable, it waits up to `stableTimeoutMs`, then forces emission after `onStableTimeout`. Check that you actually set `stable` to `true`.
- **Edits feel slow.** Editing one item re-measures only that item. Wrapping your card component in `React.memo` further reduces re-renders of unchanged cards.

## Related docs

- [Tutorial](tutorial.md) · [Reference](reference.md) · [Explanation: how it works](explanation.md)
