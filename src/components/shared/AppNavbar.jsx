import { NavLink } from 'react-router-dom'
import { styled } from '@mui/material/styles'
import Switch from '@mui/material/Switch'
import { GraduationCap, LogIn, CircleUserRound, ShoppingCart, Bell, X } from 'lucide-react'
import { PUBLIC_NAVIGATION, ROUTES } from '../../core/constants/routes'
import { cn } from '../../core/utils/cn'
import { useCart } from '../../core/cart/CartContext'
import { Button } from '../ui/Button'
import { useTheme } from '../../core/theme/ThemeContext'
import { useAuth } from '../../features/auth'

const MaterialUISwitch = styled(Switch)(() => ({
  width: 62,
  height: 34,
  padding: 7,
  '& .MuiSwitch-switchBase': {
    margin: 1,
    padding: 0,
    transform: 'translateX(6px)',
    '&.Mui-checked': {
      color: '#fff',
      transform: 'translateX(22px)',
      '& .MuiSwitch-thumb:before': {
        backgroundImage: `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" height="20" width="20" viewBox="0 0 20 20"><path fill="${encodeURIComponent(
          '#fff',
        )}" d="M4.2 2.5l-.7 1.8-1.8.7 1.8.7.7 1.8.6-1.8L6.7 5l-1.9-.7-.6-1.8zm15 8.3a6.7 6.7 0 11-6.6-6.6 5.8 5.8 0 006.6 6.6z"/></svg>')`,
      },
      '& + .MuiSwitch-track': {
        opacity: 1,
        backgroundColor: '#aab4be',
      },
    },
  },
  '& .MuiSwitch-thumb': {
    backgroundColor: '#001e3c',
    width: 32,
    height: 32,
    '&::before': {
      content: "''",
      position: 'absolute',
      width: '100%',
      height: '100%',
      left: 0,
      top: 0,
      backgroundRepeat: 'no-repeat',
      backgroundPosition: 'center',
      backgroundImage: `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" height="20" width="20" viewBox="0 0 20 20"><path fill="${encodeURIComponent(
        '#fff',
      )}" d="M9.305 1.667V3.75h1.389V1.667h-1.39zm-4.707 1.95l-.982.982L5.09 6.072l.982-.982-1.473-1.473zm10.802 0L13.927 5.09l.982.982 1.473-1.473-.982-.982zM10 5.139a4.872 4.872 0 00-4.862 4.86A4.872 4.872 0 0010 14.862 4.872 4.872 0 0014.86 10 4.872 4.872 0 0010 5.139zm0 1.389A3.462 3.462 0 0113.471 10a3.462 3.462 0 01-3.473 3.472A3.462 3.462 0 016.527 10 3.462 3.462 0 0110 6.528zM1.665 9.305v1.39h2.083v-1.39H1.666zm14.583 0v1.39h2.084v-1.39h-2.084zM5.09 13.928L3.616 15.4l.982.982 1.473-1.473-.982-.982zm9.82 0l-.982.982 1.473 1.473.982-.982-1.473-1.473zM9.305 16.25v2.083h1.389V16.25h-1.39z"/></svg>')`,
    },
  },
  '& .MuiSwitch-track': {
    opacity: 1,
    backgroundColor: '#aab4be',
    borderRadius: 20 / 2,
  },
  '.dark &': {
    '& .MuiSwitch-thumb': {
      backgroundColor: '#003892',
    },
    '& .MuiSwitch-track': {
      backgroundColor: '#8796A5',
    },
    '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
      backgroundColor: '#8796A5',
    },
  },
}))

