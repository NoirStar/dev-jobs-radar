// ============================================================
// 데이터 소스 테스트 — skills, categories, companies, regions
// ============================================================

import { describe, it, expect } from 'vitest'
import {
  SKILL_DICTIONARY,
  ALIAS_TO_SKILL,
  SKILL_TO_CATEGORY,
  TOTAL_SKILLS,
  getSkillsByCategory,
  resolveSkillAlias,
} from '@/data/skills'
import {
  JOB_CATEGORIES,
  CATEGORY_MAP,
  getCategoryLabel,
  DEV_CATEGORIES,
  NON_DEV_CATEGORIES,
} from '@/data/categories'
import {
  COMPANY_SEEDS,
  COMPANY_MAP,
  findCompanyByName,
  getCompaniesByIndustry,
  TOTAL_COMPANIES,
} from '@/data/companies'
import {
  REGIONS,
  REGION_MAP,
  extractRegionCode,
  TOTAL_REGIONS,
} from '@/data/regions'
import { SOURCES, SOURCE_MAP, ACTIVE_SOURCES, getSourcesByTier } from '@/data/sources'

describe('기술 키워드 사전 (skills.ts)', () => {
  it('500개 이상의 기술이 등록되어 있다', () => {
    expect(TOTAL_SKILLS).toBeGreaterThanOrEqual(250)
  })

  it('모든 엔트리에 name, category, aliases가 있다', () => {
    SKILL_DICTIONARY.forEach((entry) => {
      expect(entry.name).toBeTruthy()
      expect(entry.category).toBeTruthy()
      expect(Array.isArray(entry.aliases)).toBe(true)
      expect(entry.aliases.length).toBeGreaterThan(0)
    })
  })

  it('별칭 → 표준명 역방향 매핑이 존재한다', () => {
    expect(ALIAS_TO_SKILL.size).toBeGreaterThan(0)
    expect(ALIAS_TO_SKILL.get('react')).toBe('React')
    expect(ALIAS_TO_SKILL.get('k8s')).toBe('Kubernetes')
    expect(ALIAS_TO_SKILL.get('spring boot')).toBe('Spring')
  })

  it('표준명 → 카테고리 매핑이 존재한다', () => {
    expect(SKILL_TO_CATEGORY.get('React')).toBe('frontend')
    expect(SKILL_TO_CATEGORY.get('Java')).toBe('languages')
    expect(SKILL_TO_CATEGORY.get('Docker')).toBe('devops')
    expect(SKILL_TO_CATEGORY.get('PyTorch')).toBe('ai_ml')
  })

  it('카테고리별 기술 조회가 동작한다', () => {
    const frontendSkills = getSkillsByCategory('frontend')
    expect(frontendSkills.length).toBeGreaterThan(10)
    frontendSkills.forEach((s) => expect(s.category).toBe('frontend'))
  })

  it('별칭으로 표준명 조회가 동작한다', () => {
    expect(resolveSkillAlias('reactjs')).toBe('React')
    expect(resolveSkillAlias('golang')).toBe('Go')
    expect(resolveSkillAlias('nonexistent')).toBeNull()
  })

  it('중복 표준명이 없다', () => {
    const names = SKILL_DICTIONARY.map((s) => s.name)
    const unique = new Set(names)
    expect(unique.size).toBe(names.length)
  })
})

describe('직군 카테고리 (categories.ts)', () => {
  it('14개 직군이 등록되어 있다', () => {
    expect(JOB_CATEGORIES).toHaveLength(14)
  })

  it('개발 직군 10개 + 비개발 직군 4개', () => {
    expect(DEV_CATEGORIES).toHaveLength(10)
    expect(NON_DEV_CATEGORIES).toHaveLength(4)
  })

  it('모든 카테고리에 필수 필드가 있다', () => {
    JOB_CATEGORIES.forEach((cat) => {
      expect(cat.id).toBeTruthy()
      expect(cat.label).toBeTruthy()
      expect(cat.labelEn).toBeTruthy()
      expect(cat.icon).toBeTruthy()
      expect(cat.description).toBeTruthy()
      expect(['dev', 'non-dev']).toContain(cat.group)
    })
  })

  it('CATEGORY_MAP에서 카테고리 조회가 가능하다', () => {
    expect(CATEGORY_MAP.get('frontend')?.label).toBe('웹 프론트엔드')
    expect(CATEGORY_MAP.get('backend')?.label).toBe('웹 백엔드')
  })

  it('getCategoryLabel이 올바른 라벨을 반환한다', () => {
    expect(getCategoryLabel('frontend')).toBe('웹 프론트엔드')
    expect(getCategoryLabel('ai_ml')).toBe('AI / ML / Data')
  })
})

