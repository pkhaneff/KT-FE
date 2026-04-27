import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { SectionHeading } from '../../../components/shared/SectionHeading'
import { Card } from '../../../components/ui/Card'
import { Input } from '../../../components/ui/Input'
import { Button } from '../../../components/ui/Button'
import { Seo } from '../../../core/seo/Seo'
import { ROUTES } from '../../../core/constants/routes'
import { sanitizeText } from '../../../core/utils/sanitizeText'

export function ProjectWizardPage() {
  const navigate = useNavigate()
  const [title, setTitle] = useState('')
  const [scope, setScope] = useState('')

  const handleSubmit = (event) => {
    event.preventDefault()
    const normalizedTitle = sanitizeText(title)
    const normalizedScope = sanitizeText(scope)

    if (!normalizedTitle || !normalizedScope) {
      return
    }

    navigate(ROUTES.USER_ORDERS)
  }

  return (
    <>
      <Seo title="Project Wizard" description="Tạo yêu cầu dự án theo form chuẩn hóa." />
      <section className="space-y-6">
        <SectionHeading eyebrow="User" title="Project Request Wizard" description="Form theo chuẩn cấu trúc để giảm sai lệch phạm vi và tăng tốc độ báo giá." />

        <Card>
          <form className="space-y-4" onSubmit={handleSubmit}>
            <label className="block space-y-2 text-sm font-medium text-slate-700">
              Tiêu đề dự án
              <Input
                value={title}
                onChange={(event) => setTitle(event.target.value)}
                placeholder="Ví dụ: Dashboard MQTT cho nhà kính IoT"
                required
              />
            </label>

            <label className="block space-y-2 text-sm font-medium text-slate-700">
              Mô tả phạm vi
              <textarea
                value={scope}
                onChange={(event) => setScope(event.target.value)}
                className="min-h-32 w-full rounded-lg border border-slate-300 p-3 text-sm outline-none ring-indigo-200 focus-visible:ring-2"
                placeholder="Mục tiêu, deliverables, deadline..."
                required
              />
            </label>

            <div className="flex gap-2">
              <Button type="submit">Tạo yêu cầu</Button>
              <Button variant="secondary" type="button" onClick={() => navigate(ROUTES.USER_DASHBOARD)}>Hủy</Button>
            </div>
          </form>
        </Card>
      </section>
    </>
  )
}
