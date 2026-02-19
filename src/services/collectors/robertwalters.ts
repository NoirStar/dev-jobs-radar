// ============================================================
// Robert Walters 수집기
// — robertwalters.co.kr/co.jp IT 헤드헌팅 수집
// ============================================================

import type { Collector, RawJobData } from './types'
import type { SourceId } from '@/types/job'
import { extractTechTags, COMPANY_CONFIDENTIAL, LOCATION_SEOUL, DEFAULT_TIMEOUT } from './collectorUtils'

const RW_API = 'https://www.robertwalters.co.kr/api/jobs'

interface RWJob {
  id: string
  title: string
  company?: string
  location?: string
  category?: string
  salary?: string
  description?: string
  url?: string
  posted_date?: string
}

interface RWResponse {
  results: RWJob[]
  total: number
}

export class RobertWaltersCollector implements Collector {
  readonly sourceId: SourceId = 'robertwalters'
  readonly sourceName = 'Robert Walters'

  async collect(): Promise<RawJobData[]> {
    const jobs: RawJobData[] = []
    const now = new Date().toISOString()

    const sectors = ['technology', 'digital', 'engineering']

    try {
      for (const sector of sectors) {
        const res = await fetch(
          `${RW_API}?sector=${sector}&page=1&per_page=20`,
          { headers: { Accept: 'application/json' }, signal: AbortSignal.timeout(DEFAULT_TIMEOUT) },
        )

        if (!res.ok) continue
        const data = (await res.json()) as RWResponse

        for (const item of data.results ?? []) {
          const tags = extractTechTags(item.description ?? '')

          jobs.push({
            sourceJobId: `rw-${item.id}`,
            source: this.sourceId,
            title: item.title,
            companyName: item.company ?? COMPANY_CONFIDENTIAL,
            url: item.url ?? `https://www.robertwalters.co.kr/jobs/${item.id}`,
            location: item.location ?? LOCATION_SEOUL,
            tags: tags.length > 0 ? tags : undefined,
            salaryText: item.salary,
            postedAt: item.posted_date,
            collectedAt: now,
          })
        }
      }
    } catch (error) {
      console.error('[RobertWaltersCollector] 수집 실패:', error)
    }

    return jobs
  }

}
