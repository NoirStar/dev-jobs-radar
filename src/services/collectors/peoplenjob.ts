// ============================================================
// 피플앤잡 (PeopleNJob) 수집기
// — peoplenjob.com 채용 정보 수집
// ============================================================

import type { Collector, RawJobData } from './types'
import type { SourceId } from '@/types/job'

const PNJ_API = 'https://www.peoplenjob.com/api/jobs'

interface PeopleNJobItem {
  id: string
  title: string
  company: string
  location?: string
  career?: string
  salary?: string
  skills?: string[]
  deadline?: string
}

export class PeopleNJobCollector implements Collector {
  readonly sourceId: SourceId = 'peoplenjob'
  readonly sourceName = '피플앤잡'

  async collect(): Promise<RawJobData[]> {
    const jobs: RawJobData[] = []
    const now = new Date().toISOString()

    try {
      const res = await fetch(`${PNJ_API}?category=IT&page=1&size=30`, {
        headers: { Accept: 'application/json' },
      })

      if (!res.ok) return jobs
      const data = (await res.json()) as { items?: PeopleNJobItem[] }
      const list = data.items ?? []

      for (const item of list) {
        jobs.push({
          sourceJobId: `peoplenjob-${item.id}`,
          source: this.sourceId,
          title: item.title,
          companyName: item.company,
          url: `https://www.peoplenjob.com/jobs/${item.id}`,
          location: item.location,
          experienceText: item.career,
          salaryText: item.salary,
          tags: item.skills,
          deadline: item.deadline,
          collectedAt: now,
        })
      }
    } catch (error) {
      console.error('[PeopleNJobCollector] 수집 실패:', error)
    }

    return jobs
  }
}
