import { Link } from 'react-router-dom'
import {
  ArrowRight,
  ShieldCheck,
  TrendingUp,
  CheckCircle2,
  BookOpen,
  Sparkles,
  ClipboardList,
  CreditCard,
  Search,
  ShoppingCart,
  Send,
  Star,
} from 'lucide-react'
import { Button } from '../../../components/ui/Button'
import { Card } from '../../../components/ui/Card'
import { ROUTES } from '../../../core/constants/routes'
import { Seo } from '../../../core/seo/Seo'

const highlights = [
  {
    icon: ShieldCheck,
    title: 'Quy trình an toàn',
    description: 'Request được kiểm soát đầu vào, có kiểm duyệt và nhật ký truy vết đầy đủ.',
  },
  {
    icon: TrendingUp,
    title: 'Theo dõi tiến độ rõ ràng',
    description: 'Milestone, trạng thái và thanh toán minh bạch theo từng bước thực hiện.',
  },
  {
    icon: CheckCircle2,
    title: 'Chuẩn production',
    description: 'Kiến trúc mở rộng theo module, dễ scale và nâng cấp liên tục.',
  },
  {
    icon: Sparkles,
    title: 'AI hỗ trợ phân tích',
    description: 'AI tóm tắt yêu cầu, đề xuất module, rủi ro và ước lượng timeline tự động.',
  },
]

const workflowSteps = [
  { index: '01', title: 'Đăng ký & đăng nhập', description: 'Tạo tài khoản miễn phí và truy cập hệ thống.', icon: ClipboardList },
  { index: '02', title: 'Tạo yêu cầu đồ án', description: 'Mô tả đề tài, deadline, ngân sách và tiêu chí bàn giao.', icon: Send },
  { index: '03', title: 'Nhận báo giá & chốt phạm vi', description: 'So sánh báo giá từ mentor, xác nhận hạng mục và giá.', icon: CreditCard },
  { index: '04', title: 'Theo dõi & nghiệm thu', description: 'Xem tiến độ task, duyệt deliverable và đánh giá chất lượng.', icon: CheckCircle2 },
]

const features = [
  {
    icon: Search,
    title: 'Tìm nhà cung cấp dịch vụ',
    description: 'Đề xuất yêu cầu để hệ thống match mentor phù hợp với đề tài của bạn.',
    link: ROUTES.PUBLIC_REGISTER,
    linkText: 'Đề xuất yêu cầu',
  },
  {
    icon: ShoppingCart,
    title: 'Mua dự án có sẵn',
    description: 'Chọn từ kho dự án được mentor xác minh đăng bán, giá minh bạch.',
    link: ROUTES.PUBLIC_PRICING,
    linkText: 'Xem bảng giá',
  },
  {
    icon: BookOpen,
    title: 'Kho kiến thức miễn phí',
    description: 'Truy cập bài viết hướng dẫn, tài liệu kỹ thuật và case study thực tế.',
    link: ROUTES.PUBLIC_FEED,
    linkText: 'Khám phá ngay',
  },
]

const stats = [
  { value: '500+', label: 'Dự án hoàn thành' },
  { value: '120+', label: 'Mentor xác minh' },
  { value: '2.000+', label: 'Sinh viên tin dùng' },
  { value: '4.8/5', label: 'Đánh giá trung bình' },
]

