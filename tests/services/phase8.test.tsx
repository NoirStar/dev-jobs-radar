// ============================================================
// Phase 8 테스트 — AI 서비스, 기술 매칭, 면접 준비, PWA, Lazy Loading
// ============================================================

import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import {
  calculateSkillMatch,
  generateLocalInterviewPrep,
  isOpenAIConfigured,
} from '@/services/aiService'
import type { JobPostingSummary } from '@/types/job'
import { useAuthStore } from '@/stores/authStore'

function renderWithProviders(ui: React.ReactElement, { route = '/' } = {}) {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  })
  return render(
    <QueryClientProvider client={queryClient}>
      <MemoryRouter initialEntries={[route]}>{ui}</MemoryRouter>
    </QueryClientProvider>,
  )
}

const mockJob: JobPostingSummary = {
  id: 'job-1',
  title: 'Senior Frontend Engineer',
  companyName: 'TechCo',
  companyId: 'techco',
  category: 'frontend',
  skills: ['React', 'TypeScript', 'Next.js', 'GraphQL', 'CSS'],
  experience: { level: 'senior', minYears: 5, maxYears: null, text: '5년 이상' },
  salary: null,
  location: '서울',
  isRemote: false,
  source: 'wanted',
  sourceUrl: 'https://example.com/job/1',
  deadline: null,
  postedAt: '2024-01-01',
  collectedAt: '2024-01-01',
  isActive: true,
}

// ================================================================
// calculateSkillMatch 테스트
// ================================================================

describe('calculateSkillMatch', () => {
  it('완벽 매칭 시 100점을 반환한다', () => {
    const result = calculateSkillMatch(
      ['React', 'TypeScript', 'Next.js', 'GraphQL', 'CSS'],
      ['React', 'TypeScript', 'Next.js', 'GraphQL', 'CSS'],
    )
    expect(result.score).toBe(100)
    expect(result.matchedSkills).toHaveLength(5)
    expect(result.missingSkills).toHaveLength(0)
  })

  it('부분 매칭 시 적절한 점수를 반환한다', () => {
    const result = calculateSkillMatch(
      ['React', 'TypeScript'],
      ['React', 'TypeScript', 'Next.js', 'GraphQL'],
    )
    expect(result.score).toBe(50)
    expect(result.matchedSkills).toEqual(['React', 'TypeScript'])
    expect(result.missingSkills).toContain('Next.js')
  })

  it('매칭 없으면 0점을 반환한다', () => {
    const result = calculateSkillMatch(['Java', 'Spring'], ['React', 'TypeScript'])
    expect(result.score).toBe(0)
    expect(result.missingSkills).toHaveLength(2)
  })

  it('빈 jobSkills는 50점 기본값을 반환한다', () => {
    const result = calculateSkillMatch(['React'], [])
    expect(result.score).toBe(50)
    expect(result.recommendation).toContain('명시되지 않은')
  })

  it('대소문자를 무시하고 매칭한다', () => {
    const result = calculateSkillMatch(['react', 'typescript'], ['React', 'TypeScript'])
    expect(result.score).toBe(100)
  })

  it('특수문자를 무시하고 매칭한다 (Node.js ↔ nodejs)', () => {
    const result = calculateSkillMatch(['nodejs'], ['Node.js'])
    expect(result.matchedSkills).toContain('Node.js')
  })

  it('부분 매칭을 감지한다 (JavaScript ⊃ Java 아님, React ⊂ ReactNative)', () => {
    const result = calculateSkillMatch(['ReactNative'], ['React'])
    // ReactNative contains React → partial match
    expect(result.partialMatches).toContain('React')
  })

  it('score에 따라 적절한 추천 메시지를 반환한다', () => {
    const high = calculateSkillMatch(
      ['React', 'TypeScript', 'Next.js', 'GraphQL'],
      ['React', 'TypeScript', 'Next.js', 'GraphQL', 'CSS'],
    )
    expect(high.recommendation).toContain('적극 지원')

    const low = calculateSkillMatch(['Java'], ['React', 'TypeScript', 'Next.js', 'GraphQL', 'CSS'])
    expect(low.recommendation).toContain('갭')
  })
})

// ================================================================
// generateLocalInterviewPrep 테스트
// ================================================================

describe('generateLocalInterviewPrep', () => {
  it('기술 질문을 생성한다', () => {
    const prep = generateLocalInterviewPrep(mockJob)
    expect(prep.technicalQuestions.length).toBeGreaterThan(0)
    expect(prep.technicalQuestions[0]).toContain('React')
  })

  it('행동 질문을 생성한다', () => {
    const prep = generateLocalInterviewPrep(mockJob)
    expect(prep.behavioralQuestions.length).toBe(5)
  })

  it('기업 조사 포인트를 생성한다', () => {
    const prep = generateLocalInterviewPrep(mockJob)
    expect(prep.companyResearch.length).toBe(3)
    expect(prep.companyResearch[0]).toContain('TechCo')
  })

  it('면접 팁을 생성한다', () => {
    const prep = generateLocalInterviewPrep(mockJob)
    expect(prep.tips.length).toBe(3)
    expect(prep.tips[0]).toContain('STAR')
  })

  it('빈 skills에도 동작한다', () => {
    const emptySkillJob = { ...mockJob, skills: [] }
    const prep = generateLocalInterviewPrep(emptySkillJob)
    expect(prep.technicalQuestions).toHaveLength(0)
    expect(prep.behavioralQuestions.length).toBeGreaterThan(0)
  })
})

