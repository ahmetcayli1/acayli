import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '../auth/[...nextauth]/route'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const entitlement = await prisma.entitlement.findFirst({
      where: {
        userId: session.user.id,
        type: 'FULL_RESULTS_UNLOCK',
        status: 'ACTIVE',
      },
    })

    return NextResponse.json({ hasEntitlement: !!entitlement, entitlement })
  } catch (error) {
    console.error('Entitlement GET error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
