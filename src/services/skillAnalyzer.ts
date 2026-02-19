// ============================================================
// 기술 분석 엔진 — Phase 4
// 채용공고 데이터에서 기술 스택 통계, 트렌드, 조합을 분석
// ============================================================

import type { JobPostingSummary, JobCategory } from '@/types/job'
import type {
  SkillStat,
  SkillCategory,
  CategorySkillAnalysis,
  SkillCoOccurrence,
  ExperienceSkillDistribution,
} from '@/types/skill'
import type { MarketInsight } from '@/types/skill'
import { SKILL_TO_CATEGORY } from '@/data/skills'
import { JOB_CATEGORIES } from '@/data/categories'

// ── 기술별 공고 수 집계 ──

/** 공고 목록에서 기술별 출현 빈도를 계산한다 */
export function countSkills(jobs: JobPostingSummary[]): Map<string, number> {
  const counts = new Map<string, number>()
  for (const job of jobs) {
    for (const skill of job.skills) {
      counts.set(skill, (counts.get(skill) ?? 0) + 1)
    }
  }
  return counts
}

/** 기술별 빈도를 SkillStat[] 로 변환 (상위 N개) */
export function getTopSkills(
  jobs: JobPostingSummary[],
  topN = 20,
  prevCounts?: Map<string, number>,
): SkillStat[] {
  const total = jobs.length
  if (total === 0) return []

  const counts = countSkills(jobs)
  const sorted = [...counts.entries()].sort((a, b) => b[1] - a[1]).slice(0, topN)

  return sorted.map(([skill, count]) => {
    const percentage = Math.round((count / total) * 1000) / 10
    let trend = 0
    let trendDirection: SkillStat['trendDirection'] = 'stable'

    if (prevCounts) {
      const prev = prevCounts.get(skill) ?? 0
      if (prev > 0) {
        trend = Math.round(((count - prev) / prev) * 1000) / 10
      } else {
        trend = 100
      }
      trendDirection = trend > 2 ? 'up' : trend < -2 ? 'down' : 'stable'
    }

    return {
      skill,
      category: lookupCategory(skill),
      count,
      percentage,
      trend,
      trendDirection,
    }
  })
}

// ── 헬퍼 ──

/** 기술 사전에서 카테고리를 조회한다 (없으면 'other') */
function lookupCategory(skill: string): SkillCategory {
  return SKILL_TO_CATEGORY.get(skill) ?? 'other'
}

/** 직군 ID → 라벨 매핑 (categories.ts에서 파생) */
const CATEGORY_LABELS: Record<string, string> = Object.fromEntries(
  JOB_CATEGORIES.map((c) => [c.id, c.label]),
)

/** 연봉 정보가 있는 공고에서 평균 연봉을 계산한다 */
function computeAvgSalary(
  jobs: JobPostingSummary[],
): { min: number; max: number } | null {
  const valid = jobs.reduce<{ mins: number[]; maxs: number[] }>(
    (acc, j) => {
      if (j.salary?.min != null && j.salary?.max != null) {
        acc.mins.push(j.salary.min)
        acc.maxs.push(j.salary.max)
      }
      return acc
    },
    { mins: [], maxs: [] },
  )
  if (valid.mins.length === 0) return null
  const n = valid.mins.length
  return {
    min: Math.round(valid.mins.reduce((a, b) => a + b, 0) / n),
    max: Math.round(valid.maxs.reduce((a, b) => a + b, 0) / n),
  }
}

// ── 직군별 기술 분석 ──

/** 직군별 기술 통계를 생성한다 */
export function analyzeByCategory(
  jobs: JobPostingSummary[],
  topN = 10,
): CategorySkillAnalysis[] {
  const grouped = new Map<JobCategory, JobPostingSummary[]>()

  for (const job of jobs) {
    const list = grouped.get(job.category) ?? []
    list.push(job)
    grouped.set(job.category, list)
  }

  const results: CategorySkillAnalysis[] = []

  for (const [category, catJobs] of grouped) {
    results.push({
      category,
      categoryLabel: CATEGORY_LABELS[category] ?? category,
      totalPostings: catJobs.length,
      topSkills: getTopSkills(catJobs, topN),
      updatedAt: new Date().toISOString(),
    })
  }

  return results.sort((a, b) => b.totalPostings - a.totalPostings)
}

// ── 기술 조합 (Co-occurrence) 분석 ──

/** 공고 기반 기술 동시 출현 빈도를 계산한다 */
export function computeCoOccurrence(
  jobs: JobPostingSummary[],
  topN = 30,
): SkillCoOccurrence[] {
  const pairCounts = new Map<string, number>()
  const skillCounts = countSkills(jobs)

  for (const job of jobs) {
    const skills = [...new Set(job.skills)] // 중복 제거
    for (let i = 0; i < skills.length; i++) {
      for (let j = i + 1; j < skills.length; j++) {
        const key = [skills[i], skills[j]].sort().join('::')
        pairCounts.set(key, (pairCounts.get(key) ?? 0) + 1)
      }
    }
  }

  const sorted = [...pairCounts.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, topN)

  return sorted.map(([key, count]) => {
    const [skill1, skill2] = key.split('::')
    const c1 = skillCounts.get(skill1) ?? 1
    const c2 = skillCounts.get(skill2) ?? 1
    // Jaccard 유사도 = 교집합 / 합집합
    const strength = Math.round((count / (c1 + c2 - count)) * 100) / 100

    return { skill1, skill2, count, strength }
  })
}

