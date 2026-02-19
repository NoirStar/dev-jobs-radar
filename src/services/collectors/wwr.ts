// ============================================================
// We Work Remotely 수집기
// — weworkremotely.com 프리미엄 원격 채용 수집
// ============================================================

import type { Collector, RawJobData } from './types'
import { DEFAULT_TIMEOUT } from './collectorUtils'
import type { SourceId } from '@/types/job'

const WWR_API = 'https://weworkremotely.com/api/v1/listings'

interface WWRCategory {
  name: string
  jobs: WWRJob[]
}

interface WWRJob {
  id: number
  title: string
  company_name: string
  category: string
  tags?: string[]
  source_url?: string
  published_at: string
  location_restrictions?: string
}

export class WWRCollector implements Collector {
  readonly sourceId: SourceId = 'wwr'
  readonly sourceName = 'We Work Remotely'

  async collect(): Promise<RawJobData[]> {
    const jobs: RawJobData[] = []
    const now = new Date().toISOString()

    try {
      const res = await fetch(WWR_API, {
        headers: { Accept: 'application/json' }, signal: AbortSignal.timeout(DEFAULT_TIMEOUT),
      })

      if (!res.ok) return jobs
      const categories = (await res.json()) as WWRCategory[]

      for (const cat of categories) {
        for (const item of (cat.jobs ?? []).slice(0, 30)) {
          jobs.push({
            sourceJobId: `wwr-${item.id}`,
            source: this.sourceId,
            title: item.title,
            companyName: item.company_name,
            url:
              item.source_url ??
              `https://weworkremotely.com/remote-jobs/${item.id}`,
            location: item.location_restrictions ?? 'Remote',
            tags: item.tags,
            isRemote: true,
            collectedAt: now,
          })
        }
      }
    } catch (error) {
      console.error('[WWRCollector] 수집 실패:', error)
    }

    return jobs
  }
}
