import { useMemo, useState } from 'react'
import { useParams } from 'react-router-dom'
import { CircleCheck, FileText, MessageSquare, Plus, Timeline, Wallet } from 'lucide-react'
import { Card } from '../../../components/ui/Card'
import { Badge } from '../../../components/ui/Badge'
import { Button } from '../../../components/ui/Button'
import { SectionHeading } from '../../../components/shared/SectionHeading'
import { Seo } from '../../../core/seo/Seo'
import { orderFiles, orderPayments, orderTasks, orderTimeline, orders, requests } from '../data/mockData'

const TAB_ITEMS = [
  { key: 'tasks', label: 'Task', icon: CircleCheck },
  { key: 'timeline', label: 'Timeline', icon: Timeline },
  { key: 'requests', label: 'Request Center', icon: MessageSquare },
  { key: 'files', label: 'Files', icon: FileText },
  { key: 'payment', label: 'Thanh toán', icon: Wallet },
]

const TASK_STATUS = {
  todo: { label: 'Cần làm', variant: 'neutral' },
  doing: { label: 'Đang làm', variant: 'warning' },
  review: { label: 'Chờ duyệt', variant: 'warning' },
  done: { label: 'Hoàn thành', variant: 'success' },
}

const TIMELINE_STATUS = {
  todo: 'neutral',
  review: 'warning',
  done: 'success',
}

