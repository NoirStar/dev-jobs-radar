// ============================================================
// 차트 데이터 서비스 — jobStore 데이터에서 차트용 데이터를 실시간 계산
// ============================================================

import type { JobPostingSummary } from '@/types/job'
import type {
  BoxPlotData,
  HeatmapData,
  WordCloudData,
  NetworkGraphData,
  SankeyData,
} from '@/types/chart'

const CATEGORY_LABELS: Record<string, string> = {
  frontend: '프론트엔드',
  backend: '백엔드',
  devops: 'DevOps',
  mobile: '모바일',
  ai_ml: 'AI/ML',
  security: '보안',
  game: '게임',
  system: '시스템',
  dba: 'DBA',
  qa: 'QA',
  pm_po: 'PM/PO',
  designer: '디자이너',
}

const SKILL_CATEGORIES: Record<string, string> = {
  Java: 'language', Kotlin: 'language', Python: 'language', Go: 'language',
  'C++': 'language', Swift: 'language', Rust: 'language', TypeScript: 'language',
  React: 'framework', 'Next.js': 'framework', NestJS: 'framework', Spring: 'framework',
  'Vue.js': 'framework', Flutter: 'framework', SwiftUI: 'framework',
  'Node.js': 'runtime', 'Tailwind CSS': 'framework',
  Kubernetes: 'infra', Docker: 'infra', Terraform: 'infra', ArgoCD: 'infra',
  Kafka: 'infra', 'CI/CD': 'infra', MSA: 'infra',
  AWS: 'cloud',
  PostgreSQL: 'database', MySQL: 'database', Redis: 'database',
  MongoDB: 'database', Oracle: 'database',
  GraphQL: 'api',
  Linux: 'infra', 'Network Programming': 'infra', 'TCP/IP': 'infra',
  Playwright: 'framework', Cypress: 'framework', Jest: 'framework',
  Spark: 'infra', Airflow: 'infra',
  Unreal: 'framework', 'Win32': 'framework', 'Device Driver': 'system',
  Windows: 'system', iOS: 'mobile',
  'Kotlin Multiplatform': 'framework',
  PyTorch: 'framework', LLM: 'ai', RAG: 'ai', LangChain: 'framework',
}

// ── 기술 키워드 빈도 (WordCloud) ──

export function computeWordCloud(jobs: JobPostingSummary[]): WordCloudData {
  const counts = new Map<string, number>()
  for (const job of jobs) {
    for (const skill of job.skills) {
      counts.set(skill, (counts.get(skill) ?? 0) + 1)
    }
  }

  const words = [...counts.entries()]
    .sort((a, b) => b[1] - a[1])
    .map(([text, value]) => ({
      text,
      value,
      category: SKILL_CATEGORIES[text] ?? 'other',
    }))

  return { words }
}

// ── 직군×기술 히트맵 ──

export function computeHeatmap(jobs: JobPostingSummary[]): HeatmapData {
  // 직군별 공고 수
  const catCounts = new Map<string, number>()
  // 직군×기술 빈도
  const crossCounts = new Map<string, number>()
  const allSkills = new Set<string>()

  for (const job of jobs) {
    catCounts.set(job.category, (catCounts.get(job.category) ?? 0) + 1)
    for (const skill of job.skills) {
      allSkills.add(skill)
      const key = `${job.category}:${skill}`
      crossCounts.set(key, (crossCounts.get(key) ?? 0) + 1)
    }
  }

  // 상위 직군 5개
  const topCategories = [...catCounts.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([cat]) => cat)

  // 상위 기술 10개
  const skillTotals = new Map<string, number>()
  for (const job of jobs) {
    for (const skill of job.skills) {
      skillTotals.set(skill, (skillTotals.get(skill) ?? 0) + 1)
    }
  }
  const topSkills = [...skillTotals.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)
    .map(([skill]) => skill)

  const rows = topCategories.map((cat) => CATEGORY_LABELS[cat] ?? cat)
  const columns = topSkills
  const values: HeatmapData['values'] = []

  for (const cat of topCategories) {
    const catTotal = catCounts.get(cat) ?? 1
    const rowLabel = CATEGORY_LABELS[cat] ?? cat
    for (const skill of topSkills) {
      const count = crossCounts.get(`${cat}:${skill}`) ?? 0
      const pct = Math.round((count / catTotal) * 100)
      values.push({ row: rowLabel, column: skill, value: pct })
    }
  }

  return { rows, columns, values }
}

