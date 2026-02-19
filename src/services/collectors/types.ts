// ============================================================
// 수집기 공통 타입 정의
// ============================================================

import type { JobCategory, SourceId, ExperienceLevel } from '@/types/job'

/** 수집된 원시 데이터 (파싱 전) */
export interface RawJobData {
  /** 소스 고유 ID */
  sourceJobId: string
  /** 소스 */
  source: SourceId
  /** 공고 제목 */
  title: string
  /** 회사명 (원문) */
  companyName: string
  /** 공고 URL */
  url: string
  /** 지역 */
  location?: string
  /** 경력 조건 (원문) */
  experienceText?: string
  /** 연봉 (원문) */
  salaryText?: string
  /** 마감일 */
  deadline?: string
  /** 기술 태그 (소스 제공) */
  tags?: string[]
  /** 공고 본문 (기술 추출용) */
  description?: string
  /** 원격근무 여부 */
  isRemote?: boolean
  /** 수집 시각 */
  collectedAt: string
}

/** 파싱 완료된 공고 데이터 */
export interface ParsedJobData extends RawJobData {
  /** 추출된 기술 스택 (정규화) */
  skills: string[]
  /** 분류된 직군 */
  category: JobCategory
  /** 파싱된 경력 조건 */
  experience: {
    level: ExperienceLevel
    minYears: number | null
    maxYears: number | null
    text: string
  }
  /** 파싱된 연봉 */
  salary: {
    min: number | null
    max: number | null
    currency: string
    text: string
  } | null
  /** 정규화된 회사명 */
  normalizedCompanyName: string
}

/** 수집기 인터페이스 — 모든 수집기가 구현 */
export interface Collector {
  /** 소스 ID */
  readonly sourceId: SourceId
  /** 소스 이름 */
  readonly sourceName: string
  /** 채용공고 수집 실행 */
  collect(): Promise<RawJobData[]>
}

/** 수집 결과 */
export interface CollectResult {
  source: SourceId
  success: boolean
  jobCount: number
  newJobCount: number
  duration: number
  error?: string
  collectedAt: string
}

/** 수집 파이프라인 옵션 */
export interface PipelineOptions {
  /** 수집할 소스 ID 목록 (미지정시 전체 활성 소스) */
  sources?: SourceId[]
  /** 최대 페이지 수 */
  maxPages?: number
  /** 요청 간 딜레이 (ms) */
  requestDelay?: number
}
