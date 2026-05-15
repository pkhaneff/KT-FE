import { Card } from '../../../components/ui/Card'
import { Badge } from '../../../components/ui/Badge'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { useEffect, useMemo, useState } from 'react'
import { notification } from 'antd'
import { AlertTriangle, BookOpenText, FolderKanban, ReceiptText, ShieldAlert, UserCheck, Users } from 'lucide-react'
import { ROUTES } from '../../../core/constants/routes'
import { useAuth } from '../../auth/hooks/useAuth'
import { listAdminUsers, updateAdminUser } from '../services/adminUserApi'
import {
  adminRejectRequest,
  adminSendProposal,
  adminSendProposalMessage,
  listAdminProjectRequests,
  listAdminProposalMessages,
  adminApproveCounterProposal,
  adminRejectCounterProposal,
  listAdminProposals,
  getAdminProjectRequestDetail,
} from '../services/adminProjectRequestApi'
import { adminListOrders, adminUpdateOrderStatus } from '../services/adminOrderApi'

const DASHBOARD_STATS = [
  { label: 'Người dùng', value: '3.2k', icon: Users, to: ROUTES.ADMIN_USERS },
  { label: 'Mentor', value: '342', icon: UserCheck, to: ROUTES.ADMIN_MENTORS },
  { label: 'Đơn hàng', value: '128', icon: ReceiptText, to: ROUTES.ADMIN_ORDERS },
  { label: 'Request cần duyệt', value: '12', icon: ShieldAlert, tone: 'warn', to: ROUTES.ADMIN_CONTENT },
  { label: 'Bài chờ duyệt', value: '7', icon: BookOpenText, tone: 'cyan', to: ROUTES.ADMIN_POSTS },
]

const MENTORS = [
  { id: 'MTR-401', name: 'Trần Quang Khải', major: 'AI/ML', level: 'Verified' },
  { id: 'MTR-329', name: 'Phạm Nhật Quân', major: 'IoT', level: 'Pending' },
  { id: 'MTR-288', name: 'Vũ Mạnh Khang', major: 'Web', level: 'Verified' },
]

const ORDERS = [
  { id: 'ORD-9001', owner: 'Nguyễn Minh Anh', mentor: 'Trần Quang Khải', amount: '5,200,000đ', status: 'in_progress' },
  { id: 'ORD-8980', owner: 'Lê Gia Bảo', mentor: 'Phạm Nhật Quân', amount: '3,700,000đ', status: 'pending' },
  { id: 'ORD-8963', owner: 'Hoàng Thanh Tùng', mentor: 'Vũ Mạnh Khang', amount: '6,000,000đ', status: 'done' },
]

const POSTS = [
  { id: 'POST-510', title: 'Roadmap làm đồ án IoT từ A-Z', author: 'Admin Team', state: 'published' },
  { id: 'POST-506', title: 'Checklist bảo vệ đồ án tốt nghiệp', author: 'Mentor Khải', state: 'review' },
  { id: 'POST-497', title: 'Cách viết báo cáo machine learning', author: 'Mentor Khang', state: 'draft' },
]

const RISK_ITEMS = [
  { id: 'RISK-71', title: 'Đơn ORD-8980 có dấu hiệu chậm milestone', level: 'Cao', source: 'Progress monitor' },
  { id: 'RISK-65', title: '2 báo cáo nội dung cần admin xác nhận', level: 'Trung bình', source: 'Content moderation' },
  { id: 'RISK-58', title: 'Mentor MTR-329 có khiếu nại mới', level: 'Cao', source: 'Trust & safety' },
]

