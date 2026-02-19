// ============================================================
// IT 직군 카테고리 데이터
// ============================================================

import type { JobCategory } from '@/types/job'
import type { LucideIcon } from 'lucide-react'
import {
  Globe,
  Server,
  Smartphone,
  Monitor,
  Cloud,
  Brain,
  ShieldCheck,
  Gamepad2,
  Database,
  FlaskConical,
  Kanban,
  Palette,
  LineChart,
  ClipboardList,
} from 'lucide-react'

export interface CategoryInfo {
  id: JobCategory
  label: string
  labelEn: string
  icon: LucideIcon
  description: string
  group: 'dev' | 'non-dev'
  relatedSkillCategories: string[]
}

export const JOB_CATEGORIES: CategoryInfo[] = [
  // ── 개발 직군 ──
  {
    id: 'frontend',
    label: '웹 프론트엔드',
    labelEn: 'Web Frontend',
    icon: Globe,
    description: 'React, Vue, Angular, Next.js, TypeScript 등 웹 프론트엔드 개발',
    group: 'dev',
    relatedSkillCategories: ['frontend', 'languages'],
  },
  {
    id: 'backend',
    label: '웹 백엔드',
    labelEn: 'Web Backend',
    icon: Server,
    description: 'Java/Spring, Node.js, Python/Django, Go 등 서버 개발',
    group: 'dev',
    relatedSkillCategories: ['backend', 'database', 'languages'],
  },
  {
    id: 'mobile',
    label: '모바일',
    labelEn: 'Mobile',
    icon: Smartphone,
    description: 'iOS, Android, Flutter, React Native 등 모바일 앱 개발',
    group: 'dev',
    relatedSkillCategories: ['mobile', 'languages'],
  },
  {
    id: 'system',
    label: '시스템/인프라',
    labelEn: 'System/Infra',
    icon: Monitor,
    description: 'Windows, Linux, 네트워크, 임베디드, 시스템 프로그래밍',
    group: 'dev',
    relatedSkillCategories: ['os', 'languages'],
  },
  {
    id: 'devops',
    label: 'DevOps / SRE / Cloud',
    labelEn: 'DevOps / SRE / Cloud',
    icon: Cloud,
    description: 'Kubernetes, Docker, Terraform, AWS, GCP, CI/CD 등',
    group: 'dev',
    relatedSkillCategories: ['devops', 'methodology'],
  },
  {
    id: 'ai_ml',
    label: 'AI / ML / Data',
    labelEn: 'AI / ML / Data',
    icon: Brain,
    description: 'ML Engineer, Data Scientist, Data Engineer, MLOps',
    group: 'dev',
    relatedSkillCategories: ['ai_ml', 'languages'],
  },
  {
    id: 'security',
    label: '보안',
    labelEn: 'Security',
    icon: ShieldCheck,
    description: '보안 엔지니어, 침투 테스터, SOC, 보안 컨설팅',
    group: 'dev',
    relatedSkillCategories: ['os', 'devops'],
  },
  {
    id: 'game',
    label: '게임',
    labelEn: 'Game',
    icon: Gamepad2,
    description: 'Unity, Unreal, 게임 서버, 게임 클라이언트 개발',
    group: 'dev',
    relatedSkillCategories: ['languages'],
  },
  {
    id: 'dba',
    label: 'DBA / Database',
    labelEn: 'DBA / Database',
    icon: Database,
    description: 'MySQL, PostgreSQL, Oracle, MongoDB, Redis 등 DB 관리',
    group: 'dev',
    relatedSkillCategories: ['database'],
  },
  {
    id: 'qa',
    label: 'QA / Test',
    labelEn: 'QA / Test',
    icon: FlaskConical,
    description: '자동화 QA, 성능 테스트, SDET',
    group: 'dev',
    relatedSkillCategories: ['testing'],
  },

  // ── 비개발 IT 직군 ──
  {
    id: 'pm_po',
    label: 'PM / PO',
    labelEn: 'Product Manager / Owner',
    icon: Kanban,
    description: '프로덕트 매니저, 프로덕트 오너, 프로젝트 매니저',
    group: 'non-dev',
    relatedSkillCategories: ['methodology', 'tools'],
  },
  {
    id: 'designer',
    label: 'UI/UX 디자이너',
    labelEn: 'UI/UX Designer',
    icon: Palette,
    description: 'UI, UX 디자인, 사용자 리서치, 프로토타이핑',
    group: 'non-dev',
    relatedSkillCategories: ['tools'],
  },
  {
    id: 'sales_engineer',
    label: '기술 영업 / SE',
    labelEn: 'Solutions Engineer',
    icon: LineChart,
    description: '기술 영업, 솔루션 엔지니어, 프리세일즈',
    group: 'non-dev',
    relatedSkillCategories: [],
  },
  {
    id: 'it_planner',
    label: 'IT 기획',
    labelEn: 'IT Planner',
    icon: ClipboardList,
    description: 'IT 서비스 기획, 비즈니스 분석',
    group: 'non-dev',
    relatedSkillCategories: [],
  },
]

/** 카테고리 ID → 정보 조회 */
export const CATEGORY_MAP = new Map(JOB_CATEGORIES.map((c) => [c.id, c]))

/** 카테고리 라벨 조회 */
export function getCategoryLabel(id: JobCategory): string {
  return CATEGORY_MAP.get(id)?.label ?? id
}

/** 카테고리 아이콘 조회 */
export function getCategoryIcon(id: JobCategory): LucideIcon | undefined {
  return CATEGORY_MAP.get(id)?.icon
}

/** 개발 직군만 */
export const DEV_CATEGORIES = JOB_CATEGORIES.filter((c) => c.group === 'dev')

/** 비개발 직군만 */
export const NON_DEV_CATEGORIES = JOB_CATEGORIES.filter((c) => c.group === 'non-dev')
