import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Calendar, Clock } from 'lucide-react'

export function CalendarPage() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">채용 캘린더</h2>
        <p className="text-muted-foreground">마감일 기반 일정 관리</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="size-5" />
            2026년 2월
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex h-64 flex-col items-center justify-center gap-2 text-muted-foreground">
            <Clock className="size-8 text-muted-foreground/50" />
            <p className="text-sm">캘린더 뷰가 Phase 2에서 구현됩니다</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
