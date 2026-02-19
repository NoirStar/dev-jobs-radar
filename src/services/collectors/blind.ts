// ============================================================
// 블라인드 (Blind) 수집기
// — teamblind.com 채용 정보 수집
// ============================================================

import type { Collector, RawJobData } from './types'
import type { SourceId } from '@/types/job'

const BLIND_API = 'https://www.teamblind.com/api/v2/jobs'

interface BlindJob {
  id: string
  title: string
  companyName: string
  location?: string
  experience?: string
  tags?: string[]
}

export class BlindCollector implements Collector {
  readonly sourceId: SourceId = 'blind'
  readonly sourceName = '블라인드'

  async collect(): Promise<RawJobData[]> {
    const jobs: RawJobData[] = []
    const now = new Date().toISOString()

    try {
      const res = await fetch(`${BLIND_API}?country=KR&category=engineering&limit=30`, {
        headers: {
          Accept: 'application/json',
          'Accept-Language': 'ko',
        },
      })

      if (!res.ok) return jobs
      const data = (await res.json()) as { jobs?: BlindJob[] }
      const list = data.jobs ?? []

      for (const item of list) {
        jobs.push({
          sourceJobId: `blind-${item.id}`,
          source: this.sourceId,
          title: item.title,
          companyName: item.companyName,
          url: `https://www.teamblind.com/jobs/${item.id}`,
          location: item.location,
          experienceText: item.experience,
          tags: item.tags,
          collectedAt: now,
        })
      }
    } catch (error) {
      console.error('[BlindCollector] 수집 실패:', error)
    }

    return jobs
  }
}
