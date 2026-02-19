// ============================================================
// 잡코리아 (JobKorea) 수집기
// — jobkorea.co.kr 채용 공고를 수집
// ============================================================

import type { Collector, RawJobData } from './types'
import type { SourceId } from '@/types/job'

const JOBKOREA_SEARCH_URL = 'https://www.jobkorea.co.kr/recruit/joblist'

interface JobKoreaListItem {
  id: string
  title: string
  company: string
  location: string
  experience: string
  salary: string
  skills: string[]
  deadline: string
  url: string
}

export class JobKoreaCollector implements Collector {
  readonly sourceId: SourceId = 'jobkorea'
  readonly sourceName = '잡코리아'

  async collect(): Promise<RawJobData[]> {
    const jobs: RawJobData[] = []
    const now = new Date().toISOString()

    try {
      // 잡코리아 IT 직종 카테고리 검색
      for (let page = 1; page <= 3; page++) {
        const params = new URLSearchParams({
          menucode: '3', // IT·인터넷
          stext: '',
          page: String(page),
        })

        const res = await fetch(`${JOBKOREA_SEARCH_URL}?${params}`, {
          headers: {
            'User-Agent': 'Mozilla/5.0 (compatible; DevJobsRadar/1.0)',
            'Accept': 'text/html',
          },
        })

        if (!res.ok) break

        const html = await res.text()
        const parsed = parseJobKoreaHtml(html)

        for (const item of parsed) {
          jobs.push({
            sourceJobId: item.id,
            source: this.sourceId,
            title: item.title,
            companyName: item.company,
            url: item.url,
            location: item.location,
            experienceText: item.experience,
            salaryText: item.salary || undefined,
            tags: item.skills,
            deadline: item.deadline || undefined,
            collectedAt: now,
          })
        }

        if (parsed.length < 20) break
      }
    } catch (error) {
      console.error(`[JobKoreaCollector] 수집 실패:`, error)
    }

    return jobs
  }
}

/**
 * 잡코리아 HTML을 파싱하여 채용공고 목록을 추출합니다.
 * 실제 프로덕션에서는 cheerio를 사용하며, 여기서는 정규식 기반 파싱입니다.
 */
function parseJobKoreaHtml(html: string): JobKoreaListItem[] {
  const items: JobKoreaListItem[] = []

  // 공고 블록 추출 (class="list-post" 기반)
  const postPattern = /class="list-post"[\s\S]*?<a[^>]*href="([^"]*)"[^>]*>[\s\S]*?<span[^>]*class="str-tit"[^>]*>([\s\S]*?)<\/span>[\s\S]*?<span[^>]*class="str-info"[^>]*>([\s\S]*?)<\/span>/gi

  let match
  while ((match = postPattern.exec(html)) !== null) {
    const url = match[1].startsWith('http')
      ? match[1]
      : `https://www.jobkorea.co.kr${match[1]}`

    const title = stripHtml(match[2]).trim()
    const info = stripHtml(match[3]).trim()

    // ID 추출
    const idMatch = url.match(/(\d+)/)
    const id = idMatch ? idMatch[1] : `jk-${Date.now()}-${items.length}`

    // 정보에서 회사/지역/경력 분리
    const parts = info.split('|').map((s) => s.trim())

    items.push({
      id,
      title,
      company: parts[0] || '',
      location: parts[1] || '',
      experience: parts[2] || '',
      salary: parts[3] || '',
      skills: [],
      deadline: '',
      url,
    })
  }

  return items
}

function stripHtml(html: string): string {
  return html.replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').trim()
}