// ── 연봉 분포 (Box Plot) ──

export function computeSalaryBox(jobs: JobPostingSummary[]): BoxPlotData[] {
  const catSalaries = new Map<string, number[]>()

  for (const job of jobs) {
    if (!job.salary) continue
    const label = CATEGORY_LABELS[job.category] ?? job.category
    if (!catSalaries.has(label)) catSalaries.set(label, [])
    // 만원 단위로 변환
    const mid = Math.round(((job.salary.min + job.salary.max) / 2) / 10000)
    const min = Math.round(job.salary.min / 10000)
    const max = Math.round(job.salary.max / 10000)
    catSalaries.get(label)!.push(min, mid, max)
  }

  const result: BoxPlotData[] = []

  for (const [label, salaries] of catSalaries) {
    if (salaries.length === 0) continue
    const sorted = [...salaries].sort((a, b) => a - b)
    const n = sorted.length
    const q1Idx = Math.floor(n * 0.25)
    const medIdx = Math.floor(n * 0.5)
    const q3Idx = Math.floor(n * 0.75)

    result.push({
      label,
      min: sorted[0],
      q1: sorted[q1Idx],
      median: sorted[medIdx],
      q3: sorted[q3Idx],
      max: sorted[n - 1],
      outliers: [],
      sampleSize: Math.ceil(salaries.length / 3), // 원래 공고 수 추정
    })
  }

  return result.sort((a, b) => b.sampleSize - a.sampleSize)
}

// ── 기술 조합 네트워크 ──

export function computeNetwork(jobs: JobPostingSummary[]): NetworkGraphData {
  // 기술별 등장 횟수
  const skillCounts = new Map<string, number>()
  // 기술 쌍별 동시 등장 횟수
  const pairCounts = new Map<string, number>()

  for (const job of jobs) {
    const skills = job.skills
    for (const skill of skills) {
      skillCounts.set(skill, (skillCounts.get(skill) ?? 0) + 1)
    }
    // 쌍 조합
    for (let i = 0; i < skills.length; i++) {
      for (let j = i + 1; j < skills.length; j++) {
        const key = [skills[i], skills[j]].sort().join('::')
        pairCounts.set(key, (pairCounts.get(key) ?? 0) + 1)
      }
    }
  }

  // 상위 12 기술만
  const topSkills = [...skillCounts.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, 12)

  const topSet = new Set(topSkills.map(([s]) => s))

  const GROUP_CATEGORIES: Record<string, string> = {
    language: 'backend', framework: 'frontend', infra: 'infra',
    cloud: 'infra', database: 'backend', runtime: 'backend',
    api: 'frontend', ai: 'backend', system: 'backend', mobile: 'frontend',
  }

  const nodes = topSkills.map(([skill, size]) => ({
    id: skill.toLowerCase().replace(/[^a-z0-9]/g, ''),
    label: skill,
    size,
    group: GROUP_CATEGORIES[SKILL_CATEGORIES[skill] ?? 'other'] ?? 'backend',
  }))

  const idMap = new Map(topSkills.map(([skill]) => [
    skill,
    skill.toLowerCase().replace(/[^a-z0-9]/g, ''),
  ]))

  const maxPair = Math.max(...[...pairCounts.values()], 1)

  const links = [...pairCounts.entries()]
    .filter(([key]) => {
      const [a, b] = key.split('::')
      return topSet.has(a) && topSet.has(b)
    })
    .map(([key, count]) => {
      const [a, b] = key.split('::')
      return {
        source: idMap.get(a)!,
        target: idMap.get(b)!,
        strength: Math.round((count / maxPair) * 100) / 100,
      }
    })
    .filter((l) => l.strength > 0)

  return { nodes, links }
}

// ── 경력별 기술 흐름 (Sankey) ──

