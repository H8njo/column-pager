# column-pager

React children을 **반응형 멀티컬럼 페이지**로 자동 페이지네이션하는 렌더러.

- 작은 요소는 컬럼을 채우다 넘치면 다음 컬럼/페이지로 흐른다.
- 컬럼 높이를 초과하는 큰 요소는 CSS 멀티컬럼 기법으로 잘라 여러 컬럼·페이지에 이어 표현한다.
- 폭은 컨테이너에 맞춰 반응형(ResizeObserver + 디바운스), 높이는 `pageHeight` prop으로 지정한다.
- 강제 페이지/컬럼 넘김, 페이지별 헤더·푸터, 섹션 메타데이터, 비동기 콘텐츠 게이트, 렌더 결과(HTML) 방출을 지원한다.

> 측정은 실제 브라우저 레이아웃에 의존한다(오프스크린에서 `getBoundingClientRect`로 측정).
> SSR/Node 환경에서는 폭이 0으로 측정돼 페이지네이션이 보류된다.

## 설치

```bash
pnpm add column-pager
# 또는
npm install column-pager
```

### peerDependencies

| 패키지 | 버전 |
|---|---|
| `react` | ^18 \|\| ^19 |
| `react-dom` | ^18 \|\| ^19 |
| `tailwindcss` | ^3.4 \|\| ^4 |

ColumnPager는 레이아웃을 **Tailwind 유틸리티 클래스**로 렌더한다. 소비자 프로젝트에 Tailwind가
설정돼 있어야 하고, 패키지의 클래스가 purge되지 않도록 Tailwind content 스캔에 포함해야 한다.

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

## Quick Start

```tsx
import { ColumnPager } from 'column-pager';

export function Report({ items }) {
  return (
    <ColumnPager
      columnCount={2}
      pageHeight={1123}
      showDividers
      header={({ pageNumber }) => <div className="h-10">문서 제목 · {pageNumber}쪽</div>}
      footer={({ pageNumber }) => <div className="h-6 text-center">- {pageNumber} -</div>}
    >
      {items.map((it) => (
        <article key={it.id}>{it.body}</article>
      ))}
    </ColumnPager>
  );
}
```

폭은 부모 컨테이너에 맞춰 반응형으로 줄고, 내용이 한 페이지를 넘으면 자동으로 다음 페이지가 생긴다.

## 핵심 개념

- **페이지(Page)**: 폭 = 컨테이너 폭(반응형), 높이 = `pageHeight`(px). 세로 또는 가로로 나열.
- **컬럼(Column)**: 한 페이지 안의 세로 단. `columnCount`로 개수 지정, 페이지별로 바꿀 수 있다.
- **흐름 배치**: 작은 아이템은 컬럼을 채우다 넘치면 다음 컬럼/페이지로 이어진다.
- **슬라이스(Slice)**: 컬럼 높이를 넘는 큰 아이템은 CSS 멀티컬럼으로 잘려 조각으로 이어진다.
- **컴파운드 컨트롤**: children 사이에 끼워 흐름을 제어하는 렌더 없는 마커들.

## 컴파운드 컨트롤

```tsx
<ColumnPager columnCount={1}>
  <Cover />
  <ColumnPager.PageBreak changeColumnCountTo={2} />  {/* 다음 페이지 + 이후 2컬럼 */}
  <ColumnPager.SectionMark section="vocabulary" />    {/* 이후 콘텐츠의 섹션 라벨 */}
  <Card />
  <ColumnPager.ColumnBreak />                          {/* 다음 컬럼으로 */}
  <Card />
  <ColumnPager.StableGate stable={loaded}>             {/* 비동기 렌더 완료 게이트 */}
    <AsyncChart />
  </ColumnPager.StableGate>
  <ColumnPager.Decorator className="border rounded p-4">  {/* 자식들을 같은 프레임으로 묶음 */}
    <Card /><Card />
  </ColumnPager.Decorator>
  <ColumnPager.KeepTogether>                            {/* 경계에서 쪼개지 않고 통째로 */}
    <Table />
  </ColumnPager.KeepTogether>
</ColumnPager>
```

## 렌더 결과 방출 (PDF/문서 변환)

`onPagesGenerated(pages, html)`로 페이지네이션 결과와 렌더된 컨테이너 `outerHTML`을 받는다.
HTML을 완전한 문서로 감싸 PDF로 만드는 것 등은 **소비자 몫**(라이브러리는 렌더 결과만 내보낸다).

```tsx
<ColumnPager
  hidden                                   // 화면엔 안 보이고 측정/emit만
  onPagesGenerated={(pages, html) => {
    // html은 렌더된 outerHTML. 스타일시트를 인라인해 문서로 감싸 PDF 등에 사용.
  }}
>
  {children}
</ColumnPager>
```

## API 요약

```ts
import {
  ColumnPager,          // 메인 컴포넌트 (+ .PageBreak / .ColumnBreak / .SectionMark / .StableGate / .Decorator / .KeepTogether)
  isSliced,             // placement가 슬라이스 조각인지
  getPageCount,         // 총 페이지 수
  findItemPage,         // 특정 아이템이 처음 등장하는 페이지(1-base)
  getSectionPageRanges, // 섹션별 [시작,끝] 페이지 범위
} from 'column-pager';

import type {
  ColumnPagerProps, PageInfo, RenderItemInfo,
  PageBreakProps, SectionMarkProps, StableGateProps, DecoratorProps, KeepTogetherProps,
  Page, Column, Placement, Slice, Size, SectionPageRanges,
} from 'column-pager';
```

전체 props/타입/유틸은 [docs/reference.md](docs/reference.md) 참고.

## 문서

- [튜토리얼 — 처음부터 동작하는 예제까지](docs/tutorial.md)
- [How-to — 작업별 레시피](docs/how-to.md) (페이지/컬럼 넘김, 페이지별 헤더·푸터, 비동기 콘텐츠, HTML 내보내기, 섹션 범위)
- [레퍼런스 — 전체 API](docs/reference.md)
- [설명 — 페이지네이션이 동작하는 원리](docs/explanation.md) (측정·슬라이스·반응형·캐싱)

## 개발

```bash
pnpm install
pnpm storybook     # 스토리로 동작 확인 (실제 브라우저 측정)
pnpm test:run      # 유닛 테스트
pnpm build         # 라이브러리 번들 (ESM + CJS + d.ts)
```

## 릴리즈 (자동)

`main`에 머지되면 [semantic-release](https://semantic-release.gitbook.io/)가 커밋 메시지
([Conventional Commits](https://www.conventionalcommits.org/))를 읽어 자동으로 버전을 정하고,
CHANGELOG·git 태그·GitHub 릴리즈·npm publish까지 처리한다.

| 커밋 타입 | 버전 |
|---|---|
| `fix:` / `perf:` | patch |
| `feat:` | minor |
| `feat!:` 또는 본문에 `BREAKING CHANGE:` | major |
| `docs:` / `chore:` / `refactor:` / `test:` / `ci:` | 릴리즈 없음 |

준비물:
- 저장소 **Settings → Secrets → Actions** 에 `NPM_TOKEN`(자동 게시용 npm 토큰) 등록
- 첫 자동 릴리즈는 기본적으로 `1.0.0`으로 나간다. 0.x를 유지하려면 첫 머지 전 `main`에
  베이스라인 태그를 만든다: `git tag v0.1.0 && git push origin v0.1.0`

수동 태그를 달 필요는 없다 — 머지가 곧 배포다.

## 라이선스

MIT
