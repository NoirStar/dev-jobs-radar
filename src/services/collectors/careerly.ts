// ============================================================
// 커리어리 (Careerly) 수집기
// — careerly.co.kr 개발자 네트워크 채용 정보 수집
// ============================================================

import type { Collector, RawJobData } from './types'
import type { SourceId } from '@/types/job'

const CAREERLY_API = 'https://careerly.co.kr/api/jobs'

interface CareerlyJob {
  id: string
  title: string
  company_name: string
  tags?: string[]
  location?: string
  career?: string
}

export class CareerlyCollector implements Collector {
  readonly sourceId: SourceId = 'careerly'
  readonly sourceName = '커리어리'

  async collect(): Promise<RawJobData[]> {
    const jobs: RawJobData[] = []
    const now = new Date().toISOString()

    try {
      const res = await fetch(`${CAREERLY_API}?type=developer&page=1&size=30`, {
        headers: { Accept: 'application/json' },
      })

      if (!res.ok) return jobs
      const data = (await res.json()) as { data?: CareerlyJob[] }
      const list = data.data ?? []

      for (const item of list) {
        jobs.push({
          sourceJobId: `careerly-${item.id}`,
          source: this.sourceId,
          title: item.title,
          companyName: item.company_name,
          url: `https://careerly.co.kr/jobs/${item.id}`,
          location: item.location,
          experienceText: item.career,
          tags: item.tags,
          collectedAt: now,
        })
      }
    } catch (error) {
      console.error('[CareerlyCollector] 수집 실패:', error)
    }

    return jobs
  }
}
