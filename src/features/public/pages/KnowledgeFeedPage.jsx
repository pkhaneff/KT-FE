import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { Sparkles } from 'lucide-react'
import { Badge } from '../../../components/ui/Badge'
import { Card } from '../../../components/ui/Card'
import { SectionHeading } from '../../../components/shared/SectionHeading'
import { Seo } from '../../../core/seo/Seo'
import { knowledgeArticles } from '../data/knowledgeArticles'

const categories = ['Tất cả', 'Embedded', 'AI/ML', 'Cơ điện tử', 'IoT', 'Web App', 'Kinh nghiệm', 'Học thuật']
const sorts = ['Mới nhất', 'Được yêu thích', 'Xu hướng']
const hotTopics = ['#stm32', '#freertos', '#cnn', '#yolov8', '#esp32', '#nextjs']

export function KnowledgeFeedPage() {
  const [filter, setFilter] = useState('Tất cả')
  const [sort, setSort] = useState('Mới nhất')

  const filteredArticles = useMemo(() => {
    let list = [...knowledgeArticles]

    if (filter !== 'Tất cả') {
      list = list.filter((item) => item.category === filter)
    }

    if (sort === 'Được yêu thích') {
      list.sort((a, b) => b.likes - a.likes)
    }

    if (sort === 'Xu hướng') {
      list.sort((a, b) => b.comments - a.comments)
    }

    return list
  }, [filter, sort])

  return (
    <>
      <Seo title="Kho kiến thức" description="Bài viết kỹ thuật từ mentor và chuyên gia." />
      <section className="space-y-6">
        <SectionHeading
          eyebrow="Học tập"
          title="Kho kiến thức kỹ thuật"
          description="Nội dung chất lượng cao từ mentor: có phân loại, có xu hướng và có ngữ cảnh theo mục tiêu đồ án."
        />

        <div className="grid gap-6 xl:grid-cols-[1fr_280px]">
          <div>
            <div className="mb-3 flex flex-wrap gap-2">
              {categories.map((category) => (
                <button
                  key={category}
                  type="button"
                  onClick={() => setFilter(category)}
                  className={`rounded-full border px-3 py-1.5 text-xs font-semibold transition ${
                    filter === category
                      ? 'border-indigo-600 bg-indigo-50 text-indigo-700'
                      : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:text-slate-900'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>

            <div className="mb-4 flex flex-wrap items-center gap-4 border-b border-slate-200 pb-3">
              {sorts.map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => setSort(s)}
                  className={`text-sm font-semibold transition ${sort === s ? 'text-indigo-700' : 'text-slate-500 hover:text-slate-800'}`}
                >
                  {s}
                </button>
              ))}
              <span className="ml-auto text-xs font-medium text-slate-500">{filter} · {sort}</span>
            </div>

            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {filteredArticles.map((article) => (
                <Link key={article.id} to={`/knowledge/${article.id}`} className="block">
                  <Card className="h-full p-4 transition hover:-translate-y-0.5 hover:shadow-md">
                    <div className="mb-3 h-24 rounded-xl bg-gradient-to-r from-indigo-100 to-cyan-100" aria-hidden="true" />
                    <div className="mb-2 flex flex-wrap gap-2">
                      <Badge className="h-6 px-2.5">{article.category}</Badge>
                      {article.tag ? <Badge className="h-6 bg-indigo-100 px-2.5 text-indigo-700">{article.tag === 'featured' ? 'Nổi bật' : 'Trending'}</Badge> : null}
                    </div>
                    <h3 className="line-clamp-2 text-sm font-semibold leading-6 text-slate-900">{article.title}</h3>
                    <p className="mt-1.5 line-clamp-3 min-h-16 text-sm leading-6 text-slate-600">{article.excerpt}</p>
                    <p className="mt-3 text-xs text-slate-500">{article.read} · {article.likes} lượt thích · {article.comments} bình luận</p>
                  </Card>
                </Link>
              ))}
            </div>
          </div>

          <aside className="space-y-4">
            <Card>
              <h3 className="text-sm font-semibold text-slate-900">Chủ đề hot</h3>
              <div className="mt-2">
                {hotTopics.map((topic, index) => (
                  <button
                    key={topic}
                    type="button"
                    onClick={() => setFilter(topic === '#cnn' ? 'AI/ML' : topic === '#nextjs' ? 'Web App' : topic === '#stm32' || topic === '#freertos' || topic === '#esp32' ? 'Embedded' : 'Tất cả')}
                    className={`flex w-full items-center justify-between py-2 text-left ${index > 0 ? 'border-t border-slate-200' : ''}`}
                  >
                    <span className="text-xs font-semibold text-indigo-700">{topic}</span>
                    <span className="text-xs text-slate-500">{42 + index * 9} bài</span>
                  </button>
                ))}
              </div>
            </Card>

            <Card className="border-slate-900 bg-slate-900 text-white">
              <Sparkles size={18} className="text-indigo-300" aria-hidden="true" />
              <h3 className="mt-2 text-base font-semibold">AI chọn bài phù hợp</h3>
              <p className="mt-2 text-sm text-slate-300">Dựa trên lĩnh vực đồ án, AI đề xuất thứ tự đọc và tóm tắt nhanh.</p>
              <button type="button" className="mt-3 rounded-lg bg-indigo-600 px-3 py-2 text-sm font-semibold text-white transition hover:bg-indigo-500">
                Cá nhân hóa feed
              </button>
            </Card>
          </aside>
        </div>
      </section>
    </>
  )
}
