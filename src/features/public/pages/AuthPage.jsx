import { ArrowLeft, GraduationCap } from 'lucide-react'
import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { Button } from '../../../components/ui/Button'
import { Card } from '../../../components/ui/Card'
import { Input } from '../../../components/ui/Input'
import { Seo } from '../../../core/seo/Seo'
import { ROUTES } from '../../../core/constants/routes'
import { useAuth } from '../../auth'

const MODE_TITLE = {
  login: 'Đăng nhập',
  register: 'Tạo tài khoản',
  forgot: 'Khôi phục mật khẩu',
}

const MODE_HEADLINE = {
  login: 'Chào mừng quay lại',
  register: 'Bắt đầu với ProjectMentor',
  forgot: 'Lấy lại quyền truy cập',
}

const MODE_DESCRIPTION = {
  login: 'Đăng nhập để theo dõi tiến độ, request và lịch sử dự án.',
  register: 'Tạo tài khoản để bắt đầu gửi yêu cầu hỗ trợ đồ án.',
  forgot: 'Nhập email để nhận liên kết đặt lại mật khẩu.',
}

export function AuthPage() {
  const location = useLocation()
  const navigate = useNavigate()
  const { login, register, submitting } = useAuth()
  const mode = location.pathname.includes('/register') ? 'register' : location.pathname.includes('/forgot-password') ? 'forgot' : 'login'

  const isRegister = mode === 'register'
  const isForgot = mode === 'forgot'
  const [form, setForm] = useState({
    fullName: '',
    email: '',
    password: '',
  })
  const [errorMessage, setErrorMessage] = useState('')
  const [infoMessage, setInfoMessage] = useState('')

  const handleChange = (key) => (event) => {
    setForm((previous) => ({ ...previous, [key]: event.target.value }))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setErrorMessage('')
    setInfoMessage('')

    if (isForgot) {
      setInfoMessage('Hiện backend chưa có API quên mật khẩu. Vui lòng liên hệ hỗ trợ để được reset mật khẩu.')
      return
    }

    try {
      if (isRegister) {
        await register({
          fullName: form.fullName.trim(),
          email: form.email.trim(),
          password: form.password,
        })
        navigate(ROUTES.PUBLIC_LOGIN, { replace: true })
        return
      } else {
        await login({
          email: form.email.trim(),
          password: form.password,
        })
        navigate(ROUTES.PUBLIC_LANDING, { replace: true })
        return
      }
    } catch (error) {
      setErrorMessage(error?.message || 'Không thể xử lý yêu cầu. Vui lòng thử lại.')
    }
  }

  return (
    <>
      <Seo title={MODE_TITLE[mode]} description="Xác thực tài khoản người dùng an toàn." />
      <div className="grid min-h-screen grid-cols-1 lg:grid-cols-2">
        <section className="relative hidden flex-col bg-gradient-to-b from-slate-900 to-indigo-950 px-10 py-12 text-white lg:flex xl:px-14">
          <Link to={ROUTES.PUBLIC_LANDING} className="inline-flex w-fit items-center gap-3 rounded-lg text-white/90 transition hover:text-white">
            <GraduationCap size={28} aria-hidden="true" />
            <span className="text-base font-bold">ProjectMentor Hub</span>
          </Link>

          <div className="mt-20 max-w-md">
            <h2 className="text-4xl font-bold leading-tight tracking-tight">Học cùng mentor,<br />không phải học hộ mentor.</h2>
            <p className="mt-4 text-sm leading-6 text-white/75">Mọi giao tiếp dự án được cấu trúc, kiểm duyệt và ghi log để bảo vệ sinh viên, mentor và nền tảng.</p>
          </div>

          <div className="flex-1" />

          <Card className="max-w-md border-white/15 bg-white/5 text-white shadow-none backdrop-blur">
            <p className="text-sm leading-6">“Quy trình request rõ ràng giúp mình theo dõi task, duyệt file và hỏi mentor đúng trọng tâm.”</p>
            <div className="mt-3 text-xs text-white/70">
              <p className="font-semibold text-white">Hoàng Thư</p>
              <p>K63 · ĐH SPKT</p>
            </div>
          </Card>
        </section>

        <section className="flex flex-col px-5 py-8 sm:px-8 md:px-12 lg:px-14">
          <div className="flex items-center justify-between text-sm text-slate-500">
            <Link to={ROUTES.PUBLIC_LANDING} className="inline-flex items-center gap-1.5 font-medium text-slate-500 transition hover:text-slate-800 lg:hidden">
              <ArrowLeft size={16} aria-hidden="true" /> Trang chủ
            </Link>
            <div className="ml-auto">
              {isRegister ? 'Đã có tài khoản?' : 'Chưa có tài khoản?'}
              <Link className="ml-1.5 font-semibold text-indigo-700 hover:text-indigo-800" to={isRegister ? ROUTES.PUBLIC_LOGIN : ROUTES.PUBLIC_REGISTER}>
                {isRegister ? 'Đăng nhập' : 'Đăng ký'}
              </Link>
            </div>
          </div>

          <div className="mx-auto flex w-full max-w-md flex-1 flex-col justify-center">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">{MODE_TITLE[mode]}</p>
            <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-900">{MODE_HEADLINE[mode]}</h1>
            <p className="mt-2 text-sm leading-6 text-slate-600">{MODE_DESCRIPTION[mode]}</p>

            <form className="mt-6 space-y-3" onSubmit={handleSubmit}>
              {isRegister ? (
                <Input
                  value={form.fullName}
                  onChange={handleChange('fullName')}
                  placeholder="Họ và tên"
                  aria-label="Họ và tên"
                  minLength={2}
                  maxLength={255}
                  required
                />
              ) : null}

              <Input
                value={form.email}
                onChange={handleChange('email')}
                type="email"
                placeholder="Email học tập"
                aria-label="Email học tập"
                required
              />

              {!isForgot ? (
                <Input
                  value={form.password}
                  onChange={handleChange('password')}
                  type="password"
                  placeholder="Mật khẩu"
                  aria-label="Mật khẩu"
                  minLength={8}
                  maxLength={128}
                  required
                />
              ) : null}

              {errorMessage ? <p className="text-sm font-medium text-rose-600">{errorMessage}</p> : null}
              {infoMessage ? <p className="text-sm font-medium text-emerald-700">{infoMessage}</p> : null}

              <Button type="submit" size="lg" className="mt-2 w-full justify-center" disabled={submitting}>
                {isForgot ? 'Gửi liên kết khôi phục' : isRegister ? 'Tạo tài khoản' : 'Đăng nhập'}
              </Button>
            </form>

            {!isForgot ? (
              <Link className="mt-3 inline-flex w-fit text-sm font-semibold text-indigo-700 hover:text-indigo-800" to={ROUTES.PUBLIC_FORGOT_PASSWORD}>
                Quên mật khẩu?
              </Link>
            ) : null}
          </div>
        </section>
      </div>
    </>
  )
}
