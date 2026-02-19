// ============================================================
// 디스콰이엇 (Disquiet) 수집기
// — disquiet.io IT 프로젝트 & 스타트업 채용 수집
// ============================================================

import type { Collector, RawJobData } from './types'
import type { SourceId } from '@/types/job'

const DISQUIET_API = 'https://disquiet.io/api/jobs'

interface DisquietJob {
  id: string
  title: string
  team_name: string
  skills?: string[]
  location?: string
  experience?: string
}

export class DisquietCollector implements Collector {
  readonly sourceId: SourceId = 'disquiet'
  readonly sourceName = '디스콰이엇'

  async collect(): Promise<RawJobData[]> {
    const jobs: RawJobData[] = []
    const now = new Date().toISOString()

    try {
      const res = await fetch(`${DISQUIET_API}?category=developer&limit=30`, {
        headers: { Accept: 'application/json' },
      })

      if (!res.ok) return jobs
      const data = (await res.json()) as { jobs?: DisquietJob[] }
      const list = data.jobs ?? []

      for (const item of list) {
        jobs.push({
          sourceJobId: `disquiet-${item.id}`,
          source: this.sourceId,
          title: item.title,
          companyName: item.team_name,
          url: `https://disquiet.io/jobs/${item.id}`,
          location: item.location,
          experienceText: item.experience,
          tags: item.skills,
          collectedAt: now,
        })
      }
    } catch (error) {
      console.error('[DisquietCollector] 수집 실패:', error)
    }

    return jobs
  }
}
