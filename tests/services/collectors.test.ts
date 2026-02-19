// ============================================================
// Phase 1 — 수집기 인프라 테스트
// skillExtractor, jobClassifier, salaryParser, experienceParser,
// companyMatcher, pipeline, collectors
// ============================================================

import { describe, it, expect, vi, beforeEach } from 'vitest'
import { extractSkills, extractSkillNames, resolveSkillName } from '@/services/collectors/skillExtractor'
import { classifyJob } from '@/services/collectors/jobClassifier'
import { parseSalary, formatSalary, type ParsedSalary } from '@/services/collectors/salaryParser'
import { parseExperience } from '@/services/collectors/experienceParser'
import { normalizeCompanyName, cleanCompanyName } from '@/services/collectors/companyMatcher'
import { parseRawJob, runCollector, runPipeline } from '@/services/collectors/pipeline'
import type { RawJobData, Collector } from '@/services/collectors/types'
import { WantedCollector } from '@/services/collectors/wanted'
import { SaraminCollector } from '@/services/collectors/saramin'
import { JobKoreaCollector } from '@/services/collectors/jobkorea'
import { ProgrammersCollector } from '@/services/collectors/programmers'
import { JumpitCollector } from '@/services/collectors/jumpit'

// ──────────────────────────────────────────
// 기술 스택 추출 엔진 (skillExtractor)
// ──────────────────────────────────────────

describe('skillExtractor', () => {
  describe('resolveSkillName', () => {
    it('별칭으로 표준명을 반환한다', () => {
      expect(resolveSkillName('reactjs')).toBe('React')
      expect(resolveSkillName('ts')).toBe('TypeScript')
      expect(resolveSkillName('k8s')).toBe('Kubernetes')
    })

    it('대소문자 무관하게 매칭한다', () => {
      expect(resolveSkillName('REACT')).toBe('React')
      expect(resolveSkillName('Python')).toBe('Python')
      expect(resolveSkillName('docker')).toBe('Docker')
    })

    it('매칭되지 않으면 null을 반환한다', () => {
      expect(resolveSkillName('nonexistent-tech')).toBeNull()
      expect(resolveSkillName('')).toBeNull()
    })
  })

  describe('extractSkillNames', () => {
    it('텍스트에서 기술 키워드를 추출한다', () => {
      const text = 'Java, Spring Boot, MySQL 경험 우대. React, TypeScript 사용.'
      const skills = extractSkillNames(text)
      expect(skills).toContain('Java')
      expect(skills).toContain('Spring')
      expect(skills).toContain('MySQL')
      expect(skills).toContain('React')
      expect(skills).toContain('TypeScript')
    })

    it('소스 태그를 우선 처리한다', () => {
      const skills = extractSkillNames('', ['React', 'Node.js', 'Docker'])
      expect(skills).toContain('React')
      expect(skills).toContain('Node.js')
      expect(skills).toContain('Docker')
    })

    it('태그와 텍스트를 결합하여 중복을 제거한다', () => {
      const skills = extractSkillNames('React, TypeScript 사용', ['React', 'Docker'])
      const reactCount = skills.filter((s) => s === 'React').length
      expect(reactCount).toBe(1)
      expect(skills).toContain('Docker')
      expect(skills).toContain('TypeScript')
    })

    it('빈 입력에 대해 빈 배열을 반환한다', () => {
      expect(extractSkillNames('')).toEqual([])
      expect(extractSkillNames('', [])).toEqual([])
    })
  })

  describe('extractSkills', () => {
    it('정규화된 기술명과 카테고리를 반환한다', () => {
      const results = extractSkills('Python, Django 경험 필수')
      const python = results.find((s) => s.name === 'Python')
      expect(python).toBeDefined()
      expect(python!.category).toBeDefined()
    })

    it('별칭을 정규화하여 반환한다', () => {
      const results = extractSkills('', ['reactjs', 'k8s', 'ts'])
      expect(results.map((s) => s.name)).toContain('React')
      expect(results.map((s) => s.name)).toContain('Kubernetes')
      expect(results.map((s) => s.name)).toContain('TypeScript')
    })
  })
})

// ──────────────────────────────────────────
// 직군 자동 분류기 (jobClassifier)
// ──────────────────────────────────────────

