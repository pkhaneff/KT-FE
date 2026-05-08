import { Card } from '../../../components/ui/Card'
import { Badge } from '../../../components/ui/Badge'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { useEffect, useMemo, useState } from 'react'
import { AlertTriangle, BookOpenText, FolderKanban, ReceiptText, ShieldAlert, UserCheck, Users } from 'lucide-react'
import { ROUTES } from '../../../core/constants/routes'
import { useAuth } from '../../auth/hooks/useAuth'
import { listAdminUsers, updateAdminUser } from '../services/adminUserApi'
import { adminProviderDecision, listAdminProjectRequests } from '../services/adminProjectRequestApi'

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

const REQUEST_STATUS_VARIANTS = {
  new: 'warning',
  under_review: 'warning',
  proposal_sent: 'warning',
  negotiating: 'neutral',
  awaiting_prepayment: 'warning',
  awaiting_provider_confirm: 'warning',
  in_progress: 'success',
  completed: 'success',
  expired: 'danger',
  rejected: 'danger',
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
    const rawStatus = String(item?.status || 'new').toLowerCase()
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
  return (
    <Card>
      <h1 className="mb-3 text-xl font-bold text-slate-900 dark:text-white">Quản lý đơn hàng</h1>
      <DataTable
        columns={[
          { key: 'id', label: 'Mã đơn' },
          { key: 'owner', label: 'Người dùng' },
          { key: 'mentor', label: 'Mentor' },
          { key: 'amount', label: 'Tổng tiền' },
          { key: 'status', label: 'Trạng thái', render: (value) => <StatusBadge status={value} /> },
        ]}
        rows={ORDERS}
      />
    </Card>
  )
}

export function AdminProjectRequestsPage() {
  const navigate = useNavigate()
  const { accessToken } = useAuth()
  const [requests, setRequests] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [actionLoadingIds, setActionLoadingIds] = useState([])

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

  async function handleReject(requestId) {
    if (!accessToken) {
      return
    }

    const note = window.prompt('Nhap ly do tu choi de gui den nguoi dung:')
    if (note === null) {
      return
    }
    if (!note.trim()) {
      setError('Vui long nhap ly do tu choi.')
      return
    }

    setActionLoadingIds((prev) => [...prev, requestId])
    setError('')
    try {
      const updated = await adminProviderDecision(accessToken, requestId, false)
      setRequests((prev) => prev.map((item) => (item.id === requestId ? normalizeAdminProjectRequests([updated])[0] : item)))
    } catch (err) {
      setError(err.message || 'Tu choi yeu cau that bai.')
    } finally {
      setActionLoadingIds((prev) => prev.filter((id) => id !== requestId))
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

  return (
    <Card>
      <h1 className="mb-3 text-xl font-bold text-slate-900 dark:text-white">Yêu cầu dự án</h1>
      {error ? <p className="mb-3 text-sm text-rose-600 dark:text-rose-400">{error}</p> : null}
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
        rows={requests}
        emptyText="Chưa có yêu cầu dự án."
      />
    </Card>
  )
}

export function AdminProjectRequestDetailPage() {
  const { requestId } = useParams()

  return (
    <Card>
      <h1 className="mb-2 text-xl font-bold text-slate-900 dark:text-white">Phan hoi yeu cau</h1>
      <p className="text-sm text-slate-600 dark:text-slate-300">ID yeu cau: {requestId}</p>
      <p className="mt-3 text-sm text-slate-500 dark:text-slate-400">Trang chi tiet se duoc bo sung sau.</p>
    </Card>
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
