import Link from 'next/link'
import { portfolioAPI } from '@/lib/feishu'

interface Portfolio {
  id: string
  fields: {
    '个人网站-作品集': string
    slug: string
    description: string
    category: string
    tags: string[]
    cover_image: string
    links: string
    published: boolean
  }
}

async function getPortfolioBySlug(slug: string): Promise<Portfolio | null> {
  try {
    return await portfolioAPI.getBySlug(slug)
  } catch {
    return null
  }
}

export default async function PortfolioDetailPage({ params }: { params: { slug: string } }) {
  const project = await getPortfolioBySlug(params.slug)

  if (!project) {
    return (
      <div className="pt-20 min-h-screen">
        <section className="py-20 bg-white">
          <div className="max-w-4xl mx-auto px-4 text-center">
            <h1 className="text-2xl font-bold mb-4">项目不存在</h1>
            <Link href="/portfolio" className="text-primary hover:underline">← 返回作品集</Link>
          </div>
        </section>
      </div>
    )
  }

  const { fields } = project

  return (
    <div className="pt-20">
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-8 lg:px-12">
          <Link href="/portfolio" className="text-primary hover:underline mb-8 inline-block">← 返回作品集</Link>

          {fields.cover_image && (
            <div className="aspect-video bg-gradient-to-br from-slate-200 to-slate-300 rounded-lg mb-8 overflow-hidden">
              <img src={fields.cover_image} alt={fields['个人网站-作品集']} className="w-full h-full object-cover" />
            </div>
          )}

          {!fields.cover_image && (
            <div className="aspect-video bg-gradient-to-br from-primary/20 to-secondary/20 rounded-lg mb-8" />
          )}

          <div className="flex items-center gap-3 mb-4">
            <span className="px-3 py-1 text-sm bg-primary/10 text-primary rounded-full">{fields.category}</span>
          </div>

          <h1 className="text-3xl font-bold text-slate-900 mb-4">{fields['个人网站-作品集']}</h1>

          <p className="text-slate-600 mb-6">{fields.description}</p>

          <div className="flex flex-wrap gap-2 mb-6">
            {fields.tags?.map((tag: string) => (
              <span key={tag} className="px-3 py-1 text-sm bg-slate-100 text-slate-600 rounded-full">{tag}</span>
            ))}
          </div>

          {fields.links && (
            <a
              href={fields.links}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors"
            >
              查看项目 →
            </a>
          )}
        </div>
      </section>

      <section className="py-20 bg-slate-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-8 lg:px-12">
          <h2 className="text-2xl font-bold text-slate-900 mb-4">项目简介</h2>
          <p className="text-slate-600 mb-8">{fields.description}</p>
        </div>
      </section>
    </div>
  )
}
