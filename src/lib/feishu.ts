// 飞书 API 封装

const FEISHU_API_BASE = 'https://open.feishu.cn/open-apis'
const APP_ID = 'cli_a92695cf22b81bcb'
const APP_SECRET = 'UnfkhPtqDqd3POnZLK5lTcuwCCnIAE3E'

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

// 获取 tenant access token
let cachedToken: string | null = null
let tokenExpiry = 0

async function getAccessToken(): Promise<string> {
  if (cachedToken && Date.now() < tokenExpiry) {
    return cachedToken
  }
  
  const resp = await fetch(`${FEISHU_API_BASE}/auth/v3/tenant_access_token/internal`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ app_id: APP_ID, app_secret: APP_SECRET }),
  })
  
  const data = await resp.json()
  if (data.code !== 0) {
    throw new Error(`Failed to get access token: ${data.msg}`)
  }
  
  cachedToken = data.tenant_access_token
  tokenExpiry = Date.now() + (data.expire - 60) * 1000 // 提前1分钟过期
  return cachedToken!
}

async function feishuRequest(
  path: string,
  method: string = 'GET',
  body?: object
) {
  const token = await getAccessToken()
  
  const resp = await fetch(`${FEISHU_API_BASE}${path}`, {
    method,
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: body ? JSON.stringify(body) : undefined,
  })
  
  const data = await resp.json()
  if (data.code !== 0) {
    throw new Error(`Feishu API error: ${data.msg}`)
  }
  
  return data
}

export async function feishuListRecords(config: FeishuConfig) {
  const data = await feishuRequest(`/bitable/v1/apps/${config.app_token}/tables/${config.table_id}/records`)
  return data.data?.items || []
}

export async function feishuCreateRecord(config: FeishuConfig, fields: Record<string, any>) {
  const data = await feishuRequest(`/bitable/v1/apps/${config.app_token}/tables/${config.table_id}/records`, 'POST', { fields })
  return data.data?.record
}

export async function feishuUpdateRecord(config: FeishuConfig, recordId: string, fields: Record<string, any>) {
  const data = await feishuRequest(`/bitable/v1/apps/${config.app_token}/tables/${config.table_id}/records/${recordId}`, 'PUT', { fields })
  return data.data?.record
}

export async function feishuDeleteRecord(config: FeishuConfig, recordId: string) {
  await feishuRequest(`/bitable/v1/apps/${config.app_token}/tables/${config.table_id}/records/${recordId}`, 'DELETE')
  return { success: true }
}

// Portfolio API
export const portfolioAPI = {
  async list() {
    const records = await feishuListRecords(PORTFOLIO_CONFIG)
    return records.filter((r: any) => r.fields.published)
  },
  
  async get(id: string) {
    const records = await feishuListRecords(PORTFOLIO_CONFIG)
    return records.find((r: any) => r.id === id)
  },
  
  async getBySlug(slug: string) {
    const records = await feishuListRecords(PORTFOLIO_CONFIG)
    return records.find((r: any) => r.fields.slug === slug)
  },
  
  async create(data: Record<string, any>) {
    return feishuCreateRecord(PORTFOLIO_CONFIG, data)
  },
  
  async update(id: string, data: Record<string, any>) {
    return feishuUpdateRecord(PORTFOLIO_CONFIG, id, data)
  },
  
  async delete(id: string) {
    return feishuDeleteRecord(PORTFOLIO_CONFIG, id)
  }
}

// Blog API
export const blogAPI = {
  async list() {
    const records = await feishuListRecords(BLOG_CONFIG)
    return records.filter((r: any) => r.fields.published)
  },
  
  async get(id: string) {
    const records = await feishuListRecords(BLOG_CONFIG)
    return records.find((r: any) => r.id === id)
  },
  
  async getBySlug(slug: string) {
    const records = await feishuListRecords(BLOG_CONFIG)
    return records.find((r: any) => r.fields.slug === slug)
  },
  
  async create(data: Record<string, any>) {
    return feishuCreateRecord(BLOG_CONFIG, data)
  },
  
  async update(id: string, data: Record<string, any>) {
    return feishuUpdateRecord(BLOG_CONFIG, id, data)
  },
  
  async delete(id: string) {
    return feishuDeleteRecord(BLOG_CONFIG, id)
  },

  async updateBySlug(slug: string, data: Record<string, any>) {
    const record = await this.getBySlug(slug)
    if (!record) throw new Error('Record not found')
    return feishuUpdateRecord(BLOG_CONFIG, record.id, data)
  },

  async deleteBySlug(slug: string) {
    const record = await this.getBySlug(slug)
    if (!record) throw new Error('Record not found')
    return feishuDeleteRecord(BLOG_CONFIG, record.id)
  }
}
