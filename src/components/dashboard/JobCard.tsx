import { MapPin, Calendar, ExternalLink, Wifi, Banknote } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import type { JobPostingSummary } from '@/types/job'
import { getCategoryLabel, getCategoryIcon } from '@/data/categories'
import { SOURCE_MAP } from '@/data/sources'

interface JobCardProps {
  job: JobPostingSummary
}

export function JobCard({ job }: JobCardProps) {
  const source = SOURCE_MAP.get(job.source)
  const CategoryIcon = getCategoryIcon(job.category)

  return (
    <Card className="transition-all hover:shadow-md hover:border-primary/20">
      <CardContent className="space-y-3 pt-6">
        {/* 헤더: 회사 + 직군 */}
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm font-medium text-muted-foreground">{job.companyName}</p>
            <h4 className="text-base font-semibold leading-tight">{job.title}</h4>
          </div>
          <Badge variant="outline" className="shrink-0">
            {CategoryIcon && <CategoryIcon className="mr-1 size-3" />}
            {getCategoryLabel(job.category)}
          </Badge>
        </div>

        {/* 기술 스택 */}
        <div className="flex flex-wrap gap-1.5">
          {job.skills.map((skill) => (
            <Badge key={skill} variant="secondary" className="text-xs">
              {skill}
            </Badge>
          ))}
        </div>

        {/* 상세 정보 */}
        <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
          {job.salary && (
            <span className="flex items-center gap-1 font-medium text-foreground">
              <Banknote className="size-3.5 text-emerald-500" />
              {job.salary.text}
            </span>
          )}
          <span className="flex items-center gap-1">
            <MapPin className="size-3.5" />
            {job.location}
          </span>
          {job.isRemote && (
            <span className="flex items-center gap-1 text-emerald-600">
              <Wifi className="size-3.5" />
              원격근무
            </span>
          )}
          {job.deadline && (
            <span className="flex items-center gap-1">
              <Calendar className="size-3.5" />~{job.deadline}
            </span>
          )}
          <span className="text-xs">{job.experience.text}</span>
        </div>

        {/* 하단: 소스 + 링크 */}
        <div className="flex items-center justify-between border-t pt-2">
          <span className="text-xs text-muted-foreground">
            {source?.name ?? job.source}
          </span>
          <Button variant="ghost" size="xs" asChild>
            <a href={job.sourceUrl} target="_blank" rel="noopener noreferrer">
              원문 보기 <ExternalLink className="size-3" />
            </a>
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
