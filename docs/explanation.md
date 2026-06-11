# Explanation — how pagination works

Why ColumnPager is designed the way it is. This covers the internal model and trade-offs, not API usage.
For usage see the [reference](reference.md) and [how-to](how-to.md).

## The problem

"Split arbitrary React content into fixed-height pages" is harder than it looks.

- Content height is **unknown until you render it.** It depends on fonts, line wrapping, and image loading.
- A single item can be **taller than one page (column).** Then it must be cut and continued.
- When width changes (responsive), wrapping changes, so **height changes**, and the whole pagination shifts.
- Even with thousands of heavy cards, a single edit must reflect almost instantly.

A naive implementation ends up either "measuring inaccurately" or "re-measuring everything every time, slowly."

## The approach

### Three-layer separation

```
core/      Pure logic (no React, no DOM). Takes an injected Measurer and computes placement only.
measure/   DOM measurement adapter. Renders off-screen and measures real size with getBoundingClientRect.
components/ + hooks/  React components and orchestration.
```

`core/paginate.ts` knows nothing about the DOM. It only takes a `Measurer` interface (column width/height, item size, overflow). That lets you inject a fake measurer to unit-test deterministically without a browser, and to attach the measurement cache to the measurer instance so it survives between recomputations.

### Measurement is off-screen + synchronous commit

To know a height you have to actually render. The measure adapter creates a container off-screen (`position:absolute; left:-9999px`), renders the item into it with React, and measures with `getBoundingClientRect`.

The key is the **synchronous commit** via `flushSync`. Calling `getBoundingClientRect` right after the render forces a reflow and produces an accurate value on the spot. So it does not wait a frame with rAF (only font loading waits, via `document.fonts.ready` with a timeout fallback). This is what makes edits reflect fast.

### Tall items: CSS multi-column slicing

An item taller than the column is put into a `columnCount:1` container and clipped to the column height. The overflow then **flows horizontally** per CSS multi-column rules. Divide the total flowed width (`flowWidth`) by one column's width (`sliceWidth`) and you get the piece count. Each piece is a view of the same content shifted by `translateX(-index*sliceWidth)` so only that vertical band shows. The content is never truly cut or duplicated — you look at one flow through several windows.

`break-inside: avoid` is respected by the browser within that flow, which is exactly how `KeepTogether` works: wrapping a block in it keeps the block from being split line-by-line at a piece boundary.

### Flow placement, gaps, and tight fill

Small items accumulate into a column until they overflow, then continue into the next column/page. `itemGap` adds vertical spacing **between** items in a column (never above the first item — flex-col gap semantics) and is added to the running height so the pagination math matches the rendered flex gap exactly; no spacer elements are needed.

By default a boundary item (taller than the leftover space, but smaller than a full column) moves whole to the next column, leaving a gap. `tightFill` changes that: when the leftover exceeds the threshold, the boundary item is sliced with the same multi-column mechanism to fill the leftover and continue. A single slicing primitive handles both "taller than the column" (always sliced) and "taller than the leftover, tight fill on" cases. Atomic boxes that multi-column cannot break (e.g. `inline-block`) fall back to moving whole, detected as a slice count of 1.

### Responsive width, debounced recompute

Width is not a prop — it is measured from the container with `ResizeObserver`. Recomputing on every pixel is wasteful, so a resize re-paginates once after `resizeDebounceMs` (default 150ms). Only height comes from the `pageHeight` prop (fixed sizes like A4 are not this library's concern — that belongs in the consumer's PDF step).

### Per-item measurement cache

The cache key is `column width | item content signature`. The signature is a serialization of the node's type, key, and props (functions excluded), computed once per block in the `toBlocks` step.

- Editing one card changes only that card's signature, so **only that card is re-measured**; the rest hit the cache.
- **Reordering** cards keeps each card's signature, so measurement is all cache hits — only placement (pagination) is recomputed.
- The full recompute trigger (`streamSignature`) is also built by composing per-block signatures, so the whole tree is not re-walked every render.

### Avoiding infinite loops

Consumers commonly pass `header`/`footer`/`onPagesGenerated`/`renderItem` as inline functions. If a changing function identity recreated the measurer, that would cause re-pagination → setState → re-render → another loop. So those callbacks are read through refs for their latest value, and measurer recreation depends only on the **presence** of header/footer and the actual measured dimensions (width, height, column count, gaps).

## Trade-offs

- **Browser-dependent.** Accurate measurement needs real layout. In SSR/Node the width measures as 0 and pagination is deferred. Unit tests (happy-dom) also get `getBoundingClientRect` = 0, so they verify cache and placement logic, not measurement accuracy. Visual verification happens in Storybook (a real browser).
- **Remount on layout change.** When width changes and a card moves to a different page/column, React cannot move a node across a different parent — it unmounts and remounts it (reparenting). A stable key only prevents remount within the same parent. The `renderItem` hook surfaces a stable identity (`info.id`, from the child's React key) so consumers can attach framer-motion `layout`/`layoutId`. Same-column reorders animate as a clean move; boundary-crossing moves remount and use a shared-element transition. With thousands of heavy cards, frequent resizes can get expensive (virtualization is the real fix, and is not implemented yet).
- **Not two-pass.** Features that need the final page number up front (e.g. "page n of N") cannot be done in a single pass. They are intentionally left out for complexity reasons — headers/footers that branch on the page number (first/odd/even) work in a single pass.
- **Scrollbar double-paint.** Because width is measured from the container, if a vertical scrollbar appears late on the first render, the available width shrinks and a second pagination runs. Reserve the gutter on the scroll container with `scrollbar-gutter: stable` to remove it.

## Related docs

- [Reference](reference.md) · [How-to](how-to.md) · [Tutorial](tutorial.md)
