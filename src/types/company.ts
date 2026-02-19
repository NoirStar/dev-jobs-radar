// ============================================================
// 기업 관련 타입 정의
// ============================================================

/** 기업 규모 */
export type CompanySize =
  | 'startup'     // ~50명
  | 'small'       // 50~200명
  | 'medium'      // 200~1000명
  | 'large'       // 1000~5000명
  | 'enterprise'  // 5000명+
  | 'unknown'

/** 기업 산업 분류 */
export type IndustryType =
  | 'platform'
  | 'ecommerce'
  | 'fintech'
  | 'gaming'
  | 'enterprise_si'
  | 'telecom'
  | 'social'
  | 'mobility'
  | 'healthcare'
  | 'edtech'
  | 'ai'
  | 'security'
  | 'blockchain'
  | 'saas'
  | 'media'
  | 'public'
  | 'other'

/** 기업 정보 */
export interface Company {
  id: string
  name: string
  nameEn: string | null
  aliases: string[]

  industry: IndustryType
  size: CompanySize
  employeeCount: number | null
  foundedYear: number | null

  description: string | null
  logoUrl: string | null
  websiteUrl: string | null
  careerUrl: string | null

  location: string | null
  techStack: string[]

  totalPostings: number
  activePostings: number

  createdAt: string
  updatedAt: string
}

/** 기업 카드 (리스트 표시용) */
export interface CompanySummary {
  id: string
  name: string
  nameEn: string | null
  industry: IndustryType
  size: CompanySize
  logoUrl: string | null
  location: string | null
  techStack: string[]
  activePostings: number
  totalPostings: number
}

/** 관심 기업 */
export interface WatchedCompany {
  id: string
  userId: string
  companyId: string
  company: CompanySummary
  alertEnabled: boolean
  addedAt: string
  lastCheckedAt: string
  newPostingsCount: number
}
