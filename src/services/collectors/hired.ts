// ============================================================
// Hired 수집기
// — hired.com 매칭 기반 채용 수집
// ============================================================

import type { Collector, RawJobData } from './types'
import { DEFAULT_TIMEOUT } from './collectorUtils'
import type { SourceId } from '@/types/job'

const HIRED_API = 'https://hired.com/api/v2/jobs'

interface HiredJob {
  id: string
  title: string
  company: { name: string; logo_url?: string }
  location: { city?: string; country?: string }
  skills?: string[]
  salary_range?: { min: number; max: number; currency: string }
  remote?: boolean
  url?: string
  created_at: string
}

interface HiredResponse {
  jobs: HiredJob[]
  total: number
}

export class HiredCollector implements Collector {
  readonly sourceId: SourceId = 'hired'
  readonly sourceName = 'Hired'

  async collect(): Promise<RawJobData[]> {
    const jobs: RawJobData[] = []
    const now = new Date().toISOString()

    try {
      const res = await fetch(`${HIRED_API}?category=engineering&page=1&per_page=50`, {
        headers: { Accept: 'application/json' }, signal: AbortSignal.timeout(DEFAULT_TIMEOUT),
      })

      if (!res.ok) return jobs
      const data = (await res.json()) as HiredResponse

      for (const item of data.jobs ?? []) {
        const loc = [item.location?.city, item.location?.country]
          .filter(Boolean)
          .join(', ')

        const salaryText =
          item.salary_range
            ? `${item.salary_range.currency} ${item.salary_range.min.toLocaleString()}~${item.salary_range.max.toLocaleString()}`
            : undefined

        jobs.push({
          sourceJobId: `hired-${item.id}`,
          source: this.sourceId,
          title: item.title,
          companyName: item.company.name,
          url: item.url ?? `https://hired.com/jobs/${item.id}`,
          location: loc || 'Unknown',
          tags: item.skills,
          salaryText,
          isRemote: item.remote,
          postedAt: item.created_at,
          collectedAt: now,
        })
      }
    } catch (error) {
      console.error('[HiredCollector] 수집 실패:', error)
    }

    return jobs
  }
}
