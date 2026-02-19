import {
  SkillTrendChart,
  SkillBumpChart,
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
        <p className="text-muted-foreground">직군별 기술 수요 트렌드 & 인사이트</p>
      </div>

      {/* 트렌드 행 */}
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        <SkillTrendChart />
        <SkillBumpChart />
      </div>

      <SkillHeatmap />

      {/* 네트워크 + 산키 */}
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        <SkillNetworkGraph />
        <ExperienceSankey />
      </div>

      {/* 연봉 + 레이더 */}
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        <SalaryBoxChart />
        <SkillRadarChart />
      </div>
    </div>
  )
}
