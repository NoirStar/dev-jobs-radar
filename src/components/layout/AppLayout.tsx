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
        <main
          className={cn(
            'flex-1 overflow-y-auto p-6 transition-all duration-300',
            sidebarOpen ? 'ml-60' : 'ml-16',
          )}
        >
          <Outlet />
        </main>
      </div>
    </div>
  )
}
