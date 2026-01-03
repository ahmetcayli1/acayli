import { NextRequest, NextResponse } from 'next/server'
import { DegreeLevel } from '@prisma/client'
import { requireAdmin } from '@/lib/session'
import { previewDataset } from '@/lib/excel'

export async function GET(req: NextRequest) {
  try {
    await requireAdmin()

    const { searchParams } = new URL(req.url)
    const country = searchParams.get('country')
    const degreeLevel = searchParams.get('degreeLevel') as DegreeLevel | null
    const limit = parseInt(searchParams.get('limit') || '20')

    if (!country || !degreeLevel) {
      return NextResponse.json(
        { error: 'Country and degreeLevel are required' },
        { status: 400 }
      )
    }

    const programs = await previewDataset(country, degreeLevel, limit)

    return NextResponse.json({
      success: true,
      data: programs,
    })
  } catch (error) {
    if (error instanceof Error && error.message === 'Forbidden') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }
    console.error('Dataset preview error:', error)
    return NextResponse.json(
      { error: 'Failed to preview dataset' },
      { status: 500 }
    )
  }
}
