// ============================================================
// Zustand 스토어 테스트
// ============================================================

import { describe, it, expect, beforeEach } from 'vitest'
import { useJobStore } from '@/stores/jobStore'
import { useFilterStore } from '@/stores/filterStore'
import { useCompanyStore } from '@/stores/companyStore'
import { useWatchlistStore } from '@/stores/watchlistStore'
import { useApplicationStore } from '@/stores/applicationStore'
import { useUserStore } from '@/stores/userStore'
import { MOCK_JOBS } from '@/data/mockData'
import type { JobPostingSummary, Application, ApplicationStatus } from '@/types/job'
import type { WatchedCompany } from '@/types/company'

// ── jobStore ──
describe('jobStore', () => {
  beforeEach(() => {
    useJobStore.setState({ jobs: MOCK_JOBS, selectedJobId: null, isLoading: false, error: null })
  })

  it('초기 상태에 목 데이터가 로드된다', () => {
    const { jobs } = useJobStore.getState()
    expect(jobs.length).toBe(MOCK_JOBS.length)
  })

  it('setJobs로 공고 목록을 교체할 수 있다', () => {
    const newJobs: JobPostingSummary[] = [MOCK_JOBS[0]]
    useJobStore.getState().setJobs(newJobs)
    expect(useJobStore.getState().jobs).toHaveLength(1)
  })

  it('addJobs로 중복 없이 공고를 추가한다', () => {
    const before = useJobStore.getState().jobs.length
    useJobStore.getState().addJobs([MOCK_JOBS[0]]) // 이미 존재하는 것
    expect(useJobStore.getState().jobs.length).toBe(before)

    const newJob = { ...MOCK_JOBS[0], id: 'new-unique' }
    useJobStore.getState().addJobs([newJob])
    expect(useJobStore.getState().jobs.length).toBe(before + 1)
  })

  it('selectJob으로 공고를 선택할 수 있다', () => {
    useJobStore.getState().selectJob('mock-1')
    expect(useJobStore.getState().selectedJobId).toBe('mock-1')
  })

  it('getJobById로 특정 공고를 조회할 수 있다', () => {
    const job = useJobStore.getState().getJobById('mock-1')
    expect(job?.title).toContain('서버 엔지니어')
  })

  it('setLoading/setError 상태 변경', () => {
    useJobStore.getState().setLoading(true)
    expect(useJobStore.getState().isLoading).toBe(true)

    useJobStore.getState().setError('에러')
    expect(useJobStore.getState().error).toBe('에러')
  })
})

// ── filterStore ──
describe('filterStore', () => {
  beforeEach(() => {
    useFilterStore.getState().resetFilters()
  })

  it('초기 상태에서 필터가 비어있다', () => {
    const state = useFilterStore.getState()
    expect(state.searchQuery).toBe('')
    expect(state.selectedCategories).toHaveLength(0)
    expect(state.selectedSkills).toHaveLength(0)
    expect(state.remoteOnly).toBe(false)
    expect(state.hasActiveFilters()).toBe(false)
  })

  it('toggleCategory로 직군 필터를 토글한다', () => {
    useFilterStore.getState().toggleCategory('frontend')
    expect(useFilterStore.getState().selectedCategories).toContain('frontend')
    expect(useFilterStore.getState().hasActiveFilters()).toBe(true)

    useFilterStore.getState().toggleCategory('frontend')
    expect(useFilterStore.getState().selectedCategories).not.toContain('frontend')
  })

  it('toggleSkill로 기술 필터를 토글한다', () => {
    useFilterStore.getState().toggleSkill('React')
    expect(useFilterStore.getState().selectedSkills).toContain('React')

    useFilterStore.getState().toggleSkill('React')
    expect(useFilterStore.getState().selectedSkills).not.toContain('React')
  })

  it('setSearchQuery로 검색어를 설정한다', () => {
    useFilterStore.getState().setSearchQuery('토스')
    expect(useFilterStore.getState().searchQuery).toBe('토스')
    expect(useFilterStore.getState().hasActiveFilters()).toBe(true)
  })

  it('resetFilters로 모든 필터를 초기화한다', () => {
    useFilterStore.getState().toggleCategory('backend')
    useFilterStore.getState().toggleSkill('Java')
    useFilterStore.getState().setRemoteOnly(true)
    useFilterStore.getState().setSearchQuery('검색어')

    useFilterStore.getState().resetFilters()
    expect(useFilterStore.getState().hasActiveFilters()).toBe(false)
    expect(useFilterStore.getState().searchQuery).toBe('')
    expect(useFilterStore.getState().selectedCategories).toHaveLength(0)
  })

  it('setSortBy/setSortOrder 정렬 변경', () => {
    useFilterStore.getState().setSortBy('salary')
    expect(useFilterStore.getState().sortBy).toBe('salary')

    useFilterStore.getState().setSortOrder('asc')
    expect(useFilterStore.getState().sortOrder).toBe('asc')
  })
})

// ── companyStore ──
describe('companyStore', () => {
  it('초기 상태에 시드 데이터가 로드된다', () => {
    const { companies } = useCompanyStore.getState()
    expect(companies.length).toBeGreaterThan(0)
  })

  it('selectCompany로 기업을 선택할 수 있다', () => {
    useCompanyStore.getState().selectCompany('naver')
    expect(useCompanyStore.getState().selectedCompanyId).toBe('naver')
  })

  it('getCompanyById로 기업을 조회할 수 있다', () => {
    const company = useCompanyStore.getState().getCompanyById('naver')
    expect(company?.name).toBe('네이버')
  })
})