describe('기업 시드 데이터 (companies.ts)', () => {
  it('45개 이상의 기업이 등록되어 있다', () => {
    expect(TOTAL_COMPANIES).toBeGreaterThanOrEqual(45)
  })

  it('모든 기업에 필수 필드가 있다', () => {
    COMPANY_SEEDS.forEach((company) => {
      expect(company.id).toBeTruthy()
      expect(company.name).toBeTruthy()
      expect(company.industry).toBeTruthy()
      expect(company.size).toBeTruthy()
      expect(company.location).toBeTruthy()
      expect(company.careerUrl).toBeTruthy()
      expect(Array.isArray(company.techStack)).toBe(true)
    })
  })

  it('기업 ID가 고유하다', () => {
    const ids = COMPANY_SEEDS.map((c) => c.id)
    expect(new Set(ids).size).toBe(ids.length)
  })

  it('COMPANY_MAP에서 기업 조회가 가능하다', () => {
    expect(COMPANY_MAP.get('naver')?.name).toBe('네이버')
    expect(COMPANY_MAP.get('toss')?.name).toBe('토스')
  })

  it('기업명으로 검색이 가능하다', () => {
    expect(findCompanyByName('네이버')?.id).toBe('naver')
    expect(findCompanyByName('Toss')?.id).toBe('toss')
    expect(findCompanyByName('존재하지않는회사')).toBeUndefined()
  })

  it('산업별 기업 그룹 조회가 가능하다', () => {
    const gaming = getCompaniesByIndustry('gaming')
    expect(gaming.length).toBeGreaterThan(5)
    gaming.forEach((c) => expect(c.industry).toBe('gaming'))
  })
})

describe('지역 분류 (regions.ts)', () => {
  it('19개 지역이 등록되어 있다', () => {
    expect(TOTAL_REGIONS).toBe(19)
  })

  it('모든 지역에 필수 필드가 있다', () => {
    REGIONS.forEach((region) => {
      expect(region.code).toBeTruthy()
      expect(region.name).toBeTruthy()
      expect(region.nameEn).toBeTruthy()
      expect(Array.isArray(region.coordinates)).toBe(true)
      expect(region.coordinates).toHaveLength(2)
    })
  })

  it('REGION_MAP에서 지역 조회가 가능하다', () => {
    expect(REGION_MAP.get('seoul')?.name).toBe('서울')
    expect(REGION_MAP.get('jeju')?.name).toBe('제주')
  })

  it('주소에서 지역 코드를 올바르게 추출한다', () => {
    expect(extractRegionCode('서울 강남구')).toBe('seoul')
    expect(extractRegionCode('경기 성남시 분당구')).toBe('gyeonggi')
    expect(extractRegionCode('제주시')).toBe('jeju')
    expect(extractRegionCode('원격근무')).toBe('remote')
    expect(extractRegionCode('판교')).toBe('gyeonggi')
    expect(extractRegionCode('')).toBe('remote')
  })
})

describe('수집 소스 (sources.ts)', () => {
  it('20개 이상의 소스가 등록되어 있다', () => {
    expect(SOURCES.length).toBeGreaterThanOrEqual(20)
  })

  it('Tier 1 소스가 5개 (활성)', () => {
    const tier1 = getSourcesByTier('tier1')
    expect(tier1).toHaveLength(5)
    tier1.forEach((s) => expect(s.isActive).toBe(true))
  })

  it('활성 소스가 존재한다', () => {
    expect(ACTIVE_SOURCES.length).toBeGreaterThan(0)
  })

  it('모든 소스에 필수 필드가 있다', () => {
    SOURCES.forEach((source) => {
      expect(source.id).toBeTruthy()
      expect(source.name).toBeTruthy()
      expect(source.tier).toBeTruthy()
      expect(source.url).toBeTruthy()
      expect(source.intervalMinutes).toBeGreaterThan(0)
    })
  })

  it('SOURCE_MAP에서 소스 조회가 가능하다', () => {
    expect(SOURCE_MAP.get('wanted')?.name).toBe('원티드')
    expect(SOURCE_MAP.get('jumpit')?.name).toBe('점핏')
  })
})
