import { cn } from '../../core/utils/cn'

const BADGE_VARIANTS = {
  neutral: 'bg-slate-100 text-slate-700 dark:bg-slate-700 dark:text-slate-300',
  success: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-400',
  warning: 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-400',
  danger: 'bg-rose-100 text-rose-700 dark:bg-rose-900/40 dark:text-rose-400',
}

export function Badge({ children, variant = 'neutral', className }) {
  return (
    <span className={cn('inline-flex h-7 items-center rounded-full px-3 text-xs font-semibold', BADGE_VARIANTS[variant], className)}>
      {children}
    </span>
  )
}
