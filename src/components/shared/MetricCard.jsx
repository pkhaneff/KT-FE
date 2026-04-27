import { Card } from '../ui/Card'

export function MetricCard({ label, value, icon: IconComponent }) {
  return (
    <Card className="flex items-start justify-between gap-3">
      <div>
        <p className="text-sm text-slate-500">{label}</p>
        <p className="mt-1 text-2xl font-bold text-slate-900">{value}</p>
      </div>
      {IconComponent ? (
        <span className="rounded-lg bg-indigo-50 p-2 text-indigo-600">
          <IconComponent size={18} aria-hidden="true" />
        </span>
      ) : null}
    </Card>
  )
}
