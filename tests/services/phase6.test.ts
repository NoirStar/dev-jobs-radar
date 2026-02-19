// ============================================================
// Phase 6 — 글로벌 수집기 + 기업 직접 + 커스텀 URL 테스트
// ============================================================

import { describe, it, expect, vi, beforeEach } from 'vitest'

// Tier 3 수집기
import { LinkedInCollector } from '@/services/collectors/linkedin'
import { GlassdoorCollector } from '@/services/collectors/glassdoor'
import { WellfoundCollector } from '@/services/collectors/wellfound'
import { RemoteOKCollector } from '@/services/collectors/remoteok'
import { WWRCollector } from '@/services/collectors/wwr'
import { StackOverflowCollector } from '@/services/collectors/stackoverflow'
import { HiredCollector } from '@/services/collectors/hired'
import { GreenJapanCollector } from '@/services/collectors/green_japan'
import { WantedlyJPCollector } from '@/services/collectors/wantedly_jp'
import { RobertWaltersCollector } from '@/services/collectors/robertwalters'
import { MichaelPageCollector } from '@/services/collectors/michaelpage'

// Tier 4
import {
  CompanyDirectCollector,
  createCompanyCollector,
  createIndustryCollector,
  platformCollector,
  fintechCollector,
  ecommerceCollector,
  gamingCollector,
  enterpriseCollector,
  telecomCollector,
} from '@/services/collectors/companyDirect'

// Custom URL
import {
  CustomUrlCollector,
  createMonitorUrl,
  validateMonitorUrl,
  type CustomMonitorUrl,
} from '@/services/collectors/customUrl'

import type { Collector } from '@/services/collectors/types'

// ──────────────────────────────────────────
// Tier 3: 글로벌 수집기 인터페이스 테스트
// ──────────────────────────────────────────

const tier3Collectors: { name: string; cls: new () => Collector }[] = [
  { name: 'LinkedIn', cls: LinkedInCollector },
  { name: 'Glassdoor', cls: GlassdoorCollector },
  { name: 'Wellfound', cls: WellfoundCollector },
  { name: 'RemoteOK', cls: RemoteOKCollector },
  { name: 'WWR', cls: WWRCollector },
  { name: 'StackOverflow', cls: StackOverflowCollector },
  { name: 'Hired', cls: HiredCollector },
  { name: 'GreenJapan', cls: GreenJapanCollector },
  { name: 'WantedlyJP', cls: WantedlyJPCollector },
  { name: 'RobertWalters', cls: RobertWaltersCollector },
  { name: 'MichaelPage', cls: MichaelPageCollector },
]

describe('Tier 3 — 글로벌 수집기', () => {
  beforeEach(() => {
    vi.restoreAllMocks()
  })

  for (const { name, cls } of tier3Collectors) {
    describe(name, () => {
      it('Collector 인터페이스를 구현한다', () => {
        const c = new cls()
        expect(c.sourceId).toBeDefined()
        expect(typeof c.sourceId).toBe('string')
        expect(c.sourceName).toBeDefined()
        expect(typeof c.sourceName).toBe('string')
        expect(typeof c.collect).toBe('function')
      })

      it('collect()가 Promise를 반환한다', () => {
        const c = new cls()
        vi.spyOn(globalThis, 'fetch').mockResolvedValueOnce(
          new Response('[]', { status: 200 }),
        )
        const result = c.collect()
        expect(result).toBeInstanceOf(Promise)
      })

      it('네트워크 실패 시 빈 배열을 반환한다', async () => {
        const c = new cls()
        vi.spyOn(globalThis, 'fetch').mockRejectedValueOnce(
          new Error('Network error'),
        )
        const result = await c.collect()
        expect(Array.isArray(result)).toBe(true)
        expect(result.length).toBe(0)
      })

      it('HTTP 오류 시 빈 배열을 반환한다', async () => {
        const c = new cls()
        vi.spyOn(globalThis, 'fetch').mockResolvedValue(
          new Response('', { status: 500 }),
        )
        const result = await c.collect()
        expect(Array.isArray(result)).toBe(true)
        expect(result.length).toBe(0)
      })
    })
  }
})

