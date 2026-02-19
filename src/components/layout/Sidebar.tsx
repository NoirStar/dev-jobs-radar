import { NavLink } from 'react-router-dom'
import {
  LayoutDashboard,
  Calendar,
  BarChart3,
  Building2,
  TrendingUp,
  Zap,
  ClipboardList,
  Bell,
  User,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useUserStore } from '@/stores/userStore'
import { cn } from '@/lib/utils'

const navItems = [
  { to: '/', label: '대시보드', icon: LayoutDashboard },
  { to: '/calendar', label: '채용 캘린더', icon: Calendar },
  { to: '/analysis', label: '기술 분석', icon: BarChart3 },
  { to: '/insight', label: '시장 인사이트', icon: TrendingUp },
  { to: '/companies', label: '기업 탐색', icon: Building2 },
  { to: '/techpulse', label: 'TechPulse', icon: Zap },
  { to: '/tracking', label: '지원 추적', icon: ClipboardList },
  { to: '/alerts', label: '알림', icon: Bell },
  { to: '/profile', label: '프로필', icon: User },
]

export function Sidebar() {
  const sidebarOpen = useUserStore((s) => s.sidebarOpen)
  const toggleSidebar = useUserStore((s) => s.toggleSidebar)

  return (
    <aside
      className={cn(
        'fixed left-0 top-14 z-40 flex h-[calc(100vh-3.5rem)] flex-col border-r bg-background/95 backdrop-blur-md transition-all duration-300',
        sidebarOpen ? 'w-56 translate-x-0' : 'w-14 max-lg:-translate-x-full lg:translate-x-0',
      )}
    >
      <nav className="flex flex-1 flex-col gap-0.5 p-2">
        {navItems.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            end={to === '/'}
            aria-label={label}
            title={!sidebarOpen ? label : undefined}
            className={({ isActive }) =>
              cn(
                'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                isActive
                  ? 'bg-primary/10 text-primary'
                  : 'text-muted-foreground hover:bg-accent hover:text-foreground',
              )
            }
          >
            <Icon className="size-4 shrink-0" />
            {sidebarOpen && <span className="truncate">{label}</span>}
          </NavLink>
        ))}
      </nav>

      <div className="border-t p-2">
        <Button
          variant="ghost"
          size="sm"
          className="w-full justify-center"
          onClick={toggleSidebar}
          aria-label={sidebarOpen ? '사이드바 접기' : '사이드바 열기'}
        >
          {sidebarOpen ? <ChevronLeft className="size-4" /> : <ChevronRight className="size-4" />}
        </Button>
      </div>
    </aside>
  )
}
