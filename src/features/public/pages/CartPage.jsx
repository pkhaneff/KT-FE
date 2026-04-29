import { useMemo, useState } from 'react'
import { Link, Navigate, useNavigate } from 'react-router-dom'
import { Minus, Plus, ShoppingBag, Trash2 } from 'lucide-react'
import { Card } from '../../../components/ui/Card'
import { Button } from '../../../components/ui/Button'
import { Seo } from '../../../core/seo/Seo'
import { ROUTES } from '../../../core/constants/routes'
import { useCart } from '../../../core/cart/CartContext'
import { useAuth } from '../../auth'

const formatMoney = (value) => `${(value || 0).toLocaleString('vi-VN')}đ`

export function CartPage() {
  const navigate = useNavigate()
  const { isAuthenticated } = useAuth()
  const {
    cartItems,
    updateCartItemQuantity,
    removeFromCart,
    clearCart,
    getCartTotal,
  } = useCart()
  const [selectedIds, setSelectedIds] = useState([])

  const selectedSet = useMemo(() => new Set(selectedIds), [selectedIds])
  const selectedItems = cartItems.filter((item) => selectedSet.has(item.id))
  const selectedTotal = selectedItems.reduce((sum, item) => sum + Number(item.line_total || 0), 0)
  const totalAmount = getCartTotal()

  const toggleAll = () => {
    if (selectedIds.length === cartItems.length) {
      setSelectedIds([])
      return
    }
    setSelectedIds(cartItems.map((item) => item.id))
  }

  const toggleItem = (itemId) => {
    setSelectedIds((prev) => (
      prev.includes(itemId) ? prev.filter((id) => id !== itemId) : [...prev, itemId]
    ))
  }

  const onCheckout = () => {
    if (!selectedIds.length) return
    navigate(ROUTES.PUBLIC_CHECKOUT, { state: { selectedCartItemIds: selectedIds } })
  }

  if (!isAuthenticated) {
    return <Navigate to={ROUTES.PUBLIC_LOGIN} replace />
  }

  return (
    <>
      <Seo title="Giỏ hàng" description="Xem sản phẩm đã chọn và tiến hành thanh toán." />

      <section className="mx-auto max-w-5xl space-y-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-500 dark:text-slate-400">Giỏ hàng</p>
          <h1 className="mt-1 text-3xl font-bold text-slate-900 dark:text-slate-100">Sản phẩm đã chọn</h1>
        </div>

        <Card className="space-y-4">
          {cartItems.length === 0 ? (
            <div className="rounded-xl border border-dashed border-slate-300 p-8 text-center dark:border-slate-700">
              <ShoppingBag size={28} className="mx-auto text-slate-400" aria-hidden="true" />
              <p className="mt-3 text-sm font-semibold text-slate-900 dark:text-slate-100">Giỏ hàng đang trống</p>
              <Link to={ROUTES.PUBLIC_PRICING} className="mt-4 inline-flex">
                <Button size="sm">Xem bảng giá</Button>
              </Link>
            </div>
          ) : (
            <>
              <div className="flex items-center justify-between">
                <label className="inline-flex items-center gap-2 text-sm font-medium text-slate-700 dark:text-slate-200">
                  <input type="checkbox" checked={selectedIds.length === cartItems.length} onChange={toggleAll} />
                  Chọn tất cả
                </label>
                <button
                  type="button"
                  onClick={clearCart}
                  className="text-sm font-semibold text-rose-600 hover:text-rose-700 dark:text-rose-400 dark:hover:text-rose-300"
                >
                  Xóa toàn bộ giỏ hàng
                </button>
              </div>

              <div className="divide-y divide-slate-200 dark:divide-slate-700">
                {cartItems.map((item) => (
                  <div key={item.id} className="grid gap-3 py-4 md:grid-cols-[28px_1fr_180px_140px_60px] md:items-center">
                    <input type="checkbox" checked={selectedSet.has(item.id)} onChange={() => toggleItem(item.id)} />
                    <div>
                      <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">{item.product_name}</p>
                      <p className="text-xs text-slate-500 dark:text-slate-400">Mã sản phẩm #{item.product_id}</p>
                    </div>

                    <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">{formatMoney(item.unit_price)}</p>

                    <div className="inline-flex h-9 items-center rounded-lg border border-slate-200 dark:border-slate-700">
                      <button
                        type="button"
                        onClick={() => updateCartItemQuantity(item.product_id, Math.max(1, item.qty - 1))}
                        className="inline-flex h-full w-9 items-center justify-center text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-700"
                      >
                        <Minus size={14} aria-hidden="true" />
                      </button>
                      <span className="inline-flex h-full min-w-10 items-center justify-center text-sm font-semibold">{item.qty}</span>
                      <button
                        type="button"
                        onClick={() => updateCartItemQuantity(item.product_id, item.qty + 1)}
                        className="inline-flex h-full w-9 items-center justify-center text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-700"
                      >
                        <Plus size={14} aria-hidden="true" />
                      </button>
                    </div>

                    <button
                      type="button"
                      onClick={() => removeFromCart(item.product_id)}
                      className="inline-flex h-9 w-9 items-center justify-center rounded-lg text-rose-600 transition hover:bg-rose-50 dark:text-rose-400 dark:hover:bg-rose-950/30"
                    >
                      <Trash2 size={16} aria-hidden="true" />
                    </button>
                  </div>
                ))}
              </div>

              <div className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-200 pt-4 dark:border-slate-700">
                <div className="text-right">
                  <p className="text-xs text-slate-500 dark:text-slate-400">Tổng giỏ hàng</p>
                  <p className="text-xl font-black text-slate-900 dark:text-slate-100">{formatMoney(totalAmount)}</p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-slate-500 dark:text-slate-400">Tổng sản phẩm đã chọn</p>
                  <p className="text-2xl font-black text-slate-900 dark:text-slate-100">{formatMoney(selectedTotal)}</p>
                </div>
              </div>

              <div className="flex justify-end">
                <Button size="sm" onClick={onCheckout} disabled={!selectedIds.length}>
                  Thanh toán sản phẩm đã chọn
                </Button>
              </div>
            </>
          )}
        </Card>
      </section>
    </>
  )
}
