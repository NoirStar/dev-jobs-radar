import { Briefcase, CalendarClock, Building2, TrendingUp } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { MOCK_STATS } from '@/data/mockData'

const stats = [
  {
    label: '전체 공고',
    value: MOCK_STATS.totalJobs.toLocaleString(),
    icon: Briefcase,
    bg: 'bg-blue-500/10',
    color: 'text-blue-500',
  },
  {
    label: '오늘 새 공고',
    value: `+${MOCK_STATS.newToday}`,
    icon: TrendingUp,
    bg: 'bg-emerald-500/10',
    color: 'text-emerald-500',
  },
  {
    label: '마감 임박',
    value: MOCK_STATS.deadlineSoon.toString(),
    icon: CalendarClock,
    bg: 'bg-orange-500/10',
    color: 'text-orange-500',
  },
  {
    label: '관심기업 새 공고',
    value: MOCK_STATS.watchedNewJobs.toString(),
    icon: Building2,
    bg: 'bg-violet-500/10',
    color: 'text-violet-500',
  },
]

export function QuickStats() {
  return (
    <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
      {stats.map(({ label, value, icon: Icon, bg, color }) => (
        <Card key={label} className="overflow-hidden">
          <CardContent className="flex items-center gap-4 pt-6">
            <div className={`rounded-xl p-2.5 ${bg}`}>
              <Icon className={`size-5 ${color}`} />
            </div>
            <div>
              <p className="text-2xl font-bold tracking-tight">{value}</p>
              <p className="text-xs text-muted-foreground">{label}</p>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
