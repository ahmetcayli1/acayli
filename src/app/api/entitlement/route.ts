import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { getCurrentUser } from '@/lib/session'
import { ENTITLEMENT_TYPES } from '@/lib/constants'

export async function GET() {
  try {
    const user = await getCurrentUser()
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const entitlement = await prisma.entitlement.findFirst({
      where: {
        userId: user.id,
        type: ENTITLEMENT_TYPES.FULL_RESULTS_UNLOCK,
        status: 'ACTIVE',
        OR: [
          { expiresAt: null },
          { expiresAt: { gt: new Date() } },
        ],
      },
    })

    return NextResponse.json({
      success: true,
      data: {
        hasFullAccess: !!entitlement,
        entitlement: entitlement ? {
          id: entitlement.id,
          type: entitlement.type,
          status: entitlement.status,
          createdAt: entitlement.createdAt,
          expiresAt: entitlement.expiresAt,
        } : null,
      },
    })
  } catch (error) {
    console.error('Entitlement check error:', error)
    return NextResponse.json(
      { error: 'Failed to check entitlement' },
      { status: 500 }
    )
  }
}
