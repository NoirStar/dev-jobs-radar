// ============================================================
// 사용자 스토어 — 사용자 프로필 & 설정
// ============================================================

import { create } from 'zustand'
import type { UserSettings } from '@/types/user'
import { DEFAULT_USER_SETTINGS } from '@/types/user'

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

export const useUserStore = create<UserState>((set) => ({
  settings: DEFAULT_USER_SETTINGS,
  sidebarOpen: true,
  currentPage: 'dashboard',

  updateSettings: (partial) =>
    set((state) => ({ settings: { ...state.settings, ...partial } })),

  toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
  setSidebarOpen: (sidebarOpen) => set({ sidebarOpen }),
  setCurrentPage: (currentPage) => set({ currentPage }),

  toggleTheme: () =>
    set((state) => ({
      settings: {
        ...state.settings,
        theme: state.settings.theme === 'dark' ? 'light' : 'dark',
      },
    })),
}))
