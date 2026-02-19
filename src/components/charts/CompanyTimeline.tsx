import { Building2 } from 'lucide-react'
import { ChartContainer } from './ChartContainer'
import { MOCK_COMPANY_TIMELINE } from '@/data/chartMockData'
import { useMemo } from 'react'

/** max 값 기준 색상 농도 계산 */
function heatColor(value: number, max: number): string {
  if (value === 0) return 'transparent'
  const ratio = value / max
  if (ratio >= 0.8) return 'bg-emerald-500'
  if (ratio >= 0.6) return 'bg-emerald-400'
  if (ratio >= 0.4) return 'bg-emerald-300 dark:bg-emerald-600'
  if (ratio >= 0.2) return 'bg-emerald-200 dark:bg-emerald-700'
  return 'bg-emerald-100 dark:bg-emerald-800'
}

/** ⑥ 기업 채용 활동 타임라인 — HTML Table Heatmap */
export function CompanyTimeline() {
  const { months, maxCount } = useMemo(() => {
    const m = MOCK_COMPANY_TIMELINE[0].months.map((mo) => mo.month)
    let mx = 0
    for (const c of MOCK_COMPANY_TIMELINE) {
      for (const mo of c.months) {
        if (mo.count > mx) mx = mo.count
      }
    }
    return { months: m, maxCount: mx }
  }, [])

  return (
    <ChartContainer
      title="기업 채용 타임라인"
      icon={<Building2 className="size-4 text-emerald-500" />}
      description="주요 기업별 월간 채용공고 수 추이"
    >
      <div className="overflow-x-auto">
        <table className="w-full text-xs">
          <thead>
            <tr>
              <th className="px-2 py-1 text-left text-muted-foreground">기업</th>
              {months.map((m) => (
                <th key={m} className="min-w-[48px] px-2 py-1 text-center text-muted-foreground">
                  {m}월
                </th>
              ))}
              <th className="px-2 py-1 text-center text-muted-foreground">합계</th>
            </tr>
          </thead>
          <tbody>
            {MOCK_COMPANY_TIMELINE.map((company) => {
              const total = company.months.reduce((s, m) => s + m.count, 0)

              return (
                <tr key={company.company} className="border-t border-border/50">
                  <td className="whitespace-nowrap px-2 py-1.5 font-medium">
                    {company.company}
                  </td>
                  {company.months.map((m) => (
                    <td key={m.month} className="px-1 py-1">
                      <div
                        className={`mx-auto flex size-8 items-center justify-center rounded ${heatColor(m.count, maxCount)}`}
                        title={`${company.company} ${m.month}월: ${m.count}건`}
                      >
                        <span className="text-[10px] font-medium">{m.count}</span>
                      </div>
                    </td>
                  ))}
                  <td className="px-2 py-1 text-center font-semibold">{total}</td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      {/* 범례 */}
      <div className="mt-3 flex items-center justify-end gap-1 text-[10px] text-muted-foreground">
        <span>적음</span>
        <span className="inline-block size-3 rounded bg-emerald-100 dark:bg-emerald-800" />
        <span className="inline-block size-3 rounded bg-emerald-200 dark:bg-emerald-700" />
        <span className="inline-block size-3 rounded bg-emerald-300 dark:bg-emerald-600" />
        <span className="inline-block size-3 rounded bg-emerald-400" />
        <span className="inline-block size-3 rounded bg-emerald-500" />
        <span>많음</span>
      </div>
    </ChartContainer>
  )
}
