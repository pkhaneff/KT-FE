import { useParams } from 'react-router-dom'
import { Card } from '../../../components/ui/Card'
import { Badge } from '../../../components/ui/Badge'
import { SectionHeading } from '../../../components/shared/SectionHeading'
import { Seo } from '../../../core/seo/Seo'

export function OrderDetailPage() {
  const { orderId } = useParams()

  return (
    <>
      <Seo title="Chi tiết đơn" description="Chi tiết tiến độ và giao tiếp theo từng đơn." />
      <section className="space-y-6">
        <SectionHeading eyebrow="Order" title={`Chi tiết đơn ${orderId}`} description="Tổng quan trạng thái, phạm vi và mốc bàn giao." />
        <Card className="space-y-3">
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="success">Đang triển khai</Badge>
            <Badge>Milestone 2/4</Badge>
          </div>
          <p className="text-sm text-slate-700">Đây là trang chi tiết đơn, sẽ tích hợp timeline + request thread + tệp đính kèm trong phase tiếp theo.</p>
        </Card>
      </section>
    </>
  )
}
