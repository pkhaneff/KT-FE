import { useParams } from 'react-router-dom'
import { Card } from '../../../components/ui/Card'
import { Seo } from '../../../core/seo/Seo'

export function ProductDetailPage() {
  const { productId } = useParams()

  return (
    <>
      <Seo title="Chi tiết sản phẩm" description="Trang chi tiết sản phẩm sẽ được hoàn thiện ở phiên bản tiếp theo." />

      <section className="mx-auto max-w-5xl">
        <Card>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Chi tiết sản phẩm</h1>
          <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
            Product ID: {productId}
          </p>
          <p className="mt-4 text-sm text-slate-500 dark:text-slate-400">
            Trang này là placeholder cho version 2.
          </p>
        </Card>
      </section>
    </>
  )
}
