// ============================================================
// Supabase 클라이언트 설정
// — 환경변수 기반 Supabase 인스턴스 + Auth 헬퍼
// ============================================================

import { createClient, type SupabaseClient, type User, type Session, type AuthChangeEvent } from '@supabase/supabase-js'

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL ?? ''
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY ?? ''

/** Supabase 사용 가능 여부 (환경변수 설정됨) */
export const isSupabaseConfigured = Boolean(SUPABASE_URL && SUPABASE_ANON_KEY)

/** Supabase 클라이언트 (싱글턴) */
export const supabase: SupabaseClient | null = isSupabaseConfigured
  ? createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
      auth: {
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: true,
      },
    })
  : null

// ── Auth 헬퍼 함수 ──

/** 이메일/비밀번호 회원가입 */
export async function signUp(email: string, password: string) {
  if (!supabase) return { user: null, error: { message: 'Supabase 미설정' } }
  const { data, error } = await supabase.auth.signUp({ email, password })
  return { user: data.user, error }
}

/** 이메일/비밀번호 로그인 */
export async function signIn(email: string, password: string) {
  if (!supabase) return { user: null, error: { message: 'Supabase 미설정' } }
  const { data, error } = await supabase.auth.signInWithPassword({ email, password })
  return { user: data.user, error }
}

/** OAuth (소셜) 로그인 */
export async function signInWithOAuth(provider: 'google' | 'github') {
  if (!supabase) return { error: { message: 'Supabase 미설정' } }
  const { error } = await supabase.auth.signInWithOAuth({ provider })
  return { error }
}

/** 로그아웃 */
export async function signOut() {
  if (!supabase) return
  await supabase.auth.signOut()
}

/** 현재 세션 가져오기 */
export async function getSession(): Promise<Session | null> {
  if (!supabase) return null
  const { data } = await supabase.auth.getSession()
  return data.session
}

/** 현재 사용자 가져오기 */
export async function getCurrentUser(): Promise<User | null> {
  if (!supabase) return null
  const { data } = await supabase.auth.getUser()
  return data.user
}

/** Auth 상태 변경 구독 */
export function onAuthStateChange(
  callback: (event: AuthChangeEvent, session: Session | null) => void,
) {
  if (!supabase) return { data: { subscription: { unsubscribe: () => {} } } }
  return supabase.auth.onAuthStateChange(callback)
}

// ── 타입 재export (편의) ──

export type { User, Session }
