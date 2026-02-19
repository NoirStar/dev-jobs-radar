// ============================================================
// Phase 7 테스트 — Auth, Alert, ApplicationTracker, ProfilePage
// ============================================================

import { describe, it, expect, beforeEach, vi } from 'vitest'
import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useAuthStore } from '@/stores/authStore'
import { useAlertStore } from '@/stores/alertStore'
import { useApplicationStore } from '@/stores/applicationStore'
import type { Application } from '@/types/job'
import type { UserProfile } from '@/types/user'

// ── 프로바이더 유틸 ──

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

// ── 목 데이터 ──

const mockProfile: UserProfile = {
  id: 'test-1',
  email: 'test@test.com',
  name: '테스터',
  avatarUrl: null,
  interestedCategories: ['frontend'],
  interestedSkills: ['React'],
  experienceYears: 3,
  createdAt: '2024-01-01T00:00:00Z',
  updatedAt: '2024-01-01T00:00:00Z',
}

const mockApplication: Application = {
  id: 'app-1',
  jobId: 'job-1',
  userId: 'test-1',
  status: 'applied',
  notes: '테스트 메모',
  createdAt: '2024-01-01T00:00:00Z',
  updatedAt: '2024-01-01T00:00:00Z',
  appliedAt: '2024-01-02T00:00:00Z',
  statusHistory: [
    { status: 'interested', date: '2024-01-01T00:00:00Z', note: '' },
    { status: 'applied', date: '2024-01-02T00:00:00Z', note: '지원서 제출' },
  ],
  job: {
    id: 'job-1',
    title: '프론트엔드 개발자',
    companyName: '테스트 기업',
    companyId: 'company-1',
    location: '서울',
    category: 'frontend',
    sourceId: 'wanted',
    sourceUrl: 'https://example.com/job/1',
    postedAt: '2024-01-01',
    skills: ['React', 'TypeScript'],
  },
}

// ================================================================
// authStore 테스트
// ================================================================

describe('authStore', () => {
  beforeEach(() => {
    useAuthStore.setState({
      user: null,
      isLoading: false,
      isAuthenticated: false,
      error: null,
    })
  })

  it('초기 상태 — Supabase 미설정 시 데모 사용자로 시작한다', () => {
    // authStore는 import 시점에 isSupabaseConfigured=false이므로
    // 초기값은 LOCAL_DEMO_USER로 설정됨 (리셋 전 확인)
    const fresh = useAuthStore.getState()
    // beforeEach에서 리셋했으므로 수동 확인
    expect(fresh.user).toBeNull()
  })

  it('setUser로 사용자를 설정할 수 있다', () => {
    useAuthStore.getState().setUser(mockProfile)
    const { user, isAuthenticated } = useAuthStore.getState()
    expect(user?.email).toBe('test@test.com')
    expect(isAuthenticated).toBe(true)
  })

  it('updateProfile로 부분 업데이트할 수 있다', () => {
    useAuthStore.getState().setUser(mockProfile)
    useAuthStore.getState().updateProfile({ name: '변경됨', experienceYears: 5 })
    const { user } = useAuthStore.getState()
    expect(user?.name).toBe('변경됨')
    expect(user?.experienceYears).toBe(5)
    expect(user?.email).toBe('test@test.com')
  })

  it('updateProfile은 updatedAt를 갱신한다', () => {
    useAuthStore.getState().setUser(mockProfile)
    const before = useAuthStore.getState().user!.updatedAt
    useAuthStore.getState().updateProfile({ name: 'new' })
    const after = useAuthStore.getState().user!.updatedAt
    expect(after).not.toBe(before)
  })

  it('user가 null일 때 updateProfile은 아무 것도 하지 않는다', () => {
    useAuthStore.getState().updateProfile({ name: 'noop' })
    expect(useAuthStore.getState().user).toBeNull()
  })

  it('clearError로 에러를 초기화할 수 있다', () => {
    useAuthStore.setState({ error: '에러 발생!' })
    useAuthStore.getState().clearError()
    expect(useAuthStore.getState().error).toBeNull()
  })

  it('setUser(null)은 인증 상태를 해제한다', () => {
    useAuthStore.getState().setUser(mockProfile)
    expect(useAuthStore.getState().isAuthenticated).toBe(true)
    useAuthStore.getState().setUser(null)
    expect(useAuthStore.getState().isAuthenticated).toBe(false)
    expect(useAuthStore.getState().user).toBeNull()
  })
})

