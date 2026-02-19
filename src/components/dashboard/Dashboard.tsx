import { QuickStats } from './QuickStats'
import { JobFeed } from './JobFeed'
import { FilterSidebar } from './FilterSidebar'
import { SkillTrendWidget } from './SkillTrendWidget'

export function Dashboard() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">대시보드</h2>
        <p className="text-muted-foreground">IT 채용공고를 한 곳에서 모아보세요</p>
      </div>

      <QuickStats />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-4">
        <div className="lg:col-span-1">
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
