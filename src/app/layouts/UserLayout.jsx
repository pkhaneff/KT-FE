import { NavLink, Outlet } from 'react-router-dom'
import { Bell, CircleUserRound, LayoutDashboard, Wallet, FolderKanban, Send, Bookmark, Settings, Plus } from 'lucide-react'
import { ROUTES } from '../../core/constants/routes'
import { cn } from '../../core/utils/cn'
import { Button } from '../../components/ui/Button'

const SIDEBAR_ITEMS = [
  { label: 'Dashboard', href: ROUTES.USER_DASHBOARD, icon: LayoutDashboard },
  { label: 'Đơn của tôi', href: ROUTES.USER_ORDERS, icon: FolderKanban },
  { label: 'Yêu cầu', href: ROUTES.USER_REQUESTS, icon: Send },
  { label: 'Ví', href: ROUTES.USER_WALLET, icon: Wallet },
  { label: 'Bài đã lưu', href: ROUTES.USER_SAVED_ARTICLES, icon: Bookmark },
  { label: 'Cài đặt', href: ROUTES.USER_SETTINGS, icon: Settings },
]

export function UserLayout() {
  return (
    <div className="min-h-screen bg-slate-100 text-slate-900">
      <a href="#main-content" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-md focus:bg-white focus:px-3 focus:py-2 focus:shadow">
        Bỏ qua điều hướng
      </a>

      <div className="mx-auto grid min-h-screen max-w-7xl grid-cols-1 md:grid-cols-[260px_1fr]">
        <aside className="border-r border-slate-200 bg-white p-4 md:p-5">
          <div className="mb-6 flex items-center gap-2 text-lg font-bold">
            <CircleUserRound className="text-indigo-600" size={20} aria-hidden="true" />
            User Workspace
          </div>

          <nav aria-label="User navigation" className="space-y-1">
            {SIDEBAR_ITEMS.map(({ label, href, icon: IconComponent }) => (
              <NavLink
                key={href}
                to={href}
                className={({ isActive }) => cn('flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-colors', isActive ? 'bg-indigo-50 text-indigo-700' : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900')}
              >
                <IconComponent size={16} aria-hidden="true" />
                {label}
              </NavLink>
            ))}
          </nav>
        </aside>

        <div className="flex min-w-0 flex-col">
          <header className="flex h-16 items-center justify-between border-b border-slate-200 bg-white px-4 md:px-6">
            <div>
              <p className="text-xs uppercase tracking-[0.12em] text-slate-500">User</p>
              <p className="text-sm font-semibold">Không gian quản lý dự án</p>
            </div>
            <div className="flex items-center gap-2">
              <NavLink to={ROUTES.USER_WIZARD}>
                <Button size="sm">
                  <Plus size={16} aria-hidden="true" /> Tạo yêu cầu
                </Button>
              </NavLink>
              <button
                type="button"
                className="rounded-lg border border-slate-200 p-2 text-slate-600 transition-colors hover:bg-slate-100"
                aria-label="Thông báo"
              >
                <Bell size={17} aria-hidden="true" />
              </button>
            </div>
          </header>

          <main id="main-content" className="min-h-0 flex-1 p-4 md:p-6">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  )
}
