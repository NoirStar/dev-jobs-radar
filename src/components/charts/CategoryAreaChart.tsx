import { useState } from 'react'
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid,
  Tooltip, Legend, ResponsiveContainer,
} from 'recharts'
import { BarChart3 } from 'lucide-react'
import { ChartContainer } from './ChartContainer'
import { MOCK_CATEGORY_TREND, CATEGORY_COLORS, CATEGORY_LABELS } from '@/data/chartMockData'
import type { ChartPeriod } from '@/types/chart'

const AREA_KEYS = Object.keys(CATEGORY_COLORS)

/** ② 직군별 채용 추이 — Stacked Area Chart */
export function CategoryAreaChart() {
  const [period, setPeriod] = useState<ChartPeriod>('1m')

  return (
    <ChartContainer
      title="직군별 채용 추이"
      icon={<BarChart3 className="size-4 text-violet-500" />}
      period={period}
      onPeriodChange={setPeriod}
      description="직군별 신규 채용공고 수 변화"
    >
      <ResponsiveContainer width="100%" height={300}>
        <AreaChart data={MOCK_CATEGORY_TREND} margin={{ top: 5, right: 10, left: -10, bottom: 5 }}>
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
            formatter={(value: number, name: string) => [
              `${value}개`,
              CATEGORY_LABELS[name] ?? name,
            ]}
          />
          <Legend
            wrapperStyle={{ fontSize: '12px' }}
            formatter={(value: string) => CATEGORY_LABELS[value] ?? value}
          />
          {AREA_KEYS.map((key) => (
            <Area
              key={key}
              type="monotone"
              dataKey={key}
              stackId="1"
              stroke={CATEGORY_COLORS[key]}
              fill={CATEGORY_COLORS[key]}
              fillOpacity={0.4}
            />
          ))}
        </AreaChart>
      </ResponsiveContainer>
    </ChartContainer>
  )
}