export function OrderDetailPage() {
  const { orderId } = useParams()
  const [activeTab, setActiveTab] = useState('tasks')
  const order = useMemo(() => orders.find((item) => item.id === orderId) || orders[0], [orderId])

  return (
    <>
      <Seo title="Chi tiết đơn" description="Chi tiết tiến độ và giao tiếp theo từng đơn." />
      <section className="space-y-6">
        <SectionHeading eyebrow="Order" title={order.title} description="Theo dõi task, timeline, file bàn giao, request center và thanh toán theo mốc." />

        <div className="grid gap-5 xl:grid-cols-[1fr_320px]">
          <div className="space-y-4">
            <Card className="space-y-3">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-xs font-semibold text-slate-500">{order.id}</span>
                    <Badge variant={order.statusKey === 'in-progress' ? 'success' : 'warning'}>{order.status}</Badge>
                  </div>
                  <p className="mt-2 text-sm text-slate-600">Mọi trao đổi dự án nằm trong Request Center và được ghi audit log.</p>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-slate-900">{order.progress}%</p>
                  <p className="text-xs text-slate-500">tiến độ</p>
                </div>
              </div>
              <div className="h-2 rounded-full bg-slate-100">
                <div className="h-2 rounded-full bg-indigo-600" style={{ width: `${order.progress}%` }} />
              </div>
            </Card>

            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 pb-3">
              <div className="flex flex-wrap gap-2">
                {TAB_ITEMS.map(({ key, label, icon: IconComponent }) => (
                  <button
                    key={key}
                    type="button"
                    onClick={() => setActiveTab(key)}
                    className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-semibold transition ${
                      activeTab === key
                        ? 'border-indigo-600 bg-indigo-50 text-indigo-700'
                        : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:text-slate-900'
                    }`}
                  >
                    <IconComponent size={13} aria-hidden="true" /> {label}
                    {key === 'requests' ? <span className="rounded-full bg-slate-100 px-1.5 py-0.5 text-[10px]">{requests.length}</span> : null}
                  </button>
                ))}
              </div>

              <Button size="sm" className="h-9 px-3 text-xs font-medium">
                <Plus size={14} aria-hidden="true" /> Tạo yêu cầu
              </Button>
            </div>

            {activeTab === 'tasks' ? (
              <Card className="divide-y divide-slate-200 p-0">
                {orderTasks.map((task) => (
                  <div key={task.id} className="grid gap-3 p-4 md:grid-cols-[1fr_220px_auto] md:items-center">
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <p className="text-sm font-semibold text-slate-900">{task.title}</p>
                        <Badge variant={TASK_STATUS[task.status].variant}>{TASK_STATUS[task.status].label}</Badge>
                      </div>
                      <p className="text-xs text-slate-500">{task.id} • deadline {task.deadline}</p>
                    </div>
                    <div className="h-2 w-full max-w-[220px] rounded-full bg-slate-100 md:justify-self-center">
                      <div className="h-2 rounded-full bg-indigo-600" style={{ width: `${task.progress}%` }} />
                    </div>
                    <div className="flex flex-nowrap items-center gap-2 whitespace-nowrap">
                      <Button size="sm" className="h-8 shrink-0 px-2.5 text-xs font-medium">
                        Duyệt task
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 shrink-0 border border-rose-200 px-2.5 text-xs font-medium text-rose-600 hover:bg-rose-50 dark:border-rose-800 dark:text-rose-300 dark:hover:bg-rose-950/40"
                      >
                        Từ chối task
                      </Button>
                    </div>
                  </div>
                ))}
              </Card>
            ) : null}

            {activeTab === 'timeline' ? (
              <Card className="divide-y divide-slate-200 p-0">
                {orderTimeline.map((item) => (
                  <div key={item.title} className="flex items-start gap-3 p-4">
                    <Badge variant={TIMELINE_STATUS[item.status]}>{item.status === 'done' ? 'Đã xong' : item.status === 'review' ? 'Đang mở' : 'Chờ'}</Badge>
                    <div>
                      <p className="text-sm font-semibold text-slate-900">{item.title}</p>
                      <p className="text-xs text-slate-500">{item.audit}</p>
                    </div>
                  </div>
                ))}
              </Card>
            ) : null}

            {activeTab === 'requests' ? (
              <Card className="divide-y divide-slate-200 p-0">
                {requests.map((request) => (
                  <div key={request.id} className="p-4">
                    <div className="mb-1 flex flex-wrap items-center gap-2">
                      <p className="text-sm font-semibold text-slate-900">{request.title}</p>
                      <Badge variant={request.status.includes('Đã') ? 'success' : 'warning'}>{request.status}</Badge>
                    </div>
                    <p className="text-xs text-slate-500">{request.id} • {request.type} • {request.relatedOrder}</p>
                  </div>
                ))}
              </Card>
            ) : null}

            {activeTab === 'files' ? (
              <Card className="divide-y divide-slate-200 p-0">
                {orderFiles.map((file) => (
                  <div key={file.name} className="flex flex-wrap items-center gap-2 p-4 md:gap-4">
                    <FileText size={16} className="text-indigo-600" aria-hidden="true" />
                    <p className="flex-1 text-sm font-semibold text-slate-900">{file.name}</p>
                    <Badge variant="success">{file.status}</Badge>
                    <Button variant="ghost" size="sm">Tải</Button>
                  </div>
                ))}
              </Card>
            ) : null}

            {activeTab === 'payment' ? (
              <Card className="divide-y divide-slate-200 p-0">
                {orderPayments.map((payment) => (
                  <div key={payment.label} className="grid gap-2 p-4 md:grid-cols-[1fr_140px_160px] md:items-center">
                    <p className="text-sm font-semibold text-slate-900">{payment.label}</p>
                    <p className="text-sm text-slate-700">{payment.amount}</p>
                    <Badge variant={payment.statusKey === 'done' ? 'success' : 'warning'}>{payment.status}</Badge>
                  </div>
                ))}
              </Card>
            ) : null}
          </div>

          <aside className="space-y-4">
            <Card>
              <p className="text-sm font-semibold text-slate-900">Mentor phụ trách</p>
              {order.actor ? (
                <>
                  <p className="mt-2 text-sm font-semibold text-slate-900">{order.actor.name}</p>
                  <p className="text-xs text-slate-500">{order.actor.role} • ★ {order.actor.rating}</p>
                  <p className="mt-3 text-xs text-amber-700">Thông tin email, SĐT và thanh toán của mentor được ẩn theo chính sách nền tảng.</p>
                </>
              ) : (
                <p className="mt-2 text-sm text-slate-500">Đơn đang chờ báo giá, sẽ cập nhật mentor khi có đề xuất phù hợp.</p>
              )}
            </Card>

            <Card className="border-slate-900 bg-slate-900 text-white">
              <p className="text-sm font-semibold">AI trợ lý dự án</p>
              <p className="mt-2 text-sm text-slate-300">AI có thể tóm tắt tiến độ và giúp bạn viết request từ chối task rõ ràng hơn.</p>
              <Button size="sm" className="mt-3 w-full justify-center">Tóm tắt tiến độ</Button>
            </Card>
          </aside>
        </div>
      </section>
    </>
  )
}