describe('jobClassifier', () => {
  it('제목 키워드로 프론트엔드를 분류한다', () => {
    expect(classifyJob('프론트엔드 개발자', ['React', 'TypeScript'])).toBe('frontend')
    expect(classifyJob('Frontend Engineer', ['Vue', 'JavaScript'])).toBe('frontend')
  })

  it('제목 키워드로 백엔드를 분류한다', () => {
    expect(classifyJob('백엔드 엔지니어', ['Java', 'Spring'])).toBe('backend')
    expect(classifyJob('서버 개발자', ['Node.js', 'PostgreSQL'])).toBe('backend')
  })

  it('제목 키워드로 DevOps를 분류한다', () => {
    expect(classifyJob('DevOps 엔지니어', ['Kubernetes', 'Docker', 'AWS'])).toBe('devops')
    expect(classifyJob('SRE', ['Terraform', 'Prometheus'])).toBe('devops')
  })

  it('제목 키워드로 모바일을 분류한다', () => {
    expect(classifyJob('iOS 개발자', ['Swift', 'SwiftUI'])).toBe('mobile')
    expect(classifyJob('Android 엔지니어', ['Kotlin'])).toBe('mobile')
  })

  it('제목 키워드로 AI/ML을 분류한다', () => {
    expect(classifyJob('ML Engineer', ['PyTorch', 'Python'])).toBe('ai_ml')
    expect(classifyJob('Data Scientist', ['TensorFlow'])).toBe('ai_ml')
  })

  it('제목 키워드로 게임을 분류한다', () => {
    expect(classifyJob('게임 클라이언트 개발', ['Unity', 'C#'])).toBe('game')
  })

  it('기술 스택만으로도 분류할 수 있다', () => {
    const result = classifyJob('Software Engineer', ['React', 'TypeScript', 'Next.js', 'CSS'])
    expect(result).toBe('frontend')
  })

  it('매칭이 없으면 기본값 backend를 반환한다', () => {
    expect(classifyJob('개발자', [])).toBe('backend')
  })
})

// ──────────────────────────────────────────
// 연봉 파싱 엔진 (salaryParser)
// ──────────────────────────────────────────

describe('salaryParser', () => {
  describe('parseSalary', () => {
    it('KRW 범위를 파싱한다 — "4,000만원 ~ 6,000만원"', () => {
      const result = parseSalary('4,000만원 ~ 6,000만원')
      expect(result).not.toBeNull()
      expect(result!.min).toBe(40000000)
      expect(result!.max).toBe(60000000)
      expect(result!.currency).toBe('KRW')
    })

    it('KRW 범위를 파싱한다 — "5000~7000만원"', () => {
      const result = parseSalary('연봉 5000~7000만원')
      expect(result).not.toBeNull()
      expect(result!.min).toBe(50000000)
      expect(result!.max).toBe(70000000)
    })

    it('KRW 단일 값을 파싱한다', () => {
      const result = parseSalary('연봉 5000만원')
      expect(result).not.toBeNull()
      expect(result!.min).toBe(50000000)
    })

    it('월급을 연봉으로 변환한다', () => {
      const result = parseSalary('월 400만원')
      expect(result).not.toBeNull()
      expect(result!.min).toBe(400 * 10000 * 12)
    })

    it('USD 범위를 파싱한다 — "$80,000 - $120,000"', () => {
      const result = parseSalary('$80,000 - $120,000')
      expect(result).not.toBeNull()
      expect(result!.min).toBe(80000)
      expect(result!.max).toBe(120000)
      expect(result!.currency).toBe('USD')
    })

    it('"협의"를 null로 반환한다', () => {
      expect(parseSalary('협의')).toBeNull()
      expect(parseSalary('면접 후 결정')).toBeNull()
      expect(parseSalary('회사내규에 따름')).toBeNull()
    })

    it('빈 입력을 null로 반환한다', () => {
      expect(parseSalary(null)).toBeNull()
      expect(parseSalary(undefined)).toBeNull()
      expect(parseSalary('')).toBeNull()
    })
  })

  describe('formatSalary', () => {
    it('KRW 범위를 포맷한다', () => {
      const salary: ParsedSalary = { min: 40000000, max: 60000000, currency: 'KRW', text: '' }
      expect(formatSalary(salary)).toBe('4000만원 ~ 6000만원')
    })

    it('USD 범위를 포맷한다', () => {
      const salary: ParsedSalary = { min: 80000, max: 120000, currency: 'USD', text: '' }
      const result = formatSalary(salary)
      expect(result).toContain('$80,000')
      expect(result).toContain('$120,000')
    })

    it('단일 값을 포맷한다', () => {
      const salary: ParsedSalary = { min: 50000000, max: null, currency: 'KRW', text: '' }
      expect(formatSalary(salary)).toBe('5000만원')
    })
  })
})

