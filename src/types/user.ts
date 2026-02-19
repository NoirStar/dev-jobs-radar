// ============================================================
// 사용자 관련 타입 정의
// ============================================================

import type { JobCategory } from './job'

/** 알림 유형 */
export type AlertType = 'company_new' | 'keyword_match' | 'condition_match' | 'deadline_reminder'

/** 사용자 프로필 */
export interface UserProfile {
  id: string
  email: string
  name: string | null
  avatarUrl: string | null
  interestedCategories: JobCategory[]
  interestedSkills: string[]
  experienceYears: number | null
  createdAt: string
  updatedAt: string
}

/** 키워드 알림 */
export interface KeywordAlert {
  id: string
  userId: string
  keyword: string
  alertType: 'instant' | 'daily' | 'weekly'
  isActive: boolean
  createdAt: string
}

/** 사용자 설정 */
export interface UserSettings {
  theme: 'light' | 'dark' | 'system'
  language: 'ko' | 'en' | 'ja'
  emailNotifications: boolean
  pushNotifications: boolean
  digestFrequency: 'daily' | 'weekly' | 'none'
  defaultCategory: JobCategory | 'all'
  defaultPeriod: '1w' | '1m' | '3m'
}

/** 기본 사용자 설정 */
export const DEFAULT_USER_SETTINGS: UserSettings = {
  theme: 'system',
  language: 'ko',
  emailNotifications: true,
  pushNotifications: false,
  digestFrequency: 'daily',
  defaultCategory: 'all',
  defaultPeriod: '1m',
}
