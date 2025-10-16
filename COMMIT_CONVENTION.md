# 커밋 메시지 컨벤션

이 프로젝트는 [Conventional Commits](https://www.conventionalcommits.org/) 규칙을 따릅니다.

## 📝 커밋 메시지 형식

```
<type>(<scope>): <subject>

<body>

<footer>
```

### 필수 요소
- **type**: 커밋의 타입
- **subject**: 커밋의 간단한 설명 (50자 이내)

### 선택 요소
- **scope**: 변경 범위 (컴포넌트, 파일명 등)
- **body**: 상세한 설명
- **footer**: 이슈 번호, Breaking Changes 등

---

## 🏷️ 커밋 타입

### 주요 타입

| Type | 설명 | 예시 |
|------|------|------|
| `feat` | 새로운 기능 추가 | `feat: add user login` |
| `fix` | 버그 수정 | `fix: resolve memory leak` |
| `docs` | 문서만 변경 | `docs: update README` |
| `style` | 코드 포맷팅, 세미콜론 누락 등 | `style: format code with Biome` |
| `refactor` | 리팩토링 | `refactor: simplify auth logic` |
| `perf` | 성능 개선 | `perf: optimize image loading` |
| `test` | 테스트 추가/수정 | `test: add user service tests` |
| `chore` | 빌드, 설정 변경 | `chore: update dependencies` |
| `revert` | 이전 커밋 되돌리기 | `revert: revert feat: add feature` |
| `ci` | CI 설정 변경 | `ci: add GitHub Actions` |
| `build` | 빌드 시스템 변경 | `build: update vite config` |

---

## ✅ 좋은 커밋 메시지 예시

### 기본 형식
```bash
feat: add user authentication
fix: resolve login button click issue
docs: update installation guide
```

### Scope 포함
```bash
feat(auth): add OAuth login
fix(button): resolve hover state
docs(readme): add setup instructions
```

### Body 포함
```bash
feat: add user authentication

- Add login/logout functionality
- Implement JWT token handling
- Add protected routes
```

### Footer 포함 (이슈 참조)
```bash
fix: resolve memory leak

Closes #123
```

### Breaking Change
```bash
feat!: change API endpoint structure

BREAKING CHANGE: The API endpoints have been restructured.
Migration guide: https://...
```

---

## ❌ 나쁜 커밋 메시지 예시

```bash
# ❌ 타입 없음
update code

# ❌ 모호한 설명
fix stuff

# ❌ 과거형 사용
added new feature

# ❌ 너무 긴 제목 (50자 초과)
feat: add a new feature that allows users to do something really cool

# ❌ 마침표 사용
feat: add feature.

# ❌ 대문자로 시작
feat: Add feature
```

---

## ✅ 올바른 커밋 메시지 규칙

1. **타입은 소문자**로 작성
2. **제목은 50자 이내**
3. **제목 끝에 마침표 없음**
4. **제목은 명령형**으로 작성 ("added" ❌, "add" ✅)
5. **제목은 소문자**로 시작
6. **Body는 72자**마다 줄바꿈
7. **Body는 "무엇을", "왜"** 설명

---

## 🪝 Commitlint 자동 검증

이 프로젝트는 Husky + Commitlint를 사용하여 커밋 메시지를 자동으로 검증합니다.

### 잘못된 커밋 메시지 입력 시:

```bash
$ git commit -m "updated code"

⧗   input: updated code
✖   type may not be empty [type-empty]
✖   subject may not be empty [subject-empty]

✖   found 2 problems, 0 warnings
```

### 올바른 커밋 메시지:

```bash
$ git commit -m "feat: add user profile page"

✓   Commit message is valid!
```

---

## 💡 팁

### VS Code에서 사용하기

**Conventional Commits** 확장 프로그램 설치:
```
Ctrl+Shift+P → "Conventional Commits"
```

자동으로 커밋 메시지 템플릿 생성!

### CLI에서 인터랙티브하게 작성

Commitizen 설치 (옵션):
```bash
pnpm add -D commitizen cz-conventional-changelog
pnpm exec git-cz
```

---

## 📚 참고 자료

- [Conventional Commits](https://www.conventionalcommits.org/)
- [Commitlint](https://commitlint.js.org/)
- [Angular Commit Guidelines](https://github.com/angular/angular/blob/main/CONTRIBUTING.md#commit)

---

## 🎯 실전 예제

```bash
# 기능 추가
git commit -m "feat: add dark mode toggle"

# 버그 수정
git commit -m "fix: resolve navbar overflow on mobile"

# 문서 업데이트
git commit -m "docs: add API documentation"

# 리팩토링
git commit -m "refactor: simplify authentication logic"

# 스타일 변경
git commit -m "style: apply Biome formatting rules"

# 설정 변경
git commit -m "chore: update Node.js version to 22.14"

# 성능 개선
git commit -m "perf: optimize image lazy loading"
```

