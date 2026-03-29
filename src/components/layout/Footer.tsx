'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

const quickLinks = [
  { href: '/', label: '首页' },
  { href: '/about', label: '关于' },
  { href: '/portfolio', label: '作品' },
  { href: '/blog', label: '博客' },
  { href: '/contact', label: '联系' },
]

export function Footer() {
  const pathname = usePathname()

  // Hide Footer on admin pages
  if (pathname?.startsWith('/admin')) {
    return null
  }

  return (
    <footer className="bg-slate-900 text-slate-300">
      <div className="max-w-6xl mx-auto px-4 sm:px-8 lg:px-12 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-xl font-bold text-white mb-4">个人网站</h3>
            <p className="text-sm text-slate-400">专业个人品牌展示平台，传递价值，连接未来。</p>
          </div>
          <div>
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">快速链接</h4>
            <ul className="space-y-2">
              {quickLinks.map(link => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm hover:text-primary transition-colors">{link.label}</Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">社交媒体</h4>
            <div className="flex gap-4">
              {['G', 'T', 'L'].map((s, i) => (
                <a key={i} href="#" className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center hover:bg-primary transition-colors text-sm">{s}</a>
              ))}
            </div>
          </div>
        </div>
        <div className="mt-8 pt-8 border-t border-slate-800 text-center text-sm text-slate-500">
          <p>&copy; {new Date().getFullYear()} 个人网站. 由 Next.js 驱动.</p>
        </div>
      </div>
    </footer>
  )
}