export function LandingPage() {
  return (
    <>
      <Seo
        title="Tổng quan"
        description="ProjectMentor Hub — Nền tảng kết nối mentor và sinh viên cho dự án kỹ thuật. Quản lý yêu cầu, theo dõi tiến độ, thanh toán và học tập kiến thức."
      />

      {/* ── Hero Section ── */}
      <section className="relative overflow-hidden pb-24 pt-20 md:pb-32 md:pt-28">
        <div className="bg-grid pointer-events-none absolute inset-0" aria-hidden="true" />
        <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
          <div className="orb orb-1" />
          <div className="orb orb-2" />
          <div className="orb orb-3" />
          <div className="orb orb-4" />
        </div>

        <div className="relative mx-auto max-w-4xl px-4 text-center md:px-6">
          <div className="animate-fade-in-up">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-indigo-200 bg-indigo-50 px-3.5 py-1 text-xs font-semibold text-indigo-700 dark:border-indigo-800 dark:bg-indigo-950/60 dark:text-indigo-400">
              <Star size={12} aria-hidden="true" /> Nền tảng #1 cho sinh viên Việt Nam
            </span>
          </div>

          <h1 className="animate-fade-in-up delay-100 mt-6 text-balance text-4xl font-extrabold leading-[1.1] tracking-tight text-slate-900 md:text-6xl dark:text-white">
            Biến ý tưởng đồ án thành{' '}
            <span className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 bg-clip-text text-transparent">
              sản phẩm thực tế
            </span>
          </h1>

          <p className="animate-fade-in-up delay-200 mx-auto mt-6 max-w-2xl text-base leading-relaxed text-slate-600 md:text-lg dark:text-slate-400">
            Kết nối với mentor chuyên nghiệp, quản lý yêu cầu, theo dõi tiến độ, thanh toán escrow an toàn
            và truy cập kho kiến thức kỹ thuật — tất cả trong một nền tảng duy nhất.
          </p>

          <div className="animate-fade-in-up delay-300 mt-8 flex flex-wrap items-center justify-center gap-3">
            <Link to={ROUTES.USER_WIZARD}>
              <Button size="lg">
                Dự án theo yêu cầu <ArrowRight size={18} aria-hidden="true" />
              </Button>
            </Link>
            <Link to={ROUTES.PUBLIC_PRICING}>
              <Button variant="secondary" size="lg">Dự án có sẵn</Button>
            </Link>
          </div>
        </div>
      </section>

      {/* ── Stats ── */}
      <section className="animate-fade-in-up delay-400 mx-auto -mt-12 max-w-7xl px-4 md:-mt-16 md:px-6" aria-label="Thống kê nền tảng">
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          {stats.map((stat) => (
            <div key={stat.label} className="rounded-2xl border border-slate-200 bg-white/80 p-5 text-center shadow-sm backdrop-blur dark:border-slate-700 dark:bg-slate-800/80">
              <p className="text-2xl font-extrabold tracking-tight text-indigo-600 md:text-3xl dark:text-indigo-400">{stat.value}</p>
              <p className="mt-1 text-xs font-medium text-slate-500 dark:text-slate-400">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Divider ── */}
      <hr className="section-divider mx-auto my-16 max-w-xs md:my-20" aria-hidden="true" />

      {/* ── Highlights ── */}
      <section className="mx-auto max-w-7xl px-4 md:px-6" aria-labelledby="highlights-heading">
        <div className="animate-fade-in-up mx-auto max-w-2xl text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.15em] text-indigo-600 dark:text-indigo-400">Tại sao chọn chúng tôi</p>
          <h2 id="highlights-heading" className="mt-2 text-2xl font-bold tracking-tight text-slate-900 md:text-3xl dark:text-white">
            Nền tảng được thiết kế cho sinh viên
          </h2>
          <p className="mt-3 text-sm text-slate-600 md:text-base dark:text-slate-400">
            Mọi tính năng đều hướng đến sự minh bạch, an toàn và hiệu quả trong quá trình thực hiện đồ án.
          </p>
        </div>

        <div className="mt-10 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {highlights.map((item, i) => (
            <Card key={item.title} className={`animate-fade-in-up delay-${(i + 1) * 100} group transition-shadow hover:shadow-md`}>
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 transition-colors group-hover:bg-indigo-100 dark:bg-indigo-950/60 dark:text-indigo-400 dark:group-hover:bg-indigo-900/40">
                <item.icon size={20} aria-hidden="true" />
              </div>
              <h3 className="mt-4 text-base font-semibold text-slate-900 dark:text-white">{item.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-600 dark:text-slate-400">{item.description}</p>
            </Card>
          ))}
        </div>
      </section>

      {/* ── Divider ── */}
      <hr className="section-divider mx-auto my-16 max-w-xs md:my-20" aria-hidden="true" />

      {/* ── Workflow Preview ── */}
      <section className="mx-auto max-w-7xl px-4 md:px-6" aria-labelledby="workflow-heading">
        <div className="animate-fade-in-up mx-auto max-w-2xl text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.15em] text-indigo-600 dark:text-indigo-400">Quy trình</p>
          <h2 id="workflow-heading" className="mt-2 text-2xl font-bold tracking-tight text-slate-900 md:text-3xl dark:text-white">
            4 bước đơn giản để hoàn thành đồ án
          </h2>
        </div>

        <div className="relative mt-10">
          <div className="absolute left-1/2 top-0 hidden h-full w-px -translate-x-1/2 bg-gradient-to-b from-indigo-200 via-indigo-300 to-transparent md:block dark:from-indigo-800 dark:via-indigo-700" aria-hidden="true" />
          <div className="grid gap-6 md:grid-cols-2 md:gap-y-12">
            {workflowSteps.map((step, i) => (
              <div
                key={step.index}
                className={`animate-fade-in-up delay-${(i + 1) * 100} flex items-start gap-4 ${i % 2 === 1 ? 'md:col-start-2' : 'md:col-start-1'}`}
              >
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-indigo-600 font-mono text-sm font-bold text-white shadow-lg shadow-indigo-600/25">
                  {step.index}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <step.icon size={16} className="text-indigo-600 dark:text-indigo-400" aria-hidden="true" />
                    <h3 className="text-base font-semibold text-slate-900 dark:text-white">{step.title}</h3>
                  </div>
                  <p className="mt-1.5 text-sm leading-relaxed text-slate-600 dark:text-slate-400">{step.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-8 text-center">
          <Link to={ROUTES.PUBLIC_WORKFLOW}>
            <Button variant="ghost">
              Xem quy trình chi tiết <ArrowRight size={16} aria-hidden="true" />
            </Button>
          </Link>
        </div>
      </section>

      {/* ── Divider ── */}
      <hr className="section-divider mx-auto my-16 max-w-xs md:my-20" aria-hidden="true" />

      {/* ── Features / Services ── */}
      <section className="mx-auto max-w-7xl px-4 md:px-6" aria-labelledby="features-heading">
        <div className="animate-fade-in-up mx-auto max-w-2xl text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.15em] text-indigo-600 dark:text-indigo-400">Dịch vụ</p>
          <h2 id="features-heading" className="mt-2 text-2xl font-bold tracking-tight text-slate-900 md:text-3xl dark:text-white">
            Bạn cần gì — chúng tôi có
          </h2>
        </div>

        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {features.map((feature, i) => (
            <Card key={feature.title} className={`animate-fade-in-up delay-${(i + 1) * 100} group flex flex-col transition-shadow hover:shadow-md`}>
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 text-white shadow-lg shadow-indigo-500/20">
                <feature.icon size={22} aria-hidden="true" />
              </div>
              <h3 className="mt-5 text-lg font-semibold text-slate-900 dark:text-white">{feature.title}</h3>
              <p className="mt-2 flex-1 text-sm leading-relaxed text-slate-600 dark:text-slate-400">{feature.description}</p>
              <Link to={feature.link} className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-indigo-600 transition-colors hover:text-indigo-700 dark:text-indigo-400 dark:hover:text-indigo-300">
                {feature.linkText} <ArrowRight size={14} aria-hidden="true" />
              </Link>
            </Card>
          ))}
        </div>
      </section>

      {/* ── CTA Section ── */}
      <section className="relative mt-20 overflow-hidden bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500 px-4 py-20 text-center text-white md:mt-28 md:px-6 md:py-28" aria-labelledby="cta-heading">
        <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
          <div className="absolute -left-32 -top-32 h-96 w-96 rounded-full bg-white/10 blur-3xl" />
          <div className="absolute -bottom-32 -right-32 h-96 w-96 rounded-full bg-white/10 blur-3xl" />
          <div className="absolute left-1/2 top-1/2 h-64 w-64 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white/5 blur-2xl" />
        </div>

        <div className="relative mx-auto max-w-2xl">
          <h2 id="cta-heading" className="animate-fade-in-up text-3xl font-bold md:text-5xl">
            Sẵn sàng bắt đầu đồ án của bạn?
          </h2>
          <p className="animate-fade-in-up delay-100 mt-5 text-base leading-relaxed text-indigo-100 md:text-lg">
            Đăng ký miễn phí, mô tả đề tài và nhận báo giá từ mentor chuyên nghiệp trong vòng 24 giờ.
          </p>
          <div className="animate-fade-in-up delay-200 mt-10 flex flex-wrap items-center justify-center gap-4">
            <Link
              to={ROUTES.PUBLIC_REGISTER}
              className="inline-flex h-12 items-center justify-center gap-2 rounded-lg bg-white px-6 text-base font-semibold text-indigo-700 shadow-lg shadow-indigo-900/25 transition-all hover:bg-indigo-50 hover:shadow-xl"
            >
              Đăng ký ngay <ArrowRight size={18} aria-hidden="true" />
            </Link>
            <Link
              to={ROUTES.PUBLIC_PRICING}
              className="inline-flex h-12 items-center justify-center gap-2 rounded-lg border border-white/30 bg-white/10 px-6 text-base font-semibold text-white backdrop-blur transition-all hover:bg-white/20"
            >
              Xem bảng giá
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}