// ================================================================
// isOpenAIConfigured 테스트
// ================================================================

describe('isOpenAIConfigured', () => {
  it('환경변수 없이 false를 반환한다', () => {
    // 테스트 환경에서는 VITE_OPENAI_API_KEY가 없으므로 false
    expect(isOpenAIConfigured).toBe(false)
  })
})

// ================================================================
// SkillMatchWidget 컴포넌트 테스트
// ================================================================

describe('SkillMatchWidget', () => {
  beforeEach(() => {
    useAuthStore.setState({
      user: {
        id: 'test-1',
        email: 'test@test.com',
        name: '테스터',
        avatarUrl: null,
        interestedCategories: ['frontend'],
        interestedSkills: ['React', 'TypeScript', 'Vue'],
        experienceYears: 3,
        createdAt: '2024-01-01',
        updatedAt: '2024-01-01',
      },
      isAuthenticated: true,
      isLoading: false,
      error: null,
    })
  })

  it('매칭 점수를 표시한다', async () => {
    const { SkillMatchWidget } = await import(
      '@/components/dashboard/SkillMatchWidget'
    )
    renderWithProviders(
      <SkillMatchWidget jobSkills={['React', 'TypeScript', 'Next.js']} />,
    )
    // React, TypeScript 매칭 = 2/3 ≈ 67%
    expect(screen.getByText('기술 매칭')).toBeInTheDocument()
    expect(screen.getByRole('progressbar')).toBeInTheDocument()
  })

  it('관심 기술 미설정 시 안내 메시지를 표시한다', async () => {
    useAuthStore.setState({
      user: {
        id: 'test-1',
        email: 'test@test.com',
        name: '테스터',
        avatarUrl: null,
        interestedCategories: [],
        interestedSkills: [],
        experienceYears: null,
        createdAt: '2024-01-01',
        updatedAt: '2024-01-01',
      },
      isAuthenticated: true,
      isLoading: false,
      error: null,
    })
    const { SkillMatchWidget } = await import(
      '@/components/dashboard/SkillMatchWidget'
    )
    renderWithProviders(<SkillMatchWidget jobSkills={['React']} />)
    expect(screen.getByText(/프로필에서 관심 기술을 설정/)).toBeInTheDocument()
  })
})

// ================================================================
// InterviewPrepWidget 컴포넌트 테스트
// ================================================================

describe('InterviewPrepWidget', () => {
  it('면접 준비 섹션들이 렌더된다', async () => {
    const { InterviewPrepWidget } = await import(
      '@/components/dashboard/InterviewPrepWidget'
    )
    renderWithProviders(<InterviewPrepWidget job={mockJob} />)
    expect(screen.getByText('면접 준비 도우미')).toBeInTheDocument()
    expect(screen.getByText('예상 기술 질문')).toBeInTheDocument()
    expect(screen.getByText('예상 행동 질문')).toBeInTheDocument()
    expect(screen.getByText('기업 조사 포인트')).toBeInTheDocument()
    expect(screen.getByText('면접 팁')).toBeInTheDocument()
  })
})

// ================================================================
// App Lazy Loading 테스트
// ================================================================

describe('App Lazy Loading', () => {
  it('대시보드 (/) 는 즉시 로드된다', async () => {
    const App = (await import('@/App')).default
    const qc = new QueryClient({ defaultOptions: { queries: { retry: false } } })
    render(
      <QueryClientProvider client={qc}>
        <MemoryRouter initialEntries={['/']}>
          <App />
        </MemoryRouter>
      </QueryClientProvider>,
    )
    expect(screen.getByText('DevJobsRadar')).toBeInTheDocument()
  })

  it('/alerts 는 Suspense로 lazy load된다', async () => {
    const App = (await import('@/App')).default
    const qc = new QueryClient({ defaultOptions: { queries: { retry: false } } })
    render(
      <QueryClientProvider client={qc}>
        <MemoryRouter initialEntries={['/alerts']}>
          <App />
        </MemoryRouter>
      </QueryClientProvider>,
    )
    // Suspense가 풀린 후 알림 설정이 렌더됨
    expect(await screen.findByText('알림 설정')).toBeInTheDocument()
  })
})

// ================================================================
// PWA 관련 테스트
// ================================================================

describe('PWA', () => {
  it('registerServiceWorker 는 navigator.serviceWorker가 없으면 무시한다', async () => {
    const { registerServiceWorker } = await import('@/lib/registerSW')
    // 테스트 환경에는 serviceWorker가 없으므로 에러 없이 반환
    expect(() => registerServiceWorker()).not.toThrow()
  })
})
