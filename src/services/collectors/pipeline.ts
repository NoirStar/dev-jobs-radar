// ============================================================
// 수집 파이프라인
// — 원시 데이터 수집 → 기술 추출 → 직군 분류 → 연봉 파싱 → 회사 정규화
// ============================================================

import type { Collector, RawJobData, ParsedJobData, CollectResult, PipelineOptions } from './types'
import { extractSkillNames } from './skillExtractor'
import { classifyJob } from './jobClassifier'
import { parseSalary, formatSalary } from './salaryParser'
import { parseExperience } from './experienceParser'
import { normalizeCompanyName } from './companyMatcher'

/**
 * 원시 수집 데이터를 파싱하여 정형화된 공고 데이터로 변환합니다.
 */
export function parseRawJob(raw: RawJobData): ParsedJobData {
  // 기술 스택 추출
  const fullText = [raw.title, raw.description ?? ''].join(' ')
  const skills = extractSkillNames(fullText, raw.tags ?? [])

  // 직군 분류
  const category = classifyJob(raw.title, skills)

  // 경력 파싱
  const experience = parseExperience(raw.experienceText)

  // 연봉 파싱
  const rawSalary = parseSalary(raw.salaryText)
  const salary = rawSalary
    ? { ...rawSalary, text: formatSalary(rawSalary) }
    : null

  // 회사명 정규화
  const normalizedCompanyName = normalizeCompanyName(raw.companyName)

  return {
    ...raw,
    skills,
    category,
    experience,
    salary,
    normalizedCompanyName,
  }
}

/**
 * 수집 파이프라인을 실행합니다.
 *
 * 1. Collector.collect()로 원시 데이터 수집
 * 2. parseRawJob()으로 파싱
 * 3. 결과 반환
 */
export async function runCollector(
  collector: Collector,
  _options?: PipelineOptions,
): Promise<{ result: CollectResult; jobs: ParsedJobData[] }> {
  const startTime = Date.now()

  try {
    const rawJobs = await collector.collect()

    const parsedJobs = rawJobs.map(parseRawJob)

    const duration = Date.now() - startTime

    return {
      result: {
        source: collector.sourceId,
        success: true,
        jobCount: parsedJobs.length,
        newJobCount: parsedJobs.length, // TODO: 중복 체크 후 신규만 카운트
        duration,
        collectedAt: new Date().toISOString(),
      },
      jobs: parsedJobs,
    }
  } catch (error) {
    const duration = Date.now() - startTime
    return {
      result: {
        source: collector.sourceId,
        success: false,
        jobCount: 0,
        newJobCount: 0,
        duration,
        error: error instanceof Error ? error.message : String(error),
        collectedAt: new Date().toISOString(),
      },
      jobs: [],
    }
  }
}

/**
 * 여러 수집기를 순차적으로 실행합니다.
 */
export async function runPipeline(
  collectors: Collector[],
  options?: PipelineOptions,
): Promise<{ results: CollectResult[]; jobs: ParsedJobData[] }> {
  const results: CollectResult[] = []
  const allJobs: ParsedJobData[] = []

  for (const collector of collectors) {
    // 요청 간 딜레이
    if (options?.requestDelay && results.length > 0) {
      await sleep(options.requestDelay)
    }

    const { result, jobs } = await runCollector(collector, options)
    results.push(result)
    allJobs.push(...jobs)
  }

  return { results, jobs: allJobs }
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms))
}
