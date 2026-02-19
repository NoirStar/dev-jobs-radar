// ============================================================
// 수집기 공통 유틸리티
// — 여러 수집기에서 공유하는 함수들을 한 곳에 모음
// ============================================================

import type { RawJobData } from './types'
import type { SourceId } from '@/types/job'

// ── 상수 ──

export const DEFAULT_USER_AGENT =
  'Mozilla/5.0 (compatible; DevJobsRadar/1.0; +https://devjobsradar.app)'

export const DEFAULT_TIMEOUT = 15_000

export const LOCATION_REMOTE = 'Remote'
export const LOCATION_UNKNOWN = 'Unknown'
export const LOCATION_SEOUL = '서울'
export const LOCATION_TOKYO = '東京'
export const COMPANY_CONFIDENTIAL = 'Confidential'

// ── 해시 함수 ──

/** 문자열을 짧은 base-36 해시로 변환 */
export function hashCode(str: string): string {
  let hash = 0
  for (let i = 0; i < str.length; i++) {
    hash = ((hash << 5) - hash + str.charCodeAt(i)) | 0
  }
  return Math.abs(hash).toString(36)
}

// ── 기술 태그 추출 (설명 텍스트에서) ──

const BASE_TECH_KEYWORDS = [
  'React', 'Vue', 'Angular', 'Node.js', 'Python', 'Java', 'Go',
  'TypeScript', 'JavaScript', 'AWS', 'Azure', 'GCP', 'Docker',
  'Kubernetes', 'Spring', 'Django', 'FastAPI', '.NET', 'Rust',
]

/**
 * 텍스트 설명에서 기술 키워드를 추출한다.
 * @param description 공고 설명 텍스트
 * @param additionalKeywords 추가 키워드 목록
 */
export function extractTechTags(
  description: string,
  additionalKeywords: string[] = [],
): string[] {
  const allKeywords = [...BASE_TECH_KEYWORDS, ...additionalKeywords]
  const lowerDesc = description.toLowerCase()
  return allKeywords.filter((kw) => lowerDesc.includes(kw.toLowerCase()))
}

// ── JSON-LD (schema.org/JobPosting) 파싱 ──

interface JsonLdJobPosting {
  '@type'?: string
  title?: string
  name?: string
  url?: string
  datePosted?: string
  jobLocation?: { address?: { addressLocality?: string } }
  hiringOrganization?: { name?: string }
  description?: string
}

interface JsonLdParseOptions {
  sourceId: SourceId
  idPrefix: string
  defaultCompany: string
  defaultLocation: string
}

/** HTML에서 JSON-LD JobPosting을 추출한다 */
export function parseJobPostingJsonLd(
  html: string,
  opts: JsonLdParseOptions,
  now: string,
): RawJobData[] {
  const jobs: RawJobData[] = []
  const scriptPattern =
    /<script[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi

  for (const match of html.matchAll(scriptPattern)) {
    try {
      const data = JSON.parse(match[1]) as JsonLdJobPosting | JsonLdJobPosting[]
      const items = Array.isArray(data) ? data : [data]

      for (const item of items) {
        if (item['@type'] !== 'JobPosting') continue

        const title = item.title ?? item.name
        if (!title) continue

        jobs.push({
          sourceJobId: `${opts.idPrefix}-${hashCode(item.url ?? title)}`,
          source: opts.sourceId,
          title,
          companyName: item.hiringOrganization?.name ?? opts.defaultCompany,
          url: item.url ?? '',
          location:
            item.jobLocation?.address?.addressLocality ?? opts.defaultLocation,
          description: item.description?.slice(0, 500),
          postedAt: item.datePosted,
          collectedAt: now,
        })
      }
    } catch {
      // JSON 파싱 실패 → 무시
    }
  }

  return jobs
}

// ── 결과 중복 제거 ──

/** sourceJobId 기준으로 중복 제거 */
export function deduplicateJobs(jobs: RawJobData[]): RawJobData[] {
  const seen = new Map<string, RawJobData>()
  for (const job of jobs) {
    if (!seen.has(job.sourceJobId)) {
      seen.set(job.sourceJobId, job)
    }
  }
  return Array.from(seen.values())
}
