import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Plus, FileText } from 'lucide-react'
import { Card } from '../../../components/ui/Card'
import { Badge } from '../../../components/ui/Badge'
import { Button } from '../../../components/ui/Button'
import { SectionHeading } from '../../../components/shared/SectionHeading'
import { Seo } from '../../../core/seo/Seo'
import { ROUTES } from '../../../core/constants/routes'
import { useAuth } from '../../auth/hooks/useAuth'
import { listMyProductRequests, listProductTypes } from '../services/productApi'

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

export function ProductRequestsPage() {
  const { accessToken } = useAuth()
  const [requests, setRequests] = useState([])
  const [productTypes, setProductTypes] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [createForm, setCreateForm] = useState({
    product_type_id: '',
    name: '',
    budget: '',
    technology: '',
    requirement: '',
    deliverables: '',
    deadline: '',
  })

  useEffect(() => {
    let mounted = true

    async function loadData() {
      if (!accessToken) {
        if (mounted) {
          setRequests([])
          setProductTypes([])
          setLoading(false)
        }
        return
      }

      setLoading(true)
      setError('')
      try {
        const [requestsData, typesData] = await Promise.all([
          listMyProductRequests(accessToken),
          listProductTypes(),
        ])
        
        if (!mounted) return
        
        setRequests(Array.isArray(requestsData) ? requestsData : [])
        setProductTypes(Array.isArray(typesData) ? typesData : [])
      } catch (err) {
        if (!mounted) return
        setError(err.message || 'Không thể tải yêu cầu sản phẩm. Vui lòng thử lại.')
        setRequests([])
        setProductTypes([])
      } finally {
        if (mounted) setLoading(false)
      }
    }

    loadData()

    return () => { mounted = false }
  }, [accessToken])

  const handleCreateRequest = async (e) => {
    e.preventDefault()
    if (!accessToken) return

    try {
      const payload = {
        product_type_id: createForm.product_type_id,
        name: createForm.name,
        budget: parseFloat(createForm.budget) || null,
        technology: createForm.technology || null,
        requirement: createForm.requirement,
        deliverables: createForm.deliverables || createForm.requirement,
        deadline: createForm.deadline || null,
      }
      
      // Would need to implement createProductRequest in API
      alert('Tính năng đang phát triển')
      setShowCreateModal(false)
    } catch (err) {
      setError(err.message || 'Không thể tạo yêu cầu. Vui lòng thử lại.')
    }
  }

  return (
    <>
      <Seo title="Yêu cầu sản phẩm" description="Quản lý các yêu cầu sản phẩm tùy chỉnh." />
      <section className="space-y-6">
        <SectionHeading eyebrow="Product Requests" title="Yêu cầu sản phẩm" description="Tạo và theo dõi các yêu cầu sản phẩm tùy chỉnh." />

        <div className="flex justify-end">
          <Button size="sm" onClick={() => setShowCreateModal(true)}>
            <Plus size={14} aria-hidden="true" /> Tạo yêu cầu mới
          </Button>
        </div>

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
            <p className="mt-4 text-lg font-semibold text-slate-900">Chưa có yêu cầu nào</p>
            <p className="mt-2 text-sm text-slate-500">Tạo yêu cầu đầu tiên để bắt đầu</p>
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
                  <p className="text-xs text-slate-500">{request.product_type_name || 'Sản phẩm'} • {formatDate(request.created_at)}</p>
                </div>
                {request.budget ? (
                  <p className="text-sm font-bold text-slate-900">{formatMoney(request.budget)}</p>
                ) : null}
                <Link to={`/u/product-requests/${request.id}`}>
                  <Button size="sm" variant="ghost">Chi tiết</Button>
                </Link>
              </div>
            ))}
          </Card>
        ) : null}

        {showCreateModal ? (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
            <Card className="max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6">
              <h2 className="text-xl font-bold text-slate-900 mb-4">Tạo yêu cầu sản phẩm mới</h2>
              <form onSubmit={handleCreateRequest} className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <label className="space-y-2">
                    <span className="text-sm font-medium text-slate-700">Loại sản phẩm</span>
                    <select
                      value={createForm.product_type_id}
                      onChange={(e) => setCreateForm({...createForm, product_type_id: e.target.value})}
                      className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm"
                      required
                    >
                      <option value="">Chọn loại sản phẩm</option>
                      {productTypes.map((type) => (
                        <option key={type.id} value={type.id}>{type.name}</option>
                      ))}
                    </select>
                  </label>
                  <label className="space-y-2">
                    <span className="text-sm font-medium text-slate-700">Tên sản phẩm</span>
                    <input
                      type="text"
                      value={createForm.name}
                      onChange={(e) => setCreateForm({...createForm, name: e.target.value})}
                      className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm"
                      required
                    />
                  </label>
                  <label className="space-y-2">
                    <span className="text-sm font-medium text-slate-700">Ngân sách (VND)</span>
                    <input
                      type="number"
                      value={createForm.budget}
                      onChange={(e) => setCreateForm({...createForm, budget: e.target.value})}
                      className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm"
                    />
                  </label>
                  <label className="space-y-2">
                    <span className="text-sm font-medium text-slate-700">Công nghệ</span>
                    <input
                      type="text"
                      value={createForm.technology}
                      onChange={(e) => setCreateForm({...createForm, technology: e.target.value})}
                      className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm"
                    />
                  </label>
                  <label className="space-y-2 md:col-span-2">
                    <span className="text-sm font-medium text-slate-700">Mô tả yêu cầu</span>
                    <textarea
                      value={createForm.requirement}
                      onChange={(e) => setCreateForm({...createForm, requirement: e.target.value})}
                      rows={4}
                      className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm"
                      required
                    />
                  </label>
                  <label className="space-y-2 md:col-span-2">
                    <span className="text-sm font-medium text-slate-700">Sản phẩm bàn giao</span>
                    <textarea
                      value={createForm.deliverables}
                      onChange={(e) => setCreateForm({...createForm, deliverables: e.target.value})}
                      rows={3}
                      className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm"
                    />
                  </label>
                  <label className="space-y-2 md:col-span-2">
                    <span className="text-sm font-medium text-slate-700">Deadline</span>
                    <input
                      type="date"
                      value={createForm.deadline}
                      onChange={(e) => setCreateForm({...createForm, deadline: e.target.value})}
                      className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm"
                    />
                  </label>
                </div>
                <div className="flex justify-end gap-3">
                  <Button type="button" variant="secondary" onClick={() => setShowCreateModal(false)}>
                    Hủy
                  </Button>
                  <Button type="submit">Tạo yêu cầu</Button>
                </div>
              </form>
            </Card>
          </div>
        ) : null}
      </section>
    </>
  )
}