export function AppNavbar() {
  const { theme, toggleTheme } = useTheme()
  const { isAuthenticated, profile } = useAuth()
  const { cartCount, cartItems, removeFromCart } = useCart()
  const isDark = theme === 'dark'
  const previewItems = cartItems.slice(0, 5)

  const formatMoney = (value) => `${(value || 0).toLocaleString('vi-VN')}đ`
  const role = String(profile?.role || '').toLowerCase()
  const dashboardRoute = role === 'admin' ? ROUTES.ADMIN_DASHBOARD : ROUTES.USER_DASHBOARD

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/95 backdrop-blur dark:border-slate-800 dark:bg-slate-950/90">
      <div className="flex w-full items-center justify-between gap-4 px-4 py-3 md:px-6">
        <NavLink to={ROUTES.PUBLIC_LANDING} className="inline-flex items-center gap-2 font-bold text-slate-900 dark:text-white">
          <GraduationCap size={22} className="text-indigo-600 dark:text-indigo-400" aria-hidden="true" />
          <span>ProjectMentor Hub</span>
        </NavLink>

        <nav aria-label="Primary navigation" className="hidden items-center gap-1 md:flex">
          {PUBLIC_NAVIGATION.map((item) => (
            <NavLink
              key={item.href}
              to={item.href}
              end={item.href === ROUTES.PUBLIC_LANDING}
              className={({ isActive }) => cn(
                'rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                isActive
                  ? 'bg-indigo-50 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-400'
                  : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-white'
              )}
            >
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <MaterialUISwitch
            checked={isDark}
            onChange={toggleTheme}
            ariaLabel={isDark ? 'Chuyển sang chế độ sáng' : 'Chuyển sang chế độ tối'}
          />

          {isAuthenticated ? (
            <>
              <div className="group relative">
                <NavLink to={ROUTES.PUBLIC_CART}>
                  <Button variant="ghost" size="sm" className="relative px-2" aria-label="Giỏ hàng">
                    <ShoppingCart size={18} aria-hidden="true" />
                    {cartCount > 0 ? (
                      <span className="absolute -right-1 -top-1 inline-flex min-w-4 items-center justify-center rounded-full bg-rose-500 px-1 text-[10px] font-bold leading-4 text-white">
                        {cartCount > 99 ? '99+' : cartCount}
                      </span>
                    ) : null}
                  </Button>
                </NavLink>

                <div className="invisible absolute right-0 top-full z-50 w-80 translate-y-1 pt-2 opacity-0 transition group-hover:visible group-hover:translate-y-0 group-hover:opacity-100">
                  <div className="rounded-xl border border-slate-200 bg-white p-3 shadow-xl dark:border-slate-700 dark:bg-slate-900">
                    <p className="mb-2 text-xs font-semibold uppercase tracking-[0.08em] text-slate-500 dark:text-slate-400">Sản phẩm đã chọn</p>

                    {previewItems.length === 0 ? (
                      <p className="text-sm text-slate-500 dark:text-slate-400">Giỏ hàng đang trống.</p>
                    ) : (
                      <div className="space-y-2">
                        {previewItems.map((item) => (
                          <div key={item.id} className="flex items-start justify-between gap-2 text-sm">
                            <div className="min-w-0">
                              <p className="line-clamp-1 text-slate-700 dark:text-slate-200">{item.product_name} × {item.qty}</p>
                              <button
                                type="button"
                                onClick={() => removeFromCart(item.product_id)}
                                className="mt-0.5 inline-flex items-center gap-1 text-[11px] font-semibold text-rose-600 hover:text-rose-700 dark:text-rose-400 dark:hover:text-rose-300"
                              >
                                <X size={12} aria-hidden="true" /> Xóa
                              </button>
                            </div>
                            <p className="whitespace-nowrap font-semibold text-slate-900 dark:text-slate-100">{formatMoney(item.line_total)}</p>
                          </div>
                        ))}
                        {cartItems.length > previewItems.length ? (
                          <p className="text-xs text-slate-500 dark:text-slate-400">+{cartItems.length - previewItems.length} sản phẩm khác</p>
                        ) : null}
                      </div>
                    )}

                    <div className="mt-3 flex justify-end">
                      <NavLink to={ROUTES.PUBLIC_CART}>
                        <Button size="sm" className="h-8 px-3 text-xs">Xem giỏ hàng</Button>
                      </NavLink>
                    </div>
                  </div>
                </div>
              </div>

              <Button variant="ghost" size="sm" className="px-2" aria-label="Thông báo">
                <Bell size={18} aria-hidden="true" />
              </Button>

              <NavLink to={dashboardRoute}>
                <Button variant="ghost" size="sm" className="gap-2">
                  {profile?.avatar ? (
                    <img
                      src={profile.avatar}
                      alt={profile?.full_name || 'Avatar người dùng'}
                      className="size-5 rounded-full object-cover"
                    />
                  ) : (
                    <CircleUserRound size={16} aria-hidden="true" />
                  )}
                  {profile?.full_name || 'Hồ sơ'}
                </Button>
              </NavLink>
            </>
          ) : (
            <>
              <NavLink to={ROUTES.PUBLIC_LOGIN}>
                <Button variant="ghost" size="sm">
                  <LogIn size={16} aria-hidden="true" /> Đăng nhập
                </Button>
              </NavLink>
              <NavLink to={ROUTES.PUBLIC_REGISTER}>
                <Button size="sm">Bắt đầu</Button>
              </NavLink>
            </>
          )}
        </div>
      </div>
    </header>
  )
}
