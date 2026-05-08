import { Bell, Search, Sparkles } from 'lucide-react'

export function WorkspaceTopbar({
  breadcrumb,
  title,
  onBreadcrumbClick,
  onSearchClick,
  onAskAiClick,
  onNotificationClick,
  actions,
}) {
  return (
    <header
      className="flex h-14 items-center gap-3 border-b border-slate-200 bg-white px-4 dark:border-slate-800 dark:bg-slate-900 md:px-5"
    >
      <div className="min-w-0 flex-1">
        <button
          type="button"
          onClick={onBreadcrumbClick}
          className="mb-0.5 text-left font-mono text-[11px] text-slate-500 transition-colors hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200"
        >
          {breadcrumb}
        </button>
        <div className="truncate text-[15px] font-bold tracking-[-0.015em] text-slate-900 dark:text-white">{title}</div>
      </div>

      <button
        type="button"
        onClick={onSearchClick}
        className="hidden h-[34px] w-[292px] items-center gap-2 rounded-lg border border-slate-200 bg-white px-2.5 text-left text-[12.5px] text-slate-500 transition-colors hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-400 dark:hover:bg-slate-800 lg:flex"
      >
        <Search size={14} className="text-slate-400 dark:text-slate-500" />
        <span className="flex-1">Tìm đơn, request, bài viết...</span>
        <span className="rounded bg-slate-100 px-1.5 py-0.5 font-mono text-[10px] text-slate-600 dark:bg-slate-800 dark:text-slate-300">⌘K</span>
      </button>

      {actions}

      <button
        type="button"
        onClick={onAskAiClick}
        className="inline-flex h-8 items-center gap-1.5 rounded-lg border border-slate-200 bg-slate-50 px-3 text-xs font-semibold text-slate-700 transition-colors hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700"
      >
        <Sparkles size={13} className="text-indigo-500 dark:text-indigo-400" />
        Hỏi AI
      </button>

      <button
        type="button"
        onClick={onNotificationClick}
        className="relative grid h-[34px] w-[34px] place-items-center rounded-lg bg-slate-100 text-slate-700 transition-colors hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700"
        aria-label="Thông báo"
      >
        <Bell size={15} />
        <span className="absolute right-[6px] top-[6px] h-[7px] w-[7px] rounded-full border-[1.5px] border-white bg-indigo-500 dark:border-slate-800" />
      </button>
    </header>
  )
}
