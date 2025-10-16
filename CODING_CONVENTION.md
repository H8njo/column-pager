# 코딩 컨벤션 가이드

이 프로젝트의 코딩 스타일과 규칙들입니다.

---

## 📋 현재 설정

### 1. 포맷팅 규칙
- ✅ **들여쓰기**: 스페이스 2칸
- ✅ **따옴표**: 싱글 쿼트 (`'`)
- ✅ **세미콜론**: 항상 사용
- ✅ **줄 길이**: 최대 100자
- ✅ **Import 정렬**: 자동 정렬

### 2. TypeScript Strict 모드
- ✅ `strict: true`
- ✅ `noUnusedLocals: true`
- ✅ `noUnusedParameters: true`
- ✅ `noFallthroughCasesInSwitch: true`

### 3. Lint 규칙

#### ⚠️ 경고 (Warning)
- `useExhaustiveDependencies` - useEffect 의존성 배열 검사
- `useKeyWithClickEvents` - onClick 사용 시 키보드 이벤트도 권장
- `noAccessKey` - accessKey 속성 사용 지양

#### ❌ 에러 (Error)
- `noUnusedVariables` - 사용하지 않는 변수
- `useHookAtTopLevel` - Hook은 최상위에서만 사용
- `useButtonType` - button 요소에 type 속성 필수
- `useAltText` - img 요소에 alt 속성 필수
- `useValidAnchor` - a 태그 올바른 사용
- `useAriaPropsForRole` - ARIA role에 맞는 속성 사용
- `useValidAriaProps` - 유효한 ARIA 속성만 사용
- `useNamingConvention` - 네이밍 규칙 준수
- `useFilenamingConvention` - 파일명 규칙 준수
- `noDoubleEquals` - `==` 대신 `===` 사용

---

## 🎯 접근성(a11y) 규칙

### 1. Button Type 필수
```tsx
// ❌ 잘못된 예
<button onClick={handleClick}>Click</button>

// ✅ 올바른 예
<button type="button" onClick={handleClick}>Click</button>
<button type="submit">Submit</button>
```

### 2. Image Alt 속성 필수
```tsx
// ❌ 잘못된 예
<img src="logo.png" />

// ✅ 올바른 예
<img src="logo.png" alt="회사 로고" />
<img src="decorative.png" alt="" /> {/* 장식용 이미지 */}
```

### 3. 키보드 접근성
```tsx
// ⚠️ 경고 (권장)
<div onClick={handleClick}>Click me</div>

// ✅ 올바른 예
<div 
  onClick={handleClick}
  onKeyDown={(e) => e.key === 'Enter' && handleClick()}
  role="button"
  tabIndex={0}
>
  Click me
</div>

// 🌟 가장 좋은 예
<button type="button" onClick={handleClick}>
  Click me
</button>
```

### 4. 유효한 링크
```tsx
// ❌ 잘못된 예
<a onClick={handleClick}>Link</a>

// ✅ 올바른 예
<a href="/page">Link</a>
<button type="button" onClick={handleClick}>Link</button>
```

---

## 📝 네이밍 컨벤션

### 1. 컴포넌트 (PascalCase)
```tsx
// ✅ 올바른 예
function UserProfile() { }
function TodoList() { }
const MyComponent = () => { };
```

### 2. 함수/변수 (camelCase)
```tsx
// ✅ 올바른 예
const userName = 'John';
function getUserInfo() { }
const handleClick = () => { };
```

### 3. 상수 (UPPER_SNAKE_CASE)
```tsx
// ✅ 올바른 예
const API_URL = 'https://api.example.com';
const MAX_COUNT = 100;
const DEFAULT_TIMEOUT = 5000;
```

### 4. Private 변수/함수 (언더스코어)
```tsx
// ✅ 올바른 예
const _privateVariable = 'secret';
function _internalHelper() { }
```

### 5. 타입/인터페이스 (PascalCase)
```tsx
// ✅ 올바른 예
interface User { }
type UserRole = 'admin' | 'user';
```

### 6. 파일명
```
컴포넌트: PascalCase.tsx
  - UserProfile.tsx
  - TodoList.tsx

유틸/훅: camelCase.ts
  - useAuth.ts
  - formatDate.ts
  - api.ts

상수: camelCase.ts 또는 UPPER_SNAKE_CASE.ts
  - constants.ts
  - API_CONFIG.ts
```

---

