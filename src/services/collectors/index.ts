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

// Tier 3 — 글로벌
export { LinkedInCollector } from './linkedin'
export { GlassdoorCollector } from './glassdoor'
export { WellfoundCollector } from './wellfound'
export { RemoteOKCollector } from './remoteok'
export { WWRCollector } from './wwr'
export { StackOverflowCollector } from './stackoverflow'
export { HiredCollector } from './hired'
export { GreenJapanCollector } from './green_japan'
export { WantedlyJPCollector } from './wantedly_jp'
export { RobertWaltersCollector } from './robertwalters'
export { MichaelPageCollector } from './michaelpage'

// Tier 4 — 기업 직접
export {
  CompanyDirectCollector,
  createCompanyCollector,
  createIndustryCollector,
  platformCollector,
  fintechCollector,
  ecommerceCollector,
  gamingCollector,
  enterpriseCollector,
  telecomCollector,
} from './companyDirect'

// Custom URL 모니터링
export {
  CustomUrlCollector,
  createMonitorUrl,
  validateMonitorUrl,
} from './customUrl'
export type { CustomMonitorUrl, MonitorResult } from './customUrl'

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
