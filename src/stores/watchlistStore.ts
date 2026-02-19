// ============================================================
// 관심 기업 스토어 — 관심 기업 모니터링 관리
// ============================================================

import { create } from 'zustand'
import type { WatchedCompany } from '@/types/company'

interface WatchlistState {
  /** 관심 기업 목록 */
  watchlist: WatchedCompany[]
  /** 로딩 상태 */
  isLoading: boolean

  // Actions
  addToWatchlist: (item: WatchedCompany) => void
  removeFromWatchlist: (companyId: string) => void
  isWatching: (companyId: string) => boolean
  setWatchlist: (watchlist: WatchedCompany[]) => void
  setLoading: (loading: boolean) => void
  getWatchedCount: () => number
  getNewPostingsTotal: () => number
}

export const useWatchlistStore = create<WatchlistState>((set, get) => ({
  watchlist: [],
  isLoading: false,

  addToWatchlist: (item) =>
    set((state) => {
      if (state.watchlist.some((w) => w.companyId === item.companyId)) return state
      return { watchlist: [...state.watchlist, item] }
    }),

  removeFromWatchlist: (companyId) =>
    set((state) => ({
      watchlist: state.watchlist.filter((w) => w.companyId !== companyId),
    })),

  isWatching: (companyId) => get().watchlist.some((w) => w.companyId === companyId),

  setWatchlist: (watchlist) => set({ watchlist }),
  setLoading: (isLoading) => set({ isLoading }),

  getWatchedCount: () => get().watchlist.length,
  getNewPostingsTotal: () =>
    get().watchlist.reduce((sum, w) => sum + w.newPostingsCount, 0),
}))
