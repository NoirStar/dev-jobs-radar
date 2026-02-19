// ============================================================
// 사용자 스토어 — 사용자 프로필 & 설정
// ============================================================

import { create } from 'zustand'
import type { UserSettings } from '@/types/user'
import { DEFAULT_USER_SETTINGS } from '@/types/user'

/** DOM에 다크모드 클래스 적용 + localStorage 저장 */
function applyTheme(theme: 'light' | 'dark' | 'system') {
  const isDark =
    theme === 'dark' ||
    (theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches)

  document.documentElement.classList.toggle('dark', isDark)
  localStorage.setItem('devjobs-theme', theme)
}

/** localStorage에서 저장된 테마 불러오기 */
function loadSavedTheme(): 'light' | 'dark' | 'system' {
  const saved = localStorage.getItem('devjobs-theme') as 'light' | 'dark' | 'system' | null
  return saved ?? DEFAULT_USER_SETTINGS.theme
}

interface UserState {
  /** 사용자 설정 */
  settings: UserSettings
  /** 사이드바 열림 상태 */
  sidebarOpen: boolean
  /** 현재 페이지 */
  currentPage: 'dashboard' | 'calendar' | 'analysis' | 'companies' | 'tracking' | 'settings'

  // Actions
  updateSettings: (partial: Partial<UserSettings>) => void
  toggleSidebar: () => void
  setSidebarOpen: (open: boolean) => void
  setCurrentPage: (page: UserState['currentPage']) => void
  toggleTheme: () => void
}

export const useUserStore = create<UserState>((set) => {
  const savedTheme = typeof window !== 'undefined' ? loadSavedTheme() : DEFAULT_USER_SETTINGS.theme

  // 초기 테마 적용
  if (typeof window !== 'undefined') {
    applyTheme(savedTheme)
  }

  return {
    settings: { ...DEFAULT_USER_SETTINGS, theme: savedTheme },
    sidebarOpen: true,
    currentPage: 'dashboard',

    updateSettings: (partial) =>
      set((state) => {
        const newSettings = { ...state.settings, ...partial }
        if (partial.theme) applyTheme(partial.theme)
        return { settings: newSettings }
      }),

    toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
    setSidebarOpen: (sidebarOpen) => set({ sidebarOpen }),
    setCurrentPage: (currentPage) => set({ currentPage }),

    toggleTheme: () =>
      set((state) => {
        const newTheme = state.settings.theme === 'dark' ? 'light' : 'dark'
        applyTheme(newTheme)
        return {
          settings: { ...state.settings, theme: newTheme },
        }
      }),
  }
})
