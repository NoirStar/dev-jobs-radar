-- ============================================================
-- DevJobsRadar — Supabase 데이터베이스 스키마
-- 실행: Supabase Dashboard → SQL Editor → Run
-- ============================================================

-- 채용공고 테이블
CREATE TABLE IF NOT EXISTS jobs (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  company_name TEXT NOT NULL,
  company_id TEXT NOT NULL,
  category TEXT NOT NULL,
  skills TEXT[] NOT NULL DEFAULT '{}',
  experience JSONB NOT NULL DEFAULT '{}',
  salary JSONB,
  location TEXT NOT NULL DEFAULT '',
  is_remote BOOLEAN NOT NULL DEFAULT FALSE,
  source TEXT NOT NULL,
  source_url TEXT NOT NULL,
  deadline TEXT,
  posted_at TEXT,
  collected_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 일별 스냅샷 (시계열 데이터 축적)
CREATE TABLE IF NOT EXISTS snapshots (
  id SERIAL PRIMARY KEY,
  snapshot_date DATE NOT NULL DEFAULT CURRENT_DATE,
  total_jobs INTEGER NOT NULL DEFAULT 0,
  category_counts JSONB NOT NULL DEFAULT '{}',
  skill_counts JSONB NOT NULL DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(snapshot_date)
);

-- 인덱스
CREATE INDEX IF NOT EXISTS idx_jobs_category ON jobs(category);
CREATE INDEX IF NOT EXISTS idx_jobs_source ON jobs(source);
CREATE INDEX IF NOT EXISTS idx_jobs_is_active ON jobs(is_active);
CREATE INDEX IF NOT EXISTS idx_jobs_collected_at ON jobs(collected_at);
CREATE INDEX IF NOT EXISTS idx_jobs_company_id ON jobs(company_id);
CREATE INDEX IF NOT EXISTS idx_snapshots_date ON snapshots(snapshot_date);

-- updated_at 자동 갱신 트리거
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER jobs_updated_at
  BEFORE UPDATE ON jobs
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

-- RLS (Row Level Security) — 읽기는 공개, 쓰기는 service_role만
ALTER TABLE jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE snapshots ENABLE ROW LEVEL SECURITY;

-- 공개 읽기
CREATE POLICY "jobs_read_all" ON jobs
  FOR SELECT USING (true);

CREATE POLICY "snapshots_read_all" ON snapshots
  FOR SELECT USING (true);

-- service_role만 쓰기 가능 (Cron/서버에서만 사용)
CREATE POLICY "jobs_write_service" ON jobs
  FOR ALL USING (auth.role() = 'service_role');

CREATE POLICY "snapshots_write_service" ON snapshots
  FOR ALL USING (auth.role() = 'service_role');
