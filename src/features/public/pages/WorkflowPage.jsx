import { Card } from '../../../components/ui/Card'
import { SectionHeading } from '../../../components/shared/SectionHeading'
import { Seo } from '../../../core/seo/Seo'

const steps = [
  'Tạo yêu cầu với thông tin dự án và phạm vi.',
  'Mentor gửi báo giá và timeline chi tiết.',
  'Hai bên triển khai theo milestone có kiểm soát.',
  'Nghiệm thu, bàn giao và xác nhận thanh toán.',
]

export function WorkflowPage() {
  return (
    <>
      <Seo title="Quy trình" description="Quy trình làm việc minh bạch và kiểm soát rủi ro." />
      <section className="space-y-6">
        <SectionHeading eyebrow="Workflow" title="Quy trình làm việc 4 bước" description="Chuẩn hóa để đảm bảo tiến độ, chất lượng và khả năng kiểm soát thay đổi phạm vi." />

        <div className="grid gap-4 md:grid-cols-2">
          {steps.map((step, index) => (
            <Card key={step}>
              <p className="text-xs font-semibold uppercase tracking-[0.12em] text-indigo-600">Bước {index + 1}</p>
              <p className="mt-2 text-sm text-slate-700">{step}</p>
            </Card>
          ))}
        </div>
      </section>
    </>
  )
}
