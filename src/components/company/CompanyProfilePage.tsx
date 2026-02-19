// ============================================================
// 기업 프로필 페이지 — 채용 히스토리, 기술 프로필, 공고 목록
// ============================================================

import { useMemo } from 'react'
import { useParams, Link } from 'react-router-dom'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { useCompanyStore } from '@/stores/companyStore'
import { useWatchlistStore } from '@/stores/watchlistStore'
import { useJobStore } from '@/stores/jobStore'
import {
  ArrowLeft,
  Building2,
  Globe,
  MapPin,
  Star,
  StarOff,
  Briefcase,
  TrendingUp,
  Code2,
  CalendarDays,
} from 'lucide-react'
import { COMPANY_MAP } from '@/data/companies'
import { SIZE_LABELS, INDUSTRY_LABELS } from '@/data/companyLabels'

export function CompanyProfilePage() {
  const { companyId } = useParams<{ companyId: string }>()
  const company = useCompanyStore((s) => s.getCompanyById(companyId ?? ''))
  const jobs = useJobStore((s) => s.jobs)
  const { isWatching, addToWatchlist, removeFromWatchlist } = useWatchlistStore()

  const companyJobs = useMemo(
    () => jobs.filter((j) => j.companyId === companyId),
    [jobs, companyId],
  )

  const techProfile = useMemo(() => {
    const counts = new Map<string, number>()
    for (const job of companyJobs) {
      for (const skill of job.skills) {
        counts.set(skill, (counts.get(skill) ?? 0) + 1)
      }
    }
    return [...counts.entries()]
      .sort((a, b) => b[1] - a[1])
      .slice(0, 12)
  }, [companyJobs])

  const categoryBreakdown = useMemo(() => {
    const counts = new Map<string, number>()
    for (const job of companyJobs) {
      counts.set(job.category, (counts.get(job.category) ?? 0) + 1)
    }
    return [...counts.entries()].sort((a, b) => b[1] - a[1])
  }, [companyJobs])

  const monthlyHistory = useMemo(() => {
    const months = new Map<string, number>()
    for (const job of companyJobs) {
      const month = job.postedAt.slice(0, 7) // YYYY-MM
      months.set(month, (months.get(month) ?? 0) + 1)
    }
    return [...months.entries()].sort((a, b) => a[0].localeCompare(b[0])).slice(-6)
  }, [companyJobs])

  if (!company) {
    return (
      <div className="space-y-4">
        <Link to="/companies" className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
          <ArrowLeft className="size-4" />
          기업 목록으로
        </Link>
        <div className="py-12 text-center text-muted-foreground">
          기업을 찾을 수 없습니다.
        </div>
      </div>
    )
  }

  const watching = isWatching(company.id)

  function handleToggleWatch() {
    const c = company // narrowed reference
    if (!c) return
    if (watching) {
      removeFromWatchlist(c.id)
    } else {
      addToWatchlist({
        id: `w-${c.id}`,
        userId: 'local',
        companyId: c.id,
        company: c,
        alertEnabled: true,
        addedAt: new Date().toISOString(),
        lastCheckedAt: new Date().toISOString(),
        newPostingsCount: 0,
      })
    }
  }

  const seed = COMPANY_MAP.get(company.id)
  const careerUrl = seed?.careerUrl ?? null

  return (
    <div className="space-y-6">
      {/* 뒤로가기 */}
      <Link to="/companies" className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="size-4" />
        기업 목록으로
      </Link>

      {/* 기업 헤더 */}
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <h2 className="flex items-center gap-2 text-2xl font-bold tracking-tight">
            <Building2 className="size-6" aria-hidden="true" />
            {company.name}
          </h2>
          {company.nameEn && (
            <p className="text-muted-foreground">{company.nameEn}</p>
          )}
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Badge variant="secondary">{INDUSTRY_LABELS[company.industry]}</Badge>
            <span>{SIZE_LABELS[company.size]}</span>
            {company.location && (
              <span className="flex items-center gap-1">
                <MapPin className="size-3" aria-hidden="true" />
                {company.location}
              </span>
            )}
          </div>
        </div>
        <button
          onClick={handleToggleWatch}
          className="flex items-center gap-1.5 rounded-md border px-3 py-1.5 text-sm hover:bg-muted"
          aria-label={watching ? '관심 기업 해제' : '관심 기업 등록'}
        >
          {watching ? (
            <>
              <Star className="size-4 fill-yellow-400 text-yellow-400" />
              관심 등록됨
            </>
          ) : (
            <>
              <StarOff className="size-4" />
              관심 등록
            </>
          )}
        </button>
      </div>

      {/* KPI */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <KPICard
          icon={<Briefcase className="size-4 text-blue-500" />}
          label="활성 공고"
          value={`${company.activePostings}건`}
        />
        <KPICard
          icon={<TrendingUp className="size-4 text-emerald-500" />}
          label="총 공고"
          value={`${company.totalPostings}건`}
        />
        <KPICard
          icon={<Code2 className="size-4 text-violet-500" />}
          label="사용 기술"
          value={`${company.techStack.length}개`}
        />
        <KPICard
          icon={<CalendarDays className="size-4 text-amber-500" />}
          label="매칭 공고"
          value={`${companyJobs.length}건`}
        />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* 기술 프로필 */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">기술 프로필</CardTitle>
          </CardHeader>
          <CardContent>
            {company.techStack.length > 0 ? (
              <div className="space-y-3">
                <div className="flex flex-wrap gap-1.5">
                  {company.techStack.map((tech) => (
                    <Badge key={tech} variant="secondary">
                      {tech}
                    </Badge>
                  ))}
                </div>
                {techProfile.length > 0 && (
                  <div className="space-y-1.5 pt-2">
                    <p className="text-xs font-medium text-muted-foreground">
                      공고 기반 기술 빈도
                    </p>
                    {techProfile.map(([skill, count]) => (
                      <div key={skill} className="flex items-center gap-2 text-sm">
                        <span className="w-20 shrink-0 truncate">{skill}</span>
                        <div className="relative h-4 min-w-0 flex-1 overflow-hidden rounded-full bg-muted">
                          <div
                            className="h-full rounded-full bg-violet-500/70"
                            style={{
                              width: `${Math.min(100, (count / (techProfile[0]?.[1] || 1)) * 100)}%`,
                            }}
                          />
                        </div>
                        <span className="w-8 shrink-0 text-right text-xs text-muted-foreground">
                          {count}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">기술 정보 없음</p>
            )}
          </CardContent>
        </Card>

        {/* 직군 분포 */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">직군 분포</CardTitle>
          </CardHeader>
          <CardContent>
            {categoryBreakdown.length > 0 ? (
              <div className="space-y-2">
                {categoryBreakdown.map(([cat, count]) => (
                  <div key={cat} className="flex items-center gap-2 text-sm">
                    <span className="w-24 shrink-0 text-muted-foreground">{cat}</span>
                    <div
                      className="relative h-5 flex-1 overflow-hidden rounded-full bg-muted"
                      role="progressbar"
                      aria-valuenow={count}
                      aria-valuemin={0}
                      aria-valuemax={companyJobs.length}
                      aria-label={`${cat}: ${count}건`}
                    >
                      <div
                        className="h-full rounded-full bg-primary/70"
                        style={{
                          width: `${(count / (categoryBreakdown[0]?.[1] || 1)) * 100}%`,
                        }}
                      />
                    </div>
                    <span className="w-10 shrink-0 text-right text-xs text-muted-foreground">
                      {count}건
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">공고 데이터 없음</p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* 채용 히스토리 */}
      {monthlyHistory.length > 0 && (
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">월별 채용 추이</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-end gap-2" role="img" aria-label="월별 채용 추이 차트">
              {(() => {
                const maxCount = Math.max(...monthlyHistory.map((h) => h[1]))
                return monthlyHistory.map(([month, count]) => {
                  const height = maxCount > 0 ? (count / maxCount) * 100 : 0
                  return (
                    <div key={month} className="flex flex-1 flex-col items-center gap-1">
                      <span className="text-xs font-medium">{count}</span>
                      <div
                        className="w-full rounded-t bg-primary/70 transition-all"
                        style={{ height: `${Math.max(4, height)}px`, minHeight: 4 }}
                      />
                      <span className="text-xs text-muted-foreground">
                        {month.slice(5)}월
                      </span>
                    </div>
                  )
                })
              })()}
            </div>
          </CardContent>
        </Card>
      )}

      {/* 최근 공고 */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base">
            최근 공고 ({companyJobs.length}건)
          </CardTitle>
        </CardHeader>
        <CardContent>
          {companyJobs.length > 0 ? (
            <div className="space-y-3">
              {[...companyJobs]
                .sort((a, b) => b.postedAt.localeCompare(a.postedAt))
                .slice(0, 10)
                .map((job) => (
                <Link
                  key={job.id}
                  to={`/job/${job.id}`}
                  className="block rounded-lg border p-3 transition-colors hover:bg-muted/50"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-sm font-medium">{job.title}</p>
                      <div className="mt-1 flex flex-wrap gap-1">
                        {job.skills.slice(0, 4).map((s) => (
                          <Badge key={s} variant="secondary" className="text-xs">
                            {s}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    <div className="text-right text-xs text-muted-foreground">
                      <p>{job.experience.text}</p>
                      <p>{job.location}</p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">등록된 공고가 없습니다.</p>
          )}
        </CardContent>
      </Card>

      {/* 외부 링크 */}
      {careerUrl && (
        <div className="flex gap-3">
          <a
            href={careerUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 rounded-md border px-3 py-1.5 text-sm text-muted-foreground hover:bg-muted"
            aria-label={`${company.name} 채용 페이지 (외부 링크)`}
          >
            <Globe className="size-4" />
            채용 페이지
          </a>
        </div>
      )}
    </div>
  )
}

function KPICard({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode
  label: string
  value: string
}) {
  return (
    <Card>
      <CardContent className="flex flex-col gap-1 p-4">
        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <span aria-hidden="true">{icon}</span>
          {label}
        </div>
        <p className="text-lg font-bold leading-tight">{value}</p>
      </CardContent>
    </Card>
  )
}
