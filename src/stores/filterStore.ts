// ============================================================
// 필터 스토어 — 검색/필터 상태 관리
// ============================================================

import { create } from 'zustand'
import type { JobCategory, ExperienceLevel, SourceId } from '@/types/job'

interface FilterState {
  /** 검색어 */
  searchQuery: string
  /** 선택된 직군 */
  selectedCategories: JobCategory[]
  /** 선택된 기술 */
  selectedSkills: string[]
  /** 경력 필터 */
  experienceLevel: ExperienceLevel | 'all'
  /** 소스 필터 */
  selectedSources: SourceId[]
  /** 지역 필터 */
  selectedRegions: string[]
  /** 원격근무만 */
  remoteOnly: boolean
  /** 활성 공고만 */
  activeOnly: boolean
  /** 정렬 기준 */
  sortBy: 'latest' | 'deadline' | 'salary' | 'company'
  /** 정렬 방향 */
  sortOrder: 'asc' | 'desc'

  // Actions
  setSearchQuery: (query: string) => void
  toggleCategory: (category: JobCategory) => void
  setCategories: (categories: JobCategory[]) => void
  toggleSkill: (skill: string) => void
  setSkills: (skills: string[]) => void
  setExperienceLevel: (level: ExperienceLevel | 'all') => void
  toggleSource: (source: SourceId) => void
  toggleRegion: (region: string) => void
  setRemoteOnly: (value: boolean) => void
  setActiveOnly: (value: boolean) => void
  setSortBy: (sortBy: FilterState['sortBy']) => void
  setSortOrder: (order: 'asc' | 'desc') => void
  resetFilters: () => void
  hasActiveFilters: () => boolean
}

const initialState = {
  searchQuery: '',
  selectedCategories: [] as JobCategory[],
  selectedSkills: [] as string[],
  experienceLevel: 'all' as ExperienceLevel | 'all',
  selectedSources: [] as SourceId[],
  selectedRegions: [] as string[],
  remoteOnly: false,
  activeOnly: true,
  sortBy: 'latest' as const,
  sortOrder: 'desc' as const,
}

export const useFilterStore = create<FilterState>((set, get) => ({
  ...initialState,

  setSearchQuery: (searchQuery) => set({ searchQuery }),

  toggleCategory: (category) =>
    set((state) => ({
      selectedCategories: state.selectedCategories.includes(category)
        ? state.selectedCategories.filter((c) => c !== category)
        : [...state.selectedCategories, category],
    })),

  setCategories: (selectedCategories) => set({ selectedCategories }),

  toggleSkill: (skill) =>
    set((state) => ({
      selectedSkills: state.selectedSkills.includes(skill)
        ? state.selectedSkills.filter((s) => s !== skill)
        : [...state.selectedSkills, skill],
    })),

  setSkills: (selectedSkills) => set({ selectedSkills }),

  setExperienceLevel: (experienceLevel) => set({ experienceLevel }),

  toggleSource: (source) =>
    set((state) => ({
      selectedSources: state.selectedSources.includes(source)
        ? state.selectedSources.filter((s) => s !== source)
        : [...state.selectedSources, source],
    })),

  toggleRegion: (region) =>
    set((state) => ({
      selectedRegions: state.selectedRegions.includes(region)
        ? state.selectedRegions.filter((r) => r !== region)
        : [...state.selectedRegions, region],
    })),

  setRemoteOnly: (remoteOnly) => set({ remoteOnly }),
  setActiveOnly: (activeOnly) => set({ activeOnly }),
  setSortBy: (sortBy) => set({ sortBy }),
  setSortOrder: (sortOrder) => set({ sortOrder }),

  resetFilters: () => set(initialState),

  hasActiveFilters: () => {
    const state = get()
    return (
      state.searchQuery !== '' ||
      state.selectedCategories.length > 0 ||
      state.selectedSkills.length > 0 ||
      state.experienceLevel !== 'all' ||
      state.selectedSources.length > 0 ||
      state.selectedRegions.length > 0 ||
      state.remoteOnly
    )
  },
}))
