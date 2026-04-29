import { Outlet, useLocation } from 'react-router-dom'
import { AppNavbar } from '../../components/shared/AppNavbar'

export function PublicLayout() {
  const location = useLocation()
  const isAuthRoute = location.pathname.startsWith('/auth/')

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-200">
      <a href="#main-content" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-md focus:bg-white focus:px-3 focus:py-2 focus:shadow dark:focus:bg-slate-800">
        Bỏ qua điều hướng
      </a>

      <AppNavbar />

      <main id="main-content" className={location.pathname === '/' || isAuthRoute ? '' : 'mx-auto max-w-7xl px-4 py-8 md:px-6 md:py-10'}>
        <Outlet />
      </main>
    </div>
  )
}
