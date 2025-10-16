# React + TypeScript + Vite + Biome

Modern React template with Biome (fast linter & formatter), TypeScript strict mode, and accessibility rules.

## ✨ Features

- ⚡️ **Vite** - Fast build tool with HMR
- ⚛️ **React 19** - Latest React with TypeScript
- 🎨 **Biome** - Ultra-fast linter & formatter (ESLint + Prettier 대체)
- 💅 **Tailwind CSS v4** - Utility-first CSS framework
- 🔗 **Path Alias** - `@/` 경로로 간편한 import
- 🧪 **Vitest** - 빠른 유닛 테스트 (Jest 대체)
- 📖 **Storybook 9** - 컴포넌트 문서화 & 개발 환경
- 🔒 **TypeScript Strict Mode** - Type safety 최대화
- ♿️ **A11y Rules** - 웹 접근성 준수
- 📝 **Naming Convention** - 코드 일관성 강제
- 🚀 **Auto Import Sorting** - Import 자동 정렬
- 🪝 **Husky Hooks** - Git hooks로 코드 품질 자동화
  - `pre-commit`: 자동 lint & format
  - `commit-msg`: 커밋 메시지 검증 (Conventional Commits)
  - `pre-push`: 푸시 전 빌드 체크
  - `post-merge`: 머지 후 자동 의존성 설치
  - `post-checkout`: 브랜치 전환 시 자동 설정
- 🤖 **GitHub Actions** - CI/CD 자동화
  - PR 자동 lint & build 체크
  - main 브랜치 보호
- 📦 **Dependabot** - 의존성 자동 업데이트
  - 주간 자동 업데이트 PR
  - 보안 취약점 자동 패치
- 📋 **Issue/PR 템플릿** - 협업 효율화

## 📋 Requirements

- **Node.js** >= 22.14.0
- **pnpm** >= 9.0.0

> 💡 **Tip**: If using nvm, run `nvm use` to automatically switch to the correct Node.js version.

## 🚀 Quick Start

```bash
# Switch to the correct Node.js version (if using nvm)
nvm use

# 의존성 설치
pnpm install

# 개발 서버 실행
pnpm dev

# 빌드
pnpm build

# 프리뷰
pnpm preview
```

## 🛠️ Scripts

```bash
# 개발
pnpm dev          # 개발 서버 실행
pnpm build        # 프로덕션 빌드
pnpm preview      # 빌드 결과 미리보기

# 코드 품질
pnpm lint         # Lint 체크 (수정 안 함)
pnpm fix          # Lint + Format 자동 수정 (추천! ⭐)
pnpm format       # Format만 실행

# 테스트
pnpm test         # 테스트 실행 (watch 모드)
pnpm test:run     # 테스트 1회 실행
pnpm test:ui      # UI 모드로 테스트
pnpm test:coverage # 커버리지 리포트

# Storybook
pnpm storybook    # Storybook 개발 서버 실행 (포트 6006)
pnpm build-storybook # Storybook 정적 빌드
```

## 📋 Code Style

- **들여쓰기**: 스페이스 2칸
- **따옴표**: 싱글 쿼트 (`'`)
- **세미콜론**: 항상 사용
- **줄 길이**: 최대 100자
- **경로**: `@/` alias 사용 (예: `import { cn } from '@/lib/utils'`)

자세한 내용은 [CODING_CONVENTION.md](./CODING_CONVENTION.md)를 참고하세요.

## 🎯 Lint Rules

### ❌ Error
- 사용하지 않는 변수
- Hook 규칙 위반
- `button`에 `type` 누락
- `img`에 `alt` 누락
- `==` 사용 (대신 `===`)
- 네이밍 컨벤션 위반

### ⚠️ Warning
- useEffect 의존성 누락
- 키보드 접근성 권장

## 📚 Documentation

- [CODING_CONVENTION.md](./CODING_CONVENTION.md) - 상세한 코딩 규칙
- [COMMIT_CONVENTION.md](./COMMIT_CONVENTION.md) - 커밋 메시지 규칙

## 🤖 Automation

### GitHub Actions
- **CI 워크플로우**: Push/PR 시 자동으로 lint & build 체크
- **자동 실행**: main 브랜치와 모든 PR

