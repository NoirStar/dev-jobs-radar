// ============================================================
// 알림 관리 페이지 — 키워드/조건 알림 설정 + 알림 피드
// ============================================================

import { useState, useMemo } from 'react'
import {
  Bell,
  Plus,
  Trash2,
  Check,
  ToggleLeft,
  ToggleRight,
  Search,
  Filter,
  Clock,
  BellOff,
} from 'lucide-react'
import { useAlertStore } from '@/stores/alertStore'
import type { ConditionAlert } from '@/stores/alertStore'

const FREQUENCY_OPTIONS = [
  { value: 'instant' as const, label: '즉시' },
  { value: 'daily' as const, label: '매일' },
  { value: 'weekly' as const, label: '매주' },
]

export function AlertsPage() {
  const {
    keywordAlerts,
    conditionAlerts,
    notifications,
    addKeywordAlert,
    removeKeywordAlert,
    toggleKeywordAlert,
    addConditionAlert,
    removeConditionAlert,
    toggleConditionAlert,
    markAsRead,
    markAllAsRead,
    clearNotifications,
  } = useAlertStore()

  const [tab, setTab] = useState<'feed' | 'keywords' | 'conditions'>('feed')
  const [keywordInput, setKeywordInput] = useState('')
  const [keywordFreq, setKeywordFreq] = useState<'instant' | 'daily' | 'weekly'>('instant')

  // 조건 알림 폼
  const [condName, setCondName] = useState('')
  const [condSkills, setCondSkills] = useState('')
  const [condLocation, setCondLocation] = useState('')
  const [condFreq, setCondFreq] = useState<'instant' | 'daily' | 'weekly'>('daily')

  const unreadCount = useMemo(
    () => notifications.filter((n) => !n.isRead).length,
    [notifications],
  )

  const handleAddKeyword = () => {
    const kw = keywordInput.trim()
    if (!kw) return
    addKeywordAlert(kw, keywordFreq)
    setKeywordInput('')
  }

  const handleAddCondition = () => {
    const name = condName.trim()
    if (!name) return
    const conditions: ConditionAlert['conditions'] = {}
    const skills = condSkills
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean)
    if (skills.length > 0) conditions.skills = skills
    if (condLocation.trim()) conditions.location = condLocation.trim()
    addConditionAlert(name, conditions, condFreq)
    setCondName('')
    setCondSkills('')
    setCondLocation('')
  }

  const tabs = [
    { id: 'feed' as const, label: '알림 피드', icon: Bell, badge: unreadCount },
    { id: 'keywords' as const, label: '키워드 알림', icon: Search, badge: keywordAlerts.length },
    { id: 'conditions' as const, label: '조건 알림', icon: Filter, badge: conditionAlerts.length },
  ]

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-zinc-100">알림 설정</h1>
      </div>

      {/* 탭 */}
      <div className="flex gap-1 bg-zinc-900 rounded-lg p-1" role="tablist">
        {tabs.map((t) => (
          <button
            key={t.id}
            role="tab"
            aria-selected={tab === t.id}
            onClick={() => setTab(t.id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition ${
              tab === t.id
                ? 'bg-zinc-800 text-zinc-100'
                : 'text-zinc-500 hover:text-zinc-300'
            }`}
          >
            <t.icon className="w-4 h-4" aria-hidden="true" />
            {t.label}
            {t.badge > 0 && (
              <span className="ml-1 px-1.5 py-0.5 rounded-full bg-blue-500/20 text-blue-400 text-xs">
                {t.badge}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* 알림 피드 */}
      {tab === 'feed' && (
        <div className="space-y-3" role="tabpanel" aria-label="알림 피드">
          {notifications.length > 0 && (
            <div className="flex items-center justify-between">
              <p className="text-sm text-zinc-400">
                {unreadCount > 0 ? `${unreadCount}개 읽지 않음` : '모두 읽음'}
              </p>
              <div className="flex gap-2">
                <button
                  onClick={markAllAsRead}
                  className="text-xs text-blue-400 hover:underline"
                >
                  모두 읽음 처리
                </button>
                <button
                  onClick={clearNotifications}
                  className="text-xs text-red-400 hover:underline"
                >
                  전체 삭제
                </button>
              </div>
            </div>
          )}

          {notifications.length === 0 ? (
            <div className="text-center py-12 text-zinc-500">
              <BellOff className="mx-auto w-10 h-10 mb-3 opacity-30" aria-hidden="true" />
              <p>알림이 없습니다.</p>
            </div>
          ) : (
            <div className="space-y-2">
              {notifications.map((n) => (
                <div
                  key={n.id}
                  className={`flex items-start gap-3 p-3 rounded-lg border transition ${
                    n.isRead
                      ? 'bg-zinc-900 border-zinc-800 opacity-60'
                      : 'bg-zinc-900 border-blue-800/50'
                  }`}
                >
                  <Bell
                    className={`w-4 h-4 mt-0.5 shrink-0 ${n.isRead ? 'text-zinc-600' : 'text-blue-400'}`}
                    aria-hidden="true"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-zinc-100 font-medium">{n.title}</p>
                    <p className="text-xs text-zinc-400 mt-0.5">{n.message}</p>
                    <p className="flex items-center gap-1 text-xs text-zinc-600 mt-1">
                      <Clock className="w-3 h-3" aria-hidden="true" />
                      {new Date(n.createdAt).toLocaleString('ko-KR')}
                    </p>
                  </div>
                  {!n.isRead && (
                    <button
                      onClick={() => markAsRead(n.id)}
                      className="text-zinc-500 hover:text-green-400 transition"
                      aria-label="읽음 처리"
                    >
                      <Check className="w-4 h-4" aria-hidden="true" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* 키워드 알림 */}
      {tab === 'keywords' && (
        <div className="space-y-4" role="tabpanel" aria-label="키워드 알림">
          {/* 추가 폼 */}
          <div className="p-4 bg-zinc-900 border border-zinc-800 rounded-xl space-y-3">
            <p className="text-sm font-medium text-zinc-300">새 키워드 알림</p>
            <div className="flex gap-2">
              <input
                type="text"
                value={keywordInput}
                onChange={(e) => setKeywordInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleAddKeyword()}
                placeholder="키워드 입력 (예: React, 시니어)"
                className="flex-1 px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-sm text-zinc-100 focus:border-blue-500 focus:outline-none"
                aria-label="키워드 입력"
              />
              <select
                value={keywordFreq}
                onChange={(e) =>
                  setKeywordFreq(e.target.value as 'instant' | 'daily' | 'weekly')
                }
                className="px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-sm text-zinc-100 focus:border-blue-500 focus:outline-none"
                aria-label="알림 빈도"
              >
                {FREQUENCY_OPTIONS.map((o) => (
                  <option key={o.value} value={o.value}>
                    {o.label}
                  </option>
                ))}
              </select>
              <button
                onClick={handleAddKeyword}
                disabled={!keywordInput.trim()}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-500 disabled:opacity-40 text-white rounded-lg text-sm transition"
                aria-label="키워드 추가"
              >
                <Plus className="w-4 h-4" aria-hidden="true" />
              </button>
            </div>
          </div>

          {/* 목록 */}
          {keywordAlerts.length === 0 ? (
            <p className="text-center py-8 text-zinc-500 text-sm">
              등록된 키워드 알림이 없습니다.
            </p>
          ) : (
            <div className="space-y-2">
              {keywordAlerts.map((alert) => (
                <div
                  key={alert.id}
                  className="flex items-center justify-between p-3 bg-zinc-900 border border-zinc-800 rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => toggleKeywordAlert(alert.id)}
                      className={`transition ${alert.isActive ? 'text-blue-400' : 'text-zinc-600'}`}
                      aria-label={alert.isActive ? '알림 비활성화' : '알림 활성화'}
                    >
                      {alert.isActive ? (
                        <ToggleRight className="w-6 h-6" aria-hidden="true" />
                      ) : (
                        <ToggleLeft className="w-6 h-6" aria-hidden="true" />
                      )}
                    </button>
                    <span
                      className={`text-sm font-medium ${alert.isActive ? 'text-zinc-100' : 'text-zinc-500'}`}
                    >
                      {alert.keyword}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-zinc-500">
                      {FREQUENCY_OPTIONS.find((o) => o.value === alert.alertType)?.label}
                    </span>
                    <button
                      onClick={() => removeKeywordAlert(alert.id)}
                      className="text-zinc-500 hover:text-red-400 transition"
                      aria-label="삭제"
                    >
                      <Trash2 className="w-4 h-4" aria-hidden="true" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* 조건 기반 알림 */}
      {tab === 'conditions' && (
        <div className="space-y-4" role="tabpanel" aria-label="조건 알림">
          {/* 추가 폼 */}
          <div className="p-4 bg-zinc-900 border border-zinc-800 rounded-xl space-y-3">
            <p className="text-sm font-medium text-zinc-300">새 조건 알림</p>
            <input
              type="text"
              value={condName}
              onChange={(e) => setCondName(e.target.value)}
              placeholder="알림 이름 (예: 서울 React 시니어)"
              className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-sm text-zinc-100 focus:border-blue-500 focus:outline-none"
              aria-label="알림 이름"
            />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              <input
                type="text"
                value={condSkills}
                onChange={(e) => setCondSkills(e.target.value)}
                placeholder="기술 스택 (쉼표 구분)"
                className="px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-sm text-zinc-100 focus:border-blue-500 focus:outline-none"
                aria-label="기술 스택"
              />
              <input
                type="text"
                value={condLocation}
                onChange={(e) => setCondLocation(e.target.value)}
                placeholder="위치 (예: 서울, 도쿄, Remote)"
                className="px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-sm text-zinc-100 focus:border-blue-500 focus:outline-none"
                aria-label="위치"
              />
            </div>
            <div className="flex gap-2">
              <select
                value={condFreq}
                onChange={(e) =>
                  setCondFreq(e.target.value as 'instant' | 'daily' | 'weekly')
                }
                className="px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-sm text-zinc-100 focus:border-blue-500 focus:outline-none"
                aria-label="알림 빈도"
              >
                {FREQUENCY_OPTIONS.map((o) => (
                  <option key={o.value} value={o.value}>
                    {o.label}
                  </option>
                ))}
              </select>
              <button
                onClick={handleAddCondition}
                disabled={!condName.trim()}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-500 disabled:opacity-40 text-white rounded-lg text-sm transition"
              >
                추가
              </button>
            </div>
          </div>

          {/* 목록 */}
          {conditionAlerts.length === 0 ? (
            <p className="text-center py-8 text-zinc-500 text-sm">
              등록된 조건 알림이 없습니다.
            </p>
          ) : (
            <div className="space-y-2">
              {conditionAlerts.map((alert) => (
                <div
                  key={alert.id}
                  className="flex items-center justify-between p-3 bg-zinc-900 border border-zinc-800 rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => toggleConditionAlert(alert.id)}
                      className={`transition ${alert.isActive ? 'text-purple-400' : 'text-zinc-600'}`}
                      aria-label={alert.isActive ? '알림 비활성화' : '알림 활성화'}
                    >
                      {alert.isActive ? (
                        <ToggleRight className="w-6 h-6" aria-hidden="true" />
                      ) : (
                        <ToggleLeft className="w-6 h-6" aria-hidden="true" />
                      )}
                    </button>
                    <div>
                      <p
                        className={`text-sm font-medium ${alert.isActive ? 'text-zinc-100' : 'text-zinc-500'}`}
                      >
                        {alert.name}
                      </p>
                      <p className="text-xs text-zinc-500">
                        {[
                          alert.conditions.skills?.join(', '),
                          alert.conditions.location,
                        ]
                          .filter(Boolean)
                          .join(' · ') || '조건 없음'}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-zinc-500">
                      {FREQUENCY_OPTIONS.find((o) => o.value === alert.alertType)?.label}
                    </span>
                    <button
                      onClick={() => removeConditionAlert(alert.id)}
                      className="text-zinc-500 hover:text-red-400 transition"
                      aria-label="삭제"
                    >
                      <Trash2 className="w-4 h-4" aria-hidden="true" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