// ──────────────────────────────────────────
// 경력 조건 파서 (experienceParser)
// ──────────────────────────────────────────

describe('experienceParser', () => {
  it('"신입"을 junior로 파싱한다', () => {
    const result = parseExperience('신입')
    expect(result.level).toBe('junior')
    expect(result.minYears).toBe(0)
    expect(result.maxYears).toBe(2)
  })

  it('"경력무관"을 any로 파싱한다', () => {
    const result = parseExperience('경력무관')
    expect(result.level).toBe('any')
  })

  it('"경력 3~5년"을 mid로 파싱한다', () => {
    const result = parseExperience('경력 3~5년')
    expect(result.level).toBe('mid')
    expect(result.minYears).toBe(3)
    expect(result.maxYears).toBe(5)
  })

  it('"5년 이상"을 mid/senior로 파싱한다', () => {
    const result = parseExperience('5년 이상')
    expect(result.level).toBe('mid')
    expect(result.minYears).toBe(5)
    expect(result.maxYears).toBeNull()
  })

  it('"10년 이상"을 senior로 파싱한다', () => {
    const result = parseExperience('10년 이상')
    expect(result.level).toBe('senior')
    expect(result.minYears).toBe(10)
  })

  it('"Senior"를 senior로 파싱한다', () => {
    const result = parseExperience('Senior')
    expect(result.level).toBe('senior')
  })

  it('null/undefined를 any로 파싱한다', () => {
    expect(parseExperience(null).level).toBe('any')
    expect(parseExperience(undefined).level).toBe('any')
    expect(parseExperience('').level).toBe('any')
  })

  it('"신입/경력"을 any로 파싱한다', () => {
    const result = parseExperience('신입/경력')
    expect(result.level).toBe('any')
  })
})

// ──────────────────────────────────────────
// 회사명 정규화 (companyMatcher)
// ──────────────────────────────────────────

describe('companyMatcher', () => {
  describe('normalizeCompanyName', () => {
    it('정확한 회사명을 반환한다', () => {
      expect(normalizeCompanyName('네이버')).toBe('네이버')
      expect(normalizeCompanyName('카카오')).toBe('카카오')
    })

    it('ID로 매칭한다', () => {
      expect(normalizeCompanyName('naver')).toBe('네이버')
      expect(normalizeCompanyName('kakao')).toBe('카카오')
    })

    it('영문명으로 매칭한다', () => {
      expect(normalizeCompanyName('NAVER')).toBe('네이버')
      expect(normalizeCompanyName('Kakao')).toBe('카카오')
    })

    it('포함 매칭을 한다', () => {
      expect(normalizeCompanyName('(주)네이버')).toBe('네이버')
      expect(normalizeCompanyName('네이버 주식회사')).toBe('네이버')
    })

    it('매칭 안 되면 법인 접미사를 제거하고 반환한다', () => {
      expect(normalizeCompanyName('(주)알수없는회사')).toBe('알수없는회사')
      expect(normalizeCompanyName('Unknown Corp.')).toBe('Unknown')
    })

    it('빈 문자열을 처리한다', () => {
      expect(normalizeCompanyName('')).toBe('')
      expect(normalizeCompanyName('  ')).toBe('')
    })
  })

  describe('cleanCompanyName', () => {
    it('(주)를 제거한다', () => {
      expect(cleanCompanyName('(주)회사')).toBe('회사')
    })

    it('주식회사를 제거한다', () => {
      expect(cleanCompanyName('주식회사 회사')).toBe('회사')
    })

    it('Inc.를 제거한다', () => {
      expect(cleanCompanyName('Company Inc.')).toBe('Company')
    })

    it('Corp.를 제거한다', () => {
      expect(cleanCompanyName('Company Corp.')).toBe('Company')
    })

    it('LLC를 제거한다', () => {
      expect(cleanCompanyName('Company LLC')).toBe('Company')
    })
  })
})

// ──────────────────────────────────────────
// 파이프라인 (pipeline)
// ──────────────────────────────────────────

