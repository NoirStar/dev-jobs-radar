// ============================================================
// 프로필 설정 페이지 — 사용자 정보 & 관심 설정 관리
// ============================================================

import { useState, useCallback, useEffect } from 'react'
import { User, Settings, Bell, Moon, Sun, Save, LogOut, Mail, Code } from 'lucide-react'
import { useAuthStore } from '@/stores/authStore'
import { useUserStore } from '@/stores/userStore'
import { JOB_CATEGORIES } from '@/data/categories'
import type { JobCategory } from '@/types/job'

const EXPERIENCE_OPTIONS = [
  { value: 0, label: '신입' },
  { value: 1, label: '1년' },
  { value: 2, label: '2년' },
  { value: 3, label: '3년' },
  { value: 5, label: '5년' },
  { value: 7, label: '7년' },
  { value: 10, label: '10년+' },
]

export function ProfilePage() {
  const { user, updateProfile, signOut: authSignOut } = useAuthStore()
  const { settings, updateSettings } = useUserStore()

  const [name, setName] = useState(user?.name ?? '')
  const [experienceYears, setExperienceYears] = useState(user?.experienceYears ?? 0)
  const [selectedCategories, setSelectedCategories] = useState<JobCategory[]>(
    user?.interestedCategories ?? [],
  )
  const [selectedSkills, setSelectedSkills] = useState<string[]>(
    user?.interestedSkills ?? [],
  )
  const [skillInput, setSkillInput] = useState('')
  const [saved, setSaved] = useState(false)

  // 사용자 데이터가 외부에서 변경될 때 폼 동기화
  useEffect(() => {
    if (user) {
      setName(user.name ?? '')
      setExperienceYears(user.experienceYears ?? 0)
      setSelectedCategories(user.interestedCategories ?? [])
      setSelectedSkills(user.interestedSkills ?? [])
    }
  }, [user])

  const handleToggleCategory = useCallback(
    (cat: JobCategory) => {
      setSelectedCategories((prev) =>
        prev.includes(cat) ? prev.filter((c) => c !== cat) : [...prev, cat],
      )
    },
    [],
  )

  const handleAddSkill = useCallback(() => {
    const trimmed = skillInput.trim()
    if (trimmed && !selectedSkills.includes(trimmed)) {
      setSelectedSkills((prev) => [...prev, trimmed])
      setSkillInput('')
    }
  }, [skillInput, selectedSkills])

  const handleRemoveSkill = useCallback(
    (skill: string) => {
      setSelectedSkills((prev) => prev.filter((s) => s !== skill))
    },
    [],
  )

  const handleSave = useCallback(() => {
    updateProfile({
      name: name || null,
      experienceYears,
      interestedCategories: selectedCategories,
      interestedSkills: selectedSkills,
    })
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }, [name, experienceYears, selectedCategories, selectedSkills, updateProfile])

  const handleSignOut = useCallback(async () => {
    await authSignOut()
  }, [authSignOut])

  if (!user) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-zinc-400">로그인이 필요합니다.</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-zinc-100">프로필 설정</h1>
        <button
          onClick={handleSignOut}
          className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm text-zinc-400 hover:text-red-400 hover:bg-zinc-800 transition"
        >
          <LogOut className="w-4 h-4" aria-hidden="true" />
          로그아웃
        </button>
      </div>

      {/* 기본 정보 */}
      <section className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 space-y-4">
        <h2 className="flex items-center gap-2 text-lg font-semibold text-zinc-100">
          <User className="w-5 h-5" aria-hidden="true" />
          기본 정보
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="profile-name" className="block text-sm text-zinc-400 mb-1">
              이름
            </label>
            <input
              id="profile-name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-zinc-100 focus:border-blue-500 focus:outline-none"
              placeholder="이름을 입력하세요"
            />
          </div>

          <div>
            <label htmlFor="profile-email" className="block text-sm text-zinc-400 mb-1">
              이메일
            </label>
            <div className="flex items-center gap-2 px-3 py-2 bg-zinc-800/50 border border-zinc-700 rounded-lg text-zinc-400">
              <Mail className="w-4 h-4" aria-hidden="true" />
              <span>{user.email}</span>
            </div>
          </div>

          <div>
            <label htmlFor="profile-experience" className="block text-sm text-zinc-400 mb-1">
              경력
            </label>
            <select
              id="profile-experience"
              value={experienceYears}
              onChange={(e) => setExperienceYears(Number(e.target.value))}
              className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-zinc-100 focus:border-blue-500 focus:outline-none"
            >
              {EXPERIENCE_OPTIONS.map(({ value, label }) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </section>

      {/* 관심 직군 */}
      <section className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 space-y-4">
        <h2 className="flex items-center gap-2 text-lg font-semibold text-zinc-100">
          <Code className="w-5 h-5" aria-hidden="true" />
          관심 직군
        </h2>

        <div className="flex flex-wrap gap-2">
          {JOB_CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => handleToggleCategory(cat.id as JobCategory)}
              className={`px-3 py-1.5 rounded-lg text-sm transition ${
                selectedCategories.includes(cat.id as JobCategory)
                  ? 'bg-blue-600 text-white'
                  : 'bg-zinc-800 text-zinc-400 hover:bg-zinc-700'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </section>

      {/* 관심 기술 */}
      <section className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 space-y-4">
        <h2 className="flex items-center gap-2 text-lg font-semibold text-zinc-100">
          <Settings className="w-5 h-5" aria-hidden="true" />
          관심 기술 스택
        </h2>

        <div className="flex gap-2">
          <input
            type="text"
            value={skillInput}
            onChange={(e) => setSkillInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleAddSkill()}
            className="flex-1 px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-zinc-100 focus:border-blue-500 focus:outline-none"
            placeholder="기술 이름 입력 후 Enter"
            aria-label="기술 스택 추가"
          />
          <button
            onClick={handleAddSkill}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-500 transition"
          >
            추가
          </button>
        </div>

        <div className="flex flex-wrap gap-2">
          {selectedSkills.map((skill) => (
            <span
              key={skill}
              className="flex items-center gap-1 px-3 py-1 bg-zinc-800 text-zinc-300 rounded-full text-sm"
            >
              {skill}
              <button
                onClick={() => handleRemoveSkill(skill)}
                className="ml-1 text-zinc-500 hover:text-red-400"
                aria-label={`${skill} 제거`}
              >
                ×
              </button>
            </span>
          ))}
          {selectedSkills.length === 0 && (
            <p className="text-sm text-zinc-500">등록된 기술이 없습니다</p>
          )}
        </div>
      </section>

      {/* 알림 설정 */}
      <section className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 space-y-4">
        <h2 className="flex items-center gap-2 text-lg font-semibold text-zinc-100">
          <Bell className="w-5 h-5" aria-hidden="true" />
          알림 설정
        </h2>

        <div className="space-y-3">
          <label className="flex items-center justify-between">
            <span className="text-sm text-zinc-300">이메일 알림</span>
            <button
              onClick={() =>
                updateSettings({
                  emailNotifications: !settings.emailNotifications,
                })
              }
              role="switch"
              aria-checked={settings.emailNotifications}
              className={`w-10 h-6 rounded-full transition ${
                settings.emailNotifications ? 'bg-blue-600' : 'bg-zinc-700'
              }`}
            >
              <span
                className={`block w-4 h-4 rounded-full bg-white transition-transform mx-1 mt-1 ${
                  settings.emailNotifications ? 'translate-x-4' : ''
                }`}
              />
            </button>
          </label>

          <label className="flex items-center justify-between">
            <span className="text-sm text-zinc-300">푸시 알림</span>
            <button
              onClick={() =>
                updateSettings({
                  pushNotifications: !settings.pushNotifications,
                })
              }
              role="switch"
              aria-checked={settings.pushNotifications}
              className={`w-10 h-6 rounded-full transition ${
                settings.pushNotifications ? 'bg-blue-600' : 'bg-zinc-700'
              }`}
            >
              <span
                className={`block w-4 h-4 rounded-full bg-white transition-transform mx-1 mt-1 ${
                  settings.pushNotifications ? 'translate-x-4' : ''
                }`}
              />
            </button>
          </label>

          <div>
            <label htmlFor="digest-frequency" className="block text-sm text-zinc-400 mb-1">
              다이제스트 수신 주기
            </label>
            <select
              id="digest-frequency"
              value={settings.digestFrequency}
              onChange={(e) =>
                updateSettings({
                  digestFrequency: e.target.value as 'daily' | 'weekly' | 'none',
                })
              }
              className="w-full max-w-xs px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-zinc-100 focus:border-blue-500 focus:outline-none"
            >
              <option value="daily">매일</option>
              <option value="weekly">매주</option>
              <option value="none">끔</option>
            </select>
          </div>
        </div>
      </section>

      {/* 테마 설정 */}
      <section className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 space-y-4">
        <h2 className="flex items-center gap-2 text-lg font-semibold text-zinc-100">
          {settings.theme === 'dark' ? (
            <Moon className="w-5 h-5" aria-hidden="true" />
          ) : (
            <Sun className="w-5 h-5" aria-hidden="true" />
          )}
          테마
        </h2>

        <div className="flex gap-2">
          {(['light', 'dark', 'system'] as const).map((theme) => (
            <button
              key={theme}
              onClick={() => updateSettings({ theme })}
              className={`px-4 py-2 rounded-lg text-sm transition ${
                settings.theme === theme
                  ? 'bg-blue-600 text-white'
                  : 'bg-zinc-800 text-zinc-400 hover:bg-zinc-700'
              }`}
            >
              {theme === 'light' ? '라이트' : theme === 'dark' ? '다크' : '시스템'}
            </button>
          ))}
        </div>
      </section>

      {/* 저장 버튼 */}
      <div className="flex justify-end gap-3">
        {saved && (
          <span className="self-center text-sm text-green-400" aria-live="polite">
            저장되었습니다
          </span>
        )}
        <button
          onClick={handleSave}
          className="flex items-center gap-2 px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-500 transition font-medium"
        >
          <Save className="w-4 h-4" aria-hidden="true" />
          저장
        </button>
      </div>
    </div>
  )
}
