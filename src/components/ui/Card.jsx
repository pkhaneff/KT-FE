import { cn } from '../../core/utils/cn'

export function Card({ children, className }) {
  return (
    <article className={cn('rounded-2xl border border-slate-200 bg-white p-5 shadow-sm', className)}>
      {children}
    </article>
  )
}
