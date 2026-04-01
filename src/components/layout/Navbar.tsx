'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

const navLinks = [
  { href: '/', label: '首页' },
  { href: '/about', label: '关于' },
  { href: '/portfolio', label: '作品' },
  { href: '/learn', label: '学习' },
  { href: '/blog', label: '博客' },
  { href: '/contact', label: '联系' },
]

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const pathname = usePathname()

  // Hide Navbar on admin pages
  if (pathname?.startsWith('/admin')) {
    return null
  }

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => { setIsMobileMenuOpen(false) }, [pathname])

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all ${isScrolled ? 'bg-white/95 backdrop-blur-sm shadow-sm' : 'bg-transparent'}`}>
      <nav className="max-w-6xl mx-auto px-4 sm:px-8 lg:px-12 h-16 flex items-center justify-between">
        <Link href="/" className="text-xl font-bold text-gradient">虾说</Link>
        
        <ul className="hidden md:flex items-center gap-8">
          {navLinks.map(link => (
            <li key={link.href}>
              <Link href={link.href} className={`text-sm font-medium transition-colors ${pathname === link.href ? 'text-primary' : 'text-slate-600 hover:text-primary'}`}>
                {link.label}
              </Link>
            </li>
          ))}
        </ul>

        <button className="md:hidden p-2 text-slate-600" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} aria-label="菜单">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            {isMobileMenuOpen ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /> : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />}
          </svg>
        </button>
      </nav>

      {isMobileMenuOpen && (
        <div className="md:hidden bg-white border-t border-slate-200">
          <ul className="px-4 py-4 space-y-2">
            {navLinks.map(link => (
              <li key={link.href}>
                <Link href={link.href} className={`block py-2 ${pathname === link.href ? 'text-primary' : 'text-slate-600'}`}>
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </header>
  )
}
