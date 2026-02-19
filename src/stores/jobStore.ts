// ============================================================
// 채용공고 스토어 — 공고 데이터 관리
// Supabase 연결 시 DB에서 fetch, 미설정 시 MOCK_JOBS 폴백
// ============================================================

import { create } from 'zustand'
import type { JobPostingSummary } from '@/types/job'
import { MOCK_JOBS } from '@/data/mockData'
import { fetchJobs } from '@/services/dbService'

interface JobState {
  /** 채용공고 목록 */
  jobs: JobPostingSummary[]
  /** 로딩 상태 */
  isLoading: boolean
  /** 에러 메시지 */
  error: string | null
  /** 선택된 공고 ID */
  selectedJobId: string | null
  /** DB에서 데이터 로드 완료 여부 */
  initialized: boolean

  // Actions
  setJobs: (jobs: JobPostingSummary[]) => void
  addJobs: (jobs: JobPostingSummary[]) => void
  selectJob: (id: string | null) => void
  setLoading: (loading: boolean) => void
  setError: (error: string | null) => void
  getJobById: (id: string) => JobPostingSummary | undefined
  /** Supabase에서 공고 데이터를 가져온다 */
  loadFromDB: () => Promise<void>
}

export const useJobStore = create<JobState>((set, get) => ({
  jobs: MOCK_JOBS,
  isLoading: false,
  error: null,
  selectedJobId: null,
  initialized: false,

  setJobs: (jobs) => set({ jobs, error: null }),
  addJobs: (newJobs) =>
    set((state) => ({
      jobs: [...state.jobs, ...newJobs.filter((j) => !state.jobs.some((e) => e.id === j.id))],
    })),
  selectJob: (id) => set({ selectedJobId: id }),
  setLoading: (isLoading) => set({ isLoading }),
  setError: (error) => set({ error }),
  getJobById: (id) => get().jobs.find((j) => j.id === id),

  loadFromDB: async () => {
    if (get().initialized) return
    set({ isLoading: true, error: null })
    try {
      const dbJobs = await fetchJobs()
      if (dbJobs.length > 0) {
        set({ jobs: dbJobs, initialized: true, isLoading: false })
      } else {
        // DB에 데이터 없으면 MOCK_JOBS 유지
        set({ initialized: true, isLoading: false })
      }
    } catch (err) {
      console.error('[jobStore] DB 로드 실패, MOCK_JOBS 폴백:', err)
      set({
        error: 'DB 연결 실패 — 데모 데이터를 표시합니다',
        initialized: true,
        isLoading: false,
      })
    }
  },
}))

// 앱 시작 시 자동으로 DB 로드 시도
useJobStore.getState().loadFromDB()