// ──────────────────────────────────────────
// Tier 4: 기업 직접 수집기 테스트
// ──────────────────────────────────────────

describe('Tier 4 — CompanyDirectCollector', () => {
  beforeEach(() => {
    vi.restoreAllMocks()
  })

  it('Collector 인터페이스를 구현한다', () => {
    const c = new CompanyDirectCollector()
    expect(c.sourceId).toBe('company_direct')
    expect(c.sourceName).toBeDefined()
    expect(typeof c.collect).toBe('function')
  })

  it('특정 기업 ID로 필터링할 수 있다', () => {
    const c = createCompanyCollector('naver')
    expect(c.sourceId).toBe('company_direct')
  })

  it('산업별 수집기를 생성할 수 있다', () => {
    const c = createIndustryCollector('gaming')
    expect(c.sourceId).toBe('company_direct')
  })

  it('카테고리 프리셋 수집기가 존재한다', () => {
    expect(platformCollector.sourceId).toBe('company_direct')
    expect(fintechCollector.sourceId).toBe('company_direct')
    expect(ecommerceCollector.sourceId).toBe('company_direct')
    expect(gamingCollector.sourceId).toBe('company_direct')
    expect(enterpriseCollector.sourceId).toBe('company_direct')
    expect(telecomCollector.sourceId).toBe('company_direct')
  })

  it('네트워크 실패 시 빈 배열을 반환한다', async () => {
    vi.spyOn(globalThis, 'fetch').mockRejectedValue(new Error('Network'))
    const c = createCompanyCollector('naver')
    const result = await c.collect()
    expect(Array.isArray(result)).toBe(true)
    expect(result.length).toBe(0)
  })

  it('JSON-LD JobPosting을 파싱한다', async () => {
    const html = `
      <html><body>
        <script type="application/ld+json">
          {"@type": "JobPosting", "title": "프론트엔드 개발자", "url": "https://example.com/job/1"}
        </script>
      </body></html>
    `
    vi.spyOn(globalThis, 'fetch').mockResolvedValue(
      new Response(html, { status: 200, headers: { 'Content-Type': 'text/html' } }),
    )
    const c = createCompanyCollector('naver')
    const result = await c.collect()
    expect(result.length).toBe(1)
    expect(result[0].title).toBe('프론트엔드 개발자')
    expect(result[0].source).toBe('company_direct')
  })

  it('HTML 링크에서 채용공고를 추출한다', async () => {
    const html = `
      <html><body>
        <a href="/careers/job/123">백엔드 엔지니어 채용</a>
        <a href="/careers/job/456">데이터 엔지니어 포지션</a>
      </body></html>
    `
    vi.spyOn(globalThis, 'fetch').mockResolvedValue(
      new Response(html, { status: 200 }),
    )
    const c = createCompanyCollector('naver')
    const result = await c.collect()
    expect(result.length).toBeGreaterThanOrEqual(1)
  })

  it('HTTP 500 응답시 빈 배열', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValue(
      new Response('', { status: 500 }),
    )
    const c = createCompanyCollector('kakao')
    const result = await c.collect()
    expect(result).toEqual([])
  })
})

// ──────────────────────────────────────────
// 커스텀 URL 모니터링 테스트
// ──────────────────────────────────────────

