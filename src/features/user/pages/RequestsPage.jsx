import { Link } from 'react-router-dom'
import { useEffect, useMemo, useState } from 'react'
import { AlertTriangle, Check, Plus, Send } from 'lucide-react'
import { Card } from '../../../components/ui/Card'
import { Badge } from '../../../components/ui/Badge'
import { MetricCard } from '../../../components/shared/MetricCard'
import { Button } from '../../../components/ui/Button'
import { SectionHeading } from '../../../components/shared/SectionHeading'
import { Seo } from '../../../core/seo/Seo'
import { ROUTES } from '../../../core/constants/routes'
import { useAuth } from '../../auth/hooks/useAuth'
import { listProjectRequests } from '../services/projectRequestApi'

const STATUS_LABELS = {
  pending_review: 'Mới tạo',
  under_review: 'Đang duyệt',
  proposal_sent: 'Đã gửi đề xuất',
  negotiating: 'Đang thương lượng',
  proposal_approved: 'Đề xuất đã duyệt',
  contract_sent: 'Đã gửi hợp đồng',
  waiting_deposit: 'Chờ thanh toán',
  project_approved: 'Đã cọc dự án',
  in_progress: 'Đang làm',
  completed: 'Hoàn thành',
  expired: 'Hết hạn',
  request_rejected: 'Từ chối',
  canceled: 'Đã hủy',
}

function formatDateValue(value) {
  if (!value) {
    return 'Đang cập nhật'
  }

  const parsed = new Date(value)
  if (Number.isNaN(parsed.getTime())) {
    return 'Đang cập nhật'
  }

  return parsed.toLocaleDateString('vi-VN')
}

export function RequestsPage() {
  const { accessToken } = useAuth()
  const [requests, setRequests] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [activeTab, setActiveTab] = useState('new')

  const requestTabs = useMemo(
    () => [
      {
        key: 'new',
        label: 'Yeu cau moi',
        statuses: ['pending_review', 'under_review'],
      },
      {
        key: 'proposal_sent',
        label: 'Da gui proposal',
        statuses: ['proposal_sent'],
      },
      {
        key: 'user_responded',
        label: 'User phan hoi',
        statuses: ['negotiating', 'request_rejected', 'expired', 'canceled'],
      },
      {
        key: 'awaiting_deposit',
        label: 'Cho dat coc',
        statuses: ['proposal_approved', 'contract_sent', 'waiting_deposit'],
      },
      {
        key: 'started',
        label: 'Da coc / Start',
        statuses: ['project_approved', 'in_progress', 'completed'],
      },
    ],
    [],
  )

  useEffect(() => {
    let cancelled = false

    async function loadRequests() {
      if (!accessToken) {
        if (!cancelled) {
          setLoading(false)
        }
        return
      }

      setLoading(true)
      setError('')
      try {
        const data = await listProjectRequests(accessToken)
        if (!cancelled) {
          setRequests(Array.isArray(data) ? data : [])
        }
      } catch (err) {
        if (!cancelled) {
          setRequests([])
          setError(err.message || 'Không tải được danh sách yêu cầu.')
        }
      } finally {
        if (!cancelled) {
          setLoading(false)
        }
      }
    }

    loadRequests()

    return () => {
      cancelled = true
    }
  }, [accessToken])

  const rows = useMemo(
    () =>
      requests.map((request) => {
        const statusRaw = String(request?.status || '').toLowerCase()
        return {
          id: request?.id,
          title: request?.title || 'Yêu cầu dự án',
          type: request?.type || '---',
          statusRaw,
          statusLabel: STATUS_LABELS[statusRaw] || statusRaw,
          createdAt: formatDateValue(request?.created_at),
        }
      }),
    [requests],
  )

  const filteredRows = useMemo(() => {
    const tab = requestTabs.find((item) => item.key === activeTab)
    if (!tab) {
      return rows
    }

    return rows.filter((item) => tab.statuses.includes(item.statusRaw))
  }, [rows, activeTab, requestTabs])

  const tabCounts = useMemo(() => {
    return requestTabs.reduce((acc, tab) => {
      acc[tab.key] = rows.filter((item) => tab.statuses.includes(item.statusRaw)).length
      return acc
    }, {})
  }, [rows, requestTabs])

  const openedCount = rows.filter((item) => !['completed', 'request_rejected', 'canceled'].includes(item.statusRaw)).length

  return (
    <>
      <Seo title="Request Center" description="Danh sách yêu cầu giữa user và mentor." />
      <section className="space-y-6">
        <SectionHeading eyebrow="Requests" title="Request Center" description="Quản lý yêu cầu theo dạng có cấu trúc, ưu tiên và trạng thái xử lý." />

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          <MetricCard label="Đang mở" value={String(openedCount)} icon={Send} />
          <MetricCard label="Hết hạn/Từ chối" value={String(rows.filter((item) => ['expired', 'request_rejected'].includes(item.statusRaw)).length)} icon={AlertTriangle} />
          <MetricCard label="Đã xử lý" value={String(rows.filter((item) => ['completed', 'canceled'].includes(item.statusRaw)).length)} icon={Check} />
        </div>

        <div className="flex justify-end">
          <Link to={ROUTES.USER_WIZARD}>
            <Button size="sm">
              <Plus size={14} aria-hidden="true" /> Tạo yêu cầu cho mentor
            </Button>
          </Link>
        </div>

        {error ? <p className="text-sm text-rose-600">{error}</p> : null}
        <div className="flex flex-wrap items-center gap-2 border-b border-slate-200 pb-3">
          {requestTabs.map((tab) => {
            const isActive = activeTab === tab.key
            return (
              <button
                key={tab.key}
                type="button"
                onClick={() => setActiveTab(tab.key)}
                className={`rounded-full border px-4 py-1.5 text-xs font-semibold transition ${isActive ? 'border-slate-900 bg-slate-900 text-white' : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'}`}
              >
                {tab.label} <span className="ml-1 text-[11px]">({tabCounts[tab.key] || 0})</span>
              </button>
            )
          })}
        </div>
        <Card className="divide-y divide-slate-200 p-0">
          {loading ? (
            <div className="p-4 text-sm text-slate-500">Đang tải yêu cầu...</div>
          ) : null}
          {!loading && filteredRows.length === 0 ? (
            <div className="p-4 text-sm text-slate-500">Chưa có yêu cầu nào.</div>
          ) : null}
          {filteredRows.map((request) => (
            <div key={request.id} className="grid gap-2 p-4 md:grid-cols-[1fr_170px_120px_120px] md:items-center">
              <div>
                <p className="text-sm font-semibold text-slate-900">{request.title}</p>
                <p className="text-xs text-slate-500">{request.id} • {request.type}</p>
              </div>
              <div>
                <Badge variant={['completed'].includes(request.statusRaw) ? 'success' : ['request_rejected', 'canceled', 'expired'].includes(request.statusRaw) ? 'danger' : 'warning'}>{request.statusLabel}</Badge>
              </div>
              <div>
                <Badge variant={request.statusRaw === 'negotiating' ? 'neutral' : 'warning'}>{request.statusRaw}</Badge>
              </div>
              <div className="flex items-center justify-between gap-3 md:justify-end">
                <span className="text-xs text-slate-500">{request.createdAt}</span>
                <Link className="text-sm font-semibold text-indigo-700 hover:text-indigo-800" to={`/u/requests/${request.id}`}>Chi tiết</Link>
              </div>
            </div>
          ))}
        </Card>
      </section>
    </>
  )
}
