'use client'

import Link from 'next/link'
import { useState, useMemo } from 'react'

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

export function PortfolioClient({ projects }: { projects: Portfolio[] }) {
  const [query, setQuery] = useState('')

  const filtered = useMemo(() => {
    if (!query.trim()) return projects
    const q = query.toLowerCase()
    return projects.filter(p =>
      p.fields['个人网站-作品集'].toLowerCase().includes(q) ||
      p.fields.description.toLowerCase().includes(q) ||
      p.fields.category.toLowerCase().includes(q) ||
      p.fields.tags?.some((t: string) => t.toLowerCase().includes(q))
    )
  }, [projects, query])

  return (
    <div className="pt-20">
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-8 lg:px-12 text-center">
          <h1 className="text-4xl font-bold text-slate-900 mb-4">作品集</h1>
          <p className="text-slate-600 max-w-2xl mx-auto">展示具有代表性的项目案例，体现专业能力和技术实力。</p>
        </div>
      </section>

      <section className="py-20 bg-slate-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-8 lg:px-12">
          {/* 搜索框 */}
          <div className="mb-8">
            <input
              type="text"
              placeholder="搜索项目名称、描述或标签..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full px-4 py-3 bg-white border border-slate-200 rounded-lg text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((p) => (
              <article key={p.id} className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all">
                <div className="aspect-video bg-gradient-to-br from-slate-200 to-slate-300 relative">
                  {p.fields.cover_image ? (
                    <img src={p.fields.cover_image} alt={p.fields['个人网站-作品集']} className="w-full h-full object-cover" />
                  ) : (
                    <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-secondary/20" />
                  )}
                </div>
                <div className="p-6">
                  <span className="px-2 py-1 text-xs bg-primary/10 text-primary rounded mb-3 inline-block">{p.fields.category}</span>
                  <h2 className="text-xl font-semibold text-slate-900 mb-2">{p.fields['个人网站-作品集']}</h2>
                  <p className="text-slate-600 text-sm mb-4">{p.fields.description}</p>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {p.fields.tags?.map((t) => (
                      <span key={t} className="px-2 py-1 text-xs bg-slate-100 text-slate-600 rounded">{t}</span>
                    ))}
                  </div>
                  <Link href={`/portfolio/${p.fields.slug}`} className="text-primary text-sm font-medium hover:underline">查看详情 →</Link>
                </div>
              </article>
            ))}
          </div>
          {filtered.length === 0 && (
            <p className="text-center text-slate-500 py-12">
              {query ? '没有找到匹配的项目' : '暂无作品'}
            </p>
          )}
        </div>
      </section>
    </div>
  )
}
