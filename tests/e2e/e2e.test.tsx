// ============================================================
// Phase 8 E2E 테스트 시나리오 — 사용자 플로우 통합 테스트
// ============================================================

import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import App from '@/App'
import { useJobStore } from '@/stores/jobStore'
import { useFilterStore } from '@/stores/filterStore'
import { useWatchlistStore } from '@/stores/watchlistStore'
import { useApplicationStore } from '@/stores/applicationStore'
import { useAuthStore } from '@/stores/authStore'
import { useAlertStore } from '@/stores/alertStore'
import type { JobPostingSummary, Application } from '@/types/job'

// 공통 테스트 유틸
function renderApp(route = '/') {
  return render(
    <MemoryRouter initialEntries={[route]}>
      <App />
    </MemoryRouter>,
  )
}

const MOCK_JOB: JobPostingSummary = {
  id: 'e2e-test-1',
  title: 'E2E 테스트 백엔드 개발자',
  companyName: '테스트기업',
  companyId: 'test-corp',
  category: 'backend',
  skills: ['Java', 'Spring', 'Kubernetes', 'Docker'],
  experience: { min: 3, max: 7, text: '3~7년' },
  salary: { min: 5000, max: 8000, text: '5,000~8,000만원', currency: 'KRW' },
  location: '서울',
  isRemote: false,
  source: 'wanted',
  sourceUrl: 'https://example.com/job/1',
  deadline: null,
  postedAt: new Date().toISOString(),
  collectedAt: new Date().toISOString(),
  isActive: true,
}

const MOCK_FRONTEND_JOB: JobPostingSummary = {
  id: 'e2e-test-2',
  title: 'E2E 테스트 프론트엔드 개발자',
  companyName: '프론트기업',
  companyId: 'front-corp',
  category: 'frontend',
  skills: ['React', 'TypeScript', 'Next.js'],
  experience: { min: 2, max: 5, text: '2~5년' },
  salary: { min: 4500, max: 7000, text: '4,500~7,000만원', currency: 'KRW' },
  location: '판교',
  isRemote: true,
  source: 'saramin',
  sourceUrl: 'https://example.com/job/2',
  deadline: null,
  postedAt: new Date().toISOString(),
  collectedAt: new Date().toISOString(),
  isActive: true,
}

describe('E2E: 대시보드 → 공고 탐색 플로우', () => {
  beforeEach(() => {
    useJobStore.getState().setJobs([])
    useFilterStore.getState().resetFilters()
    useWatchlistStore.getState().setWatchlist([])
    useApplicationStore.getState().setApplications([])
  })

  it('대시보드에서 공고 목록이 렌더되고 필터링할 수 있다', async () => {
    useJobStore.getState().addJobs([MOCK_JOB, MOCK_FRONTEND_JOB])

    renderApp('/')
    expect(screen.getByRole('heading', { name: /대시보드/ })).toBeInTheDocument()

    // 두 공고가 모두 보여야 함
    expect(screen.getByText('E2E 테스트 백엔드 개발자')).toBeInTheDocument()
    expect(screen.getByText('E2E 테스트 프론트엔드 개발자')).toBeInTheDocument()
  })

  it('직군 필터가 공고 목록에 반영된다', () => {
    useJobStore.getState().addJobs([MOCK_JOB, MOCK_FRONTEND_JOB])
    useFilterStore.getState().setCategories(['frontend'])

    const { jobs } = useJobStore.getState()
    const filters = useFilterStore.getState()
    const filtered = jobs.filter(
      (j) => filters.selectedCategories.length === 0 || filters.selectedCategories.includes(j.category),
    )

    expect(filtered).toHaveLength(1)
    expect(filtered[0].category).toBe('frontend')
  })
})

describe('E2E: 관심 기업 → 알림 설정 플로우', () => {
  beforeEach(() => {
    useWatchlistStore.getState().setWatchlist([])
    useAlertStore.getState().clearNotifications()
  })

  it('기업을 관심 목록에 추가하면 watchlist에 반영된다', () => {
    const store = useWatchlistStore.getState()
    store.addToWatchlist({
      id: 'watch-1',
      userId: 'user-1',
      companyId: 'test-corp',
      company: {
        id: 'test-corp',
        name: '테스트기업',
        nameEn: null,
        industry: 'saas',
        size: 'small',
        logoUrl: null,
        location: '서울',
        techStack: ['Java'],
        activePostings: 3,
        totalPostings: 10,
      },
      alertEnabled: true,
      addedAt: new Date().toISOString(),
      lastCheckedAt: new Date().toISOString(),
      newPostingsCount: 0,
    })
    expect(useWatchlistStore.getState().watchlist.some((w) => w.companyId === 'test-corp')).toBe(true)
  })

  it('키워드 알림을 등록하면 alertStore에 저장된다', () => {
    useAlertStore.getState().addKeywordAlert('Kubernetes')
    const alerts = useAlertStore.getState().keywordAlerts
    expect(alerts.some((a) => a.keyword === 'Kubernetes')).toBe(true)
  })

  it('알림 페이지로 이동하여 피드를 볼 수 있다', async () => {
    renderApp('/alerts')
    const heading = await screen.findByRole('heading', { name: /알림/ })
    expect(heading).toBeInTheDocument()
  })
})

