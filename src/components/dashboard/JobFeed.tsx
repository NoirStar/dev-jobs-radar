import { Zap, Loader2 } from 'lucide-react'
import { useJobStore } from '@/stores/jobStore'
import { useFilterStore } from '@/stores/filterStore'
import { JobCard } from './JobCard'
import { useMemo, useState, useCallback, useRef, useEffect } from 'react'
import { Button } from '@/components/ui/button'

const PAGE_SIZE = 10

export function JobFeed() {
  const jobs = useJobStore((s) => s.jobs)
  const searchQuery = useFilterStore((s) => s.searchQuery)
  const selectedCategories = useFilterStore((s) => s.selectedCategories)
  const selectedSkills = useFilterStore((s) => s.selectedSkills)
  const selectedRegions = useFilterStore((s) => s.selectedRegions)
  const selectedSources = useFilterStore((s) => s.selectedSources)
  const experienceLevel = useFilterStore((s) => s.experienceLevel)
  const remoteOnly = useFilterStore((s) => s.remoteOnly)
  const sortBy = useFilterStore((s) => s.sortBy)
  const sortOrder = useFilterStore((s) => s.sortOrder)

  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE)
  const loadMoreRef = useRef<HTMLDivElement>(null)

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

    // 지역 필터
    if (selectedRegions.length > 0) {
      result = result.filter((j) =>
        selectedRegions.some((r) => j.location.includes(r)),
      )
    }

    // 소스 필터
    if (selectedSources.length > 0) {
      result = result.filter((j) => selectedSources.includes(j.source))
    }

    // 경력 필터
    if (experienceLevel !== 'all') {
      result = result.filter((j) => j.experience.level === experienceLevel)
    }

    // 원격근무 필터
    if (remoteOnly) {
      result = result.filter((j) => j.isRemote)
    }

    // 정렬
    result.sort((a, b) => {
      let cmp = 0
      switch (sortBy) {
        case 'latest':
          cmp = (a.collectedAt ?? '').localeCompare(b.collectedAt ?? '')
          break
        case 'deadline': {
          const da = a.deadline ?? '9999-99-99'
          const db = b.deadline ?? '9999-99-99'
          cmp = da.localeCompare(db)
          break
        }
        case 'salary': {
          const sa = a.salary?.min ?? 0
          const sb = b.salary?.min ?? 0
          cmp = sa - sb
          break
        }
        case 'company':
          cmp = a.companyName.localeCompare(b.companyName)
          break
      }
      return sortOrder === 'desc' ? -cmp : cmp
    })

    return result
  }, [jobs, searchQuery, selectedCategories, selectedSkills, selectedRegions, selectedSources, experienceLevel, remoteOnly, sortBy, sortOrder])

  // 필터 변경 시 페이지 초기화
  useEffect(() => {
    setVisibleCount(PAGE_SIZE)
  }, [searchQuery, selectedCategories, selectedSkills, selectedRegions, selectedSources, experienceLevel, remoteOnly, sortBy, sortOrder])

  // 무한스크롤 IntersectionObserver
  const handleObserver = useCallback(
    (entries: IntersectionObserverEntry[]) => {
      const [entry] = entries
      if (entry.isIntersecting && visibleCount < filteredJobs.length) {
        setVisibleCount((prev) => Math.min(prev + PAGE_SIZE, filteredJobs.length))
      }
    },
    [visibleCount, filteredJobs.length],
  )

  useEffect(() => {
    const el = loadMoreRef.current
    if (!el) return
    const observer = new IntersectionObserver(handleObserver, { threshold: 0.1 })
    observer.observe(el)
    return () => observer.disconnect()
  }, [handleObserver])

  const visibleJobs = filteredJobs.slice(0, visibleCount)
  const hasMore = visibleCount < filteredJobs.length

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
          {visibleJobs.map((job) => (
            <JobCard key={job.id} job={job} />
          ))}

          {/* 무한스크롤 트리거 */}
          {hasMore && (
            <div ref={loadMoreRef} className="flex justify-center py-4">
              <Button
                variant="ghost"
                size="sm"
                className="text-muted-foreground"
                onClick={() => setVisibleCount((prev) => Math.min(prev + PAGE_SIZE, filteredJobs.length))}
              >
                <Loader2 className="mr-2 size-4 animate-spin" />
                더 불러오는 중...
              </Button>
            </div>
          )}

          {!hasMore && filteredJobs.length > PAGE_SIZE && (
            <p className="py-2 text-center text-xs text-muted-foreground">
              모든 공고를 표시했습니다
            </p>
          )}
        </div>
      )}
    </div>
  )
}
