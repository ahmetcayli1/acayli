import { NextRequest, NextResponse } from 'next/server'
import { requireAdmin } from '@/lib/session'
import { getDatasetStats } from '@/lib/excel'

export async function GET() {
  try {
    await requireAdmin()
    
    const stats = await getDatasetStats()
    
    return NextResponse.json({
      success: true,
      data: stats,
    })
  } catch (error) {
    if (error instanceof Error && error.message === 'Forbidden') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }
    console.error('Dataset stats error:', error)
    return NextResponse.json(
      { error: 'Failed to get dataset stats' },
      { status: 500 }
    )
  }
}
