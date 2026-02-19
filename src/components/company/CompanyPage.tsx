import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { useCompanyStore } from '@/stores/companyStore'
import { Building2, MapPin } from 'lucide-react'

export function CompanyPage() {
  const companies = useCompanyStore((s) => s.companies)

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">기업 탐색</h2>
        <p className="text-muted-foreground">
          IT 기업 프로필 & 채용 현황 ({companies.length}개 기업)
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {companies.slice(0, 12).map((company) => (
          <Card key={company.id} className="transition-shadow hover:shadow-md">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2 text-base">
                    <Building2 className="size-4" />
                    {company.name}
                  </CardTitle>
                  {company.nameEn && (
                    <p className="text-xs text-muted-foreground">{company.nameEn}</p>
                  )}
                </div>
                <Badge variant="outline" className="text-xs">
                  공고 {company.activePostings}개
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex flex-wrap gap-1">
                {company.techStack.slice(0, 4).map((tech) => (
                  <Badge key={tech} variant="secondary" className="text-xs">
                    {tech}
                  </Badge>
                ))}
              </div>
              {company.location && (
                <p className="flex items-center gap-1 text-xs text-muted-foreground">
                  <MapPin className="size-3" />
                  {company.location}
                </p>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
