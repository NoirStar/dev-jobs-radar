// ============================================================
// 수집 소스 메타데이터
// ============================================================

import type { SourceId, SourceTier } from '@/types/job'

export interface SourceInfo {
  id: SourceId
  name: string
  nameEn: string
  tier: SourceTier
  url: string
  collectMethod: 'api' | 'crawling' | 'rss' | 'hybrid'
  intervalMinutes: number
  description: string
  isActive: boolean
}

export const SOURCES: SourceInfo[] = [
  // ── Tier 1 ──
  { id: 'wanted', name: '원티드', nameEn: 'Wanted', tier: 'tier1', url: 'https://www.wanted.co.kr', collectMethod: 'hybrid', intervalMinutes: 60, description: 'IT 직군 채용공고, 회사 정보, 기술 스택, 연봉 범위', isActive: true },
  { id: 'saramin', name: '사람인', nameEn: 'Saramin', tier: 'tier1', url: 'https://www.saramin.co.kr', collectMethod: 'hybrid', intervalMinutes: 60, description: '공고 제목, 회사, 경력 조건, 기술 스택, 지역', isActive: true },
  { id: 'jobkorea', name: '잡코리아', nameEn: 'JobKorea', tier: 'tier1', url: 'https://www.jobkorea.co.kr', collectMethod: 'crawling', intervalMinutes: 60, description: 'IT/개발 공고, 경력/신입, 연봉 정보', isActive: true },
  { id: 'programmers', name: '프로그래머스', nameEn: 'Programmers', tier: 'tier1', url: 'https://career.programmers.co.kr', collectMethod: 'crawling', intervalMinutes: 60, description: '개발자 특화 공고, 기술 태그, 코딩테스트', isActive: true },
  { id: 'jumpit', name: '점핏', nameEn: 'Jumpit', tier: 'tier1', url: 'https://www.jumpit.co.kr', collectMethod: 'crawling', intervalMinutes: 60, description: '개발자 채용, 기술 스택, 회사 규모, 연봉', isActive: true },

  // ── Tier 2 ──
  { id: 'rallit', name: '랠릿', nameEn: 'Rallit', tier: 'tier2', url: 'https://www.rallit.com', collectMethod: 'crawling', intervalMinutes: 60, description: '개발자 이력서 매칭 공고, 기술 스택', isActive: false },
  { id: 'rocketpunch', name: '로켓펀치', nameEn: 'RocketPunch', tier: 'tier2', url: 'https://www.rocketpunch.com', collectMethod: 'crawling', intervalMinutes: 120, description: '스타트업 채용, 회사 정보, 투자 단계', isActive: false },
  { id: 'indeed', name: '인디드 코리아', nameEn: 'Indeed Korea', tier: 'tier2', url: 'https://kr.indeed.com', collectMethod: 'crawling', intervalMinutes: 120, description: 'IT 채용 통합 검색, 급여 정보', isActive: false },
  { id: 'blind', name: '블라인드', nameEn: 'Blind', tier: 'tier2', url: 'https://www.teamblind.com', collectMethod: 'crawling', intervalMinutes: 120, description: '현직자 리뷰, 채용 정보, 연봉 데이터', isActive: false },
  { id: 'catch', name: '캐치', nameEn: 'Catch', tier: 'tier2', url: 'https://www.catch.co.kr', collectMethod: 'crawling', intervalMinutes: 240, description: '채용공고, 기업 리뷰, 면접 후기', isActive: false },
  { id: 'jobplanet', name: '잡플래닛', nameEn: 'JobPlanet', tier: 'tier2', url: 'https://www.jobplanet.co.kr', collectMethod: 'crawling', intervalMinutes: 120, description: '기업 리뷰, 연봉 정보, 면접 후기', isActive: false },
  { id: 'okky', name: 'OKKY', nameEn: 'OKKY', tier: 'tier2', url: 'https://okky.kr', collectMethod: 'crawling', intervalMinutes: 120, description: '개발자 커뮤니티 채용 게시판', isActive: false },
  { id: 'disquiet', name: '디스콰이엇', nameEn: 'Disquiet', tier: 'tier2', url: 'https://disquiet.io', collectMethod: 'crawling', intervalMinutes: 240, description: 'IT 사이드 프로젝트 & 스타트업 채용', isActive: false },
  { id: 'careerly', name: '커리어리', nameEn: 'Careerly', tier: 'tier2', url: 'https://careerly.co.kr', collectMethod: 'crawling', intervalMinutes: 240, description: '개발자 네트워크 채용 정보', isActive: false },
  { id: 'worknet', name: '워크넷', nameEn: 'WorkNet', tier: 'tier2', url: 'https://www.work.go.kr', collectMethod: 'api', intervalMinutes: 120, description: '공공 채용 데이터, IT 직종 필터', isActive: false },
  { id: 'peoplenjob', name: '피플앤잡', nameEn: 'PeopleNJob', tier: 'tier2', url: 'https://www.peoplenjob.com', collectMethod: 'crawling', intervalMinutes: 240, description: 'IT 채용 정보, 헤드헌팅 공고', isActive: false },

  // ── Tier 3 ──
  { id: 'linkedin', name: '링크드인', nameEn: 'LinkedIn', tier: 'tier3', url: 'https://www.linkedin.com/jobs', collectMethod: 'hybrid', intervalMinutes: 120, description: '글로벌/한국 IT 채용, 기술 요구사항', isActive: false },
  { id: 'glassdoor', name: '글래스도어', nameEn: 'Glassdoor', tier: 'tier3', url: 'https://www.glassdoor.com', collectMethod: 'crawling', intervalMinutes: 240, description: '글로벌 채용, 연봉 데이터, 기업 리뷰', isActive: false },
  { id: 'wellfound', name: '웰파운드', nameEn: 'Wellfound', tier: 'tier3', url: 'https://wellfound.com', collectMethod: 'api', intervalMinutes: 240, description: '스타트업 채용, 해외 원격 근무', isActive: false },
  { id: 'remoteok', name: 'Remote OK', nameEn: 'Remote OK', tier: 'tier3', url: 'https://remoteok.com', collectMethod: 'api', intervalMinutes: 240, description: '원격 근무 IT 채용', isActive: false },
  { id: 'wwr', name: 'WWR', nameEn: 'We Work Remotely', tier: 'tier3', url: 'https://weworkremotely.com', collectMethod: 'crawling', intervalMinutes: 240, description: '원격 근무 프리미엄 채용', isActive: false },
  { id: 'stackoverflow', name: 'SO Jobs', nameEn: 'Stack Overflow Jobs', tier: 'tier3', url: 'https://stackoverflow.com/jobs', collectMethod: 'crawling', intervalMinutes: 240, description: '개발자 특화 글로벌 채용', isActive: false },
]

/** 소스 ID → 소스 정보 맵 */
export const SOURCE_MAP = new Map(SOURCES.map((s) => [s.id, s]))

/** 활성 소스만 */
export const ACTIVE_SOURCES = SOURCES.filter((s) => s.isActive)

/** Tier별 소스 목록 */
export function getSourcesByTier(tier: SourceTier): SourceInfo[] {
  return SOURCES.filter((s) => s.tier === tier)
}

/** 총 소스 수 */
export const TOTAL_SOURCES = SOURCES.length