const REQUEST_STATUS_LABELS = {
  pending_review: 'Mới tạo',
  under_review: 'Đang duyệt',
  proposal_sent: 'Đã gửi báo giá',
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

const REQUEST_STATUS_VARIANTS = {
  pending_review: 'warning',
  under_review: 'warning',
  proposal_sent: 'warning',
  negotiating: 'neutral',
  proposal_approved: 'success',
  contract_sent: 'success',
  waiting_deposit: 'warning',
  project_approved: 'success',
  in_progress: 'success',
  completed: 'success',
  expired: 'danger',
  request_rejected: 'danger',
  canceled: 'danger',
}

function StatusBadge({ status }) {
  if (status === 'active' || status === 'done' || status === 'published' || status === 'Verified' || status === 'verified') return <Badge variant="success">{status}</Badge>
  if (status === 'blocked') return <Badge variant="danger">{status}</Badge>
  if (status === 'pending' || status === 'review' || status === 'Pending' || status === 'unverified') return <Badge variant="warning">{status}</Badge>
  return <Badge>{status}</Badge>
}

function formatCurrencyValue(value) {
  if (typeof value !== 'number' || Number.isNaN(value)) {
    return 'Đang cập nhật'
  }

  return `${value.toLocaleString('vi-VN')}đ`
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

function shortenId(value) {
  if (!value) {
    return '-'
  }

  const text = String(value)
  if (text.length <= 14) {
    return text
  }

  return `${text.slice(0, 8)}...${text.slice(-4)}`
}

function normalizeAdminProjectRequests(data = []) {
  if (!Array.isArray(data)) {
    return []
  }

  return data.map((item) => {
    const rawStatus = String(item?.status || 'pending_review').toLowerCase()
    return {
      id: item?.id,
      userId: item?.user_id,
      title: item?.title || 'Yêu cầu dự án',
      type: item?.type || '---',
      budget: formatCurrencyValue(item?.budget),
      deadline: formatDateValue(item?.deadline_at),
      createdAt: formatDateValue(item?.created_at),
      statusRaw: rawStatus,
      statusLabel: REQUEST_STATUS_LABELS[rawStatus] || rawStatus,
    }
  })
}

function DataTable({ columns, rows, emptyText = 'Không có dữ liệu.' }) {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full text-left text-sm">
        <thead>
          <tr className="border-b border-slate-200 text-xs uppercase tracking-[0.08em] text-slate-500 dark:border-slate-700 dark:text-slate-400">
            {columns.map((column) => (
              <th key={column.key} className="px-3 py-3 font-semibold">{column.label}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {!rows.length ? (
            <tr>
              <td colSpan={columns.length} className="px-3 py-6 text-center text-sm text-slate-500 dark:text-slate-400">
                {emptyText}
              </td>
            </tr>
          ) : null}
          {rows.map((row) => (
            <tr key={row.id} className="border-b border-slate-100 dark:border-slate-800">
              {columns.map((column) => (
                <td key={column.key} className="px-3 py-3 text-slate-700 dark:text-slate-200">
                  {column.render ? column.render(row[column.key], row) : row[column.key]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

function MiniStat({ label, value, icon: Icon, tone = 'default', to }) {
  const toneClass = tone === 'warn'
    ? 'border-amber-200 bg-amber-50 hover:bg-amber-100 dark:border-amber-900/70 dark:bg-amber-950/30 dark:hover:bg-amber-950/50'
    : tone === 'cyan'
      ? 'border-cyan-200 bg-cyan-50 hover:bg-cyan-100 dark:border-cyan-900/70 dark:bg-cyan-950/30 dark:hover:bg-cyan-950/50'
      : 'border-slate-200 bg-white hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:hover:bg-slate-700/70'

  return (
    <Link to={to} className={`rounded-2xl border p-4 transition-colors ${toneClass}`}>
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs uppercase tracking-[0.08em] text-slate-500 dark:text-slate-400">{label}</p>
          <p className="mt-2 text-2xl font-bold text-slate-900 dark:text-white">{value}</p>
        </div>
        <div className="grid h-9 w-9 place-items-center rounded-lg bg-slate-900/5 text-slate-700 dark:bg-white/10 dark:text-slate-200">
          <Icon size={17} />
        </div>
      </div>
    </Link>
  )
}

function AdminQuickTable() {
  return (
    <Card>
      <div className="mb-3 flex items-center justify-between gap-3">
        <p className="text-sm font-semibold text-slate-900 dark:text-white">Đơn mới</p>
        <Link to={ROUTES.ADMIN_ORDERS} className="text-xs font-semibold text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 dark:hover:text-indigo-300">
          Xem tất cả
        </Link>
      </div>
      <DataTable
        columns={[
          { key: 'id', label: 'Mã đơn' },
          { key: 'owner', label: 'Người dùng' },
          { key: 'mentor', label: 'Mentor' },
          { key: 'status', label: 'Trạng thái', render: (value) => <StatusBadge status={value} /> },
        ]}
        rows={ORDERS.slice(0, 4)}
      />
    </Card>
  )
}

function AdminRiskPanel() {
  return (
    <Card>
      <div className="mb-3 flex items-center gap-2">
        <AlertTriangle size={16} className="text-amber-500" />
        <p className="text-sm font-semibold text-slate-900 dark:text-white">Risk Monitor</p>
      </div>
      <div className="space-y-2">
        {RISK_ITEMS.map((item) => (
          <article key={item.id} className="rounded-xl border border-slate-200 bg-slate-50 p-3 dark:border-slate-700 dark:bg-slate-900/70">
            <p className="text-sm font-medium text-slate-800 dark:text-slate-100">{item.title}</p>
            <div className="mt-2 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
              <span>{item.source}</span>
              <Badge variant={item.level === 'Cao' ? 'danger' : 'warning'}>{item.level}</Badge>
            </div>
          </article>
        ))}
      </div>
      <Link to={ROUTES.ADMIN_CONTENT} className="mt-3 inline-flex items-center gap-2 text-xs font-semibold text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 dark:hover:text-indigo-300">
        <FolderKanban size={14} />
        Mở moderation queue
      </Link>
    </Card>
  )
}

export function AdminDashboardPage() {
  return (
    <section className="space-y-4">
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-5">
        {DASHBOARD_STATS.map((stat) => (
          <MiniStat key={stat.label} {...stat} />
        ))}
      </div>
      <div className="grid grid-cols-1 gap-4 xl:grid-cols-[1.4fr_1fr]">
        <AdminQuickTable />
        <AdminRiskPanel />
      </div>
    </section>
  )
}

export function AdminUsersPage() {
  const { accessToken } = useAuth()
  const [users, setUsers] = useState([])
  const [drafts, setDrafts] = useState({})
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [savingIds, setSavingIds] = useState([])

  useEffect(() => {
    let cancelled = false

    async function fetchUsers() {
      if (!accessToken) {
        setUsers([])
        setLoading(false)
        return
      }

      setLoading(true)
      setError('')
      try {
        const data = await listAdminUsers(accessToken)
        if (!cancelled) {
          setUsers(Array.isArray(data) ? data : [])
          setDrafts({})
        }
      } catch (err) {
        if (!cancelled) {
          setError(err.message || 'Không tải được danh sách user.')
        }
      } finally {
        if (!cancelled) {
          setLoading(false)
        }
      }
    }

    fetchUsers()

    return () => {
      cancelled = true
    }
  }, [accessToken])

  const rows = useMemo(() => users.map((user) => {
    const draft = drafts[user.id]
    const nextStatusAction = (draft?.status ?? user.status) === 'blocked' ? 'unblocked' : 'blocked'
    return {
      ...user,
      name: user.full_name,
      editableRole: draft?.role ?? user.role,
      editableStatus: draft?.status ?? user.status,
      nextStatusAction,
    }
  }), [users, drafts])

  function updateDraft(userId, field, value) {
    setDrafts((prev) => ({
      ...prev,
      [userId]: {
        role: prev[userId]?.role ?? users.find((item) => item.id === userId)?.role,
        status: prev[userId]?.status ?? users.find((item) => item.id === userId)?.status,
        [field]: value,
      },
    }))
  }

  async function handleSaveUser(userId) {
    if (!accessToken) {
      return
    }

    const origin = users.find((item) => item.id === userId)
    const draft = drafts[userId]
    if (!origin || !draft) {
      return
    }

    const payload = {}
    if (draft.role !== origin.role) {
      payload.role = draft.role
    }
    if (draft.status !== origin.status) {
      payload.status = draft.status
    }

    if (!Object.keys(payload).length) {
      return
    }

    setSavingIds((prev) => [...prev, userId])
    setError('')
    try {
      const updated = await updateAdminUser(accessToken, userId, payload)
      setUsers((prev) => prev.map((item) => (item.id === userId ? updated : item)))
      setDrafts((prev) => {
        const next = { ...prev }
        delete next[userId]
        return next
      })
    } catch (err) {
      setError(err.message || 'Cập nhật user thất bại.')
    } finally {
      setSavingIds((prev) => prev.filter((id) => id !== userId))
    }
  }

  if (loading) {
    return (
      <Card>
        <h1 className="mb-3 text-xl font-bold text-slate-900 dark:text-white">Quản lý người dùng</h1>
        <p className="text-sm text-slate-600 dark:text-slate-300">Đang tải dữ liệu...</p>
      </Card>
    )
  }

  return (
    <Card>
      <h1 className="mb-3 text-xl font-bold text-slate-900 dark:text-white">Quản lý người dùng</h1>
      {error ? <p className="mb-3 text-sm text-rose-600 dark:text-rose-400">{error}</p> : null}
      <DataTable
        columns={[
          { key: 'id', label: 'Mã' },
          { key: 'name', label: 'Tên' },
          { key: 'email', label: 'Email' },
          {
            key: 'editableRole',
            label: 'Vai trò',
            render: (value, row) => (
              <select
                value={value}
                onChange={(event) => updateDraft(row.id, 'role', event.target.value)}
                className="rounded-lg border border-slate-300 bg-white px-2 py-1 text-xs text-slate-800 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100"
              >
                <option value="user">user</option>
                <option value="mentor">mentor</option>
                <option value="admin">admin</option>
              </select>
            ),
          },
          {
            key: 'editableStatus',
            label: 'Trạng thái',
            render: (value) => <StatusBadge status={value} />,
          },
          {
            key: 'actions',
            label: 'Thao tác',
            render: (_, row) => {
              const hasDraft = Boolean(drafts[row.id])
              const isSaving = savingIds.includes(row.id)
              const actionLabel = row.nextStatusAction === 'blocked' ? 'Block' : 'Unblock'
              return (
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => updateDraft(row.id, 'status', row.nextStatusAction)}
                    className="rounded-lg border border-slate-300 bg-white px-3 py-1 text-xs font-semibold text-slate-800 hover:bg-slate-100 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100 dark:hover:bg-slate-700"
                  >
                    {actionLabel}
                  </button>
                  <button
                    type="button"
                    onClick={() => handleSaveUser(row.id)}
                    disabled={!hasDraft || isSaving}
                    className="rounded-lg bg-slate-900 px-3 py-1 text-xs font-semibold text-white disabled:cursor-not-allowed disabled:opacity-50 dark:bg-white dark:text-slate-900"
                  >
                    {isSaving ? 'Đang lưu...' : 'Lưu'}
                  </button>
                </div>
              )
            },
          },
        ]}
        rows={rows}
        emptyText="Chưa có user."
      />
    </Card>
  )
}

export function AdminMentorsPage() {
  return (
    <Card>
      <h1 className="mb-3 text-xl font-bold text-slate-900 dark:text-white">Quản lý mentor</h1>
      <DataTable
        columns={[
          { key: 'id', label: 'Mã' },
          { key: 'name', label: 'Tên mentor' },
          { key: 'major', label: 'Chuyên môn' },
          { key: 'level', label: 'Xác minh', render: (value) => <StatusBadge status={value} /> },
        ]}
        rows={MENTORS}
      />
    </Card>
  )
}

export function AdminOrdersPage() {
  const { accessToken } = useAuth()
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [actionLoadingIds, setActionLoadingIds] = useState([])

  useEffect(() => {
    let cancelled = false

    async function fetchOrders() {
      if (!accessToken) {
        setOrders([])
        setLoading(false)
        return
      }

      setLoading(true)
      setError('')
      try {
        const data = await adminListOrders(accessToken)
        if (!cancelled) {
          setOrders(Array.isArray(data) ? data : [])
        }
      } catch (err) {
        if (!cancelled) {
          setOrders([])
          setError(err.message || 'Không tải được danh sách đơn hàng.')
        }
      } finally {
        if (!cancelled) {
          setLoading(false)
        }
      }
    }

    fetchOrders()

    return () => {
      cancelled = true
    }
  }, [accessToken])

  async function handleUpdateStatus(orderId, newStatus) {
    if (!accessToken) return

    setActionLoadingIds((prev) => [...prev, orderId])
    setError('')
    try {
      const updated = await adminUpdateOrderStatus(accessToken, orderId, newStatus)
      setOrders((prev) => prev.map((item) => (item.id === orderId ? updated : item)))
    } catch (err) {
      setError(err.message || 'Cập nhật trạng thái thất bại.')
    } finally {
      setActionLoadingIds((prev) => prev.filter((id) => id !== orderId))
    }
  }

  const ORDER_STATUS_LABELS = {
    pending: 'Chờ thanh toán',
    paid: 'Đã thanh toán',
    failed: 'Thất bại',
    canceled: 'Đã hủy',
    refunded: 'Đã hoàn tiền',
  }

  const ORDER_STATUS_VARIANTS = {
    pending: 'warning',
    paid: 'success',
    failed: 'danger',
    canceled: 'danger',
    refunded: 'neutral',
  }

  const formatMoney = (value) => `${(value || 0).toLocaleString('vi-VN')}đ`

  function formatDate(value) {
    if (!value) return 'Đang cập nhật'
    const parsed = new Date(value)
    if (Number.isNaN(parsed.getTime())) return 'Đang cập nhật'
    return parsed.toLocaleDateString('vi-VN')
  }

  if (loading) {
    return (
      <Card>
        <h1 className="mb-3 text-xl font-bold text-slate-900 dark:text-white">Quản lý đơn hàng</h1>
        <p className="text-sm text-slate-600 dark:text-slate-300">Đang tải dữ liệu...</p>
      </Card>
    )
  }

  return (
    <Card>
      <h1 className="mb-3 text-xl font-bold text-slate-900 dark:text-white">Quản lý đơn hàng</h1>
      {error ? <p className="mb-3 text-sm text-rose-600 dark:text-rose-400">{error}</p> : null}
      <DataTable
        columns={[
          { key: 'id', label: 'Mã đơn', render: (value) => value.slice(0, 8) },
          { key: 'user_id', label: 'Người dùng', render: (value) => value.slice(0, 8) },
          { key: 'amount', label: 'Tổng tiền', render: (value) => formatMoney(value) },
          { key: 'status', label: 'Trạng thái', render: (value) => (
            <Badge variant={ORDER_STATUS_VARIANTS[value] || 'neutral'}>{ORDER_STATUS_LABELS[value] || value}</Badge>
          )},
          { key: 'created_at', label: 'Ngày tạo', render: (value) => formatDate(value) },
          {
            key: 'actions',
            label: 'Thao tác',
            render: (_, row) => {
              const isLoading = actionLoadingIds.includes(row.id)
              return (
                <select
                  value={row.status}
                  onChange={(e) => handleUpdateStatus(row.id, e.target.value)}
                  disabled={isLoading}
                  className="rounded-lg border border-slate-300 bg-white px-2 py-1 text-xs disabled:opacity-50 dark:border-slate-600 dark:bg-slate-800"
                >
                  <option value="pending">Chờ thanh toán</option>
                  <option value="paid">Đã thanh toán</option>
                  <option value="failed">Thất bại</option>
                  <option value="canceled">Đã hủy</option>
                  <option value="refunded">Đã hoàn tiền</option>
                </select>
              )
            },
          },
        ]}
        rows={orders}
        emptyText="Chưa có đơn hàng."
      />
    </Card>
  )
}

export function AdminProjectRequestsPage() {
  const navigate = useNavigate()
  const { accessToken } = useAuth()
  const [notificationApi, notificationContext] = notification.useNotification()
  const [requests, setRequests] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [actionLoadingIds, setActionLoadingIds] = useState([])
  const [activeTab, setActiveTab] = useState('new')
  const [showRejectModal, setShowRejectModal] = useState(false)
  const [rejectRequestId, setRejectRequestId] = useState('')
  const [rejectReason, setRejectReason] = useState('')

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

    async function fetchRequests() {
      if (!accessToken) {
        setRequests([])
        setLoading(false)
        return
      }

      setLoading(true)
      setError('')
      try {
        const data = await listAdminProjectRequests(accessToken)
        if (!cancelled) {
          setRequests(normalizeAdminProjectRequests(data))
        }
      } catch (err) {
        if (!cancelled) {
          setRequests([])
          setError(err.message || 'Không tải được danh sách yêu cầu dự án.')
        }
      } finally {
        if (!cancelled) {
          setLoading(false)
        }
      }
    }

    fetchRequests()

    return () => {
      cancelled = true
    }
  }, [accessToken])

  function handleReject(requestId) {
    if (!accessToken) {
      return
    }

    setRejectRequestId(requestId)
    setRejectReason('')
    setShowRejectModal(true)
  }

  async function handleConfirmReject() {
    if (!accessToken || !rejectRequestId) {
      return
    }

    if (!rejectReason.trim()) {
      setError('Vui long nhap ly do tu choi.')
      return
    }

    setActionLoadingIds((prev) => [...prev, rejectRequestId])
    setError('')
    try {
      const updated = await adminRejectRequest(accessToken, rejectRequestId, rejectReason.trim())
      setRequests((prev) => prev.map((item) => (item.id === rejectRequestId ? normalizeAdminProjectRequests([updated])[0] : item)))
      notificationApi.success({
        message: 'Tu choi yeu cau thanh cong',
        description: 'Ly do tu choi da duoc gui den user.',
        placement: 'topRight',
        duration: 3,
      })
      setShowRejectModal(false)
      setRejectRequestId('')
      setRejectReason('')
    } catch (err) {
      setError(err.message || 'Tu choi yeu cau that bai.')
      notificationApi.error({
        message: 'Tu choi yeu cau that bai',
        description: err.message || 'Vui long thu lai.',
        placement: 'topRight',
        duration: 3,
      })
    } finally {
      setActionLoadingIds((prev) => prev.filter((id) => id !== rejectRequestId))
    }
  }

  function handleRespond(requestId) {
    navigate(`/admin/project-requests/${requestId}`)
  }

  if (loading) {
    return (
      <Card>
        <h1 className="mb-3 text-xl font-bold text-slate-900 dark:text-white">Yêu cầu dự án</h1>
        <p className="text-sm text-slate-600 dark:text-slate-300">Đang tải dữ liệu...</p>
      </Card>
    )
  }

  const filteredRequests = requests.filter((item) => {
    const tab = requestTabs.find((entry) => entry.key === activeTab)
    if (!tab) {
      return true
    }

    return tab.statuses.includes(item.statusRaw)
  })

  const tabCounts = requestTabs.reduce((acc, tab) => {
    acc[tab.key] = requests.filter((item) => tab.statuses.includes(item.statusRaw)).length
    return acc
  }, {})

  return (
    <Card>
      {notificationContext}
      <h1 className="mb-3 text-xl font-bold text-slate-900 dark:text-white">Yêu cầu dự án</h1>
      {error ? <p className="mb-3 text-sm text-rose-600 dark:text-rose-400">{error}</p> : null}
      <div className="mb-4 flex flex-wrap items-center gap-2 border-b border-slate-200 pb-3 dark:border-slate-700">
        {requestTabs.map((tab) => {
          const isActive = activeTab === tab.key
          return (
            <button
              key={tab.key}
              type="button"
              onClick={() => setActiveTab(tab.key)}
              className={`rounded-full border px-4 py-1.5 text-xs font-semibold transition ${isActive ? 'border-slate-900 bg-slate-900 text-white dark:border-white dark:bg-white dark:text-slate-900' : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300'}`}
            >
              {tab.label} <span className="ml-1 text-[11px]">({tabCounts[tab.key] || 0})</span>
            </button>
          )
        })}
      </div>
      <DataTable
        columns={[
          { key: 'id', label: 'Mã yêu cầu', render: (value) => shortenId(value) },
          { key: 'title', label: 'Tiêu đề' },
          { key: 'type', label: 'Loại' },
          { key: 'budget', label: 'Ngân sách' },
          { key: 'deadline', label: 'Deadline' },
          {
            key: 'statusLabel',
            label: 'Trạng thái',
            render: (_, row) => (
              <Badge variant={REQUEST_STATUS_VARIANTS[row.statusRaw] || 'neutral'}>{row.statusLabel}</Badge>
            ),
          },
          { key: 'createdAt', label: 'Tạo lúc' },
          {
            key: 'actions',
            label: 'Thao tác',
            render: (_, row) => {
              const isLoading = actionLoadingIds.includes(row.id)
              return (
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => handleReject(row.id)}
                    disabled={isLoading}
                    className="rounded-lg border border-rose-200 bg-rose-50 px-3 py-1 text-xs font-semibold text-rose-700 hover:bg-rose-100 disabled:cursor-not-allowed disabled:opacity-60 dark:border-rose-900/50 dark:bg-rose-950/40 dark:text-rose-300"
                  >
                    Reject
                  </button>
                  <button
                    type="button"
                    onClick={() => handleRespond(row.id)}
                    disabled={isLoading}
                    className="rounded-lg border border-slate-200 bg-white px-3 py-1 text-xs font-semibold text-slate-700 hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-60 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200"
                  >
                    Phan hoi
                  </button>
                </div>
              )
            },
          },
        ]}
        rows={filteredRequests}
        emptyText="Chưa có yêu cầu dự án."
      />
      {showRejectModal ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <Card className="w-full max-w-md p-6">
            <h3 className="mb-4 text-lg font-bold text-slate-900">Tu choi yeu cau</h3>
            <textarea
              value={rejectReason}
              onChange={(event) => setRejectReason(event.target.value)}
              rows={4}
              placeholder="Nhap ly do tu choi..."
              className="mb-4 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm"
            />
            <div className="flex justify-end gap-3">
              <button
                type="button"
                onClick={() => {
                  setShowRejectModal(false)
                  setRejectRequestId('')
                  setRejectReason('')
                }}
                className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-700"
              >
                Huy
              </button>
              <button
                type="button"
                onClick={handleConfirmReject}
                disabled={!rejectReason.trim() || actionLoadingIds.includes(rejectRequestId)}
                className="rounded-lg bg-rose-600 px-3 py-2 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-60"
              >
                {actionLoadingIds.includes(rejectRequestId) ? 'Dang xu ly...' : 'Xac nhan tu choi'}
              </button>
            </div>
          </Card>
        </div>
      ) : null}
    </Card>
  )
}

export function AdminProjectRequestDetailPage() {
  const { requestId } = useParams()
  const { accessToken } = useAuth()
  const [notificationApi, notificationContext] = notification.useNotification()
  const [requests, setRequests] = useState([])
  const [mode, setMode] = useState('create') // 'create', 'chat', or 'review-counter'
  const [proposalId, setProposalId] = useState('')
  const [requestDetail, setRequestDetail] = useState(null)
  const [messages, setMessages] = useState([])
  const [messageDraft, setMessageDraft] = useState('')
  const [requestProposals, setRequestProposals] = useState([])
  const [proposalsLoading, setProposalsLoading] = useState(false)
  
  // Proposal creation form state
  const [proposalTitle, setProposalTitle] = useState('')
  const [proposalDescription, setProposalDescription] = useState('')
  const [proposalNote, setProposalNote] = useState('')
  const [phases, setPhases] = useState([{ title: '', description: '', estimatedDays: '', estimatedCost: '' }])

  // Calculate total cost and total days from phases
  const totalCost = useMemo(() => {
    return phases.reduce((sum, phase) => {
      const cost = parseFloat(phase.estimatedCost) || 0
      return sum + cost
    }, 0)
  }, [phases])

  const totalDays = useMemo(() => {
    return phases.reduce((sum, phase) => {
      const days = parseInt(phase.estimatedDays) || 0
      return sum + days
    }, 0)
  }, [phases])
  
  const [loading, setLoading] = useState(true)
  const [threadLoading, setThreadLoading] = useState(false)
  const [sending, setSending] = useState(false)
  const [error, setError] = useState('')

  const selectedRequest = useMemo(
    () => requests.find((item) => String(item.id) === String(requestId)) || null,
    [requests, requestId],
  )

  const currentRequest = useMemo(() => requestDetail || selectedRequest, [requestDetail, selectedRequest])

  const latestProposal = useMemo(() => {
    if (!requestProposals.length) {
      return null
    }

    const sorted = [...requestProposals].sort((a, b) => {
      const versionA = typeof a?.version === 'number' ? a.version : 0
      const versionB = typeof b?.version === 'number' ? b.version : 0
      if (versionA !== versionB) {
        return versionA - versionB
      }
      const timeA = new Date(a?.created_at || 0).getTime()
      const timeB = new Date(b?.created_at || 0).getTime()
      return timeA - timeB
    })

    return sorted[sorted.length - 1]
  }, [requestProposals])

  const canSendProposal = useMemo(() => {
    const status = String(currentRequest?.status || '').toLowerCase()
    const canReview = status === 'pending_review' || status === 'under_review'
    return canReview && requestProposals.length === 0
  }, [currentRequest, requestProposals])

  useEffect(() => {
    let cancelled = false

    async function loadRequestDetail() {
      if (!accessToken || !requestId) {
        if (!cancelled) {
          setRequestDetail(null)
          setRequestProposals([])
        }
        return
      }

      setProposalsLoading(true)
      setError('')
      try {
        const data = await getAdminProjectRequestDetail(accessToken, requestId)
        if (!cancelled) {
          setRequestDetail(data || null)
          const proposals = Array.isArray(data?.proposals) ? data.proposals : []
          setRequestProposals(proposals)
        }
      } catch (err) {
        if (!cancelled) {
          setRequestDetail(null)
          setRequestProposals([])
          setError(err.message || 'Khong tai duoc thong tin request.')
        }
      } finally {
        if (!cancelled) {
          setProposalsLoading(false)
        }
      }
    }

    loadRequestDetail()

    return () => {
      cancelled = true
    }
  }, [accessToken, requestId])

  useEffect(() => {
    if (!latestProposal) {
      setProposalId('')
      return
    }

    if (!proposalId || !requestProposals.some((item) => String(item.id) === String(proposalId))) {
      setProposalId(String(latestProposal.id))
    }
  }, [latestProposal, proposalId, requestProposals])

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
        const data = await listAdminProjectRequests(accessToken)
        if (!cancelled) {
          setRequests(Array.isArray(data) ? data : [])
        }
      } catch (err) {
        if (!cancelled) {
          setRequests([])
          setError(err.message || 'Khong tai duoc thong tin yeu cau.')
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

  useEffect(() => {
    let cancelled = false

    async function loadThread() {
      if (!accessToken || !requestId || !proposalId.trim()) {
        setMessages([])
        return
      }

      setThreadLoading(true)
      setError('')
      try {
        const data = await listAdminProposalMessages(accessToken, requestId, proposalId.trim())
        if (!cancelled) {
          setMessages(Array.isArray(data) ? data : [])
        }
      } catch (err) {
        if (!cancelled) {
          setMessages([])
          setError(err.message || 'Khong tai duoc phan hoi proposal.')
        }
      } finally {
        if (!cancelled) {
          setThreadLoading(false)
        }
      }
    }

    loadThread()

    return () => {
      cancelled = true
    }
  }, [accessToken, requestId, proposalId])

  useEffect(() => {
    let cancelled = false

    async function loadProposals() {
      if (!accessToken || !requestId || mode !== 'review-counter') {
        return
      }

      setProposalsLoading(true)
      setError('')
      try {
        if (requestProposals.length > 0) {
          return
        }

        try {
          const data = await listAdminProposals(accessToken, requestId)
          if (!cancelled) {
            setRequestProposals(Array.isArray(data) ? data : [])
          }
        } catch (fallbackErr) {
          if (!cancelled) {
            setRequestProposals([])
            setError('Khong tai duoc danh sach proposals. Vui long thu lai.')
          }
        }
      } catch (err) {
        if (!cancelled) {
          setError(err.message || 'Không tải được thông tin request.')
        }
      } finally {
        if (!cancelled) {
          setProposalsLoading(false)
        }
      }
    }

    loadProposals()

    return () => {
      cancelled = true
    }
  }, [accessToken, requestId, mode])

  async function handleSendMessage() {
    if (!accessToken || !requestId || !proposalId.trim() || !messageDraft.trim() || sending) {
      return
    }

    setSending(true)
    setError('')
    try {
      const created = await adminSendProposalMessage(accessToken, requestId, proposalId.trim(), messageDraft.trim())
      setMessages((prev) => [...prev, created])
      setMessageDraft('')
      notificationApi.success({
        message: 'Gui phan hoi thanh cong',
        description: 'Phan hoi da duoc gui den user.',
        placement: 'topRight',
        duration: 3,
      })
    } catch (err) {
      setError(err.message || 'Gui phan hoi that bai.')
      notificationApi.error({
        message: 'Gui phan hoi that bai',
        description: err.message || 'Vui long thu lai.',
        placement: 'topRight',
        duration: 3,
      })
    } finally {
      setSending(false)
    }
  }

  async function handleSendProposal() {
    if (!accessToken || !requestId || sending) {
      return
    }

    if (!canSendProposal) {
      setError('Proposal da duoc gui truoc do. Admin chi duoc gui 1 lan.')
      return
    }

    if (!proposalTitle.trim() || !proposalDescription.trim()) {
      setError('Vui long nhap day du thong tin proposal.')
      return
    }

    const validPhases = phases.filter(p => p.title.trim() && p.estimatedDays && p.estimatedCost)
    if (validPhases.length === 0) {
      setError('Vui long nhap it nhat 1 phase.')
      return
    }

    if (totalCost <= 0 || totalDays <= 0) {
      setError('Tong chi phi va thoi gian phai lon hon 0.')
      return
    }

    setSending(true)
    setError('')
    try {
      const proposalData = {
        title: proposalTitle.trim(),
        description: proposalDescription.trim(),
        cost: totalCost,
        total_days_min: totalDays,
        total_days_max: totalDays,
        note: proposalNote.trim() || null,
        phases: validPhases.map((p, index) => ({
          title: p.title.trim(),
          description: p.description.trim() || null,
          estimated_days: parseInt(p.estimatedDays),
          estimated_cost: parseFloat(p.estimatedCost),
          sort_order: index,
        })),
      }
      const created = await adminSendProposal(accessToken, requestId, proposalData)
      setError('')
      notificationApi.success({
        message: 'Gui proposal thanh cong',
        description: 'De xuat da duoc gui den user.',
        placement: 'topRight',
        duration: 3,
      })
      setProposalTitle('')
      setProposalDescription('')
      setProposalNote('')
      setPhases([{ title: '', description: '', estimatedDays: '', estimatedCost: '' }])
      const data = await getAdminProjectRequestDetail(accessToken, requestId)
      setRequestDetail(data || null)
      setRequestProposals(Array.isArray(data?.proposals) ? data.proposals : [])
    } catch (err) {
      setError(err.message || 'Gui proposal that bai.')
      notificationApi.error({
        message: 'Gui proposal that bai',
        description: err.message || 'Vui long thu lai.',
        placement: 'topRight',
        duration: 3,
      })
    } finally {
      setSending(false)
    }
  }

  async function handleApproveCounterProposal(proposalId) {
    if (!accessToken || !requestId || sending) {
      return
    }

    if (!confirm('Bạn có chắc muốn duyệt đề xuất phản đối này và gửi yêu cầu thanh toán cọc cho user?')) {
      return
    }

    setSending(true)
    setError('')
    try {
      const result = await adminApproveCounterProposal(accessToken, requestId, proposalId)
      setError('')
      notificationApi.success({
        message: 'Duyet proposal thanh cong',
        description: 'Da gui yeu cau dat coc cho user.',
        placement: 'topRight',
        duration: 3,
      })
      // Refresh requests to update status
      const data = await listAdminProjectRequests(accessToken)
      setRequests(Array.isArray(data) ? data : [])
      const detail = await getAdminProjectRequestDetail(accessToken, requestId)
      setRequestDetail(detail || null)
      setRequestProposals(Array.isArray(detail?.proposals) ? detail.proposals : [])
    } catch (err) {
      setError(err.message || 'Duyệt đề xuất thất bại.')
      notificationApi.error({
        message: 'Duyet proposal that bai',
        description: err.message || 'Vui long thu lai.',
        placement: 'topRight',
        duration: 3,
      })
    } finally {
      setSending(false)
    }
  }

  async function handleRejectCounterProposal(proposalId) {
    if (!accessToken || !requestId || sending) {
      return
    }

    const reason = window.prompt('Nhập lý do từ chối đề xuất phản đối:')
    if (reason === null) {
      return
    }
    if (!reason.trim()) {
      setError('Vui lòng nhập lý do từ chối.')
      return
    }

    setSending(true)
    setError('')
    try {
      const updated = await adminRejectCounterProposal(accessToken, requestId, proposalId, reason.trim())
      setError('')
      notificationApi.success({
        message: 'Da tu choi proposal',
        description: 'Ly do tu choi da duoc gui den user.',
        placement: 'topRight',
        duration: 3,
      })
      // Refresh requests to update status
      const data = await listAdminProjectRequests(accessToken)
      setRequests(Array.isArray(data) ? data : [])
      const detail = await getAdminProjectRequestDetail(accessToken, requestId)
      setRequestDetail(detail || null)
      setRequestProposals(Array.isArray(detail?.proposals) ? detail.proposals : [])
    } catch (err) {
      setError(err.message || 'Từ chối đề xuất thất bại.')
      notificationApi.error({
        message: 'Tu choi proposal that bai',
        description: err.message || 'Vui long thu lai.',
        placement: 'topRight',
        duration: 3,
      })
    } finally {
      setSending(false)
    }
  }

  function addPhase() {
    setPhases([...phases, { title: '', description: '', estimatedDays: '', estimatedCost: '' }])
  }

  function updatePhase(index, field, value) {
    const updated = [...phases]
    updated[index][field] = value
    setPhases(updated)
  }

  function removePhase(index) {
    if (phases.length > 1) {
      setPhases(phases.filter((_, i) => i !== index))
    }
  }

  if (loading) {
    return (
      <Card>
        <h1 className="mb-2 text-xl font-bold text-slate-900 dark:text-white">Phan hoi yeu cau</h1>
        <p className="text-sm text-slate-600 dark:text-slate-300">Dang tai du lieu...</p>
      </Card>
    )
  }

  return (
    <section className="space-y-4">
      {notificationContext}
      <Card className="space-y-3">
        <h1 className="text-xl font-bold text-slate-900 dark:text-white">Phan hoi yeu cau du an</h1>
        {error ? <p className="text-sm text-rose-600 dark:text-rose-400">{error}</p> : null}
        {currentRequest ? (
          <div className="grid gap-2 rounded-xl border border-slate-200 bg-slate-50 p-3 text-sm dark:border-slate-700 dark:bg-slate-900/50">
            <p className="font-semibold text-slate-900 dark:text-white">{currentRequest.title}</p>
            <p className="text-slate-600 dark:text-slate-300">Trang thai: {REQUEST_STATUS_LABELS[currentRequest.status] || currentRequest.status}</p>
            <p className="text-slate-600 dark:text-slate-300">Cong nghe: {currentRequest.technology || 'Dang cap nhat'}</p>
            <p className="text-slate-600 dark:text-slate-300 whitespace-pre-line">Requirement: {currentRequest.requirement || 'Dang cap nhat'}</p>
          </div>
        ) : null}
      </Card>

      <Card className="space-y-3">
        <div className="flex items-center gap-4 border-b border-slate-200 pb-3 dark:border-slate-700">
          <button
            type="button"
            onClick={() => setMode('create')}
            disabled={!canSendProposal}
            className={`text-sm font-semibold ${mode === 'create' ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-500 dark:text-slate-400'} ${!canSendProposal ? 'cursor-not-allowed opacity-60' : ''}`}
          >
            Tạo proposal mới (Round 1)
          </button>
          <button
            type="button"
            onClick={() => setMode('chat')}
            className={`text-sm font-semibold ${mode === 'chat' ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-500 dark:text-slate-400'}`}
          >
            Chat với proposal hiện tại
          </button>
          {currentRequest?.status === 'negotiating' && (
            <button
              type="button"
              onClick={() => setMode('review-counter')}
              className={`text-sm font-semibold ${mode === 'review-counter' ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-500 dark:text-slate-400'}`}
            >
              Xem counter proposal (Round 2)
            </button>
          )}
        </div>

        {mode === 'create' ? (
          <div className="space-y-4">
            {!canSendProposal ? (
              <p className="rounded-xl border border-amber-200 bg-amber-50 p-3 text-sm text-amber-700">
                Proposal da duoc gui. Admin chi duoc gui 1 lan, vui long kiem tra tab khac de tiep tuc xu ly.
              </p>
            ) : (
              <>
                <div className="space-y-2">
                  <label className="block space-y-1">
                    <span className="text-xs font-semibold uppercase tracking-[0.08em] text-slate-500">Tieu de proposal</span>
                    <input
                      value={proposalTitle}
                      onChange={(event) => setProposalTitle(event.target.value)}
                      placeholder="Nhap tieu de proposal..."
                      className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
                    />
                  </label>

                  <label className="block space-y-1">
                    <span className="text-xs font-semibold uppercase tracking-[0.08em] text-slate-500">Mo ta</span>
                    <textarea
                      value={proposalDescription}
                      onChange={(event) => setProposalDescription(event.target.value)}
                      rows={3}
                      placeholder="Nhap mo ta chi tiet..."
                      className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
                    />
                  </label>

                  <div className="grid grid-cols-2 gap-3 rounded-xl border border-slate-200 bg-slate-50 p-3 dark:border-slate-700 dark:bg-slate-900/50">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-[0.08em] text-slate-500">Tong chi phi</p>
                      <p className="mt-1 text-lg font-bold text-slate-900 dark:text-white">{formatCurrencyValue(totalCost)}</p>
                    </div>
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-[0.08em] text-slate-500">Tong thoi gian</p>
                      <p className="mt-1 text-lg font-bold text-slate-900 dark:text-white">{totalDays} ngay</p>
                    </div>
                  </div>

                  <label className="block space-y-1">
                    <span className="text-xs font-semibold uppercase tracking-[0.08em] text-slate-500">Ghi chu (optional)</span>
                    <textarea
                      value={proposalNote}
                      onChange={(event) => setProposalNote(event.target.value)}
                      rows={2}
                      placeholder="Ghi chu them..."
                      className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
                    />
                  </label>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <p className="text-xs font-semibold uppercase tracking-[0.08em] text-slate-500">Phases</p>
                    <button
                      type="button"
                      onClick={addPhase}
                      className="text-xs font-semibold text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 dark:hover:text-indigo-300"
                    >
                      + Them phase
                    </button>
                  </div>
                  {phases.map((phase, index) => (
                    <div key={index} className="rounded-xl border border-slate-200 bg-slate-50 p-3 dark:border-slate-700 dark:bg-slate-900/50">
                      <div className="mb-2 flex items-center justify-between gap-3">
                        <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Phase {index + 1}</span>
                        {phases.length > 1 && (
                          <button
                            type="button"
                            onClick={() => removePhase(index)}
                            className="text-xs font-semibold text-rose-600 hover:text-rose-500 dark:text-rose-400 dark:hover:text-rose-300"
                          >
                            Xoa
                          </button>
                        )}
                      </div>
                      <div className="space-y-2">
                        <input
                          value={phase.title}
                          onChange={(event) => updatePhase(index, 'title', event.target.value)}
                          placeholder="Tieu de phase"
                          className="w-full rounded-lg border border-slate-200 bg-white px-2 py-1.5 text-xs text-slate-700 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
                        />
                        <textarea
                          value={phase.description}
                          onChange={(event) => updatePhase(index, 'description', event.target.value)}
                          rows={2}
                          placeholder="Mo ta phase"
                          className="w-full rounded-lg border border-slate-200 bg-white px-2 py-1.5 text-xs text-slate-700 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
                        />
                        <div className="grid grid-cols-2 gap-2">
                          <input
                            type="number"
                            value={phase.estimatedDays}
                            onChange={(event) => updatePhase(index, 'estimatedDays', event.target.value)}
                            placeholder="So ngay"
                            className="w-full rounded-lg border border-slate-200 bg-white px-2 py-1.5 text-xs text-slate-700 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
                          />
                          <input
                            type="number"
                            value={phase.estimatedCost}
                            onChange={(event) => updatePhase(index, 'estimatedCost', event.target.value)}
                            placeholder="Chi phi"
                            className="w-full rounded-lg border border-slate-200 bg-white px-2 py-1.5 text-xs text-slate-700 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <button
                  type="button"
                  onClick={handleSendProposal}
                  disabled={sending}
                  className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-60 dark:bg-white dark:text-slate-900"
                >
                  {sending ? 'Dang gui...' : 'Gui proposal'}
                </button>
              </>
            )}
          </div>
        ) : mode === 'review-counter' ? (
          <div className="space-y-4">
            <p className="text-sm text-slate-600 dark:text-slate-300">
              Xem và duyệt/từ chối đề xuất phản đối từ user (Round 2). Chỉ được duyệt hoặc từ chối, không được tạo thêm proposal mới.
            </p>
            {proposalsLoading ? (
              <p className="text-sm text-slate-500 dark:text-slate-400">Đang tải danh sách proposals...</p>
            ) : requestProposals.length > 0 ? (
              <div className="space-y-3">
                {requestProposals.map((proposal) => {
                  const isCounter = proposal?.negotiation_round === 2 || proposal?.status === 'countered'
                  return (
                  <div key={proposal.id} className="rounded-xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-900/50">
                    <div className="mb-3 space-y-2">
                      <div className="flex items-center justify-between gap-3">
                        <p className="font-semibold text-slate-900 dark:text-white">{proposal.title || 'Không có tiêu đề'}</p>
                        <Badge variant={isCounter ? 'warning' : 'neutral'}>
                          {isCounter ? 'Counter Proposal' : 'Proposal'}
                        </Badge>
                      </div>
                      <p className="text-sm text-slate-600 dark:text-slate-300 whitespace-pre-line">{proposal.description || 'Không có mô tả'}</p>
                      <div className="grid grid-cols-2 gap-3 rounded-lg border border-slate-200 bg-white p-2 dark:border-slate-700 dark:bg-slate-900">
                        <div>
                          <p className="text-xs font-semibold uppercase tracking-[0.08em] text-slate-500">Tổng chi phí</p>
                          <p className="mt-1 text-sm font-bold text-slate-900 dark:text-white">{formatCurrencyValue(proposal.cost)}</p>
                        </div>
                        <div>
                          <p className="text-xs font-semibold uppercase tracking-[0.08em] text-slate-500">Thời gian</p>
                          <p className="mt-1 text-sm font-bold text-slate-900 dark:text-white">{proposal.total_days_min} - {proposal.total_days_max} ngày</p>
                        </div>
                      </div>
                      {proposal.note && (
                        <p className="text-xs text-slate-500 dark:text-slate-400">Ghi chú: {proposal.note}</p>
                      )}
                    </div>
                    {isCounter && (
                      <div className="flex gap-3">
                        <button
                          type="button"
                          onClick={() => handleApproveCounterProposal(proposal.id)}
                          disabled={sending}
                          className="rounded-lg bg-green-600 px-4 py-2 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-60"
                        >
                          {sending ? 'Đang xử lý...' : 'Duyệt và gửi yêu cầu cọc'}
                        </button>
                        <button
                          type="button"
                          onClick={() => handleRejectCounterProposal(proposal.id)}
                          disabled={sending}
                          className="rounded-lg bg-rose-600 px-4 py-2 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-60"
                        >
                          {sending ? 'Đang xử lý...' : 'Từ chối'}
                        </button>
                      </div>
                    )}
                  </div>
                )})}
              </div>
            ) : (
              <div className="space-y-4">
                {error && <p className="text-sm text-rose-600 dark:text-rose-400">{error}</p>}
                <p className="text-sm text-slate-500 dark:text-slate-400">Chua co counter proposal de duyet.</p>
              </div>
            )}
          </div>
        ) : (
          <div className="space-y-3">
            {!proposalId ? (
              <p className="rounded-xl border border-amber-200 bg-amber-50 p-3 text-sm text-amber-700">
                Chua co proposal de chat. Vui long gui proposal truoc.
              </p>
            ) : (
              <p className="text-xs font-semibold uppercase tracking-[0.08em] text-slate-500">Dang chat voi proposal: {proposalId}</p>
            )}

            <div className="space-y-2">
              <p className="text-xs font-semibold uppercase tracking-[0.08em] text-slate-500">Thread phan hoi</p>
              {threadLoading ? <p className="text-sm text-slate-500 dark:text-slate-400">Dang tai phan hoi...</p> : null}
              {!threadLoading && !messages.length ? <p className="text-sm text-slate-500 dark:text-slate-400">Chua co phan hoi.</p> : null}
              {messages.map((item) => (
                <div key={item.id} className="rounded-xl border border-slate-200 bg-white p-3 dark:border-slate-700 dark:bg-slate-900">
                  <div className="mb-1 flex items-center justify-between gap-3">
                    <p className="text-sm font-semibold text-slate-900 dark:text-white">Sender: {shortenId(item.sender_id)}</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">{formatDateValue(item.created_at)}</p>
                  </div>
                  <p className="text-sm text-slate-700 dark:text-slate-200">{item.message}</p>
                </div>
              ))}
            </div>

            <div className="space-y-2">
              <textarea
                value={messageDraft}
                onChange={(event) => setMessageDraft(event.target.value)}
                rows={4}
                placeholder="Nhap phan hoi cho user..."
                className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
              />
              <button
                type="button"
                onClick={handleSendMessage}
                disabled={!proposalId.trim() || !messageDraft.trim() || sending}
                className="rounded-lg bg-slate-900 px-3 py-1 text-xs font-semibold text-white disabled:cursor-not-allowed disabled:opacity-60 dark:bg-white dark:text-slate-900"
              >
                {sending ? 'Dang gui...' : 'Gui phan hoi'}
              </button>
            </div>
          </div>
        )}
      </Card>
    </section>
  )
}

export function AdminContentPage() {
  return (
    <section className="grid grid-cols-1 gap-4 lg:grid-cols-2">
      <Card>
        <h1 className="mb-2 text-lg font-bold text-slate-900 dark:text-white">Kiểm duyệt nội dung</h1>
        <p className="text-sm text-slate-600 dark:text-slate-300">Duyệt bình luận, báo cáo vi phạm và dữ liệu hiển thị trước khi publish.</p>
      </Card>
      <Card>
        <h2 className="mb-2 text-lg font-bold text-slate-900 dark:text-white">Nhật ký moderation</h2>
        <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-300">
          <li>10:20 - Ẩn bình luận spam từ USR-1942</li>
          <li>09:45 - Duyệt bài POST-506 chờ chỉnh sửa</li>
          <li>08:30 - Cảnh báo vi phạm cho MTR-329</li>
        </ul>
      </Card>
    </section>
  )
}

export function AdminPostsPage() {
  return (
    <Card>
      <h1 className="mb-3 text-xl font-bold text-slate-900 dark:text-white">Quản lý bài viết</h1>
      <DataTable
        columns={[
          { key: 'id', label: 'Mã bài' },
          { key: 'title', label: 'Tiêu đề' },
          { key: 'author', label: 'Tác giả' },
          { key: 'state', label: 'Trạng thái', render: (value) => <StatusBadge status={value} /> },
        ]}
        rows={POSTS}
      />
    </Card>
  )
}

export function AdminSettingsPage() {
  return (
    <Card>
      <h1 className="mb-2 text-xl font-bold text-slate-900 dark:text-white">Cài đặt hệ thống</h1>
      <p className="text-sm text-slate-600 dark:text-slate-300">Khu vực cấu hình thông báo, phân quyền và chính sách vận hành. Phần logic backend đã có thể nối trực tiếp sau khi map API.</p>
    </Card>
  )
}
