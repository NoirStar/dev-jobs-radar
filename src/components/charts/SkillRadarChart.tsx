import { useMemo } from 'react'
import {
  RadarChart as RechartsRadarChart, Radar, PolarGrid,
  PolarAngleAxis, PolarRadiusAxis, Legend, ResponsiveContainer,
  Tooltip,
} from 'recharts'
import { Target } from 'lucide-react'
import { ChartContainer } from './ChartContainer'
import { MOCK_RADAR } from '@/data/chartMockData'

/** ⑨ 레이더 차트 — 내 기술 vs 시장 요구 */
export function SkillRadarChart() {
  // recharts Radar용 데이터 포맷 (memoized)
  const chartData = useMemo(
    () =>
      MOCK_RADAR.axes.map((axis, i) => ({
        skill: axis,
        시장요구: MOCK_RADAR.series[0].values[i],
        내역량: MOCK_RADAR.series[1].values[i],
      })),
    [],
  )

  return (
    <ChartContainer
      title="내 기술 vs 시장 요구"
      icon={<Target className="size-4 text-rose-500" />}
      description="시장에서 요구하는 기술과 내 역량 비교"
    >
      <ResponsiveContainer width="100%" height={320}>
        <RechartsRadarChart data={chartData} cx="50%" cy="50%" outerRadius="70%">
          <PolarGrid className="stroke-muted" />
          <PolarAngleAxis
            dataKey="skill"
            tick={{ fontSize: 11 }}
            className="fill-muted-foreground"
          />
          <PolarRadiusAxis
            angle={90}
            domain={[0, 100]}
            tick={{ fontSize: 9 }}
            className="fill-muted-foreground"
          />
          <Tooltip
            contentStyle={{
              backgroundColor: 'hsl(var(--card))',
              border: '1px solid hsl(var(--border))',
              borderRadius: '8px',
              fontSize: '12px',
            }}
          />
          <Radar
            name="시장 요구"
            dataKey="시장요구"
            stroke="#3b82f6"
            fill="#3b82f6"
            fillOpacity={0.15}
            strokeWidth={2}
          />
          <Radar
            name="내 역량"
            dataKey="내역량"
            stroke="#10b981"
            fill="#10b981"
            fillOpacity={0.15}
            strokeWidth={2}
          />
          <Legend wrapperStyle={{ fontSize: '12px' }} />
        </RechartsRadarChart>
      </ResponsiveContainer>
    </ChartContainer>
  )
}
