// ============================================================
// 지원 추적 스토어 — 채용 지원 상태 관리
// ============================================================

import { create } from 'zustand'
import type { Application, ApplicationStatus } from '@/types/job'

interface ApplicationState {
  /** 지원 목록 */
  applications: Application[]
  /** 로딩 상태 */
  isLoading: boolean

  // Actions
  addApplication: (app: Application) => void
  updateStatus: (id: string, status: ApplicationStatus, note?: string) => void
  removeApplication: (id: string) => void
  setApplications: (apps: Application[]) => void
  setLoading: (loading: boolean) => void
  getByStatus: (status: ApplicationStatus) => Application[]
  getByJobId: (jobId: string) => Application | undefined
  getTotalCount: () => number
}

export const useApplicationStore = create<ApplicationState>((set, get) => ({
  applications: [],
  isLoading: false,

  addApplication: (app) =>
    set((state) => {
      if (state.applications.some((a) => a.jobId === app.jobId)) return state
      return { applications: [...state.applications, app] }
    }),

  updateStatus: (id, status, note = '') =>
    set((state) => ({
      applications: state.applications.map((app) =>
        app.id === id
          ? {
              ...app,
              status,
              updatedAt: new Date().toISOString(),
              statusHistory: [
                ...app.statusHistory,
                { status, date: new Date().toISOString(), note },
              ],
            }
          : app,
      ),
    })),

  removeApplication: (id) =>
    set((state) => ({
      applications: state.applications.filter((a) => a.id !== id),
    })),

  setApplications: (applications) => set({ applications }),
  setLoading: (isLoading) => set({ isLoading }),

  getByStatus: (status) => get().applications.filter((a) => a.status === status),
  getByJobId: (jobId) => get().applications.find((a) => a.jobId === jobId),
  getTotalCount: () => get().applications.length,
}))
