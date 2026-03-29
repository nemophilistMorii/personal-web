import Link from 'next/link'

export default function BlogPostPage() {
  return (
    <div className="pt-20">
      <section className="py-20 bg-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-8 lg:px-12">
          <Link href="/blog" className="text-primary hover:underline mb-8 inline-block">← 返回博客</Link>
          <div className="mb-6">
            <div className="flex gap-2 mb-4">
              <span className="px-2 py-1 text-xs bg-primary/10 text-primary rounded">Next.js</span>
              <span className="px-2 py-1 text-xs bg-secondary/10 text-secondary rounded">React</span>
            </div>
            <h1 className="text-3xl lg:text-4xl font-bold text-slate-900 mb-4">Next.js 14 新特性深度解析</h1>
            <div className="flex items-center gap-4 text-sm text-slate-500"><span>2026年3月20日</span><span>8 分钟阅读</span></div>
          </div>
        </div>
      </section>
      <section className="py-20 bg-slate-50">
        <article className="max-w-3xl mx-auto px-4 sm:px-8 lg:px-12">
          <p className="text-lg text-slate-600 mb-8">Next.js 14 带来了许多令人兴奋的新特性...</p>
          <h2 className="text-2xl font-bold text-slate-900 mb-4">App Router 改进</h2>
          <p className="text-slate-600 mb-6">App Router 是 Next.js 13 引入的重大新特性，在 14 版本中得到了进一步优化和完善...</p>
          <h2 className="text-2xl font-bold text-slate-900 mb-4">服务端组件</h2>
          <p className="text-slate-600 mb-6">服务端组件允许你在服务器上直接渲染组件，从而减少客户端 JavaScript 的体积...</p>
          <pre className="bg-slate-900 text-slate-100 p-4 rounded-lg overflow-x-auto mb-6"><code>{`export default function Page() {\n  return <h1>Hello, Next.js 14!</h1>\n}`}</code></pre>
          <h2 className="text-2xl font-bold text-slate-900 mb-4">总结</h2>
          <p className="text-slate-600">Next.js 14 为现代 Web 开发提供了更强大的工具和更好的开发体验...</p>
          <div className="mt-12 pt-8 border-t border-slate-200">
            <div className="flex flex-wrap gap-2">
              {['Next.js', 'React', '前端', 'TypeScript'].map(t => <span key={t} className="px-3 py-1 text-sm bg-slate-100 text-slate-600 rounded-full">{t}</span>)}
            </div>
          </div>
        </article>
      </section>
    </div>
  )
}
