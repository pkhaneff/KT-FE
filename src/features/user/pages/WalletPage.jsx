import { Card } from '../../../components/ui/Card'
import { SectionHeading } from '../../../components/shared/SectionHeading'
import { Badge } from '../../../components/ui/Badge'
import { Seo } from '../../../core/seo/Seo'

export function WalletPage() {
  return (
    <>
      <Seo title="Ví" description="Theo dõi số dư và lịch sử giao dịch." />
      <section className="space-y-6">
        <SectionHeading eyebrow="Wallet" title="Ví ProjectMentor" description="Quản lý số dư, nạp tiền và lịch sử thanh toán theo từng dự án." />
        <Card className="space-y-3">
          <p className="text-3xl font-bold text-slate-900">1.200.000đ</p>
          <Badge variant="success">Tài khoản hoạt động tốt</Badge>
          <p className="text-sm text-slate-600">Số dư được dùng để thanh toán milestone theo cơ chế escrow.</p>
        </Card>
      </section>
    </>
  )
}
