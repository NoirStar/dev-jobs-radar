// ============================================================
// 기술 스택 추출 엔진
// — 공고 텍스트에서 기술 키워드를 자동 추출 & 정규화
// ============================================================

import { ALIAS_TO_SKILL, SKILL_TO_CATEGORY } from '@/data/skills'

/** 추출 결과 */
export interface ExtractedSkill {
  /** 정규화된 기술명 */
  name: string
  /** 카테고리 */
  category: string
  /** 원문에서 매칭된 텍스트 */
  matched: string
}

/**
 * 텍스트에서 기술 키워드를 추출하고 정규화합니다.
 *
 * 1. 소스에서 제공하는 태그가 있으면 먼저 처리
 * 2. 공고 본문에서 패턴 매칭으로 추가 추출
 * 3. 중복 제거 후 정규화된 목록 반환
 */
export function extractSkills(
  text: string,
  tags: string[] = [],
): ExtractedSkill[] {
  const found = new Map<string, ExtractedSkill>()

  // 1. 소스 태그 처리
  for (const tag of tags) {
    const normalized = resolveSkillName(tag)
    if (normalized && !found.has(normalized)) {
      found.set(normalized, {
        name: normalized,
        category: SKILL_TO_CATEGORY.get(normalized) ?? 'etc',
        matched: tag,
      })
    }
  }

  // 2. 본문 텍스트에서 추출
  if (text) {
    const lowerText = ` ${text.toLowerCase()} `

    for (const [alias, name] of ALIAS_TO_SKILL.entries()) {
      if (found.has(name)) continue

      // 정확한 단어 경계 매칭 (특수문자 포함 키워드 지원)
      const escapedAlias = escapeRegex(alias)
      const pattern = new RegExp(`(?<=[\\s,;/()\\[\\]|·•&+#]|^)${escapedAlias}(?=[\\s,;/()\\[\\]|·•&+#.]|$)`, 'i')

      if (pattern.test(lowerText)) {
        found.set(name, {
          name,
          category: SKILL_TO_CATEGORY.get(name) ?? 'etc',
          matched: alias,
        })
      }
    }
  }

  return Array.from(found.values())
}

/**
 * 단일 키워드를 정규화된 기술명으로 변환합니다.
 * 별칭, 대소문자 무관하게 매칭합니다.
 */
export function resolveSkillName(raw: string): string | null {
  const lower = raw.toLowerCase().trim()
  return ALIAS_TO_SKILL.get(lower) ?? null
}

/**
 * 기술명 목록만 추출합니다. (간단 버전)
 */
export function extractSkillNames(text: string, tags: string[] = []): string[] {
  return extractSkills(text, tags).map((s) => s.name)
}

/** 정규식 특수문자 이스케이프 */
function escapeRegex(str: string): string {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}
