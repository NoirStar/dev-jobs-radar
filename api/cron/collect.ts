// ============================================================
// Vercel Cron — Tier 1 채용공고 수집 트리거
// — 매 1시간마다 실행 (vercel.json에서 스케줄 설정)
// ============================================================

import type { VercelRequest, VercelResponse } from '@vercel/node'
import { createClient } from '@supabase/supabase-js'

/**
 * Tier 1 수집기를 순차 실행 → Supabase에 결과 저장
 *
 * 인증: Vercel Cron은 자동으로 `Authorization: Bearer <CRON_SECRET>` 헤더를 보냅니다.
 */
export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Cron 인증 확인
  const authHeader = req.headers.authorization
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return res.status(401).json({ error: 'Unauthorized' })
  }

  const startTime = Date.now()

  try {
    // 동적 import (Vercel serverless 환경에서 tree-shaking 최적화)
    const { WantedCollector } = await import('../../src/services/collectors/wanted')
    const { SaraminCollector } = await import('../../src/services/collectors/saramin')
    const { JobKoreaCollector } = await import('../../src/services/collectors/jobkorea')
    const { ProgrammersCollector } = await import('../../src/services/collectors/programmers')
    const { JumpitCollector } = await import('../../src/services/collectors/jumpit')
    const { runPipeline } = await import('../../src/services/collectors/pipeline')

    const collectors = [
      new WantedCollector(),
      new SaraminCollector(),
      new JobKoreaCollector(),
      new ProgrammersCollector(),
      new JumpitCollector(),
    ]

    const { results, jobs } = await runPipeline(collectors, {
      requestDelay: 2000, // 소스 간 2초 딜레이
    })

    const duration = Date.now() - startTime

    // ── Supabase에 수집 결과 저장 ──
    let dbSaved = 0
    let snapshotSaved = false

    const supabaseUrl = process.env.SUPABASE_URL
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

    if (supabaseUrl && supabaseServiceKey && jobs.length > 0) {
      const supabase = createClient(supabaseUrl, supabaseServiceKey)

      // ParsedJobData → DB row 변환
      const rows = jobs.map((job) => ({
        id: `${job.source}-${job.sourceJobId}`,
        title: job.title,
        company_name: job.normalizedCompanyName || job.companyName,
        company_id: (job.normalizedCompanyName || job.companyName).toLowerCase().replace(/[^a-z0-9]/g, ''),
        category: job.category,
        skills: job.skills,
        experience: job.experience,
        salary: job.salary,
        location: job.location ?? '',
        is_remote: job.isRemote ?? false,
        source: job.source,
        source_url: job.url,
        deadline: job.deadline ?? null,
        posted_at: job.postedAt ?? null,
        collected_at: job.collectedAt,
        is_active: true,
      }))

      // Upsert (500건씩 배치)
      for (let i = 0; i < rows.length; i += 500) {
        const batch = rows.slice(i, i + 500)
        const { error } = await supabase
          .from('jobs')
          .upsert(batch, { onConflict: 'id' })

        if (error) {
          console.error(`[Cron] DB upsert batch ${i} 오류:`, error.message)
        } else {
          dbSaved += batch.length
        }
      }

      // 일별 스냅샷 저장
      const categoryCounts: Record<string, number> = {}
      const skillCounts: Record<string, number> = {}
      for (const job of jobs) {
        categoryCounts[job.category] = (categoryCounts[job.category] ?? 0) + 1
        for (const skill of job.skills) {
          skillCounts[skill] = (skillCounts[skill] ?? 0) + 1
        }
      }

      const today = new Date().toISOString().slice(0, 10)
      const { error: snapError } = await supabase
        .from('snapshots')
        .upsert(
          {
            snapshot_date: today,
            total_jobs: jobs.length,
            category_counts: categoryCounts,
            skill_counts: skillCounts,
          },
          { onConflict: 'snapshot_date' },
        )

      if (snapError) {
        console.error('[Cron] 스냅샷 저장 오류:', snapError.message)
      } else {
        snapshotSaved = true
      }
    }

    return res.status(200).json({
      success: true,
      summary: {
        totalCollectors: results.length,
        successfulCollectors: results.filter((r) => r.success).length,
        totalJobs: jobs.length,
        dbSaved,
        snapshotSaved,
        duration,
      },
      results,
      collectedAt: new Date().toISOString(),
    })
  } catch (error) {
    const duration = Date.now() - startTime
    console.error('[Cron/Collect] 수집 파이프라인 오류:', error)

    return res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      duration,
    })
  }
}
