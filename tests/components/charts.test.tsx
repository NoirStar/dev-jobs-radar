// ============================================================
// Phase 3 — 차트 컴포넌트 렌더 테스트
// ============================================================

import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

import { SkillTrendChart } from '@/components/charts/SkillTrendChart'
import { CategoryAreaChart } from '@/components/charts/CategoryAreaChart'
import { SkillBumpChart } from '@/components/charts/SkillBumpChart'
import { SalaryBoxChart } from '@/components/charts/SalaryBoxChart'
import { SkillHeatmap } from '@/components/charts/SkillHeatmap'
import { CompanyTimeline } from '@/components/charts/CompanyTimeline'
import { SkillNetworkGraph } from '@/components/charts/SkillNetworkGraph'
import { NewPostingsChart } from '@/components/charts/NewPostingsChart'
import { SkillRadarChart } from '@/components/charts/SkillRadarChart'
import { SkillWordCloud } from '@/components/charts/SkillWordCloud'
import { ExperienceSankey } from '@/components/charts/ExperienceSankey'
import { RegionMap } from '@/components/charts/RegionMap'
import { ChartContainer } from '@/components/charts/ChartContainer'

import {
  MOCK_SKILL_TREND_SERIES,
  MOCK_CATEGORY_TREND,
  MOCK_SALARY_BOX,
  MOCK_HEATMAP,
  MOCK_NEW_POSTINGS,
  MOCK_RADAR,
  MOCK_WORDCLOUD,
  MOCK_BUMP_DATA,
  MOCK_COMPANY_TIMELINE,
  MOCK_NETWORK,
  MOCK_SANKEY,
  MOCK_REGION_MAP,
  CATEGORY_COLORS,
  CATEGORY_LABELS,
  BUMP_COLORS,
} from '@/data/chartMockData'

function renderWithProviders(ui: React.ReactElement) {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  })
  return render(
    <QueryClientProvider client={queryClient}>
      <MemoryRouter>{ui}</MemoryRouter>
    </QueryClientProvider>,
  )
}

// ── ChartContainer ──

describe('ChartContainer', () => {
  it('타이틀과 children을 렌더한다', () => {
    renderWithProviders(
      <ChartContainer title="테스트 차트" icon={<span data-testid="icon" />}>
        <div data-testid="child" />
      </ChartContainer>,
    )
    expect(screen.getByText('테스트 차트')).toBeInTheDocument()
    expect(screen.getByTestId('child')).toBeInTheDocument()
  })

  it('description이 있으면 표시한다', () => {
    renderWithProviders(
      <ChartContainer title="차트" icon={<span />} description="차트 설명">
        <div />
      </ChartContainer>,
    )
    expect(screen.getByText('차트 설명')).toBeInTheDocument()
  })

  it('기간 선택기가 period prop 시 렌더된다', () => {
    renderWithProviders(
      <ChartContainer title="차트" icon={<span />} period="1m" onPeriodChange={() => {}}>
        <div />
      </ChartContainer>,
    )
    expect(screen.getByText('1개월')).toBeInTheDocument()
    expect(screen.getByText('3개월')).toBeInTheDocument()
  })
})

// ── ① SkillTrendChart ──

describe('SkillTrendChart', () => {
  it('차트 타이틀이 렌더된다', () => {
    renderWithProviders(<SkillTrendChart />)
    expect(screen.getByText('기술 수요 트렌드')).toBeInTheDocument()
  })

  it('기간 선택기가 표시된다', () => {
    renderWithProviders(<SkillTrendChart />)
    expect(screen.getByText('1개월')).toBeInTheDocument()
  })
})

// ── ② CategoryAreaChart ──

describe('CategoryAreaChart', () => {
  it('차트 타이틀이 렌더된다', () => {
    renderWithProviders(<CategoryAreaChart />)
    expect(screen.getByText('직군별 채용 추이')).toBeInTheDocument()
  })
})

// ── ③ SkillBumpChart ──

describe('SkillBumpChart', () => {
  it('차트 타이틀이 렌더된다', () => {
    renderWithProviders(<SkillBumpChart />)
    expect(screen.getByText('기술 순위 변화')).toBeInTheDocument()
  })

  it('SVG가 렌더된다', () => {
    const { container } = renderWithProviders(<SkillBumpChart />)
    expect(container.querySelector('svg')).toBeInTheDocument()
  })
})

// ── ④ SalaryBoxChart ──

