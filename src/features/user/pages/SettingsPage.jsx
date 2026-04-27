import { Card } from '../../../components/ui/Card'
import { Button } from '../../../components/ui/Button'
import { SectionHeading } from '../../../components/shared/SectionHeading'
import { Seo } from '../../../core/seo/Seo'

export function SettingsPage() {
  return (
    <>
      <Seo title="Cài đặt" description="Tùy chọn hệ thống người dùng." />
      <section className="space-y-6">
        <SectionHeading eyebrow="Settings" title="Cài đặt người dùng" description="Quản lý thông báo, riêng tư và bảo mật đăng nhập." />

        <Card className="space-y-4">
          <label className="flex items-center justify-between gap-2 rounded-lg border border-slate-200 p-3 text-sm">
            Bật email thông báo
            <input type="checkbox" defaultChecked className="size-4" />
          </label>

          <label className="flex items-center justify-between gap-2 rounded-lg border border-slate-200 p-3 text-sm">
            Bật cảnh báo bảo mật
            <input type="checkbox" defaultChecked className="size-4" />
          </label>

          <Button variant="secondary">Cập nhật cài đặt</Button>
        </Card>
      </section>
    </>
  )
}
