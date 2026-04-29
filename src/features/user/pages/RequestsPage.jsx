import { Link } from 'react-router-dom'
import { AlertTriangle, Check, Plus, Send } from 'lucide-react'
import { Card } from '../../../components/ui/Card'
import { Badge } from '../../../components/ui/Badge'
import { MetricCard } from '../../../components/shared/MetricCard'
import { Button } from '../../../components/ui/Button'
import { SectionHeading } from '../../../components/shared/SectionHeading'
import { Seo } from '../../../core/seo/Seo'
import { ROUTES } from '../../../core/constants/routes'
import { requests } from '../data/mockData'

export function RequestsPage() {
  const openedCount = requests.filter((item) => !item.status.includes('Đã')).length

  return (
    <>
      <Seo title="Request Center" description="Danh sách yêu cầu giữa user và mentor." />
      <section className="space-y-6">
        <SectionHeading eyebrow="Requests" title="Request Center" description="Quản lý yêu cầu theo dạng có cấu trúc, ưu tiên và trạng thái xử lý." />

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          <MetricCard label="Đang mở" value={String(openedCount)} icon={Send} />
          <MetricCard label="Bị flag" value="1" icon={AlertTriangle} />
          <MetricCard label="Đã xử lý" value="24" icon={Check} />
        </div>

        <div className="flex justify-end">
          <Link to={ROUTES.USER_WIZARD}>
            <Button size="sm">
              <Plus size={14} aria-hidden="true" /> Tạo yêu cầu cho mentor
            </Button>
          </Link>
        </div>

        <Card className="divide-y divide-slate-200 p-0">
          {requests.map((request) => (
            <div key={request.id} className="grid gap-2 p-4 md:grid-cols-[1fr_170px_120px_120px] md:items-center">
              <div>
                <p className="text-sm font-semibold text-slate-900">{request.title}</p>
                <p className="text-xs text-slate-500">{request.id} • {request.type} • {request.relatedOrder}</p>
              </div>
              <div>
                <Badge variant={request.status.includes('Đã') ? 'success' : 'warning'}>{request.status}</Badge>
              </div>
              <div>
                <Badge variant={request.priority === 'Cao' ? 'warning' : 'neutral'}>{request.priority}</Badge>
              </div>
              <div className="flex items-center justify-between gap-3 md:justify-end">
                <span className="text-xs text-slate-500">{request.time?.split('·')[0]?.trim() || 'Vừa xong'}</span>
                <Link className="text-sm font-semibold text-indigo-700 hover:text-indigo-800" to={`/u/requests/${request.id}`}>Chi tiết</Link>
              </div>
            </div>
          ))}
        </Card>
      </section>
    </>
  )
}
