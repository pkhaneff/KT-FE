import { useEffect, useState } from 'react'
import { Plus, Edit } from 'lucide-react'
import { Card } from '../../../components/ui/Card'
import { Badge } from '../../../components/ui/Badge'
import { Button } from '../../../components/ui/Button'
import { Input } from '../../../components/ui/Input'
import { SectionHeading } from '../../../components/shared/SectionHeading'
import { Seo } from '../../../core/seo/Seo'
import { useAuth } from '../../auth/hooks/useAuth'
import { adminListProjectTypes, adminCreateProjectType, adminUpdateProjectType } from '../services/adminProjectTypeApi'

export function AdminProjectTypesPage() {
  const { accessToken } = useAuth()
  const [projectTypes, setProjectTypes] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [editingItem, setEditingItem] = useState(null)
  const [createForm, setCreateForm] = useState({ name: '', description: '' })
  const [editForm, setEditForm] = useState({ name: '', description: '', is_active: true })
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    let mounted = true

    async function loadData() {
      if (!accessToken) {
        if (mounted) {
          setProjectTypes([])
          setLoading(false)
        }
        return
      }

      setLoading(true)
      setError('')
      try {
        const data = await adminListProjectTypes(accessToken)
        if (mounted) {
          setProjectTypes(Array.isArray(data) ? data : [])
        }
      } catch (err) {
        if (mounted) {
          setError(err.message || 'Không thể tải loại dự án. Vui lòng thử lại.')
          setProjectTypes([])
        }
      } finally {
        if (mounted) setLoading(false)
      }
    }

    loadData()

    return () => { mounted = false }
  }, [accessToken])

  const handleCreate = async (e) => {
    e.preventDefault()
    if (!accessToken || saving) return

    setSaving(true)
    setError('')
    try {
      const created = await adminCreateProjectType(accessToken, createForm)
      setProjectTypes((prev) => [...prev, created])
      setShowCreateModal(false)
      setCreateForm({ name: '', description: '' })
    } catch (err) {
      setError(err.message || 'Không thể tạo loại dự án. Vui lòng thử lại.')
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
      const updated = await adminUpdateProjectType(accessToken, editingItem.id, editForm)
      setProjectTypes((prev) => prev.map((item) => (item.id === editingItem.id ? updated : item)))
      setShowEditModal(false)
      setEditingItem(null)
      setEditForm({ name: '', description: '', is_active: true })
    } catch (err) {
      setError(err.message || 'Không thể cập nhật loại dự án. Vui lòng thử lại.')
    } finally {
      setSaving(false)
    }
  }

  const openEditModal = (item) => {
    setEditingItem(item)
    setEditForm({ name: item.name, description: item.description || '', is_active: item.is_active })
    setShowEditModal(true)
  }

  return (
    <>
      <Seo title="Quản lý loại dự án" description="Quản lý các loại dự án trong hệ thống." />
      <section className="space-y-6">
        <SectionHeading eyebrow="Admin" title="Quản lý loại dự án" description="Tạo, cập nhật và quản lý các loại dự án." />

        <div className="flex justify-end">
          <Button size="sm" onClick={() => setShowCreateModal(true)}>
            <Plus size={14} aria-hidden="true" /> Tạo loại dự án mới
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

        {!loading && projectTypes.length === 0 ? (
          <Card className="py-12 text-center">
            <p className="text-lg font-semibold text-slate-900">Chưa có loại dự án nào</p>
            <p className="mt-2 text-sm text-slate-500">Tạo loại dự án đầu tiên để bắt đầu</p>
          </Card>
        ) : null}

        {!loading && projectTypes.length > 0 ? (
          <Card className="divide-y divide-slate-200 p-0">
            {projectTypes.map((item) => (
              <div key={item.id} className="grid gap-3 p-4 md:grid-cols-[1fr_auto] md:items-center">
                <div>
                  <p className="text-sm font-semibold text-slate-900">{item.name}</p>
                  <p className="text-xs text-slate-500">{item.description || 'Không có mô tả'}</p>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant={item.is_active ? 'success' : 'danger'}>
                    {item.is_active ? 'Đang hoạt động' : 'Đã vô hiệu'}
                  </Badge>
                  <Button size="sm" variant="ghost" onClick={() => openEditModal(item)}>
                    <Edit size={14} />
                  </Button>
                </div>
              </div>
            ))}
          </Card>
        ) : null}

        {/* Create Modal */}
        {showCreateModal ? (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
            <Card className="max-w-md w-full p-6">
              <h3 className="text-lg font-bold text-slate-900 mb-4">Tạo loại dự án mới</h3>
              <form onSubmit={handleCreate} className="space-y-4">
                <label className="space-y-2">
                  <span className="text-sm font-medium text-slate-700">Tên loại dự án</span>
                  <Input
                    value={createForm.name}
                    onChange={(e) => setCreateForm({...createForm, name: e.target.value})}
                    required
                  />
                </label>
                <label className="space-y-2">
                  <span className="text-sm font-medium text-slate-700">Mô tả</span>
                  <textarea
                    value={createForm.description}
                    onChange={(e) => setCreateForm({...createForm, description: e.target.value})}
                    rows={3}
                    className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm"
                  />
                </label>
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
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
            <Card className="max-w-md w-full p-6">
              <h3 className="text-lg font-bold text-slate-900 mb-4">Cập nhật loại dự án</h3>
              <form onSubmit={handleUpdate} className="space-y-4">
                <label className="space-y-2">
                  <span className="text-sm font-medium text-slate-700">Tên loại dự án</span>
                  <Input
                    value={editForm.name}
                    onChange={(e) => setEditForm({...editForm, name: e.target.value})}
                    required
                  />
                </label>
                <label className="space-y-2">
                  <span className="text-sm font-medium text-slate-700">Mô tả</span>
                  <textarea
                    value={editForm.description}
                    onChange={(e) => setEditForm({...editForm, description: e.target.value})}
                    rows={3}
                    className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm"
                  />
                </label>
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={editForm.is_active}
                    onChange={(e) => setEditForm({...editForm, is_active: e.target.checked})}
                    className="rounded"
                  />
                  <span className="text-sm font-medium text-slate-700">Đang hoạt động</span>
                </label>
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
