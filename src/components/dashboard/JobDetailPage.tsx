import { useParams, useNavigate } from 'react-router-dom'
import { useJobStore } from '@/stores/jobStore'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { getCategoryLabel, getCategoryIcon } from '@/data/categories'
import { SOURCE_MAP } from '@/data/sources'
import {
  ArrowLeft, MapPin, Calendar, ExternalLink, Wifi,
  Banknote, Briefcase, Clock, Building2, Code2,
  Bookmark, Share2,
} from 'lucide-react'

export function JobDetailPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const getJobById = useJobStore((s) => s.getJobById)

  const job = id ? getJobById(id) : undefined

  if (!job) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 py-20 text-muted-foreground">
        <Briefcase className="size-12 text-muted-foreground/30" />
        <p className="text-lg">공고를 찾을 수 없습니다</p>
        <Button variant="outline" onClick={() => navigate('/')}>
          <ArrowLeft className="mr-2 size-4" />
          대시보드로 돌아가기
        </Button>
      </div>
    )
  }

  const source = SOURCE_MAP.get(job.source)
  const CategoryIcon = getCategoryIcon(job.category)

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      {/* 뒤로가기 */}
      <Button variant="ghost" size="sm" onClick={() => navigate(-1)}>
        <ArrowLeft className="mr-2 size-4" />
        뒤로가기
      </Button>

      {/* 헤더 카드 */}
      <Card>
        <CardHeader>
          <div className="flex items-start justify-between gap-4">
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Building2 className="size-4" />
                <span className="font-medium">{job.companyName}</span>
              </div>
              <CardTitle className="text-2xl leading-tight">{job.title}</CardTitle>
              <div className="flex flex-wrap gap-2">
                <Badge variant="outline">
                  {CategoryIcon && <CategoryIcon className="mr-1 size-3" />}
                  {getCategoryLabel(job.category)}
                </Badge>
                {job.isRemote && (
                  <Badge variant="secondary" className="text-emerald-600">
                    <Wifi className="mr-1 size-3" />
                    원격근무
                  </Badge>
                )}
                <Badge variant="secondary">{job.experience.text}</Badge>
              </div>
            </div>

            <div className="flex gap-2">
              <Button variant="outline" size="icon" aria-label="북마크">
                <Bookmark className="size-4" />
              </Button>
              <Button variant="outline" size="icon" aria-label="공유">
                <Share2 className="size-4" />
              </Button>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* 핵심 정보 그리드 */}
          <div className="grid grid-cols-2 gap-4 rounded-lg border p-4 md:grid-cols-4">
            <InfoItem
              icon={Banknote}
              label="연봉"
              value={job.salary?.text ?? '협의'}
              highlight={!!job.salary}
            />
            <InfoItem
              icon={Briefcase}
              label="경력"
              value={job.experience.text}
            />
            <InfoItem
              icon={MapPin}
              label="지역"
              value={job.location}
            />
            <InfoItem
              icon={Calendar}
              label="마감일"
              value={job.deadline ?? '상시채용'}
              highlight={!!job.deadline}
            />
          </div>

          <Separator />

          {/* 기술 스택 */}
          <div>
            <h3 className="mb-3 flex items-center gap-2 font-semibold">
              <Code2 className="size-4" />
              요구 기술 스택
            </h3>
            <div className="flex flex-wrap gap-2">
              {job.skills.map((skill) => (
                <Badge key={skill} variant="secondary" className="text-sm">
                  {skill}
                </Badge>
              ))}
            </div>
          </div>

          <Separator />

          {/* 상세 정보 */}
          <div className="space-y-2 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <Clock className="size-3.5" />
              수집일: {new Date(job.collectedAt).toLocaleDateString('ko')}
            </div>
            {job.postedAt && (
              <div className="flex items-center gap-2">
                <Calendar className="size-3.5" />
                게시일: {new Date(job.postedAt).toLocaleDateString('ko')}
              </div>
            )}
            <div className="flex items-center gap-2">
              출처: {source?.name ?? job.source}
            </div>
          </div>

          <Separator />

          {/* 원문 보기 */}
          <div className="flex gap-3">
            <Button asChild className="flex-1">
              <a href={job.sourceUrl} target="_blank" rel="noopener noreferrer">
                <ExternalLink className="mr-2 size-4" />
                원문 보기
              </a>
            </Button>
            <Button variant="outline" className="flex-1">
              <Bookmark className="mr-2 size-4" />
              관심 공고 등록
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

function InfoItem({
  icon: Icon,
  label,
  value,
  highlight = false,
}: {
  icon: React.ComponentType<{ className?: string }>
  label: string
  value: string
  highlight?: boolean
}) {
  return (
    <div className="space-y-1">
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className={`flex items-center gap-1.5 text-sm font-medium ${highlight ? 'text-foreground' : 'text-muted-foreground'}`}>
        <Icon className="size-3.5 shrink-0" />
        {value}
      </p>
    </div>
  )
}
