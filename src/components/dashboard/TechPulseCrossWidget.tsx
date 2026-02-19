// ============================================================
// TechPulse 교차 분석 위젯 — 트렌딩 기술 × 채용 수요
// ============================================================

import { useMemo, useState } from 'react'
import { TrendingUp, Briefcase, Lightbulb, ArrowUpRight, ArrowDownRight, Minus } from 'lucide-react'
import { useJobStore } from '@/stores/jobStore'
import type { CrossAnalysis, TechPulseTrend, CrossItem } from '@/services/techPulseService'
import { analyzeCrossData, generateLocalTrends } from '@/services/techPulseService'

type TabKey = 'hot-hiring' | 'hot-low' | 'stable'

const TABS: { key: TabKey; label: string; icon: React.ReactNode }[] = [
  { key: 'hot-hiring', label: '핫 & 채용', icon: <TrendingUp className="w-3.5 h-3.5" aria-hidden="true" /> },
  { key: 'hot-low', label: '미래 기술', icon: <Lightbulb className="w-3.5 h-3.5" aria-hidden="true" /> },
  { key: 'stable', label: '안정 수요', icon: <Briefcase className="w-3.5 h-3.5" aria-hidden="true" /> },
]

interface Props {
  trends?: TechPulseTrend[]
}

export function TechPulseCrossWidget({ trends }: Props) {
  const jobs = useJobStore((s) => s.jobs)
  const [activeTab, setActiveTab] = useState<TabKey>('hot-hiring')

  const trendData = useMemo(() => trends ?? generateLocalTrends(), [trends])

  const analysis: CrossAnalysis = useMemo(
    () => analyzeCrossData(trendData, jobs),
    [trendData, jobs],
  )

  const items =
    activeTab === 'hot-hiring'
      ? analysis.hotAndHiring
      : activeTab === 'hot-low'
        ? analysis.hotButLowDemand
        : analysis.stableDemand

  return (
    <div className="space-y-3">
      <h3 className="flex items-center gap-2 text-lg font-semibold text-zinc-100">
        <TrendingUp className="w-5 h-5 text-orange-400" aria-hidden="true" />
        트렌딩 기술 × 채용 수요
      </h3>
      <p className="text-xs text-zinc-500">
        TechPulse 트렌딩 데이터와 현재 채용 공고를 교차 분석합니다.
      </p>

      {/* 탭 */}
      <div className="flex gap-1 bg-zinc-900 p-1 rounded-lg" role="tablist">
        {TABS.map((tab) => (
          <button
            key={tab.key}
            role="tab"
            aria-selected={activeTab === tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`flex-1 flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
              activeTab === tab.key
                ? 'bg-zinc-700 text-zinc-100'
                : 'text-zinc-500 hover:text-zinc-300'
            }`}
          >
            {tab.icon}
            {tab.label}
          </button>
        ))}
      </div>

      {/* 결과 리스트 */}
      <div className="space-y-2 max-h-80 overflow-y-auto pr-1">
        {items.length === 0 ? (
          <p className="text-sm text-zinc-500 text-center py-4">데이터 없음</p>
        ) : (
          items.map((item) => <CrossItemRow key={item.skill} item={item} />)
        )}
      </div>

      <p className="text-[10px] text-zinc-600 text-right">
        분석 시점: {new Date(analysis.analyzedAt).toLocaleString('ko-KR')}
      </p>
    </div>
  )
}

function CrossItemRow({ item }: { item: CrossItem }) {
  return (
    <div className="flex items-start gap-3 p-3 bg-zinc-900 border border-zinc-800 rounded-lg">
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className="font-semibold text-sm text-zinc-200">{item.skill}</span>
          {item.trendRank != null && (
            <span className="text-[10px] px-1.5 py-0.5 leading-none rounded bg-orange-900/40 text-orange-400">
              #{item.trendRank}
            </span>
          )}
        </div>

        <div className="flex items-center gap-3 mt-1 text-xs text-zinc-500">
          {item.trendVelocity != null && (
            <span className="flex items-center gap-0.5">
              {item.trendVelocity > 0 ? (
                <ArrowUpRight className="w-3 h-3 text-emerald-400" aria-hidden="true" />
              ) : item.trendVelocity < 0 ? (
                <ArrowDownRight className="w-3 h-3 text-red-400" aria-hidden="true" />
              ) : (
                <Minus className="w-3 h-3" aria-hidden="true" />
              )}
              {item.trendVelocity > 0 ? '+' : ''}
              {item.trendVelocity}%
            </span>
          )}
          <span className="flex items-center gap-0.5">
            <Briefcase className="w-3 h-3" aria-hidden="true" />
            {item.jobCount}개 공고 ({item.jobPercentage}%)
          </span>
        </div>

        <p className="mt-1 text-[11px] text-zinc-400 leading-relaxed">{item.insight}</p>
      </div>
    </div>
  )
}
