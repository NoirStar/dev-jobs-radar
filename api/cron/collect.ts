// ============================================================
// Vercel Cron — Tier 1 채용공고 수집 트리거
// — 매 1시간마다 실행 (vercel.json에서 스케줄 설정)
// ============================================================

import type { VercelRequest, VercelResponse } from '@vercel/node'

/**
 * Tier 1 수집기를 순차 실행합니다.
 *
 * 현재는 수집기 구조만 정의되어 있으며,
 * 실제 DB 저장은 Supabase 연동 후 추가 예정입니다.
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

    // TODO: Supabase에 수집 결과 저장 (upsert)
    // TODO: 알림 트리거 (새 공고 감지 시)

    return res.status(200).json({
      success: true,
      summary: {
        totalCollectors: results.length,
        successfulCollectors: results.filter((r) => r.success).length,
        totalJobs: jobs.length,
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
