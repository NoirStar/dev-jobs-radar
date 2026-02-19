// ============================================================
// 원티드 (Wanted) 수집기
// — wanted.co.kr 채용 API를 통해 IT 공고 수집
// ============================================================

import type { Collector, RawJobData } from './types'
import type { SourceId } from '@/types/job'

const WANTED_API = 'https://www.wanted.co.kr/api/v4/jobs'

interface WantedApiResponse {
  data: WantedJob[]
  links: { next?: string }
}

interface WantedJob {
  id: number
  position: string
  company: { name: string; industry_name?: string }
  reward: { formatted_total?: string }
  address?: { location?: string; country?: string }
  skill_tags?: { title: string }[]
  due_time?: string | null
  category_tags?: { title: string }[]
}

export class WantedCollector implements Collector {
  readonly sourceId: SourceId = 'wanted'
  readonly sourceName = '원티드'

  async collect(): Promise<RawJobData[]> {
    const jobs: RawJobData[] = []
    const now = new Date().toISOString()

    try {
      // IT/개발 카테고리 공고 수집 (최대 3페이지)
      for (let page = 0; page < 3; page++) {
        const offset = page * 20

        const res = await fetch(
          `${WANTED_API}?country=kr&job_sort=job.latest_order&years=-1&locations=all&limit=20&offset=${offset}&tag_type_ids=518,669,672,678`,
          {
            headers: {
              'Accept': 'application/json',
              'Accept-Language': 'ko',
            },
          },
        )

        if (!res.ok) break

        const data: WantedApiResponse = await res.json()

        for (const job of data.data) {
          jobs.push({
            sourceJobId: String(job.id),
            source: this.sourceId,
            title: job.position,
            companyName: job.company.name,
            url: `https://www.wanted.co.kr/wd/${job.id}`,
            location: job.address?.location ?? '서울',
            tags: job.skill_tags?.map((t) => t.title) ?? [],
            deadline: job.due_time ?? undefined,
            collectedAt: now,
          })
        }

        if (!data.links.next) break
      }
    } catch (error) {
      console.error(`[WantedCollector] 수집 실패:`, error)
    }

    return jobs
  }
}
