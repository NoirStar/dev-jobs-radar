// ============================================================
// Phase 5 — 기업 탐색 & 관심 기업 테스트
// ============================================================

import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

import { CompanyExplorer } from '@/components/company/CompanyExplorer'
import { CompanyProfilePage } from '@/components/company/CompanyProfilePage'
import { useWatchlistStore } from '@/stores/watchlistStore'
import { useCompanyStore } from '@/stores/companyStore'
import type { WatchedCompany, CompanySummary } from '@/types/company'

// Tier 2 수집기 import
import { RallitCollector } from '@/services/collectors/rallit'
import { RocketPunchCollector } from '@/services/collectors/rocketpunch'
import { IndeedCollector } from '@/services/collectors/indeed'
import { BlindCollector } from '@/services/collectors/blind'
import { CatchCollector } from '@/services/collectors/catch'
import { JobPlanetCollector } from '@/services/collectors/jobplanet'
import { OkkyCollector } from '@/services/collectors/okky'
import { DisquietCollector } from '@/services/collectors/disquiet'
import { CareerlyCollector } from '@/services/collectors/careerly'
import { WorkNetCollector } from '@/services/collectors/worknet'
import { PeopleNJobCollector } from '@/services/collectors/peoplenjob'

function renderWithProviders(ui: React.ReactElement, route = '/companies') {
  const qc = new QueryClient({ defaultOptions: { queries: { retry: false } } })
  return render(
    <QueryClientProvider client={qc}>
      <MemoryRouter initialEntries={[route]}>{ui}</MemoryRouter>
    </QueryClientProvider>,
  )
}

// ── CompanyExplorer ──

describe('CompanyExplorer', () => {
  it('기업 탐색 제목이 렌더된다', () => {
    renderWithProviders(<CompanyExplorer />)
    expect(screen.getByText('기업 탐색')).toBeInTheDocument()
  })

  it('기업 카드가 렌더된다', () => {
    renderWithProviders(<CompanyExplorer />)
    // companyStore has seed data, check at least one renders
    expect(screen.getAllByText(/네이버/).length).toBeGreaterThan(0)
  })

  it('검색 입력이 있다', () => {
    renderWithProviders(<CompanyExplorer />)
    const input = screen.getByLabelText('기업 검색')
    expect(input).toBeInTheDocument()
  })

  it('필터 버튼이 동작한다', () => {
    renderWithProviders(<CompanyExplorer />)
    const btn = screen.getByLabelText('필터 토글')
    fireEvent.click(btn)
    expect(screen.getByLabelText('산업 필터')).toBeInTheDocument()
  })

  it('검색으로 기업을 필터링할 수 있다', () => {
    renderWithProviders(<CompanyExplorer />)
    const input = screen.getByLabelText('기업 검색')
    fireEvent.change(input, { target: { value: '토스' } })
    expect(screen.getAllByText('토스').length).toBeGreaterThan(0)
  })
})

// ── CompanyProfilePage ──

describe('CompanyProfilePage', () => {
  it('존재하지 않는 기업이면 안내 메시지를 표시한다', () => {
    const qc = new QueryClient({ defaultOptions: { queries: { retry: false } } })
    render(
      <QueryClientProvider client={qc}>
        <MemoryRouter initialEntries={['/company/nonexistent']}>
          <CompanyProfilePage />
        </MemoryRouter>
      </QueryClientProvider>,
    )
    expect(screen.getByText('기업을 찾을 수 없습니다.')).toBeInTheDocument()
  })
})

// ── 관심 기업 (Watchlist) CRUD ──

