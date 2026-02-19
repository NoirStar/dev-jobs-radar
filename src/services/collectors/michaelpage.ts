// ============================================================
// Michael Page 수집기
// — michaelpage.co.kr 글로벌 헤드헌팅 수집
// ============================================================

import type { Collector, RawJobData } from './types'
import type { SourceId } from '@/types/job'
import { extractTechTags, COMPANY_CONFIDENTIAL, LOCATION_SEOUL, DEFAULT_TIMEOUT } from './collectorUtils'

const MP_API = 'https://www.michaelpage.co.kr/api/jobs'

interface MPJob {
  id: string
  title: string
  company_name?: string
  location?: string
  discipline?: string
  sub_discipline?: string
  salary_range?: string
  url?: string
  date_posted?: string
  description?: string
}

interface MPResponse {
  data: MPJob[]
  pagination: { total: number; page: number }
}

export class MichaelPageCollector implements Collector {
  readonly sourceId: SourceId = 'michaelpage'
  readonly sourceName = 'Michael Page'

  async collect(): Promise<RawJobData[]> {
    const jobs: RawJobData[] = []
    const now = new Date().toISOString()

    const disciplines = ['technology', 'digital', 'engineering']

    try {
      for (const disc of disciplines) {
        const res = await fetch(
          `${MP_API}?discipline=${disc}&page=1&per_page=20`,
          { headers: { Accept: 'application/json' }, signal: AbortSignal.timeout(DEFAULT_TIMEOUT) },
        )

        if (!res.ok) continue
        const data = (await res.json()) as MPResponse

        for (const item of data.data ?? []) {
          const tags = extractTechTags(item.description ?? '', ['C++', 'Swift', 'Kotlin', 'Flutter', 'Terraform'])

          jobs.push({
            sourceJobId: `mp-${item.id}`,
            source: this.sourceId,
            title: item.title,
            companyName: item.company_name ?? COMPANY_CONFIDENTIAL,
            url: item.url ?? `https://www.michaelpage.co.kr/jobs/${item.id}`,
            location: item.location ?? LOCATION_SEOUL,
            tags: tags.length > 0 ? tags : undefined,
            salaryText: item.salary_range,
            postedAt: item.date_posted,
            collectedAt: now,
          })
        }
      }
    } catch (error) {
      console.error('[MichaelPageCollector] 수집 실패:', error)
    }

    return jobs
  }

}
