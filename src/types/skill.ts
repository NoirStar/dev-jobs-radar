// ============================================================
// 기술 분석 관련 타입 정의
// ============================================================

import type { JobCategory } from './job'

/** 기술 카테고리 */
export type SkillCategory =
  | 'languages'
  | 'frontend'
  | 'backend'
  | 'database'
  | 'devops'
  | 'messaging'
  | 'ai_ml'
  | 'mobile'
  | 'testing'
  | 'tools'
  | 'methodology'
  | 'os'
  | 'other'

/** 기술 키워드 사전 항목 */
export interface SkillDictionaryEntry {
  name: string
  category: SkillCategory
  aliases: string[]
  icon?: string
}

/** 기술 통계 */
export interface SkillStat {
  skill: string
  category: SkillCategory
  count: number
  percentage: number
  trend: number // +/- % 변화 (전주 대비)
  trendDirection: 'up' | 'down' | 'stable'
}

/** 직군별 기술 분석 */
export interface CategorySkillAnalysis {
  category: JobCategory
  categoryLabel: string
  totalPostings: number
  topSkills: SkillStat[]
  updatedAt: string
}

/** 기술 트렌드 데이터포인트 */
export interface SkillTrendPoint {
  date: string
  skill: string
  count: number
  percentage: number
}

/** 기술 조합 (co-occurrence) */
export interface SkillCoOccurrence {
  skill1: string
  skill2: string
  count: number
  strength: number // 0~1 정규화된 연관 강도
}

/** 기술 히트맵 셀 */
export interface SkillHeatmapCell {
  category: JobCategory
  skill: string
  value: number
  percentage: number
}

/** 경력별 기술 분포 */
export interface ExperienceSkillDistribution {
  experienceRange: string
  skills: { skill: string; count: number; percentage: number }[]
}

/** 연봉 분포 데이터 */
export interface SalaryDistribution {
  category: JobCategory
  experienceRange: string
  min: number
  q1: number
  median: number
  q3: number
  max: number
  sampleSize: number
}

/** 지역별 채용 분포 */
export interface RegionDistribution {
  region: string
  regionCode: string
  count: number
  percentage: number
  topCategories: { category: JobCategory; count: number }[]
}

/** 기술 분석 스냅샷 (일일/주간) */
export interface SkillAnalysisSnapshot {
  id: string
  date: string
  period: 'daily' | 'weekly' | 'monthly'
  totalPostings: number
  newPostings: number
  categoryBreakdown: { category: JobCategory; count: number }[]
  topSkills: SkillStat[]
  skillTrends: SkillTrendPoint[]
  createdAt: string
}

/** 시장 인사이트 요약 */
export interface MarketInsight {
  totalPostings: number
  activeCompanies: number
  topCategory: { name: string; count: number }
  topSkill: { name: string; count: number; percentage: number }
  avgSalary: { min: number; max: number } | null
  remotePercentage: number
  risingSkills: SkillStat[]
  decliningSkills: SkillStat[]
  categoryBreakdown: { category: string; label: string; count: number; percentage: number }[]
}
