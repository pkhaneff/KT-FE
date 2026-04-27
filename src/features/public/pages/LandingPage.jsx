import { Link } from 'react-router-dom'
import { ArrowRight, CheckCircle2, ShieldCheck, TrendingUp } from 'lucide-react'
import { Button } from '../../../components/ui/Button'
import { Card } from '../../../components/ui/Card'
import { SectionHeading } from '../../../components/shared/SectionHeading'
import { ROUTES } from '../../../core/constants/routes'
import { Seo } from '../../../core/seo/Seo'

const highlights = [
  {
    icon: ShieldCheck,
    title: 'Quy trình an toàn',
    description: 'Request được kiểm soát đầu vào, có kiểm duyệt và nhật ký truy vết.',
  },
  {
    icon: TrendingUp,
    title: 'Theo dõi tiến độ rõ ràng',
    description: 'Milestone, trạng thái, thanh toán minh bạch theo từng bước.',
  },
  {
    icon: CheckCircle2,
    title: 'Chuẩn production',
    description: 'Kiến trúc mở rộng theo module, dễ scale và nâng cấp liên tục.',
  },
]

export function LandingPage() {
  return (
    <>
      <Seo title="Tổng quan" description="Nền tảng hỗ trợ đồ án và dự án kỹ thuật cho sinh viên." />

      <section className="space-y-6">
        <SectionHeading
          eyebrow="ProjectMentor Hub"
          title="Nền tảng kết nối mentor và sinh viên cho dự án kỹ thuật"
          description="Quản lý yêu cầu, theo dõi tiến độ, thanh toán và học tập kiến thức trong một hệ thống nhất quán."
        />

        <div className="flex flex-wrap gap-3">
          <Link to={ROUTES.PUBLIC_REGISTER}><Button>Bắt đầu miễn phí <ArrowRight size={16} aria-hidden="true" /></Button></Link>
          <Link to={ROUTES.PUBLIC_WORKFLOW}><Button variant="secondary">Xem quy trình</Button></Link>
        </div>
      </section>

      <section className="mt-10 grid gap-4 md:grid-cols-3">
        {highlights.map((item) => (
          <Card key={item.title}>
            <item.icon className="text-indigo-600" size={20} aria-hidden="true" />
            <h3 className="mt-3 text-lg font-semibold text-slate-900">{item.title}</h3>
            <p className="mt-2 text-sm text-slate-600">{item.description}</p>
          </Card>
        ))}
      </section>
    </>
  )
}
