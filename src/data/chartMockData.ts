// ============================================================
// 차트용 목(Mock) 데이터 — Phase 3 시각화
// ============================================================

import type {
  ChartSeries,
  BoxPlotData,
  HeatmapData,
  RadarChartData,
  WordCloudData,
  BumpChartData,
  NetworkGraphData,
  SankeyData,
  MapChartData,
  CompanyTimelineItem,
} from '@/types/chart'

// ── ① 기술 수요 트렌드 (Line Chart) ──

/** 최근 8주 기술별 공고 수 추이 */
export const MOCK_SKILL_TREND_SERIES: ChartSeries[] = [
  {
    name: 'TypeScript',
    color: '#3178c6',
    data: [
      { date: '01/06', value: 52 }, { date: '01/13', value: 58 },
      { date: '01/20', value: 55 }, { date: '01/27', value: 61 },
      { date: '02/03', value: 64 }, { date: '02/10', value: 67 },
      { date: '02/17', value: 71 }, { date: '02/19', value: 67 },
    ],
  },
  {
    name: 'Java',
    color: '#e76f00',
    data: [
      { date: '01/06', value: 120 }, { date: '01/13', value: 118 },
      { date: '01/20', value: 115 }, { date: '01/27', value: 113 },
      { date: '02/03', value: 115 }, { date: '02/10', value: 112 },
      { date: '02/17', value: 110 }, { date: '02/19', value: 112 },
    ],
  },
  {
    name: 'Python',
    color: '#3776ab',
    data: [
      { date: '01/06', value: 65 }, { date: '01/13', value: 68 },
      { date: '01/20', value: 72 }, { date: '01/27', value: 70 },
      { date: '02/03', value: 75 }, { date: '02/10', value: 78 },
      { date: '02/17', value: 80 }, { date: '02/19', value: 78 },
    ],
  },
  {
    name: 'Kubernetes',
    color: '#326ce5',
    data: [
      { date: '01/06', value: 30 }, { date: '01/13', value: 33 },
      { date: '01/20', value: 36 }, { date: '01/27', value: 38 },
      { date: '02/03', value: 40 }, { date: '02/10', value: 43 },
      { date: '02/17', value: 46 }, { date: '02/19', value: 45 },
    ],
  },
  {
    name: 'Go',
    color: '#00add8',
    data: [
      { date: '01/06', value: 15 }, { date: '01/13', value: 17 },
      { date: '01/20', value: 18 }, { date: '01/27', value: 20 },
      { date: '02/03', value: 21 }, { date: '02/10', value: 23 },
      { date: '02/17', value: 24 }, { date: '02/19', value: 23 },
    ],
  },
]

// ── ② 직군별 채용 추이 (Stacked Area Chart) ──

export const MOCK_CATEGORY_TREND = [
  { date: '01/06', frontend: 78, backend: 130, devops: 45, mobile: 38, ai_ml: 55 },
  { date: '01/13', frontend: 82, backend: 128, devops: 48, mobile: 40, ai_ml: 58 },
  { date: '01/20', frontend: 80, backend: 135, devops: 50, mobile: 37, ai_ml: 62 },
  { date: '01/27', frontend: 85, backend: 140, devops: 52, mobile: 42, ai_ml: 60 },
  { date: '02/03', frontend: 88, backend: 138, devops: 55, mobile: 40, ai_ml: 65 },
  { date: '02/10', frontend: 86, backend: 142, devops: 53, mobile: 43, ai_ml: 68 },
  { date: '02/17', frontend: 89, backend: 145, devops: 56, mobile: 42, ai_ml: 67 },
  { date: '02/19', frontend: 89, backend: 145, devops: 56, mobile: 42, ai_ml: 67 },
]

export const CATEGORY_COLORS: Record<string, string> = {
  frontend: '#3b82f6',
  backend: '#10b981',
  devops: '#f59e0b',
  mobile: '#8b5cf6',
  ai_ml: '#ef4444',
}

export const CATEGORY_LABELS: Record<string, string> = {
  frontend: '프론트엔드',
  backend: '백엔드',
  devops: 'DevOps',
  mobile: '모바일',
  ai_ml: 'AI/ML',
}

// ── ④ 연봉 분포 (Box Plot) ──

