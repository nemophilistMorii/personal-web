'use client'

import Link from 'next/link'
import { useState, useMemo } from 'react'

interface Blog {
  id: string
  fields: {
    '个人网站-博客': string
    slug: string
    excerpt: string
    category: string
    tags: string[]
    cover_image: string
    read_time: number
    published: boolean
    created_at: string
  }
}

function formatDate(dateStr: string) {
  if (!dateStr) return ''
  const date = new Date(dateStr)
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
}

export function BlogClient({ articles }: { articles: Blog[] }) {
  const [query, setQuery] = useState('')

  const filtered = useMemo(() => {
    if (!query.trim()) return articles
    const q = query.toLowerCase()
    return articles.filter(a =>
      a.fields['个人网站-博客'].toLowerCase().includes(q) ||
      a.fields.excerpt.toLowerCase().includes(q) ||
      a.fields.tags?.some((t: string) => t.toLowerCase().includes(q))
    )
  }, [articles, query])

  return (
    <div className="pt-20">
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-8 lg:px-12 text-center">
          <h1 className="text-4xl font-bold text-slate-900 mb-4">技术博客</h1>
          <p className="text-slate-600 max-w-2xl mx-auto">分享技术见解、实践经验和行业思考。</p>
        </div>
      </section>
      <section className="py-20 bg-slate-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-8 lg:px-12">
          {/* 搜索框 */}
          <div className="mb-8">
            <input
              type="text"
              placeholder="搜索文章标题、内容或标签..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full px-4 py-3 bg-white border border-slate-200 rounded-lg text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition"
            />
          </div>

          <div className="space-y-6">
            {filtered.map((a) => (
              <article key={a.id} className="bg-white rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex gap-2 mb-3">
                  {a.fields.tags?.map((t) => (
                    <span key={t} className="px-2 py-1 text-xs bg-primary/10 text-primary rounded">{t}</span>
                  ))}
                </div>
                <Link href={`/blog/${a.fields.slug}`}>
                  <h2 className="text-xl font-semibold text-slate-900 mb-2 hover:text-primary transition-colors">{a.fields['个人网站-博客']}</h2>
                </Link>
                <p className="text-slate-600 mb-4">{a.fields.excerpt}</p>
                <div className="flex items-center gap-4 text-sm text-slate-500">
                  <span>{formatDate(a.fields.created_at)}</span>
                  <span>{a.fields.read_time || 5} 分钟阅读</span>
                </div>
              </article>
            ))}
          </div>
          {filtered.length === 0 && (
            <p className="text-center text-slate-500 py-12">
              {query ? '没有找到匹配的文章' : '暂无文章'}
            </p>
          )}
        </div>
      </section>
    </div>
  )
}
