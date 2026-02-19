// ============================================================
// Phase 4 — 기술 분석 엔진 테스트
// ============================================================

import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

import {
  countSkills,
  getTopSkills,
  analyzeByCategory,
  computeCoOccurrence,
  analyzeByExperience,
  computeTrendChanges,
  generateMarketInsight,
} from '@/services/skillAnalyzer'
import { MarketInsightPage } from '@/components/analysis/MarketInsightPage'
import type { JobPostingSummary } from '@/types/job'

// ── 테스트용 목 데이터 ──

let jobIdCounter = 0

function createJob(overrides: Partial<JobPostingSummary> = {}): JobPostingSummary {
  return {
    id: `test-${++jobIdCounter}`,
    title: 'Test Job',
    companyName: 'TestCorp',
    companyId: 'testcorp',
    category: 'backend',
    skills: ['Java', 'Spring'],
    experience: { level: 'mid', minYears: 3, maxYears: 5, text: '3~5년' },
    salary: { min: 50000000, max: 80000000, currency: 'KRW', type: 'annual', text: '5,000~8,000만' },
    location: '서울',
    isRemote: false,
    source: 'wanted',
    sourceUrl: 'https://example.com',
    deadline: null,
    postedAt: '2026-02-01',
    collectedAt: '2026-02-19T09:00:00Z',
    isActive: true,
    ...overrides,
  }
}

const SAMPLE_JOBS: JobPostingSummary[] = [
  createJob({ skills: ['Java', 'Spring', 'Kubernetes'], category: 'backend', companyId: 'a' }),
  createJob({ skills: ['Java', 'Spring', 'Docker'], category: 'backend', companyId: 'b' }),
  createJob({ skills: ['React', 'TypeScript', 'Next.js'], category: 'frontend', companyId: 'c' }),
  createJob({ skills: ['React', 'TypeScript'], category: 'frontend', companyId: 'd' }),
  createJob({ skills: ['Python', 'TensorFlow', 'Docker'], category: 'ai_ml', companyId: 'e' }),
  createJob({
    skills: ['Java', 'Spring'],
    category: 'backend',
    companyId: 'a',
    experience: { level: 'senior', minYears: 7, maxYears: 10, text: '7~10년' },
  }),
  createJob({
    skills: ['React', 'TypeScript'],
    category: 'frontend',
    companyId: 'c',
    isRemote: true,
  }),
]

function renderWithProviders(ui: React.ReactElement) {
  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } })
  return render(
    <QueryClientProvider client={queryClient}>
      <MemoryRouter>{ui}</MemoryRouter>
    </QueryClientProvider>,
  )
}

// ── countSkills ──

describe('countSkills', () => {
  it('기술별 출현 빈도를 정확히 계산한다', () => {
    const counts = countSkills(SAMPLE_JOBS)
    expect(counts.get('Java')).toBe(3)
    expect(counts.get('Spring')).toBe(3)
    expect(counts.get('React')).toBe(3)
    expect(counts.get('TypeScript')).toBe(3)
    expect(counts.get('Python')).toBe(1)
    expect(counts.get('Next.js')).toBe(1)
  })

  it('빈 배열이면 빈 Map을 반환한다', () => {
    expect(countSkills([]).size).toBe(0)
  })
})

// ── getTopSkills ──

describe('getTopSkills', () => {
  it('상위 N개 기술을 반환한다', () => {
    const top = getTopSkills(SAMPLE_JOBS, 3)
    expect(top).toHaveLength(3)
    expect(top[0].count).toBeGreaterThanOrEqual(top[1].count)
    expect(top[1].count).toBeGreaterThanOrEqual(top[2].count)
  })

  it('percentage가 올바르게 계산된다', () => {
    const top = getTopSkills(SAMPLE_JOBS, 1)
    // Java가 3건 / 7건 = 42.9%
    expect(top[0].percentage).toBeCloseTo(42.9, 0)
  })

  it('빈 배열이면 빈 배열을 반환한다', () => {
    expect(getTopSkills([])).toEqual([])
  })

  it('prevCounts가 주어지면 트렌드를 계산한다', () => {
    const prev = new Map([['Java', 2], ['React', 4]])
    const top = getTopSkills(SAMPLE_JOBS, 5, prev)
    const java = top.find((s) => s.skill === 'Java')!
    expect(java.trend).toBe(50) // 2 → 3 = +50%
    expect(java.trendDirection).toBe('up')

    const react = top.find((s) => s.skill === 'React')!
    expect(react.trend).toBe(-25) // 4 → 3 = -25%
    expect(react.trendDirection).toBe('down')
  })
})

