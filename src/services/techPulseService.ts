// ============================================================
// TechPulse 연동 서비스 — 트렌딩 기술 × 채용 수요 교차 분석
// ============================================================

import type { JobPostingSummary } from '@/types/job'

// ── TechPulse 데이터 타입 ──

export interface TechPulseTrend {
  keyword: string
  category: TechPulseCategory
  velocity: number // 변화율 (%)
  mentions: number
  sources: string[]
  rank: number
}

export type TechPulseCategory =
  | 'ai-ml'
  | 'frontend'
  | 'backend'
  | 'devops'
  | 'mobile'
  | 'database'
  | 'tools'
  | 'security'
  | 'cloud'
  | 'other'

/** 교차 분석 결과 */
export interface CrossAnalysis {
  /** 트렌딩 + 채용 수요 모두 높은 기술 */
  hotAndHiring: CrossItem[]
  /** 트렌딩이지만 채용 수요는 낮은 기술 (학습 추천) */
  hotButLowDemand: CrossItem[]
  /** 채용 수요 높지만 트렌딩 아닌 기술 (안정적 수요) */
  stableDemand: CrossItem[]
  /** 분석 시점 */
  analyzedAt: string
}

export interface CrossItem {
  skill: string
  trendRank: number | null
  trendVelocity: number | null
  jobCount: number
  jobPercentage: number
  insight: string
}

// ── TechPulse API 연동 ──

const TECHPULSE_API = import.meta.env.VITE_TECHPULSE_API_URL ?? ''
const TECHPULSE_TIMEOUT = 8_000

/** TechPulse에서 급상승 키워드 가져오기 */
export async function fetchHotKeywords(): Promise<TechPulseTrend[]> {
  if (!TECHPULSE_API) return generateLocalTrends()

  try {
    const controller = new AbortController()
    const timer = setTimeout(() => controller.abort(), TECHPULSE_TIMEOUT)

    const res = await fetch(`${TECHPULSE_API}/api/trends/hot`, {
      signal: controller.signal,
    })
    clearTimeout(timer)

    if (!res.ok) return generateLocalTrends()

    const data: unknown = await res.json()
    return parseTrends(data)
  } catch {
    return generateLocalTrends()
  }
}

function parseTrends(data: unknown): TechPulseTrend[] {
  if (!Array.isArray(data)) return generateLocalTrends()
  return data
    .filter(
      (item): item is Record<string, unknown> =>
        item !== null && typeof item === 'object',
    )
    .map((item, i) => ({
      keyword: typeof item.keyword === 'string' ? item.keyword : '',
      category: isValidCategory(item.category) ? item.category : 'other',
      velocity: typeof item.velocity === 'number' ? item.velocity : 0,
      mentions: typeof item.mentions === 'number' ? item.mentions : 0,
      sources: Array.isArray(item.sources)
        ? item.sources.filter((s): s is string => typeof s === 'string')
        : [],
      rank: typeof item.rank === 'number' ? item.rank : i + 1,
    }))
    .filter((t) => t.keyword.length > 0)
}

const VALID_CATEGORIES: Set<string> = new Set([
  'ai-ml',
  'frontend',
  'backend',
  'devops',
  'mobile',
  'database',
  'tools',
  'security',
  'cloud',
  'other',
])

function isValidCategory(v: unknown): v is TechPulseCategory {
  return typeof v === 'string' && VALID_CATEGORIES.has(v)
}

// ── 교차 분석 엔진 ──

