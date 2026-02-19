// ============================================================
// 기업 관련 공유 라벨 상수
// ============================================================

import type { CompanySize, IndustryType } from '@/types/company'

/** 기업 규모 라벨 */
export const SIZE_LABELS: Record<CompanySize, string> = {
  startup: '스타트업 (~50명)',
  small: '중소기업 (50~200명)',
  medium: '중견기업 (200~1,000명)',
  large: '대기업 (1,000~5,000명)',
  enterprise: '대기업+ (5,000명+)',
  unknown: '-',
}

/** 기업 규모 짧은 라벨 */
export const SIZE_SHORT_LABELS: Record<CompanySize, string> = {
  startup: '스타트업',
  small: '중소',
  medium: '중견',
  large: '대기업',
  enterprise: '대기업+',
  unknown: '-',
}

/** 산업 분류 라벨 */
export const INDUSTRY_LABELS: Record<IndustryType, string> = {
  platform: '플랫폼',
  ecommerce: '커머스',
  fintech: '핀테크',
  gaming: '게임',
  enterprise_si: 'SI/솔루션',
  telecom: '통신',
  social: '소셜/미디어',
  mobility: '모빌리티',
  healthcare: '헬스케어',
  edtech: '에듀테크',
  ai: 'AI/딥테크',
  security: '보안',
  blockchain: '블록체인',
  saas: 'SaaS/B2B',
  media: '미디어',
  public: '공공',
  other: '기타',
}