describe('pipeline', () => {
  const makeRawJob = (overrides: Partial<RawJobData> = {}): RawJobData => ({
    sourceJobId: 'test-123',
    source: 'wanted',
    title: '백엔드 엔지니어',
    companyName: '네이버',
    url: 'https://example.com/job/123',
    location: '서울',
    experienceText: '경력 3~5년',
    salaryText: '5,000만원 ~ 7,000만원',
    tags: ['Java', 'Spring', 'MySQL'],
    description: 'Java, Spring Boot 기반 서버 개발',
    collectedAt: new Date().toISOString(),
    ...overrides,
  })

  describe('parseRawJob', () => {
    it('원시 데이터를 파싱하여 모든 필드를 채운다', () => {
      const raw = makeRawJob()
      const parsed = parseRawJob(raw)

      // 기본 필드 유지
      expect(parsed.sourceJobId).toBe(raw.sourceJobId)
      expect(parsed.title).toBe(raw.title)
      expect(parsed.companyName).toBe(raw.companyName)

      // 추출된 기술
      expect(parsed.skills.length).toBeGreaterThan(0)
      expect(parsed.skills).toContain('Java')
      expect(parsed.skills).toContain('Spring')

      // 직군 분류
      expect(parsed.category).toBe('backend')

      // 경력 파싱
      expect(parsed.experience.level).toBe('mid')
      expect(parsed.experience.minYears).toBe(3)
      expect(parsed.experience.maxYears).toBe(5)

      // 연봉 파싱
      expect(parsed.salary).not.toBeNull()
      expect(parsed.salary!.min).toBe(50000000)
      expect(parsed.salary!.max).toBe(70000000)

      // 회사명 정규화
      expect(parsed.normalizedCompanyName).toBe('네이버')
    })

    it('기술 태그가 없어도 본문에서 추출한다', () => {
      const raw = makeRawJob({ tags: [], description: 'React, TypeScript, Next.js 개발' })
      const parsed = parseRawJob(raw)
      expect(parsed.skills).toContain('React')
    })

    it('연봉이 없으면 salary가 null이다', () => {
      const raw = makeRawJob({ salaryText: undefined })
      const parsed = parseRawJob(raw)
      expect(parsed.salary).toBeNull()
    })

    it('연봉이 "협의"면 salary가 null이다', () => {
      const raw = makeRawJob({ salaryText: '협의' })
      const parsed = parseRawJob(raw)
      expect(parsed.salary).toBeNull()
    })

    it('경력이 없으면 기본값 any', () => {
      const raw = makeRawJob({ experienceText: undefined })
      const parsed = parseRawJob(raw)
      expect(parsed.experience.level).toBe('any')
    })
  })

  describe('runCollector', () => {
    it('수집에 성공하면 result.success가 true이다', async () => {
      const mockCollector: Collector = {
        sourceId: 'wanted',
        sourceName: '원티드',
        async collect() {
          return [makeRawJob()]
        },
      }

      const { result, jobs } = await runCollector(mockCollector)
      expect(result.success).toBe(true)
      expect(result.jobCount).toBe(1)
      expect(result.source).toBe('wanted')
      expect(result.duration).toBeGreaterThanOrEqual(0)
      expect(jobs.length).toBe(1)
    })

    it('수집에 실패하면 result.success가 false이다', async () => {
      const mockCollector: Collector = {
        sourceId: 'wanted',
        sourceName: '원티드',
        async collect() {
          throw new Error('Network error')
        },
      }

      const { result, jobs } = await runCollector(mockCollector)
      expect(result.success).toBe(false)
      expect(result.error).toBe('Network error')
      expect(result.jobCount).toBe(0)
      expect(jobs.length).toBe(0)
    })
  })

  describe('runPipeline', () => {
    it('여러 수집기를 순차 실행한다', async () => {
      const collector1: Collector = {
        sourceId: 'wanted',
        sourceName: '원티드',
        async collect() {
          return [makeRawJob({ sourceJobId: '1', source: 'wanted' })]
        },
      }
      const collector2: Collector = {
        sourceId: 'saramin',
        sourceName: '사람인',
        async collect() {
          return [makeRawJob({ sourceJobId: '2', source: 'saramin' })]
        },
      }

      const { results, jobs } = await runPipeline([collector1, collector2])
      expect(results.length).toBe(2)
      expect(results.every((r) => r.success)).toBe(true)
      expect(jobs.length).toBe(2)
    })

    it('일부 수집기가 실패해도 나머지는 성공한다', async () => {
      const successCollector: Collector = {
        sourceId: 'wanted',
        sourceName: '원티드',
        async collect() {
          return [makeRawJob()]
        },
      }
      const failCollector: Collector = {
        sourceId: 'saramin',
        sourceName: '사람인',
        async collect() {
          throw new Error('API error')
        },
      }

      const { results, jobs } = await runPipeline([successCollector, failCollector])
      expect(results.length).toBe(2)
      expect(results[0].success).toBe(true)
      expect(results[1].success).toBe(false)
      expect(jobs.length).toBe(1)
    })

    it('빈 수집기 배열을 처리한다', async () => {
      const { results, jobs } = await runPipeline([])
      expect(results.length).toBe(0)
      expect(jobs.length).toBe(0)
    })
  })
})

