import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom'
import { CheckCircle2, LoaderCircle, QrCode, RefreshCw } from 'lucide-react'
import { Card } from '../../../components/ui/Card'
import { Button } from '../../../components/ui/Button'
import { Badge } from '../../../components/ui/Badge'
import { Seo } from '../../../core/seo/Seo'
import { ROUTES } from '../../../core/constants/routes'
import { useCart } from '../../../core/cart/CartContext'
import { useAuth } from '../../auth'
import {
  buildOrderEventsUrl,
  checkoutOrder,
  createOrderPayment,
  syncOrderPayment,
} from '../../user/services/orderApi'

const formatMoney = (value) => `${(value || 0).toLocaleString('vi-VN')}đ`

function buildIdempotencyKey(prefix) {
  const random = Math.random().toString(36).slice(2, 10)
  return `${prefix}-${Date.now()}-${random}`
}

export function CheckoutPage() {
  const { isAuthenticated, accessToken } = useAuth()
  const { refreshCart } = useCart()
  const navigate = useNavigate()
  const location = useLocation()
  const selectedCartItemIds = useMemo(
    () => location.state?.selectedCartItemIds || [],
    [location.state],
  )

  const [session, setSession] = useState(null)
  const [step, setStep] = useState('loading')
  const [loading, setLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')
  const [countdown, setCountdown] = useState(3)
  const eventSourceRef = useRef(null)

  const markPaymentSuccess = useCallback(() => {
    setStep('success')
    setCountdown(3)
    window.setTimeout(() => {
      refreshCart()
    }, 1200)
  }, [refreshCart])

  const createCheckoutSession = useCallback(async () => {
    if (!accessToken) return
    if (!selectedCartItemIds.length) {
      setStep('empty')
      return
    }

    setLoading(true)
    setErrorMessage('')

    try {
      const order = await checkoutOrder(accessToken, selectedCartItemIds, buildIdempotencyKey('checkout'))
      const paymentSession = await createOrderPayment(accessToken, order.id, buildIdempotencyKey(`pay-${order.id}`))
      setSession(paymentSession)
      const isPaid = paymentSession.payment.payment_status === 'success'
      setStep(isPaid ? 'success' : 'pending')
      if (isPaid) {
        markPaymentSuccess()
      }
    } catch (error) {
      setErrorMessage(error?.message || 'Không thể tạo phiên thanh toán. Vui lòng thử lại.')
      setStep('error')
    } finally {
      setLoading(false)
    }
  }, [accessToken, markPaymentSuccess, selectedCartItemIds])

  useEffect(() => {
    createCheckoutSession()
  }, [createCheckoutSession])

  const syncPayment = useCallback(async ({ silent = false } = {}) => {
    if (!accessToken || !session) return
    if (!silent) {
      setLoading(true)
    }
    try {
      const synced = await syncOrderPayment(accessToken, session.order.id, session.payment.id)
      setSession(synced)
      if (synced.payment.payment_status === 'success') {
        markPaymentSuccess()
      }
    } catch (error) {
      if (!silent) {
        setErrorMessage(error?.message || 'Không thể đồng bộ trạng thái thanh toán. Vui lòng thử lại.')
      }
    } finally {
      if (!silent) {
        setLoading(false)
      }
    }
  }, [accessToken, markPaymentSuccess, session])

  useEffect(() => {
    if (step !== 'pending' || !session || !accessToken) return

    const eventsUrl = `${buildOrderEventsUrl(session.order.id)}?token=${encodeURIComponent(accessToken)}`
    const eventSource = new EventSource(eventsUrl)
    eventSourceRef.current = eventSource

    eventSource.onmessage = (evt) => {
      try {
        const payload = JSON.parse(evt.data || '{}')
        if (payload?.type === 'payment_success') {
          markPaymentSuccess()
          window.setTimeout(() => {
            syncPayment({ silent: true })
          }, 1500)
        }
      } catch {
        // ignore malformed message
      }
    }

    eventSource.onerror = () => {
      eventSource.close()
      eventSourceRef.current = null
    }

    return () => {
      eventSource.close()
      eventSourceRef.current = null
    }
  }, [accessToken, markPaymentSuccess, session, step, syncPayment])

  useEffect(() => {
    if (step !== 'pending') return undefined
    const intervalId = setInterval(() => {
      syncPayment({ silent: true })
    }, 5000)
    return () => clearInterval(intervalId)
  }, [step, syncPayment])

  useEffect(() => {
    if (step !== 'success') return
    if (countdown <= 0) {
      navigate(ROUTES.USER_DASHBOARD, { replace: true })
      return
    }
    const timer = setTimeout(() => setCountdown((c) => c - 1), 1000)
    return () => clearTimeout(timer)
  }, [step, countdown, navigate])

  if (!isAuthenticated) {
    return <Navigate to={ROUTES.PUBLIC_LOGIN} replace />
  }

  return (
    <>
      <Seo title="Thanh toán" description="Thanh toán sản phẩm bằng SePay QR." />

      <section className="mx-auto max-w-5xl space-y-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-500 dark:text-slate-400">Thanh toán</p>
          <h1 className="mt-1 text-3xl font-bold text-slate-900 dark:text-slate-100">Xác nhận và thanh toán</h1>
        </div>

        {errorMessage ? (
          <Card className="border border-rose-200 bg-rose-50 dark:border-rose-900/40 dark:bg-rose-950/30">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <p className="text-sm font-medium text-rose-700 dark:text-rose-300">{errorMessage}</p>
              <Button size="sm" variant="secondary" onClick={() => { setErrorMessage(''); createCheckoutSession() }}>
                Thử lại
              </Button>
            </div>
          </Card>
        ) : null}

        {step === 'loading' ? (
          <Card className="flex items-center justify-center gap-3 py-12">
            <LoaderCircle className="animate-spin text-slate-400" size={22} aria-hidden="true" />
            <p className="text-sm text-slate-500 dark:text-slate-400">Đang tạo đơn hàng…</p>
          </Card>
        ) : null}

        {step === 'empty' ? (
          <Card className="py-10 text-center">
            <p className="text-sm text-slate-500 dark:text-slate-400">Chưa chọn sản phẩm để thanh toán.</p>
            <Link to={ROUTES.PUBLIC_CART} className="mt-4 inline-flex">
              <Button size="sm">Quay lại giỏ hàng</Button>
            </Link>
          </Card>
        ) : null}

        {step === 'pending' && session ? (
          <div className="grid gap-4 lg:grid-cols-[1fr_300px]">
            <div className="space-y-3">
              <Card className="space-y-2">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">Đơn hàng #{session.order.id}</p>
                  <Badge variant={session.payment.payment_status === 'success' ? 'success' : 'warning'}>
                    {session.payment.payment_status === 'success' ? 'Đã thanh toán' : 'Chờ thanh toán'}
                  </Badge>
                </div>
                <div className="space-y-2">
                  {session.order.items.map((item) => (
                    <div key={item.id} className="flex items-center justify-between text-sm">
                      <span>{item.product_name || `Sản phẩm #${item.product_id}`} x {item.qty}</span>
                      <span className="font-semibold">{formatMoney(item.line_total)}</span>
                    </div>
                  ))}
                </div>
                <div className="pt-2 text-sm text-slate-600 dark:text-slate-300">
                  Nội dung CK: <code className="rounded bg-slate-100 px-1.5 py-0.5 font-mono text-xs text-slate-800 dark:bg-slate-800 dark:text-slate-200">{session.sepay?.transfer_content || session.payment.transaction_code}</code>
                </div>
              </Card>

              <div className="flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 dark:border-slate-700 dark:bg-slate-800/50">
                <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">Tổng cộng</p>
                <p className="text-2xl font-black text-slate-900 dark:text-slate-100">{formatMoney(session.payment.amount)}</p>
              </div>
            </div>

            <aside className="space-y-4">
              <Card className="space-y-4">
                <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">Quét QR để thanh toán</p>

                {session.sepay?.qr_image_url ? (
                  <img
                    src={session.sepay.qr_image_url}
                    alt="SePay QR thanh toán"
                    className="mx-auto block h-52 w-52 rounded-xl border border-slate-200 dark:border-slate-700"
                  />
                ) : (
                  <div className="mx-auto flex h-52 w-52 flex-col items-center justify-center rounded-xl border border-dashed border-slate-300 dark:border-slate-600">
                    <QrCode size={32} className="text-slate-400" aria-hidden="true" />
                    <p className="mt-2 text-xs text-slate-400">QR chưa cấu hình</p>
                  </div>
                )}

                <div className="space-y-1 rounded-lg bg-slate-50 px-3 py-2.5 text-xs text-slate-600 dark:bg-slate-800/60 dark:text-slate-300">
                  {session.sepay?.bank_name ? <p>Ngân hàng: <span className="font-semibold text-slate-900 dark:text-slate-100">{session.sepay.bank_name}</span></p> : null}
                  {session.sepay?.bank_account_number ? <p>Số TK: <span className="font-semibold text-slate-900 dark:text-slate-100">{session.sepay.bank_account_number}</span></p> : null}
                  {session.sepay?.bank_account_holder ? <p>Chủ TK: <span className="font-semibold text-slate-900 dark:text-slate-100">{session.sepay.bank_account_holder}</span></p> : null}
                  <p>Nội dung: <code className="rounded bg-slate-200 px-1 font-mono text-slate-800 dark:bg-slate-700 dark:text-slate-200">{session.sepay?.transfer_content || '-'}</code></p>
                  <p>Số tiền: <span className="font-semibold text-slate-900 dark:text-slate-100">{formatMoney(session.payment.amount)}</span></p>
                </div>

                <Button
                  size="sm"
                  className="w-full justify-center"
                  onClick={syncPayment}
                  disabled={loading}
                >
                  {loading
                    ? <LoaderCircle className="animate-spin" size={15} aria-hidden="true" />
                    : <RefreshCw size={15} aria-hidden="true" />}
                  Đã chuyển khoản xong
                </Button>
              </Card>
            </aside>
          </div>
        ) : null}

        {step === 'success' ? (
          <Card className="flex flex-col items-center gap-6 py-16 text-center border-emerald-200 bg-emerald-50 dark:border-emerald-900/40 dark:bg-emerald-950/30">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-emerald-100 dark:bg-emerald-900/50">
              <CheckCircle2 size={44} className="text-emerald-600 dark:text-emerald-300" aria-hidden="true" />
            </div>
            <div className="space-y-2">
              <p className="text-2xl font-bold text-emerald-700 dark:text-emerald-200">Thanh toán thành công!</p>
              <p className="text-sm text-emerald-700/80 dark:text-emerald-300">
                Hóa đơn đã được tạo và email sẽ được gửi nếu SMTP đã cấu hình.
              </p>
            </div>
            <div className="space-y-3">
              <p className="text-sm text-emerald-600 dark:text-emerald-400">
                Tự động chuyển về dashboard sau <span className="font-bold">{countdown}</span> giây…
              </p>
              <Link to={ROUTES.USER_DASHBOARD}>
                <Button size="sm">Tiếp tục</Button>
              </Link>
            </div>
          </Card>
        ) : null}
      </section>
    </>
  )
}
