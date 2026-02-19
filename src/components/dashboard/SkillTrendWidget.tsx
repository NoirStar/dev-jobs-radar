import { TrendingUp, TrendingDown, Flame } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { MOCK_SKILL_TRENDS } from '@/data/mockData'

export function SkillTrendWidget() {
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-base">
          <Flame className="size-4 text-orange-500" />
          이번 주 기술 트렌드
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {MOCK_SKILL_TRENDS.map((trend, i) => (
            <div key={trend.skill} className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="flex size-5 items-center justify-center rounded-full bg-muted text-xs font-medium text-muted-foreground">
                  {i + 1}
                </span>
                <span className="text-sm font-medium">{trend.skill}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-muted-foreground">{trend.count}개</span>
                <span
                  className={`flex items-center gap-0.5 text-xs font-medium ${
                    trend.direction === 'up' ? 'text-emerald-600' : 'text-red-500'
                  }`}
                >
                  {trend.direction === 'up' ? (
                    <TrendingUp className="size-3" />
                  ) : (
                    <TrendingDown className="size-3" />
                  )}
                  {trend.direction === 'up' ? '+' : ''}{trend.change}%
                </span>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
