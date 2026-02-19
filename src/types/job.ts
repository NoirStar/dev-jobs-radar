// ============================================================
// 채용공고 관련 타입 정의
// ============================================================

/** IT 직군 카테고리 */
export type JobCategory =
  | 'frontend'
  | 'backend'
  | 'mobile'
  | 'system'
  | 'devops'
  | 'ai_ml'
  | 'security'
  | 'game'
  | 'dba'
  | 'qa'
  | 'pm_po'
  | 'designer'
  | 'sales_engineer'
  | 'it_planner'

/** 경력 구분 */
export type ExperienceLevel = 'intern' | 'entry' | 'junior' | 'mid' | 'senior' | 'lead' | 'any'

/** 고용 형태 */
export type EmploymentType = 'full-time' | 'contract' | 'part-time' | 'freelance' | 'intern'

/** 수집 소스 Tier */
export type SourceTier = 'tier1' | 'tier2' | 'tier3' | 'tier4' | 'custom'

/** 수집 소스 ID */
export type SourceId =
  // Tier 1
  | 'wanted'
  | 'saramin'
  | 'jobkorea'
  | 'programmers'
  | 'jumpit'
  // Tier 2
  | 'rallit'
  | 'rocketpunch'
  | 'indeed'
  | 'blind'
  | 'catch'
  | 'jobplanet'
  | 'okky'
  | 'disquiet'
  | 'careerly'
  | 'worknet'
  | 'peoplenjob'
  // Tier 3
  | 'linkedin'
  | 'glassdoor'
  | 'wellfound'
  | 'remoteok'
  | 'wwr'
  | 'stackoverflow'
  | 'hired'
  | 'green_japan'
  | 'wantedly_jp'
  | 'robertwalters'
  | 'michaelpage'
  // Tier 4 — company direct
  | 'company_direct'
  // Custom
  | 'custom'

/** 연봉 정보 */
export interface SalaryRange {
  min: number | null
  max: number | null
  currency: 'KRW' | 'USD' | 'JPY' | 'EUR'
  type: 'annual' | 'monthly' | 'negotiable'
  text: string
}

/** 경력 요구사항 */
export interface ExperienceRequirement {
  level: ExperienceLevel
  minYears: number | null
  maxYears: number | null
  text: string
}

/** 추출된 기술 스택 */
export interface ExtractedSkills {
  required: string[]
  preferred: string[]
  all: string[]
}

/** 채용공고 */
export interface JobPosting {
  id: string
  source: SourceId
  sourceUrl: string
  sourceId: string

  title: string
  companyId: string
  companyName: string

  category: JobCategory
  subcategory: string | null

  description: string
  requirements: string | null
  preferredQualifications: string | null
  benefits: string | null

  skills: ExtractedSkills
  experience: ExperienceRequirement
  salary: SalaryRange | null
  employmentType: EmploymentType

  location: string
  isRemote: boolean

  postedAt: string | null
  deadline: string | null
  collectedAt: string
  updatedAt: string

  isActive: boolean
  viewCount: number
}

/** 채용공고 요약 (리스트 표시용) */
export interface JobPostingSummary {
  id: string
  title: string
  companyName: string
  companyId: string
  category: JobCategory
  skills: string[]
  experience: ExperienceRequirement
  salary: SalaryRange | null
  location: string
  isRemote: boolean
  source: SourceId
  sourceUrl: string
  deadline: string | null
  postedAt: string | null
  collectedAt: string
  isActive: boolean
}

/** 지원 상태 */
export type ApplicationStatus =
  | 'interested'
  | 'applied'
  | 'screening'
  | 'interview'
  | 'technical_test'
  | 'final_interview'
  | 'offer'
  | 'accepted'
  | 'rejected'
  | 'withdrawn'

/** 지원 추적 */
export interface Application {
  id: string
  userId: string
  jobId: string
  job: JobPostingSummary
  status: ApplicationStatus
  appliedAt: string | null
  notes: string
  statusHistory: {
    status: ApplicationStatus
    date: string
    note: string
  }[]
  createdAt: string
  updatedAt: string
}
