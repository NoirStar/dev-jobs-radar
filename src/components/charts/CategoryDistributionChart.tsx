import { BarChart3 } from 'lucide-react'
import { ChartContainer } from './ChartContainer'
import { useJobStore } from '@/stores/jobStore'
import { computeCategoryDistribution } from '@/services/chartDataService'
import { useMemo } from 'react'

/** 직군별 공고 분포 — 수평 바 차트, jobStore 실시간 계산 */
export function CategoryDistributionChart() {
  const jobs = useJobStore((s) => s.jobs)
  const data = useMemo(() => computeCategoryDistribution(jobs), [jobs])
  const maxCount = data[0]?.count ?? 1

  return (
    <ChartContainer
      title="직군별 공고 분포"
      icon={<BarChart3 className="size-4 text-blue-500" />}
      description="현재 공고의 직군별 분포"
    >
      <div className="space-y-2 py-2">
        {data.map((cat) => (
          <div key={cat.category} className="flex items-center gap-3 text-sm">
            <span className="w-20 shrink-0 text-right text-xs text-muted-foreground">
              {cat.label}
            </span>
            <div className="relative h-6 min-w-0 flex-1 overflow-hidden rounded bg-muted">
              <div
                className="flex h-full items-center rounded transition-all"
                style={{
                  width: `${(cat.count / maxCount) * 100}%`,
                  backgroundColor: cat.color,
                  minWidth: cat.count > 0 ? '20px' : '0',
                }}
              >
                <span className="px-2 text-[10px] font-semibold text-white">
                  {cat.count}건
                </span>
              </div>
            </div>
            <span className="w-12 shrink-0 text-right text-xs text-muted-foreground">
              {cat.percentage}%
            </span>
          </div>
        ))}
      </div>
    </ChartContainer>
  )
}
