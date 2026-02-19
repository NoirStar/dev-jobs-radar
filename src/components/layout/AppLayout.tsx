import { Outlet } from 'react-router-dom'
import { Header } from './Header'
import { Sidebar } from './Sidebar'
import { useUserStore } from '@/stores/userStore'
import { cn } from '@/lib/utils'

export function AppLayout() {
  const sidebarOpen = useUserStore((s) => s.sidebarOpen)

  return (
    <div className="flex h-screen flex-col bg-background">
      <Header />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar />
        {/* 모바일 오버레이 */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 z-30 bg-black/40 lg:hidden"
            onClick={() => useUserStore.getState().toggleSidebar()}
          />
        )}
        <main
          className={cn(
            'flex-1 overflow-y-auto p-4 transition-all duration-300 md:p-6',
            sidebarOpen ? 'lg:ml-56' : 'lg:ml-14',
          )}
        >
          <Outlet />
        </main>
      </div>
    </div>
  )
}
