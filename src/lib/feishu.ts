// 飞书 API 封装

const FEISHU_API_BASE = 'https://open.feishu.cn/open-apis'

interface FeishuConfig {
  app_token: string
  table_id: string
}

export const PORTFOLIO_CONFIG: FeishuConfig = {
  app_token: 'K43Nb94jSaQDMqsMpS2c1v6pn3M',
  table_id: 'tblYt1KPIeDaYxN7',
}

export const BLOG_CONFIG: FeishuConfig = {
  app_token: 'PHJjbUKSga8Eg6sARtYcwU3knpd',
  table_id: 'tblW1FRwPnjzbgE9',
}

export async function feishuRequest(
  path: string,
  method: string = 'GET',
  body?: object
) {
  // Note: In production, use proper auth token from environment
  // This is a simplified version for demo
  const url = `${FEISHU_API_BASE}${path}`
  
  try {
    const response = await fetch(url, {
      method,
      headers: {
        'Content-Type': 'application/json',
      },
      body: body ? JSON.stringify(body) : undefined,
    })
    
    if (!response.ok) {
      throw new Error(`Feishu API error: ${response.status}`)
    }
    
    return await response.json()
  } catch (error) {
    console.error('Feishu API request failed:', error)
    throw error
  }
}

// For demo/development - using local data store instead of live API
// This avoids authentication issues during development

interface DataRecord {
  id: string
  fields: Record<string, any>
}

let portfolioData: DataRecord[] = [
  {
    id: 'rec001',
    fields: {
      '个人网站-作品集': '电商平台',
      slug: 'ecommerce-platform',
      description: '完整的电商解决方案，包含用户系统、商品管理、订单处理等功能。',
      content: '## 项目概述\n\n这是一个完整的电商平台解决方案...\n\n## 核心功能\n\n- 用户注册登录\n- 商品浏览和搜索\n- 购物车管理\n- 订单处理',
      category: 'Web应用',
      tags: ['React', 'Node.js', 'MongoDB'],
      cover_image: '',
      links: 'https://example.com',
      published: true,
    }
  }
]

let blogData: DataRecord[] = [
  {
    id: 'recb001',
    fields: {
      '个人网站-博客': 'Next.js 14 新特性深度解析',
      slug: 'nextjs14-features',
      excerpt: '深入探讨 Next.js 14 App Router 的核心改进和最佳实践。',
      content: '## 引言\n\nNext.js 14 带来了许多令人兴奋的新特性...\n\n## App Router 改进\n\nApp Router 是 Next.js 13 引入的重大新特性...',
      tags: ['Next.js', 'React', '前端'],
      category: '技术',
      cover_image: '',
      published: true,
      read_time: 8,
    }
  }
]

// Portfolio API
export const portfolioAPI = {
  async list() {
    return portfolioData.filter(r => r.fields.published)
  },
  
  async get(id: string) {
    return portfolioData.find(r => r.id === id)
  },
  
  async getBySlug(slug: string) {
    return portfolioData.find(r => r.fields.slug === slug)
  },
  
  async create(data: Record<string, any>) {
    const newRecord = {
      id: `rec${Date.now()}`,
      fields: { ...data, created_at: new Date().toISOString() }
    }
    portfolioData.push(newRecord)
    return newRecord
  },
  
  async update(id: string, data: Record<string, any>) {
    const index = portfolioData.findIndex(r => r.id === id)
    if (index === -1) throw new Error('Record not found')
    portfolioData[index] = { ...portfolioData[index], fields: { ...portfolioData[index].fields, ...data } }
    return portfolioData[index]
  },
  
  async delete(id: string) {
    const index = portfolioData.findIndex(r => r.id === id)
    if (index === -1) throw new Error('Record not found')
    portfolioData.splice(index, 1)
    return { success: true }
  }
}

// Blog API
export const blogAPI = {
  async list() {
    return blogData.filter(r => r.fields.published)
  },
  
  async get(id: string) {
    return blogData.find(r => r.id === id)
  },
  
  async getBySlug(slug: string) {
    return blogData.find(r => r.fields.slug === slug)
  },
  
  async create(data: Record<string, any>) {
    const newRecord = {
      id: `recb${Date.now()}`,
      fields: { ...data, created_at: new Date().toISOString() }
    }
    blogData.push(newRecord)
    return newRecord
  },
  
  async update(id: string, data: Record<string, any>) {
    const index = blogData.findIndex(r => r.id === id)
    if (index === -1) throw new Error('Record not found')
    blogData[index] = { ...blogData[index], fields: { ...blogData[index].fields, ...data } }
    return blogData[index]
  },
  
  async delete(id: string) {
    const index = blogData.findIndex(r => r.id === id)
    if (index === -1) throw new Error('Record not found')
    blogData.splice(index, 1)
    return { success: true }
  }
}
