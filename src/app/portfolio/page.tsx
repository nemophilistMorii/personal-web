import { portfolioAPI } from '@/lib/feishu'
import { PortfolioClient } from './PortfolioClient'

async function getPortfolio() {
  try {
    return await portfolioAPI.list()
  } catch {
    return []
  }
}

export default async function PortfolioPage() {
  const projects = await getPortfolio()
  return <PortfolioClient projects={projects} />
}
