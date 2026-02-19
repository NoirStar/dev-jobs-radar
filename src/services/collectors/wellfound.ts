// ============================================================
// Wellfound (구 AngelList) 수집기
// — wellfound.com 스타트업 채용 수집
// ============================================================

import type { Collector, RawJobData } from './types'
import { DEFAULT_TIMEOUT } from './collectorUtils'
import type { SourceId } from '@/types/job'

const WELLFOUND_API = 'https://wellfound.com/api/v2/jobs'

interface WellfoundJob {
  id: number
  title: string
  startup: { name: string }
  tags?: { name: string }[]
  locations?: { display_name: string }[]
  compensation?: string
  remote?: boolean
}

export class WellfoundCollector implements Collector {
  readonly sourceId: SourceId = 'wellfound'
  readonly sourceName = '웰파운드'

  async collect(): Promise<RawJobData[]> {
    const jobs: RawJobData[] = []
    const now = new Date().toISOString()

    try {
      const res = await fetch(`${WELLFOUND_API}?filter=Software+Engineer&page=1`, {
        headers: { Accept: 'application/json' }, signal: AbortSignal.timeout(DEFAULT_TIMEOUT),
      })

      if (!res.ok) return jobs
      const data = (await res.json()) as { jobs?: WellfoundJob[] }
      const list = data.jobs ?? []

      for (const item of list) {
        jobs.push({
          sourceJobId: `wellfound-${item.id}`,
          source: this.sourceId,
          title: item.title,
          companyName: item.startup.name,
          url: `https://wellfound.com/jobs/${item.id}`,
          location: item.locations?.[0]?.display_name,
          tags: item.tags?.map((t) => t.name),
          salaryText: item.compensation,
          isRemote: item.remote,
          collectedAt: now,
        })
      }
    } catch (error) {
      console.error('[WellfoundCollector] 수집 실패:', error)
    }

    return jobs
  }
}
