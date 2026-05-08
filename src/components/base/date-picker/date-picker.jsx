import { cn } from '../../../core/utils/cn'

export function DatePicker({ className, value, onChange, ...props }) {
  return (
    <input
      type="date"
      value={value}
      onChange={(event) => onChange?.(event.target.value)}
      className={cn(
        'h-11 w-full rounded-lg border border-slate-300 bg-white px-3 text-sm text-slate-800',
        'placeholder:text-slate-400 focus-visible:border-indigo-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-200',
        className,
      )}
      {...props}
    />
  )
}
