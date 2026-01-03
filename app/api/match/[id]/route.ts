import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '../../auth/[...nextauth]/route'
import { prisma } from '@/lib/prisma'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const matchRun = await prisma.matchRun.findUnique({
      where: { id: params.id },
      include: {
        results: {
          include: {
            program: true,
          },
          orderBy: {
            finalScore: 'desc',
          },
        },
      },
    })

    if (!matchRun || matchRun.userId !== session.user.id) {
      return NextResponse.json({ error: 'Match run not found' }, { status: 404 })
    }

    // Check if user has entitlement
    const entitlement = await prisma.entitlement.findFirst({
      where: {
        userId: session.user.id,
        type: 'FULL_RESULTS_UNLOCK',
        status: 'ACTIVE',
      },
    })

    // If no entitlement, limit results to 3
    if (!entitlement) {
      matchRun.results = matchRun.results.slice(0, 3)
    }

    return NextResponse.json({ matchRun, hasEntitlement: !!entitlement })
  } catch (error) {
    console.error('Match run GET error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
