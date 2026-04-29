import { FolderKanban, Send, Wallet, Bookmark, Clock } from 'lucide-react'
import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { MetricCard } from '../../../components/shared/MetricCard'
import { SectionHeading } from '../../../components/shared/SectionHeading'
import { Card } from '../../../components/ui/Card'
import { Badge } from '../../../components/ui/Badge'
import { Button } from '../../../components/ui/Button'
import { Seo } from '../../../core/seo/Seo'
import { ROUTES } from '../../../core/constants/routes'
import { orders } from '../data/mockData'

const ORDER_FILTERS = [
  { key: 'all', label: 'Tất cả' },
  { key: 'waiting', label: 'Chờ báo giá' },
  { key: 'in-progress', label: 'Đang làm' },
  { key: 'review', label: 'Chờ duyệt' },
  { key: 'done', label: 'Hoàn thành' },
]

const STATUS_BADGE = {
  waiting: 'warning',
  'in-progress': 'success',
  review: 'warning',
  done: 'success',
}

export function DashboardPage() {
  const [filter, setFilter] = useState('all')
  const filteredOrders = useMemo(
    () => (filter === 'all' ? orders : orders.filter((order) => order.statusKey === filter)),
    [filter]
  )

  return (
    <>
      <Seo title="User Dashboard" description="Tổng quan dự án và hoạt động người dùng." />

      <section className="space-y-6">
        <SectionHeading
          title="Dashboard người dùng"
          description="Theo dõi đơn, yêu cầu và ví trong một màn hình tổng quan."
        />

        <div className="grid gap-4 grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5">
          <MetricCard label="Đơn đang làm" value="2" icon={FolderKanban} />
          <MetricCard label="Chờ báo giá" value="4" icon={Clock} />
          <MetricCard label="Số dư ví" value="1.200.000đ" icon={Wallet} />
          <MetricCard label="Yêu cầu mở" value="4" icon={Send} />
          <MetricCard label="Bài đã lưu" value="34" icon={Bookmark} />
        </div>

        <section className="space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex flex-wrap gap-2">
              {ORDER_FILTERS.map((item) => (
                <button
                  key={item.key}
                  type="button"
                  onClick={() => setFilter(item.key)}
                  className={`rounded-full border px-3 py-1.5 text-xs font-semibold transition ${
                    filter === item.key
                      ? 'border-indigo-600 bg-indigo-50 text-indigo-700'
                      : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:text-slate-900'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          <Card className="divide-y divide-slate-200 p-0">
            {filteredOrders.length ? filteredOrders.map((order) => (
              <div key={order.id} className="grid gap-3 p-4 md:grid-cols-[1fr_360px_170px] md:items-center">
                <div>
                  <div className="mb-1 flex flex-wrap items-center gap-2">
                    <span className="text-xs font-semibold text-slate-500">{order.id}</span>
                    <Badge variant={STATUS_BADGE[order.statusKey] || 'neutral'}>{order.status}</Badge>
                  </div>
                  <p className="text-sm font-semibold text-slate-900">{order.title}</p>
                  <p className="text-xs text-slate-500">{order.category} • {order.budget} • Deadline {order.deadline}</p>
                </div>

                <div>
                  <div className="mb-2 flex items-center justify-between text-sm text-slate-600">
                    <span>Tiến độ</span>
                    <span className="text-base font-semibold text-slate-800">{order.progress}%</span>
                  </div>
                  <div className="h-3 rounded-full bg-slate-100">
                    <div className="h-3 rounded-full bg-indigo-600" style={{ width: `${order.progress}%` }} />
                  </div>
                </div>

                <div className="flex items-center justify-between gap-3 md:justify-end">
                  <Link to={`/u/orders/${order.id}`}>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="border border-slate-300 bg-white font-medium text-slate-800 hover:bg-slate-50 dark:border-slate-600 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800"
                    >
                      Xem tiến độ
                    </Button>
                  </Link>
                </div>
              </div>
            )) : (
              <div className="p-8 text-center">
                <p className="text-sm font-semibold text-slate-900">Không có đơn phù hợp</p>
                <p className="mt-1 text-sm text-slate-500">Thử đổi bộ lọc hoặc tạo yêu cầu mới để nhận báo giá.</p>
              </div>
            )}
          </Card>
        </section>
      </section>
    </>
  )
}
