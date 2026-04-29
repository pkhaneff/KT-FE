import { useState } from 'react'
import { Card } from '../../../components/ui/Card'
import { Button } from '../../../components/ui/Button'
import { AppToggleSwitch } from '../../../components/ui/AppToggleSwitch'
import { SectionHeading } from '../../../components/shared/SectionHeading'
import { Seo } from '../../../core/seo/Seo'

const SETTING_ITEMS = [
  'Bảo mật đăng nhập 2FA',
  'Thông báo request',
  'Ẩn thông tin liên hệ với đối tác',
  'Cho phép AI tóm tắt tiến độ',
  'Nhận email bài viết mới',
  'Chế độ tiết kiệm dữ liệu',
]

export function SettingsPage() {
  const [enabledSettings, setEnabledSettings] = useState(new Set(SETTING_ITEMS.slice(0, 4)))

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

  return (
    <>
      <Seo title="Cài đặt" description="Tùy chọn hệ thống người dùng." />
      <section className="space-y-6">
        <SectionHeading eyebrow="Settings" title="Cài đặt người dùng" description="Quản lý thông báo, riêng tư và bảo mật đăng nhập." />

        <div className="grid gap-4 md:grid-cols-2">
          {SETTING_ITEMS.map((item) => {
            const enabled = enabledSettings.has(item)
            return (
              <Card key={item} className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-sm font-semibold text-slate-900">{item}</p>
                  <p className="text-xs text-slate-500">Có thể thay đổi bất kỳ lúc nào.</p>
                </div>
                <AppToggleSwitch
                  checked={enabled}
                  onChange={() => toggleSetting(item)}
                  ariaLabel={enabled ? 'Đang bật, nhấn để tắt' : 'Đang tắt, nhấn để bật'}
                />
              </Card>
            )
          })}
        </div>

        <div className="flex justify-end">
          <Button variant="secondary">Cập nhật cài đặt</Button>
        </div>
      </section>
    </>
  )
}
