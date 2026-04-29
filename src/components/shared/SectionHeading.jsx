export function SectionHeading({ eyebrow, title, description }) {
  return (
    <header className="space-y-2">
      {eyebrow ? <p className="text-xs font-semibold uppercase tracking-[0.15em] text-slate-500 dark:text-slate-400">{eyebrow}</p> : null}
      <h2 className="text-2xl font-bold tracking-tight text-slate-900 md:text-3xl dark:text-white">{title}</h2>
      {description ? <p className="max-w-3xl text-sm text-slate-600 md:text-base dark:text-slate-400">{description}</p> : null}
    </header>
  )
}
