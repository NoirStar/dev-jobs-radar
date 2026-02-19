// ============================================================
// 채용공고 스토어 — 공고 데이터 관리
// ============================================================

import { create } from 'zustand'
import type { JobPostingSummary } from '@/types/job'
import { MOCK_JOBS } from '@/data/mockData'

interface JobState {
  /** 채용공고 목록 */
  jobs: JobPostingSummary[]
  /** 로딩 상태 */
  isLoading: boolean
  /** 에러 메시지 */
  error: string | null
  /** 선택된 공고 ID */
  selectedJobId: string | null

  // Actions
  setJobs: (jobs: JobPostingSummary[]) => void
  addJobs: (jobs: JobPostingSummary[]) => void
  selectJob: (id: string | null) => void
  setLoading: (loading: boolean) => void
  setError: (error: string | null) => void
  getJobById: (id: string) => JobPostingSummary | undefined
}

export const useJobStore = create<JobState>((set, get) => ({
  jobs: MOCK_JOBS,
  isLoading: false,
  error: null,
  selectedJobId: null,

  setJobs: (jobs) => set({ jobs, error: null }),
  addJobs: (newJobs) =>
    set((state) => ({
      jobs: [...state.jobs, ...newJobs.filter((j) => !state.jobs.some((e) => e.id === j.id))],
    })),
  selectJob: (id) => set({ selectedJobId: id }),
  setLoading: (isLoading) => set({ isLoading }),
  setError: (error) => set({ error }),
  getJobById: (id) => get().jobs.find((j) => j.id === id),
}))