export function computeSankey(jobs: JobPostingSummary[]): SankeyData {
  const EXP_LABELS: Record<string, string> = {
    entry: '신입',
    junior: '주니어 (1~2년)',
    mid: '미들 (3~5년)',
    senior: '시니어 (5년+)',
    lead: '리드 (10년+)',
  }

  // 경력별 기술 빈도
  const expSkillCounts = new Map<string, number>()
  const expLevels = new Set<string>()
  const allSkills = new Map<string, number>()

  for (const job of jobs) {
    const level = job.experience.level
    expLevels.add(level)
    for (const skill of job.skills) {
      const key = `${level}::${skill}`
      expSkillCounts.set(key, (expSkillCounts.get(key) ?? 0) + 1)
      allSkills.set(skill, (allSkills.get(skill) ?? 0) + 1)
    }
  }

  // 상위 8개 기술
  const topSkills = [...allSkills.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, 8)
    .map(([s]) => s)

  const nodes: SankeyData['nodes'] = []
  const links: SankeyData['links'] = []

  for (const level of expLevels) {
    nodes.push({
      id: `exp-${level}`,
      label: EXP_LABELS[level] ?? level,
    })
  }

  for (const skill of topSkills) {
    nodes.push({
      id: `sk-${skill.toLowerCase().replace(/[^a-z0-9]/g, '')}`,
      label: skill,
    })
  }

  for (const level of expLevels) {
    for (const skill of topSkills) {
      const count = expSkillCounts.get(`${level}::${skill}`) ?? 0
      if (count === 0) continue
      links.push({
        source: `exp-${level}`,
        target: `sk-${skill.toLowerCase().replace(/[^a-z0-9]/g, '')}`,
        value: count,
      })
    }
  }

  return { nodes, links }
}

// ── QuickStats 계산 ──

export interface QuickStatsData {
  totalJobs: number
  newToday: number
  deadlineSoon: number
  watchedNewJobs: number
}

export function computeQuickStats(
  jobs: JobPostingSummary[],
  watchedCompanyIds: string[] = [],
): QuickStatsData {
  const now = new Date()
  const todayStr = now.toISOString().slice(0, 10)
  const weekLater = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000)
  const weekStr = weekLater.toISOString().slice(0, 10)

  let newToday = 0
  let deadlineSoon = 0
  let watchedNewJobs = 0

  const watchSet = new Set(watchedCompanyIds)

  for (const job of jobs) {
    // 오늘 등록된 공고
    if (job.postedAt === todayStr) newToday++

    // 7일 이내 마감
    if (job.deadline && job.deadline >= todayStr && job.deadline <= weekStr) {
      deadlineSoon++
    }

    // 관심기업 새 공고 (최근 3일)
    if (watchSet.has(job.companyId)) {
      const posted = new Date(job.postedAt)
      const diff = now.getTime() - posted.getTime()
      if (diff < 3 * 24 * 60 * 60 * 1000) watchedNewJobs++
    }
  }

  return {
    totalJobs: jobs.length,
    newToday,
    deadlineSoon,
    watchedNewJobs,
  }
}

// ── 직군별 분포 (간단 바 차트용) ──

export interface CategoryDistribution {
  category: string
  label: string
  count: number
  percentage: number
  color: string
}

const CATEGORY_COLORS: Record<string, string> = {
  frontend: '#3b82f6',
  backend: '#10b981',
  devops: '#f59e0b',
  mobile: '#8b5cf6',
  ai_ml: '#ef4444',
  security: '#06b6d4',
  game: '#ec4899',
  system: '#84cc16',
  dba: '#f97316',
  qa: '#14b8a6',
}

export function computeCategoryDistribution(jobs: JobPostingSummary[]): CategoryDistribution[] {
  const counts = new Map<string, number>()
  for (const job of jobs) {
    counts.set(job.category, (counts.get(job.category) ?? 0) + 1)
  }

  const total = jobs.length || 1

  return [...counts.entries()]
    .sort((a, b) => b[1] - a[1])
    .map(([category, count]) => ({
      category,
      label: CATEGORY_LABELS[category] ?? category,
      count,
      percentage: Math.round((count / total) * 1000) / 10,
      color: CATEGORY_COLORS[category] ?? '#888',
    }))
}
