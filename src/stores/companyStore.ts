// ============================================================
// 기업 스토어 — 기업 데이터 + 검색 관리
// ============================================================

import { create } from 'zustand'
import type { CompanySummary } from '@/types/company'
import { COMPANY_SEEDS } from '@/data/companies'

interface CompanyState {
  /** 기업 목록 */
  companies: CompanySummary[]
  /** 로딩 상태 */
  isLoading: boolean
  /** 선택된 기업 ID */
  selectedCompanyId: string | null

  // Actions
  setCompanies: (companies: CompanySummary[]) => void
  selectCompany: (id: string | null) => void
  setLoading: (loading: boolean) => void
  getCompanyById: (id: string) => CompanySummary | undefined
}

/** 시드 데이터에서 CompanySummary 생성 */
const seedToSummary = (): CompanySummary[] =>
  COMPANY_SEEDS.map((s) => ({
    id: s.id,
    name: s.name,
    nameEn: s.nameEn,
    industry: s.industry,
    size: s.size,
    logoUrl: null,
    location: s.location,
    techStack: s.techStack,
    activePostings: Math.floor(Math.random() * 10),
    totalPostings: Math.floor(Math.random() * 50) + 5,
  }))

export const useCompanyStore = create<CompanyState>((set, get) => ({
  companies: seedToSummary(),
  isLoading: false,
  selectedCompanyId: null,

  setCompanies: (companies) => set({ companies }),
  selectCompany: (id) => set({ selectedCompanyId: id }),
  setLoading: (isLoading) => set({ isLoading }),
  getCompanyById: (id) => get().companies.find((c) => c.id === id),
}))
