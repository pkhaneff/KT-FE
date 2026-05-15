import { useEffect, useState } from 'react'
import { FileText } from 'lucide-react'
import { Card } from '../../../components/ui/Card'
import { Badge } from '../../../components/ui/Badge'
import { SectionHeading } from '../../../components/shared/SectionHeading'
import { Seo } from '../../../core/seo/Seo'
import { useAuth } from '../../auth/hooks/useAuth'
import { adminListProductRequests } from '../services/adminProductApi'

const formatMoney = (value) => `${(value || 0).toLocaleString('vi-VN')}đ`

function formatDate(value) {
  if (!value) return 'Đang cập nhật'
  const parsed = new Date(value)
  if (Number.isNaN(parsed.getTime())) return 'Đang cập nhật'
  return parsed.toLocaleDateString('vi-VN')
}

const STATUS_LABELS = {
  new: 'Mới tạo',
  under_review: 'Đang xem xét',
  approved: 'Đã duyệt',
  rejected: 'Đã từ chối',
  completed: 'Hoàn thành',
}

const STATUS_VARIANTS = {
  new: 'warning',
  under_review: 'warning',
  approved: 'success',
  rejected: 'danger',
  completed: 'success',
}

export function AdminProductRequestsPage() {
  const { accessToken } = useAuth()
  const [requests, setRequests] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let mounted = true

    async function loadData() {
      if (!accessToken) {
        if (mounted) {
          setRequests([])
          setLoading(false)
        }
        return
      }

      setLoading(true)
      setError('')
      try {
        const data = await adminListProductRequests(accessToken)
        if (mounted) {
          setRequests(Array.isArray(data) ? data : [])
        }
      } catch (err) {
        if (mounted) {
          setError(err.message || 'Không thể tải yêu cầu sản phẩm. Vui lòng thử lại.')
          setRequests([])
        }
      } finally {
        if (mounted) setLoading(false)
      }
    }

    loadData()

    return () => { mounted = false }
  }, [accessToken])

  return (
    <>
      <Seo title="Quản lý yêu cầu sản phẩm" description="Xem và quản lý các yêu cầu sản phẩm từ người dùng." />
      <section className="space-y-6">
        <SectionHeading eyebrow="Admin" title="Quản lý yêu cầu sản phẩm" description="Xem và theo dõi các yêu cầu sản phẩm tùy chỉnh từ người dùng." />

        {error ? (
          <Card className="border border-rose-200 bg-rose-50">
            <p className="text-sm font-medium text-rose-700">{error}</p>
          </Card>
        ) : null}

        {loading ? (
          <Card>
            <p className="text-sm text-slate-500">Đang tải dữ liệu...</p>
          </Card>
        ) : null}

        {!loading && requests.length === 0 ? (
          <Card className="py-12 text-center">
            <FileText size={48} className="mx-auto text-slate-300" />
            <p className="mt-4 text-lg font-semibold text-slate-900">Chưa có yêu cầu sản phẩm nào</p>
            <p className="mt-2 text-sm text-slate-500">Các yêu cầu sản phẩm sẽ hiển thị ở đây</p>
          </Card>
        ) : null}

        {!loading && requests.length > 0 ? (
          <Card className="divide-y divide-slate-200 p-0">
            {requests.map((request) => (
              <div key={request.id} className="grid gap-3 p-4 md:grid-cols-[1fr_auto_auto] md:items-center">
                <div>
                  <div className="mb-1 flex flex-wrap items-center gap-2">
                    <span className="text-xs font-semibold text-slate-500">PR-{request.id.slice(0, 8)}</span>
                    <Badge variant={STATUS_VARIANTS[request.status] || 'neutral'}>
                      {STATUS_LABELS[request.status] || request.status}
                    </Badge>
                  </div>
                  <p className="text-sm font-semibold text-slate-900">{request.name}</p>
                  <p className="text-xs text-slate-500">{request.product_type_name || 'Sản phẩm'} • {request.user_email || 'Người dùng'}</p>
                  {request.technology ? (
                    <p className="text-xs text-slate-500">Công nghệ: {request.technology}</p>
                  ) : null}
                  <p className="text-xs text-slate-500">{formatDate(request.created_at)}</p>
                </div>
                {request.budget ? (
                  <p className="text-sm font-bold text-slate-900">{formatMoney(request.budget)}</p>
                ) : null}
                <div className="text-right">
                  <Badge variant={STATUS_VARIANTS[request.status] || 'neutral'}>
                    {STATUS_LABELS[request.status] || request.status}
                  </Badge>
                </div>
              </div>
            ))}
          </Card>
        ) : null}
      </section>
    </>
  )
}