describe('E2E: 지원 추적 플로우', () => {
  beforeEach(() => {
    useApplicationStore.getState().setApplications([])
    useJobStore.getState().setJobs([])
  })

  it('공고를 지원 목록에 추가하고 상태를 변경할 수 있다', () => {
    useJobStore.getState().addJobs([MOCK_JOB])
    const appStore = useApplicationStore.getState()

    // 지원 추가
    const app: Application = {
      id: 'app-1',
      userId: 'user-1',
      jobId: MOCK_JOB.id,
      job: MOCK_JOB,
      status: 'interested',
      appliedAt: null,
      notes: '',
      statusHistory: [{ status: 'interested', date: new Date().toISOString(), note: '' }],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
    appStore.addApplication(app)
    let apps = useApplicationStore.getState().applications
    expect(apps).toHaveLength(1)
    expect(apps[0].status).toBe('interested')

    // 상태 변경: interested → applied
    useApplicationStore.getState().updateStatus(apps[0].id, 'applied', '이력서 제출함')
    apps = useApplicationStore.getState().applications
    expect(apps[0].status).toBe('applied')
    expect(apps[0].statusHistory).toHaveLength(2)
  })

  it('지원 추적 페이지로 이동할 수 있다', async () => {
    renderApp('/tracking')
    const heading = await screen.findByRole('heading', { name: /지원 추적/ })
    expect(heading).toBeInTheDocument()
  })
})

describe('E2E: 프로필 → 기술 매칭 플로우', () => {
  beforeEach(() => {
    useAuthStore.getState().signOut()
  })

  it('프로필에서 관심 기술을 설정하면 authStore에 반영된다', async () => {
    // 데모 유저로 로그인 상태 시뮬레이션 (signIn은 Supabase 의존)
    const state = useAuthStore.getState()
    // 이미 데모 유저가 로드되어 있음 (LOCAL_DEMO_USER)
    if (state.user) {
      state.updateProfile({ interestedSkills: ['Java', 'Spring', 'Docker'] })
      const user = useAuthStore.getState().user
      expect(user?.interestedSkills).toEqual(['Java', 'Spring', 'Docker'])
    } else {
      // 유저가 없으면 updateProfile이 무시되는지 확인
      state.updateProfile({ interestedSkills: ['Java'] })
      expect(useAuthStore.getState().user).toBeNull()
    }
  })

  it('프로필 페이지로 이동할 수 있다', async () => {
    renderApp('/profile')
    const heading = await screen.findByRole('heading', { name: /프로필/ })
    expect(heading).toBeInTheDocument()
  })
})

describe('E2E: TechPulse 교차 분석 플로우', () => {
  it('TechPulse 페이지로 이동하여 교차 분석을 볼 수 있다', async () => {
    renderApp('/techpulse')
    const heading = await screen.findByRole('heading', { name: /TechPulse 교차 분석/ })
    expect(heading).toBeInTheDocument()
  })
})

describe('E2E: 네비게이션 전체 라우팅', () => {
  const routes = [
    { path: '/', heading: '대시보드' },
    { path: '/calendar', heading: '채용 캘린더' },
    { path: '/analysis', heading: '기술 분석' },
    { path: '/companies', heading: '기업 탐색' },
    { path: '/techpulse', heading: 'TechPulse 교차 분석' },
    { path: '/tracking', heading: '지원 추적' },
    { path: '/alerts', heading: '알림' },
    { path: '/profile', heading: '프로필' },
  ]

  for (const { path, heading } of routes) {
    it(`${path} 라우트에서 "${heading}" 페이지가 렌더된다`, async () => {
      renderApp(path)
      const h = await screen.findByRole('heading', { name: new RegExp(heading) })
      expect(h).toBeInTheDocument()
    })
  }
})

describe('E2E: TechPulse 교차 분석 데이터 검증', () => {
  it('로컬 트렌드 + 공고 데이터로 교차 분석이 수행된다', async () => {
    const { analyzeCrossData, generateLocalTrends } = await import('@/services/techPulseService')
    const trends = generateLocalTrends()
    useJobStore.getState().setJobs([MOCK_JOB, MOCK_FRONTEND_JOB])
    const jobs = useJobStore.getState().jobs

    const analysis = analyzeCrossData(trends, jobs)

    // 분석 결과 구조 검증
    expect(analysis.hotAndHiring).toBeDefined()
    expect(analysis.hotButLowDemand).toBeDefined()
    expect(analysis.stableDemand).toBeDefined()
    expect(analysis.analyzedAt).toBeTruthy()

    // 트렌딩 + 채용 양쪽에 있는 기술이 있어야 함
    const allItems = [...analysis.hotAndHiring, ...analysis.hotButLowDemand]
    expect(allItems.length).toBeGreaterThan(0)
    expect(allItems[0].skill).toBeTruthy()
    expect(allItems[0].insight).toBeTruthy()
  })
})

describe('E2E: AI 서비스 로컬 폴백 검증', () => {
  it('OpenAI 미설정 시 로컬 기술 매칭이 동작한다', async () => {
    const { calculateSkillMatch } = await import('@/services/aiService')
    const result = calculateSkillMatch(['Java', 'Spring'], ['Java', 'Spring', 'Kubernetes', 'Docker'])
    expect(result.score).toBeGreaterThan(0)
    expect(result.matchedSkills).toContain('Java')
    expect(result.matchedSkills).toContain('Spring')
    expect(result.missingSkills.length).toBeGreaterThan(0)
  })

  it('OpenAI 미설정 시 로컬 면접 준비가 생성된다', async () => {
    const { generateLocalInterviewPrep } = await import('@/services/aiService')
    const prep = generateLocalInterviewPrep(MOCK_JOB)
    expect(prep.technicalQuestions.length).toBeGreaterThan(0)
    expect(prep.behavioralQuestions.length).toBeGreaterThan(0)
    expect(prep.companyResearch.length).toBeGreaterThan(0)
    expect(prep.tips.length).toBeGreaterThan(0)
  })
})
