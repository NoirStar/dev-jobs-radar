// ============================================================
// Stack Overflow Jobs 수집기
// — stackoverflow.com/jobs 개발자 채용 수집
// ============================================================

import type { Collector, RawJobData } from './types'
import { DEFAULT_TIMEOUT } from './collectorUtils'
import type { SourceId } from '@/types/job'

const SO_JOBS_URL = 'https://stackoverflow.com/jobs/feed'

export class StackOverflowCollector implements Collector {
  readonly sourceId: SourceId = 'stackoverflow'
  readonly sourceName = 'Stack Overflow Jobs'

  async collect(): Promise<RawJobData[]> {
    const jobs: RawJobData[] = []
    const now = new Date().toISOString()

    try {
      const res = await fetch(SO_JOBS_URL, {
        headers: { Accept: 'application/xml' }, signal: AbortSignal.timeout(DEFAULT_TIMEOUT),
      })

      if (!res.ok) return jobs
      const xml = await res.text()

      const items = xml.split('<item>').slice(1, 51)

      for (const item of items) {
        const title = this.extractTag(item, 'title')
        const link = this.extractTag(item, 'link')
        const company = this.extractTag(item, 'author')
        const location = this.extractTag(item, 'location')
        const pubDate = this.extractTag(item, 'pubDate')

        const categories: string[] = []
        const catMatches = item.matchAll(/<category><!\[CDATA\[(.+?)\]\]><\/category>/g)
        for (const m of catMatches) categories.push(m[1])

        if (!title || !link) continue

        jobs.push({
          sourceJobId: `so-${link.split('/').pop() ?? Date.now()}`,
          source: this.sourceId,
          title,
          companyName: company ?? 'Unknown',
          url: link,
          location: location ?? 'Remote',
          tags: categories.length > 0 ? categories : undefined,
          postedAt: pubDate ? new Date(pubDate).toISOString() : undefined,
          collectedAt: now,
        })
      }
    } catch (error) {
      console.error('[StackOverflowCollector] 수집 실패:', error)
    }

    return jobs
  }

  private extractTag(xml: string, tag: string): string | undefined {
    const regex = new RegExp(`<${tag}>(?:<!\\[CDATA\\[)?(.+?)(?:\\]\\]>)?</${tag}>`)
    const match = xml.match(regex)
    return match?.[1]?.trim()
  }
}
