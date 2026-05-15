import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { FileText, Package, Eye } from 'lucide-react'
import { Card } from '../../../components/ui/Card'
import { Badge } from '../../../components/ui/Badge'
import { Button } from '../../../components/ui/Button'
import { SectionHeading } from '../../../components/shared/SectionHeading'
import { Seo } from '../../../core/seo/Seo'
import { ROUTES } from '../../../core/constants/routes'
import { useAuth } from '../../auth/hooks/useAuth'
import { listOrders, getPurchasedPackages } from '../services/ordersApi'

const formatMoney = (value) => `${(value || 0).toLocaleString('vi-VN')}đ`

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

function formatDate(value) {
  if (!value) return 'Đang cập nhật'
  const parsed = new Date(value)
  if (Number.isNaN(parsed.getTime())) return 'Đang cập nhật'
  return parsed.toLocaleDateString('vi-VN')
}

export function OrdersListPage() {
  const { accessToken } = useAuth()
  const [orders, setOrders] = useState([])
  const [packages, setPackages] = useState([])
  const [activeTab, setActiveTab] = useState('orders')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let mounted = true

    async function loadData() {
      if (!accessToken) {
        if (mounted) {
          setOrders([])
          setPackages([])
          setLoading(false)
        }
        return
      }

      setLoading(true)
      setError('')
      try {
        const [ordersData, packagesData] = await Promise.all([
          listOrders(accessToken),
          getPurchasedPackages(accessToken),
        ])
        
        if (!mounted) return
        
        setOrders(Array.isArray(ordersData) ? ordersData : [])
        setPackages(Array.isArray(packagesData) ? packagesData : [])
      } catch (err) {
        if (!mounted) return
        setError(err.message || 'Không thể tải đơn hàng. Vui lòng thử lại.')
        setOrders([])
        setPackages([])
      } finally {
        if (mounted) setLoading(false)
      }
    }

    loadData()

    return () => { mounted = false }
  }, [accessToken])

  return (
    <>
      <Seo title="Đơn hàng" description="Lịch sử đơn hàng và gói đã mua." />
      <section className="space-y-6">
        <SectionHeading eyebrow="Orders" title="Đơn hàng của tôi" description="Xem lịch sử đơn hàng và các gói đã mua." />

        {error ? (
          <Card className="border border-rose-200 bg-rose-50">
            <p className="text-sm font-medium text-rose-700">{error}</p>
          </Card>
        ) : null}

        <div className="flex flex-wrap gap-2 border-b border-slate-200 pb-3">
          <button
            type="button"
            onClick={() => setActiveTab('orders')}
            className={`inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-semibold transition ${
              activeTab === 'orders'
                ? 'border-indigo-600 bg-indigo-50 text-indigo-700'
                : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300'
            }`}
          >
            <FileText size={14} /> Tất cả đơn hàng
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('packages')}
            className={`inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-semibold transition ${
              activeTab === 'packages'
                ? 'border-indigo-600 bg-indigo-50 text-indigo-700'
                : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300'
            }`}
          >
            <Package size={14} /> Gói đã mua
          </button>
        </div>

        {loading ? (
          <Card>
            <p className="text-sm text-slate-500">Đang tải dữ liệu...</p>
          </Card>
        ) : null}

        {!loading && activeTab === 'orders' && orders.length === 0 ? (
          <Card className="py-12 text-center">
            <FileText size={48} className="mx-auto text-slate-300" />
            <p className="mt-4 text-lg font-semibold text-slate-900">Chưa có đơn hàng nào</p>
            <p className="mt-2 text-sm text-slate-500">Hãy mua sản phẩm để xem lịch sử đơn hàng</p>
          </Card>
        ) : null}

        {!loading && activeTab === 'packages' && packages.length === 0 ? (
          <Card className="py-12 text-center">
            <Package size={48} className="mx-auto text-slate-300" />
            <p className="mt-4 text-lg font-semibold text-slate-900">Chưa mua gói nào</p>
            <p className="mt-2 text-sm text-slate-500">Các gói đã mua sẽ hiển thị ở đây</p>
          </Card>
        ) : null}

        {!loading && activeTab === 'orders' && orders.length > 0 ? (
          <Card className="divide-y divide-slate-200 p-0">
            {orders.map((order) => (
              <div key={order.id} className="grid gap-3 p-4 md:grid-cols-[1fr_auto_auto] md:items-center">
                <div>
                  <div className="mb-1 flex flex-wrap items-center gap-2">
                    <span className="text-xs font-semibold text-slate-500">ORD-{order.id.slice(0, 8)}</span>
                    <Badge variant={ORDER_STATUS_VARIANTS[order.status] || 'neutral'}>
                      {ORDER_STATUS_LABELS[order.status] || order.status}
                    </Badge>
                  </div>
                  <p className="text-sm text-slate-600">{order.items?.length || 0} sản phẩm</p>
                  <p className="text-xs text-slate-500">{formatDate(order.created_at)}</p>
                </div>
                <p className="text-lg font-bold text-slate-900">{formatMoney(order.amount)}</p>
                <Link to={`/u/orders/${order.id}`}>
                  <Button size="sm" variant="ghost">
                    <Eye size={14} className="mr-1" /> Chi tiết
                  </Button>
                </Link>
              </div>
            ))}
          </Card>
        ) : null}

        {!loading && activeTab === 'packages' && packages.length > 0 ? (
          <Card className="divide-y divide-slate-200 p-0">
            {packages.map((pkg) => (
              <div key={pkg.id} className="grid gap-3 p-4 md:grid-cols-[1fr_auto_auto] md:items-center">
                <div>
                  <div className="mb-1 flex flex-wrap items-center gap-2">
                    <span className="text-xs font-semibold text-slate-500">PKG-{pkg.id.slice(0, 8)}</span>
                    <Badge variant="success">Đã thanh toán</Badge>
                  </div>
                  <p className="text-sm text-slate-600">{pkg.items?.length || 0} sản phẩm</p>
                  <p className="text-xs text-slate-500">{formatDate(pkg.created_at)}</p>
                </div>
                <p className="text-lg font-bold text-slate-900">{formatMoney(pkg.amount)}</p>
                <Link to={`/u/orders/${pkg.id}`}>
                  <Button size="sm" variant="ghost">
                    <Eye size={14} className="mr-1" /> Chi tiết
                  </Button>
                </Link>
              </div>
            ))}
          </Card>
        ) : null}
      </section>
    </>
  )
}