describe('SalaryBoxChart', () => {
  it('차트 타이틀이 렌더된다', () => {
    renderWithProviders(<SalaryBoxChart />)
    expect(screen.getByText('직군별 연봉 분포')).toBeInTheDocument()
  })

  it('SVG가 렌더된다', () => {
    const { container } = renderWithProviders(<SalaryBoxChart />)
    expect(container.querySelector('svg')).toBeInTheDocument()
  })
})

// ── ⑤ SkillHeatmap ──

describe('SkillHeatmap', () => {
  it('차트 타이틀이 렌더된다', () => {
    renderWithProviders(<SkillHeatmap />)
    expect(screen.getByText('직군별 기술 수요 히트맵')).toBeInTheDocument()
  })

  it('히트맵 테이블이 렌더된다', () => {
    const { container } = renderWithProviders(<SkillHeatmap />)
    expect(container.querySelector('table')).toBeInTheDocument()
  })
})

// ── ⑥ CompanyTimeline ──

describe('CompanyTimeline', () => {
  it('차트 타이틀이 렌더된다', () => {
    renderWithProviders(<CompanyTimeline />)
    expect(screen.getByText('기업 채용 타임라인')).toBeInTheDocument()
  })

  it('기업명이 표시된다', () => {
    renderWithProviders(<CompanyTimeline />)
    expect(screen.getByText('토스')).toBeInTheDocument()
    expect(screen.getByText('네이버')).toBeInTheDocument()
  })
})

// ── ⑦ SkillNetworkGraph ──

describe('SkillNetworkGraph', () => {
  it('차트 타이틀이 렌더된다', () => {
    renderWithProviders(<SkillNetworkGraph />)
    expect(screen.getByText('기술 조합 네트워크')).toBeInTheDocument()
  })

  it('SVG 노드가 렌더된다', () => {
    const { container } = renderWithProviders(<SkillNetworkGraph />)
    const circles = container.querySelectorAll('circle')
    expect(circles.length).toBeGreaterThan(0)
  })
})

// ── ⑧ NewPostingsChart ──

describe('NewPostingsChart', () => {
  it('차트 타이틀이 렌더된다', () => {
    renderWithProviders(<NewPostingsChart />)
    expect(screen.getByText('신규 공고 추이')).toBeInTheDocument()
  })
})

// ── ⑨ SkillRadarChart ──

describe('SkillRadarChart', () => {
  it('차트 타이틀이 렌더된다', () => {
    renderWithProviders(<SkillRadarChart />)
    expect(screen.getByText('내 기술 vs 시장 요구')).toBeInTheDocument()
  })
})

// ── ⑩ SkillWordCloud ──

describe('SkillWordCloud', () => {
  it('차트 타이틀이 렌더된다', () => {
    renderWithProviders(<SkillWordCloud />)
    expect(screen.getByText('기술 워드클라우드')).toBeInTheDocument()
  })

  it('키워드가 표시된다', () => {
    renderWithProviders(<SkillWordCloud />)
    expect(screen.getByText('Java')).toBeInTheDocument()
    expect(screen.getByText('React')).toBeInTheDocument()
  })
})

// ── ⑪ ExperienceSankey ──

describe('ExperienceSankey', () => {
  it('차트 타이틀이 렌더된다', () => {
    renderWithProviders(<ExperienceSankey />)
    expect(screen.getByText('경력별 기술 요구 흐름')).toBeInTheDocument()
  })

  it('SVG가 렌더된다', () => {
    const { container } = renderWithProviders(<ExperienceSankey />)
    expect(container.querySelector('svg')).toBeInTheDocument()
  })
})

// ── ⑫ RegionMap ──

describe('RegionMap', () => {
  it('차트 타이틀이 렌더된다', () => {
    renderWithProviders(<RegionMap />)
    expect(screen.getByText('지역별 채용 분포')).toBeInTheDocument()
  })

  it('지역 이름이 표시된다', () => {
    renderWithProviders(<RegionMap />)
    expect(screen.getByText('서울')).toBeInTheDocument()
  })
})

// ── Mock 데이터 검증 ──

