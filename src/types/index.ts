// ============================================================
// 타입 인덱스 — 모든 타입 re-export
// ============================================================

export type {
  JobCategory,
  ExperienceLevel,
  EmploymentType,
  SourceTier,
  SourceId,
  SalaryRange,
  ExperienceRequirement,
  ExtractedSkills,
  JobPosting,
  JobPostingSummary,
  ApplicationStatus,
  Application,
} from './job'

export type {
  CompanySize,
  IndustryType,
  Company,
  CompanySummary,
  WatchedCompany,
} from './company'

export type {
  SkillCategory,
  SkillDictionaryEntry,
  SkillStat,
  CategorySkillAnalysis,
  SkillTrendPoint,
  SkillCoOccurrence,
  SkillHeatmapCell,
  ExperienceSkillDistribution,
  SalaryDistribution,
  RegionDistribution,
  SkillAnalysisSnapshot,
} from './skill'

export type {
  ChartPeriod,
  ChartType,
  ChartFilter,
  ChartSeries,
  BumpChartData,
  BoxPlotData,
  HeatmapData,
  NetworkGraphData,
  RadarChartData,
  WordCloudData,
  SankeyData,
  MapChartData,
} from './chart'

export type {
  AlertType,
  UserProfile,
  KeywordAlert,
  UserSettings,
} from './user'

export { DEFAULT_USER_SETTINGS } from './user'
