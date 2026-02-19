// ============================================================
// 면접 준비 도우미 — 공고 기반 면접 질문 & 팁
// ============================================================

import { useMemo } from 'react'
import {
  BookOpen,
  Code,
  Users,
  Building2,
  Lightbulb,
} from 'lucide-react'
import type { JobPostingSummary } from '@/types/job'
import { generateLocalInterviewPrep } from '@/services/aiService'

interface Props {
  job: JobPostingSummary
}

export function InterviewPrepWidget({ job }: Props) {
  const jobId = job.id
  const prep = useMemo(() => generateLocalInterviewPrep(job), [job, jobId])

  return (
    <div className="space-y-4">
      <h3 className="flex items-center gap-2 text-lg font-semibold text-zinc-100">
        <BookOpen className="w-5 h-5" aria-hidden="true" />
        면접 준비 도우미
      </h3>

      {/* 기술 질문 */}
      <section className="p-4 bg-zinc-900 border border-zinc-800 rounded-xl space-y-2">
        <h4 className="flex items-center gap-2 text-sm font-semibold text-blue-400">
          <Code className="w-4 h-4" aria-hidden="true" />
          예상 기술 질문
        </h4>
        <ul className="space-y-1.5">
          {prep.technicalQuestions.map((q, i) => (
            <li key={i} className="text-sm text-zinc-300 pl-4 relative">
              <span className="absolute left-0 text-zinc-600">{i + 1}.</span>
              {q}
            </li>
          ))}
        </ul>
      </section>

      {/* 행동 질문 */}
      <section className="p-4 bg-zinc-900 border border-zinc-800 rounded-xl space-y-2">
        <h4 className="flex items-center gap-2 text-sm font-semibold text-purple-400">
          <Users className="w-4 h-4" aria-hidden="true" />
          예상 행동 질문
        </h4>
        <ul className="space-y-1.5">
          {prep.behavioralQuestions.map((q, i) => (
            <li key={i} className="text-sm text-zinc-300 pl-4 relative">
              <span className="absolute left-0 text-zinc-600">{i + 1}.</span>
              {q}
            </li>
          ))}
        </ul>
      </section>

      {/* 기업 조사 */}
      <section className="p-4 bg-zinc-900 border border-zinc-800 rounded-xl space-y-2">
        <h4 className="flex items-center gap-2 text-sm font-semibold text-green-400">
          <Building2 className="w-4 h-4" aria-hidden="true" />
          기업 조사 포인트
        </h4>
        <ul className="space-y-1.5">
          {prep.companyResearch.map((r, i) => (
            <li key={i} className="text-sm text-zinc-300 pl-4 relative">
              <span className="absolute left-0 text-zinc-600">•</span>
              {r}
            </li>
          ))}
        </ul>
      </section>

      {/* 팁 */}
      <section className="p-4 bg-zinc-900 border border-zinc-800 rounded-xl space-y-2">
        <h4 className="flex items-center gap-2 text-sm font-semibold text-yellow-400">
          <Lightbulb className="w-4 h-4" aria-hidden="true" />
          면접 팁
        </h4>
        <ul className="space-y-1.5">
          {prep.tips.map((t, i) => (
            <li key={i} className="text-sm text-zinc-300 pl-4 relative">
              <span className="absolute left-0 text-zinc-600">•</span>
              {t}
            </li>
          ))}
        </ul>
      </section>
    </div>
  )
}
