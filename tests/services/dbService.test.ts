// ============================================================
// dbService — Supabase DB 서비스 테스트
// (Supabase 미설정 환경에서의 폴백 동작 검증)
// ============================================================

import { describe, it, expect } from 'vitest'
import {
  fetchJobs,
  fetchJobById,
  upsertJobs,
  deactivateOldJobs,
  saveSnapshot,
  fetchSnapshots,
} from '@/services/dbService'

describe('dbService (Supabase 미설정 환경)', () => {
  it('fetchJobs — Supabase 미설정 시 빈 배열 반환', async () => {
    const jobs = await fetchJobs()
    expect(jobs).toEqual([])
  })

  it('fetchJobById — Supabase 미설정 시 null 반환', async () => {
    const job = await fetchJobById('test-id')
    expect(job).toBeNull()
  })

  it('upsertJobs — Supabase 미설정 시 0 반환', async () => {
    const count = await upsertJobs([])
    expect(count).toBe(0)
  })

  it('deactivateOldJobs — Supabase 미설정 시 0 반환', async () => {
    const count = await deactivateOldJobs()
    expect(count).toBe(0)
  })

  it('saveSnapshot — Supabase 미설정 시 false 반환', async () => {
    const ok = await saveSnapshot(0, {}, {})
    expect(ok).toBe(false)
  })

  it('fetchSnapshots — Supabase 미설정 시 빈 배열 반환', async () => {
    const snapshots = await fetchSnapshots()
    expect(snapshots).toEqual([])
  })
})
