// ============================================================
// 연봉 파싱 엔진
// — 다양한 형식의 연봉 텍스트를 구조화된 데이터로 변환
// ============================================================

export interface ParsedSalary {
  min: number | null
  max: number | null
  /** 'KRW' | 'USD' | 'JPY' */
  currency: string
  /** 원문 텍스트 */
  text: string
}

/**
 * 연봉 텍스트를 파싱합니다.
 *
 * 지원 형식:
 * - "4,000만원 ~ 6,000만원"
 * - "연봉 5000~7000만원"
 * - "월 400만원"
 * - "3,600 ~ 5,400만원"
 * - "회사내규에 따름" / "면접 후 결정" / "협의"
 * - "$80,000 - $120,000"
 * - "80K - 120K USD"
 */
export function parseSalary(text: string | undefined | null): ParsedSalary | null {
  if (!text) return null

  const trimmed = text.trim()
  if (!trimmed) return null

  // "협의", "면접 후 결정", "회사내규" 등 → null
  if (/협의|면접.*결정|내규|추후|비공개|미정/i.test(trimmed)) {
    return null
  }

  // USD 파싱: "$80,000 - $120,000" or "80K - 120K"
  const usdMatch = trimmed.match(
    /\$?\s*([\d,]+)\s*[kK]?\s*[-~]\s*\$?\s*([\d,]+)\s*[kK]?/,
  )
  if (usdMatch && /\$|usd|USD/.test(trimmed)) {
    let min = parseNumber(usdMatch[1])
    let max = parseNumber(usdMatch[2])
    if (/[kK]/.test(trimmed)) {
      min *= 1000
      max *= 1000
    }
    return { min, max, currency: 'USD', text: trimmed }
  }

  // KRW 파싱
  // 범위: "4,000만원 ~ 6,000만원", "4000~6000만원", "4,000 ~ 6,000"
  const krwRangeMatch = trimmed.match(
    /([\d,]+)\s*만?\s*원?\s*[-~]\s*([\d,]+)\s*만?\s*원?/,
  )
  if (krwRangeMatch) {
    let min = parseNumber(krwRangeMatch[1])
    let max = parseNumber(krwRangeMatch[2])

    // "만원" 단위 여부 판별
    if (/만/.test(trimmed) || min < 10000) {
      min *= 10000
      max *= 10000
    }

    return { min, max, currency: 'KRW', text: trimmed }
  }

  // 단일 값: "연봉 5000만원" or "월 400만원"
  const singleMatch = trimmed.match(/([\d,]+)\s*만?\s*원/)
  if (singleMatch) {
    let value = parseNumber(singleMatch[1])
    if (/만/.test(trimmed) || value < 50000) {
      value *= 10000
    }

    // 월급인 경우 연봉으로 변환
    if (/월/.test(trimmed)) {
      value *= 12
    }

    return { min: value, max: null, currency: 'KRW', text: trimmed }
  }

  return null
}

/**
 * 연봉을 읽기 좋은 형식으로 변환합니다.
 */
export function formatSalary(salary: ParsedSalary): string {
  if (salary.currency === 'KRW') {
    const min = salary.min ? `${Math.round(salary.min / 10000)}만원` : ''
    const max = salary.max ? `${Math.round(salary.max / 10000)}만원` : ''
    if (min && max) return `${min} ~ ${max}`
    return min || max || salary.text
  }

  if (salary.currency === 'USD') {
    const fmt = (n: number) => `$${n.toLocaleString()}`
    const min = salary.min ? fmt(salary.min) : ''
    const max = salary.max ? fmt(salary.max) : ''
    if (min && max) return `${min} ~ ${max}`
    return min || max || salary.text
  }

  return salary.text
}

/** 숫자 파싱 (콤마 제거) */
function parseNumber(str: string): number {
  return parseInt(str.replace(/,/g, ''), 10) || 0
}