export const MOCK_SALARY_BOX: BoxPlotData[] = [
  { label: '프론트엔드', min: 3500, q1: 4800, median: 5800, q3: 7200, max: 10000, outliers: [12000], sampleSize: 89 },
  { label: '백엔드', min: 4000, q1: 5200, median: 6500, q3: 8000, max: 12000, outliers: [15000], sampleSize: 145 },
  { label: 'DevOps', min: 4500, q1: 5800, median: 7000, q3: 8500, max: 11000, outliers: [], sampleSize: 56 },
  { label: '모바일', min: 4000, q1: 5000, median: 6200, q3: 7500, max: 10000, outliers: [], sampleSize: 42 },
  { label: 'AI/ML', min: 4500, q1: 6000, median: 7500, q3: 9500, max: 13000, outliers: [16000], sampleSize: 67 },
  { label: '게임', min: 4500, q1: 5500, median: 7000, q3: 9000, max: 12000, outliers: [15000], sampleSize: 34 },
]

// ── ⑤ 기술 히트맵 (직군 × 기술) ──

export const MOCK_HEATMAP: HeatmapData = {
  rows: ['프론트엔드', '백엔드', 'DevOps', '모바일', 'AI/ML'],
  columns: ['TypeScript', 'React', 'Java', 'Spring', 'Python', 'Kubernetes', 'Docker', 'AWS', 'Go', 'Kotlin'],
  values: [
    { row: '프론트엔드', column: 'TypeScript', value: 85 },
    { row: '프론트엔드', column: 'React', value: 92 },
    { row: '프론트엔드', column: 'Java', value: 5 },
    { row: '프론트엔드', column: 'Spring', value: 2 },
    { row: '프론트엔드', column: 'Python', value: 8 },
    { row: '프론트엔드', column: 'Kubernetes', value: 10 },
    { row: '프론트엔드', column: 'Docker', value: 20 },
    { row: '프론트엔드', column: 'AWS', value: 25 },
    { row: '프론트엔드', column: 'Go', value: 2 },
    { row: '프론트엔드', column: 'Kotlin', value: 3 },

    { row: '백엔드', column: 'TypeScript', value: 30 },
    { row: '백엔드', column: 'React', value: 8 },
    { row: '백엔드', column: 'Java', value: 78 },
    { row: '백엔드', column: 'Spring', value: 72 },
    { row: '백엔드', column: 'Python', value: 35 },
    { row: '백엔드', column: 'Kubernetes', value: 45 },
    { row: '백엔드', column: 'Docker', value: 55 },
    { row: '백엔드', column: 'AWS', value: 60 },
    { row: '백엔드', column: 'Go', value: 18 },
    { row: '백엔드', column: 'Kotlin', value: 25 },

    { row: 'DevOps', column: 'TypeScript', value: 10 },
    { row: 'DevOps', column: 'React', value: 3 },
    { row: 'DevOps', column: 'Java', value: 15 },
    { row: 'DevOps', column: 'Spring', value: 5 },
    { row: 'DevOps', column: 'Python', value: 40 },
    { row: 'DevOps', column: 'Kubernetes', value: 90 },
    { row: 'DevOps', column: 'Docker', value: 88 },
    { row: 'DevOps', column: 'AWS', value: 82 },
    { row: 'DevOps', column: 'Go', value: 35 },
    { row: 'DevOps', column: 'Kotlin', value: 2 },

    { row: '모바일', column: 'TypeScript', value: 25 },
    { row: '모바일', column: 'React', value: 30 },
    { row: '모바일', column: 'Java', value: 20 },
    { row: '모바일', column: 'Spring', value: 3 },
    { row: '모바일', column: 'Python', value: 5 },
    { row: '모바일', column: 'Kubernetes', value: 8 },
    { row: '모바일', column: 'Docker', value: 12 },
    { row: '모바일', column: 'AWS', value: 15 },
    { row: '모바일', column: 'Go', value: 3 },
    { row: '모바일', column: 'Kotlin', value: 65 },

    { row: 'AI/ML', column: 'TypeScript', value: 8 },
    { row: 'AI/ML', column: 'React', value: 5 },
    { row: 'AI/ML', column: 'Java', value: 12 },
    { row: 'AI/ML', column: 'Spring', value: 5 },
    { row: 'AI/ML', column: 'Python', value: 95 },
    { row: 'AI/ML', column: 'Kubernetes', value: 40 },
    { row: 'AI/ML', column: 'Docker', value: 50 },
    { row: 'AI/ML', column: 'AWS', value: 55 },
    { row: 'AI/ML', column: 'Go', value: 8 },
    { row: 'AI/ML', column: 'Kotlin', value: 3 },
  ],
}

