import { cn } from '../../core/utils/cn'

export function Card({ children, className }) {
  return (
    <article className={cn('rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-slate-800', className)}>
      {children}
    </article>
  )
}
