import { useEffect, useState } from 'react'
import { Plus, Edit, Trash2, Search } from 'lucide-react'
import { Card } from '../../../components/ui/Card'
import { Badge } from '../../../components/ui/Badge'
import { Button } from '../../../components/ui/Button'
import { Input } from '../../../components/ui/Input'
import { SectionHeading } from '../../../components/shared/SectionHeading'
import { Seo } from '../../../core/seo/Seo'
import { useAuth } from '../../auth/hooks/useAuth'
import { adminListProducts, adminCreateProduct, adminUpdateProduct, adminDeleteProduct, adminListProductTypes } from '../services/adminProductApi'

const formatMoney = (value) => `${(value || 0).toLocaleString('vi-VN')}đ`

export function AdminProductsPage() {
  const { accessToken } = useAuth()
  const [products, setProducts] = useState([])
  const [productTypes, setProductTypes] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedTypeId, setSelectedTypeId] = useState('')
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [editingItem, setEditingItem] = useState(null)
  const [createForm, setCreateForm] = useState({
    product_type_id: '',
    name: '',
    description: '',
    technology: '',
    deliverables: '',
    price: '',
  })
  const [editForm, setEditForm] = useState({
    product_type_id: '',
    name: '',
    description: '',
    technology: '',
    deliverables: '',
    price: '',
    is_active: true,
  })
  const [saving, setSaving] = useState(false)
  const [deleting, setDeleting] = useState(new Set())

  useEffect(() => {
    let mounted = true

    async function loadData() {
      if (!accessToken) {
        if (mounted) {
          setProducts([])
          setProductTypes([])
          setLoading(false)
        }
        return
      }

      setLoading(true)
      setError('')
      try {
        const [productsData, typesData] = await Promise.all([
          adminListProducts(accessToken, searchTerm || null, selectedTypeId || null),
          adminListProductTypes(accessToken),
        ])
        if (mounted) {
          setProducts(Array.isArray(productsData) ? productsData : [])
          setProductTypes(Array.isArray(typesData) ? typesData : [])
        }
      } catch (err) {
        if (mounted) {
          setError(err.message || 'Không thể tải sản phẩm. Vui lòng thử lại.')
          setProducts([])
          setProductTypes([])
        }
      } finally {
        if (mounted) setLoading(false)
      }
    }

    loadData()

    return () => { mounted = false }
  }, [accessToken, searchTerm, selectedTypeId])

  const handleCreate = async (e) => {
    e.preventDefault()
    if (!accessToken || saving) return

    setSaving(true)
    setError('')
    try {
      const payload = {
        product_type_id: createForm.product_type_id,
        name: createForm.name,
        description: createForm.description || null,
        technology: createForm.technology || null,
        deliverables: createForm.deliverables || null,
        price: parseFloat(createForm.price),
      }
      const created = await adminCreateProduct(accessToken, payload)
      setProducts((prev) => [...prev, created])
      setShowCreateModal(false)
      setCreateForm({
        product_type_id: '',
        name: '',
        description: '',
        technology: '',
        deliverables: '',
        price: '',
      })
    } catch (err) {
      setError(err.message || 'Không thể tạo sản phẩm. Vui lòng thử lại.')
    } finally {
      setSaving(false)
    }
  }

  const handleUpdate = async (e) => {
    e.preventDefault()
    if (!accessToken || !editingItem || saving) return

    setSaving(true)
    setError('')
    try {
      const payload = {
        product_type_id: editForm.product_type_id,
        name: editForm.name,
        description: editForm.description || null,
        technology: editForm.technology || null,
        deliverables: editForm.deliverables || null,
        price: parseFloat(editForm.price),
      }
      const updated = await adminUpdateProduct(accessToken, editingItem.id, payload)
      setProducts((prev) => prev.map((item) => (item.id === editingItem.id ? updated : item)))
      setShowEditModal(false)
      setEditingItem(null)
      setEditForm({
        product_type_id: '',
        name: '',
        description: '',
        technology: '',
        deliverables: '',
        price: '',
        is_active: true,
      })
    } catch (err) {
      setError(err.message || 'Không thể cập nhật sản phẩm. Vui lòng thử lại.')
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (productId) => {
    if (!accessToken || deleting.has(productId)) return

    if (!confirm('Bạn có chắc muốn xóa sản phẩm này?')) return

    setDeleting((prev) => new Set([...prev, productId]))
    setError('')
    try {
      await adminDeleteProduct(accessToken, productId)
      setProducts((prev) => prev.filter((item) => item.id !== productId))
    } catch (err) {
      setError(err.message || 'Không thể xóa sản phẩm. Vui lòng thử lại.')
    } finally {
      setDeleting((prev) => {
        const next = new Set(prev)
        next.delete(productId)
        return next
      })
    }
  }

  const openEditModal = (item) => {
    setEditingItem(item)
    setEditForm({
      product_type_id: item.product_type_id || '',
      name: item.name,
      description: item.description || '',
      technology: item.technology || '',
      deliverables: item.deliverables || '',
      price: item.price,
      is_active: item.is_active,
    })
    setShowEditModal(true)
  }

  return (
    <>
      <Seo title="Quản lý sản phẩm" description="Quản lý các sản phẩm trong hệ thống." />
      <section className="space-y-6">
        <SectionHeading eyebrow="Admin" title="Quản lý sản phẩm" description="Tạo, cập nhật và quản lý các sản phẩm." />

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

          <Button size="sm" onClick={() => setShowCreateModal(true)}>
            <Plus size={14} aria-hidden="true" /> Tạo sản phẩm mới
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

        {!loading && products.length === 0 ? (
          <Card className="py-12 text-center">
            <p className="text-lg font-semibold text-slate-900">Chưa có sản phẩm nào</p>
            <p className="mt-2 text-sm text-slate-500">Tạo sản phẩm đầu tiên để bắt đầu</p>
          </Card>
        ) : null}

        {!loading && products.length > 0 ? (
          <Card className="divide-y divide-slate-200 p-0">
            {products.map((item) => (
              <div key={item.id} className="grid gap-3 p-4 md:grid-cols-[1fr_auto_auto] md:items-center">
                <div>
                  <div className="mb-1 flex flex-wrap items-center gap-2">
                    <span className="text-xs font-semibold text-slate-500">{item.product_type_name || 'Sản phẩm'}</span>
                    <Badge variant={item.is_active ? 'success' : 'danger'}>
                      {item.is_active ? 'Đang bán' : 'Ngừng bán'}
                    </Badge>
                  </div>
                  <p className="text-sm font-semibold text-slate-900">{item.name}</p>
                  {item.technology ? (
                    <p className="text-xs text-slate-500">Công nghệ: {item.technology}</p>
                  ) : null}
                  {item.description ? (
                    <p className="text-xs text-slate-600 line-clamp-1">{item.description}</p>
                  ) : null}
                </div>
                <p className="text-lg font-bold text-slate-900">{formatMoney(item.price)}</p>
                <div className="flex items-center gap-2">
                  <Button size="sm" variant="ghost" onClick={() => openEditModal(item)}>
                    <Edit size={14} />
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => handleDelete(item.id)}
                    disabled={deleting.has(item.id)}
                    className="text-rose-600 hover:text-rose-700"
                  >
                    <Trash2 size={14} />
                  </Button>
                </div>
              </div>
            ))}
          </Card>
        ) : null}

        {/* Create Modal */}
        {showCreateModal ? (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 overflow-y-auto">
            <Card className="max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 my-8">
              <h3 className="text-lg font-bold text-slate-900 mb-4">Tạo sản phẩm mới</h3>
              <form onSubmit={handleCreate} className="space-y-4">
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
                    <Input
                      value={createForm.name}
                      onChange={(e) => setCreateForm({...createForm, name: e.target.value})}
                      required
                    />
                  </label>
                  <label className="space-y-2">
                    <span className="text-sm font-medium text-slate-700">Giá (VND)</span>
                    <Input
                      type="number"
                      value={createForm.price}
                      onChange={(e) => setCreateForm({...createForm, price: e.target.value})}
                      required
                    />
                  </label>
                  <label className="space-y-2">
                    <span className="text-sm font-medium text-slate-700">Công nghệ</span>
                    <Input
                      value={createForm.technology}
                      onChange={(e) => setCreateForm({...createForm, technology: e.target.value})}
                    />
                  </label>
                  <label className="space-y-2 md:col-span-2">
                    <span className="text-sm font-medium text-slate-700">Mô tả</span>
                    <textarea
                      value={createForm.description}
                      onChange={(e) => setCreateForm({...createForm, description: e.target.value})}
                      rows={3}
                      className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm"
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
                </div>
                <div className="flex justify-end gap-3">
                  <Button type="button" variant="secondary" onClick={() => setShowCreateModal(false)}>
                    Hủy
                  </Button>
                  <Button type="submit" disabled={saving}>
                    {saving ? 'Đang tạo...' : 'Tạo'}
                  </Button>
                </div>
              </form>
            </Card>
          </div>
        ) : null}

        {/* Edit Modal */}
        {showEditModal ? (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 overflow-y-auto">
            <Card className="max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 my-8">
              <h3 className="text-lg font-bold text-slate-900 mb-4">Cập nhật sản phẩm</h3>
              <form onSubmit={handleUpdate} className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <label className="space-y-2">
                    <span className="text-sm font-medium text-slate-700">Loại sản phẩm</span>
                    <select
                      value={editForm.product_type_id}
                      onChange={(e) => setEditForm({...editForm, product_type_id: e.target.value})}
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
                    <Input
                      value={editForm.name}
                      onChange={(e) => setEditForm({...editForm, name: e.target.value})}
                      required
                    />
                  </label>
                  <label className="space-y-2">
                    <span className="text-sm font-medium text-slate-700">Giá (VND)</span>
                    <Input
                      type="number"
                      value={editForm.price}
                      onChange={(e) => setEditForm({...editForm, price: e.target.value})}
                      required
                    />
                  </label>
                  <label className="space-y-2">
                    <span className="text-sm font-medium text-slate-700">Công nghệ</span>
                    <Input
                      value={editForm.technology}
                      onChange={(e) => setEditForm({...editForm, technology: e.target.value})}
                    />
                  </label>
                  <label className="space-y-2 md:col-span-2">
                    <span className="text-sm font-medium text-slate-700">Mô tả</span>
                    <textarea
                      value={editForm.description}
                      onChange={(e) => setEditForm({...editForm, description: e.target.value})}
                      rows={3}
                      className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm"
                    />
                  </label>
                  <label className="space-y-2 md:col-span-2">
                    <span className="text-sm font-medium text-slate-700">Sản phẩm bàn giao</span>
                    <textarea
                      value={editForm.deliverables}
                      onChange={(e) => setEditForm({...editForm, deliverables: e.target.value})}
                      rows={3}
                      className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm"
                    />
                  </label>
                  <label className="flex items-center gap-2 md:col-span-2">
                    <input
                      type="checkbox"
                      checked={editForm.is_active}
                      onChange={(e) => setEditForm({...editForm, is_active: e.target.checked})}
                      className="rounded"
                    />
                    <span className="text-sm font-medium text-slate-700">Đang bán</span>
                  </label>
                </div>
                <div className="flex justify-end gap-3">
                  <Button type="button" variant="secondary" onClick={() => { setShowEditModal(false); setEditingItem(null) }}>
                    Hủy
                  </Button>
                  <Button type="submit" disabled={saving}>
                    {saving ? 'Đang cập nhật...' : 'Cập nhật'}
                  </Button>
                </div>
              </form>
            </Card>
          </div>
        ) : null}
      </section>
    </>
  )
}