// ── ⑧ 신규 공고 추이 (Bar + Line Combo) ──

export const MOCK_NEW_POSTINGS = [
  { date: '02/13', daily: 18, cumulative: 18 },
  { date: '02/14', daily: 24, cumulative: 42 },
  { date: '02/15', daily: 12, cumulative: 54 },
  { date: '02/16', daily: 8, cumulative: 62 },
  { date: '02/17', daily: 22, cumulative: 84 },
  { date: '02/18', daily: 28, cumulative: 112 },
  { date: '02/19', daily: 24, cumulative: 136 },
]

// ── ⑨ 레이더 차트 (내 기술 vs 시장) ──

export const MOCK_RADAR: RadarChartData = {
  axes: ['TypeScript', 'React', 'Node.js', 'Python', 'Docker', 'Kubernetes', 'AWS', 'SQL'],
  series: [
    { name: '시장 요구', values: [75, 80, 60, 70, 65, 50, 72, 55] },
    { name: '내 역량', values: [90, 85, 70, 40, 50, 30, 55, 60] },
  ],
}

// ── ⑩ 워드클라우드 데이터 ──

export const MOCK_WORDCLOUD: WordCloudData = {
  words: [
    { text: 'Java', value: 112, category: 'language' },
    { text: 'React', value: 89, category: 'framework' },
    { text: 'Python', value: 78, category: 'language' },
    { text: 'TypeScript', value: 67, category: 'language' },
    { text: 'Spring', value: 65, category: 'framework' },
    { text: 'Kubernetes', value: 45, category: 'infra' },
    { text: 'Docker', value: 58, category: 'infra' },
    { text: 'AWS', value: 72, category: 'cloud' },
    { text: 'Go', value: 23, category: 'language' },
    { text: 'Node.js', value: 42, category: 'runtime' },
    { text: 'PostgreSQL', value: 38, category: 'database' },
    { text: 'Redis', value: 35, category: 'database' },
    { text: 'Kafka', value: 30, category: 'infra' },
    { text: 'Kotlin', value: 28, category: 'language' },
    { text: 'Next.js', value: 32, category: 'framework' },
    { text: 'Swift', value: 18, category: 'language' },
    { text: 'Rust', value: 8, category: 'language' },
    { text: 'MySQL', value: 40, category: 'database' },
    { text: 'MongoDB', value: 22, category: 'database' },
    { text: 'Terraform', value: 25, category: 'infra' },
    { text: 'NestJS', value: 15, category: 'framework' },
    { text: 'Vue.js', value: 20, category: 'framework' },
    { text: 'Flutter', value: 16, category: 'framework' },
    { text: 'GraphQL', value: 18, category: 'api' },
  ],
}

// ── ③ 기술 순위 변화 (Bump Chart) ──

