// ============================================================
// 수집기 인덱스 — 모든 수집기를 통합 관리
// ============================================================

// Tier 1
export { WantedCollector } from './wanted'
export { SaraminCollector } from './saramin'
export { JobKoreaCollector } from './jobkorea'
export { ProgrammersCollector } from './programmers'
export { JumpitCollector } from './jumpit'

// Tier 2
export { RallitCollector } from './rallit'
export { RocketPunchCollector } from './rocketpunch'
export { IndeedCollector } from './indeed'
export { BlindCollector } from './blind'
export { CatchCollector } from './catch'
export { JobPlanetCollector } from './jobplanet'
export { OkkyCollector } from './okky'
export { DisquietCollector } from './disquiet'
export { CareerlyCollector } from './careerly'
export { WorkNetCollector } from './worknet'
export { PeopleNJobCollector } from './peoplenjob'

export { extractSkills, extractSkillNames, resolveSkillName } from './skillExtractor'
export { classifyJob } from './jobClassifier'
export { parseSalary, formatSalary } from './salaryParser'
export { parseExperience } from './experienceParser'
export { normalizeCompanyName, cleanCompanyName } from './companyMatcher'
export { parseRawJob, runCollector, runPipeline } from './pipeline'

export type {
  RawJobData,
  ParsedJobData,
  Collector,
  CollectResult,
  PipelineOptions,
} from './types'
