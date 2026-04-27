import { Card } from '../../../components/ui/Card'
import { Badge } from '../../../components/ui/Badge'
import { SectionHeading } from '../../../components/shared/SectionHeading'
import { Seo } from '../../../core/seo/Seo'

const packages = [
  { title: 'Starter', price: '2.400.000đ', level: 'Cơ bản', scope: '2 - 4 tuần' },
  { title: 'Growth', price: '4.200.000đ', level: 'Trung bình', scope: '4 - 6 tuần' },
  { title: 'Advanced', price: '5.800.000đ', level: 'Nâng cao', scope: '5 - 7 tuần' },
]

export function PricingPage() {
  return (
    <>
      <Seo title="Bảng giá" description="Gói hỗ trợ đồ án phù hợp theo mức độ dự án." />
      <section className="space-y-6">
        <SectionHeading eyebrow="Pricing" title="Bảng giá tham khảo" description="Chi phí minh bạch theo độ khó và timeline thực hiện." />

        <div className="grid gap-4 md:grid-cols-3">
          {packages.map((item) => (
            <Card key={item.title} className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-slate-900">{item.title}</h3>
                <Badge>{item.level}</Badge>
              </div>
              <p className="text-2xl font-bold text-indigo-700">{item.price}</p>
              <p className="text-sm text-slate-600">Timeline: {item.scope}</p>
            </Card>
          ))}
        </div>
      </section>
    </>
  )
}
