// ============================================================
// Tier 4: 기업 직접 채용페이지 수집기
// — COMPANY_SEEDS의 careerUrl을 크롤링하여 채용공고 수집
// — 45개 기업 채용페이지를 범용 HTML 파서로 처리
// ============================================================

import type { Collector, RawJobData } from './types'
import type { SourceId } from '@/types/job'
import { COMPANY_SEEDS, type CompanySeed } from '@/data/companies'
import {
  hashCode,
  parseJobPostingJsonLd,
  DEFAULT_USER_AGENT,
  DEFAULT_TIMEOUT,
} from './collectorUtils'

// ── 범용 HTML 파서 ──

function genericParse(html: string, seed: CompanySeed, now: string): RawJobData[] {
  // JSON-LD 스키마에서 JobPosting 추출 시도
  const jsonLdJobs = parseJobPostingJsonLd(
    html,
    {
      sourceId: 'company_direct',
      idPrefix: `cd-${seed.id}`,
      defaultCompany: seed.name,
      defaultLocation: seed.location,
    },
    now,
  )
  // JSON-LD에서 추출된 결과에 techStack 태그 추가
  for (const job of jsonLdJobs) {
    job.tags = seed.techStack
    if (!job.url) job.url = seed.careerUrl
  }
  if (jsonLdJobs.length > 0) return jsonLdJobs

  // 일반적인 채용 카드/리스트 패턴 매칭
  const jobs: RawJobData[] = []
  const linkPattern =
    /<a[^>]*href=["']([^"']*(?:job|career|recruit|position|opening)[^"']*)["'][^>]*>([\s\S]*?)<\/a>/gi

  for (const m of html.matchAll(linkPattern)) {
    const href = m[1]
    const innerHtml = m[2]
    const title = innerHtml.replace(/<[^>]*>/g, '').trim()

    if (!title || title.length < 5 || title.length > 200) continue

    const fullUrl = href.startsWith('http')
      ? href
      : `${seed.careerUrl.replace(/\/$/, '')}${href.startsWith('/') ? '' : '/'}${href}`

    jobs.push({
      sourceJobId: `cd-${seed.id}-${hashCode(href)}`,
      source: 'company_direct' as SourceId,
      title,
      companyName: seed.name,
      url: fullUrl,
      location: seed.location,
      tags: seed.techStack,
      collectedAt: now,
    })
  }

  return jobs
}

// ── 메인 수집기 클래스 ──

export class CompanyDirectCollector implements Collector {
  readonly sourceId: SourceId = 'company_direct'
  readonly sourceName = '기업 직접 수집'

  /** 특정 기업만 수집할 경우 ID 목록 지정 */
  private readonly targetCompanyIds: string[] | null

  constructor(companyIds?: string[]) {
    this.targetCompanyIds = companyIds ?? null
  }

  async collect(): Promise<RawJobData[]> {
    const jobs: RawJobData[] = []
    const now = new Date().toISOString()

    const ids = this.targetCompanyIds
    const seeds = ids
      ? COMPANY_SEEDS.filter((s) => ids.includes(s.id))
      : COMPANY_SEEDS

    // 동시 요청 제한: 5개씩 배치 처리
    const batchSize = 5
    for (let i = 0; i < seeds.length; i += batchSize) {
      const batch = seeds.slice(i, i + batchSize)
      const results = await Promise.allSettled(
        batch.map((seed) => this.collectFromCompany(seed, now)),
      )

      for (const result of results) {
        if (result.status === 'fulfilled') {
          jobs.push(...result.value)
        }
      }
    }

    return jobs
  }

  private async collectFromCompany(
    seed: CompanySeed,
    now: string,
  ): Promise<RawJobData[]> {
    try {
      const res = await fetch(seed.careerUrl, {
        headers: {
          Accept: 'text/html',
          'User-Agent': DEFAULT_USER_AGENT,
        },
        signal: AbortSignal.timeout(DEFAULT_TIMEOUT),
      })

      if (!res.ok) return []
      const html = await res.text()

      return genericParse(html, seed, now)
    } catch (error) {
      console.error(`[CompanyDirectCollector] ${seed.name} 수집 실패:`, error)
      return []
    }
  }
}

// ── 개별 기업 수집기 팩토리 ──

/**
 * 특정 기업의 채용페이지만 수집하는 수집기 생성
 * @example const naverCollector = createCompanyCollector('naver')
 */
export function createCompanyCollector(companyId: string): CompanyDirectCollector {
  return new CompanyDirectCollector([companyId])
}

/** 산업별 기업 수집기 생성 */
export function createIndustryCollector(
  industry: string,
): CompanyDirectCollector {
  const ids = COMPANY_SEEDS
    .filter((s) => s.industry === industry)
    .map((s) => s.id)
  return new CompanyDirectCollector(ids)
}

// ── 기업 카테고리별 수집기 프리셋 ──

/** 플랫폼/빅테크 수집기 */
export const platformCollector = new CompanyDirectCollector([
  'naver', 'kakao', 'line', 'coupang', 'woowa', 'toss', 'daangn', 'yanolja', 'nhn',
])

/** 핀테크 수집기 */
export const fintechCollector = new CompanyDirectCollector([
  'toss', 'kakaopay', 'kakaobank', 'banksalad', 'dunamu',
])

/** 커머스 수집기 */
export const ecommerceCollector = new CompanyDirectCollector([
  'coupang', 'naver_shopping', 'ssg', 'musinsa', 'kurly', 'zigzag',
])

/** 게임사 수집기 */
export const gamingCollector = new CompanyDirectCollector([
  'nexon', 'krafton', 'ncsoft', 'netmarble', 'smilegate',
  'pearl_abyss', 'com2us', 'devsisters', 'kakaogames',
])

/** 대기업/SI 수집기 */
export const enterpriseCollector = new CompanyDirectCollector([
  'samsungsds', 'lgcns', 'skcc', 'kakaoenterprise', 'hancom',
])

/** 통신/공공 수집기 */
export const telecomCollector = new CompanyDirectCollector([
  'kt', 'skt', 'lgu', 'kisa',
])
