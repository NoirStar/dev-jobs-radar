// ============================================================
// 직군 자동 분류기
// — 공고 제목 + 기술 스택으로 직군을 자동 판별
// ============================================================

import type { JobCategory } from '@/types/job'

/** 직군별 키워드 가중치 */
const CATEGORY_KEYWORDS: Record<JobCategory, { titleWords: string[]; skills: string[]; weight: number }> = {
  frontend: {
    titleWords: ['프론트엔드', 'frontend', 'front-end', 'fe 개발', '웹 개발', 'ui 개발'],
    skills: ['React', 'Vue', 'Angular', 'Next.js', 'TypeScript', 'JavaScript', 'Svelte', 'HTML', 'CSS', 'Tailwind CSS', 'Webpack', 'Vite'],
    weight: 1,
  },
  backend: {
    titleWords: ['백엔드', 'backend', 'back-end', 'be 개발', '서버 개발', 'api 개발'],
    skills: ['Java', 'Spring', 'Node.js', 'Python', 'Django', 'FastAPI', 'Go', 'NestJS', 'Express', 'PostgreSQL', 'MySQL', 'Redis', 'Kafka'],
    weight: 1,
  },
  mobile: {
    titleWords: ['모바일', 'mobile', 'ios', 'android', 'flutter', 'react native', '앱 개발'],
    skills: ['Swift', 'Kotlin', 'Flutter', 'React Native', 'iOS', 'Android', 'SwiftUI', 'Jetpack Compose'],
    weight: 1.2,
  },
  devops: {
    titleWords: ['devops', 'sre', 'cloud', '클라우드', '인프라', 'infrastructure', 'platform'],
    skills: ['Kubernetes', 'Docker', 'Terraform', 'AWS', 'GCP', 'Azure', 'CI/CD', 'Jenkins', 'ArgoCD', 'Prometheus'],
    weight: 1.2,
  },
  ai_ml: {
    titleWords: ['ai', 'ml', 'machine learning', 'data scientist', 'data engineer', '인공지능', '머신러닝', '데이터'],
    skills: ['PyTorch', 'TensorFlow', 'Python', 'Pandas', 'Spark', 'Airflow', 'MLflow', 'Hugging Face', 'LLM'],
    weight: 1.3,
  },
  system: {
    titleWords: ['시스템', 'system', '임베디드', 'embedded', '네트워크', 'network', 'firmware'],
    skills: ['C', 'C++', 'Linux', 'Embedded', 'RTOS', 'Firmware', 'Device Driver'],
    weight: 1.1,
  },
  security: {
    titleWords: ['보안', 'security', 'soc', '침투', 'penetration', 'pentest', '정보보안'],
    skills: ['SIEM', 'Firewall', 'IDS', 'SOC'],
    weight: 1.3,
  },
  game: {
    titleWords: ['게임', 'game', 'unity', 'unreal', '게임 서버', '게임 클라이언트'],
    skills: ['Unity', 'Unreal', 'C#', 'C++'],
    weight: 1.2,
  },
  dba: {
    titleWords: ['dba', 'database', 'db 관리', '데이터베이스'],
    skills: ['PostgreSQL', 'MySQL', 'Oracle', 'MongoDB', 'Redis', 'MariaDB'],
    weight: 1.1,
  },
  qa: {
    titleWords: ['qa', 'test', 'sdet', '품질', '테스트'],
    skills: ['Selenium', 'Cypress', 'Playwright', 'JUnit', 'Jest'],
    weight: 1.1,
  },
  pm_po: {
    titleWords: ['pm', 'po', 'product manager', 'product owner', '프로덕트', '기획'],
    skills: ['Jira', 'Confluence', 'Figma', 'Notion'],
    weight: 0.8,
  },
  designer: {
    titleWords: ['ui', 'ux', '디자이너', 'designer', '디자인'],
    skills: ['Figma', 'Sketch', 'Adobe XD', 'Zeplin'],
    weight: 1,
  },
  sales_engineer: {
    titleWords: ['기술 영업', 'se', 'solutions engineer', '프리세일즈', 'presales'],
    skills: [],
    weight: 0.9,
  },
  it_planner: {
    titleWords: ['it 기획', 'it planner', '서비스 기획', '비즈니스 분석'],
    skills: [],
    weight: 0.8,
  },
}

/**
 * 공고 제목과 기술 스택으로 직군을 자동 분류합니다.
 *
 * @param title 공고 제목
 * @param skills 추출된 기술 스택 목록
 * @returns 가장 적합한 직군 ID
 */
export function classifyJob(title: string, skills: string[]): JobCategory {
  const lowerTitle = title.toLowerCase()
  const skillSet = new Set(skills)

  let bestCategory: JobCategory = 'backend' // 기본값
  let bestScore = 0

  for (const [category, config] of Object.entries(CATEGORY_KEYWORDS) as [JobCategory, typeof CATEGORY_KEYWORDS[JobCategory]][]) {
    let score = 0

    // 제목 키워드 매칭 (높은 가중치)
    for (const keyword of config.titleWords) {
      if (lowerTitle.includes(keyword)) {
        score += 3
      }
    }

    // 기술 스택 매칭
    for (const skill of config.skills) {
      if (skillSet.has(skill)) {
        score += 1
      }
    }

    // 카테고리별 가중치 적용
    score *= config.weight

    if (score > bestScore) {
      bestScore = score
      bestCategory = category
    }
  }

  return bestCategory
}
