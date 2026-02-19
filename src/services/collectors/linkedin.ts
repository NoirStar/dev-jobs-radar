// ============================================================
// LinkedIn 수집기
// — linkedin.com/jobs IT 채용 공고 수집
// ============================================================

import type { Collector, RawJobData } from './types'
import { DEFAULT_TIMEOUT, deduplicateJobs } from './collectorUtils'
import type { SourceId } from '@/types/job'

const LINKEDIN_API = 'https://www.linkedin.com/jobs-guest/jobs/api/seeMoreJobPostings/search'

interface LinkedInJob {
  entityUrn: string
  title: string
  companyName: string
  formattedLocation?: string
  listedAt?: string
}

export class LinkedInCollector implements Collector {
  readonly sourceId: SourceId = 'linkedin'
  readonly sourceName = '링크드인'

  async collect(): Promise<RawJobData[]> {
    const jobs: RawJobData[] = []
    const now = new Date().toISOString()

    try {
      const queries = ['software+engineer', 'frontend+developer', 'backend+developer']
      for (const q of queries) {
        const res = await fetch(
          `${LINKEDIN_API}?keywords=${q}&location=South+Korea&start=0&count=25`,
          {
            headers: {
              Accept: 'text/html',
              'Accept-Language': 'ko',
            },
            signal: AbortSignal.timeout(DEFAULT_TIMEOUT),
          },
        )

        if (!res.ok) continue
        const html = await res.text()
        const parsed = this.parseCards(html)

        for (const item of parsed) {
          jobs.push({
            sourceJobId: `linkedin-${item.entityUrn}`,
            source: this.sourceId,
            title: item.title,
            companyName: item.companyName,
            url: `https://www.linkedin.com/jobs/view/${item.entityUrn}`,
            location: item.formattedLocation,
            collectedAt: now,
          })
        }
      }
    } catch (error) {
      console.error('[LinkedInCollector] 수집 실패:', error)
    }

    return deduplicateJobs(jobs)
  }

  private parseCards(html: string): LinkedInJob[] {
    const results: LinkedInJob[] = []
    const pattern = /data-entity-urn="urn:li:jobPosting:(\d+)"[\s\S]*?class="base-search-card__title[^"]*"[^>]*>([^<]+)<[\s\S]*?class="base-search-card__subtitle[^"]*"[^>]*>([^<]+)</g
    let match: RegExpExecArray | null
    while ((match = pattern.exec(html)) !== null) {
      results.push({
        entityUrn: match[1],
        title: match[2].trim(),
        companyName: match[3].trim(),
      })
    }
    return results
  }
}
