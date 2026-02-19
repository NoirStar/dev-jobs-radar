// ============================================================
// 기업 탐색 페이지 — 필터 & 정렬 & 검색 기능
// ============================================================

import { useState, useMemo, useCallback } from 'react'
import { Link } from 'react-router-dom'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { useCompanyStore } from '@/stores/companyStore'
import { useWatchlistStore } from '@/stores/watchlistStore'
import { Building2, MapPin, Search, Star, StarOff, SlidersHorizontal } from 'lucide-react'
import type { CompanySize, IndustryType } from '@/types/company'
import { CompanyTimeline, RegionMap } from '@/components/charts'
import { SIZE_SHORT_LABELS, INDUSTRY_LABELS } from '@/data/companyLabels'

export function CompanyExplorer() {
  const companies = useCompanyStore((s) => s.companies)
  const { isWatching, addToWatchlist, removeFromWatchlist } = useWatchlistStore()

  const [search, setSearch] = useState('')
  const [selectedIndustry, setSelectedIndustry] = useState<IndustryType | ''>('')
  const [selectedSize, setSelectedSize] = useState<CompanySize | ''>('')
  const [sortBy, setSortBy] = useState<'name' | 'postings'>('postings')
  const [showFilters, setShowFilters] = useState(false)

  const industries = useMemo(() => {
    const set = new Set(companies.map((c) => c.industry))
    return [...set].sort()
  }, [companies])

  const filtered = useMemo(() => {
    let result = [...companies]

    if (search) {
      const q = search.toLowerCase()
      result = result.filter(
        (c) =>
          c.name.toLowerCase().includes(q) ||
          (c.nameEn && c.nameEn.toLowerCase().includes(q)) ||
          c.techStack.some((t) => t.toLowerCase().includes(q)),
      )
    }
    if (selectedIndustry) {
      result = result.filter((c) => c.industry === selectedIndustry)
    }
    if (selectedSize) {
      result = result.filter((c) => c.size === selectedSize)
    }

    result.sort((a, b) =>
      sortBy === 'postings'
        ? b.activePostings - a.activePostings
        : a.name.localeCompare(b.name, 'ko'),
    )

    return result
  }, [companies, search, selectedIndustry, selectedSize, sortBy])

  const watchedSet = useMemo(
    () => new Set(useWatchlistStore.getState().watchlist.map((w) => w.companyId)),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [useWatchlistStore((s) => s.watchlist.length)],
  )

  const handleToggleWatch = useCallback(
    (companyId: string) => {
      if (isWatching(companyId)) {
        removeFromWatchlist(companyId)
      } else {
        const company = companies.find((c) => c.id === companyId)
        if (!company) return
        addToWatchlist({
          id: `w-${companyId}`,
          userId: 'local',
          companyId,
          company,
          alertEnabled: true,
          addedAt: new Date().toISOString(),
          lastCheckedAt: new Date().toISOString(),
          newPostingsCount: 0,
        })
      }
    },
    [companies, isWatching, addToWatchlist, removeFromWatchlist],
  )

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">기업 탐색</h2>
          <p className="text-muted-foreground">
            IT 기업 프로필 & 채용 현황 ({filtered.length}/{companies.length}개 기업)
          </p>
        </div>
        <button
          onClick={() => setShowFilters((v) => !v)}
          className="flex items-center gap-1.5 rounded-md border px-3 py-1.5 text-sm text-muted-foreground hover:bg-muted"
          aria-label="필터 토글"
        >
          <SlidersHorizontal className="size-4" />
          필터
        </button>
      </div>

      {/* 검색 & 필터 */}
      <div className="space-y-3">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="기업명 또는 기술 스택 검색..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10"
            aria-label="기업 검색"
          />
        </div>

        {showFilters && (
          <div className="flex flex-wrap gap-3">
            <select
              value={selectedIndustry}
              onChange={(e) => setSelectedIndustry(e.target.value as IndustryType | '')}
              className="rounded-md border bg-background px-3 py-1.5 text-sm"
              aria-label="산업 필터"
            >
              <option value="">전체 산업</option>
              {industries.map((ind) => (
                <option key={ind} value={ind}>
                  {INDUSTRY_LABELS[ind]}
                </option>
              ))}
            </select>

            <select
              value={selectedSize}
              onChange={(e) => setSelectedSize(e.target.value as CompanySize | '')}
              className="rounded-md border bg-background px-3 py-1.5 text-sm"
              aria-label="규모 필터"
            >
              <option value="">전체 규모</option>
              {Object.entries(SIZE_SHORT_LABELS).map(([k, v]) => (
                <option key={k} value={k}>
                  {v}
                </option>
              ))}
            </select>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as 'name' | 'postings')}
              className="rounded-md border bg-background px-3 py-1.5 text-sm"
              aria-label="정렬 기준"
            >
              <option value="postings">공고 수순</option>
              <option value="name">이름순</option>
            </select>
          </div>
        )}
      </div>

      {/* 차트 */}
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        <CompanyTimeline />
        <RegionMap />
      </div>

      {/* 기업 카드 */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filtered.map((company) => {
          const watched = watchedSet.has(company.id)
          return (
          <Card key={company.id} className="transition-shadow hover:shadow-md">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <Link to={`/company/${company.id}`} className="group flex-1">
                  <CardTitle className="flex items-center gap-2 text-base group-hover:text-primary">
                    <Building2 className="size-4 shrink-0" aria-hidden="true" />
                    {company.name}
                  </CardTitle>
                  {company.nameEn && (
                    <p className="text-xs text-muted-foreground">{company.nameEn}</p>
                  )}
                </Link>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleToggleWatch(company.id)}
                    className="rounded p-1 hover:bg-muted"
                    aria-label={
                      watched
                        ? `${company.name} 관심 해제`
                        : `${company.name} 관심 등록`
                    }
                  >
                    {watched ? (
                      <Star className="size-4 fill-yellow-400 text-yellow-400" />
                    ) : (
                      <StarOff className="size-4 text-muted-foreground" />
                    )}
                  </button>
                  <Badge variant="outline" className="text-xs">
                    공고 {company.activePostings}개
                  </Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Badge variant="secondary" className="text-xs">
                  {INDUSTRY_LABELS[company.industry]}
                </Badge>
                <span>{SIZE_SHORT_LABELS[company.size]}</span>
              </div>
              <div className="flex flex-wrap gap-1">
                {company.techStack.slice(0, 4).map((tech) => (
                  <Badge key={tech} variant="secondary" className="text-xs">
                    {tech}
                  </Badge>
                ))}
                {company.techStack.length > 4 && (
                  <Badge variant="secondary" className="text-xs">
                    +{company.techStack.length - 4}
                  </Badge>
                )}
              </div>
              {company.location && (
                <p className="flex items-center gap-1 text-xs text-muted-foreground">
                  <MapPin className="size-3" aria-hidden="true" />
                  {company.location}
                </p>
              )}
            </CardContent>
          </Card>
          )
        })}
      </div>

      {filtered.length === 0 && (
        <div className="py-12 text-center text-muted-foreground" role="status" aria-live="polite">
          검색 결과가 없습니다.
        </div>
      )}
    </div>
  )
}
