import { Helmet } from 'react-helmet-async'

export function Seo({ title, description }) {
  const normalizedTitle = title ? `${title} | ProjectMentor Hub` : 'ProjectMentor Hub'
  const normalizedDescription = description ?? 'Nền tảng hỗ trợ đồ án và dự án kỹ thuật dành cho sinh viên Việt Nam.'

  return (
    <Helmet>
      <title>{normalizedTitle}</title>
      <meta name="description" content={normalizedDescription} />
      <meta property="og:title" content={normalizedTitle} />
      <meta property="og:description" content={normalizedDescription} />
    </Helmet>
  )
}
