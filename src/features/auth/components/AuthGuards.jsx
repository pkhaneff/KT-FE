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
  const { authLoading, isAuthenticated, profile } = useAuth()

  if (authLoading) {
    return <div className="min-h-screen bg-slate-50 dark:bg-slate-950" />
  }

  if (isAuthenticated) {
    const role = String(profile?.role || '').toLowerCase()
    return <Navigate to={role === 'admin' ? ROUTES.ADMIN_DASHBOARD : ROUTES.USER_DASHBOARD} replace />
  }

  return <Outlet />
}

export function RequireRole({ allowedRoles = [] }) {
  const { profile } = useAuth()
  const role = String(profile?.role || '').toLowerCase()
  const isAllowed = allowedRoles.map((item) => String(item).toLowerCase()).includes(role)

  if (!isAllowed) {
    return <Navigate to={ROUTES.USER_DASHBOARD} replace />
  }

  return <Outlet />
}