// ── analyzeByCategory ──

describe('analyzeByCategory', () => {
  it('직군별로 분류하여 기술 통계를 생성한다', () => {
    const result = analyzeByCategory(SAMPLE_JOBS)
    expect(result.length).toBeGreaterThan(0)

    const be = result.find((r) => r.category === 'backend')!
    expect(be.totalPostings).toBe(3)
    expect(be.topSkills.length).toBeGreaterThan(0)

    const fe = result.find((r) => r.category === 'frontend')!
    expect(fe.totalPostings).toBe(3)
  })

  it('결과는 공고 수 내림차순으로 정렬된다', () => {
    const result = analyzeByCategory(SAMPLE_JOBS)
    for (let i = 1; i < result.length; i++) {
      expect(result[i - 1].totalPostings).toBeGreaterThanOrEqual(result[i].totalPostings)
    }
  })
})

// ── computeCoOccurrence ──

describe('computeCoOccurrence', () => {
  it('기술 조합의 동시 출현 빈도를 계산한다', () => {
    const pairs = computeCoOccurrence(SAMPLE_JOBS)
    expect(pairs.length).toBeGreaterThan(0)

    // Java + Spring은 3번 동시 출현
    const javaSpr = pairs.find(
      (p) =>
        (p.skill1 === 'Java' && p.skill2 === 'Spring') ||
        (p.skill1 === 'Spring' && p.skill2 === 'Java'),
    )!
    expect(javaSpr.count).toBe(3)
    expect(javaSpr.strength).toBeGreaterThan(0)
    expect(javaSpr.strength).toBeLessThanOrEqual(1)
  })

  it('strength는 Jaccard 유사도다', () => {
    const pairs = computeCoOccurrence(SAMPLE_JOBS)
    const reactTs = pairs.find(
      (p) =>
        (p.skill1 === 'React' && p.skill2 === 'TypeScript') ||
        (p.skill1 === 'TypeScript' && p.skill2 === 'React'),
    )!
    // React=3, TypeScript=3, 동시출현=3 → Jaccard = 3 / (3+3-3) = 1.0
    expect(reactTs.strength).toBe(1)
  })

  it('topN으로 결과를 제한한다', () => {
    const pairs = computeCoOccurrence(SAMPLE_JOBS, 2)
    expect(pairs.length).toBeLessThanOrEqual(2)
  })
})

// ── analyzeByExperience ──

describe('analyzeByExperience', () => {
  it('4개 경력 구간별 기술 분포를 반환한다', () => {
    const result = analyzeByExperience(SAMPLE_JOBS)
    expect(result).toHaveLength(4)
    expect(result[0].experienceRange).toContain('신입')
    expect(result[3].experienceRange).toContain('리드')
  })

  it('각 구간에는 skills 배열이 있다', () => {
    const result = analyzeByExperience(SAMPLE_JOBS)
    for (const dist of result) {
      expect(Array.isArray(dist.skills)).toBe(true)
    }
  })

  it('주니어 구간에 Java/Spring이 포함된다', () => {
    const result = analyzeByExperience(SAMPLE_JOBS)
    const junior = result.find((r) => r.experienceRange.includes('주니어'))!
    const skillNames = junior.skills.map((s) => s.skill)
    expect(skillNames).toContain('Java')
  })
})

// ── computeTrendChanges ──

