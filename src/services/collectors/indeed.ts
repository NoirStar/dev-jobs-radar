// ============================================================
// 인디드 코리아 (Indeed Korea) 수집기
// — kr.indeed.com 채용 공고 수집
// ============================================================

import type { Collector, RawJobData } from './types'
import type { SourceId } from '@/types/job'

const INDEED_BASE = 'https://kr.indeed.com'

interface IndeedJob {
  jk: string
  title: string
  company: string
  location?: string
  salary?: string
  snippet?: string
  date?: string
}

export class IndeedCollector implements Collector {
  readonly sourceId: SourceId = 'indeed'
  readonly sourceName = '인디드 코리아'

  async collect(): Promise<RawJobData[]> {
    const jobs: RawJobData[] = []
    const now = new Date().toISOString()

    try {
      const queries = ['프론트엔드+개발자', '백엔드+개발자', 'DevOps+엔지니어']

      for (const q of queries) {
        const res = await fetch(
          `${INDEED_BASE}/jobs?q=${encodeURIComponent(q)}&l=대한민국&sort=date&limit=20`,
          {
            headers: {
              Accept: 'text/html',
              'Accept-Language': 'ko',
              'User-Agent': 'DevJobsRadar/1.0',
            },
          },
        )

        if (!res.ok) continue
        const html = await res.text()
        const parsed = this.parseJobCards(html)

        for (const item of parsed) {
          jobs.push({
            sourceJobId: `indeed-${item.jk}`,
            source: this.sourceId,
            title: item.title,
            companyName: item.company,
            url: `${INDEED_BASE}/viewjob?jk=${item.jk}`,
            location: item.location,
            salaryText: item.salary,
            description: item.snippet,
            collectedAt: now,
          })
        }
      }
    } catch (error) {
      console.error('[IndeedCollector] 수집 실패:', error)
    }

    return jobs
  }

  private parseJobCards(html: string): IndeedJob[] {
    const results: IndeedJob[] = []
    // 간이 파싱: data-jk 속성에서 공고 ID 추출
    const pattern = /data-jk="([^"]+)"[^>]*>[\s\S]*?class="jobTitle[^"]*"[^>]*>[\s\S]*?<span[^>]*>([^<]+)<\/span>/g
    let match: RegExpExecArray | null
    while ((match = pattern.exec(html)) !== null) {
      results.push({
        jk: match[1],
        title: match[2].trim(),
        company: '',
      })
    }
    return results
  }
}
