// ============================================================
// 알림 스토어 — 키워드·조건·기업 알림 관리
// ============================================================

import { create } from 'zustand'
import type { KeywordAlert, AlertType } from '@/types/user'

/** 조건 기반 알림 */
export interface ConditionAlert {
  id: string
  userId: string
  name: string
  conditions: {
    categories?: string[]
    skills?: string[]
    minSalary?: number
    location?: string
    experienceLevel?: string
  }
  alertType: 'instant' | 'daily' | 'weekly'
  isActive: boolean
  createdAt: string
}

/** 알림 아이템 (피드) */
export interface AlertNotification {
  id: string
  type: AlertType
  title: string
  message: string
  jobId?: string
  isRead: boolean
  createdAt: string
}

interface AlertState {
  /** 키워드 알림 */
  keywordAlerts: KeywordAlert[]
  /** 조건 기반 알림 */
  conditionAlerts: ConditionAlert[]
  /** 알림 피드 */
  notifications: AlertNotification[]

  // 키워드 알림
  addKeywordAlert: (keyword: string, alertType?: 'instant' | 'daily' | 'weekly') => void
  removeKeywordAlert: (id: string) => void
  toggleKeywordAlert: (id: string) => void

  // 조건 기반 알림
  addConditionAlert: (
    name: string,
    conditions: ConditionAlert['conditions'],
    alertType?: 'instant' | 'daily' | 'weekly',
  ) => void
  removeConditionAlert: (id: string) => void
  toggleConditionAlert: (id: string) => void

  // 알림 피드
  addNotification: (n: Omit<AlertNotification, 'id' | 'isRead' | 'createdAt'>) => void
  markAsRead: (id: string) => void
  markAllAsRead: () => void
  clearNotifications: () => void
  getUnreadCount: () => number
}

let _seq = 0
const nextId = () => `alert_${Date.now()}_${++_seq}`

export const useAlertStore = create<AlertState>((set, get) => ({
  keywordAlerts: [],
  conditionAlerts: [],
  notifications: [],

  // ── 키워드 알림 ──

  addKeywordAlert: (keyword, alertType = 'instant') =>
    set((s) => ({
      keywordAlerts: [
        ...s.keywordAlerts,
        {
          id: nextId(),
          userId: '',
          keyword,
          alertType,
          isActive: true,
          createdAt: new Date().toISOString(),
        },
      ],
    })),

  removeKeywordAlert: (id) =>
    set((s) => ({ keywordAlerts: s.keywordAlerts.filter((a) => a.id !== id) })),

  toggleKeywordAlert: (id) =>
    set((s) => ({
      keywordAlerts: s.keywordAlerts.map((a) =>
        a.id === id ? { ...a, isActive: !a.isActive } : a,
      ),
    })),

  // ── 조건 기반 알림 ──

  addConditionAlert: (name, conditions, alertType = 'daily') =>
    set((s) => ({
      conditionAlerts: [
        ...s.conditionAlerts,
        {
          id: nextId(),
          userId: '',
          name,
          conditions,
          alertType,
          isActive: true,
          createdAt: new Date().toISOString(),
        },
      ],
    })),

  removeConditionAlert: (id) =>
    set((s) => ({ conditionAlerts: s.conditionAlerts.filter((a) => a.id !== id) })),

  toggleConditionAlert: (id) =>
    set((s) => ({
      conditionAlerts: s.conditionAlerts.map((a) =>
        a.id === id ? { ...a, isActive: !a.isActive } : a,
      ),
    })),

  // ── 알림 피드 ──

  addNotification: (n) =>
    set((s) => ({
      notifications: [
        { ...n, id: nextId(), isRead: false, createdAt: new Date().toISOString() },
        ...s.notifications,
      ].slice(0, 200), // 최대 200개 유지
    })),

  markAsRead: (id) =>
    set((s) => ({
      notifications: s.notifications.map((n) =>
        n.id === id ? { ...n, isRead: true } : n,
      ),
    })),

  markAllAsRead: () =>
    set((s) => ({ notifications: s.notifications.map((n) => ({ ...n, isRead: true })) })),

  clearNotifications: () => set({ notifications: [] }),

  getUnreadCount: () => get().notifications.filter((n) => !n.isRead).length,
}))
