import { cn } from '../../core/utils/cn'

export function Input({ className, ...props }) {
  return (
    <input
      className={cn(
        'h-11 w-full rounded-lg border border-slate-300 bg-white px-3 text-sm text-slate-800 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-200',
        'placeholder:text-slate-400 focus-visible:border-indigo-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-200 dark:placeholder:text-slate-500 dark:focus-visible:ring-indigo-800',
        className,
      )}
      {...props}
    />
  )
}
