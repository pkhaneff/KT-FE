import { Plus, Upload } from 'lucide-react'
import { Card } from '../../../components/ui/Card'
import { SectionHeading } from '../../../components/shared/SectionHeading'
import { Badge } from '../../../components/ui/Badge'
import { Button } from '../../../components/ui/Button'
import { Seo } from '../../../core/seo/Seo'
import { walletTransactions } from '../data/mockData'

export function WalletPage() {
  const monthlySpending = [60, 80, 140, 210, 190, 240, 120, 160, 130, 180, 220, 200]
  const maxSpending = Math.max(...monthlySpending)

  return (
    <>
      <Seo title="Ví" description="Theo dõi số dư và lịch sử giao dịch." />
      <section className="space-y-6">
        <SectionHeading eyebrow="Wallet" title="Ví ProjectMentor" description="Quản lý số dư, nạp tiền và lịch sử thanh toán theo từng dự án." />

        <div className="grid gap-5 xl:grid-cols-[1.1fr_1fr]">
          <Card className="border-transparent bg-gradient-to-br from-slate-900 to-indigo-950 text-white">
            <p className="text-xs text-white/70">Số dư hiện tại</p>
            <p className="mt-1 text-4xl font-bold">1.245.000đ</p>
            <p className="mt-4 text-xs text-white/70">•••• 7821 · MINH ANH · K63</p>
            <div className="mt-5 flex flex-wrap gap-2">
              <Button size="sm" className="bg-indigo-600 hover:bg-indigo-500"><Plus size={14} aria-hidden="true" /> Nạp tiền</Button>
              <Button size="sm" className="bg-indigo-600 hover:bg-indigo-500"><Upload size={14} aria-hidden="true" /> Rút tiền</Button>
            </div>
          </Card>

          <Card>
            <p className="text-xs font-semibold uppercase tracking-[0.08em] text-slate-500">Tháng này</p>
            <p className="mt-1 text-2xl font-bold text-slate-900">Chi tiêu 3.8M</p>
            <div className="mt-4">
              <div className="grid h-40 grid-cols-12 gap-2">
                {monthlySpending.map((value, index) => (
                  <div key={value + index} className="flex flex-col items-center justify-end gap-2">
                    <div className="relative h-28 w-full rounded-md bg-slate-100">
                      <div
                        className="absolute inset-x-0 bottom-0 rounded-md bg-indigo-600"
                        style={{ height: `${Math.min(100, Math.round((value / maxSpending) * 100))}%` }}
                      />
                    </div>
                    <span className="text-[11px] text-slate-500">T{index + 1}</span>
                  </div>
                ))}
              </div>
            </div>
          </Card>
        </div>

        <p className="text-sm font-semibold text-slate-900">Lịch sử giao dịch</p>

        <Card className="p-0">
          <div className="divide-y divide-slate-200">
            {walletTransactions.map((transaction) => (
              <div key={transaction.title} className="grid gap-2 px-4 py-3 md:grid-cols-[2fr_1fr_1fr_120px_130px] md:items-center">
                <p className="text-sm font-semibold text-slate-900">{transaction.title}</p>
                <p className="text-xs text-slate-600">{transaction.category}</p>
                <p className="text-xs text-slate-600">{transaction.partner}</p>
                <Badge variant="success">{transaction.status}</Badge>
                <p className={`text-right text-sm font-semibold ${transaction.type === 'in' ? 'text-emerald-700' : 'text-slate-900'}`}>{transaction.amount}</p>
              </div>
            ))}
          </div>
        </Card>
      </section>
    </>
  )
}