describe('CustomUrlCollector', () => {
  beforeEach(() => {
    vi.restoreAllMocks()
  })

  it('Collector 인터페이스를 구현한다', () => {
    const c = new CustomUrlCollector([])
    expect(c.sourceId).toBe('custom')
    expect(c.sourceName).toBeDefined()
    expect(typeof c.collect).toBe('function')
  })

  it('빈 URL 목록이면 빈 결과', async () => {
    const c = new CustomUrlCollector([])
    const result = await c.collect()
    expect(result).toEqual([])
  })

  it('비활성 URL은 건너뛴다', async () => {
    const urls: CustomMonitorUrl[] = [
      {
        id: 'u1',
        label: 'Test',
        url: 'https://example.com/careers',
        enabled: false,
        createdAt: '2026-01-01T00:00:00Z',
      },
    ]
    const c = new CustomUrlCollector(urls)
    const result = await c.collect()
    expect(result).toEqual([])
  })

  it('JSON-LD JobPosting을 추출한다', async () => {
    const html = `
      <script type="application/ld+json">
        {"@type": "JobPosting", "title": "풀스택 개발자", "url": "https://example.com/j/1"}
      </script>
    `
    vi.spyOn(globalThis, 'fetch').mockResolvedValueOnce(
      new Response(html, { status: 200 }),
    )

    const urls: CustomMonitorUrl[] = [
      {
        id: 'u2',
        label: 'ExampleCorp',
        url: 'https://example.com/careers',
        enabled: true,
        createdAt: '2026-01-01T00:00:00Z',
      },
    ]
    const c = new CustomUrlCollector(urls)
    const result = await c.collect()
    expect(result.length).toBe(1)
    expect(result[0].title).toBe('풀스택 개발자')
    expect(result[0].source).toBe('custom')
  })

  it('링크 패턴에서 공고를 추출한다', async () => {
    const html = `
      <a href="/job/opening/100">시니어 React 개발자</a>
    `
    vi.spyOn(globalThis, 'fetch').mockResolvedValueOnce(
      new Response(html, { status: 200 }),
    )

    const urls: CustomMonitorUrl[] = [
      {
        id: 'u3',
        label: 'TestCo',
        url: 'https://testco.com/careers',
        companyName: 'TestCo',
        enabled: true,
        createdAt: '2026-01-01T00:00:00Z',
      },
    ]
    const c = new CustomUrlCollector(urls)
    const result = await c.collect()
    expect(result.length).toBeGreaterThanOrEqual(1)
    expect(result[0].companyName).toBe('TestCo')
  })

  it('네트워크 실패 시 빈 배열', async () => {
    vi.spyOn(globalThis, 'fetch').mockRejectedValueOnce(new Error('Fail'))

    const urls: CustomMonitorUrl[] = [
      {
        id: 'u4',
        label: 'FailCo',
        url: 'https://fail.com/careers',
        enabled: true,
        createdAt: '2026-01-01T00:00:00Z',
      },
    ]
    const c = new CustomUrlCollector(urls)
    const result = await c.collect()
    expect(result).toEqual([])
  })
})

// ──────────────────────────────────────────
// 커스텀 URL 유틸리티 테스트
// ──────────────────────────────────────────

describe('createMonitorUrl', () => {
  it('새 모니터 URL을 생성한다', () => {
    const url = createMonitorUrl('MyCompany', 'https://example.com/careers', 'ExampleCo')
    expect(url.id).toMatch(/^cmu-/)
    expect(url.label).toBe('MyCompany')
    expect(url.url).toBe('https://example.com/careers')
    expect(url.companyName).toBe('ExampleCo')
    expect(url.enabled).toBe(true)
    expect(url.createdAt).toBeDefined()
  })
})

describe('validateMonitorUrl', () => {
  it('유효한 HTTP URL을 통과시킨다', () => {
    expect(validateMonitorUrl('https://example.com/careers').valid).toBe(true)
    expect(validateMonitorUrl('http://localhost:3000').valid).toBe(true)
  })

  it('FTP 등 비 HTTP 프로토콜을 거부한다', () => {
    const result = validateMonitorUrl('ftp://files.example.com')
    expect(result.valid).toBe(false)
    expect(result.error).toContain('HTTP')
  })

  it('잘못된 URL 형식을 거부한다', () => {
    const result = validateMonitorUrl('not-a-url')
    expect(result.valid).toBe(false)
    expect(result.error).toContain('유효하지 않은')
  })
})
