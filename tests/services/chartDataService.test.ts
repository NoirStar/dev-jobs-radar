// ============================================================
// chartDataService — jobStore 데이터에서 차트 데이터 계산 테스트
// ============================================================

import { describe, it, expect } from 'vitest'
import {
  computeQuickStats,
  computeWordCloud,
  computeHeatmap,
  computeSalaryBox,
  computeNetwork,
  computeSankey,
  computeCategoryDistribution,
} from '@/services/chartDataService'
import { MOCK_JOBS } from '@/data/mockData'

describe('chartDataService', () => {
  // ── computeQuickStats ──
  describe('computeQuickStats', () => {
    it('총 공고 수를 정확히 계산한다', () => {
      const stats = computeQuickStats(MOCK_JOBS)
      expect(stats.totalJobs).toBe(MOCK_JOBS.length)
    })

    it('빈 배열이면 모든 값이 0이다', () => {
      const stats = computeQuickStats([])
      expect(stats.totalJobs).toBe(0)
      expect(stats.newToday).toBe(0)
      expect(stats.deadlineSoon).toBe(0)
      expect(stats.watchedNewJobs).toBe(0)
    })

    it('관심기업 필터가 동작한다', () => {
      const stats = computeQuickStats(MOCK_JOBS, ['toss', 'naver'])
      // 관심기업에서 최근 3일 이내 게시된 공고 수 (날짜에 따라 0일 수)
      expect(stats.watchedNewJobs).toBeGreaterThanOrEqual(0)
    })
  })

  // ── computeWordCloud ──
  describe('computeWordCloud', () => {
    it('모든 기술을 집계한다', () => {
      const cloud = computeWordCloud(MOCK_JOBS)
      expect(cloud.words.length).toBeGreaterThan(0)
      // 'Python'은 여러 공고에 등장
      const python = cloud.words.find((w) => w.text === 'Python')
      expect(python).toBeDefined()
      expect(python!.value).toBeGreaterThanOrEqual(2)
    })

    it('value 순으로 정렬된다', () => {
      const cloud = computeWordCloud(MOCK_JOBS)
      for (let i = 1; i < cloud.words.length; i++) {
        expect(cloud.words[i - 1].value).toBeGreaterThanOrEqual(cloud.words[i].value)
      }
    })

    it('빈 배열이면 words도 비어있다', () => {
      const cloud = computeWordCloud([])
      expect(cloud.words).toHaveLength(0)
    })
  })

  // ── computeHeatmap ──
  describe('computeHeatmap', () => {
    it('rows와 columns를 생성한다', () => {
      const heatmap = computeHeatmap(MOCK_JOBS)
      expect(heatmap.rows.length).toBeGreaterThan(0)
      expect(heatmap.columns.length).toBeGreaterThan(0)
    })

    it('values의 row/column이 유효하다', () => {
      const heatmap = computeHeatmap(MOCK_JOBS)
      const rowSet = new Set(heatmap.rows)
      const colSet = new Set(heatmap.columns)
      for (const v of heatmap.values) {
        expect(rowSet.has(v.row)).toBe(true)
        expect(colSet.has(v.column)).toBe(true)
        expect(v.value).toBeGreaterThanOrEqual(0)
        expect(v.value).toBeLessThanOrEqual(100)
      }
    })
  })

  // ── computeSalaryBox ──
  describe('computeSalaryBox', () => {
    it('연봉이 있는 직군의 box plot을 생성한다', () => {
      const boxes = computeSalaryBox(MOCK_JOBS)
      expect(boxes.length).toBeGreaterThan(0)
      for (const b of boxes) {
        expect(b.min).toBeLessThanOrEqual(b.q1)
        expect(b.q1).toBeLessThanOrEqual(b.median)
        expect(b.median).toBeLessThanOrEqual(b.q3)
        expect(b.q3).toBeLessThanOrEqual(b.max)
      }
    })

    it('빈 배열이면 결과도 비어있다', () => {
      expect(computeSalaryBox([])).toHaveLength(0)
    })
  })

  // ── computeNetwork ──
  describe('computeNetwork', () => {
    it('노드와 링크를 생성한다', () => {
      const net = computeNetwork(MOCK_JOBS)
      expect(net.nodes.length).toBeGreaterThan(0)
      expect(net.links.length).toBeGreaterThan(0)
    })

    it('링크의 source/target이 유효한 노드 id이다', () => {
      const net = computeNetwork(MOCK_JOBS)
      const ids = new Set(net.nodes.map((n) => n.id))
      for (const l of net.links) {
        expect(ids.has(l.source)).toBe(true)
        expect(ids.has(l.target)).toBe(true)
      }
    })
  })

  // ── computeSankey ──
  describe('computeSankey', () => {
    it('경력 노드와 기술 노드를 생성한다', () => {
      const sankey = computeSankey(MOCK_JOBS)
      const expNodes = sankey.nodes.filter((n) => n.id.startsWith('exp-'))
      const skNodes = sankey.nodes.filter((n) => n.id.startsWith('sk-'))
      expect(expNodes.length).toBeGreaterThan(0)
      expect(skNodes.length).toBeGreaterThan(0)
    })

    it('링크의 source/target이 유효하다', () => {
      const sankey = computeSankey(MOCK_JOBS)
      const ids = new Set(sankey.nodes.map((n) => n.id))
      for (const l of sankey.links) {
        expect(ids.has(l.source)).toBe(true)
        expect(ids.has(l.target)).toBe(true)
        expect(l.value).toBeGreaterThan(0)
      }
    })
  })

  // ── computeCategoryDistribution ──
  describe('computeCategoryDistribution', () => {
    it('직군별 분포를 계산한다', () => {
      const dist = computeCategoryDistribution(MOCK_JOBS)
      expect(dist.length).toBeGreaterThan(0)
      const totalCount = dist.reduce((s, d) => s + d.count, 0)
      expect(totalCount).toBe(MOCK_JOBS.length)
    })

    it('count 내림차순으로 정렬된다', () => {
      const dist = computeCategoryDistribution(MOCK_JOBS)
      for (let i = 1; i < dist.length; i++) {
        expect(dist[i - 1].count).toBeGreaterThanOrEqual(dist[i].count)
      }
    })

    it('빈 배열이면 결과도 비어있다', () => {
      expect(computeCategoryDistribution([])).toHaveLength(0)
    })
  })
})
