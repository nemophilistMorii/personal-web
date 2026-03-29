'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

interface Blog {
  id: string
  fields: {
    '个人网站-博客': string
    slug: string
    excerpt: string
    content: string
    category: string
    tags: string[]
    read_time: number
    published: boolean
  }
}

export default function AdminBlogPage() {
  const [items, setItems] = useState<Blog[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editing, setEditing] = useState<Blog | null>(null)
  const [form, setForm] = useState({
    title: '',
    slug: '',
    excerpt: '',
    content: '',
    category: '技术',
    tags: '',
    read_time: 5,
    published: true,
  })

  useEffect(() => {
    fetchItems()
  }, [])

  const fetchItems = async () => {
    try {
      const res = await fetch('/api/blog')
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
      '个人网站-博客': form.title,
      slug: form.slug || form.title.toLowerCase().replace(/\s+/g, '-'),
      excerpt: form.excerpt,
      content: form.content,
      category: form.category,
      tags: form.tags.split(',').map(t => t.trim()).filter(Boolean),
      read_time: Number(form.read_time),
      published: form.published,
    }

    try {
      if (editing) {
        await fetch(`/api/blog/${editing.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        })
      } else {
        await fetch('/api/blog', {
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
      await fetch(`/api/blog/${id}`, { method: 'DELETE' })
      fetchItems()
    } catch (error) {
      console.error('Failed to delete:', error)
    }
  }

  const handleEdit = (item: Blog) => {
    setEditing(item)
    setForm({
      title: item.fields['个人网站-博客'],
      slug: item.fields.slug,
      excerpt: item.fields.excerpt,
      content: item.fields.content,
      category: item.fields.category,
      tags: item.fields.tags?.join(', ') || '',
      read_time: item.fields.read_time || 5,
      published: item.fields.published,
    })
    setShowForm(true)
  }

  const resetForm = () => {
    setEditing(null)
    setShowForm(false)
    setForm({ title: '', slug: '', excerpt: '', content: '', category: '技术', tags: '', read_time: 5, published: true })
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
              <h1 className="text-xl font-bold">博客管理</h1>
            </div>
            <button
              onClick={() => setShowForm(true)}
              className="h-10 px-4 bg-primary text-white rounded-md hover:bg-primary-dark"
            >
              新建文章
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-8">
        {showForm && (
          <div className="bg-white p-6 rounded-lg shadow-md mb-6">
            <h2 className="text-lg font-semibold mb-4">{editing ? '编辑文章' : '新建文章'}</h2>
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
                <label className="block text-sm font-medium text-slate-700 mb-1">摘要 *</label>
                <textarea
                  required
                  rows={2}
                  value={form.excerpt}
                  onChange={(e) => setForm({ ...form, excerpt: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-md"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">正文 (Markdown) *</label>
                <textarea
                  required
                  rows={10}
                  value={form.content}
                  onChange={(e) => setForm({ ...form, content: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-md font-mono text-sm"
                  placeholder="## 标题&#10;&#10;正文内容..."
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">分类</label>
                  <select
                    value={form.category}
                    onChange={(e) => setForm({ ...form, category: e.target.value })}
                    className="w-full h-10 px-3 border border-slate-300 rounded-md"
                  >
                    <option>技术</option>
                    <option>产品</option>
                    <option>生活</option>
                    <option>其他</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">标签 (逗号分隔)</label>
                  <input
                    type="text"
                    value={form.tags}
                    onChange={(e) => setForm({ ...form, tags: e.target.value })}
                    className="w-full h-10 px-3 border border-slate-300 rounded-md"
                    placeholder="React, 前端"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">阅读时长 (分钟)</label>
                  <input
                    type="number"
                    min={1}
                    value={form.read_time}
                    onChange={(e) => setForm({ ...form, read_time: Number(e.target.value) })}
                    className="w-full h-10 px-3 border border-slate-300 rounded-md"
                  />
                </div>
                <div className="flex items-end">
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
                <th className="text-left p-4 font-medium text-slate-600">时长</th>
                <th className="text-left p-4 font-medium text-slate-600">状态</th>
                <th className="text-right p-4 font-medium text-slate-600">操作</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item) => (
                <tr key={item.id} className="border-b last:border-b-0">
                  <td className="p-4">{item.fields['个人网站-博客']}</td>
                  <td className="p-4">{item.fields.category}</td>
                  <td className="p-4">
                    <div className="flex flex-wrap gap-1">
                      {item.fields.tags?.map(tag => (
                        <span key={tag} className="px-2 py-0.5 bg-primary/10 text-primary text-xs rounded">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="p-4">{item.fields.read_time}分钟</td>
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
                  <td colSpan={6} className="p-8 text-center text-slate-500">暂无文章</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  )
}
