import { useEffect, useMemo, useState } from 'react'
import { useParams } from 'react-router-dom'
import { notification } from 'antd'
import { Card } from '../../../components/ui/Card'
import { Badge } from '../../../components/ui/Badge'
import { Button } from '../../../components/ui/Button'
import { SectionHeading } from '../../../components/shared/SectionHeading'
import { Seo } from '../../../core/seo/Seo'
import { useAuth } from '../../auth/hooks/useAuth'
import {
  listProjectRequests,
  listProposalMessages,
  listProposalPhases,
  listUserProposals,
  sendProposalMessage,
  listProposalRevisions,
} from '../services/projectRequestApi'
import {
  userConfirmProposal,
  userRejectProposal,
  userCounterProposal,
  userPrepay,
  userSyncPayment,
  userGetContract,
  userCreateChangeRequest,
} from '../services/projectRequestPaymentApi'

const STATUS_LABELS = {
  pending_review: 'Chờ duyệt',
  under_review: 'Đang duyệt',
  proposal_sent: 'Đã gửi đề xuất',
  negotiating: 'Đang thương lượng',
  proposal_approved: 'Đề xuất đã duyệt',
  contract_sent: 'Đã gửi hợp đồng',
  waiting_deposit: 'Chờ đặt cọc',
  project_approved: 'Đã phê duyệt dự án',
  in_progress: 'Đang triển khai',
  completed: 'Hoàn thành',
  expired: 'Hết hạn',
  request_rejected: 'Đã từ chối',
  canceled: 'Đã hủy',
}

