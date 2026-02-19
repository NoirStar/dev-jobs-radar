import {
  ComposedChart, Bar, Line, XAxis, YAxis, CartesianGrid,
  Tooltip, Legend, ResponsiveContainer,
} from 'recharts'
import { BarChart3 } from 'lucide-react'
import { ChartContainer } from './ChartContainer'
import { MOCK_NEW_POSTINGS } from '@/data/chartMockData'

/** ⑧ 신규 공고 추이 — Bar + Line Combo */
export function NewPostingsChart() {
  return (
    <ChartContainer
      title="신규 공고 추이"
      icon={<BarChart3 className="size-4 text-amber-500" />}
      description="일간 신규 공고 수 + 누적 추이"
    >
      <ResponsiveContainer width="100%" height={280}>
        <ComposedChart data={MOCK_NEW_POSTINGS} margin={{ top: 5, right: 10, left: -10, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
          <XAxis
            dataKey="date"
            tick={{ fontSize: 11 }}
            className="fill-muted-foreground"
          />
          <YAxis
            yAxisId="left"
            tick={{ fontSize: 11 }}
            className="fill-muted-foreground"
          />
          <YAxis
            yAxisId="right"
            orientation="right"
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
              name === 'daily' ? '일간 신규' : '누적',
            ]}
          />
          <Legend
            wrapperStyle={{ fontSize: '12px' }}
            formatter={(value: string) => (value === 'daily' ? '일간 신규' : '누적')}
          />
          <Bar
            yAxisId="left"
            dataKey="daily"
            fill="hsl(var(--primary))"
            fillOpacity={0.7}
            radius={[4, 4, 0, 0]}
            barSize={28}
          />
          <Line
            yAxisId="right"
            type="monotone"
            dataKey="cumulative"
            stroke="#f59e0b"
            strokeWidth={2}
            dot={{ r: 3, fill: '#f59e0b' }}
          />
        </ComposedChart>
      </ResponsiveContainer>
    </ChartContainer>
  )
}