export const MOCK_BUMP_DATA: BumpChartData[] = [
  { skill: 'Java', rankings: [{ date: '01/06', rank: 1 }, { date: '01/13', rank: 1 }, { date: '01/20', rank: 1 }, { date: '01/27', rank: 1 }, { date: '02/03', rank: 1 }, { date: '02/10', rank: 1 }, { date: '02/17', rank: 1 }, { date: '02/19', rank: 1 }] },
  { skill: 'React', rankings: [{ date: '01/06', rank: 2 }, { date: '01/13', rank: 2 }, { date: '01/20', rank: 3 }, { date: '01/27', rank: 2 }, { date: '02/03', rank: 2 }, { date: '02/10', rank: 2 }, { date: '02/17', rank: 2 }, { date: '02/19', rank: 2 }] },
  { skill: 'Python', rankings: [{ date: '01/06', rank: 3 }, { date: '01/13', rank: 3 }, { date: '01/20', rank: 2 }, { date: '01/27', rank: 3 }, { date: '02/03', rank: 3 }, { date: '02/10', rank: 3 }, { date: '02/17', rank: 3 }, { date: '02/19', rank: 3 }] },
  { skill: 'TypeScript', rankings: [{ date: '01/06', rank: 4 }, { date: '01/13', rank: 4 }, { date: '01/20', rank: 4 }, { date: '01/27', rank: 4 }, { date: '02/03', rank: 4 }, { date: '02/10', rank: 4 }, { date: '02/17', rank: 4 }, { date: '02/19', rank: 4 }] },
  { skill: 'Spring', rankings: [{ date: '01/06', rank: 5 }, { date: '01/13', rank: 5 }, { date: '01/20', rank: 5 }, { date: '01/27', rank: 5 }, { date: '02/03', rank: 6 }, { date: '02/10', rank: 5 }, { date: '02/17', rank: 5 }, { date: '02/19', rank: 5 }] },
  { skill: 'AWS', rankings: [{ date: '01/06', rank: 6 }, { date: '01/13', rank: 6 }, { date: '01/20', rank: 6 }, { date: '01/27', rank: 6 }, { date: '02/03', rank: 5 }, { date: '02/10', rank: 6 }, { date: '02/17', rank: 6 }, { date: '02/19', rank: 6 }] },
  { skill: 'Docker', rankings: [{ date: '01/06', rank: 7 }, { date: '01/13', rank: 7 }, { date: '01/20', rank: 7 }, { date: '01/27', rank: 8 }, { date: '02/03', rank: 7 }, { date: '02/10', rank: 7 }, { date: '02/17', rank: 7 }, { date: '02/19', rank: 7 }] },
  { skill: 'Kubernetes', rankings: [{ date: '01/06', rank: 8 }, { date: '01/13', rank: 8 }, { date: '01/20', rank: 8 }, { date: '01/27', rank: 7 }, { date: '02/03', rank: 8 }, { date: '02/10', rank: 8 }, { date: '02/17', rank: 8 }, { date: '02/19', rank: 8 }] },
]

export const BUMP_COLORS: Record<string, string> = {
  Java: '#e76f00',
  React: '#61dafb',
  Python: '#3776ab',
  TypeScript: '#3178c6',
  Spring: '#6db33f',
  AWS: '#ff9900',
  Docker: '#2496ed',
  Kubernetes: '#326ce5',
}

// ── ⑥ 기업 채용 타임라인 ──

export const MOCK_COMPANY_TIMELINE: CompanyTimelineItem[] = [
  { company: '토스', months: [{ month: '09', count: 5 }, { month: '10', count: 8 }, { month: '11', count: 12 }, { month: '12', count: 6 }, { month: '01', count: 9 }, { month: '02', count: 11 }] },
  { company: '네이버', months: [{ month: '09', count: 15 }, { month: '10', count: 12 }, { month: '11', count: 18 }, { month: '12', count: 10 }, { month: '01', count: 14 }, { month: '02', count: 16 }] },
  { company: '카카오', months: [{ month: '09', count: 10 }, { month: '10', count: 14 }, { month: '11', count: 8 }, { month: '12', count: 12 }, { month: '01', count: 11 }, { month: '02', count: 13 }] },
  { company: '쿠팡', months: [{ month: '09', count: 20 }, { month: '10', count: 18 }, { month: '11', count: 22 }, { month: '12', count: 15 }, { month: '01', count: 19 }, { month: '02', count: 25 }] },
  { company: '배민', months: [{ month: '09', count: 6 }, { month: '10', count: 4 }, { month: '11', count: 7 }, { month: '12', count: 3 }, { month: '01', count: 5 }, { month: '02', count: 8 }] },
  { company: '당근', months: [{ month: '09', count: 3 }, { month: '10', count: 5 }, { month: '11', count: 6 }, { month: '12', count: 4 }, { month: '01', count: 7 }, { month: '02', count: 6 }] },
  { company: '라인', months: [{ month: '09', count: 8 }, { month: '10', count: 10 }, { month: '11', count: 9 }, { month: '12', count: 7 }, { month: '01', count: 11 }, { month: '02', count: 9 }] },
]

// ── ⑦ 기술 조합 네트워크 그래프 ──

