'use client'

import { useState } from 'react'

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitted(true)
  }

  return (
    <div className="pt-20">
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-8 lg:px-12 text-center">
          <h1 className="text-4xl font-bold text-slate-900 mb-4">联系我</h1>
          <p className="text-slate-600 max-w-2xl mx-auto">无论是项目合作、技术咨询还是其他问题，我都期待与您交流。</p>
        </div>
      </section>
      <section className="py-20 bg-slate-50">
        <div className="max-w-xl mx-auto px-4 sm:px-8 lg:px-12">
          {submitted ? (
            <div className="bg-white rounded-lg p-8 text-center shadow-md">
              <div className="w-16 h-16 mx-auto mb-4 bg-green-100 rounded-full flex items-center justify-center text-green-600 text-2xl">✓</div>
              <h2 className="text-2xl font-bold text-slate-900 mb-2">消息已发送！</h2>
              <p className="text-slate-600">感谢您的留言，我会尽快回复您。</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="bg-white rounded-lg p-8 shadow-md space-y-6">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">姓名 *</label>
                <input type="text" required className="w-full h-12 px-4 rounded-md border border-slate-300 focus:ring-2 focus:ring-primary focus:border-transparent" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">邮箱 *</label>
                <input type="email" required className="w-full h-12 px-4 rounded-md border border-slate-300 focus:ring-2 focus:ring-primary focus:border-transparent" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">主题 *</label>
                <select required className="w-full h-12 px-4 rounded-md border border-slate-300 focus:ring-2 focus:ring-primary focus:border-transparent">
                  <option value="">请选择</option>
                  <option value="商务合作">商务合作</option>
                  <option value="技术咨询">技术咨询</option>
                  <option value="媒体采访">媒体采访</option>
                  <option value="其他">其他</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">消息内容 *</label>
                <textarea required rows={5} className="w-full px-4 py-3 rounded-md border border-slate-300 focus:ring-2 focus:ring-primary focus:border-transparent resize-none" />
              </div>
              <button type="submit" className="w-full h-12 bg-primary text-white font-medium rounded-md hover:bg-primary-dark transition-colors">发送消息</button>
              <p className="text-xs text-slate-500 text-center">您的信息将被保密，不会用于任何商业用途。</p>
            </form>
          )}
        </div>
      </section>
    </div>
  )
}
