// ============================================================
// 로켓펀치 (RocketPunch) 수집기
// — rocketpunch.com 스타트업 채용 공고 수집
// ============================================================

import type { Collector, RawJobData } from './types'
import type { SourceId } from '@/types/job'

const ROCKETPUNCH_API = 'https://www.rocketpunch.com/api/hiring'

interface RocketPunchJob {
  id: number
  title: string
  company_name: string
  skills?: string[]
  location?: string
  career?: string
  salary_range?: string
  end_date?: string
}

export class RocketPunchCollector implements Collector {
  readonly sourceId: SourceId = 'rocketpunch'
  readonly sourceName = '로켓펀치'

  async collect(): Promise<RawJobData[]> {
    const jobs: RawJobData[] = []
    const now = new Date().toISOString()

    try {
      for (let page = 1; page <= 3; page++) {
        const res = await fetch(`${ROCKETPUNCH_API}?page=${page}&job_category=1`, {
          headers: {
            Accept: 'application/json',
            'Accept-Language': 'ko',
          },
        })

        if (!res.ok) break
        const data = (await res.json()) as { data?: RocketPunchJob[] }
        const list = data.data ?? []
        if (list.length === 0) break

        for (const item of list) {
          jobs.push({
            sourceJobId: `rocketpunch-${item.id}`,
            source: this.sourceId,
            title: item.title,
            companyName: item.company_name,
            url: `https://www.rocketpunch.com/jobs/${item.id}`,
            location: item.location,
            experienceText: item.career,
            salaryText: item.salary_range,
            deadline: item.end_date,
            tags: item.skills,
            collectedAt: now,
          })
        }
      }
    } catch (error) {
      console.error('[RocketPunchCollector] 수집 실패:', error)
    }

    return jobs
  }
}
