// ============================================================
// Wantedly Japan 수집기
// — wantedly.com 일본 IT 채용 수집
// ============================================================

import type { Collector, RawJobData } from './types'
import { DEFAULT_TIMEOUT, deduplicateJobs } from './collectorUtils'
import type { SourceId } from '@/types/job'

const WANTEDLY_API = 'https://www.wantedly.com/api/v2/projects'

interface WantedlyProject {
  id: number
  title: string
  company: { name: string }
  tags?: string[]
  location?: string
  salary?: { min?: number; max?: number }
  published_at?: string
  hiring?: boolean
}

interface WantedlyResponse {
  data: WantedlyProject[]
  total_count: number
}

export class WantedlyJPCollector implements Collector {
  readonly sourceId: SourceId = 'wantedly_jp'
  readonly sourceName = 'Wantedly'

  async collect(): Promise<RawJobData[]> {
    const jobs: RawJobData[] = []
    const now = new Date().toISOString()

    const keywords = ['エンジニア', 'フロントエンド', 'バックエンド', 'フルスタック']

    try {
      for (const kw of keywords) {
        const res = await fetch(
          `${WANTEDLY_API}?q=${encodeURIComponent(kw)}&page=1&per_page=20&hiring=true`,
          { headers: { Accept: 'application/json' }, signal: AbortSignal.timeout(DEFAULT_TIMEOUT) },
        )

        if (!res.ok) continue
        const data = (await res.json()) as WantedlyResponse

        for (const item of data.data ?? []) {
          const salaryText =
            item.salary?.min != null && item.salary?.max != null
              ? `¥${item.salary.min.toLocaleString()}~¥${item.salary.max.toLocaleString()}`
              : undefined

          jobs.push({
            sourceJobId: `wantedly-${item.id}`,
            source: this.sourceId,
            title: item.title,
            companyName: item.company.name,
            url: `https://www.wantedly.com/projects/${item.id}`,
            location: item.location ?? '東京',
            tags: item.tags,
            salaryText,
            postedAt: item.published_at,
            collectedAt: now,
          })
        }
      }
    } catch (error) {
      console.error('[WantedlyJPCollector] 수집 실패:', error)
    }

    return deduplicateJobs(jobs)
  }
}
