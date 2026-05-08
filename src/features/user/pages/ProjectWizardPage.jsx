import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Steps } from 'antd'
import { ArrowRight, Bot, Check, Cpu, Globe, Sparkles } from 'lucide-react'
import { SectionHeading } from '../../../components/shared/SectionHeading'
import { Card } from '../../../components/ui/Card'
import { Input } from '../../../components/ui/Input'
import { Button } from '../../../components/ui/Button'
import { Badge } from '../../../components/ui/Badge'
import { Slider } from '@/components/base/slider/slider'
import { DatePicker } from '@/components/base/date-picker/date-picker'
import { Seo } from '../../../core/seo/Seo'
import { ROUTES } from '../../../core/constants/routes'
import { sanitizeText } from '../../../core/utils/sanitizeText'
import { useAuth } from '../../auth/hooks/useAuth'
import { createProjectRequest, listProjectTypes } from '../services/projectRequestApi'

const STEPS = [
  { title: 'Đăng kí yêu cầu dự án', subtitle: 'Điền thông tin sản phẩm' },
  { title: 'Xác nhận gửi yêu cầu báo giá', subtitle: 'Kiểm tra trước khi gửi' },
]
const SUPPORT_TYPES = [
  { key: 'IoT/Embedded', icon: Cpu, description: 'Hỗ trợ mạch, firmware, gateway và nền tảng điều khiển liên quan.' },
  { key: 'Web app', icon: Globe, description: 'Hỗ trợ fullstack, API, dashboard và triển khai theo milestone.' },
  { key: 'AI/ML', icon: Sparkles, description: 'Hỗ trợ model, pipeline dữ liệu, đánh giá và tối ưu mô hình.' },
  { key: 'Robotics', icon: Bot, description: 'Hỗ trợ điều khiển robot, tích hợp cảm biến, navigation và automation.' },
]

const MIN_BUDGET = 100000
const MAX_BUDGET = 30000000
const BUDGET_STEP = 100000

function formatCurrency(value) {
  if (!Number.isFinite(value)) {
    return ''
  }

  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
    maximumFractionDigits: 0,
  }).format(value)
}

function toNormalizedList(value) {
  return sanitizeText(value)
    .split(/[,\n]/)
    .map((item) => item.trim())
    .filter(Boolean)
}

function normalizeName(value) {
  return sanitizeText(value).toLowerCase()
}

function pickProjectTypeId(projectTypes, supportType) {
  if (!Array.isArray(projectTypes) || projectTypes.length === 0) {
    return null
  }

  const normalizedSupport = normalizeName(supportType)
  const exactMatch = projectTypes.find((item) => normalizeName(item?.name) === normalizedSupport)
  if (exactMatch?.id) {
    return exactMatch.id
  }

  const keywordMap = {
    iot: ['iot', 'embedded', 'firmware'],
    web: ['web', 'dashboard', 'fullstack'],
    ai: ['ai', 'data', 'ml'],
    robotics: ['robot', 'robotics', 'automation'],
  }

  const supportKeywords = Object.entries(keywordMap).find(([key]) => normalizedSupport.includes(key))?.[1] || []
  if (supportKeywords.length) {
    const partialMatch = projectTypes.find((item) => {
      const normalizedName = normalizeName(item?.name)
      return supportKeywords.some((keyword) => normalizedName.includes(keyword))
    })
    if (partialMatch?.id) {
      return partialMatch.id
    }
  }

  return projectTypes[0]?.id || null
}

function parseBudgetValue(rawBudget) {
  if (typeof rawBudget === 'number') {
    return Number.isFinite(rawBudget) && rawBudget > 0 ? rawBudget : null
  }

  const normalized = sanitizeText(rawBudget)
  const matched = normalized.match(/\d+(?:[.,]\d+)?/)
  if (!matched) {
    return null
  }

  const parsed = Number(matched[0].replace(',', '.'))
  if (!Number.isFinite(parsed) || parsed <= 0) {
    return null
  }

  return parsed
}

