// ============================================================
// 워크넷 (WorkNet) 수집기
// — work.go.kr 공공 채용 데이터 API 수집
// ============================================================

import type { Collector, RawJobData } from './types'
import type { SourceId } from '@/types/job'

const WORKNET_API = 'https://openapi.work.go.kr/opi/opi/opia/wantedApi.do'

interface WorkNetJob {
  wantedAuthNo: string
  title: string
  busplaName: string
  workRegion?: string
  career?: string
  sal?: string
  closeDt?: string
  jobsCd?: string
}

export class WorkNetCollector implements Collector {
  readonly sourceId: SourceId = 'worknet'
  readonly sourceName = '워크넷'

  private apiKey: string

  constructor(apiKey?: string) {
    this.apiKey = apiKey ?? process.env.WORKNET_API_KEY ?? ''
  }

  async collect(): Promise<RawJobData[]> {
    const jobs: RawJobData[] = []
    const now = new Date().toISOString()

    try {
      const params = new URLSearchParams({
        authKey: this.apiKey,
        callTp: 'L',
        returnType: 'JSON',
        startPage: '1',
        display: '30',
        occupation: '024', // IT·개발
      })

      const res = await fetch(`${WORKNET_API}?${params}`, {
        headers: { Accept: 'application/json' },
      })

      if (!res.ok) return jobs
      const data = (await res.json()) as { wantedRoot?: { wanted?: WorkNetJob[] } }
      const list = data.wantedRoot?.wanted ?? []

      for (const item of list) {
        jobs.push({
          sourceJobId: `worknet-${item.wantedAuthNo}`,
          source: this.sourceId,
          title: item.title,
          companyName: item.busplaName,
          url: `https://www.work.go.kr/empInfo/empInfoSrch/detail/empDetailAuthView.do?wantedAuthNo=${item.wantedAuthNo}`,
          location: item.workRegion,
          experienceText: item.career,
          salaryText: item.sal,
          deadline: item.closeDt,
          collectedAt: now,
        })
      }
    } catch (error) {
      console.error('[WorkNetCollector] 수집 실패:', error)
    }

    return jobs
  }
}
