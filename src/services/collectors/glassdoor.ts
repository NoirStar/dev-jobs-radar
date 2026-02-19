// ============================================================
// Glassdoor 수집기
// — glassdoor.com 글로벌 채용 & 연봉 데이터 수집
// ============================================================

import type { Collector, RawJobData } from './types'
import { DEFAULT_TIMEOUT } from './collectorUtils'
import type { SourceId } from '@/types/job'

const GLASSDOOR_API = 'https://www.glassdoor.com/api/job-search'

interface GlassdoorJob {
  id: string
  jobTitle: string
  employerName: string
  locationName?: string
  salary?: string
}

export class GlassdoorCollector implements Collector {
  readonly sourceId: SourceId = 'glassdoor'
  readonly sourceName = '글래스도어'

  async collect(): Promise<RawJobData[]> {
    const jobs: RawJobData[] = []
    const now = new Date().toISOString()

    try {
      const res = await fetch(
        `${GLASSDOOR_API}?keyword=software+developer&locT=N&locId=169&p=1`,
        { headers: { Accept: 'application/json' } },
      )

      if (!res.ok) return jobs
      const data = (await res.json()) as { jobListings?: GlassdoorJob[] }
      const list = data.jobListings ?? []

      for (const item of list) {
        jobs.push({
          sourceJobId: `glassdoor-${item.id}`,
          source: this.sourceId,
          title: item.jobTitle,
          companyName: item.employerName,
          url: `https://www.glassdoor.com/job-listing/${item.id}`,
          location: item.locationName,
          salaryText: item.salary,
          collectedAt: now,
        })
      }
    } catch (error) {
      console.error('[GlassdoorCollector] 수집 실패:', error)
    }

    return jobs
  }
}