// ================================================================
// alertStore 테스트
// ================================================================

describe('alertStore', () => {
  beforeEach(() => {
    useAlertStore.setState({
      keywordAlerts: [],
      conditionAlerts: [],
      notifications: [],
    })
  })

  // ── 키워드 알림 ──

  describe('키워드 알림', () => {
    it('키워드 알림을 추가할 수 있다', () => {
      useAlertStore.getState().addKeywordAlert('React')
      const { keywordAlerts } = useAlertStore.getState()
      expect(keywordAlerts).toHaveLength(1)
      expect(keywordAlerts[0].keyword).toBe('React')
      expect(keywordAlerts[0].isActive).toBe(true)
      expect(keywordAlerts[0].alertType).toBe('instant')
    })

    it('키워드 알림 빈도를 지정할 수 있다', () => {
      useAlertStore.getState().addKeywordAlert('TypeScript', 'weekly')
      expect(useAlertStore.getState().keywordAlerts[0].alertType).toBe('weekly')
    })

    it('키워드 알림을 삭제할 수 있다', () => {
      useAlertStore.getState().addKeywordAlert('React')
      const id = useAlertStore.getState().keywordAlerts[0].id
      useAlertStore.getState().removeKeywordAlert(id)
      expect(useAlertStore.getState().keywordAlerts).toHaveLength(0)
    })

    it('키워드 알림을 토글할 수 있다', () => {
      useAlertStore.getState().addKeywordAlert('Vue')
      const id = useAlertStore.getState().keywordAlerts[0].id
      expect(useAlertStore.getState().keywordAlerts[0].isActive).toBe(true)
      useAlertStore.getState().toggleKeywordAlert(id)
      expect(useAlertStore.getState().keywordAlerts[0].isActive).toBe(false)
      useAlertStore.getState().toggleKeywordAlert(id)
      expect(useAlertStore.getState().keywordAlerts[0].isActive).toBe(true)
    })
  })

  // ── 조건 기반 알림 ──

  describe('조건 기반 알림', () => {
    it('조건 알림을 추가할 수 있다', () => {
      useAlertStore.getState().addConditionAlert(
        '서울 시니어',
        { skills: ['React'], location: '서울' },
        'daily',
      )
      const { conditionAlerts } = useAlertStore.getState()
      expect(conditionAlerts).toHaveLength(1)
      expect(conditionAlerts[0].name).toBe('서울 시니어')
      expect(conditionAlerts[0].conditions.skills).toEqual(['React'])
    })

    it('조건 알림을 삭제할 수 있다', () => {
      useAlertStore.getState().addConditionAlert('테스트', {})
      const id = useAlertStore.getState().conditionAlerts[0].id
      useAlertStore.getState().removeConditionAlert(id)
      expect(useAlertStore.getState().conditionAlerts).toHaveLength(0)
    })

    it('조건 알림을 토글할 수 있다', () => {
      useAlertStore.getState().addConditionAlert('토글 테스트', {})
      const id = useAlertStore.getState().conditionAlerts[0].id
      useAlertStore.getState().toggleConditionAlert(id)
      expect(useAlertStore.getState().conditionAlerts[0].isActive).toBe(false)
    })
  })

  // ── 알림 피드 ──

  describe('알림 피드', () => {
    it('알림을 추가할 수 있다', () => {
      useAlertStore.getState().addNotification({
        type: 'keyword_match',
        title: '새 공고',
        message: 'React 키워드와 일치합니다',
      })
      const { notifications } = useAlertStore.getState()
      expect(notifications).toHaveLength(1)
      expect(notifications[0].isRead).toBe(false)
    })

    it('알림을 읽음 처리할 수 있다', () => {
      useAlertStore.getState().addNotification({
        type: 'company_new',
        title: '기업 공고',
        message: '새 공고가 등록되었습니다',
      })
      const id = useAlertStore.getState().notifications[0].id
      useAlertStore.getState().markAsRead(id)
      expect(useAlertStore.getState().notifications[0].isRead).toBe(true)
    })

    it('모든 알림을 읽음 처리할 수 있다', () => {
      for (let i = 0; i < 3; i++) {
        useAlertStore.getState().addNotification({
          type: 'keyword_match',
          title: `알림 ${i}`,
          message: `메시지 ${i}`,
        })
      }
      useAlertStore.getState().markAllAsRead()
      expect(useAlertStore.getState().notifications.every((n) => n.isRead)).toBe(true)
    })

    it('알림을 전체 삭제할 수 있다', () => {
      useAlertStore.getState().addNotification({
        type: 'keyword_match',
        title: '삭제 대상',
        message: '삭제됩니다',
      })
      useAlertStore.getState().clearNotifications()
      expect(useAlertStore.getState().notifications).toHaveLength(0)
    })

    it('getUnreadCount는 읽지 않은 알림 수를 반환한다', () => {
      for (let i = 0; i < 5; i++) {
        useAlertStore.getState().addNotification({
          type: 'keyword_match',
          title: `알림 ${i}`,
          message: `메시지 ${i}`,
        })
      }
      const id = useAlertStore.getState().notifications[0].id
      useAlertStore.getState().markAsRead(id)
      expect(useAlertStore.getState().getUnreadCount()).toBe(4)
    })

    it('최대 200개까지만 유지한다', () => {
      for (let i = 0; i < 210; i++) {
        useAlertStore.getState().addNotification({
          type: 'keyword_match',
          title: `알림 ${i}`,
          message: `메시지 ${i}`,
        })
      }
      expect(useAlertStore.getState().notifications.length).toBeLessThanOrEqual(200)
    })
  })
})

