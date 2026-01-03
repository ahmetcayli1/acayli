import { NextRequest, NextResponse } from 'next/server'
import { DegreeLevel } from '@prisma/client'
import { requireAdmin } from '@/lib/session'
import { deleteDataset } from '@/lib/excel'

export async function POST(req: NextRequest) {
  try {
    await requireAdmin()

    const body = await req.json()
    const { country, degreeLevel } = body as { country: string; degreeLevel: DegreeLevel }

    if (!country || !degreeLevel) {
      return NextResponse.json(
        { error: 'Country and degreeLevel are required' },
        { status: 400 }
      )
    }

    const deleted = await deleteDataset(country, degreeLevel)

    return NextResponse.json({
      success: true,
      data: { deleted },
      message: `Deleted ${deleted} programs`,
    })
  } catch (error) {
    if (error instanceof Error && error.message === 'Forbidden') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }
    console.error('Dataset delete error:', error)
    return NextResponse.json(
      { error: 'Failed to delete dataset' },
      { status: 500 }
    )
  }
}
