// ============================================================
// 회사명 정규화 엔진
// — 다양한 표기의 회사명을 통일된 이름으로 매칭
// ============================================================

import { COMPANY_MAP, COMPANY_SEEDS } from '@/data/companies'

/**
 * 회사명을 정규화합니다.
 *
 * 매칭 우선순위:
 * 1. ID 정확히 일치
 * 2. name / nameEn 정확 매칭
 * 3. 포함 매칭 (contains)
 * 4. 원문 정리 후 반환
 */
export function normalizeCompanyName(rawName: string): string {
  const trimmed = rawName.trim()
  if (!trimmed) return trimmed

  // 1. 정확히 일치
  const exactById = COMPANY_MAP.get(trimmed.toLowerCase())
  if (exactById) return exactById.name

  // 2. name / nameEn 정확 매칭
  for (const company of COMPANY_SEEDS) {
    if (
      company.name === trimmed ||
      company.nameEn?.toLowerCase() === trimmed.toLowerCase()
    ) {
      return company.name
    }
  }

  // 3. 포함 매칭 (짧은 이름이 긴 이름에 포함)
  const lower = trimmed.toLowerCase()
  for (const company of COMPANY_SEEDS) {
    const nameLower = company.name.toLowerCase()
    const enLower = company.nameEn?.toLowerCase() ?? ''

    if (
      (lower.includes(nameLower) && nameLower.length >= 2) ||
      (enLower && lower.includes(enLower) && enLower.length >= 3)
    ) {
      return company.name
    }
  }

  // 5. 앞뒤 (주), 주식회사, Inc., Corp. 등 제거 후 반환
  return cleanCompanyName(trimmed)
}

/**
 * 회사명에서 법인 접미사를 제거합니다.
 */
export function cleanCompanyName(name: string): string {
  return name
    .replace(/\(주\)|\(유\)|주식회사|㈜/g, '')
    .replace(/,?\s*(Inc\.?|Corp\.?|Co\.?,?\s*Ltd\.?|LLC|Ltd\.?|GmbH|S\.?A\.?|PLC)$/i, '')
    .trim()
}
