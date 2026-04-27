import { FolderKanban, Send, Wallet, Bookmark } from 'lucide-react'
import { Link } from 'react-router-dom'
import { MetricCard } from '../../../components/shared/MetricCard'
import { SectionHeading } from '../../../components/shared/SectionHeading'
import { Card } from '../../../components/ui/Card'
import { Button } from '../../../components/ui/Button'
import { Seo } from '../../../core/seo/Seo'
import { ROUTES } from '../../../core/constants/routes'

export function DashboardPage() {
  return (
    <>
      <Seo title="User Dashboard" description="Tổng quan dự án và hoạt động người dùng." />

      <section className="space-y-6">
        <SectionHeading
          eyebrow="User"
          title="Dashboard người dùng"
          description="Theo dõi đơn, yêu cầu và ví trong một màn hình tổng quan."
        />

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <MetricCard label="Đơn đang làm" value="2" icon={FolderKanban} />
          <MetricCard label="Yêu cầu mở" value="4" icon={Send} />
          <MetricCard label="Số dư ví" value="1.200.000đ" icon={Wallet} />
          <MetricCard label="Bài đã lưu" value="34" icon={Bookmark} />
        </div>

        <Card className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h3 className="text-base font-semibold text-slate-900">Bắt đầu yêu cầu mới</h3>
            <p className="text-sm text-slate-600">Tạo request có cấu trúc để mentor báo giá nhanh hơn.</p>
          </div>
          <Link to={ROUTES.USER_WIZARD}><Button>Tạo yêu cầu mới</Button></Link>
        </Card>
      </section>
    </>
  )
}
