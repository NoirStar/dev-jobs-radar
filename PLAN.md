# 🎯 DevJobsRadar — IT 채용공고 자동 수집 & 분석 플랫폼

## 프로젝트 개요

IT/개발 분야의 채용공고를 여러 채용 플랫폼 + 기업 직접 채용페이지에서 **자동 수집**하고,
단순 공고 나열이 아닌 **직군별 분류**, **기술 스택 분석**, **채용 캘린더**, **관심 기업 모니터링** 등을
제공하여 구직 활동을 체계적으로 관리할 수 있는 대시보드형 플랫폼.

> "매일 채용페이지 들어가서 새 공고 올라왔나 체크하던 시절은 끝났다"

---

## 핵심 문제 & 동기

### 😤 현재 구직자의 페인포인트

1. **공고 흩어짐** — 원티드, 사람인, 잡코리아, 프로그래머스, 회사 직접 채용페이지... 매일 10곳 이상 확인
2. **놓치는 공고** — 가고 싶은 기업이 채용 열었는데 모르고 지나감, 마감일도 놓침
3. **기술 스택 파악 어려움** — "요즘 백엔드는 뭘 요구하지?", "프론트엔드 시장에서 뭘 준비해야 하지?"
4. **숨은 기업** — 내가 모르는 좋은 IT 기업들이 채용 중인데 발견 못함
5. **카테고리 혼재** — 채용 플랫폼마다 직군 분류 기준이 다름, 내 분야만 깔끔하게 모아보기 어려움
6. **수동 추적** — 스프레드시트에 수동으로 정리하다 포기

### ✅ DevJobsRadar가 해결하는 것

- **한 곳에서** 모든 IT 채용공고를 검색/필터링
- **관심 기업 모니터링** — 새 공고 올라오면 즉시 알림
- **기술 스택 분석** — 공고에서 요구하는 기술을 자동 추출, 직군별 공통 기술 순위
- **채용 캘린더** — 마감일 기반 일정 관리
- **숨은 기업 발견** — 내 관심 직군+기술로 매칭되는 기업 추천
- **트렌드 인사이트** — "이번 달 백엔드 채용에서 Go가 30% 증가" 같은 시장 데이터

---

## 수집 대상 직군 카테고리

> 사용자가 관심 분야를 선택하면, 해당 직군의 채용공고만 필터링하여 보여줌

### IT 직군 분류 체계

```
📂 개발 (Development)
├── 🌐 웹 프론트엔드 (Web Frontend)
│   └── React, Vue, Angular, Next.js, TypeScript, CSS...
├── ⚙️ 웹 백엔드 (Web Backend)
│   └── Java/Spring, Node.js, Python/Django, Go, Rust...
├── 📱 모바일 (Mobile)
│   ├── iOS (Swift, SwiftUI, Objective-C)
│   ├── Android (Kotlin, Java)
│   └── 크로스플랫폼 (Flutter, React Native)
├── 🖥️ 시스템/인프라 (System/Infra)
│   ├── Windows (C/C++, .NET, Win32, Device Driver)
│   ├── Linux (Kernel, Embedded, System Programming)
│   └── 네트워크 (TCP/IP, 프로토콜, 보안)
├── ☁️ DevOps / SRE / Cloud
│   └── Kubernetes, Docker, Terraform, AWS, GCP, CI/CD...
├── 🤖 AI / ML / Data
│   ├── ML Engineer
│   ├── Data Scientist
│   ├── Data Engineer
│   └── MLOps
├── 🔒 보안 (Security)
│   └── 보안 엔지니어, 침투 테스터, SOC, 보안 컨설팅...
├── 🎮 게임 (Game)
│   └── Unity, Unreal, 서버, 클라이언트...
├── 🗄️ DBA / Database
│   └── MySQL, PostgreSQL, Oracle, MongoDB, Redis...
└── 🧪 QA / Test
    └── 자동화 QA, 성능 테스트, SDET...

📂 비개발 IT 직군
├── 📊 PM / PO (Product Manager/Owner)
├── 🎨 UI/UX 디자이너
├── 📈 기술 영업 / SE (Solutions Engineer)
└── 📋 IT 기획
```

---

## 데이터 소스 & 수집 전략

> **원칙**: 채용 플랫폼 API > RSS > 크롤링. 가능한 모든 경로에서 수집한다.
> **수집 주기**: 핵심 소스 30분~1시간, 기업 직접 2~4시간

---

### 🟢 Tier 1 — 주요 채용 플랫폼 (최우선 구현)

