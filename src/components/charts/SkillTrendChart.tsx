import { useState, useMemo } from 'react'
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid,
  Tooltip, Legend, ResponsiveContainer,
} from 'recharts'
import { TrendingUp } from 'lucide-react'
import { ChartContainer } from './ChartContainer'
import { MOCK_SKILL_TREND_SERIES } from '@/data/chartMockData'
import type { ChartPeriod } from '@/types/chart'

/** ① 기술 수요 트렌드 — Line Chart (멀티 시리즈) */
export function SkillTrendChart() {
  const [period, setPeriod] = useState<ChartPeriod>('1m')

  // series → recharts용 flat 데이터로 변환 (memoized)
  const chartData = useMemo(() => {
    const dates = MOCK_SKILL_TREND_SERIES[0].data.map((d) => d.date)
    return dates.map((date) => {
      const row: Record<string, string | number> = { date }
      for (const series of MOCK_SKILL_TREND_SERIES) {
        const point = series.data.find((d) => d.date === date)
        row[series.name] = point?.value ?? 0
      }
      return row
    })
  }, [])

  return (
    <ChartContainer
      title="기술 수요 트렌드"
      icon={<TrendingUp className="size-4 text-blue-500" />}
      period={period}
      onPeriodChange={setPeriod}
      description="채용공고에서 언급된 기술별 공고 수 추이"
    >
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={chartData} margin={{ top: 5, right: 10, left: -10, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
          <XAxis
            dataKey="date"
            tick={{ fontSize: 11 }}
            className="fill-muted-foreground"
          />
          <YAxis
            tick={{ fontSize: 11 }}
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
          <Legend wrapperStyle={{ fontSize: '12px' }} />
          {MOCK_SKILL_TREND_SERIES.map((series) => (
            <Line
              key={series.name}
              type="monotone"
              dataKey={series.name}
              stroke={series.color}
              strokeWidth={2}
              dot={{ r: 3 }}
              activeDot={{ r: 5 }}
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </ChartContainer>
  )
}
