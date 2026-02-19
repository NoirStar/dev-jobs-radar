// ============================================================
// 기술 매칭 점수 위젯 — 공고와 사용자 기술 매칭 시각화
// ============================================================

import { useMemo } from 'react'
import { Target, CheckCircle, XCircle, Minus } from 'lucide-react'
import { useAuthStore } from '@/stores/authStore'
import { calculateSkillMatch } from '@/services/aiService'

interface Props {
  jobSkills: string[]
}

const SCORE_COLORS = [
  { min: 80, color: 'text-emerald-400', bg: 'bg-emerald-400', ring: 'ring-emerald-400/30' },
  { min: 60, color: 'text-blue-400', bg: 'bg-blue-400', ring: 'ring-blue-400/30' },
  { min: 40, color: 'text-yellow-400', bg: 'bg-yellow-400', ring: 'ring-yellow-400/30' },
  { min: 0, color: 'text-red-400', bg: 'bg-red-400', ring: 'ring-red-400/30' },
] as const

function getScoreStyle(score: number) {
  return SCORE_COLORS.find((c) => score >= c.min) ?? SCORE_COLORS[SCORE_COLORS.length - 1]
}

export function SkillMatchWidget({ jobSkills }: Props) {
  const userSkills = useAuthStore((s) => s.user?.interestedSkills)

  const match = useMemo(
    () => calculateSkillMatch(userSkills ?? [], jobSkills),
    [userSkills, jobSkills],
  )

  if (!userSkills || userSkills.length === 0) {
    return (
      <div className="p-4 bg-zinc-900 border border-zinc-800 rounded-xl text-center">
        <p className="text-sm text-zinc-500">
          프로필에서 관심 기술을 설정하면 매칭 점수를 확인할 수 있습니다.
        </p>
      </div>
    )
  }

  const style = getScoreStyle(match.score)

  return (
    <div className="p-4 bg-zinc-900 border border-zinc-800 rounded-xl space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="flex items-center gap-2 text-sm font-semibold text-zinc-300">
          <Target className="w-4 h-4" aria-hidden="true" />
          기술 매칭
        </h3>
        <div
          className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full ring-2 ${style.ring} ${style.color} font-bold text-sm`}
        >
          {match.score}%
        </div>
      </div>

      {/* 프로그레스 바 */}
      <div className="h-2 bg-zinc-800 rounded-full overflow-hidden">
        <div
          className={`h-full ${style.bg} rounded-full transition-all duration-500`}
          style={{ width: `${match.score}%` }}
          role="progressbar"
          aria-valuenow={match.score}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label={`기술 매칭 ${match.score}%`}
        />
      </div>

      {/* 매칭 결과 */}
      <div className="space-y-2">
        {match.matchedSkills.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {match.matchedSkills.map((s) => (
              <span
                key={s}
                className="flex items-center gap-1 px-2 py-0.5 bg-emerald-900/30 text-emerald-400 rounded text-xs"
              >
                <CheckCircle className="w-3 h-3" aria-hidden="true" />
                {s}
              </span>
            ))}
          </div>
        )}

        {match.partialMatches.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {match.partialMatches.map((s) => (
              <span
                key={s}
                className="flex items-center gap-1 px-2 py-0.5 bg-yellow-900/30 text-yellow-400 rounded text-xs"
              >
                <Minus className="w-3 h-3" aria-hidden="true" />
                {s}
              </span>
            ))}
          </div>
        )}

        {match.missingSkills.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {match.missingSkills.map((s) => (
              <span
                key={s}
                className="flex items-center gap-1 px-2 py-0.5 bg-red-900/30 text-red-400 rounded text-xs"
              >
                <XCircle className="w-3 h-3" aria-hidden="true" />
                {s}
              </span>
            ))}
          </div>
        )}
      </div>

      <p className="text-xs text-zinc-500">{match.recommendation}</p>
    </div>
  )
}
