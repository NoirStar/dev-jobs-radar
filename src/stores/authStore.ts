// ============================================================
// 인증 스토어 — Supabase Auth 상태 관리
// ============================================================

import { create } from 'zustand'
import type { UserProfile } from '@/types/user'
import {
  signIn as sbSignIn,
  signUp as sbSignUp,
  signOut as sbSignOut,
  signInWithOAuth as sbOAuth,
  getCurrentUser,
  isSupabaseConfigured,
} from '@/lib/supabase'

interface AuthState {
  /** 인증된 사용자 프로필 */
  user: UserProfile | null
  /** 로딩 중 */
  isLoading: boolean
  /** 인증 여부 */
  isAuthenticated: boolean
  /** 에러 메시지 */
  error: string | null

  // Actions
  signIn: (email: string, password: string) => Promise<boolean>
  signUp: (email: string, password: string, name: string) => Promise<boolean>
  signInWithOAuth: (provider: 'google' | 'github') => Promise<void>
  signOut: () => Promise<void>
  setUser: (user: UserProfile | null) => void
  updateProfile: (partial: Partial<UserProfile>) => void
  clearError: () => void
  initAuth: () => Promise<void>
}

/** 로컬 데모 사용자 (Supabase 미설정 시) */
const LOCAL_DEMO_USER: UserProfile = {
  id: 'local-demo',
  email: 'demo@devjobsradar.app',
  name: '데모 사용자',
  avatarUrl: null,
  interestedCategories: ['frontend', 'backend'],
  interestedSkills: ['React', 'TypeScript', 'Node.js'],
  experienceYears: 3,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
}

/** Supabase User → UserProfile 변환 헬퍼 */
function toUserProfile(sbUser: { id: string; email?: string; user_metadata?: Record<string, unknown>; created_at: string }): UserProfile {
  return {
    id: sbUser.id,
    email: sbUser.email ?? '',
    name: (sbUser.user_metadata?.name as string) ?? null,
    avatarUrl: (sbUser.user_metadata?.avatar_url as string) ?? null,
    interestedCategories: [],
    interestedSkills: [],
    experienceYears: null,
    createdAt: sbUser.created_at,
    updatedAt: new Date().toISOString(),
  }
}

export const useAuthStore = create<AuthState>((set) => ({
  user: isSupabaseConfigured ? null : LOCAL_DEMO_USER,
  isLoading: false,
  isAuthenticated: !isSupabaseConfigured,
  error: null,

  signIn: async (email, password) => {
    set({ isLoading: true, error: null })
    const { user, error } = await sbSignIn(email, password)
    if (error) {
      set({ isLoading: false, error: (error as { message: string }).message })
      return false
    }
    if (user) {
      set({ user: toUserProfile(user), isAuthenticated: true, isLoading: false })
      return true
    }
    set({ isLoading: false })
    return false
  },

  signUp: async (email, password, name) => {
    set({ isLoading: true, error: null })
    const { user, error } = await sbSignUp(email, password)
    if (error) {
      set({ isLoading: false, error: (error as { message: string }).message })
      return false
    }
    if (user) {
      const profile = toUserProfile(user)
      profile.name = name
      set({ user: profile, isAuthenticated: true, isLoading: false })
      return true
    }
    set({ isLoading: false })
    return false
  },

  signInWithOAuth: async (provider) => {
    set({ isLoading: true, error: null })
    const { error } = await sbOAuth(provider)
    if (error) {
      set({ isLoading: false, error: (error as { message: string }).message })
    }
  },

  signOut: async () => {
    await sbSignOut()
    set({
      user: isSupabaseConfigured ? null : LOCAL_DEMO_USER,
      isAuthenticated: !isSupabaseConfigured,
      error: null,
    })
  },

  setUser: (user) =>
    set({ user, isAuthenticated: user !== null }),

  updateProfile: (partial) =>
    set((state) => ({
      user: state.user
        ? { ...state.user, ...partial, updatedAt: new Date().toISOString() }
        : null,
    })),

  clearError: () => set({ error: null }),

  initAuth: async () => {
    if (!isSupabaseConfigured) return
    set({ isLoading: true })
    const sbUser = await getCurrentUser()
    if (sbUser) {
      set({ user: toUserProfile(sbUser), isAuthenticated: true, isLoading: false })
    } else {
      set({ isLoading: false })
    }
  },
}))
