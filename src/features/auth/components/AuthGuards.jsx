import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { ROUTES } from '../../../core/constants/routes'
import { useAuth } from '../hooks/useAuth'

export function RequireAuth() {
  const { authLoading, isAuthenticated } = useAuth()
  const location = useLocation()

  if (authLoading) {
    return <div className="min-h-screen bg-slate-50 dark:bg-slate-950" />
  }

  if (!isAuthenticated) {
    return <Navigate to={ROUTES.PUBLIC_LOGIN} state={{ from: location }} replace />
  }

  return <Outlet />
}

export function RedirectIfAuthenticated() {
  const { authLoading, isAuthenticated } = useAuth()

  if (authLoading) {
    return <div className="min-h-screen bg-slate-50 dark:bg-slate-950" />
  }

  if (isAuthenticated) {
    return <Navigate to={ROUTES.USER_DASHBOARD} replace />
  }

  return <Outlet />
}
