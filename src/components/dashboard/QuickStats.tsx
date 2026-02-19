import { Briefcase, CalendarClock, Building2, TrendingUp } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { useJobStore } from '@/stores/jobStore'
import { useWatchlistStore } from '@/stores/watchlistStore'
import { computeQuickStats } from '@/services/chartDataService'
import { useMemo } from 'react'

export function QuickStats() {
  const jobs = useJobStore((s) => s.jobs)
  const watchlist = useWatchlistStore((s) => s.watchlist)
  const watchedIds = useMemo(() => watchlist.map((c) => c.companyId), [watchlist])
  const data = useMemo(() => computeQuickStats(jobs, watchedIds), [jobs, watchedIds])

  const stats = [
    {
      label: '전체 공고',
      value: data.totalJobs.toLocaleString(),
      icon: Briefcase,
      bg: 'bg-blue-500/10',
      color: 'text-blue-500',
    },
    {
      label: '오늘 새 공고',
      value: `+${data.newToday}`,
      icon: TrendingUp,
      bg: 'bg-emerald-500/10',
      color: 'text-emerald-500',
    },
    {
      label: '마감 임박',
      value: data.deadlineSoon.toString(),
      icon: CalendarClock,
      bg: 'bg-orange-500/10',
      color: 'text-orange-500',
    },
    {
      label: '관심기업 새 공고',
      value: data.watchedNewJobs.toString(),
      icon: Building2,
      bg: 'bg-violet-500/10',
      color: 'text-violet-500',
    },
  ]

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