describe('computeTrendChanges', () => {
  it('상승/하락 기술을 분리하여 반환한다', () => {
    const prev = [
      createJob({ skills: ['Java'] }),
      createJob({ skills: ['Java'] }),
      createJob({ skills: ['React'] }),
    ]
    const curr = [
      createJob({ skills: ['Java'] }),
      createJob({ skills: ['React'] }),
      createJob({ skills: ['React'] }),
      createJob({ skills: ['React'] }),
      createJob({ skills: ['Go'] }),
    ]

    const { rising, declining } = computeTrendChanges(curr, prev)
    expect(rising.length).toBeGreaterThan(0)
    expect(declining.length).toBeGreaterThan(0)

    // Go는 신규 등장 → 100%
    const go = rising.find((s) => s.skill === 'Go')
    expect(go?.trend).toBe(100)

    // Java는 2 → 1 = -50%
    const java = declining.find((s) => s.skill === 'Java')
    expect(java?.trend).toBe(-50)
  })

  it('동일한 데이터면 빈 결과를 반환한다', () => {
    const { rising, declining } = computeTrendChanges(SAMPLE_JOBS, SAMPLE_JOBS)
    expect(rising).toEqual([])
    expect(declining).toEqual([])
  })
})

// ── generateMarketInsight ──

describe('generateMarketInsight', () => {
  it('전체 시장 인사이트를 생성한다', () => {
    const insight = generateMarketInsight(SAMPLE_JOBS)
    expect(insight.totalPostings).toBe(7)
    expect(insight.activeCompanies).toBe(5)
    expect(insight.topCategory.name).toBeTruthy()
    expect(insight.topSkill.name).toBeTruthy()
    expect(insight.categoryBreakdown.length).toBeGreaterThan(0)
  })

  it('연봉 평균을 계산한다', () => {
    const insight = generateMarketInsight(SAMPLE_JOBS)
    expect(insight.avgSalary).not.toBeNull()
    expect(insight.avgSalary!.min).toBeGreaterThan(0)
    expect(insight.avgSalary!.max).toBeGreaterThan(insight.avgSalary!.min)
  })

  it('원격 비율을 계산한다', () => {
    const insight = generateMarketInsight(SAMPLE_JOBS)
    // 1건 원격 / 7건 = ~14.3%
    expect(insight.remotePercentage).toBeCloseTo(14.3, 0)
  })

  it('categoryBreakdown은 내림차순이다', () => {
    const insight = generateMarketInsight(SAMPLE_JOBS)
    for (let i = 1; i < insight.categoryBreakdown.length; i++) {
      expect(insight.categoryBreakdown[i - 1].count).toBeGreaterThanOrEqual(
        insight.categoryBreakdown[i].count,
      )
    }
  })

  it('빈 배열이면 기본값을 반환한다', () => {
    const insight = generateMarketInsight([])
    expect(insight.totalPostings).toBe(0)
    expect(insight.activeCompanies).toBe(0)
    expect(insight.avgSalary).toBeNull()
  })

  it('previousJobs가 있으면 트렌드를 포함한다', () => {
    const prev = [createJob({ skills: ['Ruby'] })]
    const insight = generateMarketInsight(SAMPLE_JOBS, prev)
    expect(insight.risingSkills.length).toBeGreaterThan(0)
  })
})

// ── MarketInsightPage 렌더 테스트 ──

describe('MarketInsightPage', () => {
  it('페이지 타이틀이 렌더된다', () => {
    renderWithProviders(<MarketInsightPage />)
    expect(screen.getByText('시장 인사이트')).toBeInTheDocument()
  })

  it('KPI 카드가 렌더된다', () => {
    renderWithProviders(<MarketInsightPage />)
    expect(screen.getByText('총 공고 수')).toBeInTheDocument()
    expect(screen.getByText('활성 기업')).toBeInTheDocument()
    expect(screen.getByText('원격 근무')).toBeInTheDocument()
  })

  it('직군별 채용 분포가 표시된다', () => {
    renderWithProviders(<MarketInsightPage />)
    expect(screen.getByText('직군별 채용 분포')).toBeInTheDocument()
  })
})
