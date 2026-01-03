import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { requireAdmin } from '@/lib/session'

export async function GET() {
  try {
    await requireAdmin()

    const matchRuns = await prisma.matchRun.findMany({
      orderBy: { createdAt: 'desc' },
      take: 100,
      include: {
        user: {
          select: {
            email: true,
          },
        },
        _count: {
          select: {
            results: true,
          },
        },
      },
    })

    return NextResponse.json({
      success: true,
      data: matchRuns,
    })
  } catch (error) {
    if (error instanceof Error && error.message === 'Forbidden') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }
    console.error('Match runs fetch error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch match runs' },
      { status: 500 }
    )
  }
}
