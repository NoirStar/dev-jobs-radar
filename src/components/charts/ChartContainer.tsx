import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import type { ChartPeriod } from '@/types/chart'
import type { ReactNode } from 'react'

const PERIODS: { value: ChartPeriod; label: string }[] = [
  { value: '1w', label: '1주' },
  { value: '2w', label: '2주' },
  { value: '1m', label: '1개월' },
  { value: '3m', label: '3개월' },
  { value: '6m', label: '6개월' },
  { value: '1y', label: '1년' },
]

interface ChartContainerProps {
  title: string
  icon: ReactNode
  period?: ChartPeriod
  onPeriodChange?: (period: ChartPeriod) => void
  description?: string
  className?: string
  children: ReactNode
}

export function ChartContainer({
  title,
  icon,
  period,
  onPeriodChange,
  description,
  className,
  children,
}: ChartContainerProps) {
  return (
    <Card className={className}>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between gap-2">
          <CardTitle className="flex items-center gap-2 text-base">
            {icon}
            {title}
          </CardTitle>
          {period && onPeriodChange && (
            <div className="flex gap-1">
              {PERIODS.map((p) => (
                <button
                  key={p.value}
                  type="button"
                  onClick={() => onPeriodChange(p.value)}
                >
                  <Badge
                    variant={period === p.value ? 'default' : 'outline'}
                    className="cursor-pointer text-[10px]"
                  >
                    {p.label}
                  </Badge>
                </button>
              ))}
            </div>
          )}
        </div>
        {description && (
          <p className="text-xs text-muted-foreground">{description}</p>
        )}
      </CardHeader>
      <CardContent>{children}</CardContent>
    </Card>
  )
}
