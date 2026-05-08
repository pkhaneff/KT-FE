import { FolderKanban, Send, Wallet, Bookmark, Clock, Plus } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { MetricCard } from '../../../components/shared/MetricCard'
import { SectionHeading } from '../../../components/shared/SectionHeading'
import { Card } from '../../../components/ui/Card'
import { Badge } from '../../../components/ui/Badge'
import { Button } from '../../../components/ui/Button'
import { Seo } from '../../../core/seo/Seo'
import { ROUTES } from '../../../core/constants/routes'
import { useAuth } from '../../auth/hooks/useAuth'
import { listProjectRequests } from '../services/projectRequestApi'

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

const WAITING_STATUSES = new Set(['new', 'under_review', 'proposal_sent'])
const IN_PROGRESS_STATUSES = new Set(['negotiating', 'awaiting_prepayment', 'awaiting_provider_confirm', 'in_progress'])
const DONE_STATUSES = new Set(['completed'])
const REVIEW_STATUSES = new Set(['expired', 'rejected', 'canceled'])
const TERMINAL_STATUSES = new Set(['completed', 'expired', 'rejected', 'canceled'])

const STATUS_LABELS = {
  new: 'Mới tạo',
  under_review: 'Đang duyệt',
  proposal_sent: 'Đã gửi báo giá',
  negotiating: 'Đang thương lượng',
  awaiting_prepayment: 'Chờ thanh toán',
  awaiting_provider_confirm: 'Chờ xác nhận',
  in_progress: 'Đang làm',
  completed: 'Hoàn thành',
  expired: 'Hết hạn',
  rejected: 'Từ chối',
  canceled: 'Đã hủy',
}

function mapStatusKey(status) {
  if (WAITING_STATUSES.has(status)) {
    return 'waiting'
  }

  if (IN_PROGRESS_STATUSES.has(status)) {
    return 'in-progress'
  }

  if (DONE_STATUSES.has(status)) {
    return 'done'
  }

  if (REVIEW_STATUSES.has(status)) {
    return 'review'
  }

  return 'review'
}

function formatBudgetValue(budget) {
  if (typeof budget !== 'number' || Number.isNaN(budget)) {
    return 'Đang cập nhật ngân sách'
  }

  return `${budget.toLocaleString('vi-VN')}đ`
}

function formatDeadline(deadlineAt) {
  if (!deadlineAt) {
    return 'Đang cập nhật deadline'
  }

  const parsed = new Date(deadlineAt)
  if (Number.isNaN(parsed.getTime())) {
    return 'Đang cập nhật deadline'
  }

  return parsed.toLocaleDateString('vi-VN')
}

function normalizeProjectRequests(data = []) {
  if (!Array.isArray(data)) {
    return []
  }

  return data.map((item) => {
    const status = String(item?.status || 'new').toLowerCase()
    const statusKey = mapStatusKey(status)

    return {
      id: item?.id,
      title: item?.title || 'Yêu cầu dự án',
      budget: formatBudgetValue(item?.budget),
      deadline: formatDeadline(item?.deadline_at),
      statusRaw: status,
      status: STATUS_LABELS[status] || status,
      statusKey,
    }
  })
}

export function DashboardPage() {
  const { accessToken } = useAuth()
  const [filter, setFilter] = useState('all')
  const [projectRequests, setProjectRequests] = useState([])
  const [loadingRequests, setLoadingRequests] = useState(false)
  const [requestsError, setRequestsError] = useState('')

  useEffect(() => {
    let alive = true

    if (!accessToken) {
      setProjectRequests([])
      setRequestsError('')
      return () => {
        alive = false
      }
    }

    const fetchRequests = async () => {
      setLoadingRequests(true)
      setRequestsError('')

      try {
        const data = await listProjectRequests(accessToken)
        if (!alive) {
          return
        }
        setProjectRequests(normalizeProjectRequests(data))
      } catch (error) {
        if (!alive) {
          return
        }
        setProjectRequests([])
        setRequestsError(error?.message || 'Không tải được danh sách yêu cầu dự án.')
      } finally {
        if (alive) {
          setLoadingRequests(false)
        }
      }
    }

    fetchRequests()

    return () => {
      alive = false
    }
  }, [accessToken])

  const filteredOrders = useMemo(
    () => (filter === 'all' ? projectRequests : projectRequests.filter((order) => order.statusKey === filter)),
    [filter, projectRequests]
  )

  const inProgressCount = useMemo(
    () => projectRequests.filter((item) => item.statusKey === 'in-progress').length,
    [projectRequests]
  )

  const waitingCount = useMemo(
    () => projectRequests.filter((item) => item.statusKey === 'waiting').length,
    [projectRequests]
  )

  const openedCount = useMemo(
    () => projectRequests.filter((item) => !TERMINAL_STATUSES.has(item.statusRaw)).length,
    [projectRequests]
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
          <MetricCard label="Đơn đang làm" value={String(inProgressCount)} icon={FolderKanban} />
          <MetricCard label="Chờ báo giá" value={String(waitingCount)} icon={Clock} />
          <MetricCard label="Số dư ví" value="1.200.000đ" icon={Wallet} />
          <MetricCard label="Yêu cầu mở" value={String(openedCount)} icon={Send} />
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

            <Link to={ROUTES.USER_WIZARD}>
              <Button size="sm">
                <Plus size={14} aria-hidden="true" /> Tạo yêu cầu project
              </Button>
            </Link>
          </div>

          <Card className="divide-y divide-slate-200 p-0">
            {loadingRequests ? (
              <div className="p-8 text-center">
                <p className="text-sm font-semibold text-slate-900">Đang tải yêu cầu dự án...</p>
              </div>
            ) : requestsError ? (
              <div className="p-8 text-center">
                <p className="text-sm font-semibold text-slate-900">Không thể tải dữ liệu</p>
                <p className="mt-1 text-sm text-slate-500">{requestsError}</p>
              </div>
            ) : filteredOrders.length ? filteredOrders.map((order) => (
              <div key={order.id} className="grid gap-3 p-4 md:grid-cols-[1fr_170px] md:items-center">
                <div>
                  <div className="mb-1 flex flex-wrap items-center gap-2">
                    <span className="text-xs font-semibold text-slate-500">PRJ-REQ-{order.id}</span>
                    <Badge variant={STATUS_BADGE[order.statusKey] || 'neutral'}>{order.status}</Badge>
                  </div>
                  <p className="text-sm font-semibold text-slate-900">{order.title}</p>
                  <p className="text-xs text-slate-500">{order.budget} • Deadline {order.deadline}</p>
                </div>

                <div className="flex items-center justify-between gap-3 md:justify-end">
                  <Link to={ROUTES.USER_REQUESTS}>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="border border-slate-300 bg-white font-medium text-slate-800 hover:bg-slate-50 dark:border-slate-600 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800"
                    >
                      Xem yêu cầu
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