export const MOCK_NETWORK: NetworkGraphData = {
  nodes: [
    { id: 'react', label: 'React', size: 89, group: 'frontend' },
    { id: 'typescript', label: 'TypeScript', size: 67, group: 'frontend' },
    { id: 'nextjs', label: 'Next.js', size: 32, group: 'frontend' },
    { id: 'java', label: 'Java', size: 112, group: 'backend' },
    { id: 'spring', label: 'Spring', size: 65, group: 'backend' },
    { id: 'python', label: 'Python', size: 78, group: 'backend' },
    { id: 'nodejs', label: 'Node.js', size: 42, group: 'backend' },
    { id: 'docker', label: 'Docker', size: 58, group: 'infra' },
    { id: 'k8s', label: 'Kubernetes', size: 45, group: 'infra' },
    { id: 'aws', label: 'AWS', size: 72, group: 'infra' },
  ],
  links: [
    { source: 'react', target: 'typescript', strength: 0.9 },
    { source: 'react', target: 'nextjs', strength: 0.7 },
    { source: 'typescript', target: 'nextjs', strength: 0.6 },
    { source: 'typescript', target: 'nodejs', strength: 0.5 },
    { source: 'java', target: 'spring', strength: 0.95 },
    { source: 'java', target: 'docker', strength: 0.4 },
    { source: 'spring', target: 'docker', strength: 0.5 },
    { source: 'spring', target: 'k8s', strength: 0.4 },
    { source: 'python', target: 'docker', strength: 0.5 },
    { source: 'python', target: 'aws', strength: 0.4 },
    { source: 'docker', target: 'k8s', strength: 0.85 },
    { source: 'docker', target: 'aws', strength: 0.6 },
    { source: 'k8s', target: 'aws', strength: 0.7 },
    { source: 'nodejs', target: 'docker', strength: 0.3 },
    { source: 'nodejs', target: 'aws', strength: 0.3 },
  ],
}

// ── ⑪ 경력별 기술 Sankey ──

export const MOCK_SANKEY: SankeyData = {
  nodes: [
    { id: 'exp-junior', label: '신입 (0~2년)' },
    { id: 'exp-mid', label: '주니어 (3~5년)' },
    { id: 'exp-senior', label: '시니어 (6~10년)' },
    { id: 'exp-lead', label: '리드 (10년+)' },
    { id: 'sk-java', label: 'Java' },
    { id: 'sk-python', label: 'Python' },
    { id: 'sk-react', label: 'React' },
    { id: 'sk-spring', label: 'Spring' },
    { id: 'sk-k8s', label: 'Kubernetes' },
    { id: 'sk-aws', label: 'AWS' },
  ],
  links: [
    { source: 'exp-junior', target: 'sk-java', value: 45 },
    { source: 'exp-junior', target: 'sk-python', value: 35 },
    { source: 'exp-junior', target: 'sk-react', value: 40 },
    { source: 'exp-mid', target: 'sk-java', value: 60 },
    { source: 'exp-mid', target: 'sk-spring', value: 50 },
    { source: 'exp-mid', target: 'sk-react', value: 35 },
    { source: 'exp-mid', target: 'sk-python', value: 30 },
    { source: 'exp-senior', target: 'sk-spring', value: 40 },
    { source: 'exp-senior', target: 'sk-k8s', value: 35 },
    { source: 'exp-senior', target: 'sk-aws', value: 45 },
    { source: 'exp-senior', target: 'sk-java', value: 30 },
    { source: 'exp-lead', target: 'sk-k8s', value: 25 },
    { source: 'exp-lead', target: 'sk-aws', value: 30 },
    { source: 'exp-lead', target: 'sk-spring', value: 20 },
  ],
}

// ── ⑫ 채용 지역 지도 ──

export const MOCK_REGION_MAP: MapChartData = {
  regions: [
    { code: 'seoul', name: '서울', value: 485, coordinates: [126.978, 37.5665] },
    { code: 'pangyo', name: '판교/분당', value: 142, coordinates: [127.112, 37.3943] },
    { code: 'incheon', name: '인천', value: 35, coordinates: [126.7052, 37.4563] },
    { code: 'busan', name: '부산', value: 42, coordinates: [129.0756, 35.1796] },
    { code: 'daejeon', name: '대전', value: 28, coordinates: [127.3845, 36.3504] },
    { code: 'daegu', name: '대구', value: 18, coordinates: [128.6014, 35.8714] },
    { code: 'gwangju', name: '광주', value: 12, coordinates: [126.8526, 35.1595] },
    { code: 'jeju', name: '제주', value: 8, coordinates: [126.5312, 33.4996] },
    { code: 'remote', name: '원격', value: 95, coordinates: [128.0, 36.5] },
  ],
}
