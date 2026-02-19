import {
  SkillHeatmap,
  SkillNetworkGraph,
  ExperienceSankey,
  SalaryBoxChart,
  SkillRadarChart,
} from '@/components/charts'

export function AnalysisPage() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">기술 분석</h2>
        <p className="text-muted-foreground">직군별 기술 수요 분석 & 인사이트</p>
      </div>

      {/* 직군×기술 히트맵 */}
      <SkillHeatmap />

      {/* 연봉 + 경력 흐름 */}
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        <SalaryBoxChart />
        <ExperienceSankey />
      </div>

      {/* 네트워크 + 레이더 */}
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        <SkillNetworkGraph />
        <SkillRadarChart />
      </div>
    </div>
  )
}
