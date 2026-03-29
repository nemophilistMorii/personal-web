'use client'

import { useState } from 'react'
import Link from 'next/link'

const ADMIN_PASSWORD = 'admin123' // 建议生产环境使用环境变量

export default function AdminPage() {
  const [authenticated, setAuthenticated] = useState(false)
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    if (password === ADMIN_PASSWORD) {
      setAuthenticated(true)
      setError('')
    } else {
      setError('密码错误')
    }
  }

  if (!authenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-100">
        <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-sm">
          <h1 className="text-2xl font-bold text-center mb-6">管理后台</h1>
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">密码</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full h-10 px-3 border border-slate-300 rounded-md focus:ring-2 focus:ring-primary focus:border-transparent"
                placeholder="输入密码"
              />
            </div>
            {error && <p className="text-red-500 text-sm">{error}</p>}
            <button type="submit" className="w-full h-10 bg-primary text-white rounded-md hover:bg-primary-dark">
              登录
            </button>
          </form>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-100">
      <header className="bg-white shadow-sm">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-xl font-bold">管理后台</h1>
            <button onClick={() => setAuthenticated(false)} className="text-sm text-slate-500 hover:text-slate-700">
              退出登录
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Link href="/admin/portfolio" className="block bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                <span className="text-2xl">📁</span>
              </div>
              <div>
                <h2 className="text-lg font-semibold">作品集管理</h2>
                <p className="text-sm text-slate-500">管理项目案例</p>
              </div>
            </div>
          </Link>

          <Link href="/admin/blog" className="block bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-secondary/10 rounded-lg flex items-center justify-center">
                <span className="text-2xl">📝</span>
              </div>
              <div>
                <h2 className="text-lg font-semibold">博客管理</h2>
                <p className="text-sm text-slate-500">管理技术文章</p>
              </div>
            </div>
          </Link>
        </div>
      </main>
    </div>
  )
}
