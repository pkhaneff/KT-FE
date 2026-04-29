import { Link } from 'react-router-dom'
import { Bookmark } from 'lucide-react'
import { Card } from '../../../components/ui/Card'
import { SectionHeading } from '../../../components/shared/SectionHeading'
import { Badge } from '../../../components/ui/Badge'
import { Seo } from '../../../core/seo/Seo'
import { ROUTES } from '../../../core/constants/routes'
import { articles } from '../data/mockData'

export function SavedArticlesPage() {
  return (
    <>
      <Seo title="Bài viết đã lưu" description="Danh sách bài viết đã lưu để học sau." />
      <section className="space-y-6">
        <SectionHeading eyebrow="Learning" title="Bài viết đã lưu" description="Kho lưu trữ cá nhân cho nội dung kỹ thuật quan trọng." />

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {articles.map((article, index) => (
            <Link key={article.id} to={ROUTES.PUBLIC_ARTICLE_DETAIL.replace(':articleId', article.id)}>
              <Card className="h-full p-4 transition hover:-translate-y-0.5 hover:shadow-md">
                <div className="mb-3 h-24 rounded-xl bg-gradient-to-r from-indigo-100 to-cyan-100" aria-hidden="true" />
                <div className="mb-2 flex items-center justify-between gap-2">
                  <Badge>{index % 2 === 0 ? 'Embedded' : 'AI/ML'}</Badge>
                  <Bookmark size={14} className="text-indigo-600" aria-hidden="true" />
                </div>
                <h3 className="line-clamp-2 text-sm font-semibold text-slate-900">{article.title}</h3>
                <p className="mt-2 text-xs text-slate-500">{article.author} • {article.readTime}</p>
              </Card>
            </Link>
          ))}
        </div>
      </section>
    </>
  )
}