| # | 소스 | 수집 방법 | 수집 데이터 | 주기 |
|---|------|-----------|-------------|------|
| 1 | **원티드 (Wanted)** | API (비공식) + 크롤링 | IT 직군 채용공고, 회사 정보, 기술 스택, 연봉 범위, 마감일 | 1h |
| 2 | **사람인 (Saramin)** | [공식 API](https://oapi.saramin.co.kr/) + 크롤링 | 공고 제목, 회사, 경력 조건, 기술 스택, 지역, 마감일 | 1h |
| 3 | **잡코리아 (JobKorea)** | 크롤링 | IT/개발 공고, 경력/신입, 연봉 정보, 마감일 | 1h |
| 4 | **프로그래머스 (Programmers)** | 크롤링 / API | 개발자 특화 공고, 기술 태그, 회사 프로필, 코딩테스트 여부 | 1h |
| 5 | **점핏 (Jumpit)** | 크롤링 / API | 개발자 채용, 기술 스택 태그, 회사 규모, 연봉 | 1h |

### 🟡 Tier 2 — 글로벌 & 추가 플랫폼

| # | 소스 | 수집 방법 | 수집 데이터 | 주기 |
|---|------|-----------|-------------|------|
| 6 | **LinkedIn Jobs** | API + 크롤링 | 글로벌/한국 IT 채용, 회사 정보, 기술 요구사항 | 2h |
| 7 | **랠릿 (Rallit)** | 크롤링 | 개발자 이력서 매칭 공고, 기술 스택 | 2h |
| 8 | **로켓펀치 (RocketPunch)** | 크롤링 | 스타트업 채용, 회사 정보, 투자 단계 | 2h |
| 9 | **인디드 (Indeed Korea)** | 크롤링 | IT 채용 통합 검색 | 2h |
| 10 | **블라인드 채용** | 크롤링 | 현직자 리뷰 연동, 채용 정보 | 4h |
| 11 | **캐치 (Catch)** | 크롤링 | 채용공고, 기업 리뷰, 면접 후기 | 4h |

### 🔵 Tier 3 — 기업 직접 채용페이지

> 기업이 채용 플랫폼에 올리지 않고 자사 채용 페이지에서만 모집하는 경우가 많음.
> 특히 빅테크/유니콘은 자체 채용 시스템 운영.

| # | 기업 | 채용 URL | 수집 방법 |
|---|------|----------|-----------|
| 12 | **네이버 (NAVER)** | `recruit.navercorp.com` | 크롤링/API |
| 13 | **카카오 (Kakao)** | `careers.kakao.com` | 크롤링 |
| 14 | **라인 (LINE)** | `careers.linecorp.com` | 크롤링 |
| 15 | **쿠팡 (Coupang)** | `www.coupang.jobs` | 크롤링 |
| 16 | **배달의민족 (Woowa)** | `career.woowahan.com` | 크롤링 |
| 17 | **토스 (Toss/Viva)** | `toss.im/career` | 크롤링 |
| 18 | **당근 (Karrot)** | `about.daangn.com/jobs` | 크롤링 |
| 19 | **삼성SDS** | `www.samsungsds.com/careers` | 크롤링 |
| 20 | **LG CNS** | `www.lgcns.com/careers` | 크롤링 |
| 21 | **SK 계열 (C&C 등)** | `www.skcc.co.kr/recruit` | 크롤링 |
| 22 | **NHN** | `recruit.nhn.com` | 크롤링 |
| 23 | **넥슨 (Nexon)** | `career.nexon.com` | 크롤링 |
| 24 | **크래프톤 (Krafton)** | `careers.krafton.com` | 크롤링 |
| 25 | **엔씨소프트 (NCSoft)** | `careers.ncsoft.com` | 크롤링 |
| 26 | **하이퍼커넥트** | `career.hyperconnect.com` | 크롤링 |
| 27 | **야놀자 (Yanolja)** | `careers.yanolja.co` | 크롤링 |
| 28 | **비바리퍼블리카** | (토스 참조) | 크롤링 |
| 29 | **두나무 (Dunamu)** | `dunamu.com/careers` | 크롤링 |
| 30 | **몰로코 (Moloco)** | `www.moloco.com/careers` | 크롤링 |

#### 🏢 확장 가능 — 사용자 직접 추가

사용자가 관심 기업의 채용 URL을 직접 등록하면, 해당 페이지를 주기적으로 모니터링:
```
사용자: "https://careers.example-corp.com/jobs" 추가 모니터링해줘
→ 주기적으로 해당 페이지 크롤링
→ 새 공고 발견 시 알림
```

---

## 핵심 기능

### 1. 📋 채용공고 통합 대시보드 (메인)

```
┌─────────────────────────────────────────────────────────┐
│  🎯 DevJobsRadar                   [검색] [알림🔔] [⚙️] │
├─────────────┬───────────────────────────────────────────┤
│             │                                           │
│ 📂 직군 필터 │  🔥 오늘의 새 공고 (24개)                  │
│ ───────────  │  ┌─────────────────────────────────────┐  │
│ ☑ 백엔드    │  │ 🏢 토스 — 서버 엔지니어 (Java/Kotlin) │  │
│ ☑ 프론트엔드 │  │    💰 6,000~9,000만 │ 📅 ~3/15      │  │
│ ☐ 모바일    │  │    🏷️ Spring, K8s, MSA │ 경력 3~7년   │  │
│ ☐ DevOps   │  ├─────────────────────────────────────┤  │
│ ☐ AI/ML    │  │ 🏢 네이버 — FE 개발 (React)           │  │
│ ☑ 시스템    │  │    💰 협의 │ 📅 상시                  │  │
│             │  │    🏷️ React, TypeScript, Next.js      │  │
│ 📊 기술 스택 │  ├─────────────────────────────────────┤  │
│ ───────────  │  │ 🏢 쿠팡 — Windows System Engineer   │  │
│ ☑ Java     │  │    💰 7,000~1.2억 │ 📅 ~3/20        │  │
│ ☑ React    │  │    🏷️ C++, Win32, Driver │ 경력 5+    │  │
│ ☑ K8s      │  └─────────────────────────────────────┘  │
│ ☑ Python   │                                           │
│             │  📈 이번 주 기술 트렌드                     │
│ 🏢 관심 기업 │  ┌─────────────────────────────────────┐  │
│ ───────────  │  │ 1. Kubernetes  ↑23%  (45개 공고)     │  │
│ ⭐ 토스     │  │ 2. TypeScript  ↑18%  (67개 공고)     │  │
│ ⭐ 네이버   │  │ 3. Go          ↑15%  (23개 공고)     │  │
│ ⭐ 카카오   │  │ 4. Rust        ↑12%  (8개 공고)      │  │
│ ⭐ 쿠팡    │  └─────────────────────────────────────┘  │
│             │                                           │
├─────────────┴───────────────────────────────────────────┤
│  📅 채용 캘린더  │  📊 기술 분석  │  🏢 기업 탐색  │  ⭐ 관심  │
└─────────────────────────────────────────────────────────┘
```

### 2. 📅 채용 캘린더

마감일 기반의 캘린더 뷰. 지원 관리까지 통합.

```
┌─────────── 2026년 3월 ──────────────┐
│ 일  월  화  수  목  금  토           │
│                    1   2   3         │
│  4   5   6   7   8   9  10         │
│             ⓪         ②            │
│ 11  12  13  14  15  16  17         │
│      ①          ③                  │
│ 18  19  20  21  22  23  24         │
│          ④                          │
│ 25  26  27  28  29  30  31         │
│                                     │
├─────────────────────────────────────┤
│ ⓪ 3/7  쿠팡 시스템 엔지니어 마감     │
│ ① 3/12 토스 서버 개발자 마감          │
│ ② 3/9  네이버 FE 개발 마감           │
│ ③ 3/15 카카오 백엔드 마감            │
│ ④ 3/20 라인 DevOps 마감             │
└─────────────────────────────────────┘

상태: 📝 관심 → 📨 지원완료 → 📞 서류통과 → 🎤 면접 → ✅ 합격/❌ 불합격
```

### 3. 📊 기술 스택 분석 (핵심 차별화)

채용공고에서 기술 키워드를 자동 추출하여 직군별 분석:

```
📊 백엔드 엔지니어 — 요구 기술 스택 TOP 20 (최근 30일, 234개 공고 분석)

 기술           공고 수   비율    전월 대비
──────────────────────────────────────────
 1. Java         189     81%     -
 2. Spring       178     76%     -
 3. MySQL        134     57%     ↑3%
 4. AWS          121     52%     ↑5%
 5. Kubernetes    98     42%     ↑12%
 6. Docker        95     41%     ↑2%
 7. JPA/Hibernate 89     38%     -
 8. Redis         85     36%     ↑8%
 9. Kafka         72     31%     ↑15%
10. MSA           68     29%     ↑7%
11. PostgreSQL    65     28%     ↑10%
12. Python        58     25%     ↑4%
13. Go            45     19%     ↑18%
14. Kotlin        42     18%     ↑6%
15. MongoDB       38     16%     -

🔥 급상승: Kafka (+15%), Go (+18%), K8s (+12%)
💡 준비 추천: Java + Spring + MySQL + AWS + K8s (80%+ 공고 커버)
```

#### 기술 분석 기능 상세
- **직군별 필수/우대 기술 분리** — "필수: Java, Spring" vs "우대: Kotlin, Go"
- **경력별 요구 기술 차이** — 신입 vs 3~5년 vs 7년+ 요구 기술이 어떻게 다른지
- **기업 규모별 기술 차이** — 스타트업 vs 대기업 기술 스택 비교
- **기술 조합 분석** — "Java + Spring + K8s" 조합이 가장 많이 요구됨
- **전월/전분기 대비 트렌드** — 요구 기술의 시간별 변화 추적
- **내 기술과 매칭** — 사용자 기술 스택 등록 → 매칭률 표시 ("이 공고와 78% 일치")

### 4. 🏢 기업 탐색 & 프로필

내가 모르는 IT 기업도 발견할 수 있는 탐색 기능:

```
🏢 기업 프로필 — 토스 (비바리퍼블리카)

📍 서울 강남구 │ 👥 2,500명+ │ 💰 시리즈 G ($410M)
🏷️ 핀테크, 금융, 슈퍼앱

📋 현재 채용 중 (12개)
├── 서버 엔지니어 (Java/Kotlin) — 경력 3~7년
├── iOS 개발자 (Swift) — 경력 3년+
├── Frontend (React) — 경력 2~5년
├── ML Engineer — 경력 3년+
├── DevOps Engineer — 경력 5년+
└── ...7개 더보기

📊 주로 요구하는 기술
Java (8), Kotlin (6), Spring (7), React (4), K8s (5), AWS (8)

📈 채용 활동 히스토리
├── 2026-02: 12개 공고 (↑ 활발)
├── 2026-01: 8개 공고
├── 2025-12: 5개 공고
└── 역대 평균: 7개/월

⭐ 관심 기업 등록 → 새 공고 시 알림
```

### 5. 🔔 관심 기업 모니터링 & 알림

```
🔔 알림 설정

📌 관심 기업 모니터링
├── ⭐ 토스 → 새 공고 즉시 알림 ✅
├── ⭐ 네이버 → 새 공고 즉시 알림 ✅
├── ⭐ 쿠팡 → 주 1회 요약 알림
└── ➕ 기업 추가...

📌 키워드 알림
├── "시스템 프로그래밍" — 이 키워드 포함 공고 알림
├── "Windows Driver" — 이 키워드 포함 공고 알림
├── "Rust" — 이 키워드 포함 공고 알림
└── ➕ 키워드 추가...

📌 조건 알림
├── 백엔드 + 경력 3~5년 + Java → 조건 매칭 공고 알림
├── 연봉 8,000만+ + DevOps → 고연봉 공고 알림
└── ➕ 조건 추가...

알림 채널:
☑ 웹 푸시  ☑ 이메일 (일간 다이제스트)  ☐ 슬랙 웹훅
```

### 6. 🎯 맞춤 추천 & 매칭

사용자 프로필 기반 채용공고 자동 추천:

```
내 프로필:
├── 관심 직군: 백엔드, 시스템/인프라
├── 기술 스택: Java, Spring, Linux, C++, Docker, K8s
├── 경력: 4년
├── 선호 조건: 서울, 연봉 7,000만+, 50인 이상
└── 관심 기업: 토스, 네이버, 쿠팡, 라인

→ 매칭률 기반 추천:
  92% 일치 — 쿠팡 시스템 엔지니어 (Linux, C++, Docker)
  88% 일치 — 네이버 서버 개발자 (Java, Spring, K8s)
  85% 일치 — 라인 Backend Engineer (Java, Spring, MSA)
  78% 일치 — 토스 서버 엔지니어 (Kotlin, Spring, AWS)
```

### 7. 📊 시장 인사이트 대시보드

채용 데이터 기반 IT 채용 시장 분석:

- **직군별 채용 추이** — 이번 달 백엔드 vs 프론트엔드 vs DevOps 채용 비교
- **기술별 수요 트렌드** — 시간 경과에 따른 기술 요구 변화 (월간/분기)
- **경력별 시장** — 신입/주니어/시니어 채용 비율
- **연봉 범위 분석** — 직군별, 기술별, 경력별 연봉 분포
- **기업 활동** — 가장 활발하게 채용 중인 기업 순위
- **지역별 분포** — 서울/판교/기타 지역 채용 비율

---

## 기술 스택 (예상)

| 영역 | 기술 | 선택 이유 |
|------|------|-----------|
| **Frontend** | React 19 + Vite + TypeScript | 빠른 개발, 풍부한 에코시스템 |
| **스타일링** | Tailwind CSS v4 + shadcn/ui | TechPulse와 동일 스택, 빠른 UI 구성 |
| **상태관리** | Zustand | 심플하고 강력한 상태 관리 |
| **차트/시각화** | Recharts + D3.js | 기술 트렌드 차트, 스택 분석 그래프 |
| **캘린더** | @fullcalendar/react 또는 커스텀 | 채용 마감일 캘린더 |
| **라우팅** | React Router 7 | SPA 라우팅 |
| **데이터 수집** | Node.js + Cheerio + RSS Parser | 크롤링, RSS, API 호출 |
| **백엔드 API** | Vercel Serverless Functions | API 라우트, 크론 작업 |
| **DB** | Supabase (PostgreSQL) | 채용공고 저장, 사용자 데이터, 인증 |
| **스케줄링** | Vercel Cron / GitHub Actions | 주기적 수집 |
| **검색** | Supabase Full-text Search 또는 Algolia | 공고 검색, 필터링 |
| **인증** | Supabase Auth | 소셜 로그인, 사용자 관리 |
| **배포** | Vercel | 자동 배포, 프리뷰 |
| **테스트** | Vitest + RTL | 단위/통합 테스트 |

---

## 데이터 모델 (핵심)

```typescript
// ──────────────── 채용공고 ────────────────

interface JobPosting {
  id: string                    // 고유 ID (source + sourceId 해시)
  source: JobSource             // 수집 출처
  sourceId: string              // 원본 소스에서의 ID
  sourceUrl: string             // 원본 공고 링크

  // 기본 정보
  title: string                 // 공고 제목
  company: CompanyRef           // 회사 정보 참조
  description: string           // 공고 본문 (HTML or markdown)
  summary?: string              // AI 요약 (선택)

  // 분류
  category: JobCategory         // 직군 카테고리
  subCategory?: string          // 세부 직군
  experienceLevel: ExperienceLevel  // 경력 수준
  experienceRange?: {           // 경력 범위 (년)
    min: number
    max?: number
  }
  employmentType: EmploymentType  // 정규직/계약직/인턴 등

  // 기술 스택 (공고에서 자동 추출)
  requiredSkills: string[]      // 필수 기술
  preferredSkills: string[]     // 우대 기술
  allSkills: string[]           // 전체 추출 기술

  // 조건
  salary?: {
    min?: number                // 최소 연봉 (만원)
    max?: number                // 최대 연봉 (만원)
    currency: 'KRW' | 'USD'
    isNegotiable: boolean       // "협의" 여부
  }
  location?: {
    region: string              // 서울, 판교, 부산 등
    address?: string            // 상세 주소
    isRemote: boolean           // 원격 근무 가능
  }

  // 일정
  postedAt: string              // 공고 게시일 (ISO 8601)
  deadline?: string             // 마감일 (없으면 "상시")
  isAlwaysOpen: boolean         // 상시 채용 여부

  // 메타
  collectedAt: string           // 수집 시각
  updatedAt: string             // 최종 업데이트
  isActive: boolean             // 현재 활성 공고 여부
  metadata: Record<string, any> // 소스별 추가 데이터
}

// 회사 정보
interface Company {
  id: string
  name: string                  // 회사명
  nameEn?: string               // 영문명
  logoUrl?: string              // 로고
  website?: string              // 회사 홈페이지
  careerUrl?: string            // 채용 페이지 URL

  // 분류
  industry: string[]            // 산업 분야 (핀테크, 이커머스 등)
  companySize: CompanySize      // 기업 규모
  foundedYear?: number          // 설립년도

  // 위치
  headquartersRegion: string    // 본사 위치
  locations: string[]           // 사업장 위치들

  // 기술 프로필 (수집 데이터 기반 자동 생성)
  techStack: TechStackProfile   // 주로 사용하는 기술
  hiringActivity: HiringActivity // 채용 활동 통계

  metadata: Record<string, any>
}

// 기업 기술 프로필 (공고 분석 기반)
interface TechStackProfile {
  topTechnologies: { tech: string; count: number; percentage: number }[]
  categoryBreakdown: Record<JobCategory, number>  // 직군별 채용 비율
  lastUpdated: string
}

// 채용 활동 통계
interface HiringActivity {
  totalPostings: number         // 총 공고 수
  activePostings: number        // 현재 활성 공고 수
  monthlyHistory: { month: string; count: number }[]  // 월별 공고 수
  avgPostingsPerMonth: number   // 월 평균 공고 수
}

// 사용자 관심 기업
interface WatchedCompany {
  companyId: string
  userId: string
  alertType: 'instant' | 'daily' | 'weekly'  // 알림 주기
  filters?: {                    // 관심 조건 필터
    categories?: JobCategory[]
    skills?: string[]
    experienceLevels?: ExperienceLevel[]
  }
  addedAt: string
}

// 지원 추적
interface Application {
  id: string
  userId: string
  jobPostingId: string
  status: ApplicationStatus
  appliedAt?: string
  notes: string
  statusHistory: { status: ApplicationStatus; at: string; note?: string }[]
}

// ──────────────── Enums / Types ────────────────

type JobSource =
  | 'wanted' | 'saramin' | 'jobkorea' | 'programmers' | 'jumpit'
  | 'linkedin' | 'rallit' | 'rocketpunch' | 'indeed' | 'blind' | 'catch'
  | 'naver' | 'kakao' | 'line' | 'coupang' | 'woowa' | 'toss'
  | 'karrot' | 'samsung-sds' | 'lg-cns' | 'sk-cc' | 'nhn'
  | 'nexon' | 'krafton' | 'ncsoft' | 'hyperconnect' | 'yanolja'
  | 'dunamu' | 'moloco'
  | 'custom'  // 사용자가 직접 추가한 기업

type JobCategory =
  | 'frontend' | 'backend' | 'mobile-ios' | 'mobile-android' | 'mobile-cross'
  | 'system-windows' | 'system-linux' | 'system-network'
  | 'devops' | 'sre' | 'cloud'
  | 'ai-ml' | 'data-science' | 'data-engineer' | 'mlops'
  | 'security' | 'game' | 'dba' | 'qa'
  | 'pm-po' | 'ui-ux' | 'tech-sales' | 'it-planning'
  | 'other'

type ExperienceLevel = 'intern' | 'entry' | 'junior' | 'mid' | 'senior' | 'lead' | 'any'

type EmploymentType = 'full-time' | 'contract' | 'intern' | 'freelance' | 'part-time'

type CompanySize = 'startup' | 'small' | 'medium' | 'large' | 'enterprise'
// startup: ~50명, small: 50~200, medium: 200~1000, large: 1000~5000, enterprise: 5000+

type ApplicationStatus =
  | 'interested'    // 관심
  | 'applied'       // 지원 완료
  | 'doc-passed'    // 서류 통과
  | 'interview'     // 면접 진행
  | 'final'         // 최종 면접
  | 'offered'       // 합격/오퍼
  | 'accepted'      // 수락
  | 'rejected'      // 불합격
  | 'withdrawn'     // 본인 철회

// ──────────────── 기술 분석 ────────────────

interface SkillAnalysis {
  category: JobCategory
  period: { from: string; to: string }
  totalPostings: number

  // 기술별 통계
  skills: {
    name: string
    count: number               // 언급 공고 수
    percentage: number           // 전체 대비 비율
    trend: number                // 전월 대비 변화율 (%)
    isRequired: number           // 필수로 요구된 횟수
    isPreferred: number          // 우대로 언급된 횟수
  }[]

  // 기술 조합
  topCombinations: {
    skills: string[]
    count: number
  }[]

  // 경력별 차이
  byExperience: Record<ExperienceLevel, {
    topSkills: { name: string; percentage: number }[]
  }>
}
```

---

## DB 스키마 (Supabase/PostgreSQL)

```sql
-- 채용공고
CREATE TABLE job_postings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  source TEXT NOT NULL,
  source_id TEXT NOT NULL,
  source_url TEXT NOT NULL,
  title TEXT NOT NULL,
  company_id UUID REFERENCES companies(id),
  description TEXT,
  summary TEXT,
  category TEXT NOT NULL,
  sub_category TEXT,
  experience_level TEXT NOT NULL DEFAULT 'any',
  experience_min INT,
  experience_max INT,
  employment_type TEXT NOT NULL DEFAULT 'full-time',
  required_skills TEXT[] DEFAULT '{}',
  preferred_skills TEXT[] DEFAULT '{}',
  all_skills TEXT[] DEFAULT '{}',
  salary_min INT,
  salary_max INT,
  salary_currency TEXT DEFAULT 'KRW',
  salary_negotiable BOOLEAN DEFAULT false,
  location_region TEXT,
  location_address TEXT,
  is_remote BOOLEAN DEFAULT false,
  posted_at TIMESTAMPTZ,
  deadline TIMESTAMPTZ,
  is_always_open BOOLEAN DEFAULT false,
  collected_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  is_active BOOLEAN DEFAULT true,
  metadata JSONB DEFAULT '{}',
  UNIQUE(source, source_id)
);

-- 기업
CREATE TABLE companies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  name_en TEXT,
  logo_url TEXT,
  website TEXT,
  career_url TEXT,
  industry TEXT[] DEFAULT '{}',
  company_size TEXT,
  founded_year INT,
  hq_region TEXT,
  locations TEXT[] DEFAULT '{}',
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 기술 스택 분석 스냅샷 (일일/주간)
CREATE TABLE skill_snapshots (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  category TEXT NOT NULL,
  period_type TEXT NOT NULL, -- 'daily', 'weekly', 'monthly'
  period_start DATE NOT NULL,
  period_end DATE NOT NULL,
  total_postings INT NOT NULL,
  skills JSONB NOT NULL, -- [{name, count, percentage, isRequired, isPreferred}]
  top_combinations JSONB DEFAULT '[]',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(category, period_type, period_start)
);

-- 사용자 프로필
CREATE TABLE user_profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id),
  display_name TEXT,
  interested_categories TEXT[] DEFAULT '{}',
  my_skills TEXT[] DEFAULT '{}',
  experience_years INT,
  preferred_regions TEXT[] DEFAULT '{}',
  preferred_salary_min INT,
  preferred_company_sizes TEXT[] DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 관심 기업
CREATE TABLE watched_companies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  company_id UUID REFERENCES companies(id) ON DELETE CASCADE,
  alert_type TEXT NOT NULL DEFAULT 'instant',
  filters JSONB DEFAULT '{}',
  added_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, company_id)
);

-- 지원 추적
CREATE TABLE applications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  job_posting_id UUID REFERENCES job_postings(id),
  status TEXT NOT NULL DEFAULT 'interested',
  applied_at TIMESTAMPTZ,
  notes TEXT DEFAULT '',
  status_history JSONB DEFAULT '[]',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 키워드 알림
CREATE TABLE keyword_alerts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  keyword TEXT NOT NULL,
  alert_type TEXT NOT NULL DEFAULT 'instant',
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 인덱스
CREATE INDEX idx_job_postings_category ON job_postings(category);
CREATE INDEX idx_job_postings_company ON job_postings(company_id);
CREATE INDEX idx_job_postings_source ON job_postings(source);
CREATE INDEX idx_job_postings_skills ON job_postings USING GIN(all_skills);
CREATE INDEX idx_job_postings_deadline ON job_postings(deadline);
CREATE INDEX idx_job_postings_active ON job_postings(is_active);
CREATE INDEX idx_job_postings_collected ON job_postings(collected_at);
CREATE INDEX idx_companies_name ON companies(name);
CREATE INDEX idx_watched_companies_user ON watched_companies(user_id);
CREATE INDEX idx_applications_user ON applications(user_id);
```

---

## 수집 파이프라인

```
                        ┌─────────────────────┐
                        │   Cron 트리거        │
                        │  (30min ~ 4h 주기)   │
                        └──────────┬──────────┘
                                   │
                    ┌──────────────┼──────────────┐
                    ▼              ▼              ▼
           ┌──────────────┐ ┌──────────────┐ ┌──────────────┐
           │ 채용 플랫폼   │ │ 기업 직접     │ │ 사용자 커스텀 │
           │ 수집기 (T1~2) │ │ 수집기 (T3)  │ │ 수집기       │
           └──────┬───────┘ └──────┬───────┘ └──────┬───────┘
                  │                │                │
                  └────────────────┼────────────────┘
                                   ▼
                        ┌─────────────────────┐
                        │   정규화 & 중복 제거  │
                        │  (source+sourceId)   │
                        └──────────┬──────────┘
                                   ▼
                        ┌─────────────────────┐
                        │  기술 스택 추출       │
                        │  (제목+본문 NLP)      │
                        │  필수/우대 분리        │
                        └──────────┬──────────┘
                                   ▼
                        ┌─────────────────────┐
                        │  직군 자동 분류       │
                        │  (규칙 기반 + 키워드) │
                        └──────────┬──────────┘
                                   ▼
                        ┌─────────────────────┐
                        │  회사 매칭/생성       │
                        │  (이름 정규화, 중복)  │
                        └──────────┬──────────┘
                                   ▼
                        ┌─────────────────────┐
                        │  DB 저장 (Upsert)    │
                        │  + 알림 트리거        │
                        └──────────┬──────────┘
                                   ▼
                        ┌─────────────────────┐
                        │  기술 분석 스냅샷 갱신 │
                        │  (일일/주간 통계)      │
                        └─────────────────────┘
```

### 기술 스택 추출 엔진

채용공고 본문에서 기술 키워드를 자동 추출하는 엔진:

```typescript
// 추출 전략
// 1. 사전 기반: 알려진 기술 키워드 사전 매칭 (TechPulse의 keywordExtractor 재활용 가능)
// 2. 필수/우대 분리: "자격 요건" vs "우대 사항" 섹션 감지
// 3. 경력 추출: "경력 3~5년", "신입/경력", "5년 이상" 패턴 파싱
// 4. 연봉 추출: "6,000만~8,000만", "협의", "$120K~$180K" 패턴 파싱
// 5. 직군 분류: 제목 + 기술 스택 조합으로 카테고리 자동 분류
```

---

## 프로젝트 구조 (예상)

```
dev-jobs-radar/
├── public/
├── src/
│   ├── components/
│   │   ├── dashboard/           # 메인 대시보드
│   │   │   ├── JobFeed.tsx           # 공고 피드 리스트
│   │   │   ├── JobCard.tsx           # 개별 공고 카드
│   │   │   ├── FilterSidebar.tsx     # 직군/기술/조건 필터
│   │   │   ├── SkillTrend.tsx        # 기술 트렌드 차트
│   │   │   └── QuickStats.tsx        # 요약 통계 바
│   │   ├── calendar/            # 채용 캘린더
│   │   │   ├── CalendarView.tsx      # 월간 캘린더
│   │   │   └── DeadlineList.tsx      # 마감일 리스트
│   │   ├── company/             # 기업 탐색/프로필
│   │   │   ├── CompanyExplorer.tsx   # 기업 탐색 페이지
│   │   │   ├── CompanyProfile.tsx    # 기업 상세 프로필
│   │   │   └── CompanyCard.tsx       # 기업 카드
│   │   ├── analysis/            # 기술 분석
│   │   │   ├── SkillAnalysis.tsx     # 직군별 기술 분석
│   │   │   ├── SkillChart.tsx        # 기술 차트
│   │   │   ├── SkillComparison.tsx   # 기술 비교
│   │   │   └── MarketInsight.tsx     # 시장 인사이트
│   │   ├── tracking/            # 지원 추적
│   │   │   ├── ApplicationTracker.tsx # 지원 현황 보드
│   │   │   └── ApplicationCard.tsx   # 지원 카드
│   │   ├── watchlist/           # 관심 기업 & 알림
│   │   │   ├── WatchList.tsx         # 관심 기업 목록
│   │   │   └── AlertSettings.tsx     # 알림 설정
│   │   ├── layout/              # 공통 레이아웃
│   │   │   ├── AppLayout.tsx
│   │   │   ├── Header.tsx
│   │   │   ├── Sidebar.tsx
│   │   │   └── Navigation.tsx
│   │   └── ui/                  # shadcn/ui 컴포넌트
│   ├── hooks/
│   │   ├── useJobs.ts           # 채용공고 데이터 fetch
│   │   ├── useCompanies.ts      # 기업 데이터
│   │   ├── useSkillAnalysis.ts  # 기술 분석 데이터
│   │   ├── useCalendar.ts       # 캘린더 데이터
│   │   ├── useWatchlist.ts      # 관심 기업 관리
│   │   └── useApplications.ts   # 지원 추적
│   ├── services/
│   │   ├── collectors/          # 채용공고 수집기
│   │   │   ├── types.ts              # 공통 인터페이스
│   │   │   ├── index.ts              # 수집기 레지스트리
│   │   │   ├── wanted.ts             # 원티드
│   │   │   ├── saramin.ts            # 사람인
│   │   │   ├── jobkorea.ts           # 잡코리아
│   │   │   ├── programmers.ts        # 프로그래머스
│   │   │   ├── jumpit.ts             # 점핏
│   │   │   ├── linkedin.ts           # 링크드인
│   │   │   └── ...                   # 기업별 수집기
│   │   ├── skillExtractor.ts    # 기술 스택 추출 엔진
│   │   ├── jobClassifier.ts     # 직군 자동 분류기
│   │   ├── companyMatcher.ts    # 회사명 정규화/매칭
│   │   ├── skillAnalyzer.ts     # 기술 통계 분석
│   │   ├── salaryParser.ts      # 연봉 파싱
│   │   ├── pipeline.ts          # 수집 파이프라인
│   │   └── alertEngine.ts       # 알림 엔진
│   ├── stores/
│   │   ├── jobStore.ts          # 채용공고 상태
│   │   ├── filterStore.ts       # 필터 상태
│   │   ├── companyStore.ts      # 기업 데이터 상태
│   │   ├── watchlistStore.ts    # 관심 기업 상태
│   │   ├── applicationStore.ts  # 지원 추적 상태
│   │   └── userStore.ts         # 사용자 설정
│   ├── types/
│   │   ├── job.ts               # 채용공고 타입
│   │   ├── company.ts           # 기업 타입
│   │   ├── skill.ts             # 기술 분석 타입
│   │   ├── user.ts              # 사용자 타입
│   │   └── index.ts
│   ├── data/
│   │   ├── skills.ts            # 기술 키워드 사전
│   │   ├── companies.ts         # 기업 시드 데이터
│   │   ├── categories.ts        # 직군 카테고리
│   │   └── regions.ts           # 지역 분류
│   └── lib/
│       ├── api.ts               # API 클라이언트
│       ├── supabase.ts          # Supabase 클라이언트
│       └── utils.ts
├── api/                          # Vercel Serverless Functions
│   ├── collect/
│   │   ├── [source].ts          # 개별 소스 수집
│   │   └── custom.ts            # 사용자 커스텀 소스
│   ├── jobs/
│   │   ├── search.ts            # 공고 검색 API
│   │   └── [id].ts              # 공고 상세
│   ├── companies/
│   │   ├── index.ts             # 기업 목록
│   │   └── [id].ts              # 기업 상세
│   ├── analysis/
│   │   ├── skills.ts            # 기술 분석 API
│   │   └── market.ts            # 시장 인사이트
│   ├── alerts/
│   │   └── check.ts             # 알림 체크 & 발송
│   └── cron/
│       ├── collect-all.ts       # 전체 수집 크론
│       └── analyze.ts           # 분석 스냅샷 크론
├── tests/
│   ├── services/
│   ├── components/
│   ├── stores/
│   └── setup.ts
├── package.json
├── vite.config.ts
├── vitest.config.ts
└── PLAN.md
```

---

## 개발 로드맵

### Phase 0: 프로젝트 세팅 & 기반 구조 (Day 1-2)
- [ ] PLAN.md 작성
- [ ] React + Vite + TypeScript 프로젝트 초기화
- [ ] Tailwind CSS v4 + shadcn/ui 설정
- [ ] ESLint + Prettier 설정
- [ ] 타입 정의 (job.ts, company.ts, skill.ts, user.ts)
- [ ] 기술 키워드 사전 (skills.ts) — 500+ 기술 키워드 분류
- [ ] 직군 카테고리 데이터 (categories.ts)
- [ ] 기업 시드 데이터 (companies.ts) — 30개 주요 기업 기본 정보
- [ ] 목 데이터 기반 대시보드 UI 스캐폴딩
- [ ] Vitest + RTL 테스트 설정
- [ ] ✅ **테스트**: 타입 무결성, 데이터 소스, 컴포넌트 렌더 테스트

### Phase 1: Tier 1 채용 플랫폼 수집기 (Day 3-7)
- [ ] 공통 수집기 인터페이스 & 파이프라인
- [ ] 기술 스택 추출 엔진 (skillExtractor.ts)
- [ ] 직군 자동 분류기 (jobClassifier.ts)
- [ ] 연봉 파싱 엔진 (salaryParser.ts)
- [ ] 회사명 정규화 엔진 (companyMatcher.ts)
- [ ] 원티드 (Wanted) 수집기
- [ ] 사람인 (Saramin) 수집기
- [ ] 잡코리아 (JobKorea) 수집기
- [ ] 프로그래머스 (Programmers) 수집기
- [ ] 점핏 (Jumpit) 수집기
- [ ] Vercel Cron 스케줄링
- [ ] ✅ **테스트**: 각 수집기 단위 테스트, 기술 추출 정확도, 파이프라인 통합

### Phase 2: 프론트엔드 대시보드 & 필터 (Day 8-13)
- [ ] 메인 대시보드 레이아웃 (Header, Sidebar, Navigation)
- [ ] 채용공고 피드 (JobFeed, JobCard) — 무한 스크롤
- [ ] 필터 사이드바 (직군, 기술, 경력, 지역, 연봉)
- [ ] 공고 상세 페이지 (기술 스택 하이라이트)
- [ ] 검색 기능 (제목, 회사, 기술)
- [ ] 채용 캘린더 뷰 (CalendarView, 마감일 기반)
- [ ] 요약 통계 바 (오늘 새 공고, 마감 임박, 관심 기업 새 공고)
- [ ] 반응형 디자인 (모바일)
- [ ] ✅ **테스트**: 페이지 렌더, 필터 인터랙션, 검색, 캘린더

### Phase 3: 기술 분석 & 인사이트 (Day 14-17)
- [ ] 기술 분석 엔진 (skillAnalyzer.ts)
- [ ] 직군별 기술 트렌드 차트 (Recharts)
- [ ] 기술 조합 분석
- [ ] 경력별/기업규모별 기술 비교
- [ ] 전월/전분기 트렌드 변화
- [ ] 시장 인사이트 대시보드
- [ ] ✅ **테스트**: 분석 엔진, 차트 데이터 바인딩

### Phase 4: 기업 탐색 & 관심 기업 (Day 18-21)
- [ ] 기업 탐색 페이지 (CompanyExplorer)
- [ ] 기업 프로필 페이지 (채용 히스토리, 기술 프로필)
- [ ] 관심 기업 등록 & 관리
- [ ] Tier 2 수집기 (LinkedIn, 랠릿, 로켓펀치, 인디드)
- [ ] ✅ **테스트**: 기업 탐색, 프로필, 관심 기업 CRUD

### Phase 5: 기업 직접 채용페이지 수집기 (Day 22-26)
- [ ] Tier 3 수집기 — 주요 기업 직접 채용페이지
  - [ ] 네이버, 카카오, 라인, 쿠팡
  - [ ] 토스, 당근, 배민
  - [ ] 삼성SDS, LG CNS
  - [ ] 게임사 (넥슨, 크래프톤, NC)
- [ ] 사용자 커스텀 URL 모니터링 기능
- [ ] ✅ **테스트**: 각 기업 수집기, 커스텀 URL 수집

### Phase 6: 사용자 기능 & 알림 (Day 27-31)
- [ ] Supabase 연동 (DB + Auth)
- [ ] 사용자 프로필 설정
- [ ] 지원 추적 기능 (ApplicationTracker)
- [ ] 관심 기업 알림 (새 공고 시 이메일/웹 푸시)
- [ ] 키워드 알림
- [ ] 조건 기반 알림
- [ ] 일간 다이제스트 이메일
- [ ] ✅ **테스트**: 인증, 프로필 CRUD, 지원 추적, 알림 로직

### Phase 7: 고도화 (Day 32+)
- [ ] AI 기반 공고 요약 (OpenAI API)
- [ ] 기술 매칭 점수 ("이 공고와 85% 일치")
- [ ] 면접 준비 도우미 (공고 기반 예상 질문)
- [ ] 다크 모드
- [ ] PWA 지원
- [ ] 성능 최적화 (가상화 리스트, 코드 스플리팅)
- [ ] ✅ **테스트**: E2E 시나리오

---

## 기술 키워드 사전 (일부 예시)

> 공고에서 자동 추출할 기술 키워드 사전. 500+ 기술을 카테고리별로 분류.

```typescript
const SKILL_DICTIONARY = {
  languages: {
    'Java': ['java', 'jdk', 'jvm'],
    'Python': ['python', 'python3'],
    'JavaScript': ['javascript', 'js', 'ecmascript'],
    'TypeScript': ['typescript', 'ts'],
    'Go': ['go', 'golang'],
    'Rust': ['rust'],
    'C++': ['c++', 'cpp'],
    'C#': ['c#', 'csharp', '.net'],
    'Kotlin': ['kotlin'],
    'Swift': ['swift'],
    'Scala': ['scala'],
    'Ruby': ['ruby'],
    'PHP': ['php'],
    'Dart': ['dart'],
    // ...
  },
  frontend: {
    'React': ['react', 'reactjs', 'react.js'],
    'Vue': ['vue', 'vuejs', 'vue.js'],
    'Angular': ['angular'],
    'Next.js': ['next.js', 'nextjs', 'next'],
    'Nuxt': ['nuxt', 'nuxtjs'],
    'Svelte': ['svelte', 'sveltekit'],
    'TypeScript': ['typescript'],
    'Tailwind': ['tailwind', 'tailwindcss'],
    'Webpack': ['webpack'],
    'Vite': ['vite'],
    // ...
  },
  backend: {
    'Spring': ['spring', 'spring boot', 'springboot'],
    'Node.js': ['node.js', 'nodejs', 'node'],
    'Express': ['express', 'expressjs'],
    'NestJS': ['nestjs', 'nest.js'],
    'Django': ['django'],
    'FastAPI': ['fastapi'],
    'Flask': ['flask'],
    'Ruby on Rails': ['rails', 'ruby on rails'],
    'ASP.NET': ['asp.net', 'aspnet'],
    // ...
  },
  database: {
    'MySQL': ['mysql'],
    'PostgreSQL': ['postgresql', 'postgres', 'pg'],
    'MongoDB': ['mongodb', 'mongo'],
    'Redis': ['redis'],
    'Oracle': ['oracle', 'oracle db'],
    'Elasticsearch': ['elasticsearch', 'elastic'],
    'DynamoDB': ['dynamodb'],
    'Cassandra': ['cassandra'],
    // ...
  },
  devops: {
    'Docker': ['docker'],
    'Kubernetes': ['kubernetes', 'k8s'],
    'AWS': ['aws', 'amazon web services'],
    'GCP': ['gcp', 'google cloud'],
    'Azure': ['azure', 'microsoft azure'],
    'Terraform': ['terraform'],
    'Jenkins': ['jenkins'],
    'GitHub Actions': ['github actions'],
    'ArgoCD': ['argocd', 'argo cd'],
    'Prometheus': ['prometheus'],
    'Grafana': ['grafana'],
    // ...
  },
  messaging: {
    'Kafka': ['kafka', 'apache kafka'],
    'RabbitMQ': ['rabbitmq'],
    'Redis Pub/Sub': ['redis pub/sub'],
    'gRPC': ['grpc'],
    'GraphQL': ['graphql'],
    // ...
  },
  ai_ml: {
    'TensorFlow': ['tensorflow'],
    'PyTorch': ['pytorch'],
    'LLM': ['llm', 'large language model'],
    'RAG': ['rag'],
    'LangChain': ['langchain'],
    'Hugging Face': ['huggingface', 'hugging face'],
    'MLflow': ['mlflow'],
    'Kubeflow': ['kubeflow'],
    // ...
  },
  // ... 500+ 기술 키워드
}
```

---

## 테스트 전략

> TechPulse와 동일하게 **테스트 없는 코드는 머지하지 않는다.**

### 테스트 원칙

1. **각 Phase 완료 조건에 테스트 통과 포함**
2. **수집기는 반드시 단위 테스트** — 목(mock) 응답으로 독립 테스트
3. **기술 추출 엔진** — 공고 샘플에서 기술 추출 정확도 테스트
4. **분류기** — 직군 분류 정확도 테스트
5. **스토어/훅** — 상태 변화 테스트
6. **컴포넌트** — 사용자 관점 렌더 + 인터랙션 테스트

### 커버리지 목표
- **수집기/서비스 로직**: 80%+
- **Zustand 스토어**: 90%+
- **UI 컴포넌트**: 핵심 인터랙션 100%
- **shadcn/ui 래퍼**: 제외

---

## 차별화 포인트

1. **통합 수집** — 플랫폼 + 기업 직접 채용페이지까지 한 곳에서
2. **기술 스택 분석** — 단순 공고 나열이 아닌 "시장이 원하는 기술" 인사이트
3. **관심 기업 모니터링** — 매일 들어가서 확인할 필요 없음
4. **지원 추적** — 관심 → 지원 → 면접 → 결과까지 한 곳에서 관리
5. **숨은 기업 발견** — 내 기술과 매칭되는 모르는 기업 추천
6. **채용 캘린더** — 마감일 놓치지 않기

---

## 참고 서비스 & 벤치마크

- [원티드 (Wanted)](https://www.wanted.co.kr/) — 한국 IT 채용 플랫폼
- [점핏 (Jumpit)](https://www.jumpit.co.kr/) — 개발자 특화 채용
- [프로그래머스 채용](https://career.programmers.co.kr/) — 코딩테스트 기반 채용
- [dev.careers](https://dev.careers/) — 한국 IT 기업 채용 모아보기 (영감)
- [levels.fyi](https://www.levels.fyi/) — 연봉 비교 (해외)
- [TechPulse](https://github.com/NoirStar/tech-pulse) — 자매 프로젝트 (기술 트렌드)

---

## 향후 확장 아이디어

- **TechPulse 연동** — 트렌딩 기술 + 채용 시장 수요 교차 분석 ("Rust가 트렌딩인데, 채용은 아직 적음")
- **면접 후기 수집** — 블라인드, 잡플래닛에서 면접 후기 연동
- **이력서 최적화** — "이 직군에서 가장 중요한 키워드를 이력서에 포함하세요"
- **슬랙/디스코드 봇** — 원하는 채널로 새 공고 알림
- **다국어** — 해외 취업 (일본, 동남아, 유럽 등) 공고도 수집