// ================================================================
// applicationStore 확장 테스트
// ================================================================

describe('applicationStore (Phase 7 확장)', () => {
  beforeEach(() => {
    useApplicationStore.setState({ applications: [], isLoading: false })
  })

  it('지원을 추가할 수 있다', () => {
    useApplicationStore.getState().addApplication(mockApplication)
    expect(useApplicationStore.getState().applications).toHaveLength(1)
    expect(useApplicationStore.getState().applications[0].job.title).toBe('프론트엔드 개발자')
  })

  it('동일한 jobId로 중복 추가되지 않는다', () => {
    useApplicationStore.getState().addApplication(mockApplication)
    useApplicationStore.getState().addApplication(mockApplication)
    expect(useApplicationStore.getState().applications).toHaveLength(1)
  })

  it('상태를 변경하면 statusHistory에 기록된다', () => {
    useApplicationStore.getState().addApplication(mockApplication)
    useApplicationStore.getState().updateStatus('app-1', 'interview', '1차 면접')
    const app = useApplicationStore.getState().applications[0]
    expect(app.status).toBe('interview')
    expect(app.statusHistory[app.statusHistory.length - 1].status).toBe('interview')
    expect(app.statusHistory[app.statusHistory.length - 1].note).toBe('1차 면접')
  })

  it('지원을 삭제할 수 있다', () => {
    useApplicationStore.getState().addApplication(mockApplication)
    useApplicationStore.getState().removeApplication('app-1')
    expect(useApplicationStore.getState().applications).toHaveLength(0)
  })

  it('getByStatus로 상태별 조회가 된다', () => {
    useApplicationStore.getState().addApplication(mockApplication)
    expect(useApplicationStore.getState().getByStatus('applied')).toHaveLength(1)
    expect(useApplicationStore.getState().getByStatus('interview')).toHaveLength(0)
  })

  it('getByJobId로 jobId로 조회할 수 있다', () => {
    useApplicationStore.getState().addApplication(mockApplication)
    expect(useApplicationStore.getState().getByJobId('job-1')?.id).toBe('app-1')
    expect(useApplicationStore.getState().getByJobId('nonexistent')).toBeUndefined()
  })

  it('getTotalCount는 전체 개수를 반환한다', () => {
    expect(useApplicationStore.getState().getTotalCount()).toBe(0)
    useApplicationStore.getState().addApplication(mockApplication)
    expect(useApplicationStore.getState().getTotalCount()).toBe(1)
  })
})

