// ============================================================
// TechPulse 교차 분석 페이지 — 트렌딩 기술 × 채용 수요 종합
// ============================================================

import { TechPulseCrossWidget } from '@/components/dashboard/TechPulseCrossWidget'

export function TechPulsePage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-zinc-100">TechPulse 교차 분석</h1>
        <p className="text-sm text-zinc-400 mt-1">
          커뮤니티 트렌딩 기술과 실제 채용 수요를 교차 분석하여
          학습 우선순위를 제안합니다.
        </p>
      </div>
      <TechPulseCrossWidget />
    </div>
  )
}
