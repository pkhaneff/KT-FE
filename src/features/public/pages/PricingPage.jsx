import { useEffect, useMemo, useState } from 'react'
import { ShoppingCart } from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'
import { Card } from '../../../components/ui/Card'
import { Button } from '../../../components/ui/Button'
import { ROUTES } from '../../../core/constants/routes'
import { Seo } from '../../../core/seo/Seo'
import { useCart } from '../../../core/cart/CartContext'
import { useAuth } from '../../auth'
import { listPublicProducts, listPublicProductTypes } from '../services/publicProductApi'

const ALL_FILTER = 'Tất cả'

const formatMoney = (value) => `${(value || 0).toLocaleString('vi-VN')}đ`
const formatDate = (value) => {
  if (!value) {
    return 'Đăng gần đây'
  }

  const date = new Date(value)
  if (Number.isNaN(date.getTime())) {
    return 'Đăng gần đây'
  }

  return `Đăng ngày ${date.toLocaleDateString('vi-VN')}`
}

const getDeliverables = (content) => {
  if (!content) {
    return ['Theo mô tả chi tiết']
  }

  const items = content
    .split(/\n|,|;|\./)
    .map((item) => item.trim())
    .filter(Boolean)

  if (!items.length) {
    return ['Theo mô tả chi tiết']
  }

  return items.slice(0, 4)
}

const getTechStack = (techStack) => {
  if (!techStack || techStack === 'Đang cập nhật') {
    return []
  }

  const items = techStack
    .split(/,|;/)
    .map((item) => item.trim())
    .filter(Boolean)

  return items
}

