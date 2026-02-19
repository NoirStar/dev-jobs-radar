// ============================================================
// OKKY 수집기
// — okky.kr 개발자 커뮤니티 채용 게시판 수집
// ============================================================

import type { Collector, RawJobData } from './types'
import type { SourceId } from '@/types/job'

const OKKY_API = 'https://okky.kr/api/articles'

interface OkkyJob {
  id: number
  title: string
  content?: string
  tags?: string[]
  dateCreated?: string
  author?: { name?: string }
}

export class OkkyCollector implements Collector {
  readonly sourceId: SourceId = 'okky'
  readonly sourceName = 'OKKY'

  async collect(): Promise<RawJobData[]> {
    const jobs: RawJobData[] = []
    const now = new Date().toISOString()

    try {
      const res = await fetch(`${OKKY_API}?board=jobs&sort=newest&size=30`, {
        headers: { Accept: 'application/json' },
      })

      if (!res.ok) return jobs
      const data = (await res.json()) as { content?: OkkyJob[] }
      const list = data.content ?? []

      for (const item of list) {
        jobs.push({
          sourceJobId: `okky-${item.id}`,
          source: this.sourceId,
          title: item.title,
          companyName: item.author?.name ?? '미상',
          url: `https://okky.kr/articles/${item.id}`,
          description: item.content,
          tags: item.tags,
          collectedAt: now,
        })
      }
    } catch (error) {
      console.error('[OkkyCollector] 수집 실패:', error)
    }

    return jobs
  }
}
