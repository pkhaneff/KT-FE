import { cn } from '../../core/utils/cn'

const BADGE_VARIANTS = {
  neutral: 'bg-slate-100 text-slate-700',
  success: 'bg-emerald-100 text-emerald-700',
  warning: 'bg-amber-100 text-amber-700',
  danger: 'bg-rose-100 text-rose-700',
}

export function Badge({ children, variant = 'neutral', className }) {
  return (
    <span className={cn('inline-flex h-7 items-center rounded-full px-3 text-xs font-semibold', BADGE_VARIANTS[variant], className)}>
      {children}
    </span>
  )
}
