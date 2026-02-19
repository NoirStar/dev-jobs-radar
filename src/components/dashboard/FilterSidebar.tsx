import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { JOB_CATEGORIES } from '@/data/categories'
import { useFilterStore } from '@/stores/filterStore'
import { X, FolderOpen, Code2, Building, Globe } from 'lucide-react'

export function FilterSidebar() {
  const selectedCategories = useFilterStore((s) => s.selectedCategories)
  const toggleCategory = useFilterStore((s) => s.toggleCategory)
  const selectedSkills = useFilterStore((s) => s.selectedSkills)
  const toggleSkill = useFilterStore((s) => s.toggleSkill)
  const remoteOnly = useFilterStore((s) => s.remoteOnly)
  const setRemoteOnly = useFilterStore((s) => s.setRemoteOnly)
  const resetFilters = useFilterStore((s) => s.resetFilters)
  const hasActiveFilters = useFilterStore((s) => s.hasActiveFilters)

  const popularSkills = [
    'Java', 'Python', 'TypeScript', 'React', 'Spring',
    'Kotlin', 'Go', 'Kubernetes', 'AWS', 'Docker',
    'Node.js', 'Next.js', 'PostgreSQL', 'Redis', 'Kafka',
  ]

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
