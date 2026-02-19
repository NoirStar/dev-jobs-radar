// ============================================================
// 랠릿 (Rallit) 수집기
// — rallit.com 채용 API를 통해 개발자 공고 수집
// ============================================================

import type { Collector, RawJobData } from './types'
import type { SourceId } from '@/types/job'

const RALLIT_API = 'https://www.rallit.com/api/positions'

interface RallitJob {
  id: number
  title: string
  companyName: string
  skills: string[]
  location?: string
  career?: string
  salary?: string
  endDate?: string
}

export class RallitCollector implements Collector {
  readonly sourceId: SourceId = 'rallit'
  readonly sourceName = '랠릿'

  async collect(): Promise<RawJobData[]> {
    const jobs: RawJobData[] = []
    const now = new Date().toISOString()

    try {
      for (let page = 1; page <= 3; page++) {
        const res = await fetch(`${RALLIT_API}?page=${page}&size=20&category=dev`, {
          headers: { Accept: 'application/json' },
        })

        if (!res.ok) break
        const data = (await res.json()) as { data?: RallitJob[] }
        const list = data.data ?? []
        if (list.length === 0) break

        for (const item of list) {
          jobs.push({
            sourceJobId: `rallit-${item.id}`,
            source: this.sourceId,
            title: item.title,
            companyName: item.companyName,
            url: `https://www.rallit.com/positions/${item.id}`,
            location: item.location,
            experienceText: item.career,
            salaryText: item.salary,
            deadline: item.endDate,
            tags: item.skills,
            collectedAt: now,
          })
        }
      }
    } catch (error) {
      console.error('[RallitCollector] 수집 실패:', error)
    }

    return jobs
  }
}
