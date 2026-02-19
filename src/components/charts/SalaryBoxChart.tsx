import { Banknote } from 'lucide-react'
import { ChartContainer } from './ChartContainer'
import { MOCK_SALARY_BOX } from '@/data/chartMockData'
import { useMemo } from 'react'

const CHART_W = 600
const CHART_H = 280
const PAD = { top: 20, right: 30, bottom: 40, left: 70 }
const PLOT_W = CHART_W - PAD.left - PAD.right
const PLOT_H = CHART_H - PAD.top - PAD.bottom

/** ④ 연봉 분포 — 커스텀 Box Plot (SVG) */
export function SalaryBoxChart() {
  const { maxValue, scale, barW, boxW, yTicks } = useMemo(() => {
    const mv = Math.max(...MOCK_SALARY_BOX.flatMap((d) => [d.max, ...d.outliers]))
    return {
      maxValue: mv,
      scale: (v: number) => PAD.top + PLOT_H - (v / mv) * PLOT_H,
      barW: PLOT_W / MOCK_SALARY_BOX.length,
      boxW: (PLOT_W / MOCK_SALARY_BOX.length) * 0.4,
      yTicks: Array.from({ length: 5 }, (_, i) => Math.round((mv / 4) * i)),
    }
  }, [])

  return (
    <ChartContainer
      title="직군별 연봉 분포"
      icon={<Banknote className="size-4 text-emerald-500" />}
      description="직군별 연봉 범위 (단위: 만원)"
    >
      <div className="overflow-x-auto">
        <svg
          viewBox={`0 0 ${CHART_W} ${CHART_H}`}
          className="mx-auto w-full max-w-[600px]"
          role="img"
          aria-label="직군별 연봉 분포 차트"
        >
          {/* Y축 그리드 + 레이블 */}
          {yTicks.map((tick) => (
            <g key={tick}>
              <line
                x1={PAD.left}
                y1={scale(tick)}
                x2={CHART_W - PAD.right}
                y2={scale(tick)}
                className="stroke-muted"
                strokeDasharray="3 3"
              />
              <text
                x={PAD.left - 8}
                y={scale(tick) + 4}
                textAnchor="end"
                className="fill-muted-foreground text-[10px]"
              >
                {(tick).toLocaleString()}
              </text>
            </g>
          ))}

          {/* Box plots */}
          {MOCK_SALARY_BOX.map((d, i) => {
            const cx = PAD.left + barW * i + barW / 2
            const x = cx - boxW / 2
            return (
              <g key={d.label}>
                {/* 수염 (min~q1, q3~max) */}
                <line x1={cx} y1={scale(d.min)} x2={cx} y2={scale(d.q1)} className="stroke-foreground/50" strokeWidth={1} />
                <line x1={cx} y1={scale(d.q3)} x2={cx} y2={scale(d.max)} className="stroke-foreground/50" strokeWidth={1} />

                {/* 수염 끝 캡 */}
                <line x1={cx - boxW / 4} y1={scale(d.min)} x2={cx + boxW / 4} y2={scale(d.min)} className="stroke-foreground/50" strokeWidth={1} />
                <line x1={cx - boxW / 4} y1={scale(d.max)} x2={cx + boxW / 4} y2={scale(d.max)} className="stroke-foreground/50" strokeWidth={1} />

                {/* 박스 (q1~q3) */}
                <rect
                  x={x}
                  y={scale(d.q3)}
                  width={boxW}
                  height={scale(d.q1) - scale(d.q3)}
                  rx={3}
                  className="fill-primary/20 stroke-primary"
                  strokeWidth={1.5}
                />

                {/* 중앙값 (median) */}
                <line
                  x1={x}
                  y1={scale(d.median)}
                  x2={x + boxW}
                  y2={scale(d.median)}
                  className="stroke-primary"
                  strokeWidth={2}
                />

                {/* 이상치 */}
                {d.outliers.map((o, j) => (
                  <circle
                    key={j}
                    cx={cx}
                    cy={scale(o)}
                    r={3}
                    className="fill-destructive/60"
                  />
                ))}

                {/* X축 레이블 */}
                <text
                  x={cx}
                  y={CHART_H - PAD.bottom + 18}
                  textAnchor="middle"
                  className="fill-muted-foreground text-[10px]"
                >
                  {d.label}
                </text>

                {/* 샘플 수 */}
                <text
                  x={cx}
                  y={CHART_H - PAD.bottom + 30}
                  textAnchor="middle"
                  className="fill-muted-foreground text-[8px]"
                >
                  n={d.sampleSize}
                </text>
              </g>
            )
          })}
        </svg>
      </div>
    </ChartContainer>
  )
}
