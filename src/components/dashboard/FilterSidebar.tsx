import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { JOB_CATEGORIES } from '@/data/categories'
import { useFilterStore } from '@/stores/filterStore'
import {
  X, FolderOpen, Code2, Building, Globe, MapPin,
  Briefcase, SortAsc, SortDesc, ArrowUpDown,
  Radio,
} from 'lucide-react'
import type { ExperienceLevel } from '@/types/job'

const experienceOptions: { value: ExperienceLevel | 'all'; label: string }[] = [
  { value: 'all', label: '전체' },
  { value: 'junior', label: '신입/주니어' },
  { value: 'mid', label: '미드 (3~6년)' },
  { value: 'senior', label: '시니어 (7년+)' },
  { value: 'lead', label: '리드/수석' },
]

const sortOptions: { value: 'latest' | 'deadline' | 'salary' | 'company'; label: string }[] = [
  { value: 'latest', label: '최신순' },
  { value: 'deadline', label: '마감임박순' },
  { value: 'salary', label: '연봉순' },
  { value: 'company', label: '회사명순' },
]

const popularSkills = [
  'Java', 'Python', 'TypeScript', 'React', 'Spring',
  'Kotlin', 'Go', 'Kubernetes', 'AWS', 'Docker',
  'Node.js', 'Next.js', 'PostgreSQL', 'Redis', 'Kafka',
]

const mainRegions = ['서울', '경기', '인천', '부산', '대전', '원격근무']

const sourceOptions = [
  { id: 'wanted' as const, name: '원티드' },
  { id: 'saramin' as const, name: '사람인' },
  { id: 'jobkorea' as const, name: '잡코리아' },
  { id: 'programmers' as const, name: '프로그래머스' },
  { id: 'jumpit' as const, name: '점핏' },
]

