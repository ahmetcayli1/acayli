import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { requireAdmin } from '@/lib/session'

export async function GET() {
  try {
    await requireAdmin()

    const users = await prisma.user.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        profile: {
          select: {
            mode: true,
            selectedCountries: true,
          },
        },
        _count: {
          select: {
            matchRuns: true,
            purchases: true,
          },
        },
      },
    })

    return NextResponse.json({
      success: true,
      data: users,
    })
  } catch (error) {
    if (error instanceof Error && error.message === 'Forbidden') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }
    console.error('Users fetch error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch users' },
      { status: 500 }
    )
  }
}
