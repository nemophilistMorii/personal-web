'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

interface Portfolio {
  id: string
  fields: {
    '个人网站-作品集': string
    slug: string
    description: string
    content?: string
    category: string
    tags: string[]
    cover_image?: string
    links?: string
    published: boolean
  }
}

export default function AdminPortfolioPage() {
  const [items, setItems] = useState<Portfolio[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editing, setEditing] = useState<Portfolio | null>(null)
  const [form, setForm] = useState({
    title: '',
    slug: '',
    description: '',
    category: 'Web应用',
    tags: '',
    links: '',
    published: true,
  })

  useEffect(() => {
    fetchItems()
  }, [])

  const fetchItems = async () => {
    try {
      const res = await fetch('/api/portfolio')
      const data = await res.json()
      if (data.success) {
        setItems(data.data)
      }
    } catch (error) {
      console.error('Failed to fetch:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const payload = {
      '个人网站-作品集': form.title,
      slug: form.slug || form.title.toLowerCase().replace(/\s+/g, '-'),
      description: form.description,
      category: form.category,
      tags: form.tags.split(',').map(t => t.trim()).filter(Boolean),
      links: form.links,
      published: form.published,
    }

    try {
      if (editing) {
        await fetch(`/api/portfolio/${editing.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        })
      } else {
        await fetch('/api/portfolio', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        })
      }
      fetchItems()
      resetForm()
    } catch (error) {
      console.error('Failed to save:', error)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('确定要删除吗？')) return
    try {
      await fetch(`/api/portfolio/${id}`, { method: 'DELETE' })
      fetchItems()
    } catch (error) {
      console.error('Failed to delete:', error)
    }
  }

  const handleEdit = (item: Portfolio) => {
    setEditing(item)
    setForm({
      title: item.fields['个人网站-作品集'],
      slug: item.fields.slug,
      description: item.fields.description,
      category: item.fields.category,
      tags: item.fields.tags?.join(', ') || '',
      links: item.fields.links || '',
      published: item.fields.published,
    })
    setShowForm(true)
  }

  const resetForm = () => {
    setEditing(null)
    setShowForm(false)
    setForm({ title: '', slug: '', description: '', category: 'Web应用', tags: '', links: '', published: true })
  }

  if (loading) {
    return <div className="min-h-screen bg-slate-100 p-8">加载中...</div>
  }

  return (
    <div className="min-h-screen bg-slate-100">
      <header className="bg-white shadow-sm">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/admin" className="text-slate-500 hover:text-slate-700">← 返回</Link>
              <h1 className="text-xl font-bold">作品集管理</h1>
            </div>
            <button
              onClick={() => setShowForm(true)}
              className="h-10 px-4 bg-primary text-white rounded-md hover:bg-primary-dark"
            >
              新增作品
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-8">
        {showForm && (
          <div className="bg-white p-6 rounded-lg shadow-md mb-6">
            <h2 className="text-lg font-semibold mb-4">{editing ? '编辑作品' : '新增作品'}</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">标题 *</label>
                  <input
                    type="text"
                    required
                    value={form.title}
                    onChange={(e) => setForm({ ...form, title: e.target.value })}
                    className="w-full h-10 px-3 border border-slate-300 rounded-md"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">slug</label>
                  <input
                    type="text"
                    value={form.slug}
                    onChange={(e) => setForm({ ...form, slug: e.target.value })}
                    className="w-full h-10 px-3 border border-slate-300 rounded-md"
                    placeholder="auto-generated"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">描述 *</label>
                <textarea
                  required
                  rows={3}
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-md"
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">分类</label>
                  <select
                    value={form.category}
                    onChange={(e) => setForm({ ...form, category: e.target.value })}
                    className="w-full h-10 px-3 border border-slate-300 rounded-md"
                  >
                    <option>Web应用</option>
                    <option>移动端</option>
                    <option>数据产品</option>
                    <option>工具</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">标签 (逗号分隔)</label>
                  <input
                    type="text"
                    value={form.tags}
                    onChange={(e) => setForm({ ...form, tags: e.target.value })}
                    className="w-full h-10 px-3 border border-slate-300 rounded-md"
                    placeholder="React, Node.js"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">链接</label>
                  <input
                    type="text"
                    value={form.links}
                    onChange={(e) => setForm({ ...form, links: e.target.value })}
                    className="w-full h-10 px-3 border border-slate-300 rounded-md"
                  />
                </div>
              </div>
              <div className="flex items-center gap-4">
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={form.published}
                    onChange={(e) => setForm({ ...form, published: e.target.checked })}
                    className="w-4 h-4"
                  />
                  <span className="text-sm">发布</span>
                </label>
              </div>
              <div className="flex gap-4">
                <button type="submit" className="h-10 px-6 bg-primary text-white rounded-md hover:bg-primary-dark">
                  保存
                </button>
                <button type="button" onClick={resetForm} className="h-10 px-6 border border-slate-300 rounded-md hover:bg-slate-50">
                  取消
                </button>
              </div>
            </form>
          </div>
        )}

        <div className="bg-white rounded-lg shadow-sm">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left p-4 font-medium text-slate-600">标题</th>
                <th className="text-left p-4 font-medium text-slate-600">分类</th>
                <th className="text-left p-4 font-medium text-slate-600">标签</th>
                <th className="text-left p-4 font-medium text-slate-600">状态</th>
                <th className="text-right p-4 font-medium text-slate-600">操作</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item) => (
                <tr key={item.id} className="border-b last:border-b-0">
                  <td className="p-4">{item.fields['个人网站-作品集']}</td>
                  <td className="p-4">{item.fields.category}</td>
                  <td className="p-4">
                    <div className="flex flex-wrap gap-1">
                      {item.fields.tags?.map(tag => (
                        <span key={tag} className="px-2 py-0.5 bg-slate-100 text-slate-600 text-xs rounded">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="p-4">
                    <span className={`px-2 py-1 text-xs rounded ${item.fields.published ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-500'}`}>
                      {item.fields.published ? '已发布' : '草稿'}
                    </span>
                  </td>
                  <td className="p-4 text-right">
                    <button onClick={() => handleEdit(item)} className="text-primary hover:underline mr-4">编辑</button>
                    <button onClick={() => handleDelete(item.id)} className="text-red-500 hover:underline">删除</button>
                  </td>
                </tr>
              ))}
              {items.length === 0 && (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-slate-500">暂无作品</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  )
}
