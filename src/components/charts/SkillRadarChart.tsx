import { useMemo } from 'react'
import {
  RadarChart as RechartsRadarChart, Radar, PolarGrid,
  PolarAngleAxis, PolarRadiusAxis, Legend, ResponsiveContainer,
  Tooltip,
} from 'recharts'
import { Target } from 'lucide-react'
import { ChartContainer } from './ChartContainer'
import { useJobStore } from '@/stores/jobStore'
import { useAuthStore } from '@/stores/authStore'

/** ⑨ 레이더 차트 — 내 기술 vs 시장 요구 (jobStore 실시간 계산) */
export function SkillRadarChart() {
  const jobs = useJobStore((s) => s.jobs)
  const userSkills = useAuthStore((s) => s.user?.interestedSkills) ?? []

  const chartData = useMemo(() => {
    // 시장 기술 빈도 계산
    const skillCounts = new Map<string, number>()
    for (const job of jobs) {
      for (const skill of job.skills) {
        skillCounts.set(skill, (skillCounts.get(skill) ?? 0) + 1)
      }
    }
    // 상위 8개 기술
    const topSkills = [...skillCounts.entries()]
      .sort((a, b) => b[1] - a[1])
      .slice(0, 8)

    const maxCount = topSkills[0]?.[1] ?? 1
    const userSet = new Set(userSkills)

    return topSkills.map(([skill, count]) => ({
      skill,
      시장요구: Math.round((count / maxCount) * 100),
      내역량: userSet.has(skill) ? 80 : 0, // 보유=80, 미보유=0
    }))
  }, [jobs, userSkills])

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
