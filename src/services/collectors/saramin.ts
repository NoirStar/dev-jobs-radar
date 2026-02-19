// ============================================================
// 사람인 (Saramin) 수집기
// — saramin.co.kr 채용 공고를 수집
// ============================================================

import type { Collector, RawJobData } from './types'
import type { SourceId } from '@/types/job'

const SARAMIN_API = 'https://oapi.saramin.co.kr/recruit'

interface SaraminApiResponse {
  jobs: {
    count: number
    start: number
    total: string
    job: SaraminJob[]
  }
}

interface SaraminJob {
  id: string
  url: string
  active: number
  company: {
    detail: {
      name: string
      href: string
    }
  }
  position: {
    title: string
    location: { name?: string }
    'job-type': { name?: string }
    'job-code'?: { name?: string }
    'experience-level': { name?: string; code?: number }
    'required-education-level'?: { name?: string }
    industry?: { name?: string }
  }
  salary?: string
  'opening-timestamp'?: string
  'expiration-timestamp'?: string
  'close-type'?: { name?: string }
  keyword?: string
}

export class SaraminCollector implements Collector {
  readonly sourceId: SourceId = 'saramin'
  readonly sourceName = '사람인'

  private apiKey: string

  constructor(apiKey?: string) {
    this.apiKey = apiKey ?? process.env.SARAMIN_API_KEY ?? ''
  }

  async collect(): Promise<RawJobData[]> {
    const jobs: RawJobData[] = []
    const now = new Date().toISOString()

    try {
      for (let start = 0; start < 3; start++) {
        const params = new URLSearchParams({
          access_key: this.apiKey,
          job_type: 'IT개발·데이터',
          sort: 'pd', // 최신순
          start: String(start),
          count: '20',
        })

        const res = await fetch(`${SARAMIN_API}?${params}`, {
          headers: { Accept: 'application/json' },
        })

        if (!res.ok) break

        const data: SaraminApiResponse = await res.json()

        for (const job of data.jobs.job) {
          const tags = job.keyword
            ? job.keyword.split(',').map((k) => k.trim()).filter(Boolean)
            : []

          jobs.push({
            sourceJobId: job.id,
            source: this.sourceId,
            title: job.position.title,
            companyName: job.company.detail.name,
            url: job.url,
            location: job.position.location?.name ?? '',
            experienceText: job.position['experience-level']?.name ?? '',
            salaryText: job.salary,
            tags,
            deadline: job['expiration-timestamp']
              ? new Date(Number(job['expiration-timestamp']) * 1000).toISOString().split('T')[0]
              : undefined,
            collectedAt: now,
          })
        }

        if (data.jobs.job.length < 20) break
      }
    } catch (error) {
      console.error(`[SaraminCollector] 수집 실패:`, error)
    }

    return jobs
  }
}
