import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Calendar, Clock, ChevronLeft, ChevronRight, MapPin, Banknote } from 'lucide-react'
import { useJobStore } from '@/stores/jobStore'
import { getCategoryLabel, getCategoryIcon } from '@/data/categories'
import { useMemo, useState } from 'react'

export function CalendarPage() {
  const jobs = useJobStore((s) => s.jobs)
  const [currentDate, setCurrentDate] = useState(new Date())

  const year = currentDate.getFullYear()
  const month = currentDate.getMonth()

  // 해당 월의 마감 공고
  const deadlineJobs = useMemo(() => {
    return jobs.filter((j) => {
      if (!j.deadline) return false
      const d = new Date(j.deadline)
      return d.getFullYear() === year && d.getMonth() === month
    }).sort((a, b) => (a.deadline ?? '').localeCompare(b.deadline ?? ''))
  }, [jobs, year, month])

  // 날짜별 공고 매핑
  const jobsByDate = useMemo(() => {
    const map = new Map<number, typeof deadlineJobs>()
    for (const job of deadlineJobs) {
      const day = new Date(job.deadline!).getDate()
      if (!map.has(day)) map.set(day, [])
      map.get(day)!.push(job)
    }
    return map
  }, [deadlineJobs])

  // 캘린더 그리드 생성 (useMemo로 불필요한 재계산 방지)
  const weeks = useMemo(() => {
    const firstDay = new Date(year, month, 1).getDay()
    const daysInMonth = new Date(year, month + 1, 0).getDate()
    const result: (number | null)[][] = []
    let week: (number | null)[] = Array(firstDay).fill(null)

    for (let day = 1; day <= daysInMonth; day++) {
      week.push(day)
      if (week.length === 7) {
        result.push(week)
        week = []
      }
    }
    if (week.length > 0) {
      while (week.length < 7) week.push(null)
      result.push(week)
    }
    return result
  }, [year, month])

  const prevMonth = () => setCurrentDate(new Date(year, month - 1, 1))
  const nextMonth = () => setCurrentDate(new Date(year, month + 1, 1))
  const today = new Date()
  const isToday = (day: number) =>
    day === today.getDate() && month === today.getMonth() && year === today.getFullYear()

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">채용 캘린더</h2>
        <p className="text-muted-foreground">마감일 기반 일정 관리</p>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* 캘린더 */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <div className="flex items-center justify-between">
              <Button variant="ghost" size="icon" onClick={prevMonth}>
                <ChevronLeft className="size-4" />
              </Button>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="size-5" />
                {year}년 {month + 1}월
              </CardTitle>
              <Button variant="ghost" size="icon" onClick={nextMonth}>
                <ChevronRight className="size-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {/* 요일 헤더 */}
            <div className="mb-2 grid grid-cols-7 text-center text-xs font-medium text-muted-foreground">
              {['일', '월', '화', '수', '목', '금', '토'].map((d) => (
                <div key={d} className="py-1">{d}</div>
              ))}
            </div>

            {/* 날짜 그리드 */}
            <div className="grid grid-cols-7 gap-px">
              {weeks.map((week, wi) =>
                week.map((day, di) => {
                  const dayJobs = day ? jobsByDate.get(day) : undefined
                  return (
                    <div
                      key={`${wi}-${di}`}
                      className={`min-h-[72px] rounded-md border p-1 text-xs ${
                        day === null
                          ? 'bg-muted/30'
                          : isToday(day)
                            ? 'border-primary bg-primary/5'
                            : 'hover:bg-accent/50'
                      }`}
                    >
                      {day && (
                        <>
                          <span className={`font-medium ${isToday(day) ? 'text-primary' : ''}`}>
                            {day}
                          </span>
                          {dayJobs && (
                            <div className="mt-0.5 space-y-0.5">
                              {dayJobs.slice(0, 2).map((j) => (
                                  <div
                                    key={j.id}
                                    className="truncate rounded bg-primary/10 px-1 py-0.5 text-[10px] text-primary"
                                    title={`${j.companyName} — ${j.title}`}
                                  >
                                    {j.companyName}
                                  </div>
                                ))}
                              {dayJobs.length > 2 && (
                                <div className="text-[10px] text-muted-foreground">
                                  +{dayJobs.length - 2}개
                                </div>
                              )}
                            </div>
                          )}
                        </>
                      )}
                    </div>
                  )
                }),
              )}
            </div>
          </CardContent>
        </Card>

        {/* 마감 임박 리스트 */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Clock className="size-4" />
              이번 달 마감 공고 ({deadlineJobs.length})
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {deadlineJobs.length === 0 ? (
              <p className="py-4 text-center text-sm text-muted-foreground">
                이번 달 마감 공고가 없습니다
              </p>
            ) : (
              deadlineJobs.map((job) => {
                const Icon = getCategoryIcon(job.category)
                return (
                  <div key={job.id} className="space-y-1 rounded-lg border p-3">
                    <div className="flex items-start justify-between">
                      <div className="min-w-0 flex-1">
                        <p className="text-xs text-muted-foreground">{job.companyName}</p>
                        <p className="truncate text-sm font-medium">{job.title}</p>
                      </div>
                      <Badge variant="outline" className="ml-2 shrink-0 text-[10px]">
                        {Icon && <Icon className="mr-0.5 size-2.5" />}
                        {getCategoryLabel(job.category)}
                      </Badge>
                    </div>
                    <div className="flex flex-wrap gap-2 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1 font-medium text-orange-500">
                        <Calendar className="size-3" />
                        ~{job.deadline}
                      </span>
                      {job.salary && (
                        <span className="flex items-center gap-1">
                          <Banknote className="size-3" />
                          {job.salary.text}
                        </span>
                      )}
                      <span className="flex items-center gap-1">
                        <MapPin className="size-3" />
                        {job.location}
                      </span>
                    </div>
                  </div>
                )
              })
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
