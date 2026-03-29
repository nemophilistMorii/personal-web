import { NextRequest, NextResponse } from 'next/server'
import { blogAPI } from '@/lib/feishu'

export async function GET() {
  try {
    const data = await blogAPI.list()
    return NextResponse.json({ success: true, data })
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to fetch blog' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const record = await blogAPI.create(body)
    return NextResponse.json({ success: true, data: record }, { status: 201 })
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to create blog' }, { status: 500 })
  }
}
