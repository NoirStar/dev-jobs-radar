// ============================================================
// 수집기 인덱스 — 모든 수집기를 통합 관리
// ============================================================

export { WantedCollector } from './wanted'
export { SaraminCollector } from './saramin'
export { JobKoreaCollector } from './jobkorea'
export { ProgrammersCollector } from './programmers'
export { JumpitCollector } from './jumpit'

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
