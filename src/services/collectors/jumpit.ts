// ============================================================
// 점핏 (Jumpit) 수집기
// — jumpit.co.kr 채용 공고를 수집
// ============================================================

import type { Collector, RawJobData } from './types'
import type { SourceId } from '@/types/job'

const JUMPIT_API = 'https://api.jumpit.co.kr/api/positions'

interface JumpitApiResponse {
  result: {
    positions: JumpitJob[]
    totalCount: number
  }
}

interface JumpitJob {
  id: number
  title: string
  companyName: string
  logo?: string
  scrapCount?: number
  viewCount?: number
  techStacks?: string[]
  locations?: string[]
  career?: string
  minCareer?: number
  maxCareer?: number
  closedAt?: string
  celebration?: number
}

export class JumpitCollector implements Collector {
  readonly sourceId: SourceId = 'jumpit'
  readonly sourceName = '점핏'

  async collect(): Promise<RawJobData[]> {
    const jobs: RawJobData[] = []
    const now = new Date().toISOString()

    try {
      for (let page = 1; page <= 3; page++) {
        const res = await fetch(
          `${JUMPIT_API}?page=${page}&sort=rsp_rate&jobCategory=1`,
          {
            headers: {
              'Accept': 'application/json',
              'User-Agent': 'Mozilla/5.0 (compatible; DevJobsRadar/1.0)',
            },
          },
        )

        if (!res.ok) break

        const data: JumpitApiResponse = await res.json()

        for (const job of data.result.positions) {
          let experienceText = '경력무관'
          if (job.career) {
            experienceText = job.career
          } else if (job.minCareer != null) {
            experienceText = job.maxCareer
              ? `${job.minCareer}~${job.maxCareer}년`
              : `${job.minCareer}년 이상`
          }

          jobs.push({
            sourceJobId: String(job.id),
            source: this.sourceId,
            title: job.title,
            companyName: job.companyName,
            url: `https://www.jumpit.co.kr/position/${job.id}`,
            location: job.locations?.join(', ') ?? '',
            experienceText,
            tags: job.techStacks ?? [],
            deadline: job.closedAt ? job.closedAt.split('T')[0] : undefined,
            collectedAt: now,
          })
        }

        if (data.result.positions.length < 16) break
      }
    } catch (error) {
      console.error(`[JumpitCollector] 수집 실패:`, error)
    }

    return jobs
  }
}
