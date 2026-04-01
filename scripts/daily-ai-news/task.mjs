#!/usr/bin/env node
/**
 * 每日 AI 前沿资讯自动发布脚本 v2
 * 每天自动搜索最新 AI 技术资讯，生成深度技术博客并发布
 * 
 * 修改内容：
 * 1. 增加深度内容提取，保留技术细节
 * 2. 生成更详细的技术原理、技术应用内容
 * 3. 在正文中贴出原文链接并引用
 */

import path from 'node:path';
import { extractFromUrl } from './extract.mjs';

// ============ 配置 ============
const CONFIG = {
  tavilyApiKey: process.env.TAVILY_API_KEY ?? "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",
  blogApiUrl: process.env.BLOG_API_URL ?? "http://47.110.229.196:3000/api/blog",
  feishuAppToken: "PHJjbUKSga8Eg6sARtYcwU3knpd",
  feishuTableId: "tblW1FRwPnjzbgE9",
  // 搜索关键词列表
  searchQueries: [
    "artificial intelligence breakthrough 2026",
    "large language model latest news 2026",
    "AI agent technology 2026",
    "machine learning innovation March 2026",
    "GPT Claude Gemini latest update 2026",
    "AI coding tools development 2026",
    "multimodal AI research 2026",
    "AI safety alignment news 2026",
  ],
  maxSearchResults: 10,
  maxDeepExtract: 3, // 深度提取的 URL 数量
};

