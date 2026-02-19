import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  SkillTrendChart,
  CategoryAreaChart,
  SkillBumpChart,
  SalaryBoxChart,
  SkillHeatmap,
  NewPostingsChart,
  RegionMap,
} from '@/components/charts'
import { generateMarketInsight } from '@/services/skillAnalyzer'
import { useJobStore } from '@/stores/jobStore'
import {
  TrendingUp,
  TrendingDown,
  Building2,
  Briefcase,
  Banknote,
  Globe,
  BarChart3,
} from 'lucide-react'
import { useMemo } from 'react'

/** 시장 인사이트 종합 대시보드 */
export function MarketInsightPage() {
  const jobs = useJobStore((s) => s.jobs)
  const insight = useMemo(() => generateMarketInsight(jobs), [jobs])

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">시장 인사이트</h2>
        <p className="text-muted-foreground">채용 시장 종합 분석 리포트</p>
      </div>

      {/* KPI 카드 */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-6">
        <KPICard
          icon={<Briefcase className="size-4 text-blue-500" />}
          label="총 공고 수"
          value={insight.totalPostings.toLocaleString()}
        />
        <KPICard
          icon={<Building2 className="size-4 text-emerald-500" />}
          label="활성 기업"
          value={`${insight.activeCompanies}곳`}
        />
        <KPICard
          icon={<BarChart3 className="size-4 text-violet-500" />}
          label="최다 직군"
          value={insight.topCategory.name}
          sub={`${insight.topCategory.count}건`}
        />
        <KPICard
          icon={<TrendingUp className="size-4 text-rose-500" />}
          label="최다 기술"
          value={insight.topSkill.name}
          sub={`${insight.topSkill.percentage}%`}
        />
        <KPICard
          icon={<Banknote className="size-4 text-amber-500" />}
          label="평균 연봉"
          value={
            insight.avgSalary
              ? `${Math.round(insight.avgSalary.min / 10000)}~${Math.round(insight.avgSalary.max / 10000)}만`
              : '정보 없음'
          }
        />
        <KPICard
          icon={<Globe className="size-4 text-cyan-500" />}
          label="원격 근무"
          value={`${insight.remotePercentage}%`}
        />
      </div>

      {/* 직군 분포 */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base">직군별 채용 분포</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {insight.categoryBreakdown.map((cat) => (
              <div key={cat.category} className="flex items-center gap-3 text-sm">
                <span className="w-24 shrink-0 text-muted-foreground">{cat.label}</span>
                <div
                  className="relative h-5 min-w-0 flex-1 overflow-hidden rounded-full bg-muted"
                  role="progressbar"
                  aria-valuenow={cat.percentage}
                  aria-valuemin={0}
                  aria-valuemax={100}
                  aria-label={`${cat.label}: ${cat.count}건 (${cat.percentage}%)`}
                >
                  <div
                    className="h-full rounded-full bg-primary/70 transition-all"
                    style={{ width: `${cat.percentage}%` }}
                  />
                </div>
                <span className="w-16 shrink-0 text-right text-xs text-muted-foreground">
                  {cat.count}건 ({cat.percentage}%)
                </span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* 트렌드 상승/하락 */}
      {(insight.risingSkills.length > 0 || insight.decliningSkills.length > 0) && (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-base">
                <TrendingUp className="size-4 text-green-500" />
                상승 트렌드
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {insight.risingSkills.map((s) => (
                <div key={s.skill} className="flex items-center justify-between text-sm">
                  <span>{s.skill}</span>
                  <Badge variant="outline" className="text-green-600">
                    +{s.trend}%
                  </Badge>
                </div>
              ))}
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-base">
                <TrendingDown className="size-4 text-red-500" />
                하락 트렌드
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {insight.decliningSkills.map((s) => (
                <div key={s.skill} className="flex items-center justify-between text-sm">
                  <span>{s.skill}</span>
                  <Badge variant="outline" className="text-red-600">
                    {s.trend}%
                  </Badge>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      )}

      {/* 차트 그리드 */}
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        <SkillTrendChart />
        <CategoryAreaChart />
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        <SkillBumpChart />
        <NewPostingsChart />
      </div>

      <SkillHeatmap />

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        <SalaryBoxChart />
        <RegionMap />
      </div>
    </div>
  )
}

// ── KPI 카드 내부 컴포넌트 ──

function KPICard({
  icon,
  label,
  value,
  sub,
}: {
  icon: React.ReactNode
  label: string
  value: string
  sub?: string
}) {
  return (
    <Card>
      <CardContent className="flex flex-col gap-1 p-4">
        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <span aria-hidden="true">{icon}</span>
          {label}
        </div>
        <p className="text-lg font-bold leading-tight">{value}</p>
        {sub && <p className="text-xs text-muted-foreground">{sub}</p>}
      </CardContent>
    </Card>
  )
}
