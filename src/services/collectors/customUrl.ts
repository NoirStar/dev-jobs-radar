// ============================================================
// 사용자 커스텀 URL 모니터링 수집기
// — 사용자가 직접 등록한 채용페이지 URL을 주기적으로 크롤링
// ============================================================

import type { Collector, RawJobData } from './types'
import type { SourceId } from '@/types/job'
import {
  hashCode,
  parseJobPostingJsonLd,
  DEFAULT_USER_AGENT,
  DEFAULT_TIMEOUT,
} from './collectorUtils'

/** 사용자가 등록하는 커스텀 모니터링 URL */
export interface CustomMonitorUrl {
  /** 고유 ID */
  id: string
  /** 사용자가 붙인 이름 */
  label: string
  /** 모니터링 대상 URL */
  url: string
  /** 회사명 (선택) */
  companyName?: string
  /** 활성 여부 */
  enabled: boolean
  /** 생성일 */
  createdAt: string
  /** 마지막 수집일 */
  lastCollectedAt?: string
  /** 마지막 수집 공고 수 */
  lastJobCount?: number
}

/** 커스텀 URL 모니터링 결과 */
export interface MonitorResult {
  urlId: string
  label: string
  success: boolean
  jobCount: number
  newJobs: number
  error?: string
  collectedAt: string
}

export class CustomUrlCollector implements Collector {
  readonly sourceId: SourceId = 'custom'
  readonly sourceName = '커스텀 URL'

  private readonly urls: CustomMonitorUrl[]

  constructor(urls: CustomMonitorUrl[]) {
    this.urls = urls.filter((u) => u.enabled)
  }

  async collect(): Promise<RawJobData[]> {
    const allJobs: RawJobData[] = []
    const now = new Date().toISOString()

    // 순차 처리 — 사용자 정의 URL은 많지 않으므로 순차가 안전
    for (const monitorUrl of this.urls) {
      try {
        const jobs = await this.collectFromUrl(monitorUrl, now)
        allJobs.push(...jobs)
      } catch (error) {
        console.error(
          `[CustomUrlCollector] ${monitorUrl.label} 수집 실패:`,
          error,
        )
      }
    }

    return allJobs
  }

  private async collectFromUrl(
    monitorUrl: CustomMonitorUrl,
    now: string,
  ): Promise<RawJobData[]> {
    const jobs: RawJobData[] = []

    const res = await fetch(monitorUrl.url, {
      headers: {
        Accept: 'text/html',
        'User-Agent': DEFAULT_USER_AGENT,
      },
      signal: AbortSignal.timeout(DEFAULT_TIMEOUT),
    })

    if (!res.ok) return jobs
    const html = await res.text()

    // JSON-LD 추출 우선 시도
    const jsonLdJobs = parseJobPostingJsonLd(
      html,
      {
        sourceId: this.sourceId,
        idPrefix: `custom-${monitorUrl.id}`,
        defaultCompany: monitorUrl.companyName ?? monitorUrl.label,
        defaultLocation: '',
      },
      now,
    )
    // companyName 오버라이드
    for (const job of jsonLdJobs) {
      if (!job.url) job.url = monitorUrl.url
    }
    if (jsonLdJobs.length > 0) return jsonLdJobs

    // HTML 링크 패턴 기반 추출
    const linkJobs = this.extractFromLinks(html, monitorUrl, now)
    if (linkJobs.length > 0) return linkJobs

    // 구조화된 텍스트 패턴 (제목 + URL 패턴)
    return this.extractFromTextPatterns(html, monitorUrl, now)
  }

  /** 채용 관련 링크 추출 */
  private extractFromLinks(
    html: string,
    monitorUrl: CustomMonitorUrl,
    now: string,
  ): RawJobData[] {
    const jobs: RawJobData[] = []
    const linkPattern =
      /<a[^>]*href=["']([^"']*(?:job|career|recruit|position|opening|apply)[^"']*)["'][^>]*>([\s\S]*?)<\/a>/gi

    for (const m of html.matchAll(linkPattern)) {
      const href = m[1]
      const title = m[2].replace(/<[^>]*>/g, '').trim()

      if (!title || title.length < 5 || title.length > 200) continue

      const fullUrl = href.startsWith('http')
        ? href
        : `${monitorUrl.url.replace(/\/$/, '')}${href.startsWith('/') ? '' : '/'}${href}`

      jobs.push({
        sourceJobId: `custom-${monitorUrl.id}-${hashCode(href)}`,
        source: this.sourceId,
        title,
        companyName: monitorUrl.companyName ?? monitorUrl.label,
        url: fullUrl,
        collectedAt: now,
      })
    }

    return jobs
  }

  /** 텍스트 패턴 기반 추출 (최후 수단) */
  private extractFromTextPatterns(
    html: string,
    monitorUrl: CustomMonitorUrl,
    now: string,
  ): RawJobData[] {
    const jobs: RawJobData[] = []
    // 제목 태그 안에 채용 관련 키워드가 있는 경우
    const headingPattern =
      /<(?:h[1-6]|strong|b)[^>]*>(.*?(?:개발자|엔지니어|Engineer|Developer|Designer|Manager).*?)<\/(?:h[1-6]|strong|b)>/gi

    for (const m of html.matchAll(headingPattern)) {
      const title = m[1].replace(/<[^>]*>/g, '').trim()
      if (!title || title.length < 5) continue

      jobs.push({
        sourceJobId: `custom-${monitorUrl.id}-${hashCode(title)}`,
        source: this.sourceId,
        title,
        companyName: monitorUrl.companyName ?? monitorUrl.label,
        url: monitorUrl.url,
        collectedAt: now,
      })
    }

    return jobs
  }

}

// ── 커스텀 URL 프리셋 유틸리티 ──

/** 새 커스텀 URL 항목 생성 */
export function createMonitorUrl(
  label: string,
  url: string,
  companyName?: string,
): CustomMonitorUrl {
  return {
    id: `cmu-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    label,
    url,
    companyName,
    enabled: true,
    createdAt: new Date().toISOString(),
  }
}

/** URL 유효성 검사 */
export function validateMonitorUrl(url: string): {
  valid: boolean
  error?: string
} {
  try {
    const parsed = new URL(url)
    if (!['http:', 'https:'].includes(parsed.protocol)) {
      return { valid: false, error: 'HTTP/HTTPS 프로토콜만 지원합니다' }
    }
    return { valid: true }
  } catch {
    return { valid: false, error: '유효하지 않은 URL 형식입니다' }
  }
}
