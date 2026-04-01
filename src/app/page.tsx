import Link from 'next/link'
import { portfolioAPI } from '@/lib/feishu'
import { blogAPI } from '@/lib/feishu'

async function getHomeData() {
  try {
    const [projects, articles] = await Promise.all([
      portfolioAPI.list(),
      blogAPI.list(),
    ])
    // 作品集取最新的3个，博客按时间排序取最新的5个
    const sortedProjects = [...projects].sort((a, b) => b.id.localeCompare(a.id)).slice(0, 3)
    const sortedArticles = [...articles]
      .sort((a, b) => new Date(b.fields.created_at).getTime() - new Date(a.fields.created_at).getTime())
      .slice(0, 5)
    return { projects: sortedProjects, articles: sortedArticles }
  } catch {
    return { projects: [], articles: [] }
  }
}

function formatDate(dateStr: string) {
  if (!dateStr) return ''
  const date = new Date(dateStr)
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
}

export default async function HomePage() {
  const { projects, articles } = await getHomeData()

  return (
    <>
      {/* Hero */}
      <section className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100">
        <div className="max-w-6xl mx-auto px-4 sm:px-8 lg:px-12 text-center py-20">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-slate-900 mb-6 animate-slide-up">
            你好，我是 <span className="text-gradient">开发者</span>
          </h1>
          <p className="text-lg sm:text-xl text-slate-600 mb-8 max-w-2xl mx-auto animate-slide-up" style={{ animationDelay: '0.1s' }}>
            全栈工程师，专注于构建优雅、高效的数字产品。
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center animate-slide-up" style={{ animationDelay: '0.2s' }}>
            <Link href="/portfolio" className="inline-flex items-center justify-center font-medium rounded-md transition-all duration-200 bg-primary text-white hover:bg-primary-dark h-12 px-6 text-base">
              查看作品
            </Link>
            <Link href="/contact" className="inline-flex items-center justify-center font-medium rounded-md transition-all duration-200 border-2 border-primary text-primary hover:bg-primary hover:text-white h-12 px-6 text-base">
              联系我
            </Link>
          </div>
        </div>
      </section>

      {/* Skills */}
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-8 lg:px-12">
          <h2 className="text-3xl font-bold text-center text-slate-900 mb-12">专业能力</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[{ icon: '⚛️', title: '前端开发', desc: 'React, Next.js, Vue, TypeScript' }, { icon: '🔧', title: '后端开发', desc: 'Node.js, Python, Go, 数据库' }, { icon: '☁️', title: '云服务', desc: 'AWS, 阿里云, Docker, CI/CD' }, { icon: '📱', title: '移动开发', desc: 'React Native, Flutter' }].map((s, i) => (
              <div key={i} className="bg-slate-50 rounded-lg p-6 text-center hover:shadow-lg transition-shadow">
                <div className="text-4xl mb-4">{s.icon}</div>
                <h3 className="text-lg font-semibold text-slate-900 mb-2">{s.title}</h3>
                <p className="text-sm text-slate-600">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-20 bg-primary">
        <div className="max-w-6xl mx-auto px-4 sm:px-8 lg:px-12">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 text-center">
            {[{ v: '10+', l: '完成项目' }, { v: '5+', l: '年经验' }, { v: '50+', l: '客户' }, { v: '100%', l: '满意率' }].map((s, i) => (
              <div key={i}>
                <div className="text-4xl lg:text-5xl font-bold text-white mb-2">{s.v}</div>
                <div className="text-blue-200 text-sm">{s.l}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Projects */}
      <section className="py-20 bg-slate-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-8 lg:px-12">
          <h2 className="text-3xl font-bold text-center text-slate-900 mb-4">精选作品</h2>
          <p className="text-center text-slate-600 mb-12 max-w-2xl mx-auto">展示具有代表性的项目案例，体现专业能力和技术实力。</p>
          {projects.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {projects.map((p) => (
                <div key={p.id} className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all">
                  <div className="aspect-video bg-gradient-to-br from-slate-200 to-slate-300 relative">
                    {p.fields.cover_image ? (
                      <img src={p.fields.cover_image} alt={p.fields['个人网站-作品集']} className="w-full h-full object-cover" />
                    ) : (
                      <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-secondary/20" />
                    )}
                  </div>
                  <div className="p-6">
                    <div className="flex gap-2 mb-3">
                      <span className="px-2 py-1 text-xs bg-primary/10 text-primary rounded">{p.fields.category}</span>
                    </div>
                    <h3 className="text-lg font-semibold text-slate-900 mb-2">{p.fields['个人网站-作品集']}</h3>
                    <p className="text-sm text-slate-600 mb-4 line-clamp-2">{p.fields.description}</p>
                    <Link href={`/portfolio/${p.fields.slug}`} className="text-primary text-sm font-medium hover:underline">查看详情 →</Link>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center text-slate-500">暂无作品</p>
          )}
          <div className="text-center mt-12">
            <Link href="/portfolio" className="inline-flex items-center justify-center font-medium rounded-md transition-all duration-200 border-2 border-primary text-primary hover:bg-primary hover:text-white h-12 px-6 text-base">
              查看全部作品
            </Link>
          </div>
        </div>
      </section>

      {/* Blog */}
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-8 lg:px-12">
          <h2 className="text-3xl font-bold text-center text-slate-900 mb-4">最新博客</h2>
          <p className="text-center text-slate-600 mb-12 max-w-2xl mx-auto">分享技术见解和实践经验。</p>
          {articles.length > 0 ? (
            <div className="max-w-3xl mx-auto space-y-4">
              {articles.map((a) => (
                <Link key={a.id} href={`/blog/${a.fields.slug}`} className="block p-6 bg-slate-50 rounded-lg hover:shadow-md transition-shadow">
                  <div className="flex items-center gap-4 mb-2">
                    <span className="text-sm text-slate-500">{formatDate(a.fields.created_at)}</span>
                    <span className="text-sm text-primary">{a.fields.read_time || 5} 分钟阅读</span>
                  </div>
                  <h3 className="text-lg font-medium text-slate-900 hover:text-primary transition-colors">{a.fields['个人网站-博客']}</h3>
                </Link>
              ))}
            </div>
          ) : (
            <p className="text-center text-slate-500">暂无博客文章</p>
          )}
          <div className="text-center mt-12">
            <Link href="/blog" className="inline-flex items-center justify-center font-medium rounded-md transition-all duration-200 bg-primary text-white hover:bg-primary-dark h-12 px-6 text-base">
              阅读更多文章
            </Link>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-gradient-to-r from-primary to-secondary">
        <div className="max-w-6xl mx-auto px-4 sm:px-8 lg:px-12 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">准备好开始合作了吗？</h2>
          <p className="text-blue-100 mb-8 max-w-2xl mx-auto">无论是项目合作、技术咨询还是其他问题，我都期待与您交流。</p>
          <Link href="/contact" className="inline-flex items-center justify-center font-medium rounded-md transition-all duration-200 border-2 border-primary text-primary hover:bg-primary hover:text-white h-12 px-6 text-base bg-white text-primary hover:bg-slate-100">
            开始对话
          </Link>
        </div>
      </section>
    </>
  )
}
