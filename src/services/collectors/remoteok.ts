// ============================================================
// Remote OK 수집기
// — remoteok.com 원격 근무 IT 채용 수집
// ============================================================

import type { Collector, RawJobData } from './types'
import { DEFAULT_TIMEOUT } from './collectorUtils'
import type { SourceId } from '@/types/job'

const REMOTEOK_API = 'https://remoteok.com/api'

interface RemoteOKJob {
  id: string
  position: string
  company: string
  tags?: string[]
  location?: string
  salary_min?: number
  salary_max?: number
  url: string
  date: string
}

export class RemoteOKCollector implements Collector {
  readonly sourceId: SourceId = 'remoteok'
  readonly sourceName = 'Remote OK'

  async collect(): Promise<RawJobData[]> {
    const jobs: RawJobData[] = []
    const now = new Date().toISOString()

    try {
      const res = await fetch(REMOTEOK_API, {
        headers: { Accept: 'application/json' }, signal: AbortSignal.timeout(DEFAULT_TIMEOUT),
      })

      if (!res.ok) return jobs
      const data = (await res.json()) as RemoteOKJob[]
      // 첫 요소는 legal notice → 스킵
      const list = Array.isArray(data) ? data.slice(1) : []

      for (const item of list.slice(0, 50)) {
        jobs.push({
          sourceJobId: `remoteok-${item.id}`,
          source: this.sourceId,
          title: item.position,
          companyName: item.company,
          url: item.url || `https://remoteok.com/remote-jobs/${item.id}`,
          location: item.location ?? 'Remote',
          tags: item.tags,
          salaryText:
            item.salary_min && item.salary_max
              ? `$${item.salary_min.toLocaleString()}~$${item.salary_max.toLocaleString()}`
              : undefined,
          isRemote: true,
          collectedAt: now,
        })
      }
    } catch (error) {
      console.error('[RemoteOKCollector] 수집 실패:', error)
    }

    return jobs
  }
}