// ── watchlistStore ──
describe('watchlistStore', () => {
  const mockWatched: WatchedCompany = {
    id: 'w1',
    userId: 'u1',
    companyId: 'toss',
    company: {
      id: 'toss',
      name: '토스',
      nameEn: 'Toss',
      industry: 'fintech',
      size: 'large',
      logoUrl: null,
      location: '서울 강남',
      techStack: ['Kotlin', 'Spring'],
      activePostings: 5,
      totalPostings: 20,
    },
    alertEnabled: true,
    addedAt: '2026-02-01',
    lastCheckedAt: '2026-02-19',
    newPostingsCount: 2,
  }

  beforeEach(() => {
    useWatchlistStore.setState({ watchlist: [], isLoading: false })
  })

  it('관심 기업을 추가할 수 있다', () => {
    useWatchlistStore.getState().addToWatchlist(mockWatched)
    expect(useWatchlistStore.getState().watchlist).toHaveLength(1)
    expect(useWatchlistStore.getState().isWatching('toss')).toBe(true)
  })

  it('중복 추가를 방지한다', () => {
    useWatchlistStore.getState().addToWatchlist(mockWatched)
    useWatchlistStore.getState().addToWatchlist(mockWatched)
    expect(useWatchlistStore.getState().watchlist).toHaveLength(1)
  })

  it('관심 기업을 삭제할 수 있다', () => {
    useWatchlistStore.getState().addToWatchlist(mockWatched)
    useWatchlistStore.getState().removeFromWatchlist('toss')
    expect(useWatchlistStore.getState().watchlist).toHaveLength(0)
    expect(useWatchlistStore.getState().isWatching('toss')).toBe(false)
  })

  it('새 공고 합산이 올바르다', () => {
    useWatchlistStore.getState().addToWatchlist(mockWatched)
    expect(useWatchlistStore.getState().getNewPostingsTotal()).toBe(2)
  })
})

// ── applicationStore ──
describe('applicationStore', () => {
  const mockApp: Application = {
    id: 'a1',
    userId: 'u1',
    jobId: 'mock-1',
    job: MOCK_JOBS[0],
    status: 'interested' as ApplicationStatus,
    appliedAt: null,
    notes: '',
    statusHistory: [{ status: 'interested' as ApplicationStatus, date: '2026-02-19', note: '' }],
    createdAt: '2026-02-19',
    updatedAt: '2026-02-19',
  }

  beforeEach(() => {
    useApplicationStore.setState({ applications: [], isLoading: false })
  })

  it('지원을 추가할 수 있다', () => {
    useApplicationStore.getState().addApplication(mockApp)
    expect(useApplicationStore.getState().applications).toHaveLength(1)
    expect(useApplicationStore.getState().getTotalCount()).toBe(1)
  })

  it('중복 지원(같은 jobId)을 방지한다', () => {
    useApplicationStore.getState().addApplication(mockApp)
    useApplicationStore.getState().addApplication(mockApp)
    expect(useApplicationStore.getState().applications).toHaveLength(1)
  })

  it('상태를 업데이트할 수 있다', () => {
    useApplicationStore.getState().addApplication(mockApp)
    useApplicationStore.getState().updateStatus('a1', 'applied', '지원완료')

    const updated = useApplicationStore.getState().applications[0]
    expect(updated.status).toBe('applied')
    expect(updated.statusHistory).toHaveLength(2)
    expect(updated.statusHistory[1].note).toBe('지원완료')
  })

  it('상태별 필터가 동작한다', () => {
    useApplicationStore.getState().addApplication(mockApp)
    const interested = useApplicationStore.getState().getByStatus('interested')
    expect(interested).toHaveLength(1)
    expect(useApplicationStore.getState().getByStatus('applied')).toHaveLength(0)
  })

  it('jobId로 조회할 수 있다', () => {
    useApplicationStore.getState().addApplication(mockApp)
    expect(useApplicationStore.getState().getByJobId('mock-1')).toBeDefined()
    expect(useApplicationStore.getState().getByJobId('nonexistent')).toBeUndefined()
  })

  it('지원을 삭제할 수 있다', () => {
    useApplicationStore.getState().addApplication(mockApp)
    useApplicationStore.getState().removeApplication('a1')
    expect(useApplicationStore.getState().applications).toHaveLength(0)
  })
})

// ── userStore ──
describe('userStore', () => {
  beforeEach(() => {
    useUserStore.setState({
      sidebarOpen: true,
      currentPage: 'dashboard',
      settings: { ...useUserStore.getState().settings, theme: 'system' },
    })
  })

  it('사이드바 토글이 동작한다', () => {
    expect(useUserStore.getState().sidebarOpen).toBe(true)
    useUserStore.getState().toggleSidebar()
    expect(useUserStore.getState().sidebarOpen).toBe(false)
  })

  it('현재 페이지를 변경할 수 있다', () => {
    useUserStore.getState().setCurrentPage('analysis')
    expect(useUserStore.getState().currentPage).toBe('analysis')
  })

  it('테마를 토글할 수 있다', () => {
    useUserStore.getState().updateSettings({ theme: 'light' })
    useUserStore.getState().toggleTheme()
    expect(useUserStore.getState().settings.theme).toBe('dark')
    useUserStore.getState().toggleTheme()
    expect(useUserStore.getState().settings.theme).toBe('light')
  })

  it('설정을 부분 업데이트할 수 있다', () => {
    useUserStore.getState().updateSettings({ language: 'en', emailNotifications: false })
    const { settings } = useUserStore.getState()
    expect(settings.language).toBe('en')
    expect(settings.emailNotifications).toBe(false)
    expect(settings.theme).toBe('system') // 나머지는 유지
  })
})
