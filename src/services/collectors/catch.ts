// ============================================================
// 캐치 (Catch) 수집기
// — catch.co.kr 채용 공고 수집
// ============================================================

import type { Collector, RawJobData } from './types'
import type { SourceId } from '@/types/job'

const CATCH_API = 'https://www.catch.co.kr/api/recruit/list'

interface CatchJob {
  idx: number
  title: string
  companyName: string
  location?: string
  career?: string
  salary?: string
  deadline?: string
}

export class CatchCollector implements Collector {
  readonly sourceId: SourceId = 'catch'
  readonly sourceName = '캐치'

  async collect(): Promise<RawJobData[]> {
    const jobs: RawJobData[] = []
    const now = new Date().toISOString()

    try {
      const res = await fetch(`${CATCH_API}?category=IT&sort=recent&page=1&size=30`, {
        headers: { Accept: 'application/json' },
      })

      if (!res.ok) return jobs
      const data = (await res.json()) as { list?: CatchJob[] }
      const list = data.list ?? []

      for (const item of list) {
        jobs.push({
          sourceJobId: `catch-${item.idx}`,
          source: this.sourceId,
          title: item.title,
          companyName: item.companyName,
          url: `https://www.catch.co.kr/Comp/Recruit/${item.idx}`,
          location: item.location,
          experienceText: item.career,
          salaryText: item.salary,
          deadline: item.deadline,
          collectedAt: now,
        })
      }
    } catch (error) {
      console.error('[CatchCollector] 수집 실패:', error)
    }

    return jobs
  }
}
