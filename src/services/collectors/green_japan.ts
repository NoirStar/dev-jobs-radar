// ============================================================
// Green Japan 수집기
// — green-japan.com 일본 IT 채용 수집
// ============================================================

import type { Collector, RawJobData } from './types'
import { DEFAULT_TIMEOUT, deduplicateJobs } from './collectorUtils'
import type { SourceId } from '@/types/job'

const GREEN_API = 'https://www.green-japan.com/api/v1/jobs'

interface GreenJob {
  id: number
  title: string
  company_name: string
  location?: string
  tags?: string[]
  salary_text?: string
  published_at?: string
  url?: string
}

interface GreenResponse {
  jobs: GreenJob[]
  total_count: number
}

export class GreenJapanCollector implements Collector {
  readonly sourceId: SourceId = 'green_japan'
  readonly sourceName = 'Green Japan'

  async collect(): Promise<RawJobData[]> {
    const jobs: RawJobData[] = []
    const now = new Date().toISOString()

    const categories = ['engineer', 'web', 'mobile', 'infra', 'data']

    try {
      for (const cat of categories) {
        const res = await fetch(
          `${GREEN_API}?category=${cat}&page=1&per_page=20`,
          { headers: { Accept: 'application/json' }, signal: AbortSignal.timeout(DEFAULT_TIMEOUT) },
        )

        if (!res.ok) continue
        const data = (await res.json()) as GreenResponse

        for (const item of data.jobs ?? []) {
          jobs.push({
            sourceJobId: `green-${item.id}`,
            source: this.sourceId,
            title: item.title,
            companyName: item.company_name,
            url: item.url ?? `https://www.green-japan.com/job/${item.id}`,
            location: item.location ?? '東京',
            tags: item.tags,
            salaryText: item.salary_text,
            postedAt: item.published_at,
            collectedAt: now,
          })
        }
      }
    } catch (error) {
      console.error('[GreenJapanCollector] 수집 실패:', error)
    }

    return deduplicateJobs(jobs)
  }
}
