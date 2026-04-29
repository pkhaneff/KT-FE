import { NavLink, Outlet, useLocation } from 'react-router-dom'
import { CircleUserRound, LayoutDashboard, Wallet, Send, Bookmark, Sunrise, Sun, Sunset, Moon, MoonStar, LogOut, ReceiptText } from 'lucide-react'
import { ROUTES } from '../../core/constants/routes'
import { cn } from '../../core/utils/cn'
import { AppNavbar } from '../../components/shared/AppNavbar'
import { useAuth } from '../../features/auth'

const SIDEBAR_GROUPS = [
  {
    title: 'Tổng quan',
    items: [
      { label: 'Dashboard', href: ROUTES.USER_DASHBOARD, icon: LayoutDashboard },
      { label: 'Ví', href: ROUTES.USER_WALLET, icon: Wallet },
    ],
  },
  {
    title: 'Công việc',
    items: [
      { label: 'Hóa đơn', href: ROUTES.USER_ORDERS, icon: ReceiptText },
      { label: 'Yêu cầu', href: ROUTES.USER_REQUESTS, icon: Send },
      { label: 'Bài đã lưu', href: ROUTES.USER_SAVED_ARTICLES, icon: Bookmark },
    ],
  },
  {
    title: 'Cá nhân',
    items: [
      { label: 'Hồ sơ', href: ROUTES.USER_PROFILE, icon: CircleUserRound },
      { label: 'Đăng xuất', icon: LogOut, action: 'logout' },
    ],
  },
]

function getGreetingMeta(hour) {
  if (hour >= 5 && hour <= 10) {
    return { period: 'sáng', icon: Sunrise }
  }
  if (hour >= 11 && hour <= 13) {
    return { period: 'trưa', icon: Sun }
  }
  if (hour >= 14 && hour <= 17) {
    return { period: 'chiều', icon: Sunset }
  }
  if (hour >= 18 && hour <= 22) {
    return { period: 'tối', icon: Moon }
  }
  return { period: 'khuya', icon: MoonStar }
}

function getBreadcrumb(pathname) {
  if (pathname === ROUTES.USER_DASHBOARD) return 'Chính / Tổng quan'
  if (pathname.startsWith('/u/orders')) return 'Đơn của tôi / Danh sách'
  if (pathname.startsWith('/u/requests')) return 'Đơn của tôi / Request Center'
  if (pathname === ROUTES.USER_WALLET) return 'Chính / Ví'
  if (pathname === ROUTES.USER_PROFILE) return 'Tài khoản / Hồ sơ'
  if (pathname === ROUTES.USER_SAVED_ARTICLES) return 'Học tập / Đã lưu'
  if (pathname === ROUTES.USER_SETTINGS) return 'Tài khoản / Cài đặt'
  return 'Chính / Tổng quan'
}

export function UserLayout() {
  const location = useLocation()
  const { profile, logout } = useAuth()

  const userName = profile?.name || profile?.full_name || 'bạn'
  const userRole = profile?.role || 'user'
  const normalizedRole = String(userRole).toLowerCase()
  const roleBadgeClass = normalizedRole === 'admin'
    ? 'bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300'
    : normalizedRole === 'provider' || normalizedRole === 'actor'
      ? 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300'
      : 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300'
  const { period, icon: GreetingIcon } = getGreetingMeta(new Date().getHours())
  const greeting = `Chào buổi ${period}`
  const breadcrumb = getBreadcrumb(location.pathname)

  const handleLogout = async () => {
    await logout()
  }

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900 dark:bg-slate-950 dark:text-slate-200">
      <a href="#main-content" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-md focus:bg-white focus:px-3 focus:py-2 focus:shadow dark:focus:bg-slate-800">
        Bỏ qua điều hướng
      </a>

      <AppNavbar />

      <div className="grid min-h-[calc(100vh-65px)] w-full grid-cols-1 md:grid-cols-[260px_1fr]">
        <aside className="border-r border-slate-200 bg-white p-4 md:p-5 dark:border-slate-800 dark:bg-slate-900">
          <div className="mb-6 space-y-1">
            <p className="text-xs text-slate-500 dark:text-slate-400">{breadcrumb}</p>
            <div className="flex items-center gap-2 text-sm font-semibold text-slate-900 dark:text-white">
              <span>{greeting}</span>
              <GreetingIcon className="text-indigo-600 dark:text-indigo-400" size={16} aria-hidden="true" />
            </div>
            <div className="flex items-center gap-2">
              <p className="text-sm font-semibold text-slate-900 dark:text-white">{userName}</p>
              <span className={cn('inline-flex w-fit rounded-full px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.08em]', roleBadgeClass)}>
                {String(userRole).toUpperCase()}
              </span>
            </div>
          </div>

          <div className="mb-4 border-t border-slate-200 dark:border-slate-800" />

          <nav aria-label="User navigation" className="space-y-4">
            {SIDEBAR_GROUPS.map((group) => (
              <div key={group.title} className="space-y-1">
                <p className="px-3 text-[11px] font-bold uppercase tracking-[0.08em] text-slate-600 dark:text-slate-300">
                  {group.title}
                </p>
                {group.items.map(({ label, href, icon: IconComponent, action }) => {
                  if (action === 'logout') {
                    return (
                      <button
                        key={label}
                        type="button"
                        onClick={handleLogout}
                        className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-rose-600 transition-colors hover:bg-rose-50 hover:text-rose-700 dark:text-rose-400 dark:hover:bg-rose-950/40 dark:hover:text-rose-300"
                      >
                        <IconComponent size={16} aria-hidden="true" />
                        {label}
                      </button>
                    )
                  }

                  return (
                    <NavLink
                      key={href}
                      to={href}
                      className={({ isActive }) => cn(
                        'flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                        isActive
                          ? 'bg-indigo-50 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-400'
                          : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-white'
                      )}
                    >
                      <IconComponent size={16} aria-hidden="true" />
                      {label}
                    </NavLink>
                  )
                })}
              </div>
            ))}
          </nav>
        </aside>

        <div className="flex min-w-0 flex-col">
          <main id="main-content" className="min-h-0 flex-1 p-4 md:p-6">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  )
}