export function FilterSidebar() {
  const selectedCategories = useFilterStore((s) => s.selectedCategories)
  const toggleCategory = useFilterStore((s) => s.toggleCategory)
  const selectedSkills = useFilterStore((s) => s.selectedSkills)
  const toggleSkill = useFilterStore((s) => s.toggleSkill)
  const remoteOnly = useFilterStore((s) => s.remoteOnly)
  const setRemoteOnly = useFilterStore((s) => s.setRemoteOnly)
  const experienceLevel = useFilterStore((s) => s.experienceLevel)
  const setExperienceLevel = useFilterStore((s) => s.setExperienceLevel)
  const selectedRegions = useFilterStore((s) => s.selectedRegions)
  const toggleRegion = useFilterStore((s) => s.toggleRegion)
  const selectedSources = useFilterStore((s) => s.selectedSources)
  const toggleSource = useFilterStore((s) => s.toggleSource)
  const sortBy = useFilterStore((s) => s.sortBy)
  const setSortBy = useFilterStore((s) => s.setSortBy)
  const sortOrder = useFilterStore((s) => s.sortOrder)
  const setSortOrder = useFilterStore((s) => s.setSortOrder)
  const resetFilters = useFilterStore((s) => s.resetFilters)
  const hasActiveFilters = useFilterStore((s) => s.hasActiveFilters)

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base">필터</CardTitle>
          {hasActiveFilters() && (
            <Button variant="ghost" size="xs" onClick={resetFilters}>
              <X className="mr-1 size-3" />
              초기화
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* 정렬 */}
        <div>
          <h4 className="mb-2 flex items-center gap-1.5 text-sm font-medium">
            <ArrowUpDown className="size-3.5 text-muted-foreground" />
            정렬
          </h4>
          <div className="flex flex-wrap gap-1.5">
            {sortOptions.map((opt) => (
              <Badge
                key={opt.value}
                variant={sortBy === opt.value ? 'default' : 'outline'}
                className="cursor-pointer text-xs"
                onClick={() => setSortBy(opt.value)}
              >
                {opt.label}
              </Badge>
            ))}
            <Button
              variant="ghost"
              size="xs"
              onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
              className="ml-auto h-5 px-1"
            >
              {sortOrder === 'desc' ? <SortDesc className="size-3.5" /> : <SortAsc className="size-3.5" />}
            </Button>
          </div>
        </div>

        <Separator />

        {/* 직군 필터 */}
        <div>
          <h4 className="mb-2 flex items-center gap-1.5 text-sm font-medium">
            <FolderOpen className="size-3.5 text-muted-foreground" />
            직군
          </h4>
          <div className="flex flex-wrap gap-1.5">
            {JOB_CATEGORIES.filter((c) => c.group === 'dev').map((cat) => {
              const Icon = cat.icon
              return (
                <Badge
                  key={cat.id}
                  variant={selectedCategories.includes(cat.id) ? 'default' : 'outline'}
                  className="cursor-pointer text-xs"
                  onClick={() => toggleCategory(cat.id)}
                >
                  <Icon className="mr-1 size-3" />
                  {cat.label}
                </Badge>
              )
            })}
          </div>
        </div>

        <Separator />

        {/* 경력 필터 */}
        <div>
          <h4 className="mb-2 flex items-center gap-1.5 text-sm font-medium">
            <Briefcase className="size-3.5 text-muted-foreground" />
            경력
          </h4>
          <div className="flex flex-wrap gap-1.5">
            {experienceOptions.map((opt) => (
              <Badge
                key={opt.value}
                variant={experienceLevel === opt.value ? 'default' : 'outline'}
                className="cursor-pointer text-xs"
                onClick={() => setExperienceLevel(opt.value)}
              >
                {opt.label}
              </Badge>
            ))}
          </div>
        </div>

        <Separator />

        {/* 기술 스택 필터 */}
        <div>
          <h4 className="mb-2 flex items-center gap-1.5 text-sm font-medium">
            <Code2 className="size-3.5 text-muted-foreground" />
            기술 스택
          </h4>
          <div className="flex flex-wrap gap-1.5">
            {popularSkills.map((skill) => (
              <Badge
                key={skill}
                variant={selectedSkills.includes(skill) ? 'default' : 'outline'}
                className="cursor-pointer text-xs"
                onClick={() => toggleSkill(skill)}
              >
                {skill}
              </Badge>
            ))}
          </div>
        </div>

        <Separator />

        {/* 지역 필터 */}
        <div>
          <h4 className="mb-2 flex items-center gap-1.5 text-sm font-medium">
            <MapPin className="size-3.5 text-muted-foreground" />
            지역
          </h4>
          <div className="flex flex-wrap gap-1.5">
            {mainRegions.map((region) => (
              <Badge
                key={region}
                variant={selectedRegions.includes(region) ? 'default' : 'outline'}
                className="cursor-pointer text-xs"
                onClick={() => toggleRegion(region)}
              >
                {region}
              </Badge>
            ))}
          </div>
        </div>

        <Separator />

        {/* 소스 필터 */}
        <div>
          <h4 className="mb-2 flex items-center gap-1.5 text-sm font-medium">
            <Radio className="size-3.5 text-muted-foreground" />
            소스
          </h4>
          <div className="flex flex-wrap gap-1.5">
            {sourceOptions.map((src) => (
              <Badge
                key={src.id}
                variant={selectedSources.includes(src.id) ? 'default' : 'outline'}
                className="cursor-pointer text-xs"
                onClick={() => toggleSource(src.id)}
              >
                {src.name}
              </Badge>
            ))}
          </div>
        </div>

        <Separator />

        {/* 근무형태 */}
        <div>
          <h4 className="mb-2 flex items-center gap-1.5 text-sm font-medium">
            <Building className="size-3.5 text-muted-foreground" />
            근무형태
          </h4>
          <Badge
            variant={remoteOnly ? 'default' : 'outline'}
            className="cursor-pointer text-xs"
            onClick={() => setRemoteOnly(!remoteOnly)}
          >
            <Globe className="mr-1 size-3" />
            원격근무만
          </Badge>
        </div>
      </CardContent>
    </Card>
  )
}
