import { lazy, Suspense } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { AppLayout } from '@/components/layout/AppLayout'
import { Dashboard } from '@/components/dashboard/Dashboard'

// 지연 로딩 — 초기 번들 크기 최적화
const CalendarPage = lazy(() =>
  import('@/components/calendar/CalendarPage').then((m) => ({ default: m.CalendarPage })),
)
const AnalysisPage = lazy(() =>
  import('@/components/analysis/AnalysisPage').then((m) => ({ default: m.AnalysisPage })),
)
const MarketInsightPage = lazy(() =>
  import('@/components/analysis/MarketInsightPage').then((m) => ({ default: m.MarketInsightPage })),
)
const CompanyExplorer = lazy(() =>
  import('@/components/company/CompanyExplorer').then((m) => ({ default: m.CompanyExplorer })),
)
const CompanyProfilePage = lazy(() =>
  import('@/components/company/CompanyProfilePage').then((m) => ({ default: m.CompanyProfilePage })),
)
const JobDetailPage = lazy(() =>
  import('@/components/dashboard/JobDetailPage').then((m) => ({ default: m.JobDetailPage })),
)
const ApplicationTracker = lazy(() =>
  import('@/components/tracking/ApplicationTracker').then((m) => ({ default: m.ApplicationTracker })),
)
const AlertsPage = lazy(() =>
  import('@/components/alerts/AlertsPage').then((m) => ({ default: m.AlertsPage })),
)
const ProfilePage = lazy(() =>
  import('@/components/profile/ProfilePage').then((m) => ({ default: m.ProfilePage })),
)

function PageLoader() {
  return (
    <div className="flex items-center justify-center h-64">
      <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" role="status" aria-label="로딩 중" />
    </div>
  )
}

export default function App() {
  return (
    <Routes>
      <Route element={<AppLayout />}>
        <Route path="/" element={<Dashboard />} />
        <Route path="/job/:id" element={<Suspense fallback={<PageLoader />}><JobDetailPage /></Suspense>} />
        <Route path="/calendar" element={<Suspense fallback={<PageLoader />}><CalendarPage /></Suspense>} />
        <Route path="/analysis" element={<Suspense fallback={<PageLoader />}><AnalysisPage /></Suspense>} />
        <Route path="/insight" element={<Suspense fallback={<PageLoader />}><MarketInsightPage /></Suspense>} />
        <Route path="/companies" element={<Suspense fallback={<PageLoader />}><CompanyExplorer /></Suspense>} />
        <Route path="/company/:companyId" element={<Suspense fallback={<PageLoader />}><CompanyProfilePage /></Suspense>} />
        <Route path="/tracking" element={<Suspense fallback={<PageLoader />}><ApplicationTracker /></Suspense>} />
        <Route path="/alerts" element={<Suspense fallback={<PageLoader />}><AlertsPage /></Suspense>} />
        <Route path="/profile" element={<Suspense fallback={<PageLoader />}><ProfilePage /></Suspense>} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
