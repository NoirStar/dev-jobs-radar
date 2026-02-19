// ============================================================
// AI 서비스 — 공고 요약, 기술 매칭, 면접 질문 생성
// ============================================================

import type { JobPosting, JobPostingSummary } from '@/types/job'
import type { UserProfile } from '@/types/user'

// ── OpenAI 설정 ──
// NOTE: AI 기능은 서버 프록시(/api/ai/chat)를 통해 호출합니다.
// VITE_OPENAI_API_KEY는 개발 편의용이며, 프로덕션에서는 서버 측 환경변수를 사용하세요.

const AI_PROXY_URL = '/api/ai/chat'
const OPENAI_KEY = import.meta.env.VITE_OPENAI_API_KEY ?? ''
export const isOpenAIConfigured = Boolean(OPENAI_KEY)

const OPENAI_URL = 'https://api.openai.com/v1/chat/completions'
const MODEL = 'gpt-4o-mini'
const TIMEOUT = 30_000

interface ChatMessage {
  role: 'system' | 'user' | 'assistant'
  content: string
}

async function chatComplete(messages: ChatMessage[], maxTokens = 1024): Promise<string> {
  if (!isOpenAIConfigured) throw new Error('OpenAI API 키가 설정되지 않았습니다.')

  // 프록시 엔드포인트 우선, 없으면 직접 호출 (개발용)
  try {
    const proxyRes = await fetch(AI_PROXY_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ messages, maxTokens }),
      signal: AbortSignal.timeout(TIMEOUT),
    })
    if (proxyRes.ok) {
      const data = await proxyRes.json()
      return data.content ?? data.choices?.[0]?.message?.content ?? ''
    }
  } catch {
    // 프록시 미사용 시 직접 호출 폴백
  }

  const res = await fetch(OPENAI_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${OPENAI_KEY}`,
    },
    body: JSON.stringify({
      model: MODEL,
      messages,
      max_tokens: maxTokens,
      temperature: 0.7,
    }),
    signal: AbortSignal.timeout(TIMEOUT),
  })

  if (!res.ok) {
    const text = await res.text().catch(() => '')
    throw new Error(`OpenAI API 오류 (${res.status}): ${text}`)
  }

  const data = await res.json()
  return data.choices?.[0]?.message?.content ?? ''
}

// ── 안전한 JSON 파싱 유틸 ──

function asStringArray(val: unknown): string[] {
  return Array.isArray(val) ? val.filter((x): x is string => typeof x === 'string') : []
}

function parseJobSummary(raw: unknown): JobSummary {
  const obj = (raw && typeof raw === 'object' ? raw : {}) as Record<string, unknown>
  return {
    overview: typeof obj.overview === 'string' ? obj.overview : '',
    keyRequirements: asStringArray(obj.keyRequirements),
    techStack: asStringArray(obj.techStack),
    highlights: asStringArray(obj.highlights),
    concerns: asStringArray(obj.concerns),
  }
}

function parseSkillMatch(raw: unknown, fallback: SkillMatch): SkillMatch {
  const obj = (raw && typeof raw === 'object' ? raw : {}) as Record<string, unknown>
  return {
    score: typeof obj.score === 'number' ? Math.min(100, Math.max(0, Math.round(obj.score))) : fallback.score,
    matchedSkills: asStringArray(obj.matchedSkills),
    missingSkills: asStringArray(obj.missingSkills),
    partialMatches: asStringArray(obj.partialMatches),
    recommendation: typeof obj.recommendation === 'string' ? obj.recommendation : fallback.recommendation,
  }
}

function parseInterviewPrep(raw: unknown): InterviewPrep {
  const obj = (raw && typeof raw === 'object' ? raw : {}) as Record<string, unknown>
  return {
    technicalQuestions: asStringArray(obj.technicalQuestions),
    behavioralQuestions: asStringArray(obj.behavioralQuestions),
    companyResearch: asStringArray(obj.companyResearch),
    tips: asStringArray(obj.tips),
  }
}

/** JobPosting → JobPostingSummary 변환 */
function toJobSummary(job: JobPosting): JobPostingSummary {
  return {
    id: job.id,
    title: job.title,
    companyName: job.companyName,
    companyId: job.companyId,
    category: job.category,
    skills: job.skills.all,
    experience: job.experience,
    salary: job.salary,
    location: job.location,
    isRemote: job.isRemote,
    source: job.source,
    sourceUrl: job.sourceUrl,
    deadline: job.deadline,
    postedAt: job.postedAt,
    collectedAt: job.collectedAt,
    isActive: job.isActive,
  }
}

// ── 공고 요약 ──

export interface JobSummary {
  overview: string
  keyRequirements: string[]
  techStack: string[]
  highlights: string[]
  concerns: string[]
}

export async function summarizeJob(job: JobPosting): Promise<JobSummary> {
  const prompt = `다음 채용공고를 분석하여 JSON으로 응답하세요.

공고:
- 제목: ${job.title}
- 기업: ${job.companyName}
- 직군: ${job.category}
- 위치: ${job.location}
- 설명: ${job.description ?? '없음'}
- 요구사항: ${job.requirements ?? '없음'}
- 우대사항: ${job.preferredQualifications ?? '없음'}
- 기술: ${job.skills.all.join(', ')}

JSON 형식:
{
  "overview": "3줄 이내 핵심 요약",
  "keyRequirements": ["필수 요구사항 1", "필수 요구사항 2"],
  "techStack": ["핵심 기술 1", "핵심 기술 2"],
  "highlights": ["매력 포인트 1", "매력 포인트 2"],
  "concerns": ["주의할 점 1"]
}`

  const text = await chatComplete([
    { role: 'system', content: '당신은 IT 채용 전문 분석가입니다. JSON만 출력하세요.' },
    { role: 'user', content: prompt },
  ])

  try {
    const cleaned = text.replace(/```json\n?|```\n?/g, '').trim()
    const parsed = parseJobSummary(JSON.parse(cleaned))
    return parsed.overview ? parsed : fallbackSummary(text, job)
  } catch {
    return fallbackSummary(text, job)
  }
}

function fallbackSummary(text: string, job: JobPosting): JobSummary {
  return {
    overview: text.slice(0, 300),
    keyRequirements: [],
    techStack: job.skills.all,
    highlights: [],
    concerns: [],
  }
}

// ── 기술 매칭 점수 ──

export interface SkillMatch {
  score: number // 0-100
  matchedSkills: string[]
  missingSkills: string[]
  partialMatches: string[]
  recommendation: string
}

/** 로컬 기술 매칭 (AI 없이 즉시 계산) */
export function calculateSkillMatch(
  userSkills: string[],
  jobSkills: string[],
): SkillMatch {
  if (jobSkills.length === 0) {
    return {
      score: 50,
      matchedSkills: [],
      missingSkills: [],
      partialMatches: [],
      recommendation: '요구 기술이 명시되지 않은 공고입니다.',
    }
  }

  const normalize = (s: string) => s.toLowerCase().replace(/[.\-_\s]/g, '')
  const userNorm = new Set(userSkills.map(normalize))
  const matched: string[] = []
  const missing: string[] = []
  const partial: string[] = []

  for (const skill of jobSkills) {
    const norm = normalize(skill)
    if (userNorm.has(norm)) {
      matched.push(skill)
    } else {
      // 부분 매칭 (포함 관계)
      const isPartial = [...userNorm].some(
        (u) => u.includes(norm) || norm.includes(u),
      )
      if (isPartial) {
        partial.push(skill)
      } else {
        missing.push(skill)
      }
    }
  }

  const fullMatchScore = (matched.length / jobSkills.length) * 100
  const partialScore = (partial.length / jobSkills.length) * 20
  const score = Math.min(100, Math.round(fullMatchScore + partialScore))

  let recommendation: string
  if (score >= 80) recommendation = '높은 적합도! 적극 지원을 추천합니다.'
  else if (score >= 60) recommendation = '좋은 매칭입니다. 부족한 기술을 강조하여 지원하세요.'
  else if (score >= 40) recommendation = '보통 수준입니다. 학습 의지를 어필하면 좋겠습니다.'
  else recommendation = '기술 갭이 있습니다. 학습 후 지원을 고려해보세요.'

  return { score, matchedSkills: matched, missingSkills: missing, partialMatches: partial, recommendation }
}

/** AI 기반 상세 매칭 분석 */
export async function analyzeSkillMatchAI(
  userProfile: UserProfile,
  job: JobPosting,
): Promise<SkillMatch> {
  const localMatch = calculateSkillMatch(userProfile.interestedSkills, job.skills.all)

  if (!isOpenAIConfigured) return localMatch

  const prompt = `사용자와 공고의 기술 매칭을 분석해주세요.

사용자:
- 관심 기술: ${userProfile.interestedSkills.join(', ')}
- 경력: ${userProfile.experienceYears ?? '미입력'}년
- 관심 직군: ${userProfile.interestedCategories.join(', ')}

공고:
- 제목: ${job.title}
- 기업: ${job.companyName}
- 필수 기술: ${job.skills.required.join(', ')}
- 우대 기술: ${job.skills.preferred.join(', ')}
- 경력 요구: ${job.experience.text}

JSON으로 응답:
{
  "score": 0-100 점수,
  "matchedSkills": ["매칭된 기술"],
  "missingSkills": ["부족한 기술"],
  "partialMatches": ["부분 매칭"],
  "recommendation": "한줄 추천 코멘트"
}`

  try {
    const text = await chatComplete([
      { role: 'system', content: 'IT 채용 매칭 전문가. JSON만 출력.' },
      { role: 'user', content: prompt },
    ])
    const cleaned = text.replace(/```json\n?|```\n?/g, '').trim()
    return parseSkillMatch(JSON.parse(cleaned), localMatch)
  } catch {
    return localMatch
  }
}

// ── 면접 준비 도우미 ──

export interface InterviewPrep {
  technicalQuestions: string[]
  behavioralQuestions: string[]
  companyResearch: string[]
  tips: string[]
}

/** 로컬 면접 질문 생성 (기술 스택 기반) */
export function generateLocalInterviewPrep(job: JobPostingSummary): InterviewPrep {
  const skills = job.skills
  const technicalQuestions = skills.slice(0, 5).map(
    (s) => `${s}에서 가장 어려웠던 문제와 해결 과정을 설명해주세요.`,
  )

  const behavioralQuestions = [
    '팀에서 의견 충돌이 있을 때 어떻게 해결하시나요?',
    '가장 도전적이었던 프로젝트 경험을 이야기해주세요.',
    '실패한 프로젝트에서 배운 점이 있다면?',
    '새로운 기술을 학습하는 본인만의 방법이 있나요?',
    '코드 리뷰에서 중요하게 생각하는 것은?',
  ]

  const companyResearch = [
    `${job.companyName}의 주요 제품/서비스를 조사하세요.`,
    `${job.companyName}의 기술 블로그나 GitHub를 확인하세요.`,
    `${job.companyName}의 최근 뉴스와 채용 동향을 파악하세요.`,
  ]

  const tips = [
    'STAR 기법으로 경험을 구조화하세요 (Situation, Task, Action, Result).',
    '지원한 직무와 관련된 포트폴리오를 준비하세요.',
    `${job.category} 분야의 최신 트렌드를 파악하세요.`,
  ]

  return { technicalQuestions, behavioralQuestions, companyResearch, tips }
}

/** AI 면접 준비 도우미 */
export async function generateInterviewPrep(job: JobPosting): Promise<InterviewPrep> {
  if (!isOpenAIConfigured) {
    return generateLocalInterviewPrep(toJobSummary(job))
  }

  const prompt = `다음 채용공고에 대한 면접 준비 가이드를 JSON으로 작성하세요.

공고:
- 제목: ${job.title}
- 기업: ${job.companyName}
- 직군: ${job.category}
- 기술: ${job.skills.all.join(', ')}
- 설명: ${(job.description ?? '').slice(0, 500)}
- 요구사항: ${(job.requirements ?? '').slice(0, 300)}

JSON 형식:
{
  "technicalQuestions": ["기술 질문 5개"],
  "behavioralQuestions": ["행동 질문 3개"],
  "companyResearch": ["기업 조사 포인트 3개"],
  "tips": ["면접 팁 3개"]
}`

  try {
    const text = await chatComplete([
      { role: 'system', content: 'IT 면접 코칭 전문가. JSON만 출력.' },
      { role: 'user', content: prompt },
    ])
    const cleaned = text.replace(/```json\n?|```\n?/g, '').trim()
    const parsed = parseInterviewPrep(JSON.parse(cleaned))
    return parsed.technicalQuestions.length > 0 ? parsed : generateLocalInterviewPrep(toJobSummary(job))
  } catch {
    return generateLocalInterviewPrep(toJobSummary(job))
  }
}