### Dependabot
- **주간 업데이트**: 매주 월요일 오전 9시
- **자동 그룹핑**: minor/patch 업데이트 그룹화
- **보안 패치**: 취약점 발견 시 즉시 PR 생성

### Issue & PR Templates
- **Bug Report**: 버그 리포트 템플릿
- **Feature Request**: 기능 제안 템플릿
- **PR Template**: 일관된 PR 형식

## 🔧 VSCode Setup

이 프로젝트는 VSCode 설정이 포함되어 있습니다:
- 저장 시 자동 포맷팅
- Import 자동 정렬
- Biome 통합

**추천 확장 프로그램**: [Biome](https://marketplace.visualstudio.com/items?itemName=biomejs.biome)

## 🧪 Testing

이 프로젝트는 **Vitest**와 **Testing Library**를 사용합니다.

### 테스트 작성 예시

```tsx
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import App from '@/App';

describe('App', () => {
  it('renders correctly', () => {
    render(<App />);
    expect(screen.getByText(/Hello World/i)).toBeInTheDocument();
  });
});
```

### 테스트 실행

- `pnpm test` - Watch 모드로 실행 (개발 중 권장)
- `pnpm test:ui` - UI 모드로 실행 (시각적으로 테스트 확인)
- `pnpm test:run` - 1회 실행 (CI에서 사용)
- `pnpm test:coverage` - 커버리지 리포트 생성

## 📖 Storybook

컴포넌트 문서화와 독립적인 개발 환경을 제공합니다.

### Storybook 실행

```bash
pnpm storybook
```

브라우저에서 `http://localhost:6006`으로 접속하세요.

### 스토리 작성 예시

```tsx
import type { Meta, StoryObj } from '@storybook/react';
import { Button } from './Button';

const meta = {
  title: 'Components/Button',
  component: Button,
  tags: ['autodocs'],
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
  args: {
    children: 'Primary Button',
    variant: 'primary',
  },
};
```

### 포함된 Addons

- **@storybook/addon-docs** - 자동 문서 생성
- **@storybook/addon-a11y** - 접근성 검사
- **@storybook/addon-vitest** - Vitest 통합
- **@chromatic-com/storybook** - 시각적 테스트

## 🏗️ Tech Stack

- [React 19](https://react.dev/)
- [TypeScript](https://www.typescriptlang.org/)
- [Vite](https://vitejs.dev/)
- [Biome](https://biomejs.dev/)
- [Vitest](https://vitest.dev/)
- [Testing Library](https://testing-library.com/)
- [Storybook 9](https://storybook.js.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [SWC](https://swc.rs/)

## 📁 Project Structure

```
src/
├── components/           # 재사용 가능한 컴포넌트
│   ├── Button/
│   │   ├── index.tsx           # Button 컴포넌트
│   │   ├── Button.stories.tsx  # Storybook 스토리
│   │   └── Button.test.tsx     # 테스트
│   └── index.ts                # 컴포넌트 export
├── lib/                  # 유틸리티 함수
│   ├── utils.ts
│   └── utils.test.ts
├── assets/
│   └── styles/
│       ├── reset.css     # CSS Reset (브라우저 기본 스타일 제거)
│       └── base.css      # Tailwind CSS + 커스텀 스타일
├── test/
│   └── setup.ts          # 테스트 전역 설정
├── App.tsx               # 메인 앱 컴포넌트
└── main.tsx              # 엔트리 포인트
```

### 컴포넌트 구조 규칙

각 컴포넌트는 독립적인 폴더로 관리합니다:
- `index.tsx` - 컴포넌트 구현
- `*.stories.tsx` - Storybook 문서화
- `*.test.tsx` - 단위 테스트
- 필요시 관련 타입, 상수, 스타일 등을 함께 배치

### CSS 구조 규칙

CSS는 다음 순서로 적용됩니다:
1. **`reset.css`** - 브라우저 기본 스타일 제거 (가장 먼저)
2. **`base.css`** - Tailwind CSS
3. **컴포넌트 스타일** - 개별 컴포넌트의 스타일 (마지막)

이 순서를 지켜야 Tailwind CSS와 올바르게 호환됩니다.
