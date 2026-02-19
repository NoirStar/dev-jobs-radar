// ============================================================
// 지원 추적 페이지 — Kanban 스타일 지원 관리
// ============================================================

import { useState, useCallback, useMemo } from 'react'
import {
  Plus, Trash2, ChevronDown, ChevronRight, Clock, Building2,
  ExternalLink, StickyNote, MoveRight,
} from 'lucide-react'
import { useApplicationStore } from '@/stores/applicationStore'
import type { ApplicationStatus, Application } from '@/types/job'

// ── 상태 정의 ──

interface StatusInfo {
  id: ApplicationStatus
  label: string
  color: string
  bgColor: string
}

const APPLICATION_STATUSES: StatusInfo[] = [
  { id: 'interested', label: '관심', color: 'text-zinc-400', bgColor: 'bg-zinc-800' },
  { id: 'applied', label: '지원 완료', color: 'text-blue-400', bgColor: 'bg-blue-900/30' },
  { id: 'screening', label: '서류 심사', color: 'text-yellow-400', bgColor: 'bg-yellow-900/30' },
  { id: 'interview', label: '면접', color: 'text-purple-400', bgColor: 'bg-purple-900/30' },
  { id: 'technical_test', label: '기술 테스트', color: 'text-orange-400', bgColor: 'bg-orange-900/30' },
  { id: 'final_interview', label: '최종 면접', color: 'text-pink-400', bgColor: 'bg-pink-900/30' },
  { id: 'offer', label: '오퍼', color: 'text-green-400', bgColor: 'bg-green-900/30' },
  { id: 'accepted', label: '수락', color: 'text-emerald-400', bgColor: 'bg-emerald-900/30' },
  { id: 'rejected', label: '불합격', color: 'text-red-400', bgColor: 'bg-red-900/30' },
  { id: 'withdrawn', label: '철회', color: 'text-zinc-500', bgColor: 'bg-zinc-800/50' },
]

const STATUS_MAP = new Map(APPLICATION_STATUSES.map((s) => [s.id, s]))

