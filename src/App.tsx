import { Routes, Route, Navigate } from 'react-router-dom'
import { AppLayout } from '@/components/layout/AppLayout'
import { Dashboard } from '@/components/dashboard/Dashboard'
import { CalendarPage } from '@/components/calendar/CalendarPage'
import { AnalysisPage } from '@/components/analysis/AnalysisPage'
import { MarketInsightPage } from '@/components/analysis/MarketInsightPage'
import { CompanyExplorer } from '@/components/company/CompanyExplorer'
import { CompanyProfilePage } from '@/components/company/CompanyProfilePage'
import { JobDetailPage } from '@/components/dashboard/JobDetailPage'
import { ApplicationTracker } from '@/components/tracking/ApplicationTracker'
import { AlertsPage } from '@/components/alerts/AlertsPage'
import { ProfilePage } from '@/components/profile/ProfilePage'

export default function App() {
  return (
    <Routes>
      <Route element={<AppLayout />}>
        <Route path="/" element={<Dashboard />} />
        <Route path="/job/:id" element={<JobDetailPage />} />
        <Route path="/calendar" element={<CalendarPage />} />
        <Route path="/analysis" element={<AnalysisPage />} />
        <Route path="/insight" element={<MarketInsightPage />} />
        <Route path="/companies" element={<CompanyExplorer />} />
        <Route path="/company/:companyId" element={<CompanyProfilePage />} />
        <Route path="/tracking" element={<ApplicationTracker />} />
        <Route path="/alerts" element={<AlertsPage />} />
        <Route path="/profile" element={<ProfilePage />} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
