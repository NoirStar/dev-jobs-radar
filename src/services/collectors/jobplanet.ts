// ============================================================
// 잡플래닛 (JobPlanet) 수집기
// — jobplanet.co.kr 채용 정보, 기업 리뷰 수집
// ============================================================

import type { Collector, RawJobData } from './types'
import type { SourceId } from '@/types/job'

const JOBPLANET_API = 'https://www.jobplanet.co.kr/api/v2/job_postings'

interface JobPlanetJob {
  id: number
  title: string
  company_name: string
  location?: string
  career?: string
  salary?: string
  skills?: string[]
  deadline?: string
}

export class JobPlanetCollector implements Collector {
  readonly sourceId: SourceId = 'jobplanet'
  readonly sourceName = '잡플래닛'

  async collect(): Promise<RawJobData[]> {
    const jobs: RawJobData[] = []
    const now = new Date().toISOString()

    try {
      for (let page = 1; page <= 3; page++) {
        const res = await fetch(
          `${JOBPLANET_API}?page=${page}&occupation_level2=518&order=recent`,
          {
            headers: { Accept: 'application/json' },
          },
        )

        if (!res.ok) break
        const data = (await res.json()) as { data?: JobPlanetJob[] }
        const list = data.data ?? []
        if (list.length === 0) break

        for (const item of list) {
          jobs.push({
            sourceJobId: `jobplanet-${item.id}`,
            source: this.sourceId,
            title: item.title,
            companyName: item.company_name,
            url: `https://www.jobplanet.co.kr/job/search?posting_ids%5B%5D=${item.id}`,
            location: item.location,
            experienceText: item.career,
            salaryText: item.salary,
            tags: item.skills,
            deadline: item.deadline,
            collectedAt: now,
          })
        }
      }
    } catch (error) {
      console.error('[JobPlanetCollector] 수집 실패:', error)
    }

    return jobs
  }
}
