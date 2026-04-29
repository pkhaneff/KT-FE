import { Link } from 'react-router-dom'
import { Card } from '../../../components/ui/Card'
import { Button } from '../../../components/ui/Button'
import { ROUTES } from '../../../core/constants/routes'
import { Seo } from '../../../core/seo/Seo'

const steps = [
  {
    index: '01',
    title: 'Xem bảng giá hoặc đăng nhập để tạo yêu cầu',
    description:
      'Người dùng có thể xem các dự án/gói được admin hoặc mentor đăng bán. Nếu cần đặt yêu cầu riêng, người dùng đăng nhập rồi mở Project Request Wizard.',
  },
  {
    index: '02',
    title: 'Nhập thông tin đồ án',
    description:
      'Mô tả đề tài, deadline, tài liệu yêu cầu, ngân sách dự kiến và các tiêu chí cần bàn giao. Hệ thống cảnh báo không chia sẻ thông tin liên hệ ngoài nền tảng.',
  },
  {
    index: '03',
    title: 'AI phân tích phạm vi',
    description:
      'AI tóm tắt yêu cầu, đề xuất module, rủi ro, câu hỏi cần bổ sung và ước lượng timeline để báo giá rõ hơn.',
  },
  {
    index: '04',
    title: 'Nhận báo giá và chốt phạm vi',
    description:
      'Admin kiểm tra, mentor/admin gửi báo giá theo phạm vi. Người dùng so sánh, xác nhận hạng mục, deadline, giá và điều kiện bàn giao.',
  },
  {
    index: '05',
    title: 'Thanh toán escrow qua ví nền tảng',
    description:
      'Người dùng nạp ví và thanh toán theo mốc. Tiền được giữ trong hệ thống, không chuyển khoản trực tiếp bên ngoài.',
  },
  {
    index: '06',
    title: 'Theo dõi tiến độ từng task',
    description:
      'Workspace hiển thị task, timeline, file bàn giao, trạng thái duyệt. Tất cả cập nhật và phản hồi đi qua Request Center.',
  },
  {
    index: '07',
    title: 'Duyệt, yêu cầu chỉnh sửa hoặc khiếu nại',
    description:
      'Người dùng duyệt task, từ chối task kèm lý do, yêu cầu chỉnh sửa, yêu cầu hoàn tiền hoặc khiếu nại bằng form có cấu trúc.',
  },
  {
    index: '08',
    title: 'Bàn giao, đóng đơn và đánh giá',
    description:
      'Sau khi hoàn thành, hệ thống ghi audit log, mở mốc thanh toán cuối và cho phép người dùng đánh giá chất lượng.',
  },
]

export function WorkflowPage() {
  return (
    <>
      <Seo title="Quy trình làm việc" description="Luồng đặt hàng, nhận báo giá, chốt giá và theo dõi tiến độ trên nền tảng." />
      <section className="mx-auto max-w-6xl space-y-4">
        <p className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">Quy trình làm việc</p>
        <h1 className="max-w-4xl text-3xl font-bold leading-tight text-slate-900 md:text-5xl md:leading-[1.08]">
          Người dùng đặt hàng, nhận báo giá, chốt giá và theo dõi tiến độ như thế nào?
        </h1>
        <p className="max-w-3xl text-sm leading-relaxed text-slate-600 md:text-base">
          Đây là quy trình public để người dùng hiểu cách nền tảng vận hành trước khi đăng nhập. Khi đã đăng nhập,
          người dùng sẽ vào dashboard nội bộ để tạo đơn riêng hoặc mua một gói dự án có sẵn.
        </p>
      </section>

      <section className="mx-auto mt-8 max-w-6xl">
        <div className="grid gap-4 md:grid-cols-2">
          {steps.map((step) => (
            <Card key={step.index} className="grid grid-cols-[56px,1fr] gap-3.5 p-4.5 md:p-5">
              <div className="grid h-12 w-12 place-items-center rounded-xl bg-slate-900 font-mono text-sm font-bold text-white">
                {step.index}
              </div>
              <div>
                <h2 className="text-sm font-bold text-slate-900 md:text-[15px]">{step.title}</h2>
                <p className="mt-1.5 text-xs leading-relaxed text-slate-600 md:text-[13px]">{step.description}</p>
              </div>
            </Card>
          ))}
        </div>

        <div className="mt-5 flex flex-wrap gap-2.5">
          <Link to={ROUTES.PUBLIC_LOGIN}>
            <Button size="lg">Đăng nhập để đặt đơn</Button>
          </Link>
          <Link to={ROUTES.PUBLIC_PRICING}>
            <Button variant="ghost" size="lg">Xem bảng giá dự án</Button>
          </Link>
        </div>
      </section>
    </>
  )
}
