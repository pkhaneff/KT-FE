import { useMemo } from 'react'
import { useParams } from 'react-router-dom'
import { ShieldCheck, Sparkles } from 'lucide-react'
import { Card } from '../../../components/ui/Card'
import { Badge } from '../../../components/ui/Badge'
import { Button } from '../../../components/ui/Button'
import { SectionHeading } from '../../../components/shared/SectionHeading'
import { Seo } from '../../../core/seo/Seo'
import { requests } from '../data/mockData'

const THREAD_ITEMS = [
  {
    by: 'Bạn',
    time: '09:42 · 18 Th.5',
    content: 'Mình cần mentor chỉnh lại retry logic của Telegram Bot, ưu tiên giữ ổn định khi MQTT mất kết nối.',
  },
  {
    by: 'Mentor',
    time: '10:18 · 18 Th.5',
    content: 'Đã nhận. Mình sẽ cập nhật theo exponential backoff và gửi commit/test report trong hôm nay.',
  },
]

export function RequestDetailPage() {
  const { requestId } = useParams()
  const request = useMemo(() => requests.find((item) => item.id === requestId) || requests[0], [requestId])

  return (
    <>
      <Seo title="Chi tiết request" description="Theo dõi trao đổi chi tiết theo từng request." />
      <section className="space-y-6">
        <SectionHeading eyebrow="Request" title={request.title} description="Lịch sử trao đổi, phản hồi mentor và metadata kiểm duyệt của request." />

        <div className="grid gap-5 xl:grid-cols-[1fr_320px]">
          <div className="space-y-4">
            <Card>
              <div className="grid gap-3 md:grid-cols-3">
                {[
                  ['Trạng thái', request.status],
                  ['Timestamp', request.time],
                  ['Creator', 'Người dùng'],
                  ['Related order', request.relatedOrder],
                  ['Priority', request.priority],
                  ['Files', request.files],
                ].map(([label, value]) => (
                  <div key={label} className="rounded-xl bg-slate-50 p-3">
                    <p className="text-[11px] font-semibold uppercase tracking-[0.08em] text-slate-500">{label}</p>
                    <p className="mt-1 text-sm font-semibold text-slate-900">{value}</p>
                  </div>
                ))}
              </div>
            </Card>

            <Card className="space-y-3">
              <div className="flex items-center justify-between gap-3">
                <p className="text-sm font-semibold text-slate-900">Request thread</p>
                <Badge variant={request.status.includes('Đã') ? 'success' : 'warning'}>{request.status}</Badge>
              </div>
              <div className="space-y-3">
                {THREAD_ITEMS.map((item) => (
                  <div key={`${item.by}-${item.time}`} className="rounded-xl border border-slate-200 p-3">
                    <div className="mb-1 flex items-center justify-between gap-2">
                      <p className="text-sm font-semibold text-slate-900">{item.by}</p>
                      <p className="text-xs text-slate-500">{item.time}</p>
                    </div>
                    <p className="text-sm text-slate-700">{item.content}</p>
                  </div>
                ))}
              </div>
              <Button size="sm">Phản hồi có cấu trúc</Button>
            </Card>
          </div>

          <aside className="space-y-4">
            <Card>
              <div className="flex items-center gap-2 text-slate-900">
                <Sparkles size={16} className="text-indigo-600" aria-hidden="true" />
                <p className="text-sm font-semibold">AI summary</p>
              </div>
              <p className="mt-2 text-sm text-slate-600">{request.ai}</p>
            </Card>

            <Card>
              <div className="flex items-center gap-2 text-slate-900">
                <ShieldCheck size={16} className="text-emerald-600" aria-hidden="true" />
                <p className="text-sm font-semibold">Admin note</p>
              </div>
              <p className="mt-2 text-sm text-slate-600">{request.adminNote}</p>
              <p className="mt-3 text-xs text-slate-500">{request.audit}</p>
            </Card>
          </aside>
        </div>
      </section>
    </>
  )
}
