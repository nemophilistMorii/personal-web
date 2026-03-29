import { NextRequest, NextResponse } from 'next/server'
import { portfolioAPI } from '@/lib/feishu'

export async function GET() {
  try {
    const data = await portfolioAPI.list()
    return NextResponse.json({ success: true, data })
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to fetch portfolio' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const record = await portfolioAPI.create(body)
    return NextResponse.json({ success: true, data: record }, { status: 201 })
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to create portfolio' }, { status: 500 })
  }
}