export function PricingPage() {
  const navigate = useNavigate()
  const { addToCart, cartItems, removeFromCart } = useCart()
  const { isAuthenticated } = useAuth()
  const [products, setProducts] = useState([])
  const [productTypeMap, setProductTypeMap] = useState({})
  const [selectedCategory, setSelectedCategory] = useState(ALL_FILTER)
  const [loading, setLoading] = useState(true)
  const [errorMessage, setErrorMessage] = useState('')
  const [reloadCount, setReloadCount] = useState(0)

  useEffect(() => {
    const controller = new AbortController()

    async function loadProducts() {
      setLoading(true)
      setErrorMessage('')

      try {
        const [productList, productTypeList] = await Promise.all([
          listPublicProducts(controller.signal),
          listPublicProductTypes(controller.signal),
        ])

        const nextProductTypeMap = (productTypeList || []).reduce((acc, item) => {
          acc[item.id] = item.name
          return acc
        }, {})

        setProducts(productList || [])
        setProductTypeMap(nextProductTypeMap)
      } catch (error) {
        if (error?.name === 'AbortError') {
          return
        }
        setErrorMessage(error?.message || 'Không thể tải bảng giá. Vui lòng thử lại.')
      } finally {
        setLoading(false)
      }
    }

    loadProducts()

    return () => {
      controller.abort()
    }
  }, [reloadCount])

  const mappedPackages = useMemo(() => {
    return products.map((product) => {
      const category =
        productTypeMap[product.product_type_id] ||
        product.technology ||
        'Khác'

      return {
        id: product.id,
        title: product.name,
        seller:
          product.posted_by_name ||
          product.created_by_name ||
          product.created_by?.full_name ||
          product.user?.full_name ||
          'Người dùng',
        category,
        price: product.price,
        time: formatDate(product.created_at),
        level: product.technology || 'Đang cập nhật',
        deliverables: getDeliverables(product.deliverables || product.description),
        description: product.description,
      }
    })
  }, [productTypeMap, products])

  const filters = useMemo(() => {
    const categories = [...new Set(mappedPackages.map((item) => item.category).filter(Boolean))]
    return [ALL_FILTER, ...categories]
  }, [mappedPackages])

  useEffect(() => {
    if (!filters.includes(selectedCategory)) {
      setSelectedCategory(ALL_FILTER)
    }
  }, [filters, selectedCategory])

  const filteredPackages = useMemo(() => {
    if (selectedCategory === ALL_FILTER) {
      return mappedPackages
    }
    return mappedPackages.filter((item) => item.category === selectedCategory)
  }, [mappedPackages, selectedCategory])

  const cartQuantityMap = useMemo(
    () => cartItems.reduce((acc, item) => {
      acc[item.product_id] = item.qty
      return acc
    }, {}),
    [cartItems],
  )

  const onBuyNow = async (pkg) => {
    if (!isAuthenticated) {
      navigate(ROUTES.PUBLIC_LOGIN)
      return
    }

    const cartItem = await addToCart({
      productId: pkg.id,
      name: pkg.title,
      price: pkg.price,
    }, 1)

    if (!cartItem?.id) {
      return
    }

    navigate(ROUTES.PUBLIC_CHECKOUT, {
      state: { selectedCartItemIds: [cartItem.id] },
    })
  }

  return (
    <>
      <Seo title="Bảng giá" description="Dự án và gói hỗ trợ được đăng bán sẵn." />

      <section className="mx-auto max-w-7xl space-y-4">
        <p className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-500 dark:text-slate-400">Bảng giá</p>
        <h1 className="max-w-4xl text-3xl font-bold leading-tight text-slate-900 md:text-5xl md:leading-[1.08] dark:text-slate-100">
          Dự án và gói hỗ trợ được đăng bán sẵn
        </h1>
        <p className="max-w-3xl text-sm leading-relaxed text-slate-600 md:text-base dark:text-slate-300">
          Các gói dưới đây do admin hoặc mentor đã xác minh đăng lên. Người dùng có thể xem trước phạm vi,
          giá tham khảo, thời gian thực hiện và deliverables. Khi chọn mua, hệ thống yêu cầu đăng nhập để tạo đơn chính thức.
        </p>
      </section>

      <section className="mx-auto mt-6 max-w-7xl">
        <div className="mb-4 flex flex-wrap items-center gap-2">
          {filters.map((filter) => (
            <button
              key={filter}
              type="button"
              onClick={() => setSelectedCategory(filter)}
              className={`inline-flex h-9 items-center rounded-full px-4 text-sm font-semibold transition-colors ${
                selectedCategory === filter
                  ? 'bg-indigo-600 text-white dark:bg-indigo-500'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700'
              }`}
            >
              {filter}
            </button>
          ))}
          <div className="flex-1" />
          <Link to={ROUTES.PUBLIC_WORKFLOW}>
            <Button variant="ghost" size="sm">Xem quy trình mua</Button>
          </Link>
        </div>

        {errorMessage ? (
          <Card className="mb-4 border border-rose-200 bg-rose-50 dark:border-rose-900/40 dark:bg-rose-950/30">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <p className="text-sm font-medium text-rose-700 dark:text-rose-300">{errorMessage}</p>
              <Button size="sm" variant="secondary" onClick={() => setReloadCount((prev) => prev + 1)}>
                Thử lại
              </Button>
            </div>
          </Card>
        ) : null}

        <div className="grid gap-4 md:grid-cols-2">
          {loading
            ? Array.from({ length: 4 }).map((_, index) => (
              <Card key={`loading-${index}`} className="min-h-[310px] animate-pulse bg-slate-100 dark:bg-slate-800" />
            ))
            : null}

          {!loading && !errorMessage && filteredPackages.length === 0 ? (
            <Card className="md:col-span-2">
              <p className="text-sm text-slate-600 dark:text-slate-300">Hiện chưa có sản phẩm nào được đăng bán.</p>
            </Card>
          ) : null}

          {!loading && !errorMessage && filteredPackages.map((pkg) => (
            <Card key={pkg.id} className="flex min-h-[310px] flex-col">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <Link
                    to={ROUTES.PUBLIC_PRODUCT_DETAIL.replace(':productId', String(pkg.id))}
                    className="inline-block rounded-lg bg-indigo-50 px-2.5 py-1 text-lg font-extrabold leading-snug text-indigo-700 transition-colors hover:bg-indigo-100 hover:text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-200 dark:hover:bg-indigo-900/50 dark:hover:text-indigo-100"
                  >
                    {pkg.title}
                  </Link>
                  <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">Đăng bởi {pkg.seller}</p>
                  {cartQuantityMap[pkg.id] ? (
                    <p className="mt-1 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                      Đã thêm vào giỏ: {cartQuantityMap[pkg.id]}
                    </p>
                  ) : null}
                </div>

                <div className="rounded-xl border border-amber-200 bg-amber-50 px-3 py-2 text-right shadow-sm dark:border-amber-900/40 dark:bg-amber-900/20">
                  <p className="text-2xl font-black tracking-tight text-amber-700 dark:text-amber-300">{formatMoney(pkg.price)}</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">{pkg.time}</p>
                </div>
              </div>

              <div className="mt-3 flex-1">
                <div>
                  <p className="mb-1 text-xs font-semibold uppercase tracking-tight text-slate-500 dark:text-slate-400">Description</p>
                  <p className="line-clamp-2 text-xs text-slate-500 dark:text-slate-400">{pkg.description}</p>
                </div>
                <div className="mt-3">
                  <p className="mb-2 text-xs font-semibold uppercase tracking-tight text-slate-500 dark:text-slate-400">Tech Stack</p>
                  <div className="flex flex-wrap gap-1.5">
                    {getTechStack(pkg.level).length > 0 ? (
                      getTechStack(pkg.level).map((tech) => (
                        <span key={tech} className="inline-flex h-6 items-center rounded-full bg-slate-100 px-2.5 text-[11px] font-medium text-slate-700 dark:bg-slate-700 dark:text-slate-200">
                          {tech}
                        </span>
                      ))
                    ) : (
                      <span className="inline-flex h-6 items-center rounded-full bg-slate-100 px-2.5 text-[11px] font-medium text-slate-700 dark:bg-slate-700 dark:text-slate-200">
                        {pkg.level}
                      </span>
                    )}
                  </div>
                </div>
                <div className="mt-2">
                  <p className="mb-2 text-xs font-semibold uppercase tracking-tight text-slate-500 dark:text-slate-400">Sản phẩm bao gồm</p>
                  <div className="flex flex-wrap gap-1.5">
                    {pkg.deliverables.map((deliverable) => (
                      <span key={deliverable} className="inline-flex h-6 items-center rounded-full bg-slate-100 px-2.5 text-[11px] font-medium text-slate-700 dark:bg-slate-700 dark:text-slate-200">
                        {deliverable}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="mt-4 grid grid-cols-2 gap-2">
                <Button
                  variant="secondary"
                  size="sm"
                  className="w-full justify-center"
                  onClick={() => addToCart({
                    productId: pkg.id,
                    name: pkg.title,
                    price: pkg.price,
                  }, 1)}
                >
                  <ShoppingCart size={16} aria-hidden="true" />
                  Thêm giỏ hàng
                </Button>
                {cartQuantityMap[pkg.id] ? (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="w-full justify-center border border-rose-200 text-rose-600 hover:bg-rose-50 dark:border-rose-800 dark:text-rose-400 dark:hover:bg-rose-950/30"
                    onClick={() => removeFromCart(pkg.id)}
                  >
                    Xóa khỏi giỏ
                  </Button>
                ) : (
                  <Button size="sm" className="w-full justify-center" onClick={() => onBuyNow(pkg)}>
                    Chọn mua
                  </Button>
                )}
              </div>
            </Card>
          ))}
        </div>
      </section>
    </>
  )
}
