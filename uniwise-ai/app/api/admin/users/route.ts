import { NextRequest, NextResponse } from 'next/server'
import { checkAdminAuth } from '@/lib/adminAuth'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  const auth = await checkAdminAuth()
  if (!auth.authorized) return auth.response

  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        role: true,
        createdAt: true,
        _count: {
          select: {
            profiles: true,
            documents: true,
            matchRuns: true,
            purchases: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    })

    return NextResponse.json({ users })
  } catch (error) {
    console.error('Admin users GET error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