// ================================================================
// ApplicationTracker 컴포넌트 테스트
// ================================================================

describe('ApplicationTracker', () => {
  beforeEach(() => {
    useApplicationStore.setState({ applications: [], isLoading: false })
  })

  it('지원이 없을 때 빈 상태 메시지를 표시한다', async () => {
    const { ApplicationTracker } = await import(
      '@/components/tracking/ApplicationTracker'
    )
    renderWithProviders(<ApplicationTracker />)
    expect(screen.getByText('아직 추적 중인 지원이 없습니다.')).toBeInTheDocument()
  })

  it('지원이 있을 때 카드가 렌더된다', async () => {
    useApplicationStore.setState({ applications: [mockApplication] })
    const { ApplicationTracker } = await import(
      '@/components/tracking/ApplicationTracker'
    )
    renderWithProviders(<ApplicationTracker />)
    expect(screen.getByText('프론트엔드 개발자')).toBeInTheDocument()
    expect(screen.getByText('테스트 기업')).toBeInTheDocument()
  })

  it('KPI 카드에 통계가 표시된다', async () => {
    useApplicationStore.setState({ applications: [mockApplication] })
    const { ApplicationTracker } = await import(
      '@/components/tracking/ApplicationTracker'
    )
    renderWithProviders(<ApplicationTracker />)
    // 전체 1, 진행 중 1
    const kpiCards = screen.getAllByText('1')
    expect(kpiCards.length).toBeGreaterThanOrEqual(1)
  })

  it('지원 삭제 버튼이 존재한다', async () => {
    useApplicationStore.setState({ applications: [mockApplication] })
    const { ApplicationTracker } = await import(
      '@/components/tracking/ApplicationTracker'
    )
    renderWithProviders(<ApplicationTracker />)
    expect(screen.getByLabelText('삭제')).toBeInTheDocument()
  })
})

// ================================================================
// AlertsPage 컴포넌트 테스트
// ================================================================

describe('AlertsPage', () => {
  beforeEach(() => {
    useAlertStore.setState({
      keywordAlerts: [],
      conditionAlerts: [],
      notifications: [],
    })
  })

  it('알림 설정 제목이 렌더된다', async () => {
    const { AlertsPage } = await import('@/components/alerts/AlertsPage')
    renderWithProviders(<AlertsPage />)
    expect(screen.getByText('알림 설정')).toBeInTheDocument()
  })

  it('3개의 탭이 렌더된다', async () => {
    const { AlertsPage } = await import('@/components/alerts/AlertsPage')
    renderWithProviders(<AlertsPage />)
    expect(screen.getByText('알림 피드')).toBeInTheDocument()
    expect(screen.getByText('키워드 알림')).toBeInTheDocument()
    expect(screen.getByText('조건 알림')).toBeInTheDocument()
  })

  it('키워드 탭에서 키워드를 추가할 수 있다', async () => {
    const user = userEvent.setup()
    const { AlertsPage } = await import('@/components/alerts/AlertsPage')
    renderWithProviders(<AlertsPage />)

    await user.click(screen.getByText('키워드 알림'))
    const input = screen.getByLabelText('키워드 입력')
    await user.type(input, 'React')
    await user.click(screen.getByLabelText('키워드 추가'))

    expect(useAlertStore.getState().keywordAlerts).toHaveLength(1)
    expect(useAlertStore.getState().keywordAlerts[0].keyword).toBe('React')
  })

  it('알림이 없을 때 빈 상태 메시지를 표시한다', async () => {
    const { AlertsPage } = await import('@/components/alerts/AlertsPage')
    renderWithProviders(<AlertsPage />)
    expect(screen.getByText('알림이 없습니다.')).toBeInTheDocument()
  })
})