describe('chartMockData', () => {
  it('MOCK_SKILL_TREND_SERIES에 5개 시리즈가 있다', () => {
    expect(MOCK_SKILL_TREND_SERIES).toHaveLength(5)
    MOCK_SKILL_TREND_SERIES.forEach((s) => {
      expect(s.data.length).toBeGreaterThan(0)
      expect(s.name).toBeTruthy()
    })
  })

  it('MOCK_CATEGORY_TREND에 8주 데이터가 있다', () => {
    expect(MOCK_CATEGORY_TREND).toHaveLength(8)
  })

  it('CATEGORY_COLORS와 CATEGORY_LABELS 키가 일치한다', () => {
    const colorKeys = Object.keys(CATEGORY_COLORS)
    const labelKeys = Object.keys(CATEGORY_LABELS)
    expect(colorKeys).toEqual(labelKeys)
  })

  it('MOCK_SALARY_BOX에 6개 직군이 있다', () => {
    expect(MOCK_SALARY_BOX).toHaveLength(6)
    MOCK_SALARY_BOX.forEach((d) => {
      expect(d.min).toBeLessThanOrEqual(d.q1)
      expect(d.q1).toBeLessThanOrEqual(d.median)
      expect(d.median).toBeLessThanOrEqual(d.q3)
      expect(d.q3).toBeLessThanOrEqual(d.max)
    })
  })

  it('MOCK_HEATMAP rows × columns = values 수', () => {
    const expected = MOCK_HEATMAP.rows.length * MOCK_HEATMAP.columns.length
    expect(MOCK_HEATMAP.values).toHaveLength(expected)
  })

  it('MOCK_NEW_POSTINGS cumulative 값이 증가한다', () => {
    for (let i = 1; i < MOCK_NEW_POSTINGS.length; i++) {
      expect(MOCK_NEW_POSTINGS[i].cumulative).toBeGreaterThanOrEqual(
        MOCK_NEW_POSTINGS[i - 1].cumulative,
      )
    }
  })

  it('MOCK_RADAR에 2개 시리즈가 있고 axes 수와 values 수가 일치한다', () => {
    expect(MOCK_RADAR.series).toHaveLength(2)
    MOCK_RADAR.series.forEach((s) => {
      expect(s.values).toHaveLength(MOCK_RADAR.axes.length)
    })
  })

  it('MOCK_WORDCLOUD에 24개 키워드가 있다', () => {
    expect(MOCK_WORDCLOUD.words).toHaveLength(24)
  })

  it('MOCK_BUMP_DATA에 8개 기술이 있다', () => {
    expect(MOCK_BUMP_DATA).toHaveLength(8)
    MOCK_BUMP_DATA.forEach((d) => {
      expect(d.rankings.length).toBeGreaterThan(0)
    })
  })

  it('BUMP_COLORS 키와 MOCK_BUMP_DATA 기술명이 일치한다', () => {
    const skills = MOCK_BUMP_DATA.map((d) => d.skill)
    const colorKeys = Object.keys(BUMP_COLORS)
    expect(colorKeys.sort()).toEqual(skills.sort())
  })

  it('MOCK_COMPANY_TIMELINE에 7개 기업이 있다', () => {
    expect(MOCK_COMPANY_TIMELINE).toHaveLength(7)
  })

  it('MOCK_NETWORK에 노드와 링크가 있다', () => {
    expect(MOCK_NETWORK.nodes.length).toBeGreaterThan(0)
    expect(MOCK_NETWORK.links.length).toBeGreaterThan(0)
    // 모든 링크의 source/target이 유효한 노드 id인지
    const ids = new Set(MOCK_NETWORK.nodes.map((n) => n.id))
    MOCK_NETWORK.links.forEach((l) => {
      expect(ids.has(l.source)).toBe(true)
      expect(ids.has(l.target)).toBe(true)
    })
  })

  it('MOCK_SANKEY에 노드와 링크가 있고 id 참조가 유효하다', () => {
    expect(MOCK_SANKEY.nodes.length).toBeGreaterThan(0)
    const ids = new Set(MOCK_SANKEY.nodes.map((n) => n.id))
    MOCK_SANKEY.links.forEach((l) => {
      expect(ids.has(l.source)).toBe(true)
      expect(ids.has(l.target)).toBe(true)
      expect(l.value).toBeGreaterThan(0)
    })
  })

  it('MOCK_REGION_MAP에 9개 지역이 있다', () => {
    expect(MOCK_REGION_MAP.regions).toHaveLength(9)
    MOCK_REGION_MAP.regions.forEach((r) => {
      expect(r.coordinates).toHaveLength(2)
      expect(r.value).toBeGreaterThan(0)
    })
  })
})