// ──────────────────────────────────────────
// 수집기 (Collectors) — 인스턴스 생성 & 인터페이스 테스트
// ──────────────────────────────────────────

describe('collectors', () => {
  describe('WantedCollector', () => {
    it('올바른 sourceId와 sourceName을 가진다', () => {
      const collector = new WantedCollector()
      expect(collector.sourceId).toBe('wanted')
      expect(collector.sourceName).toBe('원티드')
    })

    it('collect 메서드가 정의되어 있다', () => {
      const collector = new WantedCollector()
      expect(typeof collector.collect).toBe('function')
    })

    it('fetch 실패 시 빈 배열을 반환한다', async () => {
      vi.spyOn(globalThis, 'fetch').mockRejectedValue(new Error('Network error'))
      const collector = new WantedCollector()
      const result = await collector.collect()
      expect(result).toEqual([])
      vi.restoreAllMocks()
    })

    it('API 응답을 RawJobData로 변환한다', async () => {
      const mockResponse = {
        ok: true,
        json: async () => ({
          data: [
            {
              id: 12345,
              position: '서버 엔지니어',
              company: { name: '토스' },
              address: { location: '서울' },
              skill_tags: [{ title: 'Java' }, { title: 'Spring' }],
              due_time: '2026-03-15',
            },
          ],
          links: {},
        }),
      }

      vi.spyOn(globalThis, 'fetch').mockResolvedValue(mockResponse as Response)
      const collector = new WantedCollector()
      const jobs = await collector.collect()

      expect(jobs.length).toBeGreaterThanOrEqual(1)
      expect(jobs[0].source).toBe('wanted')
      expect(jobs[0].title).toBe('서버 엔지니어')
      expect(jobs[0].companyName).toBe('토스')
      expect(jobs[0].url).toContain('12345')
      expect(jobs[0].tags).toContain('Java')

      vi.restoreAllMocks()
    })
  })

  describe('SaraminCollector', () => {
    it('올바른 sourceId와 sourceName을 가진다', () => {
      const collector = new SaraminCollector()
      expect(collector.sourceId).toBe('saramin')
      expect(collector.sourceName).toBe('사람인')
    })

    it('collect 메서드가 정의되어 있다', () => {
      const collector = new SaraminCollector()
      expect(typeof collector.collect).toBe('function')
    })
  })

  describe('JobKoreaCollector', () => {
    it('올바른 sourceId와 sourceName을 가진다', () => {
      const collector = new JobKoreaCollector()
      expect(collector.sourceId).toBe('jobkorea')
      expect(collector.sourceName).toBe('잡코리아')
    })

    it('collect 메서드가 정의되어 있다', () => {
      const collector = new JobKoreaCollector()
      expect(typeof collector.collect).toBe('function')
    })
  })

  describe('ProgrammersCollector', () => {
    it('올바른 sourceId와 sourceName을 가진다', () => {
      const collector = new ProgrammersCollector()
      expect(collector.sourceId).toBe('programmers')
      expect(collector.sourceName).toBe('프로그래머스')
    })

    it('collect 메서드가 정의되어 있다', () => {
      const collector = new ProgrammersCollector()
      expect(typeof collector.collect).toBe('function')
    })
  })

  describe('JumpitCollector', () => {
    it('올바른 sourceId와 sourceName을 가진다', () => {
      const collector = new JumpitCollector()
      expect(collector.sourceId).toBe('jumpit')
      expect(collector.sourceName).toBe('점핏')
    })

    it('collect 메서드가 정의되어 있다', () => {
      const collector = new JumpitCollector()
      expect(typeof collector.collect).toBe('function')
    })
  })
})