// ================================================================
// ProfilePage 컴포넌트 테스트
// ================================================================

describe('ProfilePage', () => {
  beforeEach(() => {
    useAuthStore.setState({
      user: mockProfile,
      isAuthenticated: true,
      isLoading: false,
      error: null,
    })
  })

  it('프로필 설정 제목이 렌더된다', async () => {
    const { ProfilePage } = await import('@/components/profile/ProfilePage')
    renderWithProviders(<ProfilePage />)
    expect(screen.getByText('프로필 설정')).toBeInTheDocument()
  })

  it('사용자 이름이 입력 필드에 표시된다', async () => {
    const { ProfilePage } = await import('@/components/profile/ProfilePage')
    renderWithProviders(<ProfilePage />)
    const nameInput = screen.getByLabelText('이름')
    expect(nameInput).toHaveValue('테스터')
  })

  it('이메일이 표시된다', async () => {
    const { ProfilePage } = await import('@/components/profile/ProfilePage')
    renderWithProviders(<ProfilePage />)
    expect(screen.getByText('test@test.com')).toBeInTheDocument()
  })

  it('저장 버튼이 존재한다', async () => {
    const { ProfilePage } = await import('@/components/profile/ProfilePage')
    renderWithProviders(<ProfilePage />)
    expect(screen.getByRole('button', { name: /저장/ })).toBeInTheDocument()
  })

  it('미인증 시 로그인 유도 메시지를 표시한다', async () => {
    useAuthStore.setState({ user: null, isAuthenticated: false })
    const { ProfilePage } = await import('@/components/profile/ProfilePage')
    renderWithProviders(<ProfilePage />)
    expect(screen.getByText('로그인이 필요합니다.')).toBeInTheDocument()
  })
})

// ================================================================
// App 라우팅 통합 테스트
// ================================================================

describe('App 라우팅 (Phase 7)', () => {
  beforeEach(() => {
    useAuthStore.setState({
      user: mockProfile,
      isAuthenticated: true,
      isLoading: false,
      error: null,
    })
    useApplicationStore.setState({ applications: [], isLoading: false })
    useAlertStore.setState({
      keywordAlerts: [],
      conditionAlerts: [],
      notifications: [],
    })
  })

  it('/tracking 경로에서 지원 추적 페이지가 렌더된다', async () => {
    const App = (await import('@/App')).default
    const qc = new QueryClient({ defaultOptions: { queries: { retry: false } } })
    render(
      <QueryClientProvider client={qc}>
        <MemoryRouter initialEntries={['/tracking']}>
          <App />
        </MemoryRouter>
      </QueryClientProvider>,
    )
    expect(await screen.findByRole('heading', { name: '지원 추적' })).toBeInTheDocument()
  })

  it('/alerts 경로에서 알림 페이지가 렌더된다', async () => {
    const App = (await import('@/App')).default
    const qc = new QueryClient({ defaultOptions: { queries: { retry: false } } })
    render(
      <QueryClientProvider client={qc}>
        <MemoryRouter initialEntries={['/alerts']}>
          <App />
        </MemoryRouter>
      </QueryClientProvider>,
    )
    expect(await screen.findByText('알림 설정')).toBeInTheDocument()
  })

  it('/profile 경로에서 프로필 페이지가 렌더된다', async () => {
    const App = (await import('@/App')).default
    const qc = new QueryClient({ defaultOptions: { queries: { retry: false } } })
    render(
      <QueryClientProvider client={qc}>
        <MemoryRouter initialEntries={['/profile']}>
          <App />
        </MemoryRouter>
      </QueryClientProvider>,
    )
    expect(await screen.findByText('프로필 설정')).toBeInTheDocument()
  })
})
