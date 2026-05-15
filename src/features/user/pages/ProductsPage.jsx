import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Search, ShoppingCart, Plus } from 'lucide-react'
import { Card } from '../../../components/ui/Card'
import { Badge } from '../../../components/ui/Badge'
import { Button } from '../../../components/ui/Button'
import { Input } from '../../../components/ui/Input'
import { SectionHeading } from '../../../components/shared/SectionHeading'
import { Seo } from '../../../core/seo/Seo'
import { ROUTES } from '../../../core/constants/routes'
import { listProducts, listProductTypes } from '../services/productApi'
import { upsertCartItem } from '../services/orderApi'

const formatMoney = (value) => `${(value || 0).toLocaleString('vi-VN')}đ`

export function ProductsPage() {
  const [products, setProducts] = useState([])
  const [productTypes, setProductTypes] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedTypeId, setSelectedTypeId] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [addingToCart, setAddingToCart] = useState(new Set())

  useEffect(() => {
    let mounted = true

    async function loadData() {
      setLoading(true)
      setError('')
      try {
        const [productsData, typesData] = await Promise.all([
          listProducts(searchTerm || null, selectedTypeId || null),
          listProductTypes(),
        ])
        
        if (!mounted) return
        
        setProducts(Array.isArray(productsData) ? productsData : [])
        setProductTypes(Array.isArray(typesData) ? typesData : [])
      } catch (err) {
        if (!mounted) return
        setError(err.message || 'Không thể tải sản phẩm. Vui lòng thử lại.')
        setProducts([])
        setProductTypes([])
      } finally {
        if (mounted) setLoading(false)
      }
    }

    loadData()

    return () => { mounted = false }
  }, [searchTerm, selectedTypeId])

  const handleAddToCart = async (productId) => {
    // Note: This would need auth token in real implementation
    // For now, we'll show a message
    alert('Vui lòng đăng nhập để thêm vào giỏ hàng')
  }

  return (
    <>
      <Seo title="Sản phẩm" description="Danh sách sản phẩm có sẵn để mua." />
      <section className="space-y-6">
        <SectionHeading eyebrow="Products" title="Danh sách sản phẩm" description="Tìm kiếm và mua các sản phẩm hỗ trợ đồ án." />

        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-3">
            <div className="relative">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <Input
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Tìm kiếm sản phẩm..."
                className="pl-9"
              />
            </div>
            
            <select
              value={selectedTypeId}
              onChange={(e) => setSelectedTypeId(e.target.value)}
              className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-700"
            >
              <option value="">Tất cả loại</option>
              {productTypes.map((type) => (
                <option key={type.id} value={type.id}>{type.name}</option>
              ))}
            </select>
          </div>

          <Link to={ROUTES.USER_CART}>
            <Button size="sm">
              <ShoppingCart size={14} aria-hidden="true" /> Giỏ hàng
            </Button>
          </Link>
        </div>

        {error ? (
          <Card className="border border-rose-200 bg-rose-50">
            <p className="text-sm font-medium text-rose-700">{error}</p>
          </Card>
        ) : null}

        {loading ? (
          <Card>
            <p className="text-sm text-slate-500">Đang tải sản phẩm...</p>
          </Card>
        ) : null}

        {!loading && products.length === 0 ? (
          <Card>
            <p className="text-sm text-slate-500">Không tìm thấy sản phẩm nào.</p>
          </Card>
        ) : null}

        {!loading && products.length > 0 ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {products.map((product) => (
              <Card key={product.id} className="flex flex-col">
                <div className="flex-1 space-y-3 p-4">
                  <div className="flex items-start justify-between gap-2">
                    <Badge variant="success">{product.product_type_name || 'Sản phẩm'}</Badge>
                    {product.active ? <Badge variant="success">Đang bán</Badge> : <Badge variant="danger">Ngừng bán</Badge>}
                  </div>
                  
                  <h3 className="text-base font-semibold text-slate-900">{product.name}</h3>
                  
                  {product.technology ? (
                    <p className="text-xs text-slate-500">Công nghệ: {product.technology}</p>
                  ) : null}
                  
                  {product.description ? (
                    <p className="text-sm text-slate-600 line-clamp-2">{product.description}</p>
                  ) : null}
                  
                  {product.deliverables ? (
                    <div className="rounded-lg bg-slate-50 p-2">
                      <p className="text-xs font-semibold text-slate-700">Sản phẩm bao gồm:</p>
                      <p className="text-xs text-slate-600">{product.deliverables}</p>
                    </div>
                  ) : null}
                </div>
                
                <div className="border-t border-slate-200 p-4">
                  <div className="flex items-center justify-between gap-3">
                    <p className="text-lg font-bold text-slate-900">{formatMoney(product.price)}</p>
                    <Button
                      size="sm"
                      onClick={() => handleAddToCart(product.id)}
                      disabled={!product.active || addingToCart.has(product.id)}
                    >
                      {addingToCart.has(product.id) ? 'Đang thêm...' : (
                        <>
                          <Plus size={14} aria-hidden="true" /> Thêm vào giỏ
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        ) : null}
      </section>
    </>
  )
}
