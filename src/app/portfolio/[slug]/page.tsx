import Link from 'next/link'

export default function ProjectDetailPage() {
  return (
    <div className="pt-20">
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-8 lg:px-12">
          <Link href="/portfolio" className="text-primary hover:underline mb-8 inline-block">← 返回作品集</Link>
          <div className="aspect-video bg-gradient-to-br from-slate-200 to-slate-300 rounded-lg mb-8" />
          <h1 className="text-3xl font-bold text-slate-900 mb-4">项目案例</h1>
          <div className="flex gap-2 mb-6">
            <span className="px-3 py-1 text-sm bg-primary/10 text-primary rounded-full">React</span>
            <span className="px-3 py-1 text-sm bg-secondary/10 text-secondary rounded-full">TypeScript</span>
          </div>
          <p className="text-slate-600">2024.01 - 2024.06</p>
        </div>
      </section>
      <section className="py-20 bg-slate-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-8 lg:px-12">
          <h2 className="text-2xl font-bold text-slate-900 mb-4">项目概述</h2>
          <p className="text-slate-600 mb-8">项目详细描述内容...</p>
          <h2 className="text-2xl font-bold text-slate-900 mb-4">核心成果</h2>
          <ul className="list-disc pl-6 text-slate-600 mb-8"><li>成果一</li><li>成果二</li><li>成果三</li></ul>
          <h2 className="text-2xl font-bold text-slate-900 mb-4">技术栈</h2>
          <p className="text-slate-600">项目使用的技术栈详情...</p>
        </div>
      </section>
    </div>
  )
}
