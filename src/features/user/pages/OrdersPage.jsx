import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { FileText, Plus } from 'lucide-react'
import { Card } from '../../../components/ui/Card'
import { Badge } from '../../../components/ui/Badge'
import { Button } from '../../../components/ui/Button'
import { SectionHeading } from '../../../components/shared/SectionHeading'
import { Seo } from '../../../core/seo/Seo'
import { ROUTES } from '../../../core/constants/routes'
import { useAuth } from '../../auth'
import { listMyInvoices } from '../services/orderApi'

const formatMoney = (value) => `${(value || 0).toLocaleString('vi-VN')}đ`

export function OrdersPage() {
  const { accessToken } = useAuth()
  const [invoices, setInvoices] = useState([])
  const [loading, setLoading] = useState(true)
  const [errorMessage, setErrorMessage] = useState('')

  useEffect(() => {
    if (!accessToken) {
      return
    }

    let mounted = true
    setLoading(true)
    setErrorMessage('')

    listMyInvoices(accessToken)
      .then((items) => {
        if (!mounted) {
          return
        }
        setInvoices(Array.isArray(items) ? items : [])
      })
      .catch((error) => {
        if (!mounted) {
          return
        }
        setErrorMessage(error?.message || 'Không thể tải hóa đơn. Vui lòng thử lại.')
      })
      .finally(() => {
        if (mounted) {
          setLoading(false)
        }
      })

    return () => {
      mounted = false
    }
  }, [accessToken])

  return (
    <>
      <Seo title="Hóa đơn của tôi" description="Danh sách hóa đơn được tạo sau khi thanh toán thành công." />
      <section className="space-y-6">
        <SectionHeading eyebrow="Invoices" title="Hóa đơn của tôi" description="Các hóa đơn được hệ thống tạo sau khi thanh toán SePay thành công." />

        <div className="flex justify-end">
          <Link to={ROUTES.USER_WIZARD}>
            <Button size="sm">
              <Plus size={14} aria-hidden="true" /> Tạo yêu cầu mới
            </Button>
          </Link>
        </div>

        {errorMessage ? (
          <Card className="border border-rose-200 bg-rose-50 dark:border-rose-900/40 dark:bg-rose-950/30">
            <p className="text-sm font-medium text-rose-700 dark:text-rose-300">{errorMessage}</p>
          </Card>
        ) : null}

        <Card className="divide-y divide-slate-200 p-0">
          {loading ? (
            <div className="p-8 text-center">
              <p className="text-sm text-slate-500">Đang tải dữ liệu hóa đơn...</p>
            </div>
          ) : null}

          {!loading && invoices.length ? invoices.map((invoice) => (
            <div key={invoice.id} className="grid gap-3 p-4 md:grid-cols-[1fr_190px_180px] md:items-center">
              <div>
                <div className="mb-1 flex flex-wrap items-center gap-2">
                  <span className="text-xs font-semibold text-slate-500">{invoice.invoice_code}</span>
                  <Badge variant="success">Đã thanh toán</Badge>
                </div>
                <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">Đơn hàng #{invoice.order_id}</p>
                <p className="text-xs text-slate-500 dark:text-slate-400">Mã thanh toán #{invoice.payment_id}</p>
              </div>

              <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">{formatMoney(invoice.amount)}</p>

              <div className="flex items-center justify-between gap-2 md:justify-end">
                <span className="text-xs text-slate-500 dark:text-slate-400">{new Date(invoice.issued_at).toLocaleString('vi-VN')}</span>
                <Badge variant={invoice.email_sent_at ? 'success' : 'warning'}>
                  {invoice.email_sent_at ? 'Đã gửi mail' : 'Mail chờ gửi'}
                </Badge>
              </div>
            </div>
          )) : null}

          {!loading && !invoices.length ? (
            <div className="p-8 text-center">
              <FileText className="mx-auto text-slate-400" size={24} aria-hidden="true" />
              <p className="mt-2 text-sm font-semibold text-slate-900">Chưa có hóa đơn</p>
              <p className="mt-1 text-sm text-slate-500">Hóa đơn sẽ xuất hiện sau khi bạn thanh toán thành công.</p>
            </div>
          ) : null}
        </Card>
      </section>
    </>
  )
}
