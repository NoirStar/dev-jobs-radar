// ============================================================
// 차트 관련 타입 정의
// ============================================================

import type { JobCategory } from './job'

/** 차트 기간 필터 */
export type ChartPeriod = '1w' | '2w' | '1m' | '3m' | '6m' | '1y'

/** 차트 유형 */
export type ChartType =
  | 'skill-trend-line'       // ① 기술 수요 트렌드 (Line)
  | 'category-area'          // ② 직군별 채용 추이 (Stacked Area)
  | 'skill-bump'             // ③ 기술 순위 변화 (Bump)
  | 'salary-box'             // ④ 연봉 분포 (Box Plot)
  | 'skill-heatmap'          // ⑤ 기술 히트맵 (직군×기술)
  | 'company-timeline'       // ⑥ 기업 채용 타임라인
  | 'skill-network'          // ⑦ 기술 조합 네트워크 (Force)
  | 'new-postings'           // ⑧ 신규 공고 추이 (Bar+Line)
  | 'skill-radar'            // ⑨ 내 기술 vs 시장 (Radar)
  | 'skill-wordcloud'        // ⑩ 기술 워드클라우드
  | 'experience-sankey'      // ⑪ 경력별 기술 Sankey
  | 'region-map'             // ⑫ 채용 지역 지도

/** 차트 필터 옵션 */
export interface ChartFilter {
  period: ChartPeriod
  categories: JobCategory[]
  skills: string[]
  companies: string[]
  regions: string[]
}

/** Line/Area 차트 데이터 시리즈 */
export interface ChartSeries {
  name: string
  data: { date: string; value: number }[]
  color?: string
}

/** Bump 차트 데이터 */
export interface BumpChartData {
  skill: string
  rankings: { date: string; rank: number }[]
}

/** Box Plot 데이터 */
export interface BoxPlotData {
  label: string
  min: number
  q1: number
  median: number
  q3: number
  max: number
  outliers: number[]
  sampleSize: number
}

/** Heatmap 데이터 */
export interface HeatmapData {
  rows: string[]
  columns: string[]
  values: { row: string; column: string; value: number }[]
}

/** Network 그래프 데이터 */
export interface NetworkGraphData {
  nodes: { id: string; label: string; size: number; group: string }[]
  links: { source: string; target: string; strength: number }[]
}

/** Radar 차트 데이터 */
export interface RadarChartData {
  axes: string[]
  series: { name: string; values: number[] }[]
}

/** Word Cloud 데이터 */
export interface WordCloudData {
  words: { text: string; value: number; category: string }[]
}

/** Sankey 다이어그램 데이터 */
export interface SankeyData {
  nodes: { id: string; label: string }[]
  links: { source: string; target: string; value: number }[]
}

/** 지도 차트 데이터 */
export interface MapChartData {
  regions: {
    code: string
    name: string
    value: number
    coordinates: [number, number]
  }[]
}

/** 기업 채용 타임라인 데이터 */
export interface CompanyTimelineItem {
  company: string
  months: { month: string; count: number }[]
}
