// ============================================================
// 프로그래머스 (Programmers) 수집기
// — career.programmers.co.kr 채용 공고를 수집
// ============================================================

import type { Collector, RawJobData } from './types'
import type { SourceId } from '@/types/job'

const PROGRAMMERS_API = 'https://career.programmers.co.kr/api/job_positions'

interface ProgrammersApiResponse {
  jobPositions: ProgrammersJob[]
  totalCount: number
}

interface ProgrammersJob {
  id: number
  title: string
  companyName: string
  address?: string
  career?: string
  minCareer?: number
  maxCareer?: number
  technicalTags?: { name: string }[]
  endAt?: string
  updatedAt?: string
  status?: string
}

export class ProgrammersCollector implements Collector {
  readonly sourceId: SourceId = 'programmers'
  readonly sourceName = '프로그래머스'

  async collect(): Promise<RawJobData[]> {
    const jobs: RawJobData[] = []
    const now = new Date().toISOString()

    try {
      for (let page = 1; page <= 3; page++) {
        const res = await fetch(
          `${PROGRAMMERS_API}?page=${page}&order=recent&min_career=-1&max_career=20`,
          {
            headers: {
              'Accept': 'application/json',
              'User-Agent': 'Mozilla/5.0 (compatible; DevJobsRadar/1.0)',
            },
          },
        )

        if (!res.ok) break

        const data: ProgrammersApiResponse = await res.json()

        for (const job of data.jobPositions) {
          const tags = job.technicalTags?.map((t) => t.name) ?? []

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
            url: `https://career.programmers.co.kr/job_positions/${job.id}`,
            location: job.address ?? '',
            experienceText,
            tags,
            deadline: job.endAt ? job.endAt.split('T')[0] : undefined,
            collectedAt: now,
          })
        }

        if (data.jobPositions.length < 20) break
      }
    } catch (error) {
      console.error(`[ProgrammersCollector] 수집 실패:`, error)
    }

    return jobs
  }
}