## 🔒 TypeScript 규칙

### 1. any 타입 금지
```tsx
// ❌ 잘못된 예
const data: any = fetchData();

// ✅ 올바른 예
interface Data {
  name: string;
  age: number;
}
const data: Data = fetchData();

// 또는 unknown 사용
const data: unknown = fetchData();
```

### 2. 명시적 타입 지정
```tsx
// ⚠️ 가능하면 피하기
const user = { name: 'John' };

// ✅ 명시적 타입
interface User {
  name: string;
  age?: number;
}
const user: User = { name: 'John' };
```

### 3. 사용하지 않는 변수
```tsx
// ❌ 에러
const [count, setCount] = useState(0); // setCount 미사용

// ✅ 언더스코어로 표시
const [count, _setCount] = useState(0);
// 또는
const [count] = useState(0);
```

---

## 🚫 금지/권장 사항

### 1. console.log (✅ 허용)
```tsx
// console.log는 자유롭게 사용 가능
console.log('debug info');
console.log('data:', data);
```

### 2. == 대신 === 사용 (❌ 에러)
```tsx
// ❌ 금지
if (value == null) { }

// ✅ 사용
if (value === null) { }
if (value == null) { } // null과 undefined 동시 체크 시에만 예외
```

### 3. var 대신 const/let (❌ 에러)
```tsx
// ❌ 금지
var count = 0;

// ✅ 사용
const count = 0;
let mutableCount = 0;
```

---

## 🎨 React 규칙

### 1. Hook 사용 위치
```tsx
// ❌ 잘못된 예
function Component() {
  if (condition) {
    const [state] = useState(0); // Hook은 조건문 안 불가
  }
}

// ✅ 올바른 예
function Component() {
  const [state] = useState(0);
  
  if (condition) {
    // ...
  }
}
```

### 2. useEffect 의존성 배열
```tsx
// ⚠️ 경고
useEffect(() => {
  console.log(count, name);
}, [count]); // name 누락

// ✅ 올바른 예
useEffect(() => {
  console.log(count, name);
}, [count, name]);
```

### 3. 배열 key (⚠️ 경고)
```tsx
// ⚠️ 권장하지 않음
{items.map((item, index) => (
  <li key={index}>{item}</li>
))}

// ✅ 고유한 ID 사용
{items.map((item) => (
  <li key={item.id}>{item.name}</li>
))}
```

---

## 📁 파일 구조 (권장)

```
src/
  ├── components/          # 재사용 컴포넌트
  │   ├── Button.tsx
  │   └── Input.tsx
  ├── pages/              # 페이지 컴포넌트
  │   ├── HomePage.tsx
  │   └── AboutPage.tsx
  ├── hooks/              # Custom hooks
  │   ├── useAuth.ts
  │   └── useFetch.ts
  ├── utils/              # 유틸 함수
  │   ├── formatDate.ts
  │   └── validation.ts
  ├── types/              # TypeScript 타입
  │   └── index.ts
  ├── constants/          # 상수
  │   └── config.ts
  ├── App.tsx
  └── main.tsx
```

---

## 🛠️ 명령어

### 체크만 (수정 안 함)
```bash
pnpm lint
```

### 자동 수정
```bash
pnpm lint:fix
```

### 포맷팅만
```bash
pnpm format
```

### 특정 파일 체크
```bash
pnpm exec biome check src/App.tsx
```

---

## 💡 특정 규칙 무시하기

### 한 줄만 무시
```tsx
// biome-ignore lint/suspicious/noConsole: 개발용 로그
console.log('debug');
```

### 여러 줄 무시
```tsx
/* biome-ignore lint/suspicious/noConsole: 디버깅 블록 */
console.log('start');
console.log('debug info');
console.log('end');
```

### 파일 전체 무시
```tsx
/* biome-ignore-file */
// 이 파일 전체를 lint 체크에서 제외
```

---

## 📚 참고 자료

- [Biome 공식 문서](https://biomejs.dev/)
- [React 접근성 가이드](https://react.dev/learn/accessibility)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/handbook/intro.html)
- [Web Content Accessibility Guidelines (WCAG)](https://www.w3.org/WAI/WCAG21/quickref/)

---

## 🔄 업데이트 이력

- **2025-10-13**: 초기 설정
  - Biome 적용
  - TypeScript strict 모드
  - 접근성(a11y) 규칙 추가
  - 네이밍 컨벤션 강화

