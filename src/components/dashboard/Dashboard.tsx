import { QuickStats } from './QuickStats'
import { JobFeed } from './JobFeed'
import { FilterSidebar } from './FilterSidebar'
import { SkillTrendWidget } from './SkillTrendWidget'
import { Button } from '@/components/ui/button'
import { SlidersHorizontal, X } from 'lucide-react'
import { useState } from 'react'

export function Dashboard() {
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">대시보드</h2>
          <p className="text-muted-foreground">IT 채용공고를 한 곳에서 모아보세요</p>
        </div>
        <Button
          variant="outline"
          size="sm"
          className="lg:hidden"
          onClick={() => setMobileFilterOpen(!mobileFilterOpen)}
        >
          {mobileFilterOpen ? <X className="mr-1 size-4" /> : <SlidersHorizontal className="mr-1 size-4" />}
          필터
        </Button>
      </div>

      <QuickStats />

      {/* 모바일 필터 패널 */}
      {mobileFilterOpen && (
        <div className="lg:hidden">
          <FilterSidebar />
        </div>
      )}

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-4">
        <div className="hidden lg:col-span-1 lg:block">
          <FilterSidebar />
        </div>
        <div className="space-y-6 lg:col-span-2">
          <JobFeed />
        </div>
        <div className="lg:col-span-1">
          <SkillTrendWidget />
        </div>
      </div>
    </div>
  )
}