describe('WatchlistStore CRUD', () => {
  const mockCompany: CompanySummary = {
    id: 'test-co',
    name: 'TestCorp',
    nameEn: 'TestCorp',
    industry: 'platform',
    size: 'medium',
    logoUrl: null,
    location: '서울',
    techStack: ['React', 'TypeScript'],
    activePostings: 5,
    totalPostings: 10,
  }

  const mockWatched: WatchedCompany = {
    id: 'w-test-co',
    userId: 'local',
    companyId: 'test-co',
    company: mockCompany,
    alertEnabled: true,
    addedAt: '2026-01-01T00:00:00Z',
    lastCheckedAt: '2026-01-01T00:00:00Z',
    newPostingsCount: 0,
  }

  beforeEach(() => {
    useWatchlistStore.getState().setWatchlist([])
  })

  it('관심 기업을 추가할 수 있다', () => {
    const { addToWatchlist, isWatching } = useWatchlistStore.getState()
    addToWatchlist(mockWatched)
    expect(useWatchlistStore.getState().isWatching('test-co')).toBe(true)
  })

  it('관심 기업을 제거할 수 있다', () => {
    const store = useWatchlistStore.getState()
    store.addToWatchlist(mockWatched)
    store.removeFromWatchlist('test-co')
    expect(useWatchlistStore.getState().isWatching('test-co')).toBe(false)
  })

  it('중복 추가를 무시한다', () => {
    const store = useWatchlistStore.getState()
    store.addToWatchlist(mockWatched)
    store.addToWatchlist(mockWatched)
    expect(useWatchlistStore.getState().watchlist.length).toBe(1)
  })

  it('관심 기업 수를 반환한다', () => {
    const store = useWatchlistStore.getState()
    store.addToWatchlist(mockWatched)
    expect(useWatchlistStore.getState().getWatchedCount()).toBe(1)
  })

  it('신규 공고 합계를 계산한다', () => {
    const store = useWatchlistStore.getState()
    const withNewPostings = { ...mockWatched, newPostingsCount: 3 }
    store.addToWatchlist(withNewPostings)
    expect(useWatchlistStore.getState().getNewPostingsTotal()).toBe(3)
  })
})

// ── Tier 2 수집기 테스트 ──

describe('Tier 2 수집기 — 인스턴스 & 인터페이스', () => {
  const collectors = [
    { Cls: RallitCollector, id: 'rallit', name: '랠릿' },
    { Cls: RocketPunchCollector, id: 'rocketpunch', name: '로켓펀치' },
    { Cls: IndeedCollector, id: 'indeed', name: '인디드 코리아' },
    { Cls: BlindCollector, id: 'blind', name: '블라인드' },
    { Cls: CatchCollector, id: 'catch', name: '캐치' },
    { Cls: JobPlanetCollector, id: 'jobplanet', name: '잡플래닛' },
    { Cls: OkkyCollector, id: 'okky', name: 'OKKY' },
    { Cls: DisquietCollector, id: 'disquiet', name: '디스콰이엇' },
    { Cls: CareerlyCollector, id: 'careerly', name: '커리어리' },
    { Cls: WorkNetCollector, id: 'worknet', name: '워크넷' },
    { Cls: PeopleNJobCollector, id: 'peoplenjob', name: '피플앤잡' },
  ] as const

  for (const { Cls, id, name } of collectors) {
    describe(name, () => {
      it(`sourceId가 '${id}'이다`, () => {
        const c = new Cls()
        expect(c.sourceId).toBe(id)
      })

      it(`sourceName이 '${name}'이다`, () => {
        const c = new Cls()
        expect(c.sourceName).toBe(name)
      })

      it('collect 메서드가 존재한다', () => {
        const c = new Cls()
        expect(typeof c.collect).toBe('function')
      })

      it('네트워크 오류 시 빈 배열을 반환한다', async () => {
        const c = new Cls()
        // globalThis.fetch는 테스트 환경에서 정의되지 않거나 에러를 발생시킴
        const originalFetch = globalThis.fetch
        globalThis.fetch = () => Promise.reject(new Error('Network error'))
        try {
          const result = await c.collect()
          expect(result).toEqual([])
        } finally {
          globalThis.fetch = originalFetch
        }
      })
    })
  }
})

// ── CompanyStore 테스트 ──

describe('CompanyStore', () => {
  it('시드 데이터가 로드된다', () => {
    const { companies } = useCompanyStore.getState()
    expect(companies.length).toBeGreaterThan(0)
  })

  it('ID로 기업을 조회할 수 있다', () => {
    const { getCompanyById } = useCompanyStore.getState()
    const naver = getCompanyById('naver')
    expect(naver?.name).toBe('네이버')
  })

  it('존재하지 않는 ID는 undefined를 반환한다', () => {
    const { getCompanyById } = useCompanyStore.getState()
    expect(getCompanyById('nonexistent')).toBeUndefined()
  })

  it('기업 목록을 설정할 수 있다', () => {
    const store = useCompanyStore.getState()
    const custom: CompanySummary[] = [
      {
        id: 'custom1',
        name: '테스트기업',
        nameEn: 'Test',
        industry: 'saas',
        size: 'small',
        logoUrl: null,
        location: '서울',
        techStack: ['React'],
        activePostings: 1,
        totalPostings: 1,
      },
    ]
    store.setCompanies(custom)
    expect(useCompanyStore.getState().companies.length).toBe(1)
  })
})
