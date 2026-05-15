import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Minus, Plus, Trash2, ShoppingBag } from 'lucide-react'
import { Card } from '../../../components/ui/Card'
import { Button } from '../../../components/ui/Button'
import { SectionHeading } from '../../../components/shared/SectionHeading'
import { Seo } from '../../../core/seo/Seo'
import { ROUTES } from '../../../core/constants/routes'
import { useAuth } from '../../auth/hooks/useAuth'
import { listCartItems, updateCartItemQty, removeCartItem, clearCartItems, checkoutOrder } from '../services/orderApi'

const formatMoney = (value) => `${(value || 0).toLocaleString('vi-VN')}đ`

export function CartPage() {
  const { accessToken } = useAuth()
  const navigate = useNavigate()
  const [cartItems, setCartItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [updating, setUpdating] = useState(new Set())
  const [checkingOut, setCheckingOut] = useState(false)

  useEffect(() => {
    let mounted = true

    async function loadCart() {
      if (!accessToken) {
        if (mounted) {
          setCartItems([])
          setLoading(false)
        }
        return
      }

      setLoading(true)
      setError('')
      try {
        const data = await listCartItems(accessToken)
        if (mounted) {
          setCartItems(Array.isArray(data) ? data : [])
        }
      } catch (err) {
        if (mounted) {
          setError(err.message || 'Không thể tải giỏ hàng. Vui lòng thử lại.')
          setCartItems([])
        }
      } finally {
        if (mounted) setLoading(false)
      }
    }

    loadCart()

    return () => { mounted = false }
  }, [accessToken])

  const handleUpdateQty = async (productId, newQty) => {
    if (!accessToken || updating.has(productId)) return

    setUpdating((prev) => new Set([...prev, productId]))
    setError('')
    try {
      if (newQty <= 0) {
        await removeCartItem(accessToken, productId)
        setCartItems((prev) => prev.filter((item) => item.product_id !== productId))
      } else {
        const updated = await updateCartItemQty(accessToken, productId, newQty)
        setCartItems((prev) => 
          prev.map((item) => 
            item.product_id === productId ? { ...item, qty: updated.qty } : item
          )
        )
      }
    } catch (err) {
      setError(err.message || 'Không thể cập nhật số lượng. Vui lòng thử lại.')
    } finally {
      setUpdating((prev) => {
        const next = new Set(prev)
        next.delete(productId)
        return next
      })
    }
  }

  const handleRemoveItem = async (productId) => {
    if (!accessToken || updating.has(productId)) return

    setUpdating((prev) => new Set([...prev, productId]))
    setError('')
    try {
      await removeCartItem(accessToken, productId)
      setCartItems((prev) => prev.filter((item) => item.product_id !== productId))
    } catch (err) {
      setError(err.message || 'Không thể xóa sản phẩm. Vui lòng thử lại.')
    } finally {
      setUpdating((prev) => {
        const next = new Set(prev)
        next.delete(productId)
        return next
      })
    }
  }

  const handleClearCart = async () => {
    if (!accessToken) return

    if (!confirm('Bạn có chắc muốn xóa toàn bộ giỏ hàng?')) return

    setError('')
    try {
      await clearCartItems(accessToken)
      setCartItems([])
    } catch (err) {
      setError(err.message || 'Không thể xóa giỏ hàng. Vui lòng thử lại.')
    }
  }

  const handleCheckout = async () => {
    if (!accessToken || cartItems.length === 0 || checkingOut) return

    setCheckingOut(true)
    setError('')
    try {
      const cartItemIds = cartItems.map((item) => item.product_id)
      const idemKey = `checkout-${Date.now()}`
      const order = await checkoutOrder(accessToken, cartItemIds, idemKey)
      navigate(`/u/orders/${order.id}`)
    } catch (err) {
      setError(err.message || 'Không thể thanh toán. Vui lòng thử lại.')
    } finally {
      setCheckingOut(false)
    }
  }

  const totalAmount = cartItems.reduce((sum, item) => sum + (item.unit_price * item.qty), 0)

  return (
    <>
      <Seo title="Giỏ hàng" description="Quản lý sản phẩm trong giỏ hàng và thanh toán." />
      <section className="space-y-6">
        <SectionHeading eyebrow="Cart" title="Giỏ hàng" description="Xem và thanh toán các sản phẩm đã chọn." />

        {error ? (
          <Card className="border border-rose-200 bg-rose-50">
            <p className="text-sm font-medium text-rose-700">{error}</p>
          </Card>
        ) : null}

        {loading ? (
          <Card>
            <p className="text-sm text-slate-500">Đang tải giỏ hàng...</p>
          </Card>
        ) : null}

        {!loading && cartItems.length === 0 ? (
          <Card className="py-12 text-center">
            <ShoppingBag size={48} className="mx-auto text-slate-300" />
            <p className="mt-4 text-lg font-semibold text-slate-900">Giỏ hàng trống</p>
            <p className="mt-2 text-sm text-slate-500">Hãy thêm sản phẩm để tiếp tục</p>
            <Link to={ROUTES.USER_PRODUCTS} className="mt-4 inline-block">
              <Button>Xem sản phẩm</Button>
            </Link>
          </Card>
        ) : null}

        {!loading && cartItems.length > 0 ? (
          <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
            <Card className="divide-y divide-slate-200 p-0">
              {cartItems.map((item) => (
                <div key={item.product_id} className="grid gap-4 p-4 md:grid-cols-[1fr_auto_auto] md:items-center">
                  <div>
                    <h3 className="text-base font-semibold text-slate-900">{item.product_name}</h3>
                    <p className="text-sm text-slate-600">{formatMoney(item.unit_price)} / sản phẩm</p>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => handleUpdateQty(item.product_id, item.qty - 1)}
                      disabled={updating.has(item.product_id)}
                      className="rounded-lg border border-slate-300 bg-white p-2 hover:bg-slate-50 disabled:opacity-50"
                    >
                      <Minus size={14} />
                    </button>
                    <span className="w-8 text-center font-semibold">{item.qty}</span>
                    <button
                      type="button"
                      onClick={() => handleUpdateQty(item.product_id, item.qty + 1)}
                      disabled={updating.has(item.product_id)}
                      className="rounded-lg border border-slate-300 bg-white p-2 hover:bg-slate-50 disabled:opacity-50"
                    >
                      <Plus size={14} />
                    </button>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <p className="text-lg font-bold text-slate-900">{formatMoney(item.unit_price * item.qty)}</p>
                    <button
                      type="button"
                      onClick={() => handleRemoveItem(item.product_id)}
                      disabled={updating.has(item.product_id)}
                      className="rounded-lg border border-rose-200 bg-rose-50 p-2 text-rose-600 hover:bg-rose-100 disabled:opacity-50"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              ))}
            </Card>

            <Card className="space-y-4">
              <div className="flex items-center justify-between">
                <p className="text-sm text-slate-600">Tạm tính ({cartItems.length} sản phẩm)</p>
                <p className="text-lg font-bold text-slate-900">{formatMoney(totalAmount)}</p>
              </div>
              
              <div className="border-t border-slate-200 pt-4">
                <div className="flex items-center justify-between">
                  <p className="text-base font-semibold text-slate-900">Tổng cộng</p>
                  <p className="text-2xl font-bold text-indigo-600">{formatMoney(totalAmount)}</p>
                </div>
              </div>

              <Button
                className="w-full"
                onClick={handleCheckout}
                disabled={checkingOut || cartItems.length === 0}
              >
                {checkingOut ? 'Đang xử lý...' : 'Thanh toán ngay'}
              </Button>

              <Button
                variant="secondary"
                className="w-full"
                onClick={handleClearCart}
                disabled={cartItems.length === 0}
              >
                Xóa toàn bộ giỏ hàng
              </Button>
            </Card>
          </div>
        ) : null}
      </section>
    </>
  )
}
