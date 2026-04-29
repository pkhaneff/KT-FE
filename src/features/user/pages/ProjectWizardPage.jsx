import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowRight, Check, Cpu, Globe, Sparkles } from 'lucide-react'
import { SectionHeading } from '../../../components/shared/SectionHeading'
import { Card } from '../../../components/ui/Card'
import { Input } from '../../../components/ui/Input'
import { Button } from '../../../components/ui/Button'
import { Badge } from '../../../components/ui/Badge'
import { Seo } from '../../../core/seo/Seo'
import { ROUTES } from '../../../core/constants/routes'
import { sanitizeText } from '../../../core/utils/sanitizeText'

const STEPS = ['Chọn loại hỗ trợ', 'Nhập thông tin đồ án', 'AI phân tích yêu cầu', 'Xác nhận gửi yêu cầu']
const SUPPORT_TYPES = [
  { key: 'IoT / Embedded', icon: Cpu, description: 'Hỗ trợ mạch, firmware, gateway, dashboard và báo cáo bảo vệ.' },
  { key: 'Web App / Dashboard', icon: Globe, description: 'Hỗ trợ fullstack, API, dashboard và triển khai theo milestone.' },
  { key: 'AI / Data', icon: Sparkles, description: 'Hỗ trợ model, pipeline dữ liệu, đánh giá và tối ưu báo cáo.' },
]

export function ProjectWizardPage() {
  const navigate = useNavigate()
  const [step, setStep] = useState(1)
  const [supportType, setSupportType] = useState(SUPPORT_TYPES[0].key)
  const [title, setTitle] = useState('')
  const [scope, setScope] = useState('')
  const [deadline, setDeadline] = useState('')

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
        <SectionHeading eyebrow="User" title="Tạo yêu cầu cho mentor" description="Luồng 4 bước để gửi yêu cầu có cấu trúc và dễ báo giá." />

        <div className="grid gap-2 md:grid-cols-4">
          {STEPS.map((label, index) => {
            const stepNumber = index + 1
            const active = step === stepNumber
            const done = step > stepNumber

            return (
              <button
                key={label}
                type="button"
                onClick={() => setStep(stepNumber)}
                className={`flex items-center gap-2 rounded-xl border px-3 py-2 text-left transition ${
                  active
                    ? 'border-indigo-600 bg-indigo-50'
                    : done
                      ? 'border-slate-900 bg-slate-900 text-white'
                      : 'border-slate-200 bg-white'
                }`}
              >
                <span className={`inline-flex size-6 items-center justify-center rounded-lg text-xs font-semibold ${done ? 'bg-white text-slate-900' : active ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-600'}`}>
                  {done ? <Check size={12} aria-hidden="true" /> : stepNumber}
                </span>
                <span className="text-xs font-semibold">{label}</span>
              </button>
            )
          })}
        </div>

        <Card>
          <form className="space-y-4" onSubmit={handleSubmit}>
            {step === 1 ? (
              <div className="grid gap-3 md:grid-cols-3">
                {SUPPORT_TYPES.map((item) => {
                  const IconComponent = item.icon
                  return (
                    <button
                      key={item.key}
                      type="button"
                      onClick={() => setSupportType(item.key)}
                      className={`rounded-xl border p-4 text-left transition ${supportType === item.key ? 'border-indigo-600 bg-indigo-50' : 'border-slate-200 bg-white hover:border-slate-300'}`}
                    >
                      <IconComponent size={18} className="text-indigo-600" aria-hidden="true" />
                      <p className="mt-2 text-sm font-semibold text-slate-900">{item.key}</p>
                      <p className="mt-1 text-xs text-slate-600">{item.description}</p>
                    </button>
                  )
                })}
              </div>
            ) : null}

            {step === 2 ? (
              <div className="grid gap-4">
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
                  Deadline dự kiến
                  <Input value={deadline} onChange={(event) => setDeadline(event.target.value)} placeholder="Ví dụ: 28/05/2026" />
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
              </div>
            ) : null}

            {step === 3 ? (
              <div className="grid gap-4 xl:grid-cols-[1fr_300px]">
                <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                  <div className="mb-3 flex items-center gap-2">
                    <Sparkles size={16} className="text-indigo-600" aria-hidden="true" />
                    <p className="text-sm font-semibold text-slate-900">AI phân tích yêu cầu</p>
                  </div>
                  <p className="text-sm text-slate-700">
                    AI đề xuất chia dự án thành 7 module: firmware STM32, gateway ESP32, dashboard realtime, cảnh báo Telegram và tài liệu bảo vệ.
                  </p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {['Sơ đồ khối', 'Firmware', 'Gateway MQTT', 'Dashboard', 'Báo cáo'].map((module) => (
                      <Badge key={module}>{module}</Badge>
                    ))}
                  </div>
                </div>
                <div className="rounded-xl border border-slate-200 p-4">
                  <p className="text-sm font-semibold text-slate-900">Ước lượng</p>
                  <p className="mt-1 text-2xl font-bold text-slate-900">~ 24 ngày</p>
                  <p className="mt-2 text-xs text-slate-600">Ngân sách gợi ý: 4.0 - 4.8 triệu</p>
                </div>
              </div>
            ) : null}

            {step === 4 ? (
              <div className="grid gap-3 md:grid-cols-2">
                {[
                  ['Loại hỗ trợ', supportType],
                  ['Đề tài', title || 'Chưa nhập'],
                  ['Deadline', deadline || 'Chưa nhập'],
                  ['Trạng thái sau khi gửi', 'Chờ báo giá'],
                ].map(([label, value]) => (
                  <div key={label} className="rounded-xl bg-slate-50 p-3">
                    <p className="text-[11px] font-semibold uppercase tracking-[0.08em] text-slate-500">{label}</p>
                    <p className="mt-1 text-sm font-semibold text-slate-900">{value}</p>
                  </div>
                ))}
              </div>
            ) : null}

            <div className="flex flex-wrap justify-between gap-2">
              <Button variant="secondary" type="button" onClick={() => (step === 1 ? navigate(ROUTES.USER_DASHBOARD) : setStep((current) => current - 1))}>
                Quay lại
              </Button>
              <div className="flex gap-2">
                {step < 4 ? (
                  <Button type="button" onClick={() => setStep((current) => current + 1)}>
                    Tiếp tục <ArrowRight size={14} aria-hidden="true" />
                  </Button>
                ) : (
                  <Button type="submit">Gửi yêu cầu báo giá</Button>
                )}
              </div>
            </div>
          </form>
        </Card>
      </section>
    </>
  )
}