export function ApplicationTracker() {
  const { applications, updateStatus, removeApplication } = useApplicationStore()
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const [noteInput, setNoteInput] = useState('')
  const [moveTarget, setMoveTarget] = useState<string | null>(null)

  // 상태별 그룹핑
  const grouped = useMemo(() => {
    const map = new Map<ApplicationStatus, Application[]>()
    for (const status of APPLICATION_STATUSES) {
      map.set(status.id, [])
    }
    for (const app of applications) {
      const list = map.get(app.status)
      if (list) list.push(app)
    }
    return map
  }, [applications])

  // 통계
  const stats = useMemo(() => {
    const total = applications.length
    const active = applications.filter(
      (a) => !['rejected', 'withdrawn', 'accepted'].includes(a.status),
    ).length
    const offered = applications.filter((a) => a.status === 'offer').length
    const rejected = applications.filter((a) => a.status === 'rejected').length
    return { total, active, offered, rejected }
  }, [applications])

  const handleMoveStatus = useCallback(
    (appId: string, newStatus: ApplicationStatus, note = '') => {
      updateStatus(appId, newStatus, note)
      setMoveTarget(null)
      setNoteInput('')
    },
    [updateStatus],
  )

  const handleToggleExpand = useCallback((id: string) => {
    setExpandedId((prev) => (prev === id ? null : id))
  }, [])

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-zinc-100">지원 추적</h1>
      </div>

      {/* KPI 카드 */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: '전체', value: stats.total, color: 'text-zinc-100' },
          { label: '진행 중', value: stats.active, color: 'text-blue-400' },
          { label: '오퍼', value: stats.offered, color: 'text-green-400' },
          { label: '불합격', value: stats.rejected, color: 'text-red-400' },
        ].map((kpi) => (
          <div
            key={kpi.label}
            className="bg-zinc-900 border border-zinc-800 rounded-xl p-4 text-center"
          >
            <p className="text-sm text-zinc-400">{kpi.label}</p>
            <p className={`text-2xl font-bold ${kpi.color}`}>{kpi.value}</p>
          </div>
        ))}
      </div>

      {/* 상태별 리스트 */}
      {applications.length === 0 ? (
        <div
          className="text-center py-16 text-zinc-500"
          aria-live="polite"
        >
          <Plus className="mx-auto w-12 h-12 mb-4 opacity-30" aria-hidden="true" />
          <p>아직 추적 중인 지원이 없습니다.</p>
          <p className="text-sm mt-1">공고 상세에서 &ldquo;지원 추적&rdquo; 버튼을 눌러 추가하세요.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {APPLICATION_STATUSES.map((statusInfo) => {
            const apps = grouped.get(statusInfo.id) ?? []
            if (apps.length === 0) return null

            return (
              <section key={statusInfo.id}>
                <h2 className={`flex items-center gap-2 text-sm font-semibold ${statusInfo.color} mb-2`}>
                  <span
                    className={`w-2 h-2 rounded-full ${statusInfo.bgColor}`}
                    style={{ backgroundColor: 'currentcolor' }}
                    aria-hidden="true"
                  />
                  {statusInfo.label}
                  <span className="text-zinc-500">({apps.length})</span>
                </h2>

                <div className="space-y-2">
                  {apps.map((app) => (
                    <div
                      key={app.id}
                      className={`${statusInfo.bgColor} border border-zinc-800 rounded-lg p-4`}
                    >
                      <div className="flex items-center justify-between">
                        <button
                          className="flex items-center gap-2 text-left flex-1 min-w-0"
                          onClick={() => handleToggleExpand(app.id)}
                        >
                          {expandedId === app.id ? (
                            <ChevronDown className="w-4 h-4 text-zinc-400 shrink-0" aria-hidden="true" />
                          ) : (
                            <ChevronRight className="w-4 h-4 text-zinc-400 shrink-0" aria-hidden="true" />
                          )}
                          <div className="min-w-0">
                            <p className="text-zinc-100 font-medium truncate">
                              {app.job.title}
                            </p>
                            <p className="flex items-center gap-1 text-sm text-zinc-400">
                              <Building2 className="w-3 h-3" aria-hidden="true" />
                              {app.job.companyName}
                            </p>
                          </div>
                        </button>

                        <div className="flex items-center gap-2 shrink-0">
                          <a
                            href={app.job.sourceUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-zinc-500 hover:text-blue-400 transition"
                            aria-label="공고 보기"
                          >
                            <ExternalLink className="w-4 h-4" aria-hidden="true" />
                          </a>

                          <button
                            onClick={() => {
                              setMoveTarget(moveTarget === app.id ? null : app.id)
                              setNoteInput('')
                            }}
                            className="text-zinc-500 hover:text-purple-400 transition"
                            aria-label="상태 변경"
                          >
                            <MoveRight className="w-4 h-4" aria-hidden="true" />
                          </button>

                          <button
                            onClick={() => {
                              if (window.confirm(`"${app.job.title}" 지원 추적을 삭제하시겠습니까?`)) {
                                removeApplication(app.id)
                              }
                            }}
                            className="text-zinc-500 hover:text-red-400 transition"
                            aria-label="삭제"
                          >
                            <Trash2 className="w-4 h-4" aria-hidden="true" />
                          </button>
                        </div>
                      </div>

                      {/* 상태 이동 패널 */}
                      {moveTarget === app.id && (
                        <div className="mt-3 p-3 bg-zinc-900 rounded-lg border border-zinc-700">
                          <p className="text-xs text-zinc-400 mb-2">상태 변경</p>
                          <div className="flex flex-wrap gap-1.5 mb-2">
                            {APPLICATION_STATUSES.filter((s) => s.id !== app.status).map(
                              (s) => (
                                <button
                                  key={s.id}
                                  onClick={() =>
                                    handleMoveStatus(app.id, s.id, noteInput)
                                  }
                                  className={`px-2 py-1 text-xs rounded ${s.bgColor} ${s.color} hover:opacity-80 transition`}
                                >
                                  {s.label}
                                </button>
                              ),
                            )}
                          </div>
                          <input
                            type="text"
                            value={noteInput}
                            onChange={(e) => setNoteInput(e.target.value)}
                            placeholder="메모 (선택)"
                            className="w-full px-2 py-1.5 bg-zinc-800 border border-zinc-700 rounded text-sm text-zinc-100 focus:border-blue-500 focus:outline-none"
                            aria-label="상태 변경 메모"
                          />
                        </div>
                      )}

                      {/* 확장 상세 */}
                      {expandedId === app.id && (
                        <div className="mt-3 pt-3 border-t border-zinc-700 space-y-2">
                          <div className="flex flex-wrap gap-1.5">
                            {app.job.skills.map((s) => (
                              <span
                                key={s}
                                className="px-2 py-0.5 bg-zinc-800 text-zinc-400 rounded text-xs"
                              >
                                {s}
                              </span>
                            ))}
                          </div>

                          {app.notes && (
                            <p className="flex items-start gap-1.5 text-sm text-zinc-400">
                              <StickyNote className="w-3.5 h-3.5 mt-0.5 shrink-0" aria-hidden="true" />
                              {app.notes}
                            </p>
                          )}

                          {app.statusHistory.length > 0 && (
                            <div className="text-xs space-y-1">
                              <p className="text-zinc-500 font-medium">이력</p>
                              {app.statusHistory.map((h, i) => {
                                const info = STATUS_MAP.get(h.status)
                                return (
                                  <div key={i} className="flex items-center gap-2 text-zinc-500">
                                    <Clock className="w-3 h-3" aria-hidden="true" />
                                    <span className={info?.color}>
                                      {info?.label ?? h.status}
                                    </span>
                                    <span>{new Date(h.date).toLocaleDateString('ko-KR')}</span>
                                    {h.note && (
                                      <span className="text-zinc-600">— {h.note}</span>
                                    )}
                                  </div>
                                )
                              })}
                            </div>
                          )}

                          <div className="text-xs text-zinc-600">
                            추가: {new Date(app.createdAt).toLocaleDateString('ko-KR')}
                            {app.appliedAt && (
                              <> | 지원: {new Date(app.appliedAt).toLocaleDateString('ko-KR')}</>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </section>
            )
          })}
        </div>
      )}
    </div>
  )
}
