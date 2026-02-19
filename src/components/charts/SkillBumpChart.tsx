import { TrendingUp } from 'lucide-react'
import { ChartContainer } from './ChartContainer'
import { MOCK_BUMP_DATA, BUMP_COLORS } from '@/data/chartMockData'
import { useMemo, useState } from 'react'

const PADDING = { top: 20, right: 90, bottom: 30, left: 50 }
const WIDTH = 600
const HEIGHT = 300
const CHART_W = WIDTH - PADDING.left - PADDING.right
const CHART_H = HEIGHT - PADDING.top - PADDING.bottom

/** ③ 기술 순위 변화 Bump Chart — Custom SVG */
export function SkillBumpChart() {
  const [hovered, setHovered] = useState<string | null>(null)

  const dates = useMemo(() => MOCK_BUMP_DATA[0].rankings.map((r) => r.date), [])
  const maxRank = MOCK_BUMP_DATA.length

  const xScale = (i: number) => PADDING.left + (i / (dates.length - 1)) * CHART_W
  const yScale = (rank: number) => PADDING.top + ((rank - 1) / (maxRank - 1)) * CHART_H

  return (
    <ChartContainer
      title="기술 순위 변화"
      icon={<TrendingUp className="size-4 text-indigo-500" />}
      description="매주 채용공고에서 가장 많이 요구되는 기술 순위"
    >
      <svg viewBox={`0 0 ${WIDTH} ${HEIGHT}`} className="w-full" role="img" aria-label="기술 순위 변화 차트">
        {/* X축 레이블 */}
        {dates.map((d, i) => (
          <text
            key={d}
            x={xScale(i)}
            y={HEIGHT - 4}
            textAnchor="middle"
            className="fill-muted-foreground text-[10px]"
          >
            {d}
          </text>
        ))}

        {/* Y축 순위 레이블 */}
        {Array.from({ length: maxRank }, (_, i) => i + 1).map((rank) => (
          <text
            key={rank}
            x={PADDING.left - 12}
            y={yScale(rank) + 4}
            textAnchor="end"
            className="fill-muted-foreground text-[10px]"
          >
            {rank}위
          </text>
        ))}

        {/* 수평 그리드 */}
        {Array.from({ length: maxRank }, (_, i) => i + 1).map((rank) => (
          <line
            key={`grid-${rank}`}
            x1={PADDING.left}
            x2={WIDTH - PADDING.right}
            y1={yScale(rank)}
            y2={yScale(rank)}
            className="stroke-border"
            strokeWidth={0.5}
          />
        ))}

        {/* 라인 + 점 */}
        {MOCK_BUMP_DATA.map((item) => {
          const color = BUMP_COLORS[item.skill] ?? '#888'
          const isActive = hovered === null || hovered === item.skill
          const opacity = isActive ? 1 : 0.15
          const strokeW = hovered === item.skill ? 3 : 2

          const points = item.rankings.map((r, i) => `${xScale(i)},${yScale(r.rank)}`).join(' ')

          return (
            <g
              key={item.skill}
              opacity={opacity}
              onMouseEnter={() => setHovered(item.skill)}
              onMouseLeave={() => setHovered(null)}
              className="cursor-pointer transition-opacity"
            >
              <polyline
                fill="none"
                stroke={color}
                strokeWidth={strokeW}
                strokeLinejoin="round"
                strokeLinecap="round"
                points={points}
              />
              {item.rankings.map((r, i) => (
                <circle key={i} cx={xScale(i)} cy={yScale(r.rank)} r={3.5} fill={color} />
              ))}
              {/* 우측 레이블 */}
              <text
                x={WIDTH - PADDING.right + 6}
                y={yScale(item.rankings[item.rankings.length - 1].rank) + 4}
                className="text-[10px] font-medium"
                fill={color}
              >
                {item.skill}
              </text>
            </g>
          )
        })}
      </svg>
    </ChartContainer>
  )
}
