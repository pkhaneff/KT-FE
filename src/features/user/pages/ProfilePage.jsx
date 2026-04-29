import { useEffect, useRef, useState } from 'react'
import { Camera, CircleUserRound } from 'lucide-react'
import { Card } from '../../../components/ui/Card'
import { Input } from '../../../components/ui/Input'
import { Button } from '../../../components/ui/Button'
import { AppToggleSwitch } from '../../../components/ui/AppToggleSwitch'
import { SectionHeading } from '../../../components/shared/SectionHeading'
import { Seo } from '../../../core/seo/Seo'
import { useAuth } from '../../auth'

const PROFILE_SETTING_ITEMS = [
  'Nhận email bài viết mới',
  'Ẩn thông tin liên hệ với đối tác',
  'Thông báo request',
  'Bảo mật đăng nhập 2FA',
]

export function ProfilePage() {
  const { profile, saveProfile, saveAvatar, submitting, avatarSubmitting } = useAuth()
  const fileInputRef = useRef(null)
  const [avatarPreview, setAvatarPreview] = useState('')
  const [showAvatarPopup, setShowAvatarPopup] = useState(false)
  const [formValues, setFormValues] = useState({
    fullName: '',
    email: '',
    organization: '',
    studyField: '',
    major: '',
    phoneNumber: '',
  })
  const [enabledSettings, setEnabledSettings] = useState(new Set(PROFILE_SETTING_ITEMS))
  const [successMessage, setSuccessMessage] = useState('')
  const [errorMessage, setErrorMessage] = useState('')

  useEffect(() => {
    setFormValues({
      fullName: profile?.full_name || '',
      email: profile?.email || '',
      organization: profile?.organization || '',
      studyField: profile?.study_field || '',
      major: profile?.major || '',
      phoneNumber: profile?.phone_number || '',
    })
  }, [profile])

  useEffect(() => {
    return () => {
      if (avatarPreview) {
        URL.revokeObjectURL(avatarPreview)
      }
    }
  }, [avatarPreview])

  const avatarSrc = avatarPreview || profile?.avatar || ''
  const isVerified = (profile?.status || '').toLowerCase() === 'verified'

  const handleFieldChange = (event) => {
    const { name, value } = event.target
    setFormValues((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleAvatarClick = () => {
    setShowAvatarPopup((prev) => !prev)
  }

  const handleAvatarFileChange = async (event) => {
    const file = event.target.files?.[0]
    if (!file) {
      return
    }

    setSuccessMessage('')
    setErrorMessage('')
    setShowAvatarPopup(false)

    if (avatarPreview) {
      URL.revokeObjectURL(avatarPreview)
    }

    const previewUrl = URL.createObjectURL(file)
    setAvatarPreview(previewUrl)

    try {
      await saveAvatar(file)
      URL.revokeObjectURL(previewUrl)
      setAvatarPreview('')
      setSuccessMessage('Đã cập nhật ảnh đại diện.')
    } catch (error) {
      URL.revokeObjectURL(previewUrl)
      setAvatarPreview('')
      setErrorMessage(error?.message || 'Không thể cập nhật ảnh đại diện. Vui lòng thử lại.')
    } finally {
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
    }
  }

  const toggleSetting = (name) => {
    setEnabledSettings((prev) => {
      const next = new Set(prev)
      if (next.has(name)) {
        next.delete(name)
      } else {
        next.add(name)
      }
      return next
    })
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setSuccessMessage('')
    setErrorMessage('')

    try {
      await saveProfile({
        fullName: formValues.fullName.trim(),
        email: formValues.email.trim(),
        organization: formValues.organization.trim(),
        studyField: formValues.studyField.trim(),
        major: formValues.major.trim(),
        phoneNumber: formValues.phoneNumber.trim(),
      })
      setSuccessMessage('Đã cập nhật hồ sơ thành công.')
    } catch (error) {
      setErrorMessage(error?.message || 'Không thể cập nhật hồ sơ. Vui lòng thử lại.')
    }
  }

  return (
    <>
      <Seo title="Hồ sơ" description="Thông tin cá nhân người dùng." />
      <section className="space-y-6">
        <SectionHeading eyebrow="Account" title="Hồ sơ cá nhân" description="Cập nhật nhanh thông tin học tập và liên hệ của bạn." />

        <div className="grid gap-5 xl:grid-cols-[2fr_1fr]">
          <Card className="grid gap-4 md:grid-cols-[136px_1fr] md:items-center">
            <div className="relative">
              <button
                type="button"
                onClick={handleAvatarClick}
                className="group relative inline-flex size-[128px] items-center justify-center overflow-hidden rounded-2xl bg-indigo-50 text-indigo-600"
                aria-label="Cập nhật ảnh đại diện"
              >
                {avatarSrc ? (
                  <img src={avatarSrc} alt="Avatar" className="size-full object-cover" />
                ) : (
                  <CircleUserRound size={72} aria-hidden="true" />
                )}
                <span className="absolute inset-0 hidden items-center justify-center bg-slate-900/60 text-white group-hover:flex">
                  {avatarSubmitting ? 'Đang cập nhật...' : <Camera size={18} aria-hidden="true" />}
                </span>
              </button>

              {avatarSubmitting ? <span className="absolute -right-1 -top-1 size-3 animate-pulse rounded-full bg-indigo-500" aria-hidden="true" /> : null}

              {showAvatarPopup ? (
                <div className="absolute left-0 top-full z-20 mt-2 w-56 rounded-xl border border-slate-200 bg-white p-3 shadow-lg">
                  <p className="text-xs font-medium text-slate-600">Chọn ảnh PNG/JPG để cập nhật.</p>
                  <Button
                    type="button"
                    size="sm"
                    className="mt-2 w-full"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={avatarSubmitting}
                  >
                    Chọn ảnh mới
                  </Button>
                </div>
              ) : null}

              <input
                ref={fileInputRef}
                type="file"
                accept="image/png,image/jpeg"
                className="hidden"
                onChange={handleAvatarFileChange}
              />
            </div>

            <div>
              <div className="flex flex-wrap items-center gap-2">
                <p className="text-2xl font-bold text-slate-900">{profile?.full_name || 'Người dùng'}</p>
                <span
                  className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold ${
                    isVerified ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
                  }`}
                >
                  {isVerified ? 'Đã xác minh' : 'Chưa xác minh'}
                </span>
              </div>
              <p className="mt-1 text-sm text-slate-600"><span className="font-semibold text-slate-900">Email:</span> {profile?.email || 'ProjectMentor Hub'}</p>
              <div className="mt-2 space-y-1 text-sm text-slate-600">
                <p><span className="font-semibold text-slate-900">Ngành:</span> {profile?.study_field || 'Chưa cập nhật'}</p>
                <p><span className="font-semibold text-slate-900">Chuyên ngành:</span> {profile?.major || 'Chưa cập nhật'}</p>
              </div>
              {isVerified ? (
                <p className="mt-2 text-xs text-amber-700">Thông tin liên hệ chỉ hiển thị với bạn và admin, mentor không thấy email hoặc thông tin thanh toán.</p>
              ) : (
                <p className="mt-2 text-xs text-amber-700">Tài khoản chưa xác minh. Hãy cập nhật đầy đủ thông tin.</p>
              )}
            </div>
          </Card>

          <Card className="space-y-2 rounded-xl border border-slate-200 bg-slate-50 p-3">
            <p className="text-sm font-semibold text-slate-900">Hoạt động</p>
            <div className="space-y-2 text-sm">
              {[
                ['Đồ án đã hỗ trợ', '4'],
                ['Bài viết đã lưu', '34'],
                ['Request đã tạo', '18'],
              ].map(([label, value]) => (
                <div key={label} className="flex items-center justify-between border-t border-slate-200 pt-2 first:border-t-0 first:pt-0">
                  <span className="text-slate-600">{label}</span>
                  <span className="font-semibold text-slate-900">{value}</span>
                </div>
              ))}
            </div>
          </Card>
        </div>

        <div className="grid gap-5 xl:grid-cols-[2fr_1fr]">
          <Card>
            <p className="mb-3 text-sm font-semibold text-slate-900">Thông tin hồ sơ</p>
            <form className="space-y-3" onSubmit={handleSubmit}>
              <div className="grid gap-3 md:grid-cols-2">
                <label className="space-y-2 text-sm font-medium text-slate-700">
                  Họ và tên
                  <Input name="fullName" value={formValues.fullName} onChange={handleFieldChange} minLength={2} maxLength={255} required />
                </label>
                <label className="space-y-2 text-sm font-medium text-slate-700">
                  Email
                  <Input name="email" value={formValues.email} onChange={handleFieldChange} type="email" required />
                </label>
                <label className="space-y-2 text-sm font-medium text-slate-700">
                  Trường
                  <Input name="organization" value={formValues.organization} onChange={handleFieldChange} minLength={2} maxLength={255} required />
                </label>
                <label className="space-y-2 text-sm font-medium text-slate-700">
                  Ngành học
                  <Input name="studyField" value={formValues.studyField} onChange={handleFieldChange} minLength={2} maxLength={255} required />
                </label>
                <label className="space-y-2 text-sm font-medium text-slate-700">
                  Số điện thoại
                  <Input name="phoneNumber" value={formValues.phoneNumber} onChange={handleFieldChange} minLength={8} maxLength={20} type="tel" required />
                </label>
                <label className="space-y-2 text-sm font-medium text-slate-700">
                  Chuyên ngành
                  <Input name="major" value={formValues.major} onChange={handleFieldChange} minLength={2} maxLength={255} required />
                </label>
              </div>

              {errorMessage ? <p className="text-sm font-medium text-rose-600">{errorMessage}</p> : null}
              {successMessage ? <p className="text-sm font-medium text-emerald-700">{successMessage}</p> : null}

              <div className="flex justify-center">
                <Button type="submit" disabled={submitting}>Lưu thay đổi</Button>
              </div>
            </form>
          </Card>

          <div className="space-y-4">
            <Card>
              <p className="mb-3 text-sm font-semibold text-slate-900">Cài đặt</p>
              <div className="space-y-2">
                {PROFILE_SETTING_ITEMS.map((item) => {
                  const enabled = enabledSettings.has(item)
                  return (
                    <div key={item} className="flex items-center justify-between gap-3 rounded-lg border border-slate-200 p-3">
                      <p className="text-sm font-medium text-slate-900">{item}</p>
                      <AppToggleSwitch
                        checked={enabled}
                        onChange={() => toggleSetting(item)}
                        ariaLabel={enabled ? 'Đang bật, nhấn để tắt' : 'Đang tắt, nhấn để bật'}
                      />
                    </div>
                  )
                })}
              </div>
            </Card>
          </div>
        </div>
      </section>
    </>
  )
}
