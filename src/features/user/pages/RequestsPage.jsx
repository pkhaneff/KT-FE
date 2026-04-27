import { Link } from 'react-router-dom'
import { Card } from '../../../components/ui/Card'
import { Badge } from '../../../components/ui/Badge'
import { SectionHeading } from '../../../components/shared/SectionHeading'
import { Seo } from '../../../core/seo/Seo'
import { requests } from '../data/mockData'

export function RequestsPage() {
  return (
    <>
      <Seo title="Request Center" description="Danh sách yêu cầu giữa user và mentor." />
      <section className="space-y-6">
        <SectionHeading eyebrow="Requests" title="Request Center" description="Quản lý yêu cầu theo dạng có cấu trúc, ưu tiên và trạng thái xử lý." />

        <Card className="divide-y divide-slate-200 p-0">
          {requests.map((request) => (
            <div key={request.id} className="grid gap-2 p-4 md:grid-cols-[1fr_auto] md:items-center">
              <div>
                <p className="text-sm font-semibold text-slate-900">{request.title}</p>
                <p className="text-xs text-slate-500">{request.id}</p>
              </div>
              <div className="flex items-center gap-3">
                <Badge variant={request.status.includes('Đã') ? 'success' : 'warning'}>{request.status}</Badge>
                <Link className="text-sm font-semibold text-indigo-700 hover:text-indigo-800" to={`/u/requests/${request.id}`}>Chi tiết</Link>
              </div>
            </div>
          ))}
        </Card>
      </section>
    </>
  )
}