function parseDeadlineToIso(rawDeadline) {
  const normalized = sanitizeText(rawDeadline)
  if (!normalized) {
    return null
  }

  const direct = new Date(normalized)
  if (!Number.isNaN(direct.getTime())) {
    return direct.toISOString()
  }

  const parts = normalized.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/)
  if (!parts) {
    return null
  }

  const [, day, month, year] = parts
  const parsed = new Date(`${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}T00:00:00.000Z`)
  if (Number.isNaN(parsed.getTime())) {
    return null
  }

  return parsed.toISOString()
}

export function ProjectWizardPage() {
  const navigate = useNavigate()
  const { accessToken } = useAuth()
  const [step, setStep] = useState(1)
  const [supportType, setSupportType] = useState(SUPPORT_TYPES[0].key)
  const [title, setTitle] = useState('')
  const [budget, setBudget] = useState(5000000)
  const [budgetInput, setBudgetInput] = useState(String(5000000))
  const [technologies, setTechnologies] = useState('')
  const [deliverables, setDeliverables] = useState('')
  const [scope, setScope] = useState('')
  const [deadline, setDeadline] = useState('')
  const [projectTypes, setProjectTypes] = useState([])
  const [projectTypesLoading, setProjectTypesLoading] = useState(true)
  const [submitError, setSubmitError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const normalizedTitle = sanitizeText(title)
  const normalizedTechnologies = sanitizeText(technologies)
  const normalizedDeliverables = sanitizeText(deliverables)
  const normalizedScope = sanitizeText(scope)
  const normalizedDeadline = sanitizeText(deadline)
  const budgetLabel = formatCurrency(budget)
  const technologyList = toNormalizedList(technologies)
  const deliverableList = toNormalizedList(deliverables)
  const isStepOneValid = Boolean(
    normalizedTitle &&
      Number.isFinite(budget) &&
      budget >= MIN_BUDGET &&
      normalizedTechnologies &&
      normalizedDeliverables &&
      normalizedScope &&
      normalizedDeadline,
  )

  const clampBudget = (value) => Math.min(Math.max(value, MIN_BUDGET), MAX_BUDGET)

  const handleBudgetSliderChange = (value) => {
    const nextValue = clampBudget(value)
    setBudget(nextValue)
    setBudgetInput(String(nextValue))
  }

  const handleBudgetInputChange = (event) => {
    const rawValue = event.target.value
    const digitsOnly = rawValue.replace(/[^0-9]/g, '')
    setBudgetInput(digitsOnly)

    if (!digitsOnly) {
      return
    }

    const parsed = Number(digitsOnly)
    if (!Number.isFinite(parsed) || parsed < MIN_BUDGET) {
      return
    }

    setBudget(clampBudget(parsed))
  }

  const handleBudgetInputBlur = () => {
    const parsed = Number(budgetInput)
    if (!Number.isFinite(parsed) || parsed < MIN_BUDGET) {
      setBudget(MIN_BUDGET)
      setBudgetInput(String(MIN_BUDGET))
      return
    }

    const nextValue = clampBudget(parsed)
    setBudget(nextValue)
    setBudgetInput(String(nextValue))
  }

  useEffect(() => {
    let mounted = true

    async function bootstrapProjectTypes() {
      setProjectTypesLoading(true)
      try {
        const items = await listProjectTypes()
        if (mounted) {
          setProjectTypes(Array.isArray(items) ? items : [])
        }
      } catch {
        if (mounted) {
          setProjectTypes([])
        }
      } finally {
        if (mounted) {
          setProjectTypesLoading(false)
        }
      }
    }

    bootstrapProjectTypes()

    return () => {
      mounted = false
    }
  }, [])

  const handleStepChange = (stepNumber) => {
    if (stepNumber > step) {
      return
    }

    if (stepNumber === 2 && !isStepOneValid) {
      return
    }

    setStep(stepNumber)
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setSubmitError('')

    if (!isStepOneValid) {
      return
    }

    if (step === 1) {
      setStep(2)
      return
    }

    if (!accessToken) {
      setSubmitError('Phiên đăng nhập không hợp lệ. Vui lòng đăng nhập lại.')
      return
    }

    const projectTypeId = pickProjectTypeId(projectTypes, supportType)
    if (!projectTypeId) {
      setSubmitError('Không tìm thấy loại dự án phù hợp. Vui lòng thử lại sau.')
      return
    }

    const budgetValue = parseBudgetValue(budget)
    const deadlineAt = parseDeadlineToIso(normalizedDeadline)
    const payload = {
      type: supportType,
      title: normalizedTitle,
      technology: normalizedTechnologies,
      requirement: normalizedScope,
      deliverables: normalizedDeliverables,
      description: normalizedScope,
      project_type_id: projectTypeId,
      ...(budgetValue ? { budget: budgetValue } : {}),
      ...(deadlineAt ? { deadline_at: deadlineAt } : {}),
    }

    setSubmitting(true)
    try {
      await createProjectRequest(accessToken, payload)
      navigate(ROUTES.USER_REQUESTS)
    } catch (error) {
      setSubmitError(error?.message || 'Gửi yêu cầu thất bại. Vui lòng thử lại.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <>
      <Seo title="Project Wizard" description="Tạo yêu cầu dự án theo form chuẩn hóa." />
      <section className="space-y-6">
        <SectionHeading eyebrow="User" title="Tạo yêu cầu cho mentor" description="Luồng 2 bước để đăng kí dự án và xác nhận gửi yêu cầu báo giá." />

        <div className="rounded-2xl border border-slate-200 bg-white p-4 md:p-6">
          <Steps
            current={step - 1}
            onChange={(value) => handleStepChange(value + 1)}
            items={STEPS.map((item, index) => ({
              title: item.title,
              description: item.subtitle,
              icon: index === 0 ? <ArrowRight size={16} /> : <Check size={16} />,
            }))}
          />
        </div>

        <Card>
          <form className="space-y-4" onSubmit={handleSubmit}>
            {step === 1 ? (
              <div className="grid gap-4">
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

                <div className="grid gap-4 md:grid-cols-2">
                  <label className="block space-y-2 text-sm font-medium text-slate-700">
                    Tên sản phẩm
                    <Input
                      value={title}
                      onChange={(event) => setTitle(event.target.value)}
                      placeholder="Ví dụ: Dashboard MQTT cho nhà kính IoT"
                      required
                    />
                  </label>
                  <label className="block space-y-2 text-sm font-medium text-slate-700">
                    Budget có thể chi
                    <div className="rounded-xl border border-slate-200 bg-white px-4 py-3">
                      <div className="flex items-center gap-3">
                        <span className="min-w-[84px] text-left text-xs font-semibold text-slate-500">
                          {formatCurrency(MIN_BUDGET)}
                        </span>
                        <div className="flex-1">
                          <Slider
                            min={MIN_BUDGET}
                            max={MAX_BUDGET}
                            step={BUDGET_STEP}
                            value={budget}
                            onValueChange={handleBudgetSliderChange}
                            labelPosition="none"
                            labelFormatter={formatCurrency}
                            labelEditable
                            labelInputValue={budgetInput}
                            onLabelInputChange={handleBudgetInputChange}
                            onLabelInputBlur={handleBudgetInputBlur}
                            labelInputMode="numeric"
                            labelPlaceholder="Nhap so VND"
                            showValueOnThumb
                          />
                        </div>
                        <span className="min-w-[96px] text-right text-xs font-semibold text-slate-500">
                          {formatCurrency(MAX_BUDGET)}
                        </span>
                      </div>
                    </div>
                  </label>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <label className="block space-y-2 text-sm font-medium text-slate-700">
                    Công nghệ mong muốn
                    <Input
                      value={technologies}
                      onChange={(event) => setTechnologies(event.target.value)}
                      placeholder="Ví dụ: React, Node.js, MQTT"
                      required
                    />
                  </label>
                  <label className="block space-y-2 text-sm font-medium text-slate-700">
                    Deadline dự kiến
                    <DatePicker value={deadline} onChange={setDeadline} required />
                  </label>
                </div>

                <label className="block space-y-2 text-sm font-medium text-slate-700">
                  Sản phẩm bao gồm
                  <textarea
                    value={deliverables}
                    onChange={(event) => setDeliverables(event.target.value)}
                    className="min-h-24 w-full rounded-lg border border-slate-300 p-3 text-sm outline-none ring-indigo-200 focus-visible:ring-2"
                    placeholder="Ví dụ: Báo cáo, mã nguồn, slide, tài liệu hướng dẫn"
                    required
                  />
                </label>

                <label className="block space-y-2 text-sm font-medium text-slate-700">
                  Requirement / Mô tả sản phẩm
                  <textarea
                    value={scope}
                    onChange={(event) => setScope(event.target.value)}
                    className="min-h-32 w-full rounded-lg border border-slate-300 p-3 text-sm outline-none ring-indigo-200 focus-visible:ring-2"
                    placeholder="Mục tiêu, phạm vi, tiêu chí hoàn thiện..."
                    required
                  />
                </label>
              </div>
            ) : null}

            {step === 2 ? (
              <div className="grid gap-3 md:grid-cols-2">
                {[
                  ['Loại sản phẩm', supportType],
                  ['Tên sản phẩm', normalizedTitle || 'Chưa nhập'],
                  ['Budget', budgetLabel || 'Chưa nhập'],
                  ['Requirement', normalizedScope || 'Chưa nhập'],
                  ['Deadline', normalizedDeadline || 'Chưa nhập'],
                  ['Trạng thái sau khi gửi', 'Chờ báo giá'],
                ].map(([label, value]) => (
                  <div key={label} className="rounded-xl bg-slate-50 p-3">
                    <p className="text-[11px] font-semibold uppercase tracking-[0.08em] text-slate-500">{label}</p>
                    <p className="mt-1 text-sm font-semibold text-slate-900">{value}</p>
                  </div>
                ))}
              </div>
            ) : null}

            {step === 2 ? (
              <div className="grid gap-3 md:grid-cols-2">
                <div className="rounded-xl border border-slate-200 p-3">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.08em] text-slate-500">Công nghệ tách danh sách</p>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {technologyList.length ? technologyList.map((item) => <Badge key={item}>{item}</Badge>) : <p className="text-sm text-slate-500">Chưa nhập</p>}
                  </div>
                </div>
                <div className="rounded-xl border border-slate-200 p-3">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.08em] text-slate-500">Sản phẩm bàn giao</p>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {deliverableList.length ? deliverableList.map((item) => <Badge key={item}>{item}</Badge>) : <p className="text-sm text-slate-500">Chưa nhập</p>}
                  </div>
                </div>
              </div>
            ) : null}

            {step === 1 ? (
              <div className="flex justify-end">
                <Button type="button" onClick={() => setStep(2)} disabled={!isStepOneValid}>
                  Tiếp tục <ArrowRight size={14} aria-hidden="true" />
                </Button>
              </div>
            ) : (
              <div className="flex flex-wrap justify-between gap-2">
                <Button variant="secondary" type="button" onClick={() => setStep(1)}>
                  Quay lại để sửa
                </Button>
                <Button type="submit" disabled={submitting || projectTypesLoading}>
                  {submitting ? 'Đang gửi...' : 'Xác nhận và gửi yêu cầu báo giá'}
                </Button>
              </div>
            )}

            {submitError ? <p className="text-sm font-medium text-rose-600">{submitError}</p> : null}
          </form>
        </Card>
      </section>
    </>
  )
}
