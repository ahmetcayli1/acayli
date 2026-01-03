import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { requireAdmin } from '@/lib/session'

export async function GET() {
  try {
    await requireAdmin()

    const [totalPrograms, totalUsers, totalMatchRuns, purchases] = await Promise.all([
      prisma.program.count(),
      prisma.user.count({ where: { role: 'USER' } }),
      prisma.matchRun.count(),
      prisma.purchase.findMany({
        where: { status: 'COMPLETED' },
        select: { amount: true },
      }),
    ])

    const totalPurchases = purchases.length
    const revenue = purchases.reduce((sum, p) => sum + p.amount, 0)

    return NextResponse.json({
      success: true,
      data: {
        totalPrograms,
        totalUsers,
        totalMatchRuns,
        totalPurchases,
        revenue,
      },
    })
  } catch (error) {
    if (error instanceof Error && error.message === 'Forbidden') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }
    console.error('Stats error:', error)
    return NextResponse.json(
      { error: 'Failed to get stats' },
      { status: 500 }
    )
  }
}