/** 트렌딩 기술 × 채용 수요 교차 분석 */
export function analyzeCrossData(
  trends: TechPulseTrend[],
  jobs: JobPostingSummary[],
): CrossAnalysis {
  const totalJobs = jobs.length || 1

  // 공고에서 기술별 등장 횟수 집계
  const skillJobCount = new Map<string, number>()
  for (const job of jobs) {
    for (const skill of job.skills) {
      const key = skill.toLowerCase()
      skillJobCount.set(key, (skillJobCount.get(key) ?? 0) + 1)
    }
  }

  // 트렌딩 기술의 채용 수요 매핑
  const trendMap = new Map(trends.map((t) => [t.keyword.toLowerCase(), t]))

  const hotAndHiring: CrossItem[] = []
  const hotButLowDemand: CrossItem[] = []

  for (const trend of trends) {
    const key = trend.keyword.toLowerCase()
    const count = skillJobCount.get(key) ?? findSimilar(key, skillJobCount)
    const percentage = Math.round((count / totalJobs) * 100)

    const item: CrossItem = {
      skill: trend.keyword,
      trendRank: trend.rank,
      trendVelocity: trend.velocity,
      jobCount: count,
      jobPercentage: percentage,
      insight: '',
    }

    if (percentage >= 10) {
      item.insight = `트렌딩 ${trend.rank}위 + 공고 ${percentage}%에서 요구 — 지금 바로 학습 가치 높음`
      hotAndHiring.push(item)
    } else {
      item.insight =
        count > 0
          ? `트렌딩 중이지만 채용 수요는 아직 ${percentage}% — 선제 학습으로 차별화`
          : `커뮤니티에서 급상승 중이나 채용 시장은 아직 미반영 — 미래 기술`
      hotButLowDemand.push(item)
    }
  }

  // 채용 수요 높지만 트렌딩 아닌 기술 (상위 15개)
  const stableDemand: CrossItem[] = [...skillJobCount.entries()]
    .filter(([key]) => !trendMap.has(key))
    .sort(([, a], [, b]) => b - a)
    .slice(0, 15)
    .map(([skill, count]) => {
      const pct = Math.round((count / totalJobs) * 100)
      return {
        skill,
        trendRank: null,
        trendVelocity: null,
        jobCount: count,
        jobPercentage: pct,
        insight: `트렌딩은 아니지만 공고 ${pct}%에서 요구 — 검증된 필수 기술`,
      }
    })

  return {
    hotAndHiring: hotAndHiring.sort((a, b) => b.jobPercentage - a.jobPercentage),
    hotButLowDemand: hotButLowDemand.sort(
      (a, b) => (a.trendRank ?? 99) - (b.trendRank ?? 99),
    ),
    stableDemand,
    analyzedAt: new Date().toISOString(),
  }
}

/** 유사 기술명 매칭 (k8s → kubernetes 등) */
function findSimilar(key: string, map: Map<string, number>): number {
  for (const [skill, count] of map) {
    if (skill.includes(key) || key.includes(skill)) return count
  }
  return 0
}

// ── 로컬 모의 트렌드 (TechPulse 미연동 시) ──

export function generateLocalTrends(): TechPulseTrend[] {
  return [
    { keyword: 'Rust', category: 'backend', velocity: 42, mentions: 1850, sources: ['github', 'hackernews', 'reddit'], rank: 1 },
    { keyword: 'LLM', category: 'ai-ml', velocity: 38, mentions: 3200, sources: ['github', 'x-twitter', 'hackernews'], rank: 2 },
    { keyword: 'Bun', category: 'backend', velocity: 35, mentions: 920, sources: ['github', 'hackernews'], rank: 3 },
    { keyword: 'HTMX', category: 'frontend', velocity: 28, mentions: 680, sources: ['hackernews', 'reddit'], rank: 4 },
    { keyword: 'Deno', category: 'backend', velocity: 25, mentions: 740, sources: ['github', 'hackernews'], rank: 5 },
    { keyword: 'Zig', category: 'backend', velocity: 22, mentions: 410, sources: ['github', 'hackernews'], rank: 6 },
    { keyword: 'RAG', category: 'ai-ml', velocity: 20, mentions: 1500, sources: ['github', 'x-twitter'], rank: 7 },
    { keyword: 'Tauri', category: 'frontend', velocity: 18, mentions: 520, sources: ['github', 'reddit'], rank: 8 },
    { keyword: 'Astro', category: 'frontend', velocity: 17, mentions: 490, sources: ['github', 'hackernews'], rank: 9 },
    { keyword: 'Kubernetes', category: 'devops', velocity: 15, mentions: 2100, sources: ['github', 'stackoverflow'], rank: 10 },
    { keyword: 'Next.js', category: 'frontend', velocity: 14, mentions: 1900, sources: ['github', 'x-twitter'], rank: 11 },
    { keyword: 'TypeScript', category: 'frontend', velocity: 12, mentions: 4500, sources: ['github', 'stackoverflow', 'npm'], rank: 12 },
    { keyword: 'Go', category: 'backend', velocity: 10, mentions: 1600, sources: ['github', 'hackernews'], rank: 13 },
    { keyword: 'Docker', category: 'devops', velocity: 8, mentions: 2800, sources: ['github', 'stackoverflow'], rank: 14 },
    { keyword: 'React', category: 'frontend', velocity: 5, mentions: 5200, sources: ['github', 'stackoverflow', 'npm'], rank: 15 },
  ]
}
