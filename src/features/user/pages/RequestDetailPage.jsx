import { useParams } from 'react-router-dom'
import { Card } from '../../../components/ui/Card'
import { Badge } from '../../../components/ui/Badge'
import { SectionHeading } from '../../../components/shared/SectionHeading'
import { Seo } from '../../../core/seo/Seo'

export function RequestDetailPage() {
  const { requestId } = useParams()

  return (
    <>
      <Seo title="Chi tiết request" description="Theo dõi trao đổi chi tiết theo từng request." />
      <section className="space-y-6">
        <SectionHeading eyebrow="Request" title={`Chi tiết request ${requestId}`} description="Lịch sử trao đổi, phản hồi mentor và trạng thái xử lý." />
        <Card className="space-y-3">
          <Badge variant="warning">Chờ mentor phản hồi</Badge>
          <p className="text-sm text-slate-700">Nội dung thread được render an toàn, có lọc dữ liệu đầu vào và chặn hiển thị thông tin liên hệ ngoài nền tảng.</p>
        </Card>
      </section>
    </>
  )
}