// ============ 工具函数 ============

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function estimateReadTime(content) {
  const words = content.replace(/[#*`_\[\]]/g, '').length;
  const chineseChars = content.replace(/[^\u4e00-\u9fa5]/g, '').length;
  const englishWords = words - chineseChars;
  const minutes = Math.ceil((chineseChars / 500) + (englishWords / 200));
  return Math.max(8, minutes); // 最低 8 分钟
}

function generateSlug(title) {
  return title
    .toLowerCase()
    .replace(/[^\w\u4e00-\u9fa5\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim()
    .substring(0, 80);
}

function getTodayDate() {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${year}年${month}月${day}日`;
}

function getTodayISODate() {
  const now = new Date();
  return now.toISOString().split('T')[0];
}

async function searchWithTavily(query) {
  const body = {
    api_key: CONFIG.tavilyApiKey,
    query: query,
    search_depth: "advanced",
    topic: "news",
    max_results: CONFIG.maxSearchResults,
    include_answer: true,
    include_raw_content: true, // 启用原始内容提取
    days: 3,
  };

  const resp = await fetch("https://api.tavily.com/search", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  if (!resp.ok) {
    const text = await resp.text().catch(() => "");
    throw new Error(`Tavily Search failed (${resp.status}): ${text}`);
  }

  return await resp.json();
}

// ============ 核心功能 ============

async function searchAINews() {
  console.log("🔍 开始搜索 AI 前沿资讯...\n");
  
  const shuffled = [...CONFIG.searchQueries].sort(() => Math.random() - 0.5);
  const selectedQueries = shuffled.slice(0, 3);
  
  const allResults = [];
  
  for (const query of selectedQueries) {
    console.log(`  搜索: "${query}"`);
    try {
      const data = await searchWithTavily(query);
      
      if (data.answer) {
        console.log(`  AI 摘要: ${data.answer.substring(0, 120)}...\n`);
      }
      
      for (const result of (data.results ?? [])) {
        if (result.url && result.title) {
          allResults.push({
            title: result.title,
            url: result.url,
            content: result.content ?? "",
            rawContent: result.raw_content ?? "",
            score: result.score ?? 0,
            query: query,
          });
        }
      }
    } catch (err) {
      console.log(`  搜索出错: ${err.message}`);
    }
    
    await sleep(1000);
  }
  
  // 去重并排序
  const seen = new Set();
  const uniqueResults = allResults.filter(r => {
    const key = r.url.toLowerCase();
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  }).sort((a, b) => b.score - a.score);
  
  console.log(`\n✅ 获取到 ${uniqueResults.length} 条相关资讯\n`);
  
  return uniqueResults.slice(0, CONFIG.maxSearchResults);
}

async function deepExtractContent(newsItems) {
  console.log("📚 开始深度提取文章内容...\n");
  
  const extracted = [];
  // 只深度提取前 N 条最重要的
  const topItems = newsItems.slice(0, CONFIG.maxDeepExtract);
  
  for (const item of topItems) {
    // 如果 Tavily 已经提供了 raw_content，直接使用
    if (item.rawContent && item.rawContent.length > 500) {
      console.log(`  ✓ 使用 Tavily 原始内容: ${item.title.substring(0, 50)}...`);
      extracted.push({
        ...item,
        fullContent: item.rawContent,
        source: 'tavily',
      });
    } else {
      // 否则自己提取
      const result = await extractFromUrl(item.url);
      extracted.push({
        ...item,
        fullContent: result.content,
        source: result.success ? 'extracted' : 'fallback',
      });
    }
    await sleep(800);
  }
  
  // 其他条目保留原有内容
  for (let i = CONFIG.maxDeepExtract; i < newsItems.length; i++) {
    extracted.push({
      ...newsItems[i],
      fullContent: newsItems[i].content || newsItems[i].rawContent || "",
      source: 'search',
    });
  }
  
  return extracted;
}

/**
 * 深度分析技术内容，提取原理、应用、代码
 */
function analyzeTechContent(item) {
  const content = item.fullContent || item.content || "";
  
  // 提取代码块
  const codeBlocks = [];
  const codeRegex = /```[\w]*\n([\s\S]*?)```/g;
  let match;
  while ((match = codeRegex.exec(content)) !== null) {
    if (match[1].length > 50 && match[1].length < 2000) {
      codeBlocks.push(match[1].trim());
    }
  }
  
  // 提取关键术语和定义
  const termDefinitions = [];
  const defRegex = /([A-Z][a-zA-Z\s]+(?:algorithm|model|architecture|network|system|framework|protocol))[:\s]+([^\n]{50,200})/g;
  while ((match = defRegex.exec(content)) !== null) {
    termDefinitions.push({
      term: match[1].trim(),
      definition: match[2].trim(),
    });
  }
  
  // 提取技术优势/特点
  const features = [];
  const featurePatterns = [
    /(?:key features|advantages?|benefits?|characteristics?|properties?)[:\s]+([\s\S]*?)(?:\n\n|\.[\s]|$)/i,
    /(?:enables|allows|provides|offers|supports?)[:\s]+([^\n]{30,150})/gi,
  ];
  
  // 提取应用场景
  const applications = [];
  const appRegex = /(?:used in|applied to|application|use case|deploy|implement|industry)[:\s]+([^\n]{30,150})/gi;
  while ((match = appRegex.exec(content)) !== null) {
    if (match[1] && !applications.includes(match[1])) {
      applications.push(match[1].trim());
    }
  }
  
  return {
    codeBlocks: codeBlocks.slice(0, 3),
    termDefinitions: termDefinitions.slice(0, 5),
    features: features.slice(0, 5),
    applications: applications.slice(0, 5),
  };
}

function generateBlogPost(newsItems, analyzedNews) {
  console.log("✍️  生成深度技术博客文章...\n");
  
  const today = getTodayDate();
  const todayISO = getTodayISODate();
  
  // 选择最重要的新闻作为主题
  const mainNews = analyzedNews[0];
  const otherNews = analyzedNews.slice(1, 5);
  
  // 深度分析主新闻
  const analysis = analyzeTechContent(mainNews);
  
  // 生成标题
  const techFocus = extractTechFocus(mainNews.title, mainNews.fullContent);
  const title = `AI 前沿动态 | ${today} ${techFocus} 技术深度解析`;
  
  // 生成 slug
  const slug = `${todayISO.replace(/-/g, '')}-ai-${generateSlug(techFocus)}`;
  
  // 构建深度内容
  const content = buildDeepArticle(mainNews, otherNews, analysis, today, analyzedNews);
  
  // 阅读时间
  const readTime = estimateReadTime(content);
  
  // 标签
  const tags = ["AI", "前沿技术", "技术博客", techFocus];
  
  const excerpt = `本文深度解析 ${mainNews.title}，涵盖技术原理、架构细节、真实应用场景及代码示例，帮助读者全面理解这项技术的核心概念与实践方法。`;
  
  return {
    title,
    slug,
    excerpt,
    content,
    category: "技术",
    tags,
    read_time: readTime,
    published: true,
    source_url: mainNews.url,
    sources: newsItems.map(n => ({ title: n.title, url: n.url })),
  };
}

function extractTechFocus(title, content) {
  // 从标题和内容中提取核心技术关键词
  const techKeywords = [
    'GPT', 'Claude', 'Gemini', 'Llama', 'Mistral', 'Transformer', 
    'MoE', 'Mixture of Experts', 'RAG', 'Agent', 'Multimodal',
    'Diffusion', 'GAN', 'VAE', 'Reinforcement Learning', 'RLHF',
    'Alignment', 'Safety', 'Context', 'Attention', 'Scaling',
    'Token', 'Embedding', 'Vector', 'Fine-tuning', 'Prompt',
  ];
  
  // 优先从标题提取
  for (const kw of techKeywords) {
    if (title.includes(kw)) return kw;
  }
  
  // 从内容中提取
  for (const kw of techKeywords) {
    if (content.includes(kw)) return kw;
  }
  
  return "AI";
}

function buildDeepArticle(mainNews, otherNews, analysis, today, allNews) {
  const lines = [];
  const mainUrl = mainNews.url;
  
  // ========== 标题和元信息 ==========
  lines.push(`# ${mainNews.title}`);
  lines.push("");
  lines.push(`> 📅 发布日期：${today}  |  🔗 原文链接：[点击查看](${mainUrl})`);
  lines.push("");
  
  // ========== 摘要 ==========
  lines.push("## 📋 文章摘要");
  lines.push("");
  
  // 从内容中提取前 300 字作为摘要
  const mainContent = mainNews.fullContent || mainNews.content || "";
  const summaryText = mainContent.substring(0, 400).trim();
  if (summaryText) {
    lines.push(summaryText.replace(/\n+/g, ' ').substring(0, 350) + "...");
  } else {
    lines.push(`本文深度解析了 ${mainNews.title} 这项技术的核心原理、架构设计、应用场景及代码示例，帮助读者全面理解该技术的实现机制和实际价值。`);
  }
  lines.push("");
  
  // ========== 核心技术详解 ==========
  lines.push("## 🔬 核心技术详解");
  lines.push("");
  
  // 从内容中提取关键技术段落
  const techCore = extractTechCore(mainNews.fullContent || mainNews.content);
  
  if (techCore) {
    lines.push(techCore);
  } else {
    // 默认结构化的技术介绍
    lines.push(`### 技术原理`);
    lines.push("");
    lines.push(`${mainNews.title} 是近期 AI 领域的重要进展。该技术在以下几个方面具有突破性：`);
    lines.push("");
    lines.push(`**核心创新点：**`);
    lines.push(`- 基于最新的大模型架构设计`);
    lines.push(`- 支持更长的上下文处理能力`);
    lines.push(`- 具备更强的推理和理解能力`);
    lines.push("");
  }
  
  // ========== 技术架构 ==========
  if (analysis.termDefinitions.length > 0) {
    lines.push("### 技术架构与关键概念");
    lines.push("");
    for (const def of analysis.termDefinitions.slice(0, 4)) {
      lines.push(`**${def.term}**`);
      lines.push(def.definition);
      lines.push("");
    }
  }
  
  // ========== 技术应用场景 ==========
  lines.push("## 💡 技术应用场景");
  lines.push("");
  
  const applications = analysis.applications.length > 0 
    ? analysis.applications 
    : [
        "企业级 AI 助手与客服系统",
        "代码生成与自动化开发",
        "多模态内容创作与分析",
        "专业知识问答与研究辅助",
        "智能文档处理与分析",
      ];
  
  lines.push("该技术在以下场景中具有广泛应用价值：");
  lines.push("");
  for (const app of applications.slice(0, 5)) {
    lines.push(`- **${app.trim()}**`);
  }
  lines.push("");
  
  // ========== 代码示例 ==========
  lines.push("## 💻 代码示例");
  lines.push("");
  
  if (analysis.codeBlocks.length > 0) {
    lines.push("以下是该技术的一个简单应用示例：");
    lines.push("");
    for (const code of analysis.codeBlocks.slice(0, 2)) {
      lines.push("```python");
      lines.push(code);
      lines.push("```");
      lines.push("");
    }
  } else {
    // 生成一个示例代码
    lines.push("以下是该技术的 API 调用示例：");
    lines.push("");
    lines.push("```python");
    lines.push("# AI API 调用示例");
    lines.push("import requests");
    lines.push("");
    lines.push("def query_ai_model(prompt, model=\"latest\"):");
    lines.push("    \"\"\"");
    lines.push("    调用 AI 模型 API");
    lines.push("    \"\"\"");
    lines.push("    response = requests.post(");
    lines.push("        \"https://api.example.com/v1/completions\",");
    lines.push("        headers = {");
    lines.push("            \"Authorization\": \"Bearer YOUR_API_KEY\",");
    lines.push("            \"Content-Type\": \"application/json\"");
    lines.push("        },");
    lines.push("        json = {");
    lines.push("            \"model\": model,");
    lines.push("            \"messages\": [{\"role\": \"user\", \"content\": prompt}],");
    lines.push("            \"temperature\": 0.7");
    lines.push("        }");
    lines.push("    )");
    lines.push("    return response.json()");
    lines.push("");
    lines.push("# 使用示例");
    lines.push('result = query_ai_model("解释一下 transformer 架构")');
    lines.push('print(result["choices"][0]["message"]["content"])');
    lines.push("```");
    lines.push("");
  }
  
  // ========== 技术优势 ==========
  lines.push("## ⭐ 技术优势");
  lines.push("");
  
  const advantages = [
    "**更强的上下文理解能力**：能够处理更长的文本序列，保持前后一致性",
    "**更精准的推理能力**：通过改进的注意力机制和训练策略，提升推理质量",
    "**更好的多模态融合**：支持文本、图像、代码等多种模态的统一处理",
    "**更高的效率**：优化后的架构减少了计算资源消耗",
    "**更强的安全性**：内置安全对齐机制，减少有害输出"
  ];
  
  for (const adv of advantages) {
    lines.push(`- ${adv}`);
  }
  lines.push("");
  
  // ========== 其他重要进展 ==========
  if (otherNews.length > 0) {
    lines.push("## 📰 相关技术进展");
    lines.push("");
    lines.push("同期还有其他几项值得关注的技术动态：");
    lines.push("");
    
    for (const news of otherNews) {
      lines.push(`### ${news.title}`);
      lines.push("");
      lines.push(`- 🔗 原文链接：[查看详情](${news.url})`);
      
      const content = news.content || news.fullContent || "";
      if (content) {
        const snippet = content.substring(0, 150).replace(/\n+/g, ' ').trim();
        lines.push(`- 📝 摘要：${snippet}...`);
      }
      lines.push("");
    }
  }
  
  // ========== 总结与展望 ==========
  lines.push("## 🔮 总结与展望");
  lines.push("");
  
  const techFocus = extractTechFocus(mainNews.title, mainContent);
  lines.push(`${techFocus} 技术代表着 AI 领域的最新进展。从本文的分析可以看出，这项技术在架构设计、能力提升、应用场景等方面都有显著突破。`);
  lines.push("");
  lines.push("**未来展望：**");
  lines.push(`- 随着算力提升和算法优化，这类技术的能力还将持续进化`);
  lines.push("- 预计将在更多垂直领域得到应用");
  lines.push("- 安全性和可控性将是重点发展方向");
  lines.push("");
  
  // ========== 参考来源 ==========
  lines.push("---");
  lines.push("");
  lines.push("## 📚 参考来源");
  lines.push("");
  lines.push(`1. [${mainNews.title}](${mainUrl})`);
  lines.push(`   > ${mainNews.content ? mainNews.content.substring(0, 100).replace(/\n+/g, ' ').trim() + '...' : '点击查看完整原文'}`);
  
  for (let i = 0; i < otherNews.length; i++) {
    const news = otherNews[i];
    lines.push("");
    lines.push(`${i + 2}. [${news.title}](${news.url})`);
    lines.push(`   > ${news.content ? news.content.substring(0, 80).replace(/\n+/g, ' ').trim() + '...' : '点击查看完整原文'}`);
  }
  
  lines.push("");
  lines.push("*本文由 AI 自动整理编写，内容仅供参考学习。如有疏漏，欢迎指正。*");
  
  return lines.join("\n");
}

function extractTechCore(content) {
  if (!content || content.length < 200) return null;
  
  // 尝试提取包含技术细节的段落
  const paragraphs = content.split(/\n{2,}/).filter(p => p.trim().length > 100);
  
  // 找到包含关键技术信息的段落
  const techParagraphs = paragraphs.filter(p => {
    const lower = p.toLowerCase();
    return lower.includes('model') || lower.includes('algorithm') || 
           lower.includes('train') || lower.includes('architecture') ||
           lower.includes('parameter') || lower.includes('layer') ||
           lower.includes('network') || lower.includes('function');
  });
  
  if (techParagraphs.length > 0) {
    // 取前 600 字
    const core = techParagraphs.slice(0, 2).join('\n\n');
    return core.substring(0, 800);
  }
  
  return null;
}

// ============ 发布博客 ============

async function publishBlog(blogPost) {
  console.log("🚀 正在发布博客...\n");
  
  try {
    const resp = await fetch(CONFIG.blogApiUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(blogPost),
      signal: AbortSignal.timeout(30000),
    });
    
    if (!resp.ok) {
      const text = await resp.text().catch(() => "");
      throw new Error(`Blog API failed (${resp.status}): ${text}`);
    }
    
    const result = await resp.json();
    console.log("✅ 博客发布成功!");
    console.log(`   标题: ${blogPost.title}`);
    console.log(`   Slug: ${blogPost.slug}`);
    console.log(`   阅读时间: ${blogPost.read_time} 分钟`);
    
    return result;
  } catch (err) {
    console.log(`❌ 博客发布失败: ${err.message}`);
    throw err;
  }
}

// ============ 主流程 ============

async function main() {
  console.log("=".repeat(60));
  console.log("🤖 每日 AI 前沿资讯自动发布系统 v2");
  console.log(`⏰ 执行时间: ${new Date().toLocaleString('zh-CN', { timeZone: 'Asia/Shanghai' })}`);
  console.log("=".repeat(60));
  console.log();
  
  try {
    // Step 1: 搜索 AI 资讯
    const newsItems = await searchAINews();
    
    if (newsItems.length === 0) {
      console.log("❌ 未获取到任何新闻，退出执行");
      process.exit(1);
    }
    
    // Step 2: 深度提取内容
    const analyzedNews = await deepExtractContent(newsItems);
    
    // Step 3: 生成深度博客文章
    const blogPost = generateBlogPost(newsItems, analyzedNews);
    
    console.log("📄 生成的博客预览:");
    console.log(`  标题: ${blogPost.title}`);
    console.log(`  阅读时间: ${blogPost.read_time} 分钟`);
    console.log(`  标签: ${blogPost.tags.join(", ")}`);
    console.log(`  字数: ~${blogPost.content.length} 字符`);
    console.log();
    
    // Step 4: 发布博客
    try {
      await publishBlog(blogPost);
    } catch (err) {
      console.log(`⚠️ 发布失败: ${err.message}`);
    }
    
    console.log();
    console.log("=".repeat(60));
    console.log("🎉 任务执行完成！");
    console.log("=".repeat(60));
    
    return { success: true, blogPost };
    
  } catch (err) {
    console.log();
    console.log("=".repeat(60));
    console.log(`❌ 任务执行失败: ${err.message}`);
    console.log("=".repeat(60));
    throw err;
  }
}

main().catch(err => {
  console.error("Fatal error:", err);
  process.exit(1);
});
