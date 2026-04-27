import { Card } from '../../../components/ui/Card'
import { Input } from '../../../components/ui/Input'
import { Button } from '../../../components/ui/Button'
import { SectionHeading } from '../../../components/shared/SectionHeading'
import { Seo } from '../../../core/seo/Seo'

export function ProfilePage() {
  return (
    <>
      <Seo title="Hồ sơ" description="Thông tin cá nhân người dùng." />
      <section className="space-y-6">
        <SectionHeading eyebrow="Account" title="Hồ sơ cá nhân" description="Thông tin tài khoản và cấu hình liên hệ nội bộ." />
        <Card>
          <form className="grid gap-3 md:grid-cols-2" onSubmit={(event) => event.preventDefault()}>
            <label className="space-y-2 text-sm font-medium text-slate-700">Họ và tên<Input defaultValue="Nguyễn Minh Anh" /></label>
            <label className="space-y-2 text-sm font-medium text-slate-700">Email<Input defaultValue="minhanh@example.com" type="email" /></label>
            <div className="md:col-span-2">
              <Button type="submit">Lưu thay đổi</Button>
            </div>
          </form>
        </Card>
      </section>
    </>
  )
}
