import { Link } from 'react-router-dom'
import { Card } from '../../../components/ui/Card'
import { Badge } from '../../../components/ui/Badge'
import { SectionHeading } from '../../../components/shared/SectionHeading'
import { Seo } from '../../../core/seo/Seo'
import { orders } from '../data/mockData'

export function OrdersPage() {
  return (
    <>
      <Seo title="Đơn của tôi" description="Danh sách đơn hàng và trạng thái xử lý." />
      <section className="space-y-6">
        <SectionHeading eyebrow="Orders" title="Đơn của tôi" description="Theo dõi trạng thái đơn và truy cập nhanh chi tiết từng dự án." />

        <Card className="divide-y divide-slate-200 p-0">
          {orders.map((order) => (
            <div key={order.id} className="grid gap-2 p-4 md:grid-cols-[1fr_auto] md:items-center">
              <div>
                <p className="text-sm font-semibold text-slate-900">{order.title}</p>
                <p className="text-xs text-slate-500">{order.id} • {order.category} • {order.budget}</p>
              </div>
              <div className="flex items-center gap-3">
                <Badge variant={order.status.includes('Chờ') ? 'warning' : 'success'}>{order.status}</Badge>
                <Link className="text-sm font-semibold text-indigo-700 hover:text-indigo-800" to={`/u/orders/${order.id}`}>Chi tiết</Link>
              </div>
            </div>
          ))}
        </Card>
      </section>
    </>
  )
}
