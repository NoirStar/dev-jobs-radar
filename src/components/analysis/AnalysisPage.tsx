import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { BarChart3, TrendingUp, Clock } from 'lucide-react'

export function AnalysisPage() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">기술 분석</h2>
        <p className="text-muted-foreground">직군별 기술 수요 트렌드 & 인사이트</p>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="size-5 text-blue-500" />
              기술 수요 트렌드
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex h-48 flex-col items-center justify-center gap-2 text-muted-foreground">
              <Clock className="size-8 text-muted-foreground/50" />
              <p className="text-sm">트렌드 차트가 Phase 3에서 구현됩니다</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="size-5 text-violet-500" />
              직군별 TOP 기술
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex h-48 flex-col items-center justify-center gap-2 text-muted-foreground">
              <Clock className="size-8 text-muted-foreground/50" />
              <p className="text-sm">기술 분석이 Phase 4에서 구현됩니다</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
