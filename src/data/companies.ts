// ============================================================
// 기업 시드 데이터 — 45개+ 주요 IT 기업 기본 정보
// ============================================================

import type { CompanySummary, IndustryType, CompanySize } from '@/types/company'

export interface CompanySeed {
  id: string
  name: string
  nameEn: string | null
  industry: IndustryType
  size: CompanySize
  location: string
  careerUrl: string
  techStack: string[]
}

export const COMPANY_SEEDS: CompanySeed[] = [
  // ── 플랫폼 / 빅테크 ──
  { id: 'naver', name: '네이버', nameEn: 'NAVER', industry: 'platform', size: 'enterprise', location: '경기 성남', careerUrl: 'https://recruit.navercorp.com', techStack: ['Java', 'Spring', 'React', 'Kubernetes'] },
  { id: 'kakao', name: '카카오', nameEn: 'Kakao', industry: 'platform', size: 'enterprise', location: '경기 성남', careerUrl: 'https://careers.kakao.com', techStack: ['Java', 'Spring', 'Kotlin', 'React'] },
  { id: 'line', name: '라인', nameEn: 'LINE', industry: 'platform', size: 'enterprise', location: '경기 성남', careerUrl: 'https://careers.linecorp.com', techStack: ['Java', 'Kotlin', 'Spring', 'Kubernetes'] },
  { id: 'coupang', name: '쿠팡', nameEn: 'Coupang', industry: 'ecommerce', size: 'enterprise', location: '서울 송파', careerUrl: 'https://www.coupang.jobs', techStack: ['Java', 'Spring', 'AWS', 'React'] },
  { id: 'woowa', name: '우아한형제들', nameEn: 'Woowa Brothers', industry: 'platform', size: 'large', location: '서울 송파', careerUrl: 'https://career.woowahan.com', techStack: ['Java', 'Spring', 'Kotlin', 'React'] },
  { id: 'toss', name: '토스', nameEn: 'Toss', industry: 'fintech', size: 'large', location: '서울 강남', careerUrl: 'https://toss.im/career', techStack: ['Kotlin', 'Spring', 'React', 'TypeScript'] },
  { id: 'daangn', name: '당근', nameEn: 'Karrot', industry: 'platform', size: 'large', location: '서울 서초', careerUrl: 'https://about.daangn.com/jobs', techStack: ['Go', 'Kotlin', 'React', 'Kubernetes'] },

  // ── 핀테크 ──
  { id: 'kakaopay', name: '카카오페이', nameEn: 'KakaoPay', industry: 'fintech', size: 'large', location: '경기 성남', careerUrl: 'https://careers.kakaopay.com', techStack: ['Java', 'Spring', 'React', 'Kafka'] },
  { id: 'kakaaobank', name: '카카오뱅크', nameEn: 'KakaoBank', industry: 'fintech', size: 'large', location: '경기 성남', careerUrl: 'https://www.kakaobank.com/careers', techStack: ['Java', 'Spring', 'MSA'] },
  { id: 'banksalad', name: '뱅크샐러드', nameEn: 'Banksalad', industry: 'fintech', size: 'medium', location: '서울 강남', careerUrl: 'https://careers.banksalad.com', techStack: ['Kotlin', 'Go', 'React', 'AWS'] },

  // ── 커머스 ──
  { id: 'naver_shopping', name: '네이버 쇼핑', nameEn: 'NAVER Shopping', industry: 'ecommerce', size: 'enterprise', location: '경기 성남', careerUrl: 'https://recruit.navercorp.com', techStack: ['Java', 'Spring', 'React'] },
  { id: 'ssg', name: 'SSG닷컴', nameEn: 'SSG.COM', industry: 'ecommerce', size: 'large', location: '서울 강남', careerUrl: 'https://www.ssg.com/recruit', techStack: ['Java', 'Spring', 'Vue'] },
  { id: 'musinsa', name: '무신사', nameEn: 'MUSINSA', industry: 'ecommerce', size: 'large', location: '서울 성동', careerUrl: 'https://career.musinsa.com', techStack: ['Java', 'Spring', 'React', 'AWS'] },
  { id: 'kurly', name: '컬리', nameEn: 'Kurly', industry: 'ecommerce', size: 'large', location: '서울 강남', careerUrl: 'https://www.kurly.com/careers', techStack: ['Java', 'Kotlin', 'React'] },
  { id: 'zigzag', name: '지그재그', nameEn: 'Zigzag', industry: 'ecommerce', size: 'medium', location: '서울 강남', careerUrl: 'https://zigzag.kr/career', techStack: ['Kotlin', 'React', 'AWS'] },

  // ── 소셜 / 미디어 ──
  { id: 'snow', name: 'SNOW', nameEn: 'SNOW', industry: 'social', size: 'large', location: '경기 성남', careerUrl: 'https://careers.snowcorp.com', techStack: ['Python', 'C++', 'React', 'AI'] },
  { id: 'hyperconnect', name: '하이퍼커넥트', nameEn: 'Hyperconnect', industry: 'social', size: 'medium', location: '서울 서초', careerUrl: 'https://career.hyperconnect.com', techStack: ['Kotlin', 'Go', 'React', 'AI'] },

  // ── 모빌리티 ──
  { id: 'kakaomobility', name: '카카오모빌리티', nameEn: 'Kakao Mobility', industry: 'mobility', size: 'large', location: '경기 성남', careerUrl: 'https://kakaomobility.com/careers', techStack: ['Java', 'Kotlin', 'React', 'Kubernetes'] },
  { id: 'yanolja', name: '야놀자', nameEn: 'Yanolja', industry: 'platform', size: 'large', location: '서울 강남', careerUrl: 'https://careers.yanolja.co', techStack: ['Java', 'Spring', 'React', 'AWS'] },

  // ── AI / 딥테크 ──
  { id: 'upstage', name: '업스테이지', nameEn: 'Upstage', industry: 'ai', size: 'medium', location: '경기 성남', careerUrl: 'https://upstage.ai/careers', techStack: ['Python', 'PyTorch', 'LLM', 'Kubernetes'] },
  { id: 'moloco', name: '몰로코', nameEn: 'Moloco', industry: 'ai', size: 'medium', location: '서울 강남', careerUrl: 'https://www.moloco.com/careers', techStack: ['Go', 'Python', 'ML', 'AWS'] },
  { id: 'scatter_lab', name: '스캐터랩', nameEn: 'Scatter Lab', industry: 'ai', size: 'small', location: '서울 강남', careerUrl: 'https://scatterlab.co.kr/careers', techStack: ['Python', 'PyTorch', 'LLM'] },
  { id: 'lunit', name: '루닛', nameEn: 'Lunit', industry: 'ai', size: 'medium', location: '서울 강남', careerUrl: 'https://lunit.io/careers', techStack: ['Python', 'PyTorch', 'Computer Vision'] },

  // ── SaaS / B2B ──
  { id: 'sendbird', name: '센드버드', nameEn: 'Sendbird', industry: 'saas', size: 'medium', location: '서울 강남', careerUrl: 'https://sendbird.com/careers', techStack: ['Java', 'Kotlin', 'Go', 'React'] },
  { id: 'channel', name: '채널톡', nameEn: 'Channel Corp', industry: 'saas', size: 'medium', location: '서울 강남', careerUrl: 'https://channel.io/careers', techStack: ['Kotlin', 'React', 'TypeScript'] },
  { id: 'flex', name: 'flex', nameEn: 'flex', industry: 'saas', size: 'small', location: '서울 강남', careerUrl: 'https://flex.team/careers', techStack: ['TypeScript', 'React', 'Node.js'] },
  { id: 'dunamu', name: '두나무', nameEn: 'Dunamu', industry: 'fintech', size: 'large', location: '서울 강남', careerUrl: 'https://dunamu.com/careers', techStack: ['Java', 'Spring', 'React', 'Kafka'] },

  // ── 대기업 / SI ──
  { id: 'samsungsds', name: '삼성SDS', nameEn: 'Samsung SDS', industry: 'enterprise_si', size: 'enterprise', location: '서울 송파', careerUrl: 'https://www.samsungsds.com/careers', techStack: ['Java', 'Spring', 'AWS', 'Kubernetes'] },
  { id: 'lgcns', name: 'LG CNS', nameEn: 'LG CNS', industry: 'enterprise_si', size: 'enterprise', location: '서울 마포', careerUrl: 'https://www.lgcns.com/careers', techStack: ['Java', 'Spring', 'AWS'] },
  { id: 'skcc', name: 'SK C&C', nameEn: 'SK C&C', industry: 'enterprise_si', size: 'enterprise', location: '경기 성남', careerUrl: 'https://www.skcc.co.kr/recruit', techStack: ['Java', 'Spring', 'MSA'] },
  { id: 'nhn', name: 'NHN', nameEn: 'NHN', industry: 'platform', size: 'large', location: '경기 성남', careerUrl: 'https://recruit.nhn.com', techStack: ['Java', 'Spring', 'Vue', 'AWS'] },
  { id: 'kakaoenterprise', name: '카카오엔터프라이즈', nameEn: 'Kakao Enterprise', industry: 'enterprise_si', size: 'large', location: '경기 성남', careerUrl: 'https://careers.kakaoenterprise.com', techStack: ['Java', 'Go', 'Kubernetes'] },
  { id: 'hancom', name: '한컴', nameEn: 'Hancom', industry: 'enterprise_si', size: 'large', location: '경기 성남', careerUrl: 'https://www.hancom.com/careers', techStack: ['C++', 'Java', 'Python'] },

  // ── 게임 ──
  { id: 'nexon', name: '넥슨', nameEn: 'Nexon', industry: 'gaming', size: 'enterprise', location: '경기 성남', careerUrl: 'https://career.nexon.com', techStack: ['C++', 'C#', 'Unity', 'Unreal'] },
  { id: 'krafton', name: '크래프톤', nameEn: 'KRAFTON', industry: 'gaming', size: 'large', location: '경기 성남', careerUrl: 'https://careers.krafton.com', techStack: ['C++', 'Unreal', 'Go', 'AWS'] },
  { id: 'ncsoft', name: '엔씨소프트', nameEn: 'NCSoft', industry: 'gaming', size: 'enterprise', location: '경기 성남', careerUrl: 'https://careers.ncsoft.com', techStack: ['C++', 'Java', 'AI', 'Unreal'] },
  { id: 'netmarble', name: '넷마블', nameEn: 'Netmarble', industry: 'gaming', size: 'enterprise', location: '서울 구로', careerUrl: 'https://company.netmarble.com/careers', techStack: ['C++', 'Unity', 'Java'] },
  { id: 'smilegate', name: '스마일게이트', nameEn: 'Smilegate', industry: 'gaming', size: 'large', location: '경기 성남', careerUrl: 'https://careers.smilegate.com', techStack: ['C++', 'Unreal', 'React'] },
  { id: 'pearl_abyss', name: '펄어비스', nameEn: 'Pearl Abyss', industry: 'gaming', size: 'large', location: '경기 안양', careerUrl: 'https://careers.pearlabyss.com', techStack: ['C++', 'Unreal'] },
  { id: 'com2us', name: '컴투스', nameEn: 'Com2uS', industry: 'gaming', size: 'large', location: '서울 금천', careerUrl: 'https://com2us.com/careers', techStack: ['C++', 'Unity', 'Java'] },
  { id: 'devsisters', name: '데브시스터즈', nameEn: 'Devsisters', industry: 'gaming', size: 'medium', location: '서울 금천', careerUrl: 'https://careers.devsisters.com', techStack: ['Unity', 'C#', 'Go', 'Kubernetes'] },
  { id: 'kakaogames', name: '카카오게임즈', nameEn: 'Kakao Games', industry: 'gaming', size: 'large', location: '경기 성남', careerUrl: 'https://kakaogames.com/careers', techStack: ['C++', 'Unity', 'Java'] },

  // ── 통신 / 공공 ──
  { id: 'kt', name: 'KT', nameEn: 'KT', industry: 'telecom', size: 'enterprise', location: '서울 종로', careerUrl: 'https://recruit.kt.com', techStack: ['Java', 'Spring', 'AI', 'Cloud'] },
  { id: 'skt', name: 'SK텔레콤', nameEn: 'SK Telecom', industry: 'telecom', size: 'enterprise', location: '서울 중구', careerUrl: 'https://www.sktelecom.com/careers', techStack: ['Java', 'AI', 'Cloud', '5G'] },
  { id: 'lgu', name: 'LG유플러스', nameEn: 'LG Uplus', industry: 'telecom', size: 'enterprise', location: '서울 용산', careerUrl: 'https://www.lguplus.com/careers', techStack: ['Java', 'Spring', 'AI'] },
  { id: 'kisa', name: 'KISA', nameEn: 'KISA', industry: 'public', size: 'medium', location: '전남 나주', careerUrl: 'https://www.kisa.or.kr/recruit', techStack: ['보안', 'Java', 'Python'] },
]

/** 기업 ID → 기업 정보 맵 */
export const COMPANY_MAP = new Map(COMPANY_SEEDS.map((c) => [c.id, c]))

/** 기업명으로 검색 */
export function findCompanyByName(name: string): CompanySeed | undefined {
  const lower = name.toLowerCase()
  return COMPANY_SEEDS.find(
    (c) =>
      c.name.toLowerCase().includes(lower) ||
      (c.nameEn && c.nameEn.toLowerCase().includes(lower)),
  )
}

/** 산업별 기업 그룹 */
export function getCompaniesByIndustry(industry: IndustryType): CompanySeed[] {
  return COMPANY_SEEDS.filter((c) => c.industry === industry)
}

/** 총 기업 수 */
export const TOTAL_COMPANIES = COMPANY_SEEDS.length
