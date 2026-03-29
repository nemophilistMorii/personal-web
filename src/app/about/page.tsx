export default function AboutPage() {
  return (
    <div className="pt-20">
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-8 lg:px-12">
          <div className="flex flex-col md:flex-row items-center gap-12">
            <div className="w-48 h-48 rounded-full bg-slate-200 flex-shrink-0" />
            <div>
              <h1 className="text-3xl font-bold text-slate-900 mb-2">开发者</h1>
              <p className="text-lg text-primary mb-4">全栈工程师</p>
              <p className="text-slate-600">来自中国的技术爱好者，专注于构建优雅、高效的数字产品。</p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-slate-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-8 lg:px-12">
          <h2 className="text-2xl font-bold text-slate-900 mb-12 text-center">教育背景</h2>
          <div className="space-y-8">
            <div className="flex gap-4"><div className="w-3 h-3 mt-2 rounded-full bg-primary flex-shrink-0" /><div><h3 className="text-lg font-semibold">计算机科学学士</h3><p className="text-primary">某某大学</p><p className="text-sm text-slate-500">2015 - 2019</p></div></div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-8 lg:px-12">
          <h2 className="text-2xl font-bold text-slate-900 mb-12 text-center">工作经历</h2>
          <div className="space-y-8">
            <div className="flex gap-4"><div className="w-3 h-3 mt-2 rounded-full bg-secondary flex-shrink-0" /><div><h3 className="text-lg font-semibold">高级全栈工程师</h3><p className="text-secondary">科技公司</p><p className="text-sm text-slate-500">2022 - 至今</p><p className="text-slate-600 mt-2">负责核心产品开发，技术架构设计。</p></div></div>
            <div className="flex gap-4"><div className="w-3 h-3 mt-2 rounded-full bg-secondary flex-shrink-0" /><div><h3 className="text-lg font-semibold">全栈开发工程师</h3><p className="text-secondary">互联网公司</p><p className="text-sm text-slate-500">2019 - 2022</p><p className="text-slate-600 mt-2">参与多个项目的前后端开发工作。</p></div></div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-slate-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-8 lg:px-12">
          <h2 className="text-2xl font-bold text-slate-900 mb-12 text-center">技能专长</h2>
          <div className="flex flex-wrap justify-center gap-3">
            {['React', 'Next.js', 'TypeScript', 'Node.js', 'Python', 'Go', 'PostgreSQL', 'MongoDB', 'Docker', 'AWS', 'Git', 'Linux', 'GraphQL', 'REST API', 'CI/CD'].map(s => (
              <span key={s} className="px-4 py-2 bg-white rounded-full text-slate-700 shadow-sm">{s}</span>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
