# 🎯 DevJobsRadar

**IT 채용공고 자동 수집 & 분석 플랫폼**

매일 10곳 이상의 채용 사이트를 직접 확인하는 대신, 70개+ 소스에서 자동으로 채용공고를 수집하고 기술 스택 분석, 채용 캘린더, 관심 기업 모니터링까지 한 곳에서 관리합니다.

> "매일 채용페이지 들어가서 새 공고 올라왔나 체크하던 시절은 끝났다"

---

## 주요 기능

| 기능 | 설명 |
|------|------|
| **📋 통합 대시보드** | 70개+ 소스에서 IT 채용공고 모아보기 (직군/기술/경력/연봉 필터) |
| **📅 채용 캘린더** | 마감일 기반 일정 관리 + 지원 상태 추적 (관심→지원→면접→결과) |
| **📊 기술 스택 분석** | 공고에서 기술 자동 추출, 직군별 TOP 기술 순위, 트렌드 변화 |
| **📈 트렌드 차트 12종** | Line, Area, Bump, Heatmap, Network, Radar, Sankey 등 인터랙티브 시각화 |
| **🏢 기업 탐색** | IT 기업 프로필, 채용 히스토리, 기술 프로필 자동 생성 |
| **🔔 모니터링 & 알림** | 관심 기업 새 공고 알림, 키워드 알림, 조건 매칭 알림 |
| **🎯 맞춤 추천** | 내 기술 스택 대비 매칭률 표시 + 갭 분석 |
| **📊 시장 인사이트** | 직군별 채용 추이, 연봉 분포, 지역별 분포 분석 |

## 수집 소스 (70+)

- **Tier 1** — 원티드, 사람인, 잡코리아, 프로그래머스, 점핏
- **Tier 2** — 랠릿, 로켓펀치, 인디드, 블라인드, 캐치, 잡플래닛, OKKY, 디스퀘이엇, 커리어리, 워크넷, 피플앤잡
- **Tier 3** — LinkedIn, Glassdoor, Wellfound, RemoteOK, WWR, SO Jobs, Hired, 일본 IT, 헤드헌팅
- **Tier 4** — 기업 직접 채용페이지 43개 (네이버~KISA)
- **커스텀** — 사용자가 원하는 채용 URL 직접 등록 모니터링

## 기술 스택

| 영역 | 기술 |
|------|------|
| Frontend | React 19, Vite, TypeScript, Tailwind CSS v4, shadcn/ui |
| 상태관리 | Zustand + TanStack Query (React Query) |
| 차트/시각화 | Recharts, D3.js, d3-cloud, TopoJSON |
| 백엔드 | Vercel Serverless Functions |
| DB/인증 | Supabase (PostgreSQL + Auth + Realtime) |
| 수집 | Node.js, Cheerio, RSS Parser |
| 테스트 | Vitest, React Testing Library, jsdom |

## 개발 로드맵

| Phase | 내용 | 상태 |
|-------|------|------|
| 0 | 프로젝트 세팅 & 기반 구조 | 🔲 |
| 1 | Tier 1 채용 플랫폼 수집기 (5개) | 🔲 |
| 2 | 프론트엔드 대시보드 & 필터 | 🔲 |
| 3 | 트렌드 그래프 & 차트 시각화 (12종) | 🔲 |
| 4 | 기술 분석 엔진 & 인사이트 | 🔲 |
| 5 | 기업 탐색 & Tier 2 수집기 (11개) | 🔲 |
| 6 | 글로벌 & 기업 직접 수집기 (54개) | 🔲 |
| 7 | 사용자 기능 & 알림 | 🔲 |
| 8 | 고도화 (AI 요약, TechPulse 연동) | 🔲 |

## 자매 프로젝트

- **[TechPulse](https://github.com/NoirStar/tech-pulse)** — IT 트렌드 실시간 수집 & 시각화 플랫폼

## 라이선스

MIT

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...

      // Remove tseslint.configs.recommended and replace with this
      tseslint.configs.recommendedTypeChecked,
      // Alternatively, use this for stricter rules
      tseslint.configs.strictTypeChecked,
      // Optionally, add this for stylistic rules
      tseslint.configs.stylisticTypeChecked,

      // Other configs...
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```
