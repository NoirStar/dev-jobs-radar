// ============================================================
// Supabase DB 서비스 — 채용공고 CRUD
// ============================================================
//
// Supabase 테이블 스키마 (SQL 생성은 아래 참고):
//
// CREATE TABLE IF NOT EXISTS jobs (
//   id TEXT PRIMARY KEY,
//   title TEXT NOT NULL,
//   company_name TEXT NOT NULL,
//   company_id TEXT NOT NULL,
//   category TEXT NOT NULL,
//   skills TEXT[] NOT NULL DEFAULT '{}',
//   experience JSONB NOT NULL,
//   salary JSONB,
//   location TEXT NOT NULL DEFAULT '',
//   is_remote BOOLEAN NOT NULL DEFAULT FALSE,
//   source TEXT NOT NULL,
//   source_url TEXT NOT NULL,
//   deadline TEXT,
//   posted_at TEXT,
//   collected_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
//   is_active BOOLEAN NOT NULL DEFAULT TRUE,
//   updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
// );
//
// CREATE TABLE IF NOT EXISTS snapshots (
//   id SERIAL PRIMARY KEY,
//   snapshot_date DATE NOT NULL DEFAULT CURRENT_DATE,
//   total_jobs INTEGER NOT NULL DEFAULT 0,
//   category_counts JSONB NOT NULL DEFAULT '{}',
//   skill_counts JSONB NOT NULL DEFAULT '{}',
//   created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
//   UNIQUE(snapshot_date)
// );
//
// CREATE INDEX idx_jobs_category ON jobs(category);
// CREATE INDEX idx_jobs_source ON jobs(source);
// CREATE INDEX idx_jobs_is_active ON jobs(is_active);
// CREATE INDEX idx_jobs_collected_at ON jobs(collected_at);
// CREATE INDEX idx_snapshots_date ON snapshots(snapshot_date);
// ============================================================

import { supabase, isSupabaseConfigured } from '@/lib/supabase'
import type { JobPostingSummary } from '@/types/job'

/** DB row → JobPostingSummary 변환 */
function rowToJob(row: Record<string, unknown>): JobPostingSummary {
  return {
    id: row.id as string,
    title: row.title as string,
    companyName: row.company_name as string,
    companyId: row.company_id as string,
    category: row.category as JobPostingSummary['category'],
    skills: (row.skills as string[]) ?? [],
    experience: row.experience as JobPostingSummary['experience'],
    salary: (row.salary as JobPostingSummary['salary']) ?? null,
    location: (row.location as string) ?? '',
    isRemote: (row.is_remote as boolean) ?? false,
    source: row.source as JobPostingSummary['source'],
    sourceUrl: row.source_url as string,
    deadline: (row.deadline as string) ?? null,
    postedAt: (row.posted_at as string) ?? null,
    collectedAt: row.collected_at as string,
    isActive: (row.is_active as boolean) ?? true,
  }
}

/** JobPostingSummary → DB row 변환 */
function jobToRow(job: JobPostingSummary) {
  return {
    id: job.id,
    title: job.title,
    company_name: job.companyName,
    company_id: job.companyId,
    category: job.category,
    skills: job.skills,
    experience: job.experience,
    salary: job.salary,
    location: job.location,
    is_remote: job.isRemote,
    source: job.source,
    source_url: job.sourceUrl,
    deadline: job.deadline,
    posted_at: job.postedAt,
    collected_at: job.collectedAt,
    is_active: job.isActive,
  }
}

// ── 읽기 ──

/** 활성 공고 전체 조회 (최신순, 최대 500건) */
export async function fetchJobs(limit = 500): Promise<JobPostingSummary[]> {
  if (!isSupabaseConfigured || !supabase) return []

  const { data, error } = await supabase
    .from('jobs')
    .select('*')
    .eq('is_active', true)
    .order('collected_at', { ascending: false })
    .limit(limit)

  if (error) {
    console.error('[DB] fetchJobs 오류:', error.message)
    return []
  }

  return (data ?? []).map(rowToJob)
}

/** 공고 ID로 단건 조회 */
export async function fetchJobById(id: string): Promise<JobPostingSummary | null> {
  if (!isSupabaseConfigured || !supabase) return null

  const { data, error } = await supabase
    .from('jobs')
    .select('*')
    .eq('id', id)
    .single()

  if (error) {
    console.error('[DB] fetchJobById 오류:', error.message)
    return null
  }

  return data ? rowToJob(data) : null
}

// ── 쓰기 ──

/** 공고 upsert (수집 결과 저장) */
export async function upsertJobs(jobs: JobPostingSummary[]): Promise<number> {
  if (!isSupabaseConfigured || !supabase || jobs.length === 0) return 0

  const rows = jobs.map(jobToRow)

  // Supabase는 한 번에 최대 1000건까지 upsert 가능
  const BATCH_SIZE = 500
  let upsertedCount = 0

  for (let i = 0; i < rows.length; i += BATCH_SIZE) {
    const batch = rows.slice(i, i + BATCH_SIZE)
    const { error, count } = await supabase
      .from('jobs')
      .upsert(batch, { onConflict: 'id' })
      .select('id')

    if (error) {
      console.error(`[DB] upsertJobs batch ${i} 오류:`, error.message)
    } else {
      upsertedCount += count ?? batch.length
    }
  }

  return upsertedCount
}

/** 오래된 공고 비활성화 (30일 이상) */
export async function deactivateOldJobs(daysOld = 30): Promise<number> {
  if (!isSupabaseConfigured || !supabase) return 0

  const cutoff = new Date()
  cutoff.setDate(cutoff.getDate() - daysOld)

  const { error, count } = await supabase
    .from('jobs')
    .update({ is_active: false })
    .eq('is_active', true)
    .lt('collected_at', cutoff.toISOString())
    .select('id')

  if (error) {
    console.error('[DB] deactivateOldJobs 오류:', error.message)
    return 0
  }

  return count ?? 0
}

// ── 스냅샷 (시계열 데이터 축적) ──

/** 오늘의 스냅샷 저장 */
export async function saveSnapshot(
  totalJobs: number,
  categoryCounts: Record<string, number>,
  skillCounts: Record<string, number>,
): Promise<boolean> {
  if (!isSupabaseConfigured || !supabase) return false

  const today = new Date().toISOString().slice(0, 10)

  const { error } = await supabase
    .from('snapshots')
    .upsert(
      {
        snapshot_date: today,
        total_jobs: totalJobs,
        category_counts: categoryCounts,
        skill_counts: skillCounts,
      },
      { onConflict: 'snapshot_date' },
    )

  if (error) {
    console.error('[DB] saveSnapshot 오류:', error.message)
    return false
  }

  return true
}

/** 최근 N일 스냅샷 조회 (시계열 차트용) */
export async function fetchSnapshots(days = 30) {
  if (!isSupabaseConfigured || !supabase) return []

  const since = new Date()
  since.setDate(since.getDate() - days)

  const { data, error } = await supabase
    .from('snapshots')
    .select('*')
    .gte('snapshot_date', since.toISOString().slice(0, 10))
    .order('snapshot_date', { ascending: true })

  if (error) {
    console.error('[DB] fetchSnapshots 오류:', error.message)
    return []
  }

  return data ?? []
}
