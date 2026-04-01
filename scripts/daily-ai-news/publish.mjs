#!/usr/bin/env node
/**
 * 每日 AI 前沿资讯 - 直接写入飞书
 * 使用 OpenClaw 的 Feishu MCP 工具写入
 */

const API_URL = 'http://47.110.229.196:3000/api/blog'

async function main() {
  // 从命令行参数获取文章数据
  const articleData = JSON.parse(process.argv[2] || '{}')
  
  console.log('📝 接收到的文章数据:', articleData.title)
  
  // 直接调用飞书 Bitable API (需要 access token)
  // 这里我们改用 API 路由，看是否能工作
  
  try {
    const resp = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(articleData),
    })
    
    if (resp.ok) {
      const result = await resp.json()
      console.log('✅ API 调用成功:', result)
    } else {
      console.log('❌ API 调用失败:', resp.status, await resp.text())
    }
  } catch (err) {
    console.log('❌ 错误:', err.message)
  }
}

main()
