import { useMemo, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { AlertTriangle, Bookmark, Heart, Sparkles } from 'lucide-react'
import { Badge } from '../../../components/ui/Badge'
import { Button } from '../../../components/ui/Button'
import { Card } from '../../../components/ui/Card'
import { Seo } from '../../../core/seo/Seo'
import { knowledgeArticles } from '../data/knowledgeArticles'

const leaksPattern = /(\+?84|0)\d{8,10}|@|zalo|facebook|t\.me|telegram|https?:\/\//i

export function ArticleDetailPage() {
  const { articleId } = useParams()
  const [liked, setLiked] = useState(false)
  const [bookmarked, setBookmarked] = useState(false)
  const [comment, setComment] = useState('')

  const article = useMemo(
    () => knowledgeArticles.find((item) => item.id === articleId) ?? knowledgeArticles[0],
    [articleId],
  )

  const relatedArticles = knowledgeArticles.filter((item) => item.id !== article.id).slice(0, 3)
  const hasLeaks = leaksPattern.test(comment)

  return (
    <>
      <Seo title={article.title} description={article.excerpt} />

      <section className="grid gap-6 xl:grid-cols-[1fr_280px]">
        <article>
          <div className="mb-4 flex flex-wrap gap-2">
            <Badge className="h-6 bg-indigo-100 px-2.5 text-indigo-700">{article.category}</Badge>
            <Badge className="h-6 px-2.5">{article.read}</Badge>
            <Badge variant="success" className="h-6 px-2.5">Đã xuất bản</Badge>
          </div>

          <h1 className="text-3xl font-bold leading-tight tracking-tight text-slate-900 md:text-4xl">{article.title}</h1>

          <div className="mt-4 flex flex-wrap items-center gap-3 border-b border-slate-200 pb-5">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-indigo-100 text-sm font-bold text-indigo-700">
              {article.author
                .split(' ')
                .slice(-2)
                .map((part) => part[0])
                .join('')}
            </div>
            <div className="mr-auto">
              <p className="text-sm font-semibold text-slate-900">{article.author}</p>
              <p className="text-xs text-slate-500">{article.role} · {article.date} 2026</p>
            </div>

            <Button variant="ghost" size="sm" onClick={() => setLiked((value) => !value)}>
              <Heart size={14} aria-hidden="true" /> {liked ? article.likes + 1 : article.likes}
            </Button>
            <Button variant="ghost" size="sm" onClick={() => setBookmarked((value) => !value)}>
              <Bookmark size={14} aria-hidden="true" /> {bookmarked ? 'Đã lưu' : 'Lưu'}
            </Button>
            <Button variant="ghost" size="sm">
              <AlertTriangle size={14} aria-hidden="true" /> Báo cáo
            </Button>
          </div>

          <Card className="mt-5 border-transparent bg-gradient-to-r from-indigo-50 to-slate-50">
            <div className="flex items-start gap-3">
              <Sparkles size={18} className="mt-0.5 text-indigo-600" aria-hidden="true" />
              <div>
                <p className="text-sm font-semibold text-slate-900">AI summary</p>
                <p className="mt-1 text-sm leading-6 text-slate-600">{article.summary}</p>
              </div>
            </div>
          </Card>

          <div className="mt-5 h-72 rounded-2xl bg-gradient-to-r from-indigo-100 to-cyan-100" aria-label={article.coverLabel} />

          <div className="mt-6 space-y-4 text-[15px] leading-8 text-slate-700">
            <p>{article.excerpt}</p>
            {article.sections.map((section) => (
              <div key={section.heading}>
                <h2 className="mb-2 mt-6 text-2xl font-bold tracking-tight text-slate-900">{section.heading}</h2>
                <p>{section.content}</p>
              </div>
            ))}
          </div>

          <div className="mt-8 border-t border-slate-200 pt-6">
            <p className="text-base font-semibold text-slate-900">Bình luận · {article.comments}</p>
            <p className="mt-2 text-xs font-medium text-amber-700">Không chèn số điện thoại, email, link mạng xã hội hoặc thông tin giao dịch ngoài nền tảng.</p>
            <textarea
              rows={3}
              value={comment}
              onChange={(event) => setComment(event.target.value)}
              placeholder="Thảo luận về nội dung kỹ thuật..."
              className="mt-3 w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm text-slate-800 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
            />
            {hasLeaks ? <p className="mt-2 text-xs font-semibold text-rose-700">Nội dung có thể chứa thông tin liên hệ ngoài nền tảng. Vui lòng chỉnh sửa trước khi gửi.</p> : null}

            <div className="mt-3 flex justify-end gap-2">
              <Button variant="ghost" size="sm" onClick={() => setComment('')}>Hủy</Button>
              <Button size="sm" disabled={hasLeaks}>Đăng bình luận</Button>
            </div>
          </div>
        </article>

        <aside className="space-y-4">
          <Card className="xl:sticky xl:top-20">
            <h3 className="text-sm font-semibold text-slate-900">Mục lục</h3>
            <div className="mt-2 space-y-1">
              {['Nền tảng', 'Prototype', 'Kiểm thử', 'Báo cáo', 'Tài nguyên'].map((item, index) => (
                <button
                  key={item}
                  type="button"
                  className={`block w-full text-left text-sm transition ${index === 0 ? 'font-semibold text-indigo-700' : 'text-slate-600 hover:text-slate-900'}`}
                >
                  {item}
                </button>
              ))}
            </div>
          </Card>

          <Card>
            <h3 className="text-sm font-semibold text-slate-900">Bài viết liên quan</h3>
            <div className="mt-2 space-y-3">
              {relatedArticles.map((item, index) => (
                <Link
                  key={item.id}
                  to={`/knowledge/${item.id}`}
                  className={`block text-left ${index > 0 ? 'border-t border-slate-200 pt-3' : ''}`}
                >
                  <p className="text-sm font-semibold leading-6 text-slate-900">{item.title}</p>
                  <p className="text-xs text-slate-500">{item.read} · {item.likes} lượt thích</p>
                </Link>
              ))}
            </div>
          </Card>
        </aside>
      </section>
    </>
  )
}
