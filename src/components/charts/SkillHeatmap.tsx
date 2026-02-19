import { Grid3x3 } from 'lucide-react'
import { ChartContainer } from './ChartContainer'
import { useJobStore } from '@/stores/jobStore'
import { computeHeatmap } from '@/services/chartDataService'
import { useMemo } from 'react'

/** ⑤ 기술 히트맵 — 직군 × 기술 교차 빈도 (jobStore 실시간 계산) */
export function SkillHeatmap() {
  const jobs = useJobStore((s) => s.jobs)
  const { rows, columns, values } = useMemo(() => computeHeatmap(jobs), [jobs])

  const valueMap = useMemo(() => {
    const map = new Map<string, number>()
    for (const v of values) {
      map.set(`${v.row}:${v.column}`, v.value)
    }
    return map
  }, [values])

  const maxVal = useMemo(() => Math.max(...values.map((v) => v.value)), [values])

  const getCellColor = (value: number) => {
    const intensity = value / maxVal
    if (intensity > 0.8) return 'bg-primary text-primary-foreground'
    if (intensity > 0.6) return 'bg-primary/70 text-primary-foreground'
    if (intensity > 0.4) return 'bg-primary/50 text-primary-foreground'
    if (intensity > 0.2) return 'bg-primary/30'
    if (intensity > 0.05) return 'bg-primary/15'
    return 'bg-muted/40'
  }

  return (
    <ChartContainer
      title="직군별 기술 수요 히트맵"
      icon={<Grid3x3 className="size-4 text-orange-500" />}
      description="직군별 기술 요구 빈도 (값 = 전체 공고 대비 %)"
    >
      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-xs">
          <thead>
            <tr>
              <th className="p-1.5 text-left text-muted-foreground" />
              {columns.map((col) => (
                <th
                  key={col}
                  className="p-1.5 text-center font-medium text-muted-foreground"
                  style={{ writingMode: 'vertical-lr', transform: 'rotate(180deg)', height: '70px' }}
                >
                  {col}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row}>
                <td className="whitespace-nowrap p-1.5 font-medium text-muted-foreground">
                  {row}
                </td>
                {columns.map((col) => {
                  const val = valueMap.get(`${row}:${col}`) ?? 0
                  return (
                    <td key={col} className="p-0.5">
                      <div
                        className={`flex size-8 items-center justify-center rounded text-[10px] font-medium transition-colors ${getCellColor(val)}`}
                        title={`${row} × ${col}: ${val}%`}
                      >
                        {val > 0 ? val : ''}
                      </div>
                    </td>
                  )
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* 범례 */}
      <div className="mt-3 flex items-center gap-2 text-[10px] text-muted-foreground">
        <span>낮음</span>
        <div className="flex gap-0.5">
          {['bg-muted/40', 'bg-primary/15', 'bg-primary/30', 'bg-primary/50', 'bg-primary/70', 'bg-primary'].map((c) => (
            <div key={c} className={`size-3 rounded ${c}`} />
          ))}
        </div>
        <span>높음</span>
      </div>
    </ChartContainer>
  )
}
