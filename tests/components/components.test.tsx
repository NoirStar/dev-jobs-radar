// ============================================================
// 컴포넌트 렌더 테스트
// ============================================================

import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import App from '@/App'
import { Header } from '@/components/layout/Header'
import { QuickStats } from '@/components/dashboard/QuickStats'
import { SkillTrendWidget } from '@/components/dashboard/SkillTrendWidget'
import { JobCard } from '@/components/dashboard/JobCard'
import { FilterSidebar } from '@/components/dashboard/FilterSidebar'
import { MOCK_JOBS } from '@/data/mockData'

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

describe('Header', () => {
  it('DevJobsRadar 타이틀이 렌더된다', () => {
    renderWithProviders(<Header />)
    expect(screen.getByText('DevJobsRadar')).toBeInTheDocument()
  })

  it('검색 입력이 렌더된다', () => {
    renderWithProviders(<Header />)
    expect(screen.getByPlaceholderText(/공고.*검색/)).toBeInTheDocument()
  })

  it('메뉴 토글 버튼이 존재한다', () => {
    renderWithProviders(<Header />)
    expect(screen.getByLabelText('메뉴 토글')).toBeInTheDocument()
  })
})

describe('QuickStats', () => {
  it('4개 통계 카드가 렌더된다', () => {
    renderWithProviders(<QuickStats />)
    expect(screen.getByText('전체 공고')).toBeInTheDocument()
    expect(screen.getByText('오늘 새 공고')).toBeInTheDocument()
    expect(screen.getByText('마감 임박')).toBeInTheDocument()
    expect(screen.getByText('관심기업 새 공고')).toBeInTheDocument()
  })
})

describe('SkillTrendWidget', () => {
  it('기술 트렌드 타이틀이 렌더된다', () => {
    renderWithProviders(<SkillTrendWidget />)
    expect(screen.getByText(/이번 주 기술 트렌드/)).toBeInTheDocument()
  })

  it('트렌드 기술 목록이 표시된다', () => {
    renderWithProviders(<SkillTrendWidget />)
    expect(screen.getByText('Kubernetes')).toBeInTheDocument()
    expect(screen.getByText('TypeScript')).toBeInTheDocument()
  })
})

describe('JobCard', () => {
  it('공고 카드가 올바르게 렌더된다', () => {
    const job = MOCK_JOBS[0]
    renderWithProviders(<JobCard job={job} />)

    expect(screen.getByText(job.title)).toBeInTheDocument()
    expect(screen.getByText(job.companyName)).toBeInTheDocument()
    expect(screen.getByText('원문 보기')).toBeInTheDocument()
  })

  it('기술 스택 배지가 표시된다', () => {
    const job = MOCK_JOBS[0]
    renderWithProviders(<JobCard job={job} />)

    job.skills.forEach((skill) => {
      expect(screen.getByText(skill)).toBeInTheDocument()
    })
  })

  it('연봉 정보가 표시된다', () => {
    const job = MOCK_JOBS[0]
    renderWithProviders(<JobCard job={job} />)
    if (job.salary) {
      expect(screen.getByText(job.salary.text)).toBeInTheDocument()
    }
  })

  it('원격근무 표시가 올바르다', () => {
    const remoteJob = MOCK_JOBS.find((j) => j.isRemote)!
    renderWithProviders(<JobCard job={remoteJob} />)
    expect(screen.getByText('원격근무')).toBeInTheDocument()
  })
})

describe('FilterSidebar', () => {
  it('필터 섹션이 렌더된다', () => {
    renderWithProviders(<FilterSidebar />)
    expect(screen.getByText('필터')).toBeInTheDocument()
    expect(screen.getByText(/직군/)).toBeInTheDocument()
    expect(screen.getByText(/기술 스택/)).toBeInTheDocument()
    expect(screen.getByText(/근무형태/)).toBeInTheDocument()
  })

  it('직군 카테고리 배지가 표시된다', () => {
    renderWithProviders(<FilterSidebar />)
    expect(screen.getByText(/웹 프론트엔드/)).toBeInTheDocument()
    expect(screen.getByText(/웹 백엔드/)).toBeInTheDocument()
  })

  it('인기 기술 스택이 표시된다', () => {
    renderWithProviders(<FilterSidebar />)
    expect(screen.getByText('Java')).toBeInTheDocument()
    expect(screen.getByText('React')).toBeInTheDocument()
  })
})

describe('App 라우팅', () => {
  it('/ 경로에서 대시보드가 렌더된다', () => {
    renderWithProviders(<App />, { route: '/' })
    expect(screen.getByRole('heading', { name: '대시보드' })).toBeInTheDocument()
  })

  it('/calendar 경로에서 캘린더가 렌더된다', () => {
    renderWithProviders(<App />, { route: '/calendar' })
    expect(screen.getByRole('heading', { name: '채용 캘린더' })).toBeInTheDocument()
  })

  it('/analysis 경로에서 기술 분석이 렌더된다', () => {
    renderWithProviders(<App />, { route: '/analysis' })
    expect(screen.getByRole('heading', { name: '기술 분석' })).toBeInTheDocument()
  })

  it('/companies 경로에서 기업 탐색이 렌더된다', () => {
    renderWithProviders(<App />, { route: '/companies' })
    expect(screen.getByRole('heading', { name: '기업 탐색' })).toBeInTheDocument()
  })

  it('존재하지 않는 경로는 대시보드로 리다이렉트된다', () => {
    renderWithProviders(<App />, { route: '/nonexistent' })
    expect(screen.getByRole('heading', { name: '대시보드' })).toBeInTheDocument()
  })
})
