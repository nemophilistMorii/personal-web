import { blogAPI } from '@/lib/feishu'
import { LearnClient } from './LearnClient'

async function getLearnArticles() {
  try {
    const allArticles = await blogAPI.list()
    // 筛选带有「安卓学习」标签的文章
    const androidArticles = allArticles.filter((a: any) =>
      a.fields.tags?.includes('安卓学习')
    )
    // 按时间降序排序，新的在前
    return [...androidArticles].sort((a, b) =>
      new Date(b.fields.created_at).getTime() - new Date(a.fields.created_at).getTime()
    )
  } catch {
    return []
  }
}

export default async function LearnPage() {
  const articles = await getLearnArticles()
  return <LearnClient articles={articles} />
}
