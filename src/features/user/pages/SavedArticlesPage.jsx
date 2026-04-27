import { Card } from '../../../components/ui/Card'
import { SectionHeading } from '../../../components/shared/SectionHeading'
import { Seo } from '../../../core/seo/Seo'
import { articles } from '../data/mockData'

export function SavedArticlesPage() {
  return (
    <>
      <Seo title="Bài viết đã lưu" description="Danh sách bài viết đã lưu để học sau." />
      <section className="space-y-6">
        <SectionHeading eyebrow="Learning" title="Bài viết đã lưu" description="Kho lưu trữ cá nhân cho nội dung kỹ thuật quan trọng." />

        <div className="grid gap-4 md:grid-cols-2">
          {articles.map((article) => (
            <Card key={article.id}>
              <h3 className="text-base font-semibold text-slate-900">{article.title}</h3>
              <p className="mt-1 text-sm text-slate-500">{article.author} • {article.readTime}</p>
            </Card>
          ))}
        </div>
      </section>
    </>
  )
}
