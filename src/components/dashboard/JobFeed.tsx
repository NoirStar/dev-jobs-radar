import { Zap } from 'lucide-react'
import { useJobStore } from '@/stores/jobStore'
import { useFilterStore } from '@/stores/filterStore'
import { JobCard } from './JobCard'
import { useMemo } from 'react'

export function JobFeed() {
  const jobs = useJobStore((s) => s.jobs)
  const searchQuery = useFilterStore((s) => s.searchQuery)
  const selectedCategories = useFilterStore((s) => s.selectedCategories)
  const selectedSkills = useFilterStore((s) => s.selectedSkills)
  const remoteOnly = useFilterStore((s) => s.remoteOnly)

  const filteredJobs = useMemo(() => {
    let result = [...jobs]

    // 검색 필터
    if (searchQuery) {
      const q = searchQuery.toLowerCase()
      result = result.filter(
        (j) =>
          j.title.toLowerCase().includes(q) ||
          j.companyName.toLowerCase().includes(q) ||
          j.skills.some((s) => s.toLowerCase().includes(q)),
      )
    }

    // 직군 필터
    if (selectedCategories.length > 0) {
      result = result.filter((j) => selectedCategories.includes(j.category))
    }

    // 기술 필터
    if (selectedSkills.length > 0) {
      result = result.filter((j) => selectedSkills.some((s) => j.skills.includes(s)))
    }

    // 원격근무 필터
    if (remoteOnly) {
      result = result.filter((j) => j.isRemote)
    }

    return result
  }, [jobs, searchQuery, selectedCategories, selectedSkills, remoteOnly])

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="flex items-center gap-2 text-lg font-semibold">
          <Zap className="size-4 text-amber-500" />
          채용공고
          <span className="text-sm font-normal text-muted-foreground">({filteredJobs.length})</span>
        </h3>
      </div>

      {filteredJobs.length === 0 ? (
        <div className="rounded-lg border border-dashed p-8 text-center text-muted-foreground">
          조건에 맞는 공고가 없습니다
        </div>
      ) : (
        <div className="space-y-3">
          {filteredJobs.map((job) => (
            <JobCard key={job.id} job={job} />
          ))}
        </div>
      )}
    </div>
  )
}