// ── 경력별 기술 분포 ──

const EXP_RANGES: { label: string; min: number; max: number }[] = [
  { label: '신입 (0~2년)', min: 0, max: 2 },
  { label: '주니어 (3~5년)', min: 3, max: 5 },
  { label: '시니어 (6~9년)', min: 6, max: 9 },
  { label: '리드 (10년+)', min: 10, max: Infinity },
]

/** 경력 구간별 기술 분포를 분석한다 */
export function analyzeByExperience(
  jobs: JobPostingSummary[],
  topN = 8,
): ExperienceSkillDistribution[] {
  return EXP_RANGES.map((range) => {
    const rangeJobs = jobs.filter((j) => {
      const min = j.experience.minYears ?? 0
      return min >= range.min && min <= range.max
    })

    const counts = countSkills(rangeJobs)
    const total = rangeJobs.length || 1
    const sorted = [...counts.entries()].sort((a, b) => b[1] - a[1]).slice(0, topN)

    return {
      experienceRange: range.label,
      skills: sorted.map(([skill, count]) => ({
        skill,
        count,
        percentage: Math.round((count / total) * 1000) / 10,
      })),
    }
  })
}

// ── 트렌드 변화 계산 ──

/**
 * 두 기간의 기술 통계를 비교하여 트렌드 변화를 계산한다
 * @returns 증가/감소 상위 각각 N개
 */
export function computeTrendChanges(
  currentJobs: JobPostingSummary[],
  previousJobs: JobPostingSummary[],
  topN = 5,
): { rising: SkillStat[]; declining: SkillStat[] } {
  const prevCounts = countSkills(previousJobs)
  const currentCounts = countSkills(currentJobs)
  const total = currentJobs.length || 1

  const allSkills = new Set([...prevCounts.keys(), ...currentCounts.keys()])
  const changes: SkillStat[] = []

  for (const skill of allSkills) {
    const curr = currentCounts.get(skill) ?? 0
    const prev = prevCounts.get(skill) ?? 0
    const diff = curr - prev
    if (diff === 0) continue

    const trend = prev > 0 ? Math.round(((curr - prev) / prev) * 1000) / 10 : 100

    changes.push({
      skill,
      category: lookupCategory(skill),
      count: curr,
      percentage: Math.round((curr / total) * 1000) / 10,
      trend,
      trendDirection: trend > 0 ? 'up' : 'down',
    })
  }

  const sorted = changes.sort((a, b) => b.trend - a.trend)

  return {
    rising: sorted.slice(0, topN),
    declining: sorted.slice(-topN).reverse(),
  }
}

// ── 시장 인사이트 요약 ──

/** 공고 전체에서 시장 인사이트 요약을 생성한다 */
export function generateMarketInsight(
  jobs: JobPostingSummary[],
  previousJobs: JobPostingSummary[] = [],
): MarketInsight {
  const total = jobs.length
  if (total === 0) {
    return {
      totalPostings: 0,
      activeCompanies: 0,
      topCategory: { name: '-', count: 0 },
      topSkill: { name: '-', count: 0, percentage: 0 },
      avgSalary: null,
      remotePercentage: 0,
      risingSkills: [],
      decliningSkills: [],
      categoryBreakdown: [],
    }
  }

  // 활성 기업 수
  const companySet = new Set(jobs.map((j) => j.companyId))

  // 직군 분포
  const catCounts = new Map<string, number>()
  for (const j of jobs) {
    catCounts.set(j.category, (catCounts.get(j.category) ?? 0) + 1)
  }
  const catBreakdown = [...catCounts.entries()]
    .sort((a, b) => b[1] - a[1])
    .map(([category, count]) => ({
      category,
      label: CATEGORY_LABELS[category] ?? category,
      count,
      percentage: Math.round((count / total) * 1000) / 10,
    }))

  // 상위 기술
  const skillCounts = countSkills(jobs)
  const topSkillEntry = [...skillCounts.entries()].sort((a, b) => b[1] - a[1])[0]

  // 연봉 평균
  const avgSalary = computeAvgSalary(jobs)

  // 원격 비율
  const remoteCount = jobs.filter((j) => j.isRemote).length

  // 트렌드
  const { rising, declining } = previousJobs.length > 0
    ? computeTrendChanges(jobs, previousJobs)
    : { rising: [] as SkillStat[], declining: [] as SkillStat[] }

  return {
    totalPostings: total,
    activeCompanies: companySet.size,
    topCategory: {
      name: CATEGORY_LABELS[catBreakdown[0].category] ?? catBreakdown[0].category,
      count: catBreakdown[0].count,
    },
    topSkill: topSkillEntry
      ? {
          name: topSkillEntry[0],
          count: topSkillEntry[1],
          percentage: Math.round((topSkillEntry[1] / total) * 1000) / 10,
        }
      : { name: '-', count: 0, percentage: 0 },
    avgSalary,
    remotePercentage: Math.round((remoteCount / total) * 1000) / 10,
    risingSkills: rising,
    decliningSkills: declining,
    categoryBreakdown: catBreakdown,
  }
}
