import { blogAPI } from '@/lib/feishu'
import { BlogClient } from './BlogClient'

async function getBlog() {
  try {
    const data = await blogAPI.list()
    // 按时间降序排序，新的在前
    return [...data].sort((a, b) =>
      new Date(b.fields.created_at).getTime() - new Date(a.fields.created_at).getTime()
    )
  } catch {
    return []
  }
}

export default async function BlogPage() {
  const articles = await getBlog()
  return <BlogClient articles={articles} />
}
