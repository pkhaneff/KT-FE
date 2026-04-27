import { NavLink, Outlet, useLocation } from 'react-router-dom'
import { GraduationCap, LogIn } from 'lucide-react'
import { PUBLIC_NAVIGATION, ROUTES } from '../../core/constants/routes'
import { cn } from '../../core/utils/cn'
import { Button } from '../../components/ui/Button'

export function PublicLayout() {
  const location = useLocation()
  const isAuthRoute = location.pathname.startsWith('/auth/')

  if (isAuthRoute) {
    return (
      <div className="min-h-screen bg-slate-50 text-slate-900">
        <a href="#main-content" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-md focus:bg-white focus:px-3 focus:py-2 focus:shadow">
          Bỏ qua điều hướng
        </a>
        <main id="main-content">
          <Outlet />
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <a href="#main-content" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-md focus:bg-white focus:px-3 focus:py-2 focus:shadow">
        Bỏ qua điều hướng
      </a>

      <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/95 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 md:px-6">
          <NavLink to={ROUTES.PUBLIC_LANDING} className="inline-flex items-center gap-2 font-bold text-slate-900">
            <GraduationCap size={22} className="text-indigo-600" aria-hidden="true" />
            <span>ProjectMentor Hub</span>
          </NavLink>

          <nav aria-label="Public navigation" className="hidden items-center gap-1 md:flex">
            {PUBLIC_NAVIGATION.map((item) => (
              <NavLink
                key={item.href}
                to={item.href}
                className={({ isActive }) => cn('rounded-lg px-3 py-2 text-sm font-medium transition-colors', isActive ? 'bg-indigo-50 text-indigo-700' : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900')}
              >
                {item.label}
              </NavLink>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <NavLink to={ROUTES.PUBLIC_LOGIN}>
              <Button variant="ghost" size="sm">
                <LogIn size={16} aria-hidden="true" /> Đăng nhập
              </Button>
            </NavLink>
            <NavLink to={ROUTES.PUBLIC_REGISTER}>
              <Button size="sm">Bắt đầu</Button>
            </NavLink>
          </div>
        </div>
      </header>

      <main id="main-content" className="mx-auto max-w-7xl px-4 py-8 md:px-6 md:py-10">
        <Outlet />
      </main>
    </div>
  )
}