const STATUS_VARIANTS = {
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

function formatDateTime(value) {
  if (!value) {
    return 'Đang cập nhật'
  }

  const parsed = new Date(value)
  if (Number.isNaN(parsed.getTime())) {
    return 'Đang cập nhật'
  }

  return parsed.toLocaleString('vi-VN')
}

function formatDate(value) {
  if (!value) {
    return 'Đang cập nhật'
  }

  const parsed = new Date(value)
  if (Number.isNaN(parsed.getTime())) {
    return 'Đang cập nhật'
  }

  return parsed.toLocaleDateString('vi-VN')
}

export function RequestDetailPage() {
  const { requestId } = useParams()
  const { accessToken, profile } = useAuth()
  const [notificationApi, notificationContext] = notification.useNotification()

  const [requestItem, setRequestItem] = useState(null)
  const [proposals, setProposals] = useState([])
  const [selectedProposalId, setSelectedProposalId] = useState('')
  const [phases, setPhases] = useState([])
  const [messages, setMessages] = useState([])
  const [messageDraft, setMessageDraft] = useState('')
  const [loading, setLoading] = useState(true)
  const [loadingMessages, setLoadingMessages] = useState(false)
  const [sending, setSending] = useState(false)
  const [error, setError] = useState('')
  const [contract, setContract] = useState(null)
  const [showCounterModal, setShowCounterModal] = useState(false)
  const [showRejectModal, setShowRejectModal] = useState(false)
  const [rejectReason, setRejectReason] = useState('')
  const [counterForm, setCounterForm] = useState({
    title: '',
    description: '',
    total_days_min: '',
    total_days_max: '',
    cost: '',
    note: '',
    phases: [{ title: '', description: '', estimated_days: '', estimated_cost: '' }],
  })
  const [actionLoading, setActionLoading] = useState(false)

  useEffect(() => {
    let cancelled = false

    async function loadDetail() {
      if (!accessToken || !requestId) {
        if (!cancelled) {
          setLoading(false)
        }
        return
      }

      setLoading(true)
      setError('')
      try {
        const [requests, proposalItems] = await Promise.all([
          listProjectRequests(accessToken),
          listUserProposals(accessToken, requestId),
        ])

        if (cancelled) {
          return
        }

        const matchedRequest = Array.isArray(requests) ? requests.find((item) => item.id === requestId) : null
        setRequestItem(matchedRequest || null)

        const normalizedProposals = Array.isArray(proposalItems) ? proposalItems : []
        setProposals(normalizedProposals)

        if (normalizedProposals.length > 0) {
          const latestProposalId = normalizedProposals[normalizedProposals.length - 1].id
          setSelectedProposalId(String(latestProposalId))
        } else {
          setSelectedProposalId('')
          setPhases([])
          setMessages([])
        }
      } catch (err) {
        if (!cancelled) {
          setError(err.message || 'Không tải được chi tiết yêu cầu.')
          setRequestItem(null)
          setProposals([])
        }
      } finally {
        if (!cancelled) {
          setLoading(false)
        }
      }
    }

    loadDetail()

    return () => {
      cancelled = true
    }
  }, [accessToken, requestId])

  useEffect(() => {
    let cancelled = false

    async function loadProposalData() {
      if (!accessToken || !requestId || !selectedProposalId) {
        return
      }

      setLoadingMessages(true)
      try {
        const [phaseItems, messageItems] = await Promise.all([
          listProposalPhases(accessToken, requestId, selectedProposalId),
          listProposalMessages(accessToken, requestId, selectedProposalId),
        ])

        if (!cancelled) {
          setPhases(Array.isArray(phaseItems) ? phaseItems : [])
          setMessages(Array.isArray(messageItems) ? messageItems : [])
        }
      } catch (err) {
        if (!cancelled) {
          setError(err.message || 'Không tải được phần phản hồi đề xuất.')
          setPhases([])
          setMessages([])
        }
      } finally {
        if (!cancelled) {
          setLoadingMessages(false)
        }
      }
    }

    loadProposalData()

    return () => {
      cancelled = true
    }
  }, [accessToken, requestId, selectedProposalId])

  const selectedProposal = useMemo(
    () => proposals.find((item) => String(item.id) === String(selectedProposalId)) || null,
    [proposals, selectedProposalId],
  )

  async function handleSendMessage() {
    if (!accessToken || !requestId || !selectedProposalId || sending) {
      return
    }

    const nextMessage = messageDraft.trim()
    if (!nextMessage) {
      return
    }

    setSending(true)
    setError('')
    try {
      const created = await sendProposalMessage(accessToken, requestId, selectedProposalId, nextMessage)
      setMessages((prev) => [...prev, created])
      setMessageDraft('')
      notificationApi.success({
        message: 'Gui phan hoi thanh cong',
        description: 'Phan hoi da duoc gui den admin.',
        placement: 'topRight',
        duration: 3,
      })
    } catch (err) {
      setError(err.message || 'Gửi phản hồi thất bại.')
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

  async function handleConfirmProposal() {
    if (!accessToken || !requestId || !selectedProposalId || actionLoading) {
      return
    }

    setActionLoading(true)
    setError('')
    try {
      const updated = await userConfirmProposal(accessToken, requestId, selectedProposalId, null)
      setProposals((prev) => prev.map((p) => (p.id === selectedProposalId ? updated : p)))
      if (requestItem) {
        setRequestItem({ ...requestItem, status: 'proposal_approved' })
      }
      notificationApi.success({
        message: 'Xac nhan thanh cong',
        description: 'De xuat da duoc xac nhan.',
        placement: 'topRight',
        duration: 3,
      })
    } catch (err) {
      setError(err.message || 'Xác nhận đề xuất thất bại.')
      notificationApi.error({
        message: 'Xac nhan that bai',
        description: err.message || 'Vui long thu lai.',
        placement: 'topRight',
        duration: 3,
      })
    } finally {
      setActionLoading(false)
    }
  }

  async function handleRejectProposal() {
    if (!accessToken || !requestId || !selectedProposalId || actionLoading) {
      return
    }

    if (!rejectReason.trim()) {
      setError('Vui lòng nhập lý do từ chối.')
      return
    }

    setActionLoading(true)
    setError('')
    try {
      const updated = await userRejectProposal(accessToken, requestId, selectedProposalId, rejectReason.trim())
      setProposals((prev) => prev.map((p) => (p.id === selectedProposalId ? updated : p)))
      if (requestItem) {
        setRequestItem({ ...requestItem, status: 'request_rejected' })
      }
      setShowRejectModal(false)
      setRejectReason('')
      notificationApi.success({
        message: 'Da tu choi de xuat',
        description: 'Ly do tu choi da duoc gui den admin.',
        placement: 'topRight',
        duration: 3,
      })
    } catch (err) {
      setError(err.message || 'Từ chối đề xuất thất bại.')
      notificationApi.error({
        message: 'Tu choi that bai',
        description: err.message || 'Vui long thu lai.',
        placement: 'topRight',
        duration: 3,
      })
    } finally {
      setActionLoading(false)
    }
  }

  async function handleCounterProposal() {
    if (!accessToken || !requestId || actionLoading) {
      return
    }

    const validPhases = counterForm.phases.filter(p => p.title.trim() && p.estimated_days && p.estimated_cost)
    if (validPhases.length === 0) {
      setError('Vui lòng nhập ít nhất 1 phase.')
      return
    }

    const payload = {
      title: counterForm.title.trim(),
      description: counterForm.description.trim(),
      total_days_min: parseInt(counterForm.total_days_min),
      total_days_max: parseInt(counterForm.total_days_max),
      cost: parseFloat(counterForm.cost),
      note: counterForm.note.trim() || null,
      phases: validPhases.map((p, index) => ({
        title: p.title.trim(),
        description: p.description.trim() || null,
        estimated_days: parseInt(p.estimated_days),
        estimated_cost: parseFloat(p.estimated_cost),
        sort_order: index,
      })),
    }

    setActionLoading(true)
    setError('')
    try {
      const updated = await userCounterProposal(accessToken, requestId, payload)
      setProposals((prev) => [...prev, updated])
      if (requestItem) {
        setRequestItem({ ...requestItem, status: 'negotiating' })
      }
      setShowCounterModal(false)
      setCounterForm({
        title: '',
        description: '',
        total_days_min: '',
        total_days_max: '',
        cost: '',
        note: '',
        phases: [{ title: '', description: '', estimated_days: '', estimated_cost: '' }],
      })
      notificationApi.success({
        message: 'Gui de xuat thanh cong',
        description: 'Ban da gui de xuat phan doi.',
        placement: 'topRight',
        duration: 3,
      })
    } catch (err) {
      setError(err.message || 'Gửi đề xuất phản đối thất bại.')
      notificationApi.error({
        message: 'Gui de xuat that bai',
        description: err.message || 'Vui long thu lai.',
        placement: 'topRight',
        duration: 3,
      })
    } finally {
      setActionLoading(false)
    }
  }

  async function handleViewContract() {
    if (!accessToken || !requestId || actionLoading) {
      return
    }

    setActionLoading(true)
    setError('')
    try {
      const contractData = await userGetContract(accessToken, requestId)
      setContract(contractData)
      notificationApi.success({
        message: 'Tai hop dong thanh cong',
        description: 'Hop dong da duoc cap nhat.',
        placement: 'topRight',
        duration: 3,
      })
    } catch (err) {
      setError(err.message || 'Không thể tải hợp đồng.')
      notificationApi.error({
        message: 'Tai hop dong that bai',
        description: err.message || 'Vui long thu lai.',
        placement: 'topRight',
        duration: 3,
      })
    } finally {
      setActionLoading(false)
    }
  }

  async function handlePrepay() {
    if (!accessToken || !requestId || actionLoading) {
      return
    }

    if (!confirm('Bạn có chắc muốn thanh toán cọc cho dự án này?')) {
      return
    }

    setActionLoading(true)
    setError('')
    try {
      const idemKey = `prepay-${Date.now()}`
      const payment = await userPrepay(accessToken, requestId, idemKey)
      notificationApi.success({
        message: 'Tao yeu cau thanh toan',
        description: `Ma giao dich: ${payment.transaction_code}`,
        placement: 'topRight',
        duration: 3,
      })
      if (requestItem) {
        setRequestItem({ ...requestItem, status: 'waiting_deposit' })
      }
    } catch (err) {
      setError(err.message || 'Không thể tạo thanh toán.')
      notificationApi.error({
        message: 'Tao thanh toan that bai',
        description: err.message || 'Vui long thu lai.',
        placement: 'topRight',
        duration: 3,
      })
    } finally {
      setActionLoading(false)
    }
  }

  function addCounterPhase() {
    setCounterForm({
      ...counterForm,
      phases: [...counterForm.phases, { title: '', description: '', estimated_days: '', estimated_cost: '' }],
    })
  }

  function updateCounterPhase(index, field, value) {
    const updated = [...counterForm.phases]
    updated[index][field] = value
    setCounterForm({ ...counterForm, phases: updated })
  }

  function removeCounterPhase(index) {
    if (counterForm.phases.length > 1) {
      setCounterForm({
        ...counterForm,
        phases: counterForm.phases.filter((_, i) => i !== index),
      })
    }
  }

  if (loading) {
    return (
      <Card>
        <p className="text-sm text-slate-600">Đang tải dữ liệu yêu cầu dự án...</p>
      </Card>
    )
  }

  if (!requestItem) {
    return (
      <Card>
        <p className="text-sm text-rose-600">Không tìm thấy yêu cầu dự án.</p>
      </Card>
    )
  }

  const statusRaw = String(requestItem.status || '').toLowerCase()
  const statusLabel = STATUS_LABELS[statusRaw] || requestItem.status || 'Đang cập nhật'

  return (
    <>
      {notificationContext}
      <Seo title="Chi tiết yêu cầu" description="Theo dõi phản hồi giữa user và admin cho đề xuất dự án." />
      <section className="space-y-6">
        <SectionHeading eyebrow="Project Request" title={requestItem.title} description="Thông tin yêu cầu, đề xuất và phản hồi theo proposal." />

        {error ? <p className="text-sm text-rose-600">{error}</p> : null}

        <div className="grid gap-5 xl:grid-cols-[1fr_320px]">
          <div className="space-y-4">
            <Card>
              <div className="grid gap-3 md:grid-cols-3">
                {[
                  ['Trạng thái', statusLabel],
                  ['Loại dự án', requestItem.type || 'Đang cập nhật'],
                  ['Công nghệ', requestItem.technology || 'Đang cập nhật'],
                  ['Ngân sách', typeof requestItem.budget === 'number' ? `${requestItem.budget.toLocaleString('vi-VN')}đ` : 'Đang cập nhật'],
                  ['Deadline', formatDate(requestItem.deadline_at)],
                  ['Ngày tạo', formatDateTime(requestItem.created_at)],
                ].map(([label, value]) => (
                  <div key={label} className="rounded-xl bg-slate-50 p-3">
                    <p className="text-[11px] font-semibold uppercase tracking-[0.08em] text-slate-500">{label}</p>
                    <p className="mt-1 text-sm font-semibold text-slate-900">{value}</p>
                  </div>
                ))}
              </div>
            </Card>

            <Card className="space-y-3">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <p className="text-sm font-semibold text-slate-900">Phản hồi theo đề xuất</p>
                <Badge variant={STATUS_VARIANTS[statusRaw] || 'neutral'}>{statusLabel}</Badge>
              </div>

              {/* Action buttons based on status */}
              {statusRaw === 'proposal_sent' && selectedProposal ? (
                <div className="flex flex-wrap gap-2">
                  <Button size="sm" onClick={handleConfirmProposal} disabled={actionLoading}>
                    Xác nhận đề xuất
                  </Button>
                  <Button size="sm" variant="secondary" onClick={() => setShowRejectModal(true)} disabled={actionLoading}>
                    Từ chối
                  </Button>
                  <Button size="sm" variant="secondary" onClick={() => setShowCounterModal(true)} disabled={actionLoading}>
                    Deal lại (Đề xuất phản đối)
                  </Button>
                </div>
              ) : null}

              {statusRaw === 'proposal_approved' && (
                <div className="flex flex-wrap gap-2">
                  <Button size="sm" onClick={handlePrepay} disabled={actionLoading}>
                    Thanh toán cọc
                  </Button>
                  <Button size="sm" variant="secondary" onClick={handleViewContract} disabled={actionLoading}>
                    Xem hợp đồng
                  </Button>
                </div>
              )}

              {statusRaw === 'contract_sent' && (
                <div className="flex flex-wrap gap-2">
                  <Button size="sm" onClick={handlePrepay} disabled={actionLoading}>
                    Thanh toán cọc
                  </Button>
                  <Button size="sm" variant="secondary" onClick={handleViewContract} disabled={actionLoading}>
                    Xem hợp đồng
                  </Button>
                </div>
              )}

              {statusRaw === 'waiting_deposit' && (
                <div className="flex flex-wrap gap-2">
                  <Button size="sm" onClick={handlePrepay} disabled={actionLoading}>
                    Thanh toán cọc
                  </Button>
                  <Button size="sm" variant="secondary" onClick={handleViewContract} disabled={actionLoading}>
                    Xem hợp đồng
                  </Button>
                </div>
              )}

              {contract && (
                <Card className="border-indigo-200 bg-indigo-50">
                  <p className="text-sm font-semibold text-slate-900">Hợp đồng</p>
                  <p className="text-xs text-slate-600">Mã: {contract.contract_code}</p>
                  <p className="text-sm text-slate-700 mt-2">{contract.content}</p>
                </Card>
              )}

              <label className="block space-y-1">
                <span className="text-xs font-semibold uppercase tracking-[0.08em] text-slate-500">Proposal</span>
                <select
                  value={selectedProposalId}
                  onChange={(event) => setSelectedProposalId(event.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700"
                  disabled={!proposals.length}
                >
                  {proposals.map((proposal) => (
                    <option key={proposal.id} value={proposal.id}>
                      v{proposal.version} · {proposal.title} · {proposal.status}
                    </option>
                  ))}
                </select>
              </label>

              {selectedProposal ? (
                <div className="rounded-xl border border-slate-200 bg-white p-3 text-sm text-slate-700">
                  <p><span className="font-semibold">Ghi chú:</span> {selectedProposal.note || 'Không có'}</p>
                  <p><span className="font-semibold">Chi phí:</span> {selectedProposal.cost?.toLocaleString('vi-VN')}đ</p>
                  <p><span className="font-semibold">Timeline:</span> {selectedProposal.total_days_min} - {selectedProposal.total_days_max} ngày</p>
                </div>
              ) : null}

              <div className="space-y-2">
                <p className="text-xs font-semibold uppercase tracking-[0.08em] text-slate-500">Phases</p>
                {!phases.length ? <p className="text-sm text-slate-500">Chưa có phase.</p> : null}
                {phases.map((phase) => (
                  <div key={phase.id} className="rounded-xl border border-slate-200 p-3">
                    <p className="text-sm font-semibold text-slate-900">{phase.sort_order + 1}. {phase.title}</p>
                    <p className="mt-1 text-sm text-slate-600">{phase.description || 'Không có mô tả'}</p>
                    <p className="mt-1 text-xs text-slate-500">{phase.estimated_days} ngày · {phase.estimated_cost?.toLocaleString('vi-VN')}đ</p>
                  </div>
                ))}
              </div>

              <div className="space-y-2">
                <p className="text-xs font-semibold uppercase tracking-[0.08em] text-slate-500">Thread phản hồi</p>
                {loadingMessages ? <p className="text-sm text-slate-500">Đang tải phản hồi...</p> : null}
                {!loadingMessages && !messages.length ? <p className="text-sm text-slate-500">Chưa có phản hồi.</p> : null}
                {messages.map((item) => {
                  const isMe = profile?.id && String(item.sender_id) === String(profile.id)
                  return (
                    <div key={item.id} className={`rounded-xl border p-3 ${isMe ? 'border-indigo-200 bg-indigo-50' : 'border-slate-200 bg-white'}`}>
                      <div className="mb-1 flex items-center justify-between gap-2">
                        <p className="text-sm font-semibold text-slate-900">{isMe ? 'Bạn' : 'Admin'}</p>
                        <p className="text-xs text-slate-500">{formatDateTime(item.created_at)}</p>
                      </div>
                      <p className="text-sm text-slate-700">{item.message}</p>
                    </div>
                  )
                })}
              </div>

              <div className="space-y-2">
                <textarea
                  value={messageDraft}
                  onChange={(event) => setMessageDraft(event.target.value)}
                  rows={4}
                  placeholder="Nhập nội dung phản hồi cho proposal đang chọn..."
                  className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm text-slate-700"
                />
                <Button size="sm" onClick={handleSendMessage} disabled={!selectedProposalId || sending || !messageDraft.trim()}>
                  {sending ? 'Đang gửi...' : 'Gửi phản hồi'}
                </Button>
              </div>
            </Card>
          </div>

          <aside className="space-y-4">
            <Card>
              <p className="text-sm font-semibold text-slate-900">Yêu cầu từ bạn</p>
              <p className="mt-2 text-sm text-slate-600 whitespace-pre-line">{requestItem.requirement}</p>
            </Card>

            <Card>
              <p className="text-sm font-semibold text-slate-900">Deliverables</p>
              <p className="mt-2 text-sm text-slate-600 whitespace-pre-line">{requestItem.deliverables}</p>
            </Card>
          </aside>
        </div>

        {/* Reject Modal */}
        {showRejectModal ? (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
            <Card className="max-w-md w-full p-6">
              <h3 className="text-lg font-bold text-slate-900 mb-4">Từ chối đề xuất</h3>
              <textarea
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
                rows={4}
                placeholder="Nhập lý do từ chối..."
                className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm mb-4"
              />
              <div className="flex justify-end gap-3">
                <Button variant="secondary" onClick={() => { setShowRejectModal(false); setRejectReason('') }}>
                  Hủy
                </Button>
                <Button onClick={handleRejectProposal} disabled={actionLoading || !rejectReason.trim()}>
                  {actionLoading ? 'Đang xử lý...' : 'Xác nhận từ chối'}
                </Button>
              </div>
            </Card>
          </div>
        ) : null}

        {/* Counter Proposal Modal */}
        {showCounterModal ? (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 overflow-y-auto">
            <Card className="max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 my-8">
              <h3 className="text-lg font-bold text-slate-900 mb-4">Đề xuất phản đối</h3>
              <div className="space-y-4">
                <label className="space-y-2">
                  <span className="text-sm font-medium text-slate-700">Tiêu đề</span>
                  <input
                    type="text"
                    value={counterForm.title}
                    onChange={(e) => setCounterForm({...counterForm, title: e.target.value})}
                    className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm"
                    required
                  />
                </label>
                <label className="space-y-2">
                  <span className="text-sm font-medium text-slate-700">Mô tả</span>
                  <textarea
                    value={counterForm.description}
                    onChange={(e) => setCounterForm({...counterForm, description: e.target.value})}
                    rows={3}
                    className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm"
                    required
                  />
                </label>
                <div className="grid gap-4 md:grid-cols-2">
                  <label className="space-y-2">
                    <span className="text-sm font-medium text-slate-700">Thời gian tối thiểu (ngày)</span>
                    <input
                      type="number"
                      value={counterForm.total_days_min}
                      onChange={(e) => setCounterForm({...counterForm, total_days_min: e.target.value})}
                      className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm"
                      required
                    />
                  </label>
                  <label className="space-y-2">
                    <span className="text-sm font-medium text-slate-700">Thời gian tối đa (ngày)</span>
                    <input
                      type="number"
                      value={counterForm.total_days_max}
                      onChange={(e) => setCounterForm({...counterForm, total_days_max: e.target.value})}
                      className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm"
                      required
                    />
                  </label>
                </div>
                <label className="space-y-2">
                  <span className="text-sm font-medium text-slate-700">Chi phí (VND)</span>
                  <input
                    type="number"
                    value={counterForm.cost}
                    onChange={(e) => setCounterForm({...counterForm, cost: e.target.value})}
                    className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm"
                    required
                  />
                </label>
                <label className="space-y-2">
                  <span className="text-sm font-medium text-slate-700">Ghi chú (tùy chọn)</span>
                  <textarea
                    value={counterForm.note}
                    onChange={(e) => setCounterForm({...counterForm, note: e.target.value})}
                    rows={2}
                    className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm"
                  />
                </label>
                
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-slate-700">Phases</span>
                    <Button size="sm" variant="secondary" onClick={addCounterPhase}>Thêm phase</Button>
                  </div>
                  {counterForm.phases.map((phase, index) => (
                    <div key={index} className="border border-slate-200 rounded-lg p-3 space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-xs font-semibold text-slate-500">Phase {index + 1}</span>
                        {counterForm.phases.length > 1 && (
                          <button type="button" onClick={() => removeCounterPhase(index)} className="text-rose-600 text-xs">Xóa</button>
                        )}
                      </div>
                      <input
                        type="text"
                        value={phase.title}
                        onChange={(e) => updateCounterPhase(index, 'title', e.target.value)}
                        placeholder="Tiêu đề"
                        className="w-full rounded border border-slate-300 bg-white px-2 py-1 text-xs"
                      />
                      <textarea
                        value={phase.description}
                        onChange={(e) => updateCounterPhase(index, 'description', e.target.value)}
                        placeholder="Mô tả"
                        rows={2}
                        className="w-full rounded border border-slate-300 bg-white px-2 py-1 text-xs"
                      />
                      <div className="grid grid-cols-2 gap-2">
                        <input
                          type="number"
                          value={phase.estimated_days}
                          onChange={(e) => updateCounterPhase(index, 'estimated_days', e.target.value)}
                          placeholder="Số ngày"
                          className="rounded border border-slate-300 bg-white px-2 py-1 text-xs"
                        />
                        <input
                          type="number"
                          value={phase.estimated_cost}
                          onChange={(e) => updateCounterPhase(index, 'estimated_cost', e.target.value)}
                          placeholder="Chi phí"
                          className="rounded border border-slate-300 bg-white px-2 py-1 text-xs"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="flex justify-end gap-3 mt-6">
                <Button variant="secondary" onClick={() => setShowCounterModal(false)}>
                  Hủy
                </Button>
                <Button onClick={handleCounterProposal} disabled={actionLoading}>
                  {actionLoading ? 'Đang gửi...' : 'Gửi đề xuất phản đối'}
                </Button>
              </div>
            </Card>
          </div>
        ) : null}
      </section>
    </>
  )
}
