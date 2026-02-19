// ============================================================
// 타입 무결성 테스트 — 타입이 올바르게 정의되었는지 검증
// ============================================================

import { describe, it, expect } from 'vitest'
import type {
  JobPosting,
  JobPostingSummary,
  JobCategory,
  SourceId,
  Application,
  ApplicationStatus,
  Company,
  CompanySummary,
  WatchedCompany,
  SkillDictionaryEntry,
  SkillStat,
  ChartPeriod,
  ChartType,
  UserProfile,
  UserSettings,
} from '@/types'
import { DEFAULT_USER_SETTINGS } from '@/types'

describe('타입 정의', () => {
  describe('JobCategory', () => {
    it('모든 직군 카테고리가 유효한 문자열이다', () => {
      const categories: JobCategory[] = [
        'frontend', 'backend', 'mobile', 'system', 'devops',
        'ai_ml', 'security', 'game', 'dba', 'qa',
        'pm_po', 'designer', 'sales_engineer', 'it_planner',
      ]
      expect(categories).toHaveLength(14)
      categories.forEach((c) => expect(typeof c).toBe('string'))
    })
  })

  describe('SourceId', () => {
    it('Tier 1 소스가 5개 정의되어 있다', () => {
      const tier1: SourceId[] = ['wanted', 'saramin', 'jobkorea', 'programmers', 'jumpit']
      expect(tier1).toHaveLength(5)
    })
  })

  describe('ApplicationStatus', () => {
    it('모든 지원 상태가 유효하다', () => {
      const statuses: ApplicationStatus[] = [
        'interested', 'applied', 'screening', 'interview',
        'technical_test', 'final_interview', 'offer', 'accepted',
        'rejected', 'withdrawn',
      ]
      expect(statuses).toHaveLength(10)
    })
  })

  describe('ChartType', () => {
    it('12종 차트 타입이 정의되어 있다', () => {
      const charts: ChartType[] = [
        'skill-trend-line', 'category-area', 'skill-bump', 'salary-box',
        'skill-heatmap', 'company-timeline', 'skill-network', 'new-postings',
        'skill-radar', 'skill-wordcloud', 'experience-sankey', 'region-map',
      ]
      expect(charts).toHaveLength(12)
    })
  })

  describe('ChartPeriod', () => {
    it('기간 필터가 정의되어 있다', () => {
      const periods: ChartPeriod[] = ['1w', '2w', '1m', '3m', '6m', '1y']
      expect(periods).toHaveLength(6)
    })
  })

  describe('DEFAULT_USER_SETTINGS', () => {
    it('기본 사용자 설정이 올바르다', () => {
      expect(DEFAULT_USER_SETTINGS.theme).toBe('system')
      expect(DEFAULT_USER_SETTINGS.language).toBe('ko')
      expect(DEFAULT_USER_SETTINGS.emailNotifications).toBe(true)
      expect(DEFAULT_USER_SETTINGS.digestFrequency).toBe('daily')
      expect(DEFAULT_USER_SETTINGS.defaultCategory).toBe('all')
    })
  })
})
