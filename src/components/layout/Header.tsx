import { Search, Bell, Settings, Menu, Radar, Moon, Sun } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useFilterStore } from '@/stores/filterStore'
import { useUserStore } from '@/stores/userStore'

export function Header() {
  const searchQuery = useFilterStore((s) => s.searchQuery)
  const setSearchQuery = useFilterStore((s) => s.setSearchQuery)
  const toggleSidebar = useUserStore((s) => s.toggleSidebar)
  const toggleTheme = useUserStore((s) => s.toggleTheme)
  const theme = useUserStore((s) => s.settings.theme)

  return (
    <header className="sticky top-0 z-50 flex h-14 items-center gap-4 border-b bg-background/80 backdrop-blur-lg px-4">
      <Button variant="ghost" size="icon" onClick={toggleSidebar} aria-label="메뉴 토글">
        <Menu className="size-5" />
      </Button>

      <div className="flex items-center gap-2">
        <Radar className="size-5 text-primary" />
        <h1 className="text-lg font-bold tracking-tight">DevJobsRadar</h1>
      </div>

      <div className="relative ml-auto flex max-w-md flex-1 items-center">
        <Search className="absolute left-3 size-4 text-muted-foreground" />
        <Input
          type="search"
          placeholder="공고, 회사, 기술 검색..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-9"
        />
      </div>

      <div className="flex items-center gap-1">
        <Button variant="ghost" size="icon" onClick={toggleTheme} aria-label="테마 전환">
          {theme === 'dark' ? <Sun className="size-5" /> : <Moon className="size-5" />}
        </Button>
        <Button variant="ghost" size="icon" aria-label="알림">
          <Bell className="size-5" />
        </Button>
        <Button variant="ghost" size="icon" aria-label="설정">
          <Settings className="size-5" />
        </Button>
      </div>
    </header>
  )
}
