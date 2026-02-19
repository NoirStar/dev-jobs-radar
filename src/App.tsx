import { Routes, Route, Navigate } from 'react-router-dom'
import { AppLayout } from '@/components/layout/AppLayout'
import { Dashboard } from '@/components/dashboard/Dashboard'
import { CalendarPage } from '@/components/calendar/CalendarPage'
import { AnalysisPage } from '@/components/analysis/AnalysisPage'
import { CompanyPage } from '@/components/company/CompanyPage'

export default function App() {
  return (
    <Routes>
      <Route element={<AppLayout />}>
        <Route path="/" element={<Dashboard />} />
        <Route path="/calendar" element={<CalendarPage />} />
        <Route path="/analysis" element={<AnalysisPage />} />
        <Route path="/companies" element={<CompanyPage />} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
