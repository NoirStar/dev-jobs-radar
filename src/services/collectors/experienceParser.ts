// ============================================================
// 경력 조건 파서
// — 공고의 경력 요구사항을 구조화
// ============================================================

import type { ExperienceLevel } from '@/types/job'

export interface ParsedExperience {
  level: ExperienceLevel
  minYears: number | null
  maxYears: number | null
  text: string
}

/**
 * 경력 텍스트를 파싱합니다.
 *
 * 지원 형식:
 * - "신입"
 * - "경력 3~5년"
 * - "3년 이상"
 * - "경력무관"
 * - "Junior / Senior / Lead"
 */
export function parseExperience(text: string | undefined | null): ParsedExperience {
  const DEFAULT: ParsedExperience = {
    level: 'any',
    minYears: null,
    maxYears: null,
    text: text?.trim() || '경력무관',
  }

  if (!text) return DEFAULT

  const trimmed = text.trim().toLowerCase()

  // 경력무관
  if (/무관|관계없|불문|any/.test(trimmed)) {
    return { ...DEFAULT, level: 'any' }
  }

  // 신입
  if (/신입|new|fresh|junior|entry|인턴/.test(trimmed)) {
    // "신입~경력" 또는 "신입/경력"
    if (/경력|senior|mid/.test(trimmed)) {
      return { ...DEFAULT, level: 'any' }
    }
    return { ...DEFAULT, level: 'junior', minYears: 0, maxYears: 2 }
  }

  // 범위: "3~5년", "3-5년", "3년~5년"
  const rangeMatch = trimmed.match(/(\d+)\s*[-~]\s*(\d+)\s*년/)
  if (rangeMatch) {
    const min = parseInt(rangeMatch[1], 10)
    const max = parseInt(rangeMatch[2], 10)
    return {
      level: categorizeByYears(min),
      minYears: min,
      maxYears: max,
      text: text.trim(),
    }
  }

  // "N년 이상"
  const minMatch = trimmed.match(/(\d+)\s*년\s*(이상|↑|\+)/)
  if (minMatch) {
    const min = parseInt(minMatch[1], 10)
    return {
      level: categorizeByYears(min),
      minYears: min,
      maxYears: null,
      text: text.trim(),
    }
  }

  // "N년 이하"
  const maxMatch = trimmed.match(/(\d+)\s*년\s*(이하|↓|미만)/)
  if (maxMatch) {
    const max = parseInt(maxMatch[1], 10)
    return {
      level: categorizeByYears(0),
      minYears: null,
      maxYears: max,
      text: text.trim(),
    }
  }

  // 단순 숫자 "경력 5년"
  const singleMatch = trimmed.match(/(\d+)\s*년/)
  if (singleMatch) {
    const years = parseInt(singleMatch[1], 10)
    return {
      level: categorizeByYears(years),
      minYears: years,
      maxYears: null,
      text: text.trim(),
    }
  }

  // Senior / Lead 등
  if (/senior|시니어|lead|리드|수석|책임/.test(trimmed)) {
    return { ...DEFAULT, level: 'senior' }
  }
  if (/mid|미드|주니어|junior|대리/.test(trimmed)) {
    return { ...DEFAULT, level: 'mid' }
  }

  return DEFAULT
}

/** 경력 연차로 레벨 분류 */
function categorizeByYears(years: number): ExperienceLevel {
  if (years <= 2) return 'junior'
  if (years <= 6) return 'mid'
  if (years <= 12) return 'senior'
  return 'lead'
}
