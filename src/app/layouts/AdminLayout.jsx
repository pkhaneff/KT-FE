import { NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom'
import { ROUTES } from '../../core/constants/routes'
import { cn } from '../../core/utils/cn'
import { useAuth } from '../../features/auth'
import { ShieldCheck, Users, UserCheck, ReceiptText, FolderKanban, FileText, Settings, LogOut, Send } from 'lucide-react'
import { WorkspaceTopbar } from '../../components/shared/WorkspaceTopbar'

const ADMIN_NAV = [
  { label: 'Dashboard', href: ROUTES.ADMIN_DASHBOARD, icon: ShieldCheck },
  { label: 'Người dùng', href: ROUTES.ADMIN_USERS, icon: Users },
  { label: 'Mentor', href: ROUTES.ADMIN_MENTORS, icon: UserCheck },
  { label: 'Đơn hàng', href: ROUTES.ADMIN_ORDERS, icon: ReceiptText },
  { label: 'Yêu cầu dự án', href: ROUTES.ADMIN_PROJECT_REQUESTS, icon: Send },
  { divider: true },
  { label: 'Nội dung', href: ROUTES.ADMIN_CONTENT, icon: FolderKanban },
  { label: 'Bài viết', href: ROUTES.ADMIN_POSTS, icon: FileText },
  { divider: true },
  { label: 'Cài đặt', href: ROUTES.ADMIN_SETTINGS, icon: Settings },
  { divider: true },
  { label: 'Đăng xuất', icon: LogOut, action: 'logout' },
]

export function AdminLayout() {
  const navigate = useNavigate()
  const location = useLocation()
  const { profile, logout } = useAuth()
  const userName = profile?.name || profile?.full_name || 'Admin'
  const adminInitials = userName
    .split(' ')
    .filter(Boolean)
    .slice(-2)
    .map((part) => part[0])
    .join('')
    .toUpperCase() || 'SA'
  const topbarMeta = getAdminTopbarMeta(location.pathname)

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900 dark:bg-slate-950 dark:text-slate-200">
      <div className="grid min-h-screen w-full grid-cols-1 md:grid-cols-[280px_1fr]">
        <aside className="flex flex-col border-r border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
          <div className="mb-6 rounded-xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-800/70">
            <p className="text-xs font-semibold uppercase tracking-[0.08em] text-slate-500 dark:text-slate-400">Ứng dụng</p>
            <p className="mt-1 text-base font-semibold text-slate-900 dark:text-white">ProjectMentor Hub</p>
          </div>

          <nav aria-label="Admin navigation" className="space-y-1.5">
            {ADMIN_NAV.map(({ label, href, icon: IconComponent, action, divider }, index) => {
              if (divider) {
                return <div key={`divider-${index}`} className="my-1 border-t border-slate-200 dark:border-slate-800" aria-hidden="true" />
              }

              if (action === 'logout') {
                return (
                  <button
                    key={label}
                    type="button"
                    onClick={logout}
                    className="group flex w-full items-center gap-2 rounded-xl px-3 py-2.5 text-sm font-medium text-rose-600 transition-colors hover:bg-rose-50 dark:text-rose-400 dark:hover:bg-rose-950/40"
                  >
                    <IconComponent size={16} aria-hidden="true" className="shrink-0" />
                    <span className="flex-1 text-left">{label}</span>
                  </button>
                )
              }

              return (
                <NavLink
                  key={href}
                  to={href}
                  className={({ isActive }) => cn(
                    'group flex items-center gap-2 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors',
                    isActive
                      ? 'bg-slate-100 text-slate-900 dark:bg-slate-800 dark:text-white'
                      : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-white'
                  )}
                >
                  <IconComponent size={16} aria-hidden="true" className="shrink-0" />
                  <span className="flex-1">{label}</span>
                </NavLink>
              )
            })}
          </nav>

          <div className="mt-4 border-t border-slate-200 pt-4 dark:border-slate-800 md:mt-auto">
            <div className="flex items-center gap-3">
              <div className="grid h-11 w-11 place-items-center rounded-lg border border-slate-300 bg-white text-sm font-bold text-slate-700 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200">
                {adminInitials}
              </div>
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold text-slate-900 dark:text-white">{userName}</p>
                <p className="text-[11px] font-semibold uppercase tracking-[0.08em] text-slate-500 dark:text-slate-400">Super Admin</p>
              </div>
            </div>
          </div>
        </aside>

        <div className="flex min-w-0 flex-col">
          <WorkspaceTopbar
            breadcrumb={topbarMeta.breadcrumb}
            title={topbarMeta.title}
            onBreadcrumbClick={() => navigate(ROUTES.ADMIN_DASHBOARD)}
            onSearchClick={() => window.alert('Mở quick search (placeholder).')}
            onAskAiClick={() => window.alert('Mở AI assistant (placeholder).')}
            onNotificationClick={() => window.alert('Mở danh sách thông báo (placeholder).')}
          />
          <main className="min-h-0 p-4 md:p-6">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  )
}

function getAdminTopbarMeta(pathname) {
  if (pathname.startsWith('/admin/users')) {
    return { breadcrumb: 'Quản lý / Người dùng', title: 'User Management' }
  }
  if (pathname.startsWith('/admin/mentors')) {
    return { breadcrumb: 'Quản lý / Mentor', title: 'Mentor Management' }
  }
  if (pathname.startsWith('/admin/orders')) {
    return { breadcrumb: 'Quản lý / Đơn hàng', title: 'Order Management' }
  }
  if (pathname.startsWith('/admin/project-requests')) {
    return { breadcrumb: 'Quản lý / Yêu cầu dự án', title: 'Project Request Management' }
  }
  if (pathname.startsWith('/admin/content')) {
    return { breadcrumb: 'Tin cậy / Nội dung', title: 'Content Moderation' }
  }
  if (pathname.startsWith('/admin/posts')) {
    return { breadcrumb: 'Nội dung / Bài viết', title: 'Post Management' }
  }
  if (pathname.startsWith('/admin/settings')) {
    return { breadcrumb: 'Hệ thống / Cài đặt', title: 'System Settings' }
  }
  return { breadcrumb: 'Quản lý / Tổng quan', title: 'Admin Dashboard' }
}
