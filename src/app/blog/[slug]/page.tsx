import Link from 'next/link'

interface BlogPost {
  id: string
  fields: {
    '个人网站-博客': string
    slug: string
    excerpt: string
    content: string
    category: string
    tags: string[]
    read_time: number
    created_at: string
  }
}

async function getBlogPost(slug: string): Promise<BlogPost | null> {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'
    const res = await fetch(`${baseUrl}/api/blog/${slug}`, { cache: 'no-store' })
    const data = await res.json()
    return data.success ? data.data : null
  } catch {
    return null
  }
}

function formatDate(dateStr: string) {
  if (!dateStr) return ''
  const date = new Date(dateStr)
  return `${date.getFullYear()}年${String(date.getMonth() + 1).padStart(2, '0')}月${String(date.getDate()).padStart(2, '0')}日`
}

// 简单的 Markdown 渲染
function renderMarkdown(content: string) {
  // 基础转换 - 实际项目中建议用 react-markdown
  return content
    .replace(/^### (.*$)/gm, '<h3 class="text-xl font-bold text-slate-900 mt-8 mb-4">$1</h3>')
    .replace(/^## (.*$)/gm, '<h2 class="text-2xl font-bold text-slate-900 mt-10 mb-4">$1</h2>')
    .replace(/^# (.*$)/gm, '<h1 class="text-3xl font-bold text-slate-900 mt-10 mb-6">$1</h1>')
    .replace(/\*\*(.*?)\*\*/g, '<strong class="font-semibold">$1</strong>')
    .replace(/`([^`]+)`/g, '<code class="bg-slate-100 px-1.5 py-0.5 rounded text-sm font-mono text-slate-800">$1</code>')
    .replace(/```(\w+)?\n([\s\S]*?)```/g, '<pre class="bg-slate-900 text-slate-100 p-4 rounded-lg overflow-x-auto my-6"><code>$2</code></pre>')
    .replace(/^\- (.*$)/gm, '<li class="ml-4">$1</li>')
    .replace(/^\d+\. (.*$)/gm, '<li class="ml-4 list-decimal">$1</li>')
    .replace(/\n\n/g, '</p><p class="text-slate-600 leading-relaxed mb-4">')
    .replace(/\n/g, '<br/>')
}

export default async function BlogPostPage({ params }: { params: { slug: string } }) {
  const post = await getBlogPost(params.slug)

  if (!post) {
    return (
      <div className="pt-20 min-h-screen">
        <section className="py-20 bg-white">
          <div className="max-w-3xl mx-auto px-4 text-center">
            <h1 className="text-2xl font-bold mb-4">文章不存在</h1>
            <Link href="/blog" className="text-primary hover:underline">← 返回博客</Link>
          </div>
        </section>
      </div>
    )
  }

  const { fields } = post

  return (
    <div className="pt-20">
      <section className="py-12 bg-white border-b border-slate-200">
        <div className="max-w-3xl mx-auto px-4 sm:px-8">
          <Link href="/blog" className="text-primary hover:underline mb-6 inline-block">← 返回博客</Link>
          
          <div className="flex flex-wrap gap-2 mb-4">
            {fields.tags?.map((tag: string) => (
              <span key={tag} className="px-3 py-1 text-xs bg-primary/10 text-primary rounded-full">{tag}</span>
            ))}
          </div>
          
          <h1 className="text-3xl lg:text-4xl font-bold text-slate-900 mb-4 leading-tight">
            {fields['个人网站-博客']}
          </h1>
          
          <div className="flex items-center gap-4 text-sm text-slate-500">
            <span>{formatDate(fields.created_at)}</span>
            <span>·</span>
            <span>{fields.read_time} 分钟阅读</span>
          </div>
        </div>
      </section>

      <section className="py-12 bg-slate-50">
        <article className="max-w-3xl mx-auto px-4 sm:px-8">
          <div 
            className="prose prose-slate max-w-none"
            dangerouslySetInnerHTML={{ __html: renderMarkdown(fields.content) }}
          />
          
          <div className="mt-12 pt-8 border-t border-slate-200">
            <div className="flex flex-wrap gap-2">
              {fields.tags?.map((tag: string) => (
                <span key={tag} className="px-3 py-1 text-sm bg-slate-200 text-slate-600 rounded-full">{tag}</span>
              ))}
            </div>
          </div>
        </article>
      </section>
    </div>
  )
}
